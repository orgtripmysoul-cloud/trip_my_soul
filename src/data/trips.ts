import type {
  ArticleContent,
  EquipmentGroup,
  ExternalReview,
  HowToReach,
  IconBullet,
  ItineraryDay,
  Trek,
} from "@/data/db";
import {
  CONFIRMATION_POLICY,
  HIMALAYAN_TREK_EXCLUSIONS,
  HIMALAYAN_TREK_PACKING_LIST,
  TIERED_CANCELLATION_POLICY,
  TRANSPORT_BY_GROUP_SIZE,
  TREK_RENTAL_GEAR,
  TRIP_BOOKING_TERMS,
  TRIP_CANCELLATION_POLICY,
  TRIP_CONTACT_NUMBERS,
  TRIP_GROUND_RULES,
  TROPICAL_PACKING_LIST,
} from "@/data/tripShared";

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
  /** Pricing-table columns: group size, vehicle and room sharing. */
  paxLabel?: string;
  vehicle?: string;
  sharing?: string;
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
  /** null renders as "Price on request" — used when the source has no figure. */
  price: number | null;
  months: string[];
  themes: string[];
  category: string;
  detailsPath: string;

  /**
   * Other names the same package is sold or searched under, e.g. "Madmaheshwar"
   * for Madhyamaheshwar. Feeds catalogue search so one canonical trip answers
   * every spelling rather than being duplicated per variant.
   */
  alternateNames?: string[];
  /** Highest point, only where the source itinerary prints a figure. */
  altitude?: string;

  // --- Detail-template fields. All optional; unpopulated sections render an empty state. ---

  // Header
  tripCode?: string;
  availability?: string;
  endLocation?: string;
  minAge?: number;
  maxAge?: number;
  maxGroupSize?: string;
  /** Extra frames for the hero slideshow, in addition to `heroImage`. */
  heroImages?: string[];

  // Booking widget
  originalPrice?: number;
  batchDates?: string[];
  packages?: TripPackage[];

  // Overview
  intro?: string;
  /** Headline attractions, as listed on the itinerary PDF. */
  highlights?: string[];
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

  // Eligibility & travel info
  eligibilityCriteria?: IconBullet[];
  fitnessCriteria?: IconBullet[];
  howToReach?: HowToReach;
  faqs?: { title: string; description: string }[];
  /** Long-form written guide, shown in the Article section of the detail page. */
  article?: ArticleContent;

  // Other info
  cancellationPolicy?: string;
  thingsToCarry?: string[];
  thingsToRemember?: string[];

  // Media & related
  gallery?: TripGalleryImage[];
  relatedSlugs?: string[];
  /** Reviews published on another platform, shown in the Trek Reviews section. */
  externalReviews?: ExternalReview[];
  /** YouTube review videos, as watch/Shorts URLs. */
  reviewVideos?: string[];

  // Logistics
  /** Vehicle allocated by group size. */
  transportModes?: { group: string; vehicle: string }[];
  /** Gear available to hire on site, priced per item. */
  rentalGear?: { item: string; price: number }[];
  /** Note shown when the source itinerary is incomplete or self-contradictory. */
  sourceCaveat?: string;

  // Booking & contact
  /** Per-trip enquiry number; falls back to the site-wide desk when unset. */
  contactPhone?: string;
  /** Additional enquiry numbers listed on the itinerary. */
  contactNumbers?: string[];
  confirmationPolicy?: string;
  /** Caveat shown above the pricing table, e.g. what the fare excludes. */
  priceNote?: string;
  bookingAdvance?: number;
  bookingAdvancePct?: number;
  balanceDueDays?: number;
  kidsPolicy?: string;
}

function parseDuration(duration: string): { days: number; nights: number } {
  const nights = parseInt(duration.split("N")[0], 10);
  const days = parseInt(duration.split("/")[1]?.replace("D", "") ?? "0", 10);
  return { days, nights };
}

/**
 * Every date from `from` to `to` inclusive, as ISO strings, optionally limited
 * to certain weekdays (0 = Sunday). Built from UTC parts so a schedule never
 * drifts a day when the build machine sits in another timezone.
 *
 * Lets a season be declared as a rule ("Saturdays in October", "daily through
 * winter") instead of ~90 hand-typed dates that nobody can check.
 */
function datesInRange(from: string, to: string, weekdays?: number[]): string[] {
  const [fy, fm, fd] = from.split("-").map(Number);
  const [ty, tm, td] = to.split("-").map(Number);
  const end = Date.UTC(ty, tm - 1, td);
  const out: string[] = [];

  for (let t = Date.UTC(fy, fm - 1, fd); t <= end; ) {
    const day = new Date(t);
    if (!weekdays || weekdays.includes(day.getUTCDay())) {
      out.push(day.toISOString().slice(0, 10));
    }
    t = day.setUTCDate(day.getUTCDate() + 1);
  }

  return out;
}

function toListingItem(
  item: TripNavItem,
  meta: Omit<TripListingItem, keyof TripNavItem | "days" | "nights" | "detailsPath"> & { detailsPath: string }
): TripListingItem {
  const { days, nights } = parseDuration(item.duration);
  return { ...item, ...meta, days, nights };
}

/* ------------------------------------------------------------------ */
/* Chopta & Tungnath — shared between the ex-Rishikesh and ex-Delhi    */
/* packages. Same trek, same photos, same copy; only the transport     */
/* legs, price and pickup city differ, so everything below is declared */
/* once and referenced by both listings.                               */
/* ------------------------------------------------------------------ */

const CHOPTA_ALTERNATE_NAMES = [
  "Chopta Tungnath Chandrashila Trek",
  "Tungnath Trek",
  "Chandrashila Trek",
  "Deoria Tal",
  "Chopta Trek",
  "Kedar",
];

/**
 * Both variants run on the same departure calendar. The dates are the
 * ex-Rishikesh Day 1; the ex-Delhi package leaves Delhi on the night before,
 * so a Saturday batch is a Friday-night pickup.
 *
 * October and November are weekends only; from December the trek runs daily
 * through the winter season, which ends in January.
 */
const CHOPTA_BATCH_DATES = [
  // October starts at the 10th rather than the 1st: the departures list
  // has no past-date filter, so the 3rd would render as bookable.
  ...datesInRange("2026-10-10", "2026-10-31", [6]),
  ...datesInRange("2026-11-01", "2026-11-30", [6]),
  ...datesInRange("2026-12-01", "2027-01-31"),
];

const CHOPTA_HIGHLIGHTS = [
  "Tungnath — highest Shiva temple in the world",
  "Chandrashila summit, 360° Himalayan views",
  "Deoria Tal",
  "Dhari Devi Temple",
  "Devprayag Sangam",
  "Monal birds, occasionally Himalayan Tahr",
  "Suitable for all ages — easy grade",
  "Accessible year round; moderate Dec–Feb with snowfall",
];

/** Days 1–3 are identical in both packages; the Delhi variant wraps them. */
const CHOPTA_TREK_ITINERARY: TripItineraryDay[] = [
  { day: 1, title: "Rishikesh to Sari Village", entries: [{ text: "Drive about 200 km, 6–7 hours." }, { text: "Sightseeing at Dhari Devi Temple and Devprayag Sangam." }, { text: "Check into homestay or campstay. Overnight Sari." }] },
  { day: 2, title: "Tungnath and Chandrashila", entries: [{ text: "Trek 3.5 km to Tungnath, then 1.5 km further to Chandrashila — about 5 km in total." }, { text: "Temple visit and 360° Himalayan views." }, { text: "Overnight Sari." }] },
  { day: 3, title: "Deoria Tal and return", entries: [{ text: "Trek about 1.5 km, roughly an hour, to Deoria Tal." }, { text: "Drive back to Rishikesh." }] },
];

/** Everything the fare covers apart from the transport leg, which differs. */
const CHOPTA_COST_INCLUDES = [
  "Vegetarian meals only — dinner and breakfast at the stays, from Day 1 dinner to last-day breakfast",
  "Camps or homestay accommodation, triple / quad sharing",
  "Experienced qualified guide",
  "Basic first aid",
  "Achievement certificate",
];

const CHOPTA_COST_EXCLUDES = [
  "Forest fees and permits",
  "Meals during transportation",
  "Lunch",
  "Personal expenses",
  "Costs from unscheduled delays such as roadblocks or landslides",
  "Porter and mule charges",
  "Backpack offloading charges",
  "Evacuation cost",
  "Anything not listed under inclusions",
];

// Shot on past batches. The folder also holds four .HEIC originals, left
// out because browsers other than Safari will not render them in an <img>.
const CHOPTA_GALLERY: TripGalleryImage[] = [
  "IMG_4227", "IMG_4228", "IMG_4229", "IMG_4231", "IMG_4232", "IMG_4237",
  "IMG_4240", "IMG_4246", "IMG_4247", "IMG_4259", "IMG_4267", "IMG_4268",
  "IMG_4277", "IMG_4278", "IMG_4342", "IMG_4343", "IMG_4345", "IMG_4346",
  "IMG_4349", "IMG_4350", "IMG_4351", "IMG_4352", "IMG_4353", "IMG_4355",
  "IMG_4357", "IMG_4358", "IMG_4359", "IMG_4360", "IMG_4361", "IMG_4362",
  "IMG_4363", "IMG_4364", "IMG_4365", "IMG_4367", "IMG_4370", "IMG_4372",
  "IMG_4373",
].map((name) => ({ url: `/Trips_gallery/Chopta%20Tungnath%20Trek/${name}.JPG.jpeg` }));

const CHOPTA_FAQS = [
  {
    title: "What is the Chopta Tungnath Chandrashila Trek?",
    description:
      "It is a scenic Himalayan trek covering Chopta, Tungnath Temple and Chandrashila Summit, with Deoriatal included in this itinerary.",
  },
  {
    title: "How difficult is the Chopta Tungnath Trek?",
    description: "The trek is considered Easy to Moderate and is suitable for beginners with basic fitness.",
  },
  {
    title: "What is the altitude of Chandrashila?",
    description: "Chandrashila Summit is approximately 4,000 metres (13,123 ft) above sea level.",
  },
  {
    title: "What is the best time to do the Chopta Tungnath Chandrashila Trek?",
    description:
      "The best seasons are generally April to June and September to November. Winter offers a different experience with snow, subject to weather and road conditions.",
  },
  {
    title: "Can beginners do this trek?",
    description: "Yes. Beginners can do this trek with reasonable fitness, proper pacing and suitable trekking shoes.",
  },
  {
    title: "Is Tungnath Temple open throughout the year?",
    description:
      "No. Tungnath Temple follows its seasonal opening and closing schedule. During the winter closure, the temple area may remain inaccessible depending on conditions.",
  },
  {
    title: "How far is Chandrashila from Chopta?",
    description:
      "The trekking route from Chopta to Chandrashila is approximately 5 km one way, depending on the exact route and conditions.",
  },
  {
    title: "Where does the trek start and where do we stay?",
    description:
      "The trip accommodation is in Sari Village. The Tungnath–Chandrashila trek starts from Chopta, which is reached by road from Sari.",
  },
  {
    title: "What should I carry for the Chopta Tungnath Trek?",
    description:
      "Carry good trekking shoes, warm layers, rain protection, water bottle, sunglasses, sunscreen, personal medicines, a small backpack and basic toiletries.",
  },
];

const CHOPTA_ARTICLE: ArticleContent = {
  title: "Chopta Tungnath Chandrashila Trek: Where the Mountains Meet Your Soul",
  standfirst:
    "Green meadows above Sari, the world's highest Shiva temple, a 4,000 m summit and the still water of Deoriatal — the Mini Switzerland of Uttarakhand, told the way it is felt.",
  readMinutes: 6,
  sections: [
    {
      paragraphs: [
        "Some journeys are not meant to be completed just for the destination.",
        "They are meant to be felt.",
        "The Chopta Tungnath Chandrashila Trek is one such journey — where every step takes you a little farther from the noise of everyday life and a little closer to yourself.",
        "Tucked away in the beautiful mountains of Uttarakhand, Chopta is often called the “Mini Switzerland of Uttarakhand.” Surrounded by green meadows, dense forests and magnificent Himalayan peaks, it is a place where the air feels different and the silence speaks.",
        "But the real journey begins when you leave the road behind and start walking.",
      ],
    },
    {
      heading: "A Journey That Begins in Sari",
      paragraphs: [
        "Our journey begins at Sari Village, a peaceful Himalayan settlement surrounded by mountains and forests.",
        "As the evening settles over the village, the pace of life naturally slows down. There are no crowded streets, no traffic horns and no city rush — only mountain air, simple village life and a sky filled with stars.",
        "This is where you prepare yourself for the adventure waiting the next morning.",
      ],
    },
    {
      heading: "Walking Towards Tungnath",
      paragraphs: [
        "The next morning, the journey takes you towards Chopta, the starting point of the trek to Tungnath and Chandrashila.",
        "The trail gradually climbs through beautiful Himalayan landscapes. With every turn, the scenery changes. Forests open up to mountain views, clouds drift across the peaks and the sound of the wind becomes your constant companion.",
        "And then comes Tungnath.",
        "Standing at a high altitude amidst the Himalayas, Tungnath is not just a temple — it is an experience of faith, silence and nature coming together.",
        "For many trekkers, reaching Tungnath feels like more than simply completing a trail.",
        "It feels like arriving somewhere they had been searching for without knowing it.",
      ],
    },
    {
      heading: "The Final Climb to Chandrashila",
      paragraphs: [
        "From Tungnath, the trail becomes steeper as you make your way towards Chandrashila Summit.",
        "The climb may test your legs, but the mountains keep giving you reasons to continue.",
        "And when you finally reach the summit, everything suddenly feels worth it.",
        "Standing at Chandrashila, with the vast Himalayan ranges stretching endlessly before you, you realise how small our worries can feel when viewed from the mountains.",
        "On a clear day, the majestic Chaukhamba range and other Himalayan peaks create a breathtaking panorama.",
        "You don’t need a perfect photograph at that moment.",
        "You simply need to stand there and take it all in.",
      ],
    },
    {
      heading: "Deoriatal – A Quiet Ending to a Beautiful Journey",
      paragraphs: [
        "The adventure continues towards Deoriatal, a serene lake surrounded by forests and magnificent Himalayan views.",
        "The peaceful trail from Sari to Deoriatal offers a completely different experience from the Chandrashila climb.",
        "Here, there is no rush.",
        "Just trees, birds, mountain air and the beautiful silence of the Himalayas.",
        "On a clear day, the reflection of the mountains in the calm waters of Deoriatal creates a picture that stays in your memory long after you leave.",
      ],
    },
    {
      heading: "More Than Just a Trek",
      paragraphs: [
        "The Chopta Tungnath Chandrashila Trek is often described as an easy-to-moderate Himalayan trek, making it a wonderful choice for beginners and first-time trekkers.",
        "But its beauty is not measured by difficulty.",
        "It is measured by the moments you collect along the way.",
        "A sunrise over the mountains.",
        "A quiet conversation on the trail.",
        "A cup of tea in a Himalayan village.",
        "The first sight of Tungnath.",
        "The feeling of reaching Chandrashila.",
        "The silence of Deoriatal.",
        "These are the moments that turn a trek into a memory.",
      ],
    },
    {
      heading: "Come for the Mountains, Return with a Story",
      paragraphs: [
        "You may begin this journey thinking that you are going to explore the Himalayas.",
        "But somewhere between Sari and Chandrashila, you may realise that the mountains have also given you the chance to explore yourself.",
        "So pack your backpack, leave the city behind and take that first step.",
        "Chopta is waiting.",
        "Tungnath is calling.",
        "Chandrashila is waiting for your footsteps.",
        "And perhaps, somewhere along the trail, you will find a version of yourself that the noise of the city made you forget.",
        "Your mountains. Your journey. Your story.",
      ],
    },
  ],
  signoff: "Travel with Trip My Soul.",
};

// Transcribed verbatim from the Google reviews on the Trip My Soul profile.
const CHOPTA_EXTERNAL_REVIEWS: ExternalReview[] = [
  {
    source: "Google",
    subject: "Trip My Soul",
    rating: 5,
    date: "5 months ago",
    text: [
      "Review of Tungnath–Chandrashila Trek",
      "I usually don't write reviews, but this one I had to.",
      "The trek was beautiful, and the best part was our trek leader Himanshu bhaiya - a huge shoutout to him. I was trekking at a slow tortoise pace, but he was so kind, calm and patient the whole way. He never rushed me and kept encouraging me as well as guiding me, which made the trek feel easy, comfortable and enjoyable.",
      "The stay was neat and peaceful with lovely views, though basic toiletries would have helped, but understandable since it's a remote place. It is a pretty offbeat place to stay.",
      "Also, thanks to Rohit Bhaiya who drove us safely to and fro throughout this whole trip.",
      "Overall, the trek was amazing, and Himanshu bhaiya's patience and kindness made it even more special.",
      "In case, you are planning your trek with TMS do ask for this trek leader.",
    ],
  },
  {
    source: "Google",
    subject: "Trip My Soul",
    author: "Shailly Sharma",
    rating: 5,
    date: "2 months ago",
    text: [
      "Amazing Kedarnath & Tungnath Experience!",
      "I recently traveled to Kedarnath and Tungnath with this trip my soul, and the entire experience was fantastic from start to finish. Everything was well-organized, including transportation, and itinerary planning, which made the trip completely stress-free and enjoyable.",
      "Although at Sonparyag the stay and food was average.",
      "A special shoutout to Vicky, Arun Bhaiya and Mamchand for their exceptional support throughout the journey. They were incredibly helpful, approachable, and always ensured that everyone in the group was comfortable and safe. Their positive attitude, local knowledge, and willingness to help made the trip even more memorable.",
      "I highly recommend this travel company to anyone planning a spiritual or trekking trip to the Himalayas. Thank you for creating such wonderful memories—I look forward to traveling with you again! 🙏🏔️",
    ],
  },
  {
    source: "Google",
    subject: "Trip My Soul",
    author: "Parag Dubey",
    rating: 5,
    date: "a year ago",
    text: [
      "It was our first trek & literally I had to say it was my best experience to feel nature and mountains.",
      "Had an amazing experience with Trip My Soul on the chandrashila trek! Everything was well-organized, and our trek lead, himanshu bhai was incredibly supportive and knowledgeable. The views were breathtaking, the campsites clean, and the food delicious. Highly recommend them for a hassle-free and memorable trekking adventure …",
    ],
  },
];

const CHOPTA_REVIEW_VIDEOS = [
  "https://youtube.com/shorts/Q235DetUukc",
  "https://youtube.com/shorts/pJ9esoHTl7g",
  "https://youtube.com/shorts/YtTT7-Ru9bA",
  "https://youtube.com/shorts/9Y2YYU6cz5s",
];

