import { NextRequest, NextResponse } from "next/server";
import "server-only";
import { supabaseAdmin } from "@/lib/server/supabase";
import { computeCustomPricing, isValidCustomAmount, MIN_CUSTOM_PAYMENT_AMOUNT, resolveCustomPaymentDepartureId } from "@/lib/server/customPayments";
import { createRazorpayOrder } from "@/lib/server/razorpay";
import { claimIdempotencyKey, completeIdempotencyKey, releaseIdempotencyKey } from "@/lib/server/idempotency";
import { checkRateLimit, recordRateLimitHit } from "@/lib/server/rateLimit";
import { getClientIp } from "@/lib/server/requestIp";
import { AppError, errorResponseBody, statusForError, fromPostgresError } from "@/lib/server/errors";
import { isValidPax, toPaise } from "@/lib/money";
import { env } from "@/lib/server/env";
import type { CreateCustomPaymentRequest, CreateCustomPaymentResponse } from "@/lib/types/booking";

export const dynamic = "force-dynamic";

const ENDPOINT = "POST /v1/public/pay";
const RATE_LIMIT = 5;
const RATE_LIMIT_WINDOW_MINUTES = 15;

function isEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function validate(body: Partial<CreateCustomPaymentRequest>): CreateCustomPaymentRequest {
  const customer = body.customer;
  if (!customer?.name?.trim() || !customer?.email || !isEmail(customer.email) || !customer?.phone?.trim()) {
    throw new AppError("VALIDATION_FAILED", "Please provide a valid name, email and phone number.");
  }
  if (!body.tripLabel?.trim()) {
    throw new AppError("VALIDATION_FAILED", "Please select a trek/trip, or choose Other / Custom Itinerary.");
  }
  if (!isValidPax(body.pax ?? NaN)) {
    throw new AppError("VALIDATION_FAILED", "Number of trekkers must be between 1 and 60.");
  }
  if (!isValidCustomAmount(body.amount ?? NaN)) {
    throw new AppError("VALIDATION_FAILED", `Please enter a valid amount (minimum ₹${MIN_CUSTOM_PAYMENT_AMOUNT.toLocaleString()}).`);
  }
  if (!body.purpose || !["advance", "full", "balance", "addon"].includes(body.purpose)) {
    throw new AppError("VALIDATION_FAILED", "Please select what this payment is for.");
  }
  return body as CreateCustomPaymentRequest;
}

export async function POST(request: NextRequest) {
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

  try {
    const body = validate(rawBody as Partial<CreateCustomPaymentRequest>);
    const ip = getClientIp(request);
    const email = body.customer.email.trim().toLowerCase();

    const rateLimit = await checkRateLimit(ENDPOINT, `ip:${ip}`, RATE_LIMIT, RATE_LIMIT_WINDOW_MINUTES);
    if (!rateLimit.allowed) {
      return NextResponse.json(errorResponseBody(new AppError("RATE_LIMITED", "Too many requests. Please try again shortly.")), {
        status: 429,
        headers: { "Retry-After": String(rateLimit.retryAfterSeconds ?? 60) },
      });
    }

    let claim;
    try {
      claim = await claimIdempotencyKey(ENDPOINT, idempotencyKey, email, rawBody);
    } catch (err) {
      return NextResponse.json(errorResponseBody(err), { status: statusForError(err) });
    }
    if (claim.kind === "replay") {
      return NextResponse.json(claim.response, { status: claim.statusCode });
    }

    await recordRateLimitHit(ENDPOINT, `ip:${ip}`);

    const pricing = computeCustomPricing(body.amount);
    const departureId = await resolveCustomPaymentDepartureId();
    const db = supabaseAdmin();

    const { data: created, error: createError } = await db.rpc("create_booking_with_hold", {
      p_departure_id: departureId,
      p_pax: body.pax,
      p_customer_name: body.customer.name.trim(),
      p_customer_email: email,
      p_customer_phone: body.customer.phone.trim(),
      p_travellers: [{ full_name: body.customer.name.trim(), email, is_primary: true, addons: [] }],
      p_addons: [],
      p_gross_amount: pricing.baseAmount,
      p_discount_amount: 0,
      p_tax_amount: pricing.taxAmount,
      p_total_amount: pricing.totalAmount,
      p_coupon_code: null,
      p_hold_minutes: 15,
      p_initial_payment_amount: pricing.totalAmount,
      p_booking_type: "custom",
      p_custom_trip_label: body.tripLabel.trim(),
      p_custom_purpose: body.purpose,
      p_custom_notes: body.notes?.trim() || null,
    });
    if (createError) throw fromPostgresError(createError);

    const booking = created.booking as { id: string; booking_no: string };
    const hold = created.hold as { expires_at: string };
    const payment = created.payment as { id: string; amount: number };

    const order = await createRazorpayOrder({
      amountPaise: toPaise(payment.amount),
      receipt: booking.booking_no,
      notes: { booking_id: booking.id, departure_id: departureId, kind: "custom", purpose: body.purpose },
    });

    await db.rpc("attach_gateway_order", { p_payment_id: payment.id, p_gateway_order_id: order.id });

    const responseBody: CreateCustomPaymentResponse = {
      bookingNo: booking.booking_no,
      holdExpiresAt: hold.expires_at,
      totalAmount: pricing.totalAmount,
      payingNowAmount: payment.amount,
      currency: "INR",
      razorpayOrderId: order.id,
      razorpayKeyId: env.publicRazorpayKeyId,
    };

    await completeIdempotencyKey(ENDPOINT, idempotencyKey, 200, responseBody);
    return NextResponse.json(responseBody, { status: 200 });
  } catch (err) {
    await releaseIdempotencyKey(ENDPOINT, idempotencyKey);
    return NextResponse.json(errorResponseBody(err), { status: statusForError(err) });
  }
}
