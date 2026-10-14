import TripCatalogPage from "@/components/TripCatalogPage";
import { SOUTH_TRIPS } from "@/data/trips";

export default function SouthTripsPage() {
  return (
    <TripCatalogPage
      trips={SOUTH_TRIPS}
      eyebrow="Explore South"
      title="South India Trips"
      description="Backwaters, coffee hills, beaches and the Western Ghats — every South India trip we run, from weekend getaways to longer backpacking routes."
      counterLabel="trips"
      searchPlaceholder="Search South India trips (e.g. Munnar, Gokarna)..."
      emptyMessage="Try loosening your filters or resetting search to browse all South India trips."
    />
  );
}
