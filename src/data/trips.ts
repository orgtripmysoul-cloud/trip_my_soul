import type { Trek } from "@/data/db";

export interface TripNavItem {
  name: string;
  slug: string;
  duration: string;
  heroImage: string;
  tagline: string;
}

/** A payment/city variant, e.g. "Full Payment - From Mysore". Each has its own price. */
export interface TripPackage {
  id: string;
  label: string;
  price: number;
  advanceAmount?: number;
}

/** One timed line inside a day, e.g. { time: "7:00 AM", text: "Depart from pickup point" }. */
export interface TripItineraryEntry {
  time?: string;
  text: string;
}

/** `day: 0` is the start/pickup day where the trip begins the night before. */
export interface TripItineraryDay {
  day: number;
  title: string;
  entries: TripItineraryEntry[];
}

export interface TripUsp {
  title: string;
  description: string;
}

export interface TripDestinationHighlight {
  name: string;
  blurb: string;
}

export interface TripGalleryImage {
  url: string;
  caption?: string;
}

export interface TripListingItem extends TripNavItem {
  region: string;
  startLocation: string;
  difficulty: string;
  days: number;
  nights: number;
  price: number;
  months: string[];
  themes: string[];
  category: string;
  detailsPath: string;

  // --- Detail-template fields. All optional; unpopulated sections render an empty state. ---

  // Header
  tripCode?: string;
  availability?: string;
  endLocation?: string;
  minAge?: number;
  maxAge?: number;
  maxGroupSize?: string;

  // Booking widget
  originalPrice?: number;
  batchDates?: string[];
  packages?: TripPackage[];

  // Overview
  intro?: string;
  usps?: TripUsp[];
  idealFor?: string;
  differentiators?: string[];
  importantNote?: string;
  destinationHighlights?: TripDestinationHighlight[];

  // Itinerary
  itinerary?: TripItineraryDay[];

  // Costing
  costIncludes?: string[];
  costExcludes?: string[];

  // Other info
  cancellationPolicy?: string;
  thingsToCarry?: string[];
  thingsToRemember?: string[];

  // Media & related
  gallery?: TripGalleryImage[];
  relatedSlugs?: string[];
}

function parseDuration(duration: string): { days: number; nights: number } {
  const nights = parseInt(duration.split("N")[0], 10);
  const days = parseInt(duration.split("/")[1]?.replace("D", "") ?? "0", 10);
  return { days, nights };
}

function toListingItem(
  item: TripNavItem,
  meta: Omit<TripListingItem, keyof TripNavItem | "days" | "nights" | "detailsPath"> & { detailsPath: string }
): TripListingItem {
  const { days, nights } = parseDuration(item.duration);
  return { ...item, ...meta, days, nights };
}

