import { NextRequest, NextResponse, after } from "next/server";
import "server-only";
import { verifyWebhookSignature } from "@/lib/server/razorpay";
import { supabaseAdmin } from "@/lib/server/supabase";
import { dispatchPendingNotifications } from "@/lib/server/notifications";
import { sendEmail } from "@/lib/server/resend";
import { renderBookingInternalNotificationEmail, type BookingConfirmationVars } from "@/lib/server/email-templates/bookingConfirmation";
import { env } from "@/lib/server/env";

export const dynamic = "force-dynamic";

interface RazorpayWebhookBody {
  id?: string;
  event: string;
  created_at?: number;
  payload: {
    payment?: { entity: Record<string, unknown> };
    order?: { entity: Record<string, unknown> };
  };
}

function deriveEventId(body: RazorpayWebhookBody): string {
  if (body.id) return body.id;
  const entityId =
    (body.payload.payment?.entity?.id as string | undefined) ??
    (body.payload.order?.entity?.id as string | undefined) ??
    "unknown";
  return `${body.event}:${entityId}:${body.created_at ?? ""}`;
}

/**
 * The AUTHORITATIVE payment settlement signal. Never trust the browser
 * callback (see /api/v1/public/payments/verify) — only a signature-verified
 * webhook event changes booking/payment state.
 */
export async function POST(request: NextRequest) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-razorpay-signature");

  if (!verifyWebhookSignature(rawBody, signature)) {
    console.warn("[razorpay-webhook] signature verification failed");
    return NextResponse.json({ error: "invalid signature" }, { status: 400 });
  }

  let body: RazorpayWebhookBody;
  try {
    body = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  const eventId = deriveEventId(body);
  const db = supabaseAdmin();

  // Persist the raw event first — this row is also the dedupe gate via the
  // unique (provider, event_id) constraint. A row that exists with
  // processed_at already set is a true duplicate delivery: do nothing, 200.
  // A row that exists with processed_at still null is a retry of a
  // previously *failed* attempt: fall through and reprocess it (every
  // handler below is itself idempotent, so this is safe).
  const { error: insertError } = await db
    .from("webhook_events")
    .insert({ provider: "razorpay", event_id: eventId, event_type: body.event, payload: body });

  if (insertError) {
    if (insertError.code === "23505") {
      const { data: existing } = await db
        .from("webhook_events")
        .select("processed_at")
        .eq("provider", "razorpay")
        .eq("event_id", eventId)
        .single();
      if (existing?.processed_at) {
        return NextResponse.json({ ok: true, duplicate: true }, { status: 200 });
      }
      // fall through and reprocess
    } else {
      console.error("[razorpay-webhook] failed to persist event", insertError);
      return NextResponse.json({ error: "internal_error" }, { status: 500 });
    }
  }

  try {
    await processEvent(db, body);
    await db
      .from("webhook_events")
      .update({ processed_at: new Date().toISOString() })
      .eq("provider", "razorpay")
      .eq("event_id", eventId);
  } catch (err) {
    const message = err instanceof Error ? err.message : "unknown error";
    console.error(`[razorpay-webhook] processing failed for ${body.event} (${eventId}):`, message);
    await db
      .from("webhook_events")
      .update({ processing_error: message })
      .eq("provider", "razorpay")
      .eq("event_id", eventId);
    // 500 so Razorpay retries; the event row stays with processed_at = null.
    return NextResponse.json({ error: "processing_failed" }, { status: 500 });
  }

  // Best-effort, outside any DB transaction — a Resend failure here must
  // never undo the payment state change committed above.
  // after() keeps the function alive until dispatch finishes; an un-awaited
  // promise can be frozen by Vercel once the response is returned.
  after(() =>
    dispatchPendingNotifications(10).catch((err) => console.error("[razorpay-webhook] notification dispatch failed", err))
  );

  return NextResponse.json({ ok: true }, { status: 200 });
}

async function processEvent(db: ReturnType<typeof supabaseAdmin>, body: RazorpayWebhookBody): Promise<void> {
  const payment = body.payload.payment?.entity;

  switch (body.event) {
    case "payment.captured": {
      if (!payment) throw new Error("payment.captured event missing payment entity");
      const { data, error } = await db.rpc("capture_payment", {
        p_gateway_order_id: payment.order_id as string,
        p_gateway_payment_id: payment.id as string,
        p_method: (payment.method as string) ?? null,
        p_method_detail: pickMethodDetail(payment),
        p_fee: typeof payment.fee === "number" ? payment.fee / 100 : null,
        p_tax_on_fee: typeof payment.tax === "number" ? payment.tax / 100 : null,
        p_gateway_payload: payment,
        p_captured_at: new Date((body.created_at ?? Date.now() / 1000) * 1000).toISOString(),
      });
      if (error) throw new Error(error.message);

      // Internal ops copy — best-effort, never affects the booking/payment
      // state committed above or the webhook's 200 response. Skipped on a
      // duplicate/retried delivery (no `vars` — capture_payment only builds
      // them the first time a payment is actually captured).
      const vars = (data as { vars?: BookingConfirmationVars } | null)?.vars;
      if (vars) {
        after(() =>
          sendInternalBookingNotification(vars).catch((err) =>
            console.error("[razorpay-webhook] internal notification email failed", err)
          )
        );

        const bookingId = (data as { booking?: { id?: string } } | null)?.booking?.id;
        if (bookingId) {
          await db.from("custom_quotes").update({ status: "paid" }).eq("booking_id", bookingId).eq("status", "pending");
        }
      }
      return;
    }
    case "payment.authorized": {
      if (!payment) throw new Error("payment.authorized event missing payment entity");
      const { error } = await db.rpc("mark_payment_authorized", {
        p_gateway_order_id: payment.order_id as string,
        p_gateway_payment_id: payment.id as string,
        p_method: (payment.method as string) ?? null,
        p_gateway_payload: payment,
      });
      if (error) throw new Error(error.message);
      return;
    }
    case "payment.failed": {
      if (!payment) throw new Error("payment.failed event missing payment entity");
      const { error } = await db.rpc("fail_payment", {
        p_gateway_order_id: payment.order_id as string,
        p_failure_code: (payment.error_code as string) ?? "UNKNOWN",
        p_failure_reason: (payment.error_description as string) ?? "Payment failed",
        p_gateway_payload: payment,
      });
      if (error) throw new Error(error.message);
      return;
    }
    case "order.paid": {
      // Redundant with payment.captured for a single-payment-per-order flow;
      // recorded via webhook_events for audit, no additional state change.
      return;
    }
    default:
      // Unhandled event type: recorded for audit (webhook_events row already
      // inserted above), intentionally not processed further this phase.
      return;
  }
}

async function sendInternalBookingNotification(vars: BookingConfirmationVars): Promise<void> {
  const { subject, html, text } = await renderBookingInternalNotificationEmail(vars);
  await sendEmail(env.resendBookingsInbox, subject, html, text);
}

function pickMethodDetail(payment: Record<string, unknown>): Record<string, unknown> {
  const { card, bank, wallet, vpa } = payment as {
    card?: unknown;
    bank?: unknown;
    wallet?: unknown;
    vpa?: unknown;
  };
  // Only non-sensitive, Razorpay-provided descriptors — never raw card data.
  return { card, bank, wallet, vpa };
}
