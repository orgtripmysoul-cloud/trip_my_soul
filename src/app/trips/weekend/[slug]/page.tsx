import { notFound } from "next/navigation";
import TripDetailPage from "@/components/trip-detail/TripDetailPage";
import { WEEKEND_TRIPS, getWeekendTrip } from "@/data/trips";

type Params = { params: Promise<{ slug: string }> };

/** Prerender every trip so the full detail page is in the static HTML. */
export function generateStaticParams() {
  return WEEKEND_TRIPS.map((trip) => ({ slug: trip.slug }));
}

export default async function WeekendTripPage({ params }: Params) {
  const { slug } = await params;

  const trip = getWeekendTrip(slug);
  if (!trip) notFound();

  return <TripDetailPage trip={trip} category="Weekend Trip" />;
}
