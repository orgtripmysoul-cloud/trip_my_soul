import { NextRequest, NextResponse } from "next/server";
import "server-only";
import { supabaseAdmin } from "@/lib/server/supabase";
import { requireStaff } from "@/lib/server/adminAuth";
import { requirePermission, canSeeAllLeads, canAssignLeads, maskPhone } from "@/lib/server/permissions";
import { logActivity } from "@/lib/server/activityLog";
import { AppError, errorResponseBody, statusForError } from "@/lib/server/errors";
import {
  LEAD_STATUSES,
  LEAD_LOST_REASONS,
  OPEN_LEAD_STATUSES,
  type AdminLeadDetail,
  type AdminLeadDetailResponse,
  type AdminLeadActivity,
  type LeadStatus,
  type UpdateLeadRequest,
} from "@/lib/types/crm";

export const dynamic = "force-dynamic";

async function loadLead(leadNo: string) {
  const { data, error } = await supabaseAdmin()
    .from("leads")
    .select("*")
    .eq("lead_no", leadNo)
    .is("deleted_at", null)
    .maybeSingle();

  if (error) throw error;
  if (!data) throw new AppError("NOT_FOUND", "We could not find that lead.");
  return data;
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ leadNo: string }> }) {
  try {
    const staff = await requireStaff(request);
    await requirePermission(staff, "leads", "view");

    const { leadNo } = await params;
    const lead = await loadLead(leadNo);

    if (!canSeeAllLeads(staff) && lead.owner_id !== staff.id) {
      throw new AppError("FORBIDDEN", "This lead belongs to another salesperson.");
    }

    const db = supabaseAdmin();
    const [{ data: activities }, { data: owner }] = await Promise.all([
      db
        .from("lead_activities")
        .select("id, type, body, outcome, duration_seconds, old_value, new_value, staff_id, created_at")
        .eq("lead_id", lead.id)
        .order("created_at", { ascending: false }),
      lead.owner_id
        ? db.from("staff").select("full_name").eq("id", lead.owner_id).maybeSingle()
        : Promise.resolve({ data: null }),
    ]);

    const staffIds = [...new Set((activities ?? []).map((a) => a.staff_id).filter((id): id is string => Boolean(id)))];
    const { data: actors } = staffIds.length
      ? await db.from("staff").select("id, full_name").in("id", staffIds)
      : { data: [] };
    const actorNameById = new Map((actors ?? []).map((s) => [s.id, s.full_name]));

    const timeline: AdminLeadActivity[] = (activities ?? []).map((a) => ({
      id: a.id,
      type: a.type,
      body: a.body,
      outcome: a.outcome,
      durationSeconds: a.duration_seconds,
      oldValue: a.old_value,
      newValue: a.new_value,
      staffName: a.staff_id ? actorNameById.get(a.staff_id) ?? null : null,
      createdAt: a.created_at,
    }));

    const detail: AdminLeadDetail = {
      leadNo: lead.lead_no,
      name: lead.full_name,
      phone: maskPhone(lead.phone, staff),
      email: lead.email,
      trekName: lead.trek_name,
      trekSlug: lead.trek_slug,
      travelDate: lead.travel_date,
      travelMonth: lead.travel_month,
      pax: lead.pax_adults + lead.pax_children,
      status: lead.status,
      source: lead.source,
      formType: lead.form_type,
      ownerId: lead.owner_id,
      ownerName: owner?.full_name ?? null,
      followUpAt: lead.follow_up_at,
      isOverdue: Boolean(lead.follow_up_at) && new Date(lead.follow_up_at).getTime() < Date.now(),
      createdAt: lead.created_at,
      message: lead.message,
      landingPage: lead.landing_page,
      utm: lead.utm ?? {},
      details: lead.details ?? {},
      lostReason: lead.lost_reason,
      lostNote: lead.lost_note,
      consentMarketing: lead.consent_marketing,
      firstContactedAt: lead.first_contacted_at,
      activities: timeline,
    };

    const responseBody: AdminLeadDetailResponse = { lead: detail };
    return NextResponse.json(responseBody, { status: 200 });
  } catch (err) {
    return NextResponse.json(errorResponseBody(err), { status: statusForError(err) });
  }
}

