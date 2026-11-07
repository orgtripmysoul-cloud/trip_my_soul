import { NextRequest, NextResponse } from "next/server";
import "server-only";
import { supabaseAdmin } from "@/lib/server/supabase";
import { requireStaff } from "@/lib/server/adminAuth";
import { hasPermission, requirePermission } from "@/lib/server/permissions";
import { logActivity } from "@/lib/server/activityLog";
import { AppError, errorResponseBody, statusForError, fromPostgresError } from "@/lib/server/errors";
import {
  ADMIN_SETTABLE_BOOKING_STATUSES,
  type AdminBookingDetailResponse,
  type AdminBookingNote,
  type AdminBookingTraveller,
  type AdminPaymentRecord,
  type AdminUpdateBookingRequest,
} from "@/lib/types/booking";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest, context: { params: Promise<{ bookingNo: string }> }) {
  try {
    const staff = await requireStaff(request);
    await requirePermission(staff, "bookings", "view");
    const { bookingNo } = await context.params;

    const db = supabaseAdmin();

    const { data: booking } = await db
      .from("bookings")
      .select(
        "id, booking_no, status, payment_state, pax, total_amount, paid_amount, currency, customer_id, departure_id, created_at, cancelled_at, cancellation_reason"
      )
      .eq("booking_no", bookingNo)
      .single();
    if (!booking) throw new AppError("NOT_FOUND", "We couldn't find that booking.");

    const { data: customer } = await db
      .from("customers")
      .select("full_name, email, phone")
      .eq("id", booking.customer_id)
      .single();

    const { data: departure } = await db
      .from("departures")
      .select("trek_id, batch_label, start_date, end_date")
      .eq("id", booking.departure_id)
      .single();
    const { data: trek } = departure
      ? await db.from("treks").select("name").eq("id", departure.trek_id).single()
      : { data: null };

    const { data: travellers } = await db
      .from("booking_travellers")
      .select("full_name, email, is_primary")
      .eq("booking_id", booking.id);

    const { data: payments } = await db
      .from("payments")
      .select(
        "id, kind, amount, currency, gateway, method, status, transaction_reference, notes, collected_by, verified_by, verified_at, captured_at, created_at"
      )
      .eq("booking_id", booking.id)
      .order("created_at", { ascending: true });

    const { data: noteRows } = await db
      .from("booking_notes")
      .select("id, body, staff_id, created_at")
      .eq("booking_id", booking.id)
      .order("created_at", { ascending: false });

    const staffIds = [
      ...new Set(
        [
          ...(payments ?? []).flatMap((p) => [p.collected_by, p.verified_by]),
          ...(noteRows ?? []).map((n) => n.staff_id),
        ].filter((id): id is string => !!id)
      ),
    ];
    const { data: staffRows } = staffIds.length
      ? await db.from("staff").select("id, full_name").in("id", staffIds)
      : { data: [] };
    const staffById = new Map((staffRows ?? []).map((s) => [s.id, s.full_name]));

    const paymentRecords: AdminPaymentRecord[] = (payments ?? []).map((p) => ({
      id: p.id,
      kind: p.kind,
      amount: p.amount,
      currency: p.currency,
      gateway: p.gateway,
      method: p.method,
      status: p.status,
      transactionReference: p.transaction_reference,
      notes: p.notes,
      collectedByName: p.collected_by ? staffById.get(p.collected_by) ?? null : null,
      verifiedByName: p.verified_by ? staffById.get(p.verified_by) ?? null : null,
      verifiedAt: p.verified_at,
      capturedAt: p.captured_at,
      createdAt: p.created_at,
    }));

    const travellerRecords: AdminBookingTraveller[] = (travellers ?? []).map((t) => ({
      fullName: t.full_name,
      email: t.email,
      isPrimary: t.is_primary,
    }));

    const notes: AdminBookingNote[] = (noteRows ?? []).map((n) => ({
      id: n.id,
      body: n.body,
      staffName: n.staff_id ? staffById.get(n.staff_id) ?? null : null,
      createdAt: n.created_at,
    }));

    const responseBody: AdminBookingDetailResponse = {
      bookingNo: booking.booking_no,
      status: booking.status,
      paymentState: booking.payment_state,
      pax: booking.pax,
      totalAmount: booking.total_amount,
      paidAmount: booking.paid_amount,
      currency: booking.currency,
      createdAt: booking.created_at,
      customer: {
        name: customer?.full_name ?? "",
        email: customer?.email ?? "",
        phone: customer?.phone ?? "",
      },
      trekName: trek?.name ?? "",
      batchLabel: departure?.batch_label ?? "",
      startDate: departure?.start_date ?? null,
      endDate: departure?.end_date ?? null,
      travellers: travellerRecords,
      payments: paymentRecords,
      customerId: booking.customer_id,
      cancelledAt: booking.cancelled_at,
      cancellationReason: booking.cancellation_reason,
      notes,
      canEdit: await hasPermission(staff, "bookings", "edit"),
    };

    return NextResponse.json(responseBody, { status: 200 });
  } catch (err) {
    return NextResponse.json(errorResponseBody(err), { status: statusForError(err) });
  }
}