export const WEEKEND_TRIPS: TripListingItem[] = [
  toListingItem(
    {
      name: "Gokarna & Dandeli",
      slug: "gokarna-dandeli",
      duration: "2N/3D",
      heroImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/PXL_20260103_054657562.MP_Paradise_beach_gokarna_Paradise_Beach_Trail%2C_Gokarna%2C_Karnataka_581326_01.jpg/1920px-PXL_20260103_054657562.MP_Paradise_beach_gokarna_Paradise_Beach_Trail%2C_Gokarna%2C_Karnataka_581326_01.jpg",
      tagline: "Coastal sunsets, river rafting, and laid-back beach trails on the Karnataka coast.",
    },
    {
      region: "Karnataka",
      startLocation: "Gokarna",
      difficulty: "Easy",
      price: 8999,
      months: ["Oct", "Nov", "Mar"],
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
      heroImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bb/Landscapes_of_Western_Ghats_from_Mullayyanagiri_Betta.jpg/1920px-Landscapes_of_Western_Ghats_from_Mullayyanagiri_Betta.jpg",
      tagline: "Coffee estates, misty hills, and waterfall hikes in the Western Ghats.",
    },
    {
      region: "Karnataka",
      startLocation: "Coorg",
      difficulty: "Easy",
      price: 9499,
      months: ["Sep", "Oct", "Nov", "Mar"],
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
      heroImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bb/CoonoorTeaEstate.jpg/1920px-CoonoorTeaEstate.jpg",
      tagline: "Nilgiri toy train views, tea gardens, and cool hill-station escapes.",
    },
    {
      region: "Tamil Nadu",
      startLocation: "Mysore",
      difficulty: "Easy",
      price: 8999,
      months: ["Mar", "Apr", "May", "Jun", "Sep", "Oct", "Nov"],
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
      // Shifted nine weeks forward (same Thu/Fri pattern) so the only
      // departures inside the 60-day "Upcoming" window are the newly
      // catalogued yatras. Still sample data — see the note above.
      batchDates: [
        "2026-11-05", "2026-11-06", "2026-11-12", "2026-11-13",
        "2026-11-19", "2026-11-20", "2026-11-26", "2026-11-27",
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
      heroImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Munnar_Tea_Plantations-WUS07265.jpg/1920px-Munnar_Tea_Plantations-WUS07265.jpg",
      tagline: "Rolling tea plantations, wildlife spotting, and serene Kerala highlands.",
    },
    {
      region: "Kerala",
      startLocation: "Munnar",
      difficulty: "Easy",
      price: 9299,
      months: ["Sep", "Oct", "Nov", "Mar", "Apr"],
      themes: ["Meadow", "Couples", "Family with Kids"],
      category: "Weekend Trip",
      detailsPath: "/trips/weekend/munnar",
    }
  ),

  /* ---------------------------------------------------------------- */
  /* Short Himalayan trips — 3 days and under                          */
  /* ---------------------------------------------------------------- */

  toListingItem(
    {
      name: "Chopta & Tungnath Trek",
      slug: "chopta-tungnath-trek",
      duration: "2N/3D",
      heroImage: "/Trips_gallery/Tungnath_chandrashila/IMG_4346.JPG.jpeg",
      tagline: "The world's highest Shiva temple, a 4,000 m summit, and 360° Himalayan views.",
    },
    {
      region: "Uttarakhand",
      startLocation: "Rishikesh",
      endLocation: "Rishikesh",
      difficulty: "Easy",
      price: 4999,
      months: ["Mar", "Apr", "May", "Jun", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb"],
      themes: ["Snow", "Meadow", "Forest", "Pilgrimage"],
      category: "Weekend Trip",
      detailsPath: "/trips/weekend/chopta-tungnath-trek",
      alternateNames: [...CHOPTA_ALTERNATE_NAMES, "Chopta Tungnath Rishikesh to Rishikesh"],
      altitude: "Chandrashila — a 4,000 m Himalayan summit",
      minAge: 8,
      availability: "Oct: every Saturday · Nov–Jan: daily departures",
      batchDates: CHOPTA_BATCH_DATES,
      intro:
        "The most accessible Himalayan trek in Uttarakhand and a genuine 4,000 m summit without the stress. Tungnath is the highest Shiva temple in the world, and Chandrashila above it gives a full 360° of the range. Rishikesh to Rishikesh — if you need a Delhi pickup, book the Delhi to Delhi package instead.",
      highlights: CHOPTA_HIGHLIGHTS,
      priceNote: "Price excludes GST.",
      packages: [
        { id: "ex-rishikesh", label: "Ex-Rishikesh — 3D/2N", price: 4999, paxLabel: "Ex-Rishikesh", vehicle: "By group size", sharing: "Triple / quad" },
      ],
      itinerary: CHOPTA_TREK_ITINERARY,
      costIncludes: ["Rishikesh to Rishikesh transport", ...CHOPTA_COST_INCLUDES],
      costExcludes: CHOPTA_COST_EXCLUDES,
      transportModes: TRANSPORT_BY_GROUP_SIZE,
      cancellationPolicy: TIERED_CANCELLATION_POLICY,
      confirmationPolicy: CONFIRMATION_POLICY,
      contactNumbers: TRIP_CONTACT_NUMBERS,
      thingsToCarry: HIMALAYAN_TREK_PACKING_LIST.flatMap((g) => g.items),
      rentalGear: TREK_RENTAL_GEAR,
      thingsToRemember: TRIP_GROUND_RULES,
      gallery: CHOPTA_GALLERY,
      faqs: [
        ...CHOPTA_FAQS.slice(0, 2),
        {
          title: "How many days are required for the trek?",
          description: "This package is a 3 Days / 2 Nights trip from Rishikesh covering Tungnath, Chandrashila and Deoriatal. The Delhi to Delhi package runs the same 3 Days / 2 Nights trek, with overnight road legs either side.",
        },
        ...CHOPTA_FAQS.slice(2),
      ],
      article: CHOPTA_ARTICLE,
      // The Delhi variant of this same package first, then the five published
      // pairings matching the `/treks` listing. Only the first four render.
      relatedSlugs: ["chopta-tungnath-trek-delhi", "kedarkantha-trek", "brahmatal-trek", "kuari-pass-trek", "dayara-bugyal-trek", "nagtibba-trek"],
      externalReviews: CHOPTA_EXTERNAL_REVIEWS,
      reviewVideos: CHOPTA_REVIEW_VIDEOS,
    }
  ),

  toListingItem(
    {
      name: "Chopta & Tungnath Trek — Delhi to Delhi",
      slug: "chopta-tungnath-trek-delhi",
      duration: "2N/3D",
      heroImage: "/Trips_gallery/Tungnath_chandrashila/IMG_4346.JPG.jpeg",
      tagline: "The same 4,000 m summit and the world's highest Shiva temple, run door to door from Delhi.",
    },
    {
      region: "Uttarakhand",
      startLocation: "Delhi",
      endLocation: "Delhi",
      difficulty: "Easy",
      price: 6499,
      months: ["Mar", "Apr", "May", "Jun", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb"],
      themes: ["Snow", "Meadow", "Forest", "Pilgrimage"],
      category: "Weekend Trip",
      detailsPath: "/trips/weekend/chopta-tungnath-trek-delhi",
      alternateNames: [
        ...CHOPTA_ALTERNATE_NAMES,
        "Chopta Tungnath Delhi to Delhi",
        "Chopta Tungnath Trek from Delhi",
        "Chandrashila Trek from Delhi",
      ],
      altitude: "Chandrashila — a 4,000 m Himalayan summit",
      minAge: 8,
      availability: "Oct: every Friday · Nov–Feb: daily departures",
      /**
       * Delhi departure dates — the Day 0 night pickup, one day earlier than
       * the ex-Rishikesh Day 1 in `CHOPTA_BATCH_DATES`. A batch runs Day 0 to
       * the Day 3 overnight drive, so the 9th departs on the 9th and drops
       * back early on the 13th.
       *
       * October is Fridays only (9th, 16th, 23rd, 30th); from November the
       * trek departs daily through the winter season, ending in February.
       */
      batchDates: [
        ...datesInRange("2026-10-09", "2026-10-30", [5]),
        ...datesInRange("2026-11-01", "2027-02-28"),
      ],
      intro:
        "The same Chopta, Tungnath and Chandrashila trek as the Rishikesh package, with the road legs built in: an overnight departure from Delhi on Day 0 and an overnight drive back after Day 3, dropping you in early the next morning. Pickup and drop at Kashmiri Gate or Akshardham Temple.",
      highlights: [...CHOPTA_HIGHLIGHTS, "Overnight Delhi pickup and drop — no separate travel to book"],
      priceNote: "Price excludes GST. Covers Delhi to Delhi transport; the ex-Rishikesh package is the same trek without the road legs.",
      packages: [
        { id: "ex-delhi", label: "Ex-Delhi — 3D/2N", price: 6499, paxLabel: "Ex-Delhi", vehicle: "By group size", sharing: "Triple / quad" },
      ],
      itinerary: [
        { day: 0, title: "Overnight departure from Delhi", entries: [{ time: "10–11 PM", text: "Night pickup from Kashmiri Gate or Akshardham Temple." }, { text: "Overnight drive Delhi → Rishikesh, about 6 hours." }] },
        // Days 1 and 2 are the trek proper, shared with the ex-Rishikesh
        // package; Day 3 is restated because the drive continues to Delhi.
        ...CHOPTA_TREK_ITINERARY.slice(0, 2),
        { day: 3, title: "Deoria Tal and departure", entries: [{ text: "Trek about 1.5 km, roughly an hour, to Deoria Tal." }, { text: "Drive back via Rishikesh and on to Delhi overnight." }, { time: "4–5 AM", text: "Early morning drop at Kashmiri Gate or Akshardham Temple the next day." }] },
      ],
      costIncludes: ["Delhi to Delhi transport", ...CHOPTA_COST_INCLUDES],
      costExcludes: CHOPTA_COST_EXCLUDES,
      transportModes: TRANSPORT_BY_GROUP_SIZE,
      cancellationPolicy: TIERED_CANCELLATION_POLICY,
      confirmationPolicy: CONFIRMATION_POLICY,
      contactNumbers: TRIP_CONTACT_NUMBERS,
      thingsToCarry: HIMALAYAN_TREK_PACKING_LIST.flatMap((g) => g.items),
      rentalGear: TREK_RENTAL_GEAR,
      thingsToRemember: TRIP_GROUND_RULES,
      gallery: CHOPTA_GALLERY,
      faqs: [
        ...CHOPTA_FAQS.slice(0, 2),
        {
          title: "How many days are required for the trek?",
          description: "This package is a 3 Days / 2 Nights trip, wrapped in overnight road legs from Delhi: a Day 0 night departure, two days on the trail from Sari, Deoria Tal on Day 3, and an overnight drive back that reaches Delhi early the next morning.",
        },
        {
          title: "Where is the Delhi pickup and drop?",
          description: "Pickup is from Kashmiri Gate or Akshardham Temple between 10 and 11 PM on the night before Day 1, and the drop is at the same points between 4 and 5 AM on the morning after Day 3.",
        },
        ...CHOPTA_FAQS.slice(2),
      ],
      article: CHOPTA_ARTICLE,
      relatedSlugs: ["chopta-tungnath-trek", "kedarkantha-trek", "brahmatal-trek", "kuari-pass-trek", "dayara-bugyal-trek"],
      externalReviews: CHOPTA_EXTERNAL_REVIEWS,
      reviewVideos: CHOPTA_REVIEW_VIDEOS,
    }
  ),

  toListingItem(
    {
      name: "Madmaheshwar Trek",
      slug: "madmaheshwar-trek",
      duration: "2N/3D",
      heroImage: "/Trips_gallery/Madhmaheshwar/IMG_1777.jpg",
      tagline: "A standalone run at the Madhyamaheshwar shrine at 3,490 m, Delhi to Delhi.",
    },
    {
      heroImages: [
        "/Trips_gallery/Madhmaheshwar/IMG_1990_Original.jpg",
        "/Trips_gallery/Madhmaheshwar/IMG_1220.jpg",
        "/Trips_gallery/Madhmaheshwar/IMG_1357.jpg",
      ],
      region: "Uttarakhand",
      startLocation: "Delhi",
      endLocation: "Delhi",
      difficulty: "Moderate",
      price: null,
      months: ["Apr", "May", "Jun", "Sep", "Oct", "Nov"],
      themes: ["Pilgrimage", "Meadow", "Forest"],
      category: "Weekend Trip",
      detailsPath: "/trips/weekend/madmaheshwar-trek",
      alternateNames: ["Madhyamaheshwar Trek", "Madmaheshwar", "Madhyamaheshwar", "Budha Madmaheshwar", "Panch Kedar", "Kedar"],
      altitude: "Madhyamaheshwar Temple — 3,490 m",
      minAge: 12,
      intro:
        "The Madhyamaheshwar shrine at 3,490 m as a standalone short package rather than part of the longer Panch Kedar circuit. Pickup and drop at Akshardham Metro Station, Gate No. 1.",
      highlights: ["Madhyamaheshwar Temple, 3,490 m", "Budha Madhmaheshwar", "Devprayag Sangam", "Dhari Devi Temple", "Omkareshwar Temple, Ukhimath"],
      priceNote: "No rates are published in the source itinerary. Contact the trips desk for current pricing.",
      sourceCaveat:
        "Two points are unresolved in the source itinerary. It carries no price page at all, so no fare is shown here rather than an invented one — please call the trips desk. It also gives the shrine altitude twice and differently: about 3,289 m in the overview and 3,490 m on the Day 2 page. Both figures are reproduced as printed.",
      itinerary: [
        { day: 0, title: "Overnight departure from Delhi", entries: [{ time: "9:30 PM", text: "Pickup at Akshardham Metro Station, Gate No. 1." }, { text: "Car, MUV, SUV or Tempo Traveller depending on group size." }, { text: "Overnight journey Delhi → Rishikesh, about 6 hours." }] },
        { day: 1, title: "Rishikesh to Ransi", entries: [{ text: "Devprayag Sangam." }, { text: "Dhari Devi Temple." }, { text: "Omkareshwar Temple at Ukhimath." }, { text: "Check into the Ransi homestay. Dinner and overnight." }] },
        { day: 2, title: "Trek to Madhyamaheshwar", entries: [{ time: "6:30 AM", text: "Trek starts — 16–17 km." }, { text: "Visit the temple at 3,490 m." }, { text: "Overnight homestay or camp near the temple, multiple sharing." }] },
        { day: 3, title: "Budha Madhmaheshwar and return", entries: [{ text: "Early morning at Budha Madhmaheshwar, then breakfast." }, { text: "Trek down to Ransi and depart for Delhi." }, { text: "Arrival in Delhi early the following morning." }] },
      ],
      costIncludes: [
        "Delhi to Delhi transport — Tempo Traveller, SUV or sedan",
        "1 night Ransi homestay or hotel",
        "1 night Madmaheshwar camp or homestay",
        "Multiple sharing accommodation",
        "2 breakfasts and 2 dinners, in stay only",
        "Experienced trip captain",
        "Guided trek to the main temple and Budha Madmaheshwar",
        "24/7 support crew",
      ],
      costExcludes: [
        "Personal expenses — laundry, shopping, tips, snacks",
        "Adventure activities not listed",
        "Entry tickets and forest fees",
        "Meals and drinks beyond the inclusions",
        "Hot water, which is not guaranteed",
        "4x4 charges in heavy snow",
        "Union taxi charges",
        "5% GST",
        "Travel insurance",
        "Anything not in the itinerary or inclusions",
      ],
      thingsToCarry: [
        "Day backpack, 20–30 L",
        "Sunscreen SPF 40+",
        "Floaters or sandals",
        "Water bottle",
        "Down or main jacket",
        "Toiletries bag",
        "Outdoor shoes",
        "Basic medical kit",
        "3 quick-dry tees",
        "Mobile charger and power bank",
        "Cold cream",
        "3 pairs cotton socks",
        "Important documents",
        "Quick-dry towel",
        "Travel laundry bag",
        "Sanitizer",
        "Camera",
        "Sun cap",
        "Lip balm",
        "Sunglasses",
      ],
      thingsToRemember: [
        "The advance is non-refundable.",
        "Full payment is due 24 hours before the trip.",
        "A valid government photo ID is required to board.",
        "Bookings are non-transferable.",
        "No refund is given for unused inclusions.",
        "You are responsible for your own luggage.",
        "Report 30 minutes before departure.",
        "AC is switched off in hilly areas at the driver's discretion.",
      ],
      confirmationPolicy: CONFIRMATION_POLICY,
      contactNumbers: TRIP_CONTACT_NUMBERS,
      contactPhone: "+91 81786 13438",
      gallery: [
        { url: "/Trips_gallery/Madhmaheshwar/IMG_1219.jpg" },
        { url: "/Trips_gallery/Madhmaheshwar/IMG_1220.jpg" },
        { url: "/Trips_gallery/Madhmaheshwar/IMG_1357.jpg" },
        { url: "/Trips_gallery/Madhmaheshwar/IMG_1777.jpg" },
        { url: "/Trips_gallery/Madhmaheshwar/IMG_1990_Original.jpg" },
        { url: "/Trips_gallery/Madhmaheshwar/IMG_2002_Original.jpg" },
        { url: "/Trips_gallery/Madhmaheshwar/IMG_2151.jpg" },
        { url: "/Trips_gallery/Madhmaheshwar/IMG_2153.jpg" },
        { url: "/Trips_gallery/Madhmaheshwar/IMG_2186.jpg" },
        { url: "/Trips_gallery/Madhmaheshwar/72a2966b-bd57-4b01-b268-0d43f7a0441c.jpg" },
        { url: "/Trips_gallery/Madhmaheshwar/c81a8979-f145-4f80-ab61-dfb6390f3ec5.jpg" },
      ],
      relatedSlugs: ["madhyamaheshwar-trek-4-day", "three-kedar-yatra", "panch-kedar-yatra"],
    }
  ),

  toListingItem(
    {
      name: "Yulla Kanda Trek",
      slug: "yulla-kanda-trek",
      duration: "2N/3D",
      heroImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Baspa_Valley_at_Sangla%2C_Himachal_Pradesh%2C_India.jpg/1920px-Baspa_Valley_at_Sangla%2C_Himachal_Pradesh%2C_India.jpg",
      tagline: "The world's highest Krishna temple, at 12,778 ft in Kinnaur.",
    },
    {
      region: "Himachal Pradesh",
      startLocation: "Shimla",
      endLocation: "Shimla",
      difficulty: "Moderate",
      price: 6999,
      months: ["May", "Jun", "Jul", "Aug", "Sep", "Oct"],
      themes: ["Pilgrimage", "Meadow", "Forest"],
      category: "Weekend Trip",
      detailsPath: "/trips/weekend/yulla-kanda-trek",
      alternateNames: ["Yulla Kanda", "Yula Kanda", "Krishna Temple Trek", "Kinnaur Trek", "Yulla Khas"],
      altitude: "Shri Krishna Temple — 12,778 ft",
      minAge: 12,
      intro:
        "Yulla Kanda sits in Kinnaur district, Himachal Pradesh. Its temple at 12,778 ft is dedicated to Lord Krishna and is the highest of its kind in the world — built by the Pandavas according to the Mahabharata, and the site of the Bushahr royal family's annual Janmashtami cap-throwing ritual.",
      highlights: [
        "World's highest Krishna temple, 12,778 ft",
        "Kinnaur district, Himachal Pradesh",
        "Pandava-era origins per the Mahabharata",
        "Annual Janmashtami cap-throwing ritual",
        "Traditional Himachali homestay dinner",
        "Panoramic mountain views",
      ],
      priceNote: "No rates are published in the source itinerary. Contact the trips desk for current pricing.",
      sourceCaveat:
        "The source itinerary is a partial export — its pages are numbered up to 10 but only 7 were supplied, and none of them carries a price, so no fare is shown here. The accommodation lines also disagree: the day-by-day plan describes a homestay at Yulla Kanda on night 1 and a camp near the temple on night 2, while the inclusions list a single night in a hotel at Tapri. Both are reproduced as printed; please confirm the stay plan when you book.",
      itinerary: [
        { day: 1, title: "Shimla to Yulla Kanda", entries: [{ text: "Drive 4–5 hours." }, { text: "Check into the homestay and explore the village." }, { text: "Traditional Himachali dinner, optional bonfire. Overnight homestay." }] },
        { day: 2, title: "Krishna Temple", entries: [{ text: "Hike 6–7 hours, or arrange transport." }, { text: "Explore the temple and take in the panoramic mountain views." }, { text: "Campfire dinner. Overnight camp." }] },
        { day: 3, title: "Return to Shimla", entries: [{ text: "Trek or transport back to Yulla Kanda, lunch and rest." }, { text: "Drive back to Shimla by evening. Trip ends." }] },
      ],
      costIncludes: [
        "All transportation, sightseeing and hotel taxes — tolls, parking, fuel and drive allowance",
        "2 breakfasts, 1 lunch and 2 dinners",
        "Trip captain",
        "1 night hotel stay in Tapri",
        "24/7 customer support",
      ],
      costExcludes: [
        "Medical and evacuation expenses",
        "Extra days' accommodation and food at ₹3,500 per day if delayed",
        "Personal and medical check-up expenses during the yatra",
        "Entry fees and optional activity costs not quoted",
        "Anything not listed under inclusions",
      ],
      thingsToCarry: [
        "Full-sleeve sweater or jacket",
        "Hiking pants and shirts",
        "2 L water bottle",
        "Wind and rain-proof jacket",
        "Slippers",
        "Warm gloves",
        "Woollen socks",
        "Long trousers, shirts and t-shirts — two of each",
        "60 L backpack with cover",
        "Warm inner garments",
        "Trekking shoes",
        "Sunglasses",
        "Cap, hat or balaclava",
        "Towel",
        "Headlight",
        "Camera, memory card and power bank",
        "Sun lotion, lip salve and cold cream",
        "Personal medication",
        "Hiking poles",
        "Umbrella",
        "Original ID proof and 2 photographs",
      ],
      thingsToRemember: TRIP_GROUND_RULES,
      confirmationPolicy: CONFIRMATION_POLICY,
      contactNumbers: TRIP_CONTACT_NUMBERS,
      relatedSlugs: ["chopta-tungnath-trek", "shimla-manali"],
    }
  ),
];

export const BACKPACKING_TRIPS: TripListingItem[] = [
  toListingItem(
    {
      name: "Shimla & Manali",
      slug: "shimla-manali",
      duration: "4N/5D",
      heroImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Ridge_-_Shimla_2014-05-08_1492.JPG/1920px-Ridge_-_Shimla_2014-05-08_1492.JPG",
      tagline: "Classic Himachal valleys, pine forests, and mountain town culture.",
    },
    {
      region: "Himachal Pradesh",
      startLocation: "Shimla",
      difficulty: "Easy-Moderate",
      price: 14999,
      months: ["Mar", "Apr", "May", "Jun", "Sep", "Oct", "Nov"],
      themes: ["Snow", "Couples", "Family with Kids"],
      category: "Backpacking Trip",
      detailsPath: "/trips/backpacking/shimla-manali",
    }
  ),
  toListingItem(
    {
      name: "Manali, Solang & Kasol",
      slug: "manali-solang-kasol-weekend-getaway",
      duration: "3N/4D",
      heroImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Solang_valley_under_snow%2C_2015.jpg/1920px-Solang_valley_under_snow%2C_2015.jpg",
      tagline: "Old Manali cafes, the Atal Tunnel to Sissu, and the Parvati valley in one long weekend.",
    },
    {
      region: "Himachal Pradesh",
      startLocation: "Delhi / Chandigarh",
      endLocation: "Delhi / Chandigarh",
      difficulty: "Easy",
      // TODO(content): fare not set by the trips desk yet — renders as
      // "Price on request" until a figure is published.
      price: null,
      months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      themes: ["Snow", "Adventure", "Beginner"],
      category: "Backpacking Trip",
      detailsPath: "/trips/backpacking/manali-solang-kasol-weekend-getaway",

      alternateNames: [
        "Manali Solang Kasol Extended Weekend Getaway",
        "Shimla Manali Kasol",
        "Manali Kasol Trip",
        "Kasol Manikaran",
        "Atal Tunnel Sissu",
      ],
      altitude: "10,235 ft / 3,120 m (Atal Tunnel & Sissu)",
      availability: "Round the year — snow at Solang and Sissu from December to February",
      maxGroupSize: "As per departure; private batches on request",
      contactPhone: "+91 91213 43330",

      // Day 0 is a Thursday-night pickup, so the three nights in the hills fall
      // across the long weekend and the group is back by Tuesday noon. Declared
      // as a rule rather than a year of hand-typed dates — see `datesInRange`.
      batchDates: datesInRange("2026-10-22", "2027-10-28", [4]),

      intro:
        "An extended weekend in the Kullu and Parvati valleys, run out of Delhi and Chandigarh on overnight transit at both ends. Two nights in Manali for Old Manali's cafes, the Hadimba temple and a day across the Atal Tunnel to Sissu, then down the Beas to Kullu's adventure stretch and a night in Kasol, with the Chalal riverside trail and the hot springs at Manikaran before the drive home.",
      highlights: [
        "Old Manali cafes, Mall Road and the Hadimba Devi temple",
        "Solang Valley under snow from December to February",
        "The Atal Tunnel — 9.02 km under the Rohtang massif",
        "Sissu and the barren Lahaul valley at about 10,235 ft",
        "Kullu's adventure stretch on the Beas",
        "Kasol and the bohemian Parvati valley",
        "The 3 km riverside trail to Chalal village",
        "Manikaran Gurudwara and its sacred hot springs",
        "Two bonfire and music nights, in Manali and in Kasol",
      ],
      usps: [
        {
          title: "Three valleys in one weekend",
          description:
            "Kullu, Lahaul and Parvati on a single itinerary — pine-forest hill town, cold-desert tunnel country and riverside cafe culture, without a day wasted doubling back.",
        },
        {
          title: "Overnight transit at both ends",
          description:
            "You leave after work on Day 0 and are back by Tuesday noon. Only one working day goes into a trip that gives you three full days in the mountains.",
        },
        {
          title: "Sissu on the far side of the tunnel",
          description:
            "Most Manali weekends stop at Solang. This one carries on through the Atal Tunnel into Lahaul, where the landscape changes completely within twenty minutes of driving.",
        },
        {
          title: "Trip captains with the group throughout",
          description:
            "A dedicated coordinator travels with the batch from the boarding point onward — stays, transfers and the day plan are handled for you.",
        },
      ],
      idealFor:
        "Beginners, backpackers, solo travellers, college groups and corporate teams who want a Himalayan weekend with no trekking commitment — only light village and riverside walking.",
      importantNote:
        "Days 0 and 4 are overnight road journeys and are not counted in the 3N/4D duration. The Solang, Atal Tunnel and Sissu leg depends on road and snow conditions; the tunnel is closed to traffic at short notice in heavy snow, and the day is then reworked around Solang and Manali.",
      destinationHighlights: [
        {
          name: "Manali",
          blurb:
            "A hill town at about 6,700 ft on the Beas, and the base for both nights of the first half. Old Manali above the river holds the cafes and guesthouses; the Hadimba Devi temple of 1553 stands in the deodar forest at Dhungri, and Mall Road handles the shopping.",
        },
        {
          name: "Solang Valley",
          blurb:
            "A wide side valley 13 km north of Manali, under the Beas Kund ridge. Paragliding, zorbing and a ropeway in summer; snow activities through December to February, all charged on the spot and not part of the package.",
        },
        {
          name: "Atal Tunnel & Sissu",
          blurb:
            "The 9.02 km Atal Tunnel runs under the Rohtang massif at about 10,000 ft and opens into Lahaul in roughly ten minutes. Sissu sits on the far side with the Chandra river, a waterfall off the cliff face and a wholly barren, high-desert landscape.",
        },
        {
          name: "Kullu",
          blurb:
            "The valley floor town on the drive south, and the river-adventure stretch of the Beas. Rafting, zip lines and river crossings operate here in season, booked and paid for directly.",
        },
        {
          name: "Kasol",
          blurb:
            "A village on the Parvati river at about 5,200 ft, known for its Israeli cafes, backpacker crowd and riverside camps. The base for the last night of the trip.",
        },
        {
          name: "Chalal & Manikaran",
          blurb:
            "Chalal is a 30-minute walk upstream from Kasol over a footbridge — a flat 3 km round trip through pine forest. Manikaran, 4 km the other way, holds the Gurudwara and the hot springs that langar food is cooked in.",
        },
      ],

      itinerary: [
        {
          day: 0,
          title: "Overnight departure from Delhi / Chandigarh",
          entries: [
            { time: "Evening", text: "Report at the scheduled boarding point 30 minutes before departure. Briefing with the trip captains." },
            { text: "Board the AC Deluxe bus or Tempo Traveller and start the overnight run to Manali — about 530 km and 12–14 hours from Delhi." },
            { text: "Overnight in transit. No meals on this leg." },
          ],
        },
        {
          day: 1,
          title: "Arrive Manali — Hadimba, Old Manali and Mall Road",
          entries: [
            { time: "Morning", text: "Arrive in Manali, check in to the hotel and freshen up." },
            { time: "Afternoon", text: "Hadimba Devi temple in the deodar forest at Dhungri, then Old Manali's cafes and the Manu temple." },
            { time: "Evening", text: "Free time on Mall Road for shopping and dinner at the hotel." },
            { text: "Overnight in Manali (about 6,700 ft)." },
          ],
        },
        {
          day: 2,
          title: "Solang Valley, Atal Tunnel and Sissu",
          entries: [
            { time: "After breakfast", text: "Drive to Solang Valley, 13 km north. Paragliding, ropeway and snow activities are available on the spot at your own cost." },
            { text: "Continue through the Atal Tunnel into Lahaul and on to Sissu — about 80 km round trip, 6–8 hours with stops." },
            { text: "Time at Sissu for the Chandra river, the waterfall and the Lahaul landscape at about 10,235 ft." },
            { time: "Evening", text: "Return to Manali. Bonfire and music at the hotel, then dinner." },
            { text: "Overnight in Manali." },
          ],
        },
        {
          day: 3,
          title: "Manali to Kasol via Kullu",
          entries: [
            { time: "After breakfast", text: "Check out and drive south along the Beas — about 75 km, 3–4 hours with stops." },
            { text: "Stop on the Kullu adventure stretch for river rafting, zip line or river crossing, each charged directly by the operator." },
            { text: "Carry on into the Parvati valley and check in at Kasol (about 5,200 ft)." },
            { time: "Evening", text: "Riverside time, bonfire and music, then dinner." },
            { text: "Overnight in Kasol." },
          ],
        },
        {
          day: 4,
          title: "Kasol, Chalal, Manikaran and overnight return",
          entries: [
            { time: "After breakfast", text: "Check out and walk the Kasol market and cafes." },
            { text: "Cross the footbridge for the Chalal trail — a flat 3 km round trip along the Parvati through pine forest." },
            { text: "Drive 4 km to Manikaran for the Gurudwara and the hot springs." },
            { time: "Evening", text: "Board the vehicle for the overnight return — about 500 km." },
            { text: "Overnight in transit." },
          ],
        },
        {
          day: 5,
          title: "Arrive back in Chandigarh / Delhi",
          entries: [
            { text: "Drop at the designated points in Chandigarh and Delhi by noon. Trip concludes." },
            { text: "Keep a buffer before any onward flight or train — the return is a mountain road and delays happen." },
          ],
        },
      ],

      costIncludes: [
        "3 nights accommodation — 2 nights hotel in Manali, 1 night stay in Kasol, on triple or quad sharing with extra mattresses",
        "6 meals — 3 breakfasts and 3 dinners",
        "Transfers from and back to Delhi / Chandigarh in an AC Tempo Traveller, Toyota Innova or AC Deluxe bus, allocated by group size",
        "All sightseeing listed in the itinerary — non-AC vehicle on the hill sections",
        "Evening bonfire with music",
        "Trip coordinator and team captains with the group throughout",
      ],
      costExcludes: [
        "Travel to and from the Delhi / Chandigarh pickup point",
        "All lunches, highway dhaba stops, snacks and beverages",
        "Adventure activities — river rafting, paragliding, and snow activities at Solang and Kullu",
        "Entry tickets, activity charges and permits at viewpoints",
        "Any cost arising from a landslide, roadblock, breakdown, natural calamity or weather event",
        "Personal medical and travel insurance",
        "Anything not listed under inclusions",
      ],
      priceNote:
        "The fare is quoted from the Delhi / Chandigarh boarding point and covers transfers, stays and 6 meals only. Adventure activities at Solang, Kullu and Kasol are paid directly to the operator on site.",

      eligibilityCriteria: [
        { icon: "User", text: "Open to beginners, backpackers, solo travellers and families — no trekking experience needed" },
        { icon: "Footprints", text: "Basic mobility for light walking on cobbled village paths and riverside trails" },
        { icon: "FileText", text: "Original government photo ID is mandatory and is checked before boarding; foreign nationals must carry passport and a valid Indian visa" },
        { icon: "Car", text: "Long overnight road journeys at both ends, and winding ghat roads through the day" },
        { icon: "Stethoscope", text: "Tell the team in advance about any respiratory or heart condition — the Atal Tunnel and Sissu leg goes above 10,000 ft" },
      ],
      fitnessCriteria: [
        { icon: "Footprints", text: "Able to walk 3 km on a flat riverside trail — the Chalal stretch on the last day" },
        { icon: "Activity", text: "Comfortable with back-to-back overnight bus journeys and full sightseeing days in between" },
        { icon: "Heart", text: "General fitness is enough; carry motion sickness tablets if hill roads affect you" },
      ],
      howToReach: {
        intro:
          "The trip starts and ends at the Delhi or Chandigarh boarding point. Reach the pickup point 30 minutes before the scheduled evening departure on Day 0; everything from there is covered.",
        air: {
          summaryLabel: "Nearest Airport",
          summary: "Indira Gandhi International (DEL), Delhi or Shaheed Bhagat Singh International (IXC), Chandigarh",
          detail:
            "Bhuntar Airport (KUU) near Kullu is the closest field to Manali, 50 km away, but service is limited and weather-dependent. Travellers joining the group transfer should fly into Delhi or Chandigarh.",
        },
        train: {
          summaryLabel: "Nearest Railway Station",
          summary: "New Delhi (NDLS) or Chandigarh (CDG)",
          detail:
            "Book arrivals with a comfortable buffer before the evening pickup — the vehicle leaves on schedule and cannot wait on a delayed train.",
        },
        road: {
          summaryLabel: "Route",
          summary: "Delhi / Chandigarh → Manali → Atal Tunnel & Sissu → Kullu → Kasol → Delhi / Chandigarh",
          detail:
            "About 530 km from Delhi to Manali on the overnight leg and roughly 500 km on the return, with 80 km round trip to Sissu and 75 km from Manali to Kasol in between.",
          route: ["Delhi / Chandigarh", "Manali", "Solang Valley", "Atal Tunnel", "Sissu", "Kullu", "Kasol", "Manikaran", "Delhi / Chandigarh"],
          facts: [
            { label: "Duration", value: "4 Days / 3 Nights, plus two overnight transits" },
            { label: "Highest point", value: "Atal Tunnel & Sissu — 10,235 ft / 3,120 m" },
            { label: "Walking", value: "About 3 km on the Chalal trail, plus local sightseeing on foot" },
          ],
        },
        pickup: {
          point: "Scheduled boarding points in Delhi and Chandigarh, shared before departure",
          time: "Day 0, evening — report 30 minutes early",
          dropPoint: "Same boarding points in Chandigarh and Delhi",
          dropTime: "Day 5, by noon",
          note:
            "Travel to and from the boarding point is your own arrangement and is not part of the fare.",
        },
      },

      faqs: [
        {
          title: "How long is the trip?",
          description:
            "3 Nights / 4 Days in the mountains, plus two overnight road journeys — you leave on a Thursday evening and are back in Delhi or Chandigarh by Tuesday noon.",
        },
        {
          title: "Is there any trekking?",
          description:
            "No. The only walking is the flat 3 km riverside trail to Chalal village and short strolls around Old Manali, Kasol and Manikaran. The grade is easy throughout.",
        },
        {
          title: "When will I see snow?",
          description:
            "December to February at Solang and Sissu, and often around the Atal Tunnel. The rest of the year the same route runs green, with the cafes and river activities at their best from March to October.",
        },
        {
          title: "Are adventure activities included?",
          description:
            "No. Paragliding and the ropeway at Solang, snow activities in winter and rafting or zip lining at Kullu are all paid directly to the operator on site. Your trip captain will point you to the licensed ones.",
        },
        {
          title: "What meals are included?",
          description:
            "Six meals — breakfast and dinner on each of the three hill days. Lunches, highway dhaba stops and anything you order at a cafe are on you.",
        },
        {
          title: "What is the accommodation like?",
          description:
            "A comfortable hotel in Manali for two nights and a stay in Kasol for one, on triple or quad sharing with extra mattresses where needed. Rooms are arranged separately for men and women; ask in advance for couple sharing.",
        },
        {
          title: "Will the Atal Tunnel be open?",
          description:
            "Usually, but not always. Heavy snow closes it to traffic at short notice, and the Sissu leg is then replaced with time at Solang and around Manali. No refund is due for a leg dropped on safety grounds.",
        },
        {
          title: "Can we book private or custom dates?",
          description:
            "Yes. Alongside the open group departures, custom dates can be arranged for college groups, corporate teams and private batches. Call or WhatsApp +91 91213 43330.",
        },
        {
          title: "What ID do I need?",
          description:
            "An original government photo ID — driving licence, voter ID, Aadhaar or passport — is verified before boarding. Foreign nationals must carry their original passport and a valid Indian visa.",
        },
        {
          title: "How do I confirm a seat?",
          description:
            "An advance per person blocks the seat and is non-refundable. The balance must be cleared at least 24 hours before departure; dues outstanding after that can cost you the seat without refund.",
        },
      ],

      thingsToCarry: [
        "Warm woollen beanie or cap",
        "Neck buff or muffler",
        "Sunglasses",
        "Sunblock and lip balm",
        "Heavy fleece or down jacket",
        "Windcheater",
        "Thermal innerwear, top and bottom",
        "Denim, cargoes or track pants",
        "Sweatshirts and cotton tees",
        "Extra pairs of woollen socks",
        "Sturdy sports or hiking shoes with grip",
        "Casual slip-ons or sandals",
        "20–30L daypack for the day excursions",
        "Reusable water bottle",
        "Power bank",
        "Personal medical kit, with motion sickness tablets",
        "Original government photo ID — passport and Indian visa for foreign nationals",
      ],
      thingsToRemember: [
        ...TRIP_GROUND_RULES,
        "Report at the pickup point 30 minutes before the scheduled departure.",
        "Smoking and drinking are not permitted inside the vehicle at any point in the journey.",
        "Bookings are non-transferable — only the travellers named at confirmation can board.",
      ],
      transportModes: TRANSPORT_BY_GROUP_SIZE,
      cancellationPolicy:
        "The advance booking amount is non-refundable under any circumstances. No refund is given for sightseeing or inclusions you do not use during the trip, and bookings cannot be transferred to another traveller.",
      confirmationPolicy:
        "An advance per person blocks your seat and is non-refundable. The remaining payment must be cleared at least 24 hours before departure; unpaid dues after that can lead to the seat being cancelled without refund.",
      balanceDueDays: 1,

      gallery: [
        {
          url: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/37/Hidimba_Devi_Temple%2C_Dhungri_Manali.jpg/1920px-Hidimba_Devi_Temple%2C_Dhungri_Manali.jpg",
          caption: "Hadimba Devi temple in the deodar forest at Dhungri, Manali",
        },
        {
          url: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Old_Manali%2C_Manali%2C_India_%28Unsplash_MSK-2kuYJDE%29.jpg/1920px-Old_Manali%2C_Manali%2C_India_%28Unsplash_MSK-2kuYJDE%29.jpg",
          caption: "Old Manali above the Beas",
        },
        {
          url: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bb/Solang_Valley%2C_Paragliding%2C_India.jpg/1920px-Solang_Valley%2C_Paragliding%2C_India.jpg",
          caption: "Paragliding over Solang Valley",
        },
        {
          url: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c0/Solang_valley_mountain_view.jpg/1920px-Solang_valley_mountain_view.jpg",
          caption: "The Beas Kund ridge above Solang",
        },
        {
          url: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Atal_Tunnel.jpg/1920px-Atal_Tunnel.jpg",
          caption: "The Atal Tunnel, 9.02 km under the Rohtang massif",
        },
        {
          url: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Wildflowers_Mountains_Sissu_Lahaul_Jul19_D72_10447.jpg/1920px-Wildflowers_Mountains_Sissu_Lahaul_Jul19_D72_10447.jpg",
          caption: "Sissu, on the Lahaul side of the tunnel",
        },
        {
          url: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/Kullu_Valley%2C_Beas_River_near_Manali%2C_India.jpg/1920px-Kullu_Valley%2C_Beas_River_near_Manali%2C_India.jpg",
          caption: "The Beas running through the Kullu valley",
        },
        {
          url: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Parvati_River_At_Kasol_%28197732809%29.jpeg/1920px-Parvati_River_At_Kasol_%28197732809%29.jpeg",
          caption: "The Parvati river at Kasol",
        },
        {
          url: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fe/Parvati_valley_near_Kasol%2C_Kullu_district_in_Himachal_04.jpg/1920px-Parvati_valley_near_Kasol%2C_Kullu_district_in_Himachal_04.jpg",
          caption: "Pine forest on the Chalal trail above Kasol",
        },
        {
          url: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Manikaran_Gurdwara%2C_a_Holy_place_for_Shikhs_at_Manikaran_04.jpg/1920px-Manikaran_Gurdwara%2C_a_Holy_place_for_Shikhs_at_Manikaran_04.jpg",
          caption: "Manikaran Gurudwara and its hot springs",
        },
      ],
      relatedSlugs: ["shimla-manali", "spiti-valley", "kashmir"],
    }
  ),
  toListingItem(
    {
      name: "Kashmir – Paradise on Earth",
      slug: "kashmir",
      duration: "4N/5D",
      heroImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Mobile_fruit_seller_on_shikara_in_Dal_lake_%2C_Srinagar_%2CKashmir.jpg/1920px-Mobile_fruit_seller_on_shikara_in_Dal_lake_%2C_Srinagar_%2CKashmir.jpg",
      tagline:
        "Mughal gardens, the Pahalgam pine valleys, the Gulmarg gondola and a houseboat night on Dal Lake — Srinagar to Srinagar in 5 days.",
    },
    {
      region: "Jammu & Kashmir",
      startLocation: "Srinagar",
      endLocation: "Srinagar",
      difficulty: "Easy",
      price: 16999,
      months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      themes: ["Lakes", "Meadow", "Snow", "Couples", "Family with Kids"],
      category: "Backpacking Trip",
      detailsPath: "/trips/backpacking/kashmir",

      alternateNames: ["Kashmir Paradise on Earth", "Srinagar Pahalgam Gulmarg Tour", "Kashmir Valley Tour"],
      altitude: "~2,600 m (8,500 ft) at Gulmarg; Apharwat Peak reaches ~3,950 m on Gondola Phase 2",
      availability: "Fixed departures and private batches run round the year",
      contactPhone: "+91-9121343330",

      heroImages: [
        "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Gulmarg_-_Jannat_on_Earth.jpg/1920px-Gulmarg_-_Jannat_on_Earth.jpg",
        "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Pahalgam_Valley.jpg/1920px-Pahalgam_Valley.jpg",
        "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/India_-_Srinagar_-_023_-_Nishat_Bagh_Mughal_Gardens.jpg/1920px-India_-_Srinagar_-_023_-_Nishat_Bagh_Mughal_Gardens.jpg",
      ],

      intro:
        "Nestled amidst the Himalayas, Kashmir is celebrated as paradise on earth. This 5-day journey crosses the heart of the valley: the terraced Mughal gardens of Nishat, Shalimar and Chashme Shahi below the Shankaracharya Temple, the saffron fields of Pampore on the way to the pine valleys of Pahalgam, the Gondola cable car climbing towards snow-capped Apharwat in Gulmarg, and a closing sunset shikara cruise with an overnight heritage houseboat stay on Dal Lake.",
      highlights: [
        "Nishat Bagh, Shalimar Bagh & Chashme Shahi Mughal gardens",
        "Shankaracharya Temple above Srinagar",
        "Pampore saffron fields & Awantipora ruins",
        "Pahalgam pine valleys, Lavender Park & Gori Shankar Temple",
        "Gulmarg meadows and the world's highest golf course",
        "Apharwat Gondola cable car (optional)",
        "Sunset shikara ride on Dal Lake",
        "Overnight heritage houseboat stay",
      ],
      idealFor:
        "Families, couples, honeymooners, solo travellers and seniors who want the valley at a leisurely pace — no trekking background required.",
      destinationHighlights: [
        {
          name: "Srinagar",
          blurb:
            "The valley's summer capital at ~1,585 m, built around Dal Lake and the terraced Mughal gardens laid out by Jahangir and Shah Jahan.",
        },
        {
          name: "Pahalgam",
          blurb:
            "A pine-and-meadow valley at ~2,200 m on the Lidder river, the base for the Aru, Betaab and Chandanwari side valleys.",
        },
        {
          name: "Gulmarg",
          blurb:
            "The meadow of flowers at ~2,600 m — a winter ski resort, home to the world's highest golf course, and the foot of the Apharwat gondola.",
        },
        {
          name: "Dal Lake",
          blurb:
            "Srinagar's lake of shikaras, floating gardens and carved cedar houseboats, best seen on the water at sunset.",
        },
      ],

      priceNote:
        "₹16,999 per person is the Srinagar-to-Srinagar fare. Flights and train fares to and from Srinagar are not included. A minimum 25% advance confirms the booking; 50% is due 30–45 days before departure and the balance 15–30 days before. Bookings are liable to cancellation without refund if dues are not cleared at least 15 days prior to travel.",
      bookingAdvancePct: 25,
      confirmationPolicy:
        "A minimum 25% advance of the total package cost confirms your slot. Trip My Soul emails your confirmation once the advance is received.",

      itinerary: [
        {
          day: 1,
          title: "Arrival in Srinagar & Mughal Gardens tour",
          entries: [
            { text: "Arrive at Srinagar airport, where our representative meets you and transfers you to the hotel." },
            { text: "Visit Nishat Bagh, the garden of bliss, terraced above Dal Lake." },
            { text: "Continue to Shalimar Bagh and Chashme Shahi." },
            { text: "Shankaracharya Temple for the view over the city and the lake." },
            { text: "Dinner and overnight at a premium 3-star hotel in Srinagar (~1,585 m)." },
          ],
        },
        {
          day: 2,
          title: "Srinagar to Pahalgam via the saffron fields",
          entries: [
            { text: "Breakfast, then drive to Pahalgam — about 97 km, 2.5 hours." },
            { text: "Stop at the Pampore saffron fields and the Awantipora ruins en route." },
            { text: "Pahalgam: Lavender Park and Gori Shankar Temple." },
            {
              text: "Optional union-cab excursions to the Aru, Betaab and Chandanwari valleys or Baisaran — booked and paid locally.",
            },
            { text: "Dinner and overnight at a premium 3-star hotel in Pahalgam (~2,200 m)." },
          ],
        },
        {
          day: 3,
          title: "Pahalgam to Gulmarg — the meadow of flowers",
          entries: [
            { text: "Breakfast, then the scenic drive to Gulmarg — about 140 km, 3.5 to 4 hours." },
            { text: "Explore the Gulmarg meadows and the world's highest golf course." },
            { text: "Optional Gondola cable car towards Apharwat Peak — Phase 1 and Phase 2 tickets are paid separately." },
            { text: "Dinner and overnight at a premium 3-star hotel in Gulmarg (~2,600 m / 8,500 ft)." },
          ],
        },
        {
          day: 4,
          title: "Gulmarg to Srinagar & the Dal Lake shikara ride",
          entries: [
            { text: "A leisurely morning in Gulmarg after breakfast." },
            { text: "Drive back to Srinagar — about 56 km, 1.5 hours." },
            { text: "One-hour sunset shikara cruise across Dal Lake." },
            { text: "Check in to a traditional houseboat. Dinner and overnight on the water." },
          ],
        },
        {
          day: 5,
          title: "Houseboat check-out & departure",
          entries: [
            { text: "Breakfast on the houseboat, then check out." },
            { text: "Transfer to Srinagar airport — 15 to 20 km, 30 to 45 minutes." },
            { text: "The trip concludes." },
          ],
        },
      ],

      costIncludes: [
        "4 nights accommodation — premium 3-star hotels in Srinagar, Pahalgam and Gulmarg plus one night on a Dal Lake houseboat",
        "4 breakfasts and 4 dinners, Kashmiri and multi-cuisine",
        "One-hour sunset shikara ride on Dal Lake",
        "All intercity and local sightseeing transfers in a dedicated tourist vehicle",
        "Airport pickup and drop",
        "Dedicated representative and driver assistance throughout",
      ],
      costExcludes: [
        "Airfare and train fare to and from Srinagar",
        "Lunches, beverages, snacks and personal refreshments",
        "Gulmarg Gondola tickets (Phase 1 and Phase 2) and pony charges",
        "Local union cabs and ponies for the Pahalgam interior valleys — Aru, Betaab, Chandanwari and Baisaran",
        "Entry fees for the Mughal gardens, monuments and temple viewpoints",
        "Personal travel and medical insurance",
        "Expenses arising from natural hazards, landslides, flight delays or weather",
      ],

      eligibilityCriteria: [
        { icon: "User", text: "Open to all ages — travellers under 18 need written parental consent" },
        { icon: "Mountain", text: "No trekking background needed; the highest night is Gulmarg at about 8,500 ft" },
        { icon: "Footprints", text: "Suitable for families, couples, solo travellers and seniors" },
        { icon: "Car", text: "Winding mountain road between Pahalgam and Gulmarg — carry motion sickness tablets if you are prone to it" },
        { icon: "FileText", text: "Carry an original government photo ID; it is checked at valley road posts and on arrival" },
      ],
      fitnessCriteria: [
        { icon: "Footprints", text: "Able to walk 2–4 km at an easy pace around gardens, markets and meadows" },
        { icon: "Activity", text: "Comfortable with 2–4 hour road transfers on winding valley highway" },
        { icon: "Heart", text: "Routine walking and light stretching in the weeks before departure are enough preparation" },
      ],
      importantNote:
        "Gulmarg is cold and dry even outside winter, and gondola operations are weather-dependent. Carry prescribed medication and tell your trip captain about any cardiovascular or respiratory condition before departure.",

      howToReach: {
        intro:
          "The trip starts and ends in Srinagar. Reach Srinagar airport on Day 1 and a representative will meet you; everything from there is covered by the trip vehicle.",
        air: {
          summaryLabel: "Nearest Airport",
          summary: "Sheikh ul-Alam International Airport, Srinagar (SXR)",
          detail:
            "Direct flights from Delhi, Mumbai, Bengaluru and other metros. Airport pickup by our representative is included.",
        },
        train: {
          summaryLabel: "Nearest Railhead",
          summary: "Jammu Tawi (JAT) / Udhampur (UHP)",
          detail:
            "From either station, private or shared cabs and buses run to Srinagar along NH 44 — roughly 265 km from Jammu, 8 to 10 hours depending on highway conditions.",
        },
        road: {
          summaryLabel: "Route",
          summary: "Srinagar → Pahalgam → Gulmarg → Srinagar",
          detail:
            "Srinagar is connected to the rest of the country by the Jammu–Srinagar National Highway (NH 44). The circuit itself covers roughly 290 km of valley road over four driving days.",
          route: ["Srinagar", "Pampore", "Pahalgam", "Gulmarg", "Srinagar"],
          facts: [
            { label: "Duration", value: "5 Days / 4 Nights" },
            { label: "Highest point", value: "Gulmarg — 8,500 ft / 2,600 m" },
            { label: "Transport", value: "Dedicated tourist vehicle throughout" },
          ],
        },
        pickup: {
          point: "Sheikh ul-Alam International Airport, Srinagar (SXR)",
          time: "Day 1, on arrival",
          dropPoint: "Sheikh ul-Alam International Airport, Srinagar (SXR)",
          dropTime: "Day 5, after houseboat check-out",
          note:
            "Share your flight details in advance so the representative can time the pickup. Keep a buffer before any onward connection — Srinagar flights are weather-sensitive.",
        },
      },

      faqs: [
        {
          title: "How long is the Kashmir trip?",
          description:
            "5 Days / 4 Nights, Srinagar to Srinagar, covering the Srinagar Mughal gardens, Pahalgam, Gulmarg and a houseboat night on Dal Lake.",
        },
        {
          title: "Is there any trekking on this trip?",
          description:
            "No. This is a sightseeing and leisure circuit. The only walking is easy and optional — strolls around the gardens, the Gulmarg meadows and the Pahalgam riverside, roughly 2 to 4 km a day.",
        },
        {
          title: "When is the best time to visit Kashmir?",
          description:
            "Round the year. April to September brings spring blossom, lush meadows and the saffron and lavender seasons; November to February brings snow and skiing in Gulmarg. Each window looks completely different, so pick by the Kashmir you want to see.",
        },
        {
          title: "Is the Gondola ride included?",
          description:
            "No. Gulmarg Gondola tickets for Phase 1 and Phase 2 are excluded and bought on the day. Tickets are limited, demand-driven and dependent on the weather, so the ride cannot be guaranteed.",
        },
        {
          title: "What is the accommodation like?",
          description:
            "Premium 3-star hotels in Srinagar, Pahalgam and Gulmarg, and one night on a traditional carved-cedar houseboat on Dal Lake. Breakfast and dinner are included at every stay.",
        },
        {
          title: "Why are the Pahalgam valley excursions not included?",
          description:
            "Aru, Betaab, Chandanwari and Baisaran are served exclusively by local union cabs and ponies, whose rates are fixed on site and cannot be pre-booked. Budget for them separately if you plan to go.",
        },
        {
          title: "Is the trip suitable for children and senior citizens?",
          description:
            "Yes. There is no trekking, the altitude stays moderate and the daily pace is relaxed. Travellers under 18 need written parental consent to join.",
        },
        {
          title: "How cold does it get?",
          description:
            "Gulmarg can drop below freezing at night in winter and stays cool even in summer. Carry layers, a down or heavy fleece jacket and waterproof footwear whatever the month.",
        },
        {
          title: "Do I need a permit to visit Kashmir?",
          description:
            "Indian nationals need no permit for the Srinagar–Pahalgam–Gulmarg circuit, only an original government photo ID. Foreign nationals should carry their passport and visa for routine registration at hotels.",
        },
        {
          title: "What happens if the weather closes a road?",
          description:
            "Snow and landslides can close the valley roads at short notice. The trip captain may reorder the itinerary, hold the group a day, or drop a leg on safety grounds. Costs of such delays are not included and no refund is due for an itinerary changed for safety.",
        },
      ],

      thingsToCarry: [
        "Warm woollen cap or beanie and a muffler",
        "UV sunglasses for snow glare",
        "High-SPF sunscreen, lip balm and moisturiser",
        "Heavy fleece or down jacket",
        "Woollen sweaters and thermal inners, tops and bottoms",
        "Comfortable jeans or trousers",
        "Extra pairs of woollen socks",
        "Comfortable walking shoes",
        "Waterproof shoes or snow boots for Gulmarg",
        "Slippers for the hotel and houseboat",
        "Original government photo ID",
        "Flight or train tickets",
        "Personal medication and a basic first aid kit",
        "Motion sickness tablets",
        "Power bank",
        "Compact daypack",
        "Umbrella or raincoat",
        "Cash — ATMs are sparse outside Srinagar",
      ],
      thingsToRemember: [
        "Zero tolerance for littering — carry your plastic wrappers and bottles out with you.",
        "Punctuality is required; a late start pushes every drive of the day back.",
        "Minors under 18 need written parental consent to travel.",
        "Gondola, pony and union-cab charges are settled directly on site, in cash.",
        "Unavailed inclusions during the trip are not refundable.",
      ],

      cancellationPolicy:
        "Bookings are non-refundable and non-transferable on client cancellation. A full refund is made only where Trip My Soul cancels the tour. Unavailed activities or inclusions during the trip are not refundable. Rescheduling: one complimentary change is allowed more than 30 days before travel; within 15 days of travel rescheduling is not permitted. Send all rescheduling requests by email to tripmysoulsouth@gmail.com.",

      gallery: [
        {
          url: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/India_-_Srinagar_-_023_-_Nishat_Bagh_Mughal_Gardens.jpg/1920px-India_-_Srinagar_-_023_-_Nishat_Bagh_Mughal_Gardens.jpg",
          caption: "Nishat Bagh terraced above Dal Lake",
        },
        {
          url: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Shalimar_Bagh%2C_Srinagar.jpg/1920px-Shalimar_Bagh%2C_Srinagar.jpg",
          caption: "Shalimar Bagh, laid out for Jahangir in 1619",
        },
        {
          url: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Chashme_Shahi_Garden_%2814526211636%29.jpg/1920px-Chashme_Shahi_Garden_%2814526211636%29.jpg",
          caption: "Chashme Shahi, the smallest of the three Mughal gardens",
        },
        {
          url: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/The_Ancient_Shankaracharya_Temple_%28Srinagar%2C_Jammu_and_Kashmir%29.jpg/1920px-The_Ancient_Shankaracharya_Temple_%28Srinagar%2C_Jammu_and_Kashmir%29.jpg",
          caption: "Shankaracharya Temple on its hill above Srinagar",
        },
        {
          url: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Saffron_From_Pampore.jpg/1920px-Saffron_From_Pampore.jpg",
          caption: "Saffron from the Pampore fields on the Pahalgam road",
        },
        {
          url: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Pahalgam_Valley.jpg/1920px-Pahalgam_Valley.jpg",
          caption: "The Pahalgam valley on the Lidder river",
        },
        {
          url: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/Betaab_Valley%2C_Pehalgam%2C_Kashmir.jpg/1920px-Betaab_Valley%2C_Pehalgam%2C_Kashmir.jpg",
          caption: "Betaab Valley, one of the optional Pahalgam excursions",
        },
        {
          url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Gulmarg_-_Jannat_on_Earth.jpg/1920px-Gulmarg_-_Jannat_on_Earth.jpg",
          caption: "Gulmarg, the meadow of flowers at 8,500 ft",
        },
        {
          url: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Gulmarg_Gondola%2C_Cable_Car.JPG/1920px-Gulmarg_Gondola%2C_Cable_Car.JPG",
          caption: "The Gulmarg Gondola, one of the highest cable cars in the world",
        },
        {
          url: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/Apharwat_Peak_Gulmarg.jpg/1920px-Apharwat_Peak_Gulmarg.jpg",
          caption: "Apharwat Peak at the top of Gondola Phase 2",
        },
        {
          url: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Dal_lake_by_Ahanger_HOBO.jpg/1920px-Dal_lake_by_Ahanger_HOBO.jpg",
          caption: "Houseboats moored on Dal Lake",
        },
      ],
      relatedSlugs: ["leh-ladakh", "shimla-manali", "spiti-valley"],
    }
  ),
  toListingItem(
    {
      name: "Rishikesh & Mussoorie",
      slug: "rishikesh-mussoorie",
      duration: "4N/5D",
      heroImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/63/Lakshman_Jhula_Bridge_-_Hrishikesh_-_Uttarakhand_001.jpg/1920px-Lakshman_Jhula_Bridge_-_Hrishikesh_-_Uttarakhand_001.jpg",
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
      name: "Auli, Chopta & Rishikesh",
      slug: "auli-chopta-rishikesh",
      duration: "7N/8D",
      heroImage:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Auli_in_October_2015_-_38.jpg/1920px-Auli_in_October_2015_-_38.jpg",
      tagline: "Auli's ski slopes, the world's highest Shiva temple and the Ganga at Rishikesh, in one week.",
    },
    {
      region: "Uttarakhand",
      startLocation: "Delhi",
      endLocation: "Delhi",
      difficulty: "Easy-Moderate",
      price: 20700,
      originalPrice: 23000,
      months: ["Nov", "Dec", "Jan", "Feb", "Mar", "Apr"],
      themes: ["Snow", "Temple", "Meadow", "Lakes", "Adventure"],
      category: "Backpacking Trip",
      detailsPath: "/trips/backpacking/auli-chopta-rishikesh",

      alternateNames: [
        "Uttarakhand Backpacking Trip",
        "Auli Chopta Rishikesh",
        "Auli Chopta Tungnath",
        "Chopta Deoria Tal Rishikesh",
        "Joshimath Auli Backpacking",
      ],
      altitude: "12,110 ft / 3,691 m (Chandrashila Summit)",
      availability: "November to early April",
      minAge: 18,
      maxAge: 40,
      maxGroupSize: "As per departure; private, women-only and corporate batches on request",
      contactPhone: "+91 91213 43330",

      intro:
        "Eight days across Garhwal on one loop out of Delhi. Two nights at Joshimath with a full day up at Auli on the chairlift, then across to Chopta for the Tungnath and Chandrashila climb, the mirror lake at Deoria Tal on the way down, and two days in Rishikesh for rafting and the evening Ganga Aarti before the overnight run back to Delhi. Travel is by tempo traveller with a trip captain on board throughout.",
      highlights: [
        "Auli — ski slopes and meadows, reached by chairlift from Joshimath",
        "Nanda Devi and Nar Parvat from the Auli ridge",
        "Tungnath — highest Shiva temple in the world",
        "Chandrashila summit, 360° Himalayan views",
        "Deoria Tal — the lake that mirrors the snow peaks",
        "All four Prayags on the drive: Devprayag, Rudraprayag, Karnaprayag, Nandaprayag",
        "Bonfire evening at Chopta",
        "White-water rafting on the Ganga at Rishikesh",
        "Ram Jhula, Janki Setu and the sunset Ganga Aarti",
      ],
      usps: [
        {
          title: "Three very different Uttarakhands in one trip",
          description:
            "Auli's open ski meadows, Chopta's forest and temple trail, and the river town energy of Rishikesh — a week that would normally take three separate bookings.",
        },
        {
          title: "A summit that a beginner can actually reach",
          description:
            "Chandrashila is 12,110 ft, but the climb from Chopta is only about 4 km each way on a stepped trail. Reasonable fitness is enough; no technical skill is needed.",
        },
        {
          title: "Chairlift included, no trek to the snow line",
          description:
            "The Joshimath to Auli chairlift and the local cab to the lift station are both covered, so the Auli day is spent on the slopes rather than getting to them.",
        },
        {
          title: "18 to 40, backpacker pace",
          description:
            "A young open-group batch travelling together in one tempo traveller, on shared rooms, with a trip captain from the Delhi pickup to the Delhi drop.",
        },
      ],
      idealFor:
        "Backpackers, solo travellers and friend groups aged 18 to 40 who want snow, a Himalayan summit and the Ganga in a single week off work.",
      importantNote:
        "Days 1 and 7 are overnight road journeys between Delhi and the hills, and the Delhi–Joshimath leg can run 15 to 18 hours depending on road conditions. If heavy snowfall blocks the tempo traveller, a 4x4 is arranged locally and charged on the spot. Tungnath temple itself closes for the winter from November to April, though the trail to the temple door stays open for the snow trek.",
      destinationHighlights: [
        {
          name: "Joshimath",
          blurb:
            "The base town at 6,150 ft, two nights on this itinerary. Gateway to Auli and Badrinath, and the last proper town before the ski slopes.",
        },
        {
          name: "Auli",
          blurb:
            "Open bugyal meadow and India's best-known ski slope, 12 km above Joshimath and reached by chairlift. Nanda Devi, Nar Parvat and the Himalayan wall fill the skyline.",
        },
        {
          name: "Chopta",
          blurb:
            "A forest meadow inside the Kedarnath Wildlife Sanctuary rather than a town — deodar and rhododendron on every side, which is why it is called the Mini Switzerland of India. Trailhead for Tungnath.",
        },
        {
          name: "Tungnath & Chandrashila",
          blurb:
            "Tungnath is the highest Shiva temple in the world and one of the Panch Kedar. Chandrashila, 1.5 km further up, tops out at 12,110 ft with a 360° view of the Garhwal peaks.",
        },
        {
          name: "Deoria Tal",
          blurb:
            "A small lake a short climb above Sari Village that holds a clean reflection of the Chaukhamba massif on a still morning.",
        },
        {
          name: "Rishikesh",
          blurb:
            "The last stop: rafting on the Ganga, the Ram Jhula and Janki Setu footbridges, the cafes of Tapovan and the Aarti on the ghats at sunset.",
        },
      ],

      itinerary: [
        {
          day: 1,
          title: "Delhi to Joshimath — overnight drive",
          entries: [
            { time: "8:30 PM", text: "Report at the Delhi pickup point and meet the trip captain." },
            { text: "Depart by tempo traveller for Joshimath — about 505 km." },
            { text: "Overnight in the vehicle. Expect a long haul: 15 to 18 hours on the road is normal for this leg." },
          ],
        },
        {
          day: 2,
          title: "Arrive Joshimath, rest and acclimatise",
          entries: [
            { text: "Drive on through the Prayags — Devprayag, Rudraprayag, Karnaprayag and Nandaprayag — alongside the Alaknanda." },
            { time: "Afternoon", text: "Reach Joshimath (6,150 ft) and check in." },
            { text: "Leisure day. Rest, walk around town and let the altitude settle." },
            { text: "Overnight in Joshimath. Dinner included." },
          ],
        },
        {
          day: 3,
          title: "Joshimath to Auli and back",
          entries: [
            { time: "After breakfast", text: "Local cab to the chairlift station, then up to Auli — about 12 km." },
            { text: "The day at Auli: the ski slopes, the meadows and views of Nanda Devi and Nar Parvat." },
            { time: "Evening", text: "Return to Joshimath." },
            { text: "Overnight in Joshimath. Breakfast and dinner included." },
          ],
        },
        {
          day: 4,
          title: "Joshimath to Chopta",
          entries: [
            { time: "After breakfast", text: "Check out and drive to Chopta — about 145 km through Chamoli and Ukhimath." },
            { text: "Vegetarian snacks en route." },
            { time: "Evening", text: "Check in to the camp at Chopta. Bonfire, weather permitting." },
            { text: "Overnight in Chopta. Breakfast and dinner included." },
          ],
        },
        {
          day: 5,
          title: "Tungnath and Chandrashila",
          entries: [
            { time: "Early morning", text: "Breakfast, then start the trek from Chopta." },
            { text: "Climb about 4 km to Tungnath, the highest Shiva temple in the world, and on to the Chandrashila summit at 12,110 ft." },
            { text: "Packed lunch on the trail. Descend to Chopta the same day." },
            { text: "Overnight in Chopta. Breakfast, packed lunch and dinner included." },
          ],
        },
        {
          day: 6,
          title: "Deoria Tal, then down to Rishikesh",
          entries: [
            { time: "Early morning", text: "Drive to Sari Village and trek up to Deoria Tal for the reflection of the snow peaks." },
            { text: "Return to Sari, then the long drive down to Rishikesh." },
            { time: "Evening", text: "Check in at Rishikesh." },
            { text: "Overnight in Rishikesh. Breakfast and dinner included." },
          ],
        },
        {
          day: 7,
          title: "Rafting and Rishikesh, then overnight to Delhi",
          entries: [
            { time: "Morning", text: "White-water rafting on the Ganga." },
            { time: "Afternoon", text: "Rishikesh sightseeing — Ram Jhula, Janki Setu and the cafes." },
            { time: "Sunset", text: "Ganga Aarti on the ghats." },
            { time: "Night", text: "Depart Rishikesh for Delhi. Overnight in the vehicle. Breakfast included." },
          ],
        },
        {
          day: 8,
          title: "Arrive Delhi",
          entries: [
            { time: "6:00 AM", text: "Expected arrival in Delhi. Trip concludes." },
            { text: "Keep a buffer of at least 3 hours before any onward flight or train." },
          ],
        },
      ],

      costIncludes: [
        "Accommodation on shared occupancy — double, triple or quad — as per the itinerary",
        "All transport by tempo traveller, Delhi to Delhi",
        "11 vegetarian meals in total, on a modified American plan — breakfast and dinner at the stays",
        "Packed lunch on the Tungnath trek day",
        "Vegetarian snacks on Day 4",
        "Tungnath entry fee",
        "Chairlift at Auli",
        "Local cab from Joshimath to the chairlift station and back",
        "White-water rafting at Rishikesh",
        "All sightseeing as per the itinerary",
        "Trip captain with the group throughout",
        "Toll taxes, parking and driver allowances",
        "All necessary permits",
        "First aid kit",
      ],
      costExcludes: [
        "Early check-in before 1 PM and late check-out after 11 AM",
        "Lunches and any meal not listed under inclusions",
        "Entry tickets at exploration sites",
        "A 4x4 vehicle if heavy snowfall blocks the tempo traveller — arranged locally and paid on the spot",
        "Extra stay or food costs arising from travel delays",
        "Personal expenses",
        "Travel and medical insurance",
        "Anything not listed under inclusions",
      ],
      priceNote:
        "₹20,700 per person after the early-bird discount, down from ₹23,000. GST at 5% applies on top. The fare covers transport, shared stays, the listed meals, the Auli chairlift and the Rishikesh rafting; lunches, entry tickets and any snow-day 4x4 are paid directly.",

      eligibilityCriteria: [
        { icon: "User", text: "Open to travellers aged 18 to 40 — this is a young open-group backpacking batch" },
        { icon: "Footprints", text: "Able to walk about 8 km return on a stepped mountain trail on the Tungnath day" },
        { icon: "FileText", text: "Original government photo ID is mandatory — driving licence, Aadhaar or voter ID" },
        { icon: "Car", text: "Two overnight road journeys and several long mountain driving days; the Delhi–Joshimath leg alone can run 15 to 18 hours" },
        { icon: "Stethoscope", text: "Tell the team in advance about any chronic condition, joint problem or respiratory concern, and carry your own medication" },
      ],
      fitnessCriteria: [
        { icon: "Footprints", text: "Comfortable covering 4 km uphill to around 12,000 ft and back down the same day" },
        { icon: "Activity", text: "Two to three weeks of regular cardio before the trip makes the Chandrashila climb far easier" },
        { icon: "Heart", text: "Motion sickness tablets if ghat roads affect you — the route is almost entirely hill road" },
      ],
      howToReach: {
        intro:
          "The trip runs Delhi to Delhi. The batch leaves the Delhi pickup point at 8:30 PM on Day 1 and is back by about 6:00 AM on Day 8 — book onward travel with a buffer, since both legs are overnight road journeys.",
        air: {
          summaryLabel: "Nearest Airport",
          summary: "Indira Gandhi International Airport (DEL), Delhi",
          detail:
            "Reach Delhi by the evening of Day 1 to make the 8:30 PM departure. On Day 8 the group reaches Delhi around 6:00 AM; allow at least 3 hours before a flight.",
        },
        train: {
          summaryLabel: "Nearest Railway Station",
          summary: "New Delhi Railway Station (NDLS) / Anand Vihar Terminal (ANVT)",
          detail:
            "Both are a short ride from the pickup point. The exact pickup location is shared with the batch a few days before departure.",
        },
        road: {
          summaryLabel: "Route",
          summary: "Delhi → Joshimath → Auli → Chopta → Sari (Deoria Tal) → Rishikesh → Delhi",
          detail:
            "About 505 km from Delhi to Joshimath, 12 km up to Auli, 145 km across to Chopta, then down to Rishikesh and back to Delhi. All transport is by tempo traveller and is part of the package.",
          route: ["Delhi", "Devprayag", "Rudraprayag", "Karnaprayag", "Nandaprayag", "Joshimath", "Auli", "Chopta", "Sari / Deoria Tal", "Rishikesh", "Delhi"],
          facts: [
            { label: "Duration", value: "8 Days / 7 Nights" },
            { label: "Highest point", value: "Chandrashila Summit — 12,110 ft / 3,691 m" },
            { label: "Trekking", value: "About 8 km return to Tungnath and Chandrashila on Day 5, plus the short Deoria Tal climb on Day 6" },
          ],
        },
        pickup: {
          point: "Delhi — exact pickup point shared with the batch before departure",
          time: "Day 1, 8:30 PM",
          dropPoint: "Delhi",
          dropTime: "Day 8, around 6:00 AM",
          note:
            "Both the outbound and return legs are overnight drives. Road and weather conditions can shift these times by several hours.",
        },
      },

      faqs: [
        {
          title: "How long is the trip and where does it start?",
          description:
            "8 Days / 7 Nights, Delhi to Delhi. The batch leaves Delhi at 8:30 PM on Day 1 and returns around 6:00 AM on Day 8. Two of the seven nights are spent travelling overnight in the vehicle.",
        },
        {
          title: "How much travel is involved?",
          description:
            "A lot — this is a road trip as much as a trek. Delhi to Joshimath is about 505 km and commonly takes 15 to 18 hours; Joshimath to Chopta is another 145 km of hill road, and the return to Delhi is an overnight drive. Plan for it rather than being surprised by it.",
        },
        {
          title: "How difficult is the Tungnath and Chandrashila trek?",
          description:
            "Easy to moderate. It is roughly 4 km up from Chopta to Tungnath and on to Chandrashila at 12,110 ft, on a stepped trail, and the same back down on the same day. Beginners with reasonable fitness manage it; in winter the snow makes it slower and a good grippy shoe matters.",
        },
        {
          title: "Is it suitable for beginners?",
          description:
            "Yes. There is no technical climbing anywhere on the itinerary, Auli is reached by chairlift and Deoria Tal is a short walk. Day 5 is the only real trekking day.",
        },
        {
          title: "What is the best time to go?",
          description:
            "November to early April. December to February brings the heaviest snow at Auli and Chopta; March and early April are clearer and milder with snow still on the higher slopes.",
        },
        {
          title: "Will Tungnath temple be open?",
          description:
            "The temple itself closes for the winter from roughly November to April, when the deity is moved down to Ukhimath. The trail stays open to the temple door, so the trek and the Chandrashila summit still run — you just may not find the shrine itself open.",
        },
        {
          title: "What should I carry, especially in winter?",
          description:
            "Thermals, a heavy insulated jacket, gloves, a woollen cap, waterproof trekking shoes with grip, sunglasses and sunscreen. Full list under Things to Carry.",
        },
        {
          title: "Can snowfall or roadblocks change the plan?",
          description:
            "Yes. Heavy snowfall, landslides or roadblocks can alter the route or the order of days, and if the tempo traveller cannot get through, a 4x4 is arranged locally and charged on the spot. The trip captain decides on the ground, with safety first.",
        },
        {
          title: "What accommodation is provided?",
          description:
            "Shared occupancy — double, triple or quad — in hotels or guesthouses at Joshimath and Rishikesh, and a camp at Chopta. Rooms are arranged separately for men and women; ask in advance for couple sharing.",
        },
        {
          title: "What meals are included?",
          description:
            "11 vegetarian meals in total, on a modified American plan — breakfast and dinner at the stays — plus a packed lunch on the Tungnath trek day and snacks on Day 4. Other lunches and anything on the road are on you.",
        },
        {
          title: "Is the Auli chairlift included?",
          description:
            "Yes. Both the chairlift at Auli and the local cab from Joshimath to the lift station and back are part of the package.",
        },
        {
          title: "Will a trip captain travel with us?",
          description:
            "Yes — a trip captain is with the batch from the Delhi pickup to the Delhi drop, alongside a dedicated driver.",
        },
      ],

      thingsToCarry: [
        "Thermal innerwear, top and bottom",
        "Heavy insulated or down jacket",
        "Fleece or woollen sweater as a mid-layer",
        "Windproof and waterproof outer shell",
        "Woollen cap, neck gaiter and warm gloves",
        "Waterproof trekking shoes with good grip — not sneakers, for the snow",
        "Extra pairs of woollen socks and undergarments",
        "Slippers or sandals for the stays",
        "20–30L daypack for the trek days",
        "Sunglasses with UV protection and sunscreen — snow glare is strong",
        "Reusable water bottle and a thermos",
        "Headtorch with spare batteries",
        "Power bank — charging is limited at Chopta",
        "Quick-dry towel and basic toiletries",
        "Personal medication and a small first aid kit",
        "Original government photo ID",
      ],
      thingsToRemember: [
        ...TRIP_GROUND_RULES,
        "Days 1 and 7 are overnight drives — sleep on the bus is the plan, not a hotel.",
        "Network is patchy from Joshimath onwards and weak at Chopta; Jio works best.",
        "Carry cash. ATMs are unreliable past Joshimath, and the snow-day 4x4 and entry tickets are settled on site.",
        "Unavailed inclusions during the trip are not refundable.",
      ],
      transportModes: TRANSPORT_BY_GROUP_SIZE,
      cancellationPolicy: TRIP_CANCELLATION_POLICY,
      confirmationPolicy: CONFIRMATION_POLICY,

      // Day 1 of each batch — the Delhi departure night. The 7 Nov 2026 batch
      // is listed as full at source and is left out.
      batchDates: [
        "2026-11-14",
        "2026-11-21",
        "2026-11-28",
        "2026-12-05",
        "2026-12-12",
        "2027-01-09",
        "2027-01-16",
        "2027-01-23",
        "2027-01-30",
        "2027-02-06",
        "2027-02-13",
        "2027-02-20",
        "2027-02-27",
        "2027-03-06",
        "2027-03-13",
        "2027-03-20",
        "2027-03-26",
      ],

      // The source page is self-contradictory on two points, both kept as
      // published rather than silently resolved — see `sourceCaveat`.
      sourceCaveat:
        "The source itinerary describes the trip as starting and ending at Rishikesh in its overview, while its batch list and day plan both run Delhi to Delhi; the Delhi version is used here. It also prints Chandrashila at 12,110 ft, where our own Chopta listings carry 13,000 ft for the same summit. Confirm both with the team at the time of booking.",

      gallery: [
        {
          url: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Auli_in_October_2015_-_38.jpg/1920px-Auli_in_October_2015_-_38.jpg",
          caption: "The meadows and ski slopes above Joshimath at Auli",
        },
        {
          url: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/Tungnath_Temple_in_winter.jpg/1920px-Tungnath_Temple_in_winter.jpg",
          caption: "Tungnath, the highest Shiva temple in the world, under winter snow",
        },
      ],
      relatedSlugs: ["auli-yatra", "rishikesh-mussoorie", "kedarnath-yatra"],
    }
  ),
  toListingItem(
    {
      name: "Meghalaya",
      slug: "meghalaya",
      duration: "5N/6D",
      heroImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/Nohkalikai_falls_bikash.jpg/1920px-Nohkalikai_falls_bikash.jpg",
      tagline: "Living root bridges, crystal rivers, and the abode of clouds.",
    },
    {
      region: "Meghalaya",
      startLocation: "Guwahati",
      endLocation: "Guwahati",
      difficulty: "Easy-Moderate",
      price: 17999,
      months: ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr"],
      themes: ["Waterfall", "Off-Beat", "Beginner", "Family with Kids", "Adventure"],
      category: "Backpacking Trip",
      detailsPath: "/trips/backpacking/meghalaya",

      alternateNames: [
        "Meghalaya Backpacking Trip",
        "Shillong Cherrapunji Dawki",
        "Scotland of the East",
        "Double Decker Living Root Bridge",
        "Umngot River Dawki",
      ],
      altitude: "Approx. 5,250 ft / 1,600 m (Shillong)",
      availability: "October to April",
      maxGroupSize: "As per departure; private, women-only and corporate batches on request",
      contactPhone: "+91 91213 43330",

      intro:
        "Six days in the Scotland of the East, starting and ending at Guwahati. Misty hills on the drive up to Shillong, the cascades of Cherrapunji, a day down thousands of stone steps to the Double Decker living root bridge at Nongriat, the glass-clear Umngot river at Dawki, and the limestone caves and canyon viewpoints in between — run at an easy pace with Khasi hosts and one proper trekking day.",
      highlights: [
        "The Double Decker living root bridge at Nongriat",
        "Nohkalikai Falls, the tallest plunge waterfall in India",
        "Elephant Falls and the Shillong viewpoints",
        "The transparent Umngot river at Dawki",
        "Mawsmai and Arwah limestone caves",
        "Seven Sisters Falls and the Cherrapunji canyon views",
        "Khasi village hospitality and local markets",
        "Mawlynnong, Asia's cleanest village, on the Dawki circuit",
      ],
      usps: [
        {
          title: "One real trek, no expedition commitment",
          description:
            "Day 3 is a genuine 6–7 km return hike on stone steps to Nongriat. The rest of the trip is road transit and short walks, so a beginner gets the root bridge without signing up for a multi-day trek.",
        },
        {
          title: "Permits and transfers handled end to end",
          description:
            "Airport or railway pickup at Guwahati, every transfer on the itinerary and all state and entry permits are arranged for you.",
        },
        {
          title: "Three bases, no backtracking",
          description:
            "Shillong, Cherrapunji and Dawki in sequence, each a short drive from the last — the circuit closes back at Guwahati without repeating a leg.",
        },
        {
          title: "A trip captain with the group throughout",
          description:
            "A dedicated driver and trip captain travel with the batch from pickup to drop, handling stays, routing and the day plan.",
        },
      ],
      idealFor:
        "Beginners, backpackers, solo travellers, couples, families and corporate teams who want the Northeast's waterfalls, caves and root bridges with only one demanding walking day.",
      importantNote:
        "Day 3 descends and re-climbs roughly 3,500 stone steps to the Double Decker root bridge. It is the one strenuous day of the trip — come prepared for it, or arrange with the trip captain to wait at Tyrna. Local guide charges for that trek and boating fees at Dawki are paid on site.",
      destinationHighlights: [
        {
          name: "Shillong",
          blurb:
            "The Khasi hill capital at about 1,600 m, and the base for the first and fifth nights. Elephant Falls, the viewpoints above town, Ward's Lake and Police Bazaar for the evening markets.",
        },
        {
          name: "Cherrapunji",
          blurb:
            "Sohra, 50–60 km south of Shillong on the edge of the plateau. Nohkalikai Falls, Seven Sisters Falls, the Mawsmai and Arwah limestone caves, and canyon views down into the Bangladesh plains.",
        },
        {
          name: "Nongriat",
          blurb:
            "A village in the gorge below Tyrna, reached only on foot down a long flight of stone steps. The Double Decker living root bridge — two tiers of ficus roots trained across the stream over generations — stands here.",
        },
        {
          name: "Dawki & the Umngot",
          blurb:
            "On the Bangladesh border, about 85 km from Cherrapunji. The Umngot runs clear enough in the dry season for a boat to look like it is floating on air; boating is charged directly at the ghat.",
        },
        {
          name: "Mawlynnong",
          blurb:
            "Asia's cleanest village, on the Dawki circuit — bamboo walkways, a sky view platform, and another single-span living root bridge nearby at Riwai.",
        },
      ],

      itinerary: [
        {
          day: 1,
          title: "Arrive Guwahati and transfer to Shillong",
          entries: [
            { time: "On arrival", text: "Pickup from Guwahati airport or railway station and briefing with the trip captain." },
            { text: "Drive to Shillong on NH 6 — about 100 km, 3 hours, with a stop at Umiam Lake." },
            { time: "Evening", text: "Check in, then free time at Police Bazaar and the local markets." },
            { text: "Overnight in Shillong (about 1,600 m). No meals on this day." },
          ],
        },
        {
          day: 2,
          title: "Shillong to Cherrapunji sightseeing",
          entries: [
            { time: "After breakfast", text: "Check out and drive to Cherrapunji — about 50–60 km, 2 hours." },
            { text: "Elephant Falls and the Shillong viewpoints on the way out of town." },
            { text: "Nohkalikai Falls, Seven Sisters Falls and the canyon viewpoints at Sohra." },
            { text: "Mawsmai and Arwah limestone caves, depending on the light left in the day." },
            { text: "Overnight in Cherrapunji. Breakfast included." },
          ],
        },
        {
          day: 3,
          title: "Double Decker living root bridge at Nongriat",
          entries: [
            { time: "Early morning", text: "Breakfast and an early start from the hotel to Tyrna, the trailhead." },
            { text: "Descend roughly 3,500 stone steps through forest to Nongriat — about 6–7 km return, 4–5 hours including time at the bridge." },
            { text: "Time at the Double Decker root bridge and the natural pools before the climb back out." },
            { time: "Evening", text: "Return to the hotel in Cherrapunji." },
            { text: "Overnight in Cherrapunji. Breakfast included. A local guide for the trek is paid on site." },
          ],
        },
        {
          day: 4,
          title: "Cherrapunji to Dawki",
          entries: [
            { time: "After breakfast", text: "Check out and drive to Dawki — about 85 km, 2.5 hours." },
            { text: "Stop at Mawlynnong, Asia's cleanest village, and the single-span root bridge at Riwai." },
            { text: "Reach the Umngot river. Boating on the clear water is available at the ghat, charged directly." },
            { time: "Evening", text: "Check in to the hotel or riverside camp." },
            { text: "Overnight in Dawki. Breakfast and dinner included." },
          ],
        },
        {
          day: 5,
          title: "Dawki to Shillong via the waterfalls",
          entries: [
            { time: "After breakfast", text: "Check out and drive back up to Shillong — about 80 km, 3 hours." },
            { text: "Waterfall and viewpoint stops en route, as the weather allows." },
            { time: "Evening", text: "Check in at Shillong, with free time for shopping and cafes." },
            { text: "Overnight in Shillong. Breakfast included." },
          ],
        },
        {
          day: 6,
          title: "Shillong to Guwahati airport drop",
          entries: [
            { time: "After breakfast", text: "Check out and drive to Guwahati — about 100 km, 3 hours." },
            { text: "Drop at Guwahati airport or railway station. Trip concludes." },
            { text: "Keep a buffer of at least 3 hours before any onward flight or train — this is a hill road." },
          ],
        },
      ],

      costIncludes: [
        "Airport or railway station pick-up and drop at Guwahati",
        "5 nights accommodation in hotels or guesthouses on a sharing basis",
        "Daily breakfast from Day 2 to Day 6",
        "Dinner on Day 4 at Dawki",
        "All transfers and sightseeing as per the itinerary",
        "All state and entry permits required for the tour",
        "Dedicated driver and trip captain with the group throughout",
      ],
      costExcludes: [
        "Airfare and railway fare",
        "Lunches and any meal not listed in the itinerary",
        "Local guide charges for the Double Decker root bridge trek",
        "Boating fees on the Umngot river at Dawki",
        "Monument, cave and sightseeing entry fees",
        "Travel and medical insurance",
        "Anything not listed under inclusions",
      ],
      priceNote:
        "The fare covers transfers, stays, permits and the listed meals only. The Nongriat trek guide, Dawki boating and all entry tickets are paid directly on site.",

      eligibilityCriteria: [
        { icon: "User", text: "Open to beginners, backpackers, solo travellers, couples and families" },
        { icon: "Footprints", text: "Day 3 needs the stamina for roughly 3,500 stone steps down and back up — the rest of the trip is light walking" },
        { icon: "FileText", text: "Original government photo ID is mandatory — driving licence, Aadhaar or voter ID; foreign nationals must carry passport and a valid Indian visa" },
        { icon: "Car", text: "Winding hill roads on every transfer day, 2–3 hours at a time" },
        { icon: "Stethoscope", text: "Tell the team in advance about any chronic condition, joint problem or respiratory concern, and carry your own medication" },
      ],
      fitnessCriteria: [
        { icon: "Footprints", text: "Able to descend and climb a long flight of stone steps — about 6–7 km return over 4–5 hours" },
        { icon: "Activity", text: "Two weeks of regular cardio and stair-climbing practice before the trip makes Day 3 far easier" },
        { icon: "Heart", text: "Light stretching beforehand, and motion sickness tablets if ghat roads affect you" },
      ],
      howToReach: {
        intro:
          "The trip starts and ends at Guwahati. Pickup from the airport or railway station is included — share your arrival details in advance so the transfer can be timed.",
        air: {
          summaryLabel: "Nearest Airport",
          summary: "Lokpriya Gopinath Bordoloi International Airport (GAU), Guwahati",
          detail:
            "Well connected to Delhi, Kolkata, Mumbai and Bengaluru. Airport pickup on Day 1 and drop on Day 6 are part of the package.",
        },
        train: {
          summaryLabel: "Nearest Railway Station",
          summary: "Guwahati Railway Station (GHY)",
          detail:
            "Connected to most major Indian cities. Station pickup and drop are included on the same terms as the airport transfer.",
        },
        road: {
          summaryLabel: "Route",
          summary: "Guwahati → Shillong → Cherrapunji → Nongriat → Dawki → Shillong → Guwahati",
          detail:
            "About 100 km from Guwahati to Shillong on NH 6, 50–60 km on to Cherrapunji, 85 km to Dawki and 80 km back up to Shillong. Cabs and shared transit also run on the Guwahati–Shillong leg for anyone joining late.",
          route: ["Guwahati", "Shillong", "Cherrapunji", "Nongriat", "Dawki", "Mawlynnong", "Shillong", "Guwahati"],
          facts: [
            { label: "Duration", value: "6 Days / 5 Nights" },
            { label: "Highest point", value: "Shillong — about 5,250 ft / 1,600 m" },
            { label: "Trekking", value: "About 6–7 km return on Day 3; 3–6 km of walking on the other sightseeing days" },
          ],
        },
        pickup: {
          point: "Guwahati airport (GAU) or Guwahati railway station",
          time: "Day 1, on arrival — share your flight or train details in advance",
          dropPoint: "Guwahati airport or railway station",
          dropTime: "Day 6, afternoon",
          note:
            "Book the return flight or train with at least a 3-hour buffer after the scheduled drop.",
        },
      },

      faqs: [
        {
          title: "How long is the trip?",
          description:
            "5 Nights / 6 Days, Guwahati to Guwahati — one night in Shillong, two in Cherrapunji, one in Dawki and one back in Shillong.",
        },
        {
          title: "How hard is the Double Decker root bridge trek?",
          description:
            "It is the one demanding day. Roughly 3,500 stone steps down to Nongriat and the same back up — about 6–7 km return over 4–5 hours. Moderate fitness and a couple of weeks of stair practice are enough; the grade elsewhere on the trip is easy.",
        },
        {
          title: "When is the best time to go?",
          description:
            "October to April. The Umngot at Dawki is at its clearest in the dry winter months, and the waterfalls still run well into the post-monsoon season.",
        },
        {
          title: "What meals are included?",
          description:
            "Breakfast each day from Day 2 to Day 6, plus dinner at Dawki on Day 4. Lunches and everything else are on you — both vegetarian and non-vegetarian local food is easy to find.",
        },
        {
          title: "Are permits included?",
          description:
            "Yes. All state and entry permits required for the tour are arranged as part of the package. Entry tickets at individual monuments and caves are not.",
        },
        {
          title: "Is boating at Dawki included?",
          description:
            "No. Boats on the Umngot are hired at the ghat and paid directly. Your trip captain will point you to the licensed operators.",
        },
        {
          title: "What is the accommodation like?",
          description:
            "Comfortable hotels and guesthouses on a sharing basis, with a hotel or riverside camp at Dawki. Rooms are arranged separately for men and women; ask in advance for couple sharing.",
        },
        {
          title: "Can we book private or custom dates?",
          description:
            "Yes. Alongside the open group departures, custom batches can be arranged for private groups, women-only groups and corporate teams. Call or WhatsApp +91 91213 43330.",
        },
        {
          title: "How do I confirm a seat?",
          description:
            "₹5,000 per person as advance blocks the seat. It is non-refundable, and the balance is due 10 days before departure.",
        },
      ],

      thingsToCarry: [
        "Hat or cap",
        "Light jacket, and a warmer one for the winter months",
        "Thermal innerwear, top and bottom, for December to February",
        "Comfortable travel clothes and quick-dry tees",
        "Extra pairs of socks and undergarments",
        "Gloves for the colder departures",
        "Sturdy trekking or running shoes with grip for the Nongriat steps",
        "Slippers or sandals for the stays",
        "20–30L daypack for the day excursions",
        "Reusable water bottle",
        "Umbrella or raincoat — Meghalaya rains out of season too",
        "Power bank",
        "Personal medication and a basic first aid kit",
        "Original government photo ID — passport and Indian visa for foreign nationals",
      ],
      thingsToRemember: [
        ...TRIP_GROUND_RULES,
        "Day 3 is strenuous — pace yourself on the climb back out of Nongriat and carry enough water.",
        "The Nongriat guide, Dawki boating and all entry tickets are settled on site, in cash.",
        "Unavailed inclusions during the trip are not refundable.",
      ],
      transportModes: TRANSPORT_BY_GROUP_SIZE,
      cancellationPolicy:
        "The ₹5,000 advance is non-refundable under any circumstances. Cancel 7 days or more before departure and 50% of the balance is refunded. No refund is given for cancellations made less than 48 hours before the trip. If Trip My Soul cancels for weather, political unrest, low participation or another unforeseen situation, you receive a full refund less any transport cancellation charges. Rescheduling to a later batch is at management discretion and subject to seat availability.",
      confirmationPolicy:
        "₹5,000 per person as advance confirms your seat and is non-refundable. The remaining balance is payable 10 days before departure; the seat is finally confirmed only on full payment.",
      bookingAdvance: 5000,
      balanceDueDays: 10,

      gallery: [
        {
          url: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/Nohkalikai_falls_bikash.jpg/1920px-Nohkalikai_falls_bikash.jpg",
          caption: "Nohkalikai Falls, the tallest plunge waterfall in India",
        },
        {
          url: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Mawlynnong%27s_Living_Root_Bridge_in_Meghalaya%2C_India.jpg/1920px-Mawlynnong%27s_Living_Root_Bridge_in_Meghalaya%2C_India.jpg",
          caption: "A living root bridge trained across the stream near Mawlynnong",
        },
      ],
      relatedSlugs: ["rishikesh-mussoorie", "leh-ladakh", "spiti-valley"],
    }
  ),
  toListingItem(
    {
      name: "Leh Ladakh",
      slug: "leh-ladakh",
      duration: "6N/7D",
      heroImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Pangong_Tso_in_eastern_Ladakh%28Changthang%29.jpg/1920px-Pangong_Tso_in_eastern_Ladakh%28Changthang%29.jpg",
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
      heroImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Key_Monastery%28_Lahaul_Spiti%29.jpg/1920px-Key_Monastery%28_Lahaul_Spiti%29.jpg",
      tagline: "Remote Himalayan villages, ancient gompas, and rugged desert mountains.",
    },
    {
      region: "Himachal Pradesh",
      startLocation: "Manali",
      endLocation: "Manali",
      difficulty: "Difficult",
      price: 24999,
      months: ["May", "Jun", "Jul", "Aug", "Sep", "Oct"],
      themes: ["Off-Beat", "Snow", "Adventure"],
      category: "Backpacking Trip",
      detailsPath: "/trips/backpacking/spiti-valley",

      // Names the same circuit was sold under on the old site — see
      // `LEGACY_PACKAGE_KEYS`, which points all three at this slug.
      alternateNames: [
        "Spiti Summer Expedition",
        "Spiti Winter Expedition",
        "Lahaul Spiti Circuit",
        "Spiti Valley Road Trip",
      ],
      altitude: "15,027 ft / 4,581 m (Komic)",
      availability: "May – October, once the Kunzum Pass road opens",
      minAge: 12,
      maxGroupSize: "18 travellers per departure",
      contactNumbers: TRIP_CONTACT_NUMBERS,

      // Weekly Saturday departures across the Kunzum-open season. Declared as a
      // rule rather than ~23 hand-typed dates — see `datesInRange`.
      batchDates: datesInRange("2026-05-02", "2026-10-03", [6]),

      intro:
        "Eight days on the road through the cold desert of Lahaul & Spiti — Manali to Kaza over the 14,931 ft Kunzum Pass, the thousand-year-old gompas at Key, Dhankar and Tabo, the world's highest villages at Langza, Hikkim and Komic, the Pin Valley, and a night camped beside Chandratal before the drive back. Entirely by road: there is no trekking on this circuit beyond short walks at each stop.",
      highlights: [
        "Kunzum Pass (14,931 ft) — the gateway between Lahaul and Spiti",
        "Key Monastery, the largest and oldest gompa in Spiti",
        "Hikkim — the world's highest post office, at 14,567 ft",
        "Komic and Langza, among the highest motorable villages on earth",
        "Tabo Monastery, founded in 996 CE and known as the Ajanta of the Himalayas",
        "Dhankar Gompa, perched on a spur above the Spiti–Pin confluence",
        "Mudh village and the Pin Valley National Park",
        "A night under canvas at Chandratal, the crescent-shaped moon lake",
      ],
      usps: [
        {
          title: "Two nights in Kaza before going higher",
          description:
            "The itinerary holds you at Kaza (12,500 ft) for a full day before the Langza–Komic loop, so your body has time to adjust. Rushing straight to 15,000 ft is the single most common cause of AMS on this circuit.",
        },
        {
          title: "Chandratal under canvas, not a day visit",
          description:
            "Most operators photograph Chandratal from the roadhead and drive on. You camp at the designated site near the lake and see it at both dusk and first light.",
        },
        {
          title: "Oxygen and a first-aid kit in the vehicle",
          description:
            "Portable oxygen, a pulse oximeter and a stocked first-aid kit travel with the group throughout. The nearest hospital to Kaza is in Keylong or Reckong Peo, several hours away.",
        },
        {
          title: "Local drivers, local homestays",
          description:
            "Drivers are from Lahaul and Spiti and know the road in every condition. Village nights are in family-run homestays rather than chain hotels.",
        },
      ],
      idealFor:
        "Travellers who want high-altitude Himalayan landscape and Buddhist monastic culture without a multi-day trek, and who are comfortable with long mountain drives, basic village accommodation and limited mobile network.",
      importantNote:
        "Spiti is a high-altitude cold desert. The circuit crosses 14,000 ft on Day 2 and stays above 12,000 ft for most of the trip. The Kunzum Pass road is snowbound and closed from roughly November to April, so departures run only in the open season and the route may still be reversed via Shimla at short notice if the pass is blocked.",
      destinationHighlights: [
        {
          name: "Kaza",
          blurb:
            "Spiti's largest settlement and sub-divisional headquarters at around 12,500 ft, on the left bank of the Spiti river. The base for the Langza–Hikkim–Komic loop and the last place on the circuit with reliable ATMs, fuel and a BSNL signal.",
        },
        {
          name: "Key Monastery",
          blurb:
            "The largest monastery in Spiti, about 14 km from Kaza, stacked in tiers up a conical hill above the river at roughly 13,700 ft. A Gelugpa gompa believed to date to the 11th century, holding old thangkas, manuscripts and a working monastic school.",
        },
        {
          name: "Hikkim, Langza & Komic",
          blurb:
            "Three villages on the plateau above Kaza. Hikkim runs the world's highest post office at 14,567 ft; Langza sits under a hillside Buddha statue in ground rich with marine fossils; Komic, at about 15,027 ft, claims the highest motorable village with a monastery.",
        },
        {
          name: "Tabo Monastery",
          blurb:
            "Founded in 996 CE and in continuous use since — mud-walled, low and unassuming from outside, with murals and stucco inside that give it the name 'Ajanta of the Himalayas'. A protected monument of national importance.",
        },
        {
          name: "Dhankar",
          blurb:
            "The old fort-capital of the Spiti kingdom, built on a spur of eroded rock overlooking the point where the Pin meets the Spiti. A short, steep walk above the village leads to Dhankar Lake.",
        },
        {
          name: "Pin Valley",
          blurb:
            "A side valley running south from the Spiti river into Pin Valley National Park — snow leopard and ibex country, and the only part of Spiti where the Nyingma order predominates. The road ends at Mudh village.",
        },
        {
          name: "Chandratal",
          blurb:
            "A crescent-shaped lake at about 14,100 ft on the Samudra Tapu plateau, fed by snowmelt and changing colour through the day. Camping is restricted to designated sites a short walk from the shore.",
        },
      ],

      itinerary: [
        {
          day: 0,
          title: "Delhi to Manali — overnight journey",
          entries: [
            { time: "5:30 PM", text: "Board the overnight Volvo from Delhi (Majnu Ka Tila / RK Ashram). Booked separately — not part of the package." },
            { text: "Travellers arriving by air into Bhuntar or already in Manali join the group on Day 1 morning." },
          ],
        },
        {
          day: 1,
          title: "Arrive Manali — acclimatisation day",
          entries: [
            { time: "8:00 AM", text: "Arrive in Manali, meet the trip captain and check in to the hotel." },
            { text: "Rest through the morning. The rest of the circuit climbs fast, so this day is deliberately light." },
            { text: "Afternoon walk through Old Manali, the Hadimba Devi temple and the Manu temple." },
            { text: "Evening trip briefing — route, altitude, documents and what to pack into your daypack." },
            { text: "Overnight in Manali (6,700 ft)." },
          ],
        },
        {
          day: 2,
          title: "Manali to Kaza via Atal Tunnel and Kunzum Pass",
          entries: [
            { time: "5:00 AM", text: "Early start — this is the longest driving day, roughly 200 km over 9–10 hours." },
            { text: "Cross the Atal Tunnel into the Lahaul valley and follow the Chandra river upstream past Sissu and Gramphu." },
            { text: "Breakfast stop at Batal, then the climb to Kunzum Pass (14,931 ft). Short halt at the Kunzum Devi temple." },
            { text: "Descend into Spiti through Losar and Hansa, reaching Kaza by evening." },
            { text: "Light dinner, early night, and no exertion — this is your first night above 12,000 ft." },
            { text: "Overnight in Kaza (12,500 ft)." },
          ],
        },
        {
          day: 3,
          title: "Kaza — Key, Kibber, Langza, Hikkim and Komic",
          entries: [
            { time: "8:30 AM", text: "Drive to Key Monastery and spend the morning in the gompa and its prayer halls." },
            { text: "Continue to Kibber village and the Kibber Wildlife Sanctuary viewpoint." },
            { text: "Lunch back in Kaza, then up to the plateau: Langza and its hillside Buddha, with fossil hunting in the fields." },
            { text: "Hikkim — post a card home from the world's highest post office at 14,567 ft. Carry cash; cards are not accepted." },
            { text: "Komic (15,027 ft) and the Tangyud monastery before returning to Kaza at sunset." },
            { text: "Overnight in Kaza." },
          ],
        },
        {
          day: 4,
          title: "Kaza to Pin Valley — Mudh village",
          entries: [
            { time: "9:00 AM", text: "Drive south-east along the Spiti river and turn into the Pin Valley at Attargo." },
            { text: "Stop at Kungri Monastery, the Nyingma gompa that serves the valley." },
            { text: "Continue to Mudh, the last village on the road, and check in to a homestay." },
            { text: "Afternoon free to walk the riverbed and the village fields, or simply sit out the light." },
            { text: "Overnight in Mudh, Pin Valley (12,300 ft)." },
          ],
        },
        {
          day: 5,
          title: "Pin Valley to Tabo via Dhankar",
          entries: [
            { time: "9:00 AM", text: "Drive back out of the Pin Valley to Dhankar." },
            { text: "Visit Dhankar Gompa and the old fort above the Spiti–Pin confluence." },
            { text: "Optional 1-hour walk up to Dhankar Lake — steep and at altitude, so entirely your call." },
            { text: "Continue to Tabo and visit the 996 CE monastery complex and its murals." },
            { text: "Evening free in Tabo. Overnight in Tabo (10,760 ft)." },
          ],
        },
        {
          day: 6,
          title: "Tabo to Chandratal",
          entries: [
            { time: "7:00 AM", text: "Long drive back west through Kaza and Losar, recrossing Kunzum Pass." },
            { text: "Turn off at Kunzum for the rough 14 km track down to the Chandratal camping ground." },
            { text: "Short walk to the lake for sunset. The water changes colour as the light goes." },
            { text: "Dinner at camp. Nights here are cold even in mid-summer — expect close to freezing." },
            { text: "Overnight in tents at Chandratal (14,100 ft)." },
          ],
        },
        {
          day: 7,
          title: "Chandratal to Manali",
          entries: [
            { time: "6:00 AM", text: "Optional sunrise walk back to the lake before breakfast." },
            { time: "8:00 AM", text: "Drive out via Batal and Gramphu, then through the Atal Tunnel to Manali." },
            { text: "Arrive in Manali by late afternoon. Hot shower, proper network and a last group dinner." },
            { text: "Overnight in Manali." },
          ],
        },
        {
          day: 8,
          title: "Departure from Manali",
          entries: [
            { text: "Breakfast and check out." },
            { text: "Drop at the Manali bus stand or Volvo boarding point. Trip concludes." },
            { text: "Keep a buffer day before any onward flight or booking — the Spiti road is weather-dependent." },
          ],
        },
      ],

      costIncludes: [
        "7 nights accommodation — hotels in Manali, guesthouse in Kaza, homestays in Mudh and Tabo, and tents at Chandratal",
        "All breakfasts and dinners from Day 1 dinner to Day 8 breakfast",
        "Private vehicle for the full Manali–Spiti–Manali circuit, allocated by group size",
        "Experienced local driver and a trip captain throughout",
        "Inner-line formalities and monastery entry where applicable",
        "Portable oxygen cylinder, pulse oximeter and a stocked first-aid kit with the group",
        "All tolls, parking, fuel and driver allowances",
      ],
      costExcludes: [
        "Delhi–Manali–Delhi Volvo or air fare",
        "All lunches and any meal taken during transit",
        "Personal expenses, tips, laundry and telephone charges",
        "Travel and health insurance",
        "Camera fees at monasteries where charged",
        "Any cost arising from a road closure, landslide or evacuation",
        "Anything not listed under inclusions",
        "5% GST",
      ],
      priceNote:
        "₹24,999 per person is the Manali-to-Manali fare. Travel to and from Manali is arranged separately — tell the trips desk if you would like the Delhi Volvo booked alongside.",

      eligibilityCriteria: [
        { icon: "User", text: "Age 12 to 60 — travellers under 18 need a parent or guardian on the trip" },
        { icon: "Mountain", text: "No trekking experience needed, but you must be comfortable spending seven days above 10,000 ft" },
        { icon: "Stethoscope", text: "Not suitable for anyone with a heart condition, uncontrolled high blood pressure, severe asthma or a recent surgery — altitude here is unforgiving" },
        { icon: "FileText", text: "Carry an original government photo ID; it is checked at the inner-line and sanctuary posts" },
        { icon: "Car", text: "Long days on rough, exposed mountain road — not advisable if you suffer badly from motion sickness" },
      ],
      fitnessCriteria: [
        { icon: "Footprints", text: "Able to walk 2–3 km on uneven ground at altitude, such as the Dhankar Lake path or the Chandratal shore" },
        { icon: "Activity", text: "Comfortable with 8–10 hour driving days on unsurfaced road" },
        { icon: "Heart", text: "Start 15–20 minutes of daily cardio about three weeks before departure — it noticeably eases the first two days" },
      ],
      howToReach: {
        intro:
          "The circuit starts and ends in Manali. Reach Manali by the evening of Day 0 or the morning of Day 1; everything beyond that point is covered by the trip vehicle.",
        air: {
          summaryLabel: "Nearest Airport",
          summary: "Bhuntar Airport (KUU), Kullu — 50 km from Manali",
          detail:
            "Limited daily flights from Delhi and Chandigarh, and frequently cancelled for weather. Most travellers fly into Chandigarh (240 km) or Delhi instead and continue by road.",
        },
        train: {
          summaryLabel: "Nearest Railway Station",
          summary: "Joginder Nagar (JDNX) — 160 km; Chandigarh (CDG) — 240 km",
          detail:
            "Joginder Nagar is a narrow-gauge terminus with very limited service. Chandigarh is the practical railhead, with overnight buses on to Manali.",
        },
        road: {
          summaryLabel: "Route",
          summary: "Manali → Kunzum Pass → Kaza → Pin Valley → Tabo → Chandratal → Manali",
          detail:
            "Roughly 800 km over eight days, almost all of it above 10,000 ft. The Manali side is reached through the Atal Tunnel; the Kunzum Pass section is unsurfaced and crosses several glacial stream beds.",
          route: ["Manali", "Kunzum Pass", "Kaza", "Mudh (Pin Valley)", "Dhankar", "Tabo", "Chandratal", "Manali"],
          facts: [
            { label: "Duration", value: "8 Days / 7 Nights" },
            { label: "Highest point", value: "Komic — 15,027 ft / 4,581 m" },
            { label: "Transport", value: "Private vehicle throughout" },
          ],
        },
        pickup: {
          point: "Manali Volvo bus stand / Mall Road",
          time: "Day 1, 8:00 AM",
          dropPoint: "Manali Volvo bus stand",
          dropTime: "Day 8, after breakfast",
          note:
            "Overnight Volvo seats from Delhi are not included but can be booked through the trips desk. Keep a spare day before any onward flight — the Spiti road is weather-dependent and delays do happen.",
        },
      },

      faqs: [
        {
          title: "How long is the Spiti Valley trip?",
          description: "8 Days / 7 Nights, Manali to Manali, covering Kunzum Pass, Kaza, the Langza–Hikkim–Komic loop, Pin Valley, Dhankar, Tabo and Chandratal.",
        },
        {
          title: "Is there any trekking on this trip?",
          description: "No. This is a road circuit. The only walking is short and optional — the climb to Dhankar Lake, the Chandratal shore, and strolls around each village.",
        },
        {
          title: "When is the best time to visit Spiti?",
          description: "May to October, once the Kunzum Pass road clears. June to September is the most reliable window. The pass is snowbound from roughly November to April, when Spiti is reachable only via Shimla.",
        },
        {
          title: "Will I get altitude sickness?",
          description: "Possibly. The circuit crosses 14,931 ft on Day 2 and stays above 12,000 ft for most of the week. The Day 1 rest in Manali and the two nights at Kaza before the high-village loop are there to reduce the risk. Drink 3–4 litres of water a day, avoid alcohol, and tell your trip captain at the first sign of a headache or breathlessness.",
        },
        {
          title: "What is the accommodation like?",
          description: "Hotels in Manali, a guesthouse in Kaza, family-run homestays in Mudh and Tabo, and tents at Chandratal. Village stays are clean but basic — expect shared bathrooms, intermittent hot water and no heating beyond blankets.",
        },
        {
          title: "Is there mobile network and internet?",
          description: "Only BSNL and, patchily, Jio work in Spiti, and only around Kaza and Tabo. There is no network at Chandratal, in Pin Valley or on most of the road. Tell people at home before you leave.",
        },
        {
          title: "Are ATMs available?",
          description: "Kaza has the only ATMs on the circuit and they run dry often. Carry enough cash from Manali for the whole week — homestays, the Hikkim post office and roadside dhabas are cash-only.",
        },
        {
          title: "Do I need an inner-line permit?",
          description: "Indian nationals do not need a permit for the Manali–Kaza–Tabo circuit. Foreign nationals require an inner-line permit for the stretch beyond Tabo towards Sumdo; send your passport details at least 15 days ahead so we can arrange it.",
        },
        {
          title: "How cold does it get?",
          description: "Daytime temperatures in summer sit around 15–20°C, but nights at Kaza drop to 2–5°C and Chandratal can touch freezing even in July. Pack as though for winter regardless of the month.",
        },
        {
          title: "What happens if the road is blocked?",
          description: "Landslides and snow can close Kunzum Pass or the Gramphu road at any time. The trip captain may reverse the route via Shimla, hold the group an extra day, or shorten a leg. Costs of such delays are not included in the package, and no refund is due for an itinerary changed on safety grounds.",
        },
        {
          title: "Is the trip suitable for children?",
          description: "Minimum age is 12, and under-18s must travel with a parent or guardian. Younger children are not advised — the altitude gain is steep and the nearest hospital is hours away.",
        },
      ],

      thingsToCarry: HIMALAYAN_TREK_PACKING_LIST.flatMap((g) => g.items),
      thingsToRemember: TRIP_GROUND_RULES,
      transportModes: TRANSPORT_BY_GROUP_SIZE,
      cancellationPolicy: TIERED_CANCELLATION_POLICY,
      confirmationPolicy: CONFIRMATION_POLICY,
      bookingAdvance: TRIP_BOOKING_TERMS.advancePerPerson,
      balanceDueDays: TRIP_BOOKING_TERMS.balanceDueDays,

      gallery: [
        {
          url: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/Kee_monastery_Spiti_Valley_%28edited%29.jpg/1920px-Kee_monastery_Spiti_Valley_%28edited%29.jpg",
          caption: "Key Monastery stacked up its hill above the Spiti river",
        },
        {
          url: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Chandra_Taal_Lake.jpg/1920px-Chandra_Taal_Lake.jpg",
          caption: "Chandratal, the crescent moon lake at 14,100 ft",
        },
        {
          url: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Langza_village_and_Buddha_statue.jpg/1920px-Langza_village_and_Buddha_statue.jpg",
          caption: "The hillside Buddha above Langza village",
        },
        {
          url: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Dhankar_Gompa%2C_Spiti.jpg/1920px-Dhankar_Gompa%2C_Spiti.jpg",
          caption: "Dhankar Gompa on its spur above the Pin–Spiti confluence",
        },
        {
          url: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Tabo_Monastery.jpg/1920px-Tabo_Monastery.jpg",
          caption: "Tabo Monastery, in continuous use since 996 CE",
        },
        {
          url: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Mudh_Village_Pin_Spiti_Himachal_Jun18_D72_7094.jpg/1920px-Mudh_Village_Pin_Spiti_Himachal_Jun18_D72_7094.jpg",
          caption: "Mudh, the last village on the Pin Valley road",
        },
        {
          url: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Kunzum_Pass.jpg/1920px-Kunzum_Pass.jpg",
          caption: "Kunzum Pass at 14,931 ft, the gateway into Spiti",
        },
        {
          url: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Komic_village.jpg/1920px-Komic_village.jpg",
          caption: "Komic, among the highest motorable villages on earth",
        },
        {
          url: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Kibber-14-gje.jpg/1920px-Kibber-14-gje.jpg",
          caption: "Kibber village on the plateau above Kaza",
        },
        {
          url: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c0/NH505_Spiti_Kaza_Losar_Jun18_D72_7797.jpg/1920px-NH505_Spiti_Kaza_Losar_Jun18_D72_7797.jpg",
          caption: "The road between Losar and Kaza",
        },
      ],
      relatedSlugs: ["leh-ladakh", "shimla-manali", "kashmir"],
    }
  ),
  toListingItem(
    {
      name: "Kerala",
      slug: "kerala",
      duration: "5N/4D",
      heroImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Kerala_Backwaters_-_Canal_near_Chamabakulam.jpg/1920px-Kerala_Backwaters_-_Canal_near_Chamabakulam.jpg",
      tagline: "Backwaters, spice trails, and God's Own Country at an easy pace.",
    },
    {
      region: "Kerala",
      startLocation: "Kochi",
      difficulty: "Easy",
      price: 15999,
      months: ["Sep", "Oct", "Nov", "Mar"],
      themes: ["Lakes", "Couples", "Family with Kids"],
      category: "Backpacking Trip",
      detailsPath: "/trips/backpacking/kerala",
    }
  ),
  toListingItem(
    {
      name: "Kerala Special",
      slug: "kerala-special",
      duration: "4N/5D",
      heroImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Kerala_Backwaters_near_Nedumudy_-_4.jpg/1920px-Kerala_Backwaters_near_Nedumudy_-_4.jpg",
      tagline: "Munnar tea country, an Alleppey houseboat night, and the Kovalam–Varkala coast.",
    },
    {
      region: "Kerala",
      startLocation: "Kochi",
      endLocation: "Trivandrum",
      difficulty: "Easy",
      price: 10500,
      months: ["Sep", "Oct", "Nov", "Mar"],
      themes: ["Lakes", "Couples", "Family with Kids"],
      category: "Backpacking Trip",
      detailsPath: "/trips/backpacking/kerala-special",

      contactPhone: "+91-9121343330",
      minAge: 5,
      intro:
        "A 5-day, 4-night circuit from Kochi through Munnar's tea hills, an overnight houseboat cruise on the Alleppey backwaters, and coastal stops at Kovalam and Varkala before departure from Trivandrum. Includes waterfalls, tea gardens, an elephant park, and temple visits.",
      highlights: [
        "Valara & Cheeyappara Waterfalls",
        "Eravikulam National Park",
        "Mattupetty Dam & Lake",
        "Echo Point",
        "Rajamalai Garden",
        "Tata Tea Gardens",
        "Carmelagiri Elephant Park",
        "Chocolate Factory",
        "Houseboat stay",
        "Jatayu Earth Center",
        "Varkala Beach",
        "Azhimala Shiva Temple",
        "Padmanabhaswamy Temple",
        "Kathakali / Kalaripattu show",
      ],
      priceNote:
        "Prices are per person, Kochi to Kochi. Train tickets to and from your origin city are NOT included — 3AC fare is added separately based on availability.",

      /**
       * Per-person rates by group size, Kochi to Kochi. Train fare excluded.
       *
       * NOTE: the 7-pax rate (₹16,500) is higher than both 6-pax (₹10,500) and
       * 8-pax (₹11,000), breaking the downward trend of every other tier.
       * Published as supplied from the source PDF and awaiting confirmation —
       * do not "correct" it without checking with the operator.
       */
      packages: [
        { id: "pax-2", label: "2 pax — Sedan, 2 sharing", price: 15000, paxLabel: "2 pax", vehicle: "Sedan", sharing: "2 sharing" },
        { id: "pax-3", label: "3 pax — Sedan, 3 sharing", price: 13500, paxLabel: "3 pax", vehicle: "Sedan", sharing: "3 sharing" },
        { id: "pax-4", label: "4 pax — Sedan, 2 sharing", price: 12500, paxLabel: "4 pax", vehicle: "Sedan", sharing: "2 sharing" },
        { id: "pax-5", label: "5 pax — Ertiga, 2/3 sharing", price: 12500, paxLabel: "5 pax", vehicle: "Ertiga", sharing: "2/3 sharing" },
        { id: "pax-6", label: "6 pax — Innova, 3 sharing", price: 10500, paxLabel: "6 pax", vehicle: "Innova", sharing: "3 sharing" },
        { id: "pax-7", label: "7 pax — Tempo, 2/3 sharing", price: 16500, paxLabel: "7 pax", vehicle: "Tempo", sharing: "2/3 sharing" },
        { id: "pax-8", label: "8 pax — Tempo, 2/3 sharing", price: 11000, paxLabel: "8 pax", vehicle: "Tempo", sharing: "2/3 sharing" },
        { id: "pax-9", label: "9+ pax — Tempo, 2/3 sharing", price: 10500, paxLabel: "9+ pax", vehicle: "Tempo", sharing: "2/3 sharing" },
      ],
      kidsPolicy:
        "Under 5 years travel free. Ages 5–10 pay 50% of the adult rate. Over 10 pays the full adult rate.",

      itinerary: [
        {
          day: 0,
          title: "Departure day",
          entries: [
            { text: "Board an overnight sleeper-class train from your origin city." },
            { text: "Arrive at the station 45–60 minutes before departure." },
            { text: "Train tickets are not included in the package — 3AC fare is added separately based on availability." },
          ],
        },
        {
          day: 1,
          title: "Cochin to Munnar",
          entries: [
            { text: "Arrive in Cochin and start the drive up to Munnar." },
            { text: "Stop at Valara and Cheeyappara Waterfalls on the way." },
            { text: "Visit a spice plantation." },
            { text: "Evening Kathakali and Kalaripattu performance." },
            { text: "Overnight in Munnar." },
          ],
        },
        {
          day: 2,
          title: "Munnar",
          entries: [
            { text: "Eravikulam National Park." },
            { text: "Mattupetty Dam and Lake, then Echo Point." },
            { text: "Rajamalai Garden and the Tata Tea Gardens." },
            { text: "Carmelagiri Elephant Park and the chocolate factory." },
            { text: "Overnight in Munnar." },
          ],
        },
        {
          day: 3,
          title: "Munnar to Alleppey",
          entries: [
            { text: "Drive to Alleppey through villages and paddy fields." },
            { text: "Board a traditional houseboat by midday." },
            { text: "Cruise the backwaters." },
            { text: "Kerala-style lunch served on board." },
            { text: "Rest of the day at leisure. Overnight on the houseboat." },
          ],
        },
        {
          day: 4,
          title: "Alleppey to Kovalam",
          entries: [
            { text: "Disembark after breakfast and drive to Kovalam." },
            { text: "En route: Jatayu Earth Center." },
            { text: "Varkala Beach." },
            { text: "Continue to the Varkala hotel. Overnight in Kovalam / Varkala." },
          ],
        },
        {
          day: 5,
          title: "Trivandrum and departure",
          entries: [
            { text: "Check out and proceed towards Trivandrum." },
            { text: "Azhimala Shiva Temple." },
            { text: "Padmanabhaswamy Temple." },
            { text: "Drop at Trivandrum airport or railway station. Trip concludes." },
          ],
        },
      ],

      costIncludes: [
        "Private vehicle for all 5 days",
        "4 nights accommodation — 1 night houseboat, 3 nights hotel",
        "4 breakfasts, 1 lunch and 1 dinner",
        "Trip captain for group departures",
        "Tolls, parking, guide charges and state permits",
        "Basic first aid",
      ],
      costExcludes: [
        "Meals not listed above",
        "Air and train fare",
        "Transport beyond the stated itinerary",
        "Boating and elephant ride charges",
        "Personal expenses",
        "Costs arising from natural calamities or events beyond our control",
        "5% GST",
      ],

      thingsToCarry: TROPICAL_PACKING_LIST.flatMap((g) => g.items),
      thingsToRemember: TRIP_GROUND_RULES,
      cancellationPolicy: TRIP_CANCELLATION_POLICY,
      bookingAdvance: TRIP_BOOKING_TERMS.advancePerPerson,
      balanceDueDays: TRIP_BOOKING_TERMS.balanceDueDays,
      relatedSlugs: ["kerala-thekkady", "kerala"],
    }
  ),
  toListingItem(
    {
      name: "Kerala – God's Own Country Tour",
      slug: "kerala-thekkady",
      duration: "4N/5D",
      // NB: photo-1602216050166 (used by the older "kerala" entry) now 404s on Unsplash.
      heroImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/Periyar_National_Park-WUS07817-Verbessert-RR.jpg/1920px-Periyar_National_Park-WUS07817-Verbessert-RR.jpg",
      tagline: "Munnar's tea hills, Thekkady's wildlife and a night on a Deluxe Houseboat in the Alleppey backwaters — Kochi to Kochi in 5 days.",
    },
    {
      region: "Kerala",
      startLocation: "Kochi",
      endLocation: "Kochi",
      difficulty: "Easy",
      price: 9300,
      months: ["Sep", "Oct", "Nov", "Mar"],
      themes: ["Lakes", "Waterfall", "Couples", "Family with Kids"],
      category: "Backpacking Trip",
      detailsPath: "/trips/backpacking/kerala-thekkady",

      // Other names this same circuit has been catalogued/sold under, so
      // search still finds it under the prior listing name.
      alternateNames: ["Backpacking Trip Kerala", "Kerala Thekkady Backpacking Trip"],

      contactPhone: "+91 9121343330",
      contactNumbers: ["+91 7337475300"],
      minAge: 2,
      intro:
        "A 5-day Kerala journey covering the scenic hill station of Munnar, the wildlife destination Thekkady and the tranquil backwaters of Alleppey, with a premium houseboat experience. This itinerary combines relaxation and exploration through waterfalls, misty tea gardens, wildlife experiences, spice plantations, chocolate-making and a premium houseboat cruise through the Alleppey backwaters, before returning to Kochi.",
      highlights: [
        "Valara & Cheeyappara Waterfalls",
        "Spice Plantation",
        "Munnar Tea Gardens",
        "Eravikulam National Park",
        "Mattupetty Dam & Echo Point",
        "Rajamalai Garden",
        "Chocolate Factory",
        "Periyar National Park (Thekkady)",
        "Deluxe Houseboat Cruise",
        "Alleppey Backwaters",
      ],
      usps: [
        {
          title: "A night on a Deluxe Houseboat",
          description: "One full night anchored in the Alleppey backwaters aboard a Sharing Deluxe Houseboat, with a traditional Kerala lunch, dinner, evening snacks and tea/coffee all served on board.",
        },
        {
          title: "Munnar and Thekkady in one trip",
          description: "Tea-garden hill views and Periyar wildlife country are covered back to back on the same Kochi-to-Kochi circuit, without adding extra days.",
        },
        {
          title: "Priced by group size",
          description: "Per-person pricing drops as the group grows — from ₹12,500 for 2 travellers down to ₹9,300 for a group of 10.",
        },
        {
          title: "Honeymoon-ready",
          description: "A Honeymoon Inclusions upgrade is available for an additional ₹500 per couple.",
        },
      ],
      idealFor: "Families, groups, couples and honeymooners.",
      differentiators: [
        "Route: Kochi → Munnar → Thekkady → Alleppey → Kochi",
        "Duration: 5 Days / 4 Nights",
        "Stay: Premium 3-star hotels in Munnar and Thekkady, Sharing Deluxe Houseboat in Alleppey",
        "Tour type: Nature, sightseeing, wildlife and backwaters",
      ],
      importantNote:
        "Prices are per person, Kochi to Kochi, and vary by group size — see the pricing tiers below. A Honeymoon Inclusions upgrade is available for an additional ₹500 per couple, and 5% GST is charged extra. Weather conditions may lead to changes in the itinerary, route or sightseeing order. For queries, contact the trips desk on +91 9121343330 / +91 7337475300 or southbookings@tripmysoul.in.",
      destinationHighlights: [
        {
          name: "Munnar",
          blurb: "Rolling tea plantations, misty hills and the Eravikulam National Park, home to the endangered Nilgiri Tahr — plus a hands-on chocolate factory visit and Mattupetty Dam & Echo Point.",
        },
        {
          name: "Thekkady",
          blurb: "Kerala's wildlife heartland around Periyar National Park, with an optional spice plantation tour and an evening Kathakali or Kalaripayattu show.",
        },
        {
          name: "Alleppey",
          blurb: "A night aboard a Sharing Deluxe Houseboat, cruising palm-fringed canals, paddy fields and lakeside villages through Kerala's famous backwaters.",
        },
      ],
      priceNote:
        "Per-person price, Kochi to Kochi, based on group size (see the tiers below). Add ₹500 per couple for Honeymoon Inclusions. 5% GST is charged extra.",

      itinerary: [
        {
          day: 1,
          title: "Kochi to Munnar",
          entries: [
            { text: "Kochi Airport / Railway Station pickup." },
            { text: "Scenic drive towards the misty green hills of Munnar." },
            { text: "Enroute: Valara Waterfalls and Cheeyappara Waterfalls." },
            { text: "Visit an authentic Kerala spice plantation." },
            { text: "Check in to your premium Munnar accommodation and relax for the evening." },
          ],
        },
        {
          day: 2,
          title: "Munnar Sightseeing",
          entries: [
            { text: "Full-day Munnar sightseeing after breakfast." },
            { text: "Eravikulam National Park, home of the Nilgiri Tahr." },
            { text: "Mattupetty Dam & Lake, with an optional boat ride." },
            { text: "Echo Point and the Rajamalai Garden." },
            { text: "Tata Tea Gardens — the journey of tea from leaf to cup." },
            { text: "Local chocolate factory visit." },
            { text: "Overnight in Munnar." },
          ],
        },
        {
          day: 3,
          title: "Munnar to Thekkady",
          entries: [
            { text: "Check out from Munnar after breakfast and drive to Thekkady." },
            { text: "Check in to your Thekkady hotel." },
            { text: "Optional guided spice plantation tour — tea, cardamom, vanilla, coffee, pepper, cinnamon and ginger." },
            { text: "Periyar National Park — wildlife spotting, with an optional elephant ride." },
            { text: "Optional evening Kathakali or Kalaripayattu cultural show." },
            { text: "Overnight in Thekkady." },
          ],
        },
        {
          day: 4,
          title: "Thekkady to Alleppey",
          entries: [
            { text: "Check out after breakfast and drive to Alleppey." },
            { text: "Check in to your Sharing Deluxe Houseboat by noon." },
            { text: "Backwater cruise through palm-fringed canals, paddy fields and lakeside villages." },
            { text: "Traditional Kerala-style lunch served on board." },
            { text: "Relax on deck as the houseboat cruises the backwaters." },
            { text: "Overnight anchored in the Alleppey backwaters — dinner, evening snacks and tea/coffee included." },
          ],
        },
        {
          day: 5,
          title: "Alleppey to Kochi",
          entries: [
            { text: "Wake up to a peaceful morning on the water." },
            { text: "Breakfast on the houseboat deck." },
            { text: "Check out from the houseboat and drive back to Kochi." },
            { text: "Drop at Kochi Airport / designated departure point." },
          ],
        },
      ],

      costIncludes: [
        "Airport / Railway Station pickup and drop",
        "All ground transfers across the Kochi–Munnar–Thekkady–Alleppey circuit",
        "2 nights accommodation in Munnar (Premium 3-Star)",
        "1 night accommodation in Thekkady (Premium 3-Star)",
        "1 night in a Sharing Deluxe Houseboat in Alleppey",
        "Breakfast from Day 2 to Day 5",
        "Houseboat meals — lunch, dinner and evening snacks",
        "Tea/coffee on the houseboat",
        "Professional driver throughout",
        "Vehicle costs — fuel, toll and parking",
        "Road entry taxes",
        "All sightseeing listed in the itinerary",
      ],
      costExcludes: [
        "Daily lunch and dinner — included only on the houseboat",
        "Entry and activity tickets at sightseeing locations",
        "Airfare",
        "Main train fare",
        "Travel insurance",
        "Personal expenses",
        "Laundry and tips",
        "Optional tours, such as the afternoon spice plantation tour",
        "5% GST",
      ],

      eligibilityCriteria: [
        { icon: "User", text: "Minimum age: 2+ years — no maximum age restriction" },
        { icon: "Activity", text: "Participants should be reasonably fit for sightseeing, short walks and a houseboat cruise" },
        { icon: "Footprints", text: "No trekking experience required — this is a sightseeing, wildlife and backwaters tour" },
        { icon: "Stethoscope", text: "Inform the team of any medical condition in advance and carry personal medication" },
      ],
      fitnessCriteria: [
        { icon: "Footprints", text: "Comfortable with a full day of sightseeing and short walks at each stop" },
        { icon: "Activity", text: "No special fitness or trekking experience required" },
        { icon: "Backpack", text: "Comfortable carrying a small daypack for day trips" },
      ],
      howToReach: {
        intro: "The tour starts and ends in Kochi, with pickup and drop at Kochi Airport or the city's railway stations.",
        air: {
          summaryLabel: "Nearest Airport",
          summary: "Cochin International Airport (COK)",
          detail: "Well connected to major Indian cities and several international hubs. Pickup and drop for the tour are arranged directly from the airport.",
        },
        train: {
          summaryLabel: "Nearest Railway Station",
          summary: "Ernakulam Junction / Ernakulam Town",
          detail: "Kochi's railway stations have good connectivity with major Indian cities. Pickup and drop can be arranged from either station.",
        },
        road: {
          summaryLabel: "Route",
          summary: "Kochi to Munnar to Thekkady to Alleppey and back to Kochi",
          detail: "The entire circuit is run by private vehicle, so no further travel arrangements are needed once the tour begins.",
          route: ["Kochi", "Munnar", "Thekkady", "Alleppey", "Kochi"],
          facts: [
            { label: "Duration", value: "5 Days / 4 Nights" },
            { label: "Transport", value: "Private vehicle throughout" },
          ],
        },
        pickup: {
          point: "Kochi Airport / Railway Station",
          time: "Day 1, on arrival",
          dropPoint: "Kochi Airport / designated departure point",
          dropTime: "Day 5, after breakfast",
          note: "A Hyderabad-to-Hyderabad package by sleeper-class train is also available separately — contact the trips desk for pricing and booking, ideally at least 45 days before travel to help secure a sleeping berth.",
        },
      },

      faqs: [
        {
          title: "What is the duration of the Kerala tour?",
          description: "The tour is for 5 Days / 4 Nights, covering Kochi, Munnar, Thekkady and Alleppey.",
        },
        {
          title: "What is the tour route?",
          description: "Kochi → Munnar → Thekkady → Alleppey → Kochi.",
        },
        {
          title: "What is the starting price of the tour?",
          description: "The Kochi-to-Kochi package starts from ₹9,300/- per person for a group of 10 members. Prices vary according to group size.",
        },
        {
          title: "Is airport pickup and drop included?",
          description: "Yes. Airport/railway station pickup and drop are included in the package.",
        },
        {
          title: "Which places are covered in the tour?",
          description: "The tour covers Kochi, Munnar, Thekkady and Alleppey.",
        },
        {
          title: "What are the main attractions in Munnar?",
          description: "The itinerary includes Eravikulam National Park, Mattupetty Dam & Lake, Echo Point, Rajamalai Garden, Tata Tea Gardens and a chocolate factory.",
        },
        {
          title: "Is the houseboat stay included?",
          description: "Yes. The package includes 1 night in a Sharing Deluxe Houseboat in Alleppey.",
        },
        {
          title: "What meals are included on the houseboat?",
          description: "Houseboat meals include breakfast, lunch, evening snacks, tea/coffee and dinner.",
        },
        {
          title: "Are meals included throughout the tour?",
          description: "Breakfast is included from Day 2 to Day 5. Lunch and dinner are included on the houseboat, while daily lunch and dinner on other days are excluded.",
        },
        {
          title: "What type of accommodation is provided?",
          description: "Munnar and Thekkady have Premium 3-Star accommodation, while Alleppey includes a Deluxe Houseboat.",
        },
        {
          title: "Is this tour suitable for families?",
          description: "Yes. The itinerary is built around sightseeing, nature, wildlife and a houseboat experience, and can be offered as a family or group tour.",
        },
        {
          title: "Is this tour suitable for couples and honeymooners?",
          description: "Yes. A special Honeymoon Inclusions upgrade is available for an additional ₹500.",
        },
        {
          title: "Is the tour suitable for senior citizens?",
          description: "There is no separate senior-citizen category. There is no maximum age restriction, but participants should be reasonably fit.",
        },
        {
          title: "What is the minimum age for the tour?",
          description: "The minimum age requirement is 18 years.",
        },
        {
          title: "Are sightseeing entry tickets included?",
          description: "No. Entry/monument tickets and activity fees at sightseeing locations are excluded.",
        },
        {
          title: "Are optional activities included?",
          description: "No. Optional activities, such as the afternoon spice plantation tour, are charged separately.",
        },
        {
          title: "Is travel insurance included?",
          description: "No. Personal travel insurance is excluded from the package.",
        },
        {
          title: "How much advance is required to confirm the booking?",
          description: "A minimum 25% advance payment is required for booking confirmation.",
        },
        {
          title: "What is the cancellation policy?",
          description: "Bookings are strictly non-refundable and non-transferable. A refund is issued only if Trip My Soul cancels the event.",
        },
        {
          title: "Can I reschedule my trip?",
          description: "Yes, one complimentary rescheduling is allowed when requested more than 30 days before departure. Rescheduling is not possible less than 15 days before departure.",
        },
        {
          title: "Can the itinerary change due to weather?",
          description: "Yes. In case of sudden extreme weather, Trip My Soul may adjust the itinerary, change routes or safely retreat where necessary.",
        },
        {
          title: "Is there a Hyderabad-to-Hyderabad option?",
          description: "Yes. A separate Hyderabad-to-Hyderabad package by sleeper-class train is available at different group-based prices.",
        },
        {
          title: "How early should I book the Hyderabad train package?",
          description: "It is recommended to book at least 45 days before travel to help secure a sleeping berth. Closer bookings may be in RAC status.",
        },
        {
          title: "Is GST included in the package price?",
          description: "No. 5% GST is applicable separately.",
        },
      ],

      // Per-person rates by group size, Kochi to Kochi.
      packages: [
        { id: "pax-10", label: "Full Payment", paxLabel: "10 Members", price: 9300 },
        { id: "pax-8", label: "Full Payment", paxLabel: "8 Members", price: 9750 },
        { id: "pax-6", label: "Full Payment", paxLabel: "6 Members", price: 9750 },
        { id: "pax-4", label: "Full Payment", paxLabel: "4 Members", price: 10200 },
        { id: "pax-2", label: "Full Payment", paxLabel: "2 Members", price: 12500 },
      ],
      bookingAdvancePct: 25,
      confirmationPolicy:
        "Your seat is confirmed once the 25% advance is received. 50% of the total is due 30-45 days before departure, and the remaining balance is due 15-30 days before departure.",

      thingsToCarry: TROPICAL_PACKING_LIST.flatMap((g) => g.items),
      thingsToRemember: TRIP_GROUND_RULES,
      // Source policy differs from the generic short-trip terms: non-refundable
      // and non-transferable, with a one-time complimentary reschedule instead
      // of a sliding refund scale.
      cancellationPolicy:
        "Cancellations are non-refundable and non-transferable — a refund is issued only if Trip My Soul cancels the trip. One complimentary rescheduling is allowed if requested more than 30 days before departure; rescheduling is not possible within 15 days of departure.",
      relatedSlugs: ["kerala-special", "kerala"],
    }
  ),

  /* ---------------------------------------------------------------- */
  /* Uttarakhand yatras & treks — 4 days and over                      */
  /* ---------------------------------------------------------------- */

  toListingItem(
    {
      name: "Auli Yatra",
      slug: "auli-yatra",
      duration: "2N/3D",
      heroImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Auli_in_October_2015_-_40.jpg/1920px-Auli_in_October_2015_-_40.jpg",
      tagline: "Asia's 2nd longest cable car, ski slopes and Gorson Bugyal — Uttarakhand's Ski Capital in 3 days from Rishikesh.",
    },
    {
      region: "Uttarakhand",
      startLocation: "Rishikesh",
      endLocation: "Rishikesh",
      difficulty: "Very Easy",
      price: null,
      months: ["Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Sep", "Oct", "Nov"],
      themes: ["Snow", "Family with Kids", "Couples", "Honeymoon", "Adventure"],
      category: "Backpacking Trip",
      detailsPath: "/trips/backpacking/auli-yatra",
      alternateNames: ["Auli Tour", "Auli Skiing", "Auli Ski Trip", "Gorson Bugyal Trek", "Joshimath Auli"],
      altitude: "9,200 ft (Auli) / 10,010 ft (Gorson Bugyal Top)",
      minAge: 2,
      intro:
        "Auli is the most popular winter destination and Ski Capital of Uttarakhand, a perfect combination of snow adventure and Himalayan peace. Located in the Chamoli district of the Garhwal Himalayas, Auli is a high-altitude meadow at an average altitude of 9,200 to 10,010 ft, amidst oak forests, bugyal meadows and majestic snow-clad peaks.",
      highlights: [
        "Asia's 2nd longest cable car — 4.15 km, Joshimath to Auli",
        "Ski slopes — 5 km long, Asia's longest",
        "Gorson Bugyal trek — 360° Himalayan view at 10,010 ft",
        "Auli Artificial Lake — world's highest man-made lake",
        "Nanda Devi National Park view",
        "5 Prayag Sangams enroute — Devprayag and Rudraprayag",
      ],
      usps: [
        {
          title: "Asia's 2nd longest cable car",
          description: "A 4.15 km, 25-minute cable car ride from Joshimath to Auli over oak forests — no trek needed to reach the snow line.",
        },
        {
          title: "Ski slopes and Artificial Lake",
          description: "Asia's longest 5 km ski slope with skiing and trainer available in winter, alongside the Auli Artificial Lake, the world's highest man-made lake.",
        },
        {
          title: "Gorson Bugyal at 10,010 ft",
          description: "A short 3 km trek to a meadow with a 360° view of Nanda Devi (7,816m), Kamet, Mana Parbat and Trishul — no shop, no crowd, only Himalayas.",
        },
      ],
      idealFor: "Family, couples, honeymoon, friends group, ski lovers, snow lovers and corporate trips.",
      differentiators: [
        "Route: Haridwar / Rishikesh → Joshimath → Auli",
        "Total distance: ~300 km one side + 6 km trek (Auli to Gorson Bugyal and back)",
        "Difficulty: Very Easy — suitable for all, by car and a 4.15 km cable car ride",
        "Best season: Dec–Mar for snow and skiing, Apr–Jun for green bugyal and clear Himalayan views, Sep–Nov for clear sky",
        "Winter (Dec–Mar): peak season, full snow cover, temperature -2°C to -8°C, skiing open",
        "Major peaks visible: Nanda Devi (7,816m), Mana Parbat, Kamet, Trishul, Neelkanth, Dronagiri, Hathi Parbat, Chaukhamba",
      ],
      importantNote:
        "July–August is monsoon season and best avoided — heavy rain and landslide risk on the Joshimath route, and no skiing. Cable car tickets (₹1,000 per person per side) and skiing (₹1,500–2,000 per person with trainer, available only Dec–March) are not included in the package and are payable directly.",
      destinationHighlights: [
        {
          name: "The Cable Car",
          blurb: "Asia's 2nd longest — 4.15 km, 25 minutes in the air over oak forests, from Joshimath to Auli. You leave the world behind and land in the Himalayas.",
        },
        {
          name: "Ski Slope & Artificial Lake",
          blurb: "A 5 km long ski slope, Asia's longest — 7 ft snow, skiing and snow fights in winter. The Auli Artificial Lake is the world's highest man-made lake, reflecting Nanda Devi.",
        },
        {
          name: "Gorson Bugyal",
          blurb: "A 3 km walk to 10,010 ft — a meadow with a 360° view of the Himalayas. No shop, no hotel, only wind, and 7 Himalayan giants including Nanda Devi (7,816m), Kamet and Trishul.",
        },
      ],
      itinerary: [
        {
          day: 1,
          title: "Rishikesh to Joshimath",
          entries: [
            { time: "6:00 AM", text: "Pickup from Rishikesh." },
            { text: "Drive via Devprayag and Rudraprayag — visit 2 Prayag Sangams on the way." },
            { text: "Scenic drive along the Alaknanda River, pine forests and mountains." },
            { text: "Evening arrival at Joshimath (6,150 ft) — base town of Auli and Badrinath." },
            { text: "Visit Narsingh Temple, the winter home of Badrinath." },
            { text: "Dinner and overnight stay at Joshimath." },
          ],
        },
        {
          day: 2,
          title: "Joshimath to Auli — Explore Auli",
          entries: [
            { text: "After breakfast, ride Asia's 2nd longest cable car (4.15 km) from Joshimath to Auli — ₹1,000 extra, per person, per side." },
            { text: "Reach Auli (9,200 ft) and check in." },
            { text: "Visit Auli Artificial Lake, the highest man-made lake, and the 5 km long ski slopes." },
            { text: "In winter (Dec–Mar): skiing with a trainer — ₹1,500 per person." },
            { text: "Afternoon trek to Gorson Bugyal (3 km) — a meadow with a 360° view of Nanda Devi, Kamet and Trishul peaks." },
            { text: "Sunset view, dinner and overnight stay at Auli / Joshimath." },
          ],
        },
        {
          day: 3,
          title: "Auli / Joshimath to Rishikesh",
          entries: [
            { text: "Early morning sunrise view over Nanda Devi peak — the golden Himalayas." },
            { text: "After breakfast, cable car down to Joshimath and drive back towards Rishikesh." },
            { text: "Lunch on the way." },
            { time: "7:30 PM", text: "Drop at Rishikesh. Tour ends." },
          ],
        },
      ],
      costIncludes: [
        "Transport — Rishikesh to Rishikesh by Swift Dzire / Innova / Tempo Traveller as per group size, including toll, parking and driver allowance",
        "2 nights hotel / resort stay — 1N Joshimath, 1N Auli",
        "2 breakfasts and 2 dinners, MAP plan, vegetarian",
        "Sightseeing as per itinerary — Devprayag, Rudraprayag, Joshimath, Auli and the Gorson Bugyal trek",
        "Driver cum guide assistance, 24x7 support",
      ],
      costExcludes: [
        "Cable car ticket — ₹1,000 per person per side (Joshimath to Auli), payable directly",
        "Chair lift — ₹500 per person (Auli, Gorson side)",
        "Skiing kit — ₹1,500–2,000 per person with trainer, winter only (Dec–March)",
        "Lunch on any day",
        "5% GST extra on total billing",
        "Personal expenses, heater charges (₹500 in winter), medicines and anything not mentioned under Inclusions",
      ],
      eligibilityCriteria: [
        { icon: "User", text: "Minimum age: 2 years. No maximum age — even 75+ can go, as the cable car removes the need to walk much" },
        { icon: "Footprints", text: "Very easy grade — only an optional 3 km trek to Gorson Bugyal, which can be skipped" },
        { icon: "Mountain", text: "Only 9,200 ft altitude, much lower than Kedarnath at 11,700 ft — no altitude sickness risk" },
        { icon: "Stethoscope", text: "Pregnant women should avoid Dec–March (snow, slippery); can go April–June till 6 months with doctor's advice. Heart/asthma patients should travel in summer (Apr–June) and avoid extreme winter" },
      ],
      fitnessCriteria: [
        { icon: "Footprints", text: "If you can walk 500 metres, you can do Auli — the easiest Himalayan destination" },
        { icon: "Activity", text: "No long trek required — only an optional 3 km walk to Gorson Bugyal" },
        { icon: "TrendingUp", text: "Best for kids and senior citizens in April–June (pleasant) and late December (light snow); best for skiing in Jan–Mar; best for couples Dec–March" },
      ],
      howToReach: {
        intro: "The Yatra starts and ends at Rishikesh / Haridwar, with pickup at 6 AM on Day 1. All travel is included in this 2N/3D package — you only need to reach Rishikesh or Haridwar.",
        air: {
          summaryLabel: "Nearest Airport",
          summary: "Jolly Grant Airport, Dehradun (DED)",
          detail: "Well connected to Delhi and Mumbai. From the airport, take a taxi or bus to Rishikesh/Haridwar, about 45 minutes to 1.5 hours.",
        },
        train: {
          summaryLabel: "Nearest Railway Station",
          summary: "Haridwar Junction (HW) / Rishikesh Station",
          detail: "Haridwar is well connected to Delhi, Mumbai, Kolkata and Lucknow, with overnight trains from Delhi taking 6-7 hours. Rishikesh station is 25 km from Haridwar.",
        },
        road: {
          summaryLabel: "Route",
          summary: "Rishikesh / Haridwar to Joshimath via NH58",
          detail: "About 275 km and 10 hours by road from Rishikesh, via Devprayag, Rudraprayag and Joshimath, along the Alaknanda River.",
          route: ["Rishikesh / Haridwar", "Devprayag", "Rudraprayag", "Joshimath", "Auli (13 km + cable car)"],
          facts: [
            { label: "Total Distance", value: "~300 km one side + 6 km Gorson trek" },
            { label: "Duration", value: "2 Nights / 3 Days" },
          ],
        },
        pickup: {
          point: "Rishikesh",
          time: "6:00 AM, Day 1",
          dropPoint: "Rishikesh",
          dropTime: "7:30 PM, Day 3",
          note: "Joshimath to Auli is 13 km, covered by Asia's 2nd longest cable car (4.15 km, ₹1,000 per person per side) or, if the cable car is closed due to snow/wind, by a 1-hour drive on the same road.",
        },
      },
      faqs: [
        {
          title: "Is Auli safe for family with kids and senior citizens?",
          description: "Yes, 100% safe. Auli is the easiest snow destination — no trek needed, reachable by cable car. Even 75+ age travellers go every year.",
        },
        {
          title: "Will we get snow in Auli? When is snowfall?",
          description: "Guaranteed snow in Jan, Feb and first week of March. December sees snow depending on weather, and April has snow on the side walls. For 100% snow, come in Jan-Feb.",
        },
        {
          title: "What is the cable car cost and timing?",
          description: "₹1,000 per person one side. Timing is 9 AM to 4:30 PM. It closes in heavy snow/wind for safety, in which case we go by road (13 km).",
        },
        {
          title: "How cold is Auli? What should I carry?",
          description: "Winter (Dec-Mar): -2°C to -8°C at night, 2°C to 8°C in the day — carry a heavy jacket, thermals, woollen cap, gloves, sunglasses, sunscreen and good shoes. Summer (Apr-June): 5°C to 18°C, pleasant — a light jacket is enough.",
        },
        {
          title: "Is there network and electricity in Auli?",
          description: "Joshimath has full Jio and Airtel 4G with electricity. Auli has patchy BSNL/Jio coverage and electricity that can go off in winter due to snow — resorts have backup, and there is no WiFi.",
        },
        {
          title: "Can we do Auli in 2 days?",
          description: "A Delhi to Delhi trip can be done in 4 days, and Rishikesh to Rishikesh is best in 3 days. 2 days is very hectic (same-day return); we recommend the 2N/3D package.",
        },
        {
          title: "Is skiing included?",
          description: "No. Skiing costs ₹1,500-2,000 per person with a trainer and equipment for 2 hours, available only in Dec-March when there is snow.",
        },
        {
          title: "What if the cable car is closed due to snow or wind?",
          description: "We take you by road (13 km) — about a 1-hour drive to Auli, safe even with chains used in heavy snowfall.",
        },
        {
          title: "Is it better to stay in Auli or Joshimath?",
          description: "Auli offers a Nanda Devi view, sunrise and stars, but has only 6-7 resorts that fill up fast and cost more. Joshimath has comfortable heated hotels, 30 minutes from Auli.",
        },
        {
          title: "Is Auli better than Manali?",
          description: "For snow and peace, yes — Manali is crowded with traffic and a mall road, while Auli is clean, silent and surrounded only by Himalayan peaks.",
        },
      ],
      transportModes: TRANSPORT_BY_GROUP_SIZE,
      cancellationPolicy: TIERED_CANCELLATION_POLICY,
      confirmationPolicy: CONFIRMATION_POLICY,
      contactNumbers: TRIP_CONTACT_NUMBERS,
      thingsToCarry: [
        "Heavy jacket, thermal inners and woollen cap for winter (Dec-Mar)",
        "Light jacket for summer (Apr-June)",
        "Gloves and UV-protected sunglasses",
        "Sunscreen and lip balm",
        "Good trekking / snow shoes",
        "Personal medical kit",
        "Aadhaar Card / photo ID for hotel check-in",
      ],
      thingsToRemember: TRIP_GROUND_RULES,
      relatedSlugs: ["char-dham-yatra", "chopta-tungnath-trek", "kedarnath-yatra"],
    }
  ),

  toListingItem(
    {
      name: "Char Dham Yatra",
      slug: "char-dham-yatra",
      duration: "8N/9D",
      heroImage: "/Trips_gallery/Kedarnath/IMG_1946.jpg",
      tagline: "Yamunotri, Gangotri, Kedarnath and Badrinath in 8 Nights / 9 Days, Haridwar to Haridwar.",
    },
    {
      region: "Uttarakhand",
      startLocation: "Haridwar",
      endLocation: "Haridwar",
      difficulty: "Moderate",
      price: 24999,
      months: ["May", "Jun", "Sep", "Oct", "Nov"],
      themes: ["Pilgrimage", "Snow", "Forest"],
      category: "Backpacking Trip",
      detailsPath: "/trips/backpacking/char-dham-yatra",
      alternateNames: ["Chardham Yatra", "Char Dham", "Chota Char Dham", "Yamunotri", "Gangotri", "Kedarnath", "Badrinath", "Kedar"],
      altitude: "11,755 ft / 3,583 m (Kedarnath, the highest point on the circuit)",
      minAge: 12,
      intro:
        "Char Dham Yatra is the most sacred pilgrimage circuit of Uttarakhand and one of the most important Yatras of Hinduism. Located in the Garhwal Himalayas, the Yatra covers four holy shrines — Yamunotri, Gangotri, Kedarnath and Badrinath — at altitudes between roughly 10,000 and 11,755 ft, over 8 Nights / 9 Days from Haridwar to Haridwar.",
      highlights: [
        "4 Sacred Dhams — Yamunotri, Gangotri, Kedarnath, Badrinath",
        "5 Prayag Sangams",
        "Surya Kund, Yamunotri",
        "Bhagirathi River origin, Gangotri",
        "Kedarnath Jyotirlinga darshan",
        "Tapt Kund hot spring, Badrinath",
        "Mana Village — the last village of India",
        "Ganga & Yamuna river origins",
      ],
      usps: [
        {
          title: "All four Dhams in one circuit",
          description: "Yamunotri, Gangotri, Kedarnath and Badrinath — the four shrines together believed to lead to Moksha — are covered end to end in a single 8N/9D departure from Haridwar.",
        },
        {
          title: "Built for families and first-time yatris",
          description: "Easy to moderate by road, with pony, palki, doli and helicopter options available at Yamunotri and Kedarnath for those who can't trek. Many yatris above 70 complete it every year.",
        },
        {
          title: "One of the fastest complete circuits",
          description: "8 Nights / 9 Days is the fastest way to cover all four Dhams without dropping a shrine.",
        },
      ],
      idealFor: "Family, senior citizens, couples, first-time yatris and anyone on a Moksha Yatra.",
      differentiators: [
        "Route: Haridwar → Barkot → Yamunotri → Uttarkashi → Gangotri → Sonprayag → Kedarnath → Badrinath → Haridwar",
        "Distance: ~1,550 km by road + 44 km trek (12 km Yamunotri + 32 km Kedarnath round trip)",
        "Best season: May–June and September–October",
        "Winter: closed November to April — idols moved to their winter abodes",
        "Monsoon: July–August is a landslide-prone stretch of road and is best avoided",
      ],
      importantNote:
        "All four temples close from November to April due to heavy snowfall, when the idols are moved to their winter abodes — Yamunotri to Kharsali, Gangotri to Mukhba, Kedarnath to Ukhimath and Badrinath to Joshimath. July–August falls in the monsoon and is a landslide-prone stretch of road in Uttarakhand, best avoided. Char Dham registration and e-pass assistance is arranged for you as part of this package, but you must carry your Aadhaar Card.",
      destinationHighlights: [
        {
          name: "Yamunotri",
          blurb: "The westernmost Dham at 10,804 ft, reached by a 6 km trek each way from Janki Chatti. Surya Kund's hot spring sits beside the temple — a dip here is believed to protect against untimely death.",
        },
        {
          name: "Gangotri",
          blurb: "The origin of the Bhagirathi River at 10,055 ft, reached entirely by road through the Harsil Valley — no trek required. The temple stands right beside the river.",
        },
        {
          name: "Kedarnath",
          blurb: "The soul of the Yatra and one of the 12 Jyotirlingas, at 11,755 ft — reached by a 16 km trek each way from Gaurikund.",
        },
        {
          name: "Badrinath",
          blurb: "The abode of Lord Vishnu at 10,170 ft, between the Nar and Narayan peaks. Includes a bath at the Tapt Kund hot spring and a visit to Mana Village, the last village of India.",
        },
      ],
      priceNote: "₹24,999 + 5% GST ex-Haridwar / Rishikesh / Dehradun. ₹26,999 + 5% GST for Delhi to Delhi.",
      packages: [
        { id: "ex-haridwar", label: "Ex-Haridwar / Rishikesh / Dehradun", price: 24999, paxLabel: "Ex-Haridwar", vehicle: "By group size", sharing: "Triple / quad" },
        { id: "ex-delhi", label: "Ex-Delhi (Delhi to Delhi)", price: 26999, paxLabel: "Ex-Delhi", vehicle: "By group size", sharing: "Triple / quad" },
      ],
      itinerary: [
        {
          day: 1,
          title: "Haridwar to Barkot",
          entries: [
            { text: "Pickup from Haridwar Railway Station at 7 AM." },
            { text: "Drive via Dehradun, Mussoorie, Kempty Fall and Damta — 180 km, 7-8 hours." },
            { text: "Evening arrival in Barkot; check in to your hotel." },
            { text: "Dinner and overnight stay at Barkot." },
          ],
        },
        {
          day: 2,
          title: "Barkot to Yamunotri to Barkot",
          entries: [
            { text: "Early 5 AM drive to Janki Chatti, 36 km." },
            { text: "6 km trek to Yamunotri Temple — pony or palki available at your own cost." },
            { text: "Holy dip in Surya Kund and darshan of Maa Yamunotri." },
            { text: "Rice cooked in Garam Kund; trek back to Janki Chatti." },
            { text: "Drive back to Barkot for the night." },
          ],
        },
        {
          day: 3,
          title: "Barkot to Uttarkashi",
          entries: [
            { text: "Drive to Uttarkashi via Prakasheshwar Mahadev after breakfast — 100 km, 4-5 hours." },
            { text: "Visit Kashi Vishwanath Temple at Uttarkashi." },
            { text: "Evening free for the local market." },
            { text: "Dinner and overnight stay at Uttarkashi." },
          ],
        },
        {
          day: 4,
          title: "Uttarkashi to Gangotri to Uttarkashi",
          entries: [
            { text: "Early morning drive to Gangotri Dham, 10,055 ft — 100 km one side, 3-4 hours." },
            { text: "Enroute: Gangnani Hot Spring and Harsil Valley." },
            { text: "Darshan at Gangotri Temple and a holy dip in the Bhagirathi River." },
            { text: "Drive back to Uttarkashi for the night." },
          ],
        },
        {
          day: 5,
          title: "Uttarkashi to Sonprayag",
          entries: [
            { text: "The longest and most scenic drive of the Yatra, via Srinagar and Rudraprayag — 260 km, 9-10 hours." },
            { text: "Evening arrival at Sonprayag." },
            { text: "Dinner and overnight stay at Sonprayag." },
          ],
        },
        {
          day: 6,
          title: "Sonprayag to Kedarnath",
          entries: [
            { text: "Local jeep from Sonprayag to Gaurikund, about 30 km." },
            { text: "16 km trek to Kedarnath (11,755 ft) — pony, palki or helicopter available at your own cost." },
            { text: "Evening darshan of the Kedarnath Jyotirlinga." },
            { text: "Overnight stay at Kedarnath — tents / dormitory, sharing basis." },
          ],
        },
        {
          day: 7,
          title: "Kedarnath to Sonprayag",
          entries: [
            { text: "4 AM Bhasm Aarti at Kedarnath Temple." },
            { text: "Trek down 16 km to Gaurikund, then drive to Sonprayag." },
            { text: "Evening rest, dinner and overnight stay at Sonprayag." },
          ],
        },
        {
          day: 8,
          title: "Sonprayag to Badrinath",
          entries: [
            { text: "Drive via Joshimath and Govindghat — 200 km, 8-9 hours." },
            { text: "Visit Bhim Pul at Mana Village enroute." },
            { text: "Evening arrival at Badrinath; check in to your hotel." },
            { text: "Overnight stay at Badrinath." },
          ],
        },
        {
          day: 9,
          title: "Badrinath to Haridwar",
          entries: [
            { text: "Early morning darshan at Shri Badrinath Dham, 10,170 ft." },
            { text: "Visit Mana Village — the last village of India — Vyas Gufa and Ganesh Gufa." },
            { text: "Drive back via Karnaprayag, Rudraprayag and Devprayag Sangam — 310 km, 10-11 hours." },
            { text: "Drop at Haridwar by 9 PM. Yatra ends with blessings." },
          ],
        },
      ],
      costIncludes: [
        "8 nights hotel accommodation, triple / quad sharing",
        "8 breakfasts and 8 dinners, pure vegetarian",
        "All transportation Haridwar to Haridwar — Dzire / Ertiga / Tempo Traveller as per group size",
        "Driver allowance, toll tax, parking and fuel",
        "Yatra manager support",
        "Char Dham registration and e-pass assistance",
        "All inner line permits",
      ],
      costExcludes: [
        "Lunch on any day",
        "Pony/palki/doli/helicopter charges at Yamunotri and Kedarnath",
        "Kedarnath deluxe / VIP stay — standard tent/dormitory stay is included; hotel at Guptkashi is included",
        "Helicopter ticket",
        "Entry fees, special darshan and aarti tickets",
        "Personal expenses, laundry, porter and tips",
        "5% GST",
        "Anything not mentioned under Inclusions",
      ],
      eligibilityCriteria: [
        { icon: "User", text: "Open to family, senior citizens, couples and first-time yatris" },
        { icon: "Mountain", text: "Highest point: Kedarnath Temple at 11,755 ft / 3,583 m" },
        { icon: "Footprints", text: "Two short treks required — 6 km to Yamunotri and 16 km to Kedarnath, each way" },
        { icon: "Stethoscope", text: "Senior citizens can complete the trek portions by pony, palki/doli or helicopter — many yatris above 70 do it every year" },
      ],
      fitnessCriteria: [
        { icon: "Footprints", text: "Comfortable with a 6 km trek to Yamunotri and a 16 km trek to Kedarnath, each way" },
        { icon: "Activity", text: "Able to handle long travel days — some drives run 8-10 hours" },
        { icon: "TrendingUp", text: "Pony, palki, doli or helicopter options are available at Yamunotri and Kedarnath for those who prefer not to trek" },
      ],
      howToReach: {
        intro: "The Yatra starts and ends at Haridwar / Rishikesh. All travel from Haridwar to Haridwar is included in this 8N/9D package — you only need to reach Haridwar, where pickup is from the railway station at 7 AM on Day 1.",
        air: {
          summaryLabel: "Nearest Airport",
          summary: "Jolly Grant Airport, Dehradun (DED)",
          detail: "45 km from Haridwar, with daily flights from Delhi and Mumbai. From the airport, take a taxi or bus to Haridwar, about 1.5 hours.",
        },
        train: {
          summaryLabel: "Nearest Railway Station",
          summary: "Haridwar Junction (HW)",
          detail: "Well connected to Delhi, Mumbai, Kolkata and Lucknow, with overnight trains from Delhi taking 6-7 hours. Rishikesh station is 25 km from Haridwar.",
        },
        road: {
          summaryLabel: "Route",
          summary: "Delhi to Haridwar via NH334",
          detail: "About 230 km and 5-6 hours by road from Delhi. Daily Volvo buses run from Kashmiri Gate ISBT, Delhi, to Haridwar.",
          route: ["Haridwar / Rishikesh", "Barkot", "Yamunotri", "Uttarkashi", "Gangotri", "Sonprayag", "Kedarnath", "Badrinath", "Haridwar"],
          facts: [
            { label: "Total Distance", value: "~1,550 km by road + 44 km trek" },
            { label: "Duration", value: "8 Nights / 9 Days" },
          ],
        },
        pickup: {
          point: "Haridwar Railway Station",
          time: "7:00 AM, Day 1",
          dropPoint: "Haridwar",
          dropTime: "9:00 PM, Day 9",
          note: "Getting to each Dham after Haridwar: Yamunotri — drive to Janki Chatti (220 km), then a 6 km trek one side; Gangotri — drive from Uttarkashi (100 km), temple is 500m from parking, no trek; Kedarnath — drive to Gaurikund (30 km), then a 16 km trek one side, or helicopter from Phata/Sersi/Guptkashi; Badrinath — direct drive to within 100m of the temple, no trek.",
        },
      },
      faqs: [
        {
          title: "What is the total distance of Char Dham Yatra?",
          description: "Approx. 1,550 km by road from Haridwar to Haridwar, plus a 12 km trek for Yamunotri (6 km one side) and a 32 km trek for Kedarnath (16 km one side).",
        },
        {
          title: "Is the Kedarnath trek difficult? Can senior citizens do it?",
          description: "Yes, the trek is moderate to difficult. Senior citizens can do it easily by pony, palki/doli or helicopter — many people above 70 years do it every year.",
        },
        {
          title: "What is the best time for Char Dham Yatra?",
          description: "May to June and September to October. Temples open from late April/early May to early November (Bhai Dooj). July-August is monsoon — avoid due to landslides.",
        },
        {
          title: "What type of hotels and food will be provided in 8N/9D?",
          description: "Clean budget-to-deluxe hotels, double/triple/quad sharing. At Kedarnath, dormitory/tent on a sharing basis (deluxe room available at extra cost). Food is pure vegetarian — 8 breakfasts and 8 dinners are included.",
        },
        {
          title: "What to pack for Char Dham Yatra?",
          description: "Warm jackets, raincoat, trekking shoes, torch, power bank, medicines, Aadhaar Card (mandatory), and a woollen cap and gloves for Kedarnath and Badrinath.",
        },
        {
          title: "Is registration required for Char Dham Yatra?",
          description: "Yes, Uttarakhand Govt. Char Dham registration is mandatory. We take care of it for you, but you need to carry your Aadhaar Card.",
        },
        {
          title: "Can we do Char Dham by helicopter?",
          description: "Yes, but that is a 4N/5D package and costs ₹1.8L to ₹2.2L per person. By road, the 8N/9D circuit is the most economical option.",
        },
        {
          title: "When does Kedarnath Helicopter booking start?",
          description: "IRCTC Heli booking opens 15-20 days before the journey date and is lottery-based. We can assist with the process, but tickets cannot be guaranteed due to government rules.",
        },
        {
          title: "What is the pickup and drop time for 8N/9D?",
          description: "Pickup is Day 1 at 7 AM from Haridwar Railway Station. Drop is Day 9 at 9 PM at Haridwar. Book your onward train/flight for after 10 PM.",
        },
        {
          title: "Is 9 days enough for Char Dham?",
          description: "Yes, 8N/9D is the fastest route to cover all four Dhams.",
        },
      ],
      transportModes: TRANSPORT_BY_GROUP_SIZE,
      cancellationPolicy: TIERED_CANCELLATION_POLICY,
      confirmationPolicy: CONFIRMATION_POLICY,
      contactNumbers: TRIP_CONTACT_NUMBERS,
      thingsToCarry: [
        "40–60 L rucksack with rain cover",
        "Hot and cold water bottle",
        "Personal medical kit",
        "Snacks — energy bars, dry fruit and ORS",
        "3 t-shirts",
        "1 fleece jacket",
        "1 down jacket",
        "1 raincoat or poncho",
        "Thermal inners, upper and lower",
        "2 trek pants",
        "1 pair gloves",
        "Sun cap and woollen cap",
        "UV-protected sunglasses",
        "4 pairs socks and 1 pair woollen socks",
        "Hand sanitiser",
        "Toilet paper",
        "Lip balm",
        "Neck gaiter or buff",
        "Aadhaar Card (mandatory for Char Dham registration)",
      ],
      thingsToRemember: TRIP_GROUND_RULES,
      relatedSlugs: ["kedarnath-yatra", "kedarnath-badrinath", "chopta-tungnath-trek", "panch-kedar-yatra"],
    }
  ),

  toListingItem(
    {
      name: "Panch Kedar Yatra",
      slug: "panch-kedar-yatra",
      duration: "11N/12D",
      heroImage: "/Trips_gallery/Kedarnath/IMG_1851.jpg",
      tagline: "All five Panch Kedar shrines — Kedarnath, Madhmaheshwar, Tungnath, Rudranath and Kalpeshwar — in one 12-day expedition.",
    },
    {
      region: "Uttarakhand",
      startLocation: "Rishikesh / Haridwar",
      endLocation: "Rishikesh / Haridwar",
      difficulty: "Difficult",
      price: 34999,
      months: ["May", "Jun", "Sep", "Oct"],
      themes: ["Pilgrimage", "Meadow", "Forest"],
      category: "Backpacking Trip",
      detailsPath: "/trips/backpacking/panch-kedar-yatra",
      alternateNames: [
        "Panch Kedar",
        "Panch Kedar Trek",
        "Five Kedar",
        "Kedarnath",
        "Madhyamaheshwar",
        "Madmaheshwar",
        "Tungnath",
        "Chandrashila",
        "Rudranath",
        "Kalpeshwar",
        "Panar Bugyal",
        "Sagar Village",
        "Urgam Village",
        "Kedar",
      ],
      altitude: "7,200 ft to 12,800 ft (Tungnath, the highest of the five Kedars)",
      minAge: 12,
      maxAge: 58,
      availability: "Batches from May–June and September–October, ex-Rishikesh / Haridwar",
      intro:
        "Panch Kedar are five sacred Shiva temples in the Garhwal Himalayas, where the body parts of Lord Shiva — in the form of a bull — reappeared after the Mahabharata. After the Kurukshetra war, the Pandavas sought forgiveness from Lord Shiva. He avoided them by taking the form of a bull and diving into the ground; his body parts then surfaced at five places. We are Uttarakhand's first Panch Kedar specialist team, taking you to all five shrines — Kedarnath, Madhmaheshwar, Tungnath, Rudranath and Kalpeshwar — in one continuous 12-day yatra from Rishikesh / Haridwar, in small batches of 8–12 with our own local team and stay on each Kedar. This is not a luxury tour — it's a pure Himalayan expedition, and only about 5% of devotees complete all five Kedars in one go.",
      highlights: [
        "Kedarnath (Hump / पीठ) — 11,755 ft, 16 km trek from Gaurikund, one of the 12 Jyotirlingas",
        "Madhmaheshwar (Navel / नाभि) — 11,473 ft, the most peaceful of the five, ringed by the Chaukhamba peaks",
        "Tungnath (Arms / भुजाएं) — 12,800 ft, the world's highest Shiva temple, with Chandrashila peak just 1 km beyond",
        "Rudranath (Face / मुख) — 11,800 ft, the toughest Kedar, a natural rock face of Shiva through dense forest and bugyals",
        "Kalpeshwar (Hair / जटाएं) — 7,200 ft, a cave shrine and the only Panch Kedar open all year",
        "Panar Bugyal and Deoria Tal en route — high-altitude meadows and lake views of the Garhwal Himalayas",
      ],
      usps: [
        {
          title: "We know the real trek, not Google Maps",
          description: "Rudranath has 3 different routes and Madhmaheshwar has 2 — online maps will confuse you. We know which route has water, which village has a stay, where the network comes, and where a pony can and can't go. That knowledge only comes from living here.",
        },
        {
          title: "Our own local team on each Kedar",
          description: "Our homestay in Sari covers Madhmaheshwar and Tungnath, our hotel in Sagar covers Rudranath, and our hotel in Sonprayag covers Kedarnath. You are never left alone anywhere on the circuit.",
        },
        {
          title: "Small batches, not a bus yatra",
          description: "We take only 8–12 people per batch, with 1 guide and 1 porter, so everyone gets proper attention in the jungle and at high altitude.",
        },
        {
          title: "Pure yatra, no luxury drama",
          description: "We tell you honestly on Day 1 — you'll walk ~80 km, sleep in wooden rooms, eat dal-chawal, and go without phone network for 3–5 days. We don't sell fake luxury in the Himalayas.",
        },
      ],
      idealFor: "Serious Shiv Bhakts and fit trekkers ready for a pure Himalayan expedition, not a luxury holiday — only about 5% of devotees complete all 5 Kedars in one go.",
      differentiators: [
        "Total duration: 12–14 days from Haridwar / Rishikesh",
        "Best time: May–June and September–October",
        "Total trek: ~80 km on foot across the five Kedars",
        "Sequence: Kedarnath → Madhmaheshwar → Tungnath → Rudranath → Kalpeshwar (Badrinath can be added at the end)",
        "Altitude range: 7,200 ft at Kalpeshwar to 12,800 ft at Tungnath",
        "Batches of 8–12 people with 1 guide and 1 porter, and our own local team/stay on each Kedar",
      ],
      importantNote:
        "This is not a luxury tour, it's a pure Himalayan expedition. You will walk close to 80 km, sleep in wooden rooms, tents and dharamshalas, eat simple dal-chawal meals, and have no phone network for 3–5 days at a stretch (Jio works till Sonprayag, Sari and Sagar Village; there is no network at Kedarnath base, Madhmaheshwar, Panar and Rudranath). Kalpeshwar is the only Kedar open all year — the other four are open only from May to November and close for winter due to snow.",
      destinationHighlights: [
        {
          name: "Kedarnath — 1st Kedar (Hump)",
          blurb: "The biggest and main temple, one of the 12 Jyotirlingas, at 11,755 ft — a 16 km trek from Gaurikund. Open May to November; the Bhairav Shila boulder is believed to protect the temple. Difficulty: Moderate–Difficult.",
        },
        {
          name: "Madhmaheshwar — 2nd Kedar (Navel)",
          blurb: "The most beautiful and peaceful Kedar, at 11,473 ft — an 18 km trek from Ransi Village near Ukhimath, surrounded by the Chaukhamba and Kedarnath peaks. Difficulty: Difficult.",
        },
        {
          name: "Tungnath — 3rd Kedar (Arms)",
          blurb: "The world's highest Shiva temple, at 12,800 ft — a short 3.5 km trek from Chopta and the easiest of the five. Chandrashila peak (4,000 m) is 1 km further, with a 360° Himalayan view. Difficulty: Easy.",
        },
        {
          name: "Rudranath — 4th Kedar (Face)",
          blurb: "The toughest and most remote Kedar, at 11,800 ft — a 22 km trek from Sagar Village through dense forest and bugyal meadows to a natural rock face of Shiva. Difficulty: Very Difficult.",
        },
        {
          name: "Kalpeshwar — 5th Kedar (Hair)",
          blurb: "The easiest and only Panch Kedar open throughout the year, at 7,200 ft — a 2 km trek from Urgam Village to a cave temple where Shiva's hair is worshipped. Difficulty: Very Easy.",
        },
      ],
      priceNote: "₹34,999 per person, excluding GST. 5% GST applies on the invoice amount.",
      itinerary: [
        {
          day: 1,
          title: "Rishikesh / Haridwar to Sonprayag",
          entries: [
            { text: "220 km / 9 hrs drive via Devprayag (Sangam of Alaknanda and Bhagirathi), Srinagar, Rudraprayag, Agastmuni and Guptkashi." },
            { text: "5:30 AM pickup from Haridwar Railway Station / Rishikesh Bus Stand; breakfast en route at Srinagar." },
            { text: "Evening check-in at Sonprayag; briefing for the Kedarnath trek — hand over your main bag and carry only a small bag for the next 2 days." },
            { text: "Stay: Sonprayag Hotel. Meals: Dinner." },
          ],
        },
        {
          day: 2,
          title: "Sonprayag to Kedarnath Dham — 1st Kedar",
          entries: [
            { text: "16 km trek. 4 AM start; shared jeep from Sonprayag to Gaurikund (5 km), then trek begins." },
            { text: "Route: Jungle Chatti — Bheembali — Linchauli — Base Camp — Kedarnath (11,755 ft); reach by 12–1 PM." },
            { text: "Evening darshan and Aarti at Kedarnath Temple — the Hump (Prishtha) of Lord Shiva is worshipped here." },
            { text: "Stay: Kedarnath Tent / Dorm (sharing). Meals: Breakfast + Dinner." },
          ],
        },
        {
          day: 3,
          title: "Kedarnath to Sonprayag",
          entries: [
            { text: "16 km trek down. 5 AM second darshan at the temple, then trek down to Sonprayag — about 6 hours." },
            { text: "Reach Sonprayag by 2–3 PM; hot bath and rest in a proper hotel room after the basic Kedarnath stay." },
            { text: "Stay: Sonprayag Hotel. Meals: Breakfast + Dinner." },
          ],
        },
        {
          day: 4,
          title: "Sonprayag to Sari Village",
          entries: [
            { text: "45 km / 2 hrs drive. Relaxed 9 AM start after two days of trekking; drive via Ukhimath, the winter seat of Kedarnath." },
            { text: "Reach Sari Village (2,000 m) by 11 AM; check in to a homestay with Chaukhamba Peak views." },
            { text: "Evening free — optional trek to Deoria Tal Lake (2 km), known for its reflection of the Himalayas." },
            { text: "Stay: Sari Village Homestay. Meals: Breakfast + Dinner." },
          ],
        },
        {
          day: 5,
          title: "Sari Village to Madhmaheshwar — 2nd Kedar",
          entries: [
            { text: "16 km trek. 6 AM drive to Ransi Village (5 km), the last road head for Madhmaheshwar." },
            { text: "Trek via Ransi — Gaundar Village — Bantoli — Madhmaheshwar, through dense forest and past waterfalls." },
            { text: "Reach Madhmaheshwar Temple (3,497 m / 11,473 ft) by 3–4 PM — the Navel (Nabhi) of Lord Shiva is worshipped here." },
            { text: "Stay: Madhmaheshwar Homestay / Temple Guest House. Meals: Breakfast + Dinner." },
          ],
        },
        {
          day: 6,
          title: "Madhmaheshwar to Sari Village",
          entries: [
            { text: "16 km trek down + drive. Morning pooja at the temple, then trek down to Ransi Village, 5–6 hours." },
            { text: "Pickup at Ransi and drive back to Sari Village by evening; rest and bonfire at the homestay." },
            { text: "Stay: Sari Village Homestay. Meals: Breakfast + Dinner." },
          ],
        },
        {
          day: 7,
          title: "Sari Village to Chopta – Tungnath — 3rd Kedar – Back to Sari",
          entries: [
            { text: "7 AM drive to Chopta (25 km / 1 hr) — Mini Switzerland." },
            { text: "3.5 km / 1.5 hr trek to Tungnath Temple (3,680 m) — the highest Shiva temple in the world; the Arms (Bhuja) of Shiva are worshipped here." },
            { text: "Further 1 km trek to Chandrashila Peak (4,000 m) for a 360° view of Nanda Devi, Trishul and Chaukhamba." },
            { text: "After darshan, drive back to Sari Village for overnight stay." },
            { text: "Stay: Sari Village Homestay. Meals: Breakfast + Dinner." },
          ],
        },
        {
          day: 8,
          title: "Sari Village to Sagar Village to Panar Bugyal",
          entries: [
            { text: "6 AM start; long drive Sari to Sagar Village (50 km / 3 hrs) via Chopta–Mandal–Gopeshwar — the base for the 4th Kedar, Rudranath." },
            { text: "Lunch at Sagar, then an 11 km / 5 hr trek through jungle and bugyal to Panar Bugyal (2,800 m)." },
            { text: "Overnight in tents at Panar, a large meadow with no electricity." },
            { text: "Stay: Panar Bugyal Tents. Meals: Breakfast + Dinner." },
          ],
        },
        {
          day: 9,
          title: "Panar Bugyal to Rudranath Temple — 4th Kedar — Stay at Rudranath",
          entries: [
            { text: "5 km / 2–3 hr trek to Rudranath; reach by 9 AM." },
            { text: "Rudranath (3,600 m) is the toughest and most beautiful Kedar — a temple in a natural cave surrounded by alpine meadows; the Face (Mukh) of Lord Shiva is worshipped here." },
            { text: "Overnight at the temple; attend the evening Aarti in complete silence, with only 10–15 other yatris. Basic accommodation at the priest house / dharamshala." },
            { text: "Stay: Rudranath Temple Dharamshala / Priest House (very basic). Meals: Breakfast + Dinner." },
          ],
        },
        {
          day: 10,
          title: "Rudranath to Sagar Village",
          entries: [
            { text: "16 km trek down. Early morning darshan, then a long trek down via Panar (5 km) and Lyuti to Sagar (11 km) — 7–8 hours, direct downhill." },
            { text: "Reach Sagar Village by evening — a proper hotel bed after two days of tent/dharamshala life." },
            { text: "Stay: Sagar Village Hotel / Homestay. Meals: Breakfast + Dinner." },
          ],
        },
        {
          day: 11,
          title: "Sagar Village to Urgam Village – Kalpeshwar — 5th Kedar",
          entries: [
            { text: "Drive Sagar to Helang (70 km / 3 hrs), then 12 km to Urgam Village / Devgram." },
            { text: "Easy 2 km / 30 min trek to Kalpeshwar Temple — a cave shrine and the only Kedar open all 365 days; the Hair (Jata) of Lord Shiva is worshipped here." },
            { text: "After darshan, back to Urgam Village — the last village of the Panch Kedar circuit." },
            { text: "Stay: Urgam Village Homestay. Meals: Breakfast + Dinner." },
          ],
        },
        {
          day: 12,
          title: "Urgam Village to Rishikesh / Haridwar",
          entries: [
            { text: "270 km / 10–11 hrs drive. 6 AM start via Helang, Joshimath, Chamoli, Rudraprayag and Srinagar." },
            { text: "Evening 5–6 PM drop at Rishikesh / Haridwar. Yatra ends — Panch Kedar Parikrama completed." },
            { text: "Meals: Breakfast." },
          ],
        },
      ],
      costIncludes: [
        "Transport, Haridwar/Rishikesh to Haridwar/Rishikesh, by Bolero / Ertiga / Innova / Tempo Traveller as per group size",
        "All driver allowance, toll, parking and fuel",
        "11 nights accommodation — 2N Sonprayag Hotel, 3N Sari Village Homestay, 1N Kedarnath Tent/Dorm (sharing), 1N Madhmaheshwar Homestay/Temple Guest House, 1N Panar Bugyal Tent (sharing), 1N Rudranath Temple Dharamshala/Priest House (very basic), 1N Sagar Village Homestay/Hotel, 1N Urgam Village Homestay",
        "11 Breakfasts + 11 Dinners (Veg), Day 1 dinner to Day 12 breakfast — hot homestay meals at Sari, Sonprayag, Sagar and Urgam",
        "Experienced trek guide for the Madhmaheshwar and Rudranath treks",
        "All forest and temple permits",
        "First aid kit",
      ],
      costExcludes: [
        "Lunch on all 12 days (available at small trail shops, approx. ₹150–200 per meal)",
        "Pony / palki / pitthu for Kedarnath or any other Kedar",
        "Helicopter ticket for Kedarnath",
        "Personal expenses, extra drinks, laundry and phone calls",
        "Any extra night's stay due to landslide or weather",
        "5% GST",
        "Anything not mentioned under inclusions",
      ],
      eligibilityCriteria: [
        { icon: "User", text: "Age limit: 12 to 58 years. Children below 12 are not permitted." },
        { icon: "Stethoscope", text: "Travellers above 55 need a medical fitness certificate before joining." },
        { icon: "Mountain", text: "Altitude ranges from 7,200 ft at Kalpeshwar to 12,800 ft at Tungnath." },
        { icon: "Footprints", text: "~80 km of trekking across the 5 Kedars — pony is available only at Kedarnath; the other four Kedars can only be reached on foot." },
      ],
      fitnessCriteria: [
        { icon: "Footprints", text: "Recommended: walk 5 km daily for 30 days before the yatra, and have completed at least one small trek before." },
        { icon: "Activity", text: "Rudranath (16 km one way) and Madhmaheshwar (16 km round trip) are the toughest stretches — good stamina is essential." },
        { icon: "Backpack", text: "Be ready to carry a daypack, sleep in basic wooden rooms/tents/dharamshalas, and go without phone network for 3–5 days." },
      ],
      howToReach: {
        intro: "Panch Kedar Yatra starts and ends at Rishikesh / Haridwar, with pickup at 5:30 AM on Day 1.",
        air: {
          summaryLabel: "Nearest Airport",
          summary: "Jolly Grant Airport, Dehradun (DED)",
          detail: "About 35 km from Rishikesh, with daily flights from Delhi, Mumbai and Bangalore. From the airport, take a taxi to Rishikesh, about 1 hour.",
        },
        train: {
          summaryLabel: "Nearest Railway Station",
          summary: "Haridwar Junction (HW)",
          detail: "Best-connected station on the circuit, with trains from Delhi (6 hrs), Mumbai, Kolkata and Lucknow. Haridwar to Rishikesh is 25 km by auto or bus.",
        },
        road: {
          summaryLabel: "Route",
          summary: "Rishikesh/Haridwar → Sonprayag → Sari Village → Chopta → Sagar Village → Urgam Village → Rishikesh/Haridwar",
          detail: "Daily Volvo buses run from Delhi ISBT Kashmiri Gate to Rishikesh/Haridwar, 6–7 hours; overnight buses are also available.",
          route: ["Rishikesh / Haridwar", "Sonprayag", "Sari Village", "Chopta", "Sagar Village", "Urgam Village", "Rishikesh / Haridwar"],
          facts: [
            { label: "Total Distance", value: "~500 km by road + ~80 km trek" },
            { label: "Duration", value: "11 Nights / 12 Days" },
          ],
        },
        pickup: {
          point: "Haridwar Railway Station / Rishikesh Bus Stand",
          time: "5:30 AM, Day 1",
          dropPoint: "Rishikesh / Haridwar",
          dropTime: "Evening, Day 12",
          note: "Jio network works till Sonprayag, Sari and Sagar Village; there is no network at the Kedarnath base, Madhmaheshwar, Panar and Rudranath for 5–6 days.",
        },
      },
      faqs: [
        {
          title: "What is Panch Kedar Yatra?",
          description: "Panch Kedar is 5 temples of Lord Shiva in Uttarakhand — Kedarnath, Madhmaheshwar, Tungnath, Rudranath and Kalpeshwar — built where 5 body parts of Shiva appeared after he took the form of a bull.",
        },
        {
          title: "How many days are required for Panch Kedar?",
          description: "12 Days / 11 Nights from Haridwar to Haridwar is standard. Fast groups can do it in 11 days; a comfortable pace is 12–13 days.",
        },
        {
          title: "How much trekking is there in Panch Kedar?",
          description: "Total 75–80 km on foot: Kedarnath 32 km (16+16), Madhmaheshwar 32 km (16+16), Tungnath–Chandrashila 7 km (3.5+3.5), Rudranath 16 km (direct from Panar to Sagar via Rudranath) and Kalpeshwar 2 km.",
        },
        {
          title: "What is the difficulty level?",
          description: "Moderate to Difficult overall. Rudranath is the toughest, followed by Madhmaheshwar. Tungnath and Kalpeshwar are easy. Good fitness is required.",
        },
        {
          title: "What is the best time for Panch Kedar Yatra?",
          description: "May to June and September to October. July–August is monsoon, with landslide risk. Winter (November–April) all temples are closed except Kalpeshwar.",
        },
        {
          title: "Which is the toughest Kedar among the 5?",
          description: "Rudranath is the toughest — a 16 km long trek with a steep climb and no facilities. Madhmaheshwar is the second toughest.",
        },
        {
          title: "Can we do Panch Kedar by helicopter?",
          description: "No. Only Kedarnath has a helicopter option. The other 4 Kedars can only be reached by trekking; pony is available only for Kedarnath.",
        },
        {
          title: "What is the age limit for Panch Kedar?",
          description: "12 to 58 years. For travellers above 55, a medical fitness certificate is required. Children below 12 are not allowed.",
        },
        {
          title: "What is included in the package cost?",
          description: "Transport from Haridwar, 11 nights stay (hotel/homestay/tent), 11 breakfasts + 11 dinners, trek guide and permits. Lunch is not included.",
        },
        {
          title: "What kind of stay will we get?",
          description: "At Sonprayag & Sagar — hotel. At Sari & Urgam — homestay. At Kedarnath — tent/dorm. At Madhmaheshwar — homestay/temple guest house. At Panar & Rudranath — tents/dharamshala (very basic, no attached bathroom).",
        },
        {
          title: "Is mobile network available on the Panch Kedar trek?",
          description: "Jio works till Sonprayag, Sari and Sagar Village. There is no network at the Kedarnath base, Madhmaheshwar, Panar and Rudranath for 5–6 days.",
        },
        {
          title: "Can beginners do Panch Kedar?",
          description: "Yes, if you have good fitness. If you can walk 5 km daily for 30 days before the yatra and have done some small trek before, you can do it.",
        },
        {
          title: "What should I pack for Panch Kedar?",
          description: "Waterproof trekking shoes, 2 warm jackets, a raincoat, 3–4 T-shirts and tracks, a cap, torch, power bank, water bottle, personal medicines and a small backpack.",
        },
        {
          title: "Which is better — Panch Kedar or Char Dham?",
          description: "Char Dham is easier and mostly by road. Panch Kedar is pure trekking and spiritual. If you love trekking and Shiva, Panch Kedar is a lifetime experience.",
        },
        {
          title: "Why is the Rudranath night stay at the temple itself?",
          description: "Staying at Rudranath Temple is the main experience — very few people get the chance to sleep near Mahadev at 11,800 ft in complete silence. That's why we go Panar to Rudranath and stay overnight at Rudranath.",
        },
      ],
      transportModes: TRANSPORT_BY_GROUP_SIZE,
      cancellationPolicy: TIERED_CANCELLATION_POLICY,
      confirmationPolicy: CONFIRMATION_POLICY,
      contactNumbers: TRIP_CONTACT_NUMBERS,
      thingsToCarry: HIMALAYAN_TREK_PACKING_LIST.flatMap((g) => g.items),
      rentalGear: TREK_RENTAL_GEAR,
      thingsToRemember: TRIP_GROUND_RULES,
      relatedSlugs: ["three-kedar-yatra", "chopta-tungnath-trek", "kedarnath-badrinath", "char-dham-yatra"],
    }
  ),

  toListingItem(
    {
      name: "3 Kedar Yatra",
      slug: "three-kedar-yatra",
      duration: "7N/8D",
      heroImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Tungnath_temple_one_of_thepanch_kedar.jpg/1920px-Tungnath_temple_one_of_thepanch_kedar.jpg",
      tagline: "Madmaheshwar, Rudranath and Kalpeshwar — three Panch Kedar shrines in eight days.",
    },
    {
      region: "Uttarakhand",
      startLocation: "Rishikesh",
      endLocation: "Rishikesh",
      difficulty: "Difficult",
      price: 18999,
      months: ["May", "Jun", "Sep", "Oct"],
      themes: ["Pilgrimage", "Meadow", "Forest"],
      category: "Backpacking Trip",
      detailsPath: "/trips/backpacking/three-kedar-yatra",
      alternateNames: ["3 Kedar", "Three Kedar", "3 Kedar's Yatra", "Madhmaheshwar", "Madhyamaheshwar", "Madmaheshwar", "Rudranath", "Kalpeshwar", "Kedar"],
      altitude: "Madhmaheshwar Temple — 2,286 m, as printed in the source itinerary",
      minAge: 15,
      availability: "Weekend batches every Saturday from Haridwar / Rishikesh",
      intro:
        "Three of the five Panch Kedar shrines — Madmaheshwar, Rudranath and Kalpeshwar — across eight days from Rishikesh.",
      highlights: [
        "Three Panch Kedar shrines — Madhmaheshwar, Rudranath and Kalpeshwar",
        "Camping in remote meadows and valleys under clear skies",
        "Ancient forest, high-altitude meadow, waterfalls and Garhwali villages",
        "Views of Chaukhamba, Nanda Devi, Neelkanth and Trishul",
        "Pannar Bugyal alpine camp",
        "The Kalpeshwar cave temple, well away from the tourist circuit",
      ],
      priceNote: "₹18,999 per person. 5% GST applies on the invoice amount.",
      sourceCaveat:
        "The inclusions block in the source PDF appears to be carried over from a shorter itinerary. It lists meals \"from Day 1 dinner to Day 5 breakfast\" and a transfer from Haridwar, whereas this is an eight-day trip running from Rishikesh. The accommodation count (7 nights) does match. Inclusions are reproduced as printed — confirm the meal plan and pickup city with the trips desk.",
      itinerary: [
        { day: 1, title: "Rishikesh to Ransi", entries: [{ text: "Drive about 220 km, 6–7 hours, via Devprayag and Rudraprayag." }, { text: "Overnight Ransi." }] },
        { day: 2, title: "Madhmaheshwar", entries: [{ text: "Trek about 18 km, 6–7 hours, to 2,286 m." }, { text: "Evening darshan and puja. Camp overnight near the temple." }] },
        { day: 3, title: "Down to Sagar", entries: [{ text: "Trek about 20 km to the roadhead, then drive 30 km." }, { text: "Overnight Sagar homestay." }] },
        { day: 4, title: "Pannar Bugyal", entries: [{ text: "Trek about 15 km, 5–6 hours." }, { text: "Camp overnight in the alpine meadow." }] },
        { day: 5, title: "Rudranath", entries: [{ text: "Trek about 12 km, 5–6 hours." }, { text: "Views of Nanda Devi and Trishul. Camp overnight near the temple." }] },
        { day: 6, title: "Rudranath to Urgam", entries: [{ text: "Trek about 18 km, 6–7 hours. Overnight Urgam." }] },
        { day: 7, title: "Kalpeshwar", entries: [{ text: "Trek about 10 km, 4–5 hours, to the cave temple." }, { text: "Overnight near Kalpeshwar." }] },
        { day: 8, title: "Return to Rishikesh", entries: [{ text: "Drive about 220 km, 6–7 hours. Trip ends." }] },
      ],
      costIncludes: [
        "7 nights accommodation in tents or lodges",
        "Surface transfer from Haridwar to the trek start and back",
        "All vegetarian meals from Day 1 dinner to Day 5 breakfast",
        "Morning and evening tea with snacks",
        "Qualified trekking guide",
        "All necessary permits",
        "Basic first aid",
      ],
      costExcludes: HIMALAYAN_TREK_EXCLUSIONS,
      transportModes: TRANSPORT_BY_GROUP_SIZE,
      cancellationPolicy: TIERED_CANCELLATION_POLICY,
      confirmationPolicy: CONFIRMATION_POLICY,
      contactNumbers: TRIP_CONTACT_NUMBERS,
      thingsToCarry: HIMALAYAN_TREK_PACKING_LIST.flatMap((g) => g.items),
      rentalGear: TREK_RENTAL_GEAR,
      thingsToRemember: TRIP_GROUND_RULES,
      relatedSlugs: ["rudranath-trek", "panch-kedar-yatra", "madmaheshwar-trek"],
    }
  ),

  toListingItem(
    {
      name: "Madhyamaheshwar Trek — 4 Days",
      slug: "madhyamaheshwar-trek-4-day",
      duration: "3N/4D",
      heroImage: "/Trips_gallery/Madhmaheshwar/IMG_1357.jpg",
      tagline: "Ransi to the Madhyamaheshwar shrine and a pre-dawn climb to Buda Madhyamaheshwar, ex-Haridwar.",
    },
    {
      region: "Uttarakhand",
      startLocation: "Haridwar / Rishikesh",
      endLocation: "Haridwar / Rishikesh",
      difficulty: "Moderate",
      price: null,
      months: ["May", "Jun", "Sep", "Oct"],
      themes: ["Pilgrimage", "Meadow", "Forest"],
      category: "Backpacking Trip",
      detailsPath: "/trips/backpacking/madhyamaheshwar-trek-4-day",
      alternateNames: [
        "Madhyamaheshwar Trek",
        "Madmaheshwar Trek",
        "Madhmaheshwar",
        "Buda Madhyamaheshwar",
        "Budha Madmaheshwar",
        "Ransi",
        "Sari Village",
        "Panch Kedar",
        "Kedar",
      ],
      minAge: 12,
      intro:
        "The same Madhyamaheshwar shrine as the Delhi package, run over four days from Haridwar or Rishikesh with an extra night at Sari and a full day at the temple. The trail leaves the base village of Ransi and climbs through forest, mountain streams and traditional Himalayan villages inside the Kedarnath Wildlife Sanctuary. The reason to spend the extra day is the pre-dawn walk up to Buda Madhyamaheshwar for sunrise over the Chaukhamba massif.",
      highlights: [
        "Madhyamaheshwar Temple, reached on foot from Ransi",
        "Buda Madhyamaheshwar at sunrise over the Chaukhamba massif",
        "The trail through the Kedarnath Wildlife Sanctuary",
        "Alaknanda river views on the drive in",
        "Ukhimath, Rudraprayag and Devprayag en route",
        "A full rest day at the shrine rather than a turnaround",
      ],
      priceNote:
        "The source itinerary is a day-by-day plan only and publishes no rates. Contact the trips desk for current pricing.",
      sourceCaveat:
        "This source document contains the itinerary alone — it carries no pricing, inclusions, exclusions or cancellation terms, so those sections are left empty here rather than filled from another package. The day numbering also has a gap: Day 3 ends at Madhyamaheshwar and Day 4 opens with the drive out of Sari, without describing the descent between the two. Please confirm the Day 3–4 handover, the fare and what the fare covers with the trips desk.",
      itinerary: [
        {
          day: 1,
          title: "Haridwar / Rishikesh to Sari",
          entries: [
            { text: "Drive about 200 km, 7–8 hours." },
            { text: "Alaknanda river views, through Devprayag, Rudraprayag and Ukhimath." },
            { text: "Reach Sari by evening and settle in. Overnight Sari." },
          ],
        },
        {
          day: 2,
          title: "Sari to Ransi, then trek to Madhyamaheshwar",
          entries: [
            { text: "Early start, short drive from Sari to Ransi — the base village for the trek." },
            { text: "Trek from Ransi through forest, mountain streams and traditional Himalayan villages." },
            { text: "The trail climbs gradually through the Kedarnath Wildlife Sanctuary." },
            { text: "Reach the temple by evening. Overnight near the shrine." },
          ],
        },
        {
          day: 3,
          title: "Buda Madhyamaheshwar at sunrise",
          entries: [
            { text: "Pre-dawn 2 km hike to Buda Madhyamaheshwar — a steep ascent of about an hour." },
            { text: "Sunrise over the Chaukhamba massif." },
            { text: "Return to Madhyamaheshwar Temple for breakfast." },
            { text: "Rest of the day free at the shrine." },
          ],
        },
        {
          day: 4,
          title: "Sari to Haridwar / Rishikesh",
          entries: [
            { text: "After breakfast, begin the return drive from Sari Village." },
            { text: "Scenic drive through the Garhwal Himalayas via Ukhimath, Rudraprayag and Devprayag." },
            { text: "Reach Haridwar / Rishikesh by evening. Trip ends." },
          ],
        },
      ],
      confirmationPolicy: CONFIRMATION_POLICY,
      contactNumbers: TRIP_CONTACT_NUMBERS,
      contactPhone: "+91 81786 13438",
      thingsToRemember: TRIP_GROUND_RULES,
      relatedSlugs: ["madmaheshwar-trek", "three-kedar-yatra", "panch-kedar-yatra"],
    }
  ),

  toListingItem(
    {
      name: "Rudranath Trek",
      slug: "rudranath-trek",
      duration: "4N/5D",
      heroImage: "/Trips_gallery/Rudranath/IMG_8695.jpg",
      tagline: "Rhododendron forest and alpine meadow up to the Rudranath shrine at 2,286 m.",
    },
    {
      region: "Uttarakhand",
      startLocation: "Haridwar",
      endLocation: "Haridwar",
      difficulty: "Moderate-Difficult",
      price: 11999,
      months: ["May", "Jun", "Sep", "Oct"],
      themes: ["Pilgrimage", "Meadow", "Forest"],
      category: "Backpacking Trip",
      detailsPath: "/trips/backpacking/rudranath-trek",
      alternateNames: ["Rudranath", "Rudranath Yatra", "Panar Bugyal", "Pannar Bugyal", "Sagar Village", "Panch Kedar", "Kedar"],
      altitude: "Rudranath Temple — 2,286 m, as printed in the source itinerary",
      minAge: 15,
      availability: "Weekend batches every Saturday from Haridwar / Rishikesh",
      intro:
        "Five days from Haridwar up through rhododendron and oak forest to Pannar Bugyal, then on to the Rudranath shrine at 2,286 m.",
      highlights: ["Pannar Bugyal", "Rudranath Temple", "Evening aarti", "Sunset over the range", "Rhododendron forest"],
      priceNote: "₹11,999 per person.",
      itinerary: [
        { day: 1, title: "Haridwar to Sagar Village", entries: [{ text: "Drive 250 km, 9–10 hours, via Devprayag and Rudraprayag." }, { text: "Overnight Sagar guesthouse." }] },
        { day: 2, title: "Sagar to Panar Bugyal", entries: [{ text: "Trek via Mandal through rhododendron and oak forest." }, { text: "Camp overnight in the meadow." }] },
        { day: 3, title: "Rudranath", entries: [{ text: "Trek up to the temple at 2,286 m." }, { text: "Evening aarti and sunset views. Overnight near the temple." }] },
        { day: 4, title: "Back to Sagar", entries: [{ text: "Trek down, 8–9 hours — downhill but long and challenging." }, { text: "Overnight Sagar." }] },
        { day: 5, title: "Return to Haridwar", entries: [{ text: "Drive 250 km, 9–10 hours. Trip ends." }] },
      ],
      costIncludes: [
        "4 nights accommodation in tents or lodges",
        "Surface transfer from Haridwar to the trek start and back",
        "Vegetarian meals from Day 1 dinner to Day 5 breakfast — dinner and breakfast only, lunch is not included",
        "Qualified trekking guide",
        "All necessary permits",
        "Basic first aid",
      ],
      costExcludes: HIMALAYAN_TREK_EXCLUSIONS,
      transportModes: TRANSPORT_BY_GROUP_SIZE,
      cancellationPolicy: TIERED_CANCELLATION_POLICY,
      confirmationPolicy: CONFIRMATION_POLICY,
      contactNumbers: TRIP_CONTACT_NUMBERS,
      thingsToCarry: HIMALAYAN_TREK_PACKING_LIST.flatMap((g) => g.items),
      rentalGear: TREK_RENTAL_GEAR,
      thingsToRemember: TRIP_GROUND_RULES,
      gallery: [
        { url: "/Trips_gallery/Rudranath/IMG_0096.jpg" },
        { url: "/Trips_gallery/Rudranath/IMG_3985.jpg" },
        { url: "/Trips_gallery/Rudranath/IMG_8694.jpg" },
      ],
      relatedSlugs: ["three-kedar-yatra", "panch-kedar-yatra", "chopta-tungnath-trek"],
    }
  ),

  toListingItem(
    {
      name: "Kedarnath Yatra",
      slug: "kedarnath-yatra",
      duration: "3N/4D",
      heroImage: "/Trips_gallery/Kedarnath/IMG_1946.jpg",
      tagline: "A divine Himalayan journey to Lord Shiva's shrine at 3,384 m.",
    },
    {
      heroImages: [
        "/Trips_gallery/Kedarnath/IMG_1668.jpg",
        "/Trips_gallery/Kedarnath/IMG_1851.jpg",
      ],
      region: "Uttarakhand",
      startLocation: "Haridwar",
      endLocation: "Haridwar",
      difficulty: "Moderate",
      price: 6499,
      months: ["May", "Jun", "Sep", "Oct"],
      themes: ["Pilgrimage", "Snow"],
      category: "Backpacking Trip",
      detailsPath: "/trips/backpacking/kedarnath-yatra",
      alternateNames: ["Kedarnath", "Kedarnath Dham", "Guptkashi", "Gaurikund", "Sonprayag", "Panch Kedar", "Kedar"],
      altitude: "Kedarnath — 3,384 m (11,755 ft), as printed in the source itinerary",
      minAge: 12,
      availability: "Every Saturday from Haridwar / Rishikesh, until 9 November",
      // Weekly Saturday departures, the last one on 7 Nov — the season closes
      // 9 Nov.
      batchDates: [
        "2026-10-03", "2026-10-10", "2026-10-17",
        "2026-10-24", "2026-10-31", "2026-11-07",
      ],
      intro:
        "Four days from Haridwar or Rishikesh to the Kedarnath shrine and back, with an overnight stay at the temple. The 16 km trail from Gaurikund climbs through valleys, rhododendron canopy and the chattis at Jungle Chatti, and the halts at Sonprayag on either side keep the trek days clean.",
      highlights: [
        "Kedarnath Temple at 11,755 ft, with the pre-dawn Abhishek",
        "Kedarnath Dome and Kedar Peak at sunrise and sunset",
        "Guptkashi — Vishwanath and Ardhnarishwar Temples",
        "Gaurikund and Jungle Chatti on the trek route",
        "Dhari Devi and the Rudraprayag Sangam en route",
        "The Mandakini river at Tilwara",
      ],
      priceNote: "₹6,499 per person, excluding GST.",
      sourceCaveat:
        "Two things in the source PDF do not line up. The inclusions section is boilerplate carried over from a longer itinerary — it refers to 7 nights of accommodation and meals from Day 1 dinner to Day 5 breakfast, which cannot apply to a 4-day trip, so inclusions are withheld here pending confirmation. The calendar page also states daily departures from Haridwar / Rishikesh while a later page states weekend batches every Saturday. The itinerary, pricing, transport and packing details below are accurate as printed.",
      itinerary: [
        { day: 1, title: "Haridwar / Rishikesh to Sonprayag — 220 km, 8–9 hrs", entries: [{ text: "5 AM pickup from Haridwar / Rishikesh." }, { text: "Drive via Devprayag, Srinagar, Rudraprayag and Guptkashi." }, { text: "Registration check en route." }, { text: "Reach Sonprayag / Sitapur by evening. Dinner and overnight at the hotel." }] },
        { day: 2, title: "Sonprayag to Kedarnath — 21 km drive + trek", entries: [{ text: "4 AM wake up, shared local jeep to Gaurikund (5 km)." }, { text: "16 km trek from Gaurikund to Kedarnath, 6–8 hours." }, { text: "Reach Kedarnath by evening for the evening Aarti darshan." }, { text: "Overnight at Kedarnath in a tent, dorm or lodge (basic)." }] },
        { day: 3, title: "Kedarnath to Sonprayag — 16 km trek down + drive", entries: [{ text: "4 AM darshan, Abhishek and Bhairav Temple visit (0.5 km)." }, { text: "After breakfast, descend to Gaurikund in 5–6 hours." }, { text: "Shared jeep to Sonprayag. Dinner and overnight at the Sonprayag hotel." }] },
        { day: 4, title: "Sonprayag to Haridwar / Rishikesh — 220 km, 8–9 hrs", entries: [{ text: "After breakfast, drive back to Haridwar / Rishikesh." }, { text: "Reach by 6–7 PM. Tour ends with blessings." }] },
      ],
      costExcludes: HIMALAYAN_TREK_EXCLUSIONS,
      transportModes: TRANSPORT_BY_GROUP_SIZE,
      cancellationPolicy: TIERED_CANCELLATION_POLICY,
      confirmationPolicy: CONFIRMATION_POLICY,
      contactNumbers: TRIP_CONTACT_NUMBERS,
      thingsToCarry: HIMALAYAN_TREK_PACKING_LIST.flatMap((g) => g.items),
      rentalGear: TREK_RENTAL_GEAR,
      thingsToRemember: TRIP_GROUND_RULES,
      gallery: [
        { url: "/Trips_gallery/Kedarnath/IMG_1463.jpg" },
        { url: "/Trips_gallery/Kedarnath/IMG_1468.jpg" },
        { url: "/Trips_gallery/Kedarnath/IMG_1471.jpg" },
        { url: "/Trips_gallery/Kedarnath/IMG_1668.jpg" },
        { url: "/Trips_gallery/Kedarnath/IMG_1771.jpg" },
        { url: "/Trips_gallery/Kedarnath/IMG_1803.jpg" },
        { url: "/Trips_gallery/Kedarnath/IMG_1851.jpg" },
        { url: "/Trips_gallery/Kedarnath/IMG_1946.jpg" },
        { url: "/Trips_gallery/Kedarnath/IMG_8955.jpg" },
      ],
      relatedSlugs: ["kedarnath-badrinath", "char-dham-yatra", "chopta-tungnath-trek"],
    }
  ),

  toListingItem(
    {
      name: "Kedarnath Badrinath",
      slug: "kedarnath-badrinath",
      duration: "4N/5D",
      heroImage: "/Trips_gallery/Badrinath/IMG_2170.jpg",
      tagline: "Shiva & Vishnu — the Do Dham Yatra of Kedarnath and Badrinath in 5 Days / 4 Nights.",
    },
    {
      heroImages: [
        "/Trips_gallery/Badrinath/IMG_2154.jpg",
        "/Trips_gallery/Badrinath/IMG_2165.jpg",
        "/Trips_gallery/Kedarnath/IMG_1771.jpg",
      ],
      region: "Rudraprayag & Chamoli District, Uttarakhand",
      startLocation: "Haridwar / Rishikesh",
      endLocation: "Haridwar / Rishikesh",
      difficulty: "Moderate",
      price: 14999,
      months: ["May", "Jun", "Sep", "Oct"],
      themes: ["Pilgrimage", "Snow", "Meadow"],
      category: "Backpacking Trip",
      detailsPath: "/trips/backpacking/kedarnath-badrinath",
      alternateNames: ["Kedarnath Badrinath Yatra", "Do Dham Yatra", "Kedarnath", "Badrinath", "Kedar"],
      altitude: "11,755 ft / 3,583 m (Kedarnath) & 10,279 ft / 3,133 m (Badrinath)",
      minAge: 1,
      intro:
        "Kedarnath Badrinath together form the most sacred Do Dham Yatra of Uttarakhand and a major part of the Char Dham Yatra. Kedarnath is dedicated to Lord Shiva and sits at the head of the Mandakini River at 11,755 ft, reached by a 16 km trek each way from Gaurikund. Badrinath is dedicated to Lord Vishnu, on the banks of the Alaknanda River at 10,279 ft, between the Nar and Narayan peaks — reached by direct road with no trek. Together they represent the perfect balance of Shaiva and Vaishnava faith, over 5 Days / 4 Nights from Haridwar or Rishikesh.",
      highlights: [
        "12 Jyotirlinga Kedarnath darshan",
        "Badrinath Dham (Char Dham)",
        "Bhairav Temple",
        "Bhim Shila",
        "Mana — last village of India",
        "Tapt Kund hot spring",
        "Charan Paduka",
      ],
      usps: [
        {
          title: "Adventure and easy devotion, together",
          description: "Kedarnath offers the thrill of a Himalayan trek and raw mountain beauty, while Badrinath offers peaceful darshan with the hot water Tapt Kund, Mana village and Himalayan views — one journey, two very different experiences.",
        },
        {
          title: "The most sacred Do Dham of Uttarakhand",
          description: "Shiva at Kedarnath and Vishnu at Badrinath — devotees believe darshan of Kedarnath must be followed by Badrinath to complete the yatra.",
        },
        {
          title: "Suited to families and first-timers",
          description: "Badrinath needs no trekking fitness at all, while Kedarnath's 16 km trail is fully paved with tea stalls and medical camps along the way, or covered by pony, palki or helicopter.",
        },
      ],
      idealFor: "Do Dham yatris, Shiva & Vishnu devotees, family pilgrims and Himalayan travelers.",
      differentiators: [
        "Base village: Sonprayag / Gaurikund for Kedarnath, Mana Village for Badrinath",
        "Trek distance: 32 km round trip for Kedarnath (16 km one side from Gaurikund); Badrinath has no trek — direct road till temple, just a 0.5 km walk",
        "Highest point: Kedarnath Temple (11,755 ft) and Bhairavnath Temple (12,000 ft)",
        "Best season: May–June and September–October",
        "Winter: both temples closed November to April — Kedarnath idol shifts to Ukhimath Omkareshwar Temple, Badrinath idol shifts to Joshimath",
        "Monsoon: July–August is open but risky, with landslides on both routes — avoid if possible",
      ],
      importantNote:
        "Both temples remain open from May to November and close on Bhai Dooj in November due to heavy snowfall. In winter, both areas get 15–20 feet of snow — the Kedarnath idol is shifted to Ukhimath Omkareshwar Temple and the Badrinath idol to Joshimath Narsingh Temple, where winter puja continues for six months. Uttarakhand Yatra e-pass registration is mandatory for every pilgrim on both Dhams, and you must carry a valid Aadhaar Card or Passport.",
      destinationHighlights: [
        {
          name: "Kedarnath",
          blurb: "One of the 12 Jyotirlingas and first among the Panch Kedar, at 11,755 ft at the head of the Mandakini River. Believed to be built by the Pandavas and revived by Adi Shankaracharya, whose Samadhi sits behind the temple. In the 2013 flood, the temple stood untouched behind the Bhim Shila rock that diverted the water — considered a divine miracle.",
        },
        {
          name: "Badrinath",
          blurb: "One of the Char Dham, 108 Divya Desams and Panch Badri, at 10,279 ft on the banks of the Alaknanda River between the Nar and Narayan peaks. The black stone idol of Vishnu was found by Adi Shankaracharya in the Alaknanda and established here in the 8th century. Includes a holy dip in the Tapt Kund hot spring (45°C even in sub-zero cold) and a visit to Mana — the last village of India.",
        },
      ],
      priceNote: "Starting ₹14,999 + 5% GST, ex-Haridwar / Rishikesh.",
      itinerary: [
        {
          day: 1,
          title: "Haridwar / Rishikesh to Sonprayag / Guptakashi",
          entries: [
            { text: "220 km, 8-9 hrs. Morning 5 AM pickup from Haridwar / Rishikesh." },
            { text: "Drive via Devprayag, Srinagar, Rudraprayag and Guptkashi." },
            { text: "Evening reach Sonprayag. Dinner and overnight stay at hotel." },
          ],
        },
        {
          day: 2,
          title: "Sonprayag to Kedarnath",
          entries: [
            { text: "5 km drive + 16 km trek. 4 AM wake up, take a local shared jeep to Gaurikund (5 km)." },
            { text: "Start the 16 km trek from Gaurikund to Kedarnath (6-8 hrs)." },
            { text: "Reach Kedarnath by evening, evening Aarti darshan." },
            { text: "Overnight stay at Kedarnath — tent / lodge, sharing." },
          ],
        },
        {
          day: 3,
          title: "Kedarnath to Badrinath / Joshimath",
          entries: [
            { text: "16 km trek down + 200 km drive. 4 AM morning darshan, Abhishek, and a visit to Bhairav Temple (0.5 km hike)." },
            { text: "After breakfast, start the descent to Gaurikund (5-6 hrs)." },
            { text: "Take a shared jeep to Sonprayag and pick up your luggage." },
            { text: "Drive to Badrinath via the Chopta / Joshimath route (7-8 hrs drive)." },
            { text: "Late night reach Pipalkoti / Joshimath / Badrinath. Dinner and overnight stay." },
          ],
        },
        {
          day: 4,
          title: "Badrinath Darshan to Pipalkoti / Rudraprayag",
          entries: [
            { text: "160 km. Early morning Tapt Kund snan and Badrinath Dham darshan." },
            { text: "Visit Mana Village — last village of India — Bhim Pul, Saraswati River and Vyas Gufa." },
            { text: "After darshan, drive back to Pipalkoti / Pandukeshwar." },
            { text: "Enroute visit Vishnuprayag Sangam and Narsingh Temple, Joshimath." },
            { text: "Dinner and overnight stay at hotel." },
          ],
        },
        {
          day: 5,
          title: "Pipalkoti / Pandukeshwar to Haridwar / Rishikesh",
          entries: [
            { text: "250 km, 9-10 hrs. After breakfast, drive back to Haridwar / Rishikesh." },
            { text: "Enroute visit Karnaprayag, Nandprayag, Devprayag Sangam and Dhari Devi Temple." },
            { text: "Reach Haridwar / Rishikesh by 7-8 PM. Tour ends with the blessings of Do Dham." },
          ],
        },
      ],
      costIncludes: [
        "Transportation: Haridwar to Haridwar by Tempo Traveller / Ertiga / Dzire as per group size — all transfers and sightseeing as per itinerary",
        "Accommodation: 4 nights total — 2 nights Sonprayag / Sitapur, 1 night Badrinath / Joshimath / Pandukeshwar, 1 night Rudraprayag / Pandukeshwar, hotels with attached washroom (Kedarnath night is a tent / dormitory stay adjusted against the Sonprayag hotel)",
        "Meal plan: MAP — 4 breakfasts and 4 dinners (veg only), Day 1 dinner to Day 5 breakfast; basic meals at Kedarnath top",
        "Driver allowance, toll, parking and fuel charges, driver night charges",
        "Kedarnath Badrinath Yatra support staff at stays",
        "First aid kit and oxygen support at hotel",
      ],
      costExcludes: [
        "Yatra registration — must be done online by yourself (free)",
        "Govt. local jeep: Sonprayag to Gaurikund to Sonprayag, ₹50-60 per side per person (shared) — mandatory",
        "Pony / palki / pitthu / helicopter tickets for Kedarnath — as per actual cost at spot",
        "VIP darshan, pooja samagri and any special darshan tickets for Kedarnath and Badrinath Temple",
        "Lunch, personal expenses, tea, snacks, mineral water and porter charges",
        "Room heater if required at Badrinath / Joshimath (per night extra)",
        "At Kedarnath top stay — if you take a helicopter same-day return, the top stay is unused and non-refundable",
        "Anything not mentioned in inclusions",
        "5% GST extra",
      ],
      eligibilityCriteria: [
        { icon: "User", text: "No official age limit for either Dham. Recommended 10-65 years for Kedarnath trekking; Badrinath suits all ages, 1-80 years, as there is no trek" },
        { icon: "Mountain", text: "Highest point: Kedarnath Temple at 11,755 ft; Badrinath at 10,279 ft with direct road access" },
        { icon: "Footprints", text: "Children below 10 and elders above 65 are recommended pony or helicopter for Kedarnath; Badrinath can be done by car directly at any age" },
        { icon: "Stethoscope", text: "Not recommended for the Kedarnath trek if you have severe heart disease, high asthma, severe knee problems or very high BP — consult a doctor and opt for helicopter" },
      ],
      fitnessCriteria: [
        { icon: "Footprints", text: "For Kedarnath: able to walk 16 km in a day on a steep incline" },
        { icon: "Activity", text: "For Badrinath: no walking fitness required — only a 500m walk from parking to temple" },
        { icon: "TrendingUp", text: "Start preparing 2 weeks before the yatra for Kedarnath — walk 4-5 km daily and practice stairs; no special preparation is needed for Badrinath" },
      ],
      howToReach: {
        intro: "The Yatra starts and ends at Haridwar / Rishikesh. Our pickup is from Haridwar / Rishikesh at 5:30 AM on Day 1.",
        air: {
          summaryLabel: "Nearest Airport",
          summary: "Jolly Grant Airport, Dehradun (DED)",
          detail: "35 km from Rishikesh with daily flights from Delhi, Mumbai and Bangalore. From the airport, take a taxi to Rishikesh, about 1 hour.",
        },
        train: {
          summaryLabel: "Nearest Railway Station",
          summary: "Haridwar Junction (HW)",
          detail: "Well connected to Delhi (6 hrs), Mumbai, Kolkata and Lucknow. From Haridwar to Rishikesh is 25 km by auto or bus.",
        },
        road: {
          summaryLabel: "Route",
          summary: "Delhi to Haridwar / Rishikesh by NH334",
          detail: "Daily Volvo buses run from Delhi ISBT Kashmiri Gate to Rishikesh / Haridwar, 6-7 hours, with overnight buses available.",
          route: ["Haridwar / Rishikesh", "Sonprayag", "Gaurikund", "Kedarnath", "Badrinath / Joshimath", "Haridwar / Rishikesh"],
          facts: [
            { label: "Total Distance", value: "~600 km by road + 32 km trek (Kedarnath round trip)" },
            { label: "Duration", value: "5 Days / 4 Nights" },
          ],
        },
        pickup: {
          point: "Haridwar / Rishikesh",
          time: "5:30 AM, Day 1",
          dropPoint: "Haridwar / Rishikesh",
          dropTime: "7-8 PM, Day 5",
          note: "Kedarnath: drive to Sonprayag (220 km), local jeep to Gaurikund (5 km), then a 16 km trek one side, or helicopter from Phata / Sersi / Sitapur. Badrinath: direct road till temple parking, only a 500m walk — no trek.",
        },
      },
      faqs: [
        {
          title: "What is the total distance and trek for Kedarnath Badrinath?",
          description: "Total driving is approx 600 km from Haridwar. The Kedarnath trek is 16 km one side from Gaurikund to the temple, plus a 5 km jeep ride Sonprayag to Gaurikund. Badrinath has direct road till the temple, only a 500m walk from parking.",
        },
        {
          title: "How many days are required for Kedarnath Badrinath from Haridwar?",
          description: "Minimum 5 Days / 4 Nights from Haridwar / Rishikesh is required — 4 days is very hectic. Day 1 Haridwar to Sonprayag, Day 2 trek to Kedarnath, Day 3 trek down and drive to Badrinath, Day 4 Badrinath darshan and return to Rudraprayag, Day 5 back to Haridwar.",
        },
        {
          title: "Is the Kedarnath Badrinath trek difficult?",
          description: "Kedarnath is moderate to difficult — fully paved but steep; any healthy person can do it. Badrinath is very easy, no trek, suitable for all ages, elders and children. Elders are advised to take pony or helicopter for Kedarnath.",
        },
        {
          title: "How to book a helicopter for Kedarnath Badrinath?",
          description: "Helicopter is only for Kedarnath, not Badrinath. Booking is only through the official IRCTC Heli Yatra website. Badrinath is by road only, no helicopter needed.",
        },
        {
          title: "Is yatra registration mandatory for both?",
          description: "Yes, Uttarakhand Govt. yatra registration is mandatory for every pilgrim for both Dhams. It's free to register, and the same registration works for Kedarnath and Badrinath.",
        },
        {
          title: "What is the best time to visit Kedarnath Badrinath?",
          description: "May to June and September to October are best for both. July-August is monsoon and risky due to landslides. Both temples open in May and close in November on Bhai Dooj.",
        },
        {
          title: "Where to stay in Kedarnath Badrinath?",
          description: "At Sonprayag / Pipalkoti / Joshimath — good hotels with attached washroom are available. At Kedarnath top — only basic tents / GMVN with shared washroom. At Badrinath — good hotels, GMVN and ashrams with attached washroom.",
        },
        {
          title: "Is there network / ATM at Kedarnath Badrinath?",
          description: "At Kedarnath, only Jio and BSNL work till Sonprayag, with no network on the trek or at the top. At Badrinath, Jio, BSNL and Airtel work well. Last ATM for Kedarnath is at Guptkashi / Sonprayag, and for Badrinath at Joshimath — carry cash for both.",
        },
        {
          title: "Can we do Kedarnath Badrinath in one day?",
          description: "No. Kedarnath itself needs a minimum of 2 days. Even by helicopter, the Do Dham needs a minimum of 3 days.",
        },
        {
          title: "What to carry for Kedarnath Badrinath?",
          description: "A heavy woollen jacket, gloves, cap, thermal, raincoat, trekking shoes, torch, power bank, personal medicines, dry fruits, water bottle, and a valid Aadhaar Card, mandatory for both Dhams.",
        },
        {
          title: "Is VIP darshan available in Kedarnath Badrinath?",
          description: "No official VIP darshan at Kedarnath — a special pooja slip can be taken from the temple committee. At Badrinath, VIP / special pooja tickets are available from the temple committee counter.",
        },
        {
          title: "What is the age limit for Kedarnath Badrinath Yatra?",
          description: "No official age limit. Kedarnath is recommended for 10 to 65 years. Badrinath suits all ages from 1 to 80 years. Children and senior citizens should take a helicopter or pony for Kedarnath.",
        },
      ],
      transportModes: TRANSPORT_BY_GROUP_SIZE,
      cancellationPolicy: TIERED_CANCELLATION_POLICY,
      confirmationPolicy: CONFIRMATION_POLICY,
      contactNumbers: TRIP_CONTACT_NUMBERS,
      thingsToCarry: HIMALAYAN_TREK_PACKING_LIST.flatMap((g) => g.items),
      thingsToRemember: TRIP_GROUND_RULES,
      gallery: [
        { url: "/Trips_gallery/Kedarnath/IMG_1463.jpg" },
        { url: "/Trips_gallery/Kedarnath/IMG_1468.jpg" },
        { url: "/Trips_gallery/Kedarnath/IMG_1471.jpg" },
        { url: "/Trips_gallery/Kedarnath/IMG_1668.jpg" },
        { url: "/Trips_gallery/Kedarnath/IMG_1771.jpg" },
        { url: "/Trips_gallery/Kedarnath/IMG_1803.jpg" },
        { url: "/Trips_gallery/Kedarnath/IMG_1851.jpg" },
        { url: "/Trips_gallery/Kedarnath/IMG_1946.jpg" },
        { url: "/Trips_gallery/Kedarnath/IMG_8955.jpg" },
        { url: "/Trips_gallery/Badrinath/IMG_2149.jpg" },
        { url: "/Trips_gallery/Badrinath/IMG_2154.jpg" },
        { url: "/Trips_gallery/Badrinath/IMG_2165.jpg" },
        { url: "/Trips_gallery/Badrinath/IMG_2170.jpg" },
        { url: "/Trips_gallery/Badrinath/IMG_2175.jpg" },
        { url: "/Trips_gallery/Badrinath/IMG_2181.jpg" },
        { url: "/Trips_gallery/Badrinath/IMG_2182.jpg" },
      ],
      relatedSlugs: ["kedarnath-yatra", "char-dham-yatra", "chopta-tungnath-trek"],
    }
  ),

  toListingItem(
    {
      name: "Kedarnath Badrinath with Tungnath",
      slug: "kedarnath-badrinath-tungnath",
      duration: "5N/6D",
      heroImage: "/Trips_gallery/Badrinath/IMG_2154.jpg",
      tagline: "The complete Do Dham Yatra combined with Himalayan trekking — Kedarnath, Tungnath and Badrinath in one 6-day journey.",
    },
    {
      region: "Rudraprayag & Chamoli District, Uttarakhand",
      startLocation: "Haridwar / Rishikesh",
      endLocation: "Haridwar / Rishikesh",
      difficulty: "Moderate to Difficult",
      price: null,
      months: ["May", "Jun", "Sep", "Oct"],
      themes: ["Pilgrimage", "Snow", "Meadow"],
      category: "Backpacking Trip",
      detailsPath: "/trips/backpacking/kedarnath-badrinath-tungnath",
      alternateNames: [
        "Kedarnath Badrinath Tungnath Yatra",
        "Do Dham with Tungnath",
        "Kedarnath Tungnath Badrinath",
        "Panch Kedar Char Dham",
        "Kedarnath",
        "Badrinath",
        "Tungnath",
      ],
      altitude: "11,755 ft / 3,583 m (Kedarnath), 12,073 ft / 3,680 m (Tungnath), 12,750 ft / 3,886 m (Chandrashila) & 10,279 ft / 3,133 m (Badrinath)",
      minAge: 1,
      intro:
        "Kedarnath Badrinath with Tungnath is the most complete Do Dham Yatra combined with Himalayan trekking, covering 3 of the most sacred temples of Uttarakhand. Located in Rudraprayag and Chamoli districts, this yatra takes you from 11,755 ft Kedarnath — the head of the Mandakini River, to 12,073 ft Tungnath — the world's highest Shiva temple, to 10,279 ft Badrinath — on the banks of the Alaknanda River surrounded by the Nar-Narayan mountains, over 6 Days / 5 Nights from Haridwar or Rishikesh.",
      highlights: [
        "12 Jyotirlinga Kedarnath darshan",
        "Highest Shiva Temple Tungnath (Panch Kedar)",
        "Chandrashila Summit 360° Himalayan view",
        "Badrinath Dham (Char Dham)",
        "Bhairav Temple",
        "Bhim Shila",
        "Mana — last village of India",
        "Tapt Kund hot spring",
      ],
      usps: [
        {
          title: "Three sacred journeys, one yatra",
          description: "Adventure of the Kedarnath trek, the thrill of the Chandrashila summit, and the peace of Badrinath darshan — all in a single, well-paced 6-day circuit.",
        },
        {
          title: "Higher than Kedarnath itself",
          description: "Chandrashila Summit at 12,750 ft is the highest point of the entire yatra, rewarding you with a 360° view of Nanda Devi, Trishul, Chaukhamba and Kedar Dome.",
        },
        {
          title: "Shiva and Vishnu, in full",
          description: "Two of the Panch Kedar shrines (Kedarnath and Tungnath) plus one of the Char Dham (Badrinath) — the most complete Shaiva-Vaishnava circuit possible in one trip.",
        },
      ],
      idealFor: "Do Dham yatris, Panch Kedar lovers, Shiva & Vishnu devotees, trekking lovers and Himalayan travelers.",
      differentiators: [
        "Base village: Sonprayag / Gaurikund for Kedarnath, Chopta for Tungnath, Mana for Badrinath",
        "Trek distance: 32 km round trip for Kedarnath (16 km one side from Gaurikund) + 7 km round trip for Tungnath-Chandrashila (3.5 km one side from Chopta); Badrinath has no trek — just a 0.5 km walk",
        "Highest point: Chandrashila Summit (12,750 ft) — higher than Kedarnath itself",
        "Best season: May–June and September–October for the clearest views",
        "Winter: Kedarnath and Badrinath closed November to April due to heavy snow; Tungnath closed with the idol shifted to Makku, though Chandrashila can be done as a snow trek in Jan–Feb with a guide",
        "Monsoon: July–August is open but risky, with landslides on the Kedarnath route and heavy fog at Chopta — avoid if possible",
      ],
      importantNote:
        "All three temples remain open from May to November and close around Bhai Dooj due to heavy snowfall. In winter, the Kedarnath idol is shifted to Ukhimath Omkareshwar Temple, the Tungnath idol to Makku, and the Badrinath idol to Joshimath Narsingh Temple, where winter puja continues for six months. Uttarakhand Yatra e-pass registration is mandatory for every pilgrim across all three Dhams — the same registration works for Kedarnath, Tungnath and Badrinath — and you must carry a valid Aadhaar Card or Passport.",
      destinationHighlights: [
        {
          name: "Kedarnath",
          blurb: "The first among the 12 Jyotirlingas and the Panch Kedar, at 11,755 ft at the head of the Mandakini River. Reached by a 16 km trek from Gaurikund through Jungle Chatti, Bheembali and Linchauli, past waterfalls and Himalayan ranges. Believed to be built by the Pandavas and revived by Adi Shankaracharya.",
        },
        {
          name: "Tungnath & Chandrashila",
          blurb: "Tungnath, at 12,073 ft, is the highest of the Panch Kedar and the world's highest Shiva temple, where Shiva's arms are worshipped — a short 3.5 km trek from Chopta, the 'Mini Switzerland of Uttarakhand'. An extra 1 km climb leads to Chandrashila Summit at 12,750 ft, with a 360° view of Nanda Devi, Trishul, Chaukhamba and Kedar Dome.",
        },
        {
          name: "Badrinath",
          blurb: "One of the Char Dham and 108 Divya Desams, at 10,279 ft on the banks of the Alaknanda River between the Nar and Narayan peaks. Direct road access till the temple parking, just a 500m walk. Includes a holy dip in the Tapt Kund hot spring and a visit to Mana — the last village of India, Bhim Pul and Vyas Gufa.",
        },
      ],
      priceNote: "Ex-Haridwar / Rishikesh. Contact us for current batch pricing.",
      itinerary: [
        {
          day: 1,
          title: "Haridwar / Rishikesh to Sonprayag / Guptkashi",
          entries: [
            { text: "220 km, 8-9 hrs. Morning 5 AM pickup from Haridwar / Rishikesh." },
            { text: "Drive via Devprayag, Srinagar, Rudraprayag and Guptkashi." },
            { text: "Evening reach Sonprayag / Guptkashi. Dinner and overnight stay at hotel." },
          ],
        },
        {
          day: 2,
          title: "Sonprayag to Kedarnath",
          entries: [
            { text: "5 km drive + 16 km trek. 4 AM wake up, take a local shared jeep to Gaurikund (5 km)." },
            { text: "Start the 16 km trek from Gaurikund to Kedarnath (6-8 hrs)." },
            { text: "Reach Kedarnath by evening, evening Aarti darshan." },
            { text: "Overnight stay at Kedarnath — tent / lodge, sharing." },
          ],
        },
        {
          day: 3,
          title: "Kedarnath to Chopta",
          entries: [
            { text: "16 km trek down + 75 km drive. 4 AM morning darshan, Abhishek, and a visit to Bhairav Temple (0.5 km hike)." },
            { text: "After breakfast, descend to Gaurikund (5-6 hrs)." },
            { text: "Take a shared jeep to Sonprayag and pick up your luggage." },
            { text: "Drive to Chopta, the 'Mini Switzerland of Uttarakhand' (2.5-3 hrs)." },
            { text: "Dinner and overnight stay at Sari — hotel / camp stay." },
          ],
        },
        {
          day: 4,
          title: "Sari to Chopta – Tungnath – Chandrashila – Badrinath / Joshimath",
          entries: [
            { text: "Early morning 5 AM trek start — Chopta to Tungnath (3.5 km, 2 hrs)." },
            { text: "Tungnath darshan — the world's highest Shiva temple, one of the Panch Kedar." },
            { text: "Optional trek to Chandrashila Summit (1 km, 45 mins) — 360° view of Chaukhamba, Nanda Devi and Trishul." },
            { text: "Trek down to Chopta and have breakfast." },
            { text: "Drive to Badrinath via Gopeshwar and Joshimath (180 km, 7-8 hrs)." },
            { text: "Evening reach Badrinath / Joshimath. Dinner and overnight stay." },
          ],
        },
        {
          day: 5,
          title: "Badrinath Darshan to Rudraprayag / Pandukeshwar",
          entries: [
            { text: "160 km, 7-8 hrs. Early morning Tapt Kund snan and Badrinath Dham darshan." },
            { text: "Visit Mana Village — last village of India — Bhim Pul, Saraswati River, Vyas Gufa and Ganesh Gufa." },
            { text: "After darshan, drive to Rudraprayag / Srinagar." },
            { text: "Enroute visit Vishnuprayag Sangam and Narsingh Temple, Joshimath." },
            { text: "Dinner and overnight stay at Rudraprayag / Srinagar hotel." },
          ],
        },
        {
          day: 6,
          title: "Rudraprayag / Pandukeshwar to Haridwar / Rishikesh",
          entries: [
            { text: "165 km, 6-7 hrs. After breakfast, drive back to Haridwar / Rishikesh." },
            { text: "Enroute visit Karnaprayag, Nandprayag, Devprayag Sangam and Dhari Devi Temple." },
            { text: "Reach Haridwar / Rishikesh by 5-6 PM. Tour ends with the blessings of Jai Badri Kedarnath." },
          ],
        },
      ],
      costIncludes: [
        "Transportation: Haridwar / Rishikesh to Haridwar / Rishikesh by Tempo Traveller / Ertiga / Dzire / Innova as per group size",
        "Accommodation: 5 nights total — 1 night Sonprayag (hotel with attached washroom), 1 night Kedarnath (tent / basic, sharing, no attached washroom at top), 1 night Sari (Swiss tent / cottage with attached washroom), 1 night Badrinath / Pandukeshwar (hotel with attached washroom), 1 night Rudraprayag / Pandukeshwar (hotel with attached washroom)",
        "Meal plan: MAP — 5 breakfasts and 5 dinners (veg only), Day 1 dinner to Day 6 breakfast; lunch not included",
        "Driver allowance, toll, parking and fuel charges, driver night stay",
        "Kedarnath Badrinath Tungnath Yatra support team at all stays for guidance",
        "First aid kit and oxygen can on demand in vehicle",
      ],
      costExcludes: [
        "Yatra registration — must be done online by yourself (free)",
        "Govt. local jeep: Sonprayag to Gaurikund to Sonprayag, ₹50-60 per side per person (shared) — mandatory",
        "Pony / palki / pitthu / helicopter tickets for Kedarnath, and horse for Tungnath — as per actual cost at spot",
        "VIP darshan, special pooja, Abhishek tickets and pooja samagri at Kedarnath and Badrinath",
        "Lunch, personal expenses, tea, snacks, mineral water and beverages",
        "Room heater if required at Sonprayag / Chopta / Joshimath",
        "Cable car / chair car at Auli if added, and extra sightseeing",
        "Anything not mentioned in inclusions",
        "5% GST extra",
      ],
      eligibilityCriteria: [
        { icon: "User", text: "No official age limit for any of the three Dhams. Badrinath suits all ages 1-80 years; Tungnath-Chandrashila is recommended 8-65 years; Kedarnath is recommended 10-65 years" },
        { icon: "Mountain", text: "Chandrashila Summit at 12,750 ft is the highest point of the yatra — higher than Kedarnath itself" },
        { icon: "Footprints", text: "Children below 10 and elders above 65 are recommended pony, pitthu or helicopter for Kedarnath, and horse or pitthu for Tungnath; Badrinath needs no assistance" },
        { icon: "Stethoscope", text: "Not recommended for the Kedarnath trek if you have severe heart disease, high asthma, severe knee problems or very high BP — consult a doctor and opt for helicopter" },
      ],
      fitnessCriteria: [
        { icon: "Footprints", text: "For Kedarnath: able to walk 16 km in a day on a steep incline" },
        { icon: "Activity", text: "For Tungnath-Chandrashila: able to walk 3.5 km uphill; those with knee pain can take a horse or pitthu from Chopta" },
        { icon: "TrendingUp", text: "For Badrinath: no fitness required — only a 500m walk from parking to temple" },
        { icon: "Wind", text: "Start preparing 2 weeks before the yatra — walk 4-5 km daily, practice stairs, and avoid smoking and alcohol during the yatra due to low oxygen above 12,000 ft" },
      ],
      howToReach: {
        intro: "The Yatra starts and ends at Haridwar / Rishikesh. Our pickup is from Haridwar / Rishikesh at 5:30 AM on Day 1.",
        air: {
          summaryLabel: "Nearest Airport",
          summary: "Jolly Grant Airport, Dehradun (DED)",
          detail: "35 km from Rishikesh, about 260 km from Badrinath, with daily flights from Delhi, Mumbai and Bangalore. From the airport, take a taxi to Rishikesh, about 1 hour.",
        },
        train: {
          summaryLabel: "Nearest Railway Station",
          summary: "Rishikesh (200 km) / Haridwar Junction (220 km)",
          detail: "Haridwar is well connected to Delhi (6 hrs), Mumbai, Kolkata and Lucknow. From Haridwar to Rishikesh is 25 km by auto or bus.",
        },
        road: {
          summaryLabel: "Route",
          summary: "Delhi to Haridwar / Rishikesh by NH334",
          detail: "Daily Volvo buses run from Delhi ISBT Kashmiri Gate to Rishikesh / Haridwar, 6-7 hours, with overnight buses available.",
          route: ["Haridwar / Rishikesh", "Sonprayag", "Gaurikund", "Kedarnath", "Chopta", "Tungnath", "Badrinath / Joshimath", "Haridwar / Rishikesh"],
          facts: [
            { label: "Total Distance", value: "~1,000 km by road + 39 km trek (Kedarnath + Tungnath-Chandrashila round trips)" },
            { label: "Duration", value: "6 Days / 5 Nights" },
          ],
        },
        pickup: {
          point: "Haridwar / Rishikesh",
          time: "5:30 AM, Day 1",
          dropPoint: "Haridwar / Rishikesh",
          dropTime: "5-6 PM, Day 6",
          note: "Kedarnath: drive to Sonprayag (220 km), local jeep to Gaurikund (5 km), then a 16 km trek one side, or helicopter from Phata / Sersi / Sitapur. Tungnath: 180 km drive to Chopta, then a 3.5 km trek one side (+1 km to Chandrashila). Badrinath: direct road till temple parking, only a 500m walk — no trek.",
        },
      },
      faqs: [
        {
          title: "What is the total trek distance of this yatra?",
          description: "Kedarnath: 16 km one side from Gaurikund plus a 5 km jeep ride Sonprayag to Gaurikund. Tungnath: 3.5 km one side from Chopta plus 1 km extra to Chandrashila. Badrinath: no trek, only a 0.5 km walk from parking. Total trekking across the trip is around 40 km.",
        },
        {
          title: "How many days are required for Kedarnath Badrinath with Tungnath from Haridwar?",
          description: "Minimum 6 Days / 5 Nights from Haridwar / Rishikesh is required — 1 day Haridwar to Sonprayag, 1 day Kedarnath trek up, 1 day trek down plus drive to Chopta, 1 day Tungnath trek plus drive to Badrinath, 1 day Badrinath darshan and drive to Pandukeshwar, 1 day return to Haridwar.",
        },
        {
          title: "Is this yatra difficult?",
          description: "Mixed difficulty. Badrinath is very easy with direct road access. Tungnath-Chandrashila is easy to moderate — 3.5 km steep but short. Kedarnath is moderate to difficult at 16 km one side. Elders can skip the Kedarnath trek and take a helicopter, and do Badrinath by car.",
        },
        {
          title: "How to book a helicopter for Kedarnath?",
          description: "Helicopter booking for Kedarnath is only done through the official IRCTC Heli Yatra website, opening 1 month before. No agent booking. Many people take the helicopter for Kedarnath only and do Tungnath and Badrinath by road.",
        },
        {
          title: "Is yatra registration mandatory?",
          description: "Yes, Uttarakhand Govt. Yatra registration is mandatory for every pilgrim, for all three Dhams. One registration is valid for Kedarnath, Tungnath and Badrinath.",
        },
        {
          title: "What is the best time to visit Kedarnath Badrinath with Tungnath?",
          description: "May to June and September to October are best for all three. July-August is monsoon — risky for landslides on the Kedarnath route, and Chopta becomes fully foggy with no views. Temples open in May and close in November on Bhai Dooj.",
        },
        {
          title: "Where to stay in this yatra?",
          description: "At Sonprayag: good hotels with attached washroom. At Kedarnath top: only basic tents / GMVN with shared washroom and blankets, no luxury. At Chopta: Swiss tents, cottages and homestays with good food. At Badrinath: good hotels, GMVN and budget dharamshalas. At Joshimath / Rudraprayag: decent hotels.",
        },
        {
          title: "Is there network / ATM in this circuit?",
          description: "Jio and BSNL work till Sonprayag, Chopta and Badrinath but with low speed. No network during the Kedarnath trek or at the temple top. Last good ATM is at Guptkashi, Ukhimath, Gopeshwar and Joshimath — carry ₹10,000-15,000 cash, as there's no UPI at Kedarnath top.",
        },
        {
          title: "Can we do Kedarnath Badrinath Tungnath in 5 days?",
          description: "It is possible in 5 days if you are fit and take a private car, but it will be very hectic. A 6 Days / 5 Nights itinerary is recommended for comfortable yatra with proper darshan and rest.",
        },
        {
          title: "What to carry for this yatra?",
          description: "A heavy woollen jacket, gloves, cap, thermal wear, raincoat, trekking shoes with grip, torch, power bank, personal medicines, Diamox for altitude, dry fruits, water bottle and a valid Aadhaar Card. For Chandrashila, carry a small stick — available at Chopta.",
        },
        {
          title: "Is VIP darshan available at Kedarnath and Badrinath?",
          description: "There is no official VIP darshan at either temple. For special pooja, you can take a slip from the temple committee office inside the temple premises. At Badrinath, morning Abhishek pooja tickets are available at the counter.",
        },
        {
          title: "What is the age limit for this yatra?",
          description: "No official age limit. Badrinath suits all ages, 1 to 80 years. Tungnath is recommended for 8 to 65 years. Kedarnath is recommended for 10 to 65 years. Children and senior citizens should take a helicopter or pony for Kedarnath, and a horse for Tungnath, and carry a medical certificate.",
        },
      ],
      transportModes: TRANSPORT_BY_GROUP_SIZE,
      cancellationPolicy: TIERED_CANCELLATION_POLICY,
      confirmationPolicy: CONFIRMATION_POLICY,
      contactNumbers: TRIP_CONTACT_NUMBERS,
      thingsToCarry: HIMALAYAN_TREK_PACKING_LIST.flatMap((g) => g.items),
      rentalGear: TREK_RENTAL_GEAR,
      thingsToRemember: TRIP_GROUND_RULES,
      gallery: [
        { url: "/Trips_gallery/Kedarnath/IMG_1463.jpg" },
        { url: "/Trips_gallery/Kedarnath/IMG_1468.jpg" },
        { url: "/Trips_gallery/Kedarnath/IMG_1471.jpg" },
        { url: "/Trips_gallery/Kedarnath/IMG_1668.jpg" },
        { url: "/Trips_gallery/Kedarnath/IMG_1771.jpg" },
        { url: "/Trips_gallery/Kedarnath/IMG_1803.jpg" },
        { url: "/Trips_gallery/Kedarnath/IMG_1851.jpg" },
        { url: "/Trips_gallery/Kedarnath/IMG_1946.jpg" },
        { url: "/Trips_gallery/Kedarnath/IMG_8955.jpg" },
        { url: "/Trips_gallery/Badrinath/IMG_2149.jpg" },
        { url: "/Trips_gallery/Badrinath/IMG_2154.jpg" },
        { url: "/Trips_gallery/Badrinath/IMG_2165.jpg" },
        { url: "/Trips_gallery/Badrinath/IMG_2170.jpg" },
        { url: "/Trips_gallery/Badrinath/IMG_2175.jpg" },
        { url: "/Trips_gallery/Badrinath/IMG_2181.jpg" },
        { url: "/Trips_gallery/Badrinath/IMG_2182.jpg" },
      ],
      relatedSlugs: ["kedarnath-badrinath", "chopta-tungnath-trek", "char-dham-yatra"],
    }
  ),
];

/**
 * Splits a one-line cost item into a bold lead and its detail, so a plain
 * string list renders in the same two-tier layout the treks use.
 * "Private vehicle — all 5 days" becomes { title, description }.
 */
function toCostItem(line: string): { title: string; description: string } {
  const match = line.match(/^(.{3,42}?)\s*[—–:-]\s+(.+)$/);
  if (match) return { title: match[1].trim(), description: match[2].trim() };

  // No natural split: lead with the first clause, keep the rest as detail.
  const comma = line.indexOf(", ");
  if (comma > 2 && comma < 42) {
    return { title: line.slice(0, comma).trim(), description: line.slice(comma + 2).trim() };
  }
  return { title: line, description: "" };
}

/** Spreads a flat carry list into three balanced columns for the essentials grid. */
function toPackingGroups(items: string[]): EquipmentGroup[] {
  if (!items.length) return [];
  const perColumn = Math.ceil(items.length / 3);
  return [0, 1, 2]
    .map((col) => items.slice(col * perColumn, (col + 1) * perColumn))
    .filter((chunk) => chunk.length > 0)
    .map((chunk, idx) => ({ category: idx === 0 ? "What to carry" : "", items: chunk }));
}

/** Keeps the timed lines intact and joins them into prose for the summary view. */
function toItineraryDays(days: TripItineraryDay[]): ItineraryDay[] {
  return days.map((day) => {
    const lines = day.entries.map((e) => (e.time ? `${e.time} — ${e.text}` : e.text));
    return {
      day: day.day,
      title: day.title,
      description: lines.join(" "),
      detailedDescription: lines.join(" "),
      entries: day.entries,
    };
  });
}

/**
 * Adapts a trip listing to the shared detail model.
 *
 * Weekend getaways, backpacking circuits and Himalayan treks are sold from
 * different catalogues but read the same on the site, so all of them render
 * through `TrekDetailView`. This is the one place that translates trip-shaped
 * data into `Trek`: nothing is invented here, and `useTrekFallbacks: false`
 * stops the resolver filling the gaps with generic Himalayan trek copy.
 */
export function tripToTrek(trip: TripListingItem): Trek {
  return {
    slug: trip.slug,
    name: trip.name,
    tagline: trip.tagline,
    price: trip.price,
    days: trip.days,
    nights: trip.nights,
    region: trip.region,
    category: trip.category,
    startLocation: trip.startLocation,
    difficulty: trip.difficulty,
    months: trip.months,
    themes: trip.themes,

    // Header
    heroImage: trip.heroImage,
    heroImages: trip.heroImages,
    detailsPath: trip.detailsPath,
    tripCode: trip.tripCode,
    availability: trip.availability,
    endLocation: trip.endLocation,
    minAge: trip.minAge,
    maxAge: trip.maxAge,
    maxGroupSize: trip.maxGroupSize,
    maxAltitude: trip.altitude,

    // Overview & about
    intro: trip.intro,
    highlights: trip.highlights,
    usps: trip.usps,
    idealFor: trip.idealFor,
    differentiators: trip.differentiators,
    importantNote: trip.importantNote,
    destinationHighlights: trip.destinationHighlights,
    sourceCaveat: trip.sourceCaveat,

    // Itinerary
    itinerary: trip.itinerary ? toItineraryDays(trip.itinerary) : undefined,

    // Eligibility & travel info
    eligibilityCriteria: trip.eligibilityCriteria,
    fitnessCriteria: trip.fitnessCriteria,
    howToReach: trip.howToReach,
    faqs: trip.faqs,
    article: trip.article,

    // Cost terms
    originalPrice: trip.originalPrice,
    inclusions: trip.costIncludes?.map(toCostItem),
    exclusions: trip.costExcludes?.map(toCostItem),
    batchDates: trip.batchDates,
    packages: trip.packages,
    priceNote: trip.priceNote,
    bookingAdvance: trip.bookingAdvance,
    bookingAdvancePct: trip.bookingAdvancePct,
    balanceDueDays: trip.balanceDueDays,
    kidsPolicy: trip.kidsPolicy,
    confirmationPolicy: trip.confirmationPolicy,

    // Essentials & logistics
    packingList: trip.thingsToCarry ? toPackingGroups(trip.thingsToCarry) : undefined,
    thingsToRemember: trip.thingsToRemember,
    transportModes: trip.transportModes,
    rentalGear: trip.rentalGear,

    // Policies & contact
    cancellationPolicyText: trip.cancellationPolicy,
    contactPhone: trip.contactPhone,
    contactNumbers: trip.contactNumbers,

    gallery: trip.gallery,
    externalReviews: trip.externalReviews,
    reviewVideos: trip.reviewVideos,

    useTrekFallbacks: false,
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

/** Every catalogued trip, across both catalogues. */
export const ALL_TRIPS: TripListingItem[] = [...WEEKEND_TRIPS, ...BACKPACKING_TRIPS];

/** Look a trip up by slug in either catalogue — used for related-trip cards. */
export function getTripBySlug(slug: string): TripListingItem | undefined {
  return ALL_TRIPS.find((t) => t.slug === slug);
}

/**
 * States the "Explore South" catalogue covers. Matched as a substring of
 * `trip.region` so a qualified region ("Wayanad, Kerala") still files south.
 */
export const SOUTH_REGIONS = [
  "Kerala",
  "Karnataka",
  "Tamil Nadu",
  "Goa",
  "Andhra Pradesh",
  "Telangana",
  "Puducherry",
];

/** Every South India trip, across both catalogues. */
export const SOUTH_TRIPS: TripListingItem[] = ALL_TRIPS.filter((trip) =>
  SOUTH_REGIONS.some((region) => trip.region.toLowerCase().includes(region.toLowerCase()))
);

/**
 * Legacy `db.ts` slugs that describe the same package as a fully-detailed trip
 * in this file. Cards for these point at the trip page so a package has one
 * canonical detail page instead of a thin duplicate on `/treks/[slug]`.
 */
export const CANONICAL_TRIP_PATHS: Record<string, string> = {
  // TREKS
  "panch-kedar-trek": "/trips/backpacking/panch-kedar-yatra",
  "yulla-kanda-trek": "/trips/weekend/yulla-kanda-trek",
  // YATRAS
  "chopta-tungnath-trek": "/trips/weekend/chopta-tungnath-trek",
  "chopta-tungnath-trek-delhi": "/trips/weekend/chopta-tungnath-trek-delhi",
  "kedarnath-yatra": "/trips/backpacking/kedarnath-yatra",
  "chardham-yatra": "/trips/backpacking/char-dham-yatra",
};

/** Free-text haystack for catalogue search: name, aliases, place and theme. */
export function tripSearchHaystack(trip: TripListingItem): string {
  return [
    trip.name,
    trip.tagline,
    trip.region,
    trip.startLocation,
    trip.endLocation,
    trip.category,
    trip.difficulty,
    trip.duration,
    ...(trip.alternateNames ?? []),
    ...trip.themes,
    ...(trip.highlights ?? []),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}
