import { NextRequest, NextResponse } from "next/server";
import "server-only";
import { supabaseAdmin } from "@/lib/server/supabase";
import { checkRateLimit, recordRateLimitHit } from "@/lib/server/rateLimit";
import { getClientIp } from "@/lib/server/requestIp";
import { AppError, errorResponseBody, statusForError } from "@/lib/server/errors";
import type { CreateQuoteLeadRequest } from "@/lib/types/booking";

export const dynamic = "force-dynamic";

const ENDPOINT = "POST /v1/public/quote-leads";
const RATE_LIMIT = 5;
const RATE_LIMIT_WINDOW_MINUTES = 15;

function validate(body: Partial<CreateQuoteLeadRequest>): CreateQuoteLeadRequest {
  if (!body.name?.trim()) {
    throw new AppError("VALIDATION_FAILED", "Please enter your name.");
  }
  if (!body.phone?.trim()) {
    throw new AppError("VALIDATION_FAILED", "Please enter a mobile number.");
  }
  if (body.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
    throw new AppError("VALIDATION_FAILED", "Please enter a valid email address.");
  }
  if (body.source && !["tbd_quote", "callback"].includes(body.source)) {
    throw new AppError("VALIDATION_FAILED", "Invalid lead source.");
  }
  return body as CreateQuoteLeadRequest;
}

/** Captures a lead for a TBD-priced trip ("Get Custom Quote") or a callback request. An admin answers it later with a /pay/[token] link. */
export async function POST(request: NextRequest) {
  let rawBody: unknown;
  try {
    rawBody = await request.json();
  } catch {
    return NextResponse.json(errorResponseBody(new AppError("VALIDATION_FAILED", "Invalid JSON body.")), { status: 400 });
  }

  try {
    const body = validate(rawBody as Partial<CreateQuoteLeadRequest>);
    const ip = getClientIp(request);

    const rateLimit = await checkRateLimit(ENDPOINT, `ip:${ip}`, RATE_LIMIT, RATE_LIMIT_WINDOW_MINUTES);
    if (!rateLimit.allowed) {
      return NextResponse.json(errorResponseBody(new AppError("RATE_LIMITED", "Too many requests. Please try again shortly.")), {
        status: 429,
        headers: { "Retry-After": String(rateLimit.retryAfterSeconds ?? 60) },
      });
    }
    await recordRateLimitHit(ENDPOINT, `ip:${ip}`);

    const { error } = await supabaseAdmin().from("quote_leads").insert({
      full_name: body.name.trim(),
      email: body.email?.trim().toLowerCase() || null,
      phone: body.phone.trim(),
      trip_label: body.tripLabel?.trim() || null,
      departure_date: body.departureDate || null,
      message: body.message?.trim() || null,
      source: body.source ?? "tbd_quote",
    });
    if (error) throw new AppError("INTERNAL_ERROR", "Could not save your request. Please try again.");

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err) {
    return NextResponse.json(errorResponseBody(err), { status: statusForError(err) });
  }
}
