import type { Metadata } from "next";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";

import { WEEKEND_TRIPS } from "@/data/trips";
import { buildMetadata, noIndexMetadata } from "@/lib/seo";

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const trip = WEEKEND_TRIPS.find((t) => t.slug === slug);

  if (!trip) {
    // The layout 404s this path, so these tags exist only for the error
    // response — `noindex` keeps that body out of the index.
    return noIndexMetadata(
      "Trip Not Found",
      "This weekend trip is no longer listed. Browse our current weekend getaways instead.",
    );
  }

  return buildMetadata({
    title: `${trip.name} — ${trip.duration} Weekend Trip`,
    description: trip.intro ?? trip.tagline,
    path: `/trips/weekend/${slug}`,
    image: trip.heroImage,
  });
}

export default async function WeekendTripLayout({
  children,
  params,
}: { children: ReactNode } & Params) {
  const { slug } = await params;

  // Unknown slugs used to render "Trip not found" with HTTP 200 — a soft 404.
  // The page is a client component, so the status has to be set here.
  if (!WEEKEND_TRIPS.some((t) => t.slug === slug)) {
    notFound();
  }

  return <>{children}</>;
}
