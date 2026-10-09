/**
 * Editorial line-ups behind the homepage quick-filter pills.
 *
 * A pill is not a query any more — it is a hand-picked list. Clicking one shows
 * exactly these trips, in exactly this order, and nothing else. Season months,
 * collection membership and the featured pinning all stop applying inside a
 * pill, because ops decides what belongs in "Winter" or "Weekend", not the
 * `months` array. The filter panel, the search box and the "all" view are
 * unchanged, so every trip is still reachable without a pill.
 *
 * Slugs resolve against the whole catalogue (treks, yatras, weekend and
 * backpacking trips), so a line-up can pull from any collection. A slug that
 * matches nothing is skipped silently — that is how the not-yet-written trips
 * below stay listed as intent without breaking the grid.
 */

export const CURATED_PILLS = [
  "Winters",
  "Spiritual",
  "Weekend",
  "Spring",
  "Summer",
  "Monsoon",
  "Autumn",
] as const;

export type CuratedPill = (typeof CURATED_PILLS)[number];

/**
 * Trips named in the source line-ups that have no catalogue entry yet. They are
 * kept here, out of the lists, so the gap is recorded rather than forgotten —
 * move each one into its lists once the trip is written up.
 *
 * TODO(content): Sandakphu, Bhrigu Lake, Dodital, Kareri Lake, Pin Bhaba,
 * Friendship Peak, Chandrakhani Pass and Jibhi.
 */
export const CURATED_MISSING = [
  "Sandakphu",
  "Bhrigu Lake",
  "Dodital",
  "Kareri Lake",
  "Pin Bhaba",
  "Friendship Peak",
  "Chandrakhani Pass",
  "Jibhi",
] as const;

/** Ordered slugs per pill. Order here is the order on screen. */
export const CURATED_CATEGORIES: Record<CuratedPill, string[]> = {
  Winters: [
    "kedarkantha-trek",
    "kuari-pass-trek",
    "pangarchulla-peak-trek",
    "brahmatal-trek",
    "dayara-bugyal-trek",
    "chopta-tungnath-trek",
    "nagtibba-trek",
    // "Kuari Pass with Pangarchulla Peak" — the combined itinerary.
    "pangarchulla-trek",
    "gulabi-kantha-trek",
  ],
  Spiritual: [
    "kedarnath-yatra",
    "kedarnath-badrinath",
    "kedarnath-badrinath-tungnath",
    "char-dham-yatra",
    "panch-kedar-yatra",
    "madmaheshwar-trek",
    "rudranath-trek",
    // Madmaheshwar + Rudranath + Kalpeshwar.
    "three-kedar-yatra",
    "chopta-tungnath-trek",
    "yulla-kanda-trek",
    "kartik-swami-trek",
    "adi-kailash-om-parvat-yatra",
  ],
  Weekend: [
    "nagtibba-trek",
    "chopta-tungnath-trek",
    "harshil-valley-trip",
    "kartik-swami-trek",
    "chakrata-trip",
    "manali-kasol",
    // Jibhi — no catalogue entry yet, see CURATED_MISSING.
    "bir-billing-paragliding-trek",
    "madmaheshwar-trek",
    "nainital-winter-trip",
    "khaliya-top-trek",
    "munsiyari-snow-trip",
  ],
  Spring: [
    "dayara-bugyal-trek",
    "har-ki-dun-trek",
    "chopta-tungnath-trek",
    "kuari-pass-trek",
    "brahmatal-trek",
    "sar-pass-trek",
    "ali-bedni-bugyal-trek",
    "pangarchulla-peak-trek",
  ],
  Summer: [
    "roopkund-yatra",
    "gaumukh-tapovan-trek",
    "rupin-pass-trek",
    "buran-ghati-pass-trek",
    "bali-pass-trek",
    "har-ki-dun-trek",
    "chopta-tungnath-trek",
    "hampta-pass-trek",
    "sar-pass-trek",
    // Bhrigu Lake — no catalogue entry yet.
    "beas-kund-trek",
    "ali-bedni-bugyal-trek",
    "kedartal-trek",
    // Dodital, Kareri Lake — no catalogue entries yet.
    "panch-kedar-trek",
  ],
  Monsoon: [
    "hampta-pass-trek",
    "valley-of-flowers-trek",
    // Pin Bhaba, Bhrigu Lake, Friendship Peak — no catalogue entries yet.
    "kashmir-great-lakes-trek",
    "tarsar-marsar-trek",
    // Chandrakhani Pass — no catalogue entry yet.
  ],
  Autumn: [
    "roopkund-yatra",
    // Sandakphu — no catalogue entry yet.
    "gaumukh-tapovan-trek",
    "rupin-pass-trek",
    "buran-ghati-pass-trek",
    "bali-pass-trek",
    "har-ki-dun-trek",
    "chopta-tungnath-trek",
    "dayara-bugyal-trek",
    "kedarkantha-trek",
    "phulara-ridge-trek",
    "ali-bedni-bugyal-trek",
    "brahmatal-trek",
    "kedartal-trek",
    "beas-kund-trek",
    // Bhrigu Lake — no catalogue entry yet.
    "panch-kedar-trek",
    "nagtibba-trek",
  ],
};

/** Sort key inside a pill: listed position, with anything unlisted last. */
export const curatedRank = (pill: CuratedPill, slug: string): number => {
  const index = CURATED_CATEGORIES[pill].indexOf(slug);
  return index === -1 ? Number.MAX_SAFE_INTEGER : index;
};
