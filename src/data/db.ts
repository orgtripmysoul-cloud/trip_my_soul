import { getBlogArticle } from "./blogArticles";

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
  /**
   * Overrides the trail type derived from `themes`, where the listing's own
   * copy describes the trail better than the theme tags can.
   */
  trailType?: string;
  /** Trail route as an ordered list of points, shown as an overview fact. */
  route?: string[];

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
  /** Overrides the "About {name}" heading, e.g. a yatra that should not read "Trek". */
  aboutHeading?: string;
  /** Optional line under the About heading. */
  aboutSubheading?: string;
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
    "heroImage": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Parvati_Valley_river_kasol.jpg/1920px-Parvati_Valley_river_kasol.jpg",
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
    "heroImage": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/Baspa_Valley_under_snow%2C_Kinnaur%2C_Himachal_Pradesh%2C_India.jpg/1920px-Baspa_Valley_under_snow%2C_Kinnaur%2C_Himachal_Pradesh%2C_India.jpg",
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
    "heroImage": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Great_Himalayan_National_Park_Mountain_View.jpg/1920px-Great_Himalayan_National_Park_Mountain_View.jpg",
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
    "heroImage": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/AjitHota_RupinPass_UpperWaterfall.jpg/1920px-AjitHota_RupinPass_UpperWaterfall.jpg",
    "tagline": "A high-altitude crossover from Himachal to Uttarakhand over the 15,350 ft Rupin Pass — hanging villages, a 3-stage waterfall and a steep snow gully into Sangla Valley.",
    "price": 17999,
    "days": 7,
    "nights": 6,
    "region": "Himachal Pradesh",
    "category": "Trending Treks",
    "startLocation": "Shimla to Shimla",
    "difficulty": "Difficult",
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
    ]
  },
  {
    /**
     * Only the client-approved story and the three overview facts it supports
     * are filled in here. Everything else is still pending from the client and
     * deliberately left to the generic fallbacks rather than invented:
     *
     * TODO(content): About Trek copy (aboutParagraphs / highlights / idealFor)
     * TODO(content): quick + detailed itinerary
     * TODO(content): inclusions and exclusions
     * TODO(content): eligibility and fitness criteria
     * TODO(content): departure dates (`batchDates`)
     * TODO(content): how to reach (`howToReach`)
     * TODO(content): trek essentials / packing list
     * TODO(content): FAQs
     * TODO(content): confirm the fare — ₹7,500 below is unconfirmed
     *
     * The hero and gallery are set from the client's Hampta photography at the
     * bottom of this file.
     */
    "slug": "hampta-pass-trek",
    "name": "Hampta Pass",
    "heroImage": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Shea_Goru_%28Hampta_Pass%29.jpg/1920px-Shea_Goru_%28Hampta_Pass%29.jpg",
    "price": 7500,                            // TODO(content): unconfirmed
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
    ],
    // The three facts the client's story supports. The generic 12,500 ft
    // default was wrong for the pass.
    maxAltitude: "14,000 FT / 4,270 M (Hampta Pass)",
    route: ["Jobra (above Manali)", "Balu Ka Ghera", "Hampta Pass", "Shea Goru", "Chatru"],
    trailType: "Crossover Trek — Kullu Valley (Green) to Lahaul (High Desert)"
  },
  {
    "slug": "spiti-valley",
    // Single listing for Spiti: the old `spiti-valley-yatra` stub in YATRAS was
    // the same trip with placeholder content, so it was folded in here.
    "name": "Spiti Valley Trek",
    "heroImage": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Pin_Valley_Spiti_Himachal_Jun18_D72_7092.jpg/1920px-Pin_Valley_Spiti_Himachal_Jun18_D72_7092.jpg",
    heroImages: [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Pin_Valley_Spiti_Himachal_Jun18_D72_7092.jpg/1920px-Pin_Valley_Spiti_Himachal_Jun18_D72_7092.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/Key_Monastery%2C_Spiti_Valley_footloosedev.jpg/1920px-Key_Monastery%2C_Spiti_Valley_footloosedev.jpg",
    ],
    "tagline": "Winter Spiti — the White Desert of the Himalayas, via Shimla-Kinnaur: the monastery circuit of the cold desert (Key, Dhankar, Tabo and Kaza), frozen lakes and the world's highest villages.",
    "price": 22999,
    "days": 9,
    "nights": 8,
    "region": "Himachal Pradesh",
    "category": "Upcoming Winter Treks",
    "batchDates": [
      "2026-10-03",
      "2026-10-10",
      "2026-10-17",
      "2026-10-24",
      "2026-10-31",
      "2026-11-07",
      "2026-11-14",
      "2026-11-21",
      "2026-12-05",
      "2026-12-19",
    ],
    "startLocation": "Delhi To Delhi",
    "endLocation": "Delhi",
    "availability": "Every Saturday night from Delhi",
    "difficulty": "Easy-Moderate",
    "months": [
      "Dec",
      "Jan",
      "Feb",
      "Mar"
    ],
    "themes": [
      "Snow",
      "Off-Beat",
      "Adventure",
      "Winter"
    ],
    maxAltitude: "15,027 FT (Komic — World's Highest Village Connected by Road)",
    totalDistance: "~1,100 Km Shimla to Shimla, plus Delhi-Shimla-Delhi by Volvo",
    fitnessRequirement: "Easy to Moderate — this is a road trip, not a trek. No trekking fitness needed, but you should be able to walk 1-2 Km in snow and handle 8-9 Hrs of daily hill driving.",
    minAge: 10,
    maxAge: 65,
    intro:
      "Spiti Valley, known as the Middle Land between India and Tibet, is a high-altitude cold desert valley in Himachal Pradesh at an average altitude of 12,500 FT — surrounded by snow-capped Himalayas, 1000-year-old monasteries, turquoise rivers and the most dramatic landscapes of India. In winter, brown Spiti turns into a White Desert — 4-5 feet of snow, frozen waterfalls, a frozen Spiti River and temperatures of -15°C to -25°C, isolated from the world once the Manali route closes for the season.",
    idealFor:
      "Bikers, photographers, adventure lovers, mountain lovers, and anyone who wants to disconnect from the city and connect with the Himalayas. Easy to Moderate grade — friends, couples and solo travellers can all join. No trek, only snow walks.",
    highlights: [
      "World's Highest Post Office — Hikkim (14,400 FT)",
      "World's Highest Village Connected by Road — Komic (15,027 FT)",
      "World's Highest Petrol Pump — Kaza (12,270 FT)",
      "Key Monastery (13,668 FT) — Biggest Monastery of Spiti, fully white in winter",
      "Tabo Monastery — 1020 Years Old UNESCO Site, called the Ajanta of the Himalayas",
      "Chicham Bridge — Asia's Highest Bridge (13,596 FT)",
      "Langza — Village of Fossils with a 35 FT Buddha Statue in the white desert",
      "Frozen Nako Lake, frozen waterfalls and a frozen Spiti River",
      "Snow Leopard territory around Kaza & Kibber (Dec-March)",
      "500-year-old naturally preserved Mummy at Gue Village",
    ],
    destinationHighlights: [
      { name: "Chitkul", blurb: "The Last Village of India on the old Indo-Tibet trade route, buried under 3-4 ft of snow in winter." },
      { name: "Kalpa", blurb: "The apple town of Kinnaur, with a front-row view of the 6,000 m Kinner Kailash range turning gold, white and red through the day." },
      { name: "Nako Lake", blurb: "A frozen lake at 3,600 m you can walk on, beside the 1000-year-old Nako Monastery." },
      { name: "Gue Village", blurb: "Home to India's only naturally preserved 500-year-old mummy — the Buddhist monk Lama Sangha Tenzin." },
      { name: "Tabo Monastery", blurb: "1020 years old, a UNESCO site called the Ajanta of the Himalayas, still lit only by butter lamps." },
      { name: "Dhankar Monastery", blurb: "A 1000-year-old monastery and fort built on a cliff edge, 500 years ago." },
      { name: "Key Monastery", blurb: "The biggest monastery of Spiti at 13,668 FT — a snow-covered castle with monks chanting inside." },
      { name: "Chicham Bridge", blurb: "Asia's Highest Bridge at 13,596 FT, over a gorge that runs full of snow in winter." },
      { name: "Hikkim", blurb: "World's Highest Post Office at 14,400 FT — send a postcard to yourself, hand-stamped by Postmaster Rinchen." },
      { name: "Komic", blurb: "World's Highest Village Connected by Road at 15,027 FT — higher than Leh." },
      { name: "Langza", blurb: "Village of Fossils, watched over by a 35 FT Buddha Statue standing in the white desert." },
    ],
    itinerary: [
      {
        day: 0,
        title: "Delhi to Shimla — Overnight Volvo",
        description: "Board an AC Semi-Sleeper Volvo from Delhi for the overnight run to Shimla.",
        detailedParagraphs: [
          "Report at Delhi ISBT Kashmere Gate / Majnu Ka Tila at 9:30 PM. Board the AC Semi-Sleeper Volvo for Shimla — an overnight journey of 350 Km / 9-10 Hrs.",
        ],
        pickupPoint: "Delhi ISBT Kashmere Gate / Majnu Ka Tila",
        pickupTime: "9:30 PM",
        driveDistance: "350 Km",
        drivingTime: "9-10 Hrs",
        stayType: "Overnight Volvo",
      },
      {
        day: 1,
        title: "Shimla to Rampur/Sarahan",
        description: "Drive via Narkanda past Shrikhand Mahadev Peak, check in and visit Bhimakali Temple.",
        detailedParagraphs: [
          "Reach Shimla Bus Stand at 7 AM and meet our Trip Captain. After breakfast, drive to Rampur via Narkanda — 180 Km / 7-8 Hrs — passing the snow-covered Shrikhand Mahadev Peak and the Satluj River.",
          "Check in at the hotel in Rampur/Sarahan. In the evening, visit Bhimakali Temple. Dinner and overnight stay.",
        ],
        highlights: ["Narkanda", "Shrikhand Mahadev Peak view", "Bhimakali Temple"],
        driveDistance: "180 Km",
        drivingTime: "7-8 Hrs",
        stayType: "Hotel",
        meals: "Dinner",
      },
      {
        day: 2,
        title: "Rampur/Sarahan to Chitkul/Sangla",
        description: "The Last Village of India, buried in 3-4 ft of snow, via Karchham Dam and Sangla Valley.",
        detailedParagraphs: [
          "After an early breakfast, drive to Chitkul — the Last Village of India on the old Indo-Tibet trade route — 110 Km / 6-7 Hrs, via Karchham Dam, Sangla Valley and the Baspa River.",
          "Chitkul is fully covered in 3-4 FT of snow in winter. Walk through the white Sangla Valley and stop for chai at the last dhaba. Head back to Sangla by evening. Dinner and overnight stay at a Sangla/Chitkul homestay with Bukhari.",
        ],
        highlights: ["Karchham Dam", "Sangla Valley", "Chitkul — Last Village of India"],
        driveDistance: "110 Km",
        drivingTime: "6-7 Hrs",
        stayType: "Homestay with Bukhari",
        meals: "Breakfast, Dinner",
      },
      {
        day: 3,
        title: "Chitkul to Kalpa",
        description: "The apple town of Kinnaur, with a front-row view of the Kinner Kailash range.",
        detailedParagraphs: [
          "Post breakfast, drive to Kalpa — the apple town of Kinnaur — 60 Km / 3-4 Hrs. Check in at the hotel and get the best view of the Kinner Kailash range (6,000 Mtrs) from your balcony.",
          "In the evening, walk to Roghi Village & Suicide Point for the sunset view. Dinner and overnight stay at Kalpa.",
        ],
        highlights: ["Kinner Kailash view", "Roghi Village", "Suicide Point"],
        driveDistance: "60 Km",
        drivingTime: "3-4 Hrs",
        stayType: "Hotel",
        meals: "Breakfast, Dinner",
      },
      {
        day: 4,
        title: "Kalpa to Nako/Tabo",
        description: "Cross into Spiti at Khab Sangam, walk on the frozen Nako Lake and visit the 1000-year-old Nako Monastery.",
        detailedParagraphs: [
          "Early morning start towards Spiti Valley — 110 Km / 6-7 Hrs. Cross Khab Sangam, the confluence of the Satluj and Spiti rivers, and enter Spiti. Visit Nako Village (3,600 Mtrs) — Nako Lake is fully frozen in winter and you can walk on it. Visit the 1000-year-old Nako Monastery.",
          "Continue to Tabo and check in at the homestay. Dinner and overnight stay at Nako/Tabo.",
        ],
        highlights: ["Khab Sangam", "Frozen Nako Lake", "Nako Monastery"],
        driveDistance: "110 Km",
        drivingTime: "6-7 Hrs",
        stayType: "Homestay",
        meals: "Breakfast, Dinner",
      },
      {
        day: 5,
        title: "Tabo to Kaza via Gue & Dhankar",
        description: "The 500-year-old Gue Mummy, Tabo Monastery and Dhankar Monastery on the way to Kaza.",
        detailedParagraphs: [
          "After breakfast, visit Gue Village — India's only naturally preserved 500-year-old mummy of Lama Sangha Tenzin. Next, Tabo Monastery (1020 years old, UNESCO Site — called the Ajanta of the Himalayas).",
          "Drive to Dhankar and visit the 1000-year-old Dhankar Monastery & Fort on the cliff (subject to weather). Reach Kaza, headquarters of Spiti — 100 Km / 6 Hrs. Check in at the hotel. Dinner and overnight stay at Kaza.",
        ],
        highlights: ["Gue Mummy", "Tabo Monastery", "Dhankar Monastery"],
        driveDistance: "100 Km",
        drivingTime: "6 Hrs",
        stayType: "Hotel",
        meals: "Breakfast, Dinner",
      },
      {
        day: 6,
        title: "Kaza Local — Key, Chicham, Hikkim, Komic, Langza",
        description: "The highlight day of Winter Spiti — Key Monastery, Chicham Bridge and the world's highest villages.",
        detailedParagraphs: [
          "Post breakfast, visit Key Monastery (13,668 FT), the biggest monastery of Spiti, fully white in winter, then Chicham Bridge (13,596 FT), Asia's Highest Bridge.",
          "Continue to Hikkim (14,400 FT), the World's Highest Post Office — send a postcard — then Komic (15,027 FT), the World's Highest Village Connected by Road, and Langza (14,300 FT), the Village of Fossils with its 35 FT Buddha Statue in the white desert.",
          "Back to Kaza for dinner, overnight stay and night star gazing.",
        ],
        highlights: ["Key Monastery", "Chicham Bridge", "Hikkim Post Office", "Komic", "Langza Buddha Statue"],
        driveDistance: "60 Km",
        stayType: "Hotel",
        meals: "Breakfast, Dinner",
      },
      {
        day: 7,
        title: "Kaza to Kalpa",
        description: "Return via Tabo, Nako and Khab Bridge, past the frozen waterfalls of Spiti.",
        detailedParagraphs: [
          "After an early breakfast, drive back to Kalpa via the same route — Tabo, Nako, Khab Bridge — 200 Km / 8-9 Hrs, passing the frozen waterfalls of Spiti. Tyres are chained crossing the Tinku Nala Glacier Point.",
          "Reach Kalpa by evening. Dinner and overnight stay at Kalpa.",
        ],
        highlights: ["Frozen waterfalls of Spiti", "Tinku Nala Glacier Point"],
        driveDistance: "200 Km",
        drivingTime: "8-9 Hrs",
        stayType: "Hotel",
        meals: "Breakfast, Dinner",
      },
      {
        day: 8,
        title: "Kalpa to Shimla — Volvo to Delhi",
        description: "Drive back to Shimla via Rampur-Narkanda and board the overnight Volvo to Delhi.",
        detailedParagraphs: [
          "Post breakfast, drive to Shimla via Rampur-Narkanda — 230 Km / 9-10 Hrs — reaching by 6-7 PM. Board the AC Volvo from Shimla Bus Stand at 9 PM for Delhi — overnight journey.",
        ],
        driveDistance: "230 Km",
        drivingTime: "9-10 Hrs",
        stayType: "Overnight Volvo",
        meals: "Breakfast",
      },
      {
        day: 9,
        title: "Reach Delhi",
        description: "Arrive at Delhi ISBT Kashmere Gate with the memories of White Spiti.",
        detailedParagraphs: [
          "Reach Delhi ISBT Kashmere Gate early morning, around 7-8 AM, with lifetime memories of White Spiti.",
        ],
        stayType: "Trip Ends — Drop at Delhi ISBT Kashmere Gate",
      },
    ],
    "inclusions": [
      { title: "Volvo Transfer", description: "Delhi to Shimla and return by AC Semi-Sleeper Volvo." },
      { title: "Sightseeing Transport", description: "Entire sightseeing Shimla to Shimla by Tempo Traveller / SUV / 4x4, depending on group size and snow conditions." },
      { title: "Accommodation", description: "7 Nights — 1 Night Rampur/Sarahan, 1 Night Chitkul/Sangla, 1 Night Nako/Tabo, 2 Nights Kaza, 1 Night Kalpa, 1 Night Shimla buffer." },
      { title: "Meals", description: "12 Meals — Breakfast & Dinner included in the stays (Lunch not included)." },
      { title: "Permits", description: "All Inner Line Permits for Spiti Valley." },
      { title: "Driver & Vehicle Charges", description: "Driver night charges, toll tax, parking charges, green tax and fuel — all included." },
      { title: "Trip Captain", description: "Experienced Trip Captain / Team Captain throughout the trip." },
      { title: "Safety Kit", description: "An oxygen cylinder and snow chain 24x7 in the car for emergencies, plus a first aid kit." },
    ],
    "exclusions": [
      { title: "Fares Not Mentioned", description: "Any air/train/bus fare not mentioned above." },
      { title: "Lunch", description: "Lunch is not included on any day." },
      { title: "Personal Shopping", description: "Any personal shopping of any type." },
      { title: "Extra Meals & Drinks", description: "Snacks and meals not listed above, plus any alcoholic/non-alcoholic drinks, mineral water and snacks." },
      { title: "Entry Tickets", description: "Monastery entry (Rs 50-100), Gue Mummy ticket (Rs 200), snow boots/jacket rent." },
      { title: "Anything Not Mentioned", description: "Any expense arising from unforeseen contingencies, breakdowns, natural calamities, landslides, roadblocks, over-tourism or snow blizzards." },
    ],
    eligibilityCriteria: [
      { icon: "Users", text: "Minimum age 10 (with parents), maximum age 65 if physically fit — ideal age group 18 to 45 years; children below 10 not allowed due to extreme cold" },
      { icon: "Stethoscope", text: "No serious heart condition, asthma, high blood pressure or epilepsy — consult a doctor first if you have any medical history; not for pregnant women" },
      { icon: "IdCard", text: "Valid Govt ID (Aadhar/Voter ID/Passport) and 2 passport photos for the Inner Line Permit; foreign nationals need a passport + Indian visa copy" },
      { icon: "Users2", text: "Solo travellers and solo female travellers welcome — girls get rooms with other girls in verified family-run homestays" },
      { icon: "Calendar", text: "Basic homestays with Bukhari heater in Nako, Tabo & Kaza — no 5-star luxury, and limited network (only BSNL works in Kaza)" },
    ],
    fitnessCriteria: [
      { icon: "Footprints", text: "Must be able to walk 1-2 Km in snow at Komic, Hikkim, Langza and Key Monastery" },
      { icon: "Mountain", text: "No trekking fitness required — Winter Spiti is a road trip, not a trek — but you should be okay with 8-9 Hrs of daily hill driving" },
      { icon: "AlertTriangle", text: "AMS (headache, vomiting, breathlessness) can occur at altitude — an oxygen cylinder is carried, but inform your Trip Captain immediately if symptoms appear" },
    ],
    faqs: [
      { title: "Is Winter Spiti safe? How cold is it?", description: "Yes, it is safe with an experienced operator. Day temperature is -5°C to 5°C, night temperature -15°C to -25°C in Kaza, Komic and Langza. We carry an oxygen cylinder, first-aid kit, heated homestays with Bukhari, snow chains and an experienced Trip Captain." },
      { title: "What vehicle will be provided from Shimla to Shimla?", description: "As per group size and snow conditions: 12/13 Seater Tempo Traveller, Innova Crysta, or 4x4 Scorpio / Bolero / Thar for heavy snow after Kalpa. All vehicles carry snow chains." },
      { title: "Why don't you take the Manali route in winter?", description: "The Manali-Atal Tunnel-Kunzum Pass-Kaza route stays closed November to June due to 15-20 ft snow at Kunzum Pass (15,060 FT). The only route open in winter is Shimla-Kinnaur-Kaza, which we follow." },
      { title: "Is there mobile network and an ATM in Spiti?", description: "After Kalpa, only BSNL and Jio work, and only in Kaza market with slow data — Airtel/Vi have no network after Reckong Peo. There is one SBI ATM in Kaza, often out of cash — withdraw Rs 5,000-7,000 in Shimla/Reckong Peo." },
      { title: "What type of stay is provided? Will we get heaters?", description: "Hotels with room heaters in Shimla, Narkanda, Rampur and Kalpa. Local homestays with a central Bukhari (wood heater) in Nako, Tabo, Kaza and Sangla/Chitkul. Hot water is given in buckets, as geysers and pipes freeze." },
      { title: "What meals are included?", description: "12 meals: Day 1 Dinner through Day 6 Breakfast & Dinner, plus Day 7 Breakfast. Lunch is not included — available at local dhabas for Rs 200-300." },
      { title: "Can we see a Snow Leopard in winter?", description: "January and February are best. The Snow Leopard comes down to Kibber Wildlife Sanctuary, Langza and Komic to hunt Blue Sheep — sighting chances are 10-15%. Red Fox, Ibex and Himalayan Wolf are commonly seen." },
      { title: "Will Hikkim Post Office and Komic Village be open in winter?", description: "Yes, Hikkim (14,400 FT) stays open 11 AM to 3 PM. Komic (15,027 FT) and Langza are accessible, though heavy snowfall can block roads for a day — the Trip Captain will then take you to Pin Valley or Kibber instead." },
      { title: "Will there be AMS / breathing issues?", description: "Kaza is at 12,500 FT and Komic at 15,027 FT, so mild headache and breathlessness on day one is normal. Stay hydrated, avoid alcohol and consult your doctor about Diamox. An oxygen cylinder is carried 24x7 in the vehicle." },
      { title: "How much luggage should I carry?", description: "Strictly no trolley bags — only 1 Rucksack/Backpack (60L max) plus 1 small handbag, as space in the Tempo Traveller is limited and trolleys don't move in snow. Extra luggage can be left in a Shimla cloakroom for Rs 200/bag." },
      { title: "What is the age limit? Are kids allowed?", description: "Minimum age 10 (with parents), maximum 65 if physically fit — ideal age group 18-45. Not recommended for pregnant women, infants, or people with severe asthma/heart conditions." },
      { title: "Are snow boots and jackets available on rent?", description: "Yes, in Kaza — snow boots for Rs 300-400/day and jackets for Rs 400-500/day. We recommend bringing your own waterproof boots; sports shoes are not recommended." },
      { title: "What is the booking amount and cancellation policy?", description: "Booking amount is Rs 5,000 per seat (non-refundable). Balance is due 7 days before departure. If the trip is cancelled from Shimla due to weather/roadblock, the full amount converts to a 1-year travel voucher — no cash refund if stuck midway due to snowfall." },
      { title: "Which Volvo is provided from Delhi to Shimla?", description: "AC Semi-Sleeper Volvo (ZingBus/HRTC/Private) with 2x3 pushback seats, with 1-2 washroom breaks. Seat numbers are shared on WhatsApp a day before departure." },
      { title: "Can solo travellers and girls join? Is it safe?", description: "Yes, around 40% of our travellers are solo, including solo female travellers. Girls share rooms with other girls in family-run homestays, and Trip Captains are verified." },
    ],
    howToReach: {
      intro:
        "The trip starts and ends at Delhi ISBT Kashmere Gate / Majnu Ka Tila, with pick-up 9-10 PM on Day 0. We provide Delhi-Shimla-Delhi AC Semi-Sleeper Volvo in the package. In winter, the Manali route is closed, so the entire Spiti circuit runs Shimla to Shimla via Kinnaur.",
      air: {
        summaryLabel: "Nearest Airport (for Delhi)",
        summary: "IGI Airport, Delhi (DEL)",
        detail: "From the airport, take the Airport Express Metro to Kashmere Gate (45 mins) or a taxi to Majnu Ka Tila (Rs 500-700). Book your return flight after 2 PM on Day 9, in case the Volvo is delayed by snow.",
      },
      train: {
        summaryLabel: "Nearest Railway Stations (for Delhi)",
        summary: "New Delhi (NDLS), Old Delhi (DLI), Hazrat Nizamuddin (NZM)",
        detail: "From any of these, take an auto or metro to ISBT Kashmere Gate — 15-20 minutes.",
      },
      road: {
        summaryLabel: "Shimla to Spiti Circuit",
        summary: "Shimla - Narkanda - Rampur - Sangla - Chitkul - Kalpa - Nako - Tabo - Kaza - Kalpa - Shimla",
        detail: "The Manali-Atal Tunnel-Kunzum Pass route is closed in winter due to heavy snowfall at Kunzum Pass (15,060 FT). We instead go via Kinnaur — open all year — with snow chains used from Kalpa onward. Total road trip is roughly 1,100 Km, Shimla to Shimla.",
        route: ["Delhi", "Shimla", "Narkanda", "Rampur", "Sangla/Chitkul", "Kalpa", "Nako", "Tabo", "Kaza"],
        facts: [
          { label: "Shimla to Shimla", value: "~1,100 Km" },
          { label: "Delhi to Shimla (Volvo)", value: "350 Km / 9-10 Hrs" },
        ],
      },
      pickup: {
        point: "Delhi ISBT Kashmere Gate (Volvo Stand) / Majnu Ka Tila Tibetan Colony",
        time: "9:00 PM to 10:00 PM, Day 0 (report 30 mins early)",
        dropPoint: "Delhi ISBT Kashmere Gate",
        dropTime: "7-8 AM, Day 9",
      },
    },
    article: {
      title: "White Spiti: When The Himalayas Go Silent",
      standfirst:
        "There is Spiti that you see on Instagram in June — brown mountains, dusty roads, bikes, cafes with travellers. And then there is Spiti in January — which no Instagram reel can capture.",
      readMinutes: 8,
      sections: [
        {
          paragraphs: [
            "In January, Spiti stops trying to impress you. It becomes raw, isolated and brutally honest. The brown mountains turn white. The Spiti River freezes from the edges. Waterfalls become ice walls. Roads disappear under 5 feet of snow. And the whole valley — from Chitkul to Kaza — goes silent. This is Winter Spiti.",
          ],
        },
        {
          heading: "The Only Road In",
          paragraphs: [
            "The journey starts not from Manali, but from Shimla, because Kunzum Pass — the gate from Manali to Spiti — shuts in October under 15 feet of snow. The only way into Spiti in winter is via Kinnaur: Shimla, Narkanda, Rampur, Sangla, Chitkul, Kalpa, Nako, Tabo and then Kaza — the old Hindustan-Tibet Trade Route.",
            "The first white you see is at Narkanda, apple orchards under snow, locals in Kinnauri caps selling chai. After that you follow the Satluj River — the same river that comes from Mansarovar. In Sangla Valley, the Baspa River still flows, but half-frozen, and the sound of water moving under ice is something you remember for years.",
          ],
        },
        {
          heading: "Chitkul, Kalpa and the Frozen Gate of Spiti",
          paragraphs: [
            "Chitkul in winter is not a village, it is a white canvas. The Last Dhaba of India, which sells rajma chawal in summer, sits closed, its tin roof buried under 3 feet of snow. You walk knee-deep to reach the Baspa River, boots sinking, breath freezing — but the view in front, white Kinnaur mountains, frozen waterfalls, no other human for 2 Km, makes you forget the cold.",
            "Kalpa is where you see Kinner Kailash for the first time — a 6,000 m wall of white straight from your hotel window, said to change colour through the day: golden at sunrise, white at noon, red at sunset. From Kalpa, you cross Khab Bridge, where the Satluj meets the Spiti — the official gate of Spiti Valley. After Khab, trees disappear, villages shrink to 10-15 houses, and the snow turns hard, not soft like Shimla, but hard like ice at -15°C.",
          ],
        },
        {
          heading: "A Frozen Lake, a Mummy, and 1000-Year-Old Murals",
          paragraphs: [
            "Nako Lake is the first frozen lake you see — 3,600 m high, 2 feet of solid ice, local kids playing cricket on it. You stand in the middle, surrounded by white mountains, and hear nothing — a silence that only exists in Winter Spiti.",
            "Gue Village is a 40 Km detour, but it holds something India has nowhere else: a 500-year-old natural mummy, Lama Sangha Tenzin, a monk who mummified himself while meditating, still sitting in the same posture. In winter, when only a handful of people visit Gue in a month, you get the monastery to yourself, and the resident lama will make you butter tea and tell you how it was found by ITBP jawans after an earthquake.",
            "Tabo Monastery is 1020 years old. In summer, 200 tourists come daily; in winter you are alone with the lamas still painting murals inside, by nothing but butter lamps. Tabo is called the Ajanta of the Himalayas — and in the silence of winter, you understand why.",
          ],
        },
        {
          heading: "Kaza and the Sky Full of Stars",
          paragraphs: [
            "Then comes Kaza, at 12,500 FT, half-empty in January — 70% of shops shut, only 2-3 cafes open around a Bukhari. You stay in a homestay where a Spitian mother cooks Thukpa, Momos and butter tea on the fire that keeps the room at 5°C when it's -20°C outside. Step out at 2 AM and the Milky Way is so bright it casts shadows on the snow.",
            "The day in Kaza starts at 9 AM, because before that it's -20°C. First stop is Key Monastery — the biggest monastery of Spiti, looking like a white castle against white mountains, with a hundred lamas chanting, their breath fogging the cold air.",
          ],
        },
        {
          heading: "The World's Highest Everything",
          paragraphs: [
            "After Key comes Chicham Bridge, Asia's Highest Bridge at 13,596 FT, over a gorge 1,000 FT deep, wind strong enough that you need support to stand — but the view is white mountains to the horizon.",
            "Hikkim, at 14,400 FT, holds the World's Highest Post Office, run for 30 years by Postmaster Rinchen, who still opens at 10 AM at -25°C to stamp your postcard — it reaches home a month later, but becomes your best souvenir. Komic, at 15,027 FT, is the World's Highest Village Connected by Road, higher than Leh, with only 12 people staying through winter. And Langza, watched over by a 35 FT Buddha Statue standing alone in the white desert, is famous for sea fossils — because Spiti sat under an ocean millions of years ago.",
            "Winter Spiti is not a comfortable trip. It is -20°C, toilets freeze, water freezes, phone batteries die in 2 hours, noses block, lips crack. But it is the most honest Himalayas you will ever see. If Summer Spiti is a destination, Winter Spiti is an experience that stays with you for years.",
          ],
        },
      ],
    },
    thingsToRemember: [
      "No 5-star luxury in Winter Spiti — basic homestays with Bukhari heater in Nako, Tabo and Kaza, still around -10°C indoors at night.",
      "Limited network after Kalpa — only BSNL/Jio work, and only in Kaza market.",
      "Roadblocks from snowfall, landslides and black ice are common — the itinerary can change on weather, and the Trip Captain's call is final.",
      "No alcohol or smoking during the high-altitude drive.",
      "Carry cash — the one ATM in Kaza is often out of money.",
    ],
    // Real Spiti photos, so the listing stops falling back to the generic
    // Himalayan album in `trekDefaults.DEFAULT_GALLERY`. These are the three
    // Commons images the site already carried for Spiti, including the one from
    // the merged `spiti-valley-yatra` listing.
    // TODO(content): swap in the trip's own shots under /Trips_gallery/Spiti.
    gallery: [
      {
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Pin_Valley_Spiti_Himachal_Jun18_D72_7092.jpg/1920px-Pin_Valley_Spiti_Himachal_Jun18_D72_7092.jpg",
        caption: "Pin Valley — the cold desert floor below Kaza",
      },
      {
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/Key_Monastery%2C_Spiti_Valley_footloosedev.jpg/1920px-Key_Monastery%2C_Spiti_Valley_footloosedev.jpg",
        caption: "Key Monastery at 13,668 FT — the biggest monastery of Spiti",
      },
      {
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Key_Monastery%28_Lahaul_Spiti%29.jpg/1920px-Key_Monastery%28_Lahaul_Spiti%29.jpg",
        caption: "The gompa stacked up its ridge above the Spiti River",
      },
    ],
    similarTreks: ["manali-kasol", "auli-snow-trip", "chopta-with-auli"],
  },
  {
    "slug": "manali-kasol",
    "name": "Manali kasol",
    "heroImage": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Solang_Valley_%2CManali%2C_Himachal_Pardes%2C_India.JPG/1920px-Solang_Valley_%2CManali%2C_Himachal_Pardes%2C_India.JPG",
    "price": 11999,
    "days": 6,
    "nights": 5,
    "region": "Himachal Pradesh",
    "category": "Upcoming Winter Treks",
    "batchDates": [
      "2026-10-03",
      "2026-10-10",
      "2026-10-17",
      "2026-10-24",
      "2026-10-31",
      "2026-11-07",
      "2026-11-14",
      "2026-11-21",
      "2026-12-05",
      "2026-12-19",
    ],
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
    "heroImage": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/BIR_BILLING_PARAGLIDING.jpg/1920px-BIR_BILLING_PARAGLIDING.jpg",
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
    "heroImage": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/Parvati_Valley_in_Himachal_Pradesh_03.jpg/1920px-Parvati_Valley_in_Himachal_Pradesh_03.jpg",
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
    "heroImage": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Dhauladhar_alpenglow_above_Dharamshala%2C_India.jpg/1920px-Dhauladhar_alpenglow_above_Dharamshala%2C_India.jpg",
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
    "heroImage": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Beas_Kund_%2801%29.jpg/1920px-Beas_Kund_%2801%29.jpg",
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
    "heroImage": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Pabbar_valley%2C_Rohru.jpg/1920px-Pabbar_valley%2C_Rohru.jpg",
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
    "heroImage": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/Ridge_-_Scandal_Point_-_Shimla_2014-05-07_1215.JPG/1920px-Ridge_-_Scandal_Point_-_Shimla_2014-05-07_1215.JPG",
    "price": 16500,
    "days": 5,
    "nights": 4,
    "region": "Himachal Pradesh",
    "category": "Upcoming Winter Treks",
    "batchDates": [
      "2026-10-03",
      "2026-10-10",
      "2026-10-17",
      "2026-10-24",
      "2026-10-31",
      "2026-11-07",
      "2026-11-14",
      "2026-11-21",
      "2026-12-05",
      "2026-12-19",
    ],
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
    "heroImage": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/Pangong_Tso_Lake_1.jpg/1920px-Pangong_Tso_Lake_1.jpg",
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
    "heroImage": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Sun_Rise_View_from_Kedarkantha_Summit.jpg/1920px-Sun_Rise_View_from_Kedarkantha_Summit.jpg",
    "tagline": "Five days from Dehradun to the 12,500 ft Kedarkantha summit, through the snowbound pine forests above Sankri.",
    "price": 5999,
    "days": 5,
    "nights": 4,
    "region": "Uttarakhand",
    "category": "Upcoming Winter Treks",
    "batchDates": [
      "2026-10-03",
      "2026-10-10",
      "2026-10-17",
      "2026-10-24",
      "2026-10-31",
      "2026-11-07",
      "2026-11-14",
      "2026-11-21",
      "2026-12-05",
      "2026-12-19",
    ],
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
    "heroImage": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/En_route_to_Dayara_Bugyal_at_Gui_camp_03.jpg/1920px-En_route_to_Dayara_Bugyal_at_Gui_camp_03.jpg",
    "tagline": "Four days from Dehradun to one of India's largest alpine meadows, at 12,000 ft above the base village of Raithal.",
    "price": 6499,
    "days": 4,
    "nights": 3,
    "region": "Uttarakhand",
    "category": "Upcoming Winter Treks",
    "batchDates": [
      "2026-10-03",
      "2026-10-10",
      "2026-10-17",
      "2026-10-24",
      "2026-10-31",
      "2026-11-07",
      "2026-11-14",
      "2026-11-21",
      "2026-12-05",
      "2026-12-19",
    ],
    "startLocation": "Raithal",
    "difficulty": "Easy to Moderate",
    "maxAltitude": "12,000 ft / 3,658 m",
    "totalDistance": "20–25 Kilometers",
    "availability": "March – June & September – December (snow: December – February)",
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
    ],
    route: ["Raithal", "Gui", "Dayara Bugyal", "Gui", "Raithal"],
    trailType: "Alpine Meadow Trek — oak & rhododendron forest, meadows and ridges"
  },
  {
    "slug": "kuari-pass-trek",
    "name": "Kuari Pass Trek",
    "heroImage": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Dunagiri_from_Kuari_Pass.jpg/1920px-Dunagiri_from_Kuari_Pass.jpg",
    "tagline": "Six days from Dehradun over Lord Curzon's trail to the 12,516 ft Kuari Pass, facing Nanda Devi, Dronagiri, Kamet and Chaukhamba.",
    "price": 7999,
    "days": 6,
    "nights": 5,
    "region": "Uttarakhand",
    "category": "Upcoming Winter Treks",
    "batchDates": [
      "2026-10-03",
      "2026-10-10",
      "2026-10-17",
      "2026-10-24",
      "2026-10-31",
      "2026-11-07",
      "2026-11-14",
      "2026-11-21",
      "2026-12-05",
      "2026-12-19",
    ],
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
    "heroImage": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/Brahmatal.jpg/1920px-Brahmatal.jpg",
    "tagline": "Five days from Rishikesh through the oak forests above Lohajung to the frozen Brahmatal Lake and a 12,200 ft ridge facing Trishul and Nanda Ghunti.",
    "price": 6499,
    "days": 5,
    "nights": 4,
    "region": "Uttarakhand",
    "category": "Upcoming Winter Treks",
    "batchDates": [
      "2026-10-03",
      "2026-10-10",
      "2026-10-17",
      "2026-10-24",
      "2026-10-31",
      "2026-11-07",
      "2026-11-14",
      "2026-11-21",
      "2026-12-05",
      "2026-12-19",
    ],
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
    "heroImage": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Mt._Dronagiri.jpg/1920px-Mt._Dronagiri.jpg",
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
    "slug": "pangarchulla-peak-trek",
    "name": "Pangarchulla Peak Trek",
    "heroImage": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Pangarchulla_Peak.jpg/1920px-Pangarchulla_Peak.jpg",
    "tagline": "Six days from Rishikesh to the 15,069 ft summit of Pangarchulla Peak, via Auli's Gorson Bugyal and the Khullara campsite in the Nanda Devi Sanctuary.",
    "price": 9999,
    "days": 6,
    "nights": 5,
    "region": "Uttarakhand",
    "category": "Trending Treks",
    "startLocation": "Rishikesh to Rishikesh",
    "endLocation": "Rishikesh",
    "difficulty": "Moderate to Difficult",
    "maxAltitude": "15,069 ft / 4,575 m",
    "totalDistance": "Approx. 540 km by Road + 34 km Trek",
    "availability": "March – May & September – December",
    "months": [
      "Mar",
      "Apr",
      "May",
      "Sep",
      "Oct",
      "Nov",
      "Dec"
    ],
    "themes": [
      "Snow",
      "Meadow",
      "Forest",
      "Peak Summit"
    ],
    intro:
      "Pangarchulla Peak Trek is one of the most thrilling and challenging summit treks of Uttarakhand, located in the Nanda Devi Sanctuary near Joshimath and Auli. Standing tall at 15,069 ft (4,575 m), this peak is not just a trek but a full Himalayan expedition for those who want to go beyond Kedarkantha and Brahmatal.",
    idealFor:
      "Experienced Trekkers, Summit Lovers, Snow Trek Lovers, Himalayan Peak Seekers, Photography Groups, Adventure Clubs, Winter Trek Enthusiasts",
    highlights: [
      "Pangarchulla Peak Summit (15,069 ft) — one of the highest summit treks of Uttarakhand, near the Indo-China border",
      "Khullara Campsite — widely rated as the most beautiful campsite in Uttarakhand, ringed by snow peaks",
      "Gorson Bugyal — Asia's largest bugyal / ski slope, right above Auli",
      "Auli, the 'Mini Switzerland of India', and its artificial lake view",
      "Trail through the Nanda Devi Sanctuary's oak, pine and rhododendron forest",
      "Tali Lake — a frozen lake in winter, and the Kuari Pass trail connection",
      "360° summit view of 20+ Himalayan giants including Nanda Devi, Dronagiri and Chaukhamba",
      "Chance sightings of Himalayan Monal and bear pugmarks along the trail",
    ],
    aboutParagraphs: [
      "Pangarchulla Peak Trek is one of the most thrilling and challenging summit treks of Uttarakhand, located in the Nanda Devi Sanctuary near Joshimath and Auli. Standing tall at 15,069 ft (4,575 m), this peak is not just a trek but a full Himalayan expedition for those who want to go beyond Kedarkantha and Brahmatal.",
      "The trek starts from the famous ski resort Auli, known as Mini Switzerland of India. From Auli, the trail goes through Asia's largest meadow — Gorson Bugyal, then enters the dense forest of oak and rhododendron to reach Gulling Top and Khullara — which is considered one of the most beautiful campsites in the Indian Himalayas. Khullara is surrounded by snow-covered peaks on all sides.",
      "The final summit push starts at 3 AM from Khullara. It is a steep 3,000 ft climb in snow with crampons and gaiters. But once you reach the top, you get a 360° view of more than 20 Himalayan giants including Nanda Devi (India's 2nd highest), Dronagiri, Chaukhamba, Kamet, Hathi-Ghoda, Mana and Neelkanth. No other trek near Rishikesh offers such a close view of Nanda Devi.",
      "Pangarchulla is a 6 Days 5 Nights trek from Rishikesh to Rishikesh. It is graded as Moderate to Difficult and is recommended for trekkers who have already done at least one Himalayan trek like Kedarkantha, Dayara Bugyal or Kuari Pass. Best season is March to May for snow summit and September to December for clear weather.",
      "If you are looking for a real summit, real snow, and real adventure away from the crowd — Pangarchulla Peak is the perfect upgrade for your next Himalayan challenge.",
    ],
    destinationHighlights: [
      { name: "Nanda Devi", blurb: "7,816 m (25,643 ft) — India's second highest peak, dominating the summit-day panorama." },
      { name: "Dronagiri", blurb: "7,066 m (23,182 ft) — one of the guardian peaks of the Nanda Devi Sanctuary." },
      { name: "Chaukhamba", blurb: "7,138 m (23,419 ft) — the four-headed massif visible across the Alaknanda valley." },
      { name: "Kamet", blurb: "7,756 m (25,446 ft) — second highest peak in the Garhwal Himalayas, near the Indo-China border." },
      { name: "Hathi Ghoda", blurb: "6,727 m (22,070 ft) — the elephant-and-horse twin ridge seen from Khullara." },
      { name: "Mana Parvat", blurb: "7,273 m (23,861 ft) — rising above the Mana valley near Badrinath." },
      { name: "Neelkanth", blurb: "6,596 m (21,640 ft) — the pyramid peak overlooking Badrinath and Joshimath." },
    ],
    fitnessRequirement:
      "This is not a beginner trek — you should be able to jog/run 4 Km in 30 minutes daily for at least 15 days before the trek, climb 50 floors without a break, and keep your BMI below 28. Summit day is a steep 14 Km / 12 Hrs climb, so at least one prior Himalayan trek (Kedarkantha, Dayara, Kuari Pass, Brahmatal or Chopta) is strongly preferred.",
    eligibilityCriteria: [
      { icon: "User", text: "Age 14 to 50 years — 14-18 year olds need a parent/guardian; above 45 years need a medical fitness certificate" },
      { icon: "Mountain", text: "At least one prior Himalayan trek preferred — Kedarkantha, Dayara Bugyal, Kuari Pass, Brahmatal or Chopta; not recommended for first-time trekkers" },
      { icon: "Stethoscope", text: "Not allowed for heart patients, high BP, severe asthma, epilepsy, severe joint pain or pregnant women; mild BP/asthma allowed with a doctor's NOC" },
      { icon: "FileText", text: "Aadhaar Card/Passport compulsory for the forest permit, plus a self-declaration form signed at Rishikesh" },
    ],
    fitnessCriteria: [
      { icon: "Footprints", text: "Jog/run 4 Km in 30 minutes daily, at least 15 days before the trek" },
      { icon: "Activity", text: "Climb 50 floors without a break; daily 5 Km walk plus 20 squats and 20 lunges" },
      { icon: "Backpack", text: "Carry an 8-10 Kg personal backpack through a 14 Km, 12-hour summit-day climb" },
      { icon: "TrendingUp", text: "BMI below 28 — an overweight body makes the steep summit push much harder" },
    ],
    itinerary: [
      {
        day: 1,
        title: "Rishikesh to Joshimath (254 Km, 10 Hrs Drive)",
        description: "Assemble at Rishikesh by 6:00 AM, drive to Joshimath/Pipalkoti via Devprayag, Srinagar, Rudraprayag and Karnprayag along the Alaknanda river.",
        detailedDescription:
          "The group will assemble at the pickup point at 06:00 AM. Afterward, you'll be introduced to the whole group and a briefing session would also be provided and then we'll head towards Joshimath/Pipalkoti. We'll reach Joshimath by the evening and check into our designated home stays. Dinner will be served in the evening followed by overnight stay. The pick-up point would be Natraj Chowk/Tapovan Chowk (tentative).",
        pickupPoint: "Rishikesh — Natraj Chowk / Tapovan Chowk",
        pickupTime: "6:00 AM – 6:30 AM",
        driveDistance: "254 Km",
        drivingTime: "10 Hrs",
        stayType: "Homestay / Guest House",
        meals: "Dinner",
      },
      {
        day: 2,
        title: "Joshimath/Pipalkoti to Tugasi (14 Km, 45 Mins Drive) | Trek to Guling (4 Km, 5 Hrs)",
        description: "Short drive to Tugasi village, then trek up to the Guling campsite.",
        detailedDescription:
          "After early morning breakfast, we'll head out for Tugasi Village. Upon reaching Tugasi, we will start our trek to Guling. We'll reach Guling by the afternoon and check into our campsite. Lunch will be served later on. The rest of the day is at leisure. After some group bonding sessions, we will have dinner followed by an overnight stay in Guling.",
        driveDistance: "14 Km",
        drivingTime: "45 Mins",
        trekDistance: "4 Km",
        trekDuration: "5 Hrs",
        stayType: "Alpine / Dome Tents",
        meals: "Breakfast, Lunch, Dinner",
      },
      {
        day: 3,
        title: "Guling to Khullara (6 Km, 7 Hrs)",
        description: "Trek from Guling to the Khullara base camp, considered one of the most beautiful campsites in the Indian Himalayas.",
        detailedDescription:
          "After early morning breakfast, you will be given the necessary instructions regarding the trekking trails. We will start trekking from Guling to Khullara. Later in the evening, we will check into our campsite at Khullara base. The rest of the day is at leisure. As the dusk starts to fall, you will get to witness the magical starry skies above. Dinner followed by an overnight stay at Khullara base camp.",
        trekDistance: "6 Km",
        trekDuration: "7 Hrs",
        stayType: "Alpine / Dome Tents",
        meals: "Breakfast, Lunch, Dinner",
      },
      {
        day: 4,
        title: "Trek to Pangarchulla Summit | Back to Khullara (14 Km, 12 Hrs) — Summit Day",
        description: "Steep 3,000 ft summit push starting before midnight, with 360° views of Chaukhamba, Nilkantha and Nanda Devi, then descend back to Khullara.",
        detailedDescription:
          "Post dinner / early morning 3 AM, a small briefing session with necessary details about the rest of the trek will be provided. Afterward, we will begin our trek to Pangarchulla peak before midnight. Witness the sun rising from the great Himalayan ranges where you will catch a glimpse of the Chaukhamba massif, Nilkantha peaks, and Nanda Devi peaks, and many more. Afterward, we will descend toward the base camp. En route, we will have our packed lunch. Upon reaching Khullara, we will check into our campsite where we will have dinner followed by an overnight stay.",
        trekDistance: "14 Km",
        trekDuration: "12 Hrs",
        stayType: "Alpine / Dome Tents",
        meals: "Breakfast, Packed Lunch, Dinner",
        timeNote: { label: "Summit Start", value: "3:00 AM" },
        highlights: ["Steep 3,000 ft final summit push in snow, roped with crampons and gaiters", "360° view of Nanda Devi, Dronagiri, Chaukhamba, Kamet and Neelkanth from the top"],
      },
      {
        day: 5,
        title: "Khullara to Tugasi (10 Km, 6 Hrs) | Drive to Joshimath/Pipalkoti (14 Km, 45 Mins Drive)",
        description: "Trek back down from Khullara to Tugasi village, then a short drive back to Joshimath/Pipalkoti.",
        detailedDescription:
          "After early morning breakfast, a small briefing session with necessary details about the rest of the trek will be given. We will begin trekking from Khullara to Tugasi village. En route, we will have our packed lunch. Upon reaching Tugasi, we will start the drive to Joshimath / Pipalkoti. Check in to our designated homestay at Joshimath where we will have dinner and spend the night.",
        trekDistance: "10 Km",
        trekDuration: "6 Hrs",
        driveDistance: "14 Km",
        drivingTime: "45 Mins",
        stayType: "Homestay / Guest House",
        meals: "Breakfast, Packed Lunch, Dinner",
      },
      {
        day: 6,
        title: "Joshimath to Rishikesh (254 Km, 10 Hrs Drive) — Drop Day",
        description: "Scenic drive back along the Prayags — Devprayag, Rudraprayag and Karnprayag — to Rishikesh. End of tour.",
        detailedDescription:
          "After a refreshing morning tea, we will check out of our accommodations and start our return journey by driving towards Rishikesh. You can enjoy the scenic views of Prayags like Devprayag, Rudraprayag, and Karnprayag. Upon reaching Rishikesh, the group will disassemble and part ways with fond memories. End of Tour.",
        driveDistance: "254 Km",
        drivingTime: "10 Hrs",
        stayType: "Trek Ends — Drop at Rishikesh",
        meals: "Breakfast",
        timeNote: { label: "Drop", value: "6:00 PM – 7:00 PM at Rishikesh" },
      },
    ],
    inclusions: [
      {
        title: "Transportation",
        description: "Rishikesh to Joshimath & Joshimath to Rishikesh by Tempo Traveller / Bolero (as per group size), plus Joshimath/Pipalkoti to Tugasi and back by local Jeep/Sumo.",
      },
      {
        title: "Accommodation",
        description: "2 nights homestay/guest house at Joshimath/Pipalkoti (triple/quad sharing) + 3 nights tented accommodation at Guling (1N) and Khullara (2N) — dome/alpine tents, triple sharing, sleeping bag, mattress and pillow provided.",
      },
      {
        title: "Meals",
        description: "Day 1 Dinner to Day 6 Breakfast — 5 Breakfast, 4 Lunch, 5 Dinner, all veg meals, plus evening tea-snacks and a packed lunch on summit day.",
      },
      {
        title: "Trek Essentials",
        description: "Certified Trek Leader, local guide and support staff, forest permit and camping charges (Nanda Devi Sanctuary entry fees included), microspikes/crampons and gaiters on summit day if snow, basic first aid kit, oxygen cylinder and oximeter with the trek leader, and a bonfire where permitted.",
      },
      {
        title: "Other",
        description: "All toll tax, parking and driver allowance included.",
      },
    ],
    exclusions: [
      { title: "Anything Not Mentioned", description: "Anything not mentioned in the inclusions above." },
      { title: "Meals in Transit", description: "Day 1 breakfast & lunch, Day 6 lunch & dinner, and any meals during transit on the Rishikesh–Joshimath highway." },
      { title: "Porter/Mule", description: "Personal porter or mule to carry personal luggage — ₹800-1,000 per day per bag extra." },
      { title: "Rental Gear", description: "Trek shoes, trek pole and backpack on rent — available at Joshimath at extra cost." },
      { title: "Insurance & Medical", description: "Any personal insurance and medical expenses." },
      { title: "Extras", description: "Bottled water, tea/coffee apart from meals, and any personal-nature expenses." },
      { title: "Natural Calamity", description: "Any cost arising due to natural calamity, landslide, road block or bad weather — client has to bear." },
      { title: "GST", description: "5% GST extra." },
    ],
    faqs: [
      { title: "What is the height of Pangarchulla Peak?", description: "Pangarchulla Peak is 15,069 ft (4,575 m) above sea level. It is a proper summit trek, not a pass or meadow trek." },
      { title: "Where does the trek start and end? Is it Rishikesh to Rishikesh?", description: "Yes, it is Rishikesh to Rishikesh (6D/5N). Pickup on Day 1 at 6 AM from Rishikesh (Natraj Chowk/Tapovan Chowk) and drop on Day 6 by 6-7 PM at Rishikesh." },
      { title: "What is the difficulty level? Can a beginner do it?", description: "Moderate to Difficult. Not recommended for absolute beginners. At least 1 Himalayan trek (Kedarkantha, Kuari Pass, Dayara, Brahmatal) is preferred. Summit day is a 14 Km / 12 Hrs tough climb, so you need good fitness." },
      { title: "What is the total trek distance and driving distance?", description: "Trek distance is approx. 34 Km (Guling to Summit and back). Driving distance is 254 Km Rishikesh to Joshimath + 14 Km Joshimath to Tugasi = 268 Km one side." },
      { title: "What is the best time for Pangarchulla Trek?", description: "December to April for full snow trek. April to June for best summit views with moderate snow at the top. September to November for clear views with no snow on the trail. Avoid July-August." },
      { title: "Will there be snow?", description: "Yes. Dec to April brings full snow from Guling to Summit (3-5 ft). April-May has snow only near the summit. Sept-Oct has no snow except small patches on the summit." },
      { title: "What is the temperature during the trek?", description: "Day time 8°C to 15°C. Night at Khullara -2°C to -8°C. Summit morning -5°C to -12°C in winters." },
      { title: "What is included in meals?", description: "From Day 1 Dinner to Day 6 Breakfast, all veg meals, with a packed lunch on summit day. Day 1 breakfast/lunch and Day 6 lunch/dinner are not included (on the highway)." },
      { title: "What type of accommodation is provided?", description: "2 nights homestay/guest house at Joshimath/Pipalkoti (triple/quad sharing) plus 3 nights tented stay at Guling (1N) and Khullara (2N), triple sharing. Sleeping bag, mattress and pillow provided." },
      { title: "Is there network/electricity/charging?", description: "Network only at Joshimath/Rishikesh. No network at Guling and Khullara. Electricity only at Joshimath, and no charging in tents — carry a power bank (20,000 mAh)." },
      { title: "Is washroom/toilet available?", description: "Attached washroom at Joshimath. Dry toilet tents (common) at Guling and Khullara — no bathrooms during the trek; wet wipes recommended." },
      { title: "Can I carry my own backpack or will you provide a porter?", description: "You carry your own backpack (8-10 Kg). A personal porter/mule for extra luggage costs ₹800-1,000 per day per bag — inform us in advance." },
      { title: "What if I can't reach the summit?", description: "Safety first. If the trek leader feels you are unfit, or the weather is bad, or you show AMS symptoms, you will be stopped at Khullara. No refund for an incomplete trek." },
      { title: "Is it safe for girls / solo travelers?", description: "Yes, 100% safe. Every group has 30-40% girls and solo travelers, with a certified trek leader, guide and support staff, and separate tents for girls." },
    ],
    howToReach: {
      intro: "Pickup and drop is Rishikesh to Rishikesh — reporting time is 6:00 AM to 6:30 AM sharp on Day 1 at Natraj Chowk/Tapovan Chowk (tentative).",
      air: {
        summaryLabel: "Nearest Airport",
        summary: "Jolly Grant Airport, Dehradun (DED) — 20 Km from Rishikesh",
        detail:
          "Multiple daily flights connect Delhi (DEL) to Dehradun (DED) in about 1 hour on IndiGo, Air India and others. From the airport, a taxi to Rishikesh takes about 45 minutes (₹800-1,200). If your flight lands at night, stay a night in Rishikesh (₹800-1,500) and join the group next morning.",
      },
      train: {
        summaryLabel: "Best Option",
        summary: "Rishikesh Railway Station / Haridwar Junction",
        detail:
          "Rishikesh Railway Station (2 Km from Tapovan) or the newer Yog Nagari Rishikesh (YNRK) station are closest, but Haridwar Junction (20 Km away) has far more trains — all Delhi trains stop there. From Delhi, take the Nanda Devi Express, Yoga Express or Dehradun Shatabdi (4-6 Hrs, night trains available). From Haridwar, a shared auto/bus/cab to Rishikesh takes 45 minutes (₹50-300) and runs 24x7.",
      },
      road: {
        summaryLabel: "By Bus / Overnight Volvo",
        summary: "Delhi ISBT Kashmiri Gate / Anand Vihar to Rishikesh ISBT",
        detail:
          "Direct Volvo/AC buses and cabs run every 30 minutes from Delhi (250 Km, 6-7 Hrs); the last bus is at 11 PM. An overnight bus at 10-11 PM reaches Rishikesh by 5-6 AM, in time to join the group directly — the best option for Delhi guests. From Dehradun (45 Km, 1.5 Hrs), a shared auto/bus/cab runs every 30 minutes for ₹100-300. Rishikesh to Joshimath itself (254 Km, 10 Hrs) is included in the package and run by us.",
        route: ["Rishikesh", "Devprayag", "Srinagar", "Rudraprayag", "Karnprayag", "Joshimath"],
        facts: [
          { label: "Distance", value: "254 Km" },
          { label: "Duration", value: "10 Hours" },
        ],
      },
      pickup: {
        point: "Rishikesh — Natraj Chowk / Tapovan Chowk (tentative)",
        time: "6:00 AM – 6:30 AM (Day 1)",
        dropPoint: "Rishikesh — same as pickup point",
        dropTime: "6:00 PM – 7:00 PM (Day 6)",
        note: "Book your return bus/train/flight after 8 PM only on Day 6 — landslides or road blocks on the highway may delay arrival by 1-2 hours. Own-car parking is available at Rishikesh near Tapovan for ₹200-300 per day.",
      },
    },
    article: {
      title: "Pangarchulla Peak (15,069 ft) — The Ultimate Summit Trek of Uttarakhand",
      standfirst:
        "A perfect combination of snow trails, alpine meadows, oak forests and a jaw-dropping 360° view of the highest Himalayan peaks — the natural next step after Kedarkantha, Kuari Pass or Brahmatal.",
      readMinutes: 7,
      sections: [
        {
          paragraphs: [
            "Pangarchulla Peak Trek is one of the most thrilling and rewarding summit treks in Uttarakhand, nestled in the Nanda Devi Sanctuary near Joshimath. Standing tall at 15,069 ft (4,590 m), Pangarchulla offers a perfect combination of snow trails, alpine meadows, oak forests, and a jaw-dropping 360-degree view of some of the highest Himalayan peaks. If you have already done Kedarkantha, Kuari Pass or Brahmatal and are looking for your next big Himalayan challenge, Pangarchulla is your next summit.",
            "Unlike easy weekend treks, Pangarchulla is a true summit push — a 12-hour, 14 Km day that tests your endurance but rewards you with views you will never forget.",
          ],
        },
        {
          heading: "Why Pangarchulla Peak Trek Is Special",
          paragraphs: [
            "The Summit View: from the top of Pangarchulla, you get a 360-degree panorama of Nanda Devi (7,816 m) — India's second highest peak — the Chaukhamba massif, Dronagiri, Kamet, Hathi-Ghoda, Nilkantha, Mana and Trishul. This view is rated as one of the best in the Garhwal Himalayas.",
            "The Trail Variation: the trail starts from Joshimath, goes to Tugasi — a small Himalayan village — then through dense oak and pine forests to Guling and Khullara, beautiful camping grounds. Khullara is your base camp, with Nanda Ghunti right in front.",
            "Best Snow Trek After Kedarkantha: in winter (December to April), the entire trail from Guling to Summit is covered in 3-5 feet of snow, and you will need microspikes and gaiters — a true snow adventure.",
            "Not Crowded: unlike Kedarkantha or Chopta, Pangarchulla is less crowded. You get peace, raw nature and real Himalayan wilderness.",
          ],
        },
        {
          heading: "Best Time to Visit",
          paragraphs: [
            "Winter / Snow Season (December to March) is best for snow lovers — full snow till Khullara, though the summit needs technical gear and temperatures drop to -10 to -15°C at night.",
            "Spring (April to June) is best for beginners wanting a summit plus clear views — snow only at the summit, and pleasant weather overall.",
            "Autumn (September to November) brings clear skies and the best mountain views, with no snow on the trail except at the summit — perfect for photography.",
            "Avoid July-August — it's monsoon season, with a high landslide risk.",
          ],
        },
        {
          heading: "How Difficult Is Pangarchulla Trek?",
          paragraphs: [
            "Grade: Moderate to Difficult. It is not recommended for first-time trekkers — you need at least one easy-to-moderate trek behind you. Summit day itself is difficult: 14 Km with a roughly 3,000-5,000 ft ascent in a single day. Fitness is mandatory — you should be able to jog 4 Km in 30 minutes.",
          ],
        },
        {
          heading: "What to Carry",
          paragraphs: [
            "Trek shoes (waterproof, with ankle support), a 50-60 L backpack, a down jacket, 3 layers of clothing, 2 trek pants, thermal inners, a woolen cap, gloves, sunglasses, sunscreen, a power bank, a water bottle and personal medicine. Microspikes, gaiters, a sleeping bag and a mattress are provided by us where there's snow.",
          ],
        },
      ],
      signoff:
        "Pangarchulla is not just a trek, it's your first Himalayan summit. That feeling of standing at 15,069 ft with Nanda Devi in front of you cannot be described in words.",
    },
    thingsToRemember: [
      "Smoking and drinking are strictly not allowed during the trek — offenders will be sent back",
      "No littering — carry back your plastic and use the dustbins provided",
      "Follow the trek leader's instructions and don't go off alone — group safety is important",
      "Keep your personal backpack to a maximum of 8-10 Kg; leave extra luggage at Joshimath (locker facility available)",
      "The trek leader's decision is final — if a health issue arises during the trek, you will be descended to Joshimath with no refund for an incomplete trek",
    ],
    similarTreks: ["kuari-pass-trek", "rupin-pass-trek", "har-ki-dun-trek", "kedarkantha-trek", "gulabi-kantha-trek"],
    batchDates: [
      "2026-10-01", "2026-10-02", "2026-10-03", "2026-10-04", "2026-10-05", "2026-10-06", "2026-10-07", "2026-10-08",
      "2026-10-09", "2026-10-10", "2026-10-11", "2026-10-12", "2026-10-13", "2026-10-14", "2026-10-15", "2026-10-16",
      "2026-10-17", "2026-10-18", "2026-10-19", "2026-10-20", "2026-10-21", "2026-10-22", "2026-10-23", "2026-10-24",
      "2026-10-25", "2026-10-26", "2026-10-27", "2026-10-28", "2026-10-29", "2026-10-30", "2026-10-31", "2026-11-01",
      "2026-11-02", "2026-11-03", "2026-11-04", "2026-11-05", "2026-11-06", "2026-11-07", "2026-11-08", "2026-11-09",
      "2026-11-10", "2026-11-11", "2026-11-12", "2026-11-13", "2026-11-14", "2026-11-15", "2026-11-16", "2026-11-17",
      "2026-11-18", "2026-11-19", "2026-11-20", "2026-11-21", "2026-11-22", "2026-11-23", "2026-11-24", "2026-11-25",
      "2026-11-26", "2026-11-27", "2026-11-28", "2026-11-29", "2026-11-30", "2026-12-01", "2026-12-02", "2026-12-03",
      "2026-12-04", "2026-12-05", "2026-12-06", "2026-12-07", "2026-12-08", "2026-12-09", "2026-12-10", "2026-12-11",
      "2026-12-12", "2026-12-13", "2026-12-14", "2026-12-15",
    ],
  },
  {
    "slug": "bali-pass-trek",
    "name": "Bali Pass Trek",
    "heroImage": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/SWARGAROHINI_PEAK.jpg/1920px-SWARGAROHINI_PEAK.jpg",
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
    "heroImage": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Phulara_ridge.jpg/1920px-Phulara_ridge.jpg",
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
    "heroImage": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Gangotri_Glacier.jpg/1920px-Gangotri_Glacier.jpg",
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
    "heroImage": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Valley_of_flowers_national_park%2C_Uttarakhand%2C_India_03_%28edit%29.jpg/1920px-Valley_of_flowers_national_park%2C_Uttarakhand%2C_India_03_%28edit%29.jpg",
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
    "heroImage": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Nag_Tibba_02.jpg/1920px-Nag_Tibba_02.jpg",
    "tagline": "Two days from Dehradun through the oak forests above Pantwari to the 9,915 ft Nag Tibba summit.",
    "price": 3499,
    "days": 2,
    "nights": 1,
    "region": "Uttarakhand",
    "category": "Upcoming Winter Treks",
    "batchDates": [
      "2026-10-03",
      "2026-10-10",
      "2026-10-17",
      "2026-10-24",
      "2026-10-31",
      "2026-11-07",
      "2026-11-14",
      "2026-11-21",
      "2026-12-05",
      "2026-12-19",
    ],
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
    "heroImage": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bb/Har_ki_doon_valley_-Sankari_Range_-Uttarakhand-DSC_0002.jpg/1920px-Har_ki_doon_valley_-Sankari_Range_-Uttarakhand-DSC_0002.jpg",
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
    "slug": "chakrata-trip",
    "name": "Chakrata Trip",
    "heroImage": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Chakrata_nice_wather.jpg/1920px-Chakrata_nice_wather.jpg",
    "price": 3999,
    "days": 2,
    "nights": 1,
    "region": "Uttarakhand",
    "category": "Weekend Getaways",
    "startLocation": "Delhi to Delhi",
    "difficulty": "Easy",
    "availability": "March to June & September to February",
    "months": [
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
      "Jan",
      "Feb"
    ],
    "themes": [
      "Waterfall",
      "Forest",
      "Camping",
      "Weekend Getaway"
    ]
  },
  {
    "slug": "auli-weekend-tour",
    "name": "Auli Weekend Tour",
    "heroImage": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Auli_in_October_2015_-_36.jpg/1920px-Auli_in_October_2015_-_36.jpg",
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
    "heroImage": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/Thalay_Sagar_Bhrigupanth_Kirti_Sthambh_and_Bharte_Kunta.jpg/1920px-Thalay_Sagar_Bhrigupanth_Kirti_Sthambh_and_Bharte_Kunta.jpg",
    "price": 20999,
    "days": 7,
    "nights": 6,
    "region": "Uttarakhand",
    "category": "Upcoming Winter Treks",
    "batchDates": [
      "2026-10-03",
      "2026-10-10",
      "2026-10-17",
      "2026-10-24",
      "2026-10-31",
      "2026-11-07",
      "2026-11-14",
      "2026-11-21",
      "2026-12-05",
      "2026-12-19",
    ],
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
    "heroImage": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/SUPIN_RIVER_VALLEY.jpg/1920px-SUPIN_RIVER_VALLEY.jpg",
    "price": 19999,
    "days": 8,
    "nights": 7,
    "region": "Uttarakhand",
    "category": "Upcoming Winter Treks",
    "batchDates": [
      "2026-10-03",
      "2026-10-10",
      "2026-10-17",
      "2026-10-24",
      "2026-10-31",
      "2026-11-07",
      "2026-11-14",
      "2026-11-21",
      "2026-12-05",
      "2026-12-19",
    ],
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
    "heroImage": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/Gulabi_Kantha_Trek_in_winters.png/1920px-Gulabi_Kantha_Trek_in_winters.png",
    "price": 11999,
    "days": 6,
    "nights": 5,
    "region": "Uttarakhand",
    "category": "Upcoming Winter Treks",
    "batchDates": [
      "2026-10-03",
      "2026-10-10",
      "2026-10-17",
      "2026-10-24",
      "2026-10-31",
      "2026-11-07",
      "2026-11-14",
      "2026-11-21",
      "2026-12-05",
      "2026-12-19",
    ],
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
    "heroImage": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Purva_Falls_formed_by_Tons_River.jpg/1920px-Purva_Falls_formed_by_Tons_River.jpg",
    "price": 12999,
    "days": 7,
    "nights": 6,
    "region": "Uttarakhand",
    "category": "Upcoming Winter Treks",
    "batchDates": [
      "2026-10-03",
      "2026-10-10",
      "2026-10-17",
      "2026-10-24",
      "2026-10-31",
      "2026-11-07",
      "2026-11-14",
      "2026-11-21",
      "2026-12-05",
      "2026-12-19",
    ],
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
    "heroImage": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/Trisul_peak_from_bedni_bugyal.jpg/1920px-Trisul_peak_from_bedni_bugyal.jpg",
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
    "heroImage": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/Tarsar_lake-Kashmir.jpg/1920px-Tarsar_lake-Kashmir.jpg",
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
    "heroImage": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Deoban.jpg/1920px-Deoban.jpg",
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
    "heroImage": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7f/Campsite_near_Gangabal_lake%2C_Jammu_and_Kashmir%2C_India.jpg/1920px-Campsite_near_Gangabal_lake%2C_Jammu_and_Kashmir%2C_India.jpg",
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
    "heroImage": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/Dal_Lake_at_sunset%2C_Srinagar.jpg/1920px-Dal_Lake_at_sunset%2C_Srinagar.jpg",
    "price": 14999,
    "days": 5,
    "nights": 4,
    "region": "Jammu & Kashmir",
    "category": "Upcoming Winter Treks",
    "batchDates": [
      "2026-10-03",
      "2026-10-10",
      "2026-10-17",
      "2026-10-24",
      "2026-10-31",
      "2026-11-07",
      "2026-11-14",
      "2026-11-21",
      "2026-12-05",
      "2026-12-19",
    ],
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
    "heroImage": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Madhyamaheshwar_Temple.JPG/1920px-Madhyamaheshwar_Temple.JPG",
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
    "heroImage": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Mawlynnong%27s_Living_Root_Bridge_in_Meghalaya%2C_India.jpg/1920px-Mawlynnong%27s_Living_Root_Bridge_in_Meghalaya%2C_India.jpg",
    "price": 21499,
    "days": 6,
    "nights": 5,
    "region": "Meghalaya",
    "category": "Upcoming Winter Treks",
    "batchDates": [
      "2026-10-03",
      "2026-10-10",
      "2026-10-17",
      "2026-10-24",
      "2026-10-31",
      "2026-11-07",
      "2026-11-14",
      "2026-11-21",
      "2026-12-05",
      "2026-12-19",
    ],
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
    "heroImage": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/06/Mighty_snow_peak%2C_Chopta%2C_Uttarakhand.jpg/1920px-Mighty_snow_peak%2C_Chopta%2C_Uttarakhand.jpg",
    "price": null, // TODO(content): real price; the card shows "TBD" until set.
    "days": 3, // TODO(content): real duration.
    "nights": 2, // TODO(content): real duration.
    "region": "Uttarakhand",
    "category": "Upcoming Winter Treks",
    "batchDates": [
      "2026-10-03",
      "2026-10-10",
      "2026-10-17",
      "2026-10-24",
      "2026-10-31",
      "2026-11-07",
      "2026-11-14",
      "2026-11-21",
      "2026-12-05",
      "2026-12-19",
    ],
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
    // TODO(content): add `tagline` — a one-line card summary. TrekCard falls back
    // to a neutral factual line while it is unset.
  },
  {
    // Full content sourced from the ops-supplied Panwali Kantha write-up
    // (overview, itinerary, eligibility, article, FAQs, how-to-reach and
    // package terms); extended detail-page fields are assigned below via
    // `panwaliKanthaIndex`.
    // TODO(content): no fixed package price is
    // published in the source (it's offered "in customise"), so `price`
    // stays null (see `priceNote`).
    "slug": "panwali-kantha-trek",
    "name": "Panwali Kantha Trek",
    "heroImage": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Nomads_of_the_Bugyals_in_Uttarakhand_01.jpg/1920px-Nomads_of_the_Bugyals_in_Uttarakhand_01.jpg",
    "tagline": "A 7-8 km untouched Himalayan meadow at 11,500 ft between Trijuginarayan and Kedarnath, with a 180° wall of Garhwal peaks and almost no crowd",
    "price": null,
    "days": 5,
    "nights": 4,
    "region": "Uttarakhand",
    "category": "Uttarakhand",
    "startLocation": "Dehradun",
    "endLocation": "Dehradun",
    "difficulty": "Moderate",
    "maxAltitude": "11,500 ft / 3,505 m",
    "totalDistance": "32-33 km (16 km one way)",
    "availability": "15 May to 25 June & 15 September to 15 October",
    // Best season per the source is 15 May-25 Jun and 15 Sep-15 Oct — not a
    // winter trek, so this doesn't match SEASON_MAP["Winter"] in app/page.tsx.
    "months": [
      "May",
      "Jun",
      "Sep",
      "Oct"
    ],
    "themes": [
      "Meadow",
      "Forest",
      "Camping",
      "Temple"
    ]
  },
  {
    // Full content sourced from the ops-supplied Khaliya Top write-up
    // (overview, itinerary, eligibility, article, FAQs, how-to-reach and
    // package terms); extended detail-page fields are assigned below via
    // `khaliyaTopIndex`.
    "slug": "khaliya-top-trek",
    "name": "Khaliya Top Trek",
    "heroImage": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Sunrise_at_Munsiyari_-_I_%2814547053363%29.jpg/1920px-Sunrise_at_Munsiyari_-_I_%2814547053363%29.jpg",
    "tagline": "Kumaon's balcony above Munsiyari — a 6 km alpine meadow at 11,500 ft with the closest possible sunrise view of the Panchachuli range",
    "price": null, // TODO(content): no fixed package price published in the source (see `priceNote`/`sourceCaveat`).
    "days": 4,
    "nights": 3,
    "region": "Uttarakhand",
    "category": "Uttarakhand",
    "startLocation": "Kathgodam",
    "endLocation": "Kathgodam",
    "difficulty": "Easy to Moderate",
    "maxAltitude": "11,500 ft / 3,500 m",
    "totalDistance": "12 km (6 km up + 6 km down)",
    "availability": "March to June & September to November",
    "months": [
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Sep",
      "Oct",
      "Nov"
    ],
    "themes": [
      "Meadow",
      "Snow",
      "Forest",
      "Sunrise"
    ]
  },
  {
    // TODO(content): winter catalogue stub for Munsiyari-Khalia Top. Every value marked TODO
    // below is a placeholder — ops to confirm before this listing goes live.
    "slug": "munsiyari-khalia-top",
    "name": "Munsiyari-Khalia Top",
    "heroImage": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Panchachuli_Peaks.jpg/1920px-Panchachuli_Peaks.jpg",
    "price": null, // TODO(content): real price; the card shows "TBD" until set.
    "days": 3, // TODO(content): real duration.
    "nights": 2, // TODO(content): real duration.
    "region": "Uttarakhand",
    "category": "Upcoming Winter Treks",
    "batchDates": [
      "2026-10-03",
      "2026-10-10",
      "2026-10-17",
      "2026-10-24",
      "2026-10-31",
      "2026-11-07",
      "2026-11-14",
      "2026-11-21",
      "2026-12-05",
      "2026-12-19",
    ],
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
    // TODO(content): add `tagline` — a one-line card summary. TrekCard falls back
    // to a neutral factual line while it is unset.
  },
  {
    // TODO(content): winter catalogue stub for Kartik Swami Trek. Every value marked TODO
    // below is a placeholder — ops to confirm before this listing goes live.
    "slug": "kartik-swami-trek",
    "name": "Kartik Swami Trek",
    "heroImage": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Golden_landscape_from_Kartik_Swami_Temple_Rudraprayag.JPG/1920px-Golden_landscape_from_Kartik_Swami_Temple_Rudraprayag.JPG",
    "price": null, // TODO(content): real price; the card shows "TBD" until set.
    "days": 3, // TODO(content): real duration.
    "nights": 2, // TODO(content): real duration.
    "region": "Uttarakhand",
    "category": "Upcoming Winter Treks",
    "batchDates": [
      "2026-10-03",
      "2026-10-10",
      "2026-10-17",
      "2026-10-24",
      "2026-10-31",
      "2026-11-07",
      "2026-11-14",
      "2026-11-21",
      "2026-12-05",
      "2026-12-19",
    ],
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
    // neutral factual line while it is unset). The hero and gallery are set from
    // the client's Kartik Swami photography at the bottom of this file.
  },
  {
    // TODO(content): winter catalogue stub for Auli Snow Trip. Every value marked TODO
    // below is a placeholder — ops to confirm before this listing goes live.
    "slug": "auli-snow-trip",
    "name": "Auli Snow Trip",
    "heroImage": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2d/Snow_at_Auli.jpg/1920px-Snow_at_Auli.jpg",
    "price": null, // TODO(content): real price; the card shows "TBD" until set.
    "days": 3, // TODO(content): real duration.
    "nights": 2, // TODO(content): real duration.
    "region": "Uttarakhand",
    "category": "Upcoming Winter Treks",
    "batchDates": [
      "2026-10-03",
      "2026-10-10",
      "2026-10-17",
      "2026-10-24",
      "2026-10-31",
      "2026-11-07",
      "2026-11-14",
      "2026-11-21",
      "2026-12-05",
      "2026-12-19",
    ],
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
    // TODO(content): add `tagline` — a one-line card summary. TrekCard falls back
    // to a neutral factual line while it is unset.
  },
  {
    // Chopta with Auli — Rishikesh-to-Rishikesh circuit covering Auli's ski
    // slopes, the Tungnath-Chandrashila trek and the Deoria Tal lake trek via
    // Sari Village. Extended detail-page content lives further down this file,
    // in the `choptaWithAuliIndex` block.
    "slug": "chopta-with-auli",
    "name": "Chopta with Auli",
    "heroImage": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Auli_in_October_2015_-_38.jpg/1920px-Auli_in_October_2015_-_38.jpg",
    "tagline": "Auli's ski slopes, the world's highest Shiva temple and a 13,000 ft summit in one trip",
    "price": null, // TODO(content): real price; the card shows "TBD" until set.
    "days": 4,
    "nights": 3,
    "region": "Uttarakhand",
    "category": "Upcoming Winter Treks",
    "batchDates": [
      "2026-10-03",
      "2026-10-10",
      "2026-10-17",
      "2026-10-24",
      "2026-10-31",
      "2026-11-07",
      "2026-11-14",
      "2026-11-21",
      "2026-12-05",
      "2026-12-19",
    ],
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
  },
  {
    // TODO(content): winter catalogue stub for Chopta Snow Trip. Every value marked TODO
    // below is a placeholder — ops to confirm before this listing goes live.
    "slug": "chopta-snow-trip",
    "name": "Chopta Snow Trip",
    "heroImage": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/Tungnath_Temple_in_winter.jpg/1920px-Tungnath_Temple_in_winter.jpg",
    "price": null, // TODO(content): real price; the card shows "TBD" until set.
    "days": 3, // TODO(content): real duration.
    "nights": 2, // TODO(content): real duration.
    "region": "Uttarakhand",
    "category": "Upcoming Winter Treks",
    "batchDates": [
      "2026-10-03",
      "2026-10-10",
      "2026-10-17",
      "2026-10-24",
      "2026-10-31",
      "2026-11-07",
      "2026-11-14",
      "2026-11-21",
      "2026-12-05",
      "2026-12-19",
    ],
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
    // TODO(content): add `tagline` — a one-line card summary. TrekCard falls back
    // to a neutral factual line while it is unset.
  },
  {
    // TODO(content): winter catalogue stub for Munsiyari Snow Trip. Every value marked TODO
    // below is a placeholder — ops to confirm before this listing goes live.
    "slug": "munsiyari-snow-trip",
    "name": "Munsiyari Snow Trip",
    "heroImage": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/Panchachuli_and_nearby_peaks.jpg/1920px-Panchachuli_and_nearby_peaks.jpg",
    "price": null, // TODO(content): real price; the card shows "TBD" until set.
    "days": 3, // TODO(content): real duration.
    "nights": 2, // TODO(content): real duration.
    "region": "Uttarakhand",
    "category": "Upcoming Winter Treks",
    "batchDates": [
      "2026-10-03",
      "2026-10-10",
      "2026-10-17",
      "2026-10-24",
      "2026-10-31",
      "2026-11-07",
      "2026-11-14",
      "2026-11-21",
      "2026-12-05",
      "2026-12-19",
    ],
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
    // TODO(content): add `tagline` — a one-line card summary. TrekCard falls back
    // to a neutral factual line while it is unset.
  },
  {
    // Full content sourced from the ops-supplied Kanatal write-up (overview,
    // itinerary, eligibility, article, FAQs, how-to-reach and package terms);
    // extended detail-page fields are assigned below via `kanatalIndex`.
    // TODO(content): no fixed package price is
    // published in the source, so `price` stays null (see `priceNote`).
    "slug": "kanatal-winter-trip",
    "name": "Kanatal Winter Trip",
    "heroImage": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Himalays-viewed-from-Dhanaulti.jpg/1920px-Himalays-viewed-from-Dhanaulti.jpg",
    "tagline": "A quiet pine-forest hill station near Mussoorie, with Surkanda Devi temple, forest treks and zip-lining over the valley",
    "price": null,
    "days": 3,
    "nights": 2,
    "region": "Uttarakhand",
    "category": "Upcoming Winter Treks",
    "batchDates": [
      "2026-10-03",
      "2026-10-10",
      "2026-10-17",
      "2026-10-24",
      "2026-10-31",
      "2026-11-07",
      "2026-11-14",
      "2026-11-21",
      "2026-12-05",
      "2026-12-19",
    ],
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
    "heroImage": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Dhanaulti_snow_fall.jpg/1920px-Dhanaulti_snow_fall.jpg",
    "price": null, // TODO(content): real price; the card shows "TBD" until set.
    "days": 3, // TODO(content): real duration.
    "nights": 2, // TODO(content): real duration.
    "region": "Uttarakhand",
    "category": "Upcoming Winter Treks",
    "batchDates": [
      "2026-10-03",
      "2026-10-10",
      "2026-10-17",
      "2026-10-24",
      "2026-10-31",
      "2026-11-07",
      "2026-11-14",
      "2026-11-21",
      "2026-12-05",
      "2026-12-19",
    ],
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
    // TODO(content): add `tagline` — a one-line card summary. TrekCard falls back
    // to a neutral factual line while it is unset.
  },
  {
    // TODO(content): winter catalogue stub for Mussoorie Winter Escape. Every value marked TODO
    // below is a placeholder — ops to confirm before this listing goes live.
    "slug": "mussoorie-winter-escape",
    "name": "Mussoorie Winter Escape",
    "heroImage": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Mussoorie_Hill_Station.jpg/1920px-Mussoorie_Hill_Station.jpg",
    "price": null, // TODO(content): real price; the card shows "TBD" until set.
    "days": 3, // TODO(content): real duration.
    "nights": 2, // TODO(content): real duration.
    "region": "Uttarakhand",
    "category": "Upcoming Winter Treks",
    "batchDates": [
      "2026-10-03",
      "2026-10-10",
      "2026-10-17",
      "2026-10-24",
      "2026-10-31",
      "2026-11-07",
      "2026-11-14",
      "2026-11-21",
      "2026-12-05",
      "2026-12-19",
    ],
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
    // TODO(content): add `tagline` — a one-line card summary. TrekCard falls back
    // to a neutral factual line while it is unset.
  },
  {
    // TODO(content): winter catalogue stub for Chakrata Winter Trip. Every value marked TODO
    // below is a placeholder — ops to confirm before this listing goes live.
    "slug": "chakrata-winter-trip",
    "name": "Chakrata Winter Trip",
    "heroImage": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Dehradun_Snow_covered_peaks.jpg/1920px-Dehradun_Snow_covered_peaks.jpg",
    "price": null, // TODO(content): real price; the card shows "TBD" until set.
    "days": 3, // TODO(content): real duration.
    "nights": 2, // TODO(content): real duration.
    "region": "Uttarakhand",
    "category": "Upcoming Winter Treks",
    "batchDates": [
      "2026-10-03",
      "2026-10-10",
      "2026-10-17",
      "2026-10-24",
      "2026-10-31",
      "2026-11-07",
      "2026-11-14",
      "2026-11-21",
      "2026-12-05",
      "2026-12-19",
    ],
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
    // TODO(content): add `tagline` — a one-line card summary. TrekCard falls back
    // to a neutral factual line while it is unset.
  },
  {
    "slug": "nainital-winter-trip",
    "name": "Nainital Winter Trip",
    "heroImage": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Naini_Lake%2C_Nainital%2C_Uttarakhand%2C_India.jpg/1920px-Naini_Lake%2C_Nainital%2C_Uttarakhand%2C_India.jpg",
    "tagline": "The Lake City of Uttarakhand — Naini Lake boating, Mall Road evenings, Himalayan view points and the Bhimtal-Sattal-Naukuchiatal lake cluster, Kathgodam to Kathgodam.",
    "price": null, // TODO(content): real price; the card shows "TBD" until set.
    "days": 3,
    "nights": 2,
    "region": "Uttarakhand",
    "category": "Upcoming Winter Treks",
    "batchDates": [
      "2026-10-03",
      "2026-10-10",
      "2026-10-17",
      "2026-10-24",
      "2026-10-31",
      "2026-11-07",
      "2026-11-14",
      "2026-11-21",
      "2026-12-05",
      "2026-12-19",
    ],
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
    "heroImage": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/Misty_Chir_Pine_woods_in_Ranikhet.jpg/1920px-Misty_Chir_Pine_woods_in_Ranikhet.jpg",
    "price": null, // TODO(content): real price; the card shows "TBD" until set.
    "days": 3, // TODO(content): real duration.
    "nights": 2, // TODO(content): real duration.
    "region": "Uttarakhand",
    "category": "Upcoming Winter Treks",
    "batchDates": [
      "2026-10-03",
      "2026-10-10",
      "2026-10-17",
      "2026-10-24",
      "2026-10-31",
      "2026-11-07",
      "2026-11-14",
      "2026-11-21",
      "2026-12-05",
      "2026-12-19",
    ],
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
    // TODO(content): add `tagline` — a one-line card summary. TrekCard falls back
    // to a neutral factual line while it is unset.
  },
  {
    // TODO(content): winter catalogue stub for Binsar Winter Escape. Every value marked TODO
    // below is a placeholder — ops to confirm before this listing goes live.
    "slug": "binsar-winter-escape",
    "name": "Binsar Winter Escape",
    "heroImage": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/On_the_edge_of_heaven_%28binsar_wild_life_sanctury%29.jpg/1920px-On_the_edge_of_heaven_%28binsar_wild_life_sanctury%29.jpg",
    "price": null, // TODO(content): real price; the card shows "TBD" until set.
    "days": 3, // TODO(content): real duration.
    "nights": 2, // TODO(content): real duration.
    "region": "Uttarakhand",
    "category": "Upcoming Winter Treks",
    "batchDates": [
      "2026-10-03",
      "2026-10-10",
      "2026-10-17",
      "2026-10-24",
      "2026-10-31",
      "2026-11-07",
      "2026-11-14",
      "2026-11-21",
      "2026-12-05",
      "2026-12-19",
    ],
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
    // TODO(content): add `tagline` — a one-line card summary. TrekCard falls back
    // to a neutral factual line while it is unset.
  },
  {
    // TODO(content): winter catalogue stub for Kausani Winter Trip. Every value marked TODO
    // below is a placeholder — ops to confirm before this listing goes live.
    "slug": "kausani-winter-trip",
    "name": "Kausani Winter Trip",
    "heroImage": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Trisul%2C_Nanda_Devi_and_Himalayan_range_from_Kausani%2C_Uttarakhand.jpg/1920px-Trisul%2C_Nanda_Devi_and_Himalayan_range_from_Kausani%2C_Uttarakhand.jpg",
    "price": null, // TODO(content): real price; the card shows "TBD" until set.
    "days": 3, // TODO(content): real duration.
    "nights": 2, // TODO(content): real duration.
    "region": "Uttarakhand",
    "category": "Upcoming Winter Treks",
    "batchDates": [
      "2026-10-03",
      "2026-10-10",
      "2026-10-17",
      "2026-10-24",
      "2026-10-31",
      "2026-11-07",
      "2026-11-14",
      "2026-11-21",
      "2026-12-05",
      "2026-12-19",
    ],
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
    // TODO(content): add `tagline` — a one-line card summary. TrekCard falls back
    // to a neutral factual line while it is unset.
  },
  {
    "slug": "mukteshwar-winter-trip",
    "name": "Mukteshwar Winter Trip",
    "heroImage": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Mukteshwar_Uttarakhand_India.jpg/1920px-Mukteshwar_Uttarakhand_India.jpg",
    "tagline": "A peaceful Kumaon hill station at 7,500 ft — a 350-year-old Shiva temple with 180° Himalayan views, the Chauli Ki Jali cliff, apple orchards and the Bhalu Gaad waterfall, Kathgodam to Kathgodam.",
    "price": null, // TODO(content): real price; the card shows "TBD" until set.
    "days": 3,
    "nights": 2,
    "region": "Uttarakhand",
    "category": "Upcoming Winter Treks",
    "batchDates": [
      "2026-10-03",
      "2026-10-10",
      "2026-10-17",
      "2026-10-24",
      "2026-10-31",
      "2026-11-07",
      "2026-11-14",
      "2026-11-21",
      "2026-12-05",
      "2026-12-19",
    ],
    "startLocation": "Kathgodam",
    "endLocation": "Kathgodam",
    "difficulty": "Easy",
    "availability": "Every Saturday from Kathgodam, open all 12 months",
    // Dec/Jan/Feb is what SEASON_MAP["Winter"] in app/page.tsx matches on.
    "months": [
      "Dec",
      "Jan",
      "Feb"
    ],
    "themes": [
      "Snow",
      "Forest",
      "Family with Kids",
      "Couples"
    ],
    intro:
      "Mukteshwar is a peaceful, offbeat hill station in Kumaon, Uttarakhand at 7,500 ft — 51 km from Nainital and 350 km from Delhi. If Nainital is full of lakes and crowd, Mukteshwar is all about silence, Himalayan views, orchards and peace. Perfect for couples, writers and nature lovers who want to stay away from the Mall Road rush.",
    idealFor:
      "Couples wanting privacy and a romantic view, writers and nature lovers on a workcation, and families who have already seen Nainital and want an offbeat, quiet extension.",
    highlights: [
      "Mukteshwar Dham Temple — 350 years old, 180° Himalayan view of Nanda Devi, Trishul & Panchachuli",
      "Chauli Ki Jali — 100 ft cliff with natural rock holes, rock climbing, rappelling and zip-lining",
      "Bhalu Gaad Waterfall — a hidden 60 ft fall, 30-min forest trek",
      "Apple, peach, plum and apricot orchards, with fresh cider, jam and juice at the IVRI farm",
      "Zero crowd and clean air — boutique resorts, homestays and stargazing, no Mall Road rush",
      "Paragliding at Bhatelia and village walks to Adharshila & Dhanachuli",
    ],
    aboutParagraphs: [
      "Mukteshwar is a small Himalayan town in the Nainital district of Uttarakhand, perched at 2,285 meters (7,500 ft) above sea level. It is 51 km from Nainital, 75 km from Kathgodam and 350 km from Delhi. Mukteshwar is famous for silence.",
      "Mukteshwar literally means \"Lord of Salvation\". There is a 350-year-old Shiva temple at the top of the hill. It is said that a demon and his son were killed by Lord Shiva here, and he gave them mukti (salvation), so the place is called Mukteshwar Dham. The temple has a white marble Shivling surrounded by idols of Parvati, Ganesha and Nandi, and is covered with a copper yantra.",
      "On a clear day (Oct-Nov & Mar-Apr), from Mukteshwar Temple you can see more than 10 Himalayan peaks in one frame — Nanda Devi (7,816 m), Nanda Kot, Trishul, Panchachuli and Nandaghunti. The view is wider than Nainital's Snow View Point.",
      "Right behind the temple is Chauli Ki Jali, a 100-feet vertical cliff with natural holes (jalis) in the rocks. Local legend says women who couldn't conceive would come and pray touching the rock holes. Today it is famous for rock climbing & rappelling, zip-lining & valley crossing, and the best sunset in whole Kumaon, with the deep Ramgarh and Almora valley spread out below.",
      "Mukteshwar is also an orchard town — the British started fruit cultivation here in the 19th century, and apple, peach, plum and pear orchards still cover the hills. The Government Fruit Research Farm and the IVRI (Indian Veterinary Research Institute) campus sell fresh juice, jams and pickles, and forest walks pass through deodar, oak and rhododendron.",
      "With just 2-3 small markets, 10-15 cafes, a few home bakeries and cottage stays, and zero light pollution at night, Mukteshwar is built for the slow life — ideal for couples, writers, artists and families who already saw Nainital and want offbeat.",
    ],
    destinationHighlights: [
      {
        name: "Mukteshwar Dham Temple",
        blurb: "A 350-year-old Shiva temple on the highest point of town, reached by a 100-step climb, with an uninterrupted 180° view of the Himalayas from the courtyard.",
      },
      {
        name: "Chauli Ki Jali",
        blurb: "A 100 ft cliff with natural rock holes just behind the temple — rock climbing, rappelling, zip-lining and the best sunset in Kumaon.",
      },
      {
        name: "Bhalu Gaad Waterfall",
        blurb: "A hidden 60 ft waterfall 4-5 km from the market, reached by a 20-30 min trek through forest and a stream — best July to November.",
      },
      {
        name: "Fruit Orchards & IVRI Farm",
        blurb: "Apple, peach, plum and apricot orchards you can walk through, with fresh cider, jam and juice at the IVRI campus farm — picking season June to August.",
      },
    ],
    itinerary: [
      {
        day: 1,
        title: "Kathgodam Arrival & Transfer to Mukteshwar | Local Sunset Views",
        description:
          "Pickup from Kathgodam, drive through pine forest and apple orchards, check-in and an evening sunset walk to the local market and view points.",
        detailedParagraphs: [
          "Morning arrival at Kathgodam Railway Station / Pantnagar Airport, where our driver will receive you. Drive to Mukteshwar (75 km, 2.5-3 hrs) via Bhimtal, Bhowali and Ramgarh — a scenic route through pine forest and apple orchards.",
          "Reach by noon and check in to your cottage / resort / homestay, followed by a welcome and some rest. In the evening, walk to the local market and sunset points, and watch a beautiful Himalayan sunset turning the Nanda Devi peak pink.",
          "Hot dinner at the resort with stargazing — there are no city lights here. Overnight stay in Mukteshwar.",
        ],
        pickupPoint: "Kathgodam Railway Station / Pantnagar Airport",
        driveDistance: "75 Km",
        drivingTime: "2.5-3 Hrs",
        stayType: "Cottage / Resort / Homestay",
        meals: "Dinner",
      },
      {
        day: 2,
        title: "Mukteshwar Full Day Sightseeing & Adventure",
        description:
          "Mukteshwar Dham Temple, Chauli Ki Jali, the IVRI orchard, and an afternoon trek to Bhalu Gaad Waterfall.",
        detailedParagraphs: [
          "Wake up early for the sunrise view from your balcony — the Himalayas shining golden. After breakfast, start sightseeing at Mukteshwar Dham Temple (350 years old) — a 100-step climb, darshan of Lord Shiva, and a 180° Himalayan view from the temple courtyard.",
          "Just a 2-min walk behind the temple is Chauli Ki Jali — the famous cliff with natural rock holes, valley views, photography and adventure activities like rock climbing, rappelling and zip-lining. Continue to the IVRI (Indian Veterinary Research Institute) campus and orchard visit — a walk through deodar forest, buying fresh apple juice and jams.",
          "After a lunch break, head out for the Bhalu Gaad Waterfall trek — a 4 km drive plus a 1.5 km / 30-minute trek one side, through forest and a stream, to reach the 60 ft waterfall — the best place for nature photos and peace. Return by evening. Dinner and overnight stay in Mukteshwar.",
        ],
        highlights: ["Mukteshwar Dham Temple & Chauli Ki Jali", "Bhalu Gaad Waterfall trek"],
        stayType: "Cottage / Resort / Homestay",
        meals: "Breakfast, Dinner",
      },
      {
        day: 3,
        title: "Leisure Morning & Departure to Kathgodam",
        description:
          "Orchard visit, a village walk to Adharshila or Peora, then drop at Kathgodam.",
        detailedParagraphs: [
          "Enjoy a relaxed breakfast with a Himalayan view, then visit local fruit orchards — seasonal apple and plum picking (June-Aug), and buy organic jams and pickles. Take a short walk to Adharshila or Peora village for a glimpse of village life.",
          "Drive back to Kathgodam (75 km, 2.5 hrs) and get dropped at Kathgodam station in time for your return train.",
        ],
        driveDistance: "75 Km",
        drivingTime: "2.5 Hrs",
        stayType: "Trip Ends — Drop at Kathgodam",
        meals: "Breakfast",
      },
    ],
    inclusions: [
      {
        title: "Accommodation",
        description: "2 nights stay in Mukteshwar, triple/quad sharing basis, valley view / Himalayan view.",
      },
      {
        title: "Meals (MAP Plan)",
        description: "2 breakfasts and 2 dinners at the stay (veg — dal, rice, mix veg, roti, sweet).",
      },
      {
        title: "Transportation & Sightseeing",
        description: "Pickup & drop from Kathgodam Railway Station / Pantnagar Airport / Haldwani, all transfers and sightseeing by private car (not sharing) — Swift Dzire/WagonR for 2-3 pax, Ertiga/Innova for 4-6 pax, Tempo Traveller for 7+ pax, with driver allowance, fuel, toll tax, parking and green tax included.",
      },
      {
        title: "Sightseeing Covered",
        description: "Mukteshwar Dham Temple, Chauli Ki Jali, IVRI Campus & Orchard, Bhalu Gaad Waterfall (till the starting point + 30 min trek), Bhatelia Market, Peora / Dhanachuli village view.",
      },
      {
        title: "Tour Support",
        description: "24x7 on-tour support.",
      },
    ],
    exclusions: [
      { title: "Lunch", description: "Not included — available at local cafes; try the apple pie and pizza." },
      { title: "Adventure Activities", description: "Rock climbing & rappelling at Chauli Ki Jali, zipline / valley crossing, paragliding and horse riding — all direct payment." },
      { title: "Entry Tickets", description: "Any temple donation and orchard entry fee." },
      { title: "Guide", description: "Local guide for the waterfall trek, if required." },
      { title: "Personal Expenses", description: "Mineral water, snacks, shopping for jams/juices, laundry, tips." },
      { title: "GST", description: "5% extra, if a bill is needed." },
      { title: "Travel Insurance & Medical Expenses", description: "Not included." },
      { title: "Anything Not Mentioned", description: "Anything not listed under inclusions." },
    ],
    eligibilityCriteria: [
      { icon: "Users", text: "Open for all ages — kids (0-18), adults (18-60) and senior citizens (60-85+) are all suited; the car goes right till the hotel" },
      { icon: "Stethoscope", text: "Asthma, BP, sugar and heart patients can travel — altitude is only 7,500 ft; not recommended within 1 month of major surgery; pregnant women safe till 7 months (avoid the cliff-side walk)" },
      { icon: "IdCard", text: "Indian citizens need Aadhaar/Voter ID/Driving License for hotel check-in; foreign nationals need a passport & visa copy — no permit or Yatra registration required" },
      { icon: "Users2", text: "Solo travellers, couples, friends' groups and families with kids are all welcome" },
      { icon: "Calendar", text: "Open 365 days — no road blockage like the Char Dham route, even in monsoon or snowfall" },
    ],
    fitnessCriteria: [
      { icon: "Footprints", text: "Easy grade — not a trek or Yatra; anyone who can walk 200-300 metres is eligible" },
      { icon: "Mountain", text: "Only two spots need a short walk — the 100-step temple climb and the 30-min Bhalu Gaad Waterfall trek" },
      { icon: "FileText", text: "No fitness certificate needed" },
    ],
    faqs: [
      {
        title: "What is Mukteshwar famous for?",
        description: "Mukteshwar is famous for three things — the 350-year-old Mukteshwar Dham Temple (Lord Shiva), the Chauli Ki Jali cliff for adventure & sunset, and an uninterrupted Himalayan view of the Nanda Devi, Trishul and Panchachuli peaks. Plus apple orchards, Bhalu Gaad Waterfall and zero crowd.",
      },
      {
        title: "How far is Mukteshwar from Nainital and Kathgodam?",
        description: "From Nainital — 51 km, 1.5-2 hrs drive. From Kathgodam Railway Station — 75 km, 2.5-3 hrs drive via Bhimtal-Bhowali. From Delhi — 350 km, 8-9 hrs.",
      },
      {
        title: "Does Mukteshwar have snowfall?",
        description: "Yes. Mukteshwar gets proper snowfall every year from late December to mid-January. Nainital sometimes misses snow, but Mukteshwar, being at 7,500 ft, gets good snow. Plan the last week of December or the first two weeks of January if you want snow.",
      },
      {
        title: "What is the best time to visit Mukteshwar?",
        description: "March-June — pleasant weather at 15-25°C, best for families. October-November — best for the Himalayan view, clear sky, ideal for honeymoon. December-January — for snowfall. Avoid peak monsoon (July-August) if you want the waterfall trek, as the road becomes slippery.",
      },
      {
        title: "Is Mukteshwar good for a honeymoon?",
        description: "One of the best in Uttarakhand. There is no crowd like Nainital's Mall Road — only boutique cottages, wooden chalets and valley-view resorts with a private balcony, bonfire and stargazing. Very peaceful and romantic.",
      },
      {
        title: "What are the things to do in Mukteshwar in 2 days?",
        description: "Day 1: Mukteshwar Dham Temple darshan, Chauli Ki Jali sunset, rock climbing & zipline. Day 2: Bhalu Gaad Waterfall trek (30 min), IVRI orchard visit, cafe hopping, village walk to Adharshila/Dhanachuli.",
      },
      {
        title: "Is there a market / ATM / hospital in Mukteshwar?",
        description: "A small local market with 15-20 shops, 2-3 cafes and a medical shop. There's an SBI ATM in the market (sometimes out of cash, so carry cash). No big hospital — the nearest good hospital is in Bhowali (25 km) & Nainital. No petrol pump in main Mukteshwar; the last pump is at Bhatelia, 5 km before.",
      },
      {
        title: "What type of hotels are available?",
        description: "No big 5-star hotels — mostly boutique cottages, homestays, orchard resorts and wooden chalets with a kitchen, all with a Himalayan view.",
      },
      {
        title: "Is Mukteshwar safe?",
        description: "100% safe for families, solo female travellers and couples. Locals are very helpful and crime is very rare. Nights are very silent — carry a torch.",
      },
      {
        title: "Can we do paragliding in Mukteshwar?",
        description: "Yes, at Bhatelia, 5 km before Mukteshwar market — a short 10-15 min flight. Rock climbing & rappelling are also available at Chauli Ki Jali.",
      },
      {
        title: "Is Kainchi Dham near Mukteshwar?",
        description: "Yes, Kainchi Dham Ashram is 35 km from Mukteshwar (1.5 hrs) via Bhowali. You can cover it on the way from Kathgodam to Mukteshwar, or from Mukteshwar to Nainital.",
      },
      {
        title: "What should I pack for Mukteshwar?",
        description: "Summer: light woolens for evening, sunscreen, walking shoes. Winter: heavy jackets, gloves, cap, thermals. Carry a torch for the night and a power bank, as the light sometimes goes.",
      },
    ],
    howToReach: {
      intro:
        "Pickup and drop is Kathgodam to Kathgodam — the last railway station of the Kumaon region and the gateway for every Nainital, Bhimtal, Kainchi Dham, Mukteshwar and Almora trip. Kathgodam is 350 km from Delhi, with the final 75 km to Mukteshwar on a winding hill road via Bhimtal, Bhowali and Ramgarh.",
      air: {
        summaryLabel: "Nearest Airport",
        summary: "Pantnagar Airport (PGH) — around 85 Km from Mukteshwar",
        detail:
          "Limited daily flights from Delhi. Since flights are limited, most travellers prefer the train to Kathgodam followed by a taxi. A taxi from Pantnagar to Mukteshwar covers the same distance as from Kathgodam.",
      },
      train: {
        summaryLabel: "Nearest Railway Station",
        summary: "Kathgodam Railway Station (KGM) — 75 Km, 2.5-3 Hrs from Mukteshwar",
        detail:
          "The last railhead of the Kumaon region, well connected to Delhi (Ranikhet Express / Shatabdi), Lucknow and Kolkata. From Kathgodam, a private taxi takes you to Mukteshwar via Bhimtal-Bhowali.",
      },
      road: {
        summaryLabel: "By Road from Delhi",
        summary: "Delhi to Mukteshwar — 350 Km, 8-9 Hrs",
        detail:
          "Same route as Nainital — reach Kathgodam (the last railway station), then a 75 km drive (2.5 hrs) via Bhimtal and Bhowali. Distance from Nainital is 51 km (1.5 hrs). Direct taxis are also available from Delhi and Pantnagar Airport, though the airport is 85 km away with limited flights.",
        route: ["Delhi", "Kathgodam", "Bhimtal", "Bhowali", "Ramgarh", "Mukteshwar"],
        facts: [
          { label: "Distance", value: "350 Km" },
          { label: "Duration", value: "8-9 Hours" },
        ],
      },
      pickup: {
        point: "Kathgodam Railway Station / Pantnagar Airport / Haldwani",
        time: "On arrival, Day 1",
        dropPoint: "Kathgodam Railway Station",
        dropTime: "Day 3, timed to the return train",
        note: "Can be combined with Nainital, Kainchi Dham or Almora on either end of the trip.",
      },
    },
    article: {
      title: "Mukteshwar — The Quiet Himalayan Paradise",
      standfirst:
        "Mukteshwar is the feeling you get when you keep staring at it — the silence, the orchards and a Himalayan skyline that never leaves you.",
      readMinutes: 5,
      sections: [
        {
          paragraphs: [
            "Perched at 7,500 feet above sea level in the Kumaon hills of Uttarakhand, 51 kilometres from Nainital, Mukteshwar is not a place you visit to tick off sightseeing spots. You visit it to do nothing. And that nothing feels like everything.",
          ],
        },
        {
          heading: "A Temple That Gives Salvation",
          paragraphs: [
            "The name comes from a 350-year-old Shiva temple that sits on the highest cliff of the town. Legend says Lord Shiva slayed a demon here and gave him mukti, or salvation. The temple is small, white, with a marble Shivling and a copper yantra. On a clear October morning, you can see a 180-degree stretch of the Himalayas — Nanda Devi, Trishul, Nanda Kot, Panchachuli, all standing white and silent in front of you. It is wider and clearer than Snow View Point in Nainital.",
          ],
        },
        {
          heading: "Chauli Ki Jali — The Cliff Behind the Temple",
          paragraphs: [
            "Just behind the temple is Chauli Ki Jali, or Chauthi Ki Jali — a 100-foot vertical rock wall with natural lattice holes. Local legend says a woman who touches the lattice will conceive. Young trekkers come here for something else — rock climbing, rappelling, and a sunset that drops straight into the Ramgarh valley. You sit on the edge, your legs hanging, and the wind hits you so hard you forget your phone exists.",
          ],
        },
        {
          heading: "A Waterfall You Have to Walk To",
          paragraphs: [
            "A little away, hidden in a forest, is Bhalu Gaad Waterfall. You don't reach it by car — you walk, for 20-30 minutes through a trail of oak and deodar, crossing a small stream, listening to birds you can't name. Then suddenly you hear water falling — a 60-foot fall, cold, white, untouched. No stalls, no queues. Just you and the sound.",
          ],
        },
        {
          heading: "An Orchard Town, and a Sky Full of Stars",
          paragraphs: [
            "Mukteshwar is an orchard town. The British brought apple farming here in the 1800s, and it stayed. The hills are full of apple, peach, plum and apricot trees, and in June, July and August the orchards are full — you can walk through them, pick a fruit and eat.",
            "And then there is the night. No lake shimmer, no loud music — only a few cafes with warm yellow lights serving apple crumble and wood-fired pizza. Above, the sky opens up, because there is zero light pollution, and you can actually see the Milky Way. Couples sit around a bonfire, families talk, solo travellers write. It is one of those rare places where silence is not awkward.",
          ],
        },
      ],
      signoff:
        "Mukteshwar is for honeymooners who want privacy, not crowds. For families who want a cottage with a kitchen and a view, not a hotel with a lift. For anyone who wants to wake up to birds. If you are planning Kumaon, do 2 nights in Mukteshwar — that becomes the story you tell everyone back home.",
    },
    thingsToRemember: [
      "No fitness certificate needed — this is an easy-grade leisure trip, not a trek or Yatra.",
      "ID proof (Aadhaar/Voter ID/Driving License for Indians, passport for foreign nationals) is mandatory for hotel check-in.",
      "Lunch is not included on any day — budget separately for meals at local cafes.",
      "Carry cash — the market has only one ATM and it sometimes runs out.",
      "Carry a torch and power bank for the night, as there is very little street lighting.",
    ],
    similarTreks: ["auli-snow-trip", "nainital-winter-trip", "kanatal-winter-trip", "chopta-with-auli"],
  },
  {
    "slug": "harshil-valley-trip",
    "name": "Harshil Valley Trip",
    "heroImage": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/Bhagirathi_River_at_Gangotri_WTK20150915-IMG_2704.jpg/1920px-Bhagirathi_River_at_Gangotri_WTK20150915-IMG_2704.jpg",
    "tagline": "The Mini Switzerland of Uttarkashi — apple orchards, deodar forests and old wooden villages at 9,005 ft on the banks of the Bhagirathi, 26 km before Gangotri.",
    "price": null, // TODO(content): real price; source quotes a "15k to 30k" range depending on shared/private car — the card shows "TBD" until a fixed price is set.
    "days": 3,
    "nights": 2,
    "region": "Uttarakhand",
    "category": "Weekend Getaways",
    "startLocation": "Dehradun to Dehradun",
    "endLocation": "Dehradun",
    "difficulty": "Easy",
    "maxAltitude": "9,005 ft / 2,745 m",
    "availability": "Every Saturday from Dehradun — best March-June & September-October",
    "months": [
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Sep",
      "Oct",
    ],
    "themes": [
      "Apple Orchards",
      "River Valley",
      "Pilgrimage",
      "Cafe Culture",
      "Family with Kids",
      "Couples",
    ],
    intro:
      "If Kumaon has Munsiyari, Garhwal has Harshil. A tiny valley at 9,005 ft on the banks of the Bhagirathi river, 26 km before Gangotri Dham, where apple orchards, deodar forests, snow peaks and old wooden houses live together. Not crowded like Manali, not commercial like Auli — Harshil is still pure.",
    idealFor:
      "Travellers who want a relaxed valley tour rather than a trek — apple orchards, a wooden skywalk bridge, Gangotri darshan and cafe culture, without daily 10 km walks. Great for families with kids, seniors and couples.",
    highlights: [
      "Gartang Gali — India's most thrilling 150-year-old wooden skywalk bridge, on a vertical rock face at 11,000 ft",
      "Apple orchard walks and apple picking in Sept-Oct, in the apple capital of Uttarakhand",
      "Gangotri Dham darshan, 26 km from Harshil, and Mukhba — the winter home of Maa Ganga",
      "Bagori — a heritage village of the Tibetan-origin Jadh tribe, featured in the film Ram Teri Ganga Maili",
      "Wilson Cottage — the 1864 wooden bungalow of Pahari Wilson, father of apple cultivation in Uttarakhand",
      "Sunrise on Shrikanth Peak (6,109 m) turning gold to pink, seen right from Harshil",
    ],
    aboutParagraphs: [
      "Harshil Valley is in Uttarkashi district, Uttarakhand, on the way to Gangotri Dham — 26 km before the temple and 75 km from Uttarkashi town. The valley sits at 9,005 ft (2,745 m) between two rivers, Bhagirathi and Jalandhari, and is made up of five villages within a 5-7 km stretch — Harshil, Mukhba, Dharali, Jhala and Bagori.",
      "It is called the Mini Switzerland of Uttarkashi because of its landscape — a flat meadow, the Bhagirathi river making a wide U-turn, dense deodar forest on both sides, snow peaks all around and wooden cottages. In October, when apple trees turn red and poplars turn golden, it looks exactly like Switzerland.",
      "Frederick Wilson, a British Army deserter who settled here in the 1840s-50s, is known as Pahari Wilson — the first man to bring apple cultivation to the valley. His 1864 bungalow and old watermill still stand in Harshil today, and Harshil grows what is considered the best apple in Uttarakhand.",
      "Two cultures share this valley — Garhwali farmers in Harshil, Dharali and Mukhba, and the Jadh tribe of Tibetan origin in Bagori, who migrated here after the 1962 Indo-China war and keep their own language, dress and wool trade. Mukhba is the most sacred of the five — the idol of Maa Ganga rests here for six months every winter (November-April) when Gangotri Temple closes under snow.",
      "Harshil is not a trek, it is an emotion. There is no rush to reach a top — you walk slowly along the river, breathe slowly, and the top is everywhere.",
    ],
    destinationHighlights: [
      {
        name: "Gartang Gali",
        blurb: "A 150-year-old, 150-metre wooden skywalk built by Peshawari Pathans on a vertical rock face at 11,000 ft, with a 500 ft gorge below. Closed for 60 years after 1962, reopened in 2021. 16 km drive + 2 km trek from Harshil.",
      },
      {
        name: "Mukhba Village",
        blurb: "1 km above Harshil — the winter home of Maa Ganga, where her idol is brought for 6 months (Nov-April) when Gangotri Temple closes. A wooden temple with intricate carvings.",
      },
      {
        name: "Bagori Village",
        blurb: "Home to the Jadh tribe of Tibetan origin, with 400-year-old carved wooden houses, a Tibetan-style wool market, and the setting of the film Ram Teri Ganga Maili.",
      },
      {
        name: "Apple Orchards",
        blurb: "Harshil grows the best apples in Uttarakhand — red delicious and golden. In Sept-Oct you can walk into orchards and pick apples, with fresh juice and jam sold across the valley.",
      },
    ],
    fitnessRequirement:
      "Harshil Valley is not a difficult trek — it is a relaxed valley tour by car with small 2 km walks. Normal fitness is enough to cover Harshil, Gangotri and the villages; only the optional Gartang Gali trek needs a 4 km walk over 1.5 hours.",
    eligibilityCriteria: [
      { icon: "Users", text: "Open for all ages — even a 6-month-old baby can travel, and we have taken 75-year-old guests to Harshil & Gangotri; kids 2+ and below age 65 can also do Gartang Gali" },
      { icon: "Stethoscope", text: "BP, sugar and mild asthma are fine with your regular medicines and inhaler; consult a doctor first for severe heart disease, pregnancy beyond 6 months, recent major surgery/fracture or epilepsy" },
      { icon: "IdCard", text: "Indians need Aadhaar/Voter ID at the forest checkpost, no permit required; foreign nationals need a passport and register at the Bhatwari checkpost, but are not allowed beyond Gangotri into Nelong Valley" },
      { icon: "Mountain", text: "Gartang Gali wooden bridge (11,000 ft) is allowed only for ages 8 to 65 by the forest department; guests outside this range can wait at the cafe near the parking point" },
    ],
    fitnessCriteria: [
      { icon: "Footprints", text: "No trekking fitness needed for the main valley tour — 500 m to 1 km slow walks only" },
      { icon: "Activity", text: "For Gartang Gali: comfortable walking 4 km total (2 km up, 2 km down) in about 1.5 hours on a gentle, not steep, trail" },
      { icon: "FileText", text: "No fitness certificate needed — only a simple medical declaration form for our guide's information" },
    ],
    itinerary: [
      {
        day: 1,
        title: "Dehradun to Harshil Valley (225 Km | 8-9 Hrs Drive)",
        description:
          "Pickup from Dehradun, drive via Mussoorie, Chamba, Uttarkashi to Harshil along the Bhagirathi river, check-in and a leisure evening walk.",
        detailedParagraphs: [
          "Pickup at 6:30 AM from Dehradun Railway Station / ISBT. Drive via Mussoorie (35 km), Chamba and Uttarkashi (155 km) to Harshil (75 km). Breakfast stop at Mussoorie / Chamba (self-paid).",
          "Lunch stop and Kashi Vishwanath Temple darshan at Uttarkashi — dedicated to Lord Shiva, the same as the Varanasi temple, 2 minutes' walk from the market.",
          "From Uttarkashi to Harshil (75 km, 3 hrs) is the most beautiful stretch — the road runs along the Bhagirathi river, passing Maneri Dam & Bhali Dam, Gangnani hot spring and Sukhi Top, the first snow view point.",
          "Arrive Harshil Valley by evening and check in. A leisure walk to the Bhagirathi river bank, an apple orchard visit (pluck apples with the owner's permission in Sept-Oct), a photo stop at Wilson Cottage (1864, outside view only) and a walk through the local market for apple juice, jam and local wool. Veg dinner and overnight in Harshil — carry a jacket, night temperature is 3-7°C even in summer.",
        ],
        pickupPoint: "Dehradun Railway Station / ISBT",
        pickupTime: "6:30 AM",
        driveDistance: "225 Km",
        drivingTime: "8-9 Hrs",
        stayType: "Hotel / Homestay",
        meals: "Dinner",
      },
      {
        day: 2,
        title: "Harshil Sightseeing — Gangotri, Gartang Gali & Villages (70 Km Drive)",
        description:
          "Sunrise on Shrikanth Peak, Gangotri Temple darshan, Mukhba, Dharali & Bagori villages, and the Gartang Gali wooden skywalk.",
        detailedParagraphs: [
          "Wake up to sunrise on Shrikanth Peak (6,109 m) from the hotel balcony — the peak turns gold, then pink. Hot breakfast, then drive to Gangotri Temple (26 km, 1 hr) along a scenic road with deodar forest on one side and the Bhagirathi on the other. Gangotri Dham (11,200 ft) darshan (open 6:15 AM-7:30 PM, May-Nov only), holy water, parikrama and a visit to Surya Kund and Pandava Gufa nearby. (Dec-April, when the temple is closed, we take you to Mukhba village for Ganga darshan instead.)",
          "Drive back towards Harshil, visiting Mukhba village (1 km above Harshil) — the winter home of Maa Ganga, a wooden temple with fine carvings and a short 200 m uphill walk. Continue to Dharali village, known for its apple orchards and the ancient Kalp Kedar Shiva temple, and Bagori village (10 min from Dharali) — the heritage village of the Jadh tribe, with 400-year-old carved wooden houses and pure wool shawls, caps and socks made by local women.",
          "Drive to Gartang Gali (16 km from Harshil, 45 min), then a 2 km easy trek (30 min) through pine forest to the entry gate. Cross the 150-metre wooden skywalk built in 1850 on a vertical rock face at 11,000 ft, with a 500 ft gorge below and the Nelong Valley in front — walk slowly, hold the railing (30-40 min round trip). Open 9 AM-4 PM, May-Nov only.",
          "Return to Harshil for lunch. Optional afternoon: a small 4 km round trek to Kyarkoti / Lama Top for a sunset meadow view, or a visit to Sattal near Dharali. Dinner and overnight in Harshil.",
        ],
        driveDistance: "70 Km",
        stayType: "Hotel / Homestay",
        meals: "Breakfast, Dinner",
        highlights: ["Gangotri Temple darshan", "Gartang Gali wooden skywalk crossing", "Mukhba & Bagori village visits"],
      },
      {
        day: 3,
        title: "Harshil to Dehradun / Haridwar — Return (225 Km | 8-9 Hrs)",
        description: "A last riverside morning walk, then drive back via Uttarkashi, Tehri and Mussoorie/Chamba to Dehradun.",
        detailedParagraphs: [
          "A last sunrise and a morning walk along the Bhagirathi river — don't miss it. Breakfast and check-out.",
          "Drive back via Uttarkashi, Tehri and Dehradun, with a lunch stop at Chamba / Mussoorie (self-paid). Drop at Dehradun Railway Station / ISBT / Airport.",
        ],
        driveDistance: "225 Km",
        drivingTime: "8-9 Hrs",
        stayType: "Trip Ends — Drop at Dehradun",
        meals: "Breakfast",
      },
    ],
    inclusions: [
      {
        title: "Transport",
        description: "Dehradun to Dehradun (or Haridwar to Haridwar) by private car as per group size — Swift/Bolero/Innova/Tempo Traveller (12-17 seater), including driver, diesel, toll, parking and green tax.",
      },
      {
        title: "Accommodation",
        description: "2 nights in Harshil / Dharali, hotel or homestay with attached bathroom, double/triple sharing.",
      },
      {
        title: "Meals (MAP Plan)",
        description: "2 breakfasts and 2 dinners, pure veg (Day 1 dinner to Day 3 breakfast).",
      },
      {
        title: "Sightseeing",
        description: "Uttarkashi Vishwanath Temple, Gangnani, Harshil, Dharali, Bagori heritage village, Mukhba village, Gangotri Temple day trip, and Gartang Gali up to the parking point.",
      },
      {
        title: "Guide / Driver Support",
        description: "Local driver-cum-guide for the Gartang Gali entry and village walks, driver allowance included.",
      },
      {
        title: "Permits",
        description: "Inner line checkpost entries for the Harshil & Gartang Gali area.",
      },
    ],
    exclusions: [
      { title: "Lunch", description: "Not included on any of the 3 days." },
      { title: "Gartang Gali Entry Ticket", description: "Rs 150 per person (Indian) / higher for foreigners, paid directly at the gate." },
      { title: "Gangotri Temple Pooja & Donation", description: "Any special pooja, prasad, donation or temple photographer." },
      { title: "Personal Expenses", description: "Tea, coffee, snacks, mineral water, apple buying, wool shawl shopping, tips and laundry." },
      { title: "GST", description: "5% extra if a bill/GST invoice is needed." },
      { title: "Snow Jeep / Chain Charges", description: "If the road is snow-covered in Dec-Feb, plus any porter or pony charges." },
      { title: "Travel Insurance", description: "Not included." },
      { title: "Nelong Valley Permit & Jeep", description: "Not part of the standard 3D/2N tour; available as an add-on at extra cost, with a special SDM Uttarkashi permit needed 1 day in advance (Indians only)." },
    ],
    faqs: [
      {
        title: "Where is Harshil Valley and how far from Dehradun?",
        description: "Harshil Valley is in Uttarkashi district, Uttarakhand, 26 km before Gangotri Dham. It is 225 km from Dehradun (8-9 hrs drive) and 75 km from Uttarkashi. Altitude 9,005 ft.",
      },
      {
        title: "What is the best time to visit Harshil Valley?",
        description: "Sept-Oct is best — apple season, golden autumn, clear sky. March-June is good for families and Gangotri darshan. Dec-Feb brings heavy snowfall (3-4 ft). Avoid July-August monsoon.",
      },
      {
        title: "What is Gartang Gali and is it safe?",
        description: "A 150-year-old, 150 m wooden skywalk on a vertical cliff at 11,000 ft, 16 km from Harshil. Fully renovated with railings and safe to cross. Entry Rs 150. Needs a 2 km trek to reach. Open May to Nov only.",
      },
      {
        title: "Do we need any permit for Harshil?",
        description: "No permit for Indians for Harshil, Gangotri or Gartang Gali — just carry Aadhaar. For Nelong Valley beyond Gangotri, Indians need an SDM permit (1 day advance). Foreigners are not allowed in Nelong, but are allowed in Harshil.",
      },
      {
        title: "Can senior citizens and kids visit Harshil?",
        description: "Yes, 100%. Harshil is a valley tour by car, not a trek. Kids of any age and seniors up to 75 years can visit. Only Gartang Gali needs a 4 km walk, which seniors with knee pain can skip.",
      },
      {
        title: "How many days are needed for a Harshil trip?",
        description: "3 Days / 2 Nights from Dehradun is standard — Day 1 Dehradun to Harshil, Day 2 Gangotri + Gartang Gali + Mukhba & Bagori villages, Day 3 return.",
      },
      {
        title: "Is Gangotri Temple included? When does it close?",
        description: "Yes, Gangotri (26 km from Harshil) is included on Day 2. The temple is open May to the first week of November only. In winter (Dec-April), when the temple is closed, Maa Ganga's idol is in Mukhba village near Harshil — darshan happens there instead.",
      },
      {
        title: "Where do we stay and what food is available?",
        description: "Hotels/homestays with attached bathroom. All stays serve only veg food, as non-veg and liquor are banned in the Harshil Eco-Zone.",
      },
      {
        title: "What about mobile network, ATM and petrol?",
        description: "Jio works in Harshil market, BSNL across the whole valley, Airtel/Vi are weak. There is no ATM in Harshil — the last ATM is 75 km before, in Uttarkashi, so carry cash. The last petrol pump is also in Uttarkashi/Bhatwari — fill a full tank before Harshil.",
      },
      {
        title: "Can we see snow in Harshil?",
        description: "Yes — Dec to Feb the valley gets 3-4 ft of snow. March has snow on the peaks plus a little in the valley. May-June has no valley snow but snow-capped peaks all around.",
      },
      {
        title: "How much does the Harshil Valley tour cost?",
        description: "For 3D/2N from Dehradun, it ranges roughly ₹15,000 to ₹30,000 depending on a budget shared tour vs. a standard private car — includes hotel with breakfast/dinner, transport and guide.",
      },
      {
        title: "What should I carry for Harshil Valley?",
        description: "A warm jacket (night temperature is 3-7°C even in summer), cap, gloves, good walking shoes, power bank, sunscreen, medicines and cash. For a Dec-Feb trip, carry heavy woollens and snow boots.",
      },
    ],
    howToReach: {
      intro:
        "Pickup is from Dehradun at 6:00 AM on Day 1 — reach Dehradun the evening before, or by 5:30 AM on Day 1.",
      air: {
        summaryLabel: "Nearest Airport",
        summary: "Jolly Grant Airport (DED), Dehradun — 25 Km from the city",
        detail:
          "Daily direct flights from Delhi (50 min), Mumbai, Bangalore, Kolkata, Hyderabad, Lucknow and Ahmedabad on Indigo, Air India and Spicejet. From the airport to Dehradun city — taxi (45 min) or airport bus. If your flight lands after 5 PM on Day 0, stay a night in Dehradun, since pickup is 6 AM sharp.",
      },
      train: {
        summaryLabel: "Cheapest & Most Comfortable",
        summary: "Dehradun Railway Station (DDN)",
        detail:
          "The main station in the city centre. From Delhi, take a direct bus or train; from Mumbai/Kolkata and other cities, direct trains such as the Doon Express, Upasana Express and Amritsar-Dehradun Express run to Dehradun.",
      },
      road: {
        summaryLabel: "By Bus / Private Car",
        summary: "Delhi to Dehradun — 250 Km, 5-6 Hrs via NH 334",
        detail:
          "From Delhi ISBT Kashmere Gate, Uttarakhand Roadways AC/Volvo/ordinary buses run every 30 minutes (6-7 hrs); private Volvo operators (RedBus, ZingBus) run overnight. From Chandigarh — 170 km, 4-5 hrs, hourly buses. From Haridwar/Rishikesh — 55 km, 1.5 hrs, buses/taxis every 15 min. Public buses also run from Rishikesh to Uttarkashi, with a shared jeep onward to Harshil.",
        route: ["Delhi", "Dehradun", "Mussoorie", "Chamba", "Uttarkashi", "Harshil"],
        facts: [
          { label: "Distance", value: "225 Km" },
          { label: "Duration", value: "8-9 Hours" },
        ],
      },
      pickup: {
        point: "Dehradun Railway Station Gate No. 1 / Dehradun ISBT / Prince Chowk",
        time: "6:00 AM Sharp (Day 1)",
        dropPoint: "Dehradun Railway Station / ISBT / Airport",
        dropTime: "Evening, Day 3",
        note: "Exact pickup location is shared on WhatsApp a day before. We can also book a hotel near the station in Dehradun if you arrive the previous day.",
      },
    },
    article: {
      title: "Harshil — Where Ganga Rests, Apples Blush And Time Stops",
      standfirst:
        "There is a place in Uttarakhand where the Bhagirathi river does not rush. It slows down, makes a wide U-turn, and rests.",
      readMinutes: 6,
      sections: [
        {
          paragraphs: [
            "On that resting point, between dense deodar forests and snow peaks that rise like white walls, lies a valley so beautiful that the British called it Mini Switzerland. Its name is Harshil Valley.",
          ],
        },
        {
          heading: "The Last Real Himalayan Village Before Tibet",
          paragraphs: [
            "Harshil is not a hill station. It is a valley at 9,005 feet, 26 kilometres before Gangotri Dham, in Uttarkashi district — the last cluster of villages where life still runs on wood, wool and apples.",
            "The valley is made of five villages — Harshil, Dharali, Mukhba, Jhala and Bagori. Walk from one to another and you cross only 7 kilometres, but you cross centuries. In Dharali you see apple orchards with red apples hanging like lights. In Bagori you see 400-year-old wooden houses with carvings no modern architect can copy. In Mukhba you see a wooden temple where Goddess Ganga herself lives for six months in winter, when her temple in Gangotri is buried under snow.",
            "This is a valley where two cultures meet — Garhwali farmers and the Jadh tribe of Tibetan origin, who came here after the 1962 war, speak a different language, weave their own wool, and still remember the trade route to Tibet that passed through Nelong Valley.",
          ],
        },
        {
          heading: "Why Harshil Is Different From Mussoorie, Manali, Auli",
          paragraphs: [
            "Mussoorie has crowd. Manali has traffic. Auli has ski resorts. Harshil has silence.",
            "You don't go to Harshil to do things. You go to Harshil to not do things — to sit on a rock by the Bhagirathi and watch the water turn blue, to drink chai in an orchard while your host tells you how his grandfather planted these apple trees, to see sunrise turn the 6,109-metre Shrikanth peak from white to gold to pink in 10 minutes.",
            "There is no mall road here, only a river road. No DJ night, only a bonfire under a million stars, because there is no light pollution.",
          ],
        },
        {
          heading: "The Man Who Made Harshil Famous — Pahari Wilson",
          paragraphs: [
            "In 1842, a British soldier named Frederick Wilson deserted the East India Company army and ran into these mountains. He fell in love with a local girl, settled in Harshil, built a wooden cottage in 1864 and started the first apple orchard and deodar timber business.",
            "Locals called him Pahari Wilson. He brought the first apple seeds from England, and today the Harshil apple is considered the best in Uttarakhand — sweet, crunchy, red like cheeks in winter. His cottage still stands, his watermill still runs. If Harshil looks like Europe, Wilson is one reason.",
          ],
        },
        {
          heading: "Three Jewels of Harshil",
          paragraphs: [
            "Gartang Gali — the wooden skywalk. 16 km from Harshil, at 11,000 feet, a 150-metre-long wooden bridge hangs on a vertical rock face, built 150 years ago by Peshawari Pathans to reach Tibet for trade. Below is a 500 feet straight drop; in front is Nelong Valley, a cold desert like Ladakh. Closed for 60 years after the 1962 war, it reopened in 2021 and is today India's most thrilling bridge.",
            "Mukhba — the winter home of Ganga. When Gangotri temple closes in November due to heavy snow, priests bring the idol of Goddess Ganga to Mukhba village, 1 km above Harshil. For six months, all pooja happens here — so you can have Ganga darshan even in January, when Gangotri is under 10 feet of snow.",
            "Bagori — the heritage village. Every house here is made of wood, stone and slate, with balconies carved with flowers and gods. People make pure woollen shawls, caps and socks, and this village was shown in the film Ram Teri Ganga Maili. Walk inside and an old lady will call you for chai — that is Harshil.",
          ],
        },
      ],
      signoff:
        "Harshil is not a place you tick off on a map. It is a place you feel.",
    },
    thingsToRemember: [
      "Non-veg and liquor are banned in the Harshil Eco-Zone — all stays serve pure veg food only.",
      "There is no ATM and no petrol pump in Harshil — the last of both is 75 km before, in Uttarkashi. Carry cash and fill a full tank.",
      "Gangotri Temple and Gartang Gali are both open May to November only; in winter, Ganga darshan happens at Mukhba village instead.",
      "Carry ID proof — Aadhaar/Voter ID for Indians, passport for foreign nationals — for the forest checkpost and hotel check-in.",
      "Night temperature is 3-7°C even in summer — carry a jacket; for a Dec-Feb visit, carry heavy woollens as the valley gets 3-4 ft of snow.",
    ],
    similarTreks: ["har-ki-dun-trek", "gaumukh-tapovan-trek", "mussoorie-winter-escape", "auli-snow-trip"],
  },
];

