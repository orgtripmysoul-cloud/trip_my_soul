export interface TrekBatch {
  id: string;
  startDate: string;
  endDate: string;
  availableSeats: number;
  totalSeats: number;
  status: "Available" | "Filling Fast" | "Sold Out";
  basePrice: number;
}

/** One departure slot inside a month block. */
export interface BatchTrip {
  startDate: string;
  endDate: string;
  status: string;
  isWomenOnly?: boolean;
  isSeniorOnly?: boolean;
  /**
   * Seats still open on this departure.
   *
   * TODO(data-model): no source currently publishes per-batch capacity — the
   * seeded batches in this file and every `batchDates` listing only carry a
   * status string. Until the booking backend tracks bookings against a batch
   * capacity, this stays undefined and the departures sheet falls back to a
   * plain "Open" badge. Populate it (with `totalSeats`) once seat counts exist.
   */
  seatsLeft?: number;
  /** Capacity of the departure, where the source tracks one. See `seatsLeft`. */
  totalSeats?: number;
}

export interface BatchMonth {
  month: string;
  /**
   * Calendar year this month block departs in, e.g. `"2026"`. Optional for the
   * hand-seeded blocks below, which inherit the year of their `years` key.
   */
  year?: string;
  trips: BatchTrip[];
}

/** Departures grouped by year then month, e.g. `years["2026"].months`. */
export interface TrekBatches {
  years?: Record<string, { months?: BatchMonth[] }>;
}

export interface AltitudePoint {
  location: string;
  m: number;
  ft: number;
}

/** Per-day accommodation. Feeds the itinerary "Accommodation" tab. */
export interface DayAccommodation {
  type: string;
  name?: string;
}

/** Per-day meals. Replaces the flat `meals` string; both are supported. */
export interface DayFood {
  breakfast?: string;
  lunch?: string;
  snacks?: string;
  dinner?: string;
}

/** A clock detail specific to one day, e.g. `{ label: "Pickup", value: "6:00 AM" }`. */
export interface DayTimeNote {
  label: string;
  value: string;
}

export interface ItineraryDay {
  day: number;
  title: string;
  description?: string;
  /** Timed lines for the day, as printed on a trip itinerary PDF. */
  entries?: { time?: string; text: string }[];
  detailedDescription?: string;
  /**
   * The day's write-up, one entry per paragraph. Preferred over the single
   * `detailedDescription` string where the source publishes real prose; the
   * itinerary card renders each paragraph in turn when a day is expanded.
   */
  detailedParagraphs?: string[];
  /** Short callouts for the day, shown as chips beneath its description. */
  highlights?: string[];
  /** Shown in the day's quick-info line, e.g. a pickup, summit-start or departure time. */
  timeNote?: DayTimeNote;
  altitudePoints?: AltitudePoint[];
  altitudeGain?: { m: number; ft: number } | null;
  driveDistance?: string;
  drivingTime?: string;
  trekDistance?: string;
  trekDuration?: string;
  /**
   * Day-1 assembly details, shown in the Quick Itinerary. Set them where the
   * itinerary publishes a real pickup; days that leave them unset fall back to
   * the generic hub and time in `normalizeQuickItinerary`.
   */
  pickupPoint?: string;
  pickupTime?: string;
  meals?: string;
  stayType?: string;
  accommodation?: DayAccommodation;
  food?: DayFood;
}

export interface GalleryImage {
  url: string;
  caption?: string;
}

/** Alternate route/campsite for a trek. Variant tabs render only at 2+. */
export interface RouteVariant {
  id: string;
  name: string;
  days: number | string;
  price: number | null;
}

/** A category of gear, e.g. { category: "Foot gear", items: [...] }. */
export interface EquipmentGroup {
  category: string;
  items: string[];
}

/** One refund tier. `daysTo: null` means "and below". */
export interface CancellationTier {
  label: string;
  daysFrom: number;
  daysTo: number | null;
  cashPct: number;
  voucherPct: number;
  transferAllowed: boolean;
}

export interface HealthCheckItem {
  label: string;
  threshold: string;
}

/**
 * A review published on another platform.
 *
 * Only the link and where it lives are stored: the rating, wording and author
 * stay on the platform, so the card links out rather than restating anything
 * this codebase cannot verify.
 */
export interface ExternalReview {
  /** Platform the review sits on, e.g. "Google". */
  source: string;
  /** Who or what the review is about, e.g. "Trip My Soul". */
  subject: string;
  url: string;
}

export interface VideoTestimonial {
  videoUrl: string;
  thumbnail: string;
  trekkerName: string;
  batch: string;
  duration: string;
}

export interface RelatedArticle {
  slug: string;
  title: string;
  excerpt: string;
  image: string;
}

export interface TravelOption {
  from: string;
  name: string;
  departure?: string;
  arrival?: string;
  note?: string;
}

export interface TravelMode {
  summary: string;
  /** Caption above the summary, e.g. "Nearest Airport". */
  summaryLabel?: string;
  /** Prose shown under the headline. */
  detail?: string;
  /** Ordered legs of a drive, rendered as a route timeline. */
  route?: string[];
  /** Compact label/value facts, e.g. distance and drive time. */
  facts?: { label: string; value: string }[];
  options?: TravelOption[];
}

export interface HowToReach {
  /** One-line lead for the section. */
  intro?: string;
  air: TravelMode;
  train: TravelMode;
  road: TravelMode;
  pickup: {
    point: string;
    time: string;
    dropPoint: string;
    dropTime: string;
    note?: string;
  };
}

export interface PricePackage {
  id: string;
  label: string;
  price: number;
  advanceAmount?: number;
  /** Pricing-table columns: group size, vehicle and room sharing. */
  paxLabel?: string;
  vehicle?: string;
  sharing?: string;
}

export interface Usp {
  title: string;
  description: string;
}

/**
 * A one-line criterion shown as an icon + text row, e.g. an eligibility or
 * fitness requirement. `icon` is a lucide icon name the section maps itself.
 */
export interface IconBullet {
  icon: string;
  text: string;
}

export interface DestinationHighlight {
  name: string;
  blurb: string;
}

/** Vehicle allocated by group size. */
export interface TransportModeByGroup {
  group: string;
  vehicle: string;
}

/** Gear available to hire on site, priced per item. */
export interface RentalGearItem {
  item: string;
  price: number;
}

export interface Trek {
  slug: string;
  name: string;
  /**
   * One-line summary shown on the listing card. Only set where a real source
   * itinerary exists — cards without one fall back to a neutral factual line
   * rather than invented copy.
   */
  tagline?: string;
  price: number | null;
  days: number | string | null;
  nights: number | string | null;
  region: string;
  category: string;
  startLocation: string;
  difficulty: string;
  months: string[];
  themes: string[];
  inclusions?: { title: string; description: string }[];
  exclusions?: { title: string; description: string }[];
  itinerary?: ItineraryDay[];
  faqs?: { title: string; description: string }[];
  thingtopack?: { title: string; description: string; img?: string }[];
  batches?: TrekBatches;
  fitnessRequirement?: string;
  /** Who the listing is open to, shown as icon rows beside the fitness meter. */
  eligibilityCriteria?: IconBullet[];
  /** What a trekker should be able to do, shown next to `eligibilityCriteria`. */
  fitnessCriteria?: IconBullet[];
  maxAltitude?: string;
  totalDistance?: string;

  // --- Extended detail-page fields. All optional; `trekDefaults.ts` fills the gaps. ---
  gallery?: GalleryImage[];
  routeVariants?: RouteVariant[];
  equipmentProvided?: EquipmentGroup[];
  personalEquipment?: EquipmentGroup[];
  trekEssentialsPdfUrl?: string;
  cancellationTiers?: CancellationTier[];
  emergencyCancellation?: string;
  healthChecklist?: HealthCheckItem[];
  minAgeWithGuardian?: number;
  soloAgeMin?: number;
  disclaimerFormUrl?: string;
  videoTestimonials?: VideoTestimonial[];
  /** Reviews hosted elsewhere, shown as linked social-proof cards. */
  externalReviews?: ExternalReview[];
  /** YouTube review videos, as watch/Shorts URLs. */
  reviewVideos?: string[];
  relatedArticles?: RelatedArticle[];
  howToReach?: HowToReach;

  /**
   * --- Shared detail-page fields. ---
   *
   * Populated by the trip catalogue via `tripToTrek`, and available to treks as
   * the CMS grows. Every one is optional: `resolveTrekDetail` falls back to
   * `trekDefaults.ts`, and each section hides itself when it has nothing to show,
   * so treks and trips render through the exact same page.
   */

  // Header
  heroImage?: string;
  /** Canonical URL for this listing, e.g. `/trips/weekend/munnar`. Defaults to `/treks/{slug}`. */
  detailsPath?: string;
  tripCode?: string;
  availability?: string;
  endLocation?: string;
  minAge?: number;
  maxAge?: number;
  maxGroupSize?: string;

  // Overview & about
  intro?: string;
  aboutParagraphs?: string[];
  highlights?: string[];
  usps?: Usp[];
  idealFor?: string;
  differentiators?: string[];
  importantNote?: string;
  destinationHighlights?: DestinationHighlight[];
  /** Note shown when the source itinerary is incomplete or self-contradictory. */
  sourceCaveat?: string;

  // Cost terms
  originalPrice?: number;
  packages?: PricePackage[];
  /** Caveat shown above the pricing table, e.g. what the fare excludes. */
  priceNote?: string;
  bookingAdvance?: number;
  /** Advance as a share of the fare, where the listing quotes a percentage rather than a sum. */
  bookingAdvancePct?: number;
  /** Cost and booking terms, listed as an accordion under the headline fare. */
  bookingTerms?: { title: string; description: string }[];
  balanceDueDays?: number;
  kidsPolicy?: string;
  confirmationPolicy?: string;
  /** Departure dates as ISO strings, used when `batches` is unset. */
  batchDates?: string[];

  // Essentials & logistics
  packingList?: EquipmentGroup[];
  thingsToRemember?: string[];
  transportModes?: TransportModeByGroup[];
  rentalGear?: RentalGearItem[];
  transport?: { railHead: string; airport: string; road: string };

  // Policies & contact
  cancellationPolicyText?: string;
  contactPhone?: string;
  contactNumbers?: string[];

  /**
   * Whether unfilled fields may fall back to the generic Himalayan-trek copy in
   * `trekDefaults.ts` (altitude, campsite meals, packing list, mock itinerary).
   * Treks leave this unset; `tripToTrek` sets it false so a backwaters or beach
   * trip renders an empty section rather than invented trek facts.
   */
  useTrekFallbacks?: boolean;
}

export interface Office {
  city: string;
  address: string;
  phone: string;
  email: string;
  timings: string;
}

export interface TrustMetric {
  title: string;
  description: string;
  icon: string;
}

export const WHY_CHOOSE_US: TrustMetric[] = [
  {
    title: "Unmatched Safety Standards",
    description: "Equipped with oxygen cylinders, portable hyperbaric chambers, stretcher-tents, high-altitude medical kits, and certified mountaineering guides.",
    icon: "Shield"
  },
  {
    title: "Eco-Conscious Trekking",
    description: "We practice strict eco-sustainability, ensuring our trail footprint is minimal, removing mountain waste, and supporting local communities.",
    icon: "Leaf"
  },
  {
    title: "Local Knowledge & Passion",
    description: "Born and bred in the Himalayas, our support staff and guides bring deep-rooted local expertise, legends, and warmth to every expedition.",
    icon: "Compass"
  }
];

export const TRUST_STATS = [
  { value: "10,000+", label: "Trekkers Served" },
  { value: "50+", label: "High-Altitude Routes" },
  { value: "12+", label: "Years Experience" },
  { value: "4.9/5", label: "Average Review" }
];

export const OFFICES: Office[] = [
  {
    city: "Dehradun (Head Office)",
    address: "Block E, Ln 8, Saraswati Vihar, Ajabpur Khurd, Dehradun, Uttarakhand, 248001",
    phone: "+91-8178613438",
    email: "tripmysoulteam@gmail.com",
    timings: "Open 24/7"
  },
  {
    city: "Hyderabad Office",
    address: "5-5-35-304/B2/B1, Sai Baba Nagar Colony, Phase-1, Mythri Nagar, Kukatpally, Telangana - 500072",
    phone: "+91-8178613438",
    email: "tripmysoulteam@gmail.com",
    timings: "9:00 AM - 6:00 PM"
  }
];

export const REGIONS = [
  {
    slug: "uttarakhand",
    name: "Uttarakhand",
    image: "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80",
    description: "Home to sacred peaks, sprawling bugyals (meadows), and high-altitude passes like Har Ki Dun and Kuari Pass."
  },
  {
    slug: "himachal-pradesh",
    name: "Himachal Pradesh",
    image: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=800&q=80",
    description: "Diverse trails ranging from the lush pine forests of Hampta Pass to the remote desert valleys of Spiti."
  },
  {
    slug: "jammu-kashmir",
    name: "Jammu & Kashmir",
    image: "https://images.unsplash.com/photo-1595841696660-ad61476d7f6b?auto=format&fit=crop&w=800&q=80",
    description: "The crown jewel of alpine lakes treks, featuring meadow walks and towering peaks in Kashmir & Ladakh."
  }
];

