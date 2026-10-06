import type { Metadata } from "next";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";

import { REGIONS } from "@/data/db";
import { buildMetadata, noIndexMetadata } from "@/lib/seo";

type Params = { params: Promise<{ region: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { region: slug } = await params;
  const region = REGIONS.find((r) => r.slug === slug);

  if (!region) {
    // The layout 404s this path, so these tags exist only for the error
    // response — `noindex` keeps that body out of the index.
    return noIndexMetadata(
      "Region Not Found",
      "This region is not listed. Browse our Himalayan trekking regions instead.",
    );
  }

  return buildMetadata({
    title: `Treks in ${region.name}`,
    description: region.description,
    path: `/regions/${slug}`,
    image: region.image,
  });
}

export default async function RegionLayout({
  children,
  params,
}: { children: ReactNode } & Params) {
  const { region: slug } = await params;

  // Unknown regions used to render "Region not found" with HTTP 200 — a soft
  // 404. The page is a client component, so the status has to be set here.
  if (!REGIONS.some((r) => r.slug === slug)) {
    notFound();
  }

  return <>{children}</>;
}
