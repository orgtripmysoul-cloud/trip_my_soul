import { TREKS, WILDLIFE, YATRAS } from "@/data/db";
import { ALL_TRIPS, CANONICAL_TRIP_PATHS } from "@/data/trips";

/**
 * Query params that only a real booking carries. `/treks/[slug]`'s Book Now
 * always appends `step=book` plus the chosen `batch` (see
 * `TrekDetailView.goToCheckout`); the rest are accepted so an older link or a
 * future entry point is never mistaken for a search-engine visit.
 *
 * A bare `/checkout?slug=…` — which is what Google indexed and still links to —
 * has none of them, and that is what the middleware redirects away.
 */
export const BOOKING_MARKER_PARAMS = ["step", "batch", "packageId", "pax", "price"] as const;

export function hasBookingSelection(params: URLSearchParams): boolean {
  return BOOKING_MARKER_PARAMS.some((name) => (params.get(name) ?? "").trim() !== "");
}

/**
 * Slugs that have been retired from the catalogue but are still live in
 * Google's index, pointing at the listing that absorbed them. Without this a
 * search visitor would be dropped on the homepage even though we know exactly
 * which page they wanted.
 *
 * Only add an entry when a slug is removed; once Search Console shows no hits
 * for it, the entry can go.
 */
const RETIRED_SLUG_ALIASES: Record<string, string> = {
  // Folded into the `spiti-valley` TREKS listing (see src/data/db.ts).
  "spiti-valley-yatra": "spiti-valley",
};

/**
 * The canonical detail page for a catalogue slug, resolved against the very
 * same data the detail pages render from, so a redirect can never land on a
 * "not found" page. Returns `null` for a slug nothing in the catalogue claims.
 */
export function resolveDetailPath(rawSlug: string | null | undefined): string | null {
  if (!rawSlug) return null;
  const slug = RETIRED_SLUG_ALIASES[rawSlug] ?? rawSlug;

  // A handful of `db.ts` slugs are thin duplicates of a fully-detailed trip.
  // `CANONICAL_TRIP_PATHS` is where the catalogue already records which page
  // wins, and cards across the site honour it — so this must too.
  const canonical = CANONICAL_TRIP_PATHS[slug];
  if (canonical) return canonical;

  if ([...TREKS, ...YATRAS, ...WILDLIFE].some((t) => t.slug === slug)) {
    return `/treks/${slug}`;
  }

  // Trips carry their own route (`/trips/weekend/…` vs `/trips/backpacking/…`),
  // so take the stored path rather than rebuilding it from the category label.
  const trip = ALL_TRIPS.find((t) => t.slug === slug);
  return trip?.detailsPath ?? null;
}
