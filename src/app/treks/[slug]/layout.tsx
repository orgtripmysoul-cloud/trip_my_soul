import type { Metadata } from "next";
import type { ReactNode } from "react";
import { notFound, redirect } from "next/navigation";

import type { Trek } from "@/data/db";
import { duplicateTrekCanonical, findTrek } from "@/data/trekCatalogue";
import { CANONICAL_TRIP_PATHS } from "@/data/trips";
import { buildMetadata, noIndexMetadata } from "@/lib/seo";

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
    // The layout 404s this path, so these tags exist only for the error
    // response — `noindex` keeps that body out of the index.
    return noIndexMetadata(
      "Trek Not Found",
      "This trek is no longer listed. Browse our current Himalayan expeditions instead.",
    );
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

  // A slug nothing in the catalogue claims used to render a "Trek not found"
  // screen with HTTP 200 — a soft 404, which Google treats as a thin duplicate
  // of every other missing trek and holds in the index. The page itself is a
  // client component and cannot set a status, so the check belongs here.
  // `middleware.ts` has already had its chance to 301 a known old slug.
  if (!findTrek(slug)) {
    notFound();
  }

  return <>{children}</>;
}