/** Status changes, reassignment and follow-up scheduling — each one audited. */
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ leadNo: string }> }) {
  try {
    const staff = await requireStaff(request);
    await requirePermission(staff, "leads", "edit");

    const { leadNo } = await params;

    let rawBody: unknown;
    try {
      rawBody = await request.json();
    } catch {
      throw new AppError("VALIDATION_FAILED", "Invalid JSON body.");
    }
    const body = rawBody as UpdateLeadRequest;

    const lead = await loadLead(leadNo);
    if (!canSeeAllLeads(staff) && lead.owner_id !== staff.id) {
      throw new AppError("FORBIDDEN", "This lead belongs to another salesperson.");
    }

    const db = supabaseAdmin();
    const update: Record<string, unknown> = {};
    const activities: { type: string; body?: string; old_value?: string | null; new_value?: string | null }[] = [];
    const nowIso = new Date().toISOString();

    // --- Status -------------------------------------------------------------
    if (body.status !== undefined && body.status !== lead.status) {
      if (!(LEAD_STATUSES as readonly string[]).includes(body.status)) {
        throw new AppError("VALIDATION_FAILED", "Unknown lead status.");
      }

      const nextStatus = body.status as LeadStatus;
      const nextFollowUp = body.followUpAt !== undefined ? body.followUpAt : lead.follow_up_at;

      // The two pipeline rules, enforced here with a readable message before
      // the database check constraint would reject it with a raw error.
      if (OPEN_LEAD_STATUSES.includes(nextStatus) && !nextFollowUp) {
        throw new AppError("VALIDATION_FAILED", "Set a follow-up date before moving the lead to this status.");
      }
      if (nextStatus === "lost" && !body.lostReason && !lead.lost_reason) {
        throw new AppError("VALIDATION_FAILED", "Please choose why this lead was lost.");
      }

      update.status = nextStatus;
      activities.push({ type: "status_change", old_value: lead.status, new_value: nextStatus });

      // First move out of 'new' is the moment of first contact — the number
      // the response-time report is built on.
      if (lead.status === "new" && !lead.first_contacted_at) {
        update.first_contacted_at = nowIso;
      }
      // Closed states have no next action; clear any stale follow-up so they
      // stop appearing on the "due" list.
      if (["converted", "lost", "junk"].includes(nextStatus)) {
        update.follow_up_at = null;
      }
    }

    // --- Lost reason --------------------------------------------------------
    if (body.lostReason !== undefined) {
      if (!(LEAD_LOST_REASONS as readonly string[]).includes(body.lostReason)) {
        throw new AppError("VALIDATION_FAILED", "Unknown lost reason.");
      }
      update.lost_reason = body.lostReason;
      if (body.lostNote !== undefined) update.lost_note = body.lostNote.trim() || null;
    }

    // --- Owner --------------------------------------------------------------
    if (body.ownerId !== undefined && body.ownerId !== lead.owner_id) {
      if (!canAssignLeads(staff)) {
        throw new AppError("FORBIDDEN", "Only a sales manager can reassign leads.");
      }
      if (body.ownerId) {
        const { data: target } = await db.from("staff").select("id, full_name, active").eq("id", body.ownerId).maybeSingle();
        if (!target || !target.active) throw new AppError("VALIDATION_FAILED", "That staff member cannot take leads.");
      }
      update.owner_id = body.ownerId;
      update.assigned_at = body.ownerId ? nowIso : null;
      activities.push({
        type: "transfer",
        body: body.transferReason?.trim() || "Lead reassigned",
        old_value: lead.owner_id,
        new_value: body.ownerId,
      });
    }

    // --- Follow-up ----------------------------------------------------------
    if (body.followUpAt !== undefined && update.follow_up_at === undefined) {
      if (body.followUpAt && Number.isNaN(new Date(body.followUpAt).getTime())) {
        throw new AppError("VALIDATION_FAILED", "Please enter a valid follow-up date.");
      }
      update.follow_up_at = body.followUpAt;
      activities.push({ type: "follow_up_set", old_value: lead.follow_up_at, new_value: body.followUpAt });
    }

    if (Object.keys(update).length === 0) {
      return NextResponse.json({ ok: true, unchanged: true }, { status: 200 });
    }

    const { error: updateError } = await db.from("leads").update(update).eq("id", lead.id);
    if (updateError) {
      console.error("[admin/leads] update failed", updateError);
      throw new AppError("INTERNAL_ERROR", "Could not update the lead.");
    }

    if (activities.length) {
      await db.from("lead_activities").insert(
        activities.map((a) => ({
          lead_id: lead.id,
          type: a.type,
          body: a.body ?? null,
          old_value: a.old_value ?? null,
          new_value: a.new_value ?? null,
          staff_id: staff.id,
        }))
      );
    }

    await logActivity(staff, request, {
      action: "update",
      module: "leads",
      entityType: "lead",
      entityId: leadNo,
      oldValues: Object.fromEntries(Object.keys(update).map((k) => [k, lead[k] ?? null])),
      newValues: update,
    });

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err) {
    return NextResponse.json(errorResponseBody(err), { status: statusForError(err) });
  }
}
