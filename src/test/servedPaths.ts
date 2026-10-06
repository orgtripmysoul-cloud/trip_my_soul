import { REGIONS } from "@/data/db";
import { POLICY_PAGES } from "@/data/policies";
import { blogArticles } from "@/data/blogArticles";
import { findTrek } from "@/data/trekCatalogue";
import { BACKPACKING_TRIPS, WEEKEND_TRIPS } from "@/data/trips";

/**
 * Shared by the sitemap and legacy-redirect suites: both need to assert that a
 * path this site advertises — in `sitemap.xml` or as a 301 target — is one the
 * app actually renders with HTTP 200.
 *
 * Deliberately an explicit list rather than a glob over `src/app`: a typo'd
 * path that happens to match a directory name is exactly the failure these
 * suites exist to catch.
 */
const STATIC_ROUTES = new Set([
  "/",
  "/treks",
  "/trips",
  "/weekend-trips",
  "/backpacking-trips",
  "/premium-trips",
  "/yatra",
  "/blogs",
  "/about-us",
  "/contact-us",
  "/careers",
  "/compare-treks",
  "/corporate-expeditions",
  "/heal-himala",
  "/learning-programs",
  "/summer-camps",
  "/suggest-a-trek",
  "/updates",
  "/store",
  "/rent",
  "/cabs",
]);

/** True when this app renders `path` with HTTP 200. Query strings are ignored. */
export function isServedPath(path: string): boolean {
  const [pathname] = path.split("?");

  if (STATIC_ROUTES.has(pathname)) return true;

  const matchers: [RegExp, (slug: string) => boolean][] = [
    [/^\/treks\/(.+)$/, (slug) => Boolean(findTrek(slug))],
    [/^\/trips\/weekend\/(.+)$/, (slug) => WEEKEND_TRIPS.some((t) => t.slug === slug)],
    [/^\/trips\/backpacking\/(.+)$/, (slug) => BACKPACKING_TRIPS.some((t) => t.slug === slug)],
    [/^\/regions\/(.+)$/, (slug) => REGIONS.some((r) => r.slug === slug)],
    [/^\/policies\/(.+)$/, (slug) => POLICY_PAGES.some((p) => p.slug === slug)],
    [/^\/blogs\/(.+)$/, (slug) => blogArticles.some((a) => a.slug === slug)],
  ];

  for (const [pattern, exists] of matchers) {
    const match = pattern.exec(pathname);
    if (match) return exists(match[1]);
  }

  return false;
}
