import { NextRequest, NextResponse } from "next/server";
import "server-only";
import { sendOtpSchema } from "@/lib/validation/otp";
import { checkSendRateLimit, createEmailVerificationCode, recordSendAttempt, OTP_CODE_TTL_MINUTES } from "@/lib/server/otp";
import { renderVerifyEmail } from "@/lib/server/email-templates/verifyEmail";
import { sendEmail } from "@/lib/server/resend";
import { getClientIp } from "@/lib/server/requestIp";
import { withTimeout } from "@/lib/server/withTimeout";

export const dynamic = "force-dynamic";
export const preferredRegion = "bom1";

const STAGE_TIMEOUT_MS = 8_000;

/** Env vars this route touches, checked once at module load so a Production
 * misconfiguration fails fast with a named var instead of an opaque crash
 * the first time a real request hits Supabase or Resend. */
const REQUIRED_ENV_VARS = [
  "SUPABASE_URL",
  "SUPABASE_SERVICE_ROLE_KEY",
  "RESEND_API_KEY",
  "RESEND_FROM_EMAIL",
  "EMAIL_VERIFICATION_SECRET",
] as const;

const MISSING_ENV_VARS = REQUIRED_ENV_VARS.filter((name) => !process.env[name]);
if (MISSING_ENV_VARS.length > 0) {
  console.error(`[verify/send] missing required environment variable(s): ${MISSING_ENV_VARS.join(", ")}`);
}

/**
 * There's no account-existence check here — every email gets a fresh code —
 * so there's nothing to enumerate by reporting a real send failure. Only the
 * generated code itself must stay out of the response and out of logs.
 */
export async function POST(request: NextRequest) {
  if (MISSING_ENV_VARS.length > 0) {
    return NextResponse.json(
      { code: "CONFIG_ERROR", message: "Verification is temporarily unavailable. Please try again shortly." },
      { status: 500 }
    );
  }

  let rawBody: unknown;
  try {
    rawBody = await request.json();
  } catch {
    return NextResponse.json({ code: "VALIDATION_FAILED", message: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = sendOtpSchema.safeParse(rawBody);
  if (!parsed.success) {
    return NextResponse.json({ code: "VALIDATION_FAILED", message: "Please provide a valid email address." }, { status: 400 });
  }
  const { email } = parsed.data;
  const ip = getClientIp(request);

  let stage = "rate_limit_check";
  try {
    const rateLimit = await withTimeout(checkSendRateLimit(email, ip), STAGE_TIMEOUT_MS, stage);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { code: "RATE_LIMITED", message: "Too many requests. Please try again shortly." },
        { status: 429, headers: { "Retry-After": String(rateLimit.retryAfterSeconds ?? 60) } }
      );
    }

    stage = "record_send_attempt";
    await withTimeout(recordSendAttempt(email, ip), STAGE_TIMEOUT_MS, stage);

    stage = "create_otp_code";
    const code = await withTimeout(createEmailVerificationCode(email), STAGE_TIMEOUT_MS, stage);

    stage = "render_email";
    const { subject, html, text } = await renderVerifyEmail(code);

    stage = "send_email";
    const messageId = await withTimeout(sendEmail(email, subject, html, text), STAGE_TIMEOUT_MS, stage);
    console.info("[verify/send] OTP email accepted by provider", { email, messageId });
  } catch (err) {
    const errInfo =
      err instanceof Error
        ? { message: err.message, name: err.name, ...("status" in err ? { status: (err as { status?: unknown }).status } : {}) }
        : { message: String(err) };
    console.error(`[verify/send] failed during ${stage}`, { email, error: errInfo });

    if (stage === "rate_limit_check" || stage === "record_send_attempt") {
      return NextResponse.json(
        { code: "SERVICE_UNAVAILABLE", message: "This service is temporarily unavailable. Please try again shortly." },
        { status: 503 }
      );
    }
    return NextResponse.json(
      { code: "EMAIL_SEND_FAILED", message: "Couldn't send the verification code. Please try again in a moment." },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true, expiresInMinutes: OTP_CODE_TTL_MINUTES }, { status: 200 });
}
