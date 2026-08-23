"use client";

import React, { useState, useMemo } from "react";
import { Search, SlidersHorizontal, ArrowUpDown } from "lucide-react";
import TrekCard from "@/components/TrekCard";
import FilterPanel, { FilterState } from "@/components/FilterPanel";
import {
  TripListingItem,
  tripToTrek,
  tripSearchHaystack,
  deriveFilterOptionsFromTrips,
  deriveQuickFilters,
} from "@/data/trips";

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
  Winter: ["Dec", "Jan", "Feb"],
  Spring: ["Mar", "Apr"],
  Summer: ["May", "Jun"],
  Monsoon: ["Jul", "Aug"],
  Autumn: ["Sep", "Oct", "Nov"],
};

interface TripCatalogPageProps {
  trips: TripListingItem[];
  eyebrow: string;
  title: string;
  description: string;
  counterLabel: string;
  searchPlaceholder: string;
  emptyMessage: string;
}

export default function TripCatalogPage({
  trips,
  eyebrow,
  title,
  description,
  counterLabel,
  searchPlaceholder,
  emptyMessage,
}: TripCatalogPageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilters, setSelectedFilters] = useState<FilterState>(initialFilters);
  const [sortBy, setSortBy] = useState("price-asc");

  const filterOptions = useMemo(() => deriveFilterOptionsFromTrips(trips), [trips]);

  const filteredTrips = useMemo(() => {
    return trips.filter((trip) => {
      const trek = tripToTrek(trip);

      // Matches on name, alternate spellings, region, route, theme and highlights,
      // so "Madmaheshwar" or "Kedar" surfaces every relevant package.
      const query = searchQuery.trim().toLowerCase();
      if (query && !tripSearchHaystack(trip).includes(query)) return false;

      if (selectedFilters.region.length > 0 && !selectedFilters.region.includes(trek.region)) {
        return false;
      }

      if (selectedFilters.difficulty.length > 0) {
        const matchesDiff = selectedFilters.difficulty.some((diff) => {
          if (diff === "Easy-Moderate") {
            return trek.difficulty.includes("Easy") || trek.difficulty.toLowerCase().includes("moderate");
          }
          if (diff === "Moderate-Difficult") {
            return trek.difficulty.toLowerCase().includes("moderate") || trek.difficulty.toLowerCase().includes("difficult");
          }
          return trek.difficulty.toLowerCase().includes(diff.toLowerCase());
        });
        if (!matchesDiff) return false;
      }

      if (selectedFilters.months.length > 0) {
        const hasMatchingMonth = trek.months.some((m) => selectedFilters.months.includes(m));
        if (!hasMatchingMonth) return false;
      }

      if (selectedFilters.seasons.length > 0) {
        const hasMatchingSeason = selectedFilters.seasons.some((season) => {
          const seasonMonths = SEASON_MAP[season] || [];
          return trek.months.some((m) => seasonMonths.includes(m));
        });
        if (!hasMatchingSeason) return false;
      }

      if (selectedFilters.themes.length > 0) {
        const matchesTheme = selectedFilters.themes.some((theme) => {
          if (theme === "Lakes") return trek.themes.some((t) => t.toLowerCase().includes("lake"));
          if (theme === "Snow") return trek.themes.some((t) => t.toLowerCase().includes("snow"));
          if (theme === "Meadow") return trek.themes.some((t) => t.toLowerCase().includes("meadow"));
          if (theme === "Beginner") return trek.difficulty.toLowerCase().includes("easy");
          if (theme === "Family with Kids") return trek.themes.some((t) => t.toLowerCase().includes("family"));
          return trek.themes.some((t) => t.toLowerCase().includes(theme.toLowerCase()));
        });
        if (!matchesTheme) return false;
      }

      if (selectedFilters.duration.length > 0) {
        const days = typeof trek.days === "number" ? trek.days : parseInt(String(trek.days ?? "0"), 10);
        const matchesDuration = selectedFilters.duration.some((range) => {
          if (range.startsWith("Short") && days <= 4) return true;
          if (range.startsWith("Medium") && days >= 5 && days <= 7) return true;
          if (range.startsWith("Long") && days >= 8 && days <= 10) return true;
          if (range.startsWith("Expedition") && days >= 11) return true;
          return false;
        });
        if (!matchesDuration) return false;
      }

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
  }, [trips, searchQuery, selectedFilters]);

  const sortedTrips = useMemo(() => {
    return [...filteredTrips].sort((a, b) => {
      const priceA = a.price || 0;
      const priceB = b.price || 0;
      const daysA = a.days;
      const daysB = b.days;

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
  }, [filteredTrips, sortBy]);

  const handleResetFilters = () => {
    setSelectedFilters(initialFilters);
    setSearchQuery("");
  };

  const handleQuickFilter = (category: keyof Omit<FilterState, "upcomingOnly">, value: string) => {
    setSelectedFilters({
      ...initialFilters,
      [category]: [value],
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

  const quickFilters = deriveQuickFilters(
    trips,
    selectedFilters,
    isAnyFilterActive,
    handleResetFilters,
    handleQuickFilter
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-24 sm:pt-16 sm:pb-32">
      <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
        <span className="text-xs font-extrabold uppercase tracking-widest text-brand-dusk">{eyebrow}</span>
        <h1 className="text-4xl sm:text-5xl font-extrabold font-serif text-brand-dark-text leading-tight">{title}</h1>
        <p className="text-sm text-gray-500">{description}</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-6 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm w-full">
        <div className="flex items-center gap-2 px-3 py-2 bg-brand-warm-bg rounded-xl border border-gray-150 w-full sm:max-w-md">
          <Search className="w-4 h-4 text-gray-400 shrink-0" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-0 text-sm focus:outline-none w-full text-brand-dark-text placeholder-gray-400"
          />
        </div>

        <div className="flex items-center gap-2.5 shrink-0 w-full sm:w-auto justify-end">
          <ArrowUpDown className="w-4 h-4 text-brand-forest shrink-0" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="text-xs font-semibold py-2 px-4 rounded-xl border border-gray-200 bg-white focus:outline-none text-brand-dark-text"
          >
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="days-asc">Duration: Short to Long</option>
            <option value="days-desc">Duration: Long to Short</option>
          </select>
        </div>
      </div>

      <div className="lg:hidden flex overflow-x-auto scroll-touch no-scrollbar gap-2 pb-4 mb-6 -mx-4 px-4 whitespace-nowrap">
        {quickFilters.map((pill) => (
          <button
            key={pill.label}
            onClick={pill.action}
            className={`text-xs px-4 py-2 rounded-full border font-bold transition-all duration-200 ${
              pill.active
                ? "bg-brand-forest text-white border-brand-forest shadow-xs scale-102"
                : "bg-white text-gray-700 border-gray-150"
            }`}
          >
            {pill.label}
          </button>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        <FilterPanel
          selectedFilters={selectedFilters}
          onFilterChange={setSelectedFilters}
          onReset={handleResetFilters}
          filterOptions={filterOptions}
        />

        <div className="flex-grow w-full space-y-6">
          <div className="flex justify-between items-center text-xs font-semibold uppercase tracking-wider text-gray-400">
            <span>
              Showing {sortedTrips.length} {counterLabel}
            </span>
          </div>

          {sortedTrips.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {sortedTrips.map((trip) => (
                <TrekCard
                  key={trip.slug}
                  trek={tripToTrek(trip)}
                  detailsHref={trip.detailsPath}
                  imageUrl={trip.heroImage}
                  description={trip.tagline}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white border border-gray-100 rounded-3xl p-8 max-w-xl mx-auto space-y-4 shadow-xs">
              <SlidersHorizontal className="w-12 h-12 text-brand-dusk-orange mx-auto animate-pulse" />
              <h3 className="text-lg font-bold text-brand-dark-text">No matching trips found</h3>
              <p className="text-xs text-gray-500">{emptyMessage}</p>
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
