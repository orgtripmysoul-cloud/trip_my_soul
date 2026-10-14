import type { MetadataRoute } from "next";

import { blogArticles } from "@/data/blogArticles";
import { POLICY_PAGES } from "@/data/policies";
import { REGIONS } from "@/data/db";
import { indexableTreks } from "@/data/trekCatalogue";
import { BACKPACKING_TRIPS, WEEKEND_TRIPS } from "@/data/trips";
import { SITE_URL } from "@/lib/seo";

const BASE_URL = SITE_URL;

type Entry = MetadataRoute.Sitemap[number];

/** Listing and landing pages — the entry points crawlers should hit most often. */
const STATIC_ROUTES: { path: string; priority: number; changeFrequency: Entry["changeFrequency"] }[] = [
  { path: "/", priority: 1, changeFrequency: "daily" },
  { path: "/treks", priority: 0.8, changeFrequency: "daily" },
  { path: "/blogs", priority: 0.8, changeFrequency: "daily" },
  { path: "/weekend-trips", priority: 0.8, changeFrequency: "weekly" },
  { path: "/backpacking-trips", priority: 0.8, changeFrequency: "weekly" },
  { path: "/south-trips", priority: 0.8, changeFrequency: "weekly" },
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

  // One entry per package: `indexableTreks` drops anything superseded by a
  // /trips/... page and any unpublished stub duplicating a populated listing,
  // so nothing is advertised at two URLs.
  const trekEntries = indexableTreks().map((trek) =>
    entry(`/treks/${trek.slug}`, 0.6, "weekly"),
  );

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

  const policyEntries = POLICY_PAGES.map((policy) =>
    entry(`/policies/${policy.slug}`, 0.3, "yearly"),
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
