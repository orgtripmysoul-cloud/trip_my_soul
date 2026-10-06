"use client";

import React, { useMemo } from "react";
import TrekDetailView from "@/components/trek-detail/TrekDetailView";
import { BACKPACKING_TRIPS, WEEKEND_TRIPS, tripToTrek } from "@/data/trips";
import type { TripListingItem } from "@/data/trips";
import type { Trek } from "@/data/db";
import { findTrek } from "@/data/trekCatalogue";

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
 */
export default function TripDetailPage({ trip, category }: TripDetailPageProps) {
  const isBackpacking = category === "Backpacking Trip";
  const catalogue = isBackpacking ? BACKPACKING_TRIPS : WEEKEND_TRIPS;
  const browseHref = isBackpacking ? "/backpacking-trips" : "/weekend-trips";

  const trek = useMemo(() => tripToTrek(trip), [trip]);

  // The trip's own related list wins; otherwise fall back to the same region or
  // grade, the way the treks rail does. A related slug is looked up in the trip
  // catalogues first — those carry a `detailsPath` — and in the trek catalogue
  // after, so a trip can be paired with a Himalayan trek and not just its own kind.
  const similar = useMemo(() => {
    const related = (trip.relatedSlugs ?? [])
      .map((slug) => {
        const asTrip =
          WEEKEND_TRIPS.find((t) => t.slug === slug) ??
          BACKPACKING_TRIPS.find((t) => t.slug === slug);
        return asTrip ? tripToTrek(asTrip) : findTrek(slug);
      })
      .filter((t): t is Trek => !!t && t.slug !== trip.slug);

    const rest = catalogue
      .filter(
        (t) =>
          t.slug !== trip.slug &&
          !related.some((r) => r.slug === t.slug) &&
          (t.region === trip.region || t.difficulty === trip.difficulty)
      )
      .map(tripToTrek);

    const picks = [...related, ...rest].slice(0, 4);
    if (picks.length > 0) return picks;

    return catalogue
      .filter((t) => t.slug !== trip.slug)
      .slice(0, 4)
      .map(tripToTrek);
  }, [catalogue, trip]);

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
