import type { Metadata } from "next";
import type { ReactNode } from "react";

import { WEEKEND_TRIPS } from "@/data/trips";
import { buildMetadata } from "@/lib/seo";

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const trip = WEEKEND_TRIPS.find((t) => t.slug === slug);

  if (!trip) {
    return buildMetadata({
      title: "Trip Not Found",
      description: "This weekend trip is no longer listed. Browse our current weekend getaways instead.",
      path: `/trips/weekend/${slug}`,
    });
  }

  return buildMetadata({
    title: `${trip.name} — ${trip.duration} Weekend Trip`,
    description: trip.intro ?? trip.tagline,
    path: `/trips/weekend/${slug}`,
    image: trip.heroImage,
  });
}

export default function WeekendTripLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
