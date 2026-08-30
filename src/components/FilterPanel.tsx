"use client";

import React, { useEffect, useState } from "react";
import { Filter, X, ChevronDown, RefreshCw } from "lucide-react";

export interface FilterState {
  region: string[];
  difficulty: string[];
  months: string[];
  duration: string[];
  themes: string[];
  seasons: string[];
  upcomingOnly: boolean;
}

export interface FilterOptions {
  region: string[];
  difficulty: string[];
  seasons: string[];
  months: string[];
  duration: string[];
  themes: string[];
}

const DEFAULT_FILTER_OPTIONS: FilterOptions = {
  region: ["Uttarakhand", "Himachal Pradesh", "Jammu & Kashmir"],
  difficulty: ["Easy", "Easy-Moderate", "Moderate", "Moderate-Difficult", "Difficult", "Challenging"],
  seasons: ["Spring", "Summer", "Monsoon", "Autumn", "Winter"],
  months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  duration: ["Short (1-4 Days)", "Medium (5-7 Days)", "Long (8-10 Days)", "Expedition (11+ Days)"],
  themes: ["Lakes", "Snow", "Meadow", "Glacier", "Waterfall", "Beginner", "Couples", "Family with Kids", "Off-Beat", "Summit a Peak"],
};

interface FilterPanelProps {
  selectedFilters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  onReset: () => void;
  filterOptions?: FilterOptions;
}

