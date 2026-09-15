import { NextRequest, NextResponse } from "next/server";
import "server-only";
import { supabaseAdmin } from "@/lib/server/supabase";
import { createRazorpayOrder } from "@/lib/server/razorpay";
import { claimIdempotencyKey, completeIdempotencyKey, releaseIdempotencyKey } from "@/lib/server/idempotency";
import { AppError, errorResponseBody, statusForError } from "@/lib/server/errors";
import { toPaise } from "@/lib/money";
import { env } from "@/lib/server/env";
import type { PaymentIntentResponse } from "@/lib/types/booking";

export const dynamic = "force-dynamic";

const ENDPOINT = "POST /v1/public/bookings/:bookingNo/payment-intent";

/**
 * Regenerates (or reuses) the Razorpay order for a booking whose seat hold
 * is still valid — e.g. the customer dismissed the first Razorpay modal, or
 * order creation failed transiently right after the booking was created.
 * Never creates a second booking or a second seat hold.
 */
export async function POST(request: NextRequest, context: { params: Promise<{ bookingNo: string }> }) {
  const { bookingNo } = await context.params;
  const idempotencyKey = request.headers.get("Idempotency-Key");
  if (!idempotencyKey) {
    return NextResponse.json(errorResponseBody(new AppError("VALIDATION_FAILED", "Missing Idempotency-Key header.")), { status: 400 });
  }

  let claim;
  try {
    claim = await claimIdempotencyKey(ENDPOINT, idempotencyKey, bookingNo, { bookingNo });
  } catch (err) {
    return NextResponse.json(errorResponseBody(err), { status: statusForError(err) });
  }
  if (claim.kind === "replay") {
    return NextResponse.json(claim.response, { status: claim.statusCode });
  }

  try {
    const db = supabaseAdmin();

    const { data: booking } = await db.from("bookings").select("id, booking_no, total_amount").eq("booking_no", bookingNo).single();
    if (!booking) throw new AppError("NOT_FOUND", "We couldn't find that booking.");

    const { data: hold } = await db
      .from("seat_holds")
      .select("expires_at, released_at")
      .eq("booking_id", booking.id)
      .single();
    if (!hold || hold.released_at || new Date(hold.expires_at).getTime() < Date.now()) {
      throw new AppError("HOLD_EXPIRED", "Your seat reservation expired. Check availability again to continue.");
    }

    const { data: payment } = await db
      .from("payments")
      .select("id, status, gateway_order_id, amount")
      .eq("booking_id", booking.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();
    if (!payment) throw new AppError("NOT_FOUND", "We couldn't find a payment for that booking.");
    if (payment.status === "captured") {
      throw new AppError("VALIDATION_FAILED", "This booking has already been paid for.");
    }

    let orderId = payment.gateway_order_id as string | null;
    if (!orderId) {
      const order = await createRazorpayOrder({
        amountPaise: toPaise(payment.amount),
        receipt: booking.booking_no,
        notes: { booking_id: booking.id, kind: "full" },
      });
      await db.rpc("attach_gateway_order", { p_payment_id: payment.id, p_gateway_order_id: order.id });
      orderId = order.id;
    }

    const responseBody: PaymentIntentResponse = {
      bookingNo: booking.booking_no,
      holdExpiresAt: hold.expires_at,
      totalAmount: payment.amount,
      currency: "INR",
      razorpayOrderId: orderId,
      razorpayKeyId: env.publicRazorpayKeyId,
    };

    await completeIdempotencyKey(ENDPOINT, idempotencyKey, 200, responseBody);
    return NextResponse.json(responseBody, { status: 200 });
  } catch (err) {
    await releaseIdempotencyKey(ENDPOINT, idempotencyKey);
    return NextResponse.json(errorResponseBody(err), { status: statusForError(err) });
  }
}
