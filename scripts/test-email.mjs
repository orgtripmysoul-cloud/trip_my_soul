#!/usr/bin/env node
/**
 * Sends one real email through Resend, bypassing all app/OTP logic, to
 * isolate "is the provider configured correctly" from "is the app broken".
 *
 * Usage:
 *   node --env-file=.env.local scripts/test-email.mjs you@example.com
 *   npm run test-email -- you@example.com
 */
import { Resend } from "resend";

const to = process.argv[2];
if (!to) {
  console.error("Usage: node --env-file=.env.local scripts/test-email.mjs <recipient-email>");
  process.exit(1);
}

const apiKey = process.env.RESEND_API_KEY;
const from = process.env.RESEND_FROM_EMAIL;

if (!apiKey) {
  console.error("Missing RESEND_API_KEY in the environment. Pass --env-file=.env.local (or export it) and retry.");
  process.exit(1);
}
if (!from) {
  console.error("Missing RESEND_FROM_EMAIL in the environment.");
  process.exit(1);
}

console.log(`Sending via Resend: from="${from}" to="${to}" ...`);

const resend = new Resend(apiKey);
const result = await resend.emails.send({
  from,
  to,
  subject: "TripMySoul test email — provider check",
  html: "<p>This is a direct test of the Resend integration, bypassing the app's OTP flow.</p>",
  text: "This is a direct test of the Resend integration, bypassing the app's OTP flow.",
});

if (result.error) {
  console.error("FAILED — Resend rejected the send:");
  console.error(result.error);
  console.error(
    "\nCommon causes: invalid/revoked API key, or the \"from\" domain isn't verified " +
      "(check Resend dashboard > Domains for SPF/DKIM/DMARC status)."
  );
  process.exit(1);
}

console.log("SENT — Resend accepted the message.");
console.log("Message id:", result.data?.id);
console.log(
  "\nIf this arrives but the OTP flow still doesn't deliver, the bug is in app logic " +
    "(e.g. RESEND_API_KEY missing/different in the deployed environment). " +
    "If this fails, fix the provider config shown above first."
);