export const WEEKEND_TRIPS: TripListingItem[] = [
  toListingItem(
    {
      name: "Gokarna & Dandeli",
      slug: "gokarna-dandeli",
      duration: "2N/3D",
      heroImage: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1920&q=80",
      tagline: "Coastal sunsets, river rafting, and laid-back beach trails on the Karnataka coast.",
    },
    {
      region: "Karnataka",
      startLocation: "Gokarna",
      difficulty: "Easy",
      price: 8999,
      months: ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"],
      themes: ["Beach", "Adventure", "Couples"],
      category: "Weekend Trip",
      detailsPath: "/trips/weekend/gokarna-dandeli",
    }
  ),
  toListingItem(
    {
      name: "Coorg & Chikmagalur",
      slug: "coorg-chikmagalur",
      duration: "2N/3D",
      heroImage: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1920&q=80",
      tagline: "Coffee estates, misty hills, and waterfall hikes in the Western Ghats.",
    },
    {
      region: "Karnataka",
      startLocation: "Coorg",
      difficulty: "Easy",
      price: 9499,
      months: ["Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar"],
      themes: ["Meadow", "Couples", "Family with Kids"],
      category: "Weekend Trip",
      detailsPath: "/trips/weekend/coorg-chikmagalur",
    }
  ),
  toListingItem(
    {
      name: "Ooty & Coonoor",
      slug: "ooty-coonoor",
      duration: "2N/3D",
      heroImage: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1920&q=80",
      tagline: "Nilgiri toy train views, tea gardens, and cool hill-station escapes.",
    },
    {
      region: "Tamil Nadu",
      startLocation: "Mysore",
      difficulty: "Easy",
      price: 8999,
      months: ["Mar", "Apr", "May", "Jun", "Sep", "Oct", "Nov", "Dec"],
      themes: ["Meadow", "Family with Kids", "Couples"],
      category: "Weekend Trip",
      detailsPath: "/trips/weekend/ooty-coonoor",

      /* --- SAMPLE DATA -------------------------------------------------
         Worked example so the detail template can be reviewed end to end.
         Prices, dates and timings are illustrative — replace before this
         trip is promoted. Every other trip renders empty states instead.
         ------------------------------------------------------------- */
      tripCode: "TMS-WK-0037",
      availability: "Every Thu & Fri",
      endLocation: "Mysore",
      minAge: 18,
      maxGroupSize: "Max 2 Couples",
      originalPrice: 14999,
      batchDates: [
        "2026-09-03", "2026-09-04", "2026-09-10", "2026-09-11",
        "2026-09-17", "2026-09-18", "2026-09-24", "2026-09-25",
      ],
      packages: [
        { id: "advance-mysore", label: "Advance Pay — From Mysore", price: 2999, advanceAmount: 2999 },
        { id: "full-mysore", label: "Full Payment — From Mysore", price: 8999 },
        { id: "full-bengaluru", label: "Full Payment — From Bengaluru", price: 10499 },
      ],
      idealFor: "Couples and small groups wanting a slow hill weekend",
      intro:
        "Three days in the Nilgiris, without the checklist rush. You travel in a private vehicle with one other couple at most, stay somewhere quiet, and spend the days between tea slopes, a toy train ride, and viewpoints that are worth more than ten minutes each.",
      usps: [
        {
          title: "Private Vehicle",
          description: "Shared with at most one other couple — never a full tempo traveller, never a stranger in the middle seat.",
        },
        {
          title: "Complimentary Bed Decoration",
          description: "Arranged on your first night at no extra cost. A small touch, but it changes how the trip starts.",
        },
        {
          title: "Unhurried Days",
          description: "Four or five stops a day, not twelve. Long enough at each to actually sit down.",
        },
      ],
      differentiators: [
        "Maximum two couples per vehicle, so the trip stays quiet",
        "Stays booked for location over star rating — you wake up to the view",
        "A trip coordinator travels with you rather than calling from an office",
        "No forced shopping stops or commission-driven detours",
      ],
      importantNote:
        "We are honest about what we control. Stays, vehicle, coordinator and timings are ours to guarantee. Hill weather, Nilgiri traffic, toy train ticket availability and forest-department timings are not — if any of these shift the plan, your coordinator will rework the day with you on the spot rather than quietly dropping a stop.",
      destinationHighlights: [
        {
          name: "Ooty",
          blurb: "The Nilgiris' best-known hill station, and still worth it off-season. Tea slopes run right up to the road, and the botanical gardens are best walked early before the day crowd arrives.",
        },
        {
          name: "Coonoor",
          blurb: "Quieter than Ooty and better for it. Lamb's Rock and Dolphin's Nose look over the plains, and the tea factories here still run tours worth the stop.",
        },
        {
          name: "Pykara",
          blurb: "A lake and falls set inside a reserved forest belt about 20 km from Ooty. The boat ride is short; the drive through the shola forest to get there is the real reason to come.",
        },
      ],
      relatedSlugs: ["coorg-chikmagalur", "munnar", "gokarna-dandeli"],
    }
  ),
  toListingItem(
    {
      name: "Munnar",
      slug: "munnar",
      duration: "2N/3D",
      heroImage: "https://images.unsplash.com/photo-1593692892547-f762bc747e55?auto=format&fit=crop&w=1920&q=80",
      tagline: "Rolling tea plantations, wildlife spotting, and serene Kerala highlands.",
    },
    {
      region: "Kerala",
      startLocation: "Munnar",
      difficulty: "Easy",
      price: 9299,
      months: ["Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr"],
      themes: ["Meadow", "Couples", "Family with Kids"],
      category: "Weekend Trip",
      detailsPath: "/trips/weekend/munnar",
    }
  ),
];

