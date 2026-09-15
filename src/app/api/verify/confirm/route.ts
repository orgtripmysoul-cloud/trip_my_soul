import { NextRequest, NextResponse } from "next/server";
import "server-only";
import { confirmOtpSchema } from "@/lib/validation/otp";
import { verifyEmailCode, OTP_VERIFIED_TTL_MINUTES } from "@/lib/server/otp";
import { issueVerificationToken } from "@/lib/server/verificationToken";

export const dynamic = "force-dynamic";

const ERROR_MESSAGES: Record<string, string> = {
  no_active_code: "That code has expired or wasn't found. Please request a new one.",
  too_many_attempts: "Too many incorrect attempts. Please request a new code.",
  incorrect_code: "Incorrect code. Please try again.",
};

export async function POST(request: NextRequest) {
  let rawBody: unknown;
  try {
    rawBody = await request.json();
  } catch {
    return NextResponse.json({ verified: false, message: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = confirmOtpSchema.safeParse(rawBody);
  if (!parsed.success) {
    return NextResponse.json({ verified: false, message: "Please provide a valid email and 6-digit code." }, { status: 400 });
  }
  const { email, code } = parsed.data;

  const result = await verifyEmailCode(email, code);
  if (!result.ok) {
    return NextResponse.json({ verified: false, message: ERROR_MESSAGES[result.reason] }, { status: 400 });
  }

  const token = issueVerificationToken(email, OTP_VERIFIED_TTL_MINUTES);
  return NextResponse.json({ verified: true, token, expiresInMinutes: OTP_VERIFIED_TTL_MINUTES }, { status: 200 });
}
