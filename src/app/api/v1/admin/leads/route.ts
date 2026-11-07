import { NextRequest, NextResponse, after } from "next/server";
import "server-only";
import { supabaseAdmin } from "@/lib/server/supabase";
import { requireStaff } from "@/lib/server/adminAuth";
import { requirePermission, canSeeAllLeads, maskPhone } from "@/lib/server/permissions";
import { logActivity } from "@/lib/server/activityLog";
import { dispatchPendingNotifications } from "@/lib/server/notifications";
import { channelFromLeadSource, istStartOfDay } from "@/lib/attribution";
import { AppError, errorResponseBody, statusForError } from "@/lib/server/errors";
import {
  LEAD_STATUSES,
  LEAD_SOURCES,
  type AdminLeadListItem,
  type AdminLeadListResponse,
  type LeadStatus,
  type CreateLeadRequest,
  type LeadSource,
} from "@/lib/types/crm";

export const dynamic = "force-dynamic";

const SELECT_COLUMNS =
  "lead_no, full_name, phone, email, trek_name, trek_slug, travel_date, travel_month, pax_adults, pax_children, status, source, form_type, owner_id, follow_up_at, created_at";

interface LeadRow {
  lead_no: string;
  full_name: string;
  phone: string;
  email: string | null;
  trek_name: string | null;
  trek_slug: string | null;
  travel_date: string | null;
  travel_month: string | null;
  pax_adults: number;
  pax_children: number;
  status: LeadStatus;
  source: AdminLeadListItem["source"];
  form_type: AdminLeadListItem["formType"];
  owner_id: string | null;
  follow_up_at: string | null;
  created_at: string;
}

export async function GET(request: NextRequest) {
  try {
    const staff = await requireStaff(request);
    await requirePermission(staff, "leads", "view");

    const params = request.nextUrl.searchParams;
    const limit = Math.min(200, Math.max(1, Number(params.get("limit")) || 50));
    const offset = Math.max(0, Number(params.get("offset")) || 0);
    const status = params.get("status")?.trim() || null;
    const source = params.get("source")?.trim() || null;
    const trekSlug = params.get("trekSlug")?.trim() || null;
    const ownerId = params.get("ownerId")?.trim() || null;
    const search = params.get("search")?.trim() || null;
    const due = params.get("due")?.trim() || null; // "today" | "overdue"

    const db = supabaseAdmin();

    /**
     * The filter set is built once as data and replayed against both the
     * paginated page query and the status-count query, so the two can never
     * drift apart (which would show counts for a different scope than the
     * rows beneath them).
     */
    type FilterOp =
      | { op: "eq" | "is" | "lt" | "lte" | "gte"; column: string; value: unknown }
      | { op: "or"; filter: string };

    const ops: FilterOp[] = [{ op: "is", column: "deleted_at", value: null }];

    // A salesperson only ever sees their own pipeline; applied server-side so
    // no client-supplied filter can widen it.
    if (!canSeeAllLeads(staff)) {
      ops.push({ op: "eq", column: "owner_id", value: staff.id });
    } else if (ownerId) {
      ops.push(
        ownerId === "unassigned"
          ? { op: "is", column: "owner_id", value: null }
          : { op: "eq", column: "owner_id", value: ownerId }
      );
    }

    if (status && (LEAD_STATUSES as readonly string[]).includes(status)) {
      ops.push({ op: "eq", column: "status", value: status });
    }
    if (source && (LEAD_SOURCES as readonly string[]).includes(source)) {
      ops.push({ op: "eq", column: "source", value: source });
    }
    if (trekSlug) ops.push({ op: "eq", column: "trek_slug", value: trekSlug });
    if (search) {
      // Strip PostgREST filter syntax so a search term cannot alter the query.
      const safe = search.replace(/[%,().*]/g, "");
      ops.push({
        op: "or",
        filter: `full_name.ilike.%${safe}%,phone.ilike.%${safe}%,lead_no.ilike.%${safe}%,email.ilike.%${safe}%`,
      });
    }
    if (due === "overdue") {
      ops.push({ op: "lt", column: "follow_up_at", value: new Date().toISOString() });
    }
    if (due === "today") {
      // "Today" in India time — the server clock is UTC.
      const start = istStartOfDay();
      const end = new Date(start.getTime() + 24 * 60 * 60 * 1000 - 1);
      ops.push({ op: "gte", column: "follow_up_at", value: start.toISOString() });
      ops.push({ op: "lte", column: "follow_up_at", value: end.toISOString() });
    }

    interface Filterable {
      eq(column: string, value: unknown): Filterable;
      is(column: string, value: unknown): Filterable;
      or(filter: string): Filterable;
      lt(column: string, value: unknown): Filterable;
      lte(column: string, value: unknown): Filterable;
      gte(column: string, value: unknown): Filterable;
    }

    // Q is a pass-through parameter, not a structural constraint: constraining
    // it to the Supabase builder type sends the compiler infinitely deep.
    const applyFilters = <Q>(query: Q): Q => {
      let q = query as unknown as Filterable;
      for (const entry of ops) {
        q = entry.op === "or" ? q.or(entry.filter) : q[entry.op](entry.column, entry.value);
      }
      return q as unknown as Q;
    };

    const { data, error, count } = await applyFilters(
      db.from("leads").select(SELECT_COLUMNS, { count: "exact" })
    )
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    const rows = (data ?? []) as LeadRow[];

    // Owner names in one round trip rather than a join per row.
    const ownerIds = [...new Set(rows.map((r) => r.owner_id).filter((id): id is string => Boolean(id)))];
    const { data: owners } = ownerIds.length
      ? await db.from("staff").select("id, full_name").in("id", ownerIds)
      : { data: [] };
    const ownerNameById = new Map((owners ?? []).map((o) => [o.id, o.full_name]));

    // Status counts for the Kanban column headers, over the same scope.
    const { data: countRows } = await applyFilters(db.from("leads").select("status"));
    const counts = Object.fromEntries(LEAD_STATUSES.map((s) => [s, 0])) as Record<LeadStatus, number>;
    for (const row of (countRows ?? []) as { status: LeadStatus }[]) {
      counts[row.status] = (counts[row.status] ?? 0) + 1;
    }

    const now = Date.now();
    const leads: AdminLeadListItem[] = rows.map((r) => ({
      leadNo: r.lead_no,
      name: r.full_name,
      phone: maskPhone(r.phone, staff),
      email: r.email,
      trekName: r.trek_name,
      trekSlug: r.trek_slug,
      travelDate: r.travel_date,
      travelMonth: r.travel_month,
      pax: r.pax_adults + r.pax_children,
      status: r.status,
      source: r.source,
      formType: r.form_type,
      ownerId: r.owner_id,
      ownerName: r.owner_id ? ownerNameById.get(r.owner_id) ?? null : null,
      followUpAt: r.follow_up_at,
      isOverdue: Boolean(r.follow_up_at) && new Date(r.follow_up_at as string).getTime() < now,
      createdAt: r.created_at,
    }));

    const responseBody: AdminLeadListResponse = { leads, total: count ?? leads.length, limit, offset, counts };
    return NextResponse.json(responseBody, { status: 200 });
  } catch (err) {
    return NextResponse.json(errorResponseBody(err), { status: statusForError(err) });
  }
}

