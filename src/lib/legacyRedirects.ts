import { REGIONS } from "@/data/db";
import { resolveDetailPath } from "./detailPath";
import { isLivePath, normalisePath, stripDocumentSuffix } from "./legacyPaths";

/**
 * 301s for the URL scheme the previous tripmysoul.in ran on.
 *
 * That site addressed everything through a category/package pair carrying a
 * numeric id — `/weekend-getaways/weekend-gateway-104/nagtibba/Nagtibba-Trek-Details-106`
 * — and also exposed each package flat at `/trek/<key>` and at `/<slug>`. None
 * of those shapes survived the move to `/treks/<slug>`, so every one of them
 * now 404s while Google and old backlinks keep pointing at them.
 *
 * The inventory below was recovered from the Wayback Machine's index for
 * tripmysoul.in (the old site predates this repo, so git history has nothing),
 * cross-checked against the current catalogue. Anything Search Console turns up
 * later that these rules do not already cover belongs in `LEGACY_PAGES` or
 * `LEGACY_PACKAGE_KEYS`.
 *
 * Deliberately a lookup map rather than `next.config` `redirects()`: the old
 * paths are full of `&`, `(`, `)` and `,`, which path-to-regexp reads as
 * pattern syntax, and there are far too many to spell out as patterns safely.
 */

/** Listing pages a retired section collapses into. Each must be a live route. */
const LISTINGS = {
  treks: "/treks",
  trending: "/treks?filter=trending",
  weekend: "/weekend-trips",
  backpacking: "/backpacking-trips",
  premium: "/premium-trips",
  yatra: "/yatra",
  blogs: "/blogs",
} as const;

/**
 * The old site's category keys — the `<key>-<id>` second segment — and the
 * nearest current listing. The same key also appears as the *first* segment on
 * some variants (`/mansoon-treks/mansoon-treks-110`), and the first segment was
 * re-worded freely over time (`/monsoon-treks/...`, `/best-monsoon-treks-in-july,-august-and-september-2025/...`),
 * which is why the key is what we match on.
 */
const LEGACY_CATEGORY_KEYS: Record<string, string> = {
  "spirituals-journey-101": LISTINGS.yatra,
  "upcoming-winter-trek-102": LISTINGS.treks,
  "trending-treks-on-tms-103": LISTINGS.trending,
  "weekend-gateway-104": LISTINGS.weekend,
  "explore-the-open-road-104": LISTINGS.backpacking,
  "summer-trek-109": LISTINGS.treks,
  "mansoon-treks-110": LISTINGS.treks,
  "uttarakhand-110": "/regions/uttarakhand",
  "spiti-vallley-111": "/treks/spiti-valley",
  "himachal-pardesh-112": "/regions/himachal-pradesh",
  "kashmir-122": "/regions/jammu-kashmir",
  "south-trip-511": LISTINGS.backpacking,
};

/**
 * The old site's package keys — the trailing `<Name>-<id>` segment — and the
 * catalogue slug that package is listed under today. The slug is resolved
 * through `resolveDetailPath` so a key always lands on whichever route actually
 * renders it (`/treks/…` or `/trips/…`), including when a package later moves.
 *
 * Keys are matched lower-cased: the old site mixed casing freely
 * (`Kedarkantha-details-201`, `brahmatal-trek-110`) and Google holds both.
 */
