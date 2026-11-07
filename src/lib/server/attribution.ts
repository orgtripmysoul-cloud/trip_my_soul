import "server-only";
import { supabaseAdmin } from "./supabase";
import { classifyChannel, sanitizeAttribution, type MarketingChannel } from "@/lib/attribution";
import { SITE_URL } from "@/lib/seo";

const SITE_HOST = new URL(SITE_URL).hostname;

export interface AttributionColumns {
  channel: MarketingChannel;
  referrer: string | null;
  conversion_page: string | null;
  first_touch: Record<string, unknown> | null;
}

/** Turns untrusted browser attribution into the columns stored on leads / bookings. */
export function attributionColumns(raw: unknown): AttributionColumns & {
  landing_page: string | null;
  utm: Record<string, string>;
} {
  const clean = sanitizeAttribution(raw);
  return {
    channel: classifyChannel(clean.touch, SITE_HOST),
    referrer: clean.touch?.referrer ?? null,
    landing_page: clean.touch?.landingPage ?? null,
    utm: (clean.touch?.utm ?? {}) as Record<string, string>,
    conversion_page: clean.conversionPage ?? null,
    first_touch: clean.firstTouch
      ? { ...clean.firstTouch, channel: classifyChannel(clean.firstTouch, SITE_HOST) }
      : null,
  };
}

/**
 * Stores attribution on a freshly created lead. Best-effort: a failure is
 * logged, never surfaced — the enquiry itself is already safely saved.
 */
export async function saveLeadAttribution(leadId: string, raw: unknown): Promise<void> {
  const cols = attributionColumns(raw);
  const { error } = await supabaseAdmin()
    .from("leads")
    .update({
      channel: cols.channel,
      referrer: cols.referrer,
      conversion_page: cols.conversion_page,
      first_touch: cols.first_touch,
    })
    .eq("id", leadId);
  if (error) console.error("[attribution] lead update failed", error);
}

/** Same for a booking created through the website checkout. */
export async function saveBookingAttribution(bookingId: string, raw: unknown): Promise<void> {
  const cols = attributionColumns(raw);
  const { error } = await supabaseAdmin()
    .from("bookings")
    .update({
      channel: cols.channel,
      referrer: cols.referrer,
      landing_page: cols.landing_page,
      utm: cols.utm,
      first_touch: cols.first_touch,
    })
    .eq("id", bookingId);
  if (error) console.error("[attribution] booking update failed", error);
}
