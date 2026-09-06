"use client";

import React, { useState, useMemo, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Compass, Shield, Leaf, ArrowRight, Star, MapPin, Award, Search, ArrowUpDown, SlidersHorizontal,
  Users, Trophy, CheckCircle, FileText, Video, Activity, Play, Filter,
  GraduationCap, CreditCard, ShieldCheck, Backpack, RefreshCcw, Sparkles, UserRound, Triangle,
  X, ChevronLeft, ChevronRight
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { TREKS, YATRAS, WHY_CHOOSE_US, TRUST_STATS, Trek } from "@/data/db";
import TrekCard from "@/components/TrekCard";
import SwiperCarousel from "@/components/SwiperCarousel";
import CategoryCarousel from "@/components/CategoryCarousel";
import HeroSection from "@/components/HeroSection";
import FilterPanel, { FilterState } from "@/components/FilterPanel";
import {
  WEEKEND_TRIPS,
  BACKPACKING_TRIPS,
  TripListingItem,
  tripToTrek,
} from "@/data/trips";
import { departsWithinWindow } from "@/lib/upcoming";
import { featuredRank } from "@/lib/featured";

const initialFilters: FilterState = {
  region: [],
  difficulty: [],
  months: [],
  duration: [],
  themes: [],
  seasons: [],
  upcomingOnly: false,
};

const SEASON_MAP: Record<string, string[]> = {
  "Winter": ["Dec", "Jan", "Feb"],
  "Spring": ["Mar", "Apr"],
  "Summer": ["May", "Jun"],
  "Monsoon": ["Jul", "Aug"],
  "Autumn": ["Sep", "Oct", "Nov"]
};

/**
 * One row of the "Find Your Next Healing Journey" grid. Treks render straight
 * from `Trek`; catalogue trips carry their own hero image and detail route, so
 * those overrides ride along with the adapted trek.
 */
interface CatalogEntry {
  trek: Trek;
  detailsHref?: string;
  imageUrl?: string;
  description?: string;
  /** ISO departure dates, where the source lists real batches. */
  batchDates?: string[];
}

const tripEntry = (trip: TripListingItem): CatalogEntry => ({
  trek: tripToTrek(trip),
  detailsHref: trip.detailsPath,
  imageUrl: trip.heroImage,
  description: trip.tagline,
  batchDates: trip.batchDates,
});

const dedupeBySlug = (entries: CatalogEntry[]): CatalogEntry[] => {
  const seen = new Set<string>();
  return entries.filter((entry) => {
    if (seen.has(entry.trek.slug)) return false;
    seen.add(entry.trek.slug);
    return true;
  });
};

/** Categories on `TREKS` that belong to the weekend-trips collection. */
const isWeekendCategory = (category: string) =>
  category.toLowerCase().includes("weekend");

/** Collections behind the quick-filter pills. Keys match `CollectionKey`. */
const COLLECTIONS: Record<"all" | "yatra" | "weekend" | "backpacking", CatalogEntry[]> = {
  all: dedupeBySlug([
    ...TREKS.map((trek) => ({ trek })),
    ...YATRAS.map((trek) => ({ trek })),
  ]),
  yatra: YATRAS.map((trek) => ({ trek })),
  weekend: dedupeBySlug([
    ...WEEKEND_TRIPS.map(tripEntry),
    ...TREKS.filter((trek) => isWeekendCategory(trek.category)).map((trek) => ({ trek })),
  ]),
  backpacking: BACKPACKING_TRIPS.map(tripEntry),
};

type CollectionKey = keyof typeof COLLECTIONS;

/** True when a catalogue entry has a published departure inside the window. */
const entryIsUpcoming = (entry: CatalogEntry): boolean =>
  departsWithinWindow(entry.trek, entry.batchDates);

/** One question row inside a help category. */
interface FaqItem {
  q: string;
  a: string;
  link?: string;
  linkText?: string;
}

/** A pill tab above the FAQ accordion, plus the questions it filters to. */
interface FaqCategory {
  id: string;
  label: string;
  icon: LucideIcon;
  items: FaqItem[];
}

/**
 * Homepage help centre, grouped into the categories TripMySoul actually
 * serves — treks, yatras, summer camps, gear rental and the policy pages.
 * The first category is the one selected on load.
 *
 * TODO(content): questions marked below are structural placeholders written
 * from existing site copy — have ops/support review the answers, and the
 * pages they link to, before this goes live.
 */
const FAQ_CATEGORIES: FaqCategory[] = [
  {
    id: "beginners",
    label: "Beginners Guide",
    icon: GraduationCap,
    items: [
      {
        q: "What is included in the TripMySoul trek package?",
        a: "Our trek packages include all high-altitude camping lodging (alpine tents/homestays), certified mountaineering guides, organic vegetarian meals on trail, forest permits, safety equipment (oxygen cylinders, SpO2 meters, stretcher tents), and baseline emergency medical support."
      },
      {
        // TODO(content): confirm the recommended first-timer treks with ops.
        q: "Which trek should I pick as a first-timer?",
        a: "Start with an easy-to-moderate Himalayan trail of 4-6 days with gradual altitude gain. Kedarkantha and Brahmatal are the batches we most often recommend for a first Himalayan expedition.",
        link: "/treks",
        linkText: "Browse beginner-friendly treks →"
      },
      {
        // TODO(content): fitness benchmark needs sign-off from the safety team.
        q: "How fit do I need to be before my first Himalayan trek?",
        a: "Aim to comfortably cover 5 km in about 35 minutes, four days a week, for at least a month before departure. We share a graded fitness plan with every confirmed trekker after booking."
      }
    ]
  },
  {
    id: "booking",
    label: "Booking Guide",
    icon: CreditCard,
    items: [
      {
        q: "How do I book a departure date for a trek?",
        a: "Explore our trek catalog, select your preferred departure batch date from the batch schedule, enter your trekker information, and click 'Book Expedition Slot' to reserve your seat instantly."
      },
      {
        // TODO(content): verify part-payment terms against the payment policy page.
        q: "Can I reserve a slot with a part payment?",
        a: "Batches can be held with an advance, with the balance due before the departure cut-off shown on your booking. Payment timelines and accepted modes are listed in our payment policy.",
        link: "/policies/payment-policy",
        linkText: "Read the Payment Policy →"
      },
      {
        // TODO(content): confirm the transfer window and any admin fee.
        q: "Can I move my booking to another batch or trekker?",
        a: "Batch and name transfers are handled by our support team, subject to seat availability on the new departure. Reach out with your booking ID and we will confirm the change in writing.",
        link: "/contact-us",
        linkText: "Talk to our booking desk →"
      }
    ]
  },
  {
    id: "safety",
    label: "Safety & Health",
    icon: ShieldCheck,
    items: [
      {
        q: "What safety protocols are followed on high-altitude treks?",
        a: "Every expedition carries medical emergency kits, portable oxygen cylinders, pulse oximeters, and hyperbaric safety equipment managed by certified Wilderness First Responder guide staff."
      },
      {
        // TODO(content): align this wording with the on-trail AMS protocol.
        q: "What happens if a trekker shows symptoms of altitude sickness?",
        a: "Guides run twice-daily SpO2 and pulse checks. At the first sign of AMS the trekker is put on oxygen and monitored, and if symptoms persist they are escorted down to a lower camp with a support staff member."
      },
      {
        // TODO(content): confirm age limits and medical declaration requirements.
        q: "Is there an age or medical limit for high-altitude treks?",
        a: "Each trek page lists its own age band, and every trekker submits a medical declaration before departure. Trekkers with cardiac, respiratory or blood-pressure conditions need a doctor's clearance."
      }
    ]
  },
  {
    id: "rentals",
    label: "Gear on Rent",
    icon: Backpack,
    items: [
      {
        q: "Do you provide high-altitude trekking gear on rent?",
        a: "Yes! We offer rental down jackets (-10°C rated), high-ankle waterproof trekking boots, trekking poles, thermal liners, and rain ponchos directly through our store.",
        link: "/rent",
        linkText: "Explore Gear Rental Store →"
      },
      {
        // TODO(content): confirm pickup/return points per region with the rental desk.
        q: "Where do I collect and return rented gear?",
        a: "Rented gear is handed over at the basecamp briefing on day one and collected back at the end of the trek, so you never carry it on the road journey.",
        link: "/rent",
        linkText: "See what's available on rent →"
      },
      {
        // TODO(content): damage/loss charges must come from the rental terms.
        q: "What if rented gear is damaged or lost on the trail?",
        a: "Normal trail wear is expected and never charged. Loss or damage beyond that is billed at the replacement value listed on the rental agreement you sign at handover."
      }
    ]
  },
  {
    id: "cancellation",
    label: "Cancellation Policy",
    icon: RefreshCcw,
    items: [
      {
        q: "What is the cancellation and refund policy?",
        a: "Cancellations made 30+ days prior to departure receive a 90% monetary refund or 100% voucher credit valid for 1 year.",
        link: "/policies/cancellation-policy",
        linkText: "View official Cancellation Policy →"
      },
      {
        // TODO(content): confirm the weather-cancellation remedy with ops.
        q: "What if TripMySoul calls off a departure?",
        a: "If we cancel a batch for weather, road closures or safety reasons, you may shift to any other departure of the same value or take a full voucher credit. The choice is yours.",
        link: "/policies/cancellation-policy",
        linkText: "View official Cancellation Policy →"
      },
      {
        // TODO(content): verify the actual refund turnaround with finance.
        q: "How long does a refund take to reach my account?",
        a: "Approved refunds are processed back to the original payment method, and the credit timeline then depends on your bank or card issuer.",
        link: "/policies/payment-policy",
        linkText: "Read the Payment Policy →"
      }
    ]
  },
  {
    id: "family",
    label: "Family & Kids",
    icon: Users,
    items: [
      {
        // TODO(content): pick the family-suitable trail list with ops.
        q: "Which treks work for families with children?",
        a: "Short, low-altitude weekend trails and homestay-based itineraries suit families best. They keep daily walking hours short and never leave you far from a road head.",
        link: "/weekend-trips",
        linkText: "See weekend trips →"
      },
      {
        // TODO(content): confirm the summer camp age band.
        q: "What is the minimum age for summer camps?",
        a: "Our summer camps run as supervised, age-grouped batches with a dedicated camp team. Each camp page lists the age band it accepts.",
        link: "/summer-camps",
        linkText: "Explore summer camps →"
      },
      {
        // TODO(content): confirm whether non-trekking companions can be hosted.
        q: "Can non-trekking family members join at the basecamp?",
        a: "On most itineraries companions can stay at the basecamp property while the group is on the trail. Availability varies by region, so please check with us before booking.",
        link: "/contact-us",
        linkText: "Ask about basecamp stays →"
      }
    ]
  },
  {
    id: "yatra",
    label: "Spiritual Yatras",
    icon: Sparkles,
    items: [
      {
        // TODO(content): have the yatra desk review this comparison.
        q: "How is a yatra different from a trek?",
        a: "Yatras are paced around the pilgrimage itself, with shorter walking days, vehicle support where the route allows, and time reserved at each shrine rather than at a summit.",
        link: "/yatra",
        linkText: "Explore spiritual yatras →"
      },
      {
        // TODO(content): confirm what darshan arrangements are actually included.
        q: "Are darshan and temple arrangements included?",
        a: "Each yatra page lists the shrines covered and what the package arranges on the ground, including stays close to the temple complex."
      },
      {
        // TODO(content): confirm accessibility support for senior pilgrims.
        q: "Are yatra routes manageable for senior travellers?",
        a: "Most of our yatra routes are chosen to be senior-friendly, with graded walking days and rest halts. We will talk you through the route profile before you book."
      }
    ]
  },
  {
    id: "women",
    label: "Women Trekkers",
    icon: UserRound,
    items: [
      {
        // TODO(content): confirm women-only batch availability and leader rostering.
        q: "Do you run women-only batches?",
        a: "We schedule women-only departures on select trails through the season, and women trek leaders join mixed batches wherever rostering allows.",
        link: "/treks",
        linkText: "Check upcoming departures →"
      },
      {
        // TODO(content): confirm the tent-sharing policy for solo women trekkers.
        q: "How are tent-sharing arrangements handled for solo women?",
        a: "Solo women trekkers are paired only with other women in shared tents, and camps are laid out with separate, screened washroom tents."
      },
      {
        // TODO(content): confirm the pickup-point support offered to solo travellers.
        q: "Is it safe to travel solo to the pickup point?",
        a: "Our team shares verified travel options and stays reachable on call through your journey to the basecamp pickup point, so you are never navigating the last leg alone."
      }
    ]
  }
];

// Traveller video reviews (YouTube Shorts IDs)
const YOUTUBE_SHORTS = [
  "FS6NI7Nf8Ks",
  "XNOrJds6GzM",
  "Ki_DVHtDHY8",
  "fgJrD034ZMo",
  "pJ9esoHTl7g",
  "2kiN04lZm3w",
  "BlqxzWWO-bA",
  "dF1S-eVRZ2k",
  "pKyGupLGzqA",
  "k5eQTVJ5q1I",
];

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilters, setSelectedFilters] = useState<FilterState>(initialFilters);
  const [sortBy, setSortBy] = useState("price-asc");
  const [activeCollection, setActiveCollection] = useState<CollectionKey>("all");

  // FAQ category tabs + accordion state. The open row is an index into the
  // active category's questions, so it resets whenever the category changes.
  const [activeFaqCategory, setActiveFaqCategory] = useState(FAQ_CATEGORIES[0].id);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const activeFaqItems =
    FAQ_CATEGORIES.find((category) => category.id === activeFaqCategory)?.items ?? [];

  // Section 4 "Top Treks This Season" filters state
  const [seasonRegionFilter, setSeasonRegionFilter] = useState("All");
  const [seasonDifficultyFilter, setSeasonDifficultyFilter] = useState("All");
  const [seasonPriceFilter, setSeasonPriceFilter] = useState("All");

  // Tab states for Social Proof & Stay Informed sections
  const [activeTrustTab, setActiveTrustTab] = useState<"trusted" | "reviews" | "youtube" | "awards">("trusted");
  const [activeInformedTab, setActiveInformedTab] = useState<"updates" | "articles" | "videos">("updates");

  // Fullscreen lightbox for the traveller video reviews (null = closed)
  const [activeShortIndex, setActiveShortIndex] = useState<number | null>(null);

  const closeShort = useCallback(() => setActiveShortIndex(null), []);
  const stepShort = useCallback((delta: number) => {
    setActiveShortIndex((current) =>
      current === null
        ? current
        : (current + delta + YOUTUBE_SHORTS.length) % YOUTUBE_SHORTS.length
    );
  }, []);

  // Keyboard controls + page scroll lock while the lightbox is open
  useEffect(() => {
    if (activeShortIndex === null) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeShort();
      if (event.key === "ArrowRight") stepShort(1);
      if (event.key === "ArrowLeft") stepShort(-1);
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [activeShortIndex, closeShort, stepShort]);

  // Filtered Top Treks for Section 4
  const filteredSeasonTreks = useMemo(() => {
    return TREKS.filter((t) => {
      if (seasonRegionFilter !== "All" && t.region !== seasonRegionFilter) return false;
      if (seasonDifficultyFilter !== "All" && !t.difficulty.toLowerCase().includes(seasonDifficultyFilter.toLowerCase())) return false;
      if (seasonPriceFilter === "under-10k" && (t.price || 0) >= 10000) return false;
      if (seasonPriceFilter === "10k-15k" && ((t.price || 0) < 10000 || (t.price || 0) > 15000)) return false;
      if (seasonPriceFilter === "above-15k" && (t.price || 0) <= 15000) return false;
      return true;
    }).slice(0, 8);
  }, [seasonRegionFilter, seasonDifficultyFilter, seasonPriceFilter]);

  // Real-time trek search & filter matching
  const filteredEntries = useMemo(() => {
    return COLLECTIONS[activeCollection].filter(({ trek }) => {
      // 1. Search text query
      const matchesSearch =
        trek.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        trek.region.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (trek.startLocation && trek.startLocation.toLowerCase().includes(searchQuery.toLowerCase()));

      if (!matchesSearch) return false;

      // 2. Region Filter
      if (selectedFilters.region.length > 0 && !selectedFilters.region.includes(trek.region)) {
        return false;
      }

      // 3. Difficulty Filter
      if (selectedFilters.difficulty.length > 0) {
        const matchesDiff = selectedFilters.difficulty.some((diff) => {
          if (diff === "Easy-Moderate") return trek.difficulty.includes("Easy") || trek.difficulty.toLowerCase().includes("moderate");
          if (diff === "Moderate-Difficult") return trek.difficulty.toLowerCase().includes("moderate") || trek.difficulty.toLowerCase().includes("difficult");
          return trek.difficulty.toLowerCase().includes(diff.toLowerCase());
        });
        if (!matchesDiff) return false;
      }

      // 4. Month Filter
      if (selectedFilters.months.length > 0) {
        const hasMatchingMonth = trek.months.some((m) => selectedFilters.months.includes(m));
        if (!hasMatchingMonth) return false;
      }

      // 5. Season Filter
      if (selectedFilters.seasons.length > 0) {
        const hasMatchingSeason = selectedFilters.seasons.some((season) => {
          const seasonMonths = SEASON_MAP[season] || [];
          return trek.months.some((m) => seasonMonths.includes(m));
        });
        if (!hasMatchingSeason) return false;
      }

      // 6. Theme Filter
      if (selectedFilters.themes.length > 0) {
        const matchesTheme = selectedFilters.themes.some((theme) => {
          if (theme === "Lakes") return trek.themes.some(t => t.toLowerCase().includes("lake")) || trek.name.toLowerCase().includes("lake");
          if (theme === "Snow") return trek.themes.some(t => t.toLowerCase().includes("snow")) || trek.name.toLowerCase().includes("winter");
          if (theme === "Meadow") return trek.themes.some(t => t.toLowerCase().includes("meadow"));
          if (theme === "Glacier") return trek.themes.some(t => t.toLowerCase().includes("glacier"));
          if (theme === "Beginner") return trek.difficulty.toLowerCase().includes("easy") || (trek.days && parseInt(trek.days.toString()) <= 4);
          if (theme === "Family with Kids") return trek.themes.some(t => t.toLowerCase().includes("family")) || (trek.days && parseInt(trek.days.toString()) <= 5);
          if (theme === "Summit a Peak") return trek.themes.some(t => t.toLowerCase().includes("summit") || t.toLowerCase().includes("peak")) || trek.name.toLowerCase().includes("peak") || trek.name.toLowerCase().includes("ghati");
          return trek.themes.some(t => t.toLowerCase().includes(theme.toLowerCase()));
        });
        if (!matchesTheme) return false;
      }

      // 7. Duration Filter
      if (selectedFilters.duration.length > 0) {
        const days = typeof trek.days === "number" ? trek.days : parseInt(trek.days || "0");
        const matchesDuration = selectedFilters.duration.some((range) => {
          if (range.startsWith("Short") && days <= 4) return true;
          if (range.startsWith("Medium") && days >= 5 && days <= 7) return true;
          if (range.startsWith("Long") && days >= 8 && days <= 10) return true;
          if (range.startsWith("Expedition") && days >= 11) return true;
          return false;
        });
        if (!matchesDuration) return false;
      }

      return true;
    })
    // 8. Upcoming Departures Filter — anything leaving in the next 60 days
    .filter((entry) => !selectedFilters.upcomingOnly || entryIsUpcoming(entry));
  }, [searchQuery, selectedFilters, activeCollection]);

  // Sort treks
  const sortedEntries = useMemo(() => {
    const entriesCopy = [...filteredEntries];
    return entriesCopy.sort(({ trek: a }, { trek: b }) => {
      // Fully written-up treks lead the list, whatever sort is selected.
      const featured = featuredRank(a.slug) - featuredRank(b.slug);
      if (featured !== 0) return featured;

      const priceA = a.price || 0;
      const priceB = b.price || 0;
      const daysA = typeof a.days === "number" ? a.days : parseInt(a.days || "0");
      const daysB = typeof b.days === "number" ? b.days : parseInt(b.days || "0");

      switch (sortBy) {
        case "price-asc":
          return priceA - priceB;
        case "price-desc":
          return priceB - priceA;
        case "days-asc":
          return daysA - daysB;
        case "days-desc":
          return daysB - daysA;
        default:
          return 0;
      }
    });
  }, [filteredEntries, sortBy]);

  const handleResetFilters = () => {
    setSelectedFilters(initialFilters);
    setSearchQuery("");
    setActiveCollection("all");
  };

  /** Pills are exclusive: picking one clears the rest, clicking it again clears all. */
  const applyPill = (isActive: boolean, apply: () => void) => {
    if (isActive) {
      handleResetFilters();
      return;
    }
    setSelectedFilters(initialFilters);
    setActiveCollection("all");
    apply();
  };

  const selectCollection = (key: CollectionKey) =>
    applyPill(activeCollection === key, () => setActiveCollection(key));

  const selectSeason = (season: string) =>
    applyPill(selectedFilters.seasons.includes(season), () =>
      setSelectedFilters({ ...initialFilters, seasons: [season] })
    );

  const quickFilters = [
    {
      label: "Upcoming",
      action: () =>
        applyPill(selectedFilters.upcomingOnly, () =>
          setSelectedFilters({ ...initialFilters, upcomingOnly: true })
        ),
      active: selectedFilters.upcomingOnly,
    },
    { label: "Winter", action: () => selectSeason("Winter"), active: selectedFilters.seasons.includes("Winter") },
    { label: "Spiritual Journey", action: () => selectCollection("yatra"), active: activeCollection === "yatra" },
    { label: "Weekend Trips", action: () => selectCollection("weekend"), active: activeCollection === "weekend" },
    { label: "Monsoon", action: () => selectSeason("Monsoon"), active: selectedFilters.seasons.includes("Monsoon") },
    { label: "Summer", action: () => selectSeason("Summer"), active: selectedFilters.seasons.includes("Summer") },
    { label: "Spring", action: () => selectSeason("Spring"), active: selectedFilters.seasons.includes("Spring") },
    { label: "Backpacking Trips", action: () => selectCollection("backpacking"), active: activeCollection === "backpacking" },
  ];

  const awardsData = [
    {
      title: "National Responsible Tourism Award",
      organization: "Himalayan Safety Council",
      year: "2025",
      image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=400&q=80",
    },
    {
      title: "Best High-Altitude Trek Operator",
      organization: "India Adventure Summit",
      year: "2024",
      image: "https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?auto=format&fit=crop&w=400&q=80",
    },
    {
      title: "Eco-Friendly Mountain Trail Certified",
      organization: "Green Himalaya Project",
      year: "2025",
      image: "https://images.unsplash.com/photo-1531545514256-b1400bc00f31?auto=format&fit=crop&w=400&q=80",
    },
  ];

  const googleReviewsData = [
    {
      name: "Rohan Kapoor",
      rating: 5,
      date: "2 weeks ago",
      trek: "Buran Ghati Pass Trek",
      text: "The ice wall slide at Buran Ghati was the highlight of my life! Guides carried safety ropes and SpO2 meters at every single camp. Food was outstanding.",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80"
    },
    {
      name: "Pooja Malhotra",
      rating: 5,
      date: "1 month ago",
      trek: "Kedarkantha Winter Summit",
      text: "Booked Kedarkantha with TripMySoul for my family. Super clean tents, warm sleeping bags, and extremely polite staff. 10/10 recommendation!",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80"
    },
    {
      name: "Vikramaditya Singh",
      rating: 5,
      date: "2 months ago",
      trek: "Kashmir Great Lakes",
      text: "Everything was perfectly coordinated from Srinagar pickup to final drop. Felt 100% safe as a solo trekker.",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&q=80"
    }
  ];


  const trustedByData = [
    { name: "NIDHI+", desc: "National Integrated Database of Hospitality Industry", image: "/trusted/nidhi_plus.png" },
    { name: "Indian Army", desc: "Indian Armed Forces", image: "/trusted/indian_army.png" },
    { name: "IIT Kharagpur", desc: "Indian Institute of Technology Kharagpur", image: "/trusted/iit_kharagpur.png" },
    { name: "IMF", desc: "Indian Mountaineering Foundation", image: "/trusted/imf.png" },
    { name: "The Doon School", desc: "The Doon School", image: "/trusted/doon_school.png" },
    { name: "Uttarakhand Tourism", desc: "State Registered Adventure Operator", image: "/trusted/uttarakhand_tourism.png" },
    { name: "Startup India", desc: "Government of India Initiative", image: "/trusted/startup_india.png" },
    { name: "ATOAI", desc: "Adventure Tour Operators Association of India", image: "/trusted/atoai.png" },
    { name: "MSME", desc: "Micro, Small & Medium Enterprises", image: "/trusted/msme.png" },
    { name: "Ministry of Tourism", desc: "Government of India", image: "/trusted/ministry_tourism.png" },
  ];

  const latestUpdatesData = [
    {
      date: "21 Jul 2026",
      type: "Weather Advisory",
      title: "Buran Ghati Pass Weather Update",
      text: "Trails are clear with fresh snow on upper passes. Batches are proceeding with microspikes and certified safety leaders."
    },
    {
      date: "18 Jul 2026",
      type: "Snow Conditions",
      title: "Kedarkantha Winter Trail Status",
      text: "Summit snow depth is 15cm. Clear sunny mornings with crisp summit views reported by ongoing batches."
    },
    {
      date: "15 Jul 2026",
      type: "Permit Update",
      title: "Valley of Flowers Entry Timings",
      text: "Forest department entry window opened at 6:00 AM. Medical declarations required at baseline registration."
    }
  ];

  const informativeVideosData = [
    {
      title: "Buran Ghati Pass Crossing & Ice Slide Guide",
      duration: "8:45 mins",
      views: "24K views",
      image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=500&q=80"
    },
    {
      title: "Kedarkantha Summit Walkthrough & Packing Tips",
      duration: "12:10 mins",
      views: "45K views",
      image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=500&q=80"
    },
    {
      title: "How to Pack a 60L Rucksack for High Altitude",
      duration: "6:30 mins",
      views: "18K views",
      image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=500&q=80"
    }
  ];

  const blogPosts = [
    {
      title: "Kedarkantha Trek in Winter: A Complete Prep Guide",
      excerpt: "Essential gear, physical fitness routines, and itinerary breakdown for India's best winter peak trek.",
      category: "Preparation Guide",
      date: "July 15, 2026",
      image: "https://images.unsplash.com/photo-1486916856992-e4db22c8df33?auto=format&fit=crop&w=500&q=80",
    },
    {
      title: "Why Kashmir Great Lakes Should Be on Your Bucket List",
      excerpt: "A detailed account of the magical landscapes, pristine lakes, and alpine flower valleys.",
      category: "Trek Stories",
      date: "June 28, 2026",
      image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=500&q=80",
    },
    {
      title: "Sustainable Trekking: Leave No Trace in the Himalayas",
      excerpt: "How TripMySoul aims to clean high-altitude garbage, reduce plastic, and support local mountain economies.",
      category: "Sustainability",
      date: "May 10, 2026",
      image: "https://images.unsplash.com/photo-1533240332313-0db49b439ad3?auto=format&fit=crop&w=500&q=80",
    },
  ];

  const instagramPosts = [
    "/Instagram_stories/IMG_3927.JPG.jpeg",
    "/Instagram_stories/IMG_3929.JPG.jpeg",
    "/Instagram_stories/IMG_3932.JPG.jpeg",
    "/Instagram_stories/IMG_3933.JPG.jpeg",
    "/Instagram_stories/IMG_3935.JPG.jpeg",
    "/Instagram_stories/IMG_3938.jpeg",
  ];

  return (
    <div className="w-full relative bg-brand-warm-bg overflow-x-hidden">
      {/* SECTION 1: HERO — Background Slideshow + Google Reviews Widget */}
      <HeroSection />

      {/* SECTION 2: CATEGORY QUICK-NAV CAROUSEL */}
      <CategoryCarousel />

      {/* SECTION 3: "EXPLORE EXPEDITIONS" (Find Your Next Healing Journey) — Main trek filter grid */}
      <section id="explore-treks" className="py-10 sm:py-16 bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          {/* Header Description Banner */}
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-extrabold uppercase tracking-widest text-brand-dusk-orange bg-brand-forest/5 px-3.5 py-1.5 rounded-full inline-block">
              EXPLORE EXPEDITIONS
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-serif text-brand-dark-text leading-tight">
              Find Your Next Healing Journey
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 leading-relaxed font-medium">
              Find your next healing journey from our verified high-altitude expeditions. Filter by region, month, theme, or difficulty level.
            </p>
          </div>

          {/* Search bar & Sort Controls */}
          <div className="bg-white border border-gray-150 p-4 sm:p-6 rounded-3xl shadow-sm space-y-4 max-w-5xl mx-auto">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              {/* Search input */}
              <div className="flex items-center gap-2 px-4 py-3 min-h-[48px] bg-brand-warm-bg rounded-2xl border border-gray-150 w-full min-w-0 sm:flex-1">
                <Search className="w-4 h-4 text-gray-400 shrink-0" />
                <input
                  type="text"
                  placeholder="Search treks (e.g. Kedarkantha, Sankri)..."
                  aria-label="Search treks"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent border-0 text-base lg:text-sm focus:outline-none w-full min-w-0 text-brand-dark-text placeholder-gray-400 font-sans self-stretch py-3 -my-3"
                />
              </div>

              {/* Sort selector */}
              <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto min-h-[48px] justify-between sm:justify-end border border-gray-150 rounded-2xl px-4 py-2.5 bg-white">
                <ArrowUpDown className="w-4 h-4 text-brand-forest shrink-0" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  aria-label="Sort treks"
                  className="text-base lg:text-xs font-bold bg-transparent border-0 focus:outline-none text-brand-dark-text font-sans cursor-pointer min-w-0 max-w-full self-stretch py-3 -my-3"
                >
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="days-asc">Duration: Short to Long</option>
                  <option value="days-desc">Duration: Long to Short</option>
                </select>
              </div>
            </div>

            {/* Quick Filter Pill Buttons */}
            <div className="flex overflow-x-auto no-scrollbar scroll-touch gap-2.5 pt-2 pb-1 whitespace-nowrap -mx-4 px-4 sm:mx-0 sm:px-0">
              {quickFilters.map((pill) => (
                <button
                  key={pill.label}
                  onClick={pill.action}
                  className={`text-xs px-4 min-h-[44px] shrink-0 rounded-full border font-bold transition-all duration-200 font-sans ${
                    pill.active
                      ? "bg-[#0B2545] text-white border-[#0B2545] shadow-xs"
                      : "bg-white text-gray-700 border-gray-250 hover:border-[#0B2545]/40"
                  }`}
                >
                  {pill.label}
                </button>
              ))}
            </div>
          </div>

          {/* Treks List Section with Facets */}
          <div className="flex flex-col lg:flex-row gap-8 items-start pt-4">
            {/* Desktop Filter Panel */}
            <FilterPanel
              selectedFilters={selectedFilters}
              onFilterChange={setSelectedFilters}
              onReset={handleResetFilters}
            />

            {/* Treks Grid / Carousel */}
            <div className="flex-grow min-w-0 w-full space-y-6 pb-24 lg:pb-0">
              <div className="flex justify-between items-center gap-3 text-xs font-black uppercase tracking-wider text-gray-400 font-sans pl-1">
                <span className="shrink-0">SHOWING {sortedEntries.length} TREKS</span>
                <span className="text-[10px] text-brand-forest font-semibold truncate text-right">
                  <span className="sm:hidden">Swipe to explore →</span>
                  <span className="hidden sm:inline">Swipe / Click arrows to explore →</span>
                </span>
              </div>

              {sortedEntries.length > 0 ? (
                <SwiperCarousel
                  key={`${searchQuery}-${sortBy}-${activeCollection}-${JSON.stringify(selectedFilters)}`}
                  slidesPerView={1}
                  spaceBetween={20}
                  showNavigation={true}
                  showPagination={false}
                  breakpoints={{
                    640: { slidesPerView: 1, spaceBetween: 16 },
                    768: { slidesPerView: 2, spaceBetween: 20 },
                    1280: { slidesPerView: 3, spaceBetween: 24 },
                  }}
                >
                  {sortedEntries.map((entry) => (
                    <TrekCard
                      key={entry.trek.slug}
                      trek={entry.trek}
                      detailsHref={entry.detailsHref}
                      imageUrl={entry.imageUrl}
                      description={entry.description}
                    />
                  ))}
                </SwiperCarousel>
              ) : (
                <div className="text-center bg-white border border-gray-100 rounded-3xl px-5 py-10 sm:p-12 max-w-xl mx-auto space-y-4 shadow-xs">
                  <SlidersHorizontal className="w-10 h-10 text-brand-dusk-orange mx-auto animate-pulse" />
                  <h3 className="text-base font-bold text-brand-dark-text">No matching treks found</h3>
                  <p className="text-xs text-gray-500">
                    Try loosening your filters, changing the region, or resetting search options.
                  </p>
                  <button
                    onClick={handleResetFilters}
                    className="inline-flex items-center justify-center min-h-[44px] px-5 py-2.5 rounded-full bg-brand-forest hover:bg-brand-forest-light text-white font-bold text-xs shadow-md transition"
                  >
                    Clear all filters
                  </button>
                </div>
              )}
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 4: "WHY CHOOSE TRIPMYSOUL?" — Trust & safety standards */}
      <section id="why-choose-us" className="py-10 sm:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-12">
          
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-extrabold uppercase tracking-widest text-brand-dusk-orange bg-brand-forest/5 px-3.5 py-1.5 rounded-full inline-block">
              TRUST & SAFETY STANDARDS
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-brand-dark-text font-serif leading-tight">
              Why Choose TripMySoul?
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 leading-relaxed font-medium">
              Dedicated to mountaineering safety, eco-conscious trail stewardship, and authentic local guides across the Himalayas.
            </p>
          </div>

          {/* Core Pillars Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            {WHY_CHOOSE_US.map((metric, idx) => {
              const Icon = metric.icon === "Shield" ? Shield : metric.icon === "Leaf" ? Leaf : Compass;
              return (
                <div
                  key={idx}
                  className="bg-brand-warm-bg/40 border border-gray-150 rounded-3xl p-5 sm:p-6 hover:shadow-md transition-shadow duration-300 space-y-3 flex flex-col justify-between min-w-0"
                >
                  <div className="space-y-3">
                    <div className="w-10 h-10 shrink-0 rounded-2xl bg-brand-forest/10 flex items-center justify-center text-brand-forest">
                      <Icon className="w-5 h-5 text-brand-dusk-orange" />
                    </div>
                    <h3 className="text-base font-bold text-brand-dark-text break-words">{metric.title}</h3>
                    <p className="text-xs text-gray-600 leading-relaxed font-medium">{metric.description}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* FOLDED STATS BAR */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 pt-2">
            <div className="bg-[#0B2545] text-white rounded-2xl p-4 sm:p-5 text-center shadow-md space-y-1 min-w-0">
              <Users className="w-6 h-6 text-brand-dusk-orange mx-auto" />
              <span className="text-2xl sm:text-3xl font-extrabold block leading-none pt-1 break-words">500,000+</span>
              <span className="text-[10px] sm:text-xs text-gray-300 font-bold uppercase tracking-wider block break-words">Happy Trekkers</span>
            </div>

            <div className="bg-[#0B2545] text-white rounded-2xl p-4 sm:p-5 text-center shadow-md space-y-1 min-w-0">
              <Compass className="w-6 h-6 text-green-400 mx-auto" />
              <span className="text-2xl sm:text-3xl font-extrabold block leading-none pt-1 break-words">100+</span>
              <span className="text-[10px] sm:text-xs text-gray-300 font-bold uppercase tracking-wider block break-words">Verified Routes</span>
            </div>

            <div className="bg-[#0B2545] text-white rounded-2xl p-4 sm:p-5 text-center shadow-md space-y-1 min-w-0">
              <Trophy className="w-6 h-6 text-amber-400 mx-auto" />
              <span className="text-2xl sm:text-3xl font-extrabold block leading-none pt-1 break-words">20+</span>
              <span className="text-[10px] sm:text-xs text-gray-300 font-bold uppercase tracking-wider block break-words">Awards Won</span>
            </div>
          </div>

          {/* REVIEWS & TRUST TABS */}
          <div id="reviews" className="space-y-6 pt-4 border-t border-gray-150">
            {/* Tab Selection Pills */}
            <div className="flex justify-start sm:justify-center overflow-x-auto no-scrollbar scroll-touch gap-2 sm:gap-2.5 whitespace-nowrap pb-1 -mx-4 px-4 sm:mx-0 sm:px-0">
              <button
                onClick={() => setActiveTrustTab("trusted")}
                className={`flex items-center justify-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs px-3.5 sm:px-5 min-h-[44px] rounded-full border font-bold transition-all shrink-0 ${
                  activeTrustTab === "trusted"
                    ? "bg-[#0B2545] text-white border-[#0B2545] shadow-md"
                    : "bg-white text-gray-700 border-gray-250 hover:border-[#0B2545]/40"
                }`}
              >
                <Shield className="w-3.5 h-3.5 shrink-0 text-sky-400" />
                <span>Trusted By</span>
              </button>

              <button
                onClick={() => setActiveTrustTab("reviews")}
                className={`flex items-center justify-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs px-3.5 sm:px-5 min-h-[44px] rounded-full border font-bold transition-all shrink-0 ${
                  activeTrustTab === "reviews"
                    ? "bg-[#0B2545] text-white border-[#0B2545] shadow-md"
                    : "bg-white text-gray-700 border-gray-250 hover:border-[#0B2545]/40"
                }`}
              >
                <Star className="w-3.5 h-3.5 shrink-0 text-amber-400 fill-current" />
                <span>Google Reviews</span>
              </button>

              <button
                onClick={() => setActiveTrustTab("youtube")}
                className={`flex items-center justify-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs px-3.5 sm:px-5 min-h-[44px] rounded-full border font-bold transition-all shrink-0 ${
                  activeTrustTab === "youtube"
                    ? "bg-[#0B2545] text-white border-[#0B2545] shadow-md"
                    : "bg-white text-gray-700 border-gray-250 hover:border-[#0B2545]/40"
                }`}
              >
                <Video className="w-3.5 h-3.5 shrink-0 text-red-500" />
                <span>Video Reviews</span>
              </button>

              <button
                onClick={() => setActiveTrustTab("awards")}
                className={`flex items-center justify-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs px-3.5 sm:px-5 min-h-[44px] rounded-full border font-bold transition-all shrink-0 ${
                  activeTrustTab === "awards"
                    ? "bg-[#0B2545] text-white border-[#0B2545] shadow-md"
                    : "bg-white text-gray-700 border-gray-250 hover:border-[#0B2545]/40"
                }`}
              >
                <Trophy className="w-3.5 h-3.5 shrink-0 text-amber-400" />
                <span>Awards</span>
              </button>
            </div>

            {/* TAB 1: TRUSTED BY */}
            {activeTrustTab === "trusted" && (
              <div className="space-y-2 sm:space-y-3 animate-fade-in">
                <p className="md:hidden text-[10px] text-center text-gray-400 font-semibold tracking-wide">
                  Swipe to see all partners →
                </p>
                <div className="flex md:grid md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4 overflow-x-auto md:overflow-visible no-scrollbar scroll-touch snap-x snap-mandatory md:snap-none -mx-4 px-4 md:mx-0 md:px-0 pb-1 touch-pan-x">
                  {trustedByData.map((item, idx) => (
                    <div
                      key={idx}
                      className="snap-start shrink-0 w-[42%] sm:w-[30%] md:w-auto md:shrink bg-white border border-gray-150 rounded-2xl md:rounded-3xl overflow-hidden shadow-xs hover:shadow-md transition text-center flex flex-col p-3 md:p-4 space-y-2 md:space-y-3"
                    >
                      <div className="aspect-[4/3] md:aspect-square rounded-xl md:rounded-2xl overflow-hidden bg-gray-50 flex items-center justify-center p-2 md:p-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                      </div>
                      <div className="space-y-0.5 md:space-y-1 min-h-[2.25rem] md:min-h-0">
                        <span className="text-[10px] md:text-xs font-extrabold text-brand-dark-text block leading-tight line-clamp-2 md:line-clamp-none">
                          {item.name}
                        </span>
                        <p className="hidden sm:block text-[9px] md:text-[10px] text-gray-400 font-medium line-clamp-2">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 2: GOOGLE REVIEWS */}
            {activeTrustTab === "reviews" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 animate-fade-in">
                {googleReviewsData.map((rev, idx) => (
                  <div key={idx} className="bg-white border border-gray-150 rounded-3xl shadow-xs p-4 sm:p-5 space-y-3 flex flex-col justify-between text-left min-w-0">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 shrink-0">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={rev.avatar} alt={rev.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="space-y-0.5 min-w-0 flex-1">
                          <span className="text-xs font-extrabold text-brand-dark-text block truncate">{rev.name}</span>
                          <span className="text-[10px] text-gray-400 font-semibold block truncate">{rev.date}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: rev.rating }).map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 shrink-0 text-amber-400 fill-current" />
                        ))}
                      </div>

                      <p className="text-xs text-gray-600 leading-relaxed">{rev.text}</p>
                    </div>

                    <span className="text-[10px] font-extrabold text-brand-forest bg-brand-forest/5 px-2.5 py-1 rounded-full uppercase tracking-wider self-start max-w-full truncate">
                      {rev.trek}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* TAB 3: VIDEO REVIEWS */}
            {activeTrustTab === "youtube" && (
              <div className="animate-fade-in">
                <SwiperCarousel
                  slidesPerView={1.2}
                  spaceBetween={16}
                  showNavigation={true}
                  showPagination={false}
                  breakpoints={{
                    640: { slidesPerView: 2.2, spaceBetween: 16 },
                    768: { slidesPerView: 3.2, spaceBetween: 16 },
                    1280: { slidesPerView: 4, spaceBetween: 16 },
                  }}
                >
                  {YOUTUBE_SHORTS.map((videoId, idx) => (
                    <button
                      key={videoId}
                      type="button"
                      onClick={() => setActiveShortIndex(idx)}
                      aria-label="Play traveller video review fullscreen"
                      className="group w-full max-w-[280px] mx-auto block bg-white border border-gray-150 rounded-3xl shadow-xs hover:shadow-md transition p-3 cursor-pointer"
                    >
                      <div className="relative aspect-[9/16] w-full overflow-hidden rounded-2xl bg-gray-900">
                        <iframe
                          src={`https://www.youtube.com/embed/${videoId}`}
                          title={`Traveller video review ${videoId}`}
                          allow="autoplay; encrypted-media"
                          allowFullScreen
                          className="w-full h-full rounded-2xl pointer-events-none"
                        />
                        {/* Transparent catcher: clicks open the lightbox instead of playing inline */}
                        <span className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/30 transition">
                          <span className="w-12 h-12 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 group-hover:scale-110 transition">
                            <Play className="w-5 h-5 fill-current ml-0.5" />
                          </span>
                        </span>
                      </div>
                    </button>
                  ))}
                </SwiperCarousel>
              </div>
            )}

            {/* TAB 4: AWARDS */}
            {activeTrustTab === "awards" && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 animate-fade-in">
                {awardsData.map((award, idx) => (
                  <div key={idx} className="bg-white border border-gray-150 rounded-3xl overflow-hidden shadow-xs hover:shadow-md transition text-center flex flex-col justify-between p-4 space-y-3 min-w-0">
                    <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-gray-100 relative">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={award.image} alt={award.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="space-y-1 min-w-0">
                      <span className="text-xs font-extrabold text-brand-dark-text block break-words">{award.title}</span>
                      <span className="text-[10px] text-gray-400 font-semibold block break-words">{award.organization} ({award.year})</span>
                    </div>
                  </div>
                ))}
              </div>
            )}


          </div>

        </div>
      </section>

      {/* SECTION 5: "STAY INFORMED" (Latest Updates / Articles / Videos) */}
      <section className="py-10 sm:py-16 bg-brand-warm-bg border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-center">
          
          {/* Header */}
          <div className="space-y-2 max-w-xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-extrabold font-serif text-brand-dark-text">Stay Informed</h2>
            <p className="text-xs sm:text-sm text-gray-500 font-medium">Latest updates, trek stories, and videos from the Himalayas.</p>
            <div className="w-16 h-1 bg-brand-dusk-orange mx-auto rounded-full mt-2" />
          </div>

          {/* Tab Selection Buttons */}
          <div className="flex justify-start sm:justify-center overflow-x-auto no-scrollbar scroll-touch gap-2.5 sm:gap-3 whitespace-nowrap pb-1 -mx-4 px-4 sm:mx-0 sm:px-0">
            <button
              onClick={() => setActiveInformedTab("updates")}
              className={`flex items-center justify-center gap-2 shrink-0 text-xs px-4 sm:px-5 min-h-[44px] rounded-full border font-bold transition-all ${
                activeInformedTab === "updates"
                  ? "bg-[#0B2545] text-white border-[#0B2545] shadow-md"
                  : "bg-white text-gray-700 border-gray-250 hover:border-[#0B2545]/40"
              }`}
            >
              <Activity className="w-3.5 h-3.5 shrink-0 text-brand-dusk-orange" />
              <span>Latest Updates</span>
            </button>

            <button
              onClick={() => setActiveInformedTab("articles")}
              className={`flex items-center justify-center gap-2 shrink-0 text-xs px-4 sm:px-5 min-h-[44px] rounded-full border font-bold transition-all ${
                activeInformedTab === "articles"
                  ? "bg-[#0B2545] text-white border-[#0B2545] shadow-md"
                  : "bg-white text-gray-700 border-gray-250 hover:border-[#0B2545]/40"
              }`}
            >
              <FileText className="w-3.5 h-3.5 shrink-0 text-sky-400" />
              <span>Trekking Articles</span>
            </button>

            <button
              onClick={() => setActiveInformedTab("videos")}
              className={`flex items-center justify-center gap-2 shrink-0 text-xs px-4 sm:px-5 min-h-[44px] rounded-full border font-bold transition-all ${
                activeInformedTab === "videos"
                  ? "bg-[#0B2545] text-white border-[#0B2545] shadow-md"
                  : "bg-white text-gray-700 border-gray-250 hover:border-[#0B2545]/40"
              }`}
            >
              <Video className="w-3.5 h-3.5 shrink-0 text-red-400" />
              <span>Informative Videos</span>
            </button>
          </div>

          {/* TAB 1: LATEST UPDATES */}
          {activeInformedTab === "updates" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 text-left animate-fade-in">
              {latestUpdatesData.map((up, idx) => (
                <div key={idx} className="bg-white border border-gray-150 rounded-3xl p-5 sm:p-6 shadow-xs space-y-3 flex flex-col justify-between min-w-0">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2 text-[10px] font-bold">
                      <span className="text-brand-dusk-orange uppercase tracking-wider truncate">{up.type}</span>
                      <span className="text-gray-400 shrink-0">{up.date}</span>
                    </div>
                    <h3 className="text-sm font-bold text-brand-dark-text break-words">{up.title}</h3>
                    <p className="text-xs text-gray-500 leading-relaxed">{up.text}</p>
                  </div>
                  <Link href="/updates" className="text-[10px] font-extrabold text-brand-forest hover:text-brand-dusk inline-flex items-center gap-1 min-h-[44px] uppercase tracking-wider self-start">
                    <span>Read full status</span>
                    <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                  </Link>
                </div>
              ))}
            </div>
          )}

          {/* TAB 2: TREKKING ARTICLES */}
          {activeInformedTab === "articles" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 text-left animate-fade-in">
              {blogPosts.map((post, idx) => (
                <Link key={idx} href="/blogs" className="group bg-white border border-gray-150 rounded-3xl overflow-hidden shadow-xs hover:shadow-md transition flex flex-col justify-between">
                  <div className="aspect-[1.6] relative overflow-hidden bg-gray-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                  </div>
                  <div className="p-4 sm:p-5 space-y-2 flex-grow flex flex-col justify-between min-w-0">
                    <div className="space-y-2">
                      <span className="inline-block max-w-full truncate text-[9px] font-extrabold text-brand-forest bg-brand-forest/5 px-2.5 py-0.5 rounded-full uppercase">{post.category}</span>
                      <h3 className="text-xs font-bold text-brand-dark-text line-clamp-3 break-words">{post.title}</h3>
                    </div>
                    <span className="text-[10px] text-gray-400 font-semibold truncate">{post.date}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* TAB 3: INFORMATIVE VIDEOS */}
          {activeInformedTab === "videos" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 text-left animate-fade-in">
              {informativeVideosData.map((vid, idx) => (
                <div key={idx} className="bg-white border border-gray-150 rounded-3xl overflow-hidden shadow-xs space-y-3 p-4 min-w-0">
                  <div className="aspect-video rounded-2xl overflow-hidden bg-gray-900 relative group cursor-pointer" onClick={() => alert(`Playing ${vid.title}...`)}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={vid.image} alt={vid.title} className="w-full h-full object-cover opacity-75 group-hover:scale-105 transition duration-500" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-brand-dusk-orange text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition">
                        <Play className="w-5 h-5 fill-current ml-0.5" />
                      </div>
                    </div>
                    <span className="absolute bottom-2 right-2 bg-black/80 text-white text-[9px] font-bold px-2 py-0.5 rounded">
                      {vid.duration}
                    </span>
                  </div>
                  <div className="space-y-1 min-w-0">
                    <span className="text-xs font-bold text-brand-dark-text block line-clamp-2">{vid.title}</span>
                    <span className="text-[10px] text-gray-400 font-semibold block truncate">{vid.views}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </section>

      {/* SECTION 6: STANDALONE FAQ SECTION — Category tabs + expandable accordion */}
      <section className="py-10 sm:py-16 bg-white border-b border-gray-150">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-10">

          <div className="text-center space-y-3">
            <h2 className="text-3xl sm:text-4xl font-extrabold font-serif text-brand-dark-text">
              Frequently Asked Questions
            </h2>
            <div className="w-24 h-0.5 bg-brand-dusk-orange mx-auto rounded-full" />
          </div>

          {/* Category tabs — a single left-aligned row that scrolls horizontally
              once it outgrows the container (always does on mobile). */}
          <div className="overflow-x-auto no-scrollbar scroll-touch -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
            <div
              role="tablist"
              aria-label="FAQ categories"
              className="flex gap-3 w-max whitespace-nowrap pb-1"
            >
              {FAQ_CATEGORIES.map((category) => {
                const isActive = category.id === activeFaqCategory;
                const Icon = category.icon;
                return (
                  <button
                    key={category.id}
                    role="tab"
                    aria-selected={isActive}
                    aria-controls="faq-panel"
                    onClick={() => {
                      setActiveFaqCategory(category.id);
                      setExpandedFaq(null);
                    }}
                    className={`flex items-center justify-center gap-2 shrink-0 text-[13px] sm:text-sm px-4 sm:px-5 min-h-[44px] rounded-full border font-semibold transition-all ${
                      isActive
                        ? "bg-[#0B2545] text-white border-[#0B2545] shadow-md"
                        : "bg-white text-gray-600 border-gray-200 hover:border-[#0B2545]/40 hover:text-brand-forest"
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-white" : "text-gray-400"}`} />
                    <span>{category.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div id="faq-panel" role="tabpanel" className="space-y-4">
            {activeFaqItems.map((faq, idx) => {
              const isOpen = expandedFaq === idx;
              return (
                <div
                  key={faq.q}
                  className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-xs transition duration-200"
                >
                  <button
                    onClick={() => setExpandedFaq(isOpen ? null : idx)}
                    aria-expanded={isOpen}
                    className="w-full px-5 sm:px-6 py-4 sm:py-5 min-h-[56px] text-left flex items-center justify-between gap-4 text-sm sm:text-[15px] font-medium text-gray-700 hover:text-brand-forest transition"
                  >
                    <span className="min-w-0 break-words">{faq.q}</span>
                    <Triangle
                      className={`w-3 h-3 shrink-0 fill-current transition-transform duration-300 ${
                        isOpen ? "rotate-0 text-brand-dusk-orange" : "rotate-180 text-gray-400"
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 sm:px-6 pb-5 pt-1 text-sm text-gray-600 leading-relaxed space-y-2 break-words">
                      <p>{faq.a}</p>
                      {faq.link && (
                        <Link
                          href={faq.link}
                          className="inline-flex items-center min-h-[44px] text-brand-forest font-bold hover:underline text-xs"
                        >
                          {faq.linkText}
                        </Link>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* SECTION 7: INSTAGRAM FEED — Community/social layer */}
      <section id="social-community" className="py-10 sm:py-16 bg-brand-warm-card/25 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <div className="space-y-2">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              Social Community
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-brand-dark-text font-serif break-words">
              #TripMySoul Adventures
            </h2>
            <p className="text-xs text-gray-500">
              Follow our daily updates on Instagram for recent trail conditions, weather reports, and photos.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 sm:gap-4">
            {instagramPosts.map((img, idx) => (
              <a
                key={idx}
                href="https://www.instagram.com/tripmysoul.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="relative aspect-square rounded-2xl overflow-hidden group shadow-xs block"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img}
                  alt={`Instagram photo ${idx + 1}`}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Star className="w-5 h-5 text-white fill-current" />
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* FULLSCREEN VIDEO REVIEW LIGHTBOX */}
      {activeShortIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Traveller video review"
          onClick={closeShort}
          className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
        >
          <button
            type="button"
            onClick={closeShort}
            aria-label="Close video"
            className="absolute top-4 right-4 sm:top-6 sm:right-6 w-11 h-11 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition"
          >
            <X className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); stepShort(-1); }}
            aria-label="Previous video"
            className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); stepShort(1); }}
            aria-label="Next video"
            className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          <div
            onClick={(e) => e.stopPropagation()}
            className="relative h-[85vh] aspect-[9/16] max-w-[95vw] rounded-2xl overflow-hidden bg-black shadow-2xl"
          >
            <iframe
              key={YOUTUBE_SHORTS[activeShortIndex]}
              src={`https://www.youtube.com/embed/${YOUTUBE_SHORTS[activeShortIndex]}?autoplay=1&playsinline=1&rel=0`}
              title={`Traveller video review ${YOUTUBE_SHORTS[activeShortIndex]}`}
              allow="autoplay; encrypted-media; fullscreen"
              allowFullScreen
              className="w-full h-full"
            />
          </div>

          <span className="absolute bottom-5 left-1/2 -translate-x-1/2 text-[11px] font-semibold text-white/70">
            {activeShortIndex + 1} / {YOUTUBE_SHORTS.length}
          </span>
        </div>
      )}
    </div>
  );
}
