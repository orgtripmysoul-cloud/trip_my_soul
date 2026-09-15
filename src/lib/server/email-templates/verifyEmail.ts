import "server-only";
import { render } from "@react-email/render";
import * as React from "react";
import VerifyEmail from "../../../../emails/verify-email";
import { OTP_CODE_TTL_MINUTES } from "../otp";

export async function renderVerifyEmail(code: string): Promise<{ subject: string; html: string; text: string }> {
  const element = React.createElement(VerifyEmail, { code, expiresInMinutes: OTP_CODE_TTL_MINUTES });
  const [html, text] = await Promise.all([render(element), render(element, { plainText: true })]);
  return { subject: `Your TripMySoul verification code: ${code}`, html, text };
}
