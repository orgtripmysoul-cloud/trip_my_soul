import { NextRequest, NextResponse } from "next/server";
import "server-only";
import { supabaseAdmin } from "@/lib/server/supabase";
import { requireStaff } from "@/lib/server/adminAuth";
import { requirePermission, hasPermission, canSeeAllLeads, maskPhone } from "@/lib/server/permissions";
import { logActivity, diffValues } from "@/lib/server/activityLog";
import { AppError, errorResponseBody, statusForError } from "@/lib/server/errors";
import type {
  AdminCustomerBooking,
  AdminCustomerDetailResponse,
  AdminCustomerLead,
  AdminCustomerPayment,
  AdminUpdateCustomerRequest,
} from "@/lib/types/customer";

export const dynamic = "force-dynamic";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Double-quoted PostgREST filter value, safe for emails / "+91…" phones. */
function quoted(value: string): string {
  return `"${value.replace(/["\\]/g, "")}"`;
}

function phoneVariants(phone: string): string[] {
  const digits = phone.replace(/[^\d]/g, "");
  const local = digits.length >= 10 ? digits.slice(-10) : digits;
  return [...new Set([phone, `+91${local}`, local].filter(Boolean))];
}

async function loadCustomer(customerId: string) {
  if (!UUID_RE.test(customerId)) throw new AppError("NOT_FOUND", "We couldn't find that customer.");
  const { data } = await supabaseAdmin()
    .from("customers")
    .select("id, full_name, email, phone, created_at")
    .eq("id", customerId)
    .maybeSingle();
  if (!data) throw new AppError("NOT_FOUND", "We couldn't find that customer.");
  return data;
}

export async function GET(request: NextRequest, context: { params: Promise<{ customerId: string }> }) {
  try {
    const staff = await requireStaff(request);
    await requirePermission(staff, "customers", "view");
    const { customerId } = await context.params;
    const customer = await loadCustomer(customerId);
    const db = supabaseAdmin();

    // Bookings
    const { data: bookingRows } = await db
      .from("bookings")
      .select("id, booking_no, status, payment_state, pax, total_amount, paid_amount, departure_id, created_at")
      .eq("customer_id", customer.id)
      .neq("status", "draft")
      .order("created_at", { ascending: false });
    const bookingsRaw = bookingRows ?? [];

    const departureIds = [...new Set(bookingsRaw.map((b) => b.departure_id))];
    const { data: departures } = departureIds.length
      ? await db.from("departures").select("id, trek_id, batch_label, start_date").in("id", departureIds)
      : { data: [] };
    const depById = new Map((departures ?? []).map((d) => [d.id, d]));
    const trekIds = [...new Set((departures ?? []).map((d) => d.trek_id))];
    const { data: treks } = trekIds.length ? await db.from("treks").select("id, name").in("id", trekIds) : { data: [] };
    const trekById = new Map((treks ?? []).map((t) => [t.id, t.name as string]));

    const bookings: AdminCustomerBooking[] = bookingsRaw.map((b) => {
      const dep = depById.get(b.departure_id);
      return {
        bookingNo: b.booking_no,
        status: b.status,
        paymentState: b.payment_state,
        trekName: dep ? trekById.get(dep.trek_id) ?? "" : "",
        batchLabel: dep?.batch_label ?? "",
        startDate: dep?.start_date ?? null,
        pax: b.pax,
        totalAmount: Number(b.total_amount),
        paidAmount: Number(b.paid_amount),
        createdAt: b.created_at,
      };
    });

    // Payments across all bookings
    const bookingNoById = new Map(bookingsRaw.map((b) => [b.id, b.booking_no as string]));
    const { data: paymentRows } = bookingsRaw.length
      ? await db
          .from("payments")
          .select("id, booking_id, amount, method, gateway, status, captured_at, created_at")
          .in("booking_id", bookingsRaw.map((b) => b.id))
          .neq("status", "created")
          .order("created_at", { ascending: false })
      : { data: [] };
    const payments: AdminCustomerPayment[] = (paymentRows ?? []).map((p) => ({
      id: p.id,
      bookingNo: bookingNoById.get(p.booking_id) ?? "",
      amount: Number(p.amount),
      method: p.method,
      gateway: p.gateway,
      status: p.status,
      capturedAt: p.captured_at,
      createdAt: p.created_at,
    }));

    // Leads: linked by customer_id, or matching phone / email.
    const orParts = [`customer_id.eq.${customer.id}`, `email.eq.${quoted(customer.email)}`];
    for (const v of phoneVariants(customer.phone)) orParts.push(`phone.eq.${quoted(v)}`);
    let leadQuery = db
      .from("leads")
      .select("lead_no, status, form_type, trek_name, created_at")
      .is("deleted_at", null)
      .or(orParts.join(","))
      .order("created_at", { ascending: false })
      .limit(50);
    if (!canSeeAllLeads(staff)) leadQuery = leadQuery.eq("owner_id", staff.id);
    const { data: leadRows } = await leadQuery;
    const leads: AdminCustomerLead[] = (leadRows ?? []).map((l) => ({
      leadNo: l.lead_no,
      status: l.status,
      formType: l.form_type,
      trekName: l.trek_name,
      createdAt: l.created_at,
    }));

    const active = bookings.filter((b) => b.status !== "cancelled");
    const totalBilled = active.reduce((sum, b) => sum + b.totalAmount, 0);
    const totalPaid = bookings.reduce((sum, b) => sum + b.paidAmount, 0);

    const body: AdminCustomerDetailResponse = {
      customer: {
        id: customer.id,
        name: customer.full_name,
        email: customer.email,
        phone: maskPhone(customer.phone, staff),
        createdAt: customer.created_at,
      },
      stats: {
        bookingsCount: bookings.length,
        totalBilled,
        totalPaid,
        outstanding: Math.max(
          active.reduce((sum, b) => sum + Math.max(b.totalAmount - b.paidAmount, 0), 0),
          0
        ),
      },
      bookings,
      payments,
      leads,
      canEdit: await hasPermission(staff, "customers", "edit"),
    };
    return NextResponse.json(body, { status: 200 });
  } catch (err) {
    return NextResponse.json(errorResponseBody(err), { status: statusForError(err) });
  }
}

