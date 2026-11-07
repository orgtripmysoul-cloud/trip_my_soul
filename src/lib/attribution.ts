/**
 * Marketing attribution shared by the website (capture), the API routes
 * (classification) and the admin dashboard (reporting). Pure functions only —
 * no browser or server APIs — so everything here is unit-testable.
 */
import type { LeadSource, LeadUtm } from "@/lib/types/crm";

export const MARKETING_CHANNELS = [
  "organic_search",
  "paid_search",
  "organic_social",
  "paid_social",
  "whatsapp",
  "email",
  "referral",
  "direct",
  "offline",
  "unknown",
] as const;

export type MarketingChannel = (typeof MARKETING_CHANNELS)[number];

export const MARKETING_CHANNEL_LABELS: Record<MarketingChannel, string> = {
  organic_search: "Organic search (SEO)",
  paid_search: "Paid search (Google Ads)",
  organic_social: "Social (organic)",
  paid_social: "Social ads",
  whatsapp: "WhatsApp",
  email: "Email",
  referral: "Referral sites",
  direct: "Direct",
  offline: "Offline / sales team",
  unknown: "Unknown (before tracking)",
};

/** One visit's entry point, as recorded by the browser on the first page of a session. */
export interface AttributionTouch {
  /** Full referring URL, only when it was another site. */
  referrer?: string;
  /** Path + query of the first page seen in the session. */
  landingPage?: string;
  utm?: LeadUtm;
  /** ISO timestamp of the visit. */
  at?: string;
}

/** What the website sends alongside an enquiry or a booking. */
export interface AttributionPayload {
  /** The touch credited with this conversion (last non-direct visit). */
  touch?: AttributionTouch;
  /** The very first visit we ever saw from this browser. */
  firstTouch?: AttributionTouch;
  /** Page the form was submitted from. */
  conversionPage?: string;
}

const SEARCH_ENGINES = [
  "google.",
  "bing.com",
  "yahoo.",
  "duckduckgo.com",
  "yandex.",
  "ecosia.org",
  "baidu.com",
  "search.brave.com",
  "startpage.com",
];
const SOCIAL_SITES = [
  "instagram.com",
  "facebook.com",
  "fb.com",
  "fb.me",
  "t.co",
  "twitter.com",
  "x.com",
  "linkedin.com",
  "lnkd.in",
  "youtube.com",
  "youtu.be",
  "pinterest.",
  "pin.it",
  "reddit.com",
  "quora.com",
  "threads.net",
  "snapchat.com",
];
const WHATSAPP_SITES = ["whatsapp.com", "wa.me", "l.wl.co"];
const EMAIL_SITES = ["mail.google.com", "outlook.live.com", "outlook.office.com", "mail.yahoo.com"];

const PAID_MEDIUMS = ["cpc", "ppc", "paid", "paidsearch", "paid_search", "sem", "display", "cpm"];
const PAID_SOCIAL_MEDIUMS = ["paid_social", "paidsocial", "social_paid", "social-paid", "paid-social"];
const SOCIAL_NAMES = ["instagram", "ig", "facebook", "fb", "meta", "youtube", "linkedin", "twitter", "x", "pinterest", "threads"];

function hostOf(url: string | undefined | null): string | null {
  if (!url) return null;
  try {
    return new URL(url).hostname.toLowerCase().replace(/^www\./, "");
  } catch {
    return null;
  }
}

function hostMatches(host: string, list: string[]): boolean {
  return list.some((entry) =>
    // "google." matches google.com, google.co.in, news.google.com — but not mygoogle.com.
    entry.endsWith(".") ? host.startsWith(entry) || host.includes(`.${entry}`) : host === entry || host.endsWith(`.${entry}`)
  );
}

/**
 * Buckets a visit into a marketing channel, the way GA4's default channel
 * grouping does: explicit campaign tags win, then ad click IDs, then the
 * referring site, and no referrer at all means "direct".
 */
export function classifyChannel(
  touch: Pick<AttributionTouch, "utm" | "referrer"> | undefined,
  siteHost = "tripmysoul.in"
): MarketingChannel {
  const utm = touch?.utm ?? {};
  const source = (utm.source ?? "").toLowerCase().trim();
  const medium = (utm.medium ?? "").toLowerCase().trim();
  const isSocialName = SOCIAL_NAMES.includes(source) || hostMatches(source, SOCIAL_SITES);

  if (PAID_SOCIAL_MEDIUMS.includes(medium)) return "paid_social";
  if (PAID_MEDIUMS.includes(medium)) return isSocialName ? "paid_social" : "paid_search";
  if (utm.gclid || utm.gbraid || utm.wbraid) return "paid_search";
  if (medium === "email" || medium === "newsletter" || source === "newsletter") return "email";
  if (source === "whatsapp" || medium === "whatsapp") return "whatsapp";
  if (medium === "organic" && (source === "google" || source === "bing")) return "organic_search";
  if (medium === "social" || medium === "organic_social" || isSocialName) return "organic_social";
  if (source || medium) return "referral";

  const host = hostOf(touch?.referrer);
  // Meta appends fbclid to organic link clicks too, and its in-app browser
  // often strips the referrer — so a bare fbclid means "came from Facebook/IG".
  if (utm.fbclid && !host) return "organic_social";
  const own = siteHost.toLowerCase().replace(/^www\./, "");
  if (!host || host === own || host.endsWith(`.${own}`)) return "direct";
  if (hostMatches(host, EMAIL_SITES)) return "email";
  if (hostMatches(host, SEARCH_ENGINES)) return "organic_search";
  if (hostMatches(host, WHATSAPP_SITES)) return "whatsapp";
  if (hostMatches(host, SOCIAL_SITES)) return "organic_social";
  return "referral";
}

