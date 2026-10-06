/**
 * Treks, yatras and trips whose detail pages have been fully written up from
 * source material (real itineraries, pricing, FAQs) rather than placeholders.
 * They pin to the top of every catalogue listing — home, treks, yatra,
 * weekend-trips, backpacking-trips — so the finished content is what a
 * visitor meets first; everything after them falls back to the selected sort.
 */

/** Pinned slugs, in the order they should appear. */
export const FEATURED_TREK_SLUGS = [
  // Trips with their own real photo galleries — lead every listing
  "madmaheshwar-trek",
  "rudranath-trek",
  "kedarnath-yatra",
  "kedarnath-badrinath",
  "kedarnath-badrinath-tungnath",
  // Himalayan treks
  "kuari-pass-trek",
  "kedarkantha-trek",
  "brahmatal-trek",
  "buran-ghati-pass-trek",
  "har-ki-dun-trek",
  "bali-pass-trek",
  // Yatras
  "chopta-tungnath-trek",
  "chopta-tungnath-trek-delhi",
  "char-dham-yatra",
  "panch-kedar-yatra",
  "three-kedar-yatra",
  "auli-yatra",
  // Weekend trips
  "yulla-kanda-trek",
  // Backpacking trips
  "kerala-special",
  "kerala-thekkady",
] as const;

const FEATURED_RANK = new Map<string, number>(
  FEATURED_TREK_SLUGS.map((slug, index) => [slug, index])
);

/** Sort key: pinned treks keep their listed order, the rest tie at the end. */
export const featuredRank = (slug: string): number =>
  FEATURED_RANK.get(slug) ?? Number.MAX_SAFE_INTEGER;