export const TREKS: Trek[] = [
  {
    "slug": "kasol-kheerganga-trek",
    "name": "Kasol Kheerganga Trek",
    "price": 6000,
    "days": 4,
    "nights": 3,
    "region": "Himachal Pradesh",
    "category": "Weekend Getaways",
    "startLocation": "Delhi to Delhi",
    "difficulty": "Moderate",
    "months": [
      "Oct",
      "Nov",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul"
    ],
    "themes": [
      "Snow",
      "Meadow",
      "Forest",
      "Pass Crossing"
    ]
  },
  {
    "slug": "yulla-kanda-trek",
    "name": "Yulla Kanda Trek",
    "tagline": "The world's highest Shri Krishna temple, at 12,778 ft in Kinnaur — three days from Shimla.",
    "price": null,
    "days": 3,
    "nights": 2,
    "region": "Himachal Pradesh",
    "category": "Trending Treks",
    "startLocation": "Shimla to Shimla",
    "difficulty": "Moderate",
    "months": [
      "Oct",
      "Nov",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul"
    ],
    "themes": [
      "Snow",
      "Meadow",
      "Forest",
      "Pass Crossing"
    ]
  },
  {
    "slug": "tirthan-valley",
    "name": "Tirthan Valley Trek",
    "price": 7500,
    "days": 5,
    "nights": 4,
    "region": "Himachal Pradesh",
    "category": "Himachal Pardesh",
    "startLocation": "Delhi to Delhi",
    "difficulty": "Moderate",
    "months": [
      "Oct",
      "Nov",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul"
    ],
    "themes": [
      "Snow",
      "Meadow",
      "Forest",
      "Pass Crossing"
    ]
  },
  {
    "slug": "rupin-pass-trek",
    "name": "Rupin Pass Trek",
    "price": 17999,
    "days": 7,
    "nights": 6,
    "region": "Himachal Pradesh",
    "category": "Trending Treks",
    "startLocation": "Shimla to Shimla",
    "difficulty": "Moderate",
    "months": [
      "Oct",
      "Nov",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul"
    ],
    "themes": [
      "Snow",
      "Meadow",
      "Forest",
      "Pass Crossing"
    ]
  },
  {
    "slug": "hampta-pass-trek",
    "name": "Hampta Pass",
    "price": 7500,
    "days": 5,
    "nights": 4,
    "region": "Himachal Pradesh",
    "category": "Trending Treks",
    "startLocation": "Manali to Manali",
    "difficulty": "Moderate",
    "months": [
      "Oct",
      "Nov",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul"
    ],
    "themes": [
      "Snow",
      "Meadow",
      "Forest",
      "Pass Crossing"
    ]
  },
  {
    "slug": "spiti-valley",
    "name": "Spiti Valley",
    "price": 22999,
    "days": 9,
    "nights": 8,
    "region": "Himachal Pradesh",
    "category": "Upcoming Winter Treks",
    "startLocation": "Delhi To Delhi",
    "difficulty": "Moderate",
    "months": [
      "Oct",
      "Nov",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul"
    ],
    "themes": [
      "Snow",
      "Meadow",
      "Forest",
      "Pass Crossing"
    ]
  },
  {
    "slug": "manali-kasol",
    "name": "Manali kasol",
    "price": 11999,
    "days": 6,
    "nights": 5,
    "region": "Himachal Pradesh",
    "category": "Upcoming Winter Treks",
    "startLocation": "Delhi To Delhi",
    "difficulty": "Moderate",
    "months": [
      "Oct",
      "Nov",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul"
    ],
    "themes": [
      "Snow",
      "Meadow",
      "Forest",
      "Pass Crossing"
    ]
  },
  {
    "slug": "bir-billing-paragliding-trek",
    "name": "Bir Biling Paragliding & Trek",
    "price": 9200,
    "days": 4,
    "nights": 3,
    "region": "Himachal Pradesh",
    "category": "Weekend Getaways",
    "startLocation": "Delhi to Delhi",
    "difficulty": "Moderate",
    "months": [
      "Oct",
      "Nov",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul"
    ],
    "themes": [
      "Snow",
      "Meadow",
      "Forest",
      "Pass Crossing"
    ]
  },
  {
    "slug": "sar-pass-trek",
    "name": "Sar Pass Trek",
    "price": 6499,
    "days": 5,
    "nights": 4,
    "region": "Himachal Pradesh",
    "category": "Trending Treks",
    "startLocation": "Kasol to Kasol",
    "difficulty": "Moderate",
    "months": [
      "Oct",
      "Nov",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul"
    ],
    "themes": [
      "Snow",
      "Meadow",
      "Forest",
      "Pass Crossing"
    ]
  },
  {
    "slug": "triund-trek",
    "name": "Triund-Trek",
    "price": 4400,
    "days": 3,
    "nights": 2,
    "region": "Himachal Pradesh",
    "category": "Weekend Getaways",
    "startLocation": "Delhi to Delhi",
    "difficulty": "Moderate",
    "months": [
      "Oct",
      "Nov",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul"
    ],
    "themes": [
      "Snow",
      "Meadow",
      "Forest",
      "Pass Crossing"
    ]
  },
  {
    "slug": "beas-kund-trek",
    "name": "Beas Kund Trek",
    "price": 5900,
    "days": 3,
    "nights": 2,
    "region": "Himachal Pradesh",
    "category": "Weekend Getaways",
    "startLocation": "Manali to Manali",
    "difficulty": "Moderate",
    "months": [
      "Oct",
      "Nov",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul"
    ],
    "themes": [
      "Snow",
      "Meadow",
      "Forest",
      "Pass Crossing"
    ]
  },
  {
    "slug": "buran-ghati-pass-trek",
    "name": "Buran Ghati Pass",
    "price": 16500,
    "days": 7,
    "nights": 6,
    "region": "Himachal Pradesh",
    "category": "Trending Treks",
    "startLocation": "Shimla to Shimla",
    "difficulty": "Moderate",
    "months": [
      "Oct",
      "Nov",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul"
    ],
    "themes": [
      "Snow",
      "Meadow",
      "Forest",
      "Pass Crossing"
    ]
  },
  {
    "slug": "shimla-tour",
    "name": "Shimla",
    "price": 16500,
    "days": 5,
    "nights": 4,
    "region": "Himachal Pradesh",
    "category": "Upcoming Winter Treks",
    "startLocation": "Delhi to Delhi",
    "difficulty": "Moderate",
    "months": [
      "Oct",
      "Nov",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul"
    ],
    "themes": [
      "Snow",
      "Meadow",
      "Forest",
      "Pass Crossing"
    ]
  },
  {
    "slug": "leh-ladakh",
    "name": "Leh-Ladakh",
    "price": 26999,
    "days": 6,
    "nights": 5,
    "region": "Jammu & Kashmir",
    "category": "Explore the Open Road",
    "startLocation": "Leh To Leh",
    "difficulty": "Moderate",
    "months": [
      "Oct",
      "Nov",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul"
    ],
    "themes": [
      "Snow",
      "Meadow",
      "Forest",
      "Pass Crossing"
    ]
  },
  {
    "slug": "kedarkantha-trek",
    "name": "Kedarkantha Trek",
    "tagline": "Five days from Dehradun to the 12,500 ft Kedarkantha summit, through the snowbound pine forests above Sankri.",
    "price": 5999,
    "days": 5,
    "nights": 4,
    "region": "Uttarakhand",
    "category": "Upcoming Winter Treks",
    "startLocation": "Sankri",
    "difficulty": "Easy to Moderate",
    "maxAltitude": "12,500 ft / 3,810 m",
    "totalDistance": "20–24 Kilometers",
    "availability": "November – April",
    "months": [
      "Nov",
      "Dec",
      "Jan",
      "Feb",
      "Mar",
      "Apr"
    ],
    "themes": [
      "Snow",
      "Meadow",
      "Forest",
      "Summit"
    ]
  },
  {
    "slug": "dayara-bugyal-trek",
    "name": "Dayara Bugyal Trek",
    "price": 6499,
    "days": 4,
    "nights": 3,
    "region": "Uttarakhand",
    "category": "Upcoming Winter Treks",
    "startLocation": "Dehradun to Dehradun",
    "difficulty": "Moderate",
    "months": [
      "Oct",
      "Nov",
      "Dec",
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul"
    ],
    "themes": [
      "Snow",
      "Meadow",
      "Forest",
      "Pass Crossing"
    ]
  },
  {
    "slug": "kuari-pass-trek",
    "name": "Kuari Pass Trek",
    "price": 8999,
    "days": 6,
    "nights": 5,
    "region": "Uttarakhand",
    "category": "Upcoming Winter Treks",
    "startLocation": "Dehradun To Dehradun",
    "difficulty": "Moderate",
    "months": [
      "Oct",
      "Nov",
      "Dec",
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul"
    ],
    "themes": [
      "Snow",
      "Meadow",
      "Forest",
      "Pass Crossing"
    ]
  },
  {
    "slug": "brahmatal-trek",
    "name": "Brahmatal Trek",
    "price": 7999,
    "days": 5,
    "nights": 4,
    "region": "Uttarakhand",
    "category": "Upcoming Winter Treks",
    "startLocation": "Rishikesh To Rishikesh",
    "difficulty": "Moderate",
    "months": [
      "Oct",
      "Nov",
      "Dec",
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul"
    ],
    "themes": [
      "Snow",
      "Meadow",
      "Forest",
      "Pass Crossing"
    ]
  },
  {
    "slug": "pangarchulla-trek",
    "name": "Pangarchulla Trek",
    "price": 11000,
    "days": 6,
    "nights": 5,
    "region": "Uttarakhand",
    "category": "Trending Treks",
    "startLocation": "Rishikesh to Rishikesh",
    "difficulty": "Moderate",
    "months": [
      "Oct",
      "Nov",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul"
    ],
    "themes": [
      "Snow",
      "Meadow",
      "Forest",
      "Pass Crossing"
    ]
  },
  {
    "slug": "bali-pass-trek",
    "name": "Bali Pass Trek",
    "price": 21999,
    "days": 8,
    "nights": 7,
    "region": "Uttarakhand",
    "category": "Trending Treks",
    "startLocation": "Dheradun to Dehradun",
    "difficulty": "Moderate",
    "months": [
      "Oct",
      "Nov",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul"
    ],
    "themes": [
      "Snow",
      "Meadow",
      "Forest",
      "Pass Crossing"
    ]
  },
  {
    "slug": "phulara-ridge-trek",
    "name": "Phulara Ridge Trek",
    "price": 9999,
    "days": 6,
    "nights": 5,
    "region": "Uttarakhand",
    "category": "Uttarakhand",
    "startLocation": "Dehradun to Dehradun",
    "difficulty": "Moderate",
    "months": [
      "Oct",
      "Nov",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul"
    ],
    "themes": [
      "Snow",
      "Meadow",
      "Forest",
      "Pass Crossing"
    ]
  },
  {
    "slug": "gaumukh-tapovan-trek",
    "name": "Gaumukh Tapovan",
    "price": 16499,
    "days": 7,
    "nights": 6,
    "region": "Uttarakhand",
    "category": "Trending Treks",
    "startLocation": "Dehradun to Dehradun",
    "difficulty": "Moderate",
    "months": [
      "Oct",
      "Nov",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul"
    ],
    "themes": [
      "Snow",
      "Meadow",
      "Forest",
      "Pass Crossing"
    ]
  },
  {
    "slug": "valley-of-flowers-trek",
    "name": "Valley Of Flower",
    "price": 8500,
    "days": 6,
    "nights": 5,
    "region": "Uttarakhand",
    "category": "Trending Treks",
    "startLocation": "Rishikesh to Rishikesh",
    "difficulty": "Moderate",
    "months": [
      "Oct",
      "Nov",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul"
    ],
    "themes": [
      "Snow",
      "Meadow",
      "Forest",
      "Pass Crossing"
    ]
  },
  {
    "slug": "nagtibba-trek",
    "name": "Nagtibba",
    "price": 3499,
    "days": 2,
    "nights": 1,
    "region": "Uttarakhand",
    "category": "Upcoming Winter Treks",
    "startLocation": "Dehradun To Dehradun",
    "difficulty": "Moderate",
    "months": [
      "Oct",
      "Nov",
      "Dec",
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul"
    ],
    "themes": [
      "Snow",
      "Meadow",
      "Forest",
      "Pass Crossing"
    ]
  },
  {
    "slug": "har-ki-dun-trek",
    "name": "Har Ki Dun Trek",
    "price": 10999,
    "days": 7,
    "nights": 6,
    "region": "Uttarakhand",
    "category": "Trending Treks",
    "startLocation": "Dehradun to Dehradun",
    "difficulty": "Moderate",
    "months": [
      "Oct",
      "Nov",
      "Dec",
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul"
    ],
    "themes": [
      "Snow",
      "Meadow",
      "Forest",
      "Pass Crossing"
    ]
  },
  {
    "slug": "auli-weekend-tour",
    "name": "Auli Weekend Tour",
    "price": 9500,
    "days": 5,
    "nights": 4,
    "region": "Uttarakhand",
    "category": "Trending Treks",
    "startLocation": "Delhi to Delhi",
    "difficulty": "Moderate",
    "months": [
      "Oct",
      "Nov",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul"
    ],
    "themes": [
      "Snow",
      "Meadow",
      "Forest",
      "Pass Crossing"
    ]
  },
  {
    "slug": "kedartal-trek",
    "name": "Kedartal Trek",
    "price": 20999,
    "days": 7,
    "nights": 6,
    "region": "Uttarakhand",
    "category": "Upcoming Winter Treks",
    "startLocation": "Dehradun To Dehradun",
    "difficulty": "Moderate",
    "months": [
      "Oct",
      "Nov",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul"
    ],
    "themes": [
      "Snow",
      "Meadow",
      "Forest",
      "Pass Crossing"
    ]
  },
  {
    "slug": "fachu-kandi-pass-trek",
    "name": "Fachu Kandi Pass Trek",
    "price": 19999,
    "days": 8,
    "nights": 7,
    "region": "Uttarakhand",
    "category": "Upcoming Winter Treks",
    "startLocation": "Dehradun To Dehradun",
    "difficulty": "Moderate",
    "months": [
      "Oct",
      "Nov",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul"
    ],
    "themes": [
      "Snow",
      "Meadow",
      "Forest",
      "Pass Crossing"
    ]
  },
  {
    "slug": "gulabi-kantha-trek",
    "name": "Gulabi Kantha Trek",
    "price": 11999,
    "days": 6,
    "nights": 5,
    "region": "Uttarakhand",
    "category": "Upcoming Winter Treks",
    "startLocation": "Dehradun to Dehradun",
    "difficulty": "Moderate",
    "months": [
      "Oct",
      "Nov",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul"
    ],
    "themes": [
      "Snow",
      "Meadow",
      "Forest",
      "Pass Crossing"
    ]
  },
  {
    "slug": "sarutal-trek",
    "name": "Sarutal Trek",
    "price": 12999,
    "days": 7,
    "nights": 6,
    "region": "Uttarakhand",
    "category": "Upcoming Winter Treks",
    "startLocation": "Dehradun to Dehradun",
    "difficulty": "Moderate",
    "months": [
      "Oct",
      "Nov",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul"
    ],
    "themes": [
      "Snow",
      "Meadow",
      "Forest",
      "Pass Crossing"
    ]
  },
  {
    "slug": "ali-bedni-bugyal-trek",
    "name": "Ali Bedni Bugyal trek",
    "price": 9500,
    "days": null,
    "nights": null,
    "region": "Uttarakhand",
    "category": " Uttarakhand",
    "startLocation": "Rishikesh to Rishikesh",
    "difficulty": "Moderate",
    "months": [
      "Oct",
      "Nov",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul"
    ],
    "themes": [
      "Snow",
      "Meadow",
      "Forest",
      "Pass Crossing"
    ]
  },
  {
    "slug": "tarsar-marsar-trek",
    "name": "Tarsar Marsar Trek",
    "price": 13999,
    "days": 7,
    "nights": 6,
    "region": "Jammu & Kashmir",
    "category": "Trending Treks",
    "startLocation": "Aru to Aru",
    "difficulty": "Moderate",
    "months": [
      "Oct",
      "Nov",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul"
    ],
    "themes": [
      "Snow",
      "Meadow",
      "Forest",
      "Pass Crossing"
    ]
  },
  {
    "slug": "deoban-trek",
    "name": "Deoban Trek",
    "price": 4499,
    "days": 3,
    "nights": 2,
    "region": "Uttarakhand",
    "category": "Weekend Getaways",
    "startLocation": "Dedhradun to Dehradun",
    "difficulty": "Moderate",
    "months": [
      "Oct",
      "Nov",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul"
    ],
    "themes": [
      "Snow",
      "Meadow",
      "Forest",
      "Pass Crossing"
    ]
  },
  {
    "slug": "kashmir-great-lakes-trek",
    "name": "Kashmir Great Lakes",
    "price": 15999,
    "days": 8,
    "nights": 7,
    "region": "Jammu & Kashmir",
    "category": "Trending Treks",
    "startLocation": "Srinagar to Srinagar",
    "difficulty": "Moderate",
    "months": [
      "Oct",
      "Nov",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul"
    ],
    "themes": [
      "Snow",
      "Meadow",
      "Forest",
      "Pass Crossing"
    ]
  },
  {
    "slug": "kashmir-tour",
    "name": "Kashmir Tour",
    "price": 14999,
    "days": 5,
    "nights": 4,
    "region": "Jammu & Kashmir",
    "category": "Upcoming Winter Treks",
    "startLocation": "Jammu to Jammu",
    "difficulty": "Moderate",
    "months": [
      "Oct",
      "Nov",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul"
    ],
    "themes": [
      "Snow",
      "Meadow",
      "Forest",
      "Pass Crossing"
    ]
  },
  {
    "slug": "panch-kedar-trek",
    "name": "Panch Kedar",
    "tagline": "All five Panch Kedar shrines in one circuit — Kedarnath, Madhyamaheshwar, Tungnath, Rudranath and Kalpeshwar — over twelve days from Rishikesh.",
    "price": 34999,
    "days": 12,
    "nights": 11,
    "region": "Uttarakhand",
    "category": "trending treks",
    "startLocation": "Rishikesh / Haridwar",
    "difficulty": "Moderate",
    "months": [
      "Oct",
      "Nov",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul"
    ],
    "themes": [
      "Snow",
      "Meadow",
      "Forest",
      "Pass Crossing"
    ]
  },
  {
    "slug": "meghalaya-tour",
    "name": "Meghalaya",
    "price": 21499,
    "days": 6,
    "nights": 5,
    "region": "Meghalaya",
    "category": "Upcoming Winter Treks",
    "startLocation": "Guwahati to Guwahati",
    "difficulty": "Moderate",
    "months": [
      "Oct",
      "Nov",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul"
    ],
    "themes": [
      "Snow",
      "Meadow",
      "Forest",
      "Pass Crossing"
    ]
  },
  {
    // TODO(content): winter catalogue stub for Deoriatal-Chopta Trek. Every value marked TODO
    // below is a placeholder — ops to confirm before this listing goes live.
    "slug": "deoriatal-chopta-trek",
    "name": "Deoriatal-Chopta Trek",
    "price": null, // TODO(content): real price; the card shows "TBD" until set.
    "days": 3, // TODO(content): real duration.
    "nights": 2, // TODO(content): real duration.
    "region": "Uttarakhand",
    "category": "Upcoming Winter Treks",
    // TODO(content): real start/end point. Empty string makes the card fall back to the region.
    "startLocation": "",
    "difficulty": "Easy-Moderate", // TODO(content): real grade.
    // Dec/Jan/Feb is what SEASON_MAP["Winter"] in app/page.tsx matches on.
    "months": [
      "Dec",
      "Jan",
      "Feb"
    ],
    "themes": [
      "Snow"
    ]
    // TODO(content): add `tagline` (one-line card summary — TrekCard falls back to a
    // neutral factual line while it is unset) and `heroImage` (trekDetail.ts falls
    // back to the default hero image while it is unset).
  },
  {
    // TODO(content): winter catalogue stub for Panwali Kantha Trek. Every value marked TODO
    // below is a placeholder — ops to confirm before this listing goes live.
    "slug": "panwali-kantha-trek",
    "name": "Panwali Kantha Trek",
    "price": null, // TODO(content): real price; the card shows "TBD" until set.
    "days": 3, // TODO(content): real duration.
    "nights": 2, // TODO(content): real duration.
    "region": "Uttarakhand",
    "category": "Upcoming Winter Treks",
    // TODO(content): real start/end point. Empty string makes the card fall back to the region.
    "startLocation": "",
    "difficulty": "Easy-Moderate", // TODO(content): real grade.
    // Dec/Jan/Feb is what SEASON_MAP["Winter"] in app/page.tsx matches on.
    "months": [
      "Dec",
      "Jan",
      "Feb"
    ],
    "themes": [
      "Snow"
    ]
    // TODO(content): add `tagline` (one-line card summary — TrekCard falls back to a
    // neutral factual line while it is unset) and `heroImage` (trekDetail.ts falls
    // back to the default hero image while it is unset).
  },
  {
    // TODO(content): winter catalogue stub for Khaliya Top Trek. Every value marked TODO
    // below is a placeholder — ops to confirm before this listing goes live.
    "slug": "khaliya-top-trek",
    "name": "Khaliya Top Trek",
    "price": null, // TODO(content): real price; the card shows "TBD" until set.
    "days": 3, // TODO(content): real duration.
    "nights": 2, // TODO(content): real duration.
    "region": "Uttarakhand",
    "category": "Upcoming Winter Treks",
    // TODO(content): real start/end point. Empty string makes the card fall back to the region.
    "startLocation": "",
    "difficulty": "Easy-Moderate", // TODO(content): real grade.
    // Dec/Jan/Feb is what SEASON_MAP["Winter"] in app/page.tsx matches on.
    "months": [
      "Dec",
      "Jan",
      "Feb"
    ],
    "themes": [
      "Snow"
    ]
    // TODO(content): add `tagline` (one-line card summary — TrekCard falls back to a
    // neutral factual line while it is unset) and `heroImage` (trekDetail.ts falls
    // back to the default hero image while it is unset).
  },
  {
    // TODO(content): winter catalogue stub for Munsiyari-Khalia Top. Every value marked TODO
    // below is a placeholder — ops to confirm before this listing goes live.
    "slug": "munsiyari-khalia-top",
    "name": "Munsiyari-Khalia Top",
    "price": null, // TODO(content): real price; the card shows "TBD" until set.
    "days": 3, // TODO(content): real duration.
    "nights": 2, // TODO(content): real duration.
    "region": "Uttarakhand",
    "category": "Upcoming Winter Treks",
    // TODO(content): real start/end point. Empty string makes the card fall back to the region.
    "startLocation": "",
    "difficulty": "Easy-Moderate", // TODO(content): real grade.
    // Dec/Jan/Feb is what SEASON_MAP["Winter"] in app/page.tsx matches on.
    "months": [
      "Dec",
      "Jan",
      "Feb"
    ],
    "themes": [
      "Snow"
    ]
    // TODO(content): add `tagline` (one-line card summary — TrekCard falls back to a
    // neutral factual line while it is unset) and `heroImage` (trekDetail.ts falls
    // back to the default hero image while it is unset).
  },
  {
    // TODO(content): winter catalogue stub for Kartik Swami Trek. Every value marked TODO
    // below is a placeholder — ops to confirm before this listing goes live.
    "slug": "kartik-swami-trek",
    "name": "Kartik Swami Trek",
    "price": null, // TODO(content): real price; the card shows "TBD" until set.
    "days": 3, // TODO(content): real duration.
    "nights": 2, // TODO(content): real duration.
    "region": "Uttarakhand",
    "category": "Upcoming Winter Treks",
    // TODO(content): real start/end point. Empty string makes the card fall back to the region.
    "startLocation": "",
    "difficulty": "Easy-Moderate", // TODO(content): real grade.
    // Dec/Jan/Feb is what SEASON_MAP["Winter"] in app/page.tsx matches on.
    "months": [
      "Dec",
      "Jan",
      "Feb"
    ],
    "themes": [
      "Snow"
    ]
    // TODO(content): add `tagline` (one-line card summary — TrekCard falls back to a
    // neutral factual line while it is unset) and `heroImage` (trekDetail.ts falls
    // back to the default hero image while it is unset).
  },
  {
    // TODO(content): winter catalogue stub for Auli Snow Trip. Every value marked TODO
    // below is a placeholder — ops to confirm before this listing goes live.
    "slug": "auli-snow-trip",
    "name": "Auli Snow Trip",
    "price": null, // TODO(content): real price; the card shows "TBD" until set.
    "days": 3, // TODO(content): real duration.
    "nights": 2, // TODO(content): real duration.
    "region": "Uttarakhand",
    "category": "Upcoming Winter Treks",
    // TODO(content): real start/end point. Empty string makes the card fall back to the region.
    "startLocation": "",
    "difficulty": "Easy-Moderate", // TODO(content): real grade.
    // Dec/Jan/Feb is what SEASON_MAP["Winter"] in app/page.tsx matches on.
    "months": [
      "Dec",
      "Jan",
      "Feb"
    ],
    "themes": [
      "Snow"
    ]
    // TODO(content): add `tagline` (one-line card summary — TrekCard falls back to a
    // neutral factual line while it is unset) and `heroImage` (trekDetail.ts falls
    // back to the default hero image while it is unset).
  },
  {
    // TODO(content): winter catalogue stub for Chopta with Auli. Every value marked TODO
    // below is a placeholder — ops to confirm before this listing goes live.
    "slug": "chopta-with-auli",
    "name": "Chopta with Auli",
    "price": null, // TODO(content): real price; the card shows "TBD" until set.
    "days": 3, // TODO(content): real duration.
    "nights": 2, // TODO(content): real duration.
    "region": "Uttarakhand",
    "category": "Upcoming Winter Treks",
    // TODO(content): real start/end point. Empty string makes the card fall back to the region.
    "startLocation": "",
    "difficulty": "Easy-Moderate", // TODO(content): real grade.
    // Dec/Jan/Feb is what SEASON_MAP["Winter"] in app/page.tsx matches on.
    "months": [
      "Dec",
      "Jan",
      "Feb"
    ],
    "themes": [
      "Snow"
    ]
    // TODO(content): add `tagline` (one-line card summary — TrekCard falls back to a
    // neutral factual line while it is unset) and `heroImage` (trekDetail.ts falls
    // back to the default hero image while it is unset).
  },
  {
    // TODO(content): winter catalogue stub for Chopta Snow Trip. Every value marked TODO
    // below is a placeholder — ops to confirm before this listing goes live.
    "slug": "chopta-snow-trip",
    "name": "Chopta Snow Trip",
    "price": null, // TODO(content): real price; the card shows "TBD" until set.
    "days": 3, // TODO(content): real duration.
    "nights": 2, // TODO(content): real duration.
    "region": "Uttarakhand",
    "category": "Upcoming Winter Treks",
    // TODO(content): real start/end point. Empty string makes the card fall back to the region.
    "startLocation": "",
    "difficulty": "Easy-Moderate", // TODO(content): real grade.
    // Dec/Jan/Feb is what SEASON_MAP["Winter"] in app/page.tsx matches on.
    "months": [
      "Dec",
      "Jan",
      "Feb"
    ],
    "themes": [
      "Snow"
    ]
    // TODO(content): add `tagline` (one-line card summary — TrekCard falls back to a
    // neutral factual line while it is unset) and `heroImage` (trekDetail.ts falls
    // back to the default hero image while it is unset).
  },
  {
    // TODO(content): winter catalogue stub for Munsiyari Snow Trip. Every value marked TODO
    // below is a placeholder — ops to confirm before this listing goes live.
    "slug": "munsiyari-snow-trip",
    "name": "Munsiyari Snow Trip",
    "price": null, // TODO(content): real price; the card shows "TBD" until set.
    "days": 3, // TODO(content): real duration.
    "nights": 2, // TODO(content): real duration.
    "region": "Uttarakhand",
    "category": "Upcoming Winter Treks",
    // TODO(content): real start/end point. Empty string makes the card fall back to the region.
    "startLocation": "",
    "difficulty": "Easy-Moderate", // TODO(content): real grade.
    // Dec/Jan/Feb is what SEASON_MAP["Winter"] in app/page.tsx matches on.
    "months": [
      "Dec",
      "Jan",
      "Feb"
    ],
    "themes": [
      "Snow"
    ]
    // TODO(content): add `tagline` (one-line card summary — TrekCard falls back to a
    // neutral factual line while it is unset) and `heroImage` (trekDetail.ts falls
    // back to the default hero image while it is unset).
  },
  {
    // TODO(content): winter catalogue stub for Kanatal Winter Trip. Every value marked TODO
    // below is a placeholder — ops to confirm before this listing goes live.
    "slug": "kanatal-winter-trip",
    "name": "Kanatal Winter Trip",
    "price": null, // TODO(content): real price; the card shows "TBD" until set.
    "days": 3, // TODO(content): real duration.
    "nights": 2, // TODO(content): real duration.
    "region": "Uttarakhand",
    "category": "Upcoming Winter Treks",
    // TODO(content): real start/end point. Empty string makes the card fall back to the region.
    "startLocation": "",
    "difficulty": "Easy-Moderate", // TODO(content): real grade.
    // Dec/Jan/Feb is what SEASON_MAP["Winter"] in app/page.tsx matches on.
    "months": [
      "Dec",
      "Jan",
      "Feb"
    ],
    "themes": [
      "Snow"
    ]
    // TODO(content): add `tagline` (one-line card summary — TrekCard falls back to a
    // neutral factual line while it is unset) and `heroImage` (trekDetail.ts falls
    // back to the default hero image while it is unset).
  },
  {
    // TODO(content): winter catalogue stub for Dhanaulti Snow Trip. Every value marked TODO
    // below is a placeholder — ops to confirm before this listing goes live.
    "slug": "dhanaulti-snow-trip",
    "name": "Dhanaulti Snow Trip",
    "price": null, // TODO(content): real price; the card shows "TBD" until set.
    "days": 3, // TODO(content): real duration.
    "nights": 2, // TODO(content): real duration.
    "region": "Uttarakhand",
    "category": "Upcoming Winter Treks",
    // TODO(content): real start/end point. Empty string makes the card fall back to the region.
    "startLocation": "",
    "difficulty": "Easy-Moderate", // TODO(content): real grade.
    // Dec/Jan/Feb is what SEASON_MAP["Winter"] in app/page.tsx matches on.
    "months": [
      "Dec",
      "Jan",
      "Feb"
    ],
    "themes": [
      "Snow"
    ]
    // TODO(content): add `tagline` (one-line card summary — TrekCard falls back to a
    // neutral factual line while it is unset) and `heroImage` (trekDetail.ts falls
    // back to the default hero image while it is unset).
  },
  {
    // TODO(content): winter catalogue stub for Mussoorie Winter Escape. Every value marked TODO
    // below is a placeholder — ops to confirm before this listing goes live.
    "slug": "mussoorie-winter-escape",
    "name": "Mussoorie Winter Escape",
    "price": null, // TODO(content): real price; the card shows "TBD" until set.
    "days": 3, // TODO(content): real duration.
    "nights": 2, // TODO(content): real duration.
    "region": "Uttarakhand",
    "category": "Upcoming Winter Treks",
    // TODO(content): real start/end point. Empty string makes the card fall back to the region.
    "startLocation": "",
    "difficulty": "Easy-Moderate", // TODO(content): real grade.
    // Dec/Jan/Feb is what SEASON_MAP["Winter"] in app/page.tsx matches on.
    "months": [
      "Dec",
      "Jan",
      "Feb"
    ],
    "themes": [
      "Snow"
    ]
    // TODO(content): add `tagline` (one-line card summary — TrekCard falls back to a
    // neutral factual line while it is unset) and `heroImage` (trekDetail.ts falls
    // back to the default hero image while it is unset).
  },
  {
    // TODO(content): winter catalogue stub for Chakrata Winter Trip. Every value marked TODO
    // below is a placeholder — ops to confirm before this listing goes live.
    "slug": "chakrata-winter-trip",
    "name": "Chakrata Winter Trip",
    "price": null, // TODO(content): real price; the card shows "TBD" until set.
    "days": 3, // TODO(content): real duration.
    "nights": 2, // TODO(content): real duration.
    "region": "Uttarakhand",
    "category": "Upcoming Winter Treks",
    // TODO(content): real start/end point. Empty string makes the card fall back to the region.
    "startLocation": "",
    "difficulty": "Easy-Moderate", // TODO(content): real grade.
    // Dec/Jan/Feb is what SEASON_MAP["Winter"] in app/page.tsx matches on.
    "months": [
      "Dec",
      "Jan",
      "Feb"
    ],
    "themes": [
      "Snow"
    ]
    // TODO(content): add `tagline` (one-line card summary — TrekCard falls back to a
    // neutral factual line while it is unset) and `heroImage` (trekDetail.ts falls
    // back to the default hero image while it is unset).
  },
  {
    // TODO(content): winter catalogue stub for Nainital Winter Trip. Every value marked TODO
    // below is a placeholder — ops to confirm before this listing goes live.
    "slug": "nainital-winter-trip",
    "name": "Nainital Winter Trip",
    "price": null, // TODO(content): real price; the card shows "TBD" until set.
    "days": 3, // TODO(content): real duration.
    "nights": 2, // TODO(content): real duration.
    "region": "Uttarakhand",
    "category": "Upcoming Winter Treks",
    // TODO(content): real start/end point. Empty string makes the card fall back to the region.
    "startLocation": "",
    "difficulty": "Easy-Moderate", // TODO(content): real grade.
    // Dec/Jan/Feb is what SEASON_MAP["Winter"] in app/page.tsx matches on.
    "months": [
      "Dec",
      "Jan",
      "Feb"
    ],
    "themes": [
      "Snow"
    ]
    // TODO(content): add `tagline` (one-line card summary — TrekCard falls back to a
    // neutral factual line while it is unset) and `heroImage` (trekDetail.ts falls
    // back to the default hero image while it is unset).
  },
  {
    // TODO(content): winter catalogue stub for Ranikhet Winter Trip. Every value marked TODO
    // below is a placeholder — ops to confirm before this listing goes live.
    "slug": "ranikhet-winter-trip",
    "name": "Ranikhet Winter Trip",
    "price": null, // TODO(content): real price; the card shows "TBD" until set.
    "days": 3, // TODO(content): real duration.
    "nights": 2, // TODO(content): real duration.
    "region": "Uttarakhand",
    "category": "Upcoming Winter Treks",
    // TODO(content): real start/end point. Empty string makes the card fall back to the region.
    "startLocation": "",
    "difficulty": "Easy-Moderate", // TODO(content): real grade.
    // Dec/Jan/Feb is what SEASON_MAP["Winter"] in app/page.tsx matches on.
    "months": [
      "Dec",
      "Jan",
      "Feb"
    ],
    "themes": [
      "Snow"
    ]
    // TODO(content): add `tagline` (one-line card summary — TrekCard falls back to a
    // neutral factual line while it is unset) and `heroImage` (trekDetail.ts falls
    // back to the default hero image while it is unset).
  },
  {
    // TODO(content): winter catalogue stub for Binsar Winter Escape. Every value marked TODO
    // below is a placeholder — ops to confirm before this listing goes live.
    "slug": "binsar-winter-escape",
    "name": "Binsar Winter Escape",
    "price": null, // TODO(content): real price; the card shows "TBD" until set.
    "days": 3, // TODO(content): real duration.
    "nights": 2, // TODO(content): real duration.
    "region": "Uttarakhand",
    "category": "Upcoming Winter Treks",
    // TODO(content): real start/end point. Empty string makes the card fall back to the region.
    "startLocation": "",
    "difficulty": "Easy-Moderate", // TODO(content): real grade.
    // Dec/Jan/Feb is what SEASON_MAP["Winter"] in app/page.tsx matches on.
    "months": [
      "Dec",
      "Jan",
      "Feb"
    ],
    "themes": [
      "Snow"
    ]
    // TODO(content): add `tagline` (one-line card summary — TrekCard falls back to a
    // neutral factual line while it is unset) and `heroImage` (trekDetail.ts falls
    // back to the default hero image while it is unset).
  },
  {
    // TODO(content): winter catalogue stub for Kausani Winter Trip. Every value marked TODO
    // below is a placeholder — ops to confirm before this listing goes live.
    "slug": "kausani-winter-trip",
    "name": "Kausani Winter Trip",
    "price": null, // TODO(content): real price; the card shows "TBD" until set.
    "days": 3, // TODO(content): real duration.
    "nights": 2, // TODO(content): real duration.
    "region": "Uttarakhand",
    "category": "Upcoming Winter Treks",
    // TODO(content): real start/end point. Empty string makes the card fall back to the region.
    "startLocation": "",
    "difficulty": "Easy-Moderate", // TODO(content): real grade.
    // Dec/Jan/Feb is what SEASON_MAP["Winter"] in app/page.tsx matches on.
    "months": [
      "Dec",
      "Jan",
      "Feb"
    ],
    "themes": [
      "Snow"
    ]
    // TODO(content): add `tagline` (one-line card summary — TrekCard falls back to a
    // neutral factual line while it is unset) and `heroImage` (trekDetail.ts falls
    // back to the default hero image while it is unset).
  },
  {
    // TODO(content): winter catalogue stub for Mukteshwar Winter Trip. Every value marked TODO
    // below is a placeholder — ops to confirm before this listing goes live.
    "slug": "mukteshwar-winter-trip",
    "name": "Mukteshwar Winter Trip",
    "price": null, // TODO(content): real price; the card shows "TBD" until set.
    "days": 3, // TODO(content): real duration.
    "nights": 2, // TODO(content): real duration.
    "region": "Uttarakhand",
    "category": "Upcoming Winter Treks",
    // TODO(content): real start/end point. Empty string makes the card fall back to the region.
    "startLocation": "",
    "difficulty": "Easy-Moderate", // TODO(content): real grade.
    // Dec/Jan/Feb is what SEASON_MAP["Winter"] in app/page.tsx matches on.
    "months": [
      "Dec",
      "Jan",
      "Feb"
    ],
    "themes": [
      "Snow"
    ]
    // TODO(content): add `tagline` (one-line card summary — TrekCard falls back to a
    // neutral factual line while it is unset) and `heroImage` (trekDetail.ts falls
    // back to the default hero image while it is unset).
  },
];