const LEGACY_PACKAGE_KEYS: Record<string, string> = {
  // Uttarakhand treks
  "auli-weekend-tour-details-301": "auli-weekend-tour",
  "ali-bedni-trek-0003": "ali-bedni-bugyal-trek",
  "bali-pass-trek-906": "bali-pass-trek",
  "brahmatal-trek-110": "brahmatal-trek",
  "buran-ghati-pass": "buran-ghati-pass-trek",
  "chopta-tungnath-trek-details-103": "chopta-tungnath-trek",
  "chopta-tungnath-trek-104": "chopta-tungnath-trek",
  "dayara-bugyal-301": "dayara-bugyal-trek",
  "gaumukh-tapovan-904": "gaumukh-tapovan-trek",
  "har-ki-dun-304": "har-ki-dun-trek",
  "kedarkantha-details-201": "kedarkantha-trek",
  "kuari-pass-302": "kuari-pass-trek",
  "nagtibba-trek-details-106": "nagtibba-trek",
  "pangarchulla-trek-905": "pangarchulla-trek",
  "phulara-ridge-trek-905": "phulara-ridge-trek",
  "valley-of-flower-901": "valley-of-flowers-trek",

  // Himachal treks
  "beas-kund-trek-119": "beas-kund-trek",
  "bir-biling-paragliding-trek-details": "bir-billing-paragliding-trek",
  "hampta-pass-902": "hampta-pass-trek",
  "kheerganga-trek-details-302": "kasol-kheerganga-trek",
  "manali-kasol-110": "manali-kasol",
  "rupin-pass-trek-904": "rupin-pass-trek",
  "sar-pass-trek-details-303": "sar-pass-trek",
  "tirthan-valley-908": "tirthan-valley",
  "triund-trek-details-220": "triund-trek",
  "yulla-kanda-trek-909": "yulla-kanda-trek",
  "spiti-summer-expedition": "spiti-valley",
  "spiti-summer-expedition-2": "spiti-valley",
  "spiti-winter-expedition": "spiti-valley",

  // Kashmir & Ladakh
  "kashmir-great-lakes-903": "kashmir-great-lakes-trek",
  "kashmir-four-days-303": "kashmir-tour",
  "tarsar-marsar-907": "tarsar-marsar-trek",
  "leh-ladakh-bike-details-502": "leh-ladakh",

  // Yatras
  "badrinath-kedarnath-details-101": "badrinath-kedarnath-yatra",
  "chardham-yatra-package-details-102": "chardham-yatra",
  "do-dham-tungnath-details-111": "do-dham-and-tungnath-yatra",
  "kedarnath-trek-106": "kedarnath-yatra",
  "kedarnath-and-tungnath-trek": "kedarnath-and-tungnath-yatra",
  "madmaheshwar-trek-51": "madmaheshwar-yatra",
  "panch-kedar-55": "panch-kedar-trek",
  "rudrnath-trek-21": "rudranath-yatra",

  // Weekend trips
  "chakrata-3": "chakrata-trip",
  "harshil-gartang-gali-trip-5": "harshil-valley-trip",
  "mussoorie-trip-0001": "mussoorie-winter-escape",
  "shimla-0005": "shimla-tour",
  "meghalaya-910": "meghalaya-tour",

  // South journeys
  "south-coorg_chikmaglur-504": "coorg-chikmagalur",
  "south-gokarna-dandelli-502": "gokarna-dandeli",
  "south-otty-iisha-501": "ooty-coonoor",
};

/**
 * Packages the old site sold that the current catalogue does not list. Sending
 * these to the homepage would waste the link; each goes to the listing that now
 * covers the same ground, as close to the original as we can get.
 */
const RETIRED_PACKAGE_FALLBACKS: Record<string, string> = {
  "amarnath-yatra-6": LISTINGS.yatra,
  "mani-mahesh-005": LISTINGS.yatra,
  "shrikhand-mahadev-12": LISTINGS.yatra,
  "vaishno-devi-tour-5": LISTINGS.yatra,
  "bhrigu-lake-006": LISTINGS.treks,
  "chadar-trek-22": LISTINGS.treks,
  "black-peak-expedition-3": LISTINGS.treks,
  "friendship-peak-expedition-6": LISTINGS.treks,
  "south-kodaikanal-505": LISTINGS.backpacking,
  "south-pondicherry-503": LISTINGS.backpacking,
};

/** Retired standalone pages, matched on the whole normalised path. */
const LEGACY_PAGES: Record<string, string> = {
  "/about": "/about-us",
  "/aboutus": "/about-us",
  "/about-us/core-values": "/about-us",
  "/about-us/responsible-travel": "/about-us",
  "/about-us/why-travel-with-tripmysoul": "/about-us",
  "/contact": "/contact-us",
  "/contactus": "/contact-us",
  "/career": "/careers",
  "/blog": LISTINGS.blogs,
  "/articles": LISTINGS.blogs,
  "/faqs": "/about-us",
  "/search": LISTINGS.treks,
  "/upcoming-treks": LISTINGS.trending,
  "/trekking-club": LISTINGS.treks,
  "/rent-gear": "/rent",
  "/destinations": LISTINGS.treks,
  // Policies: the old site ran two spellings of each, neither hyphenated the
  // same way as the current `/policies/<slug>` pages.
  "/privacy-policy": "/policies/privacy-policy",
  "/privacypolicy": "/policies/privacy-policy",
  "/payment-policy": "/policies/payment-policy",
  "/paymentpolicy": "/policies/payment-policy",
  "/cancellation-policy": "/policies/cancellation-policy",
  "/cancellationpolicy": "/policies/cancellation-policy",
  "/terms-and-condition": "/policies/terms-conditions",
  "/terms-and-conditions": "/policies/terms-conditions",
  "/terms-condition": "/policies/terms-conditions",
  "/termcondition": "/policies/terms-conditions",
  "/terms-conditions/cookie-policy": "/policies/terms-conditions",
};