/** Channel for a lead a staff member typed in, from the source they picked. */
export function channelFromLeadSource(source: LeadSource): MarketingChannel {
  switch (source) {
    case "whatsapp":
      return "whatsapp";
    case "instagram":
      return "organic_social";
    case "google_ads":
      return "paid_search";
    case "referral":
    case "b2b_partner":
      return "referral";
    case "phone_call":
    case "walk_in":
    case "repeat_customer":
      return "offline";
    default:
      return "unknown";
  }
}

const UTM_KEYS: (keyof LeadUtm)[] = ["source", "medium", "campaign", "term", "content", "gclid", "gbraid", "wbraid", "fbclid"];

function cleanText(value: unknown, max: number): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed ? trimmed.slice(0, max) : undefined;
}

/** Only same-origin paths: never store a full URL someone injected as a "page". */
function cleanPath(value: unknown): string | undefined {
  const text = cleanText(value, 500);
  if (!text || !text.startsWith("/") || text.startsWith("//")) return undefined;
  return text;
}

function cleanReferrer(value: unknown): string | undefined {
  const text = cleanText(value, 500);
  if (!text) return undefined;
  try {
    const url = new URL(text);
    if (url.protocol !== "http:" && url.protocol !== "https:") return undefined;
    // Keep origin + path only: query strings can carry other sites' personal data.
    return `${url.origin}${url.pathname}`.slice(0, 500);
  } catch {
    return undefined;
  }
}

export function cleanUtm(value: unknown): LeadUtm {
  if (!value || typeof value !== "object") return {};
  const out: LeadUtm = {};
  for (const key of UTM_KEYS) {
    const v = cleanText((value as Record<string, unknown>)[key], 200);
    if (v) out[key] = v;
  }
  return out;
}

function cleanTouch(value: unknown): AttributionTouch | undefined {
  if (!value || typeof value !== "object") return undefined;
  const raw = value as Record<string, unknown>;
  const touch: AttributionTouch = {
    referrer: cleanReferrer(raw.referrer),
    landingPage: cleanPath(raw.landingPage),
    utm: cleanUtm(raw.utm),
    at: cleanText(raw.at, 40),
  };
  return touch.referrer || touch.landingPage || Object.keys(touch.utm ?? {}).length > 0 ? touch : undefined;
}

/** Validates untrusted attribution from the browser. Never throws. */
export function sanitizeAttribution(value: unknown): AttributionPayload {
  if (!value || typeof value !== "object") return {};
  const raw = value as Record<string, unknown>;
  return {
    touch: cleanTouch(raw.touch),
    firstTouch: cleanTouch(raw.firstTouch),
    conversionPage: cleanPath(raw.conversionPage),
  };
}

/** "/treks/kedarkantha?utm_source=x#faq" → "/treks/kedarkantha", for grouping in reports. */
export function normalisePath(page: string | null | undefined): string {
  if (!page) return "(not recorded)";
  const path = page.split(/[?#]/)[0] || "/";
  return path.length > 1 ? path.replace(/\/+$/, "") : path;
}

// ---------------------------------------------------------------------------
// India-time calendar boundaries. The servers run in UTC, so "today" has to be
// computed against IST explicitly (UTC+5:30, no daylight saving).
// ---------------------------------------------------------------------------

const IST_OFFSET_MS = (5 * 60 + 30) * 60_000;

/** Start of the IST calendar day containing `date`, as an absolute instant. */
export function istStartOfDay(date = new Date()): Date {
  const ist = new Date(date.getTime() + IST_OFFSET_MS);
  return new Date(Date.UTC(ist.getUTCFullYear(), ist.getUTCMonth(), ist.getUTCDate()) - IST_OFFSET_MS);
}

/** Start of the IST calendar month `offset` months from the one containing `date`. */
export function istMonthStart(offset = 0, date = new Date()): Date {
  const ist = new Date(date.getTime() + IST_OFFSET_MS);
  return new Date(Date.UTC(ist.getUTCFullYear(), ist.getUTCMonth() + offset, 1) - IST_OFFSET_MS);
}
