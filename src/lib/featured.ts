/**
 * Treks whose detail pages have been fully written up. They pin to the top of
 * every catalogue listing so the finished content is what a visitor meets
 * first; everything after them falls back to the selected sort.
 */

/** Pinned slugs, in the order they should appear. */
export const FEATURED_TREK_SLUGS = [
  "kuari-pass-trek",
  "kedarkantha-trek",
  "brahmatal-trek",
  "chopta-tungnath-trek",
] as const;

const FEATURED_RANK = new Map<string, number>(
  FEATURED_TREK_SLUGS.map((slug, index) => [slug, index])
);

/** Sort key: pinned treks keep their listed order, the rest tie at the end. */
export const featuredRank = (slug: string): number =>
  FEATURED_RANK.get(slug) ?? Number.MAX_SAFE_INTEGER;