/**
 * Suffix swaps worth trying when a bare slug does not match the catalogue
 * outright. The old site and this one disagree on whether a package is a
 * "trek", a "yatra", a "tour" or a "trip" — `/har-ki-dun` is `har-ki-dun-trek`
 * here — and Google holds links written both ways.
 */
const SLUG_SUFFIXES = ["", "-trek", "-yatra", "-tour", "-trip"];

/** The catalogue page for a bare slug, trying the suffixes the old site used. */
function resolveSlugVariants(candidate: string): string | null {
  const bare = candidate.replace(/-(trek|yatra|tour|trip)$/, "");

  for (const stem of [candidate, bare]) {
    for (const suffix of SLUG_SUFFIXES) {
      const resolved = resolveDetailPath(`${stem}${suffix}`);
      if (resolved) return resolved;
    }
  }

  // `valley-of-flower` vs `valley-of-flowers`, `trips` vs `trip` — the old site
  // was inconsistent about the plural.
  const pluralised = bare.replace(/([a-z])$/, "$1s");
  return resolveDetailPath(`${pluralised}-trek`) ?? resolveDetailPath(pluralised);
}

/** The package page a legacy key names, or the listing that absorbed it. */
function resolvePackageKey(key: string): string | null {
  const slug = LEGACY_PACKAGE_KEYS[key];
  if (slug) {
    // The slug is the source of truth, not a hard-coded path: `resolveDetailPath`
    // follows the catalogue's own canonical choice, so a package that later
    // moves from /treks/… to /trips/… keeps these redirects correct.
    return resolveDetailPath(slug) ?? resolveSlugVariants(slug) ?? LISTINGS.treks;
  }
  return RETIRED_PACKAGE_FALLBACKS[key] ?? null;
}

/**
 * Where a URL from the old site should land today, or `null` when the path is
 * not one we recognise — in which case it should 404 rather than be guessed at.
 *
 * Resolution runs most-specific first: an exact retired page, then the package
 * key at the end of the path, then the category key, then the human-readable
 * slug segments. Nothing falls through to the homepage; the worst case is the
 * listing page the old section belonged to.
 */
export function resolveLegacyRedirect(pathname: string): string | null {
  const path = normalisePath(pathname);
  if (path === "" || path === "/") return null;

  const exact = LEGACY_PAGES[path];
  if (exact) return exact;

  // `/contact-us/index.html` — a page this app still has, under the filename
  // the old flat-file site served it as. Checked after `LEGACY_PAGES` so a
  // retired sub-page like `/about-us/core-values/index.html` still wins.
  const stripped = stripDocumentSuffix(pathname);
  if (stripped && isLivePath(stripped)) return stripped;

  const segments = path.split("/").filter(Boolean);
  if (segments.length === 0) return null;

  const last = segments[segments.length - 1];

  // `/trek/<key>`, and the trailing segment of every deep category URL.
  const byKey = resolvePackageKey(last);
  if (byKey) return byKey;

  // A category listing: `/weekend-getaways/weekend-gateway-104`.
  const categoryTarget = LEGACY_CATEGORY_KEYS[last];
  if (categoryTarget) return categoryTarget;

  // Deep URLs put the readable package slug second-to-last:
  // `/uttarakhand/uttarakhand-110/har-ki-dun/har-ki-dun-304`. Worth trying when
  // the key itself is unknown — a package added to the old site after our last
  // archive snapshot still resolves this way.
  if (segments.length >= 2) {
    const bySlug = resolveSlugVariants(segments[segments.length - 2]);
    if (bySlug) return bySlug;
  }

  // Flat `/<slug>`: a package (`/rupin-pass-trek`) or a region (`/himachal-pradesh`).
  if (segments.length === 1) {
    const region = REGIONS.find((r) => r.slug === last);
    if (region) return `/regions/${region.slug}`;

    const bySlug = resolveSlugVariants(last);
    if (bySlug) return bySlug;
  }

  // Nothing matched the tail, but the head may still name a retired section —
  // `/mansoon-treks/<something-we-never-listed>` still belongs on /treks.
  for (const segment of segments) {
    const sectionTarget = LEGACY_CATEGORY_KEYS[segment];
    if (sectionTarget) return sectionTarget;
  }

  return null;
}

export const LEGACY_URL_TEST_FIXTURES = {
  LEGACY_CATEGORY_KEYS,
  LEGACY_PACKAGE_KEYS,
  LEGACY_PAGES,
  RETIRED_PACKAGE_FALLBACKS,
};
