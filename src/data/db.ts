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
    "name": "Kuari Pass with Pangarchulla Peak",
    "tagline": "Six days from Rishikesh on the Lord Curzon Trail, crossing Kuari Pass (12,516 ft) and summiting Pangarchulla Peak (15,069 ft) for a 180° view of 108 Himalayan peaks.",
    "price": 11000,
    "days": 6,
    "nights": 5,
    "region": "Uttarakhand",
    "category": "Trending Treks",
    "startLocation": "Rishikesh to Rishikesh",
    "endLocation": "Rishikesh",
    "difficulty": "Moderate-Difficult",
    "maxAltitude": "15,069 ft / 4,590 m",
    "totalDistance": "Approx. 510 km by Road + 33 km Trek",
    "availability": "December – March (Full Snow) & April – June / September – October (Clear Views)",
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
      "Pass Crossing",
      "Peak Summit"
    ]
  },
  {
    "slug": "bali-pass-trek",
    "name": "Bali Pass Trek",
    "tagline": "Eight days from Dehradun crossing the 16,207 ft Bali Pass, linking Har Ki Dun Valley to Yamunotri over snow, ridge and glacial lake.",
    "price": 21999,
    "days": 8,
    "nights": 7,
    "region": "Uttarakhand",
    "category": "Trending Treks",
    "startLocation": "Dehradun to Dehradun",
    "endLocation": "Dehradun",
    "difficulty": "Difficult",
    "maxAltitude": "16,207 ft / 4,950 m",
    "totalDistance": "60 Kilometers",
    "availability": "May – June & September – October",
    "months": [
      "May",
      "Jun",
      "Sep",
      "Oct"
    ],
    "themes": [
      "Snow",
      "Meadow",
      "Forest",
      "Pass Crossing"
    ],
    intro:
      "The Bali Pass Trek is a challenging and exciting trekking adventure in the Garhwal region of the Indian Himalayas. It is a high altitude trek that takes you through some of the most scenic and breathtaking landscapes with snow-capped peaks, lush forests, and glacial lakes.",
    idealFor: "Experienced trekkers who have already completed at least one Himalayan trek above 4,000 m",
    highlights: [
      "Links Har Ki Dun Valley and Yamunotri Valley over a single high-altitude crossing",
      "Crosses Bali Pass at 16,207 ft (4,950 m) with 360° views of Swargarohini and Kalanag",
      "Camps beside the sacred glacial lake at Ruinsara Tal",
      "Walks through the untouched alpine meadows of Devsu Thach",
      "Ends with a dip in the Yamunotri hot springs and darshan at the shrine",
    ],
    aboutParagraphs: [
      "This trek is not for the faint-hearted, as it requires good physical fitness, endurance and a strong sense of adventure. Yamunotri and Har Ki Dun Valley is linked by Bali Pass Trek. It's rare to find a trek that offers you the opportunity to experience the pure grandeur of crossing a Himalayan Pass.",
      "It crosses the watershed between Tons and Ruinsara river, and enjoys the unspoilt alpine meadows at Devsu Thach. Soon, the greenery will open up to the snowfields of Bali Pass.",
      "The Pass, at 16,207 feet, offers 360° panoramic views of the Swargarohini and Kalanag peaks. This trek is not for beginners and its highest point at a staggering 5,000 mtr elevation, is located in the Garhwal region. This stunning high altitude pass offers breathtaking views of Himalayan peaks like Swargarohini, Kala Nag and Bandarpoonch.",
      "You will be able to relive your childhood memories with Bali Pass Trek's adventures and beautiful views. The trek begins at Sankri and ends at Jankichatti. This trek requires some trekking experience.",
      "Bali Pass Trek is the most thrilling and adventurous crossover trek of Uttarakhand and the perfect combination of two sacred valleys in one journey. Located in Uttarkashi district of Garhwal Himalayas inside Govind Wildlife Sanctuary, the trek consists of crossing a high altitude pass at 16,207 ft, situated at an average altitude of approximately 11,500 to 16,200 ft, amidst snow-capped peaks, dense pine forests, untouched alpine meadows and glacial lakes.",
      "The trek starts from Dehradun and covers a distance of approx. 480 km by road and 60 km by trek. The route passes through Sankri, Taluka, Seema, Ruinsara Tal and Devsu Thach, known as one of the most untouched meadows of Himalayas, offering views of Tons Valley, Ruinsara Valley, Swargarohini, Kala Nag and Bandarpoonch peaks. The two valleys represent two different worlds - Har Ki Dun as the Valley of Gods where Pandavas went to heaven and Yamunotri Valley as the source of Yamuna river, along with Ruinsara Tal glacial lake where the beauty reflects like a mirror.",
      "What makes Bali Pass special is its unique combination of one green easy valley walk and one steep snow pass crossing in just 8 days. It remains open from May to June and September to October and is closed during monsoon and winter due to heavy snowfall and high risk of avalanches, when the entire pass is covered under 10-15 feet snow. Whether you are a group of friends seeking real adventure beyond Kedarkantha, experienced trekkers looking for a true Himalayan pass crossing, or nature lovers who want to experience untouched meadows, glacial lakes and 360° Himalayan view from 16,200 ft, Bali Pass Trek offers a powerful experience of valley crossing, lake camping and standing on top of a 5000 meter pass.",
    ],
    fitnessRequirement:
      "This is not a beginner trek — you should be able to run/jog 5 Km in 35-40 minutes, do 30-40 squats and 20 lunges at a stretch, and walk with a 7-8 Kg backpack for 6-7 hours on a steep ascent/descent. Daily trek distance is 7-12 Km with 700-800 M altitude gain, and treadmill fitness is not counted.",
    eligibilityCriteria: [
      { icon: "User", text: "Age 16 to 55 years — 16-18 year olds need a parent/guardian consent form" },
      { icon: "Mountain", text: "Bali Pass cannot be your first trek — requires at least one completed trek above 4,000 m, such as Kedarkantha, Brahmatal, Hampta Pass or Har Ki Dun" },
      { icon: "Stethoscope", text: "Not open to trekkers with asthma, heart problems, high blood pressure, epilepsy, recent surgery in the last 12 months, or a BMI over 30" },
      { icon: "FileText", text: "Mandatory medical fitness certificate (within 15 days of the trek), ID proof and a self-declaration form" },
    ],
    fitnessCriteria: [
      { icon: "Footprints", text: "Run/jog 5 Km in 35-40 minutes continuously" },
      { icon: "Activity", text: "30-40 squats plus 20 lunges at a stretch" },
      { icon: "Backpack", text: "Walk with a 7-8 Kg backpack for 6-7 hours on steep ascent/descent" },
      { icon: "TrendingUp", text: "Daily trek distance of 7-12 Km with 700-800 M altitude gain" },
    ],
    itinerary: [
      {
        day: 1,
        title: "Dehradun to Sankri (1,920 m) — Pickup Day",
        description:
          "Pickup: Dehradun Railway Station at 6:30 AM. Drive 195 Km (8-9 Hrs) via Mussoorie, Purola to Sankri. Overnight Guest House.",
        detailedDescription:
          "Pickup from Dehradun at 6:30 AM. Drive to Sankri via Mussoorie, Purola, Mori, Netwar. The drive is along Tons river with pine forests and apple orchards. Reach Sankri (1,920 m) by evening. Sankri is the last village and base camp of all Govind Wildlife Sanctuary treks. Evening briefing by Trek Leader, gear check and introduction. Overnight stay in Guest House / Homestay. Dinner included.",
        pickupPoint: "Dehradun Railway Station / ISBT",
        pickupTime: "6:30 AM",
        driveDistance: "195 Km",
        drivingTime: "8-9 Hrs",
        stayType: "Guest House / Homestay",
        meals: "Dinner",
      },
      {
        day: 2,
        title: "Sankri to Seema (2,560 m) via Taluka (2,107 m)",
        description: "Drive 12 Km to Taluka + Trek 12 Km (6-7 Hrs) to Seema Camp along Supin River.",
        detailedDescription:
          "Early morning drive from Sankri to Taluka - last road head. Taluka is the starting point of our trek. After breakfast at Taluka, we start trekking with packed lunch for Seema Camp (2,560 m) through thick forests of chestnuts, walnuts, willows and conifer trees. Trail passes through Dhatmir & Gangaar villages. Reach Seema by late afternoon. Overnight stay in tents.",
        driveDistance: "12 Km",
        drivingTime: "1 Hour",
        trekDistance: "12 Km",
        trekDuration: "6-7 Hrs",
        stayType: "Camp",
        meals: "Breakfast, Lunch, Dinner",
      },
      {
        day: 3,
        title: "Seema (2,560 m) to Rainbasera (3,086 m)",
        description: "Trek 9 Km (4-5 Hrs) via Debshu Bugyal with view of Kala Nag. Camp by river.",
        detailedDescription:
          "Today also, the trek is along the Supin river. First mile is Debshu Bugyal, from where we will get a magnificent view of Kala Nag or Black Peak. After crossing Debshu Bugyal we will descend through the forest with loose stones and sandy path to the river. Cross the Supin river through a bridge and again ascend with river on our right. Trek along the river until we reach our campsite by the side of the river. Overnight stay in camps.",
        trekDistance: "9 Km",
        trekDuration: "4-5 Hrs",
        stayType: "Camp",
        meals: "Breakfast, Lunch, Dinner",
      },
      {
        day: 4,
        title: "Rainbasera (3,086 m) to Ruinsara Tal (3,565 m)",
        description: "Trek 7.5 Km (4-5 Hrs) to the sacred glacial lake Ruinsara Tal. View of Bandarpoonch.",
        detailedDescription:
          "Last day when we walk along the Supin river. Today we will reach Ruinsara Tal by afternoon. Ruinsara is a lovely glacial lake surrounded by meadows and rhododendrons. The campsite is beautiful and we will have a chance to stay in wooden huts instead of tents. On one side is Ruinsara Lake and on the other side is Supin River. Views of Banderpooch Peak (6,387 m), Dhumdhar Kandi (5,873 m), Kala Nag and White Peak are spectacular. Overnight stay in camps.",
        trekDistance: "7.5 Km",
        trekDuration: "4-5 Hrs",
        stayType: "Camp / Wooden Huts",
        meals: "Breakfast, Lunch, Dinner",
      },
      {
        day: 5,
        title: "Ruinsara Tal (3,565 m) to Odari (4,008 m)",
        description: "Trek 4 Km (3 Hrs) via dense forest to Odari Rock Cave. Technical session.",
        detailedDescription:
          "Short and easy trek. Initially we will go down to Supin river through dense vegetation. Crossing the river through a bridge, we will then ascend to a small meadow and head south east along the river. Trail meanders towards south west to our campsite Odari. Odari means a naturally made rock cave. It is believed that Bali (Hanuman's brother) stayed in this cave for one night. Views of Swargarohini 1 & 2 from campsite. Afternoon technical session - how to use rope, ice axe and crampons for Bali Pass. Overnight stay in camps.",
        trekDistance: "4 Km",
        trekDuration: "3 Hrs",
        stayType: "Camp",
        meals: "Breakfast, Lunch, Dinner",
        highlights: ["Technical session on rope, ice axe & crampons for the pass crossing"],
      },
      {
        day: 6,
        title: "Odari (4,008 m) to Base Camp (4,678 m)",
        description: "Trek 3.25 Km (3 Hrs) - Short but steep 60-degree ridge, loose stones. Subzero camp.",
        detailedDescription:
          "Short hike south west to the base camp but not easy. We will walk on a mountain ridge with a 60 degree incline full of loose stones. This day is critical as we will be camping at 4,678 m. Keep yourself active & hydrated to avoid AMS. Temperature will drop to subzero levels. Acclimatisation takes longer at such height. Overnight stay in camps.",
        trekDistance: "3.25 Km",
        trekDuration: "3 Hrs",
        stayType: "Camp",
        meals: "Breakfast, Lunch, Dinner",
        highlights: ["Subzero camp at 4,678 m — the final camp before the pass"],
      },
      {
        day: 7,
        title: "Base Camp (4,678 m) to Lower Dhamni (3,415 m) via Bali Pass (4,950 m) — Summit Day",
        description:
          "Summit Day - Trek 10 Km (8-10 Hrs). Cross Bali Pass at 16,207 Ft, 360° view of Swargarohini & Bandarpoonch. Steep descend to Lower Dhamni.",
        detailedDescription:
          "Today we cross Bali Pass (4,950 m). Start early at 6 AM. Trail up to pass remains full of snow which will require using techniques learnt earlier. 2-3 hours to reach the pass from base camp. Once we reach the pass, enjoy 360 degree view of Swargarohini, Banderpooch, Garhwal ranges and Yamunotri valley. After pass, steep descend through vertical path full of stones. Toughest 6-inch narrow ridge walk to Upper Dhamni. Rest at Upper Dhamni and resume trek to Lower Dhamni. Stay with trek leader as route is confusing. Overnight stay in camps at Lower Dhamni.",
        trekDistance: "10 Km",
        trekDuration: "8-10 Hrs",
        stayType: "Camp",
        meals: "Breakfast, Lunch, Dinner",
        timeNote: { label: "Summit Start", value: "6:00 AM" },
        highlights: ["Crosses Bali Pass at 16,207 ft with 360° views of Swargarohini and Bandarpoonch"],
      },
      {
        day: 8,
        title: "Lower Dhamni (3,415 m) to Dehradun via Yamunotri — Drop Day",
        description:
          "Trek 9.5 Km (5-6 Hrs) to Jaan Ki Chatti via Yamunotri Temple & hot springs. Drive 175 Km (7-8 Hrs) to Dehradun. Drop at Dehradun by 9-10 PM. Trek Ends.",
        detailedDescription:
          "Last day of trek. Initial trail through forest then merges into cemented path to Yamunotri (4.5 Km ascent). Reach Yamunotri in 1.5 hours. Take a dip in Sulphur hot water springs - it will take away all body pain. Darshan at Yamunotri Shrine. Then descend 5 Km to Jaan Ki Chatti via pilgrim route. Board our waiting vehicle from Jaan Ki Chatti and drive to Dehradun via Barkot. Drop at Dehradun Railway Station / ISBT by 9-10 PM. Trek Ends.",
        trekDistance: "9.5 Km",
        trekDuration: "5-6 Hrs",
        driveDistance: "175 Km",
        drivingTime: "7-8 Hrs",
        stayType: "Trek Ends — Drop at Dehradun",
        meals: "Breakfast",
        timeNote: { label: "Drop", value: "9-10 PM at Dehradun" },
      },
    ],
    inclusions: [
      {
        title: "Accommodation & Meals",
        description: "Guest House or Home Stay accommodation plus all meals, starting Dinner on Day 1 till Breakfast on Day 8.",
      },
      {
        title: "Permits",
        description: "Forest permits, camping charges and trekking permits.",
      },
      {
        title: "Camping Equipment",
        description: "Tents on twin/triple sharing basis, sleeping bags, sleeping mats/mattresses.",
      },
      {
        title: "Technical Gear",
        description: "Micro-spikes, helmets, gaiters, crampons, ice axe and rope as required for the Bali Pass crossing.",
      },
      {
        title: "Trek Staff",
        description: "Experienced trek guide, cook and helpers, plus mules or porters for carrying common supplies & equipment.",
      },
      {
        title: "Trek Leader",
        description: "Mountaineering course certified Trek Leader with First Aid certification and special rescue course from NIM, Uttarkashi.",
      },
      {
        title: "Sankri Stay",
        description: "Guest House/Homestay in Sankri on Day 1 (and Day 8 if needed due to late arrival).",
      },
      {
        title: "Transportation",
        description: "Dehradun to Dehradun transport by Bolero/Ertiga/Tempo Traveller as per group size, with all toll, parking, driver charges and tax included.",
      },
    ],
    exclusions: [
      { title: "GST", description: "Mandatory GST of 5% on invoice amount." },
      { title: "Travel/Health Insurance", description: "We strongly recommend each traveller carry their own travel/health insurance." },
      { title: "Extra Meals & Beverages", description: "Any specific meals, snacks or beverages unless mentioned in the cost included section." },
      { title: "Airfare/Train Fare", description: "Any cost of airfare or train fare to and from Dehradun." },
      { title: "Medical Expenses", description: "Any kind of medical expenses incurred during the trek." },
      { title: "Personal Expenses", description: "Tips, laundry, phone calls, liquor, mineral water, camera fee or any other personal nature expenses." },
      { title: "Airport Transfers", description: "Airport pickup and drop services, available at additional cost." },
      { title: "Anything Not Mentioned", description: "Any other fee/charge not mentioned in the cost included section." },
      {
        title: "Backpack Offloading",
        description: "Offloading charges — the backpack should not weigh more than 9 Kg; suitcases, strollers and duffel bags are not allowed (subject to additional cost).",
      },
    ],
    faqs: [
      {
        title: "What is the difficulty level of Bali Pass Trek?",
        description: "Difficult / Expedition Grade. Bali Pass at 16,207 Ft (4,950 M) is not for beginners. You need 70-degree snow wall climbing, 6-inch narrow ridge walk, 8-10 hours summit day. Only for experienced trekkers.",
      },
      {
        title: "Can a beginner do Bali Pass Trek?",
        description: "No. This cannot be your first trek. You must have completed at least one 4,000 M+ trek like Kedarkantha, Brahmatal, Har Ki Dun, Hampta Pass etc. We will ask for proof.",
      },
      {
        title: "What is the best time for Bali Pass?",
        description: "May-June (full snow pass) and September-October (clear weather, less snow but more rocky). The most thrilling window is late May-June.",
      },
      {
        title: "What is the pickup and drop point?",
        description: "Pickup: Day 1 morning 6:30 AM from Dehradun Railway Station/ISBT. Drop: Day 8 night 9-10 PM at Dehradun Railway Station/ISBT. We provide Dehradun to Dehradun transport.",
      },
      {
        title: "How much do we have to trek daily?",
        description: "Average 7-10 Km daily, 5-7 hours walking. On summit day (Day 7) - 10 Km, 8-10 hours.",
      },
      {
        title: "What is the accommodation?",
        description: "Day 1 - Guest House/Homestay in Sankri (triple sharing). Day 2 to Day 7 - alpine tents on twin sharing plus sleeping bag and mattress. Wooden huts at Ruinsara Tal if available.",
      },
      {
        title: "What about food?",
        description: "Pure veg nutritious food from Day 1 dinner to Day 8 breakfast. Breakfast, pack lunch, evening snacks, dinner and tea. Our cook team goes with us.",
      },
      {
        title: "Is there network/electricity on the trek?",
        description: "No network after Purola (Day 1). No electricity after Sankri, and no charging points in tents — carry a power bank. Last ATM is at Purola, so carry cash.",
      },
      {
        title: "What about washroom/toilet facility?",
        description: "Guest houses have western toilets. On trek - dry toilet tents with a toilet seat are set up away from the campsite. No bath for 6 days; wet wipes recommended.",
      },
      {
        title: "What if I get AMS (Altitude Sickness)?",
        description: "Our NIM-certified trek leader carries a rescue course, oxygen cylinder and medical kit. If AMS symptoms are severe at Odari/Base Camp, you will be brought down to Sankri with staff. No summit push will be forced.",
      },
      {
        title: "What is included in technical gear?",
        description: "We provide micro-spikes, crampons, gaiters, helmet, ice axe and rope for summit day. You need to bring good trekking shoes with ankle support — most important.",
      },
      {
        title: "Can I offload my backpack?",
        description: "Yes, you can offload to a mule at ₹1,500-2,000 for the full trek (max 9 Kg). Suitcases/strollers are not allowed. You must carry a small daypack with water, jacket and lunch.",
      },
      {
        title: "What is the age limit?",
        description: "16 to 55 years. 16-18 year olds need a parent consent letter. BMI should be less than 30.",
      },
      {
        title: "Do you provide a certificate?",
        description: "Yes, a Bali Pass Trek Completion Certificate and badge.",
      },
      {
        title: "What happens if the trek gets cancelled due to weather/landslide?",
        description: "Bali Pass is weather dependent. If heavy snow/landslide blocks the pass, the trek leader will decide on an alternate route or an extra day. No refund, but we will try to complete the trek safely.",
      },
    ],
    howToReach: {
      intro: "Pickup and drop is Dehradun to Dehradun — no pickup from Haridwar or Rishikesh.",
      air: {
        summaryLabel: "Nearest Airport",
        summary: "Jolly Grant Airport, Dehradun (DED) — 25 Km",
        detail:
          "Daily flights connect Delhi, Mumbai and Bangalore. From the airport, take a taxi to Dehradun Railway Station (₹800-1,000, 1 hour). Arrive a day early (Day 0) if coming by flight.",
      },
      train: {
        summaryLabel: "Best Option",
        summary: "Dehradun Railway Station",
        detail:
          "Well connected by overnight trains — Nanda Devi Express, Dehradun Shatabdi and Mussoorie Express from Delhi, plus direct trains from Mumbai, Kolkata and Lucknow. From Haridwar (50 Km), a bus or train runs every 30 minutes to Dehradun.",
      },
      road: {
        summaryLabel: "By Bus / Overnight Volvo",
        summary: "Delhi ISBT Kashmiri Gate to Dehradun",
        detail:
          "Government and private Volvo/AC buses run hourly (6-7 Hrs); the last bus at 11 PM reaches Dehradun by 5 AM, in time for the same-morning pickup. Direct buses also run from Chandigarh, Manali and Shimla.",
        route: ["Dehradun", "Mussoorie", "Kempty Fall", "Purola", "Mori", "Netwar", "Sankri"],
        facts: [
          { label: "Distance", value: "195 Km" },
          { label: "Duration", value: "8-9 Hours" },
        ],
      },
      pickup: {
        point: "Dehradun Railway Station / Prince Chowk",
        time: "6:00 AM – 6:30 AM (Day 1)",
        dropPoint: "Dehradun Railway Station / ISBT",
        dropTime: "9:00 PM – 10:30 PM (Day 8)",
        note: "No pickup from Haridwar or Rishikesh — only Dehradun. Book onward travel after 11 PM on Day 8, or the next morning.",
      },
    },
    article: {
      title: "Bali Pass: The Last Door Between Two Valleys, Where Only The Mountain Lets You Pass",
      standfirst:
        "If Har Ki Dun is a dream, Ruinsara is the secret inside that dream. And Bali Pass is the door that guards that secret.",
      readMinutes: 6,
      sections: [
        {
          paragraphs: [
            "At 16,207 feet (4,950 M), standing on a knife-edge ridge where one side is Har Ki Dun Valley and the other side is Yamunotri Valley, you understand why trekkers call it the most thrilling pass crossing in India. It is not a trek. It is a test. Of your legs, your lungs, and your love for the Himalayas.",
            "Bali Pass is not where tourists go. There is no chai shop, no horse, no crowd chanting. There is only snow, loose stones, a 70-degree snow wall, and a 6-inch narrow ridge where one wrong step is the end. That is why only a few people reach there. And those who reach, never come back the same.",
            "The story says, Bali (brother of Lord Hanuman) stayed in a natural rock cave called Odari for one night on his way. That cave still exists at 13,150 feet. You will sleep just below it. And you will wonder, how did he cross this pass without shoes, without rope?",
          ],
        },
        {
          heading: "The Journey - One Valley To Another, One Life To Another",
          paragraphs: [
            "Bali Pass is not one day. It is eight days of slowly leaving the world behind.",
            "It starts from Sankri (1,920 M), the last village of Govind Wildlife Sanctuary. The same Sankri from where Har Ki Dun, Kedarkantha starts. But after Taluka, everyone goes left to Har Ki Dun. You go right, with Supin River on your side. Through villages like Gangaar and Dhatmir, where people still live on wood and apple farming, where children still say namaste to strangers.",
            "By Day 3 you reach Rainbasera (3,086 M), walking beside the Supin river. You cross Debshu Bugyal and for the first time you see Kala Nag (Black Peak) - 6,387 M, standing black and fearless.",
            "Day 4 is Ruinsara Tal (3,565 M). This is the soul of this trek. A glacial lake surrounded by meadows and rhododendrons, on one side Bandarpoonch peak, on the other side Dhumdhar Kandi. There is no temple here, but the lake is more sacred than a temple. Locals say, Gods come to drink water here. You will camp on the banks, in wooden huts, and at night you will hear the sound of the lake freezing.",
            "Day 5 is short - Ruinsara to Odari (4,008 M). 4 Km only. You descend to Supin river, cross it, and climb to a meadow where a giant rock stands - Odari cave. Here Bali stayed. From here you see Swargarohini I & II - the peaks that Pandavas used to go to heaven. Here your trek leader will teach you how to use ice axe, crampons and rope. Because tomorrow is not trekking, it is mountaineering.",
            "Day 6 - Odari to Base Camp (4,678 M). Only 3.25 Km but the hardest 3 Km of your life. A 60-degree incline full of loose stones. Every step you go up, you slip half a step. At 15,300 feet, your breath finishes. Oxygen is 40% less. Water freezes inside the bottle. This night you will not sleep. You will keep checking your tent zip, your shoes, your head torch. Because at 4 AM next day, you have to cross the pass.",
            "Day 7 - Summit Day - Base Camp to Lower Dhamni via Bali Pass (4,950 M). You start at 6 AM in dark, with head torch. First 2 hours on snow - white snow wall of 70 degrees. You have to kick your crampons hard, hold your ice axe. If you slip, rope will hold you. Slowly, slowly, you reach the top.",
            "And then everything stops.",
            "On Bali Pass, at 16,207 feet, you stand on a ridge that is just 1 foot wide. On your left is Ruinsara Valley, Har Ki Dun, Swargarohini. On your right is Yamunotri Valley, Bandarpoonch, Kala Nag. Behind you is the entire Garhwal Himalayas. In front of you is the sky. The wind is so strong you cannot stand without support. You have no words. You just sit.",
            "Then the toughest part begins - descending. Steep loose rocks, vertical descent. The famous 6-inch ridge walk to Upper Dhamni where you can keep only one foot at a time. 5 hours of descent to reach Lower Dhamni (3,415 M). Your knees will shake, but your heart will be full.",
            "Last day you trek to Yamunotri (3,293 M) - the first Dham of Char Dham. You take a dip in the hot sulphur spring that takes away all 7 days of body pain. You do darshan at Yamunotri shrine, then walk 5 Km down to Jaan Ki Chatti where your vehicle waits to take you back to Dehradun.",
          ],
        },
        {
          heading: "Why Bali Pass is Special?",
          paragraphs: [
            "Har Ki Dun can be done by anyone, Bali Pass can only be done by those whom the mountain allows.",
            "It is one of the few treks in India where you start from one valley and end in a completely different valley. You start from the culture of Govind Sanctuary and end at the faith of Yamunotri.",
            "It breaks your body on Day 6 and Day 7, but it makes your soul.",
          ],
        },
      ],
      signoff: "If Kedarkantha is introduction, and Har Ki Dun is story, then Bali Pass is the climax.",
    },
    similarTreks: ["har-ki-dun-trek", "pangarchulla-trek", "gaumukh-tapovan-trek", "roopkund-yatra", "rupin-pass-trek"],
  },
  {
    "slug": "phulara-ridge-trek",
    "name": "Phulara Ridge Trek",
    "tagline": "Six days from Dehradun through Govind Wildlife Sanctuary to a 3 Km walk along the 12,150 ft Phulara Ridge, ending at the meadow campsite of Pushtara.",
    "price": 9999,
    "days": 6,
    "nights": 5,
    "region": "Uttarakhand",
    "category": "Uttarakhand",
    "startLocation": "Dehradun to Dehradun",
    "endLocation": "Dehradun",
    "difficulty": "Easy to Moderate",
    "maxAltitude": "12,150 ft / 3,703 m",
    "totalDistance": "30 Kilometers",
    "availability": "December – June & September – November",
    "months": [
      "Dec",
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Sep",
      "Oct",
      "Nov"
    ],
    "themes": [
      "Snow",
      "Meadow",
      "Forest",
      "Pass Crossing"
    ],
    intro:
      "Phulara Ridge Trek is one of the most beautiful and unexplored ridge treks in Uttarakhand, located inside Govind Wildlife Sanctuary in Uttarkashi district. If Kedarkantha is famous for its summit, Phulara Ridge is famous for its ridge walk — nearly 3 Km on top of a narrow mountain edge with valleys thousands of feet deep on both sides and snow-capped Himalayan peaks in front.",
    idealFor: "Beginners who want a less crowded, more scenic alternative to Kedarkantha, and anyone who has already done Kedarkantha or Dayara Bugyal and wants a new trail from the same region",
    highlights: [
      "A rare 2-3 Km continuous ridge walk at 12,150 ft with 360° Himalayan views on both sides",
      "Same Sankri base as Kedarkantha, but a far less crowded trail after Sikolta",
      "Camps at Pustara (Pushtara) Bugyal — one of the most beautiful meadow campsites in India",
      "Views of Kedarkantha, Bandarpoonch, Swargarohini, Kalanag, Dhunda Top and Ranglana from the ridge top",
      "Walks through thick, dark pine, oak and rhododendron forest dotted with naturally fallen, moss-covered trees",
    ],
    aboutParagraphs: [
      "Phulara Ridge Trek is a hidden gem in the Uttarkashi district of Uttarakhand, inside Govind Wildlife Sanctuary. At a max altitude of 12,150 ft, it is considered the most beautiful ridge trek of India.",
      "While Kedarkantha gives you a summit, Phulara Ridge gives you a ridge walk. For almost 3 Km, you walk on a narrow mountain ridge with valleys thousands of feet deep on both sides and snow-capped Himalayas in front. This kind of ridge walk is not available on any other easy-moderate trek in Uttarakhand.",
      "Kedarkantha and Phulara Ridge both start from Sankri village and share the same base camp at Sikolta. But after Sikolta, the trails divide — Kedarkantha goes to the famous temple summit, which is very crowded in winter, while the Phulara Ridge trail heads towards Pustara Bugyal, a much wider, cleaner and less crowded meadow.",
      "Pustara is the highlight of the trek — a huge golden meadow where you camp under thousands of stars with Kedarkantha peak right behind you. From Phulara Ridge Top you see Kedarkantha (12,500 ft), Bandarpoonch, Swargarohini, Kalanag (Black Peak), Dhunda Top and Ranglana.",
      "The beauty of this trek is also its forest — thicker, darker and denser than Kedarkantha's, with Pine, Oak and Rhododendron trees. In many places you will see naturally fallen trees covered in moss, making for a very photogenic trail. In spring (March-April), the rhododendrons bloom red and pink.",
      "It is perfect for beginners who want an easy-moderate trek with less crowd, for people who have already done Kedarkantha and want a new trail from the same region, for photographers and nature lovers drawn to the ridge walk and Pustara meadow, and for families, friends and college groups looking for a safe, easy trek.",
    ],
    fitnessRequirement:
      "Beginner friendly — you should be able to walk 5-6 Km daily, jog 2 Km in 15-18 minutes without getting too tired, and climb 50 floors of stairs without high breathing difficulty. One month of daily exercise before the trek (walking, jogging, squats, stair climbing) is mandatory.",
    eligibilityCriteria: [
      { icon: "User", text: "Age 10 to 60 years — below 18 years with a parent/guardian, above 60 years need a medical fitness certificate and previous trek experience" },
      { icon: "Footprints", text: "Beginner friendly trek — no previous trekking experience needed; perfect for first-time trekkers, families, kids and couples" },
      { icon: "Stethoscope", text: "Not open to trekkers with severe heart disease, severe asthma, uncontrolled high blood pressure, epilepsy or severe knee injury; mild asthma/BP/diabetes must be declared in advance with medicine and a doctor's certificate" },
      { icon: "FileText", text: "Original ID proof (Aadhar Card/Passport) for the forest permit, a medical fitness self-declaration form and 2 passport-size photos" },
    ],
    fitnessCriteria: [
      { icon: "Footprints", text: "Walk 5-6 Km daily — the average daily trekking distance on this trek" },
      { icon: "Activity", text: "Jog/run 2 Km in 15-18 minutes without getting too tired" },
      { icon: "TrendingUp", text: "Climb 50 floors of stairs without high breathing difficulty" },
      { icon: "Dumbbell", text: "One month of daily exercise before the trek — walking, jogging, squats and stair climbing" },
    ],
    itinerary: [
      {
        day: 1,
        title: "Dehradun to Sankri (6,400 ft) — Pickup Day",
        description:
          "Pickup from Dehradun. Drive 200 Km (8-9 Hrs) via Mussoorie, Purola and Mori to Sankri. Overnight Hotel/Homestay.",
        detailedDescription:
          "Pickup from Dehradun and a scenic drive via Mussoorie, Purola, Tons River and Govind National Park. Sankri (6,400 ft) is a beautiful village inside the sanctuary and the base for many treks, including Kedarkantha. Evening briefing by the Trek Leader and gear check. Overnight stay at a Hotel/Homestay in Sankri. Dinner included.",
        pickupPoint: "Dehradun Railway Station / ISBT",
        driveDistance: "200 Km",
        drivingTime: "8-9 Hrs",
        stayType: "Hotel / Homestay",
        meals: "Dinner",
      },
      {
        day: 2,
        title: "Sankri to Sikolta (9,300 ft) — 6 Km Trek",
        description:
          "Trek 6 Km (4 Hrs) via Jainot Thatch and Marikoda through pine forest — first view of Dhunda & Phulara Ridge. Overnight in tents at Sikolta.",
        detailedDescription:
          "Start from Sankri base and cross a lovely pine forest, a small bridge and a few broken dhabas. Reach Jainot Thatch, then ascend to Marikoda for the first view of Dhunda Top and Phulara Ridge. Continue to the Sikolta meadow campsite (9,300 ft) — the same base camp shared with the Kedarkantha trail, before the routes divide. Overnight stay in tents.",
        trekDistance: "6 Km",
        trekDuration: "4 Hrs",
        stayType: "Camp",
        meals: "Breakfast, Lunch, Evening Snacks, Dinner",
      },
      {
        day: 3,
        title: "Sikolta to Bhoj Gadi via Karsu Thatch (9,300 ft to 11,155 ft)",
        description:
          "Trek 7 Km (4 Hrs) through dense forest to Karsu Thatch meadow, then on to Bhoj Gadi camp with views of Kedarkantha & Swargarohini.",
        detailedDescription:
          "A gradual ascent through dark, dense forest scattered with naturally fallen trees. Cross a stream near a small bridge and reach Karsu Thatch — a green meadow dotted with yellow flowers, where the tree line thins into Rhododendron and Bhoj trees. A further 30 minutes of ascent brings you to the Bhoj Gadi campsite (11,155 ft), with views of Kedarkantha and Swargarohini from camp. Overnight stay in tents.",
        trekDistance: "7 Km",
        trekDuration: "4 Hrs",
        stayType: "Camp",
        meals: "Breakfast, Lunch, Evening Snacks, Dinner",
      },
      {
        day: 4,
        title: "Bhoj Gadi to Pushtara via Phulara Ridge (11,155 ft to 12,127 ft to 9,500 ft) — Ridge Walk Day",
        description:
          "Trek 8 Km (6 Hrs). 1-hour climb to Phulara Ridge (12,150 Ft), a 2.5-hour ridge walk with 360° views, then descend to Pushtara Bugyal — the most beautiful meadow on the trek.",
        detailedDescription:
          "The main day of the trek. A 1-hour climb takes you to Phulara Ridge (12,150 ft), followed by a 2.5-hour ridge walk with 360° views on both sides — deep valleys on either flank and snow peaks all around. Peaks visible include Bandarpoonch, Kalanag, Swargarohini, Hanuman Top, Sarutal Top, DKD, Ranglana, Vijay Top, Kedarkantha and Devkyara. From the ridge you descend to Pushtara (Pustara) Bugyal (9,500 ft) — a wide, golden meadow camped under a full Himalayan skyline. Overnight stay in tents at Pushtara.",
        trekDistance: "8 Km",
        trekDuration: "6 Hrs",
        stayType: "Camp",
        meals: "Breakfast, Lunch, Evening Snacks, Dinner",
        highlights: ["Crosses Phulara Ridge at 12,150 ft with a 2.5-hour, 360° ridge walk overlooking Kedarkantha, Swargarohini and Bandarpoonch"],
      },
      {
        day: 5,
        title: "Pushtara to Taluka — Drive to Sankri (9,500 ft to 7,953 ft)",
        description:
          "Trek 10 Km (5 Hrs) descent to Taluka village via Gujjar huts. Drive 12 Km (1 Hr) from Taluka to Sankri. Overnight Hotel/Homestay.",
        detailedDescription:
          "An easy-moderate descent from Pushtara. 30 minutes to the Gujjar huts, then a stream crossing before entering the forest. The trail continues through pine and oak forest scattered with broken trees down to Taluka village (7,953 ft). From Taluka, a 12 Km drive takes you back to Sankri. Overnight stay at a Hotel/Homestay in Sankri.",
        trekDistance: "10 Km",
        trekDuration: "5 Hrs",
        driveDistance: "12 Km",
        drivingTime: "1 Hr",
        stayType: "Hotel / Homestay",
        meals: "Breakfast, Lunch, Evening Snacks, Dinner",
      },
      {
        day: 6,
        title: "Departure — Sankri to Dehradun",
        description:
          "Drive 200 Km (8-9 Hrs) back to Dehradun via the same route. Drop by evening. Trek Ends.",
        detailedDescription:
          "Morning departure from Sankri, driving back to Dehradun via Mori, Purola and Mussoorie. Drop at Dehradun by evening (6-7 PM). Trek Ends.",
        driveDistance: "200 Km",
        drivingTime: "8-9 Hrs",
        stayType: "Trek Ends — Drop at Dehradun",
        meals: "Breakfast",
        timeNote: { label: "Drop", value: "Evening at Dehradun" },
      },
    ],
    inclusions: [
      {
        title: "Stay",
        description: "2 Nights Hotel/Homestay in Sankri (Day 1 & Day 5) plus 3 Nights Camping in Tents at Sikolta, Bhoj Gadi and Pushtara — all on Triple Sharing, with a toilet tent during the trek.",
      },
      {
        title: "Meals",
        description: "All meals from Sankri to Sankri — Dinner on Day 1; Breakfast, Lunch, Evening Snacks and Dinner on Day 2-5; Breakfast on Day 6. Veg plus occasional egg, tea-coffee and soup.",
      },
      {
        title: "Transportation",
        description: "Dehradun to Sankri and Sankri to Dehradun by Sumo/Bolero/Tempo Traveller, plus the Taluka to Sankri transfer on Day 5 (sharing basis).",
      },
      {
        title: "Trek Team",
        description: "Certified Trek Leader, local guide, cook and porters/mules for common luggage.",
      },
      {
        title: "Permits & Fees",
        description: "Govind Wildlife Sanctuary permit, forest entry fee and camping charges.",
      },
      {
        title: "Equipment & Safety",
        description: "Tents, sleeping bags (-10°), mattress, kitchen/dining/toilet tents, gaiters and micro-spikes in snow (Dec-Mar), plus first aid kit, oxygen cylinder, oximeter, stretcher and rope.",
      },
    ],
    exclusions: [
      { title: "Personal Expenses", description: "Porters for personal luggage (₹1,500 for the full trek if needed), personal shopping and tips." },
      { title: "Food & Water in Transit", description: "Any meal in Dehradun, food during the Day 1 & Day 6 drives, and bottled mineral water/cold drinks." },
      { title: "Travel to Dehradun", description: "Transport to reach Dehradun from your city, and any extra travel apart from the included route." },
      { title: "Insurance & Medical", description: "Personal travel/trek insurance, personal medical expenses, and any rescue/helicopter evacuation cost (covered by the government only if available)." },
      { title: "Clothing & Gear", description: "Trekking shoes, jackets, trek pants, poncho, backpack (50-60L), torch etc. — bring your own (rental available in Sankri)." },
      { title: "Natural Calamities", description: "Any cost due to natural calamity, landslide, roadblock or bad weather causing extra stay or transport, and anything not mentioned in the Inclusions." },
      { title: "GST", description: "5% GST extra on the total cost." },
    ],
    faqs: [
      {
        title: "What is the difficulty level of Phulara Ridge Trek?",
        description: "Easy to Moderate. 5-7 Km walking per day. First-time trekkers, families and kids (10+ yrs) can easily do it — no technical climbing.",
      },
      {
        title: "What is the height of Phulara Ridge?",
        description: "The highest point is Phulara Ridge Top — 12,150 Ft (3,703 M). Campsites: Bhoj Gadi — 11,155 Ft, Pushtara — 9,500 Ft, Sikolta — 9,300 Ft.",
      },
      {
        title: "How long is the Phulara Ridge Trek distance?",
        description: "Total trekking distance is 30-31 Km from Sankri to Taluka. Driving distance is Dehradun to Sankri, 200 Km one side.",
      },
      {
        title: "Is Phulara Ridge Trek safe for beginners?",
        description: "Yes, 100% safe for beginners — one of the best beginner ridge treks in Uttarakhand. A certified Trek Leader, Guide, and safety equipment (Oxygen Cylinder, Oximeter, First Aid) are always with you.",
      },
      {
        title: "What is the best time for Phulara Ridge Trek?",
        description: "December to April for snow and a winter experience, May-June for green meadows and flowers, September-November for golden meadows and the clearest views (best for photography).",
      },
      {
        title: "What will the temperature be during the trek?",
        description: "Winter (Dec-Mar) — Day 5°C to 10°C, Night -5°C to -2°C. Summer (May-June) — Day 12°C to 18°C, Night 2°C to 8°C. Autumn (Sept-Nov) — Day 10°C to 15°C, Night 0°C to 5°C.",
      },
      {
        title: "What is included in transport?",
        description: "Dehradun to Sankri and Sankri to Dehradun by Sumo/Bolero/Tempo Traveller (sharing basis), plus the Taluka to Sankri transfer on Day 5.",
      },
      {
        title: "Is network available on Phulara Ridge Trek?",
        description: "Jio works in Sankri village only. No network from Sikolta to Pushtara (3 days); BSNL sometimes works at Pushtara. Inform family in advance.",
      },
      {
        title: "Can we get a stay on double sharing?",
        description: "Our cost is on triple sharing — Hotel/Homestay in Sankri and Tents during the trek. Double sharing is available at an extra cost of ₹1,500 per person for the 2 nights in Sankri.",
      },
      {
        title: "What about washroom/toilet during the trek?",
        description: "In Sankri — Hotel with attached/common washroom and hot water. During the trek — dry toilet tents with a toilet seat, clean and set up away from the campsite.",
      },
      {
        title: "What about food during the trek?",
        description: "Veg plus occasional egg. Breakfast, Lunch, Evening Snacks and Dinner from Day 1 Dinner to Day 6 Breakfast — hot, fresh food cooked by our Cook. Jain food available on prior notice.",
      },
      {
        title: "What should I carry for Phulara Ridge Trek?",
        description: "Waterproof, high-ankle trekking shoes, 50-60L backpack, winter jackets, fleece, trek pants, woollens, poncho, gloves, woollen cap, sunglasses, power bank, water bottle and personal medicine. A full list is sent after booking.",
      },
      {
        title: "Is there any age limit?",
        description: "10 to 60 years can do this trek. Below 18 years need a guardian. Above 60 years need a medical certificate and fitness clearance.",
      },
      {
        title: "What about personal luggage?",
        description: "You carry your own backpack (7-8 Kg). If you don't want to carry it, it can be given to a mule/porter at an extra cost of ₹1,500 for the full trek for a 10 Kg bag.",
      },
      {
        title: "Is alcohol/smoking allowed?",
        description: "No alcohol/smoking during trek days (Sikolta to Pushtara). Allowed in Sankri market after the trek ends.",
      },
    ],
    howToReach: {
      intro: "Pickup and drop is Dehradun to Dehradun — Sankri is the base village, 200 Km from Dehradun.",
      air: {
        summaryLabel: "Nearest Airport",
        summary: "Jolly Grant Airport, Dehradun (DED) — 25 Km",
        detail:
          "Daily flights connect Delhi, Mumbai and Bangalore. From the airport, take a taxi to Dehradun Railway Station (₹800-1,000, 1 hour). Arrive a day early (Day 0) if coming by flight.",
      },
      train: {
        summaryLabel: "Best Option",
        summary: "Dehradun Railway Station",
        detail:
          "Well connected by overnight trains — Nanda Devi Express, Dehradun Shatabdi and Mussoorie Express from Delhi, plus direct trains from Mumbai, Kolkata and Lucknow. From Haridwar (50 Km), a bus or train runs every 30 minutes to Dehradun.",
      },
      road: {
        summaryLabel: "By Bus / Overnight Volvo",
        summary: "Delhi ISBT Kashmiri Gate to Dehradun",
        detail:
          "Government and private Volvo/AC buses run hourly (6-7 Hrs); the last bus at 11 PM reaches Dehradun by 5 AM, in time for the same-morning pickup. Direct buses also run from Chandigarh, Manali and Shimla.",
        route: ["Dehradun", "Mussoorie", "Purola", "Mori", "Netwar", "Sankri"],
        facts: [
          { label: "Distance", value: "200 Km" },
          { label: "Duration", value: "8-9 Hours" },
        ],
      },
      pickup: {
        point: "Dehradun Railway Station / ISBT",
        time: "Early Morning (Day 1)",
        dropPoint: "Dehradun Railway Station / ISBT",
        dropTime: "Evening, 6-7 PM (Day 6)",
        note: "No pickup from Haridwar or Rishikesh — only Dehradun. Book onward travel for after 8 PM on Day 6, or the next morning.",
      },
    },
    article: {
      title: "Phulara Ridge: The Most Beautiful Ridge Walk in Uttarakhand",
      standfirst:
        "If Kedarkantha is famous for its summit, Phulara Ridge is famous for its walk — a 3 Km ridge in the sky, with almost no crowd for company.",
      readMinutes: 5,
      sections: [
        {
          paragraphs: [
            "Phulara Ridge Trek is the most beautiful ridge trek in India. If Kedarkantha is famous for its summit, Phulara Ridge is famous for the walk on the ridge itself — the only trek in Uttarakhand where you walk for 2-3 Km continuously on a mountain ridge with 360° Himalayan views on both sides. On one side you see Kedarkantha, Bandarpoonch, Swargarohini and Kalanag; on the other, the deep valleys of Himachal.",
            "The trek starts from Sankri — the same base as Kedarkantha — but after Sikolta the trail goes its own way, through thick, dark, dense forests of Pine, Oak and Rhododendron, past naturally fallen trees that make the forest feel wilder and more untouched.",
          ],
        },
        {
          heading: "Why Phulara Ridge Is Different From Kedarkantha",
          paragraphs: [
            "Kedarkantha and Phulara Ridge both start from Sankri village and share the same base camp at Sikolta. But after Sikolta, the trails divide — Kedarkantha climbs to its famous temple summit, crowded through the winter, while Phulara Ridge heads towards Pustara Bugyal, a much wider, cleaner and far less crowded meadow.",
            "Kedarkantha sees around 200 trekkers a day; Phulara Ridge sees only 10-20. What you get in return is peace, silence and clean campsites, plus a fairy-tale stretch of forest at Karsu Thatch — moss-covered trees and yellow flowers — and a sunset view of Kedarkantha from the Bhoj Gadi campsite.",
          ],
        },
        {
          heading: "Pushtara Bugyal — The Hidden Meadow",
          paragraphs: [
            "Pustara (Pushtara) is the highlight of the trek — one of the most eye-catching, wide meadows in Uttarakhand, and the first place you get a big, open Himalayan view. The campsite here is considered one of the most beautiful in India: a golden meadow where you camp under thousands of stars with Kedarkantha peak right behind you.",
            "From Phulara Ridge Top (12,150 ft) itself, you can clearly see Dhunda Top, Kedarkantha Peak, Swargarohini and the Bandarpoonch range — high enough to feel enclosed on all sides by the mountain range, true Himalayan beauty.",
          ],
        },
        {
          heading: "Why Phulara Ridge With Trip My Soul?",
          paragraphs: [
            "It's perfect for beginners who want less crowd than Kedarkantha, offering a ridge-walk experience you won't get on any other winter trek. December to March is the best window for a moderate-snow, easy-to-walk winter trek, and the same Sankri base makes it just as easy to reach from Dehradun. It's also 100% safe for girls, solo travellers and groups.",
            "If you want the beauty of the Kedarkantha region but without the crowd, and with a better ridge experience — Phulara Ridge is for you.",
          ],
        },
      ],
      signoff: "If Kedarkantha is the King of winter treks, Phulara Ridge is the Queen — less crowd, more beauty, and a true ridge experience.",
    },
    similarTreks: ["kedarkantha-trek", "har-ki-dun-trek", "nagtibba-trek", "dayara-bugyal-trek"],
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
    // Chopta with Auli — Rishikesh-to-Rishikesh circuit covering Auli's ski
    // slopes, the Tungnath-Chandrashila trek and the Deoria Tal lake trek via
    // Sari Village. Extended detail-page content lives further down this file,
    // in the `choptaWithAuliIndex` block.
    "slug": "chopta-with-auli",
    "name": "Chopta with Auli",
    "tagline": "Auli's ski slopes, the world's highest Shiva temple and a 13,000 ft summit in one trip",
    "price": null, // TODO(content): real price; the card shows "TBD" until set.
    "days": 4,
    "nights": 3,
    "region": "Uttarakhand",
    "category": "Upcoming Winter Treks",
    "startLocation": "Rishikesh / Haridwar",
    "difficulty": "Easy-Moderate",
    // Dec/Jan/Feb is what SEASON_MAP["Winter"] in app/page.tsx matches on.
    // The published route is also good March-June; see `differentiators` below.
    "months": [
      "Dec",
      "Jan",
      "Feb"
    ],
    "themes": [
      "Snow",
      "Temple",
      "Meadow"
    ]
    // TODO(content): add `heroImage` — trekDetail.ts falls back to the default
    // hero image while it is unset.
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
    // Full content sourced from the ops-supplied Kanatal write-up (overview,
    // itinerary, eligibility, article, FAQs, how-to-reach and package terms);
    // extended detail-page fields are assigned below via `kanatalIndex`.
    // TODO(content): still no heroImage — trekDetail.ts falls back to the
    // default hero image while it is unset, and no fixed package price is
    // published in the source, so `price` stays null (see `priceNote`).
    "slug": "kanatal-winter-trip",
    "name": "Kanatal Winter Trip",
    "tagline": "A quiet pine-forest hill station near Mussoorie, with Surkanda Devi temple, forest treks and zip-lining over the valley",
    "price": null,
    "days": 3,
    "nights": 2,
    "region": "Uttarakhand",
    "category": "Upcoming Winter Treks",
    "startLocation": "Dehradun",
    "difficulty": "Easy-Moderate",
    // Dec/Jan/Feb is what SEASON_MAP["Winter"] in app/page.tsx matches on.
    // The source describes this as an all-year destination — see
    // `differentiators` below for the other three seasons.
    "months": [
      "Dec",
      "Jan",
      "Feb"
    ],
    "themes": [
      "Snow",
      "Forest",
      "Temple",
      "Adventure"
    ]
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
    "slug": "nainital-winter-trip",
    "name": "Nainital Winter Trip",
    "tagline": "The Lake City of Uttarakhand — Naini Lake boating, Mall Road evenings, Himalayan view points and the Bhimtal-Sattal-Naukuchiatal lake cluster, Kathgodam to Kathgodam.",
    "price": null, // TODO(content): real price; the card shows "TBD" until set.
    "days": 3,
    "nights": 2,
    "region": "Uttarakhand",
    "category": "Upcoming Winter Treks",
    "startLocation": "Kathgodam",
    "endLocation": "Kathgodam",
    "difficulty": "Easy",
    "availability": "Every Saturday from Kathgodam, open 365 days",
    // Dec/Jan/Feb is what SEASON_MAP["Winter"] in app/page.tsx matches on.
    "months": [
      "Dec",
      "Jan",
      "Feb"
    ],
    "themes": [
      "Snow",
      "Lakes",
      "Family with Kids",
      "Couples"
    ],
    intro:
      "Nainital is the most famous and loved hill station of Kumaon Uttarakhand, also known as the City of Lakes. Located at an altitude of 6,837 ft around a beautiful pear-shaped Naini Lake, surrounded by 7 hills, Nainital is a perfect blend of natural beauty, mall road shopping, boating and colonial charm.",
    idealFor:
      "Families with kids, couples and first-time hill visitors who want a lively vacation — lake, market, view points, temples, cafes and adventure all in one place.",
    highlights: [
      "Naini Lake boating — pedal, row or Shikara",
      "Naina Devi Temple, one of 51 Shakti Peethas",
      "Mall Road — 1.5 km of shopping, woolens, candles and cafes",
      "Tiffin Top (Dorothy's Seat) and Snow View Point via ropeway",
      "Lover's Point & Suicide Point",
      "Bhimtal, Sattal and Naukuchiatal lake cluster",
      "Kainchi Dham — Neem Karoli Baba Ashram",
      "Horse riding, ropeway and paragliding at Naukuchiatal",
    ],
    aboutParagraphs: [
      "Nainital is a small but world-famous Himalayan town in the Kumaon region of Uttarakhand. Built around the sacred Naini Lake at an altitude of 2,084 meters (6,837 ft), it is surrounded by seven hills — Ayarpata, Deopata, Handi-Bandi, Cheena Peak, Alma, Laria Kanta and Sher Ka Danda — which is why it is also called the City of 7 Hills.",
      "It was discovered by a British businessman P. Barron in 1841 and since then it has been the summer capital and favorite getaway for Britishers. That colonial charm is still alive in its old churches, schools like Sherwood & St. Joseph's, and heritage bungalows.",
      "Unlike quiet hill stations like Kanatal or Dhanaulti, Nainital is full of life. It is where nature and town life co-exist. In the center lies the emerald green pear-shaped Naini Lake — 2 miles in circumference. On one side is Mallital (head of lake) and on other side is Tallital (foot of lake), connected by Mall Road, where the whole town comes alive in the evening.",
      "According to mythology, Naini Lake is one of the 51 Shakti Peethas where the eye (Naina) of Goddess Sati fell, and the Naina Devi Temple on the lake bank is highly revered.",
      "Nainital is not just one lake — it is a cluster of lakes. Within 15 km you have Bhimtal (largest lake with an island), Sattal (group of 7 lakes joined together — most clean & peaceful), Naukuchiatal (deepest lake with 9 corners — famous for paragliding), and Khurpatal. That is why the whole district is called the Lake District of India.",
      "Nainital has no airport or direct railway line. The nearest Railway Station is Kathgodam (35 km, 1.5 hrs), connected to Delhi, Lucknow and Kolkata by daily trains. The nearest Airport is Pantnagar (65 km). From Kathgodam, a taxi or bus takes you to Nainital via a beautiful winding road.",
    ],
    destinationHighlights: [
      {
        name: "Bhimtal",
        blurb: "Bigger than Naini Lake, with a small island in the centre holding an aquarium. Good for a relaxed boat ride.",
      },
      {
        name: "Sattal",
        blurb: "A group of 7 freshwater lakes joined together, untouched and peaceful — the best spot for bird watching and silence.",
      },
      {
        name: "Naukuchiatal",
        blurb: "The deepest lake in Nainital with 9 corners, famous for paragliding, boating and wish fulfilment.",
      },
      {
        name: "Khurpatal",
        blurb: "The cleanest water source for Nainital — hidden, green and rarely crowded.",
      },
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrival in Nainital | Local Nainital Exploration",
        description:
          "Pickup from Kathgodam and drive to Nainital, Naina Devi Temple darshan, evening boating in Naini Lake and a Mall Road walk.",
        detailedParagraphs: [
          "Pickup from Kathgodam Railway Station (morning arrival trains work best) / Pantnagar Airport / Haldwani. Drive to Nainital (35 km, 1.5-2 hrs) — a beautiful uphill drive through pine forest, Kumaon hills and valley views, with a tea break at Kathgodam. Check in at your hotel (Mall Road / Lake View recommended for first timers) and freshen up.",
          "Afternoon darshan at Naina Devi Temple, located at the north shore of Naini Lake — one of the 51 Shakti Peethas. Get blessings and enjoy the lake view from the temple courtyard, 30-45 minutes.",
          "Evening boating in Naini Lake — Shikara, pedal boat or row boat, best at sunset when the lake lights come on. Follow it with a walking tour of Mall Road (1.5 km from Mallital to Tallital) — shopping for the famous Nainital candles, woolens, pinewood decor and handmade chocolates, and trying bun maska, hot momos and lakeside cafes. Dinner and overnight stay at Nainital.",
        ],
        pickupPoint: "Kathgodam Railway Station / Pantnagar Airport / Haldwani",
        driveDistance: "35 Km",
        drivingTime: "1.5-2 Hrs",
        stayType: "Hotel (Mall Road / Lake View)",
        meals: "Dinner",
      },
      {
        day: 2,
        title: "Himalayan View Points & Lake Cluster Tour",
        description:
          "Ropeway to Snow View Point, optional Tiffin Top, then a Bhimtal-Sattal-Naukuchiatal lake circuit.",
        detailedParagraphs: [
          "After breakfast, take the ropeway / cable car to Snow View Point — from 2,270 m, a clear view of Nanda Devi, Trishul and Nanda Kot peaks (best Sept-Nov & Mar-May). Also visit the Himalayan View Point and photo point. Optionally add Tiffin Top / Dorothy's Seat, the highest picnic point in Nainital with a 360° view.",
          "Afternoon drive on the 3-lakes circuit (15-25 km loop): Bhimtal (22 km) — the largest lake with an island aquarium and boating; Sattal (5 km from Bhimtal) — a group of 7 lakes, very peaceful, good for bird watching; Naukuchiatal (10 km from Bhimtal) — the deepest lake with 9 corners, known for paragliding (optional, ₹1,500-2,000) and boating. Visit the Eco Cave Gardens (6 natural caves) and the High Altitude Zoo if time permits and kids are along.",
          "Return to Nainital by 6 PM. Evening free for cafe hopping and sunset at Hanuman Garhi. Overnight at Nainital.",
        ],
        highlights: ["Ropeway to Snow View Point", "Bhimtal-Sattal-Naukuchiatal lake circuit"],
        stayType: "Hotel (Mall Road / Lake View)",
        meals: "Breakfast, Dinner",
      },
      {
        day: 3,
        title: "Kainchi Dham Darshan & Departure",
        description:
          "Morning darshan at Kainchi Dham, then drop at Kathgodam Railway Station.",
        detailedParagraphs: [
          "Early breakfast and check-out from the hotel. Drive to Kainchi Dham (20 km, 1 hr from Nainital) — the world-famous Neem Karoli Baba Ashram, for a peaceful darshan and time at the meditation hall, about an hour.",
          "Continue the drive to Kathgodam Railway Station (60 km from Kainchi, 1.5 hrs) for the return train to Delhi. Tour ends with beautiful memories. Optional drop at Pantnagar Airport / Haldwani, or extend to Jim Corbett.",
        ],
        driveDistance: "20 Km to Kainchi Dham, 60 Km onward to Kathgodam",
        drivingTime: "1 Hr + 1.5 Hrs",
        stayType: "Trek Ends — Drop at Kathgodam",
        meals: "Breakfast",
      },
    ],
    inclusions: [
      {
        title: "Accommodation",
        description: "2 nights stay in Nainital (Mall Road / Lake View / Bhimtal as per package), quad/triple sharing, room with attached washroom, TV and tea kettle. Categories: Standard, Deluxe (Lake View), Luxury.",
      },
      {
        title: "Meals (MAP Plan)",
        description: "2 breakfasts and 2 dinners at the hotel.",
      },
      {
        title: "Transportation & Sightseeing",
        description: "Pickup & drop from Kathgodam Railway Station / Pantnagar Airport / Haldwani ISBT, all transfers and sightseeing by private car (Swift Dzire/WagonR for 2-3 pax, Ertiga/Innova for 4-6 pax, Innova Crysta/Tempo Traveller for 7+ pax), with driver allowance, fuel, toll, parking, state tax and green tax included.",
      },
      {
        title: "Sightseeing Covered",
        description: "Nainital Local, Snow View Point (till ropeway point), Tiffin Top, Bhimtal, Sattal, Naukuchiatal, Kainchi Dham (on the way back).",
      },
      {
        title: "Tour Support",
        description: "24x7 tour support.",
      },
    ],
    exclusions: [
      { title: "Lunch", description: "Not included — available at Mall Road and en route." },
      { title: "Boating in Naini Lake", description: "Charged separately for pedal/row boat or Shikara." },
      { title: "Ropeway / Cable Car", description: "Snow View Point ropeway ticket, direct payment." },
      { title: "Entry Tickets", description: "Eco Cave Garden ₹80, High Altitude Zoo ₹100, Bhimtal Aquarium — direct payment." },
      { title: "Adventure Activities", description: "Paragliding at Naukuchiatal, horse riding at Tiffin Top, zip line etc — direct payment." },
      { title: "Kainchi Dham Special Puja / Prasad", description: "Free entry, no charges — any special puja is optional and paid direct." },
      { title: "Personal Expenses", description: "Mineral water, cold drinks, snacks, shopping, laundry, tips to driver." },
      { title: "GST", description: "5% extra, if a bill is needed." },
      { title: "Travel Insurance & Medical Expenses", description: "Not included." },
      { title: "Anything Not Mentioned", description: "Anything not listed under inclusions." },
    ],
    eligibilityCriteria: [
      { icon: "Users", text: "Open for all ages — kids (0-18), adults (18-60) and senior citizens (60-85+) are all suited to this trip" },
      { icon: "Stethoscope", text: "Asthma, BP, sugar and heart patients can travel — altitude is only 6,800 ft; not recommended within 1 month of major surgery; pregnant women safe till 7 months (avoid ropeway & bumpy lake roads)" },
      { icon: "IdCard", text: "Indian citizens need Aadhaar/Voter ID/Driving License for hotel check-in; foreign nationals need passport & visa copy — no permit or Yatra registration required" },
      { icon: "Users2", text: "Solo travellers, couples, friends' groups and families are all welcome — Mall Road area is safe for solo women till 10 PM" },
      { icon: "Calendar", text: "Open 365 days — no road blockage like the Char Dham route, even in monsoon or snowfall" },
    ],
    fitnessCriteria: [
      { icon: "Footprints", text: "Easy grade — not a trek or Yatra; Mall Road, Naini Lake, Bhimtal, Sattal and Kainchi Dham are all plain drive and flat walk" },
      { icon: "Mountain", text: "Only two spots need a short walk — Naina Devi Temple (about 100 steps) and Tiffin Top (optional jeep/horse available)" },
      { icon: "FileText", text: "No fitness certificate needed — anyone who can travel by car and walk 200-300 metres is eligible" },
    ],
    faqs: [
      {
        title: "How to reach Nainital from Delhi/Dehradun?",
        description: "From Delhi: 320 km, 7-8 hrs — take the Kathgodam Shatabdi / Ranikhet Express till Kathgodam (last station), then a 35 km taxi (1.5 hrs) to Nainital. Direct Volvo buses also run from Anand Vihar ISBT (overnight, 8 hrs). From Dehradun: 300 km, 8-9 hrs via Haridwar-Kathgodam. Nearest airport is Pantnagar, 65 km; Jolly Grant Dehradun is 300 km.",
      },
      {
        title: "What is the best time to visit Nainital?",
        description: "March-June — best for families, pleasant weather. July-September — green, less crowd, budget rates. October-November — clear Himalayan view of Nanda Devi. December-January — chance of snowfall at Snow View Point and Cheena Peak.",
      },
      {
        title: "Is 2 days enough for Nainital?",
        description: "Yes, 2 nights / 3 days is ideal — Day 1 local Nainital and Mall Road, Day 2 Bhimtal-Sattal-Naukuchiatal lake tour plus view points, Day 3 Kainchi Dham and departure. Add a night for Jim Corbett or Mukteshwar if you want to extend.",
      },
      {
        title: "What are the main places to see in Nainital?",
        description: "Naini Lake boating, Naina Devi Temple, Mall Road, Snow View Point (ropeway), Tiffin Top, Eco Cave Garden, High Altitude Zoo, Bhimtal, Sattal, Naukuchiatal and Kainchi Dham Ashram.",
      },
      {
        title: "Does it snow in Nainital?",
        description: "Yes, but not on Mall Road / Naini Lake every year. Snowfall happens from late December to January at upper points — Snow View, Cheena Peak, Tiffin Top. Mall Road gets light snowfall once or twice in January if lucky. For guaranteed snow, visit Auli or Chopta.",
      },
      {
        title: "Is Nainital safe for family & solo female travellers?",
        description: "Yes. The Mall Road area has tourist police and stays crowded till 10-10:30 PM. Hotels are on or near Mall Road with a family crowd, and solo female travellers regularly travel here.",
      },
      {
        title: "What kind of hotels are there?",
        description: "From budget at ₹3,000 to luxury at ₹10,000 per night. Mall Road hotels are premium and best for the lake view; lake view hotels at Bhimtal/Sattal are more peaceful and spacious.",
      },
      {
        title: "Is Kainchi Dham open every day?",
        description: "Yes, open 365 days from 6 AM to 6 PM. No ticket, free entry. Prasad is given inside the temple, so there is no need to buy it outside. Mobile phones are allowed but photography is not permitted inside the temple.",
      },
      {
        title: "What should I pack for Nainital?",
        description: "Summer: light woolens for evening, cap, sunscreen, comfortable walking shoes. Winter: heavy jackets, gloves, muffler, thermals. Carry regular medicines and a valid ID proof for hotel check-in.",
      },
      {
        title: "Is any permit needed for Nainital?",
        description: "No. No permit or Yatra registration is needed for Indian citizens. Foreign nationals just need a passport copy for the hotel.",
      },
      {
        title: "Can we get vegetarian food easily?",
        description: "Yes. Most restaurants are vegetarian — Kumaoni dishes, North Indian, momos and Chinese are easily available, and non-veg is available at a few restaurants too.",
      },
      {
        title: "What is included in the Nainital package?",
        description: "Stay (lake view / Mall Road), breakfast & dinner, private taxi ex-Kathgodam with all toll-parking-driver allowance, and sightseeing as per the itinerary.",
      },
    ],
    howToReach: {
      intro:
        "Pickup and drop is Kathgodam to Kathgodam — the last railway station of the Kumaon region and the gateway for every Nainital, Bhimtal, Kainchi Dham, Mukteshwar and Almora trip. Kathgodam is 300 km from Delhi and 280 km from Dehradun, with the final 35 km to Nainital on a winding hill road.",
      air: {
        summaryLabel: "Nearest Airport",
        summary: "Pantnagar Airport (PGH) — 35 Km from Kathgodam, 65 Km from Nainital",
        detail:
          "Daily flights from Delhi on Alliance Air / IndiGo, about 1 hour — seats are limited, so book early. A taxi from the airport to Nainital costs around ₹2,000. Dehradun Airport (DED) is a farther alternative at 300 km from Kathgodam, with flights from all metro cities; from Dehradun airport it is an 8-9 hr taxi to Kathgodam/Nainital.",
      },
      train: {
        summaryLabel: "Nearest Railway Station",
        summary: "Kathgodam Railway Station (KGM) — 35 Km, 1.5 Hrs from Nainital",
        detail:
          "The last railhead of the Kumaon region, well connected to Delhi, Lucknow, Kolkata and Agra. From Lucknow, the 15044 Lucknow Kathgodam Express runs daily overnight; from Kolkata/Howrah, the 13019 Bagh Express runs weekly. There is no direct train from Dehradun/Haridwar — break the journey at Moradabad/Delhi, or take a bus/taxi via Haridwar-Haldwani (8-9 hrs) instead. An auto/taxi stand for Nainital sits just outside the station.",
        options: [
          { from: "Lucknow", name: "15044 Lucknow Kathgodam Express", note: "Daily, overnight" },
          { from: "Kolkata / Howrah", name: "13019 Bagh Express", note: "Weekly" },
        ],
      },
      road: {
        summaryLabel: "By Road from Delhi",
        summary: "Delhi to Kathgodam/Haldwani — 310 Km, 7-8 Hrs",
        detail:
          "UPSRTC and Uttarakhand Roadways run Volvo, AC and ordinary buses from Anand Vihar ISBT every hour from 6 PM to 11 PM. From Dehradun ISBT it is 300 km, 8-9 hrs via Haridwar and Najibabad, with direct buses at 6:30 AM and 8:30 PM daily; a taxi (Swift Dzire class) also works. From Haridwar/Rishikesh it is 250 km, about 7 hrs, with direct buses available. The route runs on NH109, which is in very good condition till Haldwani — only the last 35 km into Nainital is hilly.",
        route: ["Delhi", "Moradabad", "Rampur", "Haldwani", "Kathgodam", "Nainital"],
        facts: [
          { label: "Distance", value: "310-320 Km" },
          { label: "Duration", value: "7-8 Hours" },
        ],
        options: [
          { from: "Delhi (Anand Vihar ISBT)", name: "UPSRTC / Uttarakhand Roadways — Volvo, AC & ordinary", departure: "Every hour, 6 PM - 11 PM", note: "310 km, 7-8 hrs" },
          { from: "Dehradun ISBT", name: "Direct bus via Haridwar, Najibabad, Ramnagar", departure: "6:30 AM & 8:30 PM daily", note: "300 km, 8-9 hrs" },
          { from: "Haridwar / Rishikesh", name: "Direct buses to Kathgodam", note: "250 km, about 7 hrs" },
        ],
      },
      pickup: {
        point: "Kathgodam Railway Station / Pantnagar Airport / Haldwani ISBT",
        time: "On arrival, Day 1",
        dropPoint: "Kathgodam Railway Station",
        dropTime: "Day 3, timed to the return train",
        note: "Optional drop at Pantnagar Airport / Haldwani, or extend into a Jim Corbett add-on.",
      },
    },
    article: {
      title: "Nainital — The Lake City of Uttarakhand That Steals Your Heart",
      standfirst:
        "Nestled in the lap of the Kumaon Himalayas at 6,837 ft, Nainital is not just a hill station — it is an emotion.",
      readMinutes: 5,
      sections: [
        {
          paragraphs: [
            "Built around a shimmering pear-shaped lake, surrounded by seven emerald hills, Nainital is where clouds come down to say hello, where boats look like they are floating in the sky, and where every evening on Mall Road feels like a festival.",
          ],
        },
        {
          heading: "The Soul of Nainital — Naini Lake",
          paragraphs: [
            "Everything in Nainital revolves around Naini Lake. Legend says it is one of the 51 Shakti Peethas where the eye (Naina) of Goddess Sati fell. On its northern bank stands the sacred Naina Devi Temple, where devotees come for blessings before they begin their day.",
            "The lake itself is 2 miles in circumference, divided into Mallital and Tallital. In the morning it is calm and sacred, reflecting the hills. In the evening it turns golden with lights from Mall Road reflecting on the water. A boat ride here — a paddle boat with your kids or a romantic Shikara ride with your partner — is a must. It is not just boating, it is a memory for a lifetime.",
          ],
        },
        {
          heading: "Beyond One Lake — A District of Lakes",
          paragraphs: [
            "Nainital is called the Lake District of India for a reason. Within 25 km you have four different lakes, each with a different character: Bhimtal — bigger than Naini, with a small island in the centre holding an aquarium; Sattal — a group of 7 freshwater lakes joined together, untouched and peaceful, best for bird watching and silence; Naukuchiatal — the deepest lake in Nainital with 9 corners, famous for paragliding and wish fulfilment; and Khurpatal — the cleanest water source for Nainital, hidden and green.",
          ],
        },
        {
          heading: "Himalayan Views That Take Your Breath Away",
          paragraphs: [
            "A 5-minute ropeway ride from Mall Road takes you to Snow View Point at 2,270 m, and on a clear day you will see the mighty Nanda Devi (7,816 m), Trishul and Nanda Kot standing tall in white. Tiffin Top, also called Dorothy's Seat, gives a 360-degree view of Nainital town and valley — best reached by horse ride.",
            "As the sun sets, all of Nainital comes to Mall Road. The 1.5 km road buzzes with woolen shops, the famous Nainital candles (made since 1911), pinewood crafts, Bal Mithai shops, cafes serving hot chocolate and bun maska, momos, and the sound of lake waves. No one goes back without buying a candle and a sweater.",
          ],
        },
        {
          heading: "Kainchi Dham — The Spiritual Magnet",
          paragraphs: [
            "Just 20 km from Nainital lies Kainchi Dham, the ashram of Neem Karoli Baba. The silence here, the chants and the Kosi river flowing by give a calmness you will not find elsewhere.",
            "Nainital is a 365-day destination. Summer (Mar-Jun) is 15-25°C, full of life and best for a family holiday. Monsoon (Jul-Sep) is misty, green, with fewer crowds and the best rates. Autumn (Oct-Nov) brings the clearest Himalayan view. Winter (Dec-Jan) carries a chance of snowfall at the upper points.",
          ],
        },
      ],
      signoff:
        "Nainital is for celebration — celebration of lakes, mountains, faith and life. Whether you are 5 or 75, whether you come with family, friends or as a couple, Nainital welcomes you with the same love, its lake reflecting your smile.",
    },
    thingsToRemember: [
      "No fitness certificate needed — this is an easy-grade leisure trip, not a trek or Yatra.",
      "ID proof (Aadhaar/Voter ID/Driving License for Indians, passport for foreign nationals) is mandatory for hotel check-in.",
      "Lunch is not included on any day — budget separately for meals at Mall Road and en route.",
      "Carry cash for entry tickets (Eco Cave Garden, zoo, aquarium) and optional activities like ropeway, paragliding and horse riding.",
      "No photography allowed inside Kainchi Dham temple; free prasad is given inside, no need to buy outside.",
    ],
    similarTreks: ["mukteshwar-winter-trip", "kanatal-winter-trip", "auli-snow-trip"],
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
    "endLocation": "Haridwar",
    "difficulty": "Moderate to Difficult",
    "maxAltitude": "11,755 ft / 3,583 m",
    "totalDistance": "32 Kilometers",
    "availability": "May – November",
    "months": [
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov"
    ],
    "themes": [
      "Pilgrimage",
      "Forest",
      "River",
      "Temple"
    ]
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
    "name": "Kedarnath Tungnath Yatra",
    "tagline": "Two of the five Panch Kedar in 5 Days from Haridwar — the Kedarnath Jyotirlinga, the world's highest Shiva temple at Tungnath, and the Chandrashila summit.",
    "price": 10999,
    "days": 5,
    "nights": 4,
    "region": "Uttarakhand",
    "category": "Spirituals-Journey-101",
    "startLocation": "Haridwar To Haridwar",
    "endLocation": "Haridwar",
    "difficulty": "Moderate to Difficult",
    "maxAltitude": "13,000 ft / Chandrashila Peak",
    "totalDistance": "~450 km by Road + 40 km Trek",
    "availability": "May – June & September – October",
    "months": [
      "May",
      "Jun",
      "Sep",
      "Oct",
      "Nov"
    ],
    "themes": [
      "Snow",
      "Meadow",
      "Forest",
      "Pass Crossing"
    ],
    "batchDates": [
      "2026-09-19",
      "2026-09-26",
      "2026-10-03",
      "2026-10-10",
      "2026-10-17",
      "2026-10-24",
      "2026-10-31",
      "2026-11-07"
    ]
  },
  {
    "slug": "chardham-yatra",
    "name": "Chardham Trek",
    "tagline": "Yamunotri, Gangotri, Kedarnath and Badrinath in 8 Nights / 9 Days from Haridwar.",
    "price": 24999,
    "days": 9,
    "nights": 8,
    "region": "Uttarakhand",
    "category": "Spiritual Journey",
    "startLocation": "Haridwar To Haridwar",
    "difficulty": "Moderate",
    "months": [
      "May",
      "Jun",
      "Sep",
      "Oct",
      "Nov"
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

const pangarchullaIndex = TREKS.findIndex(t => t.slug === 'pangarchulla-trek');
if (pangarchullaIndex !== -1) {
  TREKS[pangarchullaIndex].aboutParagraphs = [
    "Kuari Pass with Pangarchulla Peak sits inside the Nanda Devi Biosphere Reserve in Chamoli, Uttarakhand, on the historic Lord Curzon Trail. The route climbs from the roadhead at Karchi, near Joshimath, through oak and pine forest to the Khullara meadow campsite at 10,900 ft, then on to Kuari Pass at 12,516 ft and finally to the summit of Pangarchulla Peak at 15,069 ft — roughly 510 km by road plus 33 km on foot over 6 days and 5 nights, run from and back to Rishikesh.",
    "Kuari Pass alone is a moderate, beginner-friendly balcony walk to a 180° view of 108 Himalayan peaks in one line — Nanda Devi, Dronagiri, Kamet, Chaukhamba, Neelkanth, Trishul and more. Pangarchulla Peak is the harder, technical half of the trip: a 70–75° snow and rock wall above 14,500 ft, climbed roped up with helmet, ice axe and micro-spikes, starting at 1 AM so the group summits for sunrise.",
    "The trip runs the Kuari Pass day as an acclimatization day out of Khullara, with the Trek Leader checking fitness, oxygen levels and BP that evening before clearing anyone for the Pangarchulla summit attempt the next day. Trekkers who are not fit enough, or for whom the weather turns, rest at Khullara while the summit team goes up — safety decides who climbs, not the itinerary.",
    "Best done December to March for full winter snow, or April to June and September to October for clear Himalayan views without the deep snow; the route is closed in July–August monsoon."
  ];

  TREKS[pangarchullaIndex].highlights = [
    "180° view of 108 Himalayan peaks from Kuari Pass",
    "Pangarchulla Peak summit at 15,069 ft (4,590 m)",
    "The historic Lord Curzon Trail (1905)",
    "Nanda Devi, Kamet, Dronagiri & Chaukhamba views",
    "Pangarchulla's 70–75° snow wall climb",
    "Khullara meadow campsite",
    "Oak & pine forest of the Nanda Devi Biosphere Reserve",
    "Sunrise summit over Nanda Devi"
  ];

  TREKS[pangarchullaIndex].idealFor =
    "Trekkers with at least one Himalayan trek done, experienced trekkers, peak-summit and winter-snow lovers, and photography groups. Kuari Pass alone suits fit beginners.";

  TREKS[pangarchullaIndex].importantNote =
    "Pangarchulla Peak is a technical snow and rock climb above Khullara, not an extension of the Kuari Pass walk. Your Trek Leader checks fitness, oxygen level and BP at Khullara on the evening of Day 3 before clearing anyone for the Day 4 summit attempt; trekkers found unfit, or without a prior Himalayan trek, are kept back at Khullara for their own safety. Summit success also depends on weather and snow conditions and is never guaranteed.";

  TREKS[pangarchullaIndex].destinationHighlights = [
    { name: "Joshimath / Karchi", blurb: "Karchi, on the Auli road out of Joshimath, is the last road head — trekking starts and ends here." },
    { name: "Khullara", blurb: "The meadow base camp at 10,900 ft, with Dronagiri and Hathi-Ghoda straight ahead, and the launch point for both Kuari Pass and Pangarchulla." },
    { name: "Kuari Pass", blurb: "The 12,516 ft crossing on the Lord Curzon Trail, and the famous 180° balcony view of 108 Himalayan peaks." },
    { name: "Pangarchulla Peak", blurb: "The 15,069 ft (4,590 m) summit above Khullara, reached via a roped 70–75° snow wall climbed before dawn." }
  ];

  TREKS[pangarchullaIndex].differentiators = [
    "Region: Nanda Devi Biosphere Reserve, Chamoli district, Uttarakhand",
    "Trek type: pass crossing (Kuari Pass) plus technical peak summit (Pangarchulla)",
    "Terrain: oak & pine forest, alpine meadow, high ridge and, above 13,500 ft, snow and rock",
    "Known as: the Lord Curzon Trail, walked by Viceroy Lord Curzon in 1905"
  ];

  TREKS[pangarchullaIndex].itinerary = [
    {
      day: 1,
      title: "Rishikesh to Joshimath",
      driveDistance: "255 km",
      drivingTime: "10-11 Hours",
      pickupPoint: "Rishikesh Tapovan",
      pickupTime: "6:00 AM",
      altitudePoints: [
        { location: "Rishikesh", m: 372, ft: 1220 },
        { location: "Joshimath", m: 1875, ft: 6150 }
      ],
      altitudeGain: { m: 1503, ft: 4930 },
      description: "A long drive up the Alaknanda valley via Devprayag, Srinagar, Karnaprayag and Chamoli to Joshimath.",
      detailedParagraphs: [
        "Pickup at 6:00 AM from Rishikesh Tapovan. The drive runs via Devprayag (the Ganga–Alaknanda sangam), Srinagar, Karnaprayag and Chamoli to Joshimath — a long but scenic day along the Alaknanda River, with breakfast and lunch on the way.",
        "Reach Joshimath by 5–6 PM. Check into the hotel or guest house, and go through a trek briefing and gear check with the Trek Leader.",
        "Sleeping at 6,150 ft on the first night helps the body start acclimatizing before the trek proper begins."
      ],
      highlights: ["Alaknanda Valley Drive", "Devprayag Sangam", "Joshimath", "Trek Briefing"],
      meals: "Dinner",
      stayType: "Guest House / Hotel in Joshimath"
    },
    {
      day: 2,
      title: "Joshimath to Khullara",
      driveDistance: "12 km",
      drivingTime: "45 Minutes",
      trekDistance: "6 km",
      trekDuration: "5-6 Hours",
      altitudePoints: [
        { location: "Joshimath", m: 1875, ft: 6150 },
        { location: "Karchi", m: 1935, ft: 6350 },
        { location: "Khullara", m: 3322, ft: 10900 }
      ],
      altitudeGain: { m: 1447, ft: 4550 },
      description: "A short drive to Karchi, the last road head, then a climb through Nanda Devi Biosphere Reserve forest to the Khullara meadow campsite.",
      detailedParagraphs: [
        "After breakfast, drive from Joshimath to Karchi Village on the Auli road — about 45 minutes and the last road head for the trip.",
        "Start trekking at 9 AM. The trail runs through Nanda Devi Biosphere Reserve forest — golden oak, pine and rhododendron — with a steep first kilometre before easing into a gradual walk through meadows.",
        "Reach Khullara Meadow by 2–3 PM. Khullara is a large bugyal with Mt Dronagiri (7,066 m) and Hathi-Ghoda directly in front. Hot lunch at camp, an evening acclimatization walk and sunset views close out the day."
      ],
      highlights: ["Nanda Devi Biosphere Reserve", "Oak & Pine Forest", "Dronagiri Views", "Khullara Meadow Camp"],
      meals: "Breakfast, Lunch & Dinner",
      stayType: "Alpine Tents at Khullara"
    },
    {
      day: 3,
      title: "Khullara to Kuari Pass and back",
      trekDistance: "7 km",
      trekDuration: "6-7 Hours",
      timeNote: { label: "Start", value: "8:00 AM" },
      altitudePoints: [
        { location: "Khullara", m: 3322, ft: 10900 },
        { location: "Kuari Pass", m: 3815, ft: 12516 },
        { location: "Khullara", m: 3322, ft: 10900 }
      ],
      altitudeGain: { m: 493, ft: 1616 },
      description: "Acclimatization day on the Lord Curzon Trail — the 180° view of 108 Himalayan peaks from Kuari Pass — then back to Khullara for the Pangarchulla summit briefing.",
      detailedParagraphs: [
        "Acclimatization day. Start after breakfast at 8 AM on the Lord Curzon Trail (1905). As the trail crosses the tree line, the Himalayas open up.",
        "By around 11:30 AM you're at Kuari Pass (12,516 ft) — the famous balcony view of 108 peaks across 180°, with Nanda Devi (7,816 m) at the centre alongside Kamet, Dronagiri, Chaukhamba, Neelkanth and Trishul.",
        "Spend an hour at the top for packed lunch, hot tea and photos, then descend back to Khullara by 3 PM.",
        "In the evening the Trek Leader runs a briefing and fitness check — oxygen level, BP and how the day's pace went — to decide who is cleared for the Pangarchulla Peak summit attempt. Early dinner and sleep by 7 PM, since the next day starts at 1 AM."
      ],
      highlights: ["Lord Curzon Trail", "108 Himalayan Peaks", "Nanda Devi View", "Summit Fitness Check"],
      meals: "Breakfast, Packed Lunch & Dinner",
      stayType: "Alpine Tents at Khullara"
    },
    {
      day: 4,
      title: "Khullara to Pangarchulla Peak summit and back",
      trekDistance: "13 km",
      trekDuration: "10-12 Hours",
      timeNote: { label: "Wake-up call", value: "1:00 AM" },
      altitudePoints: [
        { location: "Khullara", m: 3322, ft: 10900 },
        { location: "Pangarchulla Peak", m: 4590, ft: 15069 },
        { location: "Khullara", m: 3322, ft: 10900 }
      ],
      altitudeGain: { m: 1268, ft: 4169 },
      description: "Summit day — the toughest day of the trip. A 1 AM start, a roped climb up a 70–75° snow wall, and sunrise on the summit facing Nanda Devi.",
      detailedParagraphs: [
        "Summit day — the toughest day of the trek. Wake-up call at 1:00 AM for tea and a light breakfast, then start trekking at 2:00 AM with head torch, helmet, micro-spikes and gaiters.",
        "The first two hours are in the dark through meadow, then a boulder zone, then snow past 13,500 ft. At 14,500 ft the technical section starts — a 70–75° snow and rock wall — and the team ropes up with an ice axe.",
        "You summit between 6:00 and 7:00 AM for sunrise over Nanda Devi at 15,069 ft, with a 360° view — higher than any other winter trek in the region. 20–30 minutes are spent at the top.",
        "Descend carefully back to Khullara by 11 AM–12 PM. Hot lunch and full rest afterward — body pain, but a summit certificate and a trek to remember."
      ],
      highlights: ["Pangarchulla Peak Summit (15,069 ft)", "70-75° Snow Wall Climb", "Sunrise over Nanda Devi", "360° Himalayan View"],
      meals: "Breakfast, Packed Lunch & Dinner",
      stayType: "Alpine Tents at Khullara"
    },
    {
      day: 5,
      title: "Khullara to Joshimath",
      trekDistance: "6 km",
      trekDuration: "3-4 Hours",
      driveDistance: "12 km",
      drivingTime: "45 Minutes",
      altitudePoints: [
        { location: "Khullara", m: 3322, ft: 10900 },
        { location: "Karchi", m: 1935, ft: 6350 },
        { location: "Joshimath", m: 1875, ft: 6150 }
      ],
      altitudeGain: null,
      description: "An easy downhill trek back through forest to Karchi, then a short drive to Joshimath.",
      detailedParagraphs: [
        "Easy day. After breakfast, descend from Khullara to Karchi village — 3–4 hours downhill through the same forest.",
        "Vehicles are waiting at Karchi for the drive back to Joshimath. Check into the hotel by 1–2 PM — a hot shower after three days of camping.",
        "The evening is free to explore Joshimath market, Shankaracharya Temple and Narsingh Temple, followed by a farewell dinner."
      ],
      highlights: ["Forest Descent", "Trek Ends at Karchi", "Joshimath Market & Temples"],
      meals: "Breakfast, Lunch & Dinner",
      stayType: "Guest House / Hotel in Joshimath"
    },
    {
      day: 6,
      title: "Joshimath to Rishikesh",
      driveDistance: "255 km",
      drivingTime: "9-10 Hours",
      timeNote: { label: "Drop-off", value: "Rishikesh Tapovan, 7-8 PM" },
      altitudePoints: [
        { location: "Joshimath", m: 1875, ft: 6150 },
        { location: "Rishikesh", m: 372, ft: 1220 }
      ],
      altitudeGain: null,
      description: "The drive back down the Alaknanda valley to Rishikesh, where the trip ends.",
      detailedParagraphs: [
        "After breakfast at 7:30 AM, drive back to Rishikesh via the same route — Chamoli, Karnaprayag and Devprayag.",
        "Reach Rishikesh Tapovan by 7–8 PM. The trip ends here, with Pangarchulla summit memories to carry home."
      ],
      highlights: ["Alaknanda Valley", "Trip Ends"],
      meals: "Breakfast",
      // The trip ends on this day; an empty stay keeps the generic
      // "Hotel / Homestay" fallback out of the day's quick-info line.
      stayType: ""
    }
  ];

  /**
   * In winter (Dec–Mar) the Karchi–Joshimath road can be snowbound, and the
   * group stays at Karchi instead of Joshimath on Days 1 and 5; the itinerary
   * above reflects the in-season plan published for the trek.
   */
  TREKS[pangarchullaIndex].sourceCaveat =
    "In winter (December–March), the Karchi to Joshimath road can be blocked by snow, and the group stays at Karchi instead of Joshimath on Day 1 and Day 5. Outside winter, the group stays at Joshimath for better hotel facilities, as reflected in this itinerary.";

  TREKS[pangarchullaIndex].eligibilityCriteria = [
    { icon: "User", text: "Age: 14–55 years (14–17 with parents; above 45 needs fitness proof)" },
    { icon: "Footprints", text: "Kuari Pass alone: beginners can do it" },
    { icon: "Mountain", text: "Pangarchulla Peak summit: at least 1 Himalayan trek is mandatory" },
    { icon: "Stethoscope", text: "Not permitted: severe asthma, heart disease, uncontrolled BP, epilepsy, severe joint pain, recent surgery, pregnancy" },
    { icon: "FileText", text: "Govt ID proof and a medical self-declaration form are required" },
    { icon: "ShieldAlert", text: "No alcohol, smoking or drugs during the trek" }
  ];

  /** Pangarchulla is a peak summit, not a pass walk — the bar sits above Kuari Pass alone. */
  TREKS[pangarchullaIndex].fitnessCriteria = [
    { icon: "Activity", text: "Able to jog/run 4–5 km in 35 minutes without stopping" },
    { icon: "TrendingUp", text: "Able to climb 50 floors (1,000 stairs) without heavy breathing" },
    { icon: "Dumbbell", text: "One month of daily exercise before the trek: 30–45 min walk/jog plus squats and lunges" },
    { icon: "Footprints", text: "BMI below 28 — overweight trekkers are not allowed for the peak summit" },
    { icon: "Backpack", text: "Able to carry a 60L backpack, or arrange a porter/mule at the base" }
  ];

  TREKS[pangarchullaIndex].faqs = [
    {
      title: "What is the height of Kuari Pass and Pangarchulla Peak?",
      description: "Kuari Pass is 12,516 ft (3,815 m) and Pangarchulla Peak is 15,069 ft (4,590 m)."
    },
    {
      title: "Is Kuari Pass with Pangarchulla difficult?",
      description: "Kuari Pass is Moderate and beginner-friendly. Pangarchulla Peak is Moderate–Difficult: the last 500 ft is a 70–75° snow wall climb needing technical gear and good fitness. Beginners can do Kuari Pass, but the Pangarchulla summit needs previous trek experience."
    },
    {
      title: "Can a beginner do Kuari Pass with Pangarchulla?",
      description: "Yes for Kuari Pass. For the Pangarchulla summit we recommend at least one easier trek first — Kedarkantha, Brahmatal or Dayara Bugyal. A very fit beginner (able to run 5 km in 35 minutes) may be allowed directly for the peak."
    },
    {
      title: "What is the best time for Kuari Pass with Pangarchulla?",
      description: "December to March is best for snow, April to June and September to November for clear views and meadows. July–August is closed for monsoon."
    },
    {
      title: "Is there snow on Kuari Pass and Pangarchulla?",
      description: "Yes. In winter (December–March) there is 4–5 feet of snow from Khullara itself, and the Pangarchulla summit holds snow till late May."
    },
    {
      title: "How cold does it get?",
      description: "Daytime is 5–12°C. Khullara nights run -5 to -10°C. During the Pangarchulla summit push (1 AM–7 AM) it can be -12 to -18°C with wind chill."
    },
    {
      title: "What is the starting and ending point?",
      description: "The trip starts and ends at Rishikesh Tapovan — pickup at 6 AM on Day 1, drop-off at 7–8 PM on Day 6."
    },
    {
      title: "Is Pangarchulla summit guaranteed?",
      description: "No. Summiting depends on weather, your fitness as checked at Khullara, and snow conditions. If conditions or fitness aren't right, the Trek Leader keeps trekkers at Khullara camp for safety."
    },
    {
      title: "What is the offload charge for a backpack?",
      description: "₹1,200 per bag for the 3 days of trekking on the Khullara circuit, arranged in advance. A small daypack is still needed for water, jacket and lunch."
    },
    {
      title: "What should I carry for this trek?",
      description: "Waterproof high-ankle trek shoes, 3 quick-dry layers, a -10°C down jacket, 2 fleece layers, thermal inners, 2 trek pants, waterproof gloves, a woollen cap, sunglasses, a head torch and a 60L backpack. A full packing list is sent after booking."
    }
  ];

  TREKS[pangarchullaIndex].article = {
    title: "Kuari Pass with Pangarchulla Peak: The Curzon Trail Where You See 108 Himalayan Peaks Together",
    standfirst:
      "If Kedarkantha is for friends and Brahmatal is for beginners, Kuari Pass is where your Himalayan education starts — and Pangarchulla Peak is its final exam.",
    readMinutes: 6,
    sections: [
      {
        paragraphs: [
          "Kuari Pass with Pangarchulla is not just a trek. It is the balcony of India.",
          "It is the only trek in the country from where you can see 108 Himalayan peaks in a single 180-degree line — from Nanda Devi to Dronagiri, Kamet to Chaukhamba, Neelkanth to Hathi Ghoda. No other winter trek gives you this.",
          "The trail was first explored in 1905 by Lord Curzon, Viceroy of India, when there was no road to Joshimath, no Auli ski resort, no tents. He rode a horse through oak and pine forest to reach Kuari Pass — which is why it is still called the Curzon Trail."
        ]
      },
      {
        heading: "Beyond the Pass",
        paragraphs: [
          "Today, most people only do Kuari Pass. They stop at 12,516 ft, take a photo and turn back.",
          "The real story starts after Kuari Pass — one more mountain standing above Khullara like a white wall: Pangarchulla.",
          "At 15,069 ft (4,590 m), Pangarchulla Peak is not a pass, it is a peak. A proper 75-degree snow wall where you need a helmet, rope, micro-spikes and a 1 AM start in the dark. Your legs will burn and your lungs will ask you to stop, but when you reach the top you see what even Kedarnath doesn't show you — Nanda Devi (7,816 m), India's highest peak within India, close enough to feel you could touch it."
        ]
      },
      {
        heading: "Why This Trek Is Special",
        paragraphs: [
          "A summit, not just a pass. Kuari is a crossing; Pangarchulla is a peak. At 15,069 ft, you become a peak summiter, not just a trekker — a real step up for anyone who has already done Kedarkantha, Brahmatal or Dayara Bugyal.",
          "The view of 108 peaks. From Kuari Pass you see Nanda Devi, Dronagiri, Kamet (India's second highest), Chaukhamba, Neelkanth, Trishul, Hathi-Ghoda and Mana Peak, all in one line.",
          "One of the best winter snow treks. From December to March, the whole Khullara meadow and the Pangarchulla wall carry 4–5 feet of snow.",
          "Forest of the Nanda Devi Reserve. The trail runs through oak, pine and rhododendron forest, home to the Himalayan Monal, foxes and the occasional bear footprint."
        ]
      }
    ],
    signoff: "Trip My Soul — Travel Far. Feel More."
  };

  TREKS[pangarchullaIndex].howToReach = {
    intro: "The trek starts from Karchi, near Joshimath, in Chamoli, Uttarakhand. For Trip My Soul, the meeting and drop point is Rishikesh Tapovan.",
    air: {
      summaryLabel: "Nearest Airport",
      summary: "Jolly Grant Airport, Dehradun (DED)",
      detail: "From the airport, travel by taxi to Rishikesh (about 20–25 km) to join the group, or directly to Joshimath (about 250 km, 9–10 hours) if travelling independently."
    },
    train: {
      summaryLabel: "Nearest Railway Station",
      summary: "Rishikesh / Haridwar Railway Station",
      detail: "Rishikesh Tapovan is the group's pickup and drop point. From Haridwar, a short transfer reaches Rishikesh in about 45 minutes."
    },
    road: {
      summaryLabel: "Route",
      summary: "Rishikesh to Joshimath via Devprayag, Srinagar and Karnaprayag",
      detail: "Joshimath and Karchi are reached from Rishikesh by road, following the Alaknanda River for most of the drive.",
      route: ["Rishikesh", "Devprayag", "Srinagar", "Rudraprayag", "Karnaprayag", "Chamoli", "Joshimath", "Karchi"],
      facts: [
        { label: "Distance", value: "~255 km" },
        { label: "Drive", value: "~10-11 hours" },
        { label: "Options", value: "Tempo Traveller / Bolero (shared, as per group size)" }
      ]
    },
    pickup: {
      point: "Rishikesh Tapovan",
      time: "6:00 AM, Day 1",
      dropPoint: "Rishikesh Tapovan",
      dropTime: "7-8 PM, Day 6",
      note: "Route for TMS trekkers: Rishikesh → Joshimath → Karchi → Khullara → Kuari Pass → Pangarchulla Peak."
    }
  };

  TREKS[pangarchullaIndex].bookingAdvance = 3000;

  TREKS[pangarchullaIndex].inclusions = [
    { title: "Transport", description: "Rishikesh to Joshimath and Joshimath to Rishikesh, plus Joshimath–Karchi transfers, by Tempo Traveller / Bolero (shared, as per group size)." },
    { title: "Stay in Joshimath", description: "2 nights hotel/guest house (Day 1 & 5), triple/quad sharing." },
    { title: "Alpine camping", description: "3 nights tents at Khullara (Day 2, 3, 4), triple sharing, with mattress, -10°C sleeping bag and pillow provided." },
    { title: "Meals", description: "All veg meals from Day 1 dinner to Day 6 breakfast, including a 1 AM summit breakfast (tea, biscuits, chocolate) on Day 4." },
    { title: "Permits & fees", description: "Forest entry permit, Nanda Devi Biosphere Reserve fees, camping fees and trek permits." },
    { title: "Trek team", description: "Certified Trek Leader, local guide from Joshimath, cook and helpers." },
    { title: "Porters / mules", description: "For carrying central luggage — tents, food and equipment." },
    { title: "Technical equipment", description: "Micro-spikes/crampons, rope and ice axe (group use), gaiters on request, oxy-meter and first-aid kit at campsite." }
  ];

  TREKS[pangarchullaIndex].exclusions = [
    { title: "Backpack offloading", description: "Personal backpack offload, if needed — ₹1,200–1,500 for the full trek." },
    { title: "Personal expenses", description: "Hot water, bath and power-bank charging in Joshimath." },
    { title: "Meals in Rishikesh & transit", description: "Any meals in Rishikesh and during the road journey (Day 1 & Day 6 lunch)." },
    { title: "Personal gear", description: "Personal medicine, insurance, trek shoes, jackets and personal equipment." },
    { title: "Natural calamity costs", description: "Any cost due to landslide, snowfall, road block or bad weather." },
    { title: "Unscheduled stay", description: "Extra stay due to weather or health issues." },
    { title: "GST", description: "5% GST, extra if a bill is needed." },
    { title: "Anything not listed", description: "Anything not specifically mentioned under Inclusions." }
  ];
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

  TREKS[harKiDunIndex].aboutParagraphs = [
    "The Har Ki Dun Trek is one of the most scenic and culturally rich Himalayan treks in Uttarakhand. Nestled in the Garhwal Himalayas, this beautiful valley trek takes you through dense forests, alpine meadows, traditional Himalayan villages and the spectacular landscapes of the Swargarohini mountain range.",
    "Starting from Sankri, the trail gradually follows the Supin River through the remote Tons Valley. One of the biggest highlights of the trek is Osla Village, an ancient Himalayan settlement known for its traditional wooden houses and unique local culture. As you move deeper into the valley, the landscape opens into vast meadows surrounded by towering Himalayan peaks.",
    "At around 11,500 ft, Har Ki Dun offers an incredible combination of mountain scenery, forests, rivers, meadows and village life. The trek also passes through the Govind Pashu Vihar National Park and Wildlife Sanctuary, making it a wonderful experience for nature and wildlife enthusiasts.",
    "What makes Har Ki Dun Trek special is that it is not just a mountain trek — it is a journey through the living culture and landscapes of the Himalayas. The peaceful trails, ancient villages, flowing rivers and dramatic mountain views make it an ideal choice for trekkers looking for an authentic Himalayan experience."
  ];

  TREKS[harKiDunIndex].highlights = [
    "Views of the Swargarohini range",
    "Ancient Himalayan village of Osla",
    "Pine, oak & deodar forests",
    "The Supin River valley",
    "Alpine meadows of Har Ki Dun",
    "Govind Pashu Vihar National Park"
  ];

  TREKS[harKiDunIndex].usps = [
    {
      title: "Stunning views of the Swargarohini range",
      description: "The valley sits directly beneath the Swargarohini massif, with the peaks visible for most of the walk from Osla onward."
    },
    {
      title: "Ancient Himalayan villages like Osla",
      description: "Traditional wooden houses, carved doorways and a way of life little changed for generations, on a route that still runs on foot and mule."
    },
    {
      title: "Forests of pine, oak and deodar",
      description: "The trail from Taluka to Gangar/Osla runs almost entirely under tree cover, alongside the Supin River."
    },
    {
      title: "The Supin River and open alpine meadows",
      description: "The valley trail follows the Supin upstream before opening into the wide meadows around Har Ki Dun itself, at roughly 11,500 ft."
    },
    {
      title: "Govind Pashu Vihar National Park",
      description: "The upper valley lies inside the national park and wildlife sanctuary, a bonus for anyone interested in Himalayan flora and fauna."
    },
    {
      title: "A rewarding trek for beginners with good fitness",
      description: "Graded easy to moderate, with 5–7 hours of walking a day, Har Ki Dun is an accessible introduction to a longer Himalayan valley trek."
    }
  ];

  TREKS[harKiDunIndex].destinationHighlights = [
    { name: "Sankri", blurb: "The trailhead village at about 6,400 ft, and the base camp for the trek." },
    { name: "Osla / Gangar", blurb: "A pair of ancient Himalayan villages along the Supin River, known for traditional wooden architecture." },
    { name: "Supin River Valley", blurb: "The river the trail follows for most of its length, through forest and open meadow." },
    { name: "Har Ki Dun Valley", blurb: "The high alpine valley at roughly 11,500 ft, ringed by the Swargarohini range." },
    { name: "Govind Pashu Vihar National Park", blurb: "The wildlife sanctuary the upper valley sits within, home to Himalayan flora and fauna." }
  ];

  TREKS[harKiDunIndex].differentiators = [
    "Region: Garhwal Himalayas, Uttarkashi district, Uttarakhand",
    "Trek type: valley trek — the destination is a high alpine valley, not a summit",
    "Terrain: forest trails, riverside paths, ancient villages and open meadows",
    "Best experience: Himalayan village culture alongside classic valley scenery"
  ];

  TREKS[harKiDunIndex].idealFor =
    "Trekkers aged 12–55 with moderate fitness — comfortable walking 6–8 km and building up to 10–12 km over 5–7 hours a day — looking for an authentic mix of Himalayan village culture and valley scenery.";

  TREKS[harKiDunIndex].importantNote =
    "Har Ki Dun climbs to roughly 11,500 ft, so build up your walking fitness before the trek and allow your body time to acclimatise on the way in. Trekkers under 18 must be accompanied by a parent or guardian, and anyone above 55 should carry a medical clearance and fitness assessment.";

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

  TREKS[harKiDunIndex].bookingAdvancePct = 20;

  // Cancellation policy mirrors Kedarkantha's, verbatim (per the trek team).
  TREKS[harKiDunIndex].bookingTerms = [
    { title: "Trek Cost", description: "₹10,999 + 5% GST* per selected package/departure date." },
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

  TREKS[harKiDunIndex].itinerary = [
    {
      day: 1,
      title: "Dehradun to Sankri",
      driveDistance: "190-200 km",
      drivingTime: "8-10 Hours",
      pickupPoint: "Dehradun",
      pickupTime: "6:00 AM",
      altitudePoints: [
        { location: "Dehradun", m: 640, ft: 2100 },
        { location: "Sankri", m: 1950, ft: 6400 }
      ],
      altitudeGain: { m: 1310, ft: 4300 },
      description: "An early morning drive from Dehradun to the base village of Sankri, along the Tons River valley.",
      detailedParagraphs: [
        "The trek begins with an early morning drive from Dehradun towards Sankri, covering roughly 190–200 km over 8–10 hours.",
        "The route runs via Mussoorie, Nainbagh/Naugaon, Purola, Mori and Netwar, following the Tons River valley deeper into the Garhwal Himalayas as the road climbs.",
        "On arrival, check into your hotel or homestay in Sankri, meet the rest of the trek team and get a briefing on the days ahead.",
        "Overnight stay in Sankri, with dinner included."
      ],
      highlights: ["Scenic Tons Valley Drive", "Mussoorie & Purola", "Sankri Village", "Trek Briefing"],
      meals: "Dinner",
      stayType: "Hotel / Homestay"
    },
    {
      day: 2,
      title: "Sankri to Taluka to Gangar/Osla",
      driveDistance: "12 km",
      trekDistance: "10-12 km",
      trekDuration: "5-6 Hours",
      altitudePoints: [
        { location: "Sankri", m: 1950, ft: 6400 },
        { location: "Gangar / Osla", m: 2450, ft: 8000 }
      ],
      altitudeGain: { m: 500, ft: 1600 },
      description: "Drive to the Taluka roadhead, then walk through forest along the Supin River to the ancient village of Gangar/Osla.",
      detailedParagraphs: [
        "After breakfast, drive from Sankri to Taluka, the roadhead where the trek on foot begins.",
        "From Taluka, the trail follows the Supin River through forests of pine, oak and deodar, passing a few small Himalayan settlements along the way.",
        "By the afternoon, reach the traditional village of Gangar/Osla, known for its wooden houses and centuries-old way of life.",
        "Overnight stay at Gangar/Osla."
      ],
      highlights: ["Taluka Roadhead", "Supin River Trail", "Pine & Oak Forest", "Osla Village"],
      meals: "Breakfast, Lunch & Dinner",
      stayType: "Camp / Homestay"
    },
    {
      day: 3,
      title: "Gangar/Osla to Har Ki Dun",
      trekDistance: "10-11 km",
      trekDuration: "6-7 Hours",
      altitudePoints: [
        { location: "Gangar / Osla", m: 2450, ft: 8000 },
        { location: "Har Ki Dun", m: 3505, ft: 11500 }
      ],
      altitudeGain: { m: 1055, ft: 3500 },
      description: "A long climb out of the forest into open meadows, with the Swargarohini range coming into view at the Har Ki Dun valley.",
      detailedParagraphs: [
        "Leave Gangar/Osla after breakfast and continue upstream along the Supin, with the trail gradually leaving the forest behind.",
        "As you gain height, the valley opens into meadows and streams, and the Swargarohini range starts to dominate the skyline ahead.",
        "Reach the Har Ki Dun campsite at around 11,500 ft by the evening, set right below the peaks.",
        "Overnight stay in tents at Har Ki Dun."
      ],
      highlights: ["Alpine Meadows", "Swargarohini Views", "Har Ki Dun Valley", "Himalayan Camping"],
      meals: "Breakfast, Lunch & Dinner",
      stayType: "Camp"
    },
    {
      day: 4,
      title: "Har Ki Dun Exploration Day",
      trekDistance: "4-6 km",
      trekDuration: "3-4 Hours",
      altitudePoints: [
        { location: "Har Ki Dun", m: 3505, ft: 11500 }
      ],
      altitudeGain: null,
      description: "A full day to explore the valley, its viewpoints and the close-up views of the Swargarohini range.",
      detailedParagraphs: [
        "Spend the day exploring the Har Ki Dun valley at a relaxed pace, with no packing up or moving camp.",
        "Walk up to the nearby viewpoints for closer views of the Swargarohini range and the surrounding peaks, with plenty of time for photography.",
        "Rest and acclimatise at the campsite, taking in the meadows, streams and mountain views around you.",
        "Overnight stay in tents at Har Ki Dun."
      ],
      highlights: ["Valley Viewpoints", "Swargarohini Close-Up", "Photography", "Rest & Acclimatisation"],
      meals: "Breakfast, Lunch & Dinner",
      stayType: "Camp"
    },
    {
      day: 5,
      title: "Har Ki Dun to Gangar/Osla",
      trekDistance: "10-11 km",
      trekDuration: "5-6 Hours",
      altitudePoints: [
        { location: "Har Ki Dun", m: 3505, ft: 11500 },
        { location: "Gangar / Osla", m: 2450, ft: 8000 }
      ],
      altitudeGain: null,
      description: "Retrace the trail back down through meadows and forest along the Supin River to Gangar/Osla.",
      detailedParagraphs: [
        "After breakfast, begin the descent from Har Ki Dun, retracing the trail back through the open meadows.",
        "The path drops back into the forest and follows the Supin River downstream towards Gangar/Osla.",
        "Reach the village by the afternoon, with time to rest and enjoy the surroundings once again.",
        "Overnight stay at Gangar/Osla."
      ],
      highlights: ["Descent Through Meadows", "Supin River", "Osla Village"],
      meals: "Breakfast, Lunch & Dinner",
      stayType: "Camp / Homestay"
    },
    {
      day: 6,
      title: "Gangar/Osla to Taluka to Sankri",
      trekDistance: "10-12 km",
      trekDuration: "5-6 Hours",
      driveDistance: "12 km",
      altitudePoints: [
        { location: "Gangar / Osla", m: 2450, ft: 8000 },
        { location: "Sankri", m: 1950, ft: 6400 }
      ],
      altitudeGain: null,
      description: "Complete the trek back to Taluka through the forest, then drive on to Sankri.",
      detailedParagraphs: [
        "Trek back from Gangar/Osla to the Taluka roadhead along the same forest trail beside the Supin River.",
        "From Taluka, drive back to Sankri, arriving with the trek on foot behind you.",
        "Spend the evening in Sankri, resting after six days on the trail.",
        "Overnight stay in Sankri."
      ],
      highlights: ["Forest Trail", "Taluka Roadhead", "Back to Sankri"],
      meals: "Breakfast, Lunch & Dinner",
      stayType: "Hotel / Homestay"
    },
    {
      day: 7,
      title: "Sankri to Dehradun",
      driveDistance: "190-200 km",
      drivingTime: "8-10 Hours",
      altitudePoints: [
        { location: "Sankri", m: 1950, ft: 6400 },
        { location: "Dehradun", m: 640, ft: 2100 }
      ],
      altitudeGain: null,
      description: "The return drive from Sankri to Dehradun, bringing the trip to a close.",
      detailedParagraphs: [
        "After an early breakfast, begin the drive back from Sankri to Dehradun.",
        "Retrace the route through Netwar, Mori, Purola and Mussoorie, with the trek and its memories behind you.",
        "The trip ends on arrival in Dehradun."
      ],
      highlights: ["Return Drive", "Trip Ends in Dehradun"],
      meals: "Breakfast",
      stayType: ""
    }
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

// Static details for Chopta with Auli (uid: chopta-with-auli), the 4-day
// Rishikesh-to-Rishikesh circuit combining Auli's ski slopes, the
// Tungnath-Chandrashila trek out of Chopta and the Deoria Tal lake trek, both
// staged from Sari Village. The source itinerary quotes two different pickup
// times (5:30 AM in "How to Reach", 6:30 AM on Day 1) and several overlapping
// distance/altitude figures for the same points — both are kept as published,
// flagged in `sourceCaveat`, and the driver confirms the exact pickup time.
const choptaWithAuliIndex = TREKS.findIndex(t => t.slug === 'chopta-with-auli');
if (choptaWithAuliIndex !== -1) {
  TREKS[choptaWithAuliIndex].maxAltitude = "13,000 ft / 4,000 m (Chandrashila Summit)";
  TREKS[choptaWithAuliIndex].totalDistance = "~16 km trekking (7 km Tungnath-Chandrashila, 4 km Deoria Tal, 3 km Gorson Bugyal in Auli, plus local walks)";
  TREKS[choptaWithAuliIndex].endLocation = "Rishikesh / Haridwar";
  TREKS[choptaWithAuliIndex].minAge = 7;
  TREKS[choptaWithAuliIndex].maxAge = 65;

  TREKS[choptaWithAuliIndex].aboutParagraphs = [
    "Chopta is not a town but a small forest meadow on the road to Tungnath, tucked inside the Kedarnath Wildlife Sanctuary in Rudraprayag district — pine, deodar and rhododendron forest on every side, which is why it is often called the Mini Switzerland of India. Auli, 45 km away in Chamoli district, is the opposite kind of landscape: wide open Bugyal meadows with a 270-degree Himalayan wall, and India's best-known ski resort.",
    "This 4-day, 3-night circuit runs Rishikesh to Auli/Joshimath to Sari Village to Chopta and back, so one day is spent walking to a Shiva temple and another walking on ski slopes. Tungnath, reached from Chopta, is the highest Shiva temple in the world at 3,680 m and one of the Panch Kedar — tradition holds that Lord Shiva's arms (bahu) appeared here after the Pandavas sought his forgiveness following the Mahabharata war, and that Lord Rama meditated at Chandrashila above it after defeating Ravana.",
    "Deoria Tal, a short trek from Sari Village, is a small lake that mirrors the Chaukhamba massif on clear mornings and is said to have been a stopping point for the Pandavas. Auli's Gorson Bugyal walk is flat meadow with Nanda Devi in view, and its ropeway — Asia's second highest — runs 4 km between Joshimath and Auli.",
    "This is a real Himalayan experience rather than a luxury tour: Chopta is a forest reserve with basic Swiss camps and dhabas, network is weak throughout (Jio works best), and Tungnath temple itself is closed November to April, though the trek stays open to the temple door for the winter snow trek."
  ];

  TREKS[choptaWithAuliIndex].highlights = [
    "Tungnath — world's highest Shiva Temple, one of the Panch Kedar",
    "Chandrashila 360° summit at 13,000 ft",
    "Deoria Tal — mirror lake reflecting Chaukhamba",
    "Auli's ski slopes & Asia's 2nd highest ropeway",
    "Gorson Bugyal meadows",
    "Ukhimath — the winter home of Kedarnath",
    "Views of Chaukhamba, Nanda Devi, Trishul & Kedar Dome"
  ];

  TREKS[choptaWithAuliIndex].usps = [
    {
      title: "Two Himalayas in one trip",
      description: "Chopta is forest and temple; Auli, 45 km away, is open Bugyal meadow with a 270-degree Himalayan wall — the itinerary gives you both landscapes across four days."
    },
    {
      title: "Tungnath — the highest Shiva temple in the world",
      description: "One of the Panch Kedar at 3,680 m (12,073 ft), reached on a 3.5 km paved trail from Chopta that most beginners complete in about two hours."
    },
    {
      title: "Chandrashila summit at 13,000 ft",
      description: "A further 1 km, steeper climb above Tungnath opens onto a 360-degree Himalayan panorama — Chaukhamba, Nanda Devi, Trishul, Kedar Dome, Bandarpoonch and more, weather permitting."
    },
    {
      title: "Deoria Tal, the mirror lake",
      description: "A 2 km trek from Sari Village to a small lake that reflects the Chaukhamba peak on clear mornings — a favourite for camping and photography."
    },
    {
      title: "Auli's ski slopes & ropeway",
      description: "Gorson Bugyal's flat meadow walk, an artificial high-altitude lake, and Asia's second-highest ropeway between Joshimath and Auli, best for skiing January-March."
    }
  ];

  TREKS[choptaWithAuliIndex].destinationHighlights = [
    { name: "Auli / Joshimath", blurb: "Chamoli district's ski resort at roughly 9,200 ft, with Gorson Bugyal meadows and a 4 km ropeway to Joshimath." },
    { name: "Sari Village", blurb: "The base village for Deoria Tal and the roadhead for the Chopta drive, roughly 25-30 km from Chopta." },
    { name: "Chopta", blurb: "The forest meadow at about 8,790 ft inside the Kedarnath Wildlife Sanctuary where the Tungnath trek begins." },
    { name: "Tungnath Temple", blurb: "The world's highest Shiva temple, at 3,680 m / 12,073 ft — one of the Panch Kedar, closed for worship November-April but open to trek to." },
    { name: "Chandrashila Summit", blurb: "The trip's highest point at roughly 13,000 ft / 4,000 m, with a 360-degree Himalayan panorama." },
    { name: "Deoria Tal", blurb: "A mirror lake at about 7,999 ft near Sari Village, reflecting the Chaukhamba massif on clear mornings." }
  ];

  TREKS[choptaWithAuliIndex].differentiators = [
    "Region: Rudraprayag & Chamoli districts, Uttarakhand — inside the Kedarnath Wildlife Sanctuary",
    "Route type: road + trek circuit — Auli, Chopta-Tungnath-Chandrashila and Deoria Tal in one 4-day trip",
    "Terrain: forest trails and stone-paved paths on the Tungnath climb, open Bugyal meadow at Auli",
    "Best season: March-June for green meadows and clear Himalayan views, December-February for the snow trek and skiing",
    "Monsoon: July-August is technically open but slippery, with leeches on the Deoria Tal trail and landslide risk on the Rishikesh-Chopta road — best avoided"
  ];

  TREKS[choptaWithAuliIndex].similarTreks = [
    "chopta-tungnath-trek",
    "deoriatal-chopta-trek",
    "auli-weekend-tour",
    "auli-snow-trip",
    "chakrata-winter-trip"
  ];

  TREKS[choptaWithAuliIndex].idealFor =
    "Weekend trekkers, beginners, couples, friends' groups, nature photographers, snow lovers and Shiva devotees (Tungnath is one of the Panch Kedar).";

  TREKS[choptaWithAuliIndex].importantNote =
    "There is no luxury on this route — Chopta is a forest reserve, and Swiss camps have attached washrooms but no heater. Network is weak throughout, with only Jio reliable at most points. Tungnath temple itself is closed November-April, though the trek to the temple door stays open and the winter snow trek is the main draw in that window. The Auli ropeway (~Rs 1,000 per person) is not included in the package and is bought directly on site, and is sometimes closed due to wind.";

  TREKS[choptaWithAuliIndex].sourceCaveat =
    "The published itinerary gives two different Day 1 pickup times from Rishikesh — 5:30 AM under \"How to Reach\" and 6:30 AM in the day-by-day plan — and lists overlapping figures for the same distances (e.g. Sari-Chopta as both 25 km and 30 km). Both are kept here as published; your trek leader will confirm the exact pickup time and route distances before departure.";

  TREKS[choptaWithAuliIndex].eligibilityCriteria = [
    { icon: "User", text: "Minimum age 7 (Deoria Tal & Auli; Tungnath-Chandrashila only if fit)" },
    { icon: "Users", text: "Maximum age 60 for Tungnath-Chandrashila, 65 for Auli & Deoria Tal only" },
    { icon: "Baby", text: "Children under 7 & adults above the age limit can still join for Chopta & Auli, staying at camp/hotel without trekking" },
    { icon: "HeartPulse", text: "Should avoid: serious asthma, heart problems, knee surgery in the last 6 months, high blood pressure or a recent fracture" },
    { icon: "ShieldAlert", text: "Pregnant women should avoid the steep final 1 km to the Chandrashila summit" }
  ];

  TREKS[choptaWithAuliIndex].fitnessCriteria = [
    { icon: "Footprints", text: "Able to walk 4-5 km continuously for about 2 hours without support" },
    { icon: "TrendingUp", text: "Able to climb 3 floors of stairs without heavy breathing" },
    { icon: "Mountain", text: "No mountaineering skills needed — the Tungnath trail is a paved stone path" },
    { icon: "Stethoscope", text: "Diabetes, asthma, epilepsy or serious allergies should be shared with the team before booking — nearest hospitals are in Ukhimath (20 km) and Joshimath (45 km)" }
  ];

  TREKS[choptaWithAuliIndex].howToReach = {
    intro: "Chopta with Auli starts and ends at Rishikesh / Haridwar, with pickup at 5:30-6:30 AM on Day 1.",
    air: {
      summaryLabel: "Nearest Airport",
      summary: "Jolly Grant Airport, Dehradun (DED)",
      detail: "About 35 km from Rishikesh, with daily flights from Delhi, Mumbai and Bengaluru. From the airport, a taxi to Rishikesh takes around an hour."
    },
    train: {
      summaryLabel: "Nearest Railway Station",
      summary: "Haridwar Junction (HW)",
      detail: "The best-connected railhead, with trains from Delhi (about 6 hours), Mumbai, Kolkata and Lucknow. From Haridwar, Rishikesh is a further 25 km by auto or bus."
    },
    road: {
      summaryLabel: "Route",
      summary: "Rishikesh to Auli/Joshimath to Sari Village to Chopta and back",
      route: ["Rishikesh", "Devprayag", "Srinagar", "Rudraprayag", "Karnprayag", "Joshimath / Auli", "Sari Village", "Chopta"],
      facts: [
        { label: "Rishikesh - Auli/Joshimath", value: "270 km / 10-11 hrs" },
        { label: "Auli/Joshimath - Sari Village", value: "150 km / 6-7 hrs" },
        { label: "Sari - Chopta (one way)", value: "25-30 km / 1.5 hrs" },
        { label: "Sari - Rishikesh (return)", value: "220 km / 8-9 hrs" }
      ],
      options: [
        { from: "Delhi ISBT Kashmiri Gate", name: "Volvo / overnight bus to Rishikesh / Haridwar", note: "6-7 hours, ~Rs 600-1200" }
      ]
    },
    pickup: {
      point: "Rishikesh (Tapovan / Laxman Jhula) & Haridwar Railway Station",
      time: "5:30-6:30 AM on Day 1",
      dropPoint: "Rishikesh / Haridwar",
      dropTime: "6-8 PM on Day 4",
      note: "Driver's number is shared one day before departure."
    }
  };

  TREKS[choptaWithAuliIndex].inclusions = [
    { title: "Transport", description: "Rishikesh to Rishikesh by car / Tempo Traveller, including toll, parking and driver charges." },
    { title: "Stay", description: "3 nights — 1 night Joshimath/Auli + 2 nights Sari Village (hotel / homestay, triple / quad sharing)." },
    { title: "Meals", description: "3 breakfasts + 3 dinners (vegetarian)." },
    { title: "Trek support", description: "Guide for the Tungnath-Chandrashila and Deoria Tal treks, plus forest entry fees." },
    { title: "Local support", description: "Local team based out of Ukhimath, with oxygen and first-aid carried in winter." }
  ];

  TREKS[choptaWithAuliIndex].exclusions = [
    { title: "Lunch", description: "Lunch on all 4 days is on your own." },
    { title: "Auli Ropeway & skiing", description: "Ropeway ticket (~Rs 1,000 per person) and skiing are paid directly on site." },
    { title: "Horse / Pony / Porter", description: "Available locally at Chopta and Deoria Tal for an extra charge." },
    { title: "Heater / hot water", description: "Room heater or hot water bucket, where available, is payable directly." },
    { title: "GST", description: "5% GST as applicable." },
    { title: "Bonfire", description: "Bonfire at the campsite, if arranged, is chargeable separately." }
  ];

  TREKS[choptaWithAuliIndex].itinerary = [
    {
      day: 1,
      title: "Rishikesh to Auli / Joshimath",
      driveDistance: "270 km",
      drivingTime: "10-11 Hours",
      pickupPoint: "Rishikesh / Haridwar",
      pickupTime: "6:30 AM",
      altitudePoints: [
        { location: "Rishikesh", m: 372, ft: 1220 },
        { location: "Joshimath", m: 1875, ft: 6150 },
        { location: "Auli", m: 2800, ft: 9200 }
      ],
      altitudeGain: { m: 1500, ft: 5000 },
      description: "The longest drive of the trip, along the Alaknanda river via Devprayag, Srinagar, Rudraprayag and Karnprayag to Joshimath / Auli.",
      detailedParagraphs: [
        "Pickup is at 6:30 AM from Rishikesh, with the driver also collecting trekkers from Tapovan and Haridwar Railway Station. Today is the longest drive of the trip, but also one of the most scenic — around 200 km of it runs alongside the Alaknanda river.",
        "The route runs Rishikesh - Devprayag (the confluence of the Alaknanda and Bhagirathi) - Srinagar - Rudraprayag - Karnprayag - Chamoli - Joshimath, with a lunch break on your own around Srinagar or Rudraprayag.",
        "You should reach Joshimath by around 5:00 PM. If time and weather allow, the Auli ropeway can be taken the same evening (last ropeway around 5:30 PM in summer, 4:30 PM in winter).",
        "Overnight at a hotel in Joshimath / Auli — staying in Auli itself means a further short drive by small car from Joshimath."
      ],
      highlights: ["Alaknanda River Drive", "Devprayag Confluence", "Auli Ropeway (optional, evening)"],
      meals: "Dinner",
      stayType: "Hotel — Joshimath / Auli"
    },
    {
      day: 2,
      title: "Auli sightseeing, then drive to Sari Village",
      trekDistance: "3 km",
      trekDuration: "1-2 Hours",
      driveDistance: "150 km",
      drivingTime: "6-7 Hours",
      altitudePoints: [
        { location: "Auli", m: 2800, ft: 9200 },
        { location: "Sari Village", m: 1920, ft: 6300 }
      ],
      altitudeGain: { m: -880, ft: -2900 },
      description: "A sunrise on Nanda Devi, the Gorson Bugyal meadow walk and Auli's ropeway point, before the drive down to Sari Village via Ukhimath.",
      detailedParagraphs: [
        "An early wake-up for sunrise over Nanda Devi is the highlight of an Auli morning. From around 7:00 to 11:00 AM, explore the Gorson Bugyal trek — a 3 km round-trip flat meadow walk with Nanda Devi, Mana Parvat and Hathi Ghoda visible on a clear day — plus Auli's artificial high-altitude lake and the ropeway viewpoint.",
        "The ropeway itself (4 km, Joshimath to Auli) is not included and costs around Rs 1,000 per person, paid directly at the counter.",
        "Around 11:30 AM, drive from Auli / Joshimath to Sari Village via Chamoli, Gopeshwar and Ukhimath — the winter home of Kedarnath — reaching Sari by around 6:00 PM. Sari is a small village and the base for the Deoria Tal trek; network is weak, with only Jio working reliably.",
        "Overnight at a homestay / hotel in Sari Village. Basing here for two nights avoids daily packing, since both Chopta and Deoria Tal are within reach from Sari."
      ],
      highlights: ["Nanda Devi Sunrise", "Gorson Bugyal Walk", "Auli Ropeway Point", "Ukhimath — Winter Home of Kedarnath"],
      meals: "Breakfast, Dinner",
      stayType: "Homestay / Hotel — Sari Village"
    },
    {
      day: 3,
      title: "Sari to Chopta, trek to Tungnath & Chandrashila, back to Sari",
      driveDistance: "60 km (round trip)",
      drivingTime: "3 Hours",
      trekDistance: "7-9 km",
      trekDuration: "5-6 Hours",
      timeNote: { label: "Trek start", value: "6:30 AM" },
      altitudePoints: [
        { location: "Sari Village", m: 1920, ft: 6300 },
        { location: "Chopta", m: 2680, ft: 8790 },
        { location: "Tungnath Temple", m: 3680, ft: 12073 },
        { location: "Chandrashila Summit", m: 4000, ft: 13000 }
      ],
      altitudeGain: { m: 2080, ft: 6700 },
      description: "The main trek day — Chopta to Tungnath, the world's highest Shiva temple, and on to the Chandrashila summit at 13,000 ft, before returning to Sari.",
      detailedParagraphs: [
        "An early 5:00 AM start for the 25-30 km drive from Sari to Chopta (about 1.5 hours), the last stretch running through the Kedarnath Wildlife Sanctuary with no shops, only forest.",
        "From Chopta (2,680 m), the 3.5 km trek to Tungnath Temple runs on a well-marked, mostly paved stone path — rhododendron forest in March-April, snow underfoot in December-February — and takes most trekkers about two hours. Tungnath (3,680 m) is the world's highest Shiva temple and one of the Panch Kedar; it is closed for worship November-April, but the trek stays open to the temple door.",
        "A further 1 km, steeper 45-minute climb from Tungnath reaches the Chandrashila summit at roughly 4,000 m / 13,000 ft — the trip's highest point and its main viewpoint, with a 360-degree panorama of Chaukhamba, Nanda Devi, Trishul, Kedar Dome, Bandarpoonch and more on a clear day.",
        "Retrace the route back down to Chopta for lunch on your own (Maggi, paratha available at the dhabas), then drive back to Sari Village by early afternoon. Overnight at the same homestay in Sari."
      ],
      highlights: ["Tungnath — World's Highest Shiva Temple", "Panch Kedar", "Chandrashila 360° Summit", "Chaukhamba & Nanda Devi Views"],
      meals: "Breakfast, Dinner",
      stayType: "Homestay / Hotel — Sari Village"
    },
    {
      day: 4,
      title: "Deoria Tal trek, then drive back to Rishikesh",
      trekDistance: "4 km",
      trekDuration: "1.5-2 Hours",
      driveDistance: "220 km",
      drivingTime: "8-9 Hours",
      timeNote: { label: "Trek start", value: "6:00 AM" },
      altitudePoints: [
        { location: "Sari Village", m: 1920, ft: 6300 },
        { location: "Deoria Tal", m: 2438, ft: 7999 },
        { location: "Rishikesh", m: 372, ft: 1220 }
      ],
      altitudeGain: { m: 518, ft: 1700 },
      description: "An early morning trek to Deoria Tal, the lake that mirrors Chaukhamba, before the long drive back to Rishikesh via Ukhimath, Rudraprayag, Srinagar and Devprayag.",
      detailedParagraphs: [
        "A 6:00 AM start for the 2 km, roughly 45-minute uphill trek from Sari to Deoria Tal (2,438 m) — mules and horses are available if needed. On clear mornings the lake reflects the Chaukhamba massif like a mirror; local tradition holds the Pandavas stopped here during their exile. Spend about an hour at the lake before the 2 km walk back down to Sari.",
        "Breakfast at the homestay, then depart around 10:00 AM for Rishikesh, via Ukhimath, Rudraprayag, Srinagar and Devprayag, with a lunch break on your own around Srinagar.",
        "Drop-off at Rishikesh / Haridwar is between 6:00 and 8:00 PM, where the tour ends."
      ],
      highlights: ["Deoria Tal Mirror Lake", "Chaukhamba Reflection", "Return Drive via Ukhimath"],
      meals: "Breakfast",
      stayType: "Tour ends — no overnight"
    }
  ];

  TREKS[choptaWithAuliIndex].faqs = [
    {
      title: "What is the day-wise itinerary?",
      description: "Day 1: Rishikesh to Joshimath/Auli. Day 2: Auli sightseeing, then drive to Sari Village. Day 3: Sari to Chopta, trek to Tungnath and Chandrashila, back to Sari. Day 4: Deoria Tal trek, then return to Rishikesh."
    },
    {
      title: "What is the pickup and drop location?",
      description: "Pickup is at 6 AM on Day 1 from Rishikesh (Tapovan / Laxman Jhula) and Haridwar Railway Station; drop is between 6 and 8 PM on Day 4 at the same points. The driver's number is shared a day before departure."
    },
    {
      title: "How much is the distance covered?",
      description: "Rishikesh to Auli is 270 km (10-11 hrs), Auli to Sari is 150 km (6-7 hrs), Sari to Chopta is 25-30 km (1.5 hrs), and Sari to Rishikesh on return is 220 km (8-9 hrs)."
    },
    {
      title: "Is the Auli ropeway included?",
      description: "No. It costs about Rs 1,000 per person, paid directly at the Joshimath ropeway counter, and can be closed due to wind. The road option by car is always available and included in the package."
    },
    {
      title: "Is the Tungnath trek difficult?",
      description: "No. The 3.5 km Chopta-to-Tungnath stretch is an easy, paved path (about 2 hours); the 1 km Tungnath-to-Chandrashila climb is steeper (about 45 minutes). Beginners, kids (8+ years) and seniors can generally manage it, and pony hire is available for roughly Rs 1,000-1,500."
    },
    {
      title: "Can we do this trip in the December-January snow season?",
      description: "Yes — it's a popular time for the snow trek, and the trip runs all year with gaiters provided. Tungnath temple is closed November-April, but the trek to the temple gate stays open, and Auli skiing is possible in January-February."
    },
    {
      title: "What type of accommodation is provided?",
      description: "A hotel with attached washroom in Joshimath, a resort / camp in Auli, and a homestay with attached washroom and home-cooked food in Sari. This is a forest area without luxury hotels — the stay is clean and comfortable rather than upscale."
    },
    {
      title: "Will my mobile network work?",
      description: "Only Jio is reliable across Auli, Sari and Chopta; Airtel/Vi work only in Joshimath. There is no network on the trek itself, so let family know in advance."
    }
  ];

  TREKS[choptaWithAuliIndex].article = {
    title: "Chopta Auli: Where a Forest Temple Meets a Ski Slope",
    standfirst: "A 4-day circuit from Rishikesh covering Auli's meadows, the world's highest Shiva temple and a mirror lake that reflects the Chaukhamba massif.",
    readMinutes: 7,
    sections: [
      {
        paragraphs: [
          "Chopta is not a town — it is a small forest meadow on the road to Tungnath, inside the Kedarnath Wildlife Sanctuary in Rudraprayag district, ringed by pine, deodar and rhododendron. Two kilometres in, you are deep in jungle; two kilometres further, you are on a Himalayan top. That contrast is why it is often called the Mini Switzerland of India.",
          "Auli, 45 km away in Chamoli district, is a different kind of Himalaya — wide open Bugyal meadows under a 270-degree wall of peaks, and India's best-known ski resort. Together, Chopta and Auli make a natural 4-day trip: one day you trek to a Shiva temple, the next you walk on ski slopes."
        ]
      },
      {
        heading: "The mythology of Tungnath",
        paragraphs: [
          "Tungnath is the highest Shiva temple in the world, at 3,680 m, and one of the Panch Kedar. Tradition holds that after the Mahabharata war, the Pandavas sought Lord Shiva's forgiveness for killing their kin; Shiva evaded them by taking the form of a bull, and when finally caught, his body parts are said to have appeared at five different places. His arms (bahu) appeared at Tungnath — hence the name.",
          "Chandrashila, the peak above Tungnath, is where Lord Rama is said to have meditated after defeating Ravana. On a clear day, the summit offers a view across much of Uttarakhand's Himalayan range."
        ]
      },
      {
        heading: "The forest at Chopta",
        paragraphs: [
          "Chopta has no market, no noise and very little network — just a handful of camps and dhabas inside the forest. In March-April the trail turns red with buransh (rhododendron) blooms; in December-January the same trail carries two to three feet of snow. The path is stone-laid and well marked, so there's little risk of losing the way."
        ]
      },
      {
        heading: "Tungnath and Chandrashila, on foot",
        paragraphs: [
          "The 3.5 km climb to Tungnath is paved and manageable for most beginners in around two hours. The final 1 km to Chandrashila is steeper, and this is where the view opens up — at 4,000 m you can see seven major peaks, including Chaukhamba, Nanda Devi (India's second-highest peak), Trishul and Kedar Dome."
        ]
      },
      {
        heading: "Deoria Tal, the mirror lake",
        paragraphs: [
          "A 2 km trek from Sari Village leads to Deoria Tal, a small lake that reflects the Chaukhamba peak almost perfectly on clear mornings. It is one of the best spots on the route for camping and photography, and local tradition places the Pandavas here during their exile."
        ]
      },
      {
        heading: "Auli, the meadow",
        paragraphs: [
          "Unlike forested Chopta, Auli is wide open. The Gorson Bugyal walk is 3 km of flat meadow with Nanda Devi visible straight ahead, and in winter (January-March) the same slopes become a ski run. Auli also has Asia's second-highest ropeway, a 4 km line connecting Joshimath and Auli."
        ]
      },
      {
        heading: "What to expect, honestly",
        paragraphs: [
          "There is no luxury here — this is a forest reserve, not a hill-station resort. Swiss camps at Chopta have attached washrooms but no heater, and network coverage is weak throughout, with only Jio reliable at most points.",
          "Tungnath temple is closed to worship from November to April, though the trek stays open to the temple door and the winter snow trek is the main draw in that season. The Auli ropeway (around Rs 1,000 per person) is bought directly on site and is not part of any package, and it is sometimes closed due to wind.",
          "Chopta Auli isn't a luxury tour — it's forest, trek, temple, meadow and lake, in that order."
        ]
      }
    ]
  };
}

// Static details for the Kanatal Winter Trip (uid: kanatal-winter-trip), a
// 3-day, 2-night Dehradun-to-Dehradun circuit covering Kanatal itself,
// Surkanda Devi temple, Kaudia forest, Dhanaulti and Tehri Lake. Sourced from
// an ops-supplied write-up (overview, detailed itinerary, eligibility,
// article, FAQs, how-to-reach and package terms). The source publishes no
// fixed price, gives Tehri Lake's distance from Kanatal as both 35 km and
// 40 km, and lists its "Similar" trips with a "Chopra with auli" entry that
// evidently means the existing "Chopta with Auli" listing — all three are
// flagged in `sourceCaveat` and resolved as noted there.
const kanatalIndex = TREKS.findIndex(t => t.slug === 'kanatal-winter-trip');
if (kanatalIndex !== -1) {
  TREKS[kanatalIndex].maxAltitude = "9,000 ft / 2,743 m (Surkanda Devi Temple)";
  TREKS[kanatalIndex].totalDistance = "~7 km walking (2 km Surkanda Devi trek, 5 km Kaudia Forest nature walk), both optional";
  TREKS[kanatalIndex].endLocation = "Dehradun / Rishikesh / Haridwar";
  TREKS[kanatalIndex].minAge = 1;
  TREKS[kanatalIndex].maxAge = 75;
  TREKS[kanatalIndex].availability = "Departs every Saturday from Dehradun; open all 12 months of the year.";

  TREKS[kanatalIndex].intro =
    "Kanatal is a small, offbeat hill station in the Tehri Garhwal district of Uttarakhand, at an altitude of approximately 8,500 ft (2,590 m). Situated 75 km from Dehradun and 38 km from Mussoorie on the Chamba-Mussoorie road, it is surrounded by dense oak, pine and deodar forests with views of snow-clad Himalayan ranges. Unlike Mussoorie or Nainital, Kanatal is not crowded — there are no malls or markets, only peace, forests, apple orchards and mountains, with Bandarpoonch, Srikantha and Jaonli peaks visible on a clear day.";

  TREKS[kanatalIndex].aboutParagraphs = [
    "Kanatal is one of the most peaceful and offbeat hill stations in Uttarakhand and one of the best weekend getaways from Dehradun and Delhi. It sits at roughly 8,500 ft (2,590 m) on the Mussoorie-Chamba road, surrounded by dense oak, pine and deodar forest with open views of Himalayan peaks. Just 38 km from Mussoorie and 75 km from Dehradun, it is nonetheless a different world from Mussoorie — no mall road, no crowd, no traffic, only forest camps, apple orchards, cottages and mountain silence. It was almost unknown until a few years ago, which is why it remains clean and untouched.",
    "The drive in passes through the Kaudia forest, a 5 km stretch of thick pine and deodar ideal for jungle trekking and bird watching. Five kilometres further is Kaddukhal village, from where a 2 km steep trek climbs to Surkanda Devi Temple — one of the 51 Shakti Peethas of India, at 9,000 ft, with a 360-degree view of the Dehradun valley on one side and Bandarpoonch, Swargarohini and Srikantha peaks on the other.",
    "Kanatal is also known as the adventure capital near Mussoorie. Almost every camp and resort here offers zip-lining, valley crossing, rock climbing, rappelling, Burma bridge, sky cycling and trekking, alongside nature walks and Himalayan sunrise views for families and couples.",
    "It stays open all year, and each season has a different character: summer (March-June) for camping and adventure, monsoon (July-September) for greenery, winter (December-February) for 3-4 ft of snowfall that turns Kanatal into a mini Kashmir perfect for snow camping, and autumn (September-November) for the clearest Himalayan views."
  ];

  TREKS[kanatalIndex].highlights = [
    "Surkanda Devi Temple — one of 51 Shakti Peethas at 9,000 ft, 360° Himalayan view",
    "Kaudia Forest — 5 km jungle trek, bird watching",
    "Adventure camps — zip-lining, valley crossing, rock climbing, rappelling, sky bridge",
    "Tehri Lake — Asia's largest dam, water sports 35-40 km away",
    "Dhanaulti Eco Park — deodar forest trails, 13 km from Kanatal",
    "Winter snowfall of 3-4 ft, turning Kanatal into a mini Kashmir"
  ];

  TREKS[kanatalIndex].usps = [
    {
      title: "Offbeat, not crowded",
      description: "38 km from Mussoorie but a different world — no mall road, no traffic, just forest camps, apple orchards and mountain silence."
    },
    {
      title: "Surkanda Devi Temple",
      description: "A 2 km trek (or ropeway) from Kaddukhal to one of the 51 Shakti Peethas at 9,000 ft, with a 360° view spanning the Dehradun valley and the Bandarpoonch, Swargarohini and Srikantha peaks."
    },
    {
      title: "Adventure capital near Mussoorie",
      description: "Zip-lining, valley crossing, rock climbing, rappelling, Burma bridge and sky cycling are on offer at almost every camp here."
    },
    {
      title: "Tehri Lake combination",
      description: "Just 35-40 km away, one of Asia's largest dams adds jet skiing, banana boat rides and paramotoring to a trip that starts in pine forest."
    },
    {
      title: "Open all year, differently each season",
      description: "Pleasant camping weather March-June, greenery in the monsoon, clear Himalayan views September-November, and 3-4 ft of snow December-February."
    }
  ];

  TREKS[kanatalIndex].destinationHighlights = [
    { name: "Kanatal", blurb: "The hill station itself, at roughly 8,500 ft on the Mussoorie-Chamba road, ringed by oak, pine and deodar forest." },
    { name: "Kaudia Forest", blurb: "A 5 km stretch of dense pine and deodar forest en route, best for a nature walk, bird watching or a Gypsy safari." },
    { name: "Surkanda Devi Temple", blurb: "One of the 51 Shakti Peethas of India at 9,000 ft (2,743 m), reached by a 2 km trek or ropeway from Kaddukhal village." },
    { name: "Dhanaulti Eco Park", blurb: "13 km from Kanatal — two parks (Amber and Dhara) with manicured deodar trails and paid adventure activities." },
    { name: "Tehri Lake", blurb: "35-40 km from Kanatal, built around one of Asia's largest dams, with boating and water-sports activities on direct payment." }
  ];

  TREKS[kanatalIndex].differentiators = [
    "Region: Tehri Garhwal district, Uttarakhand, on the Chamba-Mussoorie road at ~8,500 ft (2,590 m)",
    "Route type: road trip with two short optional treks — Surkanda Devi (2 km) and Kaudia Forest (5 km)",
    "Terrain: oak, pine and deodar forest throughout; no technical trekking anywhere on the route",
    "Best season: open all year — March-June for camping, September-November for clear views, December-February for snow",
    "Not for shopping or nightlife: no mall road or big market; the nearest shopping is in Mussoorie"
  ];

  TREKS[kanatalIndex].idealFor =
    "Couples wanting a quiet stay away from the Mussoorie crowd, families with kids on a weekend getaway, corporate groups and students on camping and adventure trips, and friends' groups after a bonfire plus Tehri Lake water sports.";

  TREKS[kanatalIndex].importantNote =
    "Kanatal has no mall road or market — only small tea shops and Maggi points — so it suits peace lovers rather than shoppers or nightlife seekers; for shopping, Mussoorie is the nearest option. Jio, Airtel and BSNL all work well (4G), but there is no large ATM nearby (the nearest is at Chamba/Mussoorie), so carry cash. In peak winter (December-January) temperatures fall to -2 to 3°C with heavy snow, which can be difficult for anyone with severe breathing issues, and the Surkanda Devi trek (though not the resort stay) is not suited to wheelchair users.";

  TREKS[kanatalIndex].sourceCaveat =
    "The source write-up gives Tehri Lake's distance from Kanatal as both 35 km (in the overview) and 40 km (elsewhere) — both figures are kept as published. It publishes no fixed package price, so none is shown here; contact the trips desk for current rates. Its list of similar trips includes an entry reproduced verbatim as \"Chopra with auli\", which is treated here as referring to the existing Chopta with Auli listing.";

  TREKS[kanatalIndex].eligibilityCriteria = [
    { icon: "User", text: "No official age limit — suitable from 1 to 75+ years" },
    { icon: "Baby", text: "Very safe for kids; adventure activities are available from age 6+" },
    { icon: "Users", text: "Senior citizens can visit comfortably — no compulsory long walking, and the Surkanda Devi trek can be swapped for the ropeway" },
    { icon: "HeartPulse", text: "Zero to minimal fitness required — Kanatal itself demands no trekking fitness" },
    { icon: "ShieldAlert", text: "Not ideal for wheelchair users on the Surkanda Devi trek, though the resort stay itself is fine" },
    { icon: "IdCard", text: "No permit or Yatra registration needed — just an Aadhaar card or ID for hotel check-in" }
  ];

  TREKS[kanatalIndex].fitnessCriteria = [
    { icon: "Footprints", text: "Normal walking only for the Kanatal stay and Dhanaulti Eco Park" },
    { icon: "TrendingUp", text: "Kaudia Forest's 5 km nature walk is optional and can be skipped" },
    { icon: "Mountain", text: "Surkanda Devi's 2 km steep trek is optional — a ropeway/cable car covers the same climb" },
    { icon: "Waves", text: "Tehri Lake activities are boat-based, with no trekking involved" }
  ];

  TREKS[kanatalIndex].howToReach = {
    intro: "Kanatal starts and ends at Dehradun, about 75-80 km / 2.5-3 hours away by road.",
    air: {
      summaryLabel: "Nearest Airport",
      summary: "Jolly Grant Airport, Dehradun (DED)",
      detail: "About 25 km from Dehradun city and roughly 70 km / 2 hours direct from Kanatal, with daily flights from Delhi (50 min), Mumbai, Bengaluru, Hyderabad, Kolkata, Chennai, Jaipur, Ahmedabad, Lucknow and Pune. From the airport, a taxi to the city costs about Rs 800-1,200."
    },
    train: {
      summaryLabel: "Nearest Railway Station",
      summary: "Dehradun Railway Station / Dehradun Junction (DDN)",
      detail: "Connected to major cities across India. Autos, Vikrams and taxis run from the station to the city centre and to ISBT."
    },
    road: {
      summaryLabel: "Route",
      summary: "Dehradun to Kanatal via Mussoorie, Kempty Fall and Suakholi",
      route: ["Dehradun", "Mussoorie", "Kempty Fall", "Suakholi", "Kanatal"],
      facts: [
        { label: "Delhi - Dehradun", value: "250 km / 6-7 hrs" },
        { label: "Dehradun - Kanatal", value: "75-80 km / 2.5-3 hrs" },
        { label: "Chandigarh - Dehradun", value: "170 km / 4-5 hrs" },
        { label: "Haridwar / Rishikesh - Dehradun", value: "55 km / 45 km, ~1.5 hrs" }
      ],
      options: [
        { from: "Delhi Kashmere Gate ISBT / Anand Vihar / Noida", name: "Govt. (Uttarakhand Roadways, UPSRTC) and private AC / Volvo / sleeper buses to Dehradun ISBT", note: "6-7 hours; night Volvos (10:30 PM-5:00 AM) are the most popular" }
      ]
    },
    pickup: {
      point: "Dehradun Airport / Railway Station / ISBT",
      time: "9:00 AM on Day 1",
      dropPoint: "Dehradun / Rishikesh / Haridwar",
      dropTime: "5:00-6:00 PM on Day 3",
      note: "The return route on Day 3 runs via Tehri Lake."
    }
  };

  TREKS[kanatalIndex].inclusions = [
    { title: "Stay", description: "2 nights in Kanatal — eco-resort / Swiss tent camp / cottage, on triple / quad sharing, with attached washroom and mountain view." },
    { title: "Transport", description: "Pick-up and drop from Dehradun Airport / Railway Station / ISBT; all transfers and sightseeing by private car (sedan for 2-3 pax, Innova/Ertiga for 4-6 pax, Tempo Traveller for 7+ pax), including driver allowance, toll, parking, fuel and state taxes." },
    { title: "Meals", description: "2 breakfasts and 2 dinners at the hotel/camp (vegetarian, North Indian) on the MAP plan." },
    { title: "Sightseeing", description: "Kanatal village and apple-orchard walk, Surkanda Devi Temple (drive to Kaddukhal), Kaudia Forest nature walk, Dhanaulti Eco Park and Kempty Falls en route, plus the Tehri Lake viewpoint." }
  ];

  TREKS[kanatalIndex].exclusions = [
    { title: "Lunch", description: "Lunch on all days is on your own." },
    { title: "Surkanda Devi Ropeway", description: "Ropeway/cable car ticket, if taken instead of the trek, is paid directly." },
    { title: "Dhanaulti Eco Park entry", description: "Rs 25 per person, paid at the gate." },
    { title: "Adventure activities", description: "Zip-lining, sky cycling, valley crossing and similar activities are paid directly at the camp/resort." },
    { title: "Tehri Lake water sports", description: "Jet ski, banana boat, speed boat and paramotoring are booked and paid directly at the lake counter." },
    { title: "Kaudia Forest Jeep safari", description: "Rs 1,500-2,000 per jeep (4-5 pax), if opted for instead of the walking nature trail." },
    { title: "Personal expenses", description: "Mineral water, cold drinks, snacks, laundry and tips." },
    { title: "Insurance & anything unmentioned", description: "Travel insurance, medical expenses, and anything not specifically listed under inclusions." }
  ];

  TREKS[kanatalIndex].itinerary = [
    {
      day: 1,
      title: "Arrival & mountain serenity — Dehradun to Kanatal",
      driveDistance: "80 km",
      drivingTime: "2.5-3 Hours",
      pickupPoint: "Dehradun Airport / Railway Station / ISBT",
      pickupTime: "9:00 AM",
      altitudePoints: [
        { location: "Dehradun", m: 435, ft: 1427 },
        { location: "Kanatal", m: 2590, ft: 8500 }
      ],
      altitudeGain: { m: 2155, ft: 7073 },
      description: "A scenic drive from Dehradun via Mussoorie, Kempty Fall and Suakholi into pine forest, followed by check-in, a village walk and dinner under the stars.",
      detailedParagraphs: [
        "Pickup from Dehradun Airport / Railway Station / ISBT is at 9:00 AM. The drive to Kanatal runs via Mussoorie, Kempty Fall and Suakholi — through pine forest, with the temperature visibly dropping as the road climbs. The 80 km stretch takes about 2.5 to 3 hours.",
        "Check in to your eco-resort / Swiss tent camp / hotel / homestay in the afternoon, with a welcome drink and hot snacks, then rest for a while and take in the Himalayan view from the balcony.",
        "In the late afternoon, take a slow, self-guided stroll on quiet village trails behind the property, through apple orchards and pine forest, or explore Kanatal's small market of Maggi points and tea stalls — a good window for sunset photography.",
        "Dinner is at the cozy campsite under a starlit sky, with light snacks around 8:00 PM and dinner following around 8:30 PM. Overnight stay in Kanatal."
      ],
      highlights: ["Mussoorie - Kempty Fall - Suakholi Scenic Drive", "Village Walk & Apple Orchards", "Bonfire Under a Starlit Sky"],
      meals: "Dinner",
      stayType: "Eco-Resort / Swiss Tent Camp / Hotel / Homestay — Kanatal"
    },
    {
      day: 2,
      title: "Panoramic views & forest safari — Kanatal local sightseeing",
      driveDistance: "~40 km (round trip)",
      drivingTime: "2-3 Hours",
      trekDistance: "2 km (Surkanda Devi, optional) + 5 km (Kaudia Forest, optional)",
      trekDuration: "45 min (Surkanda Devi) + 1.5 hrs (Kaudia Forest)",
      timeNote: { label: "Start", value: "8:00 AM" },
      altitudePoints: [
        { location: "Kanatal", m: 2590, ft: 8500 },
        { location: "Surkanda Devi Temple", m: 2743, ft: 9000 }
      ],
      altitudeGain: { m: 153, ft: 500 },
      description: "Surkanda Devi Temple by trek or ropeway, a Kaudia Forest nature walk or jeep safari, and adventure activities at Dhanaulti Eco Park, before returning to Kanatal.",
      detailedParagraphs: [
        "After breakfast, drive 5 km to Kaddukhal (about 15 minutes). From there, reach Surkanda Devi Temple at 9,000 ft either by a 2 km uphill trek (about 45 minutes, moderate) or by ropeway / cable car. The temple, one of the 51 Shakti Peethas, offers a 360-degree panoramic view — Bandarpoonch, Swargarohini and the Gangotri range on one side, the Dehradun valley on the other. Darshan and a tea break follow at the top.",
        "Drive down about 10 minutes to the Kaudia Forest entry, a dense, pristine stretch of pine and deodar. Choose between a 5 km guided nature walk (about 1.5 hours, good for bird watching, barking deer and wild orchids) or an open 4x4 Gypsy safari through the same forest.",
        "Drive a further 30 minutes to Dhanaulti (13 km) and visit Dhanaulti Eco Park — two parks, Amber and Dhara, with manicured trails through deodar trees. Adventure activities are available here at your own cost, including a 400 m zipline, sky cycling, valley crossing, Burma bridge and rock climbing.",
        "Return to your Kanatal stay in the evening to relax over another dinner. Overnight stay in Kanatal."
      ],
      highlights: ["Surkanda Devi Temple — 51 Shakti Peethas", "Kaudia Forest Nature Walk / Jeep Safari", "Dhanaulti Eco Park Adventure Zone"],
      meals: "Breakfast, Dinner",
      stayType: "Eco-Resort / Swiss Tent Camp / Hotel / Homestay — Kanatal"
    },
    {
      day: 3,
      title: "Tehri Dam adventure & departure — Kanatal to Dehradun via Tehri Lake",
      driveDistance: "120 km",
      drivingTime: "4-5 Hours",
      altitudePoints: [
        { location: "Kanatal", m: 2590, ft: 8500 },
        { location: "Tehri Lake", m: 775, ft: 2543 },
        { location: "Dehradun", m: 435, ft: 1427 }
      ],
      altitudeGain: { m: -2155, ft: -7073 },
      description: "Check-out and a drive to Tehri Lake for optional water sports at one of Asia's largest dams, before the return drive to Dehradun, Rishikesh or Haridwar.",
      detailedParagraphs: [
        "After breakfast, check out and drive to Tehri Lake, passing one of Asia's largest dams — the Tehri Dam.",
        "At the Tehri Lake Adventure Zone, book activities directly at the government counters on site: mild options include a scenic boat ride, pontoon float or houseboat, while the more adventurous can try jet skiing, speed boating, banana boat rides and paramotoring.",
        "Have lunch at a lakeside cafe — the Tehri trout fish or a veg thali are the local favourites — before starting the return journey to Dehradun (70 km, about 2.5 hours), Rishikesh (90 km, about 3.5 hours) or Haridwar, with drop-off around 5:00-6:00 PM."
      ],
      highlights: ["Tehri Dam — One of Asia's Largest Dams", "Water Sports at Tehri Lake", "Lakeside Cafe — Tehri Trout Fish"],
      meals: "Breakfast",
      stayType: "Tour ends — no overnight"
    }
  ];

  TREKS[kanatalIndex].faqs = [
    {
      title: "Where is Kanatal located and how far is it from Dehradun?",
      description: "Kanatal is in the Tehri Garhwal district of Uttarakhand at 8,500 ft altitude on the Mussoorie-Chamba road. It is 75 km from Dehradun (2.5-3 hrs), 38 km from Mussoorie (1.5 hrs), 32 km from Dhanaulti and 300 km from Delhi (8-9 hrs)."
    },
    {
      title: "How many days are required for a Kanatal trip?",
      description: "1 night / 2 days is enough for Kanatal, Surkanda Devi and Dhanaulti. Adding Tehri Lake water sports takes it to 2 nights / 3 days — the best weekend getaway from Dehradun or Delhi."
    },
    {
      title: "Is the Kanatal trek difficult? Is it suitable for kids and senior citizens?",
      description: "No — Kanatal is one of the easiest hill stations, with no trek compulsory and a direct road to the hotel/camp. Surkanda Devi has a 2 km trek, but a ropeway is available, making it 100% suitable for kids (1+ years) and senior citizens (75+ years)."
    },
    {
      title: "What is the best time to visit Kanatal?",
      description: "It is open all year. March-June is pleasant (15-25°C) and best for camping and adventure; July-September is green and misty with fewer crowds; September-November has the clearest Himalayan views; and December-February brings 3-4 ft of snowfall, best for snow camping and a snow trek."
    },
    {
      title: "Does it snow in Kanatal?",
      description: "Yes — heavy snowfall from late December to February covers Kanatal in 2-4 ft of snow. It is the nearest snow destination from Dehradun / Mussoorie reachable by road, and Surkanda Devi looks magical under snow."
    },
    {
      title: "What are the main places to see in Kanatal?",
      description: "Surkanda Devi Temple (9,000 ft, a 51 Shakti Peetha, 2 km trek or ropeway), Kaudia Forest (5 km nature walk / bird watching), Dhanaulti Eco Park (13 km, deodar forest park), Tehri Lake (35-40 km, water sports like jet ski, banana boat and paramotoring), and Kempty Falls en route."
    },
    {
      title: "Where to stay in Kanatal?",
      description: "There are no 5-star hotels — mainly eco-resorts, Swiss tents, cottages and adventure camps with attached washrooms and mountain views, suited to couples, families and groups. Luxury options are available at Dhanaulti."
    },
    {
      title: "Is there network / ATM / market in Kanatal?",
      description: "Jio, Airtel and BSNL all work well (4G). There is no big ATM — the last one is at Chamba/Mussoorie, so carry cash. There is no mall road or big market, only small tea shops and Maggi points; for shopping, go to Mussoorie."
    },
    {
      title: "What adventure activities can we do in Kanatal?",
      description: "Zipline (300-400 m), valley crossing, sky cycling, rock climbing, rappelling, Burma bridge, jungle trekking, camping and a bonfire — and at Tehri Lake, jet ski, speed boat, banana boat, pontoon boat and paramotoring."
    },
    {
      title: "What should I carry for a Kanatal trip?",
      description: "A woollen jacket (nights are cold even in summer, 10-12°C), trekking shoes for Surkanda Devi, a cap, sunscreen, a power bank, a torch, personal medicines and cash. In winter, add heavy jackets, gloves, a cap and thermal wear."
    },
    {
      title: "Is Kanatal safe?",
      description: "Very safe — a peaceful village with low crime, family- and couple-friendly, with adventure activities run using safety gear and trained instructors."
    },
    {
      title: "Do we need any permit or Yatra registration for Kanatal?",
      description: "No permit or Yatra registration is needed — just carry an Aadhaar card for hotel check-in."
    }
  ];

  TREKS[kanatalIndex].article = {
    title: "Kanatal: The Quiet Himalayan Escape That Mussoorie Forgot to Keep",
    standfirst: "Just 38 km ahead of crowded Mussoorie, at 8,500 ft, lies a tiny hamlet in Tehri Garhwal that is still untouched — pine forests, apple orchards and silence you can actually hear.",
    readMinutes: 6,
    sections: [
      {
        paragraphs: [
          "Just 38 km ahead of crowded Mussoorie, at an altitude of 8,500 ft, lies Kanatal — a tiny hamlet in Tehri Garhwal that is still untouched. No mall road, no traffic jam, no honking — only pine forests, apple orchards, snow-capped peaks and silence that you can actually hear.",
          "Located on the Chamba-Mussoorie road, Kanatal is surrounded by dense oak and deodar forests with open views of Bandarpoonch, Srikantha and Jaonli peaks. On a clear winter morning, you can see the entire Garhwal Himalayan range turning golden from your tent itself."
        ]
      },
      {
        heading: "Not just a hill station, an experience",
        paragraphs: [
          "Kanatal was almost unknown a few years ago, which is its biggest blessing. It is not a typical sightseeing place where you run from one point to another — it is a place where you slow down.",
          "Morning starts with a Himalayan sunrise and birds chirping inside Kaudia Forest, a 5 km stretch of pristine pine forest famous for nature walks and bird watching. In the afternoon, a 5 km drive to Kaddukhal is followed by a 2 km trek or a 5-minute ropeway ride to Surkanda Devi Temple at 9,000 ft — one of the 51 Shakti Peethas of India, with a 360-degree view no camera can capture: the Dehradun valley on one side, snow peaks on the other, clouds below your feet.",
          "By evening, Dhanaulti Eco Park (13 km away) offers manicured deodar trails, and as the sun sets, the campsite in Kanatal lights up with a bonfire, light music, snacks and stories under a sky full of stars you never see in cities."
        ]
      },
      {
        heading: "The adventure capital near Dehradun",
        paragraphs: [
          "What makes Kanatal different from any other quiet hill station is adventure — it is called the adventure hub of Uttarakhand near Dehradun.",
          "Every camp here offers zip-lining over valleys (400 m long), valley crossing, sky cycling, rock climbing, rappelling and Burma bridges. Kids, couples and corporate groups all find something thrilling, run safely with trained instructors.",
          "Just 35-40 km away is Tehri Lake, one of Asia's largest dams. Where else can you trek in the Himalayas in the morning and go jet skiing, banana boating and paramotoring on the same trip? The Kanatal-to-Tehri combination makes it the only hill station plus lake adventure circuit near Dehradun."
        ]
      },
      {
        heading: "Every season has a different colour",
        paragraphs: [
          "Kanatal is open 365 days and never disappoints. Summer (March-June) is pleasant at 15-25°C, best for camping, adventure and forest walks. Monsoon (July-September) turns it into a green paradise with misty forests. Autumn (September-November) gives crystal-clear Himalayan views. And winter (December-February) turns Kanatal into a mini Kashmir with 3-4 feet of snow — snow camping, a snow trek to Surkanda and snowball fights make it the nearest snow destination from Delhi you can drive to."
        ]
      },
      {
        heading: "More than just a weekend",
        paragraphs: [
          "Kanatal is not for those who want shopping and nightlife — it is for those who want to pause. Whether you are a couple looking for a romantic stay away from the Mussoorie crowd, a family looking for a safe adventure getaway for kids, or a group of friends on a 1 night / 2 days adventure trip from Dehradun, Kanatal is that one place where you can sit idle in front of a pine forest and still feel you have done everything.",
          "Sometimes the best travel plan is to do nothing in the mountains. Kanatal lets you do exactly that."
        ]
      }
    ]
  };

  TREKS[kanatalIndex].similarTreks = [
    "mussoorie-winter-escape",
    "nainital-winter-trip",
    "mukteshwar-winter-trip",
    "auli-snow-trip",
    "chopta-with-auli"
  ];
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
              { startDate: "06 Jun", endDate: "08 Jun", status: "Open" },
              { startDate: "07 Jun", endDate: "09 Jun", status: "Open" },
              { startDate: "08 Jun", endDate: "10 Jun", status: "Open" },
              { startDate: "09 Jun", endDate: "11 Jun", status: "Open" },
              { startDate: "10 Jun", endDate: "12 Jun", status: "Open" },
              { startDate: "11 Jun", endDate: "13 Jun", status: "Open" },
              { startDate: "12 Jun", endDate: "14 Jun", status: "Open" },
              { startDate: "13 Jun", endDate: "15 Jun", status: "Open" },
              { startDate: "14 Jun", endDate: "16 Jun", status: "Open" },
              { startDate: "15 Jun", endDate: "17 Jun", status: "Open" },
              { startDate: "16 Jun", endDate: "18 Jun", status: "Open" },
              { startDate: "17 Jun", endDate: "19 Jun", status: "Open" },
              { startDate: "18 Jun", endDate: "20 Jun", status: "Open" },
              { startDate: "19 Jun", endDate: "21 Jun", status: "Open" },
              { startDate: "20 Jun", endDate: "22 Jun", status: "Open" },
              { startDate: "21 Jun", endDate: "23 Jun", status: "Open" },
              { startDate: "22 Jun", endDate: "24 Jun", status: "Open" },
              { startDate: "23 Jun", endDate: "25 Jun", status: "Open" },
              { startDate: "24 Jun", endDate: "26 Jun", status: "Open" },
              { startDate: "25 Jun", endDate: "27 Jun", status: "Open" },
              { startDate: "26 Jun", endDate: "28 Jun", status: "Open" },
              { startDate: "27 Jun", endDate: "29 Jun", status: "Open" },
              { startDate: "28 Jun", endDate: "30 Jun", status: "Open" },
              { startDate: "29 Jun", endDate: "01 Jul", status: "Open" },
              { startDate: "30 Jun", endDate: "02 Jul", status: "Open" }
            ]
          },
          {
            month: "Jul",
            year: "2027",
            trips: [
              { startDate: "01 Jul", endDate: "03 Jul", status: "Open" },
              { startDate: "02 Jul", endDate: "04 Jul", status: "Open" },
              { startDate: "03 Jul", endDate: "05 Jul", status: "Open" },
              { startDate: "04 Jul", endDate: "06 Jul", status: "Open" },
              { startDate: "05 Jul", endDate: "07 Jul", status: "Open" },
              { startDate: "06 Jul", endDate: "08 Jul", status: "Open" },
              { startDate: "07 Jul", endDate: "09 Jul", status: "Open" },
              { startDate: "08 Jul", endDate: "10 Jul", status: "Open" },
              { startDate: "09 Jul", endDate: "11 Jul", status: "Open" },
              { startDate: "10 Jul", endDate: "12 Jul", status: "Open" },
              { startDate: "11 Jul", endDate: "13 Jul", status: "Open" },
              { startDate: "12 Jul", endDate: "14 Jul", status: "Open" },
              { startDate: "13 Jul", endDate: "15 Jul", status: "Open" },
              { startDate: "14 Jul", endDate: "16 Jul", status: "Open" },
              { startDate: "15 Jul", endDate: "17 Jul", status: "Open" },
              { startDate: "16 Jul", endDate: "18 Jul", status: "Open" },
              { startDate: "17 Jul", endDate: "19 Jul", status: "Open" },
              { startDate: "18 Jul", endDate: "20 Jul", status: "Open" },
              { startDate: "19 Jul", endDate: "21 Jul", status: "Open" },
              { startDate: "20 Jul", endDate: "22 Jul", status: "Open" },
              { startDate: "21 Jul", endDate: "23 Jul", status: "Open" },
              { startDate: "22 Jul", endDate: "24 Jul", status: "Open" },
              { startDate: "23 Jul", endDate: "25 Jul", status: "Open" },
              { startDate: "24 Jul", endDate: "26 Jul", status: "Open" },
              { startDate: "25 Jul", endDate: "27 Jul", status: "Open" },
              { startDate: "26 Jul", endDate: "28 Jul", status: "Open" },
              { startDate: "27 Jul", endDate: "29 Jul", status: "Open" },
              { startDate: "28 Jul", endDate: "30 Jul", status: "Open" },
              { startDate: "29 Jul", endDate: "31 Jul", status: "Open" },
              { startDate: "30 Jul", endDate: "01 Aug", status: "Open" },
              { startDate: "31 Jul", endDate: "02 Aug", status: "Open" }
            ]
          }
        ]
      }
    }
  };
}

