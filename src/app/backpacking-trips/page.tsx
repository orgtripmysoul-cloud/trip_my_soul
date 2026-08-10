import TripCatalogPage from "@/components/TripCatalogPage";
import { BACKPACKING_TRIPS } from "@/data/trips";

export default function BackpackingTripsPage() {
  return (
    <TripCatalogPage
      trips={BACKPACKING_TRIPS}
      eyebrow="Multi-Day Adventures"
      title="Backpacking Trips"
      description="Immersive 4–8 day backpacking journeys across the Himalayas, Northeast, and beyond. Explore valleys, cultures, and trails at your own pace."
      counterLabel="trips"
      searchPlaceholder="Search backpacking trips (e.g. Ladakh, Meghalaya)..."
      emptyMessage="Try loosening your filters or resetting search to browse all backpacking adventures."
    />
  );
}
