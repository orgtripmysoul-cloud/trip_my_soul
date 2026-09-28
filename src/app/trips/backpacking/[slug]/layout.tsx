import type { Metadata } from "next";
import type { ReactNode } from "react";

import { BACKPACKING_TRIPS } from "@/data/trips";
import { buildMetadata } from "@/lib/seo";

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const trip = BACKPACKING_TRIPS.find((t) => t.slug === slug);

  if (!trip) {
    return buildMetadata({
      title: "Trip Not Found",
      description: "This backpacking trip is no longer listed. Browse our current backpacking routes instead.",
      path: `/trips/backpacking/${slug}`,
    });
  }

  return buildMetadata({
    title: `${trip.name} — ${trip.duration} Backpacking Trip`,
    description: trip.intro ?? trip.tagline,
    path: `/trips/backpacking/${slug}`,
    image: trip.heroImage,
  });
}

export default function BackpackingTripLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
