import { NextRequest, NextResponse } from "next/server";
import "server-only";
import { supabaseAdmin } from "@/lib/server/supabase";
import { dispatchPendingNotifications } from "@/lib/server/notifications";
import { env } from "@/lib/server/env";

export const dynamic = "force-dynamic";

/**
 * Durable retry path — releases seat holds past their 15-minute expiry,
 * queues trip-reminder emails for departures 3 days out, and retries failed
 * notification_outbox rows. Needs to run on a schedule even if nothing else
 * calls it.
 *
 * Two ways to trigger it, both auth-checked:
 *  - GET: Vercel Cron (see vercel.json), authorized via the standard
 *    `Authorization: Bearer $CRON_SECRET` header Vercel sends automatically.
 *    NOTE: Vercel's Hobby plan only runs crons once/day, which is too
 *    infrequent for a 15-minute hold — on Hobby, also wire an external
 *    scheduler (e.g. cron-job.org) to POST here every 1-2 minutes; see
 *    docs/PAYMENTS_INTEGRATION.md.
 *  - POST: for that external scheduler / manual runs, authorized via the
 *    `x-internal-secret` header against INTERNAL_CRON_SECRET.
 */
async function runCronJob() {
  const db = supabaseAdmin();
  const { data: releasedCount, error } = await db.rpc("release_expired_seat_holds");
  if (error) {
    console.error("[internal-cron] release_expired_seat_holds failed", error);
  }
  // Idempotent regardless of how often this cron fires (see the Hobby-plan
  // note above) — queue_trip_reminders only ever queues a booking once,
  // guarded by bookings.reminder_sent_at.
  const { data: remindersQueued, error: reminderError } = await db.rpc("queue_trip_reminders");
  if (reminderError) {
    console.error("[internal-cron] queue_trip_reminders failed", reminderError);
  }
  const { sent, failed } = await dispatchPendingNotifications(50);
  return NextResponse.json({
    releasedHolds: releasedCount ?? 0,
    remindersQueued: remindersQueued ?? 0,
    notificationsSent: sent,
    notificationsFailed: failed,
  });
}

export async function GET(request: NextRequest) {
  const auth = request.headers.get("authorization");
  if (auth !== `Bearer ${env.internalCronSecret}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  return runCronJob();
}

export async function POST(request: NextRequest) {
  const secret = request.headers.get("x-internal-secret");
  if (secret !== env.internalCronSecret) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  return runCronJob();
}
