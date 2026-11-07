import { NextRequest, NextResponse, after } from "next/server";
import "server-only";
import { supabaseAdmin } from "@/lib/server/supabase";
import { checkRateLimit, recordRateLimitHit } from "@/lib/server/rateLimit";
import { getClientIp } from "@/lib/server/requestIp";
import { dispatchPendingNotifications } from "@/lib/server/notifications";
import { env } from "@/lib/server/env";
import { saveLeadAttribution } from "@/lib/server/attribution";
import { AppError, errorResponseBody, statusForError } from "@/lib/server/errors";
import { LEAD_FORM_TYPES, type CreateLeadRequest, type CreateLeadResponse, type LeadFormType } from "@/lib/types/crm";

export const dynamic = "force-dynamic";

const ENDPOINT = "POST /v1/public/leads";
const RATE_LIMIT = 8;
const RATE_LIMIT_WINDOW_MINUTES = 15;

/** Form fields we keep in `details`, per form type. Anything else is dropped. */
const DETAIL_KEYS: Record<LeadFormType, string[]> = {
  contact_us: ["subject"],
  book_now: ["departureId", "batchLabel", "paymentChoice"],
  enquiry: [],
  callback: ["preferredTime"],
  custom_tour: ["destinations", "duration", "budgetPerPerson", "hotelCategory", "interests"],
  b2b: ["company", "gstin", "city", "agentType", "expectedVolume"],
  corporate: ["company", "groupSize", "purpose", "budget", "region"],
  admin: [],
};

function isEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

/**
 * Indian mobile numbers, with or without a +91 / 0 prefix. Deliberately
 * permissive about spaces and dashes — we normalise rather than reject,
 * because a rejected enquiry is a lost enquiry.
 */
function normalisePhone(raw: string): string {
  const digits = raw.replace(/[^\d]/g, "");
  const local = digits.startsWith("91") && digits.length === 12
    ? digits.slice(2)
    : digits.startsWith("0") && digits.length === 11
      ? digits.slice(1)
      : digits;

  if (local.length !== 10 || !/^[6-9]/.test(local)) {
    throw new AppError("VALIDATION_FAILED", "Please enter a valid 10-digit Indian mobile number.");
  }
  return `+91${local}`;
}

function validate(body: Partial<CreateLeadRequest>): CreateLeadRequest {
  if (!body.formType || !LEAD_FORM_TYPES.includes(body.formType) || body.formType === "admin") {
    throw new AppError("VALIDATION_FAILED", "Unknown form type.");
  }
  if (!body.phone?.trim()) {
    throw new AppError("VALIDATION_FAILED", "Please enter a mobile number.");
  }
  // The callback box collects a phone number and nothing else by design, so a
  // name is only required where the form actually asks for one.
  if (body.formType !== "callback" && !body.name?.trim()) {
    throw new AppError("VALIDATION_FAILED", "Please enter your name.");
  }
  if (body.email?.trim() && !isEmail(body.email.trim())) {
    throw new AppError("VALIDATION_FAILED", "Please enter a valid email address.");
  }
  if (body.message && body.message.length > 5000) {
    throw new AppError("VALIDATION_FAILED", "Your message is too long.");
  }
  return body as CreateLeadRequest;
}

function pickDetails(formType: LeadFormType, details: CreateLeadRequest["details"]): Record<string, unknown> {
  if (!details) return {};
  const allowed = DETAIL_KEYS[formType];
  const out: Record<string, unknown> = {};
  for (const key of allowed) {
    const value = details[key];
    if (value !== undefined && value !== null && value !== "") {
      out[key] = typeof value === "string" ? value.slice(0, 500) : value;
    }
  }
  return out;
}

/**
 * The single front door for all seven website forms. Each posts here with a
 * `formType`; routing, assignment, de-duplication and notification all happen
 * inside the create_lead RPC so a submit cannot half-succeed.
 */
