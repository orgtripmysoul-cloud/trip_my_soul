import type { Trek } from "@/data/db";
import { TREKS, WILDLIFE, YATRAS } from "@/data/db";
import { CANONICAL_TRIP_PATHS } from "@/data/trips";

/**
 * Every catalogue `/treks/[slug]` resolves against, in the order the page reads
 * them. Import this rather than re-spreading the three lists, so a new
 * catalogue reaches the page, the sitemap and the metadata at once.
 */
export const TREK_CATALOGUE: Trek[] = [...TREKS, ...YATRAS, ...WILDLIFE];

export function findTrek(slug: string): Trek | undefined {
  return TREK_CATALOGUE.find((t) => t.slug === slug);
}

/**
 * A listing with neither a fare nor a duration has no publishable substance —
 * these are the `TODO(content)` placeholders in `YATRAS`.
 */
function isUnpublishedStub(trek: Trek): boolean {
  return trek.price == null && trek.days == null;
}

/**
 * Where a `/treks/[slug]` page should point search engines instead of itself,
 * or null when the page is already the canonical one.
 *
 * Two distinct cases, deliberately treated differently:
 *
 * 1. `CANONICAL_TRIP_PATHS` — the package genuinely lives at a `/trips/...`
 *    page now. The old URL redirects.
 * 2. A stub sharing its name with a fully-populated twin, e.g.
 *    `bali-pass-yatra` against `bali-pass-trek`. Both render, so a redirect
 *    would be too blunt; these carry a canonical tag to the complete page and
 *    stay out of the sitemap until someone fills the content in.
 */
export function duplicateTrekCanonical(slug: string): string | null {
  const supersededBy = CANONICAL_TRIP_PATHS[slug];
  if (supersededBy) return supersededBy;

  const self = findTrek(slug);
  if (!self || !isUnpublishedStub(self)) return null;

  const twin = TREK_CATALOGUE.find(
    (t) => t.slug !== slug && t.name === self.name && !isUnpublishedStub(t),
  );
  return twin ? `/treks/${twin.slug}` : null;
}

/** Listings worth advertising: one entry per package, stubs left out. */
export function indexableTreks(): Trek[] {
  return TREK_CATALOGUE.filter((t) => duplicateTrekCanonical(t.slug) === null);
}
