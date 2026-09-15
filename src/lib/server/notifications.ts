import "server-only";
import { supabaseAdmin } from "./supabase";
import { sendEmail } from "./resend";
import { renderBookingPaymentSuccessEmail, type BookingPaymentSuccessVars } from "./email-templates/bookingPaymentSuccess";

const MAX_ATTEMPTS = 8;
/** Exponential backoff in minutes: 1, 2, 4, 8, 16, 32, 64, 128. */
function backoffMinutes(attempts: number): number {
  return Math.min(2 ** attempts, 24 * 60);
}

interface OutboxRow {
  id: string;
  template_code: string;
  channel: string;
  recipient: string;
  vars: Record<string, unknown>;
  attempts: number;
}

/**
 * Sends due notification_outbox rows via Resend. Called opportunistically
 * right after a webhook processes payment.captured, and by the internal cron
 * endpoint as the durable retry path — a failed send here NEVER touches
 * booking/payment state, only the outbox row itself.
 */
export async function dispatchPendingNotifications(limit = 25): Promise<{ sent: number; failed: number }> {
  const db = supabaseAdmin();
  const { data: rows } = await db
    .from("notification_outbox")
    .select("id, template_code, channel, recipient, vars, attempts")
    .in("status", ["pending", "failed"])
    .lte("next_attempt_at", new Date().toISOString())
    .order("priority", { ascending: true })
    .order("created_at", { ascending: true })
    .limit(limit);

  let sent = 0;
  let failed = 0;

  for (const row of (rows ?? []) as OutboxRow[]) {
    try {
      if (row.channel !== "email") {
        throw new Error(`Unsupported channel: ${row.channel}`);
      }
      const { subject, html } = renderTemplate(row.template_code, row.vars);
      const providerMessageId = await sendEmail(row.recipient, subject, html);
      await db
        .from("notification_outbox")
        .update({ status: "sent", provider: "resend", provider_message_id: providerMessageId, sent_at: new Date().toISOString() })
        .eq("id", row.id);
      sent += 1;
    } catch (err) {
      const attempts = row.attempts + 1;
      const exhausted = attempts >= MAX_ATTEMPTS;
      await db
        .from("notification_outbox")
        .update({
          status: exhausted ? "failed" : "failed",
          attempts,
          last_error: err instanceof Error ? err.message : "Unknown error",
          next_attempt_at: new Date(Date.now() + backoffMinutes(attempts) * 60_000).toISOString(),
        })
        .eq("id", row.id);
      failed += 1;
    }
  }

  return { sent, failed };
}

function renderTemplate(templateCode: string, vars: Record<string, unknown>): { subject: string; html: string } {
  switch (templateCode) {
    case "booking.payment_success":
      return renderBookingPaymentSuccessEmail(vars as unknown as BookingPaymentSuccessVars);
    default:
      throw new Error(`Unknown notification template: ${templateCode}`);
  }
}
