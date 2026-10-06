import type { Trek } from "@/data/db";

/**
 * Trims a listing to the fields `TrekCard` and `TrekSimilar` actually read.
 *
 * Server components pass their props to these client cards inside the page's
 * HTML, so handing over the whole `Trek` (itinerary, FAQs, article…) would
 * ship every listed trek's full content in the payload. Cards only need this.
 */
export function toCardTrek(trek: Trek): Trek {
  return {
    slug: trek.slug,
    name: trek.name,
    tagline: trek.tagline,
    price: trek.price,
    days: trek.days,
    nights: trek.nights,
    region: trek.region,
    category: trek.category,
    startLocation: trek.startLocation,
    difficulty: trek.difficulty,
    months: trek.months,
    themes: trek.themes,
    maxAltitude: trek.maxAltitude,
    heroImage: trek.heroImage,
    detailsPath: trek.detailsPath,
  };
}