export const YATRAS: Trek[] = [
  {
    "slug": "chopta-tungnath-trek",
    "name": "Chopta Tungnath Trek",
    "tagline": "Tungnath — the world's highest Shiva temple — plus the Chandrashila summit and Deoria Tal, in three days from Rishikesh.",
    "price": 4999,
    "days": 3,
    "nights": 2,
    "region": "Uttarakhand",
    "category": "Spiritual Journey",
    "startLocation": "Rishikesh To Rishikesh",
    "difficulty": "Moderate",
    "months": [
      "Oct",
      "Nov",
      "Dec",
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul"
    ],
    "themes": [
      "Snow",
      "Meadow",
      "Forest",
      "Pass Crossing"
    ]
  },
  {
    "slug": "kedarnath-yatra",
    "name": "Kedarnath Trek",
    "tagline": "Four days from Haridwar to the Kedarnath shrine at 11,755 ft, with an overnight halt at the temple.",
    "price": 6499,
    "days": 4,
    "nights": 3,
    "region": "Uttarakhand",
    "category": "yatra",
    "startLocation": "Haridwar To Haridwar",
    "difficulty": "Moderate",
    "months": [
      "Oct",
      "Nov",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul"
    ],
    "themes": [
      "Snow",
      "Meadow",
      "Forest",
      "Pass Crossing"
    ],
    // TODO(content): seeded departure so this yatra qualifies for the
    // 60-day "Upcoming" filter. Replace with the real batch grid.
    "batchDates": ["2026-09-08"]
  },
  {
    "slug": "badrinath-kedarnath-yatra",
    "name": "Badrinath Kedarnath Yatra",
    "price": 11999,
    "days": 5,
    "nights": 4,
    "region": "Uttarakhand",
    "category": "Spiritual Journey",
    "startLocation": "Haridwar To Haridwar",
    "difficulty": "Moderate",
    "months": [
      "Oct",
      "Nov",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul"
    ],
    "themes": [
      "Snow",
      "Meadow",
      "Forest",
      "Pass Crossing"
    ]
  },
  {
    "slug": "kedarnath-and-tungnath-yatra",
    "name": "Kedarnath and Tungnath Trek",
    "price": 10999,
    "days": 5,
    "nights": 4,
    "region": "Uttarakhand",
    "category": "Spirituals-Journey-101",
    "startLocation": "Haridwar To Haridwar",
    "difficulty": "Moderate",
    "months": [
      "Oct",
      "Nov",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul"
    ],
    "themes": [
      "Snow",
      "Meadow",
      "Forest",
      "Pass Crossing"
    ],
    // TODO(content): seeded departure so this yatra qualifies for the
    // 60-day "Upcoming" filter. Replace with the real batch grid.
    "batchDates": ["2026-09-16"]
  },
  {
    "slug": "chardham-yatra",
    "name": "Chardham Trek",
    "tagline": "Yamunotri, Gangotri, Kedarnath and Badrinath across ten days from Haridwar or Rishikesh.",
    "price": 24999,
    "days": 10,
    "nights": 9,
    "region": "Uttarakhand",
    "category": "Spiritual Journey",
    "startLocation": "Haridwar To Haridwar",
    "difficulty": "Moderate",
    "months": [
      "Oct",
      "Nov",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul"
    ],
    "themes": [
      "Snow",
      "Meadow",
      "Forest",
      "Pass Crossing"
    ],
    // TODO(content): seeded departure so this yatra qualifies for the
    // 60-day "Upcoming" filter. Replace with the real batch grid.
    "batchDates": ["2026-10-07"]
  },
  {
    "slug": "do-dham-and-tungnath-yatra",
    "name": "Do Dham And Tungnath Trek",
    "price": 14999,
    "days": 6,
    "nights": 5,
    "region": "Uttarakhand",
    "category": "Weekend Getaways",
    "startLocation": "Haridwar To Haridwar",
    "difficulty": "Moderate",
    "months": [
      "Oct",
      "Nov",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul"
    ],
    "themes": [
      "Snow",
      "Meadow",
      "Forest",
      "Pass Crossing"
    ],
    // TODO(content): seeded departure so this yatra qualifies for the
    // 60-day "Upcoming" filter. Replace with the real batch grid.
    "batchDates": ["2026-09-23"]
  },
  {
    "slug": "kedarnath-yatra-by-helicopter",
    "name": "Kedarnath Yatra By Helicopter",
    "price": 45000,
    "days": 1,
    "nights": 0,
    "region": "Uttarakhand",
    "category": "yatra",
    "startLocation": "Dehradun to Dehradun",
    "difficulty": "Moderate",
    "months": [
      "Oct",
      "Nov",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul"
    ],
    "themes": [
      "Snow",
      "Meadow",
      "Forest",
      "Pass Crossing"
    ]
  },
  {
    "slug": "adi-kailash-om-parvat-yatra",
    "name": "Adi kailash om parvat",
    "price": 39500,
    "days": null,
    "nights": null,
    "region": "Uttarakhand",
    "category": "Weekend Getaways",
    "startLocation": "Kathgodam to Kathgodam",
    "difficulty": "Moderate",
    "months": [
      "Oct",
      "Nov",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul"
    ],
    "themes": [
      "Snow",
      "Meadow",
      "Forest",
      "Pass Crossing"
    ],
    // TODO(content): seeded departure so this yatra qualifies for the
    // 60-day "Upcoming" filter. Replace with the real batch grid.
    "batchDates": ["2026-10-14"]
  },
  {
    "slug": "chardham-yatra-by-helicopter",
    "name": "Chardham Yatra By Helicopter",
    "price": 185000,
    "days": 5,
    "nights": 4,
    "region": "Uttarakhand",
    "category": "Spiritual Journey",
    "startLocation": "Dehradun to Dehradun",
    "difficulty": "Moderate",
    "months": [
      "Oct",
      "Nov",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul"
    ],
    "themes": [
      "Snow",
      "Meadow",
      "Forest",
      "Pass Crossing"
    ]
  },
  /* --- Newly catalogued yatras -------------------------------------------
     Seeded so these routes appear in the yatra catalogue and under the
     "Upcoming" filter. Every field marked TODO(content) is a placeholder:
     `price`, `days` and `nights` are left null rather than invented (the card
     and detail page already render an empty state for null), and
     `startLocation` mirrors the existing trek of the same name. `batchDates`
     carries one seeded departure each — replace with the real batch grid.
     ---------------------------------------------------------------------- */
  {
    "slug": "do-dham-yatra",
    "name": "Do Dham Trek",
    // TODO(content): confirm this is distinct from `badrinath-kedarnath-yatra`
    // above, which covers the same two shrines under a different name.
    "tagline": "Kedarnath and Badrinath, the two Garhwal dhams, on a single guided itinerary.",
    "price": null,            // TODO(content): no published fare yet
    "days": null,             // TODO(content): duration pending
    "nights": null,           // TODO(content): duration pending
    "region": "Uttarakhand",
    "category": "Spiritual Journey",
    "startLocation": "Haridwar To Haridwar",  // TODO(content): confirm start/end
    "difficulty": "Moderate",
    "months": ["May", "Jun", "Sep", "Oct"],   // TODO(content): confirm season
    "themes": ["Snow", "Meadow", "Forest", "Pass Crossing"],  // TODO(content)
    "heroImage": "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1920&q=80",  // TODO(content): replace placeholder
    "batchDates": ["2026-09-12"]              // TODO(content): seeded departure
  },
  {
    "slug": "panch-kedar-dham-yatra",
    "name": "Panch Kedar Trek",
    // TODO(content): shares a name with `panch-kedar-yatra` in BACKPACKING_TRIPS
    // and `panch-kedar-trek` in TREKS. Slug suffixed to keep it unique; decide
    // whether this entry should instead point at one of those detail pages.
    "tagline": "Kedarnath, Tungnath, Rudranath, Madmaheshwar and Kalpeshwar — the five Shiva shrines of Garhwal.",
    "price": null,            // TODO(content): no published fare yet
    "days": null,             // TODO(content): duration pending
    "nights": null,           // TODO(content): duration pending
    "region": "Uttarakhand",
    "category": "Spiritual Journey",
    "startLocation": "Rishikesh / Haridwar",  // TODO(content): confirm start/end
    "difficulty": "Moderate",
    "months": ["May", "Jun", "Sep", "Oct"],   // TODO(content): confirm season
    "themes": ["Snow", "Meadow", "Forest", "Pass Crossing"],  // TODO(content)
    "heroImage": "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1920&q=80",  // TODO(content): replace placeholder
    "batchDates": ["2026-09-19"]              // TODO(content): seeded departure
  },
  {
    "slug": "madmaheshwar-yatra",
    "name": "Madmaheshwar Trek",
    // TODO(content): overlaps `madmaheshwar-trek` (WEEKEND_TRIPS) and
    // `madhyamaheshwar-trek-4-day` (BACKPACKING_TRIPS).
    "tagline": "The second of the Panch Kedar, reached on foot from Ransi through the Madhyamaheshwar valley.",
    "price": null,            // TODO(content): no published fare yet
    "days": null,             // TODO(content): duration pending
    "nights": null,           // TODO(content): duration pending
    "region": "Uttarakhand",
    "category": "Spiritual Journey",
    "startLocation": "Haridwar To Haridwar",  // TODO(content): confirm start/end
    "difficulty": "Moderate",
    "months": ["May", "Jun", "Sep", "Oct"],   // TODO(content): confirm season
    "themes": ["Snow", "Meadow", "Forest", "Pass Crossing"],  // TODO(content)
    "heroImage": "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1920&q=80",  // TODO(content): replace placeholder
    "batchDates": ["2026-09-26"]              // TODO(content): seeded departure
  },
  {
    "slug": "rudranath-yatra",
    "name": "Rudranath Trek",
    // TODO(content): overlaps `rudranath-trek` in BACKPACKING_TRIPS.
    "tagline": "The Shiva face shrine at Rudranath, the hardest to reach of the Panch Kedar.",
    "price": null,            // TODO(content): no published fare yet
    "days": null,             // TODO(content): duration pending
    "nights": null,           // TODO(content): duration pending
    "region": "Uttarakhand",
    "category": "Spiritual Journey",
    "startLocation": "Haridwar To Haridwar",  // TODO(content): confirm start/end
    "difficulty": "Moderate",   // TODO(content): the trip entry rates this Moderate-Difficult
    "months": ["May", "Jun", "Sep", "Oct"],   // TODO(content): confirm season
    "themes": ["Snow", "Meadow", "Forest", "Pass Crossing"],  // TODO(content)
    "heroImage": "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1920&q=80",  // TODO(content): replace placeholder
    "batchDates": ["2026-10-03"]              // TODO(content): seeded departure
  },
  {
    "slug": "har-ki-dun-yatra",
    "name": "Har Ki Dun Trek",
    // TODO(content): cross-listing of `har-ki-dun-trek` in TREKS.
    "tagline": "The valley of gods above Sankri, walked through the Mahabharata villages of the Tons.",
    "price": null,            // TODO(content): no published fare yet
    "days": null,             // TODO(content): duration pending
    "nights": null,           // TODO(content): duration pending
    "region": "Uttarakhand",
    "category": "Spiritual Journey",
    "startLocation": "Dehradun to Dehradun",  // TODO(content): confirm start/end
    "difficulty": "Moderate",
    "months": ["May", "Jun", "Sep", "Oct"],   // TODO(content): confirm season
    "themes": ["Snow", "Meadow", "Forest", "Pass Crossing"],  // TODO(content)
    "heroImage": "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1920&q=80",  // TODO(content): replace placeholder
    "batchDates": ["2026-10-10"]              // TODO(content): seeded departure
  },
  {
    "slug": "bali-pass-yatra",
    "name": "Bali Pass Trek",
    // TODO(content): cross-listing of `bali-pass-trek` in TREKS.
    "tagline": "The high crossing from Har Ki Dun to Yamunotri, linking the valley to the dham.",
    "price": null,            // TODO(content): no published fare yet
    "days": null,             // TODO(content): duration pending
    "nights": null,           // TODO(content): duration pending
    "region": "Uttarakhand",
    "category": "Spiritual Journey",
    "startLocation": "Dehradun to Dehradun",  // TODO(content): confirm start/end
    "difficulty": "Moderate",
    "months": ["May", "Jun", "Sep", "Oct"],   // TODO(content): confirm season
    "themes": ["Snow", "Meadow", "Forest", "Pass Crossing"],  // TODO(content)
    "heroImage": "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1920&q=80",  // TODO(content): replace placeholder
    "batchDates": ["2026-09-05"]              // TODO(content): seeded departure
  },
  {
    "slug": "rupin-pass-yatra",
    "name": "Rupin Pass Trek",
    // TODO(content): cross-listing of `rupin-pass-trek` in TREKS.
    "tagline": "The hanging-village crossing from Dhaula in Uttarakhand over into Sangla in Kinnaur.",
    "price": null,            // TODO(content): no published fare yet
    "days": null,             // TODO(content): duration pending
    "nights": null,           // TODO(content): duration pending
    "region": "Himachal Pradesh",   // TODO(content): route starts in Uttarakhand; TREKS files it under Himachal Pradesh
    "category": "Spiritual Journey",
    "startLocation": "Shimla to Shimla",      // TODO(content): confirm start/end
    "difficulty": "Moderate",
    "months": ["May", "Jun", "Sep", "Oct"],   // TODO(content): confirm season
    "themes": ["Snow", "Meadow", "Forest", "Pass Crossing"],  // TODO(content)
    "heroImage": "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1920&q=80",  // TODO(content): replace placeholder
    "batchDates": ["2026-09-13"]              // TODO(content): seeded departure
  },
  {
    "slug": "roopkund-yatra",
    "name": "Roopkund Trek",
    "tagline": "The glacial lake below Trishul, reached over the Ali and Bedni bugyals.",
    "price": null,            // TODO(content): no published fare yet
    "days": null,             // TODO(content): duration pending
    "nights": null,           // TODO(content): duration pending
    "region": "Uttarakhand",
    "category": "Spiritual Journey",
    "startLocation": "Rishikesh to Rishikesh",  // TODO(content): confirm start/end
    "difficulty": "Moderate",
    "months": ["May", "Jun", "Sep", "Oct"],   // TODO(content): confirm season
    "themes": ["Snow", "Meadow", "Forest", "Pass Crossing"],  // TODO(content)
    "heroImage": "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1920&q=80",  // TODO(content): replace placeholder
    "batchDates": ["2026-09-20"]              // TODO(content): seeded departure
  },
  {
    "slug": "ali-bedni-bugyal-yatra",
    "name": "Ali Bedni Bugyal Trek",
    // TODO(content): cross-listing of `ali-bedni-bugyal-trek` in TREKS.
    "tagline": "Two of the largest meadows in the Garhwal Himalaya, under the Trishul and Nanda Ghunti faces.",
    "price": null,            // TODO(content): no published fare yet
    "days": null,             // TODO(content): duration pending
    "nights": null,           // TODO(content): duration pending
    "region": "Uttarakhand",
    "category": "Spiritual Journey",
    "startLocation": "Rishikesh to Rishikesh",  // TODO(content): confirm start/end
    "difficulty": "Moderate",
    "months": ["May", "Jun", "Sep", "Oct"],   // TODO(content): confirm season
    "themes": ["Snow", "Meadow", "Forest", "Pass Crossing"],  // TODO(content)
    "heroImage": "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1920&q=80",  // TODO(content): replace placeholder
    "batchDates": ["2026-10-04"]              // TODO(content): seeded departure
  },
  {
    "slug": "phulara-ridge-yatra",
    "name": "Phulara Ridge Trek",
    // TODO(content): cross-listing of `phulara-ridge-trek` in TREKS.
    "tagline": "A rare continuous ridge walk above Sankri, open on both sides for most of a day.",
    "price": null,            // TODO(content): no published fare yet
    "days": null,             // TODO(content): duration pending
    "nights": null,           // TODO(content): duration pending
    "region": "Uttarakhand",
    "category": "Spiritual Journey",
    "startLocation": "Dehradun to Dehradun",  // TODO(content): confirm start/end
    "difficulty": "Moderate",
    "months": ["May", "Jun", "Sep", "Oct"],   // TODO(content): confirm season
    "themes": ["Snow", "Meadow", "Forest", "Pass Crossing"],  // TODO(content)
    "heroImage": "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1920&q=80",  // TODO(content): replace placeholder
    "batchDates": ["2026-10-17"]              // TODO(content): seeded departure
  },
  {
    "slug": "spiti-valley-yatra",
    "name": "Spiti Valley Trek",
    // TODO(content): cross-listing of `spiti-valley` in TREKS and BACKPACKING_TRIPS.
    "tagline": "The monastery circuit of the cold desert — Key, Dhankar, Tabo and Kaza.",
    "price": null,            // TODO(content): no published fare yet
    "days": null,             // TODO(content): duration pending
    "nights": null,           // TODO(content): duration pending
    "region": "Himachal Pradesh",
    "category": "Spiritual Journey",
    "startLocation": "Delhi To Delhi",        // TODO(content): confirm start/end
    "difficulty": "Moderate",
    "months": ["Jun", "Jul", "Aug", "Sep", "Oct"],  // TODO(content): confirm season
    "themes": ["Snow", "Meadow", "Forest", "Pass Crossing"],  // TODO(content)
    "heroImage": "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1920&q=80",  // TODO(content): replace placeholder
    "batchDates": ["2026-09-27"]              // TODO(content): seeded departure
  }
];

