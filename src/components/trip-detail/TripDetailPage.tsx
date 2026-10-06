import TrekDetailView from "@/components/trek-detail/TrekDetailView";
import { BACKPACKING_TRIPS, WEEKEND_TRIPS, tripToTrek } from "@/data/trips";
import type { TripListingItem } from "@/data/trips";
import { toCardTrek } from "@/lib/cardTrek";

interface TripDetailPageProps {
  trip: TripListingItem;
  category: "Weekend Trip" | "Backpacking Trip";
}

/**
 * Trip detail page.
 *
 * Trips render through the same `TrekDetailView` as the treks — this component
 * only picks the catalogue a trip belongs to (for the "Similar Trips" rail and
 * the back link) and hands the listing over as a `Trek`.
 *
 * A server component: the lookup runs once on the server and the finished
 * page is in the HTML, rather than being resolved in the browser.
 */
export default function TripDetailPage({ trip, category }: TripDetailPageProps) {
  const isBackpacking = category === "Backpacking Trip";
  const catalogue = isBackpacking ? BACKPACKING_TRIPS : WEEKEND_TRIPS;
  const browseHref = isBackpacking ? "/backpacking-trips" : "/weekend-trips";

  const trek = tripToTrek(trip);

  // The trip's own related list wins; otherwise fall back to the same region or
  // grade, the way the treks rail does.
  const related = (trip.relatedSlugs ?? [])
    .map((slug) => catalogue.find((t) => t.slug === slug))
    .filter((t): t is TripListingItem => !!t);

  const rest = catalogue.filter(
    (t) =>
      t.slug !== trip.slug &&
      !related.some((r) => r.slug === t.slug) &&
      (t.region === trip.region || t.difficulty === trip.difficulty)
  );

  const picks = [...related, ...rest].slice(0, 4);
  const filled =
    picks.length > 0 ? picks : catalogue.filter((t) => t.slug !== trip.slug).slice(0, 4);

  const similar = filled.map((t) => toCardTrek(tripToTrek(t)));

  return (
    <TrekDetailView
      trek={trek}
      similar={similar}
      totalCount={catalogue.length}
      browseHref={browseHref}
      noun="Trip"
    />
  );
}
