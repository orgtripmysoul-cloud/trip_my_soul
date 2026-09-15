import { NextRequest, NextResponse } from "next/server";
import "server-only";
import { sendOtpSchema } from "@/lib/validation/otp";
import { checkSendRateLimit, createEmailVerificationCode, recordSendAttempt, OTP_CODE_TTL_MINUTES } from "@/lib/server/otp";
import { renderVerifyEmail } from "@/lib/server/email-templates/verifyEmail";
import { sendEmail } from "@/lib/server/resend";
import { getClientIp } from "@/lib/server/requestIp";

export const dynamic = "force-dynamic";

/**
 * Always responds with the same generic shape on success (whether or not the
 * email has been seen/verified before) so this endpoint can't be used to
 * enumerate customers. Rate limiting (429) is the one deliberate exception —
 * that's abuse throttling, not an enumeration signal.
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
    await sendEmail(email, subject, html, text);
  } catch (err) {
    console.error("[verify/send] failed to send OTP email", err);
    // Still return the generic success shape — the attempt was recorded and
    // the client should proceed to the "enter code" step either way; a
    // transient Resend failure shouldn't leak as a distinguishable response.
  }

  return NextResponse.json({ ok: true, expiresInMinutes: OTP_CODE_TTL_MINUTES }, { status: 200 });
}