export const WILDLIFE: Trek[] = [
  {
    "slug": "satpura-002",
    "name": "satpura",
    "price": 12000,
    "days": 3,
    "nights": 2,
    "region": "Madhya Pradesh",
    "category": "Upcoming Wild Life Treks",
    "startLocation": "Bhopal To Satpura",
    "difficulty": "Moderate",
    "months": [
      "Oct",
      "Nov",
      "Dec",
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul"
    ],
    "themes": [
      "Snow",
      "Meadow",
      "Forest",
      "Pass Crossing"
    ]
  },
  {
    "slug": "pench-004",
    "name": "Pench",
    "price": 12000,
    "days": 3,
    "nights": 2,
    "region": "Madhya Pradesh",
    "category": "Upcoming Wild Life Treks",
    "startLocation": "Pench To Pench",
    "difficulty": "Moderate",
    "months": [
      "Oct",
      "Nov",
      "Dec",
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul"
    ],
    "themes": [
      "Snow",
      "Meadow",
      "Forest",
      "Pass Crossing"
    ]
  },
  {
    "slug": "tadoba-006",
    "name": "Tadoba",
    "price": 12000,
    "days": 3,
    "nights": 2,
    "region": "Madhya Pradesh",
    "category": "Upcoming Wild Life Treks",
    "startLocation": "Bhopal To Tadoba",
    "difficulty": "Moderate",
    "months": [
      "Oct",
      "Nov",
      "Dec",
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul"
    ],
    "themes": [
      "Snow",
      "Meadow",
      "Forest",
      "Pass Crossing"
    ]
  },
  {
    "slug": "madhai-008",
    "name": "Madhai",
    "price": 12000,
    "days": 3,
    "nights": 2,
    "region": "Madhya Pradesh",
    "category": "Upcoming Wild Life Treks",
    "startLocation": "Bhopal To Madhai",
    "difficulty": "Moderate",
    "months": [
      "Oct",
      "Nov",
      "Dec",
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul"
    ],
    "themes": [
      "Snow",
      "Meadow",
      "Forest",
      "Pass Crossing"
    ]
  },
  {
    "slug": "kanha-010",
    "name": "Kanha",
    "price": 12000,
    "days": 3,
    "nights": 2,
    "region": "Madhya Pradesh",
    "category": "Upcoming Wild Life Treks",
    "startLocation": "Bhopal To Kanha",
    "difficulty": "Moderate",
    "months": [
      "Oct",
      "Nov",
      "Dec",
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul"
    ],
    "themes": [
      "Snow",
      "Meadow",
      "Forest",
      "Pass Crossing"
    ]
  },
  {
    "slug": "pachmarhi-012",
    "name": "Pachmarhi",
    "price": 12000,
    "days": 3,
    "nights": 2,
    "region": "Madhya Pradesh",
    "category": "Upcoming Wild Life Treks",
    "startLocation": "Bhopal To  Machmarhi",
    "difficulty": "Moderate",
    "months": [
      "Oct",
      "Nov",
      "Dec",
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul"
    ],
    "themes": [
      "Snow",
      "Meadow",
      "Forest",
      "Pass Crossing"
    ]
  },
  {
    "slug": "bandhavgarh-014",
    "name": "Bandhavgarh",
    "price": 12000,
    "days": 3,
    "nights": 2,
    "region": "Madhya Pradesh",
    "category": "Upcoming Wild Life Treks",
    "startLocation": "Bhopal To  Bandhavgarh",
    "difficulty": "Moderate",
    "months": [
      "Oct",
      "Nov",
      "Dec",
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul"
    ],
    "themes": [
      "Snow",
      "Meadow",
      "Forest",
      "Pass Crossing"
    ]
  }
];

