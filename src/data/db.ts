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
}

export interface BatchMonth {
  month: string;
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

export interface ItineraryDay {
  day: number;
  title: string;
  description?: string;
  detailedDescription?: string;
  altitudePoints?: AltitudePoint[];
  altitudeGain?: { m: number; ft: number } | null;
  driveDistance?: string;
  drivingTime?: string;
  trekDistance?: string;
  trekDuration?: string;
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
  options?: TravelOption[];
}

export interface HowToReach {
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

export interface Trek {
  slug: string;
  name: string;
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
  relatedArticles?: RelatedArticle[];
  howToReach?: HowToReach;
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
  },
  {
    city: "Registered Office (Barkot)",
    address: "Jayara Resort and Cafe, Yamunapul, Rajgarhi, Chhatanga, Uttarakhand - 249141",
    phone: "+91-8178613438",
    email: "tripmysoulteam@gmail.com",
    timings: "Open 24/7"
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
    "slug": "yulla-kanda-trek",
    "name": "Yulla Kanda Trek",
    "price": 9000,
    "days": 4,
    "nights": 3,
    "region": "Himachal Pradesh",
    "category": "Trending Treks",
    "startLocation": "Yulla Khas  to Yulla Khas",
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
    "slug": "kedarkantha-trek",
    "name": "Kedarkantha",
    "price": 7500,
    "days": 5,
    "nights": 4,
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
    "slug": "panch-kedar-trek",
    "name": "Panch Kedar",
    "price": 35000,
    "days": 12,
    "nights": 11,
    "region": "Uttarakhand",
    "category": "trending treks",
    "startLocation": "Haridwar to Haridwar",
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

export const YATRAS: Trek[] = [
  {
    "slug": "chopta-tungnath-trek",
    "name": "Chopta Tungnath Trek",
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
    "name": "Kedarnath Yatra",
    "price": 7999,
    "days": 4,
    "nights": 3,
    "region": "Uttarakhand",
    "category": "yatra",
    "startLocation": "Haridwar To Haridwar",
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
    "slug": "kedarnath-and-tungnath-yatra",
    "name": "Kedarnath and Tungnath Yatra",
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
    "slug": "chardham-yatra",
    "name": "Chardham Yatra",
    "price": 22999,
    "days": 10,
    "nights": 9,
    "region": "Uttarakhand",
    "category": "Spiritual Journey",
    "startLocation": "Haridwar To Haridwar",
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
    "slug": "do-dham-and-tungnath-yatra",
    "name": "Do Dham And Tungnath Yatra",
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
    { title: "Pickup & Drop", description: "Transportation to and from Dehradun Railway Station." },
    { title: "Meals", description: "Vegetarian meals provided - Breakfast, Lunch, Evening Snacks, and Dinner." },
    { title: "Accommodation", description: "Tents on a triple sharing basis, including Sleeping Bags and Sleeping Mats. Wooden Homestay/Hotel accommodation on Day 1 in Sankri (Triple & Quad sharing basis)." },
    { title: "Gear", description: "Micro Spikes and Gaiters provided as per snow conditions." },
    { title: "Guides", description: "Experienced and Qualified Guides to assist you throughout the trek." }
  ];
  
  TREKS[kedarkanthaIndex].exclusions = [
    { title: "5% GST", description: "Not included in the booking fee." },
    { title: "Personal Expenses", description: "Shopping, laundry, phone calls, or tips." },
    { title: "Insurance & Medical", description: "Emergency evacuation fees or personal health insurance." },
    { title: "Travel Delay Accommodation", description: "Additional costs for accommodation or meals resulting from weather or travel delays." }
  ];

  TREKS[kedarkanthaIndex].itinerary = [
    {
      day: 1,
      title: "Dehradun to Sankri Drive",
      driveDistance: "198 km",
      drivingTime: "8-9 Hours",
      altitudePoints: [
        { location: "Dehradun", m: 640, ft: 2100 },
        { location: "Sankri", m: 1950, ft: 6400 }
      ],
      altitudeGain: { m: 1310, ft: 4300 },
      detailedDescription: "Board the morning vehicle at Dehradun Railway Station. The drive winds along the Yamuna and Tons rivers, passing Mussoorie and Netwar. Arrive in the beautiful wooden homestay village of Sankri by late afternoon. Undergo fitness briefings and gear checkups.",
      meals: "Dinner",
      stayType: "Sankri Homestay"
    },
    {
      day: 2,
      title: "Sankri to Juda-ka-Talab Trek",
      trekDistance: "4 km",
      trekDuration: "4-5 Hours",
      altitudePoints: [
        { location: "Sankri", m: 1950, ft: 6400 },
        { location: "Juda-ka-Talab", m: 2770, ft: 9100 }
      ],
      altitudeGain: { m: 820, ft: 2700 },
      detailedDescription: "Begin the climb on a marked trail through pine forests. The trail rises steadily, crossing frozen streams and oak glades. Reach Juda-ka-Talab, a high-altitude frozen lake camp, and pitch double-sharing alpine tents.",
      meals: "Breakfast, Lunch, Dinner",
      stayType: "Juda-ka-Talab Tents"
    },
    {
      day: 3,
      title: "Juda-ka-Talab to Kedarkantha Basecamp",
      trekDistance: "4 km",
      trekDuration: "3-4 Hours",
      altitudePoints: [
        { location: "Juda-ka-Talab", m: 2770, ft: 9100 },
        { location: "Base Camp", m: 3430, ft: 11250 }
      ],
      altitudeGain: { m: 660, ft: 2150 },
      detailedDescription: "Trek through thick snow lanes and open meadows. The trail enters open snow slopes with panoramic views of Bandarpoonch, Swargarohini, and Black Peak. Setup camp on the snow slopes below the summit.",
      meals: "Breakfast, Lunch, Dinner",
      stayType: "Basecamp Snow Tents"
    },
    {
      day: 4,
      title: "Kedarkantha Basecamp to Summit & Hargaon Camp",
      trekDistance: "9 km",
      trekDuration: "7-8 Hours",
      altitudePoints: [
        { location: "Base Camp", m: 3430, ft: 11250 },
        { location: "Kedarkantha Summit", m: 3810, ft: 12500 },
        { location: "Hargaon Camp", m: 2710, ft: 8900 }
      ],
      altitudeGain: { m: 380, ft: 1250 },
      detailedDescription: "Wake up at 2:00 AM for the summit climb in headlamps. Climb steep snow slopes to witness a 360-degree Himalayan sunrise from the Kedarkantha peak (12,500 ft). Descent to basecamp for hot lunch, and continue down to the pine-cleared campsite of Hargaon.",
      meals: "Breakfast, Lunch, Dinner",
      stayType: "Hargaon Forest Tents"
    },
    {
      day: 5,
      title: "Hargaon Camp to Sankri & Drive to Dehradun",
      trekDistance: "6 km",
      trekDuration: "3-4 Hours",
      driveDistance: "198 km",
      drivingTime: "8 Hours",
      altitudePoints: [
        { location: "Hargaon Camp", m: 2710, ft: 8900 },
        { location: "Sankri", m: 1950, ft: 6400 },
        { location: "Dehradun", m: 640, ft: 2100 }
      ],
      altitudeGain: null,
      detailedDescription: "Trek down from Hargaon through open meadows and pine glades back to Sankri village. Celebrate the completion of the trek, say goodbye to local guides, and board the vehicle for the return drive to Dehradun. Reach Dehradun Railway Station by 8:00 PM.",
      meals: "Breakfast, Lunch",
      stayType: "Travel / Homestay"
    }
  ];

  TREKS[kedarkanthaIndex].faqs = [
    { title: "What is the Kedarkantha Trek?", description: "The Kedarkantha Trek is a famous 5-day high-altitude winter trek in Uttarkashi, Uttarakhand, offering incredible snow trails and a peak altitude of 12,500 feet." },
    { title: "Is it suitable for beginners?", description: "Yes, Kedarkantha is one of the best winter treks for beginners. It requires a basic fitness level but has clear trails and gradual ascents." },
    { title: "What is the temperature in winter?", description: "In winter, day temperatures range between 8°C and 15°C, while night temperatures can drop to -5°C or -10°C. Heavy winter gear is highly recommended." }
  ];

  TREKS[kedarkanthaIndex].batches = {
    years: {
      "2026": {
        months: [
          {
            month: "Oct",
            trips: [
              { startDate: "05 Oct", endDate: "10 Oct", status: "Open" },
              { startDate: "12 Oct", endDate: "17 Oct", status: "Open" },
              { startDate: "19 Oct", endDate: "24 Oct", status: "Open" }
            ]
          },
          {
            month: "Nov",
            trips: [
              { startDate: "02 Nov", endDate: "07 Nov", status: "Open" },
              { startDate: "09 Nov", endDate: "14 Nov", status: "Open" },
              { startDate: "16 Nov", endDate: "21 Nov", status: "Open" },
              { startDate: "23 Nov", endDate: "28 Nov", status: "Open" }
            ]
          },
          {
            month: "Dec",
            trips: [
              { startDate: "05 Dec", endDate: "10 Dec", status: "Open" },
              { startDate: "12 Dec", endDate: "17 Dec", status: "Open" },
              { startDate: "18 Dec", endDate: "23 Dec", status: "Filling Fast" },
              { startDate: "24 Dec", endDate: "29 Dec", status: "Closed" }
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