/** Staff manually logging a lead that arrived by phone, WhatsApp or walk-in. */
export async function POST(request: NextRequest) {
  try {
    const staff = await requireStaff(request);
    await requirePermission(staff, "leads", "create");

    let rawBody: unknown;
    try {
      rawBody = await request.json();
    } catch {
      throw new AppError("VALIDATION_FAILED", "Invalid JSON body.");
    }

    const body = rawBody as Partial<CreateLeadRequest> & { source?: string };
    if (!body.name?.trim()) throw new AppError("VALIDATION_FAILED", "Please enter the customer's name.");
    if (!body.phone?.trim()) throw new AppError("VALIDATION_FAILED", "Please enter a mobile number.");

    const source = body.source && (LEAD_SOURCES as readonly string[]).includes(body.source) ? body.source : "phone_call";

    const { data, error } = await supabaseAdmin().rpc("create_lead", {
      p_full_name: body.name.trim(),
      p_phone: body.phone.trim(),
      p_email: body.email?.trim().toLowerCase() || null,
      p_form_type: "admin",
      p_source: source,
      p_trek_slug: body.trekSlug?.trim() || null,
      p_trek_name: body.trekName?.trim() || null,
      p_travel_date: body.travelDate || null,
      p_travel_month: body.travelMonth?.trim() || null,
      p_pax_adults: body.paxAdults ?? 1,
      p_pax_children: body.paxChildren ?? 0,
      p_message: body.message?.trim() || null,
      p_utm: {},
      p_landing_page: null,
      p_details: {},
      p_consent_marketing: false,
      p_consent_ip: null,
    });

    if (error) {
      console.error("[admin/leads] create_lead failed", error);
      throw new AppError("INTERNAL_ERROR", "Could not create the lead.");
    }

    const row = Array.isArray(data) ? data[0] : data;

    // A manually created lead belongs to whoever typed it in, not to the
    // round-robin — they already have the relationship.
    if (row?.lead_id && !row?.is_duplicate) {
      await supabaseAdmin()
        .from("leads")
        .update({
          owner_id: staff.id,
          assigned_at: new Date().toISOString(),
          channel: channelFromLeadSource(source as LeadSource),
        })
        .eq("id", row.lead_id);

      // create_lead() queued a "new lead assigned" email to whoever the
      // round-robin picked; the lead now belongs to the creator, so that
      // alert would be wrong. Cancel it before it is sent.
      await supabaseAdmin()
        .from("notification_outbox")
        .update({ status: "cancelled" })
        .eq("entity_id", row.lead_id)
        .eq("template_code", "lead.new_assigned")
        .eq("status", "pending");
    }

    after(async () => {
      try {
        await dispatchPendingNotifications(10);
      } catch (dispatchErr) {
        console.error("[admin/leads] dispatch failed", dispatchErr);
      }
    });

    await logActivity(staff, request, {
      action: "create",
      module: "leads",
      entityType: "lead",
      entityId: row?.lead_no,
      newValues: { name: body.name, phone: body.phone, source },
    });

    return NextResponse.json({ ok: true, leadNo: row?.lead_no ?? "", duplicate: Boolean(row?.is_duplicate) }, { status: 200 });
  } catch (err) {
    return NextResponse.json(errorResponseBody(err), { status: statusForError(err) });
  }
}