// Static details for the Kedarnath Yatra (uid: kedarnath-yatra), the 4-day
// pilgrimage out of Haridwar/Rishikesh to the Kedarnath Temple at 11,755 ft.
// Trek essentials (packing list) and the cancellation policy are deliberately
// left unset, same as Nag Tibba and Chopta, so both sections render the
// shared copy from `trekDefaults.ts` / `TrekCancellation`. `maxAltitude`,
// `totalDistance`, `availability`, `endLocation` and `difficulty` live on the
// catalogue entry itself.
const kedarnathIndex = YATRAS.findIndex(y => y.slug === 'kedarnath-yatra');
if (kedarnathIndex !== -1) {
  YATRAS[kedarnathIndex].aboutParagraphs = [
    "Kedarnath is one of the most sacred pilgrimage destinations in India and one of the most important temples of Lord Shiva. Located in the Rudraprayag district of Uttarakhand, the temple sits at an altitude of approximately 11,755 ft (3,583 m) at the head of the Mandakini River, surrounded by snow-covered Himalayan peaks.",
    "The trek begins from Gaurikund and leads to the Kedarnath Temple through a well-paved 16 km trail. The route passes through Jungle Chatti, Bheembali and Linchauli, offering views of waterfalls, forests and Himalayan ranges. The temple itself is believed to have been built by the Pandavas and revived by Adi Shankaracharya, and is known as the first among the 12 Jyotirlingas and the Panch Kedar.",
    "What makes Kedarnath special is its unique combination of spirituality and adventure. It remains open from May to November and is closed during winter due to heavy snowfall, when the idol is shifted to Ukhimath. Whether you are a devotee on the Char Dham Yatra or a trekker looking for a meaningful Himalayan journey, Kedarnath offers a powerful experience of faith, endurance and mountain beauty."
  ];

  YATRAS[kedarnathIndex].highlights = [
    "12 Jyotirlinga Darshan",
    "Mandakini River",
    "Chorabari Glacier",
    "Adi Shankaracharya Samadhi",
    "Bhairavnath Temple",
    "Shayan Aarti",
    "Kedarnath & Kedar Dome Views",
    "Chaukhamba Range",
    "GMVN Tents & Lodges at Kedarnath Base"
  ];

  YATRAS[kedarnathIndex].usps = [
    {
      title: "Base village: Sonprayag / Gaurikund",
      description: "Sonprayag is the last motorable point for private vehicles; a 5 km shared jeep ride from there reaches Gaurikund, where the 16 km trek to Kedarnath begins."
    },
    {
      title: "First among the 12 Jyotirlingas",
      description: "Kedarnath is the highest and northernmost of the 12 Jyotirlingas, the first of the Panch Kedar, and one of the four shrines on the Char Dham Yatra."
    },
    {
      title: "A trek built for pilgrims",
      description: "The 16 km trail from Gaurikund is fully paved with railings, and lined with tea stalls, medical camps and pony stands the entire way up."
    },
    {
      title: "Open only six months a year",
      description: "The temple opens in late April or early May and closes around Bhai Dooj in November, when the idol is carried down to Omkareshwar Temple in Ukhimath for the winter."
    },
    {
      title: "Four ways to the temple",
      description: "Beyond Gaurikund, pilgrims can walk, ride a pony or palki, or fly in by helicopter from Phata, Sersi or Sitapur — a 7-8 minute flight to Kedarnath."
    }
  ];

  YATRAS[kedarnathIndex].destinationHighlights = [
    { name: "Sonprayag / Gaurikund", blurb: "The last motorable point on the route; Sonprayag holds the mandatory Yatra Registration checkpoint, and a 5 km jeep ride away, Gaurikund is where the 16 km trek to Kedarnath begins." },
    { name: "Kedarnath Temple", blurb: "The shrine itself at 11,755 ft, at the head of the Mandakini River — the first of the 12 Jyotirlingas and the Panch Kedar, believed built by the Pandavas and revived by Adi Shankaracharya." },
    { name: "Bhairavnath Temple", blurb: "A steep 0.5 km climb above the main temple, believed to protect Kedarnath through the winter months and to offer the best sunrise view of Kedarnath Peak." }
  ];

  YATRAS[kedarnathIndex].differentiators = [
    "Region: Rudraprayag district, Uttarakhand",
    "Trek type: paved pilgrimage trek to the Kedarnath Jyotirlinga at 11,755 ft",
    "Terrain: paved Himalayan trail through Jungle Chatti, Bheembali and Linchauli, with tea stalls and medical camps throughout",
    "Best season: May–June and September–October",
    "Monsoon: July–August brings landslide and slippery-trail risk and is best avoided",
    "Winter: closed November to April, when the idol is shifted to Ukhimath"
  ];

  YATRAS[kedarnathIndex].similarTreks = [
    "badrinath-kedarnath-yatra",
    "chopta-tungnath-trek",
    "rudranath-yatra",
    "madmaheshwar-yatra"
  ];

  YATRAS[kedarnathIndex].idealFor =
    "Pilgrims, Lord Shiva devotees, fit beginners and groups on the Char Dham Yatra.";

  YATRAS[kedarnathIndex].importantNote =
    "Kedarnath Temple is open only from May to November; it is closed through winter due to heavy snowfall, when the idol is shifted to Ukhimath's Omkareshwar Temple. May–June and September–October are the best windows; July–August falls in the monsoon and carries a real risk of landslides, heavy rain and a slippery trail, so it is best avoided. Online Uttarakhand Yatra Registration at registrationandtouristcare.uk.gov.in is mandatory for every pilgrim, and network and ATMs stop working beyond Sonprayag, so carry cash and inform family in advance.";

  YATRAS[kedarnathIndex].itinerary = [
    {
      day: 1,
      title: "Haridwar / Rishikesh to Sonprayag",
      driveDistance: "220 km",
      drivingTime: "9-10 Hours",
      pickupPoint: "Haridwar / Rishikesh",
      pickupTime: "5:00 AM",
      altitudePoints: [
        { location: "Haridwar / Rishikesh", m: 350, ft: 1150 },
        { location: "Sonprayag", m: 1829, ft: 6001 }
      ],
      altitudeGain: { m: 1479, ft: 4851 },
      description: "Drive from Haridwar/Rishikesh via Devprayag, Srinagar, Rudraprayag and Guptkashi to Sonprayag, with stops at Devprayag Sangam and Dhari Devi Temple along the way.",
      detailedParagraphs: [
        "Pickup at 5:00 AM from Haridwar Railway Station or Rishikesh ISBT, with breakfast enroute at Srinagar and lunch at Rudraprayag.",
        "En route, stop at the Devprayag Sangam — the confluence of the Alaknanda and Bhagirathi rivers that forms the Ganga — and at the Dhari Devi Temple, built mid-river on the Alaknanda.",
        "Reach Guptkashi/Sonprayag by around 4:30 PM and complete the mandatory Yatra Registration check at the Sonprayag checkpoint.",
        "Check in to your hotel in the evening; the local market is free to explore, and pony or palki can be arranged here if needed.",
        "Overnight stay at a hotel in Sonprayag / Sitapur. The last ATM is at Guptkashi — withdraw cash here, as network and ATMs stop working beyond Sonprayag."
      ],
      highlights: ["Devprayag Sangam", "Dhari Devi Temple", "Yatra Registration Check", "Sonprayag / Sitapur Stay"],
      meals: "Dinner",
      stayType: "Hotel"
    },
    {
      day: 2,
      title: "Sonprayag to Kedarnath Temple",
      driveDistance: "5 km",
      drivingTime: "30 Mins",
      trekDistance: "16 km",
      trekDuration: "7-9 Hours",
      altitudePoints: [
        { location: "Sonprayag", m: 1829, ft: 6001 },
        { location: "Gaurikund", m: 1982, ft: 6500 },
        { location: "Kedarnath", m: 3583, ft: 11755 }
      ],
      altitudeGain: { m: 1754, ft: 5754 },
      description: "Take a shared jeep from Sonprayag to Gaurikund, the last motorable point, then trek 16 km via Jungle Chatti, Bheembali and Linchauli to reach Kedarnath by evening.",
      detailedParagraphs: [
        "Early wake-up at 4:00 AM; take a government shared jeep from Sonprayag to Gaurikund, the last motorable point on the route.",
        "Start the 16 km trek from Gaurikund around 5:00 AM. A walking stick is available at the start for a small charge.",
        "The trail passes Jungle Chatti (4 km) — the first tea-break point where the climb turns moderate — Bheembali (7 km), a medical and food point, and Linchauli (11 km), the last big halt before a steep final ascent.",
        "By 15 km the horse stand ends and it is a flat 1 km walk to the temple. Reach Kedarnath between 1:00–3:00 PM and check in to your tent, dormitory or lodge.",
        "In the evening, attend darshan and the Shayan Aarti at 7:30 PM — one of the most moving moments of the yatra.",
        "Overnight stay at Kedarnath in a basic tent or lodge with shared washrooms — there is no luxury accommodation at the top."
      ],
      highlights: ["Gaurikund Jeep Ride", "Jungle Chatti", "Bheembali", "Linchauli", "Shayan Aarti"],
      meals: "Breakfast & Dinner",
      stayType: "Tent / Dorm / Lodge"
    },
    {
      day: 3,
      title: "Kedarnath Darshan to Sonprayag",
      trekDistance: "16 km",
      trekDuration: "5-6 Hours",
      driveDistance: "5 km",
      drivingTime: "30 Mins",
      timeNote: { label: "Morning darshan", value: "4:00 AM" },
      altitudePoints: [
        { location: "Kedarnath", m: 3583, ft: 11755 },
        { location: "Gaurikund", m: 1982, ft: 6500 },
        { location: "Sonprayag", m: 1829, ft: 6001 }
      ],
      altitudeGain: null,
      description: "Morning darshan and Abhishek at Kedarnath, a visit to Bhairavnath Temple and Adi Shankaracharya's Samadhi, then descend 16 km to Gaurikund and drive to Sonprayag.",
      detailedParagraphs: [
        "Morning Aarti and Abhishek darshan at 4:00 AM, with far fewer crowds than later in the day.",
        "Walk up to Bhairavnath Temple, a steep 0.5 km climb above Kedarnath, believed to protect the temple through the winter — it offers a striking sunrise view of Kedarnath Peak.",
        "After breakfast, visit the Samadhi of Adi Shankaracharya just behind the main temple.",
        "Begin the descent to Gaurikund around 8:30 AM; the down trek is easier and takes 5-6 hours.",
        "From Gaurikund, take a shared jeep back to Sonprayag, reaching by early evening for a hot tea and rest.",
        "Overnight stay at a hotel in Sonprayag / Sitapur."
      ],
      highlights: ["Morning Abhishek Darshan", "Bhairavnath Temple", "Adi Shankaracharya Samadhi", "Descent to Gaurikund"],
      meals: "Breakfast & Dinner",
      stayType: "Hotel"
    },
    {
      day: 4,
      title: "Sonprayag to Haridwar / Rishikesh",
      driveDistance: "220 km",
      drivingTime: "9-10 Hours",
      altitudePoints: [
        { location: "Sonprayag", m: 1829, ft: 6001 },
        { location: "Haridwar / Rishikesh", m: 350, ft: 1150 }
      ],
      altitudeGain: null,
      description: "Drive back to Haridwar/Rishikesh via the same route, with a stop for lunch, arriving by evening as the yatra concludes.",
      detailedParagraphs: [
        "After breakfast, drive back to Haridwar / Rishikesh via the same route, with a stop for lunch along the way.",
        "Reach Haridwar / Rishikesh between 6:00–8:00 PM. The yatra ends with the blessings of Mahadev."
      ],
      highlights: ["Return Drive", "Lunch Stop", "Yatra Concludes"],
      meals: "Breakfast",
      // The yatra ends on this day; an empty stay keeps the generic
      // "Hotel / Homestay" fallback out of the day's quick-info line.
      stayType: ""
    }
  ];

  YATRAS[kedarnathIndex].article = {
    title: "Kedarnath Yatra: A Complete Guide to the Abode of Lord Shiva",
    standfirst:
      "Nestled in the Garhwal Himalayas at 11,755 ft, Kedarnath Temple is not just a pilgrimage but an emotion for crores of devotees — the story of its myth, its miracle and its 16 km trail.",
    readMinutes: 7,
    sections: [
      {
        paragraphs: [
          "Nestled in the lap of the Garhwal Himalayas at an altitude of 11,755 ft, Kedarnath Temple is not just a pilgrimage, but an emotion for crores of devotees. Located in the Rudraprayag district of Uttarakhand, on the banks of the Mandakini River, Kedarnath is one of the 12 Jyotirlingas and the most important of the Panch Kedar."
        ]
      },
      {
        heading: "Mythology and History",
        paragraphs: [
          "The history of Kedarnath is deeply linked to the Mahabharata. After the Kurukshetra war, the Pandavas wanted forgiveness from Lord Shiva for killing their own cousins. Lord Shiva avoided them and took the form of a bull in Guptakashi. When the Pandavas found him, Shiva dived into the ground. His hump appeared in Kedarnath, arms in Tungnath, face in Rudranath, navel in Madhmaheshwar and hair in Kalpeshwar. These five places together are called Panch Kedar.",
          "It is said the original temple was built by the Pandavas and later restored by Adi Shankaracharya in the 8th century. Behind the temple, you can still see the Samadhi of Adi Shankaracharya, who is believed to have attained Moksha here."
        ]
      },
      {
        heading: "The Sacred Trek of 16 Km",
        paragraphs: [
          "Unlike other Dhams, Kedarnath cannot be reached directly by vehicle. The last motorable point is Sonprayag. From there, a local jeep takes you to Gaurikund, and the real journey begins.",
          "The 16 km trek from Gaurikund to Kedarnath passes through Jungle Chatti, Bheembali and Linchauli. The trail is fully paved with railings and lined with tea stalls, medical camps and pony stands. What makes this trek special is that every step chants \"Har Har Mahadev\" — you meet sadhus, families, and solo travellers all walking with one purpose.",
          "For those who cannot trek, options like pony, palki, pitthu and helicopter services from Phata, Sersi and Sitapur are available."
        ]
      },
      {
        heading: "The Miracle of 2013",
        paragraphs: [
          "In June 2013, a massive cloudburst and flood destroyed everything around Kedarnath. The entire town, shops and hotels were washed away. But the temple stood untouched, with a huge rock (now called Bhim Shila) behind it that diverted the flood water. This is considered a divine miracle by devotees and is a symbol of faith that even nature cannot shake."
        ]
      },
      {
        heading: "Best Time to Visit",
        paragraphs: [
          "Kedarnath Temple opens in late April / early May and closes around Bhai Dooj in November. The best time is May-June and September-October. July-August is monsoon, with risk of landslides. In winter, the area gets 10-15 feet of snow and the idol is shifted to Ukhimath's Omkareshwar Temple, where winter puja is performed for 6 months."
        ]
      },
      {
        heading: "More Than Just a Temple",
        paragraphs: [
          "A visit to Kedarnath is a test of both devotion and endurance. The cold, the low oxygen, the steep climb — everything pushes your limits. But the moment you see the temple standing tall in front of the snow-clad Kedarnath Peak, with the sound of the temple bells and chants, all tiredness disappears.",
          "If you are planning your Char Dham Yatra, start your spiritual journey from Kedarnath. Har Har Mahadev!"
        ]
      }
    ],
    signoff: "Trek Kedarnath with Trip My Soul."
  };

  YATRAS[kedarnathIndex].faqs = [
    {
      title: "What is the total trek distance of Kedarnath?",
      description: "The total trek is 16 km one side from Gaurikund to Kedarnath Temple, plus a 5 km local jeep ride from Sonprayag to Gaurikund."
    },
    {
      title: "How many days are required for Kedarnath Yatra from Haridwar?",
      description: "A minimum of 4 Days / 3 Nights from Haridwar/Rishikesh is required — 1 day going, 1 day trekking up, 1 day trekking down, and 1 day returning."
    },
    {
      title: "Is the Kedarnath trek difficult?",
      description: "It is a moderate to difficult trek. It is fully paved but steep. Any healthy person who can walk 5-6 km daily can complete it. Elders are advised to take a pony or helicopter."
    },
    {
      title: "How do I book a Helicopter for Kedarnath?",
      description: "Helicopter booking is only done through the IRCTC Heli Yatra website — heliyatra.irctc.co.in."
    },
    {
      title: "Is Yatra Registration mandatory?",
      description: "Yes, Uttarakhand Govt. Yatra Registration is mandatory for every pilgrim. Register for free at registrationandtouristcare.uk.gov.in."
    },
    {
      title: "What is the best time to visit Kedarnath?",
      description: "May to June and September to October are best. July-August is monsoon and risky due to landslides. The temple opens in May and closes in November on Bhai Dooj."
    },
    {
      title: "Where to stay in Kedarnath?",
      description: "At Sonprayag, good hotels with attached washrooms are available. At Kedarnath, only basic tents, dorms and GMVN guest houses with shared washrooms and blankets are available — there is no luxury accommodation at the top."
    },
    {
      title: "Is there network / ATM at Kedarnath?",
      description: "Only Jio and BSNL work till Sonprayag, with low speed. There is no network on the Kedarnath trek or at the temple. The last ATM is at Guptkashi/Sonprayag, so carry cash."
    },
    {
      title: "Can we do Kedarnath in one day?",
      description: "No, you need to stay one night at Kedarnath. Helicopter passengers can do a same-day return, but this is not recommended due to weather dependency."
    },
    {
      title: "What should I carry for the Kedarnath trek?",
      description: "A heavy woollen jacket, gloves, cap, thermal wear, raincoat, trekking shoes, torch, power bank, personal medicines, dry fruits, a water bottle and your Aadhaar Card."
    },
    {
      title: "Is VIP Darshan available?",
      description: "There is no official VIP darshan system currently. For special pooja, you can take a slip from the temple committee office at the temple."
    },
    {
      title: "What is the age limit for the Kedarnath Yatra?",
      description: "There is no official age limit, but it is recommended for those aged 10 to 65 years. Children and senior citizens should take a helicopter or pony and carry a medical certificate."
    }
  ];

  YATRAS[kedarnathIndex].eligibilityCriteria = [
    { icon: "User", text: "Age: 10–65 years recommended (no official age limit)" },
    { icon: "Footprints", text: "Experience: No prior trekking experience required" },
    { icon: "Dumbbell", text: "Fitness: Basic to moderate — able to walk 16 km on a steep, paved incline in a day" },
    { icon: "Mountain", text: "Altitude: Up to 11,755 ft / 3,583 m" },
    { icon: "FileText", text: "Documents: Aadhaar Card / Passport and Uttarakhand Yatra Registration mandatory for every pilgrim" },
    { icon: "Stethoscope", text: "Not recommended for severe heart disease, high BP, severe asthma or knee problems without medical clearance" }
  ];

  YATRAS[kedarnathIndex].fitnessCriteria = [
    { icon: "Footprints", text: "Able to walk 5 km in about 1 hour on normal ground" },
    { icon: "TrendingUp", text: "Able to walk 16 km on a steep, paved incline in a single day" },
    { icon: "Activity", text: "Start walking 4–5 km daily and practise stairs for 2 weeks before the yatra" },
    { icon: "Backpack", text: "Comfortable carrying a light daypack for the full trek day" },
    { icon: "Ban", text: "Avoid smoking and alcohol during the yatra due to low oxygen levels" }
  ];

  YATRAS[kedarnathIndex].howToReach = {
    intro: "Kedarnath is accessible only for about 6 months a year (May to November). The last motorable point is Sonprayag / Gaurikund, from where the temple is reached on foot, by pony, palki or helicopter.",
    air: {
      summaryLabel: "Nearest Airport",
      summary: "Jolly Grant Airport, Dehradun (DED)",
      detail: "From the airport, Sonprayag is roughly 240–245 km away, about 9-10 hours by road. Recommended for travellers flying in from Delhi, Mumbai, Bengaluru and other cities with connectivity to Dehradun."
    },
    train: {
      summaryLabel: "Nearest Railway Station",
      summary: "Haridwar Railway Station",
      detail: "Haridwar is about 220 km from Sonprayag, and Rishikesh about 200 km. Both have daily trains from Delhi (4-6 hours) and good onward road connectivity to Sonprayag."
    },
    road: {
      summaryLabel: "Route",
      summary: "Haridwar / Rishikesh to Sonprayag via Devprayag, Srinagar, Rudraprayag and Guptkashi",
      detail: "This is the standard route for the yatra. From Sonprayag, a local shared jeep covers the final 5 km to Gaurikund, and the last 16 km to Kedarnath are covered on foot, by pony, palki or helicopter.",
      route: ["Haridwar / Rishikesh", "Devprayag", "Srinagar", "Rudraprayag", "Guptkashi", "Sonprayag", "Gaurikund (5 km jeep)", "Kedarnath (16 km trek)"],
      facts: [
        { label: "Distance", value: "~220–225 km from Haridwar/Rishikesh" },
        { label: "Drive", value: "~9-10 hours" },
        { label: "Options", value: "Shared Taxi / Bus / Private Car / Tempo Traveller" }
      ]
    },
    pickup: {
      point: "Haridwar Railway Station / Rishikesh ISBT",
      time: "5:00 AM on Day 1",
      dropPoint: "Haridwar / Rishikesh",
      dropTime: "Evening of Day 4",
      note: "Online Uttarakhand Yatra Registration at registrationandtouristcare.uk.gov.in is mandatory for every pilgrim before travelling."
    }
  };

  YATRAS[kedarnathIndex].inclusions = [
    { title: "Transportation", description: "Haridwar to Haridwar by Tempo Traveller / Ertiga / Dzire as per group size." },
    { title: "Accommodation", description: "2 nights at Sonprayag/Sitapur in a hotel with attached washroom, plus 1 night at Kedarnath in a tent / dorm / guest house (basic, sharing)." },
    { title: "Meal Plan", description: "MAP plan — 3 breakfasts and 3 dinners (veg only), from Day 1 dinner to Day 4 breakfast." },
    { title: "Driver Allowance & Charges", description: "Driver allowance, toll, parking and fuel charges." },
    { title: "Yatra Support Staff", description: "Kedarnath Yatra support staff in stays." },
    { title: "First Aid", description: "First-aid kit." }
  ];

  YATRAS[kedarnathIndex].exclusions = [
    { title: "Yatra Registration", description: "Must be done online by yourself — it is free." },
    { title: "Local Jeep", description: "Govt. local jeep, Sonprayag to Gaurikund and back — Rs 50-60 per side per person, shared." },
    { title: "Pony / Palki / Helicopter", description: "Pony, palki, pitthu or helicopter tickets, as per actual cost at the spot." },
    { title: "Special Darshan", description: "VIP darshan, pooja samagri and any special darshan tickets." },
    { title: "Personal expenses", description: "Lunch, personal expenses, tea, snacks and mineral water." },
    { title: "Room Heater", description: "Room heater if required — Rs 300-500 per night, extra." },
    { title: "Anything not listed", description: "Any expense not specifically mentioned under Inclusions." },
    { title: "GST", description: "5% GST, extra." }
  ];

  // Daily departures from 10 Sep through 10 Nov 2026, the last window before
  // the temple closes for winter around Bhai Dooj. Each batch is the 4-day
  // yatra, so the end date is the start plus three days.
  YATRAS[kedarnathIndex].batches = {
    years: {
      "2026": {
        months: [
          {
            month: "Sep",
            year: "2026",
            trips: [
              { startDate: "10 Sep", endDate: "13 Sep", status: "Open" },
              { startDate: "11 Sep", endDate: "14 Sep", status: "Open" },
              { startDate: "12 Sep", endDate: "15 Sep", status: "Open" },
              { startDate: "13 Sep", endDate: "16 Sep", status: "Open" },
              { startDate: "14 Sep", endDate: "17 Sep", status: "Open" },
              { startDate: "15 Sep", endDate: "18 Sep", status: "Open" },
              { startDate: "16 Sep", endDate: "19 Sep", status: "Open" },
              { startDate: "17 Sep", endDate: "20 Sep", status: "Open" },
              { startDate: "18 Sep", endDate: "21 Sep", status: "Open" },
              { startDate: "19 Sep", endDate: "22 Sep", status: "Open" },
              { startDate: "20 Sep", endDate: "23 Sep", status: "Open" },
              { startDate: "21 Sep", endDate: "24 Sep", status: "Open" },
              { startDate: "22 Sep", endDate: "25 Sep", status: "Open" },
              { startDate: "23 Sep", endDate: "26 Sep", status: "Open" },
              { startDate: "24 Sep", endDate: "27 Sep", status: "Open" },
              { startDate: "25 Sep", endDate: "28 Sep", status: "Open" },
              { startDate: "26 Sep", endDate: "29 Sep", status: "Open" },
              { startDate: "27 Sep", endDate: "30 Sep", status: "Open" },
              { startDate: "28 Sep", endDate: "01 Oct", status: "Open" },
              { startDate: "29 Sep", endDate: "02 Oct", status: "Open" },
              { startDate: "30 Sep", endDate: "03 Oct", status: "Open" }
            ]
          },
          {
            month: "Oct",
            year: "2026",
            trips: [
              { startDate: "01 Oct", endDate: "04 Oct", status: "Open" },
              { startDate: "02 Oct", endDate: "05 Oct", status: "Open" },
              { startDate: "03 Oct", endDate: "06 Oct", status: "Open" },
              { startDate: "04 Oct", endDate: "07 Oct", status: "Open" },
              { startDate: "05 Oct", endDate: "08 Oct", status: "Open" },
              { startDate: "06 Oct", endDate: "09 Oct", status: "Open" },
              { startDate: "07 Oct", endDate: "10 Oct", status: "Open" },
              { startDate: "08 Oct", endDate: "11 Oct", status: "Open" },
              { startDate: "09 Oct", endDate: "12 Oct", status: "Open" },
              { startDate: "10 Oct", endDate: "13 Oct", status: "Open" },
              { startDate: "11 Oct", endDate: "14 Oct", status: "Open" },
              { startDate: "12 Oct", endDate: "15 Oct", status: "Open" },
              { startDate: "13 Oct", endDate: "16 Oct", status: "Open" },
              { startDate: "14 Oct", endDate: "17 Oct", status: "Open" },
              { startDate: "15 Oct", endDate: "18 Oct", status: "Open" },
              { startDate: "16 Oct", endDate: "19 Oct", status: "Open" },
              { startDate: "17 Oct", endDate: "20 Oct", status: "Open" },
              { startDate: "18 Oct", endDate: "21 Oct", status: "Open" },
              { startDate: "19 Oct", endDate: "22 Oct", status: "Open" },
              { startDate: "20 Oct", endDate: "23 Oct", status: "Open" },
              { startDate: "21 Oct", endDate: "24 Oct", status: "Open" },
              { startDate: "22 Oct", endDate: "25 Oct", status: "Open" },
              { startDate: "23 Oct", endDate: "26 Oct", status: "Open" },
              { startDate: "24 Oct", endDate: "27 Oct", status: "Open" },
              { startDate: "25 Oct", endDate: "28 Oct", status: "Open" },
              { startDate: "26 Oct", endDate: "29 Oct", status: "Open" },
              { startDate: "27 Oct", endDate: "30 Oct", status: "Open" },
              { startDate: "28 Oct", endDate: "31 Oct", status: "Open" },
              { startDate: "29 Oct", endDate: "01 Nov", status: "Open" },
              { startDate: "30 Oct", endDate: "02 Nov", status: "Open" },
              { startDate: "31 Oct", endDate: "03 Nov", status: "Open" }
            ]
          },
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
              { startDate: "10 Nov", endDate: "13 Nov", status: "Open" }
            ]
          }
        ]
      }
    }
  };
}

