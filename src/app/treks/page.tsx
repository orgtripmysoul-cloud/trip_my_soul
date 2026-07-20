"use client";

import React, { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, ArrowUpDown } from "lucide-react";
import { TREKS } from "@/data/db";
import TrekCard from "@/components/TrekCard";
import FilterPanel from "@/components/FilterPanel";

interface FilterState {
  region: string[];
  difficulty: string[];
  months: string[];
  duration: string[];
  themes: string[];
}

const initialFilters: FilterState = {
  region: [],
  difficulty: [],
  months: [],
  duration: [],
  themes: [],
};

function TreksList() {
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilters, setSelectedFilters] = useState<FilterState>(initialFilters);
  const [sortBy, setSortBy] = useState("price-asc");

  // Read filter query from URL if present (e.g. from homepage trending button)
  useEffect(() => {
    const filterQuery = searchParams.get("filter");
    const regionQuery = searchParams.get("region");
    
    if (filterQuery === "trending") {
      // Set to some default or logic for trending, e.g. select all regions by default
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
      // Search text query
      const matchesSearch =
        trek.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        trek.region.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (trek.startLocation && trek.startLocation.toLowerCase().includes(searchQuery.toLowerCase()));

      if (!matchesSearch) return false;

      // Region Filter
      if (selectedFilters.region.length > 0 && !selectedFilters.region.includes(trek.region)) {
        return false;
      }

      // Difficulty Filter
      if (selectedFilters.difficulty.length > 0 && !selectedFilters.difficulty.includes(trek.difficulty)) {
        return false;
      }

      // Month Filter
      if (selectedFilters.months.length > 0) {
        const hasMatchingMonth = trek.months.some((m) => selectedFilters.months.includes(m));
        if (!hasMatchingMonth) return false;
      }

      // Theme Filter
      if (selectedFilters.themes.length > 0) {
        const hasMatchingTheme = trek.themes.some((t) => selectedFilters.themes.includes(t));
        if (!hasMatchingTheme) return false;
      }

      // Duration Filter
      if (selectedFilters.duration.length > 0) {
        const days = typeof trek.days === "number" ? trek.days : parseInt(trek.days || "0");
        const matchesDuration = selectedFilters.duration.some((range) => {
          if (range.startsWith("Short") && days <= 4) return true;
          if (range.startsWith("Medium") && days >= 5 && days <= 7) return true;
          if (range.startsWith("Long") && days >= 8) return true;
          return false;
        });
        if (!matchesDuration) return false;
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
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-8 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm w-full">
        {/* Search */}
        <div className="flex items-center gap-2 px-3 py-2 bg-brand-warm-bg rounded-xl border border-gray-150 w-full sm:max-w-md">
          <Search className="w-4 h-4 text-gray-400 shrink-0" />
          <input
            type="text"
            placeholder="Search treks (e.g. Kedarkantha, Sankri)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-0 text-sm focus:outline-none w-full text-brand-dark-text placeholder-gray-400"
          />
        </div>

        {/* Sort select */}
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
