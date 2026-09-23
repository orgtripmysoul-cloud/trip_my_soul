import { NextRequest, NextResponse } from "next/server";
import "server-only";
import { supabaseAdmin } from "@/lib/server/supabase";
import { createRazorpayOrder } from "@/lib/server/razorpay";
import { claimIdempotencyKey, completeIdempotencyKey, releaseIdempotencyKey } from "@/lib/server/idempotency";
import { AppError, errorResponseBody, statusForError, fromPostgresError } from "@/lib/server/errors";
import { isValidInrAmount, toPaise } from "@/lib/money";
import { env } from "@/lib/server/env";
import type { AdditionalPaymentRequest, AdditionalPaymentResponse } from "@/lib/types/booking";

export const dynamic = "force-dynamic";

const ENDPOINT = "POST /v1/public/bookings/:bookingNo/additional-payment";

/**
 * Customer-initiated second-or-later online (Razorpay) payment against an
 * existing booking, e.g. paying off the remaining balance of an advance.
 * Same guest-auth pattern as /bookings/lookup — never leaks booking
 * existence to the wrong email.
 */
export async function POST(request: NextRequest, context: { params: Promise<{ bookingNo: string }> }) {
  const { bookingNo } = await context.params;
  const idempotencyKey = request.headers.get("Idempotency-Key");
  if (!idempotencyKey) {
    return NextResponse.json(errorResponseBody(new AppError("VALIDATION_FAILED", "Missing Idempotency-Key header.")), { status: 400 });
  }

  let rawBody: unknown;
  try {
    rawBody = await request.json();
  } catch {
    return NextResponse.json(errorResponseBody(new AppError("VALIDATION_FAILED", "Invalid JSON body.")), { status: 400 });
  }

  let claim;
  try {
    claim = await claimIdempotencyKey(ENDPOINT, idempotencyKey, bookingNo, rawBody);
  } catch (err) {
    return NextResponse.json(errorResponseBody(err), { status: statusForError(err) });
  }
  if (claim.kind === "replay") {
    return NextResponse.json(claim.response, { status: claim.statusCode });
  }

  try {
    const body = rawBody as Partial<AdditionalPaymentRequest>;
    if (!body.email || typeof body.email !== "string") {
      throw new AppError("VALIDATION_FAILED", "Email is required.");
    }
    if (typeof body.amount !== "number" || !isValidInrAmount(body.amount)) {
      throw new AppError("VALIDATION_FAILED", "Please enter a valid amount.");
    }

    const db = supabaseAdmin();

    const { data: booking } = await db
      .from("bookings")
      .select("id, booking_no, customer_id")
      .eq("booking_no", bookingNo)
      .single();
    if (!booking) throw new AppError("NOT_FOUND", "We couldn't find that booking.");

    const { data: customer } = await db.from("customers").select("email").eq("id", booking.customer_id).single();
    if (!customer || customer.email.toLowerCase() !== body.email.toLowerCase()) {
      // Deliberately the same error as "not found" — don't reveal a booking exists to the wrong email.
      throw new AppError("NOT_FOUND", "We couldn't find that booking.");
    }

    const { data: created, error: rpcError } = await db.rpc("create_additional_payment", {
      p_booking_id: booking.id,
      p_amount: body.amount,
      p_kind: "installment",
    });
    if (rpcError) throw fromPostgresError(rpcError);

    const payment = created as { id: string; amount: number };

    const order = await createRazorpayOrder({
      amountPaise: toPaise(body.amount),
      receipt: booking.booking_no,
      notes: { booking_id: booking.id, kind: "installment" },
    });

    await db.rpc("attach_gateway_order", { p_payment_id: payment.id, p_gateway_order_id: order.id });

    const { data: refreshedBooking } = await db
      .from("bookings")
      .select("total_amount, paid_amount")
      .eq("id", booking.id)
      .single();

    const amountDue = refreshedBooking
      ? Math.max(refreshedBooking.total_amount - refreshedBooking.paid_amount - body.amount, 0)
      : 0;

    const responseBody: AdditionalPaymentResponse = {
      bookingNo: booking.booking_no,
      amount: body.amount,
      currency: "INR",
      razorpayOrderId: order.id,
      razorpayKeyId: env.publicRazorpayKeyId,
      amountDue,
    };

    await completeIdempotencyKey(ENDPOINT, idempotencyKey, 200, responseBody);
    return NextResponse.json(responseBody, { status: 200 });
  } catch (err) {
    await releaseIdempotencyKey(ENDPOINT, idempotencyKey);
    return NextResponse.json(errorResponseBody(err), { status: statusForError(err) });
  }
}
