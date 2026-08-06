"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import {
  Compass, Shield, Leaf, ArrowRight, Star, MapPin, Award, Search, ArrowUpDown, SlidersHorizontal,
  Users, Trophy, CheckCircle, FileText, Video, Activity, Play, ExternalLink, Filter, HelpCircle, ChevronDown
} from "lucide-react";
import { motion } from "framer-motion";
import { TREKS, WHY_CHOOSE_US, TRUST_STATS, REGIONS } from "@/data/db";
import TrekCard from "@/components/TrekCard";
import SwiperCarousel from "@/components/SwiperCarousel";
import CategoryCarousel from "@/components/CategoryCarousel";
import FilterPanel, { FilterState } from "@/components/FilterPanel";

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

const HERO_IMAGES = [
  "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1920&q=80",
  "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1920&q=80",
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1920&q=80",
  "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1920&q=80",
  "https://images.unsplash.com/photo-1486873249359-2731bd6dafc7?auto=format&fit=crop&w=1920&q=80",
];

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilters, setSelectedFilters] = useState<FilterState>(initialFilters);
  const [sortBy, setSortBy] = useState("price-asc");

  // FAQ accordion state
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  // Hero background slideshow timer state
  const [heroSlideIndex, setHeroSlideIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setHeroSlideIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  // Section 4 "Top Treks This Season" filters state
  const [seasonRegionFilter, setSeasonRegionFilter] = useState("All");
  const [seasonDifficultyFilter, setSeasonDifficultyFilter] = useState("All");
  const [seasonPriceFilter, setSeasonPriceFilter] = useState("All");

  // Tab states for Social Proof & Stay Informed sections
  const [activeTrustTab, setActiveTrustTab] = useState<"reviews" | "youtube" | "awards" | "trusted">("reviews");
  const [activeInformedTab, setActiveInformedTab] = useState<"updates" | "articles" | "videos">("updates");

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
  const filteredTreks = useMemo(() => {
    return TREKS.filter((trek) => {
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

      // 8. Upcoming Departures Filter
      if (selectedFilters.upcomingOnly) {
        const today = new Date();
        const currentMonthIdx = today.getMonth();
        const nextMonthIdx = (currentMonthIdx + 1) % 12;
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const activeMonths = [monthNames[currentMonthIdx], monthNames[nextMonthIdx]];
        const hasUpcoming = trek.months.some((m) => activeMonths.includes(m));
        if (!hasUpcoming) return false;
      }

      return true;
    });
  }, [searchQuery, selectedFilters]);

  // Sort treks
  const sortedTreks = useMemo(() => {
    const treksCopy = [...filteredTreks];
    return treksCopy.sort((a, b) => {
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
  }, [filteredTreks, sortBy]);

  const handleResetFilters = () => {
    setSelectedFilters(initialFilters);
    setSearchQuery("");
  };

  const handleQuickFilter = (category: keyof Omit<FilterState, "upcomingOnly">, value: string) => {
    setSelectedFilters({
      ...initialFilters,
      [category]: [value]
    });
  };

  const isAnyFilterActive = 
    selectedFilters.region.length > 0 ||
    selectedFilters.difficulty.length > 0 ||
    selectedFilters.months.length > 0 ||
    selectedFilters.duration.length > 0 ||
    selectedFilters.themes.length > 0 ||
    selectedFilters.seasons.length > 0 ||
    selectedFilters.upcomingOnly;

  const quickFilters = [
    { label: "All", action: () => handleResetFilters(), active: !isAnyFilterActive },
    { label: "Uttarakhand", action: () => handleQuickFilter("region", "Uttarakhand"), active: selectedFilters.region.includes("Uttarakhand") },
    { label: "Himachal Pradesh", action: () => handleQuickFilter("region", "Himachal Pradesh"), active: selectedFilters.region.includes("Himachal Pradesh") },
    { label: "Jammu & Kashmir", action: () => handleQuickFilter("region", "Jammu & Kashmir"), active: selectedFilters.region.includes("Jammu & Kashmir") },
    { label: "Winter", action: () => handleQuickFilter("seasons", "Winter"), active: selectedFilters.seasons.includes("Winter") },
    { label: "Summer", action: () => handleQuickFilter("seasons", "Summer"), active: selectedFilters.seasons.includes("Summer") },
    { label: "Easy Treks", action: () => handleQuickFilter("difficulty", "Easy"), active: selectedFilters.difficulty.includes("Easy") },
    { label: "Family Friendly", action: () => handleQuickFilter("themes", "Family with Kids"), active: selectedFilters.themes.includes("Family with Kids") },
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

  const youtubeReviewsData = [
    {
      title: "Kedarkantha Summit Expedition Vlog & Review",
      channel: "Mountain Trekkers India",
      views: "128K views",
      duration: "14:20",
      image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=500&q=80"
    },
    {
      title: "Buran Ghati Pass Ice Wall Experience",
      channel: "Himalayan Vlogs",
      views: "95K views",
      duration: "11:45",
      image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=500&q=80"
    },
    {
      title: "Kashmir Great Lakes Trekker Review",
      channel: "Trail Seekers",
      views: "210K views",
      duration: "18:05",
      image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=500&q=80"
    }
  ];

  const trustedByData = [
    { name: "IMF Affiliated", desc: "Indian Mountaineering Foundation", icon: Award },
    { name: "ATOAI Member", desc: "Adventure Tour Operators Assn of India", icon: Shield },
    { name: "Uttarakhand Tourism", desc: "State Registered Adventure Operator", icon: CheckCircle },
    { name: "MSME Certified", desc: "Ministry of Micro, Small & Medium Enterprises", icon: Award }
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
    "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1486873249359-2731bd6dafc7?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1472214222555-d404758b1c42?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1482862549707-f63cb32c5fd9?auto=format&fit=crop&w=400&q=80",
  ];

  return (
    <div className="w-full relative bg-brand-warm-bg overflow-x-hidden">
      {/* SECTION 1: HERO — Background Slideshow + Google Reviews Widget */}
      <section className="relative h-[85vh] md:h-[90vh] w-full flex items-center justify-center overflow-hidden bg-[#0B2545]">
        {/* Auto-playing Photo Slideshow Background */}
        <div className="absolute inset-0 z-0">
          {HERO_IMAGES.map((imgUrl, idx) => (
            <div
              key={imgUrl}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                idx === heroSlideIndex ? "opacity-60 scale-105" : "opacity-0 scale-100"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imgUrl}
                alt={`Himalayas Hero Background Slide ${idx + 1}`}
                className="w-full h-full object-cover pointer-events-none"
              />
            </div>
          ))}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B2545] via-[#0B2545]/40 to-transparent" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center text-white space-y-6 md:space-y-8 mt-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-4"
          >
            <span className="text-xs md:text-sm font-extrabold uppercase tracking-widest text-brand-dusk-orange bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 inline-block">
              Himalayan Wilderness Expeditions
            </span>
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold font-serif leading-tight tracking-tight">
              Where Every Journey <br />
              <span className="text-brand-dusk-orange font-normal italic">Heals the Soul</span>
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-sm sm:text-lg text-gray-200 max-w-2xl mx-auto leading-relaxed"
          >
            Join curated, small-group treks across the towering ranges of Uttarakhand, Himachal, and Kashmir. Fully certified mountaineering guides, clean campsites, and rigorous safety standards.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="flex flex-col sm:flex-row justify-center items-center gap-4"
          >
            <Link
              href="#explore-treks"
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-brand-dusk hover:bg-brand-dusk-orange text-white font-bold shadow-lg transform hover:-translate-y-0.5 transition duration-200 flex items-center justify-center gap-2"
            >
              <span>View Upcoming Treks and Trips</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <a
              href="https://www.instagram.com/tripmysoul.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold backdrop-blur-md border border-white/20 transition duration-200 flex items-center justify-center gap-2"
            >
              <ExternalLink className="w-5 h-5 text-brand-dusk-orange" />
              <span>View Social Media</span>
            </a>
          </motion.div>

          {/* Hero Google Reviews Widget */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="pt-4 max-w-md mx-auto"
          >
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-3.5 flex items-center justify-between text-left gap-3 shadow-lg">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-white text-blue-600 font-black text-xs flex items-center justify-center shrink-0 shadow-xs">
                  G
                </div>
                <div>
                  <div className="flex items-center gap-1 text-amber-400 text-xs">
                    <span className="font-extrabold text-white mr-1 text-xs">4.9</span>
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <span className="text-[10px] text-gray-200 font-semibold block">
                    Based on 2,500+ Verified Google Reviews
                  </span>
                </div>
              </div>
              <a
                href="#reviews"
                className="text-[10px] font-extrabold text-brand-dusk-orange uppercase tracking-wider hover:underline shrink-0"
              >
                Read Reviews →
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* SECTION 2: CATEGORY QUICK-NAV CAROUSEL */}
      <CategoryCarousel />

      {/* SECTION 3: "EXPLORE EXPEDITIONS" (Find Your Next Healing Journey) — Main trek filter grid */}
      <section id="explore-treks" className="py-16 bg-white border-y border-gray-100">
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
              <div className="flex items-center gap-2 px-4 py-3 bg-brand-warm-bg rounded-2xl border border-gray-150 w-full sm:flex-1">
                <Search className="w-4 h-4 text-gray-400 shrink-0" />
                <input
                  type="text"
                  placeholder="Search treks (e.g. Kedarkantha, Sankri)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent border-0 text-xs sm:text-sm focus:outline-none w-full text-brand-dark-text placeholder-gray-400 font-sans"
                />
              </div>

              {/* Sort selector */}
              <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-between sm:justify-end border border-gray-150 rounded-2xl px-4 py-2.5 bg-white">
                <ArrowUpDown className="w-4 h-4 text-brand-forest shrink-0" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="text-xs font-bold bg-transparent border-0 focus:outline-none text-brand-dark-text font-sans cursor-pointer"
                >
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="days-asc">Duration: Short to Long</option>
                  <option value="days-desc">Duration: Long to Short</option>
                </select>
              </div>
            </div>

            {/* Quick Filter Pill Buttons */}
            <div className="flex overflow-x-auto no-scrollbar gap-2.5 pt-2 pb-1 whitespace-nowrap">
              {quickFilters.map((pill) => (
                <button
                  key={pill.label}
                  onClick={pill.action}
                  className={`text-xs px-4 py-2 rounded-full border font-bold transition-all duration-200 font-sans ${
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
            <div className="flex-grow min-w-0 w-full space-y-6">
              <div className="flex justify-between items-center text-xs font-black uppercase tracking-wider text-gray-400 font-sans pl-1">
                <span>SHOWING {sortedTreks.length} TREKS</span>
                <span className="text-[10px] text-brand-forest font-semibold">Swipe / Click arrows to explore →</span>
              </div>

              {sortedTreks.length > 0 ? (
                <SwiperCarousel
                  key={`${searchQuery}-${sortBy}-${JSON.stringify(selectedFilters)}`}
                  slidesPerView={1}
                  spaceBetween={20}
                  showNavigation={true}
                  showPagination={true}
                  breakpoints={{
                    640: { slidesPerView: 1, spaceBetween: 16 },
                    768: { slidesPerView: 2, spaceBetween: 20 },
                    1280: { slidesPerView: 3, spaceBetween: 24 },
                  }}
                >
                  {sortedTreks.map((trek) => (
                    <TrekCard key={trek.slug} trek={trek} />
                  ))}
                </SwiperCarousel>
              ) : (
                <div className="text-center py-16 bg-white border border-gray-100 rounded-3xl p-8 max-w-xl mx-auto space-y-4 shadow-xs">
                  <SlidersHorizontal className="w-10 h-10 text-brand-dusk-orange mx-auto animate-pulse" />
                  <h3 className="text-base font-bold text-brand-dark-text">No matching treks found</h3>
                  <p className="text-xs text-gray-500">
                    Try loosening your filters, changing the region, or resetting search options.
                  </p>
                  <button
                    onClick={handleResetFilters}
                    className="px-5 py-2.5 rounded-full bg-brand-forest hover:bg-brand-forest-light text-white font-bold text-xs shadow-md transition"
                  >
                    Clear all filters
                  </button>
                </div>
              )}
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 4: "HIMALAYAN REGIONS" — Browse path by territory */}
      <section className="py-20 bg-brand-warm-card/40 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
            <span className="text-xs font-extrabold uppercase tracking-widest text-brand-dusk">
              Explore by Territory
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-brand-dark-text font-serif leading-none">
              Himalayan Regions
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              Every region offers a unique flavor. Wander through the rolling high-altitude meadows (bugyals) of Uttarakhand, negotiate mountain passes in Himachal, or seek pristine lakes in Kashmir.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {REGIONS.map((region) => (
              <Link
                key={region.slug}
                href={`/regions/${region.slug}`}
                className="group relative h-96 rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-end p-6 border border-white/10"
              >
                <div className="absolute inset-0 z-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={region.image}
                    alt={region.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B2545]/90 via-[#0B2545]/40 to-transparent" />
                </div>

                <div className="relative z-10 text-white space-y-2">
                  <h3 className="text-2xl font-bold font-serif">{region.name}</h3>
                  <p className="text-xs text-gray-200 leading-relaxed line-clamp-2">
                    {region.description}
                  </p>
                  <div className="pt-2 flex items-center gap-1.5 text-xs font-bold text-brand-dusk-orange">
                    <span>Explore region treks</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 5: "WHY CHOOSE TRIPMYSOUL?" — Placed directly after Himalayan Regions */}
      <section id="why-choose-us" className="py-16 bg-white border-t border-gray-150">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {WHY_CHOOSE_US.map((metric, idx) => {
              const Icon = metric.icon === "Shield" ? Shield : metric.icon === "Leaf" ? Leaf : Compass;
              return (
                <div
                  key={idx}
                  className="bg-brand-warm-bg/40 border border-gray-150 rounded-3xl p-6 hover:shadow-md transition-shadow duration-300 space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="w-10 h-10 rounded-2xl bg-brand-forest/10 flex items-center justify-center text-brand-forest">
                      <Icon className="w-5 h-5 text-brand-dusk-orange" />
                    </div>
                    <h3 className="text-base font-bold text-brand-dark-text">{metric.title}</h3>
                    <p className="text-xs text-gray-600 leading-relaxed font-medium">{metric.description}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* FOLDED STATS BAR */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="bg-[#0B2545] text-white rounded-2xl p-5 text-center shadow-md space-y-1">
              <Users className="w-6 h-6 text-brand-dusk-orange mx-auto" />
              <span className="text-2xl sm:text-3xl font-extrabold block leading-none pt-1">500,000+</span>
              <span className="text-[10px] sm:text-xs text-gray-300 font-bold uppercase tracking-wider block">Happy Trekkers</span>
            </div>

            <div className="bg-[#0B2545] text-white rounded-2xl p-5 text-center shadow-md space-y-1">
              <Compass className="w-6 h-6 text-green-400 mx-auto" />
              <span className="text-2xl sm:text-3xl font-extrabold block leading-none pt-1">100+</span>
              <span className="text-[10px] sm:text-xs text-gray-300 font-bold uppercase tracking-wider block">Verified Routes</span>
            </div>

            <div className="bg-[#0B2545] text-white rounded-2xl p-5 text-center shadow-md space-y-1">
              <Trophy className="w-6 h-6 text-amber-400 mx-auto" />
              <span className="text-2xl sm:text-3xl font-extrabold block leading-none pt-1">20+</span>
              <span className="text-[10px] sm:text-xs text-gray-300 font-bold uppercase tracking-wider block">Awards Won</span>
            </div>
          </div>

          {/* REVIEWS & TRUST TABS */}
          <div id="reviews" className="space-y-6 pt-4 border-t border-gray-150">
            {/* Tab Selection Pills */}
            <div className="flex justify-center overflow-x-auto no-scrollbar gap-2.5 whitespace-nowrap pb-1">
              <button
                onClick={() => setActiveTrustTab("youtube")}
                className={`flex items-center gap-2 text-xs px-5 py-2.5 rounded-full border font-bold transition-all ${
                  activeTrustTab === "youtube"
                    ? "bg-[#0B2545] text-white border-[#0B2545] shadow-md"
                    : "bg-white text-gray-700 border-gray-250 hover:border-[#0B2545]/40"
                }`}
              >
                <Video className="w-3.5 h-3.5 text-red-500" />
                <span>YouTube Reviews</span>
              </button>

              <button
                onClick={() => setActiveTrustTab("awards")}
                className={`flex items-center gap-2 text-xs px-5 py-2.5 rounded-full border font-bold transition-all ${
                  activeTrustTab === "awards"
                    ? "bg-[#0B2545] text-white border-[#0B2545] shadow-md"
                    : "bg-white text-gray-700 border-gray-250 hover:border-[#0B2545]/40"
                }`}
              >
                <Trophy className="w-3.5 h-3.5 text-amber-400" />
                <span>Awards</span>
              </button>

              <button
                onClick={() => setActiveTrustTab("trusted")}
                className={`flex items-center gap-2 text-xs px-5 py-2.5 rounded-full border font-bold transition-all ${
                  activeTrustTab === "trusted"
                    ? "bg-[#0B2545] text-white border-[#0B2545] shadow-md"
                    : "bg-white text-gray-700 border-gray-250 hover:border-[#0B2545]/40"
                }`}
              >
                <Shield className="w-3.5 h-3.5 text-sky-400" />
                <span>Trusted By</span>
              </button>
            </div>

            {/* TAB 1: YOUTUBE REVIEWS */}
            {activeTrustTab === "youtube" && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
                {youtubeReviewsData.map((vid, idx) => (
                  <div key={idx} className="bg-white border border-gray-150 rounded-3xl overflow-hidden shadow-xs space-y-3 p-4">
                    <div className="aspect-video rounded-2xl overflow-hidden bg-gray-900 relative group cursor-pointer" onClick={() => alert(`Playing ${vid.title}...`)}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={vid.image} alt={vid.title} className="w-full h-full object-cover opacity-75 group-hover:scale-105 transition duration-500" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition">
                          <Play className="w-5 h-5 fill-current ml-0.5" />
                        </div>
                      </div>
                      <span className="absolute bottom-2 right-2 bg-black/80 text-white text-[9px] font-bold px-2 py-0.5 rounded">
                        {vid.duration}
                      </span>
                    </div>
                    <div className="space-y-1">
                      <span className="text-xs font-bold text-brand-dark-text block line-clamp-1">{vid.title}</span>
                      <span className="text-[10px] text-gray-400 font-semibold block">{vid.channel} • {vid.views}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* TAB 2: AWARDS */}
            {activeTrustTab === "awards" && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 animate-fade-in">
                {awardsData.map((award, idx) => (
                  <div key={idx} className="bg-white border border-gray-150 rounded-3xl overflow-hidden shadow-xs hover:shadow-md transition text-center flex flex-col justify-between p-4 space-y-3">
                    <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-gray-100 relative">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={award.image} alt={award.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="space-y-1">
                      <span className="text-xs font-extrabold text-brand-dark-text block">{award.title}</span>
                      <span className="text-[10px] text-gray-400 font-semibold block">{award.organization} ({award.year})</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* TAB 3: TRUSTED BY */}
            {activeTrustTab === "trusted" && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 animate-fade-in">
                {trustedByData.map((item, idx) => (
                  <div key={idx} className="bg-white border border-gray-150 rounded-3xl p-6 text-center space-y-2 shadow-xs hover:shadow-md transition">
                    <item.icon className="w-8 h-8 text-brand-forest mx-auto" />
                    <span className="text-xs font-extrabold text-brand-dark-text block uppercase">{item.name}</span>
                    <p className="text-[10px] text-gray-400 font-medium">{item.desc}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </section>

      {/* SECTION 6: "STAY INFORMED" (Latest Updates / Articles / Videos) */}
      <section className="py-16 bg-brand-warm-bg border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-center">
          
          {/* Header */}
          <div className="space-y-2 max-w-xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-extrabold font-serif text-brand-dark-text">Stay Informed</h2>
            <p className="text-xs sm:text-sm text-gray-500 font-medium">Latest updates, trek stories, and videos from the Himalayas.</p>
            <div className="w-16 h-1 bg-brand-dusk-orange mx-auto rounded-full mt-2" />
          </div>

          {/* Tab Selection Buttons */}
          <div className="flex justify-center overflow-x-auto no-scrollbar gap-3 whitespace-nowrap pb-1">
            <button
              onClick={() => setActiveInformedTab("updates")}
              className={`flex items-center gap-2 text-xs px-5 py-2.5 rounded-full border font-bold transition-all ${
                activeInformedTab === "updates"
                  ? "bg-[#0B2545] text-white border-[#0B2545] shadow-md"
                  : "bg-white text-gray-700 border-gray-250 hover:border-[#0B2545]/40"
              }`}
            >
              <Activity className="w-3.5 h-3.5 text-brand-dusk-orange" />
              <span>Latest Updates</span>
            </button>

            <button
              onClick={() => setActiveInformedTab("articles")}
              className={`flex items-center gap-2 text-xs px-5 py-2.5 rounded-full border font-bold transition-all ${
                activeInformedTab === "articles"
                  ? "bg-[#0B2545] text-white border-[#0B2545] shadow-md"
                  : "bg-white text-gray-700 border-gray-250 hover:border-[#0B2545]/40"
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-sky-400" />
              <span>Trekking Articles</span>
            </button>

            <button
              onClick={() => setActiveInformedTab("videos")}
              className={`flex items-center gap-2 text-xs px-5 py-2.5 rounded-full border font-bold transition-all ${
                activeInformedTab === "videos"
                  ? "bg-[#0B2545] text-white border-[#0B2545] shadow-md"
                  : "bg-white text-gray-700 border-gray-250 hover:border-[#0B2545]/40"
              }`}
            >
              <Video className="w-3.5 h-3.5 text-red-400" />
              <span>Informative Videos</span>
            </button>
          </div>

          {/* TAB 1: LATEST UPDATES */}
          {activeInformedTab === "updates" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left animate-fade-in">
              {latestUpdatesData.map((up, idx) => (
                <div key={idx} className="bg-white border border-gray-150 rounded-3xl p-6 shadow-xs space-y-3 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[10px] font-bold">
                      <span className="text-brand-dusk-orange uppercase tracking-wider">{up.type}</span>
                      <span className="text-gray-400">{up.date}</span>
                    </div>
                    <h3 className="text-sm font-bold text-brand-dark-text">{up.title}</h3>
                    <p className="text-xs text-gray-500 leading-relaxed">{up.text}</p>
                  </div>
                  <Link href="/updates" className="text-[10px] font-extrabold text-brand-forest hover:text-brand-dusk flex items-center gap-1 uppercase tracking-wider pt-2">
                    <span>Read full status</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ))}
            </div>
          )}

          {/* TAB 2: TREKKING ARTICLES */}
          {activeInformedTab === "articles" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left animate-fade-in">
              {blogPosts.map((post, idx) => (
                <Link key={idx} href="/blogs" className="group bg-white border border-gray-150 rounded-3xl overflow-hidden shadow-xs hover:shadow-md transition flex flex-col justify-between">
                  <div className="aspect-[1.6] relative overflow-hidden bg-gray-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                  </div>
                  <div className="p-5 space-y-2 flex-grow flex flex-col justify-between">
                    <div className="space-y-2">
                      <span className="text-[9px] font-extrabold text-brand-forest bg-brand-forest/5 px-2.5 py-0.5 rounded-full uppercase">{post.category}</span>
                      <h3 className="text-xs font-bold text-brand-dark-text line-clamp-2">{post.title}</h3>
                    </div>
                    <span className="text-[10px] text-gray-400 font-semibold">{post.date}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* TAB 3: INFORMATIVE VIDEOS */}
          {activeInformedTab === "videos" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left animate-fade-in">
              {informativeVideosData.map((vid, idx) => (
                <div key={idx} className="bg-white border border-gray-150 rounded-3xl overflow-hidden shadow-xs space-y-3 p-4">
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
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-brand-dark-text block line-clamp-1">{vid.title}</span>
                    <span className="text-[10px] text-gray-400 font-semibold block">{vid.views}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </section>

      {/* SECTION 7: STANDALONE FAQ SECTION — Expandable Accordion Directly Below Stay Informed */}
      <section className="py-16 bg-white border-b border-gray-150">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          <div className="text-center space-y-3">
            <span className="text-xs font-extrabold uppercase tracking-widest text-brand-dusk-orange bg-brand-forest/5 px-3.5 py-1.5 rounded-full inline-block">
              HELP & GUIDANCE
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-serif text-brand-dark-text">
              Frequently Asked Questions
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 font-medium max-w-xl mx-auto">
              Everything you need to know about booking, safety standards, rentals, and policies.
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                q: "What is included in the TripMySoul trek package?",
                a: "Our trek packages include all high-altitude camping lodging (alpine tents/homestays), certified mountaineering guides, organic vegetarian meals on trail, forest permits, safety equipment (oxygen cylinders, SpO2 meters, stretcher tents), and baseline emergency medical support."
              },
              {
                q: "How do I book a departure date for a trek?",
                a: "Explore our trek catalog, select your preferred departure batch date from the batch schedule, enter your trekker information, and click 'Book Expedition Slot' to reserve your seat instantly."
              },
              {
                q: "What is the cancellation and refund policy?",
                a: "Cancellations made 30+ days prior to departure receive a 90% monetary refund or 100% voucher credit valid for 1 year.",
                link: "/policies/cancellation-policy",
                linkText: "View official Cancellation Policy →"
              },
              {
                q: "Do you provide high-altitude trekking gear on rent?",
                a: "Yes! We offer rental down jackets (-10°C rated), high-ankle waterproof trekking boots, trekking poles, thermal liners, and rain ponchos directly through our store.",
                link: "/rent",
                linkText: "Explore Gear Rental Store →"
              },
              {
                q: "What safety protocols are followed on high-altitude treks?",
                a: "Every expedition carries medical emergency kits, portable oxygen cylinders, pulse oximeters, and hyperbaric safety equipment managed by certified Wilderness First Responder guide staff."
              }
            ].map((faq, idx) => {
              const isOpen = expandedFaq === idx;
              return (
                <div
                  key={idx}
                  className="bg-brand-warm-bg/40 border border-gray-150 rounded-2xl overflow-hidden shadow-xs transition duration-200"
                >
                  <button
                    onClick={() => setExpandedFaq(isOpen ? null : idx)}
                    className="w-full px-6 py-4 text-left flex items-center justify-between gap-4 font-bold text-sm text-brand-dark-text hover:text-brand-forest transition"
                  >
                    <span className="flex items-center gap-3">
                      <HelpCircle className="w-4 h-4 text-brand-dusk-orange shrink-0" />
                      <span>{faq.q}</span>
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-gray-400 shrink-0 transition-transform duration-300 ${
                        isOpen ? "rotate-180 text-brand-dusk-orange" : ""
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-5 pt-1 text-xs text-gray-600 leading-relaxed font-medium space-y-2 border-t border-gray-150/60 bg-white/60">
                      <p>{faq.a}</p>
                      {faq.link && (
                        <Link
                          href={faq.link}
                          className="inline-block text-brand-forest font-bold hover:underline text-[11px] pt-1"
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

      {/* SECTION 8: INSTAGRAM FEED — Community/social layer */}
      <section id="social-community" className="py-16 bg-brand-warm-card/25 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <div className="space-y-2">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              Social Community
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-brand-dark-text font-serif">
              #TripMySoul Adventures
            </h2>
            <p className="text-xs text-gray-500">
              Follow our daily updates on Instagram for recent trail conditions, weather reports, and photos.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
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
    </div>
  );
}
