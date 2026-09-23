import { NextRequest, NextResponse } from "next/server";
import "server-only";
import { supabaseAdmin } from "@/lib/server/supabase";
import { requireStaff } from "@/lib/server/adminAuth";
import { AppError, errorResponseBody, statusForError } from "@/lib/server/errors";
import type { AdminBookingDetailResponse, AdminBookingTraveller, AdminPaymentRecord } from "@/lib/types/booking";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest, context: { params: Promise<{ bookingNo: string }> }) {
  try {
    await requireStaff(request);
    const { bookingNo } = await context.params;

    const db = supabaseAdmin();

    const { data: booking } = await db
      .from("bookings")
      .select("id, booking_no, status, payment_state, pax, total_amount, paid_amount, currency, customer_id, departure_id, created_at")
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

    const staffIds = [
      ...new Set((payments ?? []).flatMap((p) => [p.collected_by, p.verified_by]).filter((id): id is string => !!id)),
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
    };

    return NextResponse.json(responseBody, { status: 200 });
  } catch (err) {
    return NextResponse.json(errorResponseBody(err), { status: statusForError(err) });
  }
}