export async function POST(request: NextRequest) {
  let rawBody: unknown;
  try {
    rawBody = await request.json();
  } catch {
    return NextResponse.json(errorResponseBody(new AppError("VALIDATION_FAILED", "Invalid JSON body.")), { status: 400 });
  }

  try {
    const input = rawBody as Partial<CreateLeadRequest>;

    // Honeypot: bots fill every field they find. Return the same success shape
    // a real submit gets, so a scraper cannot tell it was caught.
    if (input.website && input.website.trim() !== "") {
      return NextResponse.json({ ok: true, leadNo: "", duplicate: false } satisfies CreateLeadResponse, { status: 200 });
    }

    const body = validate(input);
    const ip = getClientIp(request);

    const rateLimit = await checkRateLimit(ENDPOINT, `ip:${ip}`, RATE_LIMIT, RATE_LIMIT_WINDOW_MINUTES);
    if (!rateLimit.allowed) {
      return NextResponse.json(errorResponseBody(new AppError("RATE_LIMITED", "Too many requests. Please try again shortly.")), {
        status: 429,
        headers: { "Retry-After": String(rateLimit.retryAfterSeconds ?? 60) },
      });
    }
    await recordRateLimitHit(ENDPOINT, `ip:${ip}`);

    const phone = normalisePhone(body.phone);
    const name = body.name?.trim() || "Website visitor";

    const { data, error } = await supabaseAdmin().rpc("create_lead", {
      p_full_name: name,
      p_phone: phone,
      p_email: body.email?.trim().toLowerCase() || null,
      p_form_type: body.formType,
      p_source: "website_form",
      p_trek_slug: body.trekSlug?.trim() || null,
      p_trek_name: body.trekName?.trim() || null,
      p_travel_date: body.travelDate || null,
      p_travel_month: body.travelMonth?.trim() || null,
      p_pax_adults: body.paxAdults ?? 1,
      p_pax_children: body.paxChildren ?? 0,
      p_message: body.message?.trim() || null,
      p_utm: body.utm ?? {},
      p_landing_page: body.landingPage?.slice(0, 500) || null,
      p_details: pickDetails(body.formType, body.details),
      p_consent_marketing: body.consentMarketing ?? false,
      p_consent_ip: ip,
    });

    if (error) {
      console.error("[leads] create_lead failed", error);
      throw new AppError("INTERNAL_ERROR", "Could not save your enquiry. Please try again.");
    }

    const row = Array.isArray(data) ? data[0] : data;

    // Team alert for every brand-new enquiry (repeat enquiries already alert
    // the owner from inside create_lead). Best-effort: a failure here must
    // never turn a saved enquiry into an error for the visitor.
    if (row?.lead_id && !row.is_duplicate) {
      await saveLeadAttribution(row.lead_id, input.attribution);
      try {
        await queueTeamAlert(row.lead_id, row.lead_no, body, name, phone);
      } catch (alertErr) {
        console.error("[leads] could not queue team alert", alertErr);
      }
    }

    // Send queued emails (owner alert, team alert, customer auto-reply) right
    // after the response, instead of waiting for the daily cron.
    after(async () => {
      try {
        await dispatchPendingNotifications(10);
      } catch (dispatchErr) {
        console.error("[leads] dispatch failed", dispatchErr);
      }
    });

    const responseBody: CreateLeadResponse = {
      ok: true,
      leadNo: row?.lead_no ?? "",
      duplicate: Boolean(row?.is_duplicate),
    };
    return NextResponse.json(responseBody, { status: 200 });
  } catch (err) {
    return NextResponse.json(errorResponseBody(err), { status: statusForError(err) });
  }
}

async function queueTeamAlert(
  leadId: string,
  leadNo: string,
  body: CreateLeadRequest,
  name: string,
  phone: string
): Promise<void> {
  const db = supabaseAdmin();
  const { data: lead } = await db.from("leads").select("owner_id").eq("id", leadId).maybeSingle();
  let ownerName: string | null = null;
  if (lead?.owner_id) {
    const { data: owner } = await db.from("staff").select("full_name").eq("id", lead.owner_id).maybeSingle();
    ownerName = owner?.full_name ?? null;
  }

  const company = body.details?.company;
  const { error } = await db.from("notification_outbox").insert({
    template_code: "lead.new_team",
    channel: "email",
    recipient: env.leadsNotifyInbox,
    recipient_type: "staff",
    vars: {
      lead_no: leadNo,
      name,
      phone,
      email: body.email?.trim() || null,
      trek: body.trekName?.trim() || null,
      form_type: body.formType,
      message: body.message?.trim() || null,
      travel_month: body.travelMonth?.trim() || null,
      owner_name: ownerName,
      company: typeof company === "string" ? company : null,
    },
    entity_type: "lead",
    entity_id: leadId,
    priority: 2,
  });
  if (error) throw error;
}
