import type { Metadata } from "next";
import type { ReactNode } from "react";

import { REGIONS } from "@/data/db";
import { buildMetadata } from "@/lib/seo";

type Params = { params: Promise<{ region: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { region: slug } = await params;
  const region = REGIONS.find((r) => r.slug === slug);

  if (!region) {
    return buildMetadata({
      title: "Region Not Found",
      description: "This region is not listed. Browse our Himalayan trekking regions instead.",
      path: `/regions/${slug}`,
    });
  }

  return buildMetadata({
    title: `Treks in ${region.name}`,
    description: region.description,
    path: `/regions/${slug}`,
    image: region.image,
  });
}

export default function RegionLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