/** Correct a customer's contact details (typo in name, new phone, etc.). */
export async function PATCH(request: NextRequest, context: { params: Promise<{ customerId: string }> }) {
  try {
    const staff = await requireStaff(request);
    await requirePermission(staff, "customers", "edit");
    const { customerId } = await context.params;
    const customer = await loadCustomer(customerId);

    let input: AdminUpdateCustomerRequest;
    try {
      input = (await request.json()) as AdminUpdateCustomerRequest;
    } catch {
      throw new AppError("VALIDATION_FAILED", "Invalid JSON body.");
    }

    const update: Record<string, string> = {};
    if (input.name !== undefined) {
      const name = input.name.trim();
      if (!name || name.length > 200) throw new AppError("VALIDATION_FAILED", "Please enter a valid name.");
      update.full_name = name;
    }
    if (input.email !== undefined) {
      const email = input.email.trim().toLowerCase();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new AppError("VALIDATION_FAILED", "Please enter a valid email address.");
      update.email = email;
    }
    if (input.phone !== undefined) {
      const phone = input.phone.trim();
      const digits = phone.replace(/[^\d]/g, "");
      if (digits.length < 10 || digits.length > 15) throw new AppError("VALIDATION_FAILED", "Please enter a valid phone number.");
      update.phone = phone;
    }
    if (Object.keys(update).length === 0) throw new AppError("VALIDATION_FAILED", "Nothing to update.");

    const { error } = await supabaseAdmin().from("customers").update(update).eq("id", customer.id);
    if (error) {
      if (error.code === "23505") {
        throw new AppError("VALIDATION_FAILED", "Another customer already uses this email address.");
      }
      throw error;
    }

    const before = { full_name: customer.full_name, email: customer.email, phone: customer.phone };
    await logActivity(staff, request, {
      action: "update",
      module: "customers",
      entityType: "customer",
      entityId: customer.id,
      ...diffValues(before, { ...before, ...update }),
    });

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err) {
    return NextResponse.json(errorResponseBody(err), { status: statusForError(err) });
  }
}