// Mock static details for Kedarkantha Trek (uid: kedarkantha-trek) to provide rich content
const kedarkanthaIndex = TREKS.findIndex(t => t.slug === 'kedarkantha-trek');
if (kedarkanthaIndex !== -1) {
  TREKS[kedarkanthaIndex].inclusions = [
    { title: "Accommodation", description: "1 night in Sankri + 3 nights in camps." },
    { title: "Meals", description: "Breakfast, lunch & dinner during the trek." },
    { title: "Transportation", description: "Dehradun → Sankri → Dehradun." },
    { title: "Trek Support", description: "Experienced trek leader & support staff." },
    { title: "Camping", description: "Tents, sleeping bags & camping equipment." },
    { title: "Permits", description: "Forest/trek permits & applicable entry charges." },
    { title: "Kitchen & Cooking Team", description: "Dedicated trek kitchen staff." },
    { title: "First Aid", description: "Basic first-aid kit & emergency support." },
    { title: "Drinking Water", description: "Access to safe drinking water during the trek." },
    { title: "Gear Support", description: "Common camping and technical equipment as required." },
    { title: "Trek Briefing", description: "Pre-trek briefing and route guidance." }
  ];

  TREKS[kedarkanthaIndex].exclusions = [
    { title: "Airfare / train tickets", description: "Travel to and from Dehradun." },
    { title: "Dehradun stay", description: "Accommodation & meals in Dehradun before/after the trek." },
    { title: "Personal expenses", description: "Snacks, beverages, laundry, etc." },
    { title: "Personal trekking gear", description: "Shoes, jackets, backpack, trekking poles, etc." },
    { title: "Personal medication", description: "Personal medication & medical expenses." },
    { title: "Emergency evacuation", description: "Evacuation / rescue costs, if required." },
    { title: "Insurance", description: "Travel & trekking insurance." },
    { title: "Additional transportation", description: "Transport needed due to route changes, delays or personal reasons." },
    { title: "Weather & roadblocks", description: "Expenses arising from bad weather, roadblocks or natural circumstances." },
    { title: "Anything not listed", description: "Any service not specifically mentioned under “Inclusions”." },
    { title: "Tips & porters", description: "Tips, porter charges for personal luggage and other optional services." },
    { title: "GST & taxes", description: "GST or applicable taxes, if not included in the advertised trek price." }
  ];

  TREKS[kedarkanthaIndex].eligibilityCriteria = [
    { icon: "User", text: "Age: 10–60 years recommended" },
    { icon: "Footprints", text: "Experience: No prior trekking experience required" },
    { icon: "Dumbbell", text: "Fitness: Basic to moderate fitness required" },
    { icon: "Mountain", text: "Altitude: Up to 12,500 ft / 3,810 m" },
    { icon: "Snowflake", text: "Must be comfortable with cold and snow conditions" },
    { icon: "Stethoscope", text: "Participants should be medically fit for high-altitude trekking" }
  ];

  TREKS[kedarkanthaIndex].fitnessCriteria = [
    { icon: "Footprints", text: "Able to walk 5–6 km comfortably" },
    { icon: "TrendingUp", text: "Able to climb 4–5 floors without excessive breathlessness" },
    { icon: "Dumbbell", text: "Good stamina and leg strength recommended" },
    { icon: "Backpack", text: "Comfortable carrying a light daypack" },
    { icon: "Activity", text: "Regular walking, jogging or stair training for 3–4 weeks before the trek is recommended" }
  ];

  TREKS[kedarkanthaIndex].howToReach = {
    intro: "Kedarkantha Trek starts from Sankri, and the most convenient gateway is Dehradun.",
    air: {
      summaryLabel: "Nearest Airport",
      summary: "Jolly Grant Airport, Dehradun (DED)",
      detail: "From the airport, reach Dehradun and continue by road to Sankri. The airport is roughly 200+ km from Sankri, and the road journey generally takes around 9–11 hours depending on conditions."
    },
    train: {
      summaryLabel: "Nearest Railway Station",
      summary: "Dehradun Railway Station",
      detail: "Dehradun is the preferred railhead for Kedarkantha. From the railway station, take a shared taxi, private cab or trek-organiser pickup to Sankri."
    },
    road: {
      summaryLabel: "Route",
      summary: "Dehradun to Sankri via Purola and Mori",
      route: ["Dehradun", "Mussoorie", "Purola", "Mori", "Naitwar", "Sankri"],
      facts: [
        { label: "Distance", value: "~190–210 km" },
        { label: "Drive", value: "~8–10 hours" },
        { label: "Options", value: "Bus / Shared Taxi / Private Cab / Tempo Traveller" }
      ]
    },
    pickup: {
      point: "Dehradun Railway Station",
      time: "6:00 AM on Day 1",
      dropPoint: "Dehradun",
      dropTime: "Evening of Day 5",
      note: "Departure from Sankri on Day 5 is at 11:00 AM."
    }
  };

  TREKS[kedarkanthaIndex].externalReviews = [
    { source: "Google", subject: "Trip My Soul", url: "https://share.google/x8Aku8JSIGelFRINg" },
    { source: "Google", subject: "Trip My Soul", url: "https://share.google/2M2aAdunUeKVgdtDg" },
    { source: "Google", subject: "Trip My Soul", url: "https://share.google/EhWe66nKh3aiOP85Q" }
  ];

  TREKS[kedarkanthaIndex].reviewVideos = [
    "https://youtube.com/shorts/v8EzIGl_q1k",
    "https://youtube.com/shorts/PsSFwQ4RlvI",
    "https://youtube.com/shorts/SVpKhsCX6qM",
    "https://youtube.com/shorts/xjakmJIDen0"
  ];

  TREKS[kedarkanthaIndex].bookingAdvancePct = 20;

  TREKS[kedarkanthaIndex].bookingTerms = [
    { title: "Trek Cost", description: "₹5,999 + 5% GST* per selected package/departure date." },
    { title: "Booking Amount", description: "20% advance payment required to confirm your seat." },
    { title: "Balance Payment", description: "Payable before/at the start of the trek as per booking terms." },
    { title: "Transportation", description: "Dehradun–Sankri–Dehradun as per the selected package." },
    { title: "Inclusions", description: "Accommodation, meals, trek permits/forest charges, trek guide & support staff as mentioned in the package." },
    { title: "Exclusions", description: "Personal expenses, insurance, emergency evacuation, additional transport and anything not specifically mentioned under inclusions." },
    { title: "GST", description: "Applicable as per package/booking terms." },
    { title: "Cancellation", description: "Cancellation and refund will be governed by Trip My Soul’s cancellation policy." },
    { title: "Weather & Route", description: "Itinerary may change due to weather, government/forest restrictions or safety conditions." },
    { title: "Personal Expenses", description: "Any expenses arising due to personal reasons will be borne by the participant." },
    { title: "ID Proof", description: "Valid government-issued ID is required at the time of booking/check-in." }
  ];

  TREKS[kedarkanthaIndex].heroImage =
    "https://images.unsplash.com/photo-1483721310020-03333e577078?auto=format&fit=crop&w=1920&q=80";

  TREKS[kedarkanthaIndex].aboutParagraphs = [
    "Kedarkantha is a summit trek in the Garhwal Himalayas, in the Uttarkashi district of Uttarakhand. The trail starts from the base village of Sankri and climbs to the Kedarkantha peak at 12,500 ft (3,810 m), covering roughly 20–24 km over 5 days and 4 nights. Graded easy to moderate, it is the route most first-time Himalayan trekkers are pointed to.",
    "From Sankri the trail rises through dense pine and oak forest to the frozen lake at Juda Ka Talab, then on to the Kedarkantha base camp on the open snow slopes below the summit ridge. Summit day begins around 2:00 AM so you reach the top for sunrise, with a 360° panorama of Swargarohini, Bandarpoonch and Black Peak, before the long descent to the forest campsite at Hargaon. Expect 4–7 hours of walking a day across forest trails, meadows, snow trails and one steep summit section.",
    "The season runs from November to April, when the whole route above Sankri is under snow. Night temperatures at the high camps fall well below 0°C, and the clear winter skies over the campsites are as much a part of the trek as the summit itself."
  ];

  TREKS[kedarkanthaIndex].highlights = [
    "Snow-covered Himalayan trails",
    "Dense pine & oak forests",
    "Spectacular sunrise from the summit",
    "360° Himalayan mountain views",
    "Winter camping experience",
    "Beautiful starry nights"
  ];

  TREKS[kedarkanthaIndex].usps = [
    {
      title: "Base village: Sankri",
      description: "The trek starts and ends at Sankri in Uttarkashi district, the trailhead village reached on a 190 km drive from Dehradun — the nearest major city, railhead and airport."
    },
    {
      title: "Famous campsite: Juda Ka Talab",
      description: "Night two is spent beside the frozen lake at Juda Ka Talab, around 9,100 ft, in a clearing ringed by pine and oak."
    },
    {
      title: "Summit sunrise at 12,500 ft",
      description: "The summit push leaves base camp around 2:00 AM so you stand on Kedarkantha peak for first light and a full Himalayan panorama."
    },
    {
      title: "4–7 hours of walking a day",
      description: "20–24 km across four trekking days, over forest trails, meadows, snow trails and steep summit sections."
    },
    {
      title: "Winter camping under the stars",
      description: "Three nights in alpine tents on snow, with night temperatures well below 0°C and some of the clearest skies in the Garhwal."
    }
  ];

  TREKS[kedarkanthaIndex].destinationHighlights = [
    { name: "Sankri", blurb: "The Garhwal trailhead village at 6,400 ft, and the road head for the trek." },
    { name: "Juda Ka Talab", blurb: "A frozen lake at about 9,100 ft, reached through dense pine and oak forest." },
    { name: "Kedarkantha Base Camp", blurb: "Open snow slopes at roughly 11,250 ft, with the summit ridge directly overhead." },
    { name: "Kedarkantha Summit", blurb: "The 12,500 ft / 3,810 m high point of the trek, looking out over Swargarohini, Bandarpoonch and Black Peak." },
    { name: "Hargaon", blurb: "A sheltered forest campsite at about 8,900 ft on the descent from the summit." }
  ];

  TREKS[kedarkanthaIndex].differentiators = [
    "Region: Garhwal Himalayas, Uttarkashi district, Uttarakhand",
    "Trek type: summit trek — Kedarkantha peak is the highest point of the route",
    "Terrain: forest trails, meadows, snow trails and steep summit sections",
    "Best experience: fresh snow, a summit sunrise and Himalayan camping"
  ];

  TREKS[kedarkanthaIndex].idealFor =
    "Beginners with good fitness, first-time Himalayan trekkers and groups looking for their first summit.";

  TREKS[kedarkanthaIndex].importantNote =
    "Winter temperatures on this route fall well below 0°C at night, and fresh snow can change the trail at any point between November and April. Carry the full winter layering list, and expect the summit-day start time to move earlier or later on your guide's call.";

  TREKS[kedarkanthaIndex].gallery = [
    { url: "https://images.unsplash.com/photo-1483721310020-03333e577078?auto=format&fit=crop&w=1200&q=80", caption: "Snow-covered trail above Sankri" },
    { url: "https://images.unsplash.com/photo-1501554728187-ce583db33af7?auto=format&fit=crop&w=900&q=80", caption: "Climbing through the pine and oak forest" },
    { url: "https://images.unsplash.com/photo-1533240332313-0db49b459ad6?auto=format&fit=crop&w=900&q=80", caption: "Camp pitched at Juda Ka Talab" },
    { url: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=900&q=80", caption: "Snow trail on the climb to base camp" },
    { url: "https://images.unsplash.com/photo-1464278533981-50106e6176b1?auto=format&fit=crop&w=900&q=80", caption: "Sunrise from the Kedarkantha summit" },
    { url: "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?auto=format&fit=crop&w=900&q=80", caption: "First light on the summit ridge" },
    { url: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=900&q=80", caption: "A clear winter night above base camp" },
    { url: "https://images.unsplash.com/photo-1486911278844-a81c5267e227?auto=format&fit=crop&w=900&q=80", caption: "Open meadows on the descent to Hargaon" }
  ];

  TREKS[kedarkanthaIndex].itinerary = [
    {
      day: 1,
      title: "Dehradun to Sankri",
      driveDistance: "190 km",
      drivingTime: "8-10 Hours",
      pickupPoint: "Dehradun Railway Station",
      pickupTime: "6:00 AM",
      altitudePoints: [
        { location: "Dehradun", m: 640, ft: 2100 },
        { location: "Sankri", m: 1950, ft: 6400 }
      ],
      altitudeGain: { m: 1310, ft: 4300 },
      description: "A scenic Himalayan drive to the beautiful village of Sankri.",
      detailedParagraphs: [
        "Your Himalayan adventure begins early morning from Dehradun. Meet our team at the designated pickup point and begin the scenic drive towards Sankri.",
        "The journey takes you through the beautiful mountain roads of Uttarakhand, passing through forests, rivers, valleys and charming Himalayan villages. Enjoy the changing landscapes as you gradually enter the remote mountain region.",
        "Reach Sankri by evening and check into your guesthouse/homestay. Take some time to relax, explore the village and prepare for the trek ahead.",
        "Enjoy dinner and an overnight stay in Sankri."
      ],
      highlights: ["Scenic Himalayan Drive", "Mountain Villages", "Sankri Village", "Trek Briefing"],
      meals: "Snacks & Dinner",
      stayType: "Guesthouse / Homestay"
    },
    {
      day: 2,
      title: "Sankri to Juda Ka Talab / Hargaon Camp",
      trekDistance: "4 km",
      trekDuration: "4-5 Hours",
      altitudePoints: [
        { location: "Sankri", m: 1950, ft: 6400 },
        { location: "Juda Ka Talab", m: 2774, ft: 9100 }
      ],
      altitudeGain: { m: 824, ft: 2700 },
      description: "Walk through enchanting pine forests to the snow-covered Juda Ka Talab.",
      detailedParagraphs: [
        "After an early breakfast, begin your trek from Sankri towards the beautiful alpine forests of the Kedarkantha trail.",
        "The trail gradually climbs through dense pine and oak forests, offering peaceful Himalayan surroundings and beautiful mountain views. During winter, the trail is often covered with snow, making the journey even more spectacular.",
        "After several hours of trekking, reach the campsite around Juda Ka Talab / Hargaon Camp, depending on the prevailing ground and camping conditions.",
        "Settle into your tents, enjoy a warm meal and spend the evening around the campsite. On clear nights, the sky offers beautiful views of countless stars.",
        "Overnight stay in tents."
      ],
      highlights: ["Pine Forests", "Snow Trails", "Himalayan Camping", "Starry Night"],
      meals: "Breakfast, Lunch & Dinner",
      stayType: "Camp"
    },
    {
      day: 3,
      title: "Juda Ka Talab to Kedarkantha Base Camp",
      trekDistance: "4 km",
      trekDuration: "4-5 Hours",
      altitudePoints: [
        { location: "Juda Ka Talab", m: 2774, ft: 9100 },
        { location: "Kedarkantha Base Camp", m: 3429, ft: 11250 }
      ],
      altitudeGain: { m: 655, ft: 2150 },
      description: "Ascend through snowy trails towards the majestic Kedarkantha Base Camp.",
      detailedParagraphs: [
        "Wake up to the peaceful Himalayan morning and enjoy breakfast at the campsite.",
        "Today’s trail takes you higher towards Kedarkantha Base Camp. As you gain altitude, the landscape gradually opens up, offering wider views of the surrounding Himalayan ranges.",
        "The trail passes through beautiful meadows and snow-covered sections, with the majestic Kedarkantha Summit becoming increasingly visible.",
        "Reach the base camp and settle into your tents. Spend the afternoon resting and acclimatizing for the early morning summit attempt.",
        "After an early dinner, get your trekking gear ready and rest well for the most exciting day of the trek."
      ],
      highlights: ["Snow Meadows", "Mountain Views", "Kedarkantha Base Camp", "Summit Preparation"],
      meals: "Breakfast, Lunch & Dinner",
      stayType: "Camp"
    },
    {
      day: 4,
      title: "Kedarkantha Base Camp to Kedarkantha Summit to Hargaon",
      trekDistance: "9 km",
      trekDuration: "7-9 Hours",
      timeNote: { label: "Summit start", value: "~2:00 AM" },
      altitudePoints: [
        { location: "Kedarkantha Base Camp", m: 3429, ft: 11250 },
        { location: "Kedarkantha Summit", m: 3810, ft: 12500 },
        { location: "Hargaon", m: 2713, ft: 8900 }
      ],
      altitudeGain: { m: 381, ft: 1250 },
      description: "Begin the summit push around 2:00 AM and chase the Himalayan sunrise from 12,500 ft before descending towards Hargaon.",
      detailedParagraphs: [
        "The most exciting day begins in the early hours of the morning.",
        "Wake up around midnight and prepare for the summit climb. After a light snack, begin the ascent towards the Kedarkantha Summit at approximately 2:00 AM.",
        "The trail becomes steeper as you climb higher, and winter conditions can make the ascent challenging. With every step, the anticipation of reaching the summit grows.",
        "Reach the summit around sunrise and witness spectacular panoramic views of the surrounding Himalayan peaks. Take some time to enjoy the breathtaking landscape and capture unforgettable moments.",
        "After spending time at the summit, begin your descent towards Hargaon. The return journey offers a completely different perspective of the trail in daylight.",
        "Reach Hargaon Camp, enjoy a well-deserved meal and relax after the long summit day.",
        "Overnight stay in camp."
      ],
      highlights: [
        "Early Morning Summit",
        "Sunrise",
        "12,500 ft Summit",
        "Panoramic Himalayan Views",
        "Snow Trek"
      ],
      meals: "Breakfast, Lunch & Dinner",
      stayType: "Camp"
    },
    {
      day: 5,
      title: "Hargaon to Sankri to Dehradun",
      trekDistance: "3 km",
      trekDuration: "2-3 Hours",
      driveDistance: "190 km",
      drivingTime: "8-10 Hours",
      timeNote: { label: "Departure", value: "11:00 AM" },
      altitudePoints: [
        { location: "Hargaon", m: 2713, ft: 8900 },
        { location: "Sankri", m: 1950, ft: 6400 },
        { location: "Dehradun", m: 640, ft: 2100 }
      ],
      altitudeGain: null,
      description: "Complete the final trek to Sankri and enjoy the scenic drive back to Dehradun as the Himalayan journey ends.",
      detailedParagraphs: [
        "Wake up at the campsite and enjoy your final Himalayan breakfast.",
        "After breakfast, begin the short descent from Hargaon towards Sankri. The trail takes you through the forest before reaching the village.",
        "Arrive in Sankri and board the vehicle for your return journey to Dehradun.",
        "Enjoy the final scenic mountain drive through the valleys and villages of Uttarakhand. The journey marks the end of your Kedarkantha adventure.",
        "Arrive in Dehradun in the evening with unforgettable memories of snow, mountains, forests and the summit."
      ],
      highlights: ["Short Forest Trek", "Sankri", "Scenic Drive", "Journey Ends"],
      meals: "Breakfast",
      // The trek ends on this day; an empty stay keeps the generic
      // "Hotel / Homestay" fallback out of the day's quick-info line.
      stayType: ""
    }
  ];

  TREKS[kedarkanthaIndex].faqs = [
    { title: "What is the Kedarkantha Trek?", description: "The Kedarkantha Trek is a famous 5-day high-altitude winter trek in Uttarkashi, Uttarakhand, offering incredible snow trails and a peak altitude of 12,500 feet." },
    { title: "Is it suitable for beginners?", description: "Yes, Kedarkantha is one of the best winter treks for beginners. It requires a basic fitness level but has clear trails and gradual ascents." },
    { title: "What is the temperature in winter?", description: "In winter, day temperatures range between 8°C and 15°C, while night temperatures can drop to -5°C or -10°C. Heavy winter gear is highly recommended." },
    { title: "When is the best season for Kedarkantha?", description: "November to April. Snow is deepest from late December through February; March and April give firmer trails with snow still lying on the summit slopes." },
    { title: "How long is the trek and how far do we walk?", description: "5 days and 4 nights, covering roughly 20–24 km on foot across four trekking days, at 4–7 hours of walking a day." },
    { title: "Where does the trek start?", description: "At Sankri, the base village in Uttarkashi district. Pickup is at 6:00 AM on Day 1 from Dehradun Railway Station, followed by a 190 km, 8-10 hour drive to Sankri." }
  ];

  TREKS[kedarkanthaIndex].batches = {
    years: {
      "2026": {
        months: [
          {
            month: "Nov",
            year: "2026",
            trips: [
              { startDate: "01 Nov", endDate: "05 Nov", status: "Open" },
              { startDate: "02 Nov", endDate: "06 Nov", status: "Open" },
              { startDate: "03 Nov", endDate: "07 Nov", status: "Open" },
              { startDate: "04 Nov", endDate: "08 Nov", status: "Open" },
              { startDate: "05 Nov", endDate: "09 Nov", status: "Open" },
              { startDate: "06 Nov", endDate: "10 Nov", status: "Open" },
              { startDate: "07 Nov", endDate: "11 Nov", status: "Open" },
              { startDate: "08 Nov", endDate: "12 Nov", status: "Open" },
              { startDate: "09 Nov", endDate: "13 Nov", status: "Open" },
              { startDate: "10 Nov", endDate: "14 Nov", status: "Open" },
              { startDate: "11 Nov", endDate: "15 Nov", status: "Open" },
              { startDate: "12 Nov", endDate: "16 Nov", status: "Open" },
              { startDate: "13 Nov", endDate: "17 Nov", status: "Open" },
              { startDate: "14 Nov", endDate: "18 Nov", status: "Open" },
              { startDate: "15 Nov", endDate: "19 Nov", status: "Open" },
              { startDate: "16 Nov", endDate: "20 Nov", status: "Open" },
              { startDate: "17 Nov", endDate: "21 Nov", status: "Open" },
              { startDate: "18 Nov", endDate: "22 Nov", status: "Open" },
              { startDate: "19 Nov", endDate: "23 Nov", status: "Open" },
              { startDate: "20 Nov", endDate: "24 Nov", status: "Open" },
              { startDate: "21 Nov", endDate: "25 Nov", status: "Open" },
              { startDate: "22 Nov", endDate: "26 Nov", status: "Open" },
              { startDate: "23 Nov", endDate: "27 Nov", status: "Open" },
              { startDate: "24 Nov", endDate: "28 Nov", status: "Open" },
              { startDate: "25 Nov", endDate: "29 Nov", status: "Open" },
              { startDate: "26 Nov", endDate: "30 Nov", status: "Open" },
              { startDate: "27 Nov", endDate: "01 Dec", status: "Open" },
              { startDate: "28 Nov", endDate: "02 Dec", status: "Open" },
              { startDate: "29 Nov", endDate: "03 Dec", status: "Open" },
              { startDate: "30 Nov", endDate: "04 Dec", status: "Open" }
            ]
          },
          {
            month: "Dec",
            year: "2026",
            trips: [
              { startDate: "01 Dec", endDate: "05 Dec", status: "Open" },
              { startDate: "02 Dec", endDate: "06 Dec", status: "Open" },
              { startDate: "03 Dec", endDate: "07 Dec", status: "Open" },
              { startDate: "04 Dec", endDate: "08 Dec", status: "Open" },
              { startDate: "05 Dec", endDate: "09 Dec", status: "Open" },
              { startDate: "06 Dec", endDate: "10 Dec", status: "Open" },
              { startDate: "07 Dec", endDate: "11 Dec", status: "Open" },
              { startDate: "08 Dec", endDate: "12 Dec", status: "Open" },
              { startDate: "09 Dec", endDate: "13 Dec", status: "Open" },
              { startDate: "10 Dec", endDate: "14 Dec", status: "Open" },
              { startDate: "11 Dec", endDate: "15 Dec", status: "Open" },
              { startDate: "12 Dec", endDate: "16 Dec", status: "Open" },
              { startDate: "13 Dec", endDate: "17 Dec", status: "Open" },
              { startDate: "14 Dec", endDate: "18 Dec", status: "Open" },
              { startDate: "15 Dec", endDate: "19 Dec", status: "Open" },
              { startDate: "16 Dec", endDate: "20 Dec", status: "Open" },
              { startDate: "17 Dec", endDate: "21 Dec", status: "Open" },
              { startDate: "18 Dec", endDate: "22 Dec", status: "Open" },
              { startDate: "19 Dec", endDate: "23 Dec", status: "Open" },
              { startDate: "20 Dec", endDate: "24 Dec", status: "Open" },
              { startDate: "21 Dec", endDate: "25 Dec", status: "Open" },
              { startDate: "22 Dec", endDate: "26 Dec", status: "Open" },
              { startDate: "23 Dec", endDate: "27 Dec", status: "Open" },
              { startDate: "24 Dec", endDate: "28 Dec", status: "Open" },
              { startDate: "25 Dec", endDate: "29 Dec", status: "Open" },
              { startDate: "26 Dec", endDate: "30 Dec", status: "Open" },
              { startDate: "27 Dec", endDate: "31 Dec", status: "Open" },
              { startDate: "28 Dec", endDate: "01 Jan", status: "Open" },
              { startDate: "29 Dec", endDate: "02 Jan", status: "Open" },
              { startDate: "30 Dec", endDate: "03 Jan", status: "Open" },
              { startDate: "31 Dec", endDate: "04 Jan", status: "Open" }
            ]
          }
        ]
      },
      "2027": {
        months: [
          {
            month: "Jan",
            year: "2027",
            trips: [
              { startDate: "01 Jan", endDate: "05 Jan", status: "Open" },
              { startDate: "02 Jan", endDate: "06 Jan", status: "Open" },
              { startDate: "03 Jan", endDate: "07 Jan", status: "Open" },
              { startDate: "04 Jan", endDate: "08 Jan", status: "Open" },
              { startDate: "05 Jan", endDate: "09 Jan", status: "Open" },
              { startDate: "06 Jan", endDate: "10 Jan", status: "Open" },
              { startDate: "07 Jan", endDate: "11 Jan", status: "Open" },
              { startDate: "08 Jan", endDate: "12 Jan", status: "Open" },
              { startDate: "09 Jan", endDate: "13 Jan", status: "Open" },
              { startDate: "10 Jan", endDate: "14 Jan", status: "Open" },
              { startDate: "11 Jan", endDate: "15 Jan", status: "Open" },
              { startDate: "12 Jan", endDate: "16 Jan", status: "Open" },
              { startDate: "13 Jan", endDate: "17 Jan", status: "Open" },
              { startDate: "14 Jan", endDate: "18 Jan", status: "Open" },
              { startDate: "15 Jan", endDate: "19 Jan", status: "Open" },
              { startDate: "16 Jan", endDate: "20 Jan", status: "Open" },
              { startDate: "17 Jan", endDate: "21 Jan", status: "Open" },
              { startDate: "18 Jan", endDate: "22 Jan", status: "Open" },
              { startDate: "19 Jan", endDate: "23 Jan", status: "Open" },
              { startDate: "20 Jan", endDate: "24 Jan", status: "Open" },
              { startDate: "21 Jan", endDate: "25 Jan", status: "Open" },
              { startDate: "22 Jan", endDate: "26 Jan", status: "Open" },
              { startDate: "23 Jan", endDate: "27 Jan", status: "Open" },
              { startDate: "24 Jan", endDate: "28 Jan", status: "Open" },
              { startDate: "25 Jan", endDate: "29 Jan", status: "Open" },
              { startDate: "26 Jan", endDate: "30 Jan", status: "Open" },
              { startDate: "27 Jan", endDate: "31 Jan", status: "Open" },
              { startDate: "28 Jan", endDate: "01 Feb", status: "Open" },
              { startDate: "29 Jan", endDate: "02 Feb", status: "Open" },
              { startDate: "30 Jan", endDate: "03 Feb", status: "Open" },
              { startDate: "31 Jan", endDate: "04 Feb", status: "Open" }
            ]
          },
          {
            month: "Feb",
            year: "2027",
            trips: [
              { startDate: "01 Feb", endDate: "05 Feb", status: "Open" },
              { startDate: "02 Feb", endDate: "06 Feb", status: "Open" },
              { startDate: "03 Feb", endDate: "07 Feb", status: "Open" },
              { startDate: "04 Feb", endDate: "08 Feb", status: "Open" },
              { startDate: "05 Feb", endDate: "09 Feb", status: "Open" },
              { startDate: "06 Feb", endDate: "10 Feb", status: "Open" },
              { startDate: "07 Feb", endDate: "11 Feb", status: "Open" },
              { startDate: "08 Feb", endDate: "12 Feb", status: "Open" },
              { startDate: "09 Feb", endDate: "13 Feb", status: "Open" },
              { startDate: "10 Feb", endDate: "14 Feb", status: "Open" },
              { startDate: "11 Feb", endDate: "15 Feb", status: "Open" },
              { startDate: "12 Feb", endDate: "16 Feb", status: "Open" },
              { startDate: "13 Feb", endDate: "17 Feb", status: "Open" },
              { startDate: "14 Feb", endDate: "18 Feb", status: "Open" },
              { startDate: "15 Feb", endDate: "19 Feb", status: "Open" },
              { startDate: "16 Feb", endDate: "20 Feb", status: "Open" },
              { startDate: "17 Feb", endDate: "21 Feb", status: "Open" },
              { startDate: "18 Feb", endDate: "22 Feb", status: "Open" },
              { startDate: "19 Feb", endDate: "23 Feb", status: "Open" },
              { startDate: "20 Feb", endDate: "24 Feb", status: "Open" },
              { startDate: "21 Feb", endDate: "25 Feb", status: "Open" },
              { startDate: "22 Feb", endDate: "26 Feb", status: "Open" },
              { startDate: "23 Feb", endDate: "27 Feb", status: "Open" },
              { startDate: "24 Feb", endDate: "28 Feb", status: "Open" },
              { startDate: "25 Feb", endDate: "01 Mar", status: "Open" },
              { startDate: "26 Feb", endDate: "02 Mar", status: "Open" },
              { startDate: "27 Feb", endDate: "03 Mar", status: "Open" },
              { startDate: "28 Feb", endDate: "04 Mar", status: "Open" }
            ]
          },
          {
            month: "Mar",
            year: "2027",
            trips: [
              { startDate: "01 Mar", endDate: "05 Mar", status: "Open" },
              { startDate: "02 Mar", endDate: "06 Mar", status: "Open" },
              { startDate: "03 Mar", endDate: "07 Mar", status: "Open" },
              { startDate: "04 Mar", endDate: "08 Mar", status: "Open" },
              { startDate: "05 Mar", endDate: "09 Mar", status: "Open" },
              { startDate: "06 Mar", endDate: "10 Mar", status: "Open" },
              { startDate: "07 Mar", endDate: "11 Mar", status: "Open" },
              { startDate: "08 Mar", endDate: "12 Mar", status: "Open" },
              { startDate: "09 Mar", endDate: "13 Mar", status: "Open" },
              { startDate: "10 Mar", endDate: "14 Mar", status: "Open" },
              { startDate: "11 Mar", endDate: "15 Mar", status: "Open" },
              { startDate: "12 Mar", endDate: "16 Mar", status: "Open" },
              { startDate: "13 Mar", endDate: "17 Mar", status: "Open" },
              { startDate: "14 Mar", endDate: "18 Mar", status: "Open" },
              { startDate: "15 Mar", endDate: "19 Mar", status: "Open" },
              { startDate: "16 Mar", endDate: "20 Mar", status: "Open" },
              { startDate: "17 Mar", endDate: "21 Mar", status: "Open" },
              { startDate: "18 Mar", endDate: "22 Mar", status: "Open" },
              { startDate: "19 Mar", endDate: "23 Mar", status: "Open" },
              { startDate: "20 Mar", endDate: "24 Mar", status: "Open" },
              { startDate: "21 Mar", endDate: "25 Mar", status: "Open" },
              { startDate: "22 Mar", endDate: "26 Mar", status: "Open" },
              { startDate: "23 Mar", endDate: "27 Mar", status: "Open" },
              { startDate: "24 Mar", endDate: "28 Mar", status: "Open" },
              { startDate: "25 Mar", endDate: "29 Mar", status: "Open" },
              { startDate: "26 Mar", endDate: "30 Mar", status: "Open" },
              { startDate: "27 Mar", endDate: "31 Mar", status: "Open" },
              { startDate: "28 Mar", endDate: "01 Apr", status: "Open" },
              { startDate: "29 Mar", endDate: "02 Apr", status: "Open" },
              { startDate: "30 Mar", endDate: "03 Apr", status: "Open" },
              { startDate: "31 Mar", endDate: "04 Apr", status: "Open" }
            ]
          },
          {
            month: "Apr",
            year: "2027",
            trips: [
              { startDate: "01 Apr", endDate: "05 Apr", status: "Open" },
              { startDate: "02 Apr", endDate: "06 Apr", status: "Open" },
              { startDate: "03 Apr", endDate: "07 Apr", status: "Open" },
              { startDate: "04 Apr", endDate: "08 Apr", status: "Open" },
              { startDate: "05 Apr", endDate: "09 Apr", status: "Open" },
              { startDate: "06 Apr", endDate: "10 Apr", status: "Open" },
              { startDate: "07 Apr", endDate: "11 Apr", status: "Open" },
              { startDate: "08 Apr", endDate: "12 Apr", status: "Open" },
              { startDate: "09 Apr", endDate: "13 Apr", status: "Open" },
              { startDate: "10 Apr", endDate: "14 Apr", status: "Open" },
              { startDate: "11 Apr", endDate: "15 Apr", status: "Open" },
              { startDate: "12 Apr", endDate: "16 Apr", status: "Open" },
              { startDate: "13 Apr", endDate: "17 Apr", status: "Open" },
              { startDate: "14 Apr", endDate: "18 Apr", status: "Open" },
              { startDate: "15 Apr", endDate: "19 Apr", status: "Open" },
              { startDate: "16 Apr", endDate: "20 Apr", status: "Open" },
              { startDate: "17 Apr", endDate: "21 Apr", status: "Open" },
              { startDate: "18 Apr", endDate: "22 Apr", status: "Open" },
              { startDate: "19 Apr", endDate: "23 Apr", status: "Open" },
              { startDate: "20 Apr", endDate: "24 Apr", status: "Open" },
              { startDate: "21 Apr", endDate: "25 Apr", status: "Open" },
              { startDate: "22 Apr", endDate: "26 Apr", status: "Open" },
              { startDate: "23 Apr", endDate: "27 Apr", status: "Open" },
              { startDate: "24 Apr", endDate: "28 Apr", status: "Open" },
              { startDate: "25 Apr", endDate: "29 Apr", status: "Open" },
              { startDate: "26 Apr", endDate: "30 Apr", status: "Open" },
              { startDate: "27 Apr", endDate: "01 May", status: "Open" },
              { startDate: "28 Apr", endDate: "02 May", status: "Open" },
              { startDate: "29 Apr", endDate: "03 May", status: "Open" },
              { startDate: "30 Apr", endDate: "04 May", status: "Open" }
            ]
          }
        ]
      }
    }
  };

  const buranGhatiIndex = TREKS.findIndex(t => t.slug === 'buran-ghati-pass-trek');
  if (buranGhatiIndex !== -1) {
    TREKS[buranGhatiIndex].itinerary = [
      {
        day: 1,
        title: "Drive from Shimla to Janglik",
        driveDistance: "150 km",
        drivingTime: "7-8 Hours",
        altitudePoints: [
          { location: "Shimla", m: 2200, ft: 7200 },
          { location: "Janglik", m: 2870, ft: 9415 }
        ],
        altitudeGain: { m: 670, ft: 2215 },
        detailedDescription: "Board the morning vehicle at Shimla. The drive is exceptionally scenic, passing through the beautiful pine woods of Pabbar valley and crossing Rohru. Reach the heritage village of Janglik, where we will check into a local homestay.",
        meals: "Dinner",
        stayType: "Janglik Homestay"
      },
      {
        day: 2,
        title: "Janglik to Dayara Meadows",
        trekDistance: "4 km",
        trekDuration: "5 Hours",
        altitudePoints: [
          { location: "Janglik", m: 2870, ft: 9415 },
          { location: "Dayara", m: 3375, ft: 11075 }
        ],
        altitudeGain: { m: 505, ft: 1660 },
        detailedDescription: "The trek starts from Janglik village, climbing steadily through oak and pine forests. You will cross local wooden houses and streams before emerging into the vast, open rolling green fields of Dayara Meadows.",
        meals: "Breakfast, Lunch, Dinner",
        stayType: "Dayara Campsite"
      },
      {
        day: 3,
        title: "Dayara to Litham",
        trekDistance: "3 km",
        trekDuration: "3 Hours",
        altitudePoints: [
          { location: "Dayara", m: 3375, ft: 11075 },
          { location: "Litham", m: 3577, ft: 11737 }
        ],
        altitudeGain: { m: 202, ft: 662 },
        detailedDescription: "A gentle walk through alpine forests and alongside the bubbling Pabbar River. Litham campsite sits at a beautiful confluence, surrounded by tall snow-clad ridges on all sides.",
        meals: "Breakfast, Lunch, Dinner",
        stayType: "Litham Campsite"
      },
      {
        day: 4,
        title: "Excursion to Chandranahan Lake",
        trekDistance: "6 km",
        trekDuration: "6 Hours",
        altitudePoints: [
          { location: "Litham", m: 3577, ft: 11737 },
          { location: "Chandranahan Lake", m: 4236, ft: 13900 },
          { location: "Litham", m: 3577, ft: 11737 }
        ],
        altitudeGain: { m: 659, ft: 2163 },
        detailedDescription: "Climb steeply along the waterfall trail to the source of the Pabbar River: the sacred glacial lakes of Chandranahan. The lakes remain surrounded by snow most of the year. Descend back to Litham for hot snacks.",
        meals: "Breakfast, Lunch, Dinner",
        stayType: "Litham Campsite"
      },
      {
        day: 5,
        title: "Litham to Dhunda Camp",
        trekDistance: "5 km",
        trekDuration: "5 Hours",
        altitudePoints: [
          { location: "Litham", m: 3577, ft: 11737 },
          { location: "Dhunda", m: 4073, ft: 13365 }
        ],
        altitudeGain: { m: 496, ft: 1628 },
        detailedDescription: "Enter the rugged alpine moraine zone, climbing steadily along the high ridges. Dhunda base camp offers panoramic views of the Buran Ghati pass summit and surrounding towers.",
        meals: "Breakfast, Lunch, Dinner",
        stayType: "Dhunda Campsite"
      },
      {
        day: 6,
        title: "Dhunda to Munirang via Buran Ghati Pass",
        trekDistance: "7 km",
        trekDuration: "8 Hours",
        altitudePoints: [
          { location: "Dhunda", m: 4073, ft: 13365 },
          { location: "Buran Ghati Pass", m: 4572, ft: 15000 },
          { location: "Munirang", m: 3596, ft: 11800 }
        ],
        altitudeGain: { m: 499, ft: 1635 },
        detailedDescription: "Wake up at 3:30 AM for the summit climb. Climb steep snow slopes to reach the pass summit (15,000 ft). Experience the thrilling vertical slide down the ice wall before descending to Munirang camp.",
        meals: "Breakfast, Lunch, Dinner",
        stayType: "Munirang Campsite"
      },
      {
        day: 7,
        title: "Munirang to Barua & Drive to Shimla",
        trekDistance: "5 km",
        trekDuration: "3 Hours",
        driveDistance: "240 km",
        drivingTime: "9 Hours",
        altitudePoints: [
          { location: "Munirang", m: 3596, ft: 11800 },
          { location: "Barua", m: 2042, ft: 6700 },
          { location: "Shimla", m: 2200, ft: 7200 }
        ],
        altitudeGain: null,
        detailedDescription: "Trek down through lush apple orchards and Kinnauri heritage villages to Barua. Board the vehicle for the drive back to Shimla railway station via the national highway.",
        meals: "Breakfast, Lunch",
        stayType: "Travel / Homestay"
      }
    ];
  }
}
