import { NextRequest, NextResponse } from "next/server";
import "server-only";
import { supabaseAdmin } from "@/lib/server/supabase";
import { computeCustomPricing, resolveCustomPaymentDepartureId } from "@/lib/server/customPayments";
import { createRazorpayOrder } from "@/lib/server/razorpay";
import { claimIdempotencyKey, completeIdempotencyKey, releaseIdempotencyKey } from "@/lib/server/idempotency";
import { checkRateLimit, recordRateLimitHit } from "@/lib/server/rateLimit";
import { getClientIp } from "@/lib/server/requestIp";
import { AppError, errorResponseBody, statusForError, fromPostgresError } from "@/lib/server/errors";
import { toPaise } from "@/lib/money";
import { env } from "@/lib/server/env";
import type { CreateCustomPaymentResponse } from "@/lib/types/booking";

export const dynamic = "force-dynamic";

const ENDPOINT = "POST /v1/public/quotes/:token/pay";
const RATE_LIMIT = 8;
const RATE_LIMIT_WINDOW_MINUTES = 15;

interface QuoteRow {
  id: string;
  status: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  trip_label: string;
  pax: number;
  amount: number;
  purpose: string;
  notes: string | null;
  expiry_date: string;
  booking_id: string | null;
}

/**
 * Creates (once) or reuses the Razorpay order for a locked admin-generated
 * quote. Reuse mirrors POST /v1/public/bookings/:bookingNo/payment-intent —
 * a quote is only ever attached to one booking, ever, so a second call
 * (e.g. the customer dismissed the Razorpay modal) must never create a
 * second booking.
 */
