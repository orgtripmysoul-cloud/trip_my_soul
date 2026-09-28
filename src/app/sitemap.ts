import type { MetadataRoute } from "next";

import { blogArticles } from "@/data/blogArticles";
import { REGIONS, TREKS, YATRAS } from "@/data/db";
import { BACKPACKING_TRIPS, CANONICAL_TRIP_PATHS, WEEKEND_TRIPS } from "@/data/trips";

/**
 * Canonical origin, `www` included: the apex 308-redirects to `www`, so every
 * URL here has to carry the host Google will actually land on — otherwise each
 * crawl of each URL pays for a redirect hop.
 */
export const BASE_URL = "https://www.tripmysoul.in";

type Entry = MetadataRoute.Sitemap[number];

/** Listing and landing pages — the entry points crawlers should hit most often. */
const STATIC_ROUTES: { path: string; priority: number; changeFrequency: Entry["changeFrequency"] }[] = [
  { path: "/", priority: 1, changeFrequency: "daily" },
  { path: "/treks", priority: 0.8, changeFrequency: "daily" },
  { path: "/blogs", priority: 0.8, changeFrequency: "daily" },
  { path: "/weekend-trips", priority: 0.8, changeFrequency: "weekly" },
  { path: "/backpacking-trips", priority: 0.8, changeFrequency: "weekly" },
  { path: "/premium-trips", priority: 0.8, changeFrequency: "weekly" },
  { path: "/yatra", priority: 0.8, changeFrequency: "weekly" },
  { path: "/summer-camps", priority: 0.8, changeFrequency: "weekly" },
  { path: "/learning-programs", priority: 0.8, changeFrequency: "weekly" },
  { path: "/corporate-expeditions", priority: 0.8, changeFrequency: "weekly" },
  { path: "/heal-himala", priority: 0.8, changeFrequency: "weekly" },
  { path: "/compare-treks", priority: 0.8, changeFrequency: "weekly" },
  { path: "/cabs", priority: 0.8, changeFrequency: "weekly" },
  { path: "/rent", priority: 0.8, changeFrequency: "weekly" },
  { path: "/store", priority: 0.8, changeFrequency: "weekly" },
  { path: "/updates", priority: 0.8, changeFrequency: "weekly" },
  { path: "/about-us", priority: 0.6, changeFrequency: "monthly" },
  { path: "/contact-us", priority: 0.6, changeFrequency: "monthly" },
  { path: "/careers", priority: 0.6, changeFrequency: "monthly" },
  { path: "/suggest-a-trek", priority: 0.6, changeFrequency: "monthly" },
];

/**
 * Policy slugs handled by the `/policies/[slug]` switch. That page is a client
 * component with the copy inlined, so there is no data module to import from —
 * keep this in step with the cases there and the Footer links.
 */
const POLICY_SLUGS = [
  "payment-policy",
  "cancellation-policy",
  "terms-conditions",
  "privacy-policy",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const entry = (
    path: string,
    priority: number,
    changeFrequency: Entry["changeFrequency"],
  ): Entry => ({
    url: `${BASE_URL}${path}`,
    lastModified,
    changeFrequency,
    priority,
  });

  const staticEntries = STATIC_ROUTES.map((route) =>
    entry(route.path, route.priority, route.changeFrequency),
  );

  // A package superseded by a /trips/... page is listed there only, so each one
  // appears in the sitemap exactly once at its canonical URL.
  const trekEntries = [...TREKS, ...YATRAS]
    .filter((trek) => !(trek.slug in CANONICAL_TRIP_PATHS))
    .map((trek) => entry(`/treks/${trek.slug}`, 0.6, "weekly"));

  const regionEntries = REGIONS.map((region) =>
    entry(`/regions/${region.slug}`, 0.6, "weekly"),
  );

  const blogEntries = blogArticles.map((article) =>
    entry(`/blogs/${article.slug}`, 0.6, "monthly"),
  );

  const weekendTripEntries = WEEKEND_TRIPS.map((trip) =>
    entry(`/trips/weekend/${trip.slug}`, 0.6, "weekly"),
  );

  const backpackingTripEntries = BACKPACKING_TRIPS.map((trip) =>
    entry(`/trips/backpacking/${trip.slug}`, 0.6, "weekly"),
  );

  const policyEntries = POLICY_SLUGS.map((slug) =>
    entry(`/policies/${slug}`, 0.3, "yearly"),
  );

  return [
    ...staticEntries,
    ...trekEntries,
    ...regionEntries,
    ...blogEntries,
    ...weekendTripEntries,
    ...backpackingTripEntries,
    ...policyEntries,
  ];
}
