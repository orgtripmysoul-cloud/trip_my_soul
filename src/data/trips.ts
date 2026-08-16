import type { Trek } from "@/data/db";
import {
  CONFIRMATION_POLICY,
  HIMALAYAN_TREK_EXCLUSIONS,
  HIMALAYAN_TREK_PACKING_LIST,
  PAYMENT_DETAILS_HIMALAYAN,
  PAYMENT_DETAILS_KERALA,
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

  // Other info
  cancellationPolicy?: string;
  thingsToCarry?: string[];
  thingsToRemember?: string[];

  // Media & related
  gallery?: TripGalleryImage[];
  relatedSlugs?: string[];

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
  balanceDueDays?: number;
  kidsPolicy?: string;
  paymentDetails?: {
    bank: string;
    accountName: string;
    accountNumber: string;
    ifsc: string;
    accountType: string;
    upiNote: string;
  };
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

  /* ---------------------------------------------------------------- */
  /* Short Himalayan trips — 3 days and under                          */
  /* ---------------------------------------------------------------- */

  toListingItem(
    {
      name: "Chopta & Tungnath Trek",
      slug: "chopta-tungnath-trek",
      duration: "2N/3D",
      heroImage: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1920&q=80",
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
      minAge: 8,
      availability: "Weekend batches every Friday from Delhi",
      intro:
        "The most accessible Himalayan trek in Uttarakhand and a genuine 4,000 m summit without the stress. Tungnath is the highest Shiva temple in the world, and Chandrashila above it gives a full 360° of the range.",
      highlights: [
        "Tungnath — highest Shiva temple in the world",
        "Chandrashila summit, 360° Himalayan views",
        "Deoria Tal",
        "Dhari Devi Temple",
        "Devprayag Sangam",
        "Monal birds, occasionally Himalayan Tahr",
        "Suitable for all ages — easy grade",
        "Accessible year round; moderate Dec–Feb with snowfall",
      ],
      /** The two source PDFs are the same trek from different pickup cities. */
      priceNote:
        "Same trek, two pickup points. The Delhi variant adds a Day 0 night pickup and a Day 4 early-morning drop. Both prices exclude GST.",
      packages: [
        { id: "ex-rishikesh", label: "Ex-Rishikesh — 3D/2N", price: 4999, paxLabel: "Ex-Rishikesh", vehicle: "By group size", sharing: "Triple / quad" },
        { id: "ex-delhi", label: "Ex-Delhi — adds Day 0 and Day 4", price: 6499, paxLabel: "Ex-Delhi", vehicle: "By group size", sharing: "Triple / quad" },
      ],
      itinerary: [
        { day: 0, title: "Delhi pickup — ex-Delhi variant only", entries: [{ text: "Night pickup from Kashmiri Gate or Akshardham Temple, 10–11 PM." }] },
        { day: 1, title: "Rishikesh to Sari Village", entries: [{ text: "Drive about 200 km, 6–7 hours." }, { text: "Sightseeing at Dhari Devi Temple and Devprayag Sangam." }, { text: "Check into homestay or campstay. Overnight Sari." }] },
        { day: 2, title: "Tungnath and Chandrashila", entries: [{ text: "Trek 3.5 km to Tungnath, then 1.5 km further to Chandrashila — about 5 km in total." }, { text: "Temple visit and 360° Himalayan views." }, { text: "Overnight Sari." }] },
        { day: 3, title: "Deoria Tal and return", entries: [{ text: "Trek about 1.5 km, roughly an hour, to Deoria Tal." }, { text: "Drive back to Rishikesh." }] },
        { day: 4, title: "Delhi drop — ex-Delhi variant only", entries: [{ text: "Early morning drop at Kashmiri Gate or Akshardham Temple, 4–5 AM." }] },
      ],
      costIncludes: [
        "Rishikesh to Rishikesh, or Delhi to Delhi, transport depending on variant",
        "Vegetarian meals only, from Day 1 dinner to last-day breakfast",
        "Camps or homestay accommodation, triple / quad sharing",
        "Experienced qualified guide",
        "Basic first aid",
        "Achievement certificate",
      ],
      costExcludes: [
        "Forest fees and permits",
        "Meals during transportation",
        "Personal expenses",
        "Costs from unscheduled delays such as roadblocks or landslides",
        "Porter and mule charges",
        "Backpack offloading charges",
        "Evacuation cost",
        "Anything not listed under inclusions",
      ],
      transportModes: TRANSPORT_BY_GROUP_SIZE,
      cancellationPolicy: TIERED_CANCELLATION_POLICY,
      confirmationPolicy: CONFIRMATION_POLICY,
      contactNumbers: TRIP_CONTACT_NUMBERS,
      paymentDetails: PAYMENT_DETAILS_HIMALAYAN,
      thingsToCarry: HIMALAYAN_TREK_PACKING_LIST.flatMap((g) => g.items),
      rentalGear: TREK_RENTAL_GEAR,
      thingsToRemember: TRIP_GROUND_RULES,
      relatedSlugs: ["madmaheshwar-trek", "kedarnath-yatra", "rudranath-trek"],
    }
  ),

  toListingItem(
    {
      name: "Madmaheshwar Trek",
      slug: "madmaheshwar-trek",
      duration: "2N/3D",
      heroImage: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1920&q=80",
      tagline: "A standalone run at the Madhyamaheshwar shrine at 3,490 m, Delhi to Delhi.",
    },
    {
      region: "Uttarakhand",
      startLocation: "Delhi",
      endLocation: "Delhi",
      difficulty: "Moderate",
      price: null,
      months: ["Apr", "May", "Jun", "Sep", "Oct", "Nov"],
      themes: ["Pilgrimage", "Meadow", "Forest"],
      category: "Weekend Trip",
      detailsPath: "/trips/weekend/madmaheshwar-trek",
      minAge: 12,
      intro:
        "The Madhyamaheshwar shrine at 3,490 m as a standalone short package rather than part of the longer Panch Kedar circuit. Pickup and drop at Akshardham Metro Station, Gate No. 1.",
      highlights: ["Madhyamaheshwar Temple, 3,490 m", "Budha Madhmaheshwar", "Devprayag Sangam", "Dhari Devi Temple", "Omkareshwar Temple, Ukhimath"],
      priceNote: "No rates are published in the source itinerary. Contact the trips desk for current pricing.",
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
      paymentDetails: PAYMENT_DETAILS_HIMALAYAN,
      relatedSlugs: ["three-kedar-yatra", "chopta-tungnath-trek", "panch-kedar-yatra"],
    }
  ),

  toListingItem(
    {
      name: "Yulla Kanda Trek",
      slug: "yulla-kanda-trek",
      duration: "2N/3D",
      heroImage: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=1920&q=80",
      tagline: "The world's highest Krishna temple, at 12,778 ft in Kinnaur.",
    },
    {
      region: "Himachal Pradesh",
      startLocation: "Shimla",
      endLocation: "Shimla",
      difficulty: "Moderate",
      price: null,
      months: ["May", "Jun", "Jul", "Aug", "Sep", "Oct"],
      themes: ["Pilgrimage", "Meadow", "Forest"],
      category: "Weekend Trip",
      detailsPath: "/trips/weekend/yulla-kanda-trek",
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
      paymentDetails: PAYMENT_DETAILS_HIMALAYAN,
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
  toListingItem(
    {
      name: "Kerala Special",
      slug: "kerala-special",
      duration: "4N/5D",
      heroImage: "https://images.unsplash.com/photo-1593693411515-c20261bcad6e?auto=format&fit=crop&w=1920&q=80",
      tagline: "Munnar tea country, an Alleppey houseboat night, and the Kovalam–Varkala coast.",
    },
    {
      region: "Kerala",
      startLocation: "Kochi",
      endLocation: "Trivandrum",
      difficulty: "Easy",
      price: 10500,
      months: ["Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar"],
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
      paymentDetails: PAYMENT_DETAILS_KERALA,
      relatedSlugs: ["kerala-thekkady", "kerala"],
    }
  ),
  toListingItem(
    {
      name: "Backpacking Trip Kerala",
      slug: "kerala-thekkady",
      duration: "4N/5D",
      // NB: photo-1602216050166 (used by the older "kerala" entry) now 404s on Unsplash.
      heroImage: "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1920&q=80",
      tagline: "A Kochi round trip through Munnar's tea slopes, Thekkady's spice hills and the Alleppey backwaters.",
    },
    {
      region: "Kerala",
      startLocation: "Kochi",
      endLocation: "Kochi",
      difficulty: "Easy",
      // No rates in the source PDF — renders as "Price on request" until supplied.
      price: null,
      months: ["Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar"],
      themes: ["Lakes", "Couples", "Family with Kids"],
      category: "Backpacking Trip",
      detailsPath: "/trips/backpacking/kerala-thekkady",

      contactPhone: "+91 7337475300",
      minAge: 5,
      intro:
        "A round-trip backpacking circuit from Kochi covering Munnar's tea hills, Thekkady's spice hills and Periyar wildlife area, and an overnight houseboat stay in the Alleppey backwaters, before returning to Kochi.",
      highlights: [
        "Valara & Cheeyappara Waterfalls",
        "Eravikulam National Park",
        "Mattupetty Dam & Lake",
        "Echo Point",
        "Rajamalai Garden",
        "Tata Tea Gardens",
        "Chocolate Factory",
        "Periyar National Park (Thekkady)",
        "Spice plantation tour",
        "Houseboat stay",
        "Optional Kathakali / Kalaripattu show",
      ],
      priceNote:
        "No rates are published in the source itinerary. Contact the trips desk on +91 7337475300 for current pricing.",

      itinerary: [
        {
          day: 1,
          title: "Kochi to Munnar",
          entries: [
            { text: "Arrive in Kochi and drive up to Munnar." },
            { text: "Stop at Valara and Cheeyappara Waterfalls." },
            { text: "Visit a spice plantation." },
            { text: "Optional Kathakali and Kalaripattu performance." },
            { text: "Overnight in Munnar." },
          ],
        },
        {
          day: 2,
          title: "Munnar",
          entries: [
            { text: "Eravikulam National Park — home of the Nilgiri Tahr." },
            { text: "Boat ride at Mattupetty Dam, then Echo Point." },
            { text: "Rajamalai Garden and a Tata Tea Gardens tour." },
            { text: "Chocolate factory visit." },
            { text: "Overnight in Munnar." },
          ],
        },
        {
          day: 3,
          title: "Munnar to Thekkady",
          entries: [
            { text: "Drive to Thekkady and check in." },
            { text: "Periyar National Park area — wildlife spotting, elephant rides available." },
            { text: "Afternoon spice plantation tour (optional, surcharge applies)." },
            { text: "Overnight in Thekkady." },
          ],
        },
        {
          day: 4,
          title: "Thekkady to Alleppey",
          entries: [
            { text: "Drive to Alleppey and check in to the houseboat." },
            { text: "Cruise the backwaters." },
            { text: "Kerala lunch served on board." },
            { text: "Dinner and overnight on the houseboat." },
          ],
        },
        {
          day: 5,
          title: "Back to Kochi",
          entries: [
            { text: "Breakfast on the houseboat." },
            { text: "Drive back to Kochi." },
            { text: "Drop at Kochi airport." },
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
      paymentDetails: PAYMENT_DETAILS_KERALA,
      relatedSlugs: ["kerala-special", "kerala"],
    }
  ),

  /* ---------------------------------------------------------------- */
  /* Uttarakhand yatras & treks — 4 days and over                      */
  /* ---------------------------------------------------------------- */

  toListingItem(
    {
      name: "Char Dham Yatra",
      slug: "char-dham-yatra",
      duration: "9N/10D",
      heroImage: "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1920&q=80",
      tagline: "Yamunotri, Gangotri, Kedarnath and Badrinath across ten days from Haridwar.",
    },
    {
      region: "Uttarakhand",
      startLocation: "Haridwar",
      endLocation: "Haridwar",
      difficulty: "Moderate",
      price: 24999,
      months: ["May", "Jun", "Sep", "Oct"],
      themes: ["Pilgrimage", "Snow", "Forest"],
      category: "Backpacking Trip",
      detailsPath: "/trips/backpacking/char-dham-yatra",
      minAge: 12,
      intro:
        "The full Char Dham circuit — Yamunotri, Gangotri, Kedarnath and Badrinath — over ten days, starting and finishing at Haridwar or Rishikesh.",
      highlights: ["Yamunotri", "Gangotri", "Kedarnath", "Badrinath", "Mana Village", "Tapt Kund", "Saraswati River"],
      priceNote: "₹24,999 + 5% GST ex-Haridwar / Rishikesh / Dehradun. ₹26,999 + 5% GST for Delhi to Delhi.",
      packages: [
        { id: "ex-haridwar", label: "Ex-Haridwar / Rishikesh / Dehradun", price: 24999, paxLabel: "Ex-Haridwar", vehicle: "By group size", sharing: "Triple / quad" },
        { id: "ex-delhi", label: "Ex-Delhi (Delhi to Delhi)", price: 26999, paxLabel: "Ex-Delhi", vehicle: "By group size", sharing: "Triple / quad" },
      ],
      itinerary: [
        { day: 1, title: "Haridwar to Barkot", entries: [{ text: "Drive Haridwar → Barkot, 205 km, 7–8 hours." }, { text: "Check in and rest. Dinner and overnight in Barkot." }] },
        { day: 2, title: "Yamunotri", entries: [{ text: "Drive 48 km, then trek 5 km each way via Hanumanchatti and Janki Chatti." }, { text: "Holy dip in the Yamuna and darshan." }, { text: "Return to Barkot for the night." }] },
        { day: 3, title: "Barkot to Uttarkashi", entries: [{ text: "Drive 100 km, about 4 hours." }, { text: "Visit Vishwanath Temple. Overnight Uttarkashi." }] },
        { day: 4, title: "Gangotri", entries: [{ text: "Drive 100 km each way, 3–4 hours." }, { text: "Holy dip and Gangotri Temple darshan." }, { text: "Return to Uttarkashi." }] },
        { day: 5, title: "Uttarkashi to Guptkashi", entries: [{ text: "Drive 190 km, 8–9 hours. Overnight Guptkashi." }] },
        { day: 6, title: "Kedarnath", entries: [{ text: "Drive 30 km to Sonprayag, then trek 20 km one way." }, { text: "Doli, palki, pony and horse available at your own cost." }, { text: "Kedarnath Temple darshan. Overnight Kedarnath." }] },
        { day: 7, title: "Kedarnath to Guptkashi", entries: [{ text: "4:45 AM Abhishek at the temple." }, { text: "Trek 20 km down to Sonprayag, then drive. Overnight Guptkashi." }] },
        { day: 8, title: "Guptkashi to Badrinath", entries: [{ text: "Drive via Joshimath, 190–240 km, 8–9 hours." }, { text: "Holy dip at Tapt Kund and evening Badrinath Temple darshan." }, { text: "Overnight Badrinath." }] },
        { day: 9, title: "Badrinath and Mana", entries: [{ text: "Morning darshan." }, { text: "Mana Village, Ganesh Gufa, Saraswati River, Tapt Kund." }, { text: "Overnight Badrinath." }] },
        { day: 10, title: "Return to Haridwar", entries: [{ text: "Drive back to Rishikesh / Haridwar, 10–12 hours. Trip ends." }] },
      ],
      costIncludes: [
        "9 nights accommodation — standard hotel, homestay, guesthouse or camp, triple / quad sharing",
        "Meals on MAP basis at Guptkashi, Kedarnath and Badrinath — basic Indian veg buffet, breakfast and dinner only",
        "Private vehicle transport, Haridwar / Rishikesh round trip",
        "All tolls, parking, fuel, green tax and driver allowance",
      ],
      costExcludes: [
        "5% GST",
        "Travel and health insurance",
        "Meals and snacks during the trip and in transit",
        "Medical expenses",
        "Airport pickup and drop",
        "Local taxi Sonprayag–Gaurikund–Sonprayag",
        "Pony or palki for the Kedarnath trek",
        "Helicopter charges",
        "Any rituals or pooja",
        "Anything not listed under inclusions",
      ],
      transportModes: TRANSPORT_BY_GROUP_SIZE,
      cancellationPolicy: TIERED_CANCELLATION_POLICY,
      confirmationPolicy: CONFIRMATION_POLICY,
      contactNumbers: TRIP_CONTACT_NUMBERS,
      paymentDetails: PAYMENT_DETAILS_HIMALAYAN,
      thingsToCarry: HIMALAYAN_TREK_PACKING_LIST.flatMap((g) => g.items),
      thingsToRemember: TRIP_GROUND_RULES,
      relatedSlugs: ["kedarnath-badrinath-tungnath", "kedarnath-yatra", "panch-kedar-yatra"],
    }
  ),

  toListingItem(
    {
      name: "Panch Kedar Yatra",
      slug: "panch-kedar-yatra",
      duration: "11N/12D",
      heroImage: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1920&q=80",
      tagline: "All five Panch Kedar shrines — Kedarnath, Madhyamaheshwar, Tungnath, Rudranath and Kalpeshwar.",
    },
    {
      region: "Uttarakhand",
      startLocation: "Rishikesh",
      endLocation: "Rishikesh",
      difficulty: "Difficult",
      price: 34999,
      months: ["May", "Jun", "Sep", "Oct"],
      themes: ["Pilgrimage", "Meadow", "Forest"],
      category: "Backpacking Trip",
      detailsPath: "/trips/backpacking/panch-kedar-yatra",
      minAge: 15,
      intro:
        "Twelve days covering all five Panch Kedar shrines — Kedarnath, Madhyamaheshwar, Tungnath, Rudranath and Kalpeshwar — from Rishikesh.",
      highlights: ["Kedarnath", "Madhyamaheshwar", "Tungnath", "Rudranath", "Kalpeshwar", "Pannar Bugyal", "Chopta"],
      priceNote: "₹34,999 per person, excluding GST.",
      itinerary: [
        { day: 1, title: "Rishikesh to Guptkashi", entries: [{ text: "Drive 204 km, about 7 hours, via Devprayag and Rudraprayag." }, { text: "Overnight Guptkashi." }] },
        { day: 2, title: "Kedarnath", entries: [{ text: "Trek 21 km one way. Overnight Kedarnath." }] },
        { day: 3, title: "Back to Guptkashi", entries: [{ text: "Trek back down. Overnight Guptkashi." }] },
        { day: 4, title: "Guptkashi to Ransi", entries: [{ text: "Easy descending walk. Overnight Ransi." }] },
        { day: 5, title: "Madhyamaheshwar", entries: [{ text: "Trek 16 km via Khatra, Nanu, Moukheem and Koon." }, { text: "Overnight Madhyamaheshwar." }] },
        { day: 6, title: "Madhyamaheshwar to Chopta", entries: [{ text: "Trek back to Sari, then drive 40 km, about 2 hours." }, { text: "Overnight Chopta." }] },
        { day: 7, title: "Tungnath", entries: [{ text: "Trek 4 km up to Tungnath and back." }, { text: "Overnight Sari village." }] },
        { day: 8, title: "Sari to Pannar Bugyal", entries: [{ text: "Trek 16 km via Sagar Village, Pung Bugyal, Mauli Karak and Luiti Bugyal." }, { text: "Overnight Pannar." }] },
        { day: 9, title: "Rudranath", entries: [{ text: "Trek 8 km. Overnight near the temple." }] },
        { day: 10, title: "Rudranath to Urgam", entries: [{ text: "Trek back to Sagar Village, then drive 60 km, about 2 hours." }, { text: "Overnight Sagar / Urgam." }] },
        { day: 11, title: "Kalpeshwar", entries: [{ text: "Trek 2 km to Kalpeshwar and back. Overnight Urgam." }] },
        { day: 12, title: "Return to Rishikesh", entries: [{ text: "Drive 250 km, 7–8 hours. Trip ends." }] },
      ],
      costIncludes: [
        "11 nights accommodation, triple / quad sharing",
        "All vegetarian meals from Day 1 dinner to Day 12 morning tea — Day 12 breakfast is not included",
        "Surface transfer, Rishikesh to Rishikesh",
        "Morning and evening tea or coffee with snacks",
        "Qualified trek leader and support staff",
      ],
      costExcludes: HIMALAYAN_TREK_EXCLUSIONS,
      transportModes: TRANSPORT_BY_GROUP_SIZE,
      cancellationPolicy: TIERED_CANCELLATION_POLICY,
      confirmationPolicy: CONFIRMATION_POLICY,
      contactNumbers: TRIP_CONTACT_NUMBERS,
      paymentDetails: PAYMENT_DETAILS_HIMALAYAN,
      thingsToCarry: HIMALAYAN_TREK_PACKING_LIST.flatMap((g) => g.items),
      rentalGear: TREK_RENTAL_GEAR,
      thingsToRemember: TRIP_GROUND_RULES,
      relatedSlugs: ["three-kedar-yatra", "rudranath-trek", "char-dham-yatra"],
    }
  ),

  toListingItem(
    {
      name: "3 Kedar Yatra",
      slug: "three-kedar-yatra",
      duration: "7N/8D",
      heroImage: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1920&q=80",
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
      minAge: 15,
      availability: "Weekend batches every Saturday from Haridwar / Rishikesh",
      intro:
        "Three of the five Panch Kedar shrines — Madmaheshwar, Rudranath and Kalpeshwar — across eight days from Rishikesh.",
      highlights: ["Madhmaheshwar Temple", "Pannar Bugyal", "Rudranath Temple", "Nanda Devi & Trishul views", "Kalpeshwar cave temple"],
      priceNote: "₹18,999 per person.",
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
      paymentDetails: PAYMENT_DETAILS_HIMALAYAN,
      thingsToCarry: HIMALAYAN_TREK_PACKING_LIST.flatMap((g) => g.items),
      rentalGear: TREK_RENTAL_GEAR,
      thingsToRemember: TRIP_GROUND_RULES,
      relatedSlugs: ["rudranath-trek", "panch-kedar-yatra", "madmaheshwar-trek"],
    }
  ),

  toListingItem(
    {
      name: "Rudranath Trek",
      slug: "rudranath-trek",
      duration: "4N/5D",
      heroImage: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1920&q=80",
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
      paymentDetails: PAYMENT_DETAILS_HIMALAYAN,
      thingsToCarry: HIMALAYAN_TREK_PACKING_LIST.flatMap((g) => g.items),
      rentalGear: TREK_RENTAL_GEAR,
      thingsToRemember: TRIP_GROUND_RULES,
      relatedSlugs: ["three-kedar-yatra", "panch-kedar-yatra", "chopta-tungnath-trek"],
    }
  ),

  toListingItem(
    {
      name: "Kedarnath Yatra",
      slug: "kedarnath-yatra",
      duration: "3N/4D",
      heroImage: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=1920&q=80",
      tagline: "A divine Himalayan journey to Lord Shiva's shrine at 3,384 m.",
    },
    {
      region: "Uttarakhand",
      startLocation: "Haridwar",
      endLocation: "Haridwar",
      difficulty: "Moderate",
      price: 6499,
      months: ["May", "Jun", "Sep", "Oct"],
      themes: ["Pilgrimage", "Snow"],
      category: "Backpacking Trip",
      detailsPath: "/trips/backpacking/kedarnath-yatra",
      minAge: 12,
      availability: "Daily departures available",
      intro:
        "Four days from Haridwar to the Kedarnath shrine at 3,384 m and back, with an overnight stay at the temple.",
      highlights: ["Kedarnath Temple", "Dhari Devi", "Rudraprayag Sangam", "Mandakini river", "Pre-dawn Abhishek"],
      priceNote: "₹6,499 per person, excluding GST.",
      sourceCaveat:
        "The inclusions section in the source PDF appears to be boilerplate carried over from a longer itinerary — it refers to 7 nights of accommodation and meals from Day 1 dinner to Day 5 breakfast, which does not match this 4-day trip. Inclusions are withheld pending confirmation; the itinerary, pricing and transport details below are accurate as printed.",
      itinerary: [
        { day: 1, title: "Haridwar to Guptkashi", entries: [{ text: "Drive 220 km, 8–9 hours, to 1,319 m." }, { text: "Passes Dhari Devi, Rudraprayag Sangam and the Mandakini river." }, { text: "Overnight Guptkashi." }] },
        { day: 2, title: "Kedarnath", entries: [{ text: "20 km by road, then 20 km trek one way to 3,384 m." }, { text: "Doli, palki, pony and horse available at your own cost." }, { text: "Temple visit. Overnight Kedarnath." }] },
        { day: 3, title: "Back to Guptkashi", entries: [{ text: "Pre-dawn bath, Abhishek and puja at the temple." }, { text: "Trek 20 km down to Sonprayag, then drive. Overnight Guptkashi." }] },
        { day: 4, title: "Return to Haridwar", entries: [{ text: "Drive 220 km, 6–7 hours. Drop at the railway station." }] },
      ],
      costExcludes: HIMALAYAN_TREK_EXCLUSIONS,
      transportModes: TRANSPORT_BY_GROUP_SIZE,
      cancellationPolicy: TIERED_CANCELLATION_POLICY,
      confirmationPolicy: CONFIRMATION_POLICY,
      contactNumbers: TRIP_CONTACT_NUMBERS,
      paymentDetails: PAYMENT_DETAILS_HIMALAYAN,
      thingsToCarry: HIMALAYAN_TREK_PACKING_LIST.flatMap((g) => g.items),
      rentalGear: TREK_RENTAL_GEAR,
      thingsToRemember: TRIP_GROUND_RULES,
      relatedSlugs: ["kedarnath-badrinath-tungnath", "char-dham-yatra", "chopta-tungnath-trek"],
    }
  ),

  toListingItem(
    {
      name: "Kedarnath, Badrinath & Tungnath Trek",
      slug: "kedarnath-badrinath-tungnath",
      duration: "5N/6D",
      heroImage: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1920&q=80",
      tagline: "Two Dhams and the world's highest Shiva temple in six days from Haridwar.",
    },
    {
      region: "Uttarakhand",
      startLocation: "Haridwar",
      endLocation: "Haridwar",
      difficulty: "Moderate",
      price: 14999,
      months: ["May", "Jun", "Sep", "Oct"],
      themes: ["Pilgrimage", "Snow", "Meadow"],
      category: "Backpacking Trip",
      detailsPath: "/trips/backpacking/kedarnath-badrinath-tungnath",
      minAge: 12,
      intro:
        "Six days from Haridwar taking in Kedarnath, Tungnath — the highest Shiva temple in the world — and Badrinath.",
      highlights: ["Kedarnath Temple", "Tungnath", "Chandrashila Peak", "Badrinath Temple", "Tapt Kund", "Mana Village", "Vyas Gufa"],
      priceNote: "Starting ₹14,999 + 5% GST, ex-Rishikesh / Haridwar.",
      itinerary: [
        { day: 1, title: "Haridwar to Guptkashi", entries: [{ text: "Drive 255 km via Devprayag Sangam, alongside the Mandakini river." }, { text: "Overnight Guptkashi." }] },
        { day: 2, title: "Kedarnath", entries: [{ text: "Drive 30 km to Sonprayag, then trek 21 km — walk, horse, porter or palki." }, { text: "Evening aarti. Overnight Kedarnath." }, { text: "Carry personal medicines, heavy woollens and toiletries for the overnight halt." }] },
        { day: 3, title: "Back to Guptkashi", entries: [{ text: "Trek down to Sonprayag, then drive. Overnight Guptkashi." }] },
        { day: 4, title: "Chopta and Tungnath", entries: [{ text: "Drive 80 km to Chopta." }, { text: "Trek 4 km to Tungnath, the highest Shiva temple in the world." }, { text: "Optional 1 km further to Chandrashila Peak." }, { text: "Trek 4 km back down. Overnight Chopta." }] },
        { day: 5, title: "Badrinath", entries: [{ text: "Drive 180 km, about 6 hours." }, { text: "Badrinath Temple darshan and a bath at Tapt Kund hot spring." }, { text: "Vyas Gufa, Mata Murti, Bhimkund and the Saraswati river origin, all within 3 km." }, { text: "Mana Village — the last Indian village before Tibet. Overnight Badrinath." }] },
        { day: 6, title: "Return to Haridwar", entries: [{ text: "Drive 310 km via the Nandprayag, Karanprayag and Devprayag Sangams. Trip ends." }] },
      ],
      costIncludes: [
        "5 nights accommodation — standard hotel, homestay, guesthouse or camp, triple / quad sharing",
        "Meals on MAP basis at Guptkashi, Kedarnath and Badrinath — basic Indian veg buffet, breakfast and dinner only",
        "Private vehicle transport, Haridwar / Rishikesh round trip",
        "All tolls, parking, fuel, green tax and driver allowance",
      ],
      costExcludes: [
        "5% GST",
        "Travel and health insurance",
        "Meals and snacks during the trip",
        "Medical expenses",
        "Airport pickup and drop, available at extra cost",
        "Local taxi Sonprayag–Gaurikund–Sonprayag",
        "Pony cost for the Kedarnath trek",
        "Helicopter charges",
        "Any rituals or pooja",
        "Anything not listed under inclusions",
      ],
      transportModes: TRANSPORT_BY_GROUP_SIZE,
      cancellationPolicy: TIERED_CANCELLATION_POLICY,
      confirmationPolicy: CONFIRMATION_POLICY,
      contactNumbers: TRIP_CONTACT_NUMBERS,
      paymentDetails: PAYMENT_DETAILS_HIMALAYAN,
      thingsToCarry: HIMALAYAN_TREK_PACKING_LIST.flatMap((g) => g.items),
      thingsToRemember: TRIP_GROUND_RULES,
      relatedSlugs: ["kedarnath-yatra", "char-dham-yatra", "chopta-tungnath-trek"],
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
