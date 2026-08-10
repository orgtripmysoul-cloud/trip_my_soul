import TripCatalogPage from "@/components/TripCatalogPage";
import { WEEKEND_TRIPS } from "@/data/trips";

export default function WeekendTripsPage() {
  return (
    <TripCatalogPage
      trips={WEEKEND_TRIPS}
      eyebrow="Short Getaways"
      title="Weekend Trips"
      description="Quick 2–3 day escapes to beaches, coffee hills, and hill stations across South India. Perfect for a refreshing weekend reset."
      counterLabel="trips"
      searchPlaceholder="Search weekend trips (e.g. Gokarna, Munnar)..."
      emptyMessage="Try loosening your filters or resetting search to browse all weekend getaways."
    />
  );
}
