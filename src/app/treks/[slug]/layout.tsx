import type { Metadata } from "next";
import type { ReactNode } from "react";
import { redirect } from "next/navigation";

import type { Trek } from "@/data/db";
import { duplicateTrekCanonical, findTrek } from "@/data/trekCatalogue";
import { CANONICAL_TRIP_PATHS } from "@/data/trips";
import { buildMetadata } from "@/lib/seo";

/**
 * Prefers the listing's own copy. The composed fallback is deliberately factual
 * rather than invented — the same rule `tagline` is written under.
 */
function describe(trek: Trek): string {
  if (trek.tagline) return trek.tagline;
  if (trek.intro) return trek.intro;

  const duration = trek.days ? `${trek.days}-day ` : "";
  return (
    `${trek.name} — a ${duration}${trek.difficulty.toLowerCase()} ${trek.category.toLowerCase()} ` +
    `in ${trek.region}, starting from ${trek.startLocation}. See dates, itinerary, inclusions and fare.`
  );
}

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const trek = findTrek(slug);

  if (!trek) {
    return buildMetadata({
      title: "Trek Not Found",
      description: "This trek is no longer listed. Browse our current Himalayan expeditions instead.",
      path: `/treks/${slug}`,
    });
  }

  // A stub duplicating a populated listing points its canonical at the complete
  // page, so the two stop competing and the ranking signals consolidate there.
  const canonicalPath = duplicateTrekCanonical(slug) ?? `/treks/${slug}`;

  return buildMetadata({
    title: trek.name,
    description: describe(trek),
    path: canonicalPath,
    image: trek.heroImage,
  });
}

export default async function TrekLayout({
  children,
  params,
}: {
  children: ReactNode;
} & Params) {
  const { slug } = await params;

  // These slugs describe the same package as a fully-detailed /trips/... page.
  // Leaving them out of the sitemap stopped advertising them but did not stop
  // Google reaching them through old links, so redirect to the canonical page
  // and let the duplicate drop out of the index. Stub duplicates are handled
  // with a canonical tag instead — they still render.
  const supersededBy = CANONICAL_TRIP_PATHS[slug];
  if (supersededBy) {
    redirect(supersededBy);
  }

  return <>{children}</>;
}
