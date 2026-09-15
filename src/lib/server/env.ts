/**
 * Central place that reads server-only secrets. Importing this file from a
 * client component would fail loudly (not silently leak undefined), because
 * every getter throws if the variable is missing.
 */

function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const env = {
  get supabaseUrl() {
    return required("SUPABASE_URL");
  },
  get supabaseServiceRoleKey() {
    return required("SUPABASE_SERVICE_ROLE_KEY");
  },
  get razorpayKeyId() {
    return required("RAZORPAY_KEY_ID");
  },
  get razorpayKeySecret() {
    return required("RAZORPAY_KEY_SECRET");
  },
  get razorpayWebhookSecret() {
    return required("RAZORPAY_WEBHOOK_SECRET");
  },
  get resendApiKey() {
    return required("RESEND_API_KEY");
  },
  get resendFromEmail() {
    return required("RESEND_FROM_EMAIL");
  },
  /** Also the exact name Vercel Cron looks for to auto-add the Authorization header. */
  get internalCronSecret() {
    return required("CRON_SECRET");
  },
  /** Public key id — this one is safe to expose to the browser. */
  get publicRazorpayKeyId() {
    return required("NEXT_PUBLIC_RAZORPAY_KEY_ID");
  },
};