// Kedarnath Tungnath Yatra — the 5 Day / 4 Night "Do Kedar" circuit combining
// the Kedarnath Jyotirlinga trek with the easier Chopta–Tungnath–Chandrashila
// walk. Distinct from the standalone `kedarnath-yatra` and `chopta-tungnath-trek`
// entries above; this one packages both into a single Haridwar-to-Haridwar trip.
const kedarnathTungnathIndex = YATRAS.findIndex(y => y.slug === 'kedarnath-and-tungnath-yatra');
if (kedarnathTungnathIndex !== -1) {
  YATRAS[kedarnathTungnathIndex].aboutParagraphs = [
    "Kedarnath Tungnath Yatra is the most popular short pilgrimage circuit of Uttarakhand and the perfect combination of devotion and Himalayan adventure. Located in Rudraprayag district of Garhwal Himalayas, the yatra consists of two holy shrines — Kedarnath and Tungnath — situated at an average altitude of approximately 11,700 to 12,800 ft, amidst the majestic Himalayan ranges, alpine meadows and ancient temples.",
    "The yatra starts from Haridwar and covers a distance of approx. 450 km by road and 40 km by trek. The route passes through Sonprayag, Guptkashi and Chopta, known as the Mini Switzerland of India, offering views of the Mandakini valley, rhododendron forests, Deoria Tal and snow-clad peaks like Kedar Dome, Chaukhamba and Trishul. The two temples represent two forms of Lord Shiva — the hump at Kedarnath as the 12th Jyotirlinga and the arms at Tungnath as the world's highest Shiva temple, along with the Chandrashila summit where Lord Rama is said to have meditated.",
    "What makes Kedarnath Tungnath special is its unique combination of one tough devotional trek and one easy, beautiful trek in just 5 days. It remains open from May to November and is closed during winter due to heavy snowfall, when the idols are shifted to their winter abodes at Ukhimath and Maku Math. Whether you are a group of friends seeking adventure with blessings, couples looking for a short spiritual getaway, or devotees who want to experience the Panch Kedar feeling in limited time, Kedarnath Tungnath Yatra offers a powerful experience of Jyotirlinga darshan, the highest Shiva temple and a 360° Himalayan view from Chandrashila."
  ];

  YATRAS[kedarnathTungnathIndex].highlights = [
    "Kedarnath Jyotirlinga Darshan",
    "World's Highest Shiva Temple — Tungnath",
    "Chandrashila 360° Himalayan View",
    "Kedarnath Evening Shayan Aarti",
    "Chopta — Mini Switzerland of India",
    "Deoria Tal (Optional)"
  ];

  YATRAS[kedarnathTungnathIndex].idealFor =
    "Friends groups, couples, office groups, short-trip yatris and Shiva devotees who want the Panch Kedar feel inside a single 5-day itinerary.";

  YATRAS[kedarnathTungnathIndex].importantNote =
    "Both temples close for winter from November to April due to heavy snow — Kedarnath's idol moves to Ukhimath and Tungnath's to Maku Math. July–August falls in the monsoon and is best avoided, since Sonprayag and the Chopta approach road run through landslide-prone stretches. May–June and September–October are the recommended windows for clear weather and a stable trail.";

  YATRAS[kedarnathTungnathIndex].destinationHighlights = [
    { name: "Sonprayag", blurb: "The last motorable point for the Kedarnath trek and the overnight base for two nights on this itinerary." },
    { name: "Kedarnath", blurb: "The Jyotirlinga shrine at 11,755 ft, the hump of Shiva in the Panch Kedar legend, reached on a 16 km trek from Gaurikund." },
    { name: "Chopta", blurb: "The meadow known as the Mini Switzerland of India, and the trailhead for the Tungnath–Chandrashila walk." },
    { name: "Tungnath", blurb: "The world's highest Shiva temple at roughly 12,800 ft, worshipping the arms of Shiva, third of the five Panch Kedar shrines." },
    { name: "Chandrashila Peak", blurb: "The 13,000 ft high point of the yatra, with a 360° view of Nanda Devi, Trishul, Chaukhamba, Kedar Dome and Bandarpoonch." },
    { name: "Deoria Tal", blurb: "An optional lake stop above Sari on the return leg, known for the reflection of Chaukhamba in still water." }
  ];

  YATRAS[kedarnathTungnathIndex].similarTreks = [
    "kedarnath-badrinath-tungnath-yatra",
    "chopta-tungnath-trek",
    "kedarnath-yatra",
    "madmaheshwar-yatra",
    "rudranath-yatra",
    "chardham-yatra"
  ];

  YATRAS[kedarnathTungnathIndex].itinerary = [
    {
      day: 1,
      title: "Haridwar / Rishikesh to Sonprayag",
      driveDistance: "210 km",
      drivingTime: "8-9 Hours",
      pickupPoint: "Haridwar Railway Station",
      pickupTime: "6:00 AM",
      altitudePoints: [
        { location: "Haridwar", m: 314, ft: 1030 },
        { location: "Sonprayag", m: 1676, ft: 5500 }
      ],
      description: "Morning pickup from Haridwar and a scenic drive up the Alaknanda valley to Sonprayag, the last parking point for private vehicles before the Kedarnath trek.",
      detailedParagraphs: [
        "Morning pickup from Haridwar Railway Station at 6:00 AM. Drive via Rishikesh, Devprayag Sangam — the confluence of the Alaknanda and Bhagirathi — Srinagar, and the Rudraprayag Sangam of the Mandakini and Alaknanda.",
        "Reach Sonprayag / Sitapur by evening. This is the last parking point for private vehicles. Check in to the hotel and attend a briefing for the Kedarnath trek by your tour leader."
      ],
      highlights: ["Devprayag Sangam", "Rudraprayag Sangam", "Sonprayag"],
      meals: "Dinner",
      stayType: "Hotel in Sonprayag / Sitapur"
    },
    {
      day: 2,
      title: "Sonprayag to Kedarnath Dham Trek",
      trekDistance: "16 km",
      trekDuration: "7-8 Hours",
      driveDistance: "Sonprayag → Gaurikund (3 km)",
      timeNote: { label: "Wake up", value: "4:00 AM" },
      altitudePoints: [
        { location: "Gaurikund", m: 1982, ft: 6500 },
        { location: "Kedarnath", m: 3583, ft: 11755 }
      ],
      altitudeGain: { m: 1601, ft: 5255 },
      description: "The main trekking day of the yatra — a 16 km climb from Gaurikund to the Kedarnath Temple, with the evening Shayan Aarti at the shrine.",
      detailedParagraphs: [
        "Early wake-up at 4:00 AM. Take a local sharing jeep from Sonprayag to Gaurikund (3 km, paid extra). Start the 16 km trek from Gaurikund via Jungle Chatti (4 km), Bheembali (6 km) and Lincholi (11 km) to the Kedarnath base camp (15 km) and on to the temple (16 km).",
        "Pony, palki and helicopter options are available at your own cost for those who cannot walk the full distance.",
        "Reach Kedarnath by evening and check in to a tent or dormitory about 500 metres from the temple. Attend the evening Shayan Aarti darshan at 6:30 PM."
      ],
      highlights: ["Jungle Chatti", "Bheembali", "Lincholi", "Kedarnath Temple", "Shayan Aarti"],
      meals: "Breakfast & Dinner",
      stayType: "Tent / Dormitory in Kedarnath (shared washroom, hot water)"
    },
    {
      day: 3,
      title: "Kedarnath to Sonprayag Down Trek",
      trekDistance: "16 km",
      trekDuration: "5-6 Hours",
      driveDistance: "Gaurikund → Sonprayag, 70 km overall",
      timeNote: { label: "Morning darshan", value: "4:00 AM" },
      altitudePoints: [
        { location: "Kedarnath", m: 3583, ft: 11755 },
        { location: "Sonprayag", m: 1676, ft: 5500 }
      ],
      description: "An early morning abhishek and darshan at the temple, followed by the down trek to Gaurikund and the drive back to Sonprayag.",
      detailedParagraphs: [
        "Early morning at 4:00 AM, visit the temple for the morning abhishek and darshan ahead of the crowds.",
        "After breakfast at 8:00 AM, start the down trek to Gaurikund — faster than the climb up, at 5-6 hours. Take a jeep from Gaurikund to Sonprayag.",
        "Check in to the same hotel in Sonprayag. Rest and enjoy a hot shower."
      ],
      highlights: ["Morning Abhishek", "Down Trek", "Sonprayag"],
      meals: "Breakfast & Dinner",
      stayType: "Hotel in Sonprayag / Sitapur"
    },
    {
      day: 4,
      title: "Sonprayag to Chopta, Tungnath & Chandrashila Trek, to Sari",
      trekDistance: "4.5 km (Chopta–Tungnath–Chandrashila one way)",
      trekDuration: "2-3 Hours",
      driveDistance: "Sonprayag → Chopta, 90 km",
      drivingTime: "4 Hours",
      altitudePoints: [
        { location: "Chopta", m: 2682, ft: 8800 },
        { location: "Tungnath", m: 3902, ft: 12800 },
        { location: "Chandrashila", m: 3962, ft: 13000 }
      ],
      altitudeGain: { m: 1280, ft: 4200 },
      description: "A drive to Chopta via Ukhimath — the winter abode of Kedarnath — followed by the trek to Tungnath Temple and the Chandrashila summit, ending at Sari village.",
      detailedParagraphs: [
        "Morning 7:00 AM drive from Sonprayag to Chopta (90 km, 4 hours) via Ukhimath, the winter seat of the Kedarnath idol. Reach Chopta by 11:00 AM — called the Mini Switzerland of India for its meadows and pine forest.",
        "Trek from Chopta (8,800 ft) to Tungnath Temple (12,800 ft) — 3.5 km, about 1.5 hours on a gradual, easy trail. Darshan at Tungnath, the world's highest Shiva temple, worshipping the arms of Lord Shiva.",
        "A further 1 km steep climb of about 45 minutes reaches Chandrashila Peak (13,000 ft), with a 360° view of Nanda Devi, Trishul, Chaukhamba and Kedar Dome.",
        "Trek back down to Chopta (2 hours) and drive 20 km to Sari village for the night."
      ],
      highlights: ["Ukhimath", "Chopta", "Tungnath Temple", "Chandrashila Peak", "Himalayan Panorama"],
      meals: "Breakfast & Dinner",
      stayType: "Hotel / Homestay in Sari / Ukhimath"
    },
    {
      day: 5,
      title: "Sari Village to Haridwar",
      driveDistance: "250 km",
      drivingTime: "9-10 Hours",
      timeNote: { label: "Drop-off", value: "6:00 - 7:00 PM" },
      description: "An optional visit to Deoria Tal, followed by the long drive back to Haridwar via Rudraprayag, Devprayag and Rishikesh, marking the end of the tour.",
      detailedParagraphs: [
        "Morning, after breakfast, visit Deoria Tal (2.5 km trek, optional, if time permits) — known for the reflection of Chaukhamba in the lake.",
        "Drive back to Haridwar via Rudraprayag, Devprayag and Rishikesh.",
        "Reach Haridwar by 6:00-7:00 PM. Drop at the railway station / hotel. Tour ends with the blessings of two Kedars."
      ],
      highlights: ["Deoria Tal (Optional)", "Journey Ends"],
      meals: "Breakfast",
      stayType: ""
    }
  ];

  YATRAS[kedarnathTungnathIndex].inclusions = [
    { title: "Transport", description: "Haridwar to Haridwar complete tour by Tempo Traveller / Ertiga / Innova as per group size, with all toll, parking and driver allowance included." },
    { title: "Accommodation", description: "2 nights at Sonprayag / Sitapur in a hotel with attached washroom; 1 night at Kedarnath in a tent / dorm on sharing basis (near the temple); 1 night at Sari / Chopta / Ukhimath in a hotel, homestay or Swiss camp." },
    { title: "Meal Plan", description: "MAP plan — 4 breakfasts and 4 dinners (veg), from Day 1 dinner to Day 5 breakfast, served at the hotel / camp only." },
    { title: "Permits & Registration", description: "Uttarakhand Tourism Yatra registration / e-pass, plus forest entry for Chopta–Tungnath." },
    { title: "Support", description: "Experienced staff, a basic first-aid kit and 24x7 on-tour support." }
  ];

  YATRAS[kedarnathTungnathIndex].exclusions = [
    { title: "Pony / Palki / Helicopter", description: "Pony, palki or helicopter charges for Kedarnath, at actual cost." },
    { title: "Local Jeep", description: "Sonprayag to Gaurikund local jeep, Rs 50 per side, per person." },
    { title: "Lunch & personal expenses", description: "Lunch, personal expenses and porter charges." },
    { title: "Helicopter weight / VIP darshan", description: "Extra helicopter weight charge or VIP darshan, where applicable." },
    { title: "GST", description: "5% GST, extra." },
    { title: "Deoria Tal entry fee", description: "Not included." },
    { title: "Anything not listed", description: "Anything not specifically mentioned under inclusions." }
  ];

  YATRAS[kedarnathTungnathIndex].eligibilityCriteria = [
    { icon: "User", text: "Kedarnath trek: 10-65 years strictly; Tungnath-Chandrashila: 8-70 years, family friendly" },
    { icon: "FileText", text: "Valid ID proof (Aadhaar Card) and Uttarakhand Tourism yatra registration mandatory" },
    { icon: "Stethoscope", text: "No major breathing, heart or knee-surgery history in the last 6 months; asthma / heart / high-BP guests must consult a doctor first" },
    { icon: "Ban", text: "Not for pregnant women, children below 8 years, or anyone with a recent fracture or ligament injury" },
    { icon: "Ban", text: "Alcohol and smoking strictly not allowed on the trek" }
  ];

  YATRAS[kedarnathTungnathIndex].fitnessCriteria = [
    { icon: "Footprints", text: "Able to walk 6-8 hours daily for two continuous days (Kedarnath)" },
    { icon: "TrendingUp", text: "Able to climb 16 km uphill with about 6,000 ft of altitude gain" },
    { icon: "Dumbbell", text: "Normal BMI — obesity is not advised for the trek route" },
    { icon: "Activity", text: "Tungnath-Chandrashila is an easy 3.5 + 1 km trek, suitable for most fitness levels" },
    { icon: "Backpack", text: "70+ guests can opt for the Kedarnath helicopter instead of the trek" }
  ];

  YATRAS[kedarnathTungnathIndex].howToReach = {
    intro: "Kedarnath Tungnath Yatra starts and ends at Haridwar / Rishikesh, with pickup at 5:30 AM on Day 1.",
    air: {
      summaryLabel: "Nearest Airport",
      summary: "Jolly Grant Airport, Dehradun (DED)",
      detail: "About 35 km from Rishikesh, with daily flights from Delhi, Mumbai and Bengaluru. From the airport, take a taxi to Rishikesh — about 1 hour, roughly Rs 1,500."
    },
    train: {
      summaryLabel: "Nearest Railway Station",
      summary: "Haridwar Junction (HW)",
      detail: "Best connected by trains from Delhi (about 6 hours), Mumbai, Kolkata and Lucknow. From Haridwar to Rishikesh is 25 km by auto or bus."
    },
    road: {
      summaryLabel: "Route",
      summary: "Haridwar / Rishikesh to Sonprayag via Devprayag, Srinagar and Rudraprayag",
      detail: "Daily Volvo buses run from Delhi ISBT Kashmiri Gate to Rishikesh / Haridwar (6-7 hours, Rs 600-1,200), including overnight services.",
      route: ["Haridwar / Rishikesh", "Devprayag", "Srinagar", "Rudraprayag", "Guptkashi", "Sonprayag"],
      facts: [
        { label: "Distance", value: "~210 km, Haridwar to Sonprayag" },
        { label: "Drive", value: "~8-9 hours" },
        { label: "Options", value: "Volvo Bus / Shared Taxi / Private Cab / Tempo Traveller" }
      ]
    },
    pickup: {
      point: "Haridwar Railway Station / Rishikesh",
      time: "5:30 AM on Day 1",
      dropPoint: "Haridwar / Rishikesh",
      dropTime: "6:00 - 7:00 PM on Day 5",
      note: "Uttarakhand Tourism yatra registration is compulsory — sent for you free of cost against your Aadhaar card."
    }
  };

  YATRAS[kedarnathTungnathIndex].faqs = [
    {
      title: "What is the total trek distance for Kedarnath Tungnath?",
      description: "A total of 40 km — Kedarnath is 32 km both sides (16+16), and Tungnath-Chandrashila is 8 km both sides (4+4)."
    },
    {
      title: "What is the stay arrangement in Kedarnath?",
      description: "There are no hotels in Kedarnath — only tents / dormitories on a sharing basis, with a common washroom and hot water in a bucket, about 500 metres before the temple. A sleeping bag and blanket are provided."
    },
    {
      title: "Can senior citizens do this yatra?",
      description: "Tungnath is easy and suits everyone. Kedarnath's trek is tough and takes 7-8 hours; a helicopter is recommended for guests above 65."
    },
    {
      title: "Will mobile network and charging be available?",
      description: "Jio works fully in Sonprayag and Chopta. In Kedarnath, Jio and BSNL work partially. A charging point in the Kedarnath tent costs Rs 50-100 — a power bank is a must."
    },
    {
      title: "What is the best time to visit?",
      description: "May-June (summer rush) and September-October (best weather, clear Himalayan views). Avoid July-August due to landslide risk."
    },
    {
      title: "Can kids join the yatra?",
      description: "Kids above 10 years can easily do it. Kids below 8 years are not recommended for the Kedarnath trek."
    },
    {
      title: "What about food?",
      description: "Only pure vegetarian food is available — good hotel food in Sonprayag and Chopta, and simple food like dal-chawal, paratha and Maggi in Kedarnath. Non-veg and alcohol are strictly banned."
    },
    {
      title: "Is registration compulsory?",
      description: "Yes, Uttarakhand Tourism yatra registration is compulsory. It is arranged free of cost — you just need to send your Aadhaar card."
    },
    {
      title: "Is Deoria Tal included?",
      description: "If time permits on Day 5, Deoria Tal (2.5 km trek) is added at no extra cost. The reflection of Chaukhamba peak in the lake is a highlight."
    },
    {
      title: "What should I pack?",
      description: "A heavy jacket, raincoat, trekking shoes (compulsory), woollen cap, gloves, power bank, torch, personal medicines and dry fruits."
    }
  ];

  YATRAS[kedarnathTungnathIndex].article = {
    title: "Kedarnath Tungnath Yatra: The Journey of Two Kedars That Completes Half Shiva",
    standfirst: "If one Kedar gives you darshan, two Kedars give you completeness.",
    sections: [
      {
        paragraphs: [
          "Kedarnath and Tungnath are not two different temples. They are two body parts of the same Mahadev, broken in pain, hidden in the Himalayas, waiting for his true devotees to find him.",
          "In the remote Garhwal Himalayas, where the Mandakini river roars and the rhododendron forests bloom red, lies a journey that is short in days but infinite in emotions — the Kedarnath Tungnath Yatra.",
          "This is not a tour. This is where you first cry in pain while walking 16 km, and then you cry in peace when you finally see him."
        ]
      },
      {
        heading: "The Legend — Why Shiva Broke Himself",
        paragraphs: [
          "After the great Kurukshetra war, the Pandavas had won, but they had killed their own brothers. Their hands were soaked in blood and their souls were heavy with guilt. They came to Lord Shiva for forgiveness.",
          "Shiva was angry. He didn't want to forgive them so easily. He took the form of a giant bull and hid in Guptkashi. When the Pandavas found him, he tried to disappear into the earth. Bhim caught his hump. The bull broke into five pieces.",
          "His hump stayed at Kedarnath, where it is worshipped as a Jyotirlinga. His arms appeared at Tungnath, on a mountain so high that no other Shiva temple exists above it.",
          "So when you visit Kedarnath and Tungnath together, you are not visiting two temples. You are joining two parts of Mahadev's broken body. And that is why it is called the Do Kedar Yatra."
        ]
      },
      {
        heading: "First Kedar: Kedarnath — The Soul (11,755 ft)",
        paragraphs: [
          "The 16 km trek from Gaurikund is not easy. Your legs will shiver at Jungle Chatti, your breath will stop at Bheembali, and your heart will want to quit at Lincholi. But you keep walking because everyone around you is walking — old mothers, small kids, sadhus with bare feet.",
          "And then suddenly, after the last climb, you see it. The giant stone temple, standing alone in the middle of nothing, with Kedar Dome peak behind it covered in snow, and the Mandakini river flowing beside it. It is 1,200 years old, and it has survived floods, snowstorms and time.",
          "You enter. The hump-shaped black stone is covered in ghee and flowers. The priest touches it with devotion. That moment, all your 16 km of pain disappears.",
          "At 6:30 PM, the Shayan Aarti happens. The bells ring, the conch blows, and the whole valley chants Om Namah Shivaya. You don't watch the aarti, you feel it in your bones."
        ]
      },
      {
        heading: "Second Kedar: Tungnath — The Strength (~12,800 ft)",
        paragraphs: [
          "After Kedarnath, most people return. But Mahadev is still incomplete without his arms.",
          "90 km away from Sonprayag lies Chopta, called the Mini Switzerland of India — meadows that look like green carpets, pine trees that touch the sky, and silence that heals you after the Kedarnath crowd.",
          "From Chopta, a 3.5 km trek of pure beauty, full of red rhododendron flowers, takes you to Tungnath — the world's highest Shiva temple. Small, made of stone, covered with prayer flags, with a priest who lives there alone for six months.",
          "Here his arms are worshipped. It is said Ravana did tapasya here, and Ram meditated here after killing Ravana. This is where strength meets peace."
        ]
      },
      {
        heading: "Chandrashila — The Top of the World (13,000 ft)",
        paragraphs: [
          "1 km above Tungnath, a steep climb takes you to Chandrashila. It is said that Chandra, the Moon God, did tapasya here.",
          "You stand on a rock at 13,000 ft. In front of you are more than ten Himalayan peaks — Nanda Devi, Trishul, Chaukhamba, Kedar Dome, Bandarpoonch. All white, all giant, all silent. The wind is cold and the sun is golden. You are above the clouds."
        ]
      },
      {
        heading: "Why You Must Do Kedarnath Tungnath Together",
        paragraphs: [
          "Kedarnath alone is darshan. Kedarnath with Tungnath is completion.",
          "In 5 days, you trek 40 km, climb from 5,000 ft to 13,000 ft, see a Jyotirlinga and the world's highest Shiva temple, walk through forests and glaciers, and sleep in tents where the temperature drops to -2 degrees.",
          "It breaks your legs, but it fixes your soul. Because at the end, when you return to Haridwar, you don't just bring photos back — you bring a story you will tell your grandchildren: I found Mahadev."
        ]
      }
    ],
    signoff: "Trek Kedarnath and Tungnath with Trip My Soul."
  };
}