/**
 * Booking operations: cancel (releases seats, no refund — refunds stay a
 * deliberate step in Razorpay / accounts) or mark completed / no-show.
 */
export async function PATCH(request: NextRequest, context: { params: Promise<{ bookingNo: string }> }) {
  try {
    const staff = await requireStaff(request);
    await requirePermission(staff, "bookings", "edit");
    const { bookingNo } = await context.params;

    let input: AdminUpdateBookingRequest;
    try {
      input = (await request.json()) as AdminUpdateBookingRequest;
    } catch {
      throw new AppError("VALIDATION_FAILED", "Invalid JSON body.");
    }

    const db = supabaseAdmin();
    const { data: booking } = await db
      .from("bookings")
      .select("id, status")
      .eq("booking_no", bookingNo)
      .maybeSingle();
    if (!booking) throw new AppError("NOT_FOUND", "We couldn't find that booking.");

    if (input.action === "cancel") {
      const reason = (input.reason ?? "").trim();
      if (reason.length < 3) throw new AppError("VALIDATION_FAILED", "Please give a reason for cancelling.");
      if (reason.length > 1000) throw new AppError("VALIDATION_FAILED", "The reason is too long.");

      const { error } = await db.rpc("admin_cancel_booking", {
        p_booking_id: booking.id,
        p_staff_id: staff.id,
        p_reason: reason,
      });
      if (error) throw fromPostgresError(error);

      await logActivity(staff, request, {
        action: "cancel",
        module: "bookings",
        entityType: "booking",
        entityId: bookingNo,
        oldValues: { status: booking.status },
        newValues: { status: "cancelled", reason },
      });
    } else if (input.action === "set_status") {
      if (!(ADMIN_SETTABLE_BOOKING_STATUSES as readonly string[]).includes(input.status)) {
        throw new AppError("VALIDATION_FAILED", "That status can't be set by hand.");
      }
      if (!["confirmed", "partially_paid"].includes(booking.status)) {
        throw new AppError("VALIDATION_FAILED", "Only confirmed or partially paid bookings can be marked this way.");
      }
      const { error } = await db.from("bookings").update({ status: input.status }).eq("id", booking.id);
      if (error) throw error;

      await logActivity(staff, request, {
        action: "update",
        module: "bookings",
        entityType: "booking",
        entityId: bookingNo,
        oldValues: { status: booking.status },
        newValues: { status: input.status },
      });
    } else {
      throw new AppError("VALIDATION_FAILED", "Unknown action.");
    }

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err) {
    return NextResponse.json(errorResponseBody(err), { status: statusForError(err) });
  }
}
