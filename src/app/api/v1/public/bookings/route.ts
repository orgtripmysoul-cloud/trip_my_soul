import { NextRequest, NextResponse } from "next/server";
import "server-only";
import { supabaseAdmin } from "@/lib/server/supabase";
import { resolveCatalogTrek } from "@/lib/server/catalog";
import { computeBookingPricing, type TravellerInput } from "@/lib/server/pricing";
import { createRazorpayOrder } from "@/lib/server/razorpay";
import { claimIdempotencyKey, completeIdempotencyKey, releaseIdempotencyKey } from "@/lib/server/idempotency";
import { AppError, errorResponseBody, statusForError, fromPostgresError } from "@/lib/server/errors";
import { isValidInrAmount, isValidPax, toPaise } from "@/lib/money";
import { env } from "@/lib/server/env";
import type { CreateBookingRequest, CreateBookingResponse } from "@/lib/types/booking";
import { TREK_ADD_ON_KEYS } from "@/data/addOns";

export const dynamic = "force-dynamic";

const ENDPOINT = "POST /v1/public/bookings";
const DEFAULT_TOTAL_SEATS = 20;

function isEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function validate(body: Partial<CreateBookingRequest>): CreateBookingRequest {
  if (!body.trekSlug || typeof body.trekSlug !== "string") {
    throw new AppError("VALIDATION_FAILED", "Missing trek.");
  }
  if (!body.batchLabel || typeof body.batchLabel !== "string") {
    throw new AppError("VALIDATION_FAILED", "Missing departure batch.");
  }
  if (!isValidPax(body.pax ?? NaN)) {
    throw new AppError("VALIDATION_FAILED", "Number of travellers must be between 1 and 60.");
  }
  const customer = body.customer;
  if (!customer?.name?.trim() || !customer?.email || !isEmail(customer.email) || !customer?.phone?.trim()) {
    throw new AppError("VALIDATION_FAILED", "Please provide a valid name, email and phone number.");
  }
  if (!Array.isArray(body.travellers) || body.travellers.length !== body.pax) {
    throw new AppError("VALIDATION_FAILED", "Traveller details do not match the number of travellers.");
  }
  for (const traveller of body.travellers) {
    if (!traveller.fullName?.trim()) {
      throw new AppError("VALIDATION_FAILED", "Every traveller needs a name.");
    }
    for (const key of traveller.addOns ?? []) {
      if (!TREK_ADD_ON_KEYS.includes(key)) {
        throw new AppError("VALIDATION_FAILED", "Unknown add-on selected.");
      }
    }
  }
  return body as CreateBookingRequest;
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

  let claim;
  try {
    claim = await claimIdempotencyKey(ENDPOINT, idempotencyKey, null, rawBody);
  } catch (err) {
    return NextResponse.json(errorResponseBody(err), { status: statusForError(err) });
  }

  if (claim.kind === "replay") {
    return NextResponse.json(claim.response, { status: claim.statusCode });
  }

  try {
    const body = validate(rawBody as Partial<CreateBookingRequest>);
    const trek = resolveCatalogTrek(body.trekSlug);

    if (trek.price === null) {
      throw new AppError("VALIDATION_FAILED", "Online payment is not available for this package yet — please contact us to book.");
    }

    const db = supabaseAdmin();

    const { data: departure, error: depError } = await db.rpc("get_or_create_departure", {
      p_trek_slug: trek.slug,
      p_trek_name: trek.name,
      p_batch_label: body.batchLabel,
      p_start_date: body.startDate ?? null,
      p_end_date: body.endDate ?? null,
      p_seed_price: trek.price,
      p_seed_total_seats: DEFAULT_TOTAL_SEATS,
      p_duration_days: trek.durationDays,
    });
    if (depError) throw fromPostgresError(depError);

    const travellerInputs: TravellerInput[] = body.travellers.map((t) => ({
      fullName: t.fullName,
      email: t.email,
      isPrimary: t.isPrimary,
      addOns: t.addOns ?? [],
    }));

    const pricing = computeBookingPricing(departure.price, travellerInputs, body.couponCode);

    if (!isValidInrAmount(pricing.totalAmount)) {
      throw new AppError("VALIDATION_FAILED", "Could not calculate a valid amount for this booking.");
    }

    const { data: created, error: createError } = await db.rpc("create_booking_with_hold", {
      p_departure_id: departure.id,
      p_pax: body.pax,
      p_customer_name: body.customer.name,
      p_customer_email: body.customer.email.toLowerCase(),
      p_customer_phone: body.customer.phone,
      p_travellers: travellerInputs.map((t) => ({
        full_name: t.fullName,
        email: t.email ?? null,
        is_primary: t.isPrimary,
        addons: t.addOns,
      })),
      p_addons: [],
      p_gross_amount: pricing.grossAmount,
      p_discount_amount: pricing.discountAmount,
      p_tax_amount: pricing.taxAmount,
      p_total_amount: pricing.totalAmount,
      p_coupon_code: body.couponCode ?? null,
      p_hold_minutes: 15,
    });
    if (createError) throw fromPostgresError(createError);

    const booking = created.booking as { id: string; booking_no: string };
    const hold = created.hold as { expires_at: string };
    const payment = created.payment as { id: string };

    let order;
    try {
      order = await createRazorpayOrder({
        amountPaise: toPaise(pricing.totalAmount),
        receipt: booking.booking_no,
        notes: { booking_id: booking.id, departure_id: departure.id, kind: "full" },
      });
    } catch (err) {
      // Booking + hold already persisted; leave payment row at 'created' with
      // no gateway_order_id so the client can retry via the payment-intent
      // endpoint once Razorpay is reachable again, instead of losing the hold.
      throw err;
    }

    await db.rpc("attach_gateway_order", { p_payment_id: payment.id, p_gateway_order_id: order.id });

    const responseBody: CreateBookingResponse = {
      bookingNo: booking.booking_no,
      holdExpiresAt: hold.expires_at,
      totalAmount: pricing.totalAmount,
      currency: "INR",
      razorpayOrderId: order.id,
      razorpayKeyId: env.publicRazorpayKeyId,
    };

    await completeIdempotencyKey(ENDPOINT, idempotencyKey, 200, responseBody);
    return NextResponse.json(responseBody, { status: 200 });
  } catch (err) {
    // Errors are not cached against the key — release it so the client can
    // retry the same request (e.g. after a transient gateway failure)
    // instead of being stuck replaying a stale failure for 24h.
    await releaseIdempotencyKey(ENDPOINT, idempotencyKey);
    return NextResponse.json(errorResponseBody(err), { status: statusForError(err) });
  }
}
