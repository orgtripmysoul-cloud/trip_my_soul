import { notFound } from "next/navigation";
import TripDetailPage from "@/components/trip-detail/TripDetailPage";
import { BACKPACKING_TRIPS, getBackpackingTrip } from "@/data/trips";

type Params = { params: Promise<{ slug: string }> };

/** Prerender every trip so the full detail page is in the static HTML. */
export function generateStaticParams() {
  return BACKPACKING_TRIPS.map((trip) => ({ slug: trip.slug }));
}

export default async function BackpackingTripPage({ params }: Params) {
  const { slug } = await params;

  const trip = getBackpackingTrip(slug);
  if (!trip) notFound();

  return <TripDetailPage trip={trip} category="Backpacking Trip" />;
}