export const BACKPACKING_TRIPS: TripListingItem[] = [
  toListingItem(
    {
      name: "Shimla & Manali",
      slug: "shimla-manali",
      duration: "4N/5D",
      heroImage: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1920&q=80",
      tagline: "Classic Himachal valleys, pine forests, and mountain town culture.",
    },
    {
      region: "Himachal Pradesh",
      startLocation: "Shimla",
      difficulty: "Easy-Moderate",
      price: 14999,
      months: ["Mar", "Apr", "May", "Jun", "Sep", "Oct", "Nov", "Dec"],
      themes: ["Snow", "Couples", "Family with Kids"],
      category: "Backpacking Trip",
      detailsPath: "/trips/backpacking/shimla-manali",
    }
  ),
  toListingItem(
    {
      name: "Kashmir",
      slug: "kashmir",
      duration: "4N/5D",
      heroImage: "https://images.unsplash.com/photo-1595815771617-1ff6b4e3251e?auto=format&fit=crop&w=1920&q=80",
      tagline: "Dal Lake shikaras, alpine meadows, and the crown of India.",
    },
    {
      region: "Jammu & Kashmir",
      startLocation: "Srinagar",
      difficulty: "Moderate",
      price: 16999,
      months: ["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct"],
      themes: ["Lakes", "Meadow", "Couples"],
      category: "Backpacking Trip",
      detailsPath: "/trips/backpacking/kashmir",
    }
  ),
  toListingItem(
    {
      name: "Rishikesh & Mussoorie",
      slug: "rishikesh-mussoorie",
      duration: "4N/5D",
      heroImage: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1920&q=80",
      tagline: "Ganga ghats, yoga retreats, and colonial hill-station charm.",
    },
    {
      region: "Uttarakhand",
      startLocation: "Rishikesh",
      difficulty: "Easy-Moderate",
      price: 12999,
      months: ["Mar", "Apr", "May", "Jun", "Sep", "Oct", "Nov"],
      themes: ["Waterfall", "Beginner", "Family with Kids"],
      category: "Backpacking Trip",
      detailsPath: "/trips/backpacking/rishikesh-mussoorie",
    }
  ),
  toListingItem(
    {
      name: "Meghalaya",
      slug: "meghalaya",
      duration: "5N/6D",
      heroImage: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=1920&q=80",
      tagline: "Living root bridges, crystal rivers, and the abode of clouds.",
    },
    {
      region: "Meghalaya",
      startLocation: "Shillong",
      difficulty: "Moderate",
      price: 17999,
      months: ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May"],
      themes: ["Waterfall", "Off-Beat", "Adventure"],
      category: "Backpacking Trip",
      detailsPath: "/trips/backpacking/meghalaya",
    }
  ),
  toListingItem(
    {
      name: "Leh Ladakh",
      slug: "leh-ladakh",
      duration: "6N/7D",
      heroImage: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1920&q=80",
      tagline: "High-altitude passes, monasteries, and moon-like landscapes.",
    },
    {
      region: "Ladakh",
      startLocation: "Leh",
      difficulty: "Moderate-Difficult",
      price: 21999,
      months: ["May", "Jun", "Jul", "Aug", "Sep", "Oct"],
      themes: ["Off-Beat", "Summit a Peak", "Adventure"],
      category: "Backpacking Trip",
      detailsPath: "/trips/backpacking/leh-ladakh",
    }
  ),
  toListingItem(
    {
      name: "Spiti Valley",
      slug: "spiti-valley",
      duration: "7N/8D",
      heroImage: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1920&q=80",
      tagline: "Remote Himalayan villages, ancient gompas, and rugged desert mountains.",
    },
    {
      region: "Himachal Pradesh",
      startLocation: "Manali",
      difficulty: "Difficult",
      price: 24999,
      months: ["May", "Jun", "Jul", "Aug", "Sep", "Oct"],
      themes: ["Off-Beat", "Snow", "Adventure"],
      category: "Backpacking Trip",
      detailsPath: "/trips/backpacking/spiti-valley",
    }
  ),
  toListingItem(
    {
      name: "Kerala",
      slug: "kerala",
      duration: "5N/4D",
      heroImage: "https://images.unsplash.com/photo-1602216050166-0354fe7992ec?auto=format&fit=crop&w=1920&q=80",
      tagline: "Backwaters, spice trails, and God's Own Country at an easy pace.",
    },
    {
      region: "Kerala",
      startLocation: "Kochi",
      difficulty: "Easy",
      price: 15999,
      months: ["Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar"],
      themes: ["Lakes", "Couples", "Family with Kids"],
      category: "Backpacking Trip",
      detailsPath: "/trips/backpacking/kerala",
    }
  ),
];

