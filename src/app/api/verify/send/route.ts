import { NextRequest, NextResponse } from "next/server";
import "server-only";
import { sendOtpSchema } from "@/lib/validation/otp";
import { checkSendRateLimit, createEmailVerificationCode, recordSendAttempt, OTP_CODE_TTL_MINUTES } from "@/lib/server/otp";
import { renderVerifyEmail } from "@/lib/server/email-templates/verifyEmail";
import { sendEmail } from "@/lib/server/resend";
import { getClientIp } from "@/lib/server/requestIp";

export const dynamic = "force-dynamic";

/**
 * There's no account-existence check here — every email gets a fresh code —
 * so there's nothing to enumerate by reporting a real send failure. Only the
 * generated code itself must stay out of the response and out of logs.
 */
export async function POST(request: NextRequest) {
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

  const rateLimit = await checkSendRateLimit(email, ip);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { code: "RATE_LIMITED", message: "Too many requests. Please try again shortly." },
      { status: 429, headers: { "Retry-After": String(rateLimit.retryAfterSeconds ?? 60) } }
    );
  }

  await recordSendAttempt(email, ip);

  try {
    const code = await createEmailVerificationCode(email);
    const { subject, html, text } = await renderVerifyEmail(code);
    const messageId = await sendEmail(email, subject, html, text);
    console.info("[verify/send] OTP email accepted by provider", { email, messageId });
  } catch (err) {
    console.error("[verify/send] failed to send OTP email", {
      email,
      error: err instanceof Error ? err.message : String(err),
    });
    return NextResponse.json(
      { code: "EMAIL_SEND_FAILED", message: "Couldn't send the verification code. Please try again in a moment." },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true, expiresInMinutes: OTP_CODE_TTL_MINUTES }, { status: 200 });
}
