"use client";

import React, { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, ArrowUpDown } from "lucide-react";
import { TREKS } from "@/data/db";
import { departsWithinWindow } from "@/lib/upcoming";
import { featuredRank } from "@/lib/featured";
import { SEASON_MAP, seasonRank } from "@/lib/season";
import { useCurrentSeason } from "@/lib/useCurrentSeason";
import TrekCard from "@/components/TrekCard";
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

function TreksList() {
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilters, setSelectedFilters] = useState<FilterState>(initialFilters);
  // Season-first by default: the list opens on what is actually runnable now.
  const [sortBy, setSortBy] = useState("season");
  /** `null` until hydration — see the hook for why. */
  const seasonNow = useCurrentSeason();

  // Read filter queries from URL
  useEffect(() => {
    const filterQuery = searchParams.get("filter");
    const regionQuery = searchParams.get("region");
    
    if (filterQuery === "trending") {
      setSelectedFilters((prev) => ({
        ...prev,
        upcomingOnly: true
      }));
    } else if (filterQuery === "family") {
      setSelectedFilters((prev) => ({
        ...prev,
        themes: ["Family with Kids"]
      }));
    }
    
    if (regionQuery) {
      const regionMap: Record<string, string> = {
        "uttarakhand": "Uttarakhand",
        "himachal-pradesh": "Himachal Pradesh",
        "jammu-kashmir": "Jammu & Kashmir"
      };
      const formattedRegion = regionMap[regionQuery.toLowerCase()];
      if (formattedRegion) {
        setSelectedFilters((prev) => ({
          ...prev,
          region: [formattedRegion]
        }));
      }
    }
  }, [searchParams]);

  // Handle instant filtering
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

      // 3. Difficulty Filter (Fuzzy matching for extended grades)
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

      // 5. Season Filter (Map to months)
      if (selectedFilters.seasons.length > 0) {
        const hasMatchingSeason = selectedFilters.seasons.some((season) => {
          const seasonMonths = SEASON_MAP[season] || [];
          return trek.months.some((m) => seasonMonths.includes(m));
        });
        if (!hasMatchingSeason) return false;
      }

      // 6. Theme Filter (Fuzzy matching)
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

      // 8. Upcoming Departures Filter — a real departure in the next 60 days.
      // Previously this compared operating months, which matched every trek.
      if (selectedFilters.upcomingOnly && !departsWithinWindow(trek)) return false;

      return true;
    });
  }, [searchQuery, selectedFilters]);

  // Sort treks
  const sortedTreks = useMemo(() => {
    const treksCopy = [...filteredTreks];
    return treksCopy.sort((a, b) => {
      // Season grouping outranks the featured tiebreak, else a featured trek
      // from another season would sit above the season it belongs to.
      if (sortBy === "season" && seasonNow) {
        const season = seasonRank(a.months, seasonNow) - seasonRank(b.months, seasonNow);
        if (season !== 0) return season;
      }

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
        case "season":
          // Same season — cheapest first keeps the grouping readable.
          return priceA - priceB;
        default:
          return 0;
      }
    });
  }, [filteredTreks, sortBy, seasonNow]);

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

  // Mobile scrollable quick filters configuration
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-24 sm:pt-16 sm:pb-32">
      {/* Header Banner */}
      <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
        <span className="text-xs font-extrabold uppercase tracking-widest text-brand-dusk">
          Himalayan Expeditions
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold font-serif text-brand-dark-text leading-tight">
          Himalayan Trekking Trails
        </h1>
        <p className="text-sm text-gray-500">
          Find your next healing journey from our verified high-altitude expeditions. Filter by region, month, theme, or difficulty level.
        </p>
      </div>

      {/* Search and Sort controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-6 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm w-full">
        {/* Search */}
        <div className="flex items-center gap-2 px-3 py-2 bg-brand-warm-bg rounded-xl border border-gray-150 w-full sm:max-w-md">
          <Search className="w-4 h-4 text-gray-400 shrink-0" />
          <input
            type="text"
            placeholder="Search treks (e.g. Kedarkantha, Sankri)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-0 text-base lg:text-sm focus:outline-none w-full text-brand-dark-text placeholder-gray-400 self-stretch py-3 -my-3"
          />
        </div>

        {/* Sort select */}
        <div className="flex items-center gap-2.5 shrink-0 w-full sm:w-auto justify-end min-w-0">
          <ArrowUpDown className="w-4 h-4 text-brand-forest shrink-0" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="text-base lg:text-xs font-semibold min-h-[44px] py-2 px-4 rounded-xl border border-gray-200 bg-white focus:outline-none text-brand-dark-text min-w-0 max-w-full"
          >
            <option value="season">
              Season{seasonNow ? `: ${seasonNow} First` : ""}
            </option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="days-asc">Duration: Short to Long</option>
            <option value="days-desc">Duration: Long to Short</option>
          </select>
        </div>
      </div>

      {/* Mobile scrollable quick filter pills */}
      <div className="lg:hidden flex overflow-x-auto scroll-touch no-scrollbar gap-2 pb-4 mb-6 -mx-4 px-4 whitespace-nowrap">
        {quickFilters.map((pill) => (
          <button
            key={pill.label}
            onClick={pill.action}
            className={`text-xs px-4 min-h-[44px] shrink-0 inline-flex items-center rounded-full border font-bold transition-all duration-200 ${
              pill.active
                ? "bg-brand-forest text-white border-brand-forest shadow-xs scale-102"
                : "bg-white text-gray-700 border-gray-150"
            }`}
          >
            {pill.label}
          </button>
        ))}
      </div>

      {/* Main Grid Section */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Facet Sidebar */}
        <FilterPanel
          selectedFilters={selectedFilters}
          onFilterChange={setSelectedFilters}
          onReset={handleResetFilters}
        />

        {/* Treks Listing */}
        <div className="flex-grow w-full space-y-6">
          <div className="flex justify-between items-center text-xs font-semibold uppercase tracking-wider text-gray-400">
            <span>Showing {sortedTreks.length} treks</span>
          </div>

          {sortedTreks.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {sortedTreks.map((trek) => (
                <TrekCard key={trek.slug} trek={trek} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white border border-gray-100 rounded-3xl p-8 max-w-xl mx-auto space-y-4 shadow-xs">
              <SlidersHorizontal className="w-12 h-12 text-brand-dusk-orange mx-auto animate-pulse" />
              <h3 className="text-lg font-bold text-brand-dark-text">No matching treks found</h3>
              <p className="text-xs text-gray-500">
                Try loosening your filters, changing the region, or resetting all search options to browse the default list.
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
  );
}

export default function AllTreksPage() {
  return (
    <Suspense fallback={
      <div className="max-w-7xl mx-auto px-4 pt-10 pb-24 sm:pt-16 sm:pb-32 text-center text-gray-500 font-semibold">
        Loading trek packages...
      </div>
    }>
      <TreksList />
    </Suspense>
  );
}