export async function POST(request: NextRequest, context: { params: Promise<{ token: string }> }) {
  const { token } = await context.params;
  const idempotencyKey = request.headers.get("Idempotency-Key");
  if (!idempotencyKey) {
    return NextResponse.json(errorResponseBody(new AppError("VALIDATION_FAILED", "Missing Idempotency-Key header.")), { status: 400 });
  }

  try {
    const ip = getClientIp(request);
    const rateLimit = await checkRateLimit(ENDPOINT, `ip:${ip}`, RATE_LIMIT, RATE_LIMIT_WINDOW_MINUTES);
    if (!rateLimit.allowed) {
      return NextResponse.json(errorResponseBody(new AppError("RATE_LIMITED", "Too many requests. Please try again shortly.")), {
        status: 429,
        headers: { "Retry-After": String(rateLimit.retryAfterSeconds ?? 60) },
      });
    }

    let claim;
    try {
      claim = await claimIdempotencyKey(ENDPOINT, idempotencyKey, token, { token });
    } catch (err) {
      return NextResponse.json(errorResponseBody(err), { status: statusForError(err) });
    }
    if (claim.kind === "replay") {
      return NextResponse.json(claim.response, { status: claim.statusCode });
    }
    await recordRateLimitHit(ENDPOINT, `ip:${ip}`);

    const db = supabaseAdmin();
    const { data: quote } = await db
      .from("custom_quotes")
      .select("id, status, customer_name, customer_email, customer_phone, trip_label, pax, amount, purpose, notes, expiry_date, booking_id")
      .eq("token", token)
      .maybeSingle<QuoteRow>();
    if (!quote) throw new AppError("NOT_FOUND", "This payment link is invalid.");

    if (quote.status === "paid") throw new AppError("VALIDATION_FAILED", "This payment link has already been paid.");
    if (quote.status === "cancelled") throw new AppError("VALIDATION_FAILED", "This payment link has been cancelled.");
    const isExpired = new Date(quote.expiry_date) < new Date(new Date().toDateString());
    if (quote.status === "expired" || isExpired) {
      if (isExpired && quote.status !== "expired") {
        await db.from("custom_quotes").update({ status: "expired" }).eq("id", quote.id);
      }
      throw new AppError("VALIDATION_FAILED", "This payment link has expired. Please request a new one.");
    }

    let responseBody: CreateCustomPaymentResponse;

    if (quote.booking_id) {
      // Reuse the existing booking's hold + order, exactly like the generic payment-intent route.
      const { data: booking } = await db.from("bookings").select("id, booking_no").eq("id", quote.booking_id).single();
      if (!booking) throw new AppError("NOT_FOUND", "We couldn't find that booking.");

      const { data: hold } = await db.from("seat_holds").select("expires_at, released_at").eq("booking_id", booking.id).single();
      if (!hold || hold.released_at || new Date(hold.expires_at).getTime() < Date.now()) {
        throw new AppError("HOLD_EXPIRED", "Your payment session expired. Please refresh and try again.");
      }

      const { data: payment } = await db
        .from("payments")
        .select("id, status, gateway_order_id, amount")
        .eq("booking_id", booking.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();
      if (!payment) throw new AppError("NOT_FOUND", "We couldn't find a payment for that booking.");
      if (payment.status === "captured") throw new AppError("VALIDATION_FAILED", "This payment link has already been paid.");

      let orderId = payment.gateway_order_id as string | null;
      if (!orderId) {
        const order = await createRazorpayOrder({
          amountPaise: toPaise(payment.amount),
          receipt: booking.booking_no,
          notes: { booking_id: booking.id, kind: "custom", quote_token: token },
        });
        await db.rpc("attach_gateway_order", { p_payment_id: payment.id, p_gateway_order_id: order.id });
        orderId = order.id;
      }

      responseBody = {
        bookingNo: booking.booking_no,
        holdExpiresAt: hold.expires_at,
        totalAmount: payment.amount,
        payingNowAmount: payment.amount,
        currency: "INR",
        razorpayOrderId: orderId,
        razorpayKeyId: env.publicRazorpayKeyId,
      };
    } else {
      const pricing = computeCustomPricing(quote.amount);
      const departureId = await resolveCustomPaymentDepartureId();

      const { data: created, error: createError } = await db.rpc("create_booking_with_hold", {
        p_departure_id: departureId,
        p_pax: quote.pax,
        p_customer_name: quote.customer_name,
        p_customer_email: quote.customer_email.toLowerCase(),
        p_customer_phone: quote.customer_phone,
        p_travellers: [{ full_name: quote.customer_name, email: quote.customer_email, is_primary: true, addons: [] }],
        p_addons: [],
        p_gross_amount: pricing.baseAmount,
        p_discount_amount: 0,
        p_tax_amount: pricing.taxAmount,
        p_total_amount: pricing.totalAmount,
        p_coupon_code: null,
        p_hold_minutes: 15,
        p_initial_payment_amount: pricing.totalAmount,
        p_booking_type: "custom",
        p_custom_trip_label: quote.trip_label,
        p_custom_purpose: quote.purpose,
        p_custom_notes: quote.notes,
      });
      if (createError) throw fromPostgresError(createError);

      const booking = created.booking as { id: string; booking_no: string };
      const hold = created.hold as { expires_at: string };
      const payment = created.payment as { id: string; amount: number };

      await db.from("custom_quotes").update({ booking_id: booking.id }).eq("id", quote.id);

      const order = await createRazorpayOrder({
        amountPaise: toPaise(payment.amount),
        receipt: booking.booking_no,
        notes: { booking_id: booking.id, departure_id: departureId, kind: "custom", quote_token: token },
      });
      await db.rpc("attach_gateway_order", { p_payment_id: payment.id, p_gateway_order_id: order.id });

      responseBody = {
        bookingNo: booking.booking_no,
        holdExpiresAt: hold.expires_at,
        totalAmount: pricing.totalAmount,
        payingNowAmount: payment.amount,
        currency: "INR",
        razorpayOrderId: order.id,
        razorpayKeyId: env.publicRazorpayKeyId,
      };
    }

    await completeIdempotencyKey(ENDPOINT, idempotencyKey, 200, responseBody);
    return NextResponse.json(responseBody, { status: 200 });
  } catch (err) {
    await releaseIdempotencyKey(ENDPOINT, idempotencyKey);
    return NextResponse.json(errorResponseBody(err), { status: statusForError(err) });
  }
}
