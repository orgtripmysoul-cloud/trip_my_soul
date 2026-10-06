import { notFound } from "next/navigation";
import type { Trek } from "@/data/db";
import { findTrek, TREK_CATALOGUE } from "@/data/trekCatalogue";
import { CANONICAL_TRIP_PATHS } from "@/data/trips";
import TrekDetailView from "@/components/trek-detail/TrekDetailView";
import { toCardTrek } from "@/lib/cardTrek";

type Params = { params: Promise<{ slug: string }> };

/**
 * Prerender every listing at build time so the full detail page — itinerary,
 * inclusions, FAQs, article — is in the static HTML. Slugs that the layout
 * redirects to a `/trips/...` page are left to render on demand.
 */
export function generateStaticParams() {
  return TREK_CATALOGUE.filter((t) => !CANONICAL_TRIP_PATHS[t.slug]).map((t) => ({
    slug: t.slug,
  }));
}

/**
 * Similar Treks: an editorial list where the listing names one, otherwise the
 * automatic match on region or difficulty.
 */
function similarTo(trek: Trek): Trek[] {
  if (trek.similarTreks?.length) {
    const picked = trek.similarTreks
      .filter((s) => s !== trek.slug)
      .map((s) => TREK_CATALOGUE.find((t) => t.slug === s))
      .filter((t): t is Trek => t !== undefined);
    if (picked.length > 0) return picked.slice(0, 4);
  }

  const matches = TREK_CATALOGUE.filter(
    (t) => t.slug !== trek.slug && (t.region === trek.region || t.difficulty === trek.difficulty)
  );
  return matches.length > 0
    ? matches.slice(0, 4)
    : TREK_CATALOGUE.filter((t) => t.slug !== trek.slug).slice(0, 4);
}

export default async function TrekDetailPage({ params }: Params) {
  const { slug } = await params;

  // `/yatra` and the wildlife listings link here too, so this resolves against
  // every catalogue rather than TREKS alone.
  const trek = findTrek(slug);

  // A real 404 (see ./not-found.tsx) rather than a 200 "not found" page, so
  // retired slugs drop out of the index instead of lingering as soft 404s.
  if (!trek) notFound();

  return (
    <TrekDetailView
      trek={trek}
      similar={similarTo(trek).map(toCardTrek)}
      totalCount={TREK_CATALOGUE.length}
      browseHref="/treks"
      noun="Trek"
    />
  );
}