export const YATRAS: Trek[] = [
  {
    "slug": "chopta-tungnath-trek",
    "name": "Chopta Tungnath Chandrashila Trek",
    "heroImage": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Tungnath_temple%2C_Himalayas.jpg/1920px-Tungnath_temple%2C_Himalayas.jpg",
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
    "heroImage": "/Trips_gallery/Kedarnath/IMG_1668.jpg",
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
    "availability": "Every Saturday, until 9 November",
    // Weekly Saturday departures; the last batch leaves 7 Nov, the season
    // closes 9 Nov.
    "batchDates": [
      "2026-10-03", "2026-10-10", "2026-10-17",
      "2026-10-24", "2026-10-31", "2026-11-07"
    ],
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
    "heroImage": "/Trips_gallery/Badrinath/IMG_2149.jpg",
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
    "heroImage": "/Trips_gallery/Kedarnath/IMG_1803.jpg",
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
    "heroImage": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/Devotees_at_Kedarnath_temple%2C_Uttrakhand_01.jpg/1920px-Devotees_at_Kedarnath_temple%2C_Uttrakhand_01.jpg",
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
    "heroImage": "/Trips_gallery/Kedarnath/IMG_1771.jpg",
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
    "heroImage": "/Trips_gallery/Kedarnath/IMG_1463.jpg",
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
    "name": "Adi Kailash & Om Parvat Yatra",
    "heroImage": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Adi_Kailash1.jpg/1920px-Adi_Kailash1.jpg",
    "tagline": "Chhota Kailash and the natural OM on Om Parvat — Lord Shiva's Himalayan abode in India, no Tibet visa needed.",
    "price": 39500,
    "days": 7,
    "nights": 6,
    "region": "Uttarakhand",
    "category": "Weekend Getaways",
    "startLocation": "Delhi to Delhi",
    "difficulty": "Easy & Medium",
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
    maxAltitude: "6,191 M / 20,300 FT (Om Parvat View Point)",
    totalDistance: "Approx. 1,200 Km by Road (Delhi to Delhi) + 15 Km Trek/Walk",
    fitnessRequirement: "Easy to Moderate — no prior trek experience needed, only a 3 Km walk to Parvati Sarovar (horses available on direct payment)",
    minAge: 10,
    maxAge: 70,
    intro:
      "Adi Kailash, also known as Chhota Kailash or Baba Kailash, is one of the most sacred pilgrimage sites in the Indian Himalayas — revered as the earthly abode of Lord Shiva, just like Mount Kailash in Tibet, but reachable with only an Aadhaar Card and an Inner Line Permit.",
    aboutParagraphs: [
      "Adi Kailash, also known as Chhota Kailash or Baba Kailash, is one of the most sacred and stunning pilgrimage sites in the Indian Himalayas. Located in the Pithoragarh District of Uttarakhand, near the Indo-Tibetan Border, Adi Kailash is revered as the earthly abode of Lord Shiva, similar to Mount Kailash in Tibet.",
      "Surrounded by snow-covered peaks, dense forests and pristine lakes, the Adi Kailash region offers a spiritually enriching experience combined with raw natural beauty. At an altitude of 5,945 Mtrs (19,505 Ft), this holy peak is the replica of Mount Kailash.",
      "Trekkers and pilgrims can also witness the peaceful Parvati Sarovar / Gauri Kund near the base of the mountain, known for its crystal-clear water and tranquil surroundings. The lake is dedicated to Goddess Parvati. The whole region is part of the ancient Kailash Mansarovar route.",
      "Om Parvat is a sacred and awe-inspiring mountain located in the Darchula District of Uttarakhand, near the Indo-Nepal-Tibet border. What makes it truly unique is the natural formation of the sacred 'OM' (ॐ) symbol on its snow-covered surface — a phenomenon that draws thousands of pilgrims, trekkers and spiritual seekers every year.",
      "Standing at an elevation of around 6,191 Meters (20,300 Ft), this mystical mountain holds deep spiritual meaning for Hindus, Buddhists and Jains. The OM is formed by natural deposition of snow and appears brightest when the snow melts slightly. The journey to Om Parvat is part of the Kailash Mansarovar Yatra and is often combined with visits to Adi Kailash.",
    ],
    highlights: [
      "🕉️ Natural OM Symbol on Om Parvat",
      "Adi Kailash Parikrama Darshan",
      "Parvati Sarovar (Gauri Kund)",
      "Pandav Parvat & Parvati Mukut",
      "Brahma Parvat, Pandav Fort & Kunti Parvat",
      "Kali Temple, Shesh Nag Parvat & Ved Vyas Cave",
      "Kainchi Dham, Golu Devta Temple & Jageshwar Dham",
      "Gunji, Navidhang, Kutti Village & Jyolingkong (Adi Kailash Base)",
    ],
    destinationHighlights: [
      { name: "Adi Kailash", blurb: "Also known as Chhota Kailash or Baba Kailash — the earthly abode of Lord Shiva at 5,945 M (19,505 Ft), an exact replica of Mount Kailash." },
      { name: "Om Parvat", blurb: "A 6,191 M (20,300 Ft) peak on the India-Nepal-Tibet tri-junction where snow naturally forms the sacred 'ॐ' symbol on its face." },
      { name: "Parvati Sarovar / Gauri Kund", blurb: "A crystal-clear holy lake at the base of Adi Kailash, dedicated to Goddess Parvati." },
      { name: "Vyas Valley", blurb: "Named after Maharishi Ved Vyas, who is believed to have stayed here in Ved Vyas Cave and written the Mahabharata." },
      { name: "Kainchi Dham", blurb: "The famous ashram of Neem Karoli Baba, visited en route on Day 1 and Day 7." },
      { name: "Jageshwar Dham", blurb: "A cluster of ancient Jyotirlinga-group temples in the deodar forests of Kumaon." },
      { name: "Patal Bhuvaneshwar", blurb: "Lord Shiva's underground limestone cave, said to house 33 crore gods." },
    ],
    idealFor: "Shiva devotees, pilgrims, family groups, couples, nature lovers and photography groups — no prior trek experience needed.",
    differentiators: [
      "No Passport, No Visa, No China Permit — Kailash Darshan in India with just an Aadhaar Card and an Inner Line Permit",
      "Both Adi Kailash and Om Parvat darshan covered in a single 7-day yatra",
      "Off-road 4x4 Camper Jeep from Dharchula onward on BRO-built border roads",
      "Only a 3 Km easy trek to Parvati Sarovar — horses available on direct payment",
      "Spiritual circuit also covers Kainchi Dham, Golu Devta, Jageshwar Dham and Patal Bhuvaneshwar",
    ],
    importantNote:
      "After Dharchula there is NO mobile network (Jio, Airtel, BSNL) for about 3 days, and Gunji/Nabi stay is a basic homestay on sharing basis with limited solar electricity. Non-veg and alcohol are strictly banned throughout Vyas Valley.",
    itinerary: [
      {
        day: 1,
        title: "Delhi to Pithoragarh",
        description: "Drive 500 Km / 12-14 Hrs via Kainchi Dham and Almora.",
        detailedDescription:
          "Pickup from Delhi at 5 AM. Drive via Kainchi Dham, Almora and Golu Devta. Visit Kainchi Dham for darshan of Neem Karoli Baba's ashram before continuing on to Pithoragarh.",
        highlights: ["Kainchi Dham Darshan"],
        driveDistance: "500 Km",
        drivingTime: "12-14 Hrs",
        altitudePoints: [{ location: "Pithoragarh", m: 1514, ft: 4967 }],
        meals: "Dinner",
        accommodation: { type: "Hotel", name: "Pithoragarh" },
      },
      {
        day: 2,
        title: "Pithoragarh to Dharchula (Medical Test & Inner Line Permits)",
        description: "Drive 90 Km / 4 Hrs. Medical test and Inner Line Permit formalities at SDM Office, Dharchula.",
        detailedDescription:
          "After breakfast, drive to Dharchula. Medical test and Inner Line Permit process at SDM Office Dharchula (mandatory for the yatra ahead) — views of the Kali River and the Nepal border along the way.",
        highlights: ["Kali River", "Nepal Border", "Permit Formalities"],
        driveDistance: "90 Km",
        drivingTime: "4 Hrs",
        altitudePoints: [{ location: "Dharchula", m: 940, ft: 3084 }],
        meals: "Breakfast, Lunch, Dinner",
        accommodation: { type: "Hotel", name: "Dharchula" },
      },
      {
        day: 3,
        title: "Dharchula to Gunji / Nabi",
        description: "Drive 70 Km / 6-7 Hrs off-road via Chiyalekh, Garbyang and Kutti Village.",
        detailedDescription:
          "Early morning off-road drive via Chiyalekh, Garbyang, Kutti Village and the terraced Dhaan Ki Kheti fields, through the Vyas Valley with views of Shesh Nag Parvat.",
        highlights: ["Vyas Valley", "Shesh Nag Parvat", "Kutti Village"],
        driveDistance: "70 Km",
        drivingTime: "6-7 Hrs (off-road)",
        altitudePoints: [{ location: "Gunji / Nabi", m: 3200, ft: 10499 }],
        meals: "Breakfast, Lunch, Dinner",
        accommodation: { type: "Homestay", name: "Gunji/Nabi — very basic, 10,500 Ft" },
      },
      {
        day: 4,
        title: "Gunji/Nabi to Adi Kailash & Return to Gunji/Nabi",
        description: "Drive 70 Km both side / 8 Hrs — the day of the main Adi Kailash darshan.",
        detailedDescription:
          "Drive 35 Km to Jyolingkong, the Adi Kailash base, then a short 3 Km walk to Parvati Sarovar / Gauri Kund. Darshan of Adi Kailash, Brahma Parvat, Pandav Parvat, Parvati Mukut, Pandav Fort and Kunti Parvat, before returning to Gunji/Nabi for the night.",
        highlights: ["Adi Kailash Darshan", "Parvati Sarovar", "Brahma Parvat", "Pandav Parvat"],
        driveDistance: "70 Km (round trip)",
        drivingTime: "8 Hrs",
        trekDistance: "3 Km (to Parvati Sarovar)",
        altitudePoints: [{ location: "Adi Kailash Base (Jyolingkong)", m: 4515, ft: 14812 }],
        meals: "Breakfast, Lunch, Dinner",
        accommodation: { type: "Homestay", name: "Gunji/Nabi" },
      },
      {
        day: 5,
        title: "Gunji/Nabi to Om Parvat & Return to Dharchula",
        description: "Drive to Om Parvat View Point, then 70 Km back to Dharchula.",
        detailedDescription:
          "Early 4 AM departure to Navidhang / Om Parvat View Point for darshan of the natural OM symbol at 6,191 M, plus views of Parvati Mata Navel Peak, Kali Temple, Ved Vyas Cave and Shesh Nag Parvat. Drive back 70 Km to Dharchula in the afternoon.",
        highlights: ["Om Parvat Darshan", "Ved Vyas Cave", "Kali Temple", "Shesh Nag Parvat"],
        driveDistance: "140 Km",
        drivingTime: "9-10 Hrs",
        altitudePoints: [{ location: "Om Parvat View Point (Navidhang)", m: 4200, ft: 13780 }],
        meals: "Breakfast, Lunch, Dinner",
        accommodation: { type: "Hotel", name: "Dharchula" },
      },
      {
        day: 6,
        title: "Dharchula to Jageshwar Dham",
        description: "Drive 230 Km / 9-10 Hrs, en-route Patal Bhuvaneshwar Cave darshan.",
        detailedDescription:
          "After breakfast, proceed towards Jageshwar Dham, visiting Patal Bhuvaneshwar (Lord Shiva's underground cave, said to house 33 crore gods) and the Jageshwar Dham temple complex (a 12th-Jyotirlinga-group of temples) along the way.",
        highlights: ["Patal Bhuvaneshwar Cave", "Jageshwar Dham"],
        driveDistance: "230 Km",
        drivingTime: "9-10 Hrs",
        altitudePoints: [{ location: "Jageshwar Dham", m: 1870, ft: 6135 }],
        meals: "Breakfast, Lunch, Dinner",
        accommodation: { type: "Hotel", name: "Jageshwar Dham" },
      },
      {
        day: 7,
        title: "Jageshwar Dham to Delhi",
        description: "Drive 394 Km / 9-10 Hrs via Kainchi Dham and Chitayi Golu Devta — yatra ends in Delhi.",
        detailedDescription:
          "After breakfast, visit Kainchi Dham and Chitayi Golu Devta (Temple of Bells, the God of Justice) before the long drive back. Drop at Delhi by 10-11 PM, closing the yatra.",
        highlights: ["Kainchi Dham", "Chitayi Golu Devta"],
        driveDistance: "394 Km",
        drivingTime: "9-10 Hrs",
        meals: "Breakfast",
      },
    ],
    inclusions: [
      { title: "Guide / Trip Captain", description: "Guide / Trip Captain from Dharchula." },
      { title: "Transportation to Dharchula", description: "Innova / Tempo Traveller / Ertiga, Delhi to Dharchula and return (as per group size)." },
      { title: "Off-road Camper Jeep", description: "4x4 Camper Jeep (5 persons per jeep), Dharchula to Gunji/Nabi to Dharchula — off-road vehicle mandatory." },
      { title: "Stay — 6 Nights", description: "Hotel / Homestay on sharing basis: Pithoragarh (1N), Dharchula (2N), Gunji/Nabi (2N), Jageshwar Dham (1N)." },
      { title: "Meals", description: "Pure vegetarian meals as per itinerary — Day 1 Dinner to Day 7 Breakfast." },
      { title: "Permits & Medical Test", description: "Inner Line Permit, SDM permission and medical test fees included." },
      { title: "First Aid & Oxygen", description: "First aid kit and oxygen support on the yatra." },
    ],
    exclusions: [
      { title: "GST", description: "5% GST extra (mandatory as per Govt rule)." },
      { title: "Medical & Evacuation", description: "Any medical expense or emergency evacuation." },
      { title: "Insurance", description: "Any kind of insurance — travel, medical or accident." },
      { title: "Extra Stay", description: "Additional stay beyond the package days, chargeable at ₹3,000/day." },
      { title: "Horses", description: "Horses for the Parvati Sarovar trek (₹3,000-5,000), subject to availability — direct payment to the horse owner." },
      { title: "Personal Expenses", description: "Tea/coffee, shopping, pooja samagri and porter charges." },
      { title: "Alternate Vehicle on Landslide", description: "If the road closes due to landslide, alternate vehicle cost from Delhi to Pithoragarh is extra." },
    ],
    eligibilityCriteria: [
      { icon: "User", text: "Age 10 to 70 years — below 10 not allowed per SDM Dharchula & ITBP rule; up to 75-80 years allowed if medically fit with a Govt hospital certificate" },
      { icon: "Stethoscope", text: "Not open to trekkers with heart problems, high blood pressure, severe asthma or chronic illness; pregnant women not allowed" },
      { icon: "FileText", text: "Valid Govt ID (Aadhaar / Voter ID / Passport for foreign nationals), 4 passport photos, and a medical fitness certificate not older than 1 month" },
      { icon: "IdCard", text: "Foreign nationals allowed with a passport, special permit and MHA clearance (arranged by us, takes about 15 days)" },
    ],
    fitnessCriteria: [
      { icon: "Footprints", text: "Only a 3-4 Km trek to Parvati Sarovar / Gauri Kund — horses available on direct payment" },
      { icon: "Activity", text: "Mostly covered by 4x4 Camper Jeep on off-road terrain — basic fitness and the ability to sit through long drives is enough" },
      { icon: "Dumbbell", text: "Regular cardio and breathing exercises recommended for 1 month before the yatra, given the altitude" },
      { icon: "TrendingUp", text: "Goes up to 14,800 Ft (Adi Kailash base) and 14,500 Ft (Om Parvat) where oxygen is low — acclimatization stay at Dharchula is built in" },
    ],
    howToReach: {
      intro: "Our service is Delhi to Delhi; you can also join from Kathgodam, Haldwani or Pithoragarh at a reduced cost.",
      air: {
        summaryLabel: "Nearest Airport",
        summary: "Delhi Airport (DEL) — Best Option",
        detail:
          "Direct flights from all over India land at Delhi to join our Delhi-to-Delhi group. Pantnagar Airport (PGH), about 300 Km from Dharchula, is the nearest airport to the Pithoragarh region with daily flights from Delhi; Naini Saini Airport, Pithoragarh (NNS) is closer but has irregular flights.",
      },
      train: {
        summaryLabel: "Best Option",
        summary: "Kathgodam Railway Station (KGM)",
        detail:
          "About 300 Km from Dharchula / 110 Km from Pithoragarh — the main station with direct trains from Delhi (Ranikhet Express, Shatabdi, Sampark Kranti). Tanakpur (TPU) is a second option, about 200 Km from Dharchula. From Kathgodam/Haldwani, a taxi or bus runs to Pithoragarh in 8-9 Hrs.",
      },
      road: {
        summaryLabel: "By Road",
        summary: "Delhi to Pithoragarh via Haldwani, Almora & Gurna Mata",
        detail:
          "Road is good till Dharchula; after Dharchula it is full off-road, covered only by 4x4 Camper Jeep with ITBP check posts en route. Inner Line Permit is checked at Chiyalekh Check Post — no permit, no entry.",
        route: ["Delhi", "Haldwani", "Almora", "Gurna Mata", "Pithoragarh", "Jauljibi", "Dharchula", "Chiyalekh", "Gunji"],
        facts: [
          { label: "Delhi to Pithoragarh", value: "500 Km / 12-14 Hrs" },
          { label: "Pithoragarh to Dharchula", value: "90 Km / 4 Hrs" },
          { label: "Dharchula to Gunji", value: "70 Km / 6-7 Hrs (off-road)" },
        ],
      },
      pickup: {
        point: "Delhi ISBT Kashmere Gate / Majnu Ka Tila, 5 AM (Day 1)",
        time: "5:00 AM (Day 1)",
        dropPoint: "Delhi",
        dropTime: "10:00 PM – 11:00 PM (Day 7)",
        note: "Kathgodam-to-Kathgodam pickup (8 AM Day 1) and Dharchula-to-Dharchula pickup are also available as reduced-cost options.",
      },
    },
    faqs: [
      {
        title: "What is included in the Adi Kailash & Om Parvat Yatra package?",
        description:
          "Our Delhi-to-Delhi 7D/6N package includes transport (Delhi-Pithoragarh-Dharchula by Tempo/Innova, plus Dharchula-to-Gunji by 4x4 Camper Jeep, 5 pax per jeep), 6 nights hotel/homestay (sharing), all pure veg meals (Day 1 Dinner to Day 7 Breakfast), Inner Line Permit, medical test fees, a trip captain/guide, and first aid & oxygen.",
      },
      {
        title: "What is the age limit and who can do this yatra?",
        description:
          "Minimum age is 10 years, maximum 70 years (up to 80 if medically fit). Children below 10 are not allowed by ITBP. Senior citizens, couples and families can do it if fit — only a 3 Km easy trek, no prior trekking experience needed. Pregnant women are not allowed.",
      },
      {
        title: "Is a medical fitness certificate required?",
        description:
          "Yes, it's compulsory — a certificate from your city's Govt doctor, plus a repeat medical test at Dharchula Govt Hospital on Day 2 for the permit. Trekkers with heart issues, high BP or severe asthma are not advised to attempt the yatra.",
      },
      {
        title: "How difficult is Adi Kailash Yatra? Is there an oxygen problem?",
        description:
          "Difficulty is Easy to Medium. The highest points are Adi Kailash base at Jyolingkong (14,800 Ft) and the Om Parvat view point (14,500 Ft). Oxygen is low but manageable — we carry an oxygen cylinder in the vehicle, and the acclimatization stay at Dharchula helps.",
      },
      {
        title: "Is there network and electricity in Gunji/Nabi?",
        description:
          "No. After Dharchula there is no mobile network (Jio, Airtel, BSNL) for 3 days. Gunji/Nabi homestay has limited solar electricity — charging is possible but not guaranteed. Inform family before leaving Dharchula; network is full in Dharchula and Pithoragarh.",
      },
      {
        title: "What type of stay and food is provided?",
        description:
          "Pithoragarh, Dharchula and Jageshwar have good hotels with attached bathroom and geyser. Gunji/Nabi is a very basic homestay (sharing, 4-6 people per room, common washroom, no luxury). Food is pure vegetarian North Indian — non-veg and alcohol are strictly banned in Vyas Valley.",
      },
      {
        title: "Do we need a passport or visa for Adi Kailash?",
        description:
          "No. Indian citizens need only an Aadhaar Card and photos. Foreign nationals need a passport plus a special permit (we arrange it, about 15 days) — no China visa is required, unlike Kailash Mansarovar Yatra.",
      },
      {
        title: "Is a horse available for the Parvati Sarovar trek?",
        description:
          "Yes, limited horses are available at Jyolingkong for the 3 Km trek to Parvati Sarovar / Gauri Kund — ₹3,000-5,000 per person, paid directly to the owner. Not included in the package; walking is easy if you're fit.",
      },
      {
        title: "What is the best time for Adi Kailash & Om Parvat Yatra?",
        description:
          "Season runs May to October. Best months are May-June (clear sky, full snow) and September-October (best views, no rain). July-August is monsoon, with landslide and road-block risk.",
      },
      {
        title: "What to pack for the yatra?",
        description:
          "Heavy woolen jacket, thermal inners, gloves, cap, woolen socks, waterproof trekking shoes, sunscreen SPF50, sunglasses, power bank, torch, personal medicines and Diamox for altitude (consult your doctor).",
      },
      {
        title: "What if the permit gets rejected or the road is closed?",
        description:
          "If a permit is rejected for medical reasons or ITBP cannot issue it due to landslide/weather, we refund the proportionate amount after deducting transport and hotel costs already incurred. No full refund once the yatra has started; the yatra can also be delayed by 1-2 days for weather.",
      },
      {
        title: "Is Om Parvat a trek or a vehicle darshan?",
        description:
          "Om Parvat is a vehicle darshan — you travel by Camper Jeep till the Navidhang view point and see the OM symbol from a distance. There is no trek involved.",
      },
    ],
    similarTreks: ["chardham-yatra", "panch-kedar-trek"],
    // TODO(content): seeded departure so this yatra qualifies for the
    // 60-day "Upcoming" filter. Replace with the real batch grid.
    "batchDates": ["2026-10-14"]
  },
  {
    "slug": "chardham-yatra-by-helicopter",
    "name": "Chardham Yatra By Helicopter",
    "heroImage": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/Badrinath_temple_entrance.JPG/1920px-Badrinath_temple_entrance.JPG",
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
    "heroImage": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Badrinath_Temple.jpg/1920px-Badrinath_Temple.jpg",
    "batchDates": ["2026-09-12"],             // TODO(content): seeded departure
    // Client-approved About copy. Line breaks inside a paragraph are
    // intentional and are preserved by `whitespace-pre-line` in TrekAbout.
    // TODO(content): itinerary, inclusions, eligibility, departures and FAQs
    // are still pending from the client — they render from the generic trek
    // fallbacks until that data arrives.
    "aboutHeading": "About Do Dham Yatra",
    "aboutSubheading": "A Journey That Takes You Closer to the Divine",
    "aboutParagraphs": [
      "Some journeys are not meant to be measured in kilometres.\nThey are measured in faith, emotions and blessings.",
      "The Do Dham Yatra to Kedarnath and Badrinath is one such journey — a sacred passage through the heart of the Himalayas, where every mountain carries a story, every river feels holy, and every step brings you closer to yourself.",
      "Begin your journey at Kedarnath Dham, the sacred abode of Lord Shiva. Surrounded by magnificent Himalayan peaks, the journey to Kedarnath is a test of faith, strength and devotion. As you finally stand before the ancient temple, the tiredness of the journey slowly fades, leaving behind a feeling that is difficult to put into words.",
      "From Kedarnath, continue towards Badrinath Dham, the divine abode of Lord Vishnu. Nestled amidst the Himalayas beside the sacred Alaknanda River, Badrinath offers an atmosphere of peace, devotion and spiritual calm.",
      "But Do Dham is not only about visiting two temples.\nIt is about leaving behind the noise of everyday life and listening to what your soul has been trying to say.\nIt is about travelling with your parents, holding your family's hands, sharing prayers with loved ones and creating memories that remain in the heart forever.",
      "At Trip My Soul, we believe that a pilgrimage should be more than a trip.\nIt should be an experience filled with faith, care, comfort and unforgettable moments.",
      "So come with your prayers.\nCome with your family.\nCome with your faith.\nAnd let the Himalayas take you where your soul truly belongs."
    ]
  },
  {
    "slug": "panch-kedar-dham-yatra",
    "name": "Panch Kedar Trek",
    "heroImage": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/Small_temple_at_Madhyamaheshwar_village.JPG/1920px-Small_temple_at_Madhyamaheshwar_village.JPG",
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
    "heroImage": "/Trips_gallery/Madhmaheshwar/IMG_1777.jpg",
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
    "heroImage": "/Trips_gallery/Rudranath/IMG_0096.jpg",
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
    "heroImage": "/Trips_gallery/Har_Ki_Dun/HKD_swargarohini.jpeg",
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
    "heroImage": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/SWARGAROHINI_MOUNTAIN.2.jpg/1920px-SWARGAROHINI_MOUNTAIN.2.jpg",
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
    "heroImage": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/AjitHota_RupinPass_LowerwWaterfall_view.jpg/1920px-AjitHota_RupinPass_LowerwWaterfall_view.jpg",
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
    "heroImage": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Roopkund_-_The_Mystery_Lake.jpg/1920px-Roopkund_-_The_Mystery_Lake.jpg",
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
    "heroImage": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Chaukhamba_from_Bedni_Bugyal.jpg/1920px-Chaukhamba_from_Bedni_Bugyal.jpg",
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
    "heroImage": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Kedarkantha_trek.jpg/1920px-Kedarkantha_trek.jpg",
    "batchDates": ["2026-10-17"]              // TODO(content): seeded departure
  }
  // `spiti-valley-yatra` removed — it duplicated `spiti-valley` in TREKS, which
  // now carries the merged content.
];

