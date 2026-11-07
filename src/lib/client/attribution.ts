"use client";

import type { AttributionPayload, AttributionTouch } from "@/lib/attribution";
import type { LeadUtm } from "@/lib/types/crm";

/**
 * Browser-side visit tracking for lead/booking attribution. First-party and
 * cookie-less: three small storage keys, nothing sent anywhere until the
 * visitor submits a form or starts a booking.
 *
 *  - SESSION_KEY  (sessionStorage) — how this visit started.
 *  - LAST_KEY     (localStorage)   — the last visit that came from somewhere
 *                                    (search, social, an ad…), kept 30 days.
 *  - FIRST_KEY    (localStorage)   — the first visit ever seen, kept 90 days.
 *
 * Credit goes to the last non-direct visit (GA4's default model): someone who
 * found a trek on Google and came back two days later by typing the URL is
 * still an SEO conversion.
 */
const SESSION_KEY = "tms_touch_session";
const LAST_KEY = "tms_touch_last";
const FIRST_KEY = "tms_touch_first";
const LEGACY_UTM_KEY = "tms_utm";

const LAST_TTL_DAYS = 30;
const FIRST_TTL_DAYS = 90;

const PARAM_MAP: Record<string, keyof LeadUtm> = {
  utm_source: "source",
  utm_medium: "medium",
  utm_campaign: "campaign",
  utm_term: "term",
  utm_content: "content",
  gclid: "gclid",
  gbraid: "gbraid",
  wbraid: "wbraid",
  fbclid: "fbclid",
};

function read(storage: Storage | undefined, key: string): AttributionTouch | null {
  try {
    const raw = storage?.getItem(key);
    return raw ? (JSON.parse(raw) as AttributionTouch) : null;
  } catch {
    return null;
  }
}

function write(storage: Storage | undefined, key: string, value: AttributionTouch): void {
  try {
    storage?.setItem(key, JSON.stringify(value));
  } catch {
    // Private mode / blocked storage: attribution is best-effort.
  }
}

function isFresh(touch: AttributionTouch | null, days: number): touch is AttributionTouch {
  if (!touch?.at) return false;
  return Date.now() - new Date(touch.at).getTime() < days * 24 * 60 * 60 * 1000;
}

function externalReferrer(): string | undefined {
  const ref = document.referrer;
  if (!ref) return undefined;
  try {
    const url = new URL(ref);
    if (url.hostname === window.location.hostname) return undefined;
    return `${url.origin}${url.pathname}`.slice(0, 500);
  } catch {
    return undefined;
  }
}

function utmFromUrl(): LeadUtm {
  const params = new URLSearchParams(window.location.search);
  const utm: LeadUtm = {};
  for (const [param, key] of Object.entries(PARAM_MAP)) {
    const value = params.get(param);
    if (value) utm[key] = value.slice(0, 200);
  }
  return utm;
}

function currentPath(): string {
  return `${window.location.pathname}${window.location.search}`.slice(0, 500);
}

function isNonDirect(touch: AttributionTouch): boolean {
  return Boolean(touch.referrer) || Object.keys(touch.utm ?? {}).length > 0;
}

/**
 * Records how this visit started. Call once per page load (the root layout
 * does); it is a no-op after the first page of a session.
 */
export function recordVisit(): void {
  if (typeof window === "undefined") return;

  let session: Storage | undefined;
  let local: Storage | undefined;
  try {
    session = window.sessionStorage;
    local = window.localStorage;
  } catch {
    return;
  }

  const utm = utmFromUrl();
  const existing = read(session, SESSION_KEY);
  // A new campaign click mid-session (e.g. an ad opened in the same tab)
  // starts a fresh touch; plain navigation inside the site does not.
  if (existing && Object.keys(utm).length === 0) return;

  const touch: AttributionTouch = {
    referrer: existing ? undefined : externalReferrer(),
    landingPage: currentPath(),
    utm,
    at: new Date().toISOString(),
  };

  write(session, SESSION_KEY, touch);
  if (isNonDirect(touch)) write(local, LAST_KEY, touch);
  if (!isFresh(read(local, FIRST_KEY), FIRST_TTL_DAYS)) write(local, FIRST_KEY, touch);
  if (Object.keys(utm).length > 0) {
    try {
      session?.setItem(LEGACY_UTM_KEY, JSON.stringify(utm));
    } catch {
      // ignore
    }
  }
}

/** Attribution to send with an enquiry or booking. */
export function getAttribution(): AttributionPayload {
  if (typeof window === "undefined") return {};

  let session: Storage | undefined;
  let local: Storage | undefined;
  try {
    session = window.sessionStorage;
    local = window.localStorage;
  } catch {
    return { conversionPage: currentPath() };
  }

  // If the tracker hasn't run yet (form submitted on the very first render),
  // record now so this visit still counts.
  if (!read(session, SESSION_KEY)) recordVisit();

  const sessionTouch = read(session, SESSION_KEY);
  const lastNonDirect = read(local, LAST_KEY);
  const touch =
    sessionTouch && isNonDirect(sessionTouch)
      ? sessionTouch
      : isFresh(lastNonDirect, LAST_TTL_DAYS)
        ? lastNonDirect
        : sessionTouch ?? undefined;

  const firstTouch = read(local, FIRST_KEY);
  return {
    touch: touch ?? undefined,
    firstTouch: isFresh(firstTouch, FIRST_TTL_DAYS) ? firstTouch : undefined,
    conversionPage: currentPath(),
  };
}