export function tripToTrek(trip: TripListingItem): Trek {
  return {
    slug: trip.slug,
    name: trip.name,
    price: trip.price,
    days: trip.days,
    nights: trip.nights,
    region: trip.region,
    category: trip.category,
    startLocation: trip.startLocation,
    difficulty: trip.difficulty,
    months: trip.months,
    themes: trip.themes,
  };
}

const SEASON_MAP: Record<string, string[]> = {
  Winter: ["Dec", "Jan", "Feb"],
  Spring: ["Mar", "Apr"],
  Summer: ["May", "Jun"],
  Monsoon: ["Jul", "Aug"],
  Autumn: ["Sep", "Oct", "Nov"],
};

const DURATION_BUCKETS = [
  { label: "Short (1-4 Days)", match: (days: number) => days <= 4 },
  { label: "Medium (5-7 Days)", match: (days: number) => days >= 5 && days <= 7 },
  { label: "Long (8-10 Days)", match: (days: number) => days >= 8 && days <= 10 },
  { label: "Expedition (11+ Days)", match: (days: number) => days >= 11 },
];

export function deriveFilterOptionsFromTrips(trips: TripListingItem[]) {
  const trekList = trips.map(tripToTrek);

  const regions = [...new Set(trekList.map((t) => t.region))].sort();
  const difficulties = [...new Set(trekList.map((t) => t.difficulty))].sort();
  const months = [...new Set(trekList.flatMap((t) => t.months))].sort(
    (a, b) =>
      ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].indexOf(a) -
      ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].indexOf(b)
  );
  const themes = [...new Set(trekList.flatMap((t) => t.themes))].sort();
  const seasons = Object.keys(SEASON_MAP).filter((season) =>
    trekList.some((t) => t.months.some((m) => SEASON_MAP[season].includes(m)))
  );
  const duration = DURATION_BUCKETS.filter((bucket) =>
    trekList.some((t) => bucket.match(typeof t.days === "number" ? t.days : parseInt(String(t.days ?? "0"), 10)))
  ).map((b) => b.label);

  return { region: regions, difficulty: difficulties, months, themes, seasons, duration };
}

export function deriveQuickFilters(trips: TripListingItem[], selectedFilters: {
  region: string[];
  seasons: string[];
  difficulty: string[];
  themes: string[];
}, isAnyFilterActive: boolean, onReset: () => void, onQuickFilter: (category: "region" | "seasons" | "difficulty" | "themes", value: string) => void) {
  const options = deriveFilterOptionsFromTrips(trips);
  const pills: { label: string; action: () => void; active: boolean }[] = [
    { label: "All", action: onReset, active: !isAnyFilterActive },
  ];

  options.region.forEach((region) => {
    pills.push({
      label: region,
      action: () => onQuickFilter("region", region),
      active: selectedFilters.region.includes(region),
    });
  });

  if (options.seasons.includes("Winter")) {
    pills.push({
      label: "Winter",
      action: () => onQuickFilter("seasons", "Winter"),
      active: selectedFilters.seasons.includes("Winter"),
    });
  }
  if (options.seasons.includes("Summer")) {
    pills.push({
      label: "Summer",
      action: () => onQuickFilter("seasons", "Summer"),
      active: selectedFilters.seasons.includes("Summer"),
    });
  }
  if (options.difficulty.some((d) => d.toLowerCase().includes("easy"))) {
    pills.push({
      label: "Easy Treks",
      action: () => onQuickFilter("difficulty", "Easy"),
      active: selectedFilters.difficulty.includes("Easy"),
    });
  }
  if (options.themes.includes("Family with Kids")) {
    pills.push({
      label: "Family Friendly",
      action: () => onQuickFilter("themes", "Family with Kids"),
      active: selectedFilters.themes.includes("Family with Kids"),
    });
  }

  return pills;
}

export function getWeekendTrip(slug: string): TripListingItem | undefined {
  return WEEKEND_TRIPS.find((t) => t.slug === slug);
}

export function getBackpackingTrip(slug: string): TripListingItem | undefined {
  return BACKPACKING_TRIPS.find((t) => t.slug === slug);
}