export const WILDLIFE: Trek[] = [
  {
    "slug": "satpura-002",
    "name": "satpura",
    "heroImage": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/Spotted_deer%2C_Satpura_Tiger_Reserve%2C_Madhai%2C_Madhya_Pradesh.jpg/1920px-Spotted_deer%2C_Satpura_Tiger_Reserve%2C_Madhai%2C_Madhya_Pradesh.jpg",
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
    "heroImage": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/Spotted_Deer_in_Pench_National_Park_India.jpg/1920px-Spotted_Deer_in_Pench_National_Park_India.jpg",
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
    "heroImage": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Bengal_tigress_with_cub_at_Tadoba_Andhari_Tiger_Reserve%2C_Maharashtra%2C_India.jpg/1920px-Bengal_tigress_with_cub_at_Tadoba_Andhari_Tiger_Reserve%2C_Maharashtra%2C_India.jpg",
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
    "heroImage": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/61/Sambar_deer%2C_Satpura_Tiger_Reserve%2C_Madhai%2C_Madhya_Pradesh.jpg/1920px-Sambar_deer%2C_Satpura_Tiger_Reserve%2C_Madhai%2C_Madhya_Pradesh.jpg",
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
    "heroImage": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Tiger_Kanha_National_Park.jpg/1920px-Tiger_Kanha_National_Park.jpg",
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
    "heroImage": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Majestic_Vistas_from_the_Hills_of_Pachmarhi_22.jpg/1920px-Majestic_Vistas_from_the_Hills_of_Pachmarhi_22.jpg",
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
    "heroImage": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Bandhavgarh_National_Park_01.jpg/1920px-Bandhavgarh_National_Park_01.jpg",
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
    {
      source: "Google",
      subject: "Trip My Soul",
      author: "manika varshney",
      rating: 5,
      date: "8 months ago",
      text: [
        "This was my very first trek with Trip My Soul, and it turned out to be an absolutely wonderful experience. The entire journey was memorable, but what truly made it special was our trek leader, Rakesh Negi.",
        "He was incredibly supportive, encouraging, and motivating throughout the trek. At one point, my health was really not good, and I was struggling a lot. However, our trek leader never gave up on me. With his constant guidance, patience, and encouragement, he helped me push through and reach the summit successfully.",
        "Reaching the top and witnessing such a breathtaking sunrise made every bit of effort worthwhile. That moment will stay with me forever. I am truly grateful for his dedication, kindness, and leadership.",
        "I will always cherish this experience, and I am deeply thankful to Trip My Soul and especially to Rakesh Negi for making my first trek so memorable. He is genuinely the best trek leader, and I couldn't have asked for a better start to my trekking journey."
      ]
    },
    {
      source: "Google",
      subject: "Trip My Soul",
      author: "Manju Chahar",
      rating: 5,
      date: "7 months ago",
      text: [
        "Trekking Kedarkantha with Trip My Soul was an unforgettable experience from start to finish. The entire journey was extremely well organized, and the team made sure every detail was taken care of so we could fully enjoy the trek.",
        "The trek leaders and guides (Rakesh and Trishna) were knowledgeable, supportive, and always motivated us, especially during the challenging climbs. They ensured our safety at every step while also sharing interesting insights about the mountains, local culture, and surroundings. The campsites were scenic and well managed, the tents were comfortable, and the food was surprisingly delicious and nutritious — exactly what you need after a long day of trekking.",
        "What truly stood out was the professionalism and warmth of the Trip My Soul team. They treated everyone like family, created a fun group atmosphere, and were always ready to help with anything we needed. Watching the sunrise from the Kedarkantha summit was magical, and the experience felt even more special thanks to their excellent planning and support.",
        "I highly recommend Trip My Soul to anyone planning the Kedarkantha trek. If you want a safe, well-organized, and memorable Himalayan adventure, they are a fantastic choice."
      ]
    },
    {
      source: "Google",
      subject: "Trip My Soul",
      author: "Sky Noob",
      rating: 5,
      date: "9 months ago",
      text: [
        "My Kedarkantha trek was truly one of the most unforgettable experiences of my life, and a huge credit goes to our amazing trek leader. From the very beginning till the summit, the trek leader was extremely helpful, supportive, and motivating, always ensuring everyone was safe, comfortable, and confident. Their encouragement and constant support, especially till the peak, made a big difference and kept the entire group going with high spirits.",
        "This trek was not just about the trail — it was filled with fun, laughter, and beautiful bonding moments. We shared countless stories, played games, and board games at night, which became the highlight after long trekking days. Despite the bone-chilling cold, the atmosphere remained warm because everyone was cheerful and full of energy.",
        "The nights were absolutely magical. Watching countless stars and even satellites with the naked eye was a surreal experience. The cold near the peak was intense, but reaching the summit made it all worth it. The sunset view from the top was breathtaking and unforgettable, truly a once-in-a-lifetime sight.",
        "The meals were surprisingly amazing, honestly better than many restaurants. Huge respect to the people who prepared and provided such delicious, warm, and hygienic food along with other amenities at such a high altitude — it takes real dedication and hard work. Every member of the team was welcoming, cheerful, and full of positivity, which added so much value to the entire experience."
      ]
    }
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
    { title: "Accommodation", description: "3 nights on quad/triple-sharing basis — 1 night in Raithal and 2 nights at the Gui campsite." },
    { title: "Meals", description: "All meals during the trek — breakfast, lunch and dinner." },
    { title: "Morning Tea/Coffee", description: "Morning tea or coffee on every trek day." },
    { title: "Transportation", description: "Dehradun → Raithal → Dehradun/Rishikesh." },
    { title: "Trek Leader/Guide", description: "Experienced trek leader or guide throughout the trek." },
    { title: "Support Staff", description: "Support staff and camping crew." },
    { title: "Tented Accommodation", description: "Tented accommodation at Gui." },
    { title: "Sleeping Bags & Mattresses", description: "Sleeping bags and mattresses for the camping nights." },
    { title: "Camping Equipment", description: "Camping equipment, kitchen tent and dining tent." },
    { title: "Permits", description: "Trekking permits and required forest entry permits." },
    { title: "First Aid", description: "First-aid kit and basic medical support." },
    { title: "Trek Equipment & Safety Gear", description: "Trek equipment and safety gear required by the trek operator." }
  ];

  TREKS[dayaraBugyalIndex].exclusions = [
    { title: "Personal expenses", description: "Snacks, beverages, laundry and phone calls." },
    { title: "Personal porter / mule", description: "Personal porter or mule service for your luggage." },
    { title: "Personal trekking gear", description: "Trekking shoes, jackets, trekking poles and other personal gear." },
    { title: "Medical expenses", description: "Any medical expenses or evacuation costs." },
    { title: "Insurance", description: "Travel insurance." },
    { title: "Weather & roadblocks", description: "Expenses caused by bad weather, landslides, roadblocks or natural calamities." },
    { title: "Extra stay & meals", description: "Any additional accommodation or meals outside the planned itinerary." },
    { title: "Early return", description: "Any cost arising from an early return or change in itinerary due to personal reasons." },
    { title: "Anything not listed", description: "Anything not specifically mentioned under “Inclusions”." }
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
      dropPoint: "Dehradun / Rishikesh",
      dropTime: "Evening of Day 4",
      note: "For TMS departures the trek starts with a pickup from Dehradun, followed by the drive to Raithal Village, the base village for the Dayara Bugyal Trek."
    }
  };

  TREKS[dayaraBugyalIndex].bookingAdvancePct = 20;

  TREKS[dayaraBugyalIndex].bookingTerms = [
    { title: "Trek Cost", description: "₹6,499 + 5% GST* per selected package/departure date." },
    { title: "Booking Amount", description: "20% advance payment required to confirm your seat." },
    { title: "Balance Payment", description: "Payable before/at the start of the trek as per booking terms." },
    { title: "Transportation", description: "Dehradun–Raithal–Dehradun/Rishikesh as per the selected package." },
    { title: "Inclusions", description: "Accommodation, meals, trek permits/forest charges, trek guide & support staff as mentioned in the package." },
    { title: "Exclusions", description: "Personal expenses, insurance, emergency evacuation, additional transport and anything not specifically mentioned under inclusions." },
    { title: "GST", description: "Applicable as per package/booking terms." },
    { title: "Cancellation", description: "Cancellation and refund will be governed by Trip My Soul’s cancellation policy." },
    { title: "Weather & Route", description: "Itinerary may change due to weather, government/forest restrictions or safety conditions." },
    { title: "Personal Expenses", description: "Any expenses arising due to personal reasons will be borne by the participant." },
    { title: "ID Proof", description: "Valid government-issued ID is required at the time of booking/check-in." }
  ];

  TREKS[dayaraBugyalIndex].heroImage =
    "/Trips_gallery/Dyara_Bugyal/IMG_4453.JPG.jpeg";

  // `heroImages` replaces the slideshow entirely, so the hero shot leads the list.
  TREKS[dayaraBugyalIndex].heroImages = [
    "/Trips_gallery/Dyara_Bugyal/IMG_4453.JPG.jpeg",
    "/Trips_gallery/Dyara_Bugyal/IMG_4438.JPG.jpeg",
    "/Trips_gallery/Dyara_Bugyal/IMG_4440.JPG.jpeg",
    "/Trips_gallery/Dyara_Bugyal/IMG_4451.JPG.jpeg"
  ];

  TREKS[dayaraBugyalIndex].gallery = [
    { url: "/Trips_gallery/Dyara_Bugyal/IMG_4453.JPG.jpeg", caption: "The Garhwal range mirrored in the tarn beside the meadow" },
    { url: "/Trips_gallery/Dyara_Bugyal/IMG_4437.JPG.jpeg", caption: "Alpenglow on the peaks above the campsite" },
    { url: "/Trips_gallery/Dyara_Bugyal/IMG_4450.JPG.jpeg", caption: "Dayara Bugyal in the green season — one of India's largest alpine meadows" },
    { url: "/Trips_gallery/Dyara_Bugyal/IMG_4451.JPG.jpeg", caption: "Tents on the meadow, seen from above" },
    { url: "/Trips_gallery/Dyara_Bugyal/IMG_4431.JPG.jpeg", caption: "Autumn grass on the bugyal, facing the snow line" },
    { url: "/Trips_gallery/Dyara_Bugyal/IMG_4447.JPG.jpeg", caption: "Walking out onto the meadow under a clear winter sky" },
    { url: "/Trips_gallery/Dyara_Bugyal/IMG_4432.JPG.jpeg", caption: "A lone trekker on the winter snowfields below the peaks" },
    { url: "/Trips_gallery/Dyara_Bugyal/IMG_4433.JPG.jpeg", caption: "Fresh snowfall in the oak forest above Raithal" },
    { url: "/Trips_gallery/Dyara_Bugyal/IMG_4436.JPG.jpeg", caption: "Climbing through the snowbound forest in falling snow" },
    { url: "/Trips_gallery/Dyara_Bugyal/IMG_4435.JPG.jpeg", caption: "Waiting out a snowfall on the trail" },
    { url: "/Trips_gallery/Dyara_Bugyal/IMG_4434.JPG.jpeg", caption: "Open snow slopes on the way up to the bugyal" },
    { url: "/Trips_gallery/Dyara_Bugyal/IMG_4445.JPG.jpeg", caption: "The last climb onto Dayara Bugyal" },
    { url: "/Trips_gallery/Dyara_Bugyal/IMG_4438.JPG.jpeg", caption: "Crossing a snowfield at the edge of the forest" },
    { url: "/Trips_gallery/Dyara_Bugyal/IMG_4446.JPG.jpeg", caption: "Snow-covered ridges seen from the trail" },
    { url: "/Trips_gallery/Dyara_Bugyal/IMG_4448.JPG.jpeg", caption: "The mule train carrying supplies across the meadow" },
    { url: "/Trips_gallery/Dyara_Bugyal/IMG_4439.JPG.jpeg", caption: "Camp pitched on open snow with the range behind" },
    { url: "/Trips_gallery/Dyara_Bugyal/IMG_4441.JPG.jpeg", caption: "On the meadow in winter sunshine" },
    { url: "/Trips_gallery/Dyara_Bugyal/IMG_4440.JPG.jpeg", caption: "Sunset over the Garhwal Himalaya from the meadow" },
    { url: "/Trips_gallery/Dyara_Bugyal/IMG_4449.JPG.jpeg", caption: "Last light at the campsite" },
    { url: "/Trips_gallery/Dyara_Bugyal/IMG_4452.JPG.jpeg", caption: "A lit tent after dark at Gui" }
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
    { name: "Gui Campsite", blurb: "A forest clearing at about 9,800 ft, reached through oak and rhododendron, and the campsite for both trek nights." },
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
      driveDistance: "180–190 km",
      drivingTime: "7-9 Hours",
      pickupPoint: "Dehradun Railway Station",
      pickupTime: "6:00 AM",
      altitudePoints: [
        { location: "Dehradun", m: 640, ft: 2100 },
        { location: "Raithal", m: 2256, ft: 7400 }
      ],
      altitudeGain: { m: 1616, ft: 5300 },
      description: "A scenic Himalayan drive to Raithal, the base village of the Dayara Bugyal Trek.",
      detailedParagraphs: [
        "Your Himalayan journey begins early morning from Dehradun. Meet our team at the designated pickup point and begin the drive towards Raithal.",
        "The road follows the Bhagirathi valley through Uttarkashi and Bhatwari, passing rivers, forests and Garhwali villages. As the road climbs, the mountains grow taller and the familiar world slowly disappears behind you.",
        "Reach Raithal by evening and check into your guesthouse or homestay. Take some time to relax, walk through the village and prepare for the trek ahead.",
        "Enjoy dinner and an overnight stay in Raithal."
      ],
      highlights: ["Bhagirathi Valley Drive", "Uttarkashi & Bhatwari", "Raithal Village", "Trek Briefing"],
      meals: "Dinner",
      stayType: "Guesthouse / Homestay"
    },
    {
      day: 2,
      title: "Raithal to Gui Campsite",
      trekDistance: "4 km",
      trekDuration: "2-3 Hours",
      altitudePoints: [
        { location: "Raithal", m: 2256, ft: 7400 },
        { location: "Gui", m: 2987, ft: 9800 }
      ],
      altitudeGain: { m: 731, ft: 2400 },
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
      trekDistance: "8–10 km",
      trekDuration: "5-7 Hours",
      altitudePoints: [
        { location: "Gui", m: 2987, ft: 9800 },
        { location: "Dayara Bugyal", m: 3658, ft: 12000 },
        { location: "Gui", m: 2987, ft: 9800 }
      ],
      altitudeGain: { m: 671, ft: 2200 },
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
      title: "Gui to Raithal to Dehradun/Rishikesh",
      trekDistance: "4 km",
      trekDuration: "2-3 Hours",
      driveDistance: "180–190 km",
      drivingTime: "7-9 Hours",
      altitudePoints: [
        { location: "Gui", m: 2987, ft: 9800 },
        { location: "Raithal", m: 2256, ft: 7400 },
        { location: "Dehradun", m: 640, ft: 2100 }
      ],
      altitudeGain: null,
      description: "Descend the forest trail to Raithal and drive back to Dehradun/Rishikesh as the journey ends.",
      detailedParagraphs: [
        "Wake up at the campsite and enjoy your final Himalayan breakfast.",
        "The descent from Gui to Raithal follows the same trail you climbed two days ago — but it no longer feels unfamiliar. You remember the bends, the trees, the campsite and the people you walked with.",
        "Arrive in Raithal and board the vehicle for the return journey towards Dehradun/Rishikesh.",
        "Enjoy the last scenic drive back down the Bhagirathi valley, reaching Dehradun/Rishikesh in the evening with the meadows still fresh in your memory."
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

// Static details for the Rupin Pass Trek (uid: rupin-pass-trek), the
// high-altitude crossover from Bawta/Jiskun in Himachal Pradesh over the
// 15,350 ft Rupin Pass into Ronti Gad and Sangla Valley, run as a
// Shimla-to-Shimla circuit. `difficulty`, `months` and `tagline` on the
// catalogue entry above have been corrected to Difficult / May-Jun & Sep-Oct
// to match this published itinerary; the trek does not run in winter or
// during the Jul-Aug monsoon. Booking terms are left unset so the listing
// renders the shared cancellation copy from `trekDefaults.ts` / `TrekCancellation`.
const rupinPassIndex = TREKS.findIndex(t => t.slug === 'rupin-pass-trek');
if (rupinPassIndex !== -1) {
  TREKS[rupinPassIndex].totalDistance = "Approx. 460 km by road + 41 km on foot";
  TREKS[rupinPassIndex].maxAltitude = "15,350 ft / 4,680 m (Rupin Pass Top)";

  TREKS[rupinPassIndex].inclusions = [
    { title: "Accommodation at Bawta/Jiskun & Jakha", description: "02 nights in homestay/guest house on triple sharing, in the villages of Bawta/Jiskun and Jakha." },
    { title: "Camping", description: "04 nights in trekking tents on triple sharing, with sleeping bags and mats." },
    { title: "Trekking Guide", description: "01 certified trekking guide for the full duration of the trek." },
    { title: "Trekking Crew", description: "Cooks and helpers to support the trek." },
    { title: "Permits", description: "All trekking and camping permits and permissions for Govind Wildlife Sanctuary." },
    { title: "Meals", description: "Basic Indian vegetarian meals (3 meals a day), from dinner on Day 1 to breakfast on Day 7." },
    { title: "Trek Leader & Local Guide", description: "Certified Trek Leader and local guide throughout the trek." },
    { title: "Transportation", description: "Transport from Shimla to Bawta/Jiskun on Day 1, and Sangla to Shimla on Day 7." },
    { title: "Toll, Parking & Tax", description: "All toll, parking and tax charges included." }
  ];

  TREKS[rupinPassIndex].exclusions = [
    { title: "GST", description: "Mandatory GST of 5% on the invoice amount." },
    { title: "Personal Expenses", description: "Any personal expenses, personal trekking gear and personal medicines." },
    { title: "Extra Meals & Beverages", description: "Any extra meals, snacks, tea, coffee or bottled water." },
    { title: "Force Majeure Costs", description: "Any cost arising due to landslide, bad weather, roadblock or political disturbance — payable extra on spot." },
    { title: "Backpack Offloading", description: "Rs. 1,500/- for the full trek (optional)." },
    { title: "Travel Insurance", description: "Travel insurance." },
    { title: "Shimla Stay", description: "Shimla accommodation on Day 0 and Day 7." },
    { title: "Anything not listed", description: "Anything not specifically mentioned under Inclusions." }
  ];

  TREKS[rupinPassIndex].minAge = 14;
  TREKS[rupinPassIndex].maxAge = 60;
  TREKS[rupinPassIndex].minAgeWithGuardian = 14;
  TREKS[rupinPassIndex].soloAgeMin = 18;

  TREKS[rupinPassIndex].eligibilityCriteria = [
    { icon: "User", text: "Age: 14–60 years — 14 to 17 years must be with a parent/guardian, and above 55 years must submit a medical fitness certificate" },
    { icon: "Footprints", text: "Experience: Must have completed at least 1 Moderate or Moderate-Difficult trek in the last 2 years — not open to first-time trekkers" },
    { icon: "Mountain", text: "This is a Difficult-grade crossover trek with a high-altitude pass, a steep snow gully and a glacier walk" },
    { icon: "ShieldCheck", text: "We reserve the right to stop any trekker on the trail if the Trek Leader feels their fitness is inadequate — safety first" },
    { icon: "Stethoscope", text: "Not permitted with severe asthma, heart problems, epilepsy, uncontrolled high BP, recent surgery, or a major illness/Covid in the last month" },
    { icon: "Snowflake", text: "Closed through winter (heavy snow) and July–August (monsoon rain, landslides and risky river crossings)" }
  ];

  /** Difficult grade: 8-12 km daily with a 6-7 kg backpack, plus a roped snow-gully climb on summit day. */
  TREKS[rupinPassIndex].fitnessCriteria = [
    { icon: "Footprints", text: "Able to jog/run 5 km in 35–40 minutes without stopping" },
    { icon: "TrendingUp", text: "Comfortable walking 10–12 km daily with a 6–7 kg backpack, for 6–7 consecutive days" },
    { icon: "Dumbbell", text: "Able to climb 50 floors of stairs without heavy breathing" },
    { icon: "Backpack", text: "BMI below 28 — recommended to reduce weight before the trek if higher" },
    { icon: "Activity", text: "Start a 30-day pre-trek routine of daily running, stair climbing, squats, lunges, planks and breathing exercises (Kapal Bhati & Anulom Vilom)" }
  ];

  TREKS[rupinPassIndex].aboutParagraphs = [
    "Rupin Pass Trek is a high-altitude crossover trek from Himachal Pradesh to Uttarakhand at an altitude of 15,350 ft (4,680 m). It connects Dhaula village in Uttarakhand with Sangla in Himachal Pradesh — but we run it as a Shimla-to-Shimla circuit, starting from Bawta/Jiskun and ending at Sangla, then driving back to Shimla.",
    "This trek is called \"A Trek of Many Landscapes\" — you will never see the same view for two days in a row. The first day takes you into the hanging villages of Jiskun and Jhaka, the last village of Himachal Pradesh, with wooden-and-stone houses built on the edge of a cliff.",
    "From Sewa to Dhanderas Thatch, the trail follows the Rupin River through a deep gorge to the 3-stage Rupin Waterfall, 100 metres high, where you camp right below it at Upper Waterfall Camp (13,120–13,200 ft) — at night, you can hear the waterfall from your tent.",
    "Dhanderas Thatch itself is a huge alpine meadow at around 11,700 ft that turns yellow with marigold flowers in June and September, with views of the Dhauladhar Range. Summit day is a steep, 3-step snow climb from Upper Waterfall to the pass, including a roughly 75-degree snow gully climbed with the help of rope, before a 360-degree view from the top over the Kinnaur Kailash Range (6,050 m) and Sangla Valley.",
    "After the pass, the trail descends into the green Ronti Gad valley — completely different from the Himachal side, with pine forest and meadows — before reaching Sangla Valley. Rupin Pass was originally an old shepherd route, used to move sheep between Himachal and Uttarakhand, and takes its name from the Rupin River that originates at the pass."
  ];

  TREKS[rupinPassIndex].highlights = [
    "3-Stage Rupin Waterfall",
    "Rupin River Gorge",
    "Hanging Villages of Jiskun & Jhaka",
    "Dhanderas Thatch Meadow",
    "Marigold Meadows",
    "Kinnaur Kailash View",
    "3-Step Snow Climb to the Pass",
    "Ronti Gad Valley"
  ];

  TREKS[rupinPassIndex].usps = [
    {
      title: "A landscape that changes every single day",
      description: "Hanging villages, dense forest, a river gorge, a huge meadow, a waterfall camp, a snow gully and glacier, and finally pine forest in Sangla Valley — no other trek in India changes this much in seven days."
    },
    {
      title: "The hanging villages of Jiskun & Jhaka",
      description: "The first two days are spent in Jiskun and Jhaka, the highest hanging villages of Himachal — wood-and-stone houses on a cliff edge, potato farms and a way of life with no phone network."
    },
    {
      title: "Dhanderas Thatch — the meadow of marigolds",
      description: "A huge alpine meadow at 11,700 ft used as a 2-night acclimatisation stop, turning yellow with marigold flowers in June and September — one of the best campsites on any Himalayan trek."
    },
    {
      title: "The 3-stage, 100 m Rupin Waterfall",
      description: "You camp right below the famous 3-stage waterfall at Upper Waterfall Camp — the sound of falling water all night, under open stars."
    },
    {
      title: "The snow climb through Rupin Gully",
      description: "The final climb to the pass is a roughly 75-degree snow gully, climbed with rope, ice axe and microspikes — technical, thrilling, and the reason this trek is graded Difficult."
    }
  ];

  TREKS[rupinPassIndex].destinationHighlights = [
    { name: "Bawta / Jiskun", blurb: "The trailhead village at 7,700 ft on the Himachal side, and the first of the trek's hanging villages." },
    { name: "Jakha (Jhaka)", blurb: "The highest hanging village on the trail, reached by a steep climb from Jiskun." },
    { name: "Dhanderas Thatch", blurb: "A huge alpine meadow at roughly 11,700 ft, used as the trek's acclimatisation campsite, and known for its marigold flowers." },
    { name: "Upper Waterfall Camp", blurb: "Campsite at around 13,200 ft, pitched right below the 3-stage, 100 m Rupin Waterfall." },
    { name: "Rupin Pass", blurb: "The high point of the trek at 15,350 ft (4,680 m), crossed via a steep, roped snow gully." },
    { name: "Ronti Gad", blurb: "The green valley on the Uttarakhand side of the pass, with meadows and pine forest, very different from the Himachal side." },
    { name: "Sangla Valley", blurb: "The trek's endpoint at around 8,800 ft, inside Kinnaur, before the drive back to Shimla." }
  ];

  TREKS[rupinPassIndex].differentiators = [
    "Region: Govind Wildlife Sanctuary, on the Himachal Pradesh–Uttarakhand border, ending in Sangla Valley (Kinnaur)",
    "Trek type: high-altitude crossover trek — Dhaula (Uttarakhand) to Sangla (Himachal), run as a Shimla-to-Shimla circuit",
    "Terrain: hanging villages, river gorge, alpine meadow, waterfall camp, steep snow gully and glacier walk",
    "Best experience: villages, forests, meadows, waterfalls, rivers, a snow climb and a big pass crossing — all in one trek"
  ];

  TREKS[rupinPassIndex].idealFor =
    "Experienced trekkers, adventure lovers, crossover-trek lovers, snow-climb lovers and photography groups aged 14–60 who have completed 1–2 Moderate treks before — comfortable with high altitude, a roped snow-gully climb and a glacier walk.";

  TREKS[rupinPassIndex].importantNote =
    "Rupin Pass is a Difficult-grade trek that climbs to 15,350 ft over a steep, roped snow gully — it is not for first-time trekkers, and you must have completed at least one Moderate or Moderate-Difficult trek in the last 2 years. The trek does not run in winter (heavy snow, high risk) or during July–August (monsoon rain, landslides in Himachal and risky river crossings). Trekkers aged 14–17 must be accompanied by a parent/guardian, and anyone above 55 must carry a medical fitness certificate.";

  TREKS[rupinPassIndex].howToReach = {
    intro: "The Rupin Pass Trek starts and ends in Shimla, with the trek on foot beginning at Bawta/Jiskun, on the Himachal Pradesh side of the Himachal–Uttarakhand border.",
    air: {
      summaryLabel: "Nearest Airport",
      summary: "Jubbarhatti Airport, Shimla (SLV) — 25 km",
      detail: "Direct flights from Delhi (about 1 hour) exist but are limited and costly. Chandigarh Airport (IXC), 115 km / about 4 hours from Shimla, has daily flights from Delhi, Mumbai and Bangalore — from there take an HRTC Volvo or taxi to Shimla (4–5 hours, Rs. 400–600)."
    },
    train: {
      summaryLabel: "Nearest Railway Station",
      summary: "Shimla Railway Station (Kalka–Shimla Toy Train)",
      detail: "The scenic Kalka–Shimla Toy Train takes 5–6 hours and should be booked about a month in advance. Otherwise take a train to Kalka (90 km from Shimla) or Chandigarh (115 km) — from Delhi, a Shatabdi/Himalayan Queen to Kalka (4 hours), then an HRTC bus every 30 minutes to Shimla (about 3 hours, Rs. 200–300)."
    },
    road: {
      summaryLabel: "Route",
      summary: "Delhi to Shimla (350 km) via NH44, then Shimla to Bawta/Jiskun via Rohru and Dhaula",
      detail: "Delhi to Shimla is 350 km / 8–10 hours. HRTC Volvo/Himsuta or private Volvo buses run every 30 minutes overnight from Delhi ISBT Kashmiri Gate/Majnu Ka Tila (Rs. 700–1,400), reaching Shimla by 5–6 AM — timed for the Day 1 pickup. Transport from Shimla to Bawta/Jiskun (about 200 km / 8–10 hours) is included in the package; on return, Sangla to Shimla (about 220 km / 9–10 hours) is also included.",
      route: ["Delhi", "Panipat", "Chandigarh", "Solan", "Shimla", "Rohru", "Chirgaon", "Dhaula", "Bawta / Jiskun"],
      facts: [
        { label: "Delhi to Shimla", value: "350 km / 8–10 hours" },
        { label: "Shimla to Bawta/Jiskun", value: "~200 km / 8–10 hours (included)" },
        { label: "Sangla to Shimla", value: "~220 km / 9–10 hours (included)" }
      ]
    },
    pickup: {
      point: "Shimla Old Bus Stand / Mall Road",
      time: "6:00 AM on Day 1",
      dropPoint: "Shimla",
      dropTime: "11:00 PM – 1:00 AM on Day 7 (night)",
      note: "Reach Shimla a day before (Day 0) and stay overnight for better acclimatisation — recommended. If travelling on to Delhi, book a Day 8 morning bus/train rather than the same night. Last ATM and mobile network is at Rohru, about 80 km before Bawta — after that there is no network for 5 days (Jio works only in Shimla & Sangla; BSNL works at Jakha & Dhanderas). Carry cash, as villages do not accept UPI."
    }
  };

  TREKS[rupinPassIndex].similarTreks = [
    "har-ki-dun-trek",
    "kuari-pass-trek",
    "brahmatal-trek",
    "phulara-ridge-trek",
    "hampta-pass-trek"
  ];

  TREKS[rupinPassIndex].itinerary = [
    {
      day: 1,
      title: "Shimla to Bawta / Jiskun",
      driveDistance: "200 km",
      drivingTime: "8-9 Hours",
      pickupPoint: "Shimla Old Bus Stand",
      pickupTime: "6:00 AM",
      altitudePoints: [
        { location: "Shimla", m: 2206, ft: 7238 },
        { location: "Bawta / Jiskun", m: 2347, ft: 7700 }
      ],
      altitudeGain: { m: 141, ft: 462 },
      description: "An early morning drive from Shimla to the hanging village of Bawta/Jiskun, via Rohru and Dhaula.",
      detailedParagraphs: [
        "Drive around 200 km / 8–9 hours from Shimla Old Bus Stand towards Bawta/Jiskun, via Rohru and Dhaula.",
        "Rohru is the last point with a mobile network and an ATM — withdraw cash here, as the villages ahead do not accept UPI.",
        "On arrival, check into a homestay/guest house at Bawta-Jiskun, the hanging village that marks the start of the trek.",
        "Overnight stay in a homestay/guest house, with dinner included."
      ],
      highlights: ["Scenic Drive via Rohru", "Last ATM & Network at Rohru", "Bawta/Jiskun Hanging Village"],
      meals: "Dinner",
      stayType: "Homestay / Guest House"
    },
    {
      day: 2,
      title: "Bawta / Jiskun to Jakha (Jhaka)",
      trekDistance: "5-6 km",
      trekDuration: "4-5 Hours",
      altitudePoints: [
        { location: "Bawta / Jiskun", m: 2347, ft: 7700 },
        { location: "Jakha (Jhaka)", m: 2652, ft: 8700 }
      ],
      altitudeGain: { m: 305, ft: 1000 },
      description: "A steep climb from Jiskun, descending to a wooden bridge before a zig-zag climb to Jakha, the highest hanging village on the trail.",
      detailedParagraphs: [
        "The trail descends from Jiskun to a wooden bridge, then climbs in a zig-zag up to Jakha (Jhaka) — the highest hanging village on this trail.",
        "Tea and Maggi stalls line the way, and Selwan Khad is the last reliable water point before camp.",
        "Reach Jakha by afternoon for a hot lunch at camp, with time to look around the village.",
        "Overnight stay in a homestay / tents at Jakha."
      ],
      highlights: ["Steep Zig-Zag Climb", "Selwan Khad", "Jakha — Highest Hanging Village"],
      meals: "Breakfast, Lunch & Dinner",
      stayType: "Homestay / Tents"
    },
    {
      day: 3,
      title: "Jakha to Dhanderas Thatch (Lower Waterfall)",
      trekDistance: "8-11 km",
      trekDuration: "6-8 Hours",
      altitudePoints: [
        { location: "Jakha (Jhaka)", m: 2652, ft: 8700 },
        { location: "Dhanderas Thatch", m: 3560, ft: 11680 }
      ],
      altitudeGain: { m: 908, ft: 2980 },
      description: "A long day via Sewa village and pine forest, following the Rupin River gorge up to the meadow campsite of Dhanderas Thatch.",
      detailedParagraphs: [
        "A long, moderate-to-difficult day via the village of Sewa, through pine forest and along the Rupin River gorge.",
        "Water bottles can be refilled from the river; expect snow bridges in season, along with wildflowers and meadows en route.",
        "A packed lunch is provided on the trail. Reach the meadow campsite of Dhanderas Thatch by evening.",
        "Overnight stay in tents at Dhanderas Thatch."
      ],
      highlights: ["Sewa Village", "Rupin River Gorge", "Pine Forest", "Dhanderas Thatch Meadow"],
      meals: "Breakfast, Lunch & Dinner",
      stayType: "Tents"
    },
    {
      day: 4,
      title: "Acclimatisation / Buffer Day at Dhanderas Thatch",
      altitudePoints: [
        { location: "Dhanderas Thatch", m: 3560, ft: 11680 }
      ],
      altitudeGain: null,
      description: "A rest and acclimatisation day at the meadow campsite, with a short hike to a waterfall viewpoint, and used as a weather buffer if needed.",
      detailedParagraphs: [
        "An important rest and acclimatisation day before the push towards the high pass.",
        "A small hike to a waterfall viewpoint and time to explore the meadow, along with a gear check for the summit days ahead.",
        "This day also serves as a buffer if bad weather has delayed the schedule.",
        "Overnight stay in tents at Dhanderas Thatch."
      ],
      highlights: ["Acclimatisation", "Waterfall Viewpoint", "Gear Check", "Weather Buffer Day"],
      meals: "Breakfast, Lunch & Dinner",
      stayType: "Tents"
    },
    {
      day: 5,
      title: "Dhanderas Thatch to Upper Waterfall",
      trekDistance: "4 km",
      trekDuration: "3-5 Hours",
      altitudePoints: [
        { location: "Dhanderas Thatch", m: 3560, ft: 11680 },
        { location: "Upper Waterfall", m: 4000, ft: 13120 }
      ],
      altitudeGain: { m: 440, ft: 1440 },
      description: "A short, picturesque day of boulder-walking and snow patches, camping just below the famous 3-stage Rupin Waterfall.",
      detailedParagraphs: [
        "A short but picturesque day with a moderate ascent over boulders and snow patches — walk around snow patches rather than stepping directly on them.",
        "Small streams along the way can be used to refill water bottles, with a hot lunch served at the campsite.",
        "Camp is pitched just below the 3-stage, 100 m Rupin Waterfall — you can hear it from your tent through the night.",
        "Overnight stay in tents at Upper Waterfall Camp."
      ],
      highlights: ["Boulder & Snow Walk", "3-Stage Rupin Waterfall", "Waterfall Camp"],
      meals: "Breakfast, Lunch & Dinner",
      stayType: "Tents"
    },
    {
      day: 6,
      title: "Upper Waterfall to Ronti Gad, Crossing Rupin Pass",
      trekDistance: "9-10 km",
      trekDuration: "8-10 Hours",
      altitudePoints: [
        { location: "Upper Waterfall", m: 4000, ft: 13120 },
        { location: "Rupin Pass Top", m: 4680, ft: 15350 },
        { location: "Ronti Gad", m: 4090, ft: 13420 }
      ],
      altitudeGain: { m: 680, ft: 2230 },
      description: "The toughest and most exciting day — a steep, roped 75-degree snow gully to Rupin Pass Top, followed by a long descent into Ronti Gad.",
      detailedParagraphs: [
        "The most exciting and toughest day of the trek. Start around 4:30 AM, carrying hot water, since water sources are limited on this stretch.",
        "A steep, roughly 75-degree ascent through the Rupin Gully leads to Rupin Pass Top (15,350 ft), with a 360-degree view over the Kinnaur Kailash Range and Sangla Valley, followed by a steep descent on the Uttarakhand side.",
        "A packed lunch is provided on the trail. Reach Ronti Gad, in the green valley on the far side of the pass, late in the evening.",
        "Overnight stay in tents at Ronti Gad."
      ],
      highlights: ["Rupin Pass Top (15,350 ft)", "Roped Snow Gully Climb", "Kinnaur Kailash View", "Ronti Gad Valley"],
      meals: "Breakfast, Packed Lunch & Dinner",
      stayType: "Tents"
    },
    {
      day: 7,
      title: "Ronti Gad to Sangla & Back to Shimla",
      trekDistance: "6-12 km",
      trekDuration: "4-6 Hours",
      driveDistance: "220 km",
      drivingTime: "9-10 Hours",
      altitudePoints: [
        { location: "Ronti Gad", m: 4090, ft: 13420 },
        { location: "Sangla", m: 2682, ft: 8800 }
      ],
      altitudeGain: null,
      description: "A moderate descent to Sangla Valley, then the return drive to Shimla — the trip ends here.",
      detailedParagraphs: [
        "A moderate descent from Ronti Gad to Sangla, passing several water points along the way, reaching Sangla by early afternoon.",
        "The return cab leaves Sangla around 3:00 PM for the drive back to Shimla (about 220 km / 9–10 hours), arriving late night.",
        "Plan your Shimla hotel booking accordingly if you are staying over before travelling onward.",
        "Trek ends on arrival in Shimla."
      ],
      highlights: ["Descent to Sangla Valley", "Return Drive to Shimla", "Trek Ends"],
      meals: "Breakfast",
      stayType: ""
    }
  ];

  TREKS[rupinPassIndex].article = {
    title: "Rupin Pass Trek: The Most Dramatic Crossover Trek of India",
    standfirst:
      "Hanging villages, a river gorge, a meadow of marigolds, a 100 m waterfall and a roped snow-gully climb to 15,350 ft — a trek that never shows you the same view twice.",
    readMinutes: 6,
    sections: [
      {
        paragraphs: [
          "Rupin Pass Trek is a high-altitude crossover trek from Himachal Pradesh to Uttarakhand, crossing at 15,350 ft (4,680 m).",
          "It connects Dhaula village in Uttarakhand with Sangla in Himachal Pradesh — but we run it as a Shimla-to-Shimla circuit, starting from Bawta/Jiskun and ending at Sangla, then driving back to Shimla.",
          "Trekkers call this \"A Trek of Many Landscapes\" — you will never see the same view for two days running."
        ]
      },
      {
        heading: "The Hanging Villages — Jiskun & Jhaka",
        paragraphs: [
          "The first day takes you into the famous hanging village of Jiskun (7,700 ft) and on to Jhaka — the highest village on this trail.",
          "Houses here are built of wood and stone, hanging on the edge of a cliff. This is the last village of Himachal Pradesh, and very few trekkers know about it."
        ]
      },
      {
        heading: "The Rupin River & the 3-Stage Waterfall",
        paragraphs: [
          "From Sewa to Dhanderas Thatch, the trail follows the Rupin River, which carves a deep gorge through the valley.",
          "The 3-stage Rupin Waterfall (Upper Waterfall) is 100 metres high, and the trek camps right below it at Upper Waterfall Camp (13,200 ft) — at night, you can hear the waterfall from your tent."
        ]
      },
      {
        heading: "Dhanderas Thatch — the Meadow of Marigolds",
        paragraphs: [
          "This is the most beautiful campsite on the trek — a huge alpine meadow at 11,700 ft.",
          "In June and September it turns yellow with marigold flowers, with views out to the Dhauladhar Range."
        ]
      },
      {
        heading: "The Snow Climb & the Rupin Pass Gully",
        paragraphs: [
          "Day 6 is summit day. From Upper Waterfall to Rupin Pass Top is a steep, 3-step snow climb, including a roughly 75-degree snow gully climbed with the help of rope — this is why the trek is graded Difficult.",
          "On top, at 15,350 ft, the reward is a 360-degree view of the Kinnaur Kailash Range (6,050 m) and Sangla Valley."
        ]
      },
      {
        heading: "Ronti Gad & Sangla Valley",
        paragraphs: [
          "After the pass, the trail descends into the beautiful Ronti Gad valley — completely different from the Himachal side, with green meadows, pine forest and views into Sangla Valley."
        ]
      },
      {
        heading: "A Complete Himalayan Experience",
        paragraphs: [
          "Rupin Pass was originally an old shepherd route, used by shepherds from Himachal and Uttarakhand to move their sheep across the border — the name Rupin comes from the Rupin River, which originates at the pass.",
          "This trek is for those who want the complete Himalayan experience — villages, forests, meadows, waterfalls, rivers, a snow climb and a big pass crossing, all in one trek."
        ]
      }
    ],
    signoff: "Rupin Pass Trek with Trip My Soul."
  };

  TREKS[rupinPassIndex].faqs = [
    {
      title: "What is the height of Rupin Pass?",
      description: "Rupin Pass Top is 15,350 ft (4,680 m). The highest campsites are Upper Waterfall at 13,120–13,200 ft and Ronti Gad at 13,420 ft."
    },
    {
      title: "Is Rupin Pass trek difficult?",
      description: "Yes, it is a Difficult-grade trek — not for beginners. Expect 8–12 km of walking daily, a 8–10 hour summit day, and a steep, roughly 75-degree snow climb using rope. You must have completed at least one Moderate trek before."
    },
    {
      title: "What is the distance of the Rupin Pass trek?",
      description: "The total trekking distance is around 41 km, plus roughly 460 km of driving (Shimla-Bawta/Jiskun and Sangla-Shimla combined). The trip runs over 7 days."
    },
    {
      title: "Is Rupin Pass safe?",
      description: "Yes, with our certified trek leader, guide, proper acclimatisation at Dhanderas Thatch, technical gear (microspikes, ice axe, rope) and all permits — but you must follow the guide's instructions at all times."
    },
    {
      title: "What is the best time to do Rupin Pass?",
      description: "May–June for snow and the waterfall in full flow, and September–October for clear views and golden meadows (most recommended). We do not operate in July–August due to rain and landslides, or in winter."
    },
    {
      title: "What is the pickup point?",
      description: "Shimla Old Bus Stand at 6:00 AM on Day 1. We provide transport from Shimla to Bawta/Jiskun and Sangla back to Shimla. Drop is on Day 7 between 11:00 PM and 1:00 AM in Shimla."
    },
    {
      title: "What type of stay do we get?",
      description: "Day 1–2: homestay/guest house in Bawta/Jiskun and Jakha villages (triple sharing). Day 3–6: trekking tents (triple sharing) with sleeping bags and mats. Toilet tents are provided."
    },
    {
      title: "What about food?",
      description: "All vegetarian meals from Day 1 dinner to Day 7 breakfast — homestay food on Days 1–2, and camp food cooked by our crew on Days 3–6, including breakfast, lunch (packed or hot), dinner and evening tea/snacks."
    },
    {
      title: "Is there mobile network on Rupin Pass?",
      description: "Only up to Rohru. After that, there is no network for 5 days — BSNL works a little at Jakha and Dhanderas, while Jio/Airtel only work in Shimla and Sangla. Inform your family before you leave."
    },
    {
      title: "Is there electricity and washroom?",
      description: "No electricity on the trek — carry a power bank (10,000–20,000 mAh). Homestays have Indian-style toilets; on the trek, toilet tents with dry-pit toilets are provided."
    },
    {
      title: "What is the temperature on Rupin Pass?",
      description: "Day: 10°C to 18°C. Night: -2°C to -8°C at the upper camps, and -5°C to -10°C with wind at the pass top. It is very cold on summit day."
    },
    {
      title: "What should I pack for Rupin Pass?",
      description: "High-ankle waterproof trekking shoes, a down jacket rated to -10°C, 3 quick-dry tracks and T-shirts, thermals, a woollen cap, waterproof gloves, sunglasses, a head torch, a 50–60L backpack, a power bank, a water bottle and personal medicines. A full kit list is sent after booking."
    },
    {
      title: "Can I do Rupin Pass alone?",
      description: "Solo trekking is not permitted, as the trek is inside Govind Wildlife Sanctuary and requires permits, a guide and technical gear. Solo trekkers are welcome to join our fixed group departures."
    },
    {
      title: "What about backpack offloading?",
      description: "You carry your own backpack (6–7 kg). If you want to offload it, mule/porter support is available for Rs. 1,500/- for the full trek — inform us at least 2 days in advance."
    },
    {
      title: "What if I get altitude sickness?",
      description: "We build in a full acclimatisation day at Dhanderas Thatch (11,680 ft), and carry an oxygen cylinder, oximeter and first-aid kit. The trek leader monitors everyone closely, and we descend immediately to Jakha/Sewa in case of severe AMS."
    },
    {
      title: "Is water available on the trail?",
      description: "Yes, from natural streams for most of the trek. On Day 5 and Day 6 (Upper Waterfall to the pass), water sources are limited, so carry a 2–3L bottle — hot water is provided at the camps."
    }
  ];

  TREKS[rupinPassIndex].packingList = [
    {
      category: "Clothing & Layers",
      items: [
        "Down jacket rated to -10°C",
        "Thermal innerwear (top & bottom)",
        "3 quick-dry trek pants & 3 T-shirts",
        "Woollen cap, sun cap & waterproof gloves",
        "Woollen socks (3-4 pairs)"
      ]
    },
    {
      category: "Footwear & Snow Gear",
      items: [
        "High-ankle, waterproof trekking shoes",
        "Trekking pole",
        "50-60L backpack with rain cover",
        "Headlamp / head torch with spare batteries",
        "Knee cap, if prone to knee pain"
      ]
    },
    {
      category: "Sun, Health & Essentials",
      items: [
        "Sunglasses with UV protection",
        "Sunscreen & lip balm",
        "Personal medicines, and an inhaler if mildly asthmatic",
        "Power bank (10,000-20,000 mAh)",
        "Personal water bottle (2-3L capacity)",
        "Cash — villages do not accept UPI"
      ]
    },
    {
      category: "Documents",
      items: [
        "Govt ID proof (Aadhar Card mandatory)",
        "Medical fitness certificate (for age 50+)",
        "Signed indemnity form"
      ]
    }
  ];

  TREKS[rupinPassIndex].thingsToRemember = [
    "Reach Shimla one day before (Day 0) and stay in a hotel for better acclimatisation.",
    "Last ATM is at Rohru, about 80 km before Bawta — withdraw cash in Shimla or Rohru, as villages ahead do not accept UPI.",
    "Last mobile network is at Rohru/Chirgaon — after that there is no network for 5 days. Jio works only in Shimla and Sangla; BSNL works at Jakha and Dhanderas.",
    "If heading back to Delhi the same night, do not book a same-day bus or train from Shimla — book for the next morning (Day 8) and stay in Shimla on Day 7 night."
  ];
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

// Static details for the Panwali Kantha Trek (uid: panwali-kantha-trek).
// Full content sourced from the ops-supplied write-up (overview, itinerary,
// inclusion/exclusion, article, FAQs, eligibility and how-to-reach).
const panwaliKanthaIndex = TREKS.findIndex(t => t.slug === 'panwali-kantha-trek');
if (panwaliKanthaIndex !== -1) {
  TREKS[panwaliKanthaIndex].minAge = 10;
  TREKS[panwaliKanthaIndex].maxAge = 60;
  TREKS[panwaliKanthaIndex].minAgeWithGuardian = 10;

  TREKS[panwaliKanthaIndex].intro =
    "Panwali Kantha is a virgin, less-crowded Himalayan meadow (bugyal) in Rudraprayag district, Uttarakhand, at roughly 11,500 ft. Trekkers who know Dayara Bugyal or Auli Bugyal call Panwali their raw, bigger sibling — but around 90% of trekkers haven't heard of it, which is exactly why it stays clean, peaceful and non-commercial. It lies between Trijuginarayan (the temple where Shiva and Parvati are said to have married) and Ghuttu Village, and its meadow runs an almost continuous 7-8 km, making it one of the longest high-altitude meadows in Garhwal.";

  TREKS[panwaliKanthaIndex].aboutParagraphs = [
    "Panwali Kantha is not a hill station — there are no hotels and no Mall Road. It is a 7-8 km long high-altitude meadow hidden between the Kedarnath and Gangotri valleys in Rudraprayag district, at 3,350 m / 11,000-11,500 ft. Local people call it \"Dev Bhoomi Ka Dil\" — the heart of God's land.",
    "In ancient times Panwali was the walking route for the Pandavas, and later for pilgrims travelling from Gangotri to Kedarnath. It connects Trijuginarayan Temple — where Shiva and Parvati married, and where the eternal fire still burns — to Kedarnath, so the story goes that the gods themselves walked this meadow. Shepherds from Ghuttu and Reeh villages have also brought their sheep here every summer for centuries, treating Panwali as a second home; their old stone huts still stand in the meadow.",
    "You cannot reach Panwali Kantha by road. The only way in is a 16 km trek one way from Ghuttu or Trijuginarayan, through dense oak and rhododendron forest before the trees give way to open meadow. That's precisely why there is no crowd, no shops and no hotels here — only the meadow, the tents and the Himalayas.",
    "From the top, Panwali gives a near-continuous, 180-degree wall of snow peaks — Kedarnath Dome, Chaukhamba, Neelkanth, Thalay Sagar, the Gangotri group, Meru and Sumeru among them — and a sunrise that turns the whole range gold and then pink. At night, with no village for 16 km and no network or electricity, the sky opens into a clear view of the Milky Way and thousands of stars."
  ];

  TREKS[panwaliKanthaIndex].highlights = [
    "A rare 7-8 km continuous meadow — one of the longest bugyals in Garhwal",
    "180° Himalayan wall — Kedarnath Dome, Chaukhamba, Neelkanth, Thalay Sagar, Gangotri Group, Meru, Sumeru",
    "Connects two dhams — Trijuginarayan Temple (Shiva-Parvati's marriage site) and Kedarnath",
    "No network, no electricity — some of the clearest night skies and Milky Way views in Uttarakhand",
    "Centuries-old shepherd trail with stone huts still standing in the meadow",
    "Brahma Kamal and other Himalayan flowers in the July-August bloom"
  ];

  TREKS[panwaliKanthaIndex].usps = [
    {
      title: "Not a tourist spot — a trek",
      description: "There is no road access; you trek 16 km one way from Ghuttu or Trijuginarayan. That single fact keeps out the crowds, the shops and the hotels."
    },
    {
      title: "A 360° Himalayan wall",
      description: "From the top you see Gangotri Group, Kedarnath Dome, Meru, Sumeru, Thalay Sagar, Chaukhamba and Neelkanth — almost the entire Garhwal range in one frame, best at sunrise."
    },
    {
      title: "A trek between two dhams",
      description: "The trail connects Kedarnath Dham on one side and Trijuginarayan Temple — where Shiva and Parvati married — on the other. Locals say the Pandavas passed through here."
    },
    {
      title: "A wild bugyal experience",
      description: "No tent-hotels like some other bugyals — just tents, thousands of visible stars, horses and sheep grazing by day, and occasional Himalayan bear footprints."
    },
    {
      title: "Best for photographers and peace seekers",
      description: "Green in May-June, flowering in July-August, golden-brown in September-October — with no network and no noise throughout."
    }
  ];

  TREKS[panwaliKanthaIndex].destinationHighlights = [
    { name: "Ghuttu Village", blurb: "The trek's base camp on the Tehri side — a small, hidden village with the ancient Bhootnath Temple and the Bhilangana River running through it." },
    { name: "Trijuginarayan Temple", blurb: "The temple on the Kedarnath side where Shiva and Parvati are said to have married; the trek's other possible starting point, 12 km from Sonprayag." },
    { name: "Pobhagi Bugyal", blurb: "A smaller advance-base meadow en route to Panwali, with old shepherd stone huts and a sunset view of Thalay Sagar." },
    { name: "Panwali Kantha Top", blurb: "The main meadow at 11,500 ft — a 7-8 km green carpet with a 180° Himalayan wall in front of it." },
    { name: "Raj Kharak", blurb: "A second, equally scenic campsite on the far side of the Panwali ridge, facing the Kedarnath valley, where shepherds graze large flocks of sheep." },
    { name: "Gaurmanda Bugyal", blurb: "A smaller meadow near the forest line at 8,965 ft, close to a water source, on the descent back towards Ghuttu." }
  ];

  TREKS[panwaliKanthaIndex].differentiators = [
    "Region: Rudraprayag district, Uttarakhand, between Trijuginarayan and Ghuttu, at 3,350 m (11,000-11,500 ft)",
    "Meadow length: 7-8 km continuous — three times the length of bugyals like Dayara or Auli",
    "Access: no road; 16 km trek one way, through dense oak-rhododendron forest for the first 10 km",
    "Best season: 15 May-25 June (green + snow peaks) and 15 September-15 October (clear sky + golden meadow); July-August is monsoon, with flowers but also landslide and leech risk",
    "No stay, no shops: camping only, everything carried in — no hotel, no Maggi point"
  ];

  TREKS[panwaliKanthaIndex].idealFor =
    "Trekkers who want something raw and non-crowded — a long, untouched bugyal with a 180° Himalayan wall, camping under a clear night sky, and no phone network. Not for people looking for hotel stay and easy sightseeing; this is pure camping and trekking.";

  TREKS[panwaliKanthaIndex].importantNote =
    "There is no hotel, shop or network anywhere on this trek — only camping tents, and Jio works only slightly in Ghuttu village. A local guide is compulsory; the forest check post at the start will not allow entry without one. Not recommended for families with children below 10 or seniors above 60, since the daily walk runs 5-8 hours over 32-33 km in total, and no pony/mule is available for the last 6 km beyond Pobhagi.";

  TREKS[panwaliKanthaIndex].sourceCaveat =
    "The source write-up gives Panwali Kantha's altitude as both \"3,350 m (11,000-11,500 ft)\" and \"11,500 ft\" elsewhere — both figures are kept as published (11,500 ft actually converts to about 3,505 m). It similarly gives the round-trip trek distance as both 32 km and 33 km in different places; both are kept as published. No fixed package price is published — the source lists it as available \"in customise\" for groups of 4 or more — so none is shown here; contact the trips desk for current rates. If starting from Trijuginarayan instead of Ghuttu, the source notes the itinerary runs in reverse.";

  TREKS[panwaliKanthaIndex].eligibilityCriteria = [
    { icon: "User", text: "Age: minimum 10 years (physically active, trekking with parents); ideal 14-55 years; maximum 60 years, subject to fitness" },
    { icon: "IdCard", text: "Valid government ID (Aadhaar / Passport) compulsory for the forest permit; foreign nationals need a passport and visa copy" },
    { icon: "Users", text: "Not a solo trek — the forest department requires a certified local guide, minimum group size 2, maximum 12 per guide" },
    { icon: "ShieldAlert", text: "Not allowed without a doctor's certificate for heart conditions, severe asthma, epilepsy, a recent major operation, severe knee/disc issues, or pregnancy" },
    { icon: "HeartPulse", text: "Mild asthma or controlled high BP allowed with precautions — carry your inhaler or medicine plus a doctor's note" },
    { icon: "Footprints", text: "Trek shoes compulsory — sports shoes are not allowed, as they slip on the meadow" }
  ];

  TREKS[panwaliKanthaIndex].fitnessCriteria = [
    { icon: "Footprints", text: "Able to walk 6-7 hours continuously with small breaks, over 9-10 km of uphill and downhill trail a day" },
    { icon: "TrendingUp", text: "Able to climb roughly 1,000 ft in 2-3 hours without severe breathlessness" },
    { icon: "Backpack", text: "Able to carry a small personal backpack of 4-5 kg; porter/mule offloading is available for the rest, but only up to Pobhagi" },
    { icon: "Activity", text: "Quick self-test: a 5 km walk with a slight uphill, on 2-3 consecutive days, without needing to sit every 10 minutes" }
  ];

  TREKS[panwaliKanthaIndex].howToReach = {
    intro: "Panwali Kantha starts and ends at Dehradun; the trek itself begins from Ghuttu Village (or Trijuginarayan on the Kedarnath side).",
    air: {
      summaryLabel: "Nearest Airport",
      summary: "Jolly Grant Airport, Dehradun (DED)",
      detail: "About 25 km from Dehradun city, with daily direct flights from Delhi (50 min), Mumbai, Bengaluru, Kolkata, Hyderabad, Lucknow and Ahmedabad. From the airport, a taxi to Dehradun city takes about 45 minutes."
    },
    train: {
      summaryLabel: "Nearest Railway Station",
      summary: "Dehradun Railway Station (DDN)",
      detail: "The main station in the city centre, connected by trains such as the Doon Express, Upasana Express and Amritsar-Dehradun Express from other major cities."
    },
    road: {
      summaryLabel: "Route",
      summary: "Dehradun to Ghuttu Village via Mussoorie, Chamba, New Tehri and Ghansali",
      route: ["Dehradun", "Mussoorie", "Chamba", "New Tehri", "Ghansali", "Ghuttu"],
      facts: [
        { label: "Delhi - Dehradun", value: "250 km / 5-6 hrs" },
        { label: "Dehradun - Ghuttu Village", value: "180 km / 7-8 hrs" },
        { label: "Chandigarh - Dehradun", value: "170 km / 4-5 hrs" },
        { label: "Haridwar / Rishikesh - Dehradun", value: "55 km / 1.5 hrs" }
      ],
      options: [
        { from: "Delhi ISBT Kashmere Gate", name: "Govt. Uttarakhand Roadways AC / Volvo / ordinary buses, and private Volvo / Mercedes services", note: "Every 30 minutes, 6-7 hours; overnight private Volvos are the most popular" }
      ]
    },
    pickup: {
      point: "Dehradun Railway Station / ISBT / Airport",
      time: "6:00 AM on Day 1",
      dropPoint: "Dehradun Railway Station / ISBT",
      dropTime: "Evening on Day 5",
      note: "If your flight or train arrives after 5 PM the day before, plan to stay a night in Dehradun, since pickup is at 6:00 AM sharp."
    }
  };

  TREKS[panwaliKanthaIndex].inclusions = [
    { title: "Transportation", description: "Pickup and drop from Dehradun to Dehradun by shared/private cab (Bolero/Sumo/Tempo Traveller), including the 360 km round trip to Ghuttu Village, driver allowance, fuel, toll and parking." },
    { title: "Accommodation", description: "1 night homestay at Ghuttu Village (triple/quad sharing, basic clean rooms) and 3 nights camping in dome tents (triple/quad sharing) with sleeping bags, mattresses and pillows." },
    { title: "Meals", description: "All-veg meals from Day 1 dinner to Day 5 breakfast — homestay dinner on Day 1; breakfast, packed/hot lunch, evening tea-snacks and dinner on Days 2-4; breakfast on Day 5." },
    { title: "Trek Support", description: "Certified local trek guide (compulsory, 1 per 8-10 persons), cook and helper, plus kitchen tent, dining tent and toilet tent." },
    { title: "Permits & Camping", description: "Forest permits and entry fees for Panwali Kantha (Kedarnath Wildlife Sanctuary buffer) and all camping charges." },
    { title: "Safety", description: "Basic first-aid kit and an oxygen cylinder at the campsite; support staff carry the camping gear and ration." }
  ];

  TREKS[panwaliKanthaIndex].exclusions = [
    { title: "Personal trek gear", description: "Trek shoes, trek pole, poncho/raincoat, backpack, warm jackets, gloves, cap and head torch — available on rent if requested in advance." },
    { title: "Porter / mule offloading", description: "A personal porter or mule to carry your own backpack (8-10 kg), charged per bag; most trekkers carry a small 5-6 kg daypack themselves." },
    { title: "Water & extra food", description: "Mineral water bottles (carry your own; boiled water is provided at camp) and any food or snacks bought on the way." },
    { title: "Personal expenses", description: "Tips to guide, driver and cook; phone charging, extra hot water and any shopping." },
    { title: "Insurance & medical costs", description: "Travel and medical insurance, personal medicines, and the cost of rescue, helicopter or hospitalisation if required." },
    { title: "GST", description: "5% GST extra if a bill is needed." },
    { title: "Anything not listed", description: "Anything not specifically mentioned under inclusions." }
  ];

  TREKS[panwaliKanthaIndex].itinerary = [
    {
      day: 1,
      title: "Dehradun to Ghuttu Village",
      driveDistance: "180 km",
      drivingTime: "7-8 Hours",
      pickupPoint: "Dehradun Railway Station / ISBT / Airport",
      pickupTime: "6:00 AM",
      altitudePoints: [
        { location: "Dehradun", m: 435, ft: 1427 },
        { location: "Ghuttu Village", m: 1554, ft: 5100 }
      ],
      altitudeGain: { m: 1119, ft: 3673 },
      description: "A scenic drive via Mussoorie, Chamba, New Tehri and Ghansali to the last-village base camp, with an evening walk and a guide briefing for the trek ahead.",
      detailedParagraphs: [
        "Pickup from Dehradun Railway Station / ISBT / Airport. The drive runs via Mussoorie, Chamba, New Tehri and Ghansali to Ghuttu — crossing Tehri Lake, pine forest and small Garhwali villages along the way, with breakfast or lunch taken en route.",
        "Ghuttu is a small, hidden village — the last one before the trek — with no crowd at all. Check in to the homestay (basic but clean, wooden rooms with home-cooked food).",
        "In the evening, take a short walk around the village, visit the ancient Bhootnath Temple, meet the locals and see the Bhilangana River. The guide briefs the group on the route ahead and what to pack for the next day.",
        "Dinner and overnight stay at the Ghuttu homestay. Only Jio works, and that only slightly."
      ],
      highlights: ["Scenic Drive via Tehri Lake", "Bhootnath Temple, Ghuttu", "Bhilangana River"],
      meals: "Dinner",
      stayType: "Homestay — Ghuttu Village"
    },
    {
      day: 2,
      title: "Ghuttu Village to Pobhagi Bugyal",
      trekDistance: "9 km",
      trekDuration: "5-6 Hours",
      altitudePoints: [
        { location: "Ghuttu Village", m: 1554, ft: 5100 },
        { location: "Pobhagi Bugyal", m: 2896, ft: 9500 }
      ],
      altitudeGain: { m: 1342, ft: 4400 },
      description: "The trek begins with a forest permit check, then climbs steadily along the Bhilangana river through oak and rhododendron forest to the first meadow campsite.",
      detailedParagraphs: [
        "After hot tea and breakfast at the homestay, the trek starts with a forest department check post entry and permit check.",
        "The trail runs Ghuttu to Reeh Village (30 minutes), then into dense oak and rhododendron forest with a slow, steady climb. The first 3 km follow the Bhilangana river before the climb continues.",
        "A packed lunch or maggi is taken at a small shepherd tapri along the way, where open. The final kilometre is steep, then the meadow suddenly opens — Pobhagi.",
        "Tents are already pitched at Pobhagi / Panwali Advance Base, a small bugyal with old shepherd stone huts. After hot tea and lunch, an evening acclimatisation walk gives a sunset view of Thalay Sagar peak. Dinner in the dining tent, overnight in dome tents at 2-5°C, under a very clear, star-filled sky."
      ],
      highlights: ["Bhilangana River Trail", "Oak & Rhododendron Forest", "Sunset View of Thalay Sagar"],
      meals: "Breakfast, Lunch, Dinner",
      stayType: "Camping — Pobhagi Bugyal"
    },
    {
      day: 3,
      title: "Pobhagi to Panwali Kantha Top to Raj Kharak",
      trekDistance: "11 km",
      trekDuration: "7-8 Hours",
      altitudePoints: [
        { location: "Pobhagi Bugyal", m: 2896, ft: 9500 },
        { location: "Panwali Kantha Top", m: 3505, ft: 11500 },
        { location: "Raj Kharak", m: 3353, ft: 11000 }
      ],
      altitudeGain: { m: 457, ft: 1500 },
      description: "The main day of the trek — sunrise at Panwali Kantha's 11,500 ft top, a ridge walk across the full meadow, and a descent to the equally scenic Raj Kharak campsite.",
      detailedParagraphs: [
        "A steep 3 km climb through alpine meadow, with a packed breakfast, leads to Panwali Kantha Top (11,500 ft) in time for sunrise — the highlight of the trip.",
        "From the top, a 180° Himalayan wall unfolds: Kedarnath Dome, Chaukhamba, Neelkanth, Thalay Sagar, Gangotri 1, 2, 3, Meru, Sumeru and Bharte Kunta, all turning gold in the morning light, with the 7 km meadow stretching out ahead.",
        "After 1-1.5 hours at the top for photos, breakfast and quiet time, the trail crosses the entire Panwali Kantha meadow — a 4 km ridge walk — before descending to Raj Kharak (11,000 ft), reached by around 2:00-3:00 PM.",
        "Raj Kharak is another beautiful meadow, facing the Kedarnath valley side, where local shepherds graze large flocks of sheep. Evening tea and exploration, then overnight in tents at what is often called the trip's most beautiful campsite."
      ],
      highlights: ["Sunrise at Panwali Kantha Top (11,500 ft)", "180° Garhwal Himalayan Wall", "4 km Ridge Walk Across the Meadow"],
      meals: "Breakfast, Lunch, Dinner",
      stayType: "Camping — Raj Kharak"
    },
    {
      day: 4,
      title: "Raj Kharak to Gaurmanda",
      trekDistance: "8 km",
      trekDuration: "4-5 Hours",
      altitudePoints: [
        { location: "Raj Kharak", m: 3353, ft: 11000 },
        { location: "Gaurmanda Bugyal", m: 2733, ft: 8965 }
      ],
      altitudeGain: { m: -620, ft: -2035 },
      description: "A relaxed, mostly downhill day through forest and small bugyals to a quieter meadow near the treeline, with a Kedarnath-facing sunrise to start.",
      detailedParagraphs: [
        "An easy, unhurried day. Sunrise from Raj Kharak gives a clear view of Kedarnath peak before breakfast and the start of the descent.",
        "The trail runs through high-altitude forest and open meadow patches, mostly downhill, to Gaurmanda Bugyal (8,965 ft) — a smaller meadow near the forest line with a water source nearby.",
        "Check in to tents (or the forest guest house where available). Evening rest and a story session with the guide — the last night under canvas on this trek."
      ],
      highlights: ["Kedarnath Peak Sunrise from Raj Kharak", "Descent Through High-Altitude Forest", "Gaurmanda Bugyal Campsite"],
      meals: "Breakfast, Lunch, Dinner",
      stayType: "Camping — Gaurmanda Bugyal"
    },
    {
      day: 5,
      title: "Gaurmanda to Ghuttu, drive to Dehradun",
      trekDistance: "5 km",
      trekDuration: "2-3 Hours",
      driveDistance: "180 km",
      drivingTime: "7-8 Hours",
      altitudePoints: [
        { location: "Gaurmanda Bugyal", m: 2733, ft: 8965 },
        { location: "Ghuttu Village", m: 1554, ft: 5100 },
        { location: "Dehradun", m: 435, ft: 1427 }
      ],
      altitudeGain: { m: -2298, ft: -7538 },
      description: "An easy downhill walk back to Ghuttu, followed by the drive back to Dehradun for drop-off.",
      detailedParagraphs: [
        "After breakfast, an easy 5 km, roughly 2-hour downhill trek returns the group to Ghuttu Village.",
        "Luggage is collected from the Ghuttu homestay before the drive back to Dehradun, with drop-off at Dehradun Railway Station / ISBT.",
        "If starting from Trijuginarayan instead of Ghuttu, the source notes the itinerary runs in reverse — Trijuginarayan to Panwali to Ghuttu — over the same total distance."
      ],
      highlights: ["Easy Downhill Trek to Ghuttu", "Drive Back via Ghansali & New Tehri"],
      meals: "Breakfast",
      stayType: "Tour ends — no overnight"
    }
  ];

  TREKS[panwaliKanthaIndex].faqs = [
    {
      title: "What is Panwali Kantha?",
      description: "Panwali Kantha is a 7-8 km long high-altitude meadow (bugyal) at 11,500 ft in Rudraprayag district, Uttarakhand, lying between Trijuginarayan Temple and Kedarnath. It is one of the longest and most untouched bugyals in Garhwal — bigger than Dayara or Auli but with almost no crowd."
    },
    {
      title: "Where does the Panwali Kantha trek start?",
      description: "From Ghuttu Village (Tehri side, 180 km from Dehradun, 22 km from Ghansali, less crowded) or Trijuginarayan Temple (Kedarnath side, 12 km from Sonprayag). This package operates from the Ghuttu side."
    },
    {
      title: "How difficult is the Panwali Kantha trek?",
      description: "Moderate. A total of 32-33 km over 3 days of trekking, 5-8 hours a day, with no technical climbing — only mountain trail walking. Beginners with basic fitness can do it, but it is not recommended for kids below 10 or seniors above 60."
    },
    {
      title: "What is the best time to visit Panwali Kantha?",
      description: "15 May-25 June (green meadow, clear snow peaks, 10-20°C by day, 0-5°C at night) and 15 September-15 October (golden meadow, crystal-clear sky). July-August is monsoon, with Brahma Kamal in bloom but a higher risk of rain, landslide and leeches; November-April sees heavy snow and the trail is closed."
    },
    {
      title: "Is there any hotel or stay in Panwali Kantha?",
      description: "No — no hotel, lodge or shops, only camping. Dome tents, sleeping bags (rated to -10°C), mattresses, a kitchen tent and a toilet tent are provided. One night is spent in a Ghuttu Village homestay before the trek starts."
    },
    {
      title: "Is a guide compulsory?",
      description: "Yes. The forest department check post at Ghuttu / Trijuginarayan will not allow entry without a certified local guide. The guide, cook and permits are all included in the package."
    },
    {
      title: "Is there network or electricity on the trek?",
      description: "No network inside Panwali Kantha — only Jio works slightly in Ghuttu village — and no electricity during the trek. Carry a power bank (20,000 mAh) and a torch/headlamp; boiled water is provided at camp."
    },
    {
      title: "What should I pack for the Panwali Kantha trek?",
      description: "Waterproof trek shoes with ankle support, a warm jacket, fleece, thermals, gloves and a woollen cap, a raincoat/poncho and trek pole, a 40-50L backpack plus a small daypack, a 1L water bottle, sunscreen, sunglasses, personal medicines, a power bank and a torch. Trek shoes, jackets and poles are available on rent if requested 3 days in advance."
    },
    {
      title: "Can we see Himalayan peaks from Panwali Kantha?",
      description: "Yes — this is the main highlight. From the top you see Kedarnath Dome, Chaukhamba, Neelkanth, Thalay Sagar, Gangotri 1, 2 and 3, Meru, Sumeru and Bharte Kunta — almost the full Garhwal range, with what's said to be the best sunrise view in Uttarakhand."
    },
    {
      title: "Is Panwali Kantha safe? Is there wildlife?",
      description: "Yes, it's safe. The trek falls inside the Kedarnath Wildlife Sanctuary buffer — you may spot the Himalayan Monal or musk deer footprints. Black bears live in the lower forest but rarely come up to the meadow in summer, and the guide carries a stick and knows the trail well."
    },
    {
      title: "How do we reach the Ghuttu Village base camp?",
      description: "From Dehradun via Mussoorie, Chamba, New Tehri, Ghansali to Ghuttu — 180 km, 7-8 hours. Pickup is from Dehradun at 6:00 AM on Day 1."
    },
    {
      title: "What about food during the trek?",
      description: "Pure vegetarian, home-cooked, high-energy food — paratha, poha or omelette for breakfast; packed or hot rice-dal for lunch; dal, rice, sabzi, roti and soup for dinner, with tea twice a day. The team carries ration, cook and utensils; you can also bring dry fruits or energy bars."
    }
  ];

  TREKS[panwaliKanthaIndex].article = {
    title: "Panwali Kantha: Uttarakhand's Last Secret Meadow",
    standfirst: "Hidden between the temple where Shiva married Parvati and the dham where he lives, a 7-kilometre carpet of grass at 11,500 feet is still waiting to be found.",
    readMinutes: 6,
    sections: [
      {
        paragraphs: [
          "There are meadows you visit. And there is a meadow where you get lost, in a good way. Panwali Kantha is the second one.",
          "It is not on any trending map, and it doesn't come with a thousand reels attached. It sits hidden between two holy places — Trijuginarayan Temple, where Lord Shiva married Parvati, and Kedarnath Dham, where he lives. In between, at 11,500 feet, lies a 7-kilometre-long green carpet that looks like someone rolled out grass all the way to the sky."
        ]
      },
      {
        heading: "A meadow you have to earn",
        paragraphs: [
          "Panwali is three times bigger than most bugyals, and ten times quieter, for one simple reason: you cannot reach it by car. You have to walk 16 kilometres to get there, climbing through oak and rhododendron forest, crossing small streams, passing old shepherd stone huts, and breathing hard the whole way. Then, suddenly, the trees end.",
          "And you are standing on top of the world. In front of you, a 180-degree wall of snow mountains rises — Kedarnath Dome, Chaukhamba (7,138 m), Thalay Sagar, the Gangotri Group, Neelkanth, Meru, Sumeru. At sunrise, the first light turns these peaks gold, then pink, then white, and most people simply forget to take a photo."
        ]
      },
      {
        heading: "A meadow that changes with every season",
        paragraphs: [
          "The meadow itself is never quite the same. In May and June it is lush green, with small white and yellow flowers moving in the wind, horses and sheep grazing freely. In July and August, the monsoon brings out Brahma Kamal — the rare Himalayan flower that blooms only at night. By September and October, the whole meadow turns golden-brown, without a single tourist in sight.",
          "There is no shop here, no Maggi point, no chai stall, no network and no electricity. At night you sleep in a tent, the temperature drops to zero, and the sky opens into a view most trekkers have never had in a city — the Milky Way, so clear it feels close enough to touch, and a silence deep enough to hear your own heartbeat."
        ]
      },
      {
        heading: "A trail older than any road",
        paragraphs: [
          "Panwali Kantha sits on an ancient trail. Shepherds from Ghuttu and Reeh villages have brought their sheep here for centuries, calling it their summer home, and the Pandavas are said to have passed through on their way beyond. Even today, the forest department insists on a local guide — the forest, in a real sense, still belongs to it.",
          "The trek itself isn't difficult. If you can walk 6-7 hours a day, you can do it. The full route runs 32-33 kilometres across five days and four nights — Ghuttu to Pobhagi (9 km), Pobhagi to Panwali Top (3 km) and across the bugyal to Raj Kharak (8 km more), Raj Kharak to Gaurmanda (8 km), and Gaurmanda back to Ghuttu (5 km) — with one night in a Ghuttu homestay and three nights camping in the meadows."
        ]
      },
      {
        heading: "Not a luxury trek",
        paragraphs: [
          "There is no room service here, no menu card. What you get instead is dal-chawal cooked on a wood stove, hot tea in a steel glass, a sleeping bag that actually keeps you warm, and a guide who can name every peak on the skyline without pausing to think."
        ]
      }
    ],
    signoff: "If you are looking for something that isn't crowded, isn't commercial and isn't on every second Instagram post — or if you simply want to sit alone on a mountain for a while — Panwali Kantha is Uttarakhand's best-kept secret. And secrets are best when they're kept a little secret."
  };

  TREKS[panwaliKanthaIndex].similarTreks = [
    "dayara-bugyal-trek",
    "ali-bedni-bugyal-trek",
    "brahmatal-trek",
    "kuari-pass-trek",
    "kedarkantha-trek"
  ];
}

// Static details for the Khaliya Top Trek (uid: khaliya-top-trek). Full
// content sourced from the ops-supplied Khaliya Top write-up (overview,
// itinerary, eligibility, article, FAQs, how-to-reach and package terms).
const khaliyaTopIndex = TREKS.findIndex(t => t.slug === 'khaliya-top-trek');
if (khaliyaTopIndex !== -1) {
  TREKS[khaliyaTopIndex].minAge = 7;
  TREKS[khaliyaTopIndex].maxAge = 65;
  TREKS[khaliyaTopIndex].minAgeWithGuardian = 7;

  TREKS[khaliyaTopIndex].intro =
    "Khaliya Top is one of the most beautiful and easiest Bugyal (alpine meadow) treks of Uttarakhand, sitting above Munsiyari in Pithoragarh district, Kumaon, at a height of 11,500 ft (3,500 m). If Panwali Kantha is Garhwal's secret, Khaliya Top is Kumaon's balcony — from the top you see the entire Panchachuli range so close that you feel you can touch it.";

  TREKS[khaliyaTopIndex].aboutParagraphs = [
    "Khaliya Top is not just a trek — it is a viewpoint, a balcony, a place where the Himalayas come so close that you forget to breathe. It sits at 11,500 feet above Munsiyari town, which is called \"Little Kashmir.\" The name Khaliya comes from Khaliya village, and \"Top\" means the meadow above it — so Khaliya Top means the big meadow above Khaliya village.",
    "Picture a huge, open, sloping meadow, 3-4 km long, covered in soft alpine grass, with no trees on top — only grass, wind and sky. On one side is a deep valley with Munsiyari town 4,000 ft below, looking like a toy model; on the other three sides is a wall of snow mountains led by the mighty Panchachuli — five peaks named after the five Pandavas, standing together above 20,000 ft and covered in snow year-round. People trek 50 km to see this kind of view on other routes; on Khaliya, it comes after just 6 km.",
    "Along with Panchachuli, you also see Rajrambha (6,537 m), Hardeol (7,151 m), Nanda Devi East (7,434 m), Nanda Kot (6,861 m) and Nanda Khat (6,611 m) — which is why photographers call Khaliya Top \"Panchachuli's Studio.\"",
    "For centuries the local Bhotiya tribe used this top as a summer grazing ground for sheep and goats. When Munsiyari became a mountaineering base in the 1970s, trekkers headed to Milam Glacier and the Nanda Devi base camp used to cross Khaliya as an acclimatisation hike; KMVN later built a small hut at the top to promote tourism, and today the Nehru Institute of Mountaineering uses it as a winter ski-practice ground."
  ];

  TREKS[khaliyaTopIndex].highlights = [
    "360° view of the Panchachuli range, so close it feels touchable, at the end of just a 6 km trek",
    "Widely considered one of the best sunrises in India — Panchachuli turning pink, then orange, then gold",
    "Also visible: Rajrambha, Hardeol, Nanda Devi East, Nanda Kot and Nanda Khat",
    "Munsiyari town glowing 4,000 ft below at night — one of Kumaon's easiest big-mountain views",
    "A genuine beginner, family and couple trek — no technical or risky sections",
    "Far less crowded than Auli or Dayara Bugyal, while still raw, clean and silent"
  ];

  TREKS[khaliyaTopIndex].usps = [
    {
      title: "The easiest big Himalayan view trek",
      description: "Only a 6 km trek gets you a view that takes 30+ km on other routes — the entire Panchachuli wall, up close, with almost no technical difficulty."
    },
    {
      title: "Kumaon's answer to Panwali Kantha",
      description: "If Panwali Kantha is Garhwal's secret meadow, Khaliya Top is Kumaon's balcony — a huge sloping alpine meadow facing a 180°+ wall of 6,000-7,400 m peaks."
    },
    {
      title: "A genuinely family-friendly trek",
      description: "Even an 8-year-old can do it comfortably — no steep, exposed or risky sections, and a base town (Munsiyari) with real hotels, cafés and a market."
    },
    {
      title: "Best sunrise in Kumaon",
      description: "At 5:15 AM the first ray hits Panchachuli II, and within 10 minutes all five peaks turn pink, then orange, then gold — photographers travel here just for these 30 minutes."
    },
    {
      title: "Still uncrowded",
      description: "Unlike Auli, Chopta or Dayara Bugyal on a weekend, Khaliya Top on a weekday may have only 10-15 people on the entire meadow — real silence, just wind and your heartbeat."
    }
  ];

  TREKS[khaliyaTopIndex].destinationHighlights = [
    { name: "Munsiyari", blurb: "\"Little Kashmir\" of Uttarakhand and the trek's base town (7,200 ft) — real hotels, cafés and a market, not a remote village, with a sunset view of Panchachuli from town itself." },
    { name: "Balanti Gate / Balanti Farm", blurb: "The trailhead 5 km from Munsiyari where the drive ends and the walk begins, followed 2 km on by Balanti Farm, the first tea-break point where Panchachuli first comes into view." },
    { name: "Khaliya Top", blurb: "The main meadow at 11,500 ft — a 3-4 km alpine bugyal facing the full Panchachuli wall, with a small KMVN rest hut and tented camp." },
    { name: "Zero Point", blurb: "A short 15-minute walk beyond the main meadow, for an even wider angle on Panchachuli, Rajrambha and Hardeol." },
    { name: "Birthi Falls", blurb: "A scenic waterfall en route between Munsiyari and the plains, worth a stop on the Day 1 drive or as a Day 3 detour." },
    { name: "Tribal Heritage Museum & Nanda Devi Temple, Munsiyari", blurb: "Optional afternoon-free stops in Munsiyari town — a small tribal-culture museum and a temple that doubles as a sunset point." }
  ];

  TREKS[khaliyaTopIndex].differentiators = [
    "Region: above Munsiyari, Pithoragarh district, Kumaon, at 11,500 ft (3,500 m)",
    "Trek distance: only 12 km total (6 km up, 6 km down) — one of the shortest Bugyal treks with a major peak view",
    "Base camp: Munsiyari (7,200 ft) — 310 km from Kathgodam, 450 km from Dehradun, with hotels and a market",
    "Best season: March-June (snow + green mix) and September-November (golden meadow, clearest sky); December-February is a heavy-snow trek for experienced trekkers only; avoid July-August (rain, leeches, cloud cover)",
    "Trail: pine forest, then oak and rhododendron forest, opening suddenly into a huge meadow, with a KMVN rest house at the top"
  ];

  TREKS[khaliyaTopIndex].idealFor =
    "Beginners who have never done a Himalayan trek but want a big-mountain view without a five-day walk; couples on a short romantic trip; families with kids aged 7 and above; photographers and drone shooters; and anyone who cannot commit to longer treks like Panwali Kantha or Kedarkantha but still wants to stand in front of a 20,000 ft wall of peaks.";

  TREKS[khaliyaTopIndex].importantNote =
    "There is no shop at the top — carry your own water and snacks. Ponies are available only up to Balanti Farm; the last 2-3 km must be walked. There is no mobile network at Khaliya Top — only Jio/BSNL work a little in Munsiyari town — so carry a power bank. Carry warm clothes even in summer, since the wind at the top is very cold, and expect 0 to -5°C at night in camp. A guide is not compulsory by the forest department but is strongly recommended, since the trail gets confusing in fog.";

  TREKS[khaliyaTopIndex].sourceCaveat =
    "The source write-up gives the trek distance as both \"12 km total (6 km up + 6 km down)\" and, in places, as a \"5-6 km\" one-way walk after a short drive to Balanti Gate — both are kept as published; the shorter figure reflects that a 5 km jeep drive from Munsiyari covers part of the route before the walk starts. No fixed package price is published in the source, so none is shown here; contact the trips desk for current rates. KMVN Guest House stay at the top is quoted separately in the source at roughly Rs 800-1,000 per person with food, alongside the tented camp option included in the package below.";

  TREKS[khaliyaTopIndex].eligibilityCriteria = [
    { icon: "User", text: "Age: minimum 7 years (active kids trekking with parents); ideal 10-55 years; maximum 65 years for a fit, regular walker, with a self-declaration above 60" },
    { icon: "IdCard", text: "Any government photo ID (Aadhaar preferred) compulsory for the forest check-post entry; foreign nationals need a passport and visa" },
    { icon: "Users", text: "Solo travellers welcome — you'll be added to a group, since the trek needs a minimum of 2 people to operate" },
    { icon: "ShieldAlert", text: "Needs a doctor's permission: heart patients with a stent or surgery within 1 year, severe breathing conditions needing oxygen support, pregnancy beyond 5 months, or a leg/knee ligament operation within 4 months" },
    { icon: "HeartPulse", text: "High BP, diabetes, mild asthma or mild knee pain are allowed — carry your medicine, inhaler and a trekking pole" },
    { icon: "Footprints", text: "Trek shoes recommended but not compulsory — good-grip sports shoes also work, unlike stricter treks such as Panwali Kantha" }
  ];

  TREKS[khaliyaTopIndex].fitnessCriteria = [
    { icon: "Footprints", text: "Able to walk 5-6 km uphill in 5-6 hours with breaks — the only real physical requirement" },
    { icon: "TrendingUp", text: "Able to climb 3-4 floors of stairs without chest pain or heavy breathlessness" },
    { icon: "Backpack", text: "Only a small 2-3 kg daypack to carry yourself — main luggage stays behind at the Munsiyari hotel" },
    { icon: "Activity", text: "Quick self-test: walk 3 km continuously in a park without needing to sit down" }
  ];

  TREKS[khaliyaTopIndex].howToReach = {
    intro: "Khaliya Top starts and ends at Kathgodam; the trek itself begins from Munsiyari, 310 km away.",
    air: {
      summaryLabel: "Nearest Airport",
      summary: "Pantnagar Airport (PGH)",
      detail: "About 30 km from Kathgodam/Haldwani, with daily flights from Delhi (about 1 hour). Flights are pricier and more weather-prone than the train, so the train is the more reliable option. A taxi from Pantnagar to Kathgodam takes about 45 minutes."
    },
    train: {
      summaryLabel: "Nearest Railway Station",
      summary: "Kathgodam Railway Station",
      detail: "The main station for all Kumaon treks, with direct trains from Delhi, Lucknow, Kanpur, Kolkata and Jammu — including the overnight Ranikhet Express from Delhi. Book via IRCTC 2-3 weeks in advance in season (May-June, October)."
    },
    road: {
      summaryLabel: "Route",
      summary: "Kathgodam to Munsiyari via Almora, Bageshwar, Kapkot, Tejam and Birthi Falls",
      route: ["Kathgodam", "Almora", "Bageshwar", "Kapkot", "Tejam", "Birthi Falls", "Munsiyari"],
      facts: [
        { label: "Delhi - Kathgodam / Haldwani", value: "280-300 km / 7-8 hrs" },
        { label: "Kathgodam - Munsiyari", value: "310 km / 10-11 hrs" },
        { label: "Dehradun - Munsiyari", value: "450 km" },
        { label: "Pantnagar Airport - Kathgodam", value: "30 km / 45 min" }
      ],
      options: [
        { from: "Delhi ISBT Anand Vihar / Kashmere Gate", name: "Uttarakhand Roadways / UPSRTC buses (ordinary, AC, Volvo) every 30 minutes, plus private Volvo services (RedBus, ZingBus)", note: "Overnight Volvo departs Delhi around 10 PM, reaching Haldwani by 5 AM; an auto from there to Kathgodam station takes about 200 rupees and 7 km" }
      ]
    },
    pickup: {
      point: "Kathgodam Railway Station Main Gate, near the taxi stand",
      time: "6:00 - 6:30 AM sharp on Day 1",
      dropPoint: "Kathgodam Railway Station",
      dropTime: "Evening, 6-7 PM on Day 4",
      note: "The driver calls the evening before with the vehicle number. If you arrive in Kathgodam late the previous evening, plan a night's stay near the station (KMVN Kathgodam is a good option), since pickup is sharp at 6:00 AM."
    }
  };

  TREKS[khaliyaTopIndex].inclusions = [
    { title: "Transportation", description: "Pickup from Kathgodam Railway Station on Day 1 and drop back on Day 4, by shared Sumo/Bolero/Tempo Traveller, including the Munsiyari-to-Balanti Gate drive both ways, driver allowance, toll, parking and fuel." },
    { title: "Accommodation", description: "2 nights in a Munsiyari hotel (triple/quad sharing, attached bathroom, hot water) and 1 night in tents at Khaliya Top or the KMVN hut, subject to availability (triple sharing, alpine tent, sleeping bag rated to -10°C, mattress and pillow)." },
    { title: "Meals", description: "All-veg meals — 3 breakfasts, 2 lunches and 3 dinners in total, including a hot cooked lunch (not packed) at Khaliya Top on trek day." },
    { title: "Trek Support", description: "Local experienced trek guide (1 per 8-10 persons, Hindi/English speaking), a cook and helper at the Khaliya Top camp, plus kitchen, dining and toilet tents and all camping equipment." },
    { title: "Permits & Fees", description: "Forest entry permit for the Askot Wildlife Sanctuary (Khaliya Top lies inside it), camping permission and KMVN hut/tent charges at the top." },
    { title: "Safety", description: "Basic first-aid kit (medicines, bandage, oximeter), a trekking pole on request, and a walkie-talkie for the guide to stay in contact with the base." }
  ];

  TREKS[khaliyaTopIndex].exclusions = [
    { title: "Personal Expenses", description: "Train/flight/bus tickets to and from Kathgodam, any Day-0 stay in Kathgodam, lunch on Day 1 and Day 4, tea/coffee/snacks on drive days, and personal shopping in Munsiyari." },
    { title: "Extra Accommodation / Transport", description: "Extra nights if a landslide, road block or missed train delays you, a private vehicle or double-sharing hotel upgrade, and a personal porter to carry your backpack (mule offloading is not possible on the last 2 km)." },
    { title: "Gear", description: "Trek shoes, backpack, raincoat and warm clothes — a packing list is provided and most items can be rented in Munsiyari." },
    { title: "Insurance & Emergency", description: "Travel/medical insurance, any emergency evacuation or helicopter rescue cost (rarely needed on this trek), and hospital expenses in Munsiyari." },
    { title: "Others", description: "Pony/horse charges up to Balanti (if needed), 5% GST if a bill is required, and anything not mentioned under inclusions." }
  ];

  TREKS[khaliyaTopIndex].itinerary = [
    {
      day: 1,
      title: "Kathgodam to Munsiyari Drive",
      driveDistance: "310 km",
      drivingTime: "10-11 Hours",
      pickupPoint: "Kathgodam Railway Station",
      pickupTime: "6:00 AM",
      altitudePoints: [
        { location: "Kathgodam", m: 549, ft: 1800 },
        { location: "Munsiyari", m: 2195, ft: 7200 }
      ],
      altitudeGain: { m: 1646, ft: 5400 },
      description: "One of the most scenic drives in Kumaon — via Almora, Bageshwar, Kapkot, Tejam and Birthi Falls — past rivers, waterfalls and pine forest to the base town of Munsiyari.",
      detailedParagraphs: [
        "Pickup from Kathgodam Railway Station at 6:00 AM. The drive runs via Almora, Bageshwar, Kapkot, Tejam and Birthi Falls to Munsiyari, with breakfast or lunch taken en route.",
        "Reach Munsiyari by evening and check in to the hotel. The evening is free to explore Munsiyari market — pick up a cap or gloves if needed — with a sunset view of the Panchachuli range visible from the hotel itself.",
        "Dinner and overnight stay at a Munsiyari hotel, triple/quad sharing."
      ],
      highlights: ["Scenic Drive via Birthi Falls", "Sunset View of Panchachuli from Munsiyari", "Munsiyari Market"],
      meals: "Dinner",
      stayType: "Hotel — Munsiyari"
    },
    {
      day: 2,
      title: "Munsiyari to Khaliya Top Trek",
      driveDistance: "5 km",
      trekDistance: "5-6 km",
      trekDuration: "5-6 Hours",
      altitudePoints: [
        { location: "Munsiyari", m: 2195, ft: 7200 },
        { location: "Khaliya Top", m: 3505, ft: 11500 }
      ],
      altitudeGain: { m: 1310, ft: 4300 },
      description: "A short drive to Balanti Gate, then a climb through pine and oak forest that opens suddenly into the huge Khaliya Top meadow, facing the Panchachuli wall.",
      detailedParagraphs: [
        "After breakfast, pack only a small daypack — the main luggage stays in the Munsiyari hotel's cloak room. Drive 5 km to Balanti Bend / Khaliya Gate, the point from where vehicles cannot go further, and complete the forest check-post entry.",
        "The trail runs Balanti Gate to Balanti Farm (about 2 km, gradual climb, pine forest) to a forest rest hut (about 3.5 km, steeper climb through oak and rhododendron) to Khaliya Top (about 5.5 km, opening into meadow). Stop for tea at Balanti Farm, where Panchachuli first comes into view.",
        "Check in to tents or the KMVN hut at the top. Free time to explore the meadow, walk the extra 15 minutes to Zero Point, and photograph the Panchachuli range, Rajrambha and Hardeol.",
        "Watch the sunset turn Panchachuli golden, then dinner in the dining tent. Overnight in tents at Khaliya Top; temperature drops to 0 to -5°C at night, sleeping bag provided."
      ],
      highlights: ["Pine & Oak Forest Trail", "Zero Point Viewpoint", "Sunset Over Panchachuli"],
      meals: "Breakfast, Lunch, Dinner",
      stayType: "Camping / KMVN Hut — Khaliya Top"
    },
    {
      day: 3,
      title: "Khaliya Top to Munsiyari Return",
      trekDistance: "5-6 km",
      trekDuration: "3-4 Hours",
      driveDistance: "5 km",
      altitudePoints: [
        { location: "Khaliya Top", m: 3505, ft: 11500 },
        { location: "Munsiyari", m: 2195, ft: 7200 }
      ],
      altitudeGain: { m: -1310, ft: -4300 },
      description: "The trip's highlight — sunrise over the full Panchachuli range — followed by the descent to Balanti Gate and an afternoon free in Munsiyari.",
      detailedParagraphs: [
        "Early wake-up call for the highlight of the trek: sunrise over Panchachuli, the five peaks turning from pink to orange to gold over about 40 minutes, best watched with a hot cup of tea in hand.",
        "Breakfast at camp (paratha, omelette, tea), then pack up and descend back to Balanti Gate, followed by the 5 km drive back to Munsiyari and hotel check-in.",
        "Afternoon free to explore Munsiyari — options include Birthi Falls (35 km detour, sometimes covered on Day 1 instead), the Tribal Heritage Museum, Nanda Devi Temple as a sunset point, or the local market for pure woollen shawls.",
        "Dinner and overnight stay at the Munsiyari hotel."
      ],
      highlights: ["Sunrise Over Panchachuli", "Free Time in Munsiyari", "Tribal Heritage Museum / Nanda Devi Temple (optional)"],
      meals: "Breakfast, Lunch, Dinner",
      stayType: "Hotel — Munsiyari"
    },
    {
      day: 4,
      title: "Munsiyari to Kathgodam Drive Back",
      driveDistance: "310 km",
      drivingTime: "9-10 Hours",
      altitudePoints: [
        { location: "Munsiyari", m: 2195, ft: 7200 },
        { location: "Kathgodam", m: 549, ft: 1800 }
      ],
      altitudeGain: { m: -1646, ft: -5400 },
      description: "The drive back to Kathgodam by the same scenic route, with breakfast at the hotel and stops for meals along the way.",
      detailedParagraphs: [
        "Early breakfast and check-out, then start the drive back to Kathgodam along the same route.",
        "Breakfast/tea halt at Chaukori or Bageshwar, and lunch near Almora.",
        "Drop-off at Kathgodam Railway Station by 6-7 PM. Trek ends."
      ],
      highlights: ["Drive via Chaukori / Bageshwar", "Lunch Halt Near Almora"],
      meals: "Breakfast",
      stayType: "Tour ends — no overnight"
    }
  ];

  TREKS[khaliyaTopIndex].faqs = [
    {
      title: "What is Khaliya Top height and distance?",
      description: "Khaliya Top is at 11,500 feet (3,500 metres). Trek distance is only 10-12 km total — 5-6 km up from Balanti Gate to the top, and 5-6 km down the same way, after a 5 km drive from Munsiyari to Balanti Gate."
    },
    {
      title: "Is Khaliya Top trek difficult?",
      description: "No — it is Easy to Moderate, one of the easiest Himalayan treks to reach a view of 6,000-7,000 m peaks. Daily walking is only 4-5 hours, with no technical or boulder sections, so first-timers, kids 8+ and families can do it comfortably."
    },
    {
      title: "What is the best time for Khaliya Top?",
      description: "March-April for a snow trek (2-3 ft snow at top); May-June for a green meadow with clear peaks, best for families; September-October for a golden meadow and the clearest sky, best for photography; December-February is heavy snow, for experienced trekkers only. Avoid July-August due to rain and leeches."
    },
    {
      title: "How to reach Khaliya Top base camp, Munsiyari?",
      description: "The base is Munsiyari town. Nearest railway station is Kathgodam (310 km, 10-11 hrs drive) and Tanakpur (250 km); nearest airport is Pantnagar (350 km). Pickup from Kathgodam is at 6 AM; from Delhi, the overnight Ranikhet Express reaches Kathgodam by morning."
    },
    {
      title: "Is there stay at Khaliya Top?",
      description: "Yes, but basic — either the KMVN Tourist Hut at the top (a small hut with a few beds and food) or tents with a sleeping bag rated to -10°C, mattress, kitchen tent and toilet tent. There is no hotel or electricity at the top; Munsiyari has good hotels with attached bathrooms."
    },
    {
      title: "Is a guide compulsory for Khaliya Top?",
      description: "Not compulsory by the forest department, but strongly recommended for first-timers, since the trail gets confusing in fog or cloud and weather changes fast; a guide is essential in the snow season."
    },
    {
      title: "Is there network and electricity at Khaliya Top?",
      description: "No network and no electricity at the top; Jio and BSNL work in Munsiyari town. Carry a 20,000 mAh power bank and a torch — hot boiled water is provided at camp."
    },
    {
      title: "What mountains are visible from Khaliya Top?",
      description: "The closest, clearest view of Panchachuli I to V, Rajrambha (6,537 m), Hardeol (7,151 m), Nanda Devi East, Nanda Kot (6,861 m) and Nanda Khat. The sunrise view of Panchachuli is the main highlight."
    },
    {
      title: "Can we do Khaliya Top in winter / snow?",
      description: "Yes, December to April is the snow season. You'll need waterproof trek shoes, gaiters, warm layers and gloves; microspikes are provided if needed. The winter trek is slightly harder than summer but very beautiful."
    },
    {
      title: "What to pack for Khaliya Top?",
      description: "Trek shoes or good-grip sports shoes, a warm jacket, fleece, two thermals, gloves, a woollen cap and 3 pairs of socks, a raincoat/poncho and trek pole, sunglasses, sunscreen, cap, a 1L water bottle, power bank and headlamp, plus personal medicines. A 40L backpack works — big trolley bags are not practical; extra luggage stays at the Munsiyari hotel."
    },
    {
      title: "Is food available on the trek?",
      description: "No shops on the trek route or at the top — you must carry packed food or travel with the package, which includes Day 1 dinner through Day 4 breakfast: veg, hot-cooked paratha, poha, dal-rice, sabzi-roti, soup and tea. Dry fruits or energy bars are worth carrying for the trail."
    },
    {
      title: "Is a horse or pony available?",
      description: "Ponies are available up to Balanti Farm (one side, about 3 km). The last 2 km through the steep meadow has no pony option — only walking. A pony can help with the first half if you have a knee issue."
    },
    {
      title: "Is Khaliya Top safe for girls / solo travellers?",
      description: "Yes, it's very safe — Munsiyari is a tourist town with helpful locals. Groups typically run around 40% women; solo women trekkers are placed in shared tents with other women in the group."
    }
  ];

  TREKS[khaliyaTopIndex].article = {
    title: "Khaliya Top: The Balcony of Panchachuli",
    standfirst: "If there is one trek in Uttarakhand where you walk just 5 kilometres and get a view people usually walk 50 kilometres for, it is Khaliya Top.",
    readMinutes: 6,
    sections: [
      {
        paragraphs: [
          "Located at 11,500 feet above the beautiful town of Munsiyari in Pithoragarh district, Kumaon, Khaliya Top is a vast alpine meadow that acts as a natural balcony for the mighty Panchachuli range. You don't just see Panchachuli from Khaliya Top — you feel it standing right in front of you.",
          "Khaliya Top lies in the Johar Valley near the India-Nepal-Tibet border. The base village, Munsiyari (7,200 ft), is called the \"Little Kashmir\" of Uttarakhand, and is 310 km from Kathgodam railway station and 450 km from Dehradun. From Munsiyari, Khaliya Top is just a 5 km drive plus a 5 km trek."
        ]
      },
      {
        heading: "Why Khaliya Top is famous",
        paragraphs: [
          "The five peaks of Panchachuli (6,334 m to 6,904 m) are so close from Khaliya Top that on a clear morning you can see the cracks on the glaciers. The name means \"five ovens\" of the Pandavas — local legend says they cooked their last meal on these peaks before going to heaven.",
          "The sunrise here is legendary. At around 5:15 AM the first ray touches Panchachuli II, and within 10 minutes all five peaks turn from pink to fiery orange to golden — photographers travel from across India for just those 30 minutes.",
          "It is also a genuinely beginner-friendly big-Himalayan trek. A 10-year-old and a 60-year-old can do it with the same excitement — no technical climb, no risky boulder zone, just 5-6 hours up and 3 hours down. And unlike Auli, Chopta or Dayara Bugyal on a weekend, Khaliya Top is still raw — on a weekday you might share the entire meadow with only 10-15 people."
        ]
      },
      {
        heading: "The trek experience",
        paragraphs: [
          "The journey starts from Kathgodam with a 10-hour scenic drive to Munsiyari through Almora, Bageshwar and Chaukori, past rivers, pine forest, Birthi Falls and distant snow peaks. One night in a Munsiyari hotel allows for acclimatisation before the drive next morning to Balanti Gate, the trek's starting point.",
          "The first 2 km run through pine forest on a gradual ascent, with Himalayan birdsong along the way. The next 2 km climb steeply through oak and rhododendron — in March-April this stretch is full of red rhododendron blooms. At around 3.5 km, the forest ends abruptly and the huge meadow opens up, with the white wall of Panchachuli, Rajrambha and Hardeol standing in front. Most people simply stop and stand for a while — it's hard not to.",
          "The top is reached by lunchtime, followed by hot dal-chawal in a tent, a walk to Zero Point, and a sunset that paints Panchachuli gold once again. Night at Khaliya Top is its own world — no electricity, no network, Munsiyari's lights twinkling 4,000 feet below, and a sky clear enough to show the Milky Way. Temperatures drop to around -5°C, and the next morning brings the sunrise that makes the whole trip."
        ]
      }
    ],
    signoff: "Khaliya Top gives you both a huge meadow and the closest possible view of 20,000 ft peaks, with zero construction on top. It is proof that you don't need to walk ten days to see heaven — sometimes six kilometres are enough."
  };

  TREKS[khaliyaTopIndex].similarTreks = [
    "panwali-kantha-trek",
    "kedarkantha-trek",
    "dayara-bugyal-trek",
    "brahmatal-trek",
    "kuari-pass-trek"
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

// Static details for the Chakrata Trip (uid: chakrata-trip), the offbeat
// Jaunsar Bawar cantonment weekend getaway from Delhi.
const chakrataIndex = TREKS.findIndex(t => t.slug === 'chakrata-trip');
if (chakrataIndex !== -1) {
  TREKS[chakrataIndex].tagline = "Tiger Falls, Chilmiri sunsets and deodar forests — an easy Delhi weekend into offbeat Uttarakhand.";
  TREKS[chakrataIndex].endLocation = "Delhi";
  TREKS[chakrataIndex].totalDistance = "Approx. 640 km by Road (Delhi to Delhi) + 8 km Trek / Walk";
  TREKS[chakrataIndex].maxAltitude = "9,300 ft / 2,835 m (Deoban)";

  TREKS[chakrataIndex].inclusions = [
    { title: "Travel", description: "Travel by AC & Comfortable Traveller / Urbania / Bolero - Delhi to Delhi." },
    { title: "Accommodation", description: "1 Night Accommodation at Chakrata's Best Resort / Swiss Camps - Triple / Quad Sharing Basis (Deluxe Room)." },
    { title: "Meals", description: "2 Meals - 1 Breakfast + 1 Dinner (Veg Buffet)." },
    { title: "Guided Trek", description: "Guided Trek to Moila Top (9,000 FT) & Budher Caves (Miola Caves) with Local Guide." },
    { title: "Chilmiri Neck", description: "Visit to Chilmiri Neck - Chakrata's Highest Sunset Point." },
    { title: "Tiger Falls", description: "Visit to Tiger Falls - 312 FT Highest Direct Waterfall." },
    { title: "Bonfire", description: "Evening Bonfire with Music (Subject to weather conditions)." },
    { title: "Trip Captain", description: "Trip Captain Throughout The Trip - From Delhi to Delhi." },
    { title: "Toll & Parking", description: "Toll Taxes, Driver Allowance, Parking Charges Included." }
  ];

  TREKS[chakrataIndex].exclusions = [
    { title: "Lunch", description: "Not included - You can buy at Local Dhabas." },
    { title: "Personal Expenses", description: "Snacks, Tea, Water Bottles, Maggi at Trek Points." },
    { title: "Adventure Activities", description: "Zip Line, Rappelling at Tiger Falls - 200-500/- (Pay Directly)." },
    { title: "GST", description: "5% GST Extra if you need Invoice." },
    { title: "Anything not listed", description: "Anything not specifically mentioned in the Inclusion List." }
  ];

  TREKS[chakrataIndex].minAge = 5;
  TREKS[chakrataIndex].maxAge = 60;

  TREKS[chakrataIndex].eligibilityCriteria = [
    { icon: "User", text: "Age: 5–60 years - No age restriction for this easy trip" },
    { icon: "Footprints", text: "No trek experience needed - Easy grade, 2–3 km walking only" },
    { icon: "ShieldCheck", text: "Family & kids friendly - Comfortable resort stay for all ages" },
    { icon: "Users", text: "Solo travellers welcome - Separate tents / rooms for girls" },
    { icon: "Heart", text: "Couple friendly - Cottage / private room option at extra cost" },
    { icon: "Stethoscope", text: "Inform in advance if you have Asthma, Heart Problem or High BP - Carry your medicines" }
  ];

  TREKS[chakrataIndex].fitnessCriteria = [
    { icon: "Footprints", text: "Comfortable walking 2–3 km on easy, well-marked trails" },
    { icon: "TrendingUp", text: "Tiger Falls trek: 1 km down and up on stairs through forest" },
    { icon: "Mountain", text: "Moila Top trek: 2.5 km easy walk through deodar forest to the meadows" },
    { icon: "Activity", text: "No prior fitness training or high-altitude acclimatisation required" }
  ];

  TREKS[chakrataIndex].aboutParagraphs = [
    "Chakrata is a quiet cantonment town in Uttarakhand, located at 7,000 ft, just 320 km from Delhi. Unlike Mussoorie or Shimla, Chakrata is still offbeat, clean and less crowded because it is under Army (Special Frontier Force). No mall road rush, no traffic jams — just deodar forests, waterfalls, meadows and silence.",
    "Our Chakrata 1N/2D Trip Ex: Delhi is perfect for a weekend getaway from Delhi. You travel overnight from Delhi to Dehradun to Chakrata, spend a night in Chakrata in a hotel / camp with bonfire, visit Tiger Falls, Chilmiri Top, Moila Top and Budher Caves and come back to Delhi.",
    "If you are from Delhi NCR and want to escape the city heat or crowd for two days, if you want to see a real waterfall (312 ft Tiger Falls), or if you want to sit in a forest and do a bonfire with friends while clicking photos of the Himalayas — Chakrata is made for you.",
    "No high-altitude trekking, no fitness required — anyone can go, from a 5 year old kid to a 60 year old parent. Best for couples, friend groups, families with kids, college groups and corporate teams."
  ];

  TREKS[chakrataIndex].highlights = [
    "Tiger Falls - 312 FT Highest Direct Waterfall",
    "Chilmiri Neck - Sunrise & Sunset Point",
    "Deoban Forest - Dense Deodar & Himalayan Views",
    "Budher / Moila Caves - 150M Limestone Cave",
    "Kanasar - Asia's Biggest Deodar Tree",
    "Bonfire, Music & Camping"
  ];

  TREKS[chakrataIndex].usps = [
    {
      title: "Delhi to Delhi in AC Traveller / Volvo + Local Taxi",
      description: "No self-driving tension - Delhi to Kalsi highway is good, but after Kalsi roads are narrow and steep."
    },
    {
      title: "Stay near Chakrata Market / Kanasar Camps",
      description: "Best located resort / Swiss camp stay with bonfire area and mountain views."
    },
    {
      title: "All major points covered",
      description: "Tiger Falls Trek (with guide), Chilmiri Neck Sunset, Moila Top & Budher Caves walk."
    },
    {
      title: "Meals + Bonfire + Music + Trek Guide included",
      description: "Everything managed so you can focus on the forests, waterfall and mountains."
    },
    {
      title: "Trip Captain from Delhi",
      description: "Manages the entire trip end to end, from pickup to drop."
    }
  ];

  TREKS[chakrataIndex].destinationHighlights = [
    { name: "Tiger Falls", blurb: "312 ft direct waterfall, 20 km from Chakrata, one of the highest direct falls in India." },
    { name: "Chilmiri Neck", blurb: "Chakrata's highest point (7,500 ft), an Army-controlled sunset viewpoint over the valley." },
    { name: "Deoban Forest", blurb: "Dense deodar forest at 9,300 ft with wide Himalayan views on clear days." },
    { name: "Budher / Moila Caves", blurb: "A 150 metre limestone cave with hanging stalactites inside the Moila Top forest." },
    { name: "Kanasar", blurb: "Home to Asia's biggest Deodar tree, near the meadows of Moila Danda." }
  ];

  TREKS[chakrataIndex].differentiators = [
    "Region: Dehradun District, Uttarakhand - Jaunsar Bawar Region (Cantonment Hill Station)",
    "Trip type: easy weekend getaway - no trek experience needed",
    "Terrain: deodar forests, meadows, a limestone cave and a 312 ft waterfall",
    "Best experience: offbeat, uncrowded alternative to Mussoorie and Shimla"
  ];

  TREKS[chakrataIndex].idealFor =
    "Delhi NCR travellers aged 5–60 looking for an easy 1N/2D weekend getaway - nature lovers, waterfall lovers, families, couples, solo travellers, college groups and corporate teams. No trek experience or fitness training required.";

  TREKS[chakrataIndex].importantNote =
    "Chakrata is an Army Cantonment Area - carry your original Aadhar Card / valid Govt ID, it is checked at the Chakrata checkpost and again at the Kanasar gate for Budher Caves entry. Smoking and drinking inside the vehicle is strictly prohibited.";

  TREKS[chakrataIndex].howToReach = {
    intro: "The Chakrata Trip starts and ends in Delhi, running via Dehradun and Kalsi.",
    air: {
      summaryLabel: "Nearest Airport",
      summary: "IGI Airport, Delhi (Starting Point) / Jolly Grant Airport, Dehradun",
      detail: "IGI Delhi is the trip's start point. Jolly Grant Airport, Dehradun is 115 km from Chakrata, enroute, with a taxi onward costing roughly ₹3,500-4,000."
    },
    train: {
      summaryLabel: "Nearest Railway Station",
      summary: "Delhi - Hazrat Nizamuddin / New Delhi / Kashmiri Gate ISBT",
      detail: "Delhi is the pickup point. Dehradun Railway Station is 92 km from Chakrata and lies on the route, roughly the midpoint of the drive."
    },
    road: {
      summaryLabel: "Route",
      summary: "Delhi - Meerut - Roorkee - Dehradun - Kalsi - Chakrata",
      detail: "Delhi to Chakrata is 320 km / 8-9 hours by road. From Dehradun, it is 90 km / 3-3.5 hours via Vikasnagar, Kalsi and Sahiya. The road is a good highway till Kalsi, but after Kalsi it is a single hilly road with sharp turns - self-drive is not recommended at night or in monsoon.",
      route: ["Delhi", "Meerut", "Roorkee", "Dehradun", "Kalsi", "Sahiya", "Chakrata"],
      facts: [
        { label: "Distance", value: "320 km (Delhi) / 90 km (Dehradun)" },
        { label: "Drive", value: "8-9 Hours (Delhi) / 3-3.5 Hours (Dehradun)" },
        { label: "Bus Option", value: "Dehradun ISBT to Chakrata - 5:30 AM & 1:00 PM - ₹150 - 4 Hrs" }
      ]
    },
    pickup: {
      point: "Delhi - Kashmiri Gate / Majnu Ka Tila / Akshardham",
      time: "9:00-10:00 PM on Day 0",
      dropPoint: "Delhi",
      dropTime: "6:00-7:00 AM on the last day",
      note: "Overnight journey from Delhi to Dehradun on Day 0. Dehradun to Dehradun batch pickup is at Dehradun Railway Station / ISBT at 6:00 AM."
    }
  };

  TREKS[chakrataIndex].itinerary = [
    {
      day: 0,
      title: "Delhi to Dehradun (Overnight Journey)",
      driveDistance: "250 km",
      pickupPoint: "Delhi - Kashmiri Gate / Majnu Ka Tila / Akshardham",
      pickupTime: "9:00-10:00 PM",
      description: "Overnight departure from Delhi to Dehradun, with a scenic route and a midway refreshment break.",
      detailedParagraphs: [
        "Embark on an overnight journey from Delhi to Dehradun with the batch, taking a scenic route.",
        "The bus / traveller stops midway for a refreshing break before continuing on to Dehradun."
      ],
      highlights: ["Overnight Departure", "Midway Break"],
      meals: "None",
      stayType: "Overnight Travel"
    },
    {
      day: 1,
      title: "Dehradun to Chakrata - Moila Top Trek & Chilmiri Sunset",
      driveDistance: "90 km",
      drivingTime: "3-3.5 Hours",
      trekDistance: "2.5 km",
      trekDuration: "2-3 Hours",
      altitudePoints: [
        { location: "Dehradun", m: 549, ft: 1800 },
        { location: "Chakrata", m: 2134, ft: 7000 },
        { location: "Moila Top", m: 2743, ft: 9000 },
        { location: "Chilmiri Neck", m: 2286, ft: 7500 }
      ],
      altitudeGain: { m: 1585, ft: 5200 },
      description: "Reach Dehradun early morning, drive to Chakrata and check in, then trek to Moila Top & Budher Caves for 360° Himalayan views, followed by sunset at Chilmiri Neck and a bonfire dinner.",
      detailedParagraphs: [
        "Reach Dehradun around 6 AM and drive to Chakrata (90 km), checking into the resort by 8 AM.",
        "After breakfast, the whole group heads to Lokhandi and starts the trek to Moila Top, enjoying a 360° view of the Himalayas and the unseen beauty of the Bugyal in the dark deodar forest, along with the Budher / Moila Caves.",
        "After completing the trek, the group hikes to Chilmiri Top for a beautiful sunset - the whole valley turns orange as the Himalayan range glows.",
        "The group returns to the resort for dinner with a bonfire and music."
      ],
      highlights: ["Moila Top Trek", "Budher Caves", "360° Himalayan View", "Chilmiri Sunset", "Bonfire & Music"],
      meals: "Breakfast & Dinner",
      stayType: "Resort / Swiss Camp"
    },
    {
      day: 2,
      title: "Tiger Falls & Return to Delhi",
      trekDistance: "1 km (Down + Up)",
      trekDuration: "1-2 Hours",
      driveDistance: "90 km (to Dehradun) + 250 km (to Delhi)",
      altitudePoints: [
        { location: "Chakrata", m: 2134, ft: 7000 },
        { location: "Tiger Falls", m: 1399, ft: 4590 }
      ],
      altitudeGain: null,
      description: "Morning tea with Himalayan views, trek down to the 312 ft Tiger Falls, then drive back via Dehradun to Delhi, arriving early next morning.",
      detailedParagraphs: [
        "The day starts with morning tea and a beautiful Himalayan view from your bed.",
        "After breakfast, the whole group goes to Tiger Falls, hidden in the hilly terrain of Chakrata, 20 km away at a height of 312 ft - considered one of the highest direct waterfalls in India.",
        "After enjoying the waterfall, the group heads back to Dehradun and then on to Delhi, arriving around 4:00-5:00 AM with many memories and new friends."
      ],
      highlights: ["Tiger Falls Trek", "312 FT Waterfall", "Return to Delhi"],
      meals: "Breakfast",
      stayType: ""
    }
  ];

  TREKS[chakrataIndex].article = {
    title: "Chakrata - The Hidden Himalayan Gem Near Delhi | Complete Travel Guide",
    standfirst:
      "Just 320 km from Delhi, this small cantonment town in Uttarakhand is still untouched, raw, and surrounded by dense deodar forests, misty mountains and two of Uttarakhand's most beautiful treks - Moila Top and Tiger Falls.",
    readMinutes: 6,
    sections: [
      {
        paragraphs: [
          "If you are tired of crowded Mussoorie and looking for a peaceful, offbeat weekend getaway near Delhi, Chakrata is the answer.",
          "Unlike other hill stations, Chakrata is a Restricted Army Cantonment Area. That is the reason you won't find too many hotels, market crowd or traffic here. This is exactly what makes it special - clean air, no pollution, and pure nature."
        ]
      },
      {
        heading: "Moila Top Trek & Budher Caves",
        paragraphs: [
          "The main highlight of Chakrata. A 2.5 km easy trek from Lokhandi through dark deodar forest takes you to a wide green meadow - Moila Danda or Bugyal. From here you get a 360° view of Swargarohini, Bandarpoonch and other Himalayan peaks.",
          "Inside the forest is the famous Budher Caves (Miola Caves) - a 150 metre long limestone cave with hanging stalactites. It feels like you are inside an ancient era."
        ]
      },
      {
        heading: "Tiger Falls (312 FT)",
        paragraphs: [
          "Located 20 km from Chakrata, it is one of the highest direct waterfalls in India. Water falls straight from a height of 312 feet into a small natural pool.",
          "The trek to the base is just 1 km downhill through thick forest. You can sit at the bottom, dip your feet, and listen to the roar of the fall - completely healing."
        ]
      },
      {
        heading: "Chilmiri Neck",
        paragraphs: [
          "The highest point of Chakrata (7,500 ft), under Army control. From here, sunset looks magical - the whole valley turns orange and the Himalayan range glows.",
          "Photography is restricted here due to the Army area, but the view remains in your memory forever."
        ]
      },
      {
        heading: "Best Time to Visit",
        paragraphs: [
          "March to June is best for trekking and clear Himalayan views, with temperatures of 10-25°C. July to September is monsoon, with the waterfall at its peak and lush green forest, but the trek becomes slippery.",
          "October to November is best for clear skies and sunset views, while December to February brings a snowfall season that turns Chakrata white - perfect for snow lovers."
        ]
      },
      {
        heading: "Things to Remember",
        paragraphs: [
          "Carry your Aadhar Card - it is checked at the Cantonment gate. Drones are not allowed and no permit is needed. Carry cash, as ATMs are limited, and avoid loud music at the waterfall.",
          "Chakrata is not a luxury destination - it is a raw, offbeat, forest destination for those who want to disconnect from city noise and connect with mountains."
        ]
      }
    ],
    signoff: "Trip My Soul organizes weekend batches for Chakrata - Delhi to Delhi - with AC transport, resort stay, meals, trek guide and trip captain."
  };

  TREKS[chakrataIndex].faqs = [
    { title: "What is the distance from Delhi to Chakrata?", description: "Delhi to Chakrata is 320 km. It takes 8-9 hours to reach Dehradun overnight, plus 3 hours to Chakrata - total 11-12 hours including breaks." },
    { title: "Is Chakrata safe for girls & solo travellers?", description: "Yes, 100% safe. Chakrata is an Army Cantonment Area, so security is very high. 40% of our travellers are solo female travellers, with separate accommodation for girls and a trip captain for safety." },
    { title: "Is the trek difficult? Can beginners do it?", description: "Both Moila Top (2.5 km) and Tiger Falls (1 km) are easy grade treks. No prior trek experience is needed - kids (5+ years) and elders (up to 60 years) can easily do it, with only 200-300 steps at Tiger Falls." },
    { title: "Will we get snow in Chakrata?", description: "Yes, from December to February you get snowfall at Moila Top and Chilmiri Neck. March and November also have chances - we run special snow trek batches in winter." },
    { title: "What about mobile network & ATM?", description: "Only Jio & BSNL work in Chakrata - Airtel & VI have very weak signals, and no network during the Moila Top trek. Carry cash - only 2 ATMs in Chakrata market, often out of service." },
    { title: "What type of accommodation do you provide?", description: "We provide the best resort / Swiss camps in Chakrata, with attached washroom, hot water, mountain view and bonfire area, on a triple / quad sharing basis. Double sharing & couple private cottage are available at extra cost." },
    { title: "What will be the temperature in Chakrata?", description: "Summer is 10°C to 25°C (pleasant); winter is -5°C to 10°C (very cold). Carry jackets in all seasons - nights are cold even in summer." },
    { title: "Is Aadhar Card mandatory?", description: "Yes. Chakrata is an Army area - ID proof is checked at the Kanasar Checkpost for Budher Caves entry, so carry your original Aadhar / Govt ID." },
    { title: "Can we take our own car / bike?", description: "Yes, but the road after Kalsi is single, steep and has sharp turns. Avoid night driving - if you are not confident on hill driving, better to book the Delhi to Delhi package." },
    { title: "Are meals included? Veg or Non-Veg?", description: "1 Breakfast + 1 Dinner (veg buffet) is included. Lunch is not included, available at local dhabas for ₹200-300. Chakrata is a veg area due to the cantonment, so non-veg is not easily available." },
    { title: "Is drinking / smoking allowed?", description: "Drinking & smoking inside the vehicle is strictly prohibited. You can consume at the resort after the trek in a limited way, but should not create a nuisance for others." },
    { title: "What to carry for the Chakrata trip?", description: "ID proof, warm jacket, trek shoes / sports shoes, power bank, cash, medicines, sunscreen, sunglasses and a small backpack." },
    { title: "What is the pickup point & time?", description: "Delhi - Kashmiri Gate / Majnu Ka Tila - 9:00 to 10:00 PM. Dehradun - Dehradun Railway Station / ISBT - 6:00 AM." },
    { title: "What if it rains? Will the trek be cancelled?", description: "Light rain - the trek continues with ponchos. Heavy rain - the trek may be shifted to Tiger Falls only or resort activities for safety. No refund in case of weather issues, but we provide an alternate plan." }
  ];

  TREKS[chakrataIndex].packingList = [
    {
      category: "Clothing & Layers",
      items: [
        "Warm jacket (all seasons - nights are cold even in summer)",
        "Quick-dry T-shirts & trekking pants",
        "Warm cap & gloves (winter batches)",
        "Woollen socks (2-3 pairs)"
      ]
    },
    {
      category: "Footwear & Gear",
      items: [
        "Trekking shoes / sports shoes",
        "Small backpack / trolley bag (avoid big suitcase)",
        "Power bank & charging cable",
        "Torch / headlamp"
      ]
    },
    {
      category: "Sun, Health & Documents",
      items: [
        "Sunglasses & sunscreen",
        "Personal medicines (inform in advance for Asthma, Heart Problem, High BP)",
        "Cash (limited ATMs in Chakrata market)",
        "Aadhar Card / valid Govt ID (mandatory)"
      ]
    }
  ];

  TREKS[chakrataIndex].thingsToRemember = [
    "Carry your original Aadhar Card / valid Govt ID - it is checked at the Chakrata checkpost and again at the Kanasar gate for Budher Caves entry.",
    "Smoking & drinking inside the vehicle is strictly prohibited, and littering in the forest & waterfall area is not allowed.",
    "Pack light - one small backpack / trolley bag, avoid a big suitcase as the hill road and small trek don't suit it."
  ];

  TREKS[chakrataIndex].bookingAdvance = 1000;
  TREKS[chakrataIndex].bookingTerms = [
    { title: "Trip Cost", description: "₹3,999 + 5% GST* per person on triple / quad sharing." },
    { title: "Upgrade - Double Sharing", description: "₹1,000 per person extra." },
    { title: "Upgrade - Couple Cottage / Private Room", description: "₹1,000 per person extra." },
    { title: "Inclusions", description: "AC travel Delhi to Delhi, 1 night stay, 2 meals, guided treks, bonfire and trip captain as mentioned in the package." },
    { title: "Exclusions", description: "Lunch, personal expenses, adventure activities and anything not specifically mentioned under inclusions." },
    { title: "ID Proof", description: "Valid Aadhar Card / Govt ID is mandatory - checked at the Chakrata Cantonment checkpost." },
    { title: "Weather & Route", description: "Itinerary may change due to weather, Army/forest restrictions or safety conditions." }
  ];

  TREKS[chakrataIndex].similarTreks = [
    "auli-weekend-tour",
    "mussoorie-winter-escape",
    "nainital-winter-trip",
    "munsiyari-khalia-top"
  ];
}

/**
 * Hampta Pass publishes the client's "Crossing Hampta Pass" story as its
 * written guide. The copy is sourced from the blog article rather than being
 * duplicated here, so the trek page and /blogs/crossing-hampta-pass can never
 * drift apart. Everything else on this listing is still pending — see the
 * TODO(content) block on the trek entry itself.
 */
const hamptaPassIndex = TREKS.findIndex(t => t.slug === 'hampta-pass-trek');
const hamptaPassStory = getBlogArticle('crossing-hampta-pass');
if (hamptaPassIndex !== -1 && hamptaPassStory) {
  TREKS[hamptaPassIndex].article = {
    title: hamptaPassStory.title,
    standfirst: hamptaPassStory.standfirst,
    readMinutes: hamptaPassStory.readMinutes,
    image: hamptaPassStory.image,
    sections: hamptaPassStory.sections,
    signoff: hamptaPassStory.signoff
  };
}

/**
 * Photography the client shot on these four listings, from
 * `public/Trips_gallery/`. The source files were iPhone HEIFs, which only
 * Safari renders — they are stored here as JPEGs. Folder names carry spaces on
 * disk, so the paths are written `%20`-encoded, as `Kuari Pass trek` already is.
 */
if (hamptaPassIndex !== -1) {
  TREKS[hamptaPassIndex].heroImage =
    "/Trips_gallery/Hampta%20Pass/0bc8b112-014d-4cac-bcce-e676223ce81b.jpg.jpeg";

  TREKS[hamptaPassIndex].heroImages = [
    "/Trips_gallery/Hampta%20Pass/0bc8b112-014d-4cac-bcce-e676223ce81b.jpg.jpeg",
    "/Trips_gallery/Hampta%20Pass/3323960f-1dd2-4913-98fc-3d428195542a.jpg.jpeg",
    "/Trips_gallery/Hampta%20Pass/505da57a-59b5-4e24-9ca2-8f3d5ef828de.jpg.jpeg",
    "/Trips_gallery/Hampta%20Pass/d5e1a883-7a2c-4526-9341-94c2ab766e16.jpg.jpeg"
  ];

  TREKS[hamptaPassIndex].gallery = [
    { url: "/Trips_gallery/Hampta%20Pass/0bc8b112-014d-4cac-bcce-e676223ce81b.jpg.jpeg", caption: "A lone trekker crossing the snowfield below the pass" },
    { url: "/Trips_gallery/Hampta%20Pass/11deb1c1-52cf-46fe-b8d4-af80e4262822.jpg.jpeg", caption: "Climbing the rocky trail as the cloud comes in" },
    { url: "/Trips_gallery/Hampta%20Pass/3323960f-1dd2-4913-98fc-3d428195542a.jpg.jpeg", caption: "Chandra Taal, clear to the lake bed" },
    { url: "/Trips_gallery/Hampta%20Pass/43541937-4aa3-481b-abfc-891d5b3b11bd.jpg.jpeg", caption: "Layered up on the trail above Jobra" },
    { url: "/Trips_gallery/Hampta%20Pass/505da57a-59b5-4e24-9ca2-8f3d5ef828de.jpg.jpeg", caption: "Crossing the stream on the way up the valley" },
    { url: "/Trips_gallery/Hampta%20Pass/IMG_0842.jpeg", caption: "Rain gear on, moving across the snow" },
    { url: "/Trips_gallery/Hampta%20Pass/IMG_3055.jpeg", caption: "The batch at Chandra Taal after the crossing" },
    { url: "/Trips_gallery/Hampta%20Pass/b5c8ad47-69ef-404b-aa9b-7c07b2b4ce13.jpg.jpeg", caption: "Done — Hampta Pass with Chandra Taal" },
    { url: "/Trips_gallery/Hampta%20Pass/b5cc56a0-3b10-4466-9da0-a753e56935c8.jpg.jpeg", caption: "The full group on the snow below the pass" },
    { url: "/Trips_gallery/Hampta%20Pass/d5e1a883-7a2c-4526-9341-94c2ab766e16.jpg.jpeg", caption: "Hampta Pass summit, 14,100 ft" }
  ];
}

const valleyOfFlowersIndex = TREKS.findIndex(t => t.slug === 'valley-of-flowers-trek');
if (valleyOfFlowersIndex !== -1) {
  TREKS[valleyOfFlowersIndex].heroImage =
    "/Trips_gallery/Valley%20of%20flowers/8e450bc7-8b4e-4cc2-bc7c-b1a83f75d3b2.jpg.jpeg";

  TREKS[valleyOfFlowersIndex].heroImages = [
    "/Trips_gallery/Valley%20of%20flowers/8e450bc7-8b4e-4cc2-bc7c-b1a83f75d3b2.jpg.jpeg",
    "/Trips_gallery/Valley%20of%20flowers/704fe075-42f4-46e7-a9f6-8115c2d4412a.jpg.jpeg",
    "/Trips_gallery/Valley%20of%20flowers/IMG_0588.jpeg",
    "/Trips_gallery/Valley%20of%20flowers/3803e0be-5522-47c5-98ca-8706f79deb2c.jpg.jpeg"
  ];

  TREKS[valleyOfFlowersIndex].gallery = [
    { url: "/Trips_gallery/Valley%20of%20flowers/704fe075-42f4-46e7-a9f6-8115c2d4412a.jpg.jpeg", caption: "Himalayan geranium in bloom on the valley floor" },
    { url: "/Trips_gallery/Valley%20of%20flowers/7c62d034-7154-45b3-a38f-82206aebbc0f.jpg.jpeg", caption: "A single geranium among the undergrowth" },
    { url: "/Trips_gallery/Valley%20of%20flowers/7377bba1-8431-4fd7-9a9f-9e6a6b0880da.jpg.jpeg", caption: "Blue forget-me-nots along the trail" },
    { url: "/Trips_gallery/Valley%20of%20flowers/86f761a3-1e00-4057-a530-eba1749459c8.jpg.jpeg", caption: "A deep red bloom opening in the grass" },
    { url: "/Trips_gallery/Valley%20of%20flowers/8e450bc7-8b4e-4cc2-bc7c-b1a83f75d3b2.jpg.jpeg", caption: "Pink blossom on the shrubs above the valley" },
    { url: "/Trips_gallery/Valley%20of%20flowers/6b143a21-5360-4e00-869c-7a0b0808be17.jpg.jpeg", caption: "At the Valley of Flowers National Park gate" },
    { url: "/Trips_gallery/Valley%20of%20flowers/7140a762-dedc-4ec1-8f91-9485be3208a9.jpg.jpeg", caption: "Trekkers at the park entrance" },
    { url: "/Trips_gallery/Valley%20of%20flowers/58f060fc-da4b-43cc-9d8f-67611f88cdb3.jpg.jpeg", caption: "On the bridge above the river on the way in" },
    { url: "/Trips_gallery/Valley%20of%20flowers/IMG_0149.jpeg", caption: "On the road up the Bhyundar valley" },
    { url: "/Trips_gallery/Valley%20of%20flowers/IMG_0413.jpeg", caption: "The group at the campsite below the valley" },
    { url: "/Trips_gallery/Valley%20of%20flowers/3803e0be-5522-47c5-98ca-8706f79deb2c.jpg.jpeg", caption: "The batch in the valley with the tricolour" },
    { url: "/Trips_gallery/Valley%20of%20flowers/04dc4b0e-be77-4e7e-86e3-c05713783ddb.jpg.jpeg", caption: "Done — Valley of Flowers Trek, 12,000 ft" },
    { url: "/Trips_gallery/Valley%20of%20flowers/c30bb7ca-edd4-48bc-966d-b37247685896.jpg.jpeg", caption: "The batch on the meadow inside the valley" },
    { url: "/Trips_gallery/Valley%20of%20flowers/IMG_0554.jpeg", caption: "A prayer flag against the snow peaks" },
    { url: "/Trips_gallery/Valley%20of%20flowers/IMG_0383.jpeg", caption: "Bells and flags at the shrine beside the lake" },
    { url: "/Trips_gallery/Valley%20of%20flowers/IMG_0568.jpeg", caption: "The shivling and trishuls at the lakeside shrine" },
    { url: "/Trips_gallery/Valley%20of%20flowers/IMG_0588.jpeg", caption: "Hemkund lake at 14,200 ft" },
    { url: "/Trips_gallery/Valley%20of%20flowers/IMG_0843.jpeg", caption: "Hemkund Sahib gurudwara in the mist" },
    { url: "/Trips_gallery/Valley%20of%20flowers/IMG_0512.jpeg", caption: "The batch at Hemkund, snow peaks behind" },
    { url: "/Trips_gallery/Valley%20of%20flowers/e4676e13-c873-4655-8d66-bd359d31e8cf.jpg.jpeg", caption: "Done — Hemkund Sahib, 14,200 ft" }
  ];
}

const kartikSwamiIndex = TREKS.findIndex(t => t.slug === 'kartik-swami-trek');
if (kartikSwamiIndex !== -1) {
  TREKS[kartikSwamiIndex].heroImage =
    "/Trips_gallery/Kartik%20swami/0bc8b112-014d-4cac-bcce-e676223ce81b.jpg.jpeg";

  TREKS[kartikSwamiIndex].heroImages = [
    "/Trips_gallery/Kartik%20swami/0bc8b112-014d-4cac-bcce-e676223ce81b.jpg.jpeg",
    "/Trips_gallery/Kartik%20swami/6354b719-3885-4e98-a013-08ac86e5f87f.jpg.jpeg",
    "/Trips_gallery/Kartik%20swami/d4736335-697e-42fd-b8eb-60e46b56a6ec.jpg.jpeg",
    "/Trips_gallery/Kartik%20swami/e658ace0-2e4e-4739-89bc-69626e823ef5.jpg.jpeg"
  ];

  TREKS[kartikSwamiIndex].gallery = [
    { url: "/Trips_gallery/Kartik%20swami/0bc8b112-014d-4cac-bcce-e676223ce81b.jpg.jpeg", caption: "The temple on the ridge, reached by the last flight of steps" },
    { url: "/Trips_gallery/Kartik%20swami/6354b719-3885-4e98-a013-08ac86e5f87f.jpg.jpeg", caption: "Flags flying over the Kartik Swami temple" },
    { url: "/Trips_gallery/Kartik%20swami/731d87a4-9196-420a-b2ed-ffe3443f1672.jpg.jpeg", caption: "The shrine at the top of the ridge" },
    { url: "/Trips_gallery/Kartik%20swami/292fae31-983d-428a-a195-2f6365620268.jpg.jpeg", caption: "Looking out over the Garhwal ranges from the temple railing" },
    { url: "/Trips_gallery/Kartik%20swami/98a88372-edc3-4379-9b5a-d2d180414a87.jpg.jpeg", caption: "Brass bells hung along the railing above the valley" },
    { url: "/Trips_gallery/Kartik%20swami/e658ace0-2e4e-4739-89bc-69626e823ef5.jpg.jpeg", caption: "Red chunris and bells left by pilgrims on the ridge" },
    { url: "/Trips_gallery/Kartik%20swami/d4736335-697e-42fd-b8eb-60e46b56a6ec.jpg.jpeg", caption: "Offerings tied to the rocks at the summit outcrop" }
  ];
}

const adiKailashIndex = YATRAS.findIndex(y => y.slug === 'adi-kailash-om-parvat-yatra');
if (adiKailashIndex !== -1) {
  YATRAS[adiKailashIndex].heroImage =
    "/Trips_gallery/Adi%20Kailash/IMG_0285.jpeg";

  YATRAS[adiKailashIndex].heroImages = [
    "/Trips_gallery/Adi%20Kailash/IMG_0285.jpeg",
    "/Trips_gallery/Adi%20Kailash/IMG_0333.jpeg",
    "/Trips_gallery/Adi%20Kailash/IMG_0551.jpeg",
    "/Trips_gallery/Adi%20Kailash/IMG_0597.jpeg"
  ];

  YATRAS[adiKailashIndex].gallery = [
    { url: "/Trips_gallery/Adi%20Kailash/IMG_0285.jpeg", caption: "Snowbound peaks above the base at Jyolingkong" },
    { url: "/Trips_gallery/Adi%20Kailash/IMG_0333.jpeg", caption: "Darshan with folded hands before the peak" },
    { url: "/Trips_gallery/Adi%20Kailash/IMG_0551.jpeg", caption: "Trishul and prayer flags at the shrine below the peak" },
    { url: "/Trips_gallery/Adi%20Kailash/IMG_0597.jpeg", caption: "A wildflower held up against the snow line" }
  ];
}

/**
 * Gaumukh Tapovan photography from `public/Trips_gallery/Gaumukh Tapovan/`.
 *
 * Three files in that folder — `2f1b12e9…`, `9e88813e…` and `a59b72d8…` — are
 * green-meadow and turquoise-lake shots that belong to Kashmir Great Lakes, not
 * to the Bhagirathi valley; they are left out until the client confirms where
 * they go. `IMG_2336.jpg.jpeg` is a zero-byte file and is also left out.
 */
const gaumukhTapovanIndex = TREKS.findIndex(t => t.slug === 'gaumukh-tapovan-trek');
if (gaumukhTapovanIndex !== -1) {
  TREKS[gaumukhTapovanIndex].heroImage =
    "/Trips_gallery/Gaumukh%20Tapovan/IMG_2038.jpg.jpeg";

  TREKS[gaumukhTapovanIndex].heroImages = [
    "/Trips_gallery/Gaumukh%20Tapovan/IMG_2038.jpg.jpeg",
    "/Trips_gallery/Gaumukh%20Tapovan/1b1bdee8-d720-4dbe-a31a-42e80872d600.jpg.jpeg",
    "/Trips_gallery/Gaumukh%20Tapovan/a5550b7e-1f5d-4d0d-89ad-56a3964001d3.jpg.jpeg",
    "/Trips_gallery/Gaumukh%20Tapovan/IMG_2031.jpg.jpeg"
  ];

  TREKS[gaumukhTapovanIndex].gallery = [
    { url: "/Trips_gallery/Gaumukh%20Tapovan/1b1bdee8-d720-4dbe-a31a-42e80872d600.jpg.jpeg", caption: "The batch at Tapovan with Shivling behind" },
    { url: "/Trips_gallery/Gaumukh%20Tapovan/a5550b7e-1f5d-4d0d-89ad-56a3964001d3.jpg.jpeg", caption: "At Gaumukh, the snout of the Gangotri glacier" },
    { url: "/Trips_gallery/Gaumukh%20Tapovan/IMG_2314.jpg.jpeg", caption: "Offering Bhagirathi water at the glacier mouth" },
    { url: "/Trips_gallery/Gaumukh%20Tapovan/22af84f4-e6f0-47d4-9d47-1e02d83bf9ae.jpg.jpeg", caption: "Crossing the glacial stream below the Bhagirathi peaks" },
    { url: "/Trips_gallery/Gaumukh%20Tapovan/IMG_2024.jpg.jpeg", caption: "An early start up the Bhagirathi valley" },
    { url: "/Trips_gallery/Gaumukh%20Tapovan/IMG_2033.jpg.jpeg", caption: "Picking a way down through the boulder field" },
    { url: "/Trips_gallery/Gaumukh%20Tapovan/IMG_2045.jpg.jpeg", caption: "Watching the cloud build over the peaks" },
    { url: "/Trips_gallery/Gaumukh%20Tapovan/IMG_2311.jpg.jpeg", caption: "The dome shelter at Bhojbasa" },
    { url: "/Trips_gallery/Gaumukh%20Tapovan/IMG_2031.jpg.jpeg", caption: "Camp pitched at Tapovan under Shivling" },
    { url: "/Trips_gallery/Gaumukh%20Tapovan/IMG_2038.jpg.jpeg", caption: "Shivling, 21,467 ft, from Tapovan" },
    { url: "/Trips_gallery/Gaumukh%20Tapovan/IMG_2328.jpg.jpeg", caption: "Shivling above the Tapovan meadow" },
    { url: "/Trips_gallery/Gaumukh%20Tapovan/IMG_2347.jpg.jpeg", caption: "A cairn built above the Gangotri glacier" },
    { url: "/Trips_gallery/Gaumukh%20Tapovan/IMG_2027.jpg.jpeg", caption: "Primula and rhodiola in flower on the moraine" },
    { url: "/Trips_gallery/Gaumukh%20Tapovan/IMG_2003.jpg.jpeg", caption: "Hot tea on the moraine after the rain" },
    { url: "/Trips_gallery/Gaumukh%20Tapovan/IMG_2006.jpg.jpeg", caption: "Celebrating at the glacial pool under the cloud" }
  ];
}

/** Kashmir Great Lakes photography from `public/Trips_gallery/Kashmir Great Lake/`. */
const kashmirGreatLakesIndex = TREKS.findIndex(t => t.slug === 'kashmir-great-lakes-trek');
if (kashmirGreatLakesIndex !== -1) {
  TREKS[kashmirGreatLakesIndex].heroImage =
    "/Trips_gallery/Kashmir%20Great%20Lake/4cdd257d-796d-4bbc-a07b-e47c2e59d5cc.jpg.jpeg";

  TREKS[kashmirGreatLakesIndex].heroImages = [
    "/Trips_gallery/Kashmir%20Great%20Lake/4cdd257d-796d-4bbc-a07b-e47c2e59d5cc.jpg.jpeg",
    "/Trips_gallery/Kashmir%20Great%20Lake/b4a1df99-73ec-4ec5-8f4f-ee37aa90afe5.jpg.jpeg",
    "/Trips_gallery/Kashmir%20Great%20Lake/5d374332-8bf6-4c78-a045-fc2f1e8c161a.jpg.jpeg",
    "/Trips_gallery/Kashmir%20Great%20Lake/6927cf34-d52c-4c21-a2ed-a3ab98c6488d.jpg.jpeg"
  ];

  TREKS[kashmirGreatLakesIndex].gallery = [
    { url: "/Trips_gallery/Kashmir%20Great%20Lake/4cdd257d-796d-4bbc-a07b-e47c2e59d5cc.jpg.jpeg", caption: "Two of the great lakes seen from the pass above" },
    { url: "/Trips_gallery/Kashmir%20Great%20Lake/ca9bc764-4c98-4283-b4d5-149d2d43fe4a.jpg.jpeg", caption: "The line of trekkers dropping towards the lakes" },
    { url: "/Trips_gallery/Kashmir%20Great%20Lake/b4a1df99-73ec-4ec5-8f4f-ee37aa90afe5.jpg.jpeg", caption: "Gadsar Pass, 4,200 m" },
    { url: "/Trips_gallery/Kashmir%20Great%20Lake/5d374332-8bf6-4c78-a045-fc2f1e8c161a.jpg.jpeg", caption: "Done — Kashmir Great Lakes Trek, 13,750 ft" },
    { url: "/Trips_gallery/Kashmir%20Great%20Lake/1bb50573-31e6-4097-9891-c4c38daac31d.jpg.jpeg", caption: "The batch resting on the grass by the lake" },
    { url: "/Trips_gallery/Kashmir%20Great%20Lake/6927cf34-d52c-4c21-a2ed-a3ab98c6488d.jpg.jpeg", caption: "Taking in the lake at the end of the day's walk" },
    { url: "/Trips_gallery/Kashmir%20Great%20Lake/0067607e-3fc3-493c-a55a-dcdfeb2887e9.jpg.jpeg", caption: "Tents spread across the meadow campsite" },
    { url: "/Trips_gallery/Kashmir%20Great%20Lake/f4bc171a-0c70-4be2-9b33-fbd3bc7edf86.jpg.jpeg", caption: "Rain moving over the lake and the camp meadow" }
  ];
}