export default function FilterPanel({ selectedFilters, onFilterChange, onReset, filterOptions }: FilterPanelProps) {
  const [isOpenMobile, setIsOpenMobile] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    region: true,
    difficulty: true,
    duration: true,
    seasons: false,
    themes: false,
    months: false,
  });

  const resolvedFilterOptions = filterOptions ?? DEFAULT_FILTER_OPTIONS;

  // Freeze the page behind the mobile sheet, and let Escape close it.
  useEffect(() => {
    if (!isOpenMobile) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpenMobile(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpenMobile]);

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const toggleFilter = (category: keyof Omit<FilterState, "upcomingOnly">, value: string) => {
    const current = selectedFilters[category] as string[];
    const updated = current.includes(value)
      ? current.filter((item) => item !== value)
      : [...current, value];
    
    onFilterChange({
      ...selectedFilters,
      [category]: updated,
    });
  };

  const toggleUpcomingOnly = () => {
    onFilterChange({
      ...selectedFilters,
      upcomingOnly: !selectedFilters.upcomingOnly,
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

  const FilterSection = ({ title, category }: { title: string; category: keyof Omit<FilterState, "upcomingOnly"> }) => {
    const list = resolvedFilterOptions[category];
    const isExpanded = expandedSections[category];

    return (
      <div className="space-y-3 pb-5 border-b border-gray-100">
        <button
          onClick={() => toggleSection(category)}
          className="w-full min-h-[44px] gap-3 text-xs font-bold uppercase tracking-wider text-brand-forest-light flex items-center justify-between hover:text-brand-dusk transition"
          aria-expanded={isExpanded}
        >
          <span className="truncate">{title}</span>
          <ChevronDown className={`w-3.5 h-3.5 shrink-0 opacity-60 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
        </button>
        
        {isExpanded && (
          <div className="flex flex-wrap gap-2 pt-1">
            {list.map((option) => {
              const isChecked = (selectedFilters[category] as string[]).includes(option);
              return (
                <button
                  key={option}
                  onClick={() => toggleFilter(category, option)}
                  className={`text-xs px-3.5 min-h-[44px] lg:min-h-[36px] shrink-0 max-w-full truncate rounded-full border transition-all duration-250 font-semibold ${
                    isChecked
                      ? "bg-brand-forest text-white border-brand-forest shadow-sm scale-102"
                      : "bg-white text-gray-700 border-gray-200 hover:border-brand-forest/30 hover:bg-brand-warm-bg"
                  }`}
                >
                  {option}
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Desktop Sidebar Panel */}
      <aside className="hidden lg:block w-72 shrink-0 bg-white border border-gray-100 rounded-2xl p-6 shadow-sm sticky top-28 self-start max-h-[80vh] overflow-y-auto no-scrollbar">
        <div className="flex items-center justify-between pb-4 border-b border-gray-150 mb-6">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-brand-forest" />
            <h3 className="font-extrabold text-brand-dark-text text-base">Filter Panel</h3>
          </div>
          {isAnyFilterActive && (
            <button
              onClick={onReset}
              className="text-xs font-bold text-brand-dusk hover:text-brand-dusk-orange flex items-center gap-1 transition"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}
        </div>

        {/* Upcoming departures toggle */}
        <div className="flex items-center justify-between pb-5 border-b border-gray-100 mb-5">
          <div className="space-y-0.5">
            <span className="text-xs font-bold text-brand-dark-text block">Upcoming Departures</span>
            <span className="text-[10px] text-gray-400 block font-medium">Within next 60 days</span>
          </div>
          <button
            onClick={toggleUpcomingOnly}
            className={`w-11 h-6 rounded-full relative transition-colors ${
              selectedFilters.upcomingOnly ? "bg-brand-dusk" : "bg-gray-250"
            }`}
            aria-label="Toggle upcoming departures"
          >
            <div
              className={`w-4.5 h-4.5 rounded-full bg-white absolute top-0.75 left-0.75 shadow-sm transition-transform ${
                selectedFilters.upcomingOnly ? "translate-x-5" : ""
              }`}
            />
          </button>
        </div>

        <div className="space-y-5">
          <FilterSection title="Region" category="region" />
          <FilterSection title="Difficulty Grade" category="difficulty" />
          <FilterSection title="Duration" category="duration" />
          <FilterSection title="Seasons" category="seasons" />
          <FilterSection title="Trek Theme" category="themes" />
          <FilterSection title="Best Month" category="months" />
        </div>
      </aside>

      {/* Mobile Floating Button */}
      <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-30 safe-bottom">
        <button
          onClick={() => setIsOpenMobile(true)}
          className="flex items-center gap-2 bg-brand-forest hover:bg-brand-forest-light text-white font-bold px-6 py-3.5 rounded-full shadow-2xl transition duration-200 text-sm min-h-[48px]"
        >
          <Filter className="w-4 h-4" />
          <span>Filters & Sort</span>
          {isAnyFilterActive && (
            <span className="bg-brand-dusk text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">
              {Object.values(selectedFilters).reduce((acc, curr) => {
                if (typeof curr === "boolean") return acc + (curr ? 1 : 0);
                return acc + curr.length;
              }, 0)}
            </span>
          )}
        </button>
      </div>

      {/* Mobile Sidebar Slide-up Drawer */}
      <div
        className={`fixed inset-0 z-40 bg-black/50 backdrop-blur-xs transition-opacity duration-300 lg:hidden ${
          isOpenMobile ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsOpenMobile(false)}
      >
        <div
          className={`absolute bottom-0 left-0 w-full rounded-t-[2rem] sm:rounded-t-[2.5rem] bg-white max-h-[85vh] flex flex-col overflow-hidden shadow-2xl transition-transform duration-300 transform ${
            isOpenMobile ? "translate-y-0" : "translate-y-full"
          }`}
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-label="Filters"
        >
          <div className="flex items-center justify-between gap-3 shrink-0 px-5 pt-5 pb-4 border-b border-gray-200">
            <h3 className="text-lg font-bold text-brand-dark-text flex items-center gap-2">
              <Filter className="w-5 h-5 text-brand-forest" />
              <span>Filters</span>
            </h3>
            <div className="flex items-center gap-2 shrink-0">
              {isAnyFilterActive && (
                <button
                  onClick={onReset}
                  className="min-h-[44px] px-2 text-xs font-semibold text-brand-dusk flex items-center gap-1"
                >
                  <RefreshCw className="w-3.5 h-3.5 shrink-0" />
                  <span>Reset</span>
                </button>
              )}
              <button
                onClick={() => setIsOpenMobile(false)}
                className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
                aria-label="Close filters"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Scrollable facet list */}
          <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-5 py-5">
            {/* Mobile departures toggle */}
            <div className="flex items-center justify-between gap-4 pb-5 border-b border-gray-150 mb-5">
              <div className="space-y-0.5 min-w-0">
                <span className="text-xs font-bold text-brand-dark-text block">Upcoming Departures</span>
                <span className="text-[10px] text-gray-400 block font-medium">Within next 60 days</span>
              </div>
              <button
                onClick={toggleUpcomingOnly}
                className={`w-11 h-6 shrink-0 rounded-full relative transition-colors before:absolute before:content-[''] before:-inset-y-2.5 before:-inset-x-1 ${
                  selectedFilters.upcomingOnly ? "bg-brand-dusk" : "bg-gray-250"
                }`}
                aria-label="Toggle upcoming departures"
              >
                <div
                  className={`w-4.5 h-4.5 rounded-full bg-white absolute top-0.75 left-0.75 shadow-sm transition-transform ${
                    selectedFilters.upcomingOnly ? "translate-x-5" : ""
                  }`}
                />
              </button>
            </div>

            <div className="space-y-6">
              <FilterSection title="Region" category="region" />
              <FilterSection title="Difficulty Grade" category="difficulty" />
              <FilterSection title="Duration" category="duration" />
              <FilterSection title="Seasons" category="seasons" />
              <FilterSection title="Trek Theme" category="themes" />
              <FilterSection title="Best Month" category="months" />
            </div>
          </div>

          {/* Pinned footer - previously absolute inside the scroll box, which
              buried it below six facet groups. */}
          <div className="shrink-0 bg-white px-4 pt-4 safe-bottom-lg border-t border-gray-100">
            <button
              onClick={() => setIsOpenMobile(false)}
              className="w-full min-h-[48px] bg-brand-forest hover:bg-brand-forest-light text-white font-bold py-3.5 rounded-xl text-center shadow-lg transition"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
