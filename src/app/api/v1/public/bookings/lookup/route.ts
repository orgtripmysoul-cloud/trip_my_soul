import { NextRequest, NextResponse } from "next/server";
import "server-only";
import { supabaseAdmin } from "@/lib/server/supabase";
import { AppError, errorResponseBody, statusForError } from "@/lib/server/errors";
import type { BookingLookupResponse } from "@/lib/types/booking";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const bookingNo = request.nextUrl.searchParams.get("booking_no");
  const email = request.nextUrl.searchParams.get("email");

  if (!bookingNo || !email) {
    return NextResponse.json(errorResponseBody(new AppError("VALIDATION_FAILED", "booking_no and email are required.")), { status: 400 });
  }

  try {
    const db = supabaseAdmin();
    const { data: booking } = await db
      .from("bookings")
      .select(
        "id, booking_no, status, payment_state, pax, total_amount, paid_amount, currency, departure_id, customer_id"
      )
      .eq("booking_no", bookingNo)
      .single();

    if (!booking) throw new AppError("NOT_FOUND", "We couldn't find that booking.");

    const { data: customer } = await db.from("customers").select("email").eq("id", booking.customer_id).single();
    if (!customer || customer.email.toLowerCase() !== email.toLowerCase()) {
      // Deliberately the same error as "not found" — don't reveal a booking exists to the wrong email.
      throw new AppError("NOT_FOUND", "We couldn't find that booking.");
    }

    const { data: departure } = await db
      .from("departures")
      .select("trek_id, batch_label")
      .eq("id", booking.departure_id)
      .single();
    const { data: trek } = departure ? await db.from("treks").select("name").eq("id", departure.trek_id).single() : { data: null };

    const { data: hold } = await db
      .from("seat_holds")
      .select("expires_at, released_at")
      .eq("booking_id", booking.id)
      .maybeSingle();

    const { data: payment } = await db
      .from("payments")
      .select("status, gateway_payment_id")
      .eq("booking_id", booking.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    const responseBody: BookingLookupResponse = {
      bookingNo: booking.booking_no,
      status: booking.status,
      paymentState: booking.payment_state,
      pax: booking.pax,
      totalAmount: booking.total_amount,
      paidAmount: booking.paid_amount,
      currency: booking.currency,
      trekName: trek?.name ?? "",
      batchLabel: departure?.batch_label ?? "",
      holdExpiresAt: hold && !hold.released_at ? hold.expires_at : null,
      latestPaymentStatus: payment?.status ?? null,
      latestPaymentId: payment?.gateway_payment_id ?? null,
    };

    return NextResponse.json(responseBody, { status: 200 });
  } catch (err) {
    return NextResponse.json(errorResponseBody(err), { status: statusForError(err) });
  }
}
