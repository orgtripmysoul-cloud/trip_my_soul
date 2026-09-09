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
 * Two shapes are supported. A link-only entry stores just `url` and where it
 * lives, leaving the rating, wording and author on the platform. An entry that
 * also carries `text` reproduces the review here, transcribed from the
 * published original — quote it verbatim and keep the author's own name on it.
 */
export interface ExternalReview {
  /** Platform the review sits on, e.g. "Google". */
  source: string;
  /** Who or what the review is about, e.g. "Trip My Soul". */
  subject: string;
  /** Link to the review on its platform. Omitted where there is no share link. */
  url?: string;
  /** Reviewer's display name on the platform, e.g. "Niha B". */
  author?: string;
  /** Star rating out of 5, as published. */
  rating?: number;
  /** Age as the platform words it, e.g. "a year ago". */
  date?: string;
  /** The review verbatim, one entry per paragraph. */
  text?: string[];
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

/** One block of a long-form guide: an optional heading and its prose. */
export interface ArticleSection {
  /** Omitted on the opening block, which runs straight into prose under the title. */
  heading?: string;
  paragraphs: string[];
}

/**
 * A written guide published against a listing, rendered in full in the Article
 * section. Listings without one fall back to the generic teaser card that
 * points at the blog.
 */
export interface ArticleContent {
  title: string;
  /** Standfirst printed under the title. */
  standfirst?: string;
  readMinutes?: number;
  /** Lead image. Falls back to the listing's hero when unset. */
  image?: string;
  sections: ArticleSection[];
  /** Sign-off line printed after the last section. */
  signoff?: string;
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
  /**
   * Slugs to show under "Similar …", in this order. Set it where the pairing is
   * an editorial call; leave it unset to fall back to the automatic match on
   * region and difficulty. Slugs that resolve to nothing are skipped.
   */
  similarTreks?: string[];
  relatedArticles?: RelatedArticle[];
  /** Long-form written guide for this listing, shown in the Article section. */
  article?: ArticleContent;
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
  /**
   * Extra hero photos. When two or more are set, the detail-page hero runs them
   * as a slideshow; otherwise `heroImage` is shown on its own.
   */
  heroImages?: string[];
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
    "tagline": "Four days from Dehradun to one of India's largest alpine meadows, at 12,000 ft above the base village of Raithal.",
    "price": 6499,
    "days": 4,
    "nights": 3,
    "region": "Uttarakhand",
    "category": "Upcoming Winter Treks",
    "startLocation": "Raithal",
    "difficulty": "Easy to Moderate",
    "maxAltitude": "12,000 ft / 3,658 m",
    "totalDistance": "20–25 Kilometers",
    "availability": "September – June",
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
    "tagline": "Six days from Dehradun over Lord Curzon's trail to the 12,516 ft Kuari Pass, facing Nanda Devi, Dronagiri, Kamet and Chaukhamba.",
    "price": 7999,
    "days": 6,
    "nights": 5,
    "region": "Uttarakhand",
    "category": "Upcoming Winter Treks",
    "startLocation": "Dehradun To Dehradun",
    "endLocation": "Dehradun",
    "difficulty": "Moderate",
    "maxAltitude": "12,516 ft / 3,815 m",
    "totalDistance": "30–35 Kilometers",
    "availability": "December – June & September – November",
    "months": [
      "Sep",
      "Oct",
      "Nov",
      "Dec",
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun"
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
    "tagline": "Five days from Rishikesh through the oak forests above Lohajung to the frozen Brahmatal Lake and a 12,200 ft ridge facing Trishul and Nanda Ghunti.",
    "price": 6499,
    "days": 5,
    "nights": 4,
    "region": "Uttarakhand",
    "category": "Upcoming Winter Treks",
    "startLocation": "Rishikesh To Rishikesh",
    "endLocation": "Rishikesh",
    "difficulty": "Easy to Moderate",
    "maxAltitude": "12,200 ft / 3,719 m",
    "totalDistance": "22–24 Kilometers",
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
    "name": "Nag Tibba Trek",
    "tagline": "Two days from Dehradun through the oak forests above Pantwari to the 9,915 ft Nag Tibba summit.",
    "price": 3499,
    "days": 2,
    "nights": 1,
    "region": "Uttarakhand",
    "category": "Upcoming Winter Treks",
    "startLocation": "Dehradun To Dehradun",
    "endLocation": "Dehradun",
    "difficulty": "Easy to Moderate",
    "maxAltitude": "9,915 ft / 3,022 m",
    "totalDistance": "15–16 Kilometers",
    "availability": "October – June",
    "months": [
      "Oct",
      "Nov",
      "Dec",
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun"
    ],
    "themes": [
      "Snow",
      "Meadow",
      "Forest",
      "Summit"
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
    "availability": "September – December & March – June",
    "months": [
      "Sep",
      "Oct",
      "Nov",
      "Dec",
      "Mar",
      "Apr",
      "May",
      "Jun"
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
    "name": "Chopta Tungnath Chandrashila Trek",
    "tagline": "Tungnath — the world's highest Shiva temple — the 4,000 m Chandrashila summit and Deoriatal, in three days from Rishikesh.",
    "price": 4999,
    "days": 3,
    "nights": 2,
    "region": "Uttarakhand",
    "category": "Spiritual Journey",
    "startLocation": "Rishikesh To Rishikesh",
    "endLocation": "Rishikesh",
    "difficulty": "Easy to Moderate",
    "maxAltitude": "13,123 ft / 4,000 m",
    "totalDistance": "15–17 Kilometers",
    "availability": "April – June & September – November; winter departures December – March, snow permitting",
    // July and August are left out: the trail runs through the Garhwal monsoon.
    "months": [
      "Sep",
      "Oct",
      "Nov",
      "Dec",
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun"
    ],
    "themes": [
      "Snow",
      "Meadow",
      "Forest",
      "Summit",
      "Pilgrimage"
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
    "/Trips_gallery/Kedarkantha/IMG_4120.JPG.jpeg";

  TREKS[kedarkanthaIndex].heroImages = [
    "/Trips_gallery/Kedarkantha/IMG_4130.JPG.jpeg",
    "/Trips_gallery/Kedarkantha/IMG_4138.JPG.jpeg",
    "/Trips_gallery/Kedarkantha/IMG_4139.JPG.jpeg"
  ];

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
    { url: "/Trips_gallery/Kedarkantha/IMG_4120.JPG.jpeg", caption: "Snowbound pine forest above Sankri" },
    { url: "/Trips_gallery/Kedarkantha/IMG_4121.JPG.jpeg", caption: "On the trail to Juda Ka Talab" },
    { url: "/Trips_gallery/Kedarkantha/IMG_4122.JPG.jpeg", caption: "Camp pitched under the pines" },
    { url: "/Trips_gallery/Kedarkantha/IMG_4123.JPG.jpeg", caption: "Climbing towards Kedarkantha base camp" },
    { url: "/Trips_gallery/Kedarkantha/IMG_4124.JPG.jpeg", caption: "Open snow slopes below the summit ridge" },
    { url: "/Trips_gallery/Kedarkantha/IMG_4125.JPG.jpeg", caption: "Summit morning on Kedarkantha" },
    { url: "/Trips_gallery/Kedarkantha/IMG_4126.JPG.jpeg", caption: "Himalayan panorama from the top" },
    { url: "/Trips_gallery/Kedarkantha/IMG_4127.JPG.jpeg", caption: "Warming up at the campsite" },
    { url: "/Trips_gallery/Kedarkantha/IMG_4128.JPG.jpeg", caption: "The team on the trail" },
    { url: "/Trips_gallery/Kedarkantha/IMG_4129.JPG.jpeg", caption: "Descending towards Hargaon" },
    { url: "/Trips_gallery/Kedarkantha/IMG_4130.JPG.jpeg", caption: "Snowbound pine forest above Sankri" },
    { url: "/Trips_gallery/Kedarkantha/IMG_4131.JPG.jpeg", caption: "On the trail to Juda Ka Talab" },
    { url: "/Trips_gallery/Kedarkantha/IMG_4132.JPG.jpeg", caption: "Camp pitched under the pines" },
    { url: "/Trips_gallery/Kedarkantha/IMG_4133.JPG.jpeg", caption: "Climbing towards Kedarkantha base camp" },
    { url: "/Trips_gallery/Kedarkantha/IMG_4134.JPG.jpeg", caption: "Open snow slopes below the summit ridge" },
    { url: "/Trips_gallery/Kedarkantha/IMG_4135.JPG.jpeg", caption: "Summit morning on Kedarkantha" },
    { url: "/Trips_gallery/Kedarkantha/IMG_4137.JPG.jpeg", caption: "Himalayan panorama from the top" },
    { url: "/Trips_gallery/Kedarkantha/IMG_4138.JPG.jpeg", caption: "Warming up at the campsite" },
    { url: "/Trips_gallery/Kedarkantha/IMG_4139.JPG.jpeg", caption: "The team on the trail" },
    { url: "/Trips_gallery/Kedarkantha/IMG_4140.JPG.jpeg", caption: "Descending towards Hargaon" },
    { url: "/Trips_gallery/Kedarkantha/IMG_4141.JPG.jpeg", caption: "Snowbound pine forest above Sankri" },
    { url: "/Trips_gallery/Kedarkantha/IMG_4142.JPG.jpeg", caption: "On the trail to Juda Ka Talab" },
    { url: "/Trips_gallery/Kedarkantha/IMG_4143.JPG.jpeg", caption: "Camp pitched under the pines" },
    { url: "/Trips_gallery/Kedarkantha/IMG_4144.JPG.jpeg", caption: "Climbing towards Kedarkantha base camp" },
    { url: "/Trips_gallery/Kedarkantha/IMG_4145.JPG.jpeg", caption: "Open snow slopes below the summit ridge" },
    { url: "/Trips_gallery/Kedarkantha/IMG_4146.JPG.jpeg", caption: "Summit morning on Kedarkantha" },
    { url: "/Trips_gallery/Kedarkantha/IMG_4147.JPG.jpeg", caption: "Himalayan panorama from the top" },
    { url: "/Trips_gallery/Kedarkantha/IMG_4148.JPG.jpeg", caption: "Warming up at the campsite" },
    { url: "/Trips_gallery/Kedarkantha/IMG_4149.JPG.jpeg", caption: "The team on the trail" },
    { url: "/Trips_gallery/Kedarkantha/IMG_4150.JPG.jpeg", caption: "Descending towards Hargaon" },
    { url: "/Trips_gallery/Kedarkantha/IMG_4153.JPG.jpeg", caption: "Snowbound pine forest above Sankri" },
    { url: "/Trips_gallery/Kedarkantha/IMG_4154.JPG.jpeg", caption: "On the trail to Juda Ka Talab" },
    { url: "/Trips_gallery/Kedarkantha/IMG_4155.JPG.jpeg", caption: "Camp pitched under the pines" },
    { url: "/Trips_gallery/Kedarkantha/IMG_4156.JPG.jpeg", caption: "Climbing towards Kedarkantha base camp" },
    { url: "/Trips_gallery/Kedarkantha/IMG_4157.JPG.jpeg", caption: "Open snow slopes below the summit ridge" },
    { url: "/Trips_gallery/Kedarkantha/IMG_4158.JPG.jpeg", caption: "Summit morning on Kedarkantha" },
    { url: "/Trips_gallery/Kedarkantha/IMG_4160.JPG.jpeg", caption: "Himalayan panorama from the top" },
    { url: "/Trips_gallery/Kedarkantha/IMG_4161.JPG.jpeg", caption: "Warming up at the campsite" },
    { url: "/Trips_gallery/Kedarkantha/IMG_4162.JPG.jpeg", caption: "The team on the trail" },
    { url: "/Trips_gallery/Kedarkantha/IMG_4163.JPG.jpeg", caption: "Descending towards Hargaon" },
    { url: "/Trips_gallery/Kedarkantha/IMG_4164.JPG.jpeg", caption: "Snowbound pine forest above Sankri" },
    { url: "/Trips_gallery/Kedarkantha/IMG_4165.JPG.jpeg", caption: "On the trail to Juda Ka Talab" },
    { url: "/Trips_gallery/Kedarkantha/IMG_4166.JPG.jpeg", caption: "Camp pitched under the pines" },
    { url: "/Trips_gallery/Kedarkantha/IMG_4167.JPG.jpeg", caption: "Climbing towards Kedarkantha base camp" },
    { url: "/Trips_gallery/Kedarkantha/IMG_4168.JPG.jpeg", caption: "Open snow slopes below the summit ridge" },
    { url: "/Trips_gallery/Kedarkantha/IMG_4172.JPG.jpeg", caption: "Summit morning on Kedarkantha" },
    { url: "/Trips_gallery/Kedarkantha/IMG_4173.JPG.jpeg", caption: "Himalayan panorama from the top" },
    { url: "/Trips_gallery/Kedarkantha/IMG_4174.JPG.jpeg", caption: "Warming up at the campsite" },
    { url: "/Trips_gallery/Kedarkantha/IMG_4175.JPG.jpeg", caption: "The team on the trail" },
    { url: "/Trips_gallery/Kedarkantha/IMG_4176.JPG.jpeg", caption: "Descending towards Hargaon" },
    { url: "/Trips_gallery/Kedarkantha/IMG_4178.JPG.jpeg", caption: "Snowbound pine forest above Sankri" }
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

  TREKS[kedarkanthaIndex].article = {
    title: "Kedarkantha Trek: Where Winter Turns Into a Memory",
    standfirst:
      "Silent pine forests, snow-covered trails, star-filled nights and a summit sunrise over the Garhwal Himalayas — the classic winter trek, told the way it is felt.",
    readMinutes: 7,
    sections: [
      {
        paragraphs: [
          "There are some journeys you take for adventure.",
          "And then there are journeys that stay with you long after you return home.",
          "Kedarkantha Trek is one of them.",
          "Hidden deep in the Garhwal Himalayas of Uttarakhand, Kedarkantha is more than a winter trek. It is a journey through silent pine forests, snow-covered trails, frozen landscapes, star-filled nights and finally, a summit where the first rays of the sun touch the Himalayan peaks.",
          "If you have ever dreamed of waking up surrounded by snow, walking through a forest that feels untouched by time, and standing on a Himalayan summit watching the mountains turn golden at sunrise — Kedarkantha is calling."
        ]
      },
      {
        heading: "Why Kedarkantha Is So Special",
        paragraphs: [
          "The magic of Kedarkantha begins long before you reach the summit.",
          "Your journey takes you from Dehradun to Sankri, a beautiful mountain village and the gateway to the trek. As the road climbs deeper into the Himalayas, the landscape slowly changes. Cities disappear, forests become denser and the mountains begin to feel closer.",
          "Then comes the walk.",
          "Pine and oak forests surround the trail. In winter, snow slowly takes over the landscape. Every step feels different. Every turn opens another beautiful view.",
          "And at night, when the camp becomes quiet, you look up.",
          "Thousands of stars fill the Himalayan sky.",
          "For many trekkers, that moment becomes one of the most unforgettable memories of the entire journey."
        ]
      },
      {
        heading: "The Journey Through Snow",
        paragraphs: [
          "Kedarkantha is famous for its beautiful campsites, especially Juda Ka Talab.",
          "Walking towards Juda Ka Talab in winter feels almost unreal. Tall trees covered with snow stand quietly around the trail, while your footsteps create the only sound in the forest.",
          "There is no rush.",
          "You simply walk, breathe and take it all in.",
          "The cold may challenge you, but the beauty keeps pulling you forward.",
          "As you gain altitude, the forest slowly opens into wider landscapes. Snow-covered slopes replace dense trees, and the mighty Himalayan peaks begin appearing in the distance."
        ]
      },
      {
        heading: "The Summit Morning",
        paragraphs: [
          "And then comes the moment everyone has been waiting for.",
          "Summit Day.",
          "The alarm rings in the middle of the night. It is cold, dark and sometimes difficult to leave the warmth of your sleeping bag.",
          "But you get up.",
          "Headlamps light the trail as you begin climbing towards the summit.",
          "Every step becomes a conversation between your body and your mind.",
          "“Bas thoda aur…”",
          "The climb can be challenging, but eventually the darkness begins to disappear.",
          "The horizon starts changing colour.",
          "And then the sun rises.",
          "Standing at around 12,500 feet, watching the first sunlight fall across the Himalayan ranges, you suddenly understand why people fall in love with the mountains.",
          "You forget the cold.",
          "You forget the tired legs.",
          "You forget the difficult climb.",
          "For a few moments, there is only you, the mountains and the sunrise."
        ]
      },
      {
        heading: "A Trek That Changes You",
        paragraphs: [
          "Kedarkantha doesn’t promise luxury.",
          "It gives you something better.",
          "Perspective.",
          "In the mountains, you realise how little you actually need.",
          "A warm jacket.",
          "A pair of trekking shoes.",
          "A hot meal.",
          "A tent.",
          "A few good people beside you.",
          "And a sky full of stars.",
          "The mountains slow everything down.",
          "There are no endless notifications. No traffic. No deadlines.",
          "Just the sound of your footsteps and the wind moving through the trees.",
          "And somewhere between the first step and the summit, you may discover a quieter version of yourself."
        ]
      },
      {
        heading: "Is Kedarkantha Good for Beginners?",
        paragraphs: [
          "Yes.",
          "Kedarkantha is widely considered one of the classic Himalayan winter treks and can be a great introduction to snow trekking for people with reasonable fitness.",
          "You don’t need to be an experienced mountaineer.",
          "But you do need preparation.",
          "Regular walking, jogging, stair climbing and basic strength training before the trek can make a significant difference.",
          "Because the mountains don’t ask you to be the strongest.",
          "They simply ask you to keep going."
        ]
      },
      {
        heading: "Best Time to Do the Kedarkantha Trek",
        paragraphs: [
          "Kedarkantha is especially popular during the winter months when the landscape transforms into a snow-covered wonderland.",
          "The typical snow season is December to April, although actual snow conditions vary from year to year.",
          "If snow is the dream, winter is the season to experience Kedarkantha at its most magical."
        ]
      },
      {
        heading: "What Makes the Trek Memorable?",
        paragraphs: [
          "It isn’t just the summit.",
          "It is the entire journey.",
          "The first glimpse of snow.",
          "The laughter inside the tent.",
          "The hot cup of tea after a long climb.",
          "The person you met on the trail who somehow becomes a friend.",
          "The silence of the forest.",
          "The stars you rarely see from the city.",
          "And that feeling when you finally stand on the summit and realise:",
          "You actually made it."
        ]
      },
      {
        heading: "Leave With Memories, Not Just Photographs",
        paragraphs: [
          "Kedarkantha is not just a destination to tick off your travel list.",
          "It is a story you carry back.",
          "A story of cold mornings, tired feet, warm friendships, snowy trails and a sunrise that made every difficult step worth it.",
          "Maybe that is why people return to the Himalayas again and again.",
          "Because once the mountains become a part of your soul, home never feels quite the same."
        ]
      },
      {
        heading: "Come Walk With Us",
        paragraphs: [
          "At Trip My Soul, we believe a trek should be more than reaching a destination.",
          "It should be about the people you meet, the stories you create and the moments you carry home.",
          "Kedarkantha is waiting.",
          "The trail is calling.",
          "Pack your courage. Leave the ordinary behind.",
          "And come find your moment in the mountains."
        ]
      }
    ],
    signoff: "Trip My Soul — Travel Far. Feel More."
  };

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

// Static details for Dayara Bugyal Trek (uid: dayara-bugyal-trek), the Raithal
// meadow trail. Eligibility, fitness and the departure calendar mirror
// Kedarkantha, as do trek essentials (packing list) and the cancellation
// policy — both are deliberately left unset so this listing renders the same
// shared copy from `trekDefaults.ts` / `TrekCancellation`.
const dayaraBugyalIndex = TREKS.findIndex(t => t.slug === 'dayara-bugyal-trek');
if (dayaraBugyalIndex !== -1) {
  TREKS[dayaraBugyalIndex].inclusions = [
    { title: "Accommodation", description: "1 night in Raithal + 2 nights in camps." },
    { title: "Meals", description: "Breakfast, lunch & dinner during the trek." },
    { title: "Transportation", description: "Dehradun → Raithal → Dehradun." },
    { title: "Trek Support", description: "Experienced trek leader & support staff." },
    { title: "Camping", description: "Tents, sleeping bags & camping equipment." },
    { title: "Permits", description: "Forest/trek permits & applicable entry charges." },
    { title: "Kitchen & Cooking Team", description: "Dedicated trek kitchen staff." },
    { title: "First Aid", description: "Basic first-aid kit & emergency support." },
    { title: "Drinking Water", description: "Access to safe drinking water during the trek." },
    { title: "Gear Support", description: "Common camping and technical equipment as required." },
    { title: "Trek Briefing", description: "Pre-trek briefing and route guidance." }
  ];

  TREKS[dayaraBugyalIndex].exclusions = [
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

  // The criteria Kedarkantha publishes, with the altitude row set to this
  // trek's own high point.
  TREKS[dayaraBugyalIndex].eligibilityCriteria = [
    { icon: "User", text: "Age: 10–60 years recommended" },
    { icon: "Footprints", text: "Experience: No prior trekking experience required" },
    { icon: "Dumbbell", text: "Fitness: Basic to moderate fitness required" },
    { icon: "Mountain", text: "Altitude: Up to 12,000 ft / 3,658 m" },
    { icon: "Snowflake", text: "Must be comfortable with cold and snow conditions" },
    { icon: "Stethoscope", text: "Participants should be medically fit for high-altitude trekking" }
  ];

  TREKS[dayaraBugyalIndex].fitnessCriteria = [
    { icon: "Footprints", text: "Able to walk 5–6 km comfortably" },
    { icon: "TrendingUp", text: "Able to climb 4–5 floors without excessive breathlessness" },
    { icon: "Dumbbell", text: "Good stamina and leg strength recommended" },
    { icon: "Backpack", text: "Comfortable carrying a light daypack" },
    { icon: "Activity", text: "Regular walking, jogging or stair training for 3–4 weeks before the trek is recommended" }
  ];

  TREKS[dayaraBugyalIndex].howToReach = {
    intro: "Dayara Bugyal Trek starts from Raithal Village in Uttarkashi, and the most convenient gateway is Dehradun.",
    air: {
      summaryLabel: "Nearest Airport",
      summary: "Jolly Grant Airport, Dehradun (DED)",
      detail: "The nearest airport is Jolly Grant Airport, Dehradun, approximately 190–200 km from Raithal. From the airport, you can hire a taxi or take the planned transport towards Raithal."
    },
    train: {
      summaryLabel: "Nearest Railway Station",
      summary: "Dehradun Railway Station",
      detail: "The nearest major railway station is Dehradun Railway Station. Dehradun is well connected with major cities including Delhi. From Dehradun, continue by road towards Raithal. Regular buses and shared vehicles also run from Dehradun to Uttarkashi, from where a local taxi or shared vehicle continues towards Raithal."
    },
    road: {
      summaryLabel: "Route",
      summary: "Dehradun to Raithal via Uttarkashi and Bhatwari",
      route: ["Dehradun", "Uttarkashi", "Bhatwari", "Raithal"],
      facts: [
        { label: "Distance", value: "~190–200 km" },
        { label: "Drive", value: "~7–9 hours" },
        { label: "Options", value: "Bus / Shared Taxi / Private Cab / Tempo Traveller" }
      ]
    },
    pickup: {
      point: "Dehradun Railway Station",
      time: "6:00 AM on Day 1",
      dropPoint: "Dehradun",
      dropTime: "Evening of Day 4",
      note: "For TMS departures the trek starts with a pickup from Dehradun, followed by the drive to Raithal Village, the base village for the Dayara Bugyal Trek."
    }
  };

  TREKS[dayaraBugyalIndex].bookingAdvancePct = 20;

  TREKS[dayaraBugyalIndex].bookingTerms = [
    { title: "Trek Cost", description: "₹6,499 + 5% GST* per selected package/departure date." },
    { title: "Booking Amount", description: "20% advance payment required to confirm your seat." },
    { title: "Balance Payment", description: "Payable before/at the start of the trek as per booking terms." },
    { title: "Transportation", description: "Dehradun–Raithal–Dehradun as per the selected package." },
    { title: "Inclusions", description: "Accommodation, meals, trek permits/forest charges, trek guide & support staff as mentioned in the package." },
    { title: "Exclusions", description: "Personal expenses, insurance, emergency evacuation, additional transport and anything not specifically mentioned under inclusions." },
    { title: "GST", description: "Applicable as per package/booking terms." },
    { title: "Cancellation", description: "Cancellation and refund will be governed by Trip My Soul’s cancellation policy." },
    { title: "Weather & Route", description: "Itinerary may change due to weather, government/forest restrictions or safety conditions." },
    { title: "Personal Expenses", description: "Any expenses arising due to personal reasons will be borne by the participant." },
    { title: "ID Proof", description: "Valid government-issued ID is required at the time of booking/check-in." }
  ];

  TREKS[dayaraBugyalIndex].aboutParagraphs = [
    "Dayara Bugyal is a high-altitude alpine meadow trek in the Garhwal Himalayas, in the Uttarkashi district of Uttarakhand. The trail starts from the base village of Raithal and climbs to the Dayara meadows at roughly 12,000 ft (3,658 m), covering about 20–25 km over 4 days and 3 nights. Graded easy to moderate, it is one of the gentler routes into the high Himalaya and suits a first-time trekker with reasonable fitness.",
    "From Raithal the trail rises through dense oak and rhododendron forest to the campsite at Gui, then opens out onto the bugyal itself — one of the largest alpine meadows in the country, rolling across the mountainside with the high Garhwal peaks standing behind it. Day three is spent walking across the meadow and back down to Gui, and the final day descends the same forest trail to Raithal for the drive back to Dehradun.",
    "The route runs through most of the year. March to June and September to December give green meadows and the clearest mountain views; December to February turns the whole bugyal white, with snow deep enough to change the character of the trek entirely. Snow conditions vary from year to year."
  ];

  TREKS[dayaraBugyalIndex].highlights = [
    "One of India’s largest alpine meadows",
    "Oak & rhododendron forests above Raithal",
    "Panoramic Garhwal Himalayan views",
    "Camping at the Gui campsite",
    "Winter snow across the meadows",
    "Himalayan sunsets and starry nights"
  ];

  TREKS[dayaraBugyalIndex].usps = [
    {
      title: "Base village: Raithal",
      description: "The trek starts and ends at Raithal in Uttarkashi district, reached on a 190–200 km drive from Dehradun — the nearest major city, railhead and airport."
    },
    {
      title: "The bugyal itself",
      description: "Day three crosses the open meadows of Dayara Bugyal at roughly 12,000 ft, with the Garhwal Himalaya along the skyline and no summit push to rush you across it."
    },
    {
      title: "Two nights at the Gui campsite",
      description: "Camp is pitched at Gui, a clearing in the forest above Raithal, and stays there for both trekking nights — so the meadow day is walked with a light daypack."
    },
    {
      title: "4–6 hours of walking a day",
      description: "20–25 km across three trekking days, over forest trails, open meadows and, in winter, snow."
    },
    {
      title: "A short trek that still reaches 12,000 ft",
      description: "4 days and 3 nights from Dehradun and back, gradual enough for a first Himalayan trek but high enough to feel like one."
    }
  ];

  TREKS[dayaraBugyalIndex].destinationHighlights = [
    { name: "Raithal", blurb: "The Garhwal base village above the Bhagirathi valley, and the road head for the trek." },
    { name: "Gui Campsite", blurb: "A forest clearing at about 9,700 ft, reached through oak and rhododendron, and the campsite for both trek nights." },
    { name: "Dayara Bugyal", blurb: "The meadow the trek is named for — open grassland at roughly 12,000 ft, under snow through the winter months." },
    { name: "Bhatwari", blurb: "The last town on the drive in, on the Uttarkashi–Gangotri road below Raithal." }
  ];

  TREKS[dayaraBugyalIndex].differentiators = [
    "Region: Garhwal Himalayas, Uttarkashi district, Uttarakhand",
    "Trek type: alpine meadow trek — Dayara Bugyal at ~12,000 ft is the high point of the route",
    "Terrain: forest trails, open meadows and, in winter, snow",
    "Best experience: vast bugyals, wide Himalayan views and an unhurried pace"
  ];

  TREKS[dayaraBugyalIndex].similarTreks = [
    "kedarkantha-trek",
    "brahmatal-trek",
    "phulara-ridge-trek",
    "kuari-pass-trek"
  ];

  TREKS[dayaraBugyalIndex].idealFor =
    "First-time trekkers, travellers who want the Himalaya without a summit push, families and groups looking for a short high-altitude trail.";

  TREKS[dayaraBugyalIndex].importantNote =
    "Between December and February the meadows lie under snow and night temperatures at Gui fall below 0°C, so carry the full winter layering list. Snow cover varies from year to year, and the itinerary may be adjusted by your trek leader on weather, forest-department or safety grounds.";

  TREKS[dayaraBugyalIndex].itinerary = [
    {
      day: 1,
      title: "Dehradun to Raithal",
      driveDistance: "190–200 km",
      drivingTime: "7-9 Hours",
      pickupPoint: "Dehradun Railway Station",
      pickupTime: "6:00 AM",
      altitudePoints: [
        { location: "Dehradun", m: 640, ft: 2100 },
        { location: "Raithal", m: 2300, ft: 7545 }
      ],
      altitudeGain: { m: 1660, ft: 5445 },
      description: "A scenic Himalayan drive to Raithal, the base village of the Dayara Bugyal Trek.",
      detailedParagraphs: [
        "Your Himalayan journey begins early morning from Dehradun. Meet our team at the designated pickup point and begin the drive towards Raithal.",
        "The road follows the Bhagirathi valley through Uttarkashi and Bhatwari, passing rivers, forests and Garhwali villages. As the road climbs, the mountains grow taller and the familiar world slowly disappears behind you.",
        "Reach Raithal by evening and check into your guesthouse or homestay. Take some time to relax, walk through the village and prepare for the trek ahead.",
        "Enjoy dinner and an overnight stay in Raithal."
      ],
      highlights: ["Bhagirathi Valley Drive", "Uttarkashi & Bhatwari", "Raithal Village", "Trek Briefing"],
      meals: "Snacks & Dinner",
      stayType: "Guesthouse / Homestay"
    },
    {
      day: 2,
      title: "Raithal to Gui Campsite",
      trekDistance: "6 km",
      trekDuration: "4-5 Hours",
      altitudePoints: [
        { location: "Raithal", m: 2300, ft: 7545 },
        { location: "Gui", m: 2957, ft: 9700 }
      ],
      altitudeGain: { m: 657, ft: 2155 },
      description: "Climb out of Raithal through oak and rhododendron forest to the Gui campsite.",
      detailedParagraphs: [
        "After breakfast the trek begins. The trail leaves Raithal and enters dense oak and rhododendron forest almost immediately.",
        "The climb is steady rather than steep, and the forest stays with you for most of the day. You may find yourself slowing down without realising it — there is no hurry here, and the mountains have their own pace.",
        "In winter this whole section carries snow, on the trail, the branches and the forest floor.",
        "By afternoon you reach the Gui campsite, a clearing in the forest above the village. Settle into your tent, eat a warm meal and let your body begin adjusting to the altitude.",
        "Overnight stay in tents at Gui."
      ],
      highlights: ["Oak & Rhododendron Forest", "Gui Campsite", "Himalayan Camping", "Starry Night"],
      meals: "Breakfast, Lunch & Dinner",
      stayType: "Gui campsite — twin sharing"
    },
    {
      day: 3,
      title: "Gui to Dayara Bugyal and back to Gui",
      trekDistance: "8 km",
      trekDuration: "6-7 Hours",
      altitudePoints: [
        { location: "Gui", m: 2957, ft: 9700 },
        { location: "Dayara Bugyal", m: 3658, ft: 12000 },
        { location: "Gui", m: 2957, ft: 9700 }
      ],
      altitudeGain: { m: 701, ft: 2300 },
      description: "The highlight of the trek — the forest opens into the vast meadows of Dayara Bugyal at 12,000 ft.",
      detailedParagraphs: [
        "Leave camp after breakfast with a light daypack. The trail climbs steadily through the last of the forest.",
        "And then the forest ends. The landscape opens into the magnificent Dayara Bugyal — endless meadows stretched across the mountainside like a green carpet, with the Himalaya standing quietly in the distance. In winter, the same meadows lie under snow.",
        "Take your time here. Walk across the open grassland, sit down, look at the clouds and listen to the wind moving across the meadow. Sometimes, doing nothing in the mountains is exactly what the heart needs.",
        "After exploring the bugyal, retrace the trail back down to Gui, carrying photographs on your camera and rather more than that in your head.",
        "Watch the sun go down behind the mountains from the campsite, and spend a second night in tents at Gui."
      ],
      highlights: ["Dayara Bugyal Meadows", "12,000 ft", "Panoramic Himalayan Views", "Himalayan Sunset"],
      meals: "Breakfast, Lunch & Dinner",
      stayType: "Gui campsite — twin sharing"
    },
    {
      day: 4,
      title: "Gui to Raithal to Dehradun",
      trekDistance: "6 km",
      trekDuration: "3-4 Hours",
      driveDistance: "190–200 km",
      drivingTime: "7-9 Hours",
      altitudePoints: [
        { location: "Gui", m: 2957, ft: 9700 },
        { location: "Raithal", m: 2300, ft: 7545 },
        { location: "Dehradun", m: 640, ft: 2100 }
      ],
      altitudeGain: null,
      description: "Descend the forest trail to Raithal and drive back to Dehradun as the journey ends.",
      detailedParagraphs: [
        "Wake up at the campsite and enjoy your final Himalayan breakfast.",
        "The descent from Gui to Raithal follows the same trail you climbed two days ago — but it no longer feels unfamiliar. You remember the bends, the trees, the campsite and the people you walked with.",
        "Arrive in Raithal and board the vehicle for the return journey to Dehradun.",
        "Enjoy the last scenic drive back down the Bhagirathi valley, reaching Dehradun in the evening with the meadows still fresh in your memory."
      ],
      highlights: ["Forest Descent", "Raithal", "Scenic Drive", "Journey Ends"],
      meals: "Breakfast",
      // The trek ends on this day; an empty stay keeps the generic
      // "Hotel / Homestay" fallback out of the day's quick-info line.
      stayType: ""
    }
  ];

  TREKS[dayaraBugyalIndex].faqs = [
    { title: "What is the Dayara Bugyal Trek?", description: "Dayara Bugyal is a beautiful high-altitude alpine meadow trek in Uttarkashi, Uttarakhand, famous for its vast meadows, oak and rhododendron forests and spectacular Himalayan views." },
    { title: "How many days is the Dayara Bugyal Trek?", description: "The trek is a 4 Days / 3 Nights adventure following the route Raithal → Gui → Dayara Bugyal → Gui → Raithal." },
    { title: "What is the difficulty level of Dayara Bugyal Trek?", description: "It is generally rated Easy to Moderate and is suitable for beginners with reasonable fitness." },
    { title: "What is the highest altitude of the trek?", description: "The trek reaches approximately 12,000 ft, depending on the exact route and viewpoints covered." },
    { title: "What is the total trekking distance?", description: "The complete trekking distance is approximately 20–25 km, depending on the trail and exploration on Day 3." },
    { title: "What is the best time to do Dayara Bugyal Trek?", description: "The best seasons are March to June and September to December. For snow, December to February is generally preferred, subject to weather and trail conditions." },
    { title: "Where does the Dayara Bugyal Trek start?", description: "The trek starts from Raithal Village, Uttarkashi, which is the base village for this itinerary." },
    { title: "Is Dayara Bugyal suitable for first-time trekkers?", description: "Yes. The gradual ascent and moderate trail make it a good option for first-time trekkers, provided they are physically prepared for high-altitude trekking." },
    { title: "How can I reach Raithal?", description: "Raithal can be reached by road from Dehradun via Rishikesh, Chamba, Uttarkashi and Bhatwari. TMS departures can include transportation from Dehradun." },
    { title: "Is Dayara Bugyal covered with snow in winter?", description: "Yes. During the winter months, Dayara Bugyal can receive significant snowfall and the meadows can transform into a beautiful snow-covered Himalayan landscape. Snow conditions vary each year." }
  ];

  TREKS[dayaraBugyalIndex].article = {
    title: "Dayara Bugyal Trek: Where the Mountains Teach You to Breathe Again",
    standfirst:
      "Oak forests above Raithal, a campsite at Gui and one of the largest alpine meadows in the country — a four-day Himalayan walk with enough room in it to actually stop and look around.",
    readMinutes: 6,
    sections: [
      {
        paragraphs: [
          "Some journeys are measured in kilometres.",
          "Some are measured in memories.",
          "The Dayara Bugyal Trek is one of those rare journeys where every step takes you a little further away from the noise of everyday life and a little closer to yourself.",
          "Starting from the beautiful Raithal Village in Uttarakhand, the journey begins quietly. The roads become narrower, the mountains become taller, and the familiar world slowly disappears behind you. Soon, there is nothing but pine and oak forests, mountain air and the sound of your own footsteps.",
          "The trail from Raithal to Gui Campsite is where the real adventure begins. Walking through the forest, you may find yourself slowing down without even realising it. There is no hurry here. The mountains have their own pace.",
          "And then comes the moment you’ve been walking for."
        ]
      },
      {
        heading: "When the Forest Opens",
        paragraphs: [
          "As you leave the forest behind, the landscape suddenly opens into the magnificent Dayara Bugyal.",
          "Endless meadows stretch across the mountains like a green carpet, with the mighty Himalayas standing quietly in the distance. For a moment, you simply stop.",
          "You look around.",
          "And you realise why people travel so far to walk through these mountains.",
          "The wind feels different here.",
          "The sky feels bigger.",
          "And somehow, your worries feel smaller."
        ]
      },
      {
        heading: "A Day in the Meadows",
        paragraphs: [
          "The journey from Gui to Dayara Bugyal is the highlight of the trek. Walking across the open meadows, surrounded by Himalayan peaks, feels less like trekking and more like stepping into another world.",
          "Take your time.",
          "Sit on the grass.",
          "Look at the clouds.",
          "Listen to the wind moving across the meadow.",
          "You don’t have to do anything.",
          "Sometimes, doing nothing in the mountains is exactly what the heart needs.",
          "After spending time exploring Dayara Bugyal, you return to Gui, carrying photographs on your camera — but much more importantly, carrying moments in your heart."
        ]
      },
      {
        heading: "When the Sun Goes Down",
        paragraphs: [
          "There is something magical about a Himalayan sunset.",
          "As the sun begins to disappear behind the mountains, the sky slowly changes its colours. The conversations around the campsite become quieter. Someone makes tea. Someone looks at the mountains. Someone simply sits there, lost in thought.",
          "And for a few minutes, nobody checks their phone.",
          "Nobody thinks about work.",
          "Nobody worries about tomorrow.",
          "You are simply there.",
          "Present."
        ]
      },
      {
        heading: "The Journey Back",
        paragraphs: [
          "The final descent from Gui to Raithal can feel surprisingly emotional.",
          "The same trail that felt unfamiliar a few days ago now feels like something you know. You remember the bends, the trees, the campsite and the people you walked with.",
          "And somewhere along the way, you realise that the trek wasn’t really about reaching Dayara Bugyal.",
          "It was about everything that happened while you were getting there.",
          "The tired legs.",
          "The laughter.",
          "The quiet moments.",
          "The unexpected friendships.",
          "The first view of the meadow.",
          "The sunrise you woke up early for.",
          "And the night you looked up and saw a sky full of stars."
        ]
      },
      {
        heading: "Why Dayara Bugyal?",
        paragraphs: [
          "The Dayara Bugyal Trek from Raithal is perfect for travellers who want to experience the Himalayas without rushing through them. The 4 Days / 3 Nights journey takes you through forests, mountain trails and vast alpine meadows, with enough time to actually pause and enjoy the surroundings.",
          "It is a trek for the first-time trekker.",
          "For the tired traveller.",
          "For the person looking for a little peace.",
          "And perhaps, for anyone who simply wants to disconnect from the world for a few days."
        ]
      },
      {
        heading: "Come Back With More Than Memories",
        paragraphs: [
          "You may forget the exact distance you walked.",
          "You may forget how many hours you trekked.",
          "But you probably won’t forget the first time you stood in the middle of Dayara Bugyal and saw the Himalayas stretching endlessly before you.",
          "Because some places don’t just become photographs.",
          "They become a part of you.",
          "Dayara Bugyal is not just a trek.",
          "It is a pause from life.",
          "A breath of fresh mountain air.",
          "A journey through the Himalayas.",
          "And a reminder that sometimes, the best way to find yourself is to simply walk away from everything for a while."
        ]
      }
    ],
    signoff: "Trip My Soul — Travel Far. Feel More."
  };

  TREKS[dayaraBugyalIndex].batches = {
    years: {
      "2026": {
        months: [
          {
            month: "Nov",
            year: "2026",
            trips: [
              { startDate: "01 Nov", endDate: "04 Nov", status: "Open" },
              { startDate: "02 Nov", endDate: "05 Nov", status: "Open" },
              { startDate: "03 Nov", endDate: "06 Nov", status: "Open" },
              { startDate: "04 Nov", endDate: "07 Nov", status: "Open" },
              { startDate: "05 Nov", endDate: "08 Nov", status: "Open" },
              { startDate: "06 Nov", endDate: "09 Nov", status: "Open" },
              { startDate: "07 Nov", endDate: "10 Nov", status: "Open" },
              { startDate: "08 Nov", endDate: "11 Nov", status: "Open" },
              { startDate: "09 Nov", endDate: "12 Nov", status: "Open" },
              { startDate: "10 Nov", endDate: "13 Nov", status: "Open" },
              { startDate: "11 Nov", endDate: "14 Nov", status: "Open" },
              { startDate: "12 Nov", endDate: "15 Nov", status: "Open" },
              { startDate: "13 Nov", endDate: "16 Nov", status: "Open" },
              { startDate: "14 Nov", endDate: "17 Nov", status: "Open" },
              { startDate: "15 Nov", endDate: "18 Nov", status: "Open" },
              { startDate: "16 Nov", endDate: "19 Nov", status: "Open" },
              { startDate: "17 Nov", endDate: "20 Nov", status: "Open" },
              { startDate: "18 Nov", endDate: "21 Nov", status: "Open" },
              { startDate: "19 Nov", endDate: "22 Nov", status: "Open" },
              { startDate: "20 Nov", endDate: "23 Nov", status: "Open" },
              { startDate: "21 Nov", endDate: "24 Nov", status: "Open" },
              { startDate: "22 Nov", endDate: "25 Nov", status: "Open" },
              { startDate: "23 Nov", endDate: "26 Nov", status: "Open" },
              { startDate: "24 Nov", endDate: "27 Nov", status: "Open" },
              { startDate: "25 Nov", endDate: "28 Nov", status: "Open" },
              { startDate: "26 Nov", endDate: "29 Nov", status: "Open" },
              { startDate: "27 Nov", endDate: "30 Nov", status: "Open" },
              { startDate: "28 Nov", endDate: "01 Dec", status: "Open" },
              { startDate: "29 Nov", endDate: "02 Dec", status: "Open" },
              { startDate: "30 Nov", endDate: "03 Dec", status: "Open" }
            ]
          },
          {
            month: "Dec",
            year: "2026",
            trips: [
              { startDate: "01 Dec", endDate: "04 Dec", status: "Open" },
              { startDate: "02 Dec", endDate: "05 Dec", status: "Open" },
              { startDate: "03 Dec", endDate: "06 Dec", status: "Open" },
              { startDate: "04 Dec", endDate: "07 Dec", status: "Open" },
              { startDate: "05 Dec", endDate: "08 Dec", status: "Open" },
              { startDate: "06 Dec", endDate: "09 Dec", status: "Open" },
              { startDate: "07 Dec", endDate: "10 Dec", status: "Open" },
              { startDate: "08 Dec", endDate: "11 Dec", status: "Open" },
              { startDate: "09 Dec", endDate: "12 Dec", status: "Open" },
              { startDate: "10 Dec", endDate: "13 Dec", status: "Open" },
              { startDate: "11 Dec", endDate: "14 Dec", status: "Open" },
              { startDate: "12 Dec", endDate: "15 Dec", status: "Open" },
              { startDate: "13 Dec", endDate: "16 Dec", status: "Open" },
              { startDate: "14 Dec", endDate: "17 Dec", status: "Open" },
              { startDate: "15 Dec", endDate: "18 Dec", status: "Open" },
              { startDate: "16 Dec", endDate: "19 Dec", status: "Open" },
              { startDate: "17 Dec", endDate: "20 Dec", status: "Open" },
              { startDate: "18 Dec", endDate: "21 Dec", status: "Open" },
              { startDate: "19 Dec", endDate: "22 Dec", status: "Open" },
              { startDate: "20 Dec", endDate: "23 Dec", status: "Open" },
              { startDate: "21 Dec", endDate: "24 Dec", status: "Open" },
              { startDate: "22 Dec", endDate: "25 Dec", status: "Open" },
              { startDate: "23 Dec", endDate: "26 Dec", status: "Open" },
              { startDate: "24 Dec", endDate: "27 Dec", status: "Open" },
              { startDate: "25 Dec", endDate: "28 Dec", status: "Open" },
              { startDate: "26 Dec", endDate: "29 Dec", status: "Open" },
              { startDate: "27 Dec", endDate: "30 Dec", status: "Open" },
              { startDate: "28 Dec", endDate: "31 Dec", status: "Open" },
              { startDate: "29 Dec", endDate: "01 Jan", status: "Open" },
              { startDate: "30 Dec", endDate: "02 Jan", status: "Open" },
              { startDate: "31 Dec", endDate: "03 Jan", status: "Open" }
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
              { startDate: "01 Jan", endDate: "04 Jan", status: "Open" },
              { startDate: "02 Jan", endDate: "05 Jan", status: "Open" },
              { startDate: "03 Jan", endDate: "06 Jan", status: "Open" },
              { startDate: "04 Jan", endDate: "07 Jan", status: "Open" },
              { startDate: "05 Jan", endDate: "08 Jan", status: "Open" },
              { startDate: "06 Jan", endDate: "09 Jan", status: "Open" },
              { startDate: "07 Jan", endDate: "10 Jan", status: "Open" },
              { startDate: "08 Jan", endDate: "11 Jan", status: "Open" },
              { startDate: "09 Jan", endDate: "12 Jan", status: "Open" },
              { startDate: "10 Jan", endDate: "13 Jan", status: "Open" },
              { startDate: "11 Jan", endDate: "14 Jan", status: "Open" },
              { startDate: "12 Jan", endDate: "15 Jan", status: "Open" },
              { startDate: "13 Jan", endDate: "16 Jan", status: "Open" },
              { startDate: "14 Jan", endDate: "17 Jan", status: "Open" },
              { startDate: "15 Jan", endDate: "18 Jan", status: "Open" },
              { startDate: "16 Jan", endDate: "19 Jan", status: "Open" },
              { startDate: "17 Jan", endDate: "20 Jan", status: "Open" },
              { startDate: "18 Jan", endDate: "21 Jan", status: "Open" },
              { startDate: "19 Jan", endDate: "22 Jan", status: "Open" },
              { startDate: "20 Jan", endDate: "23 Jan", status: "Open" },
              { startDate: "21 Jan", endDate: "24 Jan", status: "Open" },
              { startDate: "22 Jan", endDate: "25 Jan", status: "Open" },
              { startDate: "23 Jan", endDate: "26 Jan", status: "Open" },
              { startDate: "24 Jan", endDate: "27 Jan", status: "Open" },
              { startDate: "25 Jan", endDate: "28 Jan", status: "Open" },
              { startDate: "26 Jan", endDate: "29 Jan", status: "Open" },
              { startDate: "27 Jan", endDate: "30 Jan", status: "Open" },
              { startDate: "28 Jan", endDate: "31 Jan", status: "Open" },
              { startDate: "29 Jan", endDate: "01 Feb", status: "Open" },
              { startDate: "30 Jan", endDate: "02 Feb", status: "Open" },
              { startDate: "31 Jan", endDate: "03 Feb", status: "Open" }
            ]
          },
          {
            month: "Feb",
            year: "2027",
            trips: [
              { startDate: "01 Feb", endDate: "04 Feb", status: "Open" },
              { startDate: "02 Feb", endDate: "05 Feb", status: "Open" },
              { startDate: "03 Feb", endDate: "06 Feb", status: "Open" },
              { startDate: "04 Feb", endDate: "07 Feb", status: "Open" },
              { startDate: "05 Feb", endDate: "08 Feb", status: "Open" },
              { startDate: "06 Feb", endDate: "09 Feb", status: "Open" },
              { startDate: "07 Feb", endDate: "10 Feb", status: "Open" },
              { startDate: "08 Feb", endDate: "11 Feb", status: "Open" },
              { startDate: "09 Feb", endDate: "12 Feb", status: "Open" },
              { startDate: "10 Feb", endDate: "13 Feb", status: "Open" },
              { startDate: "11 Feb", endDate: "14 Feb", status: "Open" },
              { startDate: "12 Feb", endDate: "15 Feb", status: "Open" },
              { startDate: "13 Feb", endDate: "16 Feb", status: "Open" },
              { startDate: "14 Feb", endDate: "17 Feb", status: "Open" },
              { startDate: "15 Feb", endDate: "18 Feb", status: "Open" },
              { startDate: "16 Feb", endDate: "19 Feb", status: "Open" },
              { startDate: "17 Feb", endDate: "20 Feb", status: "Open" },
              { startDate: "18 Feb", endDate: "21 Feb", status: "Open" },
              { startDate: "19 Feb", endDate: "22 Feb", status: "Open" },
              { startDate: "20 Feb", endDate: "23 Feb", status: "Open" },
              { startDate: "21 Feb", endDate: "24 Feb", status: "Open" },
              { startDate: "22 Feb", endDate: "25 Feb", status: "Open" },
              { startDate: "23 Feb", endDate: "26 Feb", status: "Open" },
              { startDate: "24 Feb", endDate: "27 Feb", status: "Open" },
              { startDate: "25 Feb", endDate: "28 Feb", status: "Open" },
              { startDate: "26 Feb", endDate: "01 Mar", status: "Open" },
              { startDate: "27 Feb", endDate: "02 Mar", status: "Open" },
              { startDate: "28 Feb", endDate: "03 Mar", status: "Open" }
            ]
          },
          {
            month: "Mar",
            year: "2027",
            trips: [
              { startDate: "01 Mar", endDate: "04 Mar", status: "Open" },
              { startDate: "02 Mar", endDate: "05 Mar", status: "Open" },
              { startDate: "03 Mar", endDate: "06 Mar", status: "Open" },
              { startDate: "04 Mar", endDate: "07 Mar", status: "Open" },
              { startDate: "05 Mar", endDate: "08 Mar", status: "Open" },
              { startDate: "06 Mar", endDate: "09 Mar", status: "Open" },
              { startDate: "07 Mar", endDate: "10 Mar", status: "Open" },
              { startDate: "08 Mar", endDate: "11 Mar", status: "Open" },
              { startDate: "09 Mar", endDate: "12 Mar", status: "Open" },
              { startDate: "10 Mar", endDate: "13 Mar", status: "Open" },
              { startDate: "11 Mar", endDate: "14 Mar", status: "Open" },
              { startDate: "12 Mar", endDate: "15 Mar", status: "Open" },
              { startDate: "13 Mar", endDate: "16 Mar", status: "Open" },
              { startDate: "14 Mar", endDate: "17 Mar", status: "Open" },
              { startDate: "15 Mar", endDate: "18 Mar", status: "Open" },
              { startDate: "16 Mar", endDate: "19 Mar", status: "Open" },
              { startDate: "17 Mar", endDate: "20 Mar", status: "Open" },
              { startDate: "18 Mar", endDate: "21 Mar", status: "Open" },
              { startDate: "19 Mar", endDate: "22 Mar", status: "Open" },
              { startDate: "20 Mar", endDate: "23 Mar", status: "Open" },
              { startDate: "21 Mar", endDate: "24 Mar", status: "Open" },
              { startDate: "22 Mar", endDate: "25 Mar", status: "Open" },
              { startDate: "23 Mar", endDate: "26 Mar", status: "Open" },
              { startDate: "24 Mar", endDate: "27 Mar", status: "Open" },
              { startDate: "25 Mar", endDate: "28 Mar", status: "Open" },
              { startDate: "26 Mar", endDate: "29 Mar", status: "Open" },
              { startDate: "27 Mar", endDate: "30 Mar", status: "Open" },
              { startDate: "28 Mar", endDate: "31 Mar", status: "Open" },
              { startDate: "29 Mar", endDate: "01 Apr", status: "Open" },
              { startDate: "30 Mar", endDate: "02 Apr", status: "Open" },
              { startDate: "31 Mar", endDate: "03 Apr", status: "Open" }
            ]
          },
          {
            month: "Apr",
            year: "2027",
            trips: [
              { startDate: "01 Apr", endDate: "04 Apr", status: "Open" },
              { startDate: "02 Apr", endDate: "05 Apr", status: "Open" },
              { startDate: "03 Apr", endDate: "06 Apr", status: "Open" },
              { startDate: "04 Apr", endDate: "07 Apr", status: "Open" },
              { startDate: "05 Apr", endDate: "08 Apr", status: "Open" },
              { startDate: "06 Apr", endDate: "09 Apr", status: "Open" },
              { startDate: "07 Apr", endDate: "10 Apr", status: "Open" },
              { startDate: "08 Apr", endDate: "11 Apr", status: "Open" },
              { startDate: "09 Apr", endDate: "12 Apr", status: "Open" },
              { startDate: "10 Apr", endDate: "13 Apr", status: "Open" },
              { startDate: "11 Apr", endDate: "14 Apr", status: "Open" },
              { startDate: "12 Apr", endDate: "15 Apr", status: "Open" },
              { startDate: "13 Apr", endDate: "16 Apr", status: "Open" },
              { startDate: "14 Apr", endDate: "17 Apr", status: "Open" },
              { startDate: "15 Apr", endDate: "18 Apr", status: "Open" },
              { startDate: "16 Apr", endDate: "19 Apr", status: "Open" },
              { startDate: "17 Apr", endDate: "20 Apr", status: "Open" },
              { startDate: "18 Apr", endDate: "21 Apr", status: "Open" },
              { startDate: "19 Apr", endDate: "22 Apr", status: "Open" },
              { startDate: "20 Apr", endDate: "23 Apr", status: "Open" },
              { startDate: "21 Apr", endDate: "24 Apr", status: "Open" },
              { startDate: "22 Apr", endDate: "25 Apr", status: "Open" },
              { startDate: "23 Apr", endDate: "26 Apr", status: "Open" },
              { startDate: "24 Apr", endDate: "27 Apr", status: "Open" },
              { startDate: "25 Apr", endDate: "28 Apr", status: "Open" },
              { startDate: "26 Apr", endDate: "29 Apr", status: "Open" },
              { startDate: "27 Apr", endDate: "30 Apr", status: "Open" },
              { startDate: "28 Apr", endDate: "01 May", status: "Open" },
              { startDate: "29 Apr", endDate: "02 May", status: "Open" },
              { startDate: "30 Apr", endDate: "03 May", status: "Open" }
            ]
          }
        ]
      }
    }
  };
}

// Static details for Kuari Pass Trek (uid: kuari-pass-trek), the Lord Curzon Trail.
// Trek essentials (packing list) and the cancellation policy are deliberately
// left unset: Kedarkantha publishes neither either, so both listings render the
// same shared copy from `trekDefaults.ts` / `TrekCancellation`.
const kuariPassIndex = TREKS.findIndex(t => t.slug === 'kuari-pass-trek');
if (kuariPassIndex !== -1) {
  TREKS[kuariPassIndex].aboutParagraphs = [
    "Kuari Pass is a high crossing in the Garhwal Himalayas of Uttarakhand, reached from Joshimath. The trail climbs through dense oak and rhododendron forest, opens into alpine meadows and follows high ridges to the pass at 12,516 ft (3,815 m), covering roughly 30–35 km over 6 days and 5 nights. It is graded moderate, and the standard route asks for no technical climbing.",
    "The route is better known as the Lord Curzon Trail, after the viceroy who popularised it in 1905. What sets it apart is the panorama from the pass itself: Nanda Devi, Dronagiri, Kamet, Chaukhamba and Trishul stand around the crossing in what amounts to a natural amphitheatre, without any of the mountaineering the peaks themselves would demand.",
    "From Joshimath a short drive reaches the roadhead, and the trek proper begins through traditional Himalayan villages and forest to the campsite at Gulling. Day three climbs to the open meadows of Khullara, and from there summit day crosses meadow and ridge to the pass and back. The views widen with every hundred metres of altitude gained.",
    "In winter the whole route above Gulling lies under snow and the trail becomes considerably more demanding; spring and autumn trade the snow for green meadows, colour in the forest and the clearest mountain views of the year. That range is why the pass suits both a prepared first-timer and a trekker who has been at altitude before."
  ];

  TREKS[kuariPassIndex].highlights = [
    "Kuari Pass summit at 12,516 ft",
    "The historic Lord Curzon Trail",
    "Winter snow trails",
    "Gorson Bugyal & Auli",
    "Nanda Devi & Dronagiri views",
    "Chaukhamba & Kamet range views",
    "Oak & rhododendron forests",
    "Alpine meadows",
    "Himalayan camping"
  ];

  TREKS[kuariPassIndex].usps = [
    {
      title: "Base town: Joshimath",
      description: "The trek is run out of Joshimath at 7,545 ft, reached on a 280 km drive from Dehradun, with a short 15 km transfer to the roadhead on the first and last trekking days."
    },
    {
      title: "The Lord Curzon Trail",
      description: "The route Lord Curzon popularised in 1905, still one of the classic walks of the Garhwal — history and high Himalayan views on the same trail."
    },
    {
      title: "Khullara meadow campsite",
      description: "Two nights at Khullara, around 11,014 ft, where the forest gives way to open meadow and the Nanda Devi group is in full view on a clear morning."
    },
    {
      title: "Summit day to 12,516 ft",
      description: "An early start from Khullara for 8 km and 8–9 hours across meadow and ridge to the pass and back, the longest and most rewarding day of the trek."
    },
    {
      title: "A snow trek from December to March",
      description: "Through the winter months the trail above Gulling is under snow, and gaiters or microspikes may be needed on the approach to the pass depending on conditions."
    }
  ];

  TREKS[kuariPassIndex].destinationHighlights = [
    { name: "Joshimath", blurb: "The Garhwal hill town at 7,545 ft that serves as base for the trek, and the gateway to Auli and the Nanda Devi region." },
    { name: "Tugasi Village", blurb: "The roadhead at about 8,530 ft, a short drive from Joshimath, where the walking begins and ends." },
    { name: "Gulling", blurb: "The first campsite at roughly 9,264 ft, set among Himalayan forest with the valley opening out below." },
    { name: "Khullara", blurb: "Open meadow camp at about 11,014 ft, the highest night of the trek and its finest viewpoint short of the pass." },
    { name: "Kuari Pass", blurb: "The 12,516 ft / 3,815 m high point, ringed by Nanda Devi, Dronagiri, Kamet and Chaukhamba." }
  ];

  TREKS[kuariPassIndex].differentiators = [
    "Region: Garhwal Himalayas, Chamoli district, Uttarakhand",
    "Trek type: pass crossing — Kuari Pass at 12,516 ft is the high point of the route",
    "Terrain: forest trails, alpine meadows, high ridges and, in winter, snow",
    "Known as: the Lord Curzon Trail, popularised in 1905"
  ];

  // Transcribed verbatim from the Google reviews on the Trip My Soul profile.
  TREKS[kuariPassIndex].externalReviews = [
    {
      source: "Google",
      subject: "Trip My Soul",
      author: "Piyush Udaipur",
      rating: 5,
      date: "3 months ago",
      text: [
        "I had one of the best travel experiences with Trip My Soul! From the very beginning, everything was well organized and professionally managed. The trek was absolutely amazing, with breathtaking views, great planning, and a perfect balance of adventure and fun.",
        "A special thanks to the trek leaders and coordinators who were supportive, friendly, and always ensured everyone's safety and comfort. The accommodation, food, transportation, and overall arrangements exceeded my expectations.",
        "What made this trip truly memorable was the positive atmosphere and the wonderful people I met along the way. Every moment felt special, and I came back with unforgettable memories.",
        "I highly recommend Trip My Soul to anyone looking for a well-organized, exciting, and memorable trekking experience. Looking forward to joining many more trips with them in the future! Trek leader shishpal panwar amazing leadership, very helpful, there nature was very amazing and he his very sweet with us."
      ]
    },
    {
      source: "Google",
      subject: "Trip My Soul",
      author: "Niha B",
      rating: 5,
      date: "a year ago",
      text: [
        "I completed my first winter trek with the Trip My Soul team, who provided amazing support and delicious food throughout the journey. They were there for me physically and mentally, helping me reach the summit of Kuari Pass. A special thanks to Amit Bhai, whose guidance and support were instrumental in helping me achieve this incredible feat."
      ]
    },
    {
      source: "Google",
      subject: "Trip My Soul",
      author: "Pinku Boro",
      rating: 5,
      date: "a year ago",
      text: [
        "One of the best experience I had so far, it was my first winter trek and the situation I have been through was very bad, I was suffering from fever, headache and AMS at the day of summit but thanks to our track leader sandeep bhaiya aka sandy for motivating me and taking care of me throughout the trip.",
        "Thank you trip my soul, next trip is also with you guys for sure."
      ]
    }
  ];

  TREKS[kuariPassIndex].reviewVideos = [
    "https://youtube.com/shorts/Ki_DVHtDHY8",
    "https://youtube.com/shorts/2jsnSO2jAME",
    "https://youtube.com/shorts/iTXj6Jk_Lf8"
  ];

  TREKS[kuariPassIndex].similarTreks = [
    "dayara-bugyal-trek",
    "brahmatal-trek",
    "chopta-tungnath-trek",
    "kedarkantha-trek"
  ];

  TREKS[kuariPassIndex].idealFor =
    "First-time trekkers with good fitness, experienced trekkers, snow-trek and mountain-photography enthusiasts.";

  TREKS[kuariPassIndex].importantNote =
    "Between December and March the route above Gulling is snowbound and the grade rises from moderate to moderate–challenging; gaiters and microspikes may be required on summit day, and your guide will call the start time on the conditions. The panorama from the pass depends entirely on the weather, so treat a clear morning as a bonus rather than a guarantee.";

  TREKS[kuariPassIndex].heroImage =
    "/Trips_gallery/Kuari%20Pass%20trek/IMG_4242.JPG.jpeg";

  TREKS[kuariPassIndex].heroImages = [
    "/Trips_gallery/Kuari%20Pass%20trek/IMG_4214.JPG.jpeg",
    "/Trips_gallery/Kuari%20Pass%20trek/IMG_4239.JPG.jpeg",
    "/Trips_gallery/Kuari%20Pass%20trek/IMG_4240.JPG.jpeg",
    "/Trips_gallery/Kuari%20Pass%20trek/IMG_4262.JPG.jpeg"
  ];

  TREKS[kuariPassIndex].gallery = [
    { url: "/Trips_gallery/Kuari%20Pass%20trek/IMG_4214.JPG.jpeg", caption: "Oak and rhododendron forest on the way up" },
    { url: "/Trips_gallery/Kuari%20Pass%20trek/IMG_4215.JPG.jpeg", caption: "Above the treeline on the Curzon Trail" },
    { url: "/Trips_gallery/Kuari%20Pass%20trek/IMG_4216.JPG.jpeg", caption: "Snow on the trail below the pass" },
    { url: "/Trips_gallery/Kuari%20Pass%20trek/IMG_4235.JPG.jpeg", caption: "On the Lord Curzon Trail above Joshimath" },
    { url: "/Trips_gallery/Kuari%20Pass%20trek/IMG_4236.JPG.jpeg", caption: "Oak and rhododendron forest below Gulling" },
    { url: "/Trips_gallery/Kuari%20Pass%20trek/IMG_4239.JPG.jpeg", caption: "Camp at Gulling" },
    { url: "/Trips_gallery/Kuari%20Pass%20trek/IMG_4240.JPG.jpeg", caption: "Climbing from Gulling to Khullara" },
    { url: "/Trips_gallery/Kuari%20Pass%20trek/IMG_4241.JPG.jpeg", caption: "The meadow campsite at Khullara" },
    { url: "/Trips_gallery/Kuari%20Pass%20trek/IMG_4242.JPG.jpeg", caption: "Snow slopes on the way to the pass" },
    { url: "/Trips_gallery/Kuari%20Pass%20trek/IMG_4243.JPG.jpeg", caption: "Kuari Pass at 12,516 ft" },
    { url: "/Trips_gallery/Kuari%20Pass%20trek/IMG_4244.JPG.jpeg", caption: "Nanda Devi and Dronagiri from the pass" },
    { url: "/Trips_gallery/Kuari%20Pass%20trek/IMG_4249.JPG.jpeg", caption: "Kamet and Chaukhamba on a clear morning" },
    { url: "/Trips_gallery/Kuari%20Pass%20trek/IMG_4250.JPG.jpeg", caption: "Ridge walk above the treeline" },
    { url: "/Trips_gallery/Kuari%20Pass%20trek/IMG_4256.JPG.jpeg", caption: "The team on the trail" },
    { url: "/Trips_gallery/Kuari%20Pass%20trek/IMG_4257.JPG.jpeg", caption: "On the Lord Curzon Trail above Joshimath" },
    { url: "/Trips_gallery/Kuari%20Pass%20trek/IMG_4260.JPG.jpeg", caption: "Oak and rhododendron forest below Gulling" },
    { url: "/Trips_gallery/Kuari%20Pass%20trek/IMG_4261.JPG.jpeg", caption: "Camp at Gulling" },
    { url: "/Trips_gallery/Kuari%20Pass%20trek/IMG_4262.JPG.jpeg", caption: "Climbing from Gulling to Khullara" },
    { url: "/Trips_gallery/Kuari%20Pass%20trek/IMG_4269.JPG.jpeg", caption: "The meadow campsite at Khullara" },
    { url: "/Trips_gallery/Kuari%20Pass%20trek/IMG_4270.JPG.jpeg", caption: "Snow slopes on the way to the pass" },
    { url: "/Trips_gallery/Kuari%20Pass%20trek/IMG_4272.JPG.jpeg", caption: "Kuari Pass at 12,516 ft" },
    { url: "/Trips_gallery/Kuari%20Pass%20trek/IMG_4274.JPG.jpeg", caption: "Nanda Devi and Dronagiri from the pass" },
    { url: "/Trips_gallery/Kuari%20Pass%20trek/IMG_4275.JPG.jpeg", caption: "Kamet and Chaukhamba on a clear morning" },
    { url: "/Trips_gallery/Kuari%20Pass%20trek/IMG_4276.JPG.jpeg", caption: "Ridge walk above the treeline" },
    { url: "/Trips_gallery/Kuari%20Pass%20trek/IMG_4279.JPG.jpeg", caption: "The team on the trail" }
  ];

  TREKS[kuariPassIndex].itinerary = [
    {
      day: 1,
      title: "Dehradun to Joshimath",
      driveDistance: "280 km",
      drivingTime: "9-10 Hours",
      pickupPoint: "Dehradun Railway Station / Prince Chowk",
      altitudePoints: [
        { location: "Dehradun", m: 637, ft: 2089 },
        { location: "Joshimath", m: 2300, ft: 7545 }
      ],
      altitudeGain: { m: 1663, ft: 5456 },
      description: "A long, scenic drive up the Alaknanda valley to Joshimath, the base for the trek.",
      detailedParagraphs: [
        "Your Kuari Pass adventure begins early in the morning from Dehradun. We drive towards Joshimath, the gateway to some of the most spectacular trekking routes in Uttarakhand.",
        "The journey takes you through Rishikesh, Devprayag, Srinagar, Rudraprayag, Karnaprayag and Nandaprayag. Along the way you pass the dramatic valleys and sacred river confluences that make the Garhwal Himalayas what they are.",
        "As the road climbs towards Joshimath the landscape changes from river valleys to towering mountains and dense Himalayan forest.",
        "On reaching Joshimath, check into your hotel and meet your trek leader and fellow trekkers. The team runs a trek briefing and equipment check, and explains the plan for the days ahead."
      ],
      highlights: ["Alaknanda Valley Drive", "River Confluences", "Joshimath", "Trek Briefing"],
      meals: "Dinner",
      stayType: "Hotel in Joshimath — twin/triple sharing"
    },
    {
      day: 2,
      title: "Joshimath to Tugasi Village, trek to Gulling",
      driveDistance: "15 km",
      trekDistance: "3 km",
      trekDuration: "3-4 Hours",
      altitudePoints: [
        { location: "Joshimath", m: 2300, ft: 7545 },
        { location: "Tugasi Village", m: 2600, ft: 8530 },
        { location: "Gulling", m: 2824, ft: 9264 }
      ],
      altitudeGain: { m: 524, ft: 1719 },
      description: "A short transfer to the roadhead, then an easy first walk through forest to the Gulling campsite.",
      detailedParagraphs: [
        "After breakfast, leave Joshimath and drive to Tugasi Village, the roadhead for the trek.",
        "From Tugasi the trekking begins. The trail climbs gradually through traditional Himalayan landscapes, terraced slopes and forested sections.",
        "As you gain altitude the views open up, revealing the valleys below and the first of the distant Himalayan peaks. The short first day is deliberate — it gives your body time to adapt to the altitude.",
        "After a few hours of walking you reach Gulling campsite. Settle into your tent, eat a warm meal and spend the evening in the quiet of the mountains."
      ],
      highlights: ["Himalayan Villages", "Forest Trail", "Valley Views", "First Camp"],
      meals: "Breakfast, Lunch & Dinner",
      stayType: "Gulling campsite — twin sharing"
    },
    {
      day: 3,
      title: "Gulling to Khullara",
      trekDistance: "5.5 km",
      trekDuration: "4-5 Hours",
      altitudePoints: [
        { location: "Gulling", m: 2824, ft: 9264 },
        { location: "Khullara", m: 3357, ft: 11014 }
      ],
      altitudeGain: { m: 533, ft: 1750 },
      description: "A steady climb through oak and rhododendron forest to the open meadow camp at Khullara.",
      detailedParagraphs: [
        "Wake up to mountain views and, weather permitting, a spectacular Himalayan sunrise.",
        "After breakfast, begin the trek towards Khullara. The trail climbs steadily through dense oak and rhododendron forest, with occasional clearings that open onto the surrounding ranges.",
        "Higher up, the vegetation thins and the landscape gives way to high-altitude meadows and ridges. The trail is scenic rather than technical, but the altitude makes the climb more demanding — take regular breaks, stay hydrated and hold a comfortable pace.",
        "By afternoon you arrive at Khullara campsite, one of the finest camps on the trek, with wide Himalayan views in every direction. Spend the evening resting and preparing for the hardest and best day of the trek."
      ],
      highlights: ["Oak & Rhododendron Forest", "Nanda Devi Views", "Dronagiri Views", "Meadow Camp"],
      meals: "Breakfast, Lunch & Dinner",
      stayType: "Khullara campsite — twin sharing"
    },
    {
      day: 4,
      title: "Khullara to Kuari Pass and back",
      trekDistance: "8 km",
      trekDuration: "8-9 Hours",
      timeNote: { label: "Summit start", value: "Early morning" },
      altitudePoints: [
        { location: "Khullara", m: 3357, ft: 11014 },
        { location: "Kuari Pass", m: 3815, ft: 12516 },
        { location: "Khullara", m: 3357, ft: 11014 }
      ],
      altitudeGain: { m: 458, ft: 1502 },
      description: "The summit day — meadow and ridge to the pass at 12,516 ft, with Nanda Devi, Dronagiri, Kamet and Chaukhamba all around, then back down to camp.",
      detailedParagraphs: [
        "This is the most exciting and most demanding day of your Kuari Pass Trek.",
        "Start early from Khullara. The trail moves into high-altitude meadows and ridges, and the landscape grows steadily more open and more dramatic.",
        "The final approach is a steady climb to the pass. In winter, snow can make the trail considerably harder, and gear such as gaiters or microspikes may be needed depending on conditions.",
        "After several hours you reach Kuari Pass at approximately 12,516 ft. Standing at the crossing, you are surrounded by an extraordinary Himalayan panorama — on a clear day the view takes in Nanda Devi, Dronagiri, Kamet and Chaukhamba. Take the time to enjoy it, and to photograph it.",
        "Then begin the descent to Khullara. The return is easier on the lungs, though it can still be demanding on the legs after a long day. Reach camp by evening for a warm dinner and a well-earned rest."
      ],
      highlights: [
        "Kuari Pass at 12,516 ft",
        "Panoramic Himalayan Views",
        "Nanda Devi & Kamet",
        "Chaukhamba & Dronagiri",
        "High Ridge Walk"
      ],
      meals: "Breakfast, Packed Lunch & Dinner",
      stayType: "Khullara campsite — twin sharing"
    },
    {
      day: 5,
      title: "Khullara to Tugasi Village, drive to Joshimath",
      trekDistance: "8.5 km",
      trekDuration: "5-7 Hours",
      driveDistance: "15 km",
      drivingTime: "30 Minutes-1 Hour",
      altitudePoints: [
        { location: "Khullara", m: 3357, ft: 11014 },
        { location: "Tugasi Village", m: 2600, ft: 8530 },
        { location: "Joshimath", m: 2300, ft: 7545 }
      ],
      altitudeGain: null,
      description: "The long descent off the meadows and back through forest to the roadhead, then a short drive to Joshimath.",
      detailedParagraphs: [
        "After breakfast, begin the descent from Khullara towards Tugasi Village.",
        "The trail takes you back through Himalayan forest and mountain slopes. After several days at altitude the descent feels refreshing as the air warms and the landscape changes around you.",
        "Walk at a comfortable pace and enjoy the last stretch of trail. At Tugasi Village the trekking section comes to an end, and you board the vehicle for the short drive back to Joshimath.",
        "Check into the hotel, freshen up and relax after completing the trek. Spend the evening trading stories with the rest of the group."
      ],
      highlights: ["Forest Descent", "Trek Ends at Tugasi", "Return to Joshimath"],
      meals: "Breakfast, Lunch & Dinner",
      stayType: "Hotel in Joshimath — twin/triple sharing"
    },
    {
      day: 6,
      title: "Joshimath to Dehradun",
      driveDistance: "280 km",
      drivingTime: "9-10 Hours",
      timeNote: { label: "Drop-off", value: "Dehradun Railway Station / Prince Chowk" },
      altitudePoints: [
        { location: "Joshimath", m: 2300, ft: 7545 },
        { location: "Dehradun", m: 637, ft: 2089 }
      ],
      altitudeGain: null,
      description: "The drive back down the Alaknanda valley to Dehradun, where the trek concludes.",
      detailedParagraphs: [
        "After breakfast, begin the journey back to Dehradun.",
        "The drive follows the scenic mountain route through Nandaprayag, Karnaprayag, Rudraprayag, Srinagar, Devprayag and Rishikesh.",
        "As you descend from the mountains towards the plains, take one last look at the landscapes that have been home for the past few days.",
        "The Kuari Pass Trek officially concludes on arrival in Dehradun — with photographs, and with the memory of Himalayan forest, high meadows, snow trails and the mountains of Uttarakhand."
      ],
      highlights: ["Alaknanda Valley", "River Confluences", "Journey Ends"],
      meals: "Breakfast",
      // The trek ends on this day; an empty stay keeps the generic
      // "Hotel / Homestay" fallback out of the day's quick-info line.
      stayType: ""
    }
  ];

  /**
   * The source listing and its own itinerary disagree on two figures, so both
   * are recorded as published rather than quietly reconciled: the roadhead is
   * named as Dhak Village in the route summary but as Tugasi Village on every
   * itinerary day, and the headline 30–35 km does not match the per-day
   * distances, which total about 25 km.
   */
  TREKS[kuariPassIndex].sourceCaveat =
    "The published route names the roadhead as Dhak Village, while the day-by-day itinerary starts and ends the walk at Tugasi Village; the daily trek distances total about 25 km against a headline figure of 30–35 km. Both are listed here as published — your trek leader will confirm the roadhead used on your departure.";

  TREKS[kuariPassIndex].faqs = [
    {
      title: "What is the Kuari Pass Trek?",
      description: "Kuari Pass Trek is a scenic high-altitude trek in Uttarakhand, famous for the historic Lord Curzon Trail, alpine meadows, Himalayan forests and panoramic views of peaks such as Nanda Devi, Dronagiri, Chaukhamba and Kamet."
    },
    {
      title: "How difficult is the Kuari Pass Trek?",
      description: "Kuari Pass is generally rated Moderate. The trek involves continuous ascents, high-altitude terrain and long trekking days. During winter, snow and icy sections can make the trek more challenging."
    },
    {
      title: "What is the maximum altitude of Kuari Pass?",
      description: "Kuari Pass reaches approximately 12,500 ft (3,815 m) above sea level."
    },
    {
      title: "How many days are required for the Kuari Pass Trek?",
      description: "The standard Trip My Soul itinerary is 6 Days / 5 Nights, including transportation from Dehradun, the trek and return to Dehradun."
    },
    {
      title: "What is the best time to do the Kuari Pass Trek?",
      description: "Kuari Pass can be experienced in different seasons. December to March is popular for a snow experience, while April to June and September to November offer different landscapes and generally clearer mountain views. Actual snow conditions vary each year."
    },
    {
      title: "Is Kuari Pass suitable for beginners?",
      description: "Yes. Kuari Pass can be suitable for fit beginners with proper preparation. You should be comfortable walking several kilometres and climbing continuously for a few hours. Good cardiovascular fitness is especially important."
    },
    {
      title: "How do I reach the Kuari Pass Trek starting point?",
      description: "Trip My Soul’s standard itinerary starts from Dehradun. From Dehradun, you travel by road to Joshimath and then continue towards Tugasi Village, from where the trekking route begins."
    },
    {
      title: "Will there be snow on the Kuari Pass Trek?",
      description: "Snow is most likely during the winter months, particularly from December to March, but the amount of snow depends on seasonal weather conditions. Snow cannot be guaranteed on every departure."
    },
    {
      title: "What accommodation is provided during the trek?",
      description: "The itinerary includes hotel accommodation in Joshimath and camping accommodation during the trekking days. Camping is generally on a twin-sharing basis, subject to campsite conditions."
    },
    {
      title: "What should I carry for the Kuari Pass Trek?",
      description: "Essential items include good trekking shoes, warm layers, waterproof jacket, thermal wear, gloves, woollen cap, sunglasses, sunscreen, water bottles, personal medicines, headlamp and a trekking backpack. During winter, gaiters and microspikes may be required depending on snow conditions."
    }
  ];

  TREKS[kuariPassIndex].article = {
    title: "Kuari Pass Trek: A Journey Where the Mountains Speak to Your Soul",
    standfirst:
      "Ancient forests, quiet mountain villages, vast alpine meadows and a high Himalayan ridge — the Lord Curzon Trail, told the way it is felt.",
    readMinutes: 7,
    sections: [
      {
        paragraphs: [
          "There are journeys where you travel to reach a destination.",
          "And then there are journeys where the destination becomes only an excuse to discover yourself.",
          "Kuari Pass is one of those journeys.",
          "Hidden in the Garhwal Himalayas of Uttarakhand, the Kuari Pass Trek takes you through ancient forests, quiet mountain villages, vast alpine meadows and high Himalayan ridges. But beyond the altitude and distance, there is something about this trail that stays with you long after you have returned home.",
          "It is not just a trek.",
          "It is a conversation with the mountains."
        ]
      },
      {
        heading: "The Beginning: Leaving the Ordinary Behind",
        paragraphs: [
          "The journey begins from Dehradun.",
          "As the road leaves the city behind and enters the mountains, everything slowly changes. The noise becomes quieter. The air becomes cooler. The roads become narrower, while the mountains become bigger.",
          "You travel through Rishikesh, Devprayag, Srinagar, Rudraprayag and Karnaprayag before reaching Joshimath.",
          "Along the way, rivers meet rivers, valleys open beneath you and Himalayan villages appear on distant slopes.",
          "By the time you reach Joshimath, you realise that you have already left your everyday life far behind.",
          "Tomorrow, the real journey begins."
        ]
      },
      {
        heading: "Walking Into the Himalayas",
        paragraphs: [
          "From Tugasi Village, you finally put your feet on the trail.",
          "The first few steps may feel ordinary.",
          "But slowly, the world begins to change.",
          "The sound of vehicles disappears. The forest becomes your companion. Oak and rhododendron trees surround the trail, while the mountains appear through gaps between the branches.",
          "Every turn reveals something new.",
          "A distant peak.",
          "A quiet valley.",
          "A small Himalayan village.",
          "Or simply a moment of silence that you didn’t know you needed.",
          "And somewhere along the trail, you stop checking your phone.",
          "Because there is finally nothing more interesting on the screen than what is standing in front of you."
        ]
      },
      {
        heading: "Gulling: Your First Night Under the Mountains",
        paragraphs: [
          "When you reach Gulling, the mountains begin to feel closer.",
          "The campsite becomes your home for the night.",
          "As evening arrives, the temperature drops and the sky slowly fills with stars.",
          "There are no city lights competing with them.",
          "Just darkness, mountains and an endless Himalayan sky.",
          "You sit around the campsite with people who were strangers only a day ago.",
          "Stories begin.",
          "Laughter follows.",
          "And somehow, by the end of the evening, everyone feels like they have known each other for much longer.",
          "This is one of the beautiful things about trekking.",
          "The mountains have a way of turning strangers into companions."
        ]
      },
      {
        heading: "Khullara: Where the Mountains Begin to Open Up",
        paragraphs: [
          "The trail towards Khullara takes you deeper into the Himalayas.",
          "The forests gradually begin to thin, and the landscape starts opening into wide mountain views.",
          "With every step, you gain altitude.",
          "And with every step, the mountains become more magnificent.",
          "Nanda Devi and Dronagiri begin to dominate the horizon when the weather is clear.",
          "You may feel tired.",
          "Your legs may ask you to stop.",
          "But then you look up.",
          "And suddenly, the tiredness feels worth it.",
          "Because some views cannot be explained in photographs.",
          "They have to be earned with your feet."
        ]
      },
      {
        heading: "The Day of Kuari Pass",
        paragraphs: [
          "Then comes the day you have been waiting for.",
          "You wake up early.",
          "The morning is cold.",
          "The trail ahead is long.",
          "But there is excitement in the air.",
          "Today, you walk towards Kuari Pass.",
          "The trail climbs through high-altitude meadows and mountain ridges. During winter, snow can transform the landscape into a completely different world.",
          "Step by step, you continue upwards.",
          "There may be moments when your breathing becomes heavier.",
          "There may be moments when you wonder how much farther you have to go.",
          "But eventually, the trail rises one final time.",
          "And you reach the pass."
        ]
      },
      {
        heading: "Standing at 12,500+ Feet",
        paragraphs: [
          "At Kuari Pass, something changes.",
          "You stop walking.",
          "You simply stand there.",
          "Around you are some of the greatest landscapes the Himalayas have to offer.",
          "Nanda Devi.",
          "Dronagiri.",
          "Chaukhamba.",
          "Kamet.",
          "The peaks rise beyond the ridges, enormous and silent.",
          "For a few moments, nobody needs to say anything.",
          "Because there are moments when words become too small.",
          "You look back at the trail you walked.",
          "The forests.",
          "The campsites.",
          "The climbs.",
          "The cold mornings.",
          "The tired legs.",
          "And you realise something.",
          "The mountain was never just something you were climbing.",
          "It was showing you how far you could go."
        ]
      },
      {
        heading: "The Descent: Leaving, But Not Really Leaving",
        paragraphs: [
          "Eventually, every trek has to end.",
          "You descend from the high mountains towards Tugasi and return to Joshimath.",
          "The scenery changes again.",
          "The air becomes warmer.",
          "The forests become denser.",
          "The road takes you back towards the towns.",
          "But something inside you feels different.",
          "You came to the Himalayas looking for a trek.",
          "You leave carrying memories.",
          "The sunrise from the campsite.",
          "The sound of your footsteps on the trail.",
          "The laughter around the tent.",
          "The first sight of the Himalayan peaks.",
          "That one difficult climb.",
          "And the feeling of standing at Kuari Pass."
        ]
      },
      {
        heading: "Why Kuari Pass Stays With You",
        paragraphs: [
          "Kuari Pass is not the highest trek in the Himalayas.",
          "It is not about conquering a mountain.",
          "It is about experiencing one.",
          "It teaches you to walk slowly.",
          "To appreciate silence.",
          "To respect nature.",
          "To celebrate small victories.",
          "And sometimes, simply to look up.",
          "In our everyday lives, we spend so much time trying to reach somewhere.",
          "The Kuari Pass trail reminds us that sometimes the journey itself is the destination."
        ]
      },
      {
        heading: "Come Walk With Us",
        paragraphs: [
          "At Trip My Soul, we believe a trek should be more than a package.",
          "It should be a memory you carry for years.",
          "A sunrise you remember when life gets difficult.",
          "A mountain view that makes you pause.",
          "A group of strangers who become friends.",
          "And a trail that reminds you that you are capable of much more than you thought.",
          "So, if you are looking for a journey that takes you away from the noise and closer to yourself, pack your backpack.",
          "Leave the ordinary behind.",
          "And walk with us into the Himalayas.",
          "Kuari Pass is waiting."
        ]
      }
    ],
    signoff: "Trip My Soul — Travel Far. Feel More."
  };

  TREKS[kuariPassIndex].eligibilityCriteria = [
    { icon: "User", text: "Age: 10–60 years recommended" },
    { icon: "Footprints", text: "Experience: No prior trekking experience required" },
    { icon: "Dumbbell", text: "Fitness: Basic to moderate fitness required" },
    { icon: "Mountain", text: "Altitude: Up to 12,516 ft / 3,815 m" },
    { icon: "Snowflake", text: "Must be comfortable with cold and snow conditions" },
    { icon: "Stethoscope", text: "Participants should be medically fit for high-altitude trekking" }
  ];

  /** Set against this trek's own day lengths, which run longer than Kedarkantha's. */
  TREKS[kuariPassIndex].fitnessCriteria = [
    { icon: "Footprints", text: "Able to walk 6–8 km comfortably on uneven ground" },
    { icon: "TrendingUp", text: "Able to sustain a 5–7 hour walking day, and 8–9 hours on summit day" },
    { icon: "Dumbbell", text: "Good stamina and leg strength for continuous ascent and descent" },
    { icon: "Backpack", text: "Comfortable carrying a light daypack" },
    { icon: "Activity", text: "Regular walking, jogging or stair training for 4–6 weeks before the trek is recommended" }
  ];

  TREKS[kuariPassIndex].howToReach = {
    intro: "The Kuari Pass Trek starts from the Joshimath–Dhak/Tugasi region of Chamoli, Uttarakhand. For Trip My Soul, the most convenient meeting point is Dehradun, from where trekkers travel by road to Joshimath.",
    air: {
      summaryLabel: "Nearest Airport",
      summary: "Jolly Grant Airport, Dehradun (DED)",
      detail: "From the airport, travel by taxi or cab to Joshimath — roughly 260–280 km depending on the route, and about 9–11 hours on the road depending on traffic and conditions. From Joshimath, continue by local vehicle towards Dhak/Tugasi, the trek starting area. Recommended for travellers coming from Delhi, Mumbai, Bengaluru and other cities with flight connectivity to Dehradun."
    },
    train: {
      summaryLabel: "Nearest Railway Station",
      summary: "Rishikesh Railway Station",
      detail: "From Rishikesh, travel by bus, shared taxi or private cab towards Joshimath — about 9–11 hours by road — then take a local taxi to Dhak/Tugasi, the trek starting point. Haridwar Railway Station is also a convenient railhead with good connectivity, followed by the same road journey to Joshimath."
    },
    road: {
      summaryLabel: "Route",
      summary: "Dehradun to Joshimath via Rudraprayag and Karnaprayag",
      detail: "Joshimath is well connected by road with Dehradun, Rishikesh and Haridwar. From Joshimath, drive towards Dhak/Tugasi Village, where the trekking route begins.",
      route: ["Dehradun", "Rishikesh", "Devprayag", "Srinagar", "Rudraprayag", "Karnaprayag", "Nandaprayag", "Chamoli", "Joshimath"],
      facts: [
        { label: "Distance", value: "~280 km" },
        { label: "Drive", value: "~9–11 hours" },
        { label: "Options", value: "Bus / Shared Taxi / Private Cab / Tempo Traveller" }
      ]
    },
    pickup: {
      point: "Dehradun",
      time: "Morning of Day 1",
      dropPoint: "Dehradun",
      dropTime: "Evening of Day 6",
      note: "Route for TMS trekkers: Dehradun → Joshimath → Tugasi/Dhak → Gulling → Khullara → Kuari Pass."
    }
  };

  TREKS[kuariPassIndex].bookingAdvance = 2000;

  TREKS[kuariPassIndex].bookingTerms = [
    { title: "Trek Price", description: "₹7,999 per person." },
    { title: "Booking Amount", description: "₹2,000 per person to confirm your seat." },
    { title: "Balance Payment", description: "Remaining amount to be paid before the departure." },
    { title: "Confirmation", description: "Booking is confirmed after payment of the required booking amount." },
    { title: "ID Proof", description: "Valid government-issued ID is mandatory for all trekkers." },
    { title: "Fitness & Medical", description: "Trekkers must meet the required fitness and medical criteria." },
    { title: "Itinerary Changes", description: "The itinerary may be modified due to weather, snowfall, road conditions, trail conditions or safety requirements." },
    { title: "Unforeseen Expenses", description: "Any additional expenses caused by unforeseen circumstances will be borne by the trekker." },
    { title: "On-Trail Instructions", description: "Trekkers must follow the instructions of the Trek Leader and support staff." },
    { title: "Conduct on the Trail", description: "Littering, alcohol, drugs and unsafe behaviour are strictly prohibited during the trek." },
    { title: "Right to Modify", description: "Trip My Soul reserves the right to cancel, modify or change the itinerary whenever required for trekker safety." },
    { title: "Personal Belongings", description: "Personal belongings are the responsibility of the trekker." },
    { title: "Policies", description: "By booking the trek, participants agree to Trip My Soul’s applicable booking, cancellation and safety policies." }
  ];

  TREKS[kuariPassIndex].inclusions = [
    { title: "Transportation", description: "Dehradun → Joshimath → Dehradun, and Joshimath → Tugasi Village → Joshimath." },
    { title: "Accommodation in Joshimath", description: "Twin/triple sharing." },
    { title: "Camping accommodation", description: "Tents at the campsites during the trek." },
    { title: "Meals", description: "All meals during the trek as mentioned in the itinerary." },
    { title: "Trek Leader", description: "Experienced Trek Leader for the batch." },
    { title: "Local Trek Guide", description: "Local guide familiar with the Kuari Pass route." },
    { title: "Support Staff", description: "Professional trek support staff." },
    { title: "Camping Equipment", description: "Camping tents, sleeping bags and sleeping mats." },
    { title: "Dining & Kitchen Setup", description: "Dining and kitchen tent setup at the campsites." },
    { title: "Toilet Tent", description: "Toilet tent at camping sites, wherever required." },
    { title: "First Aid", description: "First-aid medical kit and basic emergency support." },
    { title: "Permits", description: "Forest entry fees and applicable permits." },
    { title: "Operational Charges", description: "All applicable trek-related operational charges mentioned in the itinerary." }
  ];

  TREKS[kuariPassIndex].exclusions = [
    { title: "Flights / train tickets", description: "Travel to and from Dehradun." },
    { title: "Personal expenses", description: "Anything of a personal nature during the trip." },
    { title: "Personal trekking equipment", description: "Trekking shoes, jackets, poles and other rental equipment." },
    { title: "Offloading & porters", description: "Backpack offloading charges, and porter or mule charges for personal luggage." },
    { title: "Insurance", description: "Travel insurance." },
    { title: "Medical expenses", description: "Medical expenses and personal medicines." },
    { title: "Emergency evacuation", description: "Evacuation / rescue charges, if required." },
    { title: "Bottled water & drinks", description: "Bottled water and packaged drinks." },
    { title: "Extra meals & stay", description: "Extra meals or accommodation outside the planned itinerary." },
    { title: "Tips & gratuities", description: "Tips and gratuities for the trek staff." },
    { title: "Weather & roadblocks", description: "Expenses caused by bad weather, landslides, roadblocks or other unforeseen circumstances." },
    { title: "Anything not listed", description: "Any service or expense not specifically mentioned under Inclusions." }
  ];

  TREKS[kuariPassIndex].batches = {
    years: {
      "2026": {
        months: [
          {
            month: "Nov",
            year: "2026",
            trips: [
              { startDate: "01 Nov", endDate: "06 Nov", status: "Open" },
              { startDate: "02 Nov", endDate: "07 Nov", status: "Open" },
              { startDate: "03 Nov", endDate: "08 Nov", status: "Open" },
              { startDate: "04 Nov", endDate: "09 Nov", status: "Open" },
              { startDate: "05 Nov", endDate: "10 Nov", status: "Open" },
              { startDate: "06 Nov", endDate: "11 Nov", status: "Open" },
              { startDate: "07 Nov", endDate: "12 Nov", status: "Open" },
              { startDate: "08 Nov", endDate: "13 Nov", status: "Open" },
              { startDate: "09 Nov", endDate: "14 Nov", status: "Open" },
              { startDate: "10 Nov", endDate: "15 Nov", status: "Open" },
              { startDate: "11 Nov", endDate: "16 Nov", status: "Open" },
              { startDate: "12 Nov", endDate: "17 Nov", status: "Open" },
              { startDate: "13 Nov", endDate: "18 Nov", status: "Open" },
              { startDate: "14 Nov", endDate: "19 Nov", status: "Open" },
              { startDate: "15 Nov", endDate: "20 Nov", status: "Open" },
              { startDate: "16 Nov", endDate: "21 Nov", status: "Open" },
              { startDate: "17 Nov", endDate: "22 Nov", status: "Open" },
              { startDate: "18 Nov", endDate: "23 Nov", status: "Open" },
              { startDate: "19 Nov", endDate: "24 Nov", status: "Open" },
              { startDate: "20 Nov", endDate: "25 Nov", status: "Open" },
              { startDate: "21 Nov", endDate: "26 Nov", status: "Open" },
              { startDate: "22 Nov", endDate: "27 Nov", status: "Open" },
              { startDate: "23 Nov", endDate: "28 Nov", status: "Open" },
              { startDate: "24 Nov", endDate: "29 Nov", status: "Open" },
              { startDate: "25 Nov", endDate: "30 Nov", status: "Open" },
              { startDate: "26 Nov", endDate: "01 Dec", status: "Open" },
              { startDate: "27 Nov", endDate: "02 Dec", status: "Open" },
              { startDate: "28 Nov", endDate: "03 Dec", status: "Open" },
              { startDate: "29 Nov", endDate: "04 Dec", status: "Open" },
              { startDate: "30 Nov", endDate: "05 Dec", status: "Open" }
            ]
          },
          {
            month: "Dec",
            year: "2026",
            trips: [
              { startDate: "01 Dec", endDate: "06 Dec", status: "Open" },
              { startDate: "02 Dec", endDate: "07 Dec", status: "Open" },
              { startDate: "03 Dec", endDate: "08 Dec", status: "Open" },
              { startDate: "04 Dec", endDate: "09 Dec", status: "Open" },
              { startDate: "05 Dec", endDate: "10 Dec", status: "Open" },
              { startDate: "06 Dec", endDate: "11 Dec", status: "Open" },
              { startDate: "07 Dec", endDate: "12 Dec", status: "Open" },
              { startDate: "08 Dec", endDate: "13 Dec", status: "Open" },
              { startDate: "09 Dec", endDate: "14 Dec", status: "Open" },
              { startDate: "10 Dec", endDate: "15 Dec", status: "Open" },
              { startDate: "11 Dec", endDate: "16 Dec", status: "Open" },
              { startDate: "12 Dec", endDate: "17 Dec", status: "Open" },
              { startDate: "13 Dec", endDate: "18 Dec", status: "Open" },
              { startDate: "14 Dec", endDate: "19 Dec", status: "Open" },
              { startDate: "15 Dec", endDate: "20 Dec", status: "Open" },
              { startDate: "16 Dec", endDate: "21 Dec", status: "Open" },
              { startDate: "17 Dec", endDate: "22 Dec", status: "Open" },
              { startDate: "18 Dec", endDate: "23 Dec", status: "Open" },
              { startDate: "19 Dec", endDate: "24 Dec", status: "Open" },
              { startDate: "20 Dec", endDate: "25 Dec", status: "Open" },
              { startDate: "21 Dec", endDate: "26 Dec", status: "Open" },
              { startDate: "22 Dec", endDate: "27 Dec", status: "Open" },
              { startDate: "23 Dec", endDate: "28 Dec", status: "Open" },
              { startDate: "24 Dec", endDate: "29 Dec", status: "Open" },
              { startDate: "25 Dec", endDate: "30 Dec", status: "Open" },
              { startDate: "26 Dec", endDate: "31 Dec", status: "Open" },
              { startDate: "27 Dec", endDate: "01 Jan", status: "Open" },
              { startDate: "28 Dec", endDate: "02 Jan", status: "Open" },
              { startDate: "29 Dec", endDate: "03 Jan", status: "Open" },
              { startDate: "30 Dec", endDate: "04 Jan", status: "Open" },
              { startDate: "31 Dec", endDate: "05 Jan", status: "Open" }
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
              { startDate: "01 Jan", endDate: "06 Jan", status: "Open" },
              { startDate: "02 Jan", endDate: "07 Jan", status: "Open" },
              { startDate: "03 Jan", endDate: "08 Jan", status: "Open" },
              { startDate: "04 Jan", endDate: "09 Jan", status: "Open" },
              { startDate: "05 Jan", endDate: "10 Jan", status: "Open" },
              { startDate: "06 Jan", endDate: "11 Jan", status: "Open" },
              { startDate: "07 Jan", endDate: "12 Jan", status: "Open" },
              { startDate: "08 Jan", endDate: "13 Jan", status: "Open" },
              { startDate: "09 Jan", endDate: "14 Jan", status: "Open" },
              { startDate: "10 Jan", endDate: "15 Jan", status: "Open" },
              { startDate: "11 Jan", endDate: "16 Jan", status: "Open" },
              { startDate: "12 Jan", endDate: "17 Jan", status: "Open" },
              { startDate: "13 Jan", endDate: "18 Jan", status: "Open" },
              { startDate: "14 Jan", endDate: "19 Jan", status: "Open" },
              { startDate: "15 Jan", endDate: "20 Jan", status: "Open" },
              { startDate: "16 Jan", endDate: "21 Jan", status: "Open" },
              { startDate: "17 Jan", endDate: "22 Jan", status: "Open" },
              { startDate: "18 Jan", endDate: "23 Jan", status: "Open" },
              { startDate: "19 Jan", endDate: "24 Jan", status: "Open" },
              { startDate: "20 Jan", endDate: "25 Jan", status: "Open" },
              { startDate: "21 Jan", endDate: "26 Jan", status: "Open" },
              { startDate: "22 Jan", endDate: "27 Jan", status: "Open" },
              { startDate: "23 Jan", endDate: "28 Jan", status: "Open" },
              { startDate: "24 Jan", endDate: "29 Jan", status: "Open" },
              { startDate: "25 Jan", endDate: "30 Jan", status: "Open" },
              { startDate: "26 Jan", endDate: "31 Jan", status: "Open" },
              { startDate: "27 Jan", endDate: "01 Feb", status: "Open" },
              { startDate: "28 Jan", endDate: "02 Feb", status: "Open" },
              { startDate: "29 Jan", endDate: "03 Feb", status: "Open" },
              { startDate: "30 Jan", endDate: "04 Feb", status: "Open" },
              { startDate: "31 Jan", endDate: "05 Feb", status: "Open" }
            ]
          },
          {
            month: "Feb",
            year: "2027",
            trips: [
              { startDate: "01 Feb", endDate: "06 Feb", status: "Open" },
              { startDate: "02 Feb", endDate: "07 Feb", status: "Open" },
              { startDate: "03 Feb", endDate: "08 Feb", status: "Open" },
              { startDate: "04 Feb", endDate: "09 Feb", status: "Open" },
              { startDate: "05 Feb", endDate: "10 Feb", status: "Open" },
              { startDate: "06 Feb", endDate: "11 Feb", status: "Open" },
              { startDate: "07 Feb", endDate: "12 Feb", status: "Open" },
              { startDate: "08 Feb", endDate: "13 Feb", status: "Open" },
              { startDate: "09 Feb", endDate: "14 Feb", status: "Open" },
              { startDate: "10 Feb", endDate: "15 Feb", status: "Open" },
              { startDate: "11 Feb", endDate: "16 Feb", status: "Open" },
              { startDate: "12 Feb", endDate: "17 Feb", status: "Open" },
              { startDate: "13 Feb", endDate: "18 Feb", status: "Open" },
              { startDate: "14 Feb", endDate: "19 Feb", status: "Open" },
              { startDate: "15 Feb", endDate: "20 Feb", status: "Open" },
              { startDate: "16 Feb", endDate: "21 Feb", status: "Open" },
              { startDate: "17 Feb", endDate: "22 Feb", status: "Open" },
              { startDate: "18 Feb", endDate: "23 Feb", status: "Open" },
              { startDate: "19 Feb", endDate: "24 Feb", status: "Open" },
              { startDate: "20 Feb", endDate: "25 Feb", status: "Open" },
              { startDate: "21 Feb", endDate: "26 Feb", status: "Open" },
              { startDate: "22 Feb", endDate: "27 Feb", status: "Open" },
              { startDate: "23 Feb", endDate: "28 Feb", status: "Open" },
              { startDate: "24 Feb", endDate: "01 Mar", status: "Open" },
              { startDate: "25 Feb", endDate: "02 Mar", status: "Open" },
              { startDate: "26 Feb", endDate: "03 Mar", status: "Open" },
              { startDate: "27 Feb", endDate: "04 Mar", status: "Open" },
              { startDate: "28 Feb", endDate: "05 Mar", status: "Open" }
            ]
          },
          {
            month: "Mar",
            year: "2027",
            trips: [
              { startDate: "01 Mar", endDate: "06 Mar", status: "Open" },
              { startDate: "02 Mar", endDate: "07 Mar", status: "Open" },
              { startDate: "03 Mar", endDate: "08 Mar", status: "Open" },
              { startDate: "04 Mar", endDate: "09 Mar", status: "Open" },
              { startDate: "05 Mar", endDate: "10 Mar", status: "Open" },
              { startDate: "06 Mar", endDate: "11 Mar", status: "Open" },
              { startDate: "07 Mar", endDate: "12 Mar", status: "Open" },
              { startDate: "08 Mar", endDate: "13 Mar", status: "Open" },
              { startDate: "09 Mar", endDate: "14 Mar", status: "Open" },
              { startDate: "10 Mar", endDate: "15 Mar", status: "Open" },
              { startDate: "11 Mar", endDate: "16 Mar", status: "Open" },
              { startDate: "12 Mar", endDate: "17 Mar", status: "Open" },
              { startDate: "13 Mar", endDate: "18 Mar", status: "Open" },
              { startDate: "14 Mar", endDate: "19 Mar", status: "Open" },
              { startDate: "15 Mar", endDate: "20 Mar", status: "Open" },
              { startDate: "16 Mar", endDate: "21 Mar", status: "Open" },
              { startDate: "17 Mar", endDate: "22 Mar", status: "Open" },
              { startDate: "18 Mar", endDate: "23 Mar", status: "Open" },
              { startDate: "19 Mar", endDate: "24 Mar", status: "Open" },
              { startDate: "20 Mar", endDate: "25 Mar", status: "Open" },
              { startDate: "21 Mar", endDate: "26 Mar", status: "Open" },
              { startDate: "22 Mar", endDate: "27 Mar", status: "Open" },
              { startDate: "23 Mar", endDate: "28 Mar", status: "Open" },
              { startDate: "24 Mar", endDate: "29 Mar", status: "Open" },
              { startDate: "25 Mar", endDate: "30 Mar", status: "Open" },
              { startDate: "26 Mar", endDate: "31 Mar", status: "Open" },
              { startDate: "27 Mar", endDate: "01 Apr", status: "Open" },
              { startDate: "28 Mar", endDate: "02 Apr", status: "Open" },
              { startDate: "29 Mar", endDate: "03 Apr", status: "Open" },
              { startDate: "30 Mar", endDate: "04 Apr", status: "Open" },
              { startDate: "31 Mar", endDate: "05 Apr", status: "Open" }
            ]
          },
          {
            month: "Apr",
            year: "2027",
            trips: [
              { startDate: "01 Apr", endDate: "06 Apr", status: "Open" },
              { startDate: "02 Apr", endDate: "07 Apr", status: "Open" },
              { startDate: "03 Apr", endDate: "08 Apr", status: "Open" },
              { startDate: "04 Apr", endDate: "09 Apr", status: "Open" },
              { startDate: "05 Apr", endDate: "10 Apr", status: "Open" },
              { startDate: "06 Apr", endDate: "11 Apr", status: "Open" },
              { startDate: "07 Apr", endDate: "12 Apr", status: "Open" },
              { startDate: "08 Apr", endDate: "13 Apr", status: "Open" },
              { startDate: "09 Apr", endDate: "14 Apr", status: "Open" },
              { startDate: "10 Apr", endDate: "15 Apr", status: "Open" },
              { startDate: "11 Apr", endDate: "16 Apr", status: "Open" },
              { startDate: "12 Apr", endDate: "17 Apr", status: "Open" },
              { startDate: "13 Apr", endDate: "18 Apr", status: "Open" },
              { startDate: "14 Apr", endDate: "19 Apr", status: "Open" },
              { startDate: "15 Apr", endDate: "20 Apr", status: "Open" },
              { startDate: "16 Apr", endDate: "21 Apr", status: "Open" },
              { startDate: "17 Apr", endDate: "22 Apr", status: "Open" },
              { startDate: "18 Apr", endDate: "23 Apr", status: "Open" },
              { startDate: "19 Apr", endDate: "24 Apr", status: "Open" },
              { startDate: "20 Apr", endDate: "25 Apr", status: "Open" },
              { startDate: "21 Apr", endDate: "26 Apr", status: "Open" },
              { startDate: "22 Apr", endDate: "27 Apr", status: "Open" },
              { startDate: "23 Apr", endDate: "28 Apr", status: "Open" },
              { startDate: "24 Apr", endDate: "29 Apr", status: "Open" },
              { startDate: "25 Apr", endDate: "30 Apr", status: "Open" },
              { startDate: "26 Apr", endDate: "01 May", status: "Open" },
              { startDate: "27 Apr", endDate: "02 May", status: "Open" },
              { startDate: "28 Apr", endDate: "03 May", status: "Open" },
              { startDate: "29 Apr", endDate: "04 May", status: "Open" },
              { startDate: "30 Apr", endDate: "05 May", status: "Open" }
            ]
          }
        ]
      }
    }
  };
}

// Trek essentials (packing list) and the cancellation policy are deliberately
// left unset: Brahmatal publishes neither, so both sections render the same
// shared copy Kedarkantha does, from `trekDefaults.ts` / `TrekCancellation`.
const brahmatalIndex = TREKS.findIndex(t => t.slug === 'brahmatal-trek');
if (brahmatalIndex !== -1) {
  TREKS[brahmatalIndex].heroImage =
    "/Trips_gallery/Brahmatal/IMG_4313.JPG.jpeg";

  TREKS[brahmatalIndex].heroImages = [
    "/Trips_gallery/Brahmatal/IMG_4308.JPG.jpeg",
    "/Trips_gallery/Brahmatal/IMG_4307.JPG.jpeg",
    "/Trips_gallery/Brahmatal/IMG_4310.JPG.jpeg"
  ];

  TREKS[brahmatalIndex].aboutParagraphs = [
    "The Brahmatal Trek is a breathtaking Himalayan adventure nestled in the Garhwal region of Uttarakhand. Known for its pristine snow-covered landscapes, dense oak and rhododendron forests, beautiful alpine meadows and magnificent Himalayan views, Brahmatal is one of the most captivating winter treks in India.",
    "The journey begins from Lohajung, a picturesque mountain village surrounded by towering Himalayan peaks. As the trail climbs higher, the landscape gradually transforms from dense forests into open meadows and snowy ridges. During winter, fresh snow covers the trail, the trees and the campsites, creating a magical white landscape.",
    "One of the most beautiful highlights of the trek is Brahmatal Lake, a serene high-altitude lake surrounded by mountains. The trail further leads towards the higher ridges and the summit, where trekkers are rewarded with spectacular panoramic views of Mt. Trishul, Nanda Ghunti and other Himalayan peaks.",
    "What makes the Brahmatal Trek in Uttarakhand special is the variety of landscapes packed into a relatively short Himalayan journey. From peaceful forests and frozen lakes to wide-open ridgelines and dramatic mountain views, every section of the trail offers something different.",
    "The trek is generally considered easy to moderate and is suitable for beginners with good physical fitness as well as experienced trekkers. However, winter conditions, snow and altitude make proper preparation essential.",
    "For those looking for a beautiful snow trek in Uttarakhand, Brahmatal offers the perfect combination of adventure, wilderness, Himalayan scenery and the quiet beauty of the mountains."
  ];

  TREKS[brahmatalIndex].highlights = [
    "Brahmatal Lake at ~10,400 ft",
    "Brahmatal Top at ~12,200 ft",
    "Jatropani Peak",
    "Mt. Trishul & Nanda Ghunti views",
    "Winter snow trails",
    "Bekaltal Lake",
    "Oak & rhododendron forests",
    "Open ridge walks",
    "Himalayan camping"
  ];

  TREKS[brahmatalIndex].usps = [
    {
      title: "Base village: Lohajung",
      description: "The trek runs out of Lohajung at 7,662 ft in Chamoli district, reached on a 250 km drive from Rishikesh or Dehradun \u2014 the same base village that serves Roopkund and Ali Bedni Bugyal."
    },
    {
      title: "Two high-altitude lakes on one trail",
      description: "Bekaltal on day two and Brahmatal on day three, both set in forest and meadow and both frozen over through the depths of winter."
    },
    {
      title: "Trishul and Nanda Ghunti at close range",
      description: "The ridge above Brahmatal faces Mt. Trishul and Nanda Ghunti head-on, with Jatropani Peak and the wider Garhwal range filling out the panorama on a clear morning."
    },
    {
      title: "A short trek with four distinct landscapes",
      description: "Oak and rhododendron forest, open meadow, high ridgeline and snow \u2014 all inside 22\u201324 km and five days, which is what makes Brahmatal such a complete first Himalayan winter trek."
    },
    {
      title: "A genuine snow trek from December to March",
      description: "Through the winter months the trail, the lakes and the campsites lie under fresh snow, and the grade rises accordingly \u2014 the reason most trekkers pick these four months for Brahmatal."
    }
  ];

  TREKS[brahmatalIndex].destinationHighlights = [
    { name: "Lohajung", blurb: "The base village at 7,662 ft in Chamoli, ringed by Himalayan peaks and the starting point for the trek." },
    { name: "Bekaltal", blurb: "The first campsite at about 9,950 ft, beside a quiet lake reached through oak and rhododendron forest." },
    { name: "Brahmatal Lake", blurb: "The serene high-altitude lake at roughly 10,400 ft that gives the trek its name, frozen through the winter months." },
    { name: "Brahmatal Top", blurb: "The 12,200 ft high point of the route, with a panorama that takes in Mt. Trishul, Nanda Ghunti and Jatropani Peak." },
    { name: "Daldam", blurb: "The final campsite, reached on the long descent from the ridge on day four." }
  ];

  TREKS[brahmatalIndex].differentiators = [
    "Region: Garhwal Himalayas, Chamoli district, Uttarakhand",
    "Trek type: winter snow trek to a high ridge, with Brahmatal Top at ~12,200 ft as the high point",
    "Terrain: forests, alpine meadows, open ridges and snow",
    "Best season: December to March, when the trail and both lakes lie under snow"
  ];

  TREKS[brahmatalIndex].similarTreks = [
    "kedarkantha-trek",
    "dayara-bugyal-trek",
    "kuari-pass-trek",
    "chopta-tungnath-trek"
  ];

  TREKS[brahmatalIndex].idealFor =
    "Beginners with basic fitness, first-time winter trekkers, experienced trekkers looking for a short snow trail, and mountain-photography enthusiasts.";

  TREKS[brahmatalIndex].importantNote =
    "Between December and March the trail is snowbound and the grade sits at the upper end of easy\u2013moderate; gaiters and microspikes may be needed depending on conditions, and your trek leader will set the summit-day start time accordingly. Views of Trishul and Nanda Ghunti depend entirely on the weather, so treat a clear morning on the ridge as a bonus rather than a guarantee.";

  TREKS[brahmatalIndex].itinerary = [
    {
      day: 1,
      title: "Dehradun / Rishikesh to Lohajung",
      driveDistance: "250 km",
      drivingTime: "10-12 Hours",
      pickupPoint: "Rishikesh / Dehradun",
      altitudePoints: [
        { location: "Rishikesh", m: 372, ft: 1220 },
        { location: "Lohajung", m: 2335, ft: 7662 }
      ],
      altitudeGain: { m: 1963, ft: 6442 },
      description: "A scenic mountain drive to Lohajung, the base village of the Brahmatal Trek.",
      detailedParagraphs: [
        "Your Brahmatal adventure begins early in the morning from Rishikesh or Dehradun. The road follows the Alaknanda valley deep into Chamoli district, towards the base village of Lohajung.",
        "The drive passes through Devprayag, Srinagar, Rudraprayag and Karnaprayag, where the rivers of the Garhwal meet, before turning off towards Tharali and Debal on the last stretch into the mountains.",
        "As the road climbs, the river valleys give way to forested slopes and the first of the high Himalayan peaks appear on the skyline.",
        "On arrival at Lohajung, check into the hotel or guesthouse and meet your trek leader and the rest of the group. The team runs a trek briefing and an equipment check, and explains the plan for the days ahead."
      ],
      highlights: ["Alaknanda Valley Drive", "River Confluences", "Lohajung Base Village", "Trek Briefing"],
      meals: "Dinner",
      stayType: "Hotel / Guesthouse in Lohajung"
    },
    {
      day: 2,
      title: "Lohajung to Bekaltal",
      trekDistance: "6 km",
      trekDuration: "5-6 Hours",
      altitudePoints: [
        { location: "Lohajung", m: 2335, ft: 7662 },
        { location: "Bekaltal", m: 3033, ft: 9950 }
      ],
      altitudeGain: { m: 698, ft: 2288 },
      description: "The trail passes through beautiful oak and rhododendron forests before reaching the peaceful Bekaltal campsite.",
      detailedParagraphs: [
        "After breakfast at Lohajung, the trekking begins. The trail leaves the village and enters dense oak and rhododendron forest almost immediately.",
        "The climb is steady rather than steep, and the forest stays with you for most of the day — moss on the trunks, light coming through the canopy and occasional clearings that open onto the valley below.",
        "In winter the whole of this section carries snow, and the forest floor, the branches and the trail itself turn white.",
        "By afternoon you reach Bekaltal, a quiet lake set among the trees, and the campsite for the night. Settle into your tent, eat a warm meal and let your body begin adjusting to the altitude."
      ],
      highlights: ["Oak & Rhododendron Forest", "Bekaltal Lake", "Snow Trail", "First Camp"],
      meals: "Breakfast, Lunch & Dinner",
      stayType: "Bekaltal campsite — twin sharing"
    },
    {
      day: 3,
      title: "Bekaltal to Brahmatal",
      trekDistance: "7 km",
      trekDuration: "6-7 Hours",
      altitudePoints: [
        { location: "Bekaltal", m: 3033, ft: 9950 },
        { location: "Brahmatal", m: 3185, ft: 10450 }
      ],
      altitudeGain: { m: 152, ft: 500 },
      description: "Trek through forests, meadows and scenic ridges towards the beautiful Brahmatal Lake.",
      detailedParagraphs: [
        "Wake to mountain views and, weather permitting, a Himalayan sunrise over the forest.",
        "The trail climbs out of the trees and onto open ground. Forest gives way to alpine meadow, and the meadow to a series of scenic ridges where the view finally opens out in every direction.",
        "The altitude gain on paper is modest, but the day is a long one and the walking is continuous — hold a comfortable pace, take regular breaks and keep drinking water.",
        "Ahead of you lies Brahmatal Lake, the serene high-altitude lake that gives the trek its name, frozen solid through the winter months. Camp is nearby, with Trishul and Nanda Ghunti standing over the ridge behind."
      ],
      highlights: ["Alpine Meadows", "Ridge Walk", "Brahmatal Lake", "Trishul & Nanda Ghunti"],
      meals: "Breakfast, Lunch & Dinner",
      stayType: "Brahmatal campsite — twin sharing"
    },
    {
      day: 4,
      title: "Brahmatal to Brahmatal Top, descend to Daldam",
      trekDistance: "12 km",
      trekDuration: "8-10 Hours",
      timeNote: { label: "Summit start", value: "Early morning" },
      altitudePoints: [
        { location: "Brahmatal", m: 3185, ft: 10450 },
        { location: "Brahmatal Top", m: 3719, ft: 12200 }
      ],
      altitudeGain: { m: 534, ft: 1750 },
      description: "The most exciting day of the trek. Ascend towards Brahmatal Top and enjoy magnificent Himalayan views before descending towards Daldam.",
      detailedParagraphs: [
        "This is the longest and most rewarding day of the Brahmatal Trek.",
        "Start early from camp. The trail climbs onto the ridgeline and stays there, gaining height across open snow slopes with the drop of the valley on either side.",
        "In winter this section can be genuinely demanding — snow depth and wind decide the pace, and gaiters or microspikes may be needed depending on conditions.",
        "At roughly 12,200 ft you reach Brahmatal Top, the high point of the trek. On a clear day the panorama takes in Mt. Trishul and Nanda Ghunti directly ahead, Jatropani Peak alongside, and the ranges of the Garhwal Himalayas laid out behind them. Take the time to enjoy it, and to photograph it.",
        "From the top, begin the long descent towards Daldam. The way down is easier on the lungs but hard on the legs after a full day out — reach camp by evening for a warm dinner and a well-earned rest."
      ],
      highlights: [
        "Brahmatal Top at ~12,200 ft",
        "Panoramic Himalayan Views",
        "Mt. Trishul & Nanda Ghunti",
        "Jatropani Peak",
        "High Ridge Walk"
      ],
      meals: "Breakfast, Packed Lunch & Dinner",
      stayType: "Daldam campsite — twin sharing"
    },
    {
      day: 5,
      title: "Daldam to Lohajung, drive to Rishikesh / Dehradun",
      trekDistance: "4 km",
      trekDuration: "4-5 Hours",
      driveDistance: "250 km",
      drivingTime: "10-12 Hours",
      timeNote: { label: "Drop-off", value: "Rishikesh / Dehradun" },
      altitudePoints: [
        { location: "Lohajung", m: 2335, ft: 7662 },
        { location: "Rishikesh", m: 372, ft: 1220 }
      ],
      altitudeGain: null,
      description: "Descend through the mountain trail to Lohajung, followed by the drive back to Rishikesh or Dehradun.",
      detailedParagraphs: [
        "After breakfast, begin the final descent from Daldam towards Lohajung.",
        "The trail drops back through forest and mountain slopes, and after several days at altitude the walk down feels easy as the air warms around you.",
        "At Lohajung the trekking section comes to an end. Board the vehicle for the long drive back down the valley, retracing the route through Karnaprayag, Rudraprayag, Srinagar and Devprayag.",
        "The Brahmatal Trek concludes on arrival in Rishikesh or Dehradun — with photographs, and with the memory of frozen lakes, snow-covered forest and the ridge that faces Trishul."
      ],
      highlights: ["Forest Descent", "Trek Ends at Lohajung", "Alaknanda Valley", "Journey Ends"],
      meals: "Breakfast",
      // The trek ends on this day; an empty stay keeps the generic
      // "Hotel / Homestay" fallback out of the day quick-info line.
      stayType: ""
    }
  ];

  /**
   * The source listing and its own itinerary disagree on the total distance, so
   * both are recorded as published rather than quietly reconciled: the route
   * summary gives 22-24 km, while the per-day figures (6 + 7 + 12 + 4) total
   * 29 km. The listing also publishes no altitude for the Daldam campsite, so
   * day 4 charts the climb to Brahmatal Top only.
   */
  TREKS[brahmatalIndex].sourceCaveat =
    "The published route gives a headline distance of 22–24 km, while the day-by-day trek distances total about 29 km. Both are listed here as published — your trek leader will confirm the exact route and daily distances on your departure.";

  TREKS[brahmatalIndex].article = {
    title: "Brahmatal Trek – Where the Mountains Teach You to Slow Down",
    standfirst:
      "Ancient forests, frozen lakes, snow-covered meadows and a ridge at 12,250 ft facing Trishul and Nanda Ghunti — the trail above Lohajung, told the way it is felt.",
    readMinutes: 8,
    sections: [
      {
        paragraphs: [
          "There are journeys where you simply travel from one place to another. And then there are journeys that quietly change something inside you.",
          "Brahmatal Trek is one such journey.",
          "Hidden in the magnificent Garhwal Himalayas of Uttarakhand, Brahmatal takes you away from the noise of everyday life and into a world of ancient forests, snow-covered meadows, high mountain ridges and peaceful alpine lakes. The trek begins from Lohajung in Chamoli district and climbs gradually into the Himalayan wilderness.",
          "What makes the Brahmatal Trek in Uttarakhand special is the incredible variety packed into a single journey. One moment you are walking beneath tall oak and rhododendron forests; a few hours later, the trees begin to disappear and the landscape opens into vast mountain ridges covered in snow.",
          "And ahead of you are the Himalayas."
        ]
      },
      {
        heading: "A Journey Into the Snow",
        paragraphs: [
          "Brahmatal is particularly famous as a winter snow trek in Uttarakhand. During the colder months, snow transforms the trail, forests and meadows into a completely different landscape. The region around Brahmatal Lake can become covered in snow and ice, creating the magical Himalayan experience that many trekkers dream of.",
          "But the real beauty isn’t just the snow.",
          "It is the silence.",
          "The sound of your boots pressing into fresh snow.",
          "The cold mountain wind against your face.",
          "The warm cup of tea waiting at camp.",
          "And the feeling of looking around and realising that, for a little while, you have left the ordinary world far behind."
        ]
      },
      {
        heading: "From Lohajung to the Heart of the Himalayas",
        paragraphs: [
          "The adventure begins at Lohajung, the traditional base village for the Brahmatal Trek.",
          "From here, the trail gradually climbs through beautiful Himalayan forests. Oak and rhododendron trees create a natural corridor around the trail, while occasional openings reveal glimpses of the mountains beyond.",
          "As you gain altitude, the landscape begins to change.",
          "The forest becomes thinner.",
          "The trail becomes more open.",
          "The horizon becomes wider.",
          "And eventually, you find yourself walking across beautiful alpine terrain with enormous Himalayan peaks rising in the distance.",
          "The journey itself becomes the destination."
        ]
      },
      {
        heading: "Bekaltal – The First Beautiful Surprise",
        paragraphs: [
          "One of the early highlights of the trek is Bekaltal, a peaceful high-altitude lake surrounded by forest.",
          "Reaching Bekaltal after the day’s climb feels rewarding. In winter, snow can cover the surrounding landscape, creating a quiet and almost dreamlike atmosphere.",
          "This is where you begin to understand the rhythm of Himalayan trekking.",
          "Walk.",
          "Breathe.",
          "Rest.",
          "Look around.",
          "Then take another step."
        ]
      },
      {
        heading: "Brahmatal Lake – Where Silence Feels Different",
        paragraphs: [
          "Eventually, the trail leads towards Brahmatal Lake, the natural heart of the trek.",
          "Surrounded by mountains and open Himalayan landscapes, the lake offers a peaceful setting unlike anything found in the cities below.",
          "In winter, the lake and its surroundings can freeze and become covered with snow, making the experience particularly spectacular.",
          "Standing beside Brahmatal Lake, there is very little to hear.",
          "No traffic.",
          "No horns.",
          "No constant notifications.",
          "Just the wind, the mountains and your own thoughts.",
          "Perhaps that is why moments like these stay with trekkers long after they return home."
        ]
      },
      {
        heading: "Brahmatal Top – When the Mountains Open Up",
        paragraphs: [
          "The biggest reward comes as the trail climbs towards Brahmatal Top, reaching approximately 12,250 ft.",
          "From the higher ridge, the landscape opens dramatically, offering panoramic Himalayan views. On clear days, the magnificent Mt. Trishul and Nanda Ghunti dominate the skyline, with other Himalayan peaks visible across the horizon.",
          "You may have walked for hours to reach this point.",
          "Your legs may be tired.",
          "The cold may be intense.",
          "But then you look up.",
          "And suddenly, everything becomes quiet.",
          "The mountains don’t ask you how fast you reached.",
          "They simply remind you that you made it."
        ]
      },
      {
        heading: "The Beauty of a Himalayan Sunrise",
        paragraphs: [
          "There are sunsets you photograph.",
          "And then there are sunrises you simply watch.",
          "On Brahmatal, early mornings can bring incredible views as the first sunlight touches the Himalayan peaks.",
          "The snow changes colour.",
          "The mountains slowly glow.",
          "The sky begins to brighten.",
          "For a few moments, the entire landscape feels alive.",
          "It is one of those experiences that a camera can capture, but never completely explain."
        ]
      },
      {
        heading: "More Than Just a Winter Trek",
        paragraphs: [
          "The Brahmatal Trek is often chosen by trekkers looking for an accessible introduction to high-altitude Himalayan trekking. It is generally graded easy to moderate, although winter snow, cold temperatures and altitude can make the trail considerably more demanding.",
          "But trekking is never only about difficulty.",
          "It is about discovering what you are capable of.",
          "There will be moments when the climb feels long.",
          "There will be moments when you wonder how much farther you have to go.",
          "But slowly, step by step, you move forward.",
          "And that is perhaps the greatest lesson the mountains teach us:",
          "You don’t have to conquer the mountain. You only have to keep walking."
        ]
      },
      {
        heading: "A Few Days Away From Everything",
        paragraphs: [
          "Modern life moves quickly.",
          "Messages keep coming.",
          "Phones keep ringing.",
          "Schedules keep changing.",
          "The Brahmatal Trek gives you something rare — time.",
          "Time to walk without looking at a clock.",
          "Time to sit beside your trekking companions and talk.",
          "Time to watch clouds move across distant peaks.",
          "Time to look at a sky full of stars.",
          "And time to hear your own thoughts again.",
          "This is why people return from the mountains with more than photographs.",
          "They return with memories."
        ]
      },
      {
        heading: "Why Brahmatal Trek Belongs on Your Himalayan Bucket List",
        paragraphs: [
          "If you are looking for a snow trek in Uttarakhand, Brahmatal brings together many of the experiences trekkers love about the Himalayas:",
          "• Snow-covered trails during winter",
          "• Ancient oak and rhododendron forests",
          "• Bekaltal and Brahmatal Lake",
          "• Beautiful alpine meadows",
          "• High-altitude mountain ridges",
          "• Brahmatal Top at around 12,250 ft",
          "• Panoramic views of Trishul and Nanda Ghunti",
          "• Himalayan sunsets and sunrises",
          "• Peaceful campsites beneath the mountain sky",
          "But the most beautiful part cannot be listed.",
          "It is the feeling you get when you finally stand on a mountain ridge after walking for hours and realise that you left for the trek as one person and are returning as someone slightly different."
        ]
      },
      {
        heading: "Brahmatal Is Waiting",
        paragraphs: [
          "Maybe you are looking for snow.",
          "Maybe you are looking for adventure.",
          "Maybe you want to escape the city for a few days.",
          "Or maybe you simply want to feel something that everyday life has made you forget.",
          "Whatever brings you to Brahmatal, the mountains have their own way of giving you something more.",
          "A sunrise.",
          "A frozen lake.",
          "A difficult climb.",
          "A stranger who becomes a friend.",
          "A silent moment on a ridge.",
          "A memory that stays with you long after the trek is over.",
          "Brahmatal Trek is not just a journey to 12,250 feet.",
          "It is a journey into the quietest part of yourself.",
          "So pack your backpack.",
          "Tie your laces.",
          "Take a deep breath.",
          "And start walking.",
          "Because somewhere beyond Lohajung, beyond the forests and above the clouds, the Himalayas are waiting for you."
        ]
      }
    ],
    signoff: "Brahmatal Trek with Trip My Soul."
  };

  TREKS[brahmatalIndex].faqs = [
    {
      title: "Where is the Brahmatal Trek located?",
      description: "Brahmatal Trek is located in the Garhwal Himalayas of Uttarakhand, with Lohajung serving as the base camp."
    },
    {
      title: "What is the highest altitude of the Brahmatal Trek?",
      description: "The trek reaches approximately 12,200 ft at Brahmatal Top."
    },
    {
      title: "How difficult is the Brahmatal Trek?",
      description: "Brahmatal is generally considered an easy to moderate trek. Basic fitness and the ability to walk for several hours are recommended."
    },
    {
      title: "How many days are required for the Brahmatal Trek?",
      description: "The standard Trip My Soul itinerary is 5 Days / 4 Nights, including the journey to and from Lohajung."
    },
    {
      title: "What is the best time for the Brahmatal Trek?",
      description: "December to March is the most popular period for experiencing snow. Spring and autumn offer greener landscapes and clearer mountain views."
    },
    {
      title: "Can beginners do the Brahmatal Trek?",
      description: "Yes. Beginners with good physical fitness can undertake the Brahmatal Trek. Proper preparation is especially important during winter."
    },
    {
      title: "How much distance is covered on the Brahmatal Trek?",
      description: "The trekking route covers approximately 29 km, depending on the exact trail and conditions."
    },
    {
      title: "Will we get snowfall on the Brahmatal Trek?",
      description: "Snowfall is not guaranteed, as it depends on weather conditions. During the peak winter season, trekkers can usually expect snow-covered sections of the trail."
    },
    {
      title: "What are the major highlights of the Brahmatal Trek?",
      description: "Major highlights include Brahmatal Lake, Brahmatal Top, snow-covered forests, alpine meadows, Himalayan ridges and panoramic views of Mt. Trishul and Nanda Ghunti."
    },
    {
      title: "What should I carry for the Brahmatal Trek?",
      description: "Essential items include good trekking shoes, warm layers, a waterproof jacket, gloves, a woollen cap, sunglasses, sunscreen, a water bottle, personal medicines, a headlamp and a small backpack."
    }
  ];

  TREKS[brahmatalIndex].eligibilityCriteria = [
    { icon: "User", text: "Age: 10–60 years recommended" },
    { icon: "Footprints", text: "Experience: No prior trekking experience required" },
    { icon: "Dumbbell", text: "Fitness: Basic to moderate fitness required" },
    { icon: "Mountain", text: "Altitude: Up to 12,200 ft / 3,719 m" },
    { icon: "Snowflake", text: "Must be comfortable with cold and snow conditions" },
    { icon: "Stethoscope", text: "Participants should be medically fit for high-altitude trekking" }
  ];

  /** Set against this trek's own day lengths — four trekking days of 4–10 hours. */
  TREKS[brahmatalIndex].fitnessCriteria = [
    { icon: "Footprints", text: "Able to walk 5–6 km comfortably on uneven ground" },
    { icon: "TrendingUp", text: "Able to sustain a 5–7 hour walking day, and 8–10 hours on summit day" },
    { icon: "Dumbbell", text: "Good stamina and leg strength for continuous ascent and descent" },
    { icon: "Backpack", text: "Comfortable carrying a light daypack" },
    { icon: "Activity", text: "Regular walking, jogging or stair training for 3–4 weeks before the trek is recommended" }
  ];

  TREKS[brahmatalIndex].howToReach = {
    intro: "The Brahmatal Trek starts from Lohajung in Chamoli district, Uttarakhand. For Trip My Soul, the meeting point is Rishikesh or Dehradun, from where trekkers travel by road to Lohajung.",
    air: {
      summaryLabel: "Nearest Airport",
      summary: "Jolly Grant Airport, Dehradun (DED)",
      detail: "From the airport, travel by taxi or cab to Lohajung — roughly 250 km, and about 10–12 hours on the road depending on traffic and conditions. Recommended for travellers coming from Delhi, Mumbai, Bengaluru and other cities with flight connectivity to Dehradun."
    },
    train: {
      summaryLabel: "Nearest Railway Stations",
      summary: "Dehradun and Kathgodam",
      detail: "Dehradun is about 250 km from Lohajung by road and Kathgodam about 210–220 km, at roughly 8–10 hours from Kathgodam. From either station, hire a private vehicle or join a shared/group transfer to Lohajung. Rishikesh and Haridwar are convenient alternative railheads, followed by the same road journey."
    },
    road: {
      summaryLabel: "Route",
      summary: "Rishikesh to Lohajung via Rudraprayag, Karnaprayag and Tharali",
      detail: "Lohajung is well connected by road with the major cities of Uttarakhand: Rishikesh–Lohajung is about 250 km and 9–11 hours, Dehradun–Lohajung about 250 km and 10–12 hours, and Kathgodam–Lohajung about 210–220 km and 8–10 hours. By bus, take a service from Dehradun or Rishikesh to Karnaprayag or a nearby town and continue towards Lohajung by local or shared transport — for trekkers, a pre-arranged vehicle is generally more convenient. The last stretch beyond Tharali and Debal is a narrow mountain road, and travel times rise sharply after snowfall.",
      route: ["Rishikesh", "Devprayag", "Srinagar", "Rudraprayag", "Karnaprayag", "Tharali", "Debal", "Mundoli", "Lohajung"],
      facts: [
        { label: "Distance", value: "~250 km" },
        { label: "Drive", value: "~10–12 hours" },
        { label: "Options", value: "Bus / Shared Taxi / Private Cab / Tempo Traveller" }
      ]
    },
    pickup: {
      point: "Rishikesh / Dehradun",
      time: "Morning of Day 1",
      dropPoint: "Rishikesh / Dehradun",
      dropTime: "Late evening of Day 5",
      note: "Route for TMS trekkers: Rishikesh/Dehradun → Lohajung → Bekaltal → Brahmatal → Brahmatal Top → Daldam → Lohajung."
    }
  };

  TREKS[brahmatalIndex].bookingAdvance = 2000;

  /** Company-wide terms, as carried on the other Garhwal treks. */
  TREKS[brahmatalIndex].bookingTerms = [
    { title: "Trek Price", description: "₹6,499 per person." },
    { title: "Booking Amount", description: "₹2,000 per person to confirm your seat." },
    { title: "Balance Payment", description: "The remaining balance must be paid before the trek starts." },
    { title: "Confirmation", description: "Booking is confirmed after payment of the required booking amount." },
    { title: "ID Proof", description: "Valid government-issued ID is mandatory for all trekkers." },
    { title: "Fitness & Medical", description: "Trekkers must meet the required fitness and medical criteria." },
    { title: "Itinerary Changes", description: "The itinerary may be modified due to weather, snowfall, road conditions, trail conditions or safety requirements." },
    { title: "Snow & Weather", description: "No guarantee can be given regarding snowfall or weather conditions." },
    { title: "Unforeseen Expenses", description: "Any additional cost arising due to natural calamities, roadblocks, government restrictions or emergency situations will be borne by the trekker." },
    { title: "On-Trail Instructions", description: "Trekkers must follow the instructions of the Trek Leader and support staff." },
    { title: "Conduct on the Trail", description: "Littering, alcohol, drugs and unsafe behaviour are strictly prohibited during the trek." },
    { title: "Right to Modify", description: "In case of adverse weather or unforeseen circumstances, Trip My Soul may modify or cancel the itinerary for trekker safety." },
    { title: "Personal Belongings", description: "Personal belongings are the responsibility of the trekker." },
    { title: "Policies", description: "By booking the trek, participants agree to Trip My Soul's applicable booking, cancellation and safety policies." }
  ];

  TREKS[brahmatalIndex].inclusions = [
    { title: "Accommodation", description: "Triple/quad sharing basis as per the itinerary." },
    { title: "Stay at Lohajung", description: "Hotel or guesthouse accommodation at Lohajung." },
    { title: "Camping accommodation", description: "Tented accommodation during the trek." },
    { title: "Meals", description: "All meals during the trek — breakfast, lunch & dinner." },
    { title: "Trek Leader / Guide", description: "Experienced Trek Leader/Guide for the batch." },
    { title: "Support Staff", description: "Professional support staff and local ground team." },
    { title: "Camping Equipment", description: "Camping equipment for the duration of the trek." },
    { title: "Sleeping Gear", description: "Sleeping bags and mattresses." },
    { title: "Tents", description: "Tents and common camping equipment." },
    { title: "Permits", description: "Forest permits and applicable entry charges." },
    { title: "First Aid", description: "First-aid kit and basic medical support." },
    { title: "Trekking Equipment", description: "Trekking equipment required by the operator." },
    { title: "Transportation", description: "All transportation mentioned in the itinerary." },
    { title: "Local Transfers", description: "Lohajung → trek starting/ending point transfers, wherever applicable." }
  ];

  TREKS[brahmatalIndex].exclusions = [
    { title: "Personal expenses", description: "Snacks, beverages and laundry." },
    { title: "Personal trekking equipment", description: "Personal trekking equipment and clothing." },
    { title: "Offloading & porters", description: "Backpack offloading / porter charges." },
    { title: "Insurance", description: "Travel insurance." },
    { title: "Personal medicines", description: "Personal medicines." },
    { title: "Emergency evacuation", description: "Emergency evacuation / rescue expenses." },
    { title: "Additional transportation", description: "Additional transportation due to unforeseen circumstances." },
    { title: "Extra stay & meals", description: "Additional hotel stays or meals outside the itinerary." },
    { title: "Weather & roadblocks", description: "Any cost arising due to weather, landslides, roadblocks or natural calamities." },
    { title: "Anything not listed", description: "Any activity or service not specifically mentioned under inclusions." },
    { title: "GST", description: "GST, if applicable." }
  ];

  TREKS[brahmatalIndex].batches = {
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

  TREKS[brahmatalIndex].gallery = [
    { url: "/Trips_gallery/Brahmatal/IMG_4207.JPG.jpeg", caption: "Setting off from Lohajung" },
    { url: "/Trips_gallery/Brahmatal/IMG_4217.JPG.jpeg", caption: "Into the oak and rhododendron forest" },
    { url: "/Trips_gallery/Brahmatal/IMG_4226.JPG.jpeg", caption: "Snow on the forest trail" },
    { url: "/Trips_gallery/Brahmatal/IMG_4230.JPG.jpeg", caption: "The lake at Bekaltal" },
    { url: "/Trips_gallery/Brahmatal/IMG_4233.JPG.jpeg", caption: "First camp among the trees" },
    { url: "/Trips_gallery/Brahmatal/IMG_4251.JPG.jpeg", caption: "Climbing out of the forest" },
    { url: "/Trips_gallery/Brahmatal/IMG_4265.JPG.jpeg", caption: "Open meadow above the treeline" },
    { url: "/Trips_gallery/Brahmatal/IMG_4266.JPG.jpeg", caption: "Ridge walk towards Brahmatal" },
    { url: "/Trips_gallery/Brahmatal/IMG_4307.JPG.jpeg", caption: "Brahmatal Lake, frozen over in winter" },
    { url: "/Trips_gallery/Brahmatal/IMG_4308.JPG.jpeg", caption: "Camp beside the lake" },
    { url: "/Trips_gallery/Brahmatal/IMG_4309.JPG.jpeg", caption: "Morning light on the ridge" },
    { url: "/Trips_gallery/Brahmatal/IMG_4310.JPG.jpeg", caption: "The climb to Brahmatal Top" },
    { url: "/Trips_gallery/Brahmatal/IMG_4312.JPG.jpeg", caption: "Snow slopes below the summit" },
    { url: "/Trips_gallery/Brahmatal/IMG_4313.JPG.jpeg", caption: "Brahmatal Top at 12,200 ft" },
    { url: "/Trips_gallery/Brahmatal/IMG_4314.JPG.jpeg", caption: "Mt. Trishul and Nanda Ghunti from the ridge" },
    { url: "/Trips_gallery/Brahmatal/IMG_4315.JPG.jpeg", caption: "Garhwal panorama on a clear morning" },
    { url: "/Trips_gallery/Brahmatal/IMG_4316.JPG.jpeg", caption: "The team on the summit ridge" },
    { url: "/Trips_gallery/Brahmatal/IMG_4317.JPG.jpeg", caption: "Jatropani Peak across the valley" },
    { url: "/Trips_gallery/Brahmatal/IMG_4318.JPG.jpeg", caption: "The long descent towards Daldam" },
    { url: "/Trips_gallery/Brahmatal/IMG_4319.JPG.jpeg", caption: "Winter light over the campsite" },
    { url: "/Trips_gallery/Brahmatal/IMG_4320.JPG.jpeg", caption: "Warming up between sections" },
    { url: "/Trips_gallery/Brahmatal/IMG_4321.JPG.jpeg", caption: "Back down through the rhododendrons" },
    { url: "/Trips_gallery/Brahmatal/IMG_4322.JPG.jpeg", caption: "The last of the snow on the way down" },
    { url: "/Trips_gallery/Brahmatal/IMG_4323.JPG.jpeg", caption: "Valley views on the walk out" }
  ];
}

// Static details for the Har Ki Dun Trek (uid: har-ki-dun-trek), the valley
// route out of Sankri. The itinerary is the only section without published
// copy, so it still renders from `trekDefaults.ts`. The cancellation
// policy is deliberately left unset: this listing runs the same terms as
// Kedarkantha, which publishes none of its own, so both render the shared copy
// from `trekDefaults.ts` / `TrekCancellation`.
const harKiDunIndex = TREKS.findIndex(t => t.slug === 'har-ki-dun-trek');
if (harKiDunIndex !== -1) {
  TREKS[harKiDunIndex].inclusions = [
    { title: "Transportation", description: "Dehradun to Sankri and return transportation as per the itinerary." },
    { title: "Stay at Sankri", description: "Accommodation at Sankri as per the itinerary." },
    { title: "Accommodation", description: "Guesthouses, homestays and camps during the trek." },
    { title: "Meals", description: "All meals during the trek — breakfast, lunch, evening snacks and dinner." },
    { title: "Tea & Coffee", description: "Tea/coffee through the trek." },
    { title: "Trek Leader", description: "Experienced Trek Leader and local trekking staff." },
    { title: "Support Staff", description: "Cook and support staff." },
    { title: "Camping Equipment", description: "Common technical and camping equipment." },
    { title: "Tents & Sleeping Bags", description: "Tents and sleeping bags for the duration of the trek." },
    { title: "Campsite Setup", description: "Camping mattresses, toilet tents and dining setup." },
    { title: "First Aid", description: "Basic first-aid kit and medical assistance." },
    { title: "Permits", description: "Forest/trek permits and entry charges." },
    { title: "Porter & Mule Support", description: "Porter/mule support for common trek equipment." },
    { title: "Trek Support", description: "Basic trek support and safety assistance." }
  ];

  TREKS[harKiDunIndex].exclusions = [
    { title: "Personal expenses", description: "Personal expenses, snacks and beverages other than those mentioned." },
    { title: "Personal porter", description: "Personal porter/mule for carrying your own backpack." },
    { title: "Personal gear", description: "Trekking shoes, jackets, rainwear, trekking poles and other personal gear." },
    { title: "Emergency evacuation", description: "Any emergency evacuation/rescue cost due to medical or personal reasons." },
    { title: "Medical expenses", description: "Medical expenses beyond basic first aid." },
    { title: "Extra stay & meals", description: "Any additional accommodation or meals due to bad weather, roadblocks or unforeseen circumstances." },
    { title: "Insurance", description: "Travel insurance." },
    { title: "Additional transportation", description: "Any additional transportation caused by route diversion, road closure or government restrictions." },
    { title: "GST", description: "GST, if applicable." },
    { title: "Anything not listed", description: "Anything not specifically mentioned under Inclusions." }
  ];

  TREKS[harKiDunIndex].minAge = 12;
  TREKS[harKiDunIndex].maxAge = 55;
  TREKS[harKiDunIndex].minAgeWithGuardian = 12;
  TREKS[harKiDunIndex].soloAgeMin = 18;

  TREKS[harKiDunIndex].eligibilityCriteria = [
    { icon: "User", text: "Age: 12–55 years, subject to fitness and medical suitability" },
    { icon: "Footprints", text: "Experience: Previous trekking experience helps but is not mandatory for reasonably fit beginners" },
    { icon: "Mountain", text: "Altitude: Be prepared for high-altitude conditions and significant elevation gain" },
    { icon: "ShieldCheck", text: "Children below 18 must be accompanied by a parent or guardian" },
    { icon: "Stethoscope", text: "Above 55 years may join after medical clearance and a fitness assessment" },
    { icon: "Snowflake", text: "Must be comfortable with cold weather, basic mountain accommodation and changing conditions" }
  ];

  /** Moderate grade, on 5–7 hour walking days over uneven mountain terrain. */
  TREKS[harKiDunIndex].fitnessCriteria = [
    { icon: "Footprints", text: "Able to walk 6–8 km comfortably, building up to 10–12 km" },
    { icon: "TrendingUp", text: "Comfortable walking 5–7 hours a day on uneven mountain terrain" },
    { icon: "Dumbbell", text: "Reasonable stamina and leg strength for sustained ascent and descent" },
    { icon: "Backpack", text: "Comfortable carrying a light daypack" },
    { icon: "Activity", text: "Not recommended with an uncontrolled medical condition, or without preparation for prolonged uphill/downhill walking" }
  ];

  // Transcribed verbatim from the Google reviews on the Trip My Soul profile.
  TREKS[harKiDunIndex].externalReviews = [
    {
      source: "Google",
      subject: "Trip My Soul",
      author: "Abhijeet Shaw",
      rating: 5,
      date: "9 months ago",
      text: [
        "Recently I visit Har Ki Doon with Trip My Soul.",
        "Their behaviour is very kind, humble and sweet.",
        "Their food quality is very good.",
        "Overall if i plan any trip in future I will definetly choose this Agency Trip My Soul."
      ]
    },
    {
      source: "Google",
      subject: "Trip My Soul",
      author: "Dilbagh singh",
      rating: 5,
      date: "6 months ago",
      text: [
        "I had an incredible experience with this trekking company! Everything was very well managed from beginning to end. The food was absolutely amazing — fresh, delicious, and perfectly prepared even in the mountains. It truly exceeded my expectations.",
        "A special thanks to Rakesh Negi and Shishpal Panwar for being such outstanding guides. They were extremely supportive, knowledgeable, and friendly throughout the trek. They kept us motivated, ensured our safety at every step, and made the whole journey fun and memorable.",
        "Their dedication and positive attitude made the experience even more special. I highly recommend this company to anyone looking for a safe, well-organized, and unforgettable trekking adventure!"
      ]
    },
    {
      source: "Google",
      subject: "Trip My Soul",
      author: "Arnab Halder",
      rating: 5,
      date: "9 months ago",
      text: [
        "After saying \"Goodbye Mountain\", I can say, I experienced my frist trekk Har ki dun like a \"family tour\" with \"Trip my Soul\". With friend like trekk Guide , food like own home , I just love the 7 days with You guys. Planning for the next trip soon."
      ]
    }
  ];

  TREKS[harKiDunIndex].reviewVideos = [
    "https://youtube.com/shorts/FS6NI7Nf8Ks",
    "https://youtube.com/shorts/sDK2x-oeUZU"
  ];

  TREKS[harKiDunIndex].howToReach = {
    intro: "The Har Ki Dun Trek starts from Sankri, a village in the Uttarkashi district of Uttarakhand, and the most convenient gateway is Dehradun.",
    air: {
      summaryLabel: "Nearest Airport",
      summary: "Jolly Grant Airport, Dehradun (DED)",
      detail: "From the airport, reach Dehradun and continue by road to Sankri."
    },
    train: {
      summaryLabel: "Nearest Railway Station",
      summary: "Dehradun Railway Station",
      detail: "Dehradun is the nearest major railhead. From the station, continue to Sankri by bus, shared taxi or private cab."
    },
    road: {
      summaryLabel: "Route",
      summary: "Dehradun to Sankri via Purola and Mori",
      detail: "Dehradun is the most convenient starting point. Reach Sankri by shared or private taxi, or by bus. From Sankri the trek begins with a drive to Taluka, followed by the walk towards the Har Ki Dun valley via villages such as Gangad and Osla, depending on the itinerary.",
      route: ["Dehradun", "Mussoorie", "Naugaon", "Purola", "Mori", "Netwar", "Sankri"],
      facts: [
        { label: "Distance", value: "~190–200 km" },
        { label: "Drive", value: "~8–10 hours" },
        { label: "Options", value: "Bus / Shared Taxi / Private Cab" }
      ]
    },
    pickup: {
      point: "Dehradun Railway Station",
      time: "6:00 AM on Day 1",
      dropPoint: "Dehradun",
      dropTime: "Evening of Day 7",
      note: "Reach Dehradun a day before the trek so the drive to Sankri can start early the next morning."
    }
  };

  TREKS[harKiDunIndex].maxAltitude = "11,000 ft / 3,500 m";

  TREKS[harKiDunIndex].similarTreks = [
    "kedarkantha-trek",
    "phulara-ridge-trek",
    "ali-bedni-bugyal-trek",
    "brahmatal-trek",
    "kuari-pass-trek"
  ];

  TREKS[harKiDunIndex].heroImage =
    "/Trips_gallery/Har_Ki_Dun/IMG_4389.JPG.jpeg";

  TREKS[harKiDunIndex].heroImages = [
    "/Trips_gallery/Har_Ki_Dun/IMG_4395.JPG.jpeg",
    "/Trips_gallery/Har_Ki_Dun/IMG_4402.JPG.jpeg",
    "/Trips_gallery/Har_Ki_Dun/IMG_4410.JPG.jpeg"
  ];

  TREKS[harKiDunIndex].gallery = [
    { url: "/Trips_gallery/Har_Ki_Dun/IMG_4389.JPG.jpeg", caption: "The road from Dehradun climbing towards Sankri" },
    { url: "/Trips_gallery/Har_Ki_Dun/IMG_4390.JPG.jpeg", caption: "Sankri, the base village for Har Ki Dun" },
    { url: "/Trips_gallery/Har_Ki_Dun/IMG_4391.JPG.jpeg", caption: "Setting off from Taluka into the Supin valley" },
    { url: "/Trips_gallery/Har_Ki_Dun/IMG_4392.JPG.jpeg", caption: "Pine, oak and deodar on the forest trail" },
    { url: "/Trips_gallery/Har_Ki_Dun/IMG_4393.JPG.jpeg", caption: "A mountain bridge over the Supin" },
    { url: "/Trips_gallery/Har_Ki_Dun/IMG_4394.JPG.jpeg", caption: "The river alongside the trail" },
    { url: "/Trips_gallery/Har_Ki_Dun/IMG_4395.JPG.jpeg", caption: "Open meadows on the way to Osla" },
    { url: "/Trips_gallery/Har_Ki_Dun/IMG_4396.JPG.jpeg", caption: "Wooden houses in the village of Osla" },
    { url: "/Trips_gallery/Har_Ki_Dun/IMG_4397.JPG.jpeg", caption: "Stone pathways through the old village" },
    { url: "/Trips_gallery/Har_Ki_Dun/IMG_4398.JPG.jpeg", caption: "Climbing towards the Har Ki Dun valley" },
    { url: "/Trips_gallery/Har_Ki_Dun/IMG_4399.JPG.jpeg", caption: "The valley opening up below the peaks" },
    { url: "/Trips_gallery/Har_Ki_Dun/IMG_4400.JPG.jpeg", caption: "Camp in the Har Ki Dun valley" },
    { url: "/Trips_gallery/Har_Ki_Dun/IMG_4401.JPG.jpeg", caption: "Himalayan peaks around the valley" },
    { url: "/Trips_gallery/Har_Ki_Dun/IMG_4402.JPG.jpeg", caption: "Morning light on the ridgeline" },
    { url: "/Trips_gallery/Har_Ki_Dun/IMG_4403.JPG.jpeg", caption: "The team on the trail" },
    { url: "/Trips_gallery/Har_Ki_Dun/IMG_4404.JPG.jpeg", caption: "The road from Dehradun climbing towards Sankri" },
    { url: "/Trips_gallery/Har_Ki_Dun/IMG_4405.JPG.jpeg", caption: "Sankri, the base village for Har Ki Dun" },
    { url: "/Trips_gallery/Har_Ki_Dun/IMG_4406.JPG.jpeg", caption: "Setting off from Taluka into the Supin valley" },
    { url: "/Trips_gallery/Har_Ki_Dun/IMG_4407.JPG.jpeg", caption: "Pine, oak and deodar on the forest trail" },
    { url: "/Trips_gallery/Har_Ki_Dun/IMG_4408.JPG.jpeg", caption: "A mountain bridge over the Supin" },
    { url: "/Trips_gallery/Har_Ki_Dun/IMG_4409.JPG.jpeg", caption: "The river alongside the trail" },
    { url: "/Trips_gallery/Har_Ki_Dun/IMG_4410.JPG.jpeg", caption: "Open meadows on the way to Osla" },
    { url: "/Trips_gallery/Har_Ki_Dun/IMG_4411.JPG.jpeg", caption: "Wooden houses in the village of Osla" },
    { url: "/Trips_gallery/Har_Ki_Dun/IMG_4412.JPG.jpeg", caption: "Stone pathways through the old village" },
    { url: "/Trips_gallery/Har_Ki_Dun/IMG_4413.JPG.jpeg", caption: "Climbing towards the Har Ki Dun valley" },
    { url: "/Trips_gallery/Har_Ki_Dun/IMG_4414.JPG.jpeg", caption: "The valley opening up below the peaks" },
    { url: "/Trips_gallery/Har_Ki_Dun/IMG_4415.JPG.jpeg", caption: "Camp in the Har Ki Dun valley" },
    { url: "/Trips_gallery/Har_Ki_Dun/IMG_4416.JPG.jpeg", caption: "Himalayan peaks around the valley" },
    { url: "/Trips_gallery/Har_Ki_Dun/IMG_4417.JPG.jpeg", caption: "Morning light on the ridgeline" },
    { url: "/Trips_gallery/Har_Ki_Dun/HKD_group_river.jpeg", caption: "Beside the Supin river" },
    { url: "/Trips_gallery/Har_Ki_Dun/HKD_river_pines.jpeg", caption: "The river running through the pines" },
    { url: "/Trips_gallery/Har_Ki_Dun/HKD_group_meadow.jpeg", caption: "The group crossing an open meadow" },
    { url: "/Trips_gallery/Har_Ki_Dun/HKD_camp_tents.jpeg", caption: "Camp pitched in the valley" },
    { url: "/Trips_gallery/Har_Ki_Dun/HKD_flag_shrine.jpeg", caption: "Prayer flags at a valley shrine" },
    { url: "/Trips_gallery/Har_Ki_Dun/HKD_swargarohini.jpeg", caption: "Swargarohini standing over the valley" },
    { url: "/Trips_gallery/Har_Ki_Dun/HKD_summit_banner.jpeg", caption: "The team in the Har Ki Dun valley" },
  ];

  TREKS[harKiDunIndex].article = {
    title: "Har Ki Dun Trek: A Journey to the Valley That Feels Like Home",
    standfirst:
      "Ancient villages, wooden houses, rushing rivers, dense forests and snow-covered peaks — a Garhwal valley where life still moves at the pace of nature.",
    readMinutes: 7,
    sections: [
      {
        paragraphs: [
          "There are mountains you climb for the view, and then there are mountains you walk through to find something within yourself.",
          "The Har Ki Dun Trek is one of those journeys.",
          "Hidden deep in the Garhwal Himalayas of Uttarakhand, Har Ki Dun is not just a trekking destination. It is a valley of ancient villages, wooden houses, rushing rivers, dense forests and snow-covered peaks — a place where life still moves at the pace of nature.",
          "As the trail slowly takes you away from roads, traffic and city noise, something changes. Your phone becomes less important. Your footsteps become more meaningful. And the mountains begin to speak."
        ]
      },
      {
        heading: "The Journey Begins in Sankri",
        paragraphs: [
          "The journey to Har Ki Dun begins from Sankri, a small mountain village surrounded by towering Himalayan peaks.",
          "The road from Dehradun to Sankri is itself an experience. As you leave the city behind, the landscape changes from busy roads to quiet mountain valleys. Rivers begin to accompany you, forests become denser and the air feels noticeably different.",
          "By the time you reach Sankri, you know that the real journey is about to begin.",
          "The next morning, you leave the comfort of the road behind.",
          "And you start walking."
        ]
      },
      {
        heading: "From Taluka to the Heart of the Himalayas",
        paragraphs: [
          "The trail begins around Taluka and gradually enters the beautiful Supin River valley.",
          "Every turn brings something different.",
          "Sometimes the trail passes through thick forests of pine, oak and deodar. Sometimes it opens into green meadows. At other times, the sound of the river becomes your only companion.",
          "The trail may test your legs, but it constantly rewards your eyes.",
          "Mountain bridges sway above rushing streams. Birds disappear into the forest. Waterfalls appear unexpectedly beside the trail.",
          "And somewhere between the tired legs and the beautiful views, you realize that you have stopped asking, “How far is left?”",
          "You simply want to keep walking."
        ]
      },
      {
        heading: "Osla – A Village Frozen in Time",
        paragraphs: [
          "One of the most memorable parts of the Har Ki Dun Trek is walking through the traditional Himalayan villages of the valley.",
          "Osla is particularly special.",
          "The wooden houses, stone pathways, traditional architecture and simple mountain lifestyle tell stories that photographs can never completely capture.",
          "Here, people still wake up with the mountains and end their day with the fading light of the sun.",
          "You may see villagers working in their fields, children walking through narrow paths and animals grazing around traditional homes.",
          "There is something deeply beautiful about this simplicity.",
          "In a world where everything is becoming faster, places like Osla remind us that a slower life can also be a richer life."
        ]
      },
      {
        heading: "The Forests That Make You Feel Alive",
        paragraphs: [
          "The forests on the Har Ki Dun trail are not just scenery.",
          "They are part of the experience.",
          "Walking beneath tall trees, listening to the wind moving through the branches and hearing the river somewhere below creates a silence that feels completely different from the silence of a city.",
          "There is no traffic.",
          "No horns.",
          "No constant notifications.",
          "Just footsteps.",
          "And breathing.",
          "And mountains.",
          "Sometimes, that is all we need."
        ]
      },
      {
        heading: "And Then Comes Har Ki Dun",
        paragraphs: [
          "After days of walking, the trail finally opens into the magnificent Har Ki Dun Valley.",
          "Surrounded by dramatic Himalayan peaks and vast alpine landscapes, the valley feels almost unreal.",
          "The mountains stand quietly around you while the valley stretches into the distance.",
          "You may have seen hundreds of photographs of Har Ki Dun before coming here.",
          "But photographs cannot capture the feeling of actually standing there.",
          "The cold wind on your face.",
          "The silence around you.",
          "The mountains above you.",
          "And the realization that you walked all the way here.",
          "That moment stays with you."
        ]
      },
      {
        heading: "Har Ki Dun Is More Than a Trek",
        paragraphs: [
          "The biggest lesson of Har Ki Dun is that the destination is not everything.",
          "The real story lies in the journey.",
          "It is in the conversations around a campfire.",
          "It is in sharing a smile with a fellow trekker.",
          "It is in the first sip of hot tea after a long day’s walk.",
          "It is in watching the stars appear above the mountains.",
          "It is in waking up early and seeing the first sunlight touch the Himalayan peaks.",
          "These are the moments that become memories."
        ]
      },
      {
        heading: "A Trek That Brings You Back to Yourself",
        paragraphs: [
          "Modern life teaches us to constantly move faster.",
          "Har Ki Dun teaches us something different.",
          "Walk slowly.",
          "Look around.",
          "Listen.",
          "Breathe.",
          "Appreciate the little things.",
          "A warm cup of tea suddenly feels special.",
          "A simple meal tastes better.",
          "A conversation becomes deeper.",
          "And a sunrise becomes something worth waking up early for.",
          "Perhaps that is why people return from the mountains with a different kind of smile.",
          "They may have tired legs.",
          "They may have dusty shoes.",
          "But somewhere along the trail, they have found a little more peace."
        ]
      },
      {
        heading: "Why You Should Experience Har Ki Dun",
        paragraphs: [
          "If you are looking for a Himalayan trek that combines beautiful landscapes, traditional villages, forests, rivers, meadows and an unforgettable mountain experience, Har Ki Dun deserves a place on your list.",
          "It is a trek for people who want more than just reaching a summit.",
          "There is no race here.",
          "There is no need to conquer the mountains.",
          "You simply walk with them.",
          "And perhaps that is the most beautiful thing about Har Ki Dun.",
          "Come for the mountains.",
          "Stay for the memories.",
          "Return with a story you will carry for the rest of your life.",
          "Har Ki Dun is not just a destination you visit. It is a journey you remember."
        ]
      }
    ],
    signoff: "Har Ki Dun Trek with Trip My Soul."
  };

  TREKS[harKiDunIndex].faqs = [
    {
      title: "What is the Har Ki Dun Trek?",
      description: "Har Ki Dun is a beautiful Himalayan valley trek in Uttarakhand, known for its ancient villages, dense forests, alpine meadows, rivers and spectacular views of the surrounding Himalayan peaks."
    },
    {
      title: "Where does the Har Ki Dun Trek start?",
      description: "The trek generally starts from Sankri, which is approximately 190–200 km from Dehradun. The trekking route begins around Taluka."
    },
    {
      title: "How difficult is the Har Ki Dun Trek?",
      description: "Har Ki Dun is considered a moderate-level trek. It is suitable for fit beginners as well as experienced trekkers."
    },
    {
      title: "What is the best time for the Har Ki Dun Trek?",
      description: "The best seasons are generally April to June and September to November. Each season offers a different experience, from spring greenery to autumn mountain views and winter landscapes."
    },
    {
      title: "How many days are required for the Har Ki Dun Trek?",
      description: "A typical Har Ki Dun trek takes around 6–7 days, including travel from Dehradun to Sankri and back, depending on the itinerary."
    },
    {
      title: "What is the maximum altitude of Har Ki Dun?",
      description: "Har Ki Dun Valley is situated at approximately 11,000 ft (3,500 m) above sea level."
    },
    {
      title: "Is Har Ki Dun suitable for beginners?",
      description: "Yes. Beginners with good physical fitness can undertake the trek. Regular walking, jogging, stair climbing and basic endurance training before the trek are recommended."
    },
    {
      title: "What kind of accommodation is available?",
      description: "Accommodation is generally provided in guesthouses/homestays and camps, depending on the location and itinerary. Basic mountain facilities should be expected."
    },
    {
      title: "What should I carry for the Har Ki Dun Trek?",
      description: "Essential items include good trekking shoes, warm layers, rainwear, backpack, water bottle, trekking pole, sunglasses, sunscreen, personal medicines, headlamp and basic toiletries."
    },
    {
      title: "How can I reach Sankri for the Har Ki Dun Trek?",
      description: "The most convenient route is Dehradun → Mussoorie → Purola → Mori → Netwar → Sankri by road. You can reach Dehradun by train or flight and continue to Sankri by taxi or bus."
    }
  ];

  // The published essentials list, grouped for the three-column packing table.
  TREKS[harKiDunIndex].packingList = [
    {
      category: "Clothing & Layers",
      items: [
        "Warm jacket / fleece",
        "Thermal innerwear (1–2 pairs)",
        "Quick-dry T-shirts & trekking pants",
        "Waterproof rain jacket & rain pants",
        "Warm cap, sun cap & gloves",
        "Woollen socks (2–3 pairs)"
      ]
    },
    {
      category: "Footwear & Gear",
      items: [
        "Good-quality trekking shoes with proper grip",
        "Backpack (40–50 L) with rain cover",
        "Walking / trekking pole",
        "Headlamp or torch with spare batteries",
        "Personal water bottle / hydration flask",
        "Dry bags or plastic bags to protect clothes and electronics"
      ]
    },
    {
      category: "Sun, Health & Documents",
      items: [
        "Sunglasses with UV protection",
        "Sunscreen SPF 30+ & lip balm",
        "Personal medicines & basic toiletries",
        "Small personal first-aid kit",
        "Power bank & charging cable",
        "ID proof and required documents"
      ]
    },
    {
      category: "Personal Hygiene",
      items: [
        "Toothbrush & toothpaste",
        "Hand sanitizer",
        "Wet wipes & tissues",
        "Biodegradable soap",
        "Quick-dry towel",
        "Toilet paper"
      ]
    }
  ];

  TREKS[harKiDunIndex].thingsToRemember = [
    "Pack light and smart — you will be walking mountain trails for several hours each day, so avoid unnecessary luggage.",
    "Keep important documents, medicines, electronics and valuables in a waterproof pouch.",
    "Reach Dehradun one day before the trek so you can start the drive to Sankri early the next morning."
  ];

  TREKS[harKiDunIndex].batches = {
    years: {
      "2026": {
        months: [
          {
            month: "Sep",
            year: "2026",
            trips: [
              { startDate: "08 Sep", endDate: "14 Sep", status: "Open" },
              { startDate: "09 Sep", endDate: "15 Sep", status: "Open" },
              { startDate: "10 Sep", endDate: "16 Sep", status: "Open" },
              { startDate: "11 Sep", endDate: "17 Sep", status: "Open" },
              { startDate: "12 Sep", endDate: "18 Sep", status: "Open" },
              { startDate: "13 Sep", endDate: "19 Sep", status: "Open" },
              { startDate: "14 Sep", endDate: "20 Sep", status: "Open" },
              { startDate: "15 Sep", endDate: "21 Sep", status: "Open" },
              { startDate: "16 Sep", endDate: "22 Sep", status: "Open" },
              { startDate: "17 Sep", endDate: "23 Sep", status: "Open" },
              { startDate: "18 Sep", endDate: "24 Sep", status: "Open" },
              { startDate: "19 Sep", endDate: "25 Sep", status: "Open" },
              { startDate: "20 Sep", endDate: "26 Sep", status: "Open" },
              { startDate: "21 Sep", endDate: "27 Sep", status: "Open" },
              { startDate: "22 Sep", endDate: "28 Sep", status: "Open" },
              { startDate: "23 Sep", endDate: "29 Sep", status: "Open" },
              { startDate: "24 Sep", endDate: "30 Sep", status: "Open" },
              { startDate: "25 Sep", endDate: "01 Oct", status: "Open" },
              { startDate: "26 Sep", endDate: "02 Oct", status: "Open" },
              { startDate: "27 Sep", endDate: "03 Oct", status: "Open" },
              { startDate: "28 Sep", endDate: "04 Oct", status: "Open" },
              { startDate: "29 Sep", endDate: "05 Oct", status: "Open" },
              { startDate: "30 Sep", endDate: "06 Oct", status: "Open" }
            ]
          },
          {
            month: "Oct",
            year: "2026",
            trips: [
              { startDate: "01 Oct", endDate: "07 Oct", status: "Open" },
              { startDate: "02 Oct", endDate: "08 Oct", status: "Open" },
              { startDate: "03 Oct", endDate: "09 Oct", status: "Open" },
              { startDate: "04 Oct", endDate: "10 Oct", status: "Open" },
              { startDate: "05 Oct", endDate: "11 Oct", status: "Open" },
              { startDate: "06 Oct", endDate: "12 Oct", status: "Open" },
              { startDate: "07 Oct", endDate: "13 Oct", status: "Open" },
              { startDate: "08 Oct", endDate: "14 Oct", status: "Open" },
              { startDate: "09 Oct", endDate: "15 Oct", status: "Open" },
              { startDate: "10 Oct", endDate: "16 Oct", status: "Open" },
              { startDate: "11 Oct", endDate: "17 Oct", status: "Open" },
              { startDate: "12 Oct", endDate: "18 Oct", status: "Open" },
              { startDate: "13 Oct", endDate: "19 Oct", status: "Open" },
              { startDate: "14 Oct", endDate: "20 Oct", status: "Open" },
              { startDate: "15 Oct", endDate: "21 Oct", status: "Open" },
              { startDate: "16 Oct", endDate: "22 Oct", status: "Open" },
              { startDate: "17 Oct", endDate: "23 Oct", status: "Open" },
              { startDate: "18 Oct", endDate: "24 Oct", status: "Open" },
              { startDate: "19 Oct", endDate: "25 Oct", status: "Open" },
              { startDate: "20 Oct", endDate: "26 Oct", status: "Open" },
              { startDate: "21 Oct", endDate: "27 Oct", status: "Open" },
              { startDate: "22 Oct", endDate: "28 Oct", status: "Open" },
              { startDate: "23 Oct", endDate: "29 Oct", status: "Open" },
              { startDate: "24 Oct", endDate: "30 Oct", status: "Open" },
              { startDate: "25 Oct", endDate: "31 Oct", status: "Open" },
              { startDate: "26 Oct", endDate: "01 Nov", status: "Open" },
              { startDate: "27 Oct", endDate: "02 Nov", status: "Open" },
              { startDate: "28 Oct", endDate: "03 Nov", status: "Open" },
              { startDate: "29 Oct", endDate: "04 Nov", status: "Open" },
              { startDate: "30 Oct", endDate: "05 Nov", status: "Open" },
              { startDate: "31 Oct", endDate: "06 Nov", status: "Open" }
            ]
          },
          {
            month: "Nov",
            year: "2026",
            trips: [
              { startDate: "01 Nov", endDate: "07 Nov", status: "Open" },
              { startDate: "02 Nov", endDate: "08 Nov", status: "Open" },
              { startDate: "03 Nov", endDate: "09 Nov", status: "Open" },
              { startDate: "04 Nov", endDate: "10 Nov", status: "Open" },
              { startDate: "05 Nov", endDate: "11 Nov", status: "Open" },
              { startDate: "06 Nov", endDate: "12 Nov", status: "Open" },
              { startDate: "07 Nov", endDate: "13 Nov", status: "Open" },
              { startDate: "08 Nov", endDate: "14 Nov", status: "Open" },
              { startDate: "09 Nov", endDate: "15 Nov", status: "Open" },
              { startDate: "10 Nov", endDate: "16 Nov", status: "Open" },
              { startDate: "11 Nov", endDate: "17 Nov", status: "Open" },
              { startDate: "12 Nov", endDate: "18 Nov", status: "Open" },
              { startDate: "13 Nov", endDate: "19 Nov", status: "Open" },
              { startDate: "14 Nov", endDate: "20 Nov", status: "Open" },
              { startDate: "15 Nov", endDate: "21 Nov", status: "Open" },
              { startDate: "16 Nov", endDate: "22 Nov", status: "Open" },
              { startDate: "17 Nov", endDate: "23 Nov", status: "Open" },
              { startDate: "18 Nov", endDate: "24 Nov", status: "Open" },
              { startDate: "19 Nov", endDate: "25 Nov", status: "Open" },
              { startDate: "20 Nov", endDate: "26 Nov", status: "Open" },
              { startDate: "21 Nov", endDate: "27 Nov", status: "Open" },
              { startDate: "22 Nov", endDate: "28 Nov", status: "Open" },
              { startDate: "23 Nov", endDate: "29 Nov", status: "Open" },
              { startDate: "24 Nov", endDate: "30 Nov", status: "Open" },
              { startDate: "25 Nov", endDate: "01 Dec", status: "Open" },
              { startDate: "26 Nov", endDate: "02 Dec", status: "Open" },
              { startDate: "27 Nov", endDate: "03 Dec", status: "Open" },
              { startDate: "28 Nov", endDate: "04 Dec", status: "Open" },
              { startDate: "29 Nov", endDate: "05 Dec", status: "Open" },
              { startDate: "30 Nov", endDate: "06 Dec", status: "Open" }
            ]
          },
          {
            month: "Dec",
            year: "2026",
            trips: [
              { startDate: "01 Dec", endDate: "07 Dec", status: "Open" },
              { startDate: "02 Dec", endDate: "08 Dec", status: "Open" },
              { startDate: "03 Dec", endDate: "09 Dec", status: "Open" },
              { startDate: "04 Dec", endDate: "10 Dec", status: "Open" },
              { startDate: "05 Dec", endDate: "11 Dec", status: "Open" },
              { startDate: "06 Dec", endDate: "12 Dec", status: "Open" },
              { startDate: "07 Dec", endDate: "13 Dec", status: "Open" },
              { startDate: "08 Dec", endDate: "14 Dec", status: "Open" },
              { startDate: "09 Dec", endDate: "15 Dec", status: "Open" },
              { startDate: "10 Dec", endDate: "16 Dec", status: "Open" },
              { startDate: "11 Dec", endDate: "17 Dec", status: "Open" },
              { startDate: "12 Dec", endDate: "18 Dec", status: "Open" },
              { startDate: "13 Dec", endDate: "19 Dec", status: "Open" },
              { startDate: "14 Dec", endDate: "20 Dec", status: "Open" },
              { startDate: "15 Dec", endDate: "21 Dec", status: "Open" },
              { startDate: "16 Dec", endDate: "22 Dec", status: "Open" },
              { startDate: "17 Dec", endDate: "23 Dec", status: "Open" },
              { startDate: "18 Dec", endDate: "24 Dec", status: "Open" },
              { startDate: "19 Dec", endDate: "25 Dec", status: "Open" },
              { startDate: "20 Dec", endDate: "26 Dec", status: "Open" },
              { startDate: "21 Dec", endDate: "27 Dec", status: "Open" },
              { startDate: "22 Dec", endDate: "28 Dec", status: "Open" },
              { startDate: "23 Dec", endDate: "29 Dec", status: "Open" },
              { startDate: "24 Dec", endDate: "30 Dec", status: "Open" },
              { startDate: "25 Dec", endDate: "31 Dec", status: "Open" },
              { startDate: "26 Dec", endDate: "01 Jan", status: "Open" },
              { startDate: "27 Dec", endDate: "02 Jan", status: "Open" },
              { startDate: "28 Dec", endDate: "03 Jan", status: "Open" },
              { startDate: "29 Dec", endDate: "04 Jan", status: "Open" },
              { startDate: "30 Dec", endDate: "05 Jan", status: "Open" },
              { startDate: "31 Dec", endDate: "06 Jan", status: "Open" }
            ]
          }
        ]
      },
      "2027": {
        months: [
          {
            month: "Mar",
            year: "2027",
            trips: [
              { startDate: "01 Mar", endDate: "07 Mar", status: "Open" },
              { startDate: "02 Mar", endDate: "08 Mar", status: "Open" },
              { startDate: "03 Mar", endDate: "09 Mar", status: "Open" },
              { startDate: "04 Mar", endDate: "10 Mar", status: "Open" },
              { startDate: "05 Mar", endDate: "11 Mar", status: "Open" },
              { startDate: "06 Mar", endDate: "12 Mar", status: "Open" },
              { startDate: "07 Mar", endDate: "13 Mar", status: "Open" },
              { startDate: "08 Mar", endDate: "14 Mar", status: "Open" },
              { startDate: "09 Mar", endDate: "15 Mar", status: "Open" },
              { startDate: "10 Mar", endDate: "16 Mar", status: "Open" },
              { startDate: "11 Mar", endDate: "17 Mar", status: "Open" },
              { startDate: "12 Mar", endDate: "18 Mar", status: "Open" },
              { startDate: "13 Mar", endDate: "19 Mar", status: "Open" },
              { startDate: "14 Mar", endDate: "20 Mar", status: "Open" },
              { startDate: "15 Mar", endDate: "21 Mar", status: "Open" },
              { startDate: "16 Mar", endDate: "22 Mar", status: "Open" },
              { startDate: "17 Mar", endDate: "23 Mar", status: "Open" },
              { startDate: "18 Mar", endDate: "24 Mar", status: "Open" },
              { startDate: "19 Mar", endDate: "25 Mar", status: "Open" },
              { startDate: "20 Mar", endDate: "26 Mar", status: "Open" },
              { startDate: "21 Mar", endDate: "27 Mar", status: "Open" },
              { startDate: "22 Mar", endDate: "28 Mar", status: "Open" },
              { startDate: "23 Mar", endDate: "29 Mar", status: "Open" },
              { startDate: "24 Mar", endDate: "30 Mar", status: "Open" },
              { startDate: "25 Mar", endDate: "31 Mar", status: "Open" },
              { startDate: "26 Mar", endDate: "01 Apr", status: "Open" },
              { startDate: "27 Mar", endDate: "02 Apr", status: "Open" },
              { startDate: "28 Mar", endDate: "03 Apr", status: "Open" },
              { startDate: "29 Mar", endDate: "04 Apr", status: "Open" },
              { startDate: "30 Mar", endDate: "05 Apr", status: "Open" },
              { startDate: "31 Mar", endDate: "06 Apr", status: "Open" }
            ]
          },
          {
            month: "Apr",
            year: "2027",
            trips: [
              { startDate: "01 Apr", endDate: "07 Apr", status: "Open" },
              { startDate: "02 Apr", endDate: "08 Apr", status: "Open" },
              { startDate: "03 Apr", endDate: "09 Apr", status: "Open" },
              { startDate: "04 Apr", endDate: "10 Apr", status: "Open" },
              { startDate: "05 Apr", endDate: "11 Apr", status: "Open" },
              { startDate: "06 Apr", endDate: "12 Apr", status: "Open" },
              { startDate: "07 Apr", endDate: "13 Apr", status: "Open" },
              { startDate: "08 Apr", endDate: "14 Apr", status: "Open" },
              { startDate: "09 Apr", endDate: "15 Apr", status: "Open" },
              { startDate: "10 Apr", endDate: "16 Apr", status: "Open" },
              { startDate: "11 Apr", endDate: "17 Apr", status: "Open" },
              { startDate: "12 Apr", endDate: "18 Apr", status: "Open" },
              { startDate: "13 Apr", endDate: "19 Apr", status: "Open" },
              { startDate: "14 Apr", endDate: "20 Apr", status: "Open" },
              { startDate: "15 Apr", endDate: "21 Apr", status: "Open" },
              { startDate: "16 Apr", endDate: "22 Apr", status: "Open" },
              { startDate: "17 Apr", endDate: "23 Apr", status: "Open" },
              { startDate: "18 Apr", endDate: "24 Apr", status: "Open" },
              { startDate: "19 Apr", endDate: "25 Apr", status: "Open" },
              { startDate: "20 Apr", endDate: "26 Apr", status: "Open" },
              { startDate: "21 Apr", endDate: "27 Apr", status: "Open" },
              { startDate: "22 Apr", endDate: "28 Apr", status: "Open" },
              { startDate: "23 Apr", endDate: "29 Apr", status: "Open" },
              { startDate: "24 Apr", endDate: "30 Apr", status: "Open" },
              { startDate: "25 Apr", endDate: "01 May", status: "Open" },
              { startDate: "26 Apr", endDate: "02 May", status: "Open" },
              { startDate: "27 Apr", endDate: "03 May", status: "Open" },
              { startDate: "28 Apr", endDate: "04 May", status: "Open" },
              { startDate: "29 Apr", endDate: "05 May", status: "Open" },
              { startDate: "30 Apr", endDate: "06 May", status: "Open" }
            ]
          },
          {
            month: "May",
            year: "2027",
            trips: [
              { startDate: "01 May", endDate: "07 May", status: "Open" },
              { startDate: "02 May", endDate: "08 May", status: "Open" },
              { startDate: "03 May", endDate: "09 May", status: "Open" },
              { startDate: "04 May", endDate: "10 May", status: "Open" },
              { startDate: "05 May", endDate: "11 May", status: "Open" },
              { startDate: "06 May", endDate: "12 May", status: "Open" },
              { startDate: "07 May", endDate: "13 May", status: "Open" },
              { startDate: "08 May", endDate: "14 May", status: "Open" },
              { startDate: "09 May", endDate: "15 May", status: "Open" },
              { startDate: "10 May", endDate: "16 May", status: "Open" },
              { startDate: "11 May", endDate: "17 May", status: "Open" },
              { startDate: "12 May", endDate: "18 May", status: "Open" },
              { startDate: "13 May", endDate: "19 May", status: "Open" },
              { startDate: "14 May", endDate: "20 May", status: "Open" },
              { startDate: "15 May", endDate: "21 May", status: "Open" },
              { startDate: "16 May", endDate: "22 May", status: "Open" },
              { startDate: "17 May", endDate: "23 May", status: "Open" },
              { startDate: "18 May", endDate: "24 May", status: "Open" },
              { startDate: "19 May", endDate: "25 May", status: "Open" },
              { startDate: "20 May", endDate: "26 May", status: "Open" },
              { startDate: "21 May", endDate: "27 May", status: "Open" },
              { startDate: "22 May", endDate: "28 May", status: "Open" },
              { startDate: "23 May", endDate: "29 May", status: "Open" },
              { startDate: "24 May", endDate: "30 May", status: "Open" },
              { startDate: "25 May", endDate: "31 May", status: "Open" },
              { startDate: "26 May", endDate: "01 Jun", status: "Open" },
              { startDate: "27 May", endDate: "02 Jun", status: "Open" },
              { startDate: "28 May", endDate: "03 Jun", status: "Open" },
              { startDate: "29 May", endDate: "04 Jun", status: "Open" },
              { startDate: "30 May", endDate: "05 Jun", status: "Open" },
              { startDate: "31 May", endDate: "06 Jun", status: "Open" }
            ]
          },
          {
            month: "Jun",
            year: "2027",
            trips: [
              { startDate: "01 Jun", endDate: "07 Jun", status: "Open" },
              { startDate: "02 Jun", endDate: "08 Jun", status: "Open" },
              { startDate: "03 Jun", endDate: "09 Jun", status: "Open" },
              { startDate: "04 Jun", endDate: "10 Jun", status: "Open" },
              { startDate: "05 Jun", endDate: "11 Jun", status: "Open" },
              { startDate: "06 Jun", endDate: "12 Jun", status: "Open" },
              { startDate: "07 Jun", endDate: "13 Jun", status: "Open" },
              { startDate: "08 Jun", endDate: "14 Jun", status: "Open" },
              { startDate: "09 Jun", endDate: "15 Jun", status: "Open" },
              { startDate: "10 Jun", endDate: "16 Jun", status: "Open" },
              { startDate: "11 Jun", endDate: "17 Jun", status: "Open" },
              { startDate: "12 Jun", endDate: "18 Jun", status: "Open" },
              { startDate: "13 Jun", endDate: "19 Jun", status: "Open" },
              { startDate: "14 Jun", endDate: "20 Jun", status: "Open" },
              { startDate: "15 Jun", endDate: "21 Jun", status: "Open" },
              { startDate: "16 Jun", endDate: "22 Jun", status: "Open" },
              { startDate: "17 Jun", endDate: "23 Jun", status: "Open" },
              { startDate: "18 Jun", endDate: "24 Jun", status: "Open" },
              { startDate: "19 Jun", endDate: "25 Jun", status: "Open" },
              { startDate: "20 Jun", endDate: "26 Jun", status: "Open" },
              { startDate: "21 Jun", endDate: "27 Jun", status: "Open" },
              { startDate: "22 Jun", endDate: "28 Jun", status: "Open" },
              { startDate: "23 Jun", endDate: "29 Jun", status: "Open" },
              { startDate: "24 Jun", endDate: "30 Jun", status: "Open" },
              { startDate: "25 Jun", endDate: "01 Jul", status: "Open" },
              { startDate: "26 Jun", endDate: "02 Jul", status: "Open" },
              { startDate: "27 Jun", endDate: "03 Jul", status: "Open" },
              { startDate: "28 Jun", endDate: "04 Jul", status: "Open" },
              { startDate: "29 Jun", endDate: "05 Jul", status: "Open" },
              { startDate: "30 Jun", endDate: "06 Jul", status: "Open" }
            ]
          }
        ]
      }
    }
  };
}

// Static details for the Nag Tibba Trek (uid: nagtibba-trek), the two-day
// summit route out of Pantwari in Tehri Garhwal. Trek essentials (packing list)
// and the cancellation policy are deliberately left unset: Kedarkantha
// publishes neither, so both sections render the same shared copy from
// `trekDefaults.ts` / `TrekCancellation`. The base campsite is published as a
// range (8,500–9,000 ft) rather than a figure, so the altitude charts use its
// midpoint. `maxAltitude`, `totalDistance`, `availability` and the corrected
// `difficulty` live on the catalogue entry itself.
const nagTibbaIndex = TREKS.findIndex(t => t.slug === 'nagtibba-trek');
if (nagTibbaIndex !== -1) {
  TREKS[nagTibbaIndex].aboutParagraphs = [
    "Nag Tibba Trek is one of Uttarakhand's most popular short Himalayan treks, perfect for beginners who want to experience mountain trekking without committing to a long or highly demanding expedition. Located in the Tehri Garhwal region, the trek takes you through beautiful oak and rhododendron forests, open meadows and peaceful mountain landscapes.",
    "The trek begins from Pantwari Village and leads towards the Nag Tibba summit at approximately 9,915 ft (3,022 m). From the summit, on a clear day, trekkers can enjoy impressive views of the surrounding Himalayan ranges, including peaks such as Bandarpoonch and Swargarohini.",
    "What makes Nag Tibba special is its accessibility. The trek can generally be completed in 2 days and 1 night, making it an excellent weekend escape from Dehradun, Mussoorie and Rishikesh. During winter, the trail can receive snowfall, transforming the forest and meadows into a beautiful snow-covered landscape.",
    "Whether you are attempting your first Himalayan trek, planning a weekend adventure with friends, or simply looking for a peaceful escape into the mountains, Nag Tibba offers a perfect introduction to Himalayan trekking."
  ];

  TREKS[nagTibbaIndex].highlights = [
    "Nag Tibba Summit at 9,915 ft",
    "Panoramic Himalayan views",
    "Dense oak & rhododendron forest",
    "Open mountain meadows",
    "Sunrise & sunset from the ridge",
    "Bandarpoonch & Swargarohini views",
    "Gangotri & Kedarnath ranges",
    "Doon Valley views",
    "Camping at the Nag Tibba base campsite"
  ];

  TREKS[nagTibbaIndex].usps = [
    {
      title: "Base village: Pantwari",
      description: "The trek runs out of Pantwari in Tehri Garhwal district, reached on an 85–100 km drive of about 4–5 hours from Dehradun, with Mussoorie as the nearest hill town."
    },
    {
      title: "A Himalayan summit inside a weekend",
      description: "Two days and one night over roughly 15–16 km round trip — short enough to be a genuine weekend escape from Dehradun, Mussoorie or Rishikesh, and still a summit at 9,915 ft."
    },
    {
      title: "Built for a first trek",
      description: "Graded easy to moderate on a forest and meadow trail with no technical sections, which is why Nag Tibba is the route most often walked by beginners, families and first-time trekkers."
    },
    {
      title: "A genuine snow trek from December to March",
      description: "Through those months the forest, the meadows and the campsite can lie under fresh snow, and the grade rises accordingly — the reason December–March is the most popular window on this trail."
    },
    {
      title: "Four ranges from one summit",
      description: "On a clear day the top looks out over Bandarpoonch, Swargarohini, the Gangotri and Kedarnath ranges and the Doon Valley — visibility depends entirely on the weather."
    }
  ];

  TREKS[nagTibbaIndex].destinationHighlights = [
    { name: "Pantwari", blurb: "The base village in Tehri Garhwal where the road ends and the walking begins, about 4–5 hours by road from Dehradun." },
    { name: "Nag Tibba Base Camp", blurb: "The campsite for the night at roughly 8,500–9,000 ft, set among forest and open meadow below the summit ridge." },
    { name: "Nag Tibba Summit", blurb: "The 9,915 ft high point of the trek and of the Nag Tibba range, with the Himalayan panorama on one side and the Doon Valley on the other." }
  ];

  TREKS[nagTibbaIndex].differentiators = [
    "Region: Tehri Garhwal, Uttarakhand",
    "Trek type: short beginner-friendly Himalayan trek to a 9,915 ft summit",
    "Terrain: oak and rhododendron forest, open meadows, and snow through the winter",
    "Best season: October to June, with December to March for snow",
    "Monsoon: July to September brings rain, slippery trails and possible road disruption"
  ];

  TREKS[nagTibbaIndex].similarTreks = [
    "kedarkantha-trek",
    "dayara-bugyal-trek",
    "brahmatal-trek",
    "chopta-tungnath-trek"
  ];

  TREKS[nagTibbaIndex].idealFor =
    "Beginners, families, first-time trekkers and weekend groups.";

  TREKS[nagTibbaIndex].importantNote =
    "Nag Tibba runs from October to June. December to March is the popular window for snow, when the grade sits at the upper end of easy–moderate and warm layers matter; July to September is monsoon on this trail, bringing rain, slippery ground and occasional disruption on the Dehradun–Pantwari road. Summit views of Bandarpoonch, Swargarohini and the Gangotri and Kedarnath ranges depend entirely on the weather, so treat a clear morning as a bonus rather than a guarantee.";

  TREKS[nagTibbaIndex].itinerary = [
    {
      day: 1,
      title: "Dehradun to Pantwari to Nag Tibba Base Camp",
      driveDistance: "85-100 km",
      drivingTime: "4-5 Hours",
      trekDistance: "5-6 km",
      trekDuration: "4-5 Hours",
      pickupPoint: "Dehradun",
      pickupTime: "Early morning",
      altitudePoints: [
        { location: "Dehradun", m: 640, ft: 2100 },
        { location: "Pantwari", m: 1370, ft: 4500 },
        { location: "Nag Tibba Base Camp", m: 2670, ft: 8750 }
      ],
      altitudeGain: { m: 1300, ft: 4250 },
      description: "Drive through the Himalayan foothills to Pantwari, then trek through mountain villages and oak forest to the Nag Tibba Base Camp.",
      detailedParagraphs: [
        "Your Nag Tibba adventure begins early morning from Dehradun. Drive through the beautiful Himalayan foothills towards Pantwari Village, the starting point of the trek.",
        "After breakfast/lunch at Pantwari, begin your trek. The trail gradually climbs through traditional mountain villages, oak and rhododendron forests and open stretches with beautiful valley views.",
        "As you gain altitude, the landscape becomes quieter and more scenic. After several hours of trekking, reach the Nag Tibba Base Camp, where the team will set up your campsite.",
        "Spend the evening relaxing around the campsite and enjoying the mountain atmosphere. If the weather is clear, the evening sky offers beautiful sunset and stargazing opportunities.",
        "Overnight stay at Nag Tibba Base Camp."
      ],
      highlights: ["Himalayan Foothills Drive", "Pantwari Village", "Oak & Rhododendron Forest", "Valley Views", "Sunset & Stargazing"],
      meals: "Breakfast / Lunch & Dinner",
      stayType: "Camp"
    },
    {
      day: 2,
      title: "Nag Tibba Base Camp to Summit to Pantwari to Dehradun",
      trekDistance: "9-10 km",
      trekDuration: "5-6 Hours",
      driveDistance: "85-100 km",
      drivingTime: "4-5 Hours",
      timeNote: { label: "Summit start", value: "After breakfast" },
      altitudePoints: [
        { location: "Nag Tibba Base Camp", m: 2670, ft: 8750 },
        { location: "Nag Tibba Summit", m: 3022, ft: 9915 },
        { location: "Pantwari", m: 1370, ft: 4500 },
        { location: "Dehradun", m: 640, ft: 2100 }
      ],
      altitudeGain: { m: 352, ft: 1165 },
      description: "Climb to the 9,915 ft Nag Tibba Summit for the Himalayan panorama, then descend to Pantwari and drive back to Dehradun.",
      detailedParagraphs: [
        "Wake up early and prepare for the summit climb. After breakfast, start walking towards Nag Tibba Summit.",
        "The trail passes through dense forest before opening up near the summit. The final section involves a gradual climb to the summit, where you can enjoy spectacular Himalayan views on a clear day.",
        "Nag Tibba Summit stands at 9,915 ft — the highest point of the trek.",
        "Spend some time at the summit, capture photographs and enjoy the panoramic mountain scenery. Afterward, begin your descent towards the campsite/base area and continue down to Pantwari Village.",
        "Once you reach Pantwari, board the vehicle and begin your return journey to Dehradun.",
        "Your Nag Tibba adventure ends with beautiful memories of the Himalayan trails, forests and summit views."
      ],
      highlights: ["9,915 ft Summit", "Panoramic Himalayan Views", "Dense Forest Trail", "Descent to Pantwari", "Scenic Drive Back"],
      meals: "Breakfast",
      // The trek ends on this day; an empty stay keeps the generic
      // "Hotel / Homestay" fallback out of the day's quick-info line.
      stayType: ""
    }
  ];

  TREKS[nagTibbaIndex].article = {
    title: "Nag Tibba Trek: A Short Journey to the Heart of the Himalayas",
    standfirst:
      "Forest trails above Pantwari, a night under the Himalayan sky and a 9,915 ft summit at sunrise — two days in the Garhwal, told the way they are felt.",
    readMinutes: 7,
    sections: [
      {
        paragraphs: [
          "There are journeys that take you far away from home, and then there are journeys that bring you closer to yourself.",
          "The Nag Tibba Trek is one such journey.",
          "Hidden in the beautiful mountains of Uttarakhand, Nag Tibba is a perfect escape for anyone who wants to leave behind the noise of everyday life and spend a little time walking through forests, watching the mountains and breathing in the silence of the Himalayas.",
          "At an altitude of approximately 9,915 ft, Nag Tibba offers the experience of reaching a Himalayan summit without requiring a long expedition. This makes it one of the best choices for beginners, first-time trekkers, weekend adventurers and anyone looking for a quick mountain escape."
        ]
      },
      {
        heading: "Where the Journey Begins",
        paragraphs: [
          "The adventure begins at Pantwari Village, a peaceful mountain village surrounded by the Garhwal Himalayas.",
          "As you leave the road behind and start walking, something slowly changes.",
          "The sound of vehicles disappears.",
          "The air becomes cooler.",
          "The forest becomes quieter.",
          "And with every step, the mountains seem to come a little closer.",
          "The trail takes you through beautiful forests and open mountain sections, where the simple beauty of Uttarakhand reminds you that sometimes you don’t need much to feel happy.",
          "Just a trail.",
          "A backpack.",
          "And mountains in front of you."
        ]
      },
      {
        heading: "Walking Through the Himalayan Forests",
        paragraphs: [
          "The trail towards Nag Tibba passes through beautiful forest landscapes, including oak and rhododendron-covered sections.",
          "The sunlight filtering through the trees, the sound of leaves beneath your feet and the occasional glimpse of distant mountains make the journey as memorable as the destination itself.",
          "Nag Tibba isn’t about rushing.",
          "It is about walking slowly enough to notice the mountains.",
          "Along the way, you’ll meet fellow trekkers, local villagers and perhaps even discover a quieter version of yourself."
        ]
      },
      {
        heading: "The Magic of Nag Tibba Campsite",
        paragraphs: [
          "After hours of walking, reaching the campsite feels special.",
          "Your tired legs suddenly don’t matter as much.",
          "The backpack comes off, tea tastes better than ever, and the mountains become your evening view.",
          "As the sun begins to disappear behind the mountains, the sky changes colours and the temperature drops.",
          "Later, when darkness covers the valleys, look up.",
          "Far away from city lights, the Himalayan night sky can feel endless.",
          "Sitting around the campsite with a warm cup of tea, sharing stories with fellow trekkers and looking at the stars — these are the moments that stay with you long after the trek is over."
        ]
      },
      {
        heading: "The Summit Morning",
        paragraphs: [
          "The most beautiful part of the Nag Tibba Trek begins early in the morning.",
          "With your headlamp on and the sky still dark, you start walking towards the summit.",
          "The trail becomes quieter.",
          "Your breathing becomes heavier.",
          "But every step takes you closer to the top.",
          "And then, finally, you reach Nag Tibba Summit at approximately 9,915 ft.",
          "For a moment, you forget how tired you are.",
          "You simply stand there.",
          "In front of you are the vast Himalayan landscapes, and behind you is the trail that brought you here.",
          "You realise that the summit isn’t just a point on a map.",
          "It is every step you took to reach it."
        ]
      },
      {
        heading: "More Than Just a Trek",
        paragraphs: [
          "Nag Tibba may be a short trek, but the memories it creates can last much longer.",
          "For some, it is their first Himalayan summit.",
          "For others, it is a much-needed break from work, phones and city life.",
          "For friends, it becomes a story they will tell for years.",
          "And for many first-time trekkers, Nag Tibba becomes the beginning of a much bigger love for the mountains.",
          "Because once you’ve experienced the feeling of standing above the clouds, listening to the silence of the mountains and watching the sunrise from a Himalayan summit, you start wanting to come back."
        ]
      },
      {
        heading: "Why Choose Nag Tibba Trek?",
        paragraphs: [
          "🏔️ Beginner-friendly Himalayan summit experience",
          "🌲 Beautiful forest trails and mountain landscapes",
          "🌅 Stunning sunrise and sunset opportunities",
          "❄️ Possibility of snow during winter",
          "🏕️ Memorable overnight camping experience",
          "📍 Easily accessible from Dehradun and Mussoorie",
          "🎒 Perfect for a short weekend adventure",
          "❤️ Ideal for first-time Himalayan trekkers"
        ]
      },
      {
        heading: "When Should You Do the Nag Tibba Trek?",
        paragraphs: [
          "Nag Tibba can be explored in different seasons, and each season brings its own character.",
          "Winter can transform the trail into a beautiful snow-covered landscape.",
          "Spring brings pleasant weather and fresh mountain greenery.",
          "Summer offers comfortable trekking conditions and clear mountain landscapes.",
          "The monsoon season can bring rain, slippery trails and unpredictable road conditions, so weather and local conditions should always be checked before departure."
        ]
      },
      {
        heading: "Your Mountain Story Starts Here",
        paragraphs: [
          "You don’t always need a week-long holiday to feel alive again.",
          "Sometimes, two days in the mountains are enough.",
          "Enough to wake up early.",
          "Enough to walk until your legs are tired.",
          "Enough to sit quietly and watch the clouds move across the valleys.",
          "Enough to remember that life is not only about deadlines, meetings and busy streets.",
          "Sometimes, life is also about standing on a mountain and saying:",
          "“I made it.”",
          "The Nag Tibba Trek is more than a weekend trip.",
          "It is a small escape, a Himalayan adventure and perhaps the beginning of your lifelong love affair with the mountains.",
          "Pack your backpack. Leave the noise behind. The mountains are waiting.",
          "Let Trip My Soul take care of the journey while you focus on what truly matters — the trail, the mountains and the memories you create along the way."
        ]
      }
    ],
    signoff: "Trek Nag Tibba with Trip My Soul."
  };

  TREKS[nagTibbaIndex].faqs = [
    {
      title: "Where is Nag Tibba Trek located?",
      description: "Nag Tibba Trek is located in the Tehri Garhwal region of Uttarakhand. The trek starts from Pantwari Village."
    },
    {
      title: "What is the altitude of Nag Tibba?",
      description: "The Nag Tibba Summit is approximately 9,915 ft (3,022 m) above sea level."
    },
    {
      title: "How difficult is the Nag Tibba Trek?",
      description: "Nag Tibba is generally considered an easy to moderate trek and is suitable for beginners with basic fitness."
    },
    {
      title: "How long is the Nag Tibba Trek?",
      description: "The complete trek is approximately 15–16 km, depending on the campsite and route followed."
    },
    {
      title: "How many days are required for Nag Tibba Trek?",
      description: "The standard Nag Tibba Trek can be completed in 2 days and 1 night, making it ideal for a weekend getaway."
    },
    {
      title: "What is the best time to do the Nag Tibba Trek?",
      description: "October to June is generally a good period. Winter is especially popular among trekkers looking for a snow experience. Monsoon conditions can make the trail slippery and roads unpredictable."
    },
    {
      title: "Is Nag Tibba suitable for beginners?",
      description: "Yes. Nag Tibba is one of the better options for first-time trekkers because of its relatively short duration and moderate altitude."
    },
    {
      title: "Is there snow on the Nag Tibba Trek?",
      description: "Snowfall is possible during winter, particularly around December to February, but the amount varies every year depending on weather conditions."
    },
    {
      title: "How do I reach the Nag Tibba Trek starting point?",
      description: "The trek starts from Pantwari Village. You can first reach Dehradun by road, train or flight and then travel by road to Pantwari."
    },
    {
      title: "What should I carry for the Nag Tibba Trek?",
      description: "Essential items include good trekking shoes, warm layers, rain protection, a backpack, water bottle, personal medicines, sunglasses, sunscreen, headlamp and basic toiletries."
    }
  ];

  // Eligibility and fitness follow the Kedarkantha criteria; only the altitude
  // row is restated, for the 9,915 ft summit.
  TREKS[nagTibbaIndex].eligibilityCriteria = [
    { icon: "User", text: "Age: 10–60 years recommended" },
    { icon: "Footprints", text: "Experience: No prior trekking experience required" },
    { icon: "Dumbbell", text: "Fitness: Basic to moderate fitness required" },
    { icon: "Mountain", text: "Altitude: Up to 9,915 ft / 3,022 m" },
    { icon: "Snowflake", text: "Must be comfortable with cold and snow conditions" },
    { icon: "Stethoscope", text: "Participants should be medically fit for high-altitude trekking" }
  ];

  TREKS[nagTibbaIndex].fitnessCriteria = [
    { icon: "Footprints", text: "Able to walk 5–6 km comfortably" },
    { icon: "TrendingUp", text: "Able to climb 4–5 floors without excessive breathlessness" },
    { icon: "Dumbbell", text: "Good stamina and leg strength recommended" },
    { icon: "Backpack", text: "Comfortable carrying a light daypack" },
    { icon: "Activity", text: "Regular walking, jogging or stair training for 3–4 weeks before the trek is recommended" }
  ];

  TREKS[nagTibbaIndex].howToReach = {
    intro: "Nag Tibba Trek starts from Pantwari Village, and the most convenient gateway is Dehradun. Reaching Dehradun a day before the trek is recommended, especially if you are coming from another city.",
    air: {
      summaryLabel: "Nearest Airport",
      summary: "Jolly Grant Airport, Dehradun (DED)",
      detail: "The airport is roughly 30 km from Dehradun. From Dehradun, continue by road to Pantwari Village."
    },
    train: {
      summaryLabel: "Nearest Railway Station",
      summary: "Dehradun Railway Station",
      detail: "Dehradun has good rail connectivity with Delhi and other major cities. From the railway station, take a taxi or local transport towards Pantwari."
    },
    road: {
      summaryLabel: "Route",
      summary: "Dehradun to Pantwari via Mussoorie and Nainbagh",
      route: ["Dehradun", "Mussoorie", "Nainbagh", "Pantwari"],
      facts: [
        { label: "Distance", value: "~85–100 km" },
        { label: "Drive", value: "~4–5 hours" },
        { label: "Options", value: "Private Taxi / Shared or Local Transport" },
        { label: "Starting Point", value: "Pantwari → Base Camp → Summit" }
      ]
    },
    pickup: {
      point: "Dehradun",
      time: "Early morning on Day 1",
      dropPoint: "Dehradun",
      dropTime: "Evening of Day 2",
      note: "From Pantwari, the trek begins on foot."
    }
  };

  TREKS[nagTibbaIndex].inclusions = [
    { title: "Transportation", description: "Dehradun → Pantwari → Dehradun." },
    { title: "Trek Support", description: "Trek support from Pantwari to Nag Tibba and back." },
    { title: "Camping", description: "1 night camping on quad/triple sharing basis." },
    { title: "Meals", description: "Breakfast, lunch & dinner during the trek as per the itinerary." },
    { title: "Tea & Snacks", description: "Tea and snacks during the trek." },
    { title: "Trek Leader", description: "Experienced trek leader/guide." },
    { title: "Kitchen & Support Staff", description: "Dedicated kitchen and support staff." },
    { title: "Camping Equipment", description: "Tents, sleeping bags, mattresses & common equipment." },
    { title: "First Aid", description: "First-aid kit & basic medical support." },
    { title: "Permits", description: "Forest/trek permits & applicable entry charges." }
  ];

  TREKS[nagTibbaIndex].exclusions = [
    { title: "Travel to Dehradun", description: "Travel to and from Dehradun from your hometown." },
    { title: "Meals off the itinerary", description: "Meals during the journey that are not mentioned in the itinerary." },
    { title: "Personal expenses", description: "Bottled water, soft drinks, snacks and similar personal expenses." },
    { title: "Personal trekking gear", description: "Personal trekking equipment, clothing and footwear." },
    { title: "Emergency evacuation", description: "Emergency evacuation or medical expenses beyond basic first aid." },
    { title: "Mule & porter charges", description: "Mule/porter charges for personal luggage, if required." },
    { title: "Weather & roadblocks", description: "Any additional transportation or accommodation caused by bad weather, roadblocks or natural circumstances." },
    { title: "Anything not listed", description: "Any expense not specifically mentioned under Inclusions." }
  ];

  TREKS[nagTibbaIndex].batches = {
    years: {
      "2026": {
        months: [
          {
            month: "Nov",
            year: "2026",
            trips: [
              { startDate: "01 Nov", endDate: "02 Nov", status: "Open" },
              { startDate: "02 Nov", endDate: "03 Nov", status: "Open" },
              { startDate: "03 Nov", endDate: "04 Nov", status: "Open" },
              { startDate: "04 Nov", endDate: "05 Nov", status: "Open" },
              { startDate: "05 Nov", endDate: "06 Nov", status: "Open" },
              { startDate: "06 Nov", endDate: "07 Nov", status: "Open" },
              { startDate: "07 Nov", endDate: "08 Nov", status: "Open" },
              { startDate: "08 Nov", endDate: "09 Nov", status: "Open" },
              { startDate: "09 Nov", endDate: "10 Nov", status: "Open" },
              { startDate: "10 Nov", endDate: "11 Nov", status: "Open" },
              { startDate: "11 Nov", endDate: "12 Nov", status: "Open" },
              { startDate: "12 Nov", endDate: "13 Nov", status: "Open" },
              { startDate: "13 Nov", endDate: "14 Nov", status: "Open" },
              { startDate: "14 Nov", endDate: "15 Nov", status: "Open" },
              { startDate: "15 Nov", endDate: "16 Nov", status: "Open" },
              { startDate: "16 Nov", endDate: "17 Nov", status: "Open" },
              { startDate: "17 Nov", endDate: "18 Nov", status: "Open" },
              { startDate: "18 Nov", endDate: "19 Nov", status: "Open" },
              { startDate: "19 Nov", endDate: "20 Nov", status: "Open" },
              { startDate: "20 Nov", endDate: "21 Nov", status: "Open" },
              { startDate: "21 Nov", endDate: "22 Nov", status: "Open" },
              { startDate: "22 Nov", endDate: "23 Nov", status: "Open" },
              { startDate: "23 Nov", endDate: "24 Nov", status: "Open" },
              { startDate: "24 Nov", endDate: "25 Nov", status: "Open" },
              { startDate: "25 Nov", endDate: "26 Nov", status: "Open" },
              { startDate: "26 Nov", endDate: "27 Nov", status: "Open" },
              { startDate: "27 Nov", endDate: "28 Nov", status: "Open" },
              { startDate: "28 Nov", endDate: "29 Nov", status: "Open" },
              { startDate: "29 Nov", endDate: "30 Nov", status: "Open" },
              { startDate: "30 Nov", endDate: "01 Dec", status: "Open" }
            ]
          },
          {
            month: "Dec",
            year: "2026",
            trips: [
              { startDate: "01 Dec", endDate: "02 Dec", status: "Open" },
              { startDate: "02 Dec", endDate: "03 Dec", status: "Open" },
              { startDate: "03 Dec", endDate: "04 Dec", status: "Open" },
              { startDate: "04 Dec", endDate: "05 Dec", status: "Open" },
              { startDate: "05 Dec", endDate: "06 Dec", status: "Open" },
              { startDate: "06 Dec", endDate: "07 Dec", status: "Open" },
              { startDate: "07 Dec", endDate: "08 Dec", status: "Open" },
              { startDate: "08 Dec", endDate: "09 Dec", status: "Open" },
              { startDate: "09 Dec", endDate: "10 Dec", status: "Open" },
              { startDate: "10 Dec", endDate: "11 Dec", status: "Open" },
              { startDate: "11 Dec", endDate: "12 Dec", status: "Open" },
              { startDate: "12 Dec", endDate: "13 Dec", status: "Open" },
              { startDate: "13 Dec", endDate: "14 Dec", status: "Open" },
              { startDate: "14 Dec", endDate: "15 Dec", status: "Open" },
              { startDate: "15 Dec", endDate: "16 Dec", status: "Open" },
              { startDate: "16 Dec", endDate: "17 Dec", status: "Open" },
              { startDate: "17 Dec", endDate: "18 Dec", status: "Open" },
              { startDate: "18 Dec", endDate: "19 Dec", status: "Open" },
              { startDate: "19 Dec", endDate: "20 Dec", status: "Open" },
              { startDate: "20 Dec", endDate: "21 Dec", status: "Open" },
              { startDate: "21 Dec", endDate: "22 Dec", status: "Open" },
              { startDate: "22 Dec", endDate: "23 Dec", status: "Open" },
              { startDate: "23 Dec", endDate: "24 Dec", status: "Open" },
              { startDate: "24 Dec", endDate: "25 Dec", status: "Open" },
              { startDate: "25 Dec", endDate: "26 Dec", status: "Open" },
              { startDate: "26 Dec", endDate: "27 Dec", status: "Open" },
              { startDate: "27 Dec", endDate: "28 Dec", status: "Open" },
              { startDate: "28 Dec", endDate: "29 Dec", status: "Open" },
              { startDate: "29 Dec", endDate: "30 Dec", status: "Open" },
              { startDate: "30 Dec", endDate: "31 Dec", status: "Open" },
              { startDate: "31 Dec", endDate: "01 Jan", status: "Open" }
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
              { startDate: "01 Jan", endDate: "02 Jan", status: "Open" },
              { startDate: "02 Jan", endDate: "03 Jan", status: "Open" },
              { startDate: "03 Jan", endDate: "04 Jan", status: "Open" },
              { startDate: "04 Jan", endDate: "05 Jan", status: "Open" },
              { startDate: "05 Jan", endDate: "06 Jan", status: "Open" },
              { startDate: "06 Jan", endDate: "07 Jan", status: "Open" },
              { startDate: "07 Jan", endDate: "08 Jan", status: "Open" },
              { startDate: "08 Jan", endDate: "09 Jan", status: "Open" },
              { startDate: "09 Jan", endDate: "10 Jan", status: "Open" },
              { startDate: "10 Jan", endDate: "11 Jan", status: "Open" },
              { startDate: "11 Jan", endDate: "12 Jan", status: "Open" },
              { startDate: "12 Jan", endDate: "13 Jan", status: "Open" },
              { startDate: "13 Jan", endDate: "14 Jan", status: "Open" },
              { startDate: "14 Jan", endDate: "15 Jan", status: "Open" },
              { startDate: "15 Jan", endDate: "16 Jan", status: "Open" },
              { startDate: "16 Jan", endDate: "17 Jan", status: "Open" },
              { startDate: "17 Jan", endDate: "18 Jan", status: "Open" },
              { startDate: "18 Jan", endDate: "19 Jan", status: "Open" },
              { startDate: "19 Jan", endDate: "20 Jan", status: "Open" },
              { startDate: "20 Jan", endDate: "21 Jan", status: "Open" },
              { startDate: "21 Jan", endDate: "22 Jan", status: "Open" },
              { startDate: "22 Jan", endDate: "23 Jan", status: "Open" },
              { startDate: "23 Jan", endDate: "24 Jan", status: "Open" },
              { startDate: "24 Jan", endDate: "25 Jan", status: "Open" },
              { startDate: "25 Jan", endDate: "26 Jan", status: "Open" },
              { startDate: "26 Jan", endDate: "27 Jan", status: "Open" },
              { startDate: "27 Jan", endDate: "28 Jan", status: "Open" },
              { startDate: "28 Jan", endDate: "29 Jan", status: "Open" },
              { startDate: "29 Jan", endDate: "30 Jan", status: "Open" },
              { startDate: "30 Jan", endDate: "31 Jan", status: "Open" },
              { startDate: "31 Jan", endDate: "01 Feb", status: "Open" }
            ]
          },
          {
            month: "Feb",
            year: "2027",
            trips: [
              { startDate: "01 Feb", endDate: "02 Feb", status: "Open" },
              { startDate: "02 Feb", endDate: "03 Feb", status: "Open" },
              { startDate: "03 Feb", endDate: "04 Feb", status: "Open" },
              { startDate: "04 Feb", endDate: "05 Feb", status: "Open" },
              { startDate: "05 Feb", endDate: "06 Feb", status: "Open" },
              { startDate: "06 Feb", endDate: "07 Feb", status: "Open" },
              { startDate: "07 Feb", endDate: "08 Feb", status: "Open" },
              { startDate: "08 Feb", endDate: "09 Feb", status: "Open" },
              { startDate: "09 Feb", endDate: "10 Feb", status: "Open" },
              { startDate: "10 Feb", endDate: "11 Feb", status: "Open" },
              { startDate: "11 Feb", endDate: "12 Feb", status: "Open" },
              { startDate: "12 Feb", endDate: "13 Feb", status: "Open" },
              { startDate: "13 Feb", endDate: "14 Feb", status: "Open" },
              { startDate: "14 Feb", endDate: "15 Feb", status: "Open" },
              { startDate: "15 Feb", endDate: "16 Feb", status: "Open" },
              { startDate: "16 Feb", endDate: "17 Feb", status: "Open" },
              { startDate: "17 Feb", endDate: "18 Feb", status: "Open" },
              { startDate: "18 Feb", endDate: "19 Feb", status: "Open" },
              { startDate: "19 Feb", endDate: "20 Feb", status: "Open" },
              { startDate: "20 Feb", endDate: "21 Feb", status: "Open" },
              { startDate: "21 Feb", endDate: "22 Feb", status: "Open" },
              { startDate: "22 Feb", endDate: "23 Feb", status: "Open" },
              { startDate: "23 Feb", endDate: "24 Feb", status: "Open" },
              { startDate: "24 Feb", endDate: "25 Feb", status: "Open" },
              { startDate: "25 Feb", endDate: "26 Feb", status: "Open" },
              { startDate: "26 Feb", endDate: "27 Feb", status: "Open" },
              { startDate: "27 Feb", endDate: "28 Feb", status: "Open" },
              { startDate: "28 Feb", endDate: "01 Mar", status: "Open" }
            ]
          },
          {
            month: "Mar",
            year: "2027",
            trips: [
              { startDate: "01 Mar", endDate: "02 Mar", status: "Open" },
              { startDate: "02 Mar", endDate: "03 Mar", status: "Open" },
              { startDate: "03 Mar", endDate: "04 Mar", status: "Open" },
              { startDate: "04 Mar", endDate: "05 Mar", status: "Open" },
              { startDate: "05 Mar", endDate: "06 Mar", status: "Open" },
              { startDate: "06 Mar", endDate: "07 Mar", status: "Open" },
              { startDate: "07 Mar", endDate: "08 Mar", status: "Open" },
              { startDate: "08 Mar", endDate: "09 Mar", status: "Open" },
              { startDate: "09 Mar", endDate: "10 Mar", status: "Open" },
              { startDate: "10 Mar", endDate: "11 Mar", status: "Open" },
              { startDate: "11 Mar", endDate: "12 Mar", status: "Open" },
              { startDate: "12 Mar", endDate: "13 Mar", status: "Open" },
              { startDate: "13 Mar", endDate: "14 Mar", status: "Open" },
              { startDate: "14 Mar", endDate: "15 Mar", status: "Open" },
              { startDate: "15 Mar", endDate: "16 Mar", status: "Open" },
              { startDate: "16 Mar", endDate: "17 Mar", status: "Open" },
              { startDate: "17 Mar", endDate: "18 Mar", status: "Open" },
              { startDate: "18 Mar", endDate: "19 Mar", status: "Open" },
              { startDate: "19 Mar", endDate: "20 Mar", status: "Open" },
              { startDate: "20 Mar", endDate: "21 Mar", status: "Open" },
              { startDate: "21 Mar", endDate: "22 Mar", status: "Open" },
              { startDate: "22 Mar", endDate: "23 Mar", status: "Open" },
              { startDate: "23 Mar", endDate: "24 Mar", status: "Open" },
              { startDate: "24 Mar", endDate: "25 Mar", status: "Open" },
              { startDate: "25 Mar", endDate: "26 Mar", status: "Open" },
              { startDate: "26 Mar", endDate: "27 Mar", status: "Open" },
              { startDate: "27 Mar", endDate: "28 Mar", status: "Open" },
              { startDate: "28 Mar", endDate: "29 Mar", status: "Open" },
              { startDate: "29 Mar", endDate: "30 Mar", status: "Open" },
              { startDate: "30 Mar", endDate: "31 Mar", status: "Open" },
              { startDate: "31 Mar", endDate: "01 Apr", status: "Open" }
            ]
          },
          {
            month: "Apr",
            year: "2027",
            trips: [
              { startDate: "01 Apr", endDate: "02 Apr", status: "Open" },
              { startDate: "02 Apr", endDate: "03 Apr", status: "Open" },
              { startDate: "03 Apr", endDate: "04 Apr", status: "Open" },
              { startDate: "04 Apr", endDate: "05 Apr", status: "Open" },
              { startDate: "05 Apr", endDate: "06 Apr", status: "Open" },
              { startDate: "06 Apr", endDate: "07 Apr", status: "Open" },
              { startDate: "07 Apr", endDate: "08 Apr", status: "Open" },
              { startDate: "08 Apr", endDate: "09 Apr", status: "Open" },
              { startDate: "09 Apr", endDate: "10 Apr", status: "Open" },
              { startDate: "10 Apr", endDate: "11 Apr", status: "Open" },
              { startDate: "11 Apr", endDate: "12 Apr", status: "Open" },
              { startDate: "12 Apr", endDate: "13 Apr", status: "Open" },
              { startDate: "13 Apr", endDate: "14 Apr", status: "Open" },
              { startDate: "14 Apr", endDate: "15 Apr", status: "Open" },
              { startDate: "15 Apr", endDate: "16 Apr", status: "Open" },
              { startDate: "16 Apr", endDate: "17 Apr", status: "Open" },
              { startDate: "17 Apr", endDate: "18 Apr", status: "Open" },
              { startDate: "18 Apr", endDate: "19 Apr", status: "Open" },
              { startDate: "19 Apr", endDate: "20 Apr", status: "Open" },
              { startDate: "20 Apr", endDate: "21 Apr", status: "Open" },
              { startDate: "21 Apr", endDate: "22 Apr", status: "Open" },
              { startDate: "22 Apr", endDate: "23 Apr", status: "Open" },
              { startDate: "23 Apr", endDate: "24 Apr", status: "Open" },
              { startDate: "24 Apr", endDate: "25 Apr", status: "Open" },
              { startDate: "25 Apr", endDate: "26 Apr", status: "Open" },
              { startDate: "26 Apr", endDate: "27 Apr", status: "Open" },
              { startDate: "27 Apr", endDate: "28 Apr", status: "Open" },
              { startDate: "28 Apr", endDate: "29 Apr", status: "Open" },
              { startDate: "29 Apr", endDate: "30 Apr", status: "Open" },
              { startDate: "30 Apr", endDate: "01 May", status: "Open" }
            ]
          }
        ]
      }
    }
  };
}

// Static details for the Chopta Tungnath Chandrashila Trek (uid:
// chopta-tungnath-trek). This listing lives in `YATRAS`, not `TREKS`, so the
// assignments below index that array — /treks/[slug] resolves against both.
// Trek essentials (packing list) and the cancellation policy are deliberately
// left unset: Kedarkantha publishes neither, so both sections render the same
// shared copy from `trekDefaults.ts` / `TrekCancellation`.
const choptaTungnathIndex = YATRAS.findIndex(t => t.slug === 'chopta-tungnath-trek');
if (choptaTungnathIndex !== -1) {
  // All five as published; /treks/[slug] renders the first four.
  YATRAS[choptaTungnathIndex].similarTreks = [
    "kedarkantha-trek",
    "brahmatal-trek",
    "kuari-pass-trek",
    "dayara-bugyal-trek",
    "nagtibba-trek"
  ];

  YATRAS[choptaTungnathIndex].faqs = [
    {
      title: "What is the Chopta Tungnath Chandrashila Trek?",
      description: "It is a scenic Himalayan trek covering Chopta, Tungnath Temple and Chandrashila Summit, with Deoriatal included in this itinerary."
    },
    {
      title: "How difficult is the Chopta Tungnath Trek?",
      description: "The trek is considered Easy to Moderate and is suitable for beginners with basic fitness."
    },
    {
      title: "How many days are required for the trek?",
      description: "Our itinerary is a 3 Days / 2 Nights trip covering Tungnath, Chandrashila and Deoriatal."
    },
    {
      title: "What is the altitude of Chandrashila?",
      description: "Chandrashila Summit is approximately 4,000 metres (13,123 ft) above sea level."
    },
    {
      title: "What is the best time to do the Chopta Tungnath Chandrashila Trek?",
      description: "The best seasons are generally April to June and September to November. Winter offers a different experience with snow, subject to weather and road conditions."
    },
    {
      title: "Can beginners do this trek?",
      description: "Yes. Beginners can do this trek with reasonable fitness, proper pacing and suitable trekking shoes."
    },
    {
      title: "Is Tungnath Temple open throughout the year?",
      description: "No. Tungnath Temple follows its seasonal opening and closing schedule. During the winter closure, the temple area may remain inaccessible depending on conditions."
    },
    {
      title: "How far is Chandrashila from Chopta?",
      description: "The trekking route from Chopta to Chandrashila is approximately 5 km one way, depending on the exact route and conditions."
    },
    {
      title: "Where does the trek start and where do we stay?",
      description: "The trip accommodation is in Sari Village. The Tungnath–Chandrashila trek starts from Chopta, which is reached by road from Sari."
    },
    {
      title: "What should I carry for the Chopta Tungnath Trek?",
      description: "Carry good trekking shoes, warm layers, rain protection, water bottle, sunglasses, sunscreen, personal medicines, a small backpack and basic toiletries."
    }
  ];

  YATRAS[choptaTungnathIndex].article = {
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
          "But the real journey begins when you leave the road behind and start walking."
        ]
      },
      {
        heading: "A Journey That Begins in Sari",
        paragraphs: [
          "Our journey begins at Sari Village, a peaceful Himalayan settlement surrounded by mountains and forests.",
          "As the evening settles over the village, the pace of life naturally slows down. There are no crowded streets, no traffic horns and no city rush — only mountain air, simple village life and a sky filled with stars.",
          "This is where you prepare yourself for the adventure waiting the next morning."
        ]
      },
      {
        heading: "Walking Towards Tungnath",
        paragraphs: [
          "The next morning, the journey takes you towards Chopta, the starting point of the trek to Tungnath and Chandrashila.",
          "The trail gradually climbs through beautiful Himalayan landscapes. With every turn, the scenery changes. Forests open up to mountain views, clouds drift across the peaks and the sound of the wind becomes your constant companion.",
          "And then comes Tungnath.",
          "Standing at a high altitude amidst the Himalayas, Tungnath is not just a temple — it is an experience of faith, silence and nature coming together.",
          "For many trekkers, reaching Tungnath feels like more than simply completing a trail.",
          "It feels like arriving somewhere they had been searching for without knowing it."
        ]
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
          "You simply need to stand there and take it all in."
        ]
      },
      {
        heading: "Deoriatal – A Quiet Ending to a Beautiful Journey",
        paragraphs: [
          "The adventure continues towards Deoriatal, a serene lake surrounded by forests and magnificent Himalayan views.",
          "The peaceful trail from Sari to Deoriatal offers a completely different experience from the Chandrashila climb.",
          "Here, there is no rush.",
          "Just trees, birds, mountain air and the beautiful silence of the Himalayas.",
          "On a clear day, the reflection of the mountains in the calm waters of Deoriatal creates a picture that stays in your memory long after you leave."
        ]
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
          "These are the moments that turn a trek into a memory."
        ]
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
          "Your mountains. Your journey. Your story."
        ]
      }
    ],
    signoff: "Travel with Trip My Soul."
  };
}

const choptaIndex = YATRAS.findIndex(y => y.slug === 'chopta-tungnath-trek');
if (choptaIndex !== -1) {
  YATRAS[choptaIndex].maxAltitude = "13,123 ft / 4,000 m";
  YATRAS[choptaIndex].totalDistance = "15–17 Kilometers";
  YATRAS[choptaIndex].availability = "October – July";

  YATRAS[choptaIndex].aboutParagraphs = [
    "The Chopta Tungnath Chandrashila Trek is one of Uttarakhand's most rewarding Himalayan treks, combining spiritual significance, beautiful alpine landscapes and spectacular mountain views. The trail begins from the picturesque meadows of Chopta and climbs through dense rhododendron and oak forests towards Tungnath Temple, one of the highest Shiva temples in the world.",
    "From Tungnath, the trail becomes steeper as it leads to the Chandrashila Summit at around 4,000 metres. The summit offers a breathtaking 360-degree panorama of the Himalayan ranges, including Chaukhamba, Kedarnath Dome, Neelkanth and Nanda Devi.",
    "The trek can also be extended to Deoriatal, a beautiful high-altitude lake surrounded by forest and mountain scenery. The combination of the sacred Tungnath Temple, the final climb to Chandrashila, peaceful forests and spectacular Himalayan views makes this trek ideal for both first-time trekkers and experienced mountain lovers.",
    "Reaching Chandrashila before sunrise and watching the first rays of sunlight light up the Himalayan peaks is an experience that stays with you long after the trek ends."
  ];

  YATRAS[choptaIndex].highlights = [
    "Chandrashila Summit at ~13,123 ft",
    "Tungnath Temple at ~12,073 ft",
    "Chandrashila sunrise over the Himalaya",
    "Deoriatal Lake",
    "Rhododendron & oak forests",
    "Chaukhamba, Kedarnath Dome & Neelkanth views",
    "Nanda Devi on the eastern skyline",
    "Chopta meadows",
    "Devprayag Sangam & Dhari Devi on the drive"
  ];

  YATRAS[choptaIndex].usps = [
    {
      title: "Base village: Sari",
      description: "The trek runs out of Sari Village in Rudraprayag district, reached on a 7–9 hour drive from Rishikesh or Dehradun — the same village that serves as the roadhead for Deoriatal."
    },
    {
      title: "The world's highest Shiva temple",
      description: "Tungnath sits at roughly 3,680 m / 12,073 ft, the highest of the Panch Kedar shrines and the highest Shiva temple anywhere — reached on foot from Chopta through rhododendron and oak forest."
    },
    {
      title: "A genuine 4,000 m summit inside three days",
      description: "Chandrashila stands about 320 m above the temple at roughly 4,000 m / 13,123 ft, and the climb to it is the steepest section of the route. Few Himalayan summits of that height sit inside a weekend itinerary."
    },
    {
      title: "A 360-degree Garhwal panorama",
      description: "Chaukhamba, Kedarnath Dome, Neelkanth and Nanda Devi are all visible from the summit on a clear morning, with the wider Himalayan ranges filling out the horizon behind them."
    },
    {
      title: "Two trails, one base",
      description: "Chandrashila on day two and Deoriatal on day three run from the same village, which is what lets a three-day itinerary cover both a summit and a high-altitude lake."
    },
    {
      title: "Open through most of the year",
      description: "April to June and September to November give the clearest mountain views; December to March turns the same trail into a snow walk, with the grade rising accordingly."
    }
  ];

  YATRAS[choptaIndex].destinationHighlights = [
    { name: "Sari Village", blurb: "The base village in Rudraprayag district at roughly 6,300 ft, and the roadhead for both the Chopta drive and the Deoriatal trail." },
    { name: "Chopta", blurb: "The meadow at about 8,790 ft where the walking starts, known as the mini-Switzerland of Uttarakhand." },
    { name: "Tungnath Temple", blurb: "The highest Shiva temple in the world at roughly 12,073 ft, third of the five Panch Kedar shrines." },
    { name: "Chandrashila Summit", blurb: "The 13,123 ft high point of the route, with a full 360-degree view of the Garhwal and Kumaon Himalaya." },
    { name: "Deoriatal", blurb: "A quiet high-altitude lake above Sari, best known for the reflection of Chaukhamba in still water." },
    { name: "Devprayag & Dhari Devi", blurb: "The Alaknanda–Bhagirathi confluence and the riverside shrine, both passed on the drive up from Rishikesh." }
  ];

  YATRAS[choptaIndex].differentiators = [
    "Region: Garhwal Himalayas, Rudraprayag district, Uttarakhand",
    "Trek type: short summit and pilgrimage trail, with Chandrashila at ~4,000 m as the high point",
    "Terrain: rhododendron and oak forest, open meadow, a steep summit ridge and a forest lake trail",
    "Best season: April to June and September to November; December to March for snow"
  ];

  YATRAS[choptaIndex].similarTreks = [
    "deoriatal-chopta-trek",
    "kedarnath-and-tungnath-yatra",
    "kartik-swami-trek",
    "brahmatal-trek"
  ];

  // Transcribed verbatim from the Google reviews on the Trip My Soul profile.
  YATRAS[choptaIndex].externalReviews = [
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
        "In case, you are planning your trek with TMS do ask for this trek leader."
      ]
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
        "I highly recommend this travel company to anyone planning a spiritual or trekking trip to the Himalayas. Thank you for creating such wonderful memories—I look forward to traveling with you again! 🙏🏔️"
      ]
    },
    {
      source: "Google",
      subject: "Trip My Soul",
      author: "Parag Dubey",
      rating: 5,
      date: "a year ago",
      text: [
        "It was our first trek & literally I had to say it was my best experience to feel nature and mountains.",
        "Had an amazing experience with Trip My Soul on the chandrashila trek! Everything was well-organized, and our trek lead, himanshu bhai was incredibly supportive and knowledgeable. The views were breathtaking, the campsites clean, and the food delicious. Highly recommend them for a hassle-free and memorable trekking adventure …"
      ]
    }
  ];

  YATRAS[choptaIndex].reviewVideos = [
    "https://youtube.com/shorts/Q235DetUukc",
    "https://youtube.com/shorts/pJ9esoHTl7g",
    "https://youtube.com/shorts/YtTT7-Ru9bA",
    "https://youtube.com/shorts/9Y2YYU6cz5s"
  ];

  YATRAS[choptaIndex].idealFor =
    "Beginners, families with reasonable fitness, first-time trekkers and adventure travellers looking for a genuine Himalayan summit inside a short itinerary.";

  YATRAS[choptaIndex].importantNote =
    "Local forest and administrative regulations apply on this route and can change seasonally — your trek leader will confirm the permits in force on your departure. Between December and March the trail carries snow and the grade sits at the upper end of easy–moderate; the summit-day start time is set accordingly. Views from Chandrashila depend entirely on the weather, so treat a clear morning as a bonus rather than a guarantee.";

  /**
   * Day 2 walks out and back from Chopta, so its altitude points chart the
   * climb from the roadhead rather than from the previous night's stay.
   * Figures for Sari, Chopta and Deoriatal are the standard published
   * altitudes; the source sheet prints only Tungnath and Chandrashila.
   */
  YATRAS[choptaIndex].itinerary = [
    {
      day: 1,
      title: "Dehradun / Rishikesh to Sari Village",
      driveDistance: "Rishikesh → Sari",
      drivingTime: "7-9 Hours",
      pickupPoint: "Rishikesh / Dehradun",
      altitudePoints: [
        { location: "Rishikesh", m: 372, ft: 1220 },
        { location: "Sari Village", m: 1920, ft: 6300 }
      ],
      altitudeGain: { m: 1548, ft: 5080 },
      description: "A scenic mountain drive up the Alaknanda valley to Sari, the base village of the Chopta Tungnath Chandrashila Trek.",
      detailedParagraphs: [
        "The journey begins early from Dehradun or Rishikesh and follows the road up the Alaknanda valley into Rudraprayag district.",
        "The route runs through Devprayag, where the Bhagirathi and the Alaknanda meet to become the Ganga, past the riverside shrine of Dhari Devi and on through Rudraprayag, with Himalayan valleys opening out on either side as the road climbs.",
        "The last stretch turns off the main highway and climbs towards Sari, a small village set among terraced fields and forest.",
        "On arrival, check into the homestay, guesthouse or Swiss camp and meet your trek leader and the rest of the group. The team runs a briefing for the days ahead over dinner."
      ],
      highlights: ["Devprayag Sangam", "Dhari Devi", "Rudraprayag", "Himalayan Valleys", "Sari Village"],
      meals: "Dinner",
      stayType: "Sari Village — homestay / guesthouse / Swiss camp"
    },
    {
      day: 2,
      title: "Sari to Chopta, trek to Tungnath and Chandrashila, return to Sari",
      trekDistance: "10-12 km",
      trekDuration: "6-8 Hours",
      driveDistance: "Sari ↔ Chopta",
      drivingTime: "1-1.5 Hours each way",
      timeNote: { label: "Summit start", value: "Early morning" },
      altitudePoints: [
        { location: "Chopta", m: 2680, ft: 8792 },
        { location: "Tungnath", m: 3680, ft: 12073 },
        { location: "Chandrashila", m: 4000, ft: 13123 }
      ],
      altitudeGain: { m: 1320, ft: 4331 },
      description: "The main day of the trek — the climb from Chopta to Tungnath Temple and on to the Chandrashila Summit, then back down to Sari.",
      detailedParagraphs: [
        "An early drive of an hour to an hour and a half takes you from Sari to Chopta, the meadow where the walking starts.",
        "The trail leaves Chopta and climbs steadily through dense rhododendron and oak forest. It is a well-laid stone path for most of its length, and roughly 3.5 km of continuous ascent brings you out at Tungnath Temple — the highest Shiva temple in the world, at around 3,680 m.",
        "Above the temple the trail steepens noticeably for the final 1.5 km to Chandrashila. This is the hardest section of the route and the one where altitude begins to tell, so hold a comfortable pace and take regular breaks.",
        "At roughly 4,000 m you reach the summit. On a clear morning the panorama runs the full 360 degrees — Chaukhamba and Kedarnath Dome to the west, Neelkanth to the north, and Nanda Devi and the Kumaon ranges to the east.",
        "Retrace the route down through the forest to Chopta and drive back to Sari for the night. In winter this whole section carries snow, and the descent takes longer than the map suggests."
      ],
      highlights: [
        "Tungnath Temple at ~12,073 ft",
        "Chandrashila Summit at ~13,123 ft",
        "360° Himalayan Panorama",
        "Chaukhamba & Kedarnath Dome",
        "Nanda Devi & Neelkanth",
        "Rhododendron Forest"
      ],
      meals: "Breakfast & Dinner",
      stayType: "Sari Village — homestay / guesthouse / Swiss camp"
    },
    {
      day: 3,
      title: "Sari to Deoriatal and back, drive to Rishikesh / Dehradun",
      trekDistance: "5 km",
      trekDuration: "3 Hours",
      driveDistance: "Sari → Rishikesh / Dehradun",
      drivingTime: "7-9 Hours",
      timeNote: { label: "Drop-off", value: "Rishikesh / Dehradun" },
      altitudePoints: [
        { location: "Sari Village", m: 1920, ft: 6300 },
        { location: "Deoriatal", m: 2438, ft: 8000 }
      ],
      altitudeGain: { m: 518, ft: 1700 },
      description: "A short forest walk up to the Deoriatal Lake and back, followed by the drive down to Rishikesh or Dehradun.",
      detailedParagraphs: [
        "After breakfast, walk out of Sari on the forest trail that climbs to Deoriatal — about 2.5 km up, and roughly three hours for the round trip.",
        "The path runs through forest for most of the way before opening out at the lake, a quiet stretch of water ringed by trees with Chaukhamba standing behind it. On a still morning the peaks reflect off the surface, which is what the lake is best known for.",
        "Walk back down to Sari, collect your bags and begin the long drive back down the valley, retracing the route through Rudraprayag and Devprayag.",
        "The trek concludes on arrival in Rishikesh or Dehradun in the evening."
      ],
      highlights: ["Deoriatal Lake", "Chaukhamba Reflection", "Forest Trail", "Journey Ends"],
      meals: "Breakfast",
      // The trek ends on this day; an empty stay keeps the generic
      // "Hotel / Homestay" fallback out of the day quick-info line.
      stayType: ""
    }
  ];

  /**
   * The source sheet gives the trek distance as "approx. 5 km one way to
   * Chandrashila from Chopta" while the day pages total 15-17 km across the two
   * walking days. Both are recorded as published rather than reconciled.
   */
  YATRAS[choptaIndex].sourceCaveat =
    "The published route quotes about 5 km one way from Chopta to Chandrashila, while the day-by-day figures total 15–17 km across both trekking days — the headline figure covers the Chandrashila climb only, not the Deoriatal walk or the return legs. Both are listed here as published, and your trek leader will confirm the exact route on your departure.";

  YATRAS[choptaIndex].inclusions = [
    { title: "Accommodation", description: "2 nights in Sari Village in a homestay, guesthouse or Swiss camp, on triple/quad sharing basis." },
    { title: "Meals", description: "Meals as per itinerary — 2 breakfasts & 2 dinners." },
    { title: "Transportation", description: "Dehradun/Rishikesh to Sari and back, as per the itinerary." },
    { title: "Trek Leader / Guide", description: "Experienced trek leader or local guide for the Tungnath–Chandrashila and Deoriatal treks." },
    { title: "Driver & Road Charges", description: "All applicable driver allowances, fuel, toll taxes and parking charges." },
    { title: "First Aid", description: "Basic first-aid kit and emergency medical support during the trek." },
    { title: "Trek Support", description: "Trekking support and assistance throughout the trip." }
  ];

  YATRAS[choptaIndex].exclusions = [
    { title: "Forest permit", description: "Forest permit / forest entry fee." },
    { title: "Personal expenses", description: "Snacks, beverages, tips and laundry." },
    { title: "Additional transportation", description: "Any extra transportation or taxi charges due to bad weather, snowfall, landslide or road blockage." },
    { title: "Sari–Chopta road block", description: "If the Sari–Chopta road is blocked, the additional local taxi charge is payable by the guest." },
    { title: "Trekking equipment", description: "Personal gear such as shoes, jackets and rainwear." },
    { title: "Medical & evacuation", description: "Any medical expenses or emergency evacuation." },
    { title: "Anything not listed", description: "Anything not specifically mentioned under inclusions." }
  ];

  /**
   * As briefed, the same criteria Kedarkantha carries, with the altitude row
   * set against Chandrashila rather than the Kedarkantha summit.
   */
  YATRAS[choptaIndex].eligibilityCriteria = [
    { icon: "User", text: "Age: 10–60 years recommended" },
    { icon: "Footprints", text: "Experience: No prior trekking experience required" },
    { icon: "Dumbbell", text: "Fitness: Basic to moderate fitness required" },
    { icon: "Mountain", text: "Altitude: Up to 13,123 ft / 4,000 m" },
    { icon: "Snowflake", text: "Must be comfortable with cold and snow conditions" },
    { icon: "Stethoscope", text: "Participants should be medically fit for high-altitude trekking" }
  ];

  /** Set against this trek's own day lengths — one long summit day, one short. */
  YATRAS[choptaIndex].fitnessCriteria = [
    { icon: "Footprints", text: "Able to walk 5–6 km comfortably on uneven ground" },
    { icon: "TrendingUp", text: "Able to sustain a 6–8 hour walking day on summit day" },
    { icon: "Dumbbell", text: "Leg strength for a continuous stone-paved ascent and a steep final climb" },
    { icon: "Backpack", text: "Comfortable carrying a light daypack" },
    { icon: "Activity", text: "Regular walking or stair training for 3–4 weeks before the trek is recommended" }
  ];

  YATRAS[choptaIndex].howToReach = {
    intro: "The Chopta Tungnath Chandrashila Trek runs out of Sari Village in Rudraprayag district, Uttarakhand. For Trip My Soul, the meeting point is Rishikesh or Dehradun, from where trekkers travel by road to Sari.",
    air: {
      summaryLabel: "Nearest Airport",
      summary: "Jolly Grant Airport, Dehradun (DED)",
      detail: "From the airport, travel by taxi or cab to Sari Village — roughly 220–240 km depending on the route, and about 8–10 hours on the road. From Sari, a further hour to an hour and a half by vehicle reaches Chopta, where the trekking route begins. Recommended for travellers coming from Delhi, Mumbai, Bengaluru and other cities with flight connectivity to Dehradun."
    },
    train: {
      summaryLabel: "Nearest Railway Station",
      summary: "Rishikesh Railway Station",
      detail: "From Rishikesh, travel by bus, shared taxi or private cab towards Sari Village — about 7–9 hours by road. Haridwar Railway Station is also a convenient railhead with good connectivity, followed by the same road journey."
    },
    road: {
      summaryLabel: "Route",
      summary: "Rishikesh to Sari via Devprayag and Rudraprayag",
      detail: "Sari is connected by road with Rishikesh, Haridwar and Dehradun. From Sari, drive on to Chopta, where the trek to Tungnath and Chandrashila begins.",
      route: ["Dehradun / Rishikesh", "Devprayag", "Srinagar", "Dhari Devi", "Rudraprayag", "Ukhimath", "Sari Village"],
      facts: [
        { label: "Distance", value: "~200 km from Rishikesh" },
        { label: "Drive", value: "~7–9 hours" },
        { label: "Options", value: "Bus / Shared Taxi / Private Cab / Tempo Traveller" }
      ]
    },
    pickup: {
      point: "Rishikesh / Dehradun",
      time: "Early morning of Day 1",
      dropPoint: "Rishikesh / Dehradun",
      dropTime: "Evening of Day 3",
      note: "Route for TMS trekkers: Rishikesh → Sari → Chopta → Tungnath → Chandrashila, with Deoriatal from Sari on the final morning."
    }
  };

  YATRAS[choptaIndex].faqs = [
    {
      title: "What is the Chopta Tungnath Chandrashila Trek?",
      description: "It is a short Himalayan trek in Rudraprayag district, Uttarakhand, that climbs from the meadows of Chopta through rhododendron and oak forest to Tungnath — the highest Shiva temple in the world — and on to the Chandrashila Summit at roughly 4,000 m, with an optional walk to the Deoriatal Lake."
    },
    {
      title: "How difficult is the trek?",
      description: "It is rated Easy to Moderate. The climb from Chopta to Tungnath is a steady ascent on a stone-paved trail, and the final 1.5 km to Chandrashila is noticeably steeper. During winter, snow and icy sections make the same route harder."
    },
    {
      title: "What is the maximum altitude?",
      description: "Chandrashila Summit reaches approximately 4,000 m / 13,123 ft. Tungnath Temple, below it, sits at about 3,680 m / 12,073 ft."
    },
    {
      title: "How many days are required?",
      description: "The standard Trip My Soul itinerary is 3 Days / 2 Nights, including transport from Rishikesh or Dehradun, the Chandrashila climb, the Deoriatal walk and the return drive."
    },
    {
      title: "What is the best time for the trek?",
      description: "April to June and September to November are the best windows, with clear mountain views and rhododendron in bloom through spring. December to March turns it into a snow trek, depending on conditions that year. July and August fall in the monsoon and are avoided."
    },
    {
      title: "Is it suitable for beginners and families?",
      description: "Yes. It is one of the most accessible Himalayan treks in Uttarakhand and suits beginners, first-time trekkers and families with reasonable fitness. You should be comfortable walking about 5 km and climbing continuously for a few hours."
    },
    {
      title: "Where does the trek start?",
      description: "The base village is Sari, in Rudraprayag district. From Sari it is an hour to an hour and a half by vehicle to Chopta, where the walk to Tungnath and Chandrashila begins."
    },
    {
      title: "Why do people climb Chandrashila before sunrise?",
      description: "The first light of the day on the Himalayan peaks is the single best view on the trek, and mornings are generally clearer than afternoons. Your trek leader sets the start time based on the season and the conditions on the trail."
    },
    {
      title: "Which peaks are visible from the summit?",
      description: "On a clear day the panorama takes in Chaukhamba, Kedarnath Dome, Neelkanth and Nanda Devi, along with the wider Garhwal and Kumaon ranges."
    },
    {
      title: "Are permits required?",
      description: "Local forest and administrative regulations apply on this route and can change seasonally. Trip My Soul handles the applicable permits, and your trek leader will confirm what is in force on your departure."
    },
    {
      title: "What accommodation is provided?",
      description: "Both nights are at Sari Village, in a homestay, guesthouse or Swiss camp depending on the departure and availability."
    },
    {
  TREKS[nagtibbaIndex].availability = "October – June";

  /**
   * The listing card carried "Moderate", while the published guide and its FAQ
   * both give easy to moderate, so the fact strip, the eligibility copy and the
   * FAQ answer now agree.
   */
  TREKS[nagtibbaIndex].difficulty = "Easy to Moderate";

  // As published in the guide, in this order.
  TREKS[nagtibbaIndex].similarTreks = [
    "chopta-tungnath-trek",
    "kedarkantha-trek",
    "brahmatal-trek",
    "dayara-bugyal-trek"
  ];
      title: "What should I carry?",
      description: "Good trekking shoes, warm layers, a waterproof jacket, thermal wear, gloves, a woollen cap, sunglasses, sunscreen, water bottles, personal medicines, a headlamp and a trekking daypack. On winter departures, gaiters and microspikes may be needed depending on snow conditions."
    }
  ];

  YATRAS[choptaIndex].heroImage =
    "/Trips_gallery/Tungnath_chandrashila/IMG_4346.JPG.jpeg";

  YATRAS[choptaIndex].heroImages = [
    "/Trips_gallery/Tungnath_chandrashila/IMG_4346.JPG.jpeg",
    "/Trips_gallery/Tungnath_chandrashila/IMG_4359.JPG.jpeg",
    "/Trips_gallery/Tungnath_chandrashila/IMG_4348.JPG.jpeg"
  ];

  // Shot on past Chopta–Tungnath–Chandrashila batches. The folder also holds
  // four .HEIC originals, left out because browsers other than Safari will not
  // render them in an <img>.
  YATRAS[choptaIndex].gallery = [
    { url: "/Trips_gallery/Tungnath_chandrashila/IMG_4227.JPG.jpeg", caption: "The road up to Sari Village" },
    { url: "/Trips_gallery/Tungnath_chandrashila/IMG_4228.JPG.jpeg", caption: "Garhwal valleys on the drive in" },
    { url: "/Trips_gallery/Tungnath_chandrashila/IMG_4229.JPG.jpeg", caption: "Sari Village, the base for both nights" },
    { url: "/Trips_gallery/Tungnath_chandrashila/IMG_4231.JPG.jpeg", caption: "Evening in the village" },
    { url: "/Trips_gallery/Tungnath_chandrashila/IMG_4232.JPG.jpeg", caption: "Setting off from Chopta" },
    { url: "/Trips_gallery/Tungnath_chandrashila/IMG_4237.JPG.jpeg", caption: "The stone-paved trail out of Chopta" },
    { url: "/Trips_gallery/Tungnath_chandrashila/IMG_4246.JPG.jpeg", caption: "Rhododendron forest below the meadows" },
    { url: "/Trips_gallery/Tungnath_chandrashila/IMG_4247.JPG.jpeg", caption: "Open bugyal on the way up" },
    { url: "/Trips_gallery/Tungnath_chandrashila/IMG_4259.JPG.jpeg", caption: "Climbing towards the temple" },
    { url: "/Trips_gallery/Tungnath_chandrashila/IMG_4267.JPG.jpeg", caption: "First sight of Tungnath" },
    { url: "/Trips_gallery/Tungnath_chandrashila/IMG_4268.JPG.jpeg", caption: "Tungnath — the world's highest Shiva temple" },
    { url: "/Trips_gallery/Tungnath_chandrashila/IMG_4277.JPG.jpeg", caption: "The temple courtyard at 12,073 ft" },
    { url: "/Trips_gallery/Tungnath_chandrashila/IMG_4278.JPG.jpeg", caption: "Prayer flags above the shrine" },
    { url: "/Trips_gallery/Tungnath_chandrashila/IMG_4342.JPG.jpeg", caption: "The steeper climb beyond Tungnath" },
    { url: "/Trips_gallery/Tungnath_chandrashila/IMG_4343.JPG.jpeg", caption: "On the ridge to Chandrashila" },
    { url: "/Trips_gallery/Tungnath_chandrashila/IMG_4345.JPG.jpeg", caption: "Last stretch to the summit" },
    { url: "/Trips_gallery/Tungnath_chandrashila/IMG_4346.JPG.jpeg", caption: "Chandrashila summit at 13,123 ft" },
    { url: "/Trips_gallery/Tungnath_chandrashila/IMG_4347.JPG.jpeg", caption: "Chaukhamba across the valley" },
    { url: "/Trips_gallery/Tungnath_chandrashila/IMG_4348.JPG.jpeg", caption: "Kedarnath Dome and Neelkanth from the top" },
    { url: "/Trips_gallery/Tungnath_chandrashila/IMG_4349.JPG.jpeg", caption: "360° Garhwal panorama" },
    { url: "/Trips_gallery/Tungnath_chandrashila/IMG_4350.JPG.jpeg", caption: "Nanda Devi on a clear morning" },
    { url: "/Trips_gallery/Tungnath_chandrashila/IMG_4351.JPG.jpeg", caption: "The team on the summit" },
    { url: "/Trips_gallery/Tungnath_chandrashila/IMG_4352.JPG.jpeg", caption: "Summit morning light" },
    { url: "/Trips_gallery/Tungnath_chandrashila/IMG_4353.JPG.jpeg", caption: "Looking down the Chandrashila ridge" },
    { url: "/Trips_gallery/Tungnath_chandrashila/IMG_4355.JPG.jpeg", caption: "Starting the descent to Chopta" },
    { url: "/Trips_gallery/Tungnath_chandrashila/IMG_4357.JPG.jpeg", caption: "Meadows on the way down" },
    { url: "/Trips_gallery/Tungnath_chandrashila/IMG_4358.JPG.jpeg", caption: "Back through the rhododendrons" },
    { url: "/Trips_gallery/Tungnath_chandrashila/IMG_4359.JPG.jpeg", caption: "The walk in to Deoriatal" },
    { url: "/Trips_gallery/Tungnath_chandrashila/IMG_4361.JPG.jpeg", caption: "Deoriatal, reached from Sari" },
    { url: "/Trips_gallery/Tungnath_chandrashila/IMG_4364.JPG.jpeg", caption: "Chaukhamba reflected in the lake" },
    { url: "/Trips_gallery/Tungnath_chandrashila/IMG_4365.JPG.jpeg", caption: "Forest trail back to Sari" },
    { url: "/Trips_gallery/Tungnath_chandrashila/IMG_4367.JPG.jpeg", caption: "Last of the mountains on the drive out" }
  ];

  /**
   * Daily departures through the October-July season, matching the way
   * Kedarkantha publishes its grid. Each batch is the 3-day trip, so the end
   * date is the start plus two days.
   */
  YATRAS[choptaIndex].batches = {
    years: {
      "2026": {
        months: [
          {
            month: "Oct",
            year: "2026",
            trips: [
              { startDate: "01 Oct", endDate: "03 Oct", status: "Open" },
              { startDate: "02 Oct", endDate: "04 Oct", status: "Open" },
              { startDate: "03 Oct", endDate: "05 Oct", status: "Open" },
              { startDate: "04 Oct", endDate: "06 Oct", status: "Open" },
              { startDate: "05 Oct", endDate: "07 Oct", status: "Open" },
              { startDate: "06 Oct", endDate: "08 Oct", status: "Open" },
              { startDate: "07 Oct", endDate: "09 Oct", status: "Open" },
              { startDate: "08 Oct", endDate: "10 Oct", status: "Open" },
              { startDate: "09 Oct", endDate: "11 Oct", status: "Open" },
              { startDate: "10 Oct", endDate: "12 Oct", status: "Open" },
              { startDate: "11 Oct", endDate: "13 Oct", status: "Open" },
              { startDate: "12 Oct", endDate: "14 Oct", status: "Open" },
              { startDate: "13 Oct", endDate: "15 Oct", status: "Open" },
              { startDate: "14 Oct", endDate: "16 Oct", status: "Open" },
              { startDate: "15 Oct", endDate: "17 Oct", status: "Open" },
              { startDate: "16 Oct", endDate: "18 Oct", status: "Open" },
              { startDate: "17 Oct", endDate: "19 Oct", status: "Open" },
              { startDate: "18 Oct", endDate: "20 Oct", status: "Open" },
              { startDate: "19 Oct", endDate: "21 Oct", status: "Open" },
              { startDate: "20 Oct", endDate: "22 Oct", status: "Open" },
              { startDate: "21 Oct", endDate: "23 Oct", status: "Open" },
              { startDate: "22 Oct", endDate: "24 Oct", status: "Open" },
              { startDate: "23 Oct", endDate: "25 Oct", status: "Open" },
              { startDate: "24 Oct", endDate: "26 Oct", status: "Open" },
              { startDate: "25 Oct", endDate: "27 Oct", status: "Open" },
              { startDate: "26 Oct", endDate: "28 Oct", status: "Open" },
              { startDate: "27 Oct", endDate: "29 Oct", status: "Open" },
              { startDate: "28 Oct", endDate: "30 Oct", status: "Open" },
              { startDate: "29 Oct", endDate: "31 Oct", status: "Open" },
              { startDate: "30 Oct", endDate: "01 Nov", status: "Open" },
              { startDate: "31 Oct", endDate: "02 Nov", status: "Open" }
            ]
          },
          {
            month: "Nov",
            year: "2026",
            trips: [
              { startDate: "01 Nov", endDate: "03 Nov", status: "Open" },
              { startDate: "02 Nov", endDate: "04 Nov", status: "Open" },
              { startDate: "03 Nov", endDate: "05 Nov", status: "Open" },
              { startDate: "04 Nov", endDate: "06 Nov", status: "Open" },
              { startDate: "05 Nov", endDate: "07 Nov", status: "Open" },
              { startDate: "06 Nov", endDate: "08 Nov", status: "Open" },
              { startDate: "07 Nov", endDate: "09 Nov", status: "Open" },
              { startDate: "08 Nov", endDate: "10 Nov", status: "Open" },
              { startDate: "09 Nov", endDate: "11 Nov", status: "Open" },
              { startDate: "10 Nov", endDate: "12 Nov", status: "Open" },
              { startDate: "11 Nov", endDate: "13 Nov", status: "Open" },
              { startDate: "12 Nov", endDate: "14 Nov", status: "Open" },
              { startDate: "13 Nov", endDate: "15 Nov", status: "Open" },
              { startDate: "14 Nov", endDate: "16 Nov", status: "Open" },
              { startDate: "15 Nov", endDate: "17 Nov", status: "Open" },
              { startDate: "16 Nov", endDate: "18 Nov", status: "Open" },
              { startDate: "17 Nov", endDate: "19 Nov", status: "Open" },
              { startDate: "18 Nov", endDate: "20 Nov", status: "Open" },
              { startDate: "19 Nov", endDate: "21 Nov", status: "Open" },
              { startDate: "20 Nov", endDate: "22 Nov", status: "Open" },
              { startDate: "21 Nov", endDate: "23 Nov", status: "Open" },
              { startDate: "22 Nov", endDate: "24 Nov", status: "Open" },
              { startDate: "23 Nov", endDate: "25 Nov", status: "Open" },
              { startDate: "24 Nov", endDate: "26 Nov", status: "Open" },
              { startDate: "25 Nov", endDate: "27 Nov", status: "Open" },
              { startDate: "26 Nov", endDate: "28 Nov", status: "Open" },
              { startDate: "27 Nov", endDate: "29 Nov", status: "Open" },
              { startDate: "28 Nov", endDate: "30 Nov", status: "Open" },
              { startDate: "29 Nov", endDate: "01 Dec", status: "Open" },
              { startDate: "30 Nov", endDate: "02 Dec", status: "Open" }
            ]
          },
          {
            month: "Dec",
            year: "2026",
            trips: [
              { startDate: "01 Dec", endDate: "03 Dec", status: "Open" },
              { startDate: "02 Dec", endDate: "04 Dec", status: "Open" },
              { startDate: "03 Dec", endDate: "05 Dec", status: "Open" },
              { startDate: "04 Dec", endDate: "06 Dec", status: "Open" },
              { startDate: "05 Dec", endDate: "07 Dec", status: "Open" },
              { startDate: "06 Dec", endDate: "08 Dec", status: "Open" },
              { startDate: "07 Dec", endDate: "09 Dec", status: "Open" },
              { startDate: "08 Dec", endDate: "10 Dec", status: "Open" },
              { startDate: "09 Dec", endDate: "11 Dec", status: "Open" },
              { startDate: "10 Dec", endDate: "12 Dec", status: "Open" },
              { startDate: "11 Dec", endDate: "13 Dec", status: "Open" },
              { startDate: "12 Dec", endDate: "14 Dec", status: "Open" },
              { startDate: "13 Dec", endDate: "15 Dec", status: "Open" },
              { startDate: "14 Dec", endDate: "16 Dec", status: "Open" },
              { startDate: "15 Dec", endDate: "17 Dec", status: "Open" },
              { startDate: "16 Dec", endDate: "18 Dec", status: "Open" },
              { startDate: "17 Dec", endDate: "19 Dec", status: "Open" },
              { startDate: "18 Dec", endDate: "20 Dec", status: "Open" },
              { startDate: "19 Dec", endDate: "21 Dec", status: "Open" },
              { startDate: "20 Dec", endDate: "22 Dec", status: "Open" },
              { startDate: "21 Dec", endDate: "23 Dec", status: "Open" },
              { startDate: "22 Dec", endDate: "24 Dec", status: "Open" },
              { startDate: "23 Dec", endDate: "25 Dec", status: "Open" },
              { startDate: "24 Dec", endDate: "26 Dec", status: "Open" },
              { startDate: "25 Dec", endDate: "27 Dec", status: "Open" },
              { startDate: "26 Dec", endDate: "28 Dec", status: "Open" },
              { startDate: "27 Dec", endDate: "29 Dec", status: "Open" },
              { startDate: "28 Dec", endDate: "30 Dec", status: "Open" },
              { startDate: "29 Dec", endDate: "31 Dec", status: "Open" },
              { startDate: "30 Dec", endDate: "01 Jan", status: "Open" },
              { startDate: "31 Dec", endDate: "02 Jan", status: "Open" }
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
              { startDate: "01 Jan", endDate: "03 Jan", status: "Open" },
              { startDate: "02 Jan", endDate: "04 Jan", status: "Open" },
              { startDate: "03 Jan", endDate: "05 Jan", status: "Open" },
              { startDate: "04 Jan", endDate: "06 Jan", status: "Open" },
              { startDate: "05 Jan", endDate: "07 Jan", status: "Open" },
              { startDate: "06 Jan", endDate: "08 Jan", status: "Open" },
              { startDate: "07 Jan", endDate: "09 Jan", status: "Open" },
              { startDate: "08 Jan", endDate: "10 Jan", status: "Open" },
              { startDate: "09 Jan", endDate: "11 Jan", status: "Open" },
              { startDate: "10 Jan", endDate: "12 Jan", status: "Open" },
              { startDate: "11 Jan", endDate: "13 Jan", status: "Open" },
              { startDate: "12 Jan", endDate: "14 Jan", status: "Open" },
              { startDate: "13 Jan", endDate: "15 Jan", status: "Open" },
              { startDate: "14 Jan", endDate: "16 Jan", status: "Open" },
              { startDate: "15 Jan", endDate: "17 Jan", status: "Open" },
              { startDate: "16 Jan", endDate: "18 Jan", status: "Open" },
              { startDate: "17 Jan", endDate: "19 Jan", status: "Open" },
              { startDate: "18 Jan", endDate: "20 Jan", status: "Open" },
              { startDate: "19 Jan", endDate: "21 Jan", status: "Open" },
              { startDate: "20 Jan", endDate: "22 Jan", status: "Open" },
              { startDate: "21 Jan", endDate: "23 Jan", status: "Open" },
              { startDate: "22 Jan", endDate: "24 Jan", status: "Open" },
              { startDate: "23 Jan", endDate: "25 Jan", status: "Open" },
              { startDate: "24 Jan", endDate: "26 Jan", status: "Open" },
              { startDate: "25 Jan", endDate: "27 Jan", status: "Open" },
              { startDate: "26 Jan", endDate: "28 Jan", status: "Open" },
              { startDate: "27 Jan", endDate: "29 Jan", status: "Open" },
              { startDate: "28 Jan", endDate: "30 Jan", status: "Open" },
              { startDate: "29 Jan", endDate: "31 Jan", status: "Open" },
              { startDate: "30 Jan", endDate: "01 Feb", status: "Open" },
              { startDate: "31 Jan", endDate: "02 Feb", status: "Open" }
            ]
          },
          {
            month: "Feb",
            year: "2027",
            trips: [
              { startDate: "01 Feb", endDate: "03 Feb", status: "Open" },
              { startDate: "02 Feb", endDate: "04 Feb", status: "Open" },
              { startDate: "03 Feb", endDate: "05 Feb", status: "Open" },
              { startDate: "04 Feb", endDate: "06 Feb", status: "Open" },
              { startDate: "05 Feb", endDate: "07 Feb", status: "Open" },
              { startDate: "06 Feb", endDate: "08 Feb", status: "Open" },
              { startDate: "07 Feb", endDate: "09 Feb", status: "Open" },
              { startDate: "08 Feb", endDate: "10 Feb", status: "Open" },
              { startDate: "09 Feb", endDate: "11 Feb", status: "Open" },
              { startDate: "10 Feb", endDate: "12 Feb", status: "Open" },
              { startDate: "11 Feb", endDate: "13 Feb", status: "Open" },
              { startDate: "12 Feb", endDate: "14 Feb", status: "Open" },
              { startDate: "13 Feb", endDate: "15 Feb", status: "Open" },
              { startDate: "14 Feb", endDate: "16 Feb", status: "Open" },
              { startDate: "15 Feb", endDate: "17 Feb", status: "Open" },
              { startDate: "16 Feb", endDate: "18 Feb", status: "Open" },
              { startDate: "17 Feb", endDate: "19 Feb", status: "Open" },
              { startDate: "18 Feb", endDate: "20 Feb", status: "Open" },
              { startDate: "19 Feb", endDate: "21 Feb", status: "Open" },
              { startDate: "20 Feb", endDate: "22 Feb", status: "Open" },
              { startDate: "21 Feb", endDate: "23 Feb", status: "Open" },
              { startDate: "22 Feb", endDate: "24 Feb", status: "Open" },
              { startDate: "23 Feb", endDate: "25 Feb", status: "Open" },
              { startDate: "24 Feb", endDate: "26 Feb", status: "Open" },
              { startDate: "25 Feb", endDate: "27 Feb", status: "Open" },
              { startDate: "26 Feb", endDate: "28 Feb", status: "Open" },
              { startDate: "27 Feb", endDate: "01 Mar", status: "Open" },
              { startDate: "28 Feb", endDate: "02 Mar", status: "Open" }
            ]
          },
          {
            month: "Mar",
            year: "2027",
            trips: [
              { startDate: "01 Mar", endDate: "03 Mar", status: "Open" },
              { startDate: "02 Mar", endDate: "04 Mar", status: "Open" },
              { startDate: "03 Mar", endDate: "05 Mar", status: "Open" },
              { startDate: "04 Mar", endDate: "06 Mar", status: "Open" },
              { startDate: "05 Mar", endDate: "07 Mar", status: "Open" },
              { startDate: "06 Mar", endDate: "08 Mar", status: "Open" },
              { startDate: "07 Mar", endDate: "09 Mar", status: "Open" },
              { startDate: "08 Mar", endDate: "10 Mar", status: "Open" },
              { startDate: "09 Mar", endDate: "11 Mar", status: "Open" },
              { startDate: "10 Mar", endDate: "12 Mar", status: "Open" },
              { startDate: "11 Mar", endDate: "13 Mar", status: "Open" },
              { startDate: "12 Mar", endDate: "14 Mar", status: "Open" },
              { startDate: "13 Mar", endDate: "15 Mar", status: "Open" },
              { startDate: "14 Mar", endDate: "16 Mar", status: "Open" },
              { startDate: "15 Mar", endDate: "17 Mar", status: "Open" },
              { startDate: "16 Mar", endDate: "18 Mar", status: "Open" },
              { startDate: "17 Mar", endDate: "19 Mar", status: "Open" },
              { startDate: "18 Mar", endDate: "20 Mar", status: "Open" },
              { startDate: "19 Mar", endDate: "21 Mar", status: "Open" },
              { startDate: "20 Mar", endDate: "22 Mar", status: "Open" },
              { startDate: "21 Mar", endDate: "23 Mar", status: "Open" },
              { startDate: "22 Mar", endDate: "24 Mar", status: "Open" },
              { startDate: "23 Mar", endDate: "25 Mar", status: "Open" },
              { startDate: "24 Mar", endDate: "26 Mar", status: "Open" },
              { startDate: "25 Mar", endDate: "27 Mar", status: "Open" },
              { startDate: "26 Mar", endDate: "28 Mar", status: "Open" },
              { startDate: "27 Mar", endDate: "29 Mar", status: "Open" },
              { startDate: "28 Mar", endDate: "30 Mar", status: "Open" },
              { startDate: "29 Mar", endDate: "31 Mar", status: "Open" },
              { startDate: "30 Mar", endDate: "01 Apr", status: "Open" },
              { startDate: "31 Mar", endDate: "02 Apr", status: "Open" }
            ]
          },
          {
            month: "Apr",
            year: "2027",
            trips: [
              { startDate: "01 Apr", endDate: "03 Apr", status: "Open" },
              { startDate: "02 Apr", endDate: "04 Apr", status: "Open" },
              { startDate: "03 Apr", endDate: "05 Apr", status: "Open" },
              { startDate: "04 Apr", endDate: "06 Apr", status: "Open" },
              { startDate: "05 Apr", endDate: "07 Apr", status: "Open" },
              { startDate: "06 Apr", endDate: "08 Apr", status: "Open" },
              { startDate: "07 Apr", endDate: "09 Apr", status: "Open" },
              { startDate: "08 Apr", endDate: "10 Apr", status: "Open" },
              { startDate: "09 Apr", endDate: "11 Apr", status: "Open" },
              { startDate: "10 Apr", endDate: "12 Apr", status: "Open" },
              { startDate: "11 Apr", endDate: "13 Apr", status: "Open" },
              { startDate: "12 Apr", endDate: "14 Apr", status: "Open" },
              { startDate: "13 Apr", endDate: "15 Apr", status: "Open" },
              { startDate: "14 Apr", endDate: "16 Apr", status: "Open" },
              { startDate: "15 Apr", endDate: "17 Apr", status: "Open" },
              { startDate: "16 Apr", endDate: "18 Apr", status: "Open" },
              { startDate: "17 Apr", endDate: "19 Apr", status: "Open" },
              { startDate: "18 Apr", endDate: "20 Apr", status: "Open" },
              { startDate: "19 Apr", endDate: "21 Apr", status: "Open" },
              { startDate: "20 Apr", endDate: "22 Apr", status: "Open" },
              { startDate: "21 Apr", endDate: "23 Apr", status: "Open" },
              { startDate: "22 Apr", endDate: "24 Apr", status: "Open" },
              { startDate: "23 Apr", endDate: "25 Apr", status: "Open" },
              { startDate: "24 Apr", endDate: "26 Apr", status: "Open" },
              { startDate: "25 Apr", endDate: "27 Apr", status: "Open" },
              { startDate: "26 Apr", endDate: "28 Apr", status: "Open" },
              { startDate: "27 Apr", endDate: "29 Apr", status: "Open" },
              { startDate: "28 Apr", endDate: "30 Apr", status: "Open" },
              { startDate: "29 Apr", endDate: "01 May", status: "Open" },
              { startDate: "30 Apr", endDate: "02 May", status: "Open" }
            ]
          },
          {
            month: "May",
            year: "2027",
            trips: [
              { startDate: "01 May", endDate: "03 May", status: "Open" },
              { startDate: "02 May", endDate: "04 May", status: "Open" },
              { startDate: "03 May", endDate: "05 May", status: "Open" },
              { startDate: "04 May", endDate: "06 May", status: "Open" },
              { startDate: "05 May", endDate: "07 May", status: "Open" },
              { startDate: "06 May", endDate: "08 May", status: "Open" },
              { startDate: "07 May", endDate: "09 May", status: "Open" },
              { startDate: "08 May", endDate: "10 May", status: "Open" },
              { startDate: "09 May", endDate: "11 May", status: "Open" },
              { startDate: "10 May", endDate: "12 May", status: "Open" },
              { startDate: "11 May", endDate: "13 May", status: "Open" },
              { startDate: "12 May", endDate: "14 May", status: "Open" },
              { startDate: "13 May", endDate: "15 May", status: "Open" },
              { startDate: "14 May", endDate: "16 May", status: "Open" },
              { startDate: "15 May", endDate: "17 May", status: "Open" },
              { startDate: "16 May", endDate: "18 May", status: "Open" },
              { startDate: "17 May", endDate: "19 May", status: "Open" },
              { startDate: "18 May", endDate: "20 May", status: "Open" },
              { startDate: "19 May", endDate: "21 May", status: "Open" },
              { startDate: "20 May", endDate: "22 May", status: "Open" },
              { startDate: "21 May", endDate: "23 May", status: "Open" },
              { startDate: "22 May", endDate: "24 May", status: "Open" },
              { startDate: "23 May", endDate: "25 May", status: "Open" },
              { startDate: "24 May", endDate: "26 May", status: "Open" },
              { startDate: "25 May", endDate: "27 May", status: "Open" },
              { startDate: "26 May", endDate: "28 May", status: "Open" },
              { startDate: "27 May", endDate: "29 May", status: "Open" },
              { startDate: "28 May", endDate: "30 May", status: "Open" },
              { startDate: "29 May", endDate: "31 May", status: "Open" },
              { startDate: "30 May", endDate: "01 Jun", status: "Open" },
              { startDate: "31 May", endDate: "02 Jun", status: "Open" }
            ]
          },
          {
            month: "Jun",
            year: "2027",
            trips: [
              { startDate: "01 Jun", endDate: "03 Jun", status: "Open" },
              { startDate: "02 Jun", endDate: "04 Jun", status: "Open" },
              { startDate: "03 Jun", endDate: "05 Jun", status: "Open" },
              { startDate: "04 Jun", endDate: "06 Jun", status: "Open" },
              { startDate: "05 Jun", endDate: "07 Jun", status: "Open" },

  TREKS[nagtibbaIndex].article = {
    title: "Nag Tibba Trek: A Short Journey to the Heart of the Himalayas",
    standfirst:
      "Forest trails above Pantwari, a night under the Himalayan sky and a 9,915 ft summit in the morning — two days in the Garhwal, told the way they are felt.",
    readMinutes: 7,
    sections: [
      {
        paragraphs: [
          "There are journeys that take you far away from home, and then there are journeys that bring you closer to yourself.",
          "The Nag Tibba Trek is one such journey.",
          "Hidden in the beautiful mountains of Uttarakhand, Nag Tibba is a perfect escape for anyone who wants to leave behind the noise of everyday life and spend a little time walking through forests, watching the mountains and breathing in the silence of the Himalayas.",
          "At an altitude of approximately 9,915 ft, Nag Tibba offers the experience of reaching a Himalayan summit without requiring a long expedition. This makes it one of the best choices for beginners, first-time trekkers, weekend adventurers and anyone looking for a quick mountain escape."
        ]
      },
      {
        heading: "Where the Journey Begins",
        paragraphs: [
          "The adventure begins at Pantwari Village, a peaceful mountain village surrounded by the Garhwal Himalayas.",
          "As you leave the road behind and start walking, something slowly changes.",
          "The sound of vehicles disappears.",
          "The air becomes cooler.",
          "The forest becomes quieter.",
          "And with every step, the mountains seem to come a little closer.",
          "The trail takes you through beautiful forests and open mountain sections, where the simple beauty of Uttarakhand reminds you that sometimes you don’t need much to feel happy.",
          "Just a trail.",
          "A backpack.",
          "And mountains in front of you."
        ]
      },
      {
        heading: "Walking Through the Himalayan Forests",
        paragraphs: [
          "The trail towards Nag Tibba passes through beautiful forest landscapes, including oak and rhododendron-covered sections.",
          "The sunlight filtering through the trees, the sound of leaves beneath your feet and the occasional glimpse of distant mountains make the journey as memorable as the destination itself.",
          "Nag Tibba isn’t about rushing.",
          "It is about walking slowly enough to notice the mountains.",
          "Along the way, you’ll meet fellow trekkers, local villagers and perhaps even discover a quieter version of yourself."
        ]
      },
      {
        heading: "The Magic of Nag Tibba Campsite",
        paragraphs: [
          "After hours of walking, reaching the campsite feels special.",
          "Your tired legs suddenly don’t matter as much.",
          "The backpack comes off, tea tastes better than ever, and the mountains become your evening view.",
          "As the sun begins to disappear behind the mountains, the sky changes colours and the temperature drops.",
          "Later, when darkness covers the valleys, look up.",
          "Far away from city lights, the Himalayan night sky can feel endless.",
          "Sitting around the campsite with a warm cup of tea, sharing stories with fellow trekkers and looking at the stars — these are the moments that stay with you long after the trek is over."
        ]
      },
      {
        heading: "The Summit Morning",
        paragraphs: [
          "The most beautiful part of the Nag Tibba Trek begins early in the morning.",
          "With your headlamp on and the sky still dark, you start walking towards the summit.",
          "The trail becomes quieter.",
          "Your breathing becomes heavier.",
          "But every step takes you closer to the top.",
          "And then, finally, you reach Nag Tibba Summit at approximately 9,915 ft.",
          "For a moment, you forget how tired you are.",
          "You simply stand there.",
          "In front of you are the vast Himalayan landscapes, and behind you is the trail that brought you here.",
          "You realise that the summit isn’t just a point on a map.",
          "It is every step you took to reach it."
        ]
      },
      {
        heading: "More Than Just a Trek",
        paragraphs: [
          "Nag Tibba may be a short trek, but the memories it creates can last much longer.",
          "For some, it is their first Himalayan summit.",
          "For others, it is a much-needed break from work, phones and city life.",
          "For friends, it becomes a story they will tell for years.",
          "And for many first-time trekkers, Nag Tibba becomes the beginning of a much bigger love for the mountains.",
          "Because once you’ve experienced the feeling of standing above the clouds, listening to the silence of the mountains and watching the sunrise from a Himalayan summit, you start wanting to come back."
        ]
      },
      {
        heading: "Why Choose Nag Tibba Trek?",
        paragraphs: [
          "🏔️ Beginner-friendly Himalayan summit experience",
          "🌲 Beautiful forest trails and mountain landscapes",
          "🌅 Stunning sunrise and sunset opportunities",
          "❄️ Possibility of snow during winter",
          "🏕️ Memorable overnight camping experience",
          "📍 Easily accessible from Dehradun and Mussoorie",
          "🎒 Perfect for a short weekend adventure",
          "❤️ Ideal for first-time Himalayan trekkers"
        ]
      },
      {
        heading: "When Should You Do the Nag Tibba Trek?",
        paragraphs: [
          "Nag Tibba can be explored in different seasons, and each season brings its own character.",
          "Winter can transform the trail into a beautiful snow-covered landscape.",
          "Spring brings pleasant weather and fresh mountain greenery.",
          "Summer offers comfortable trekking conditions and clear mountain landscapes.",
          "The monsoon season can bring rain, slippery trails and unpredictable road conditions, so weather and local conditions should always be checked before departure."
        ]
      },
      {
        heading: "Your Mountain Story Starts Here",
        paragraphs: [
          "You don’t always need a week-long holiday to feel alive again.",
          "Sometimes, two days in the mountains are enough.",
          "Enough to wake up early.",
          "Enough to walk until your legs are tired.",
          "Enough to sit quietly and watch the clouds move across the valleys.",
          "Enough to remember that life is not only about deadlines, meetings and busy streets.",
          "Sometimes, life is also about standing on a mountain and saying:",
          "“I made it.”",
          "The Nag Tibba Trek is more than a weekend trip.",
          "It is a small escape, a Himalayan adventure and perhaps the beginning of your lifelong love affair with the mountains.",
          "Pack your backpack. Leave the noise behind. The mountains are waiting.",
          "Let Trip My Soul take care of the journey while you focus on what truly matters — the trail, the mountains and the memories you create along the way."
        ]
      }
    ],
    signoff: "Trek Nag Tibba with Trip My Soul."
  };

  /**
   * As published in the guide. The distance answer gives 15–16 km against the
   * 14–16 km on the fact strip, which is what the day-by-day figures above add
   * up to; both are kept as published rather than quietly reconciled, since the
   * guide itself qualifies the figure by campsite and route.
   */
  TREKS[nagtibbaIndex].faqs = [
    {
      title: "Where is Nag Tibba Trek located?",
      description: "Nag Tibba Trek is located in the Tehri Garhwal region of Uttarakhand. The trek starts from Pantwari Village."
    },
    {
      title: "What is the altitude of Nag Tibba?",
      description: "The Nag Tibba Summit is approximately 9,915 ft (3,022 m) above sea level."
    },
    {
      title: "How difficult is the Nag Tibba Trek?",
      description: "Nag Tibba is generally considered an easy to moderate trek and is suitable for beginners with basic fitness."
    },
    {
      title: "How long is the Nag Tibba Trek?",
      description: "The complete trek is approximately 15–16 km, depending on the campsite and route followed."
    },
    {
      title: "How many days are required for Nag Tibba Trek?",
      description: "The standard Nag Tibba Trek can be completed in 2 days and 1 night, making it ideal for a weekend getaway."
    },
    {
      title: "What is the best time to do the Nag Tibba Trek?",
      description: "October to June is generally a good period. Winter is especially popular among trekkers looking for a snow experience. Monsoon conditions can make the trail slippery and roads unpredictable."
    },
    {
      title: "Is Nag Tibba suitable for beginners?",
      description: "Yes. Nag Tibba is one of the better options for first-time trekkers because of its relatively short duration and moderate altitude."
    },
    {
      title: "Is there snow on the Nag Tibba Trek?",
      description: "Snowfall is possible during winter, particularly around December to February, but the amount varies every year depending on weather conditions."
    },
    {
      title: "How do I reach the Nag Tibba Trek starting point?",
      description: "The trek starts from Pantwari Village. You can first reach Dehradun by road, train or flight and then travel by road to Pantwari."
    },
    {
      title: "What should I carry for the Nag Tibba Trek?",
      description: "Essential items include good trekking shoes, warm layers, rain protection, a backpack, water bottle, personal medicines, sunglasses, sunscreen, headlamp and basic toiletries."
    }
  ];
              { startDate: "06 Jun", endDate: "08 Jun", status: "Open" },
