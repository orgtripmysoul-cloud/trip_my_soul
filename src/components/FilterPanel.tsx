"use client";

import React, { useState } from "react";
import { Filter, X, ChevronDown, RefreshCw } from "lucide-react";

interface FilterState {
  region: string[];
  difficulty: string[];
  months: string[];
  duration: string[];
  themes: string[];
}

interface FilterPanelProps {
  selectedFilters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  onReset: () => void;
}

export default function FilterPanel({ selectedFilters, onFilterChange, onReset }: FilterPanelProps) {
  const [isOpenMobile, setIsOpenMobile] = useState(false);

  const filterOptions = {
    region: ["Uttarakhand", "Himachal Pradesh", "Jammu & Kashmir"],
    difficulty: ["Easy", "Moderate", "Difficult"],
    months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    duration: ["Short (1-4 Days)", "Medium (5-7 Days)", "Long (8+ Days)"],
    themes: ["Snow", "Meadow", "Lake", "Pass Crossing", "Glacier", "Pilgrimage"],
  };

  const toggleFilter = (category: keyof FilterState, value: string) => {
    const current = selectedFilters[category] as string[];
    const updated = current.includes(value)
      ? current.filter((item) => item !== value)
      : [...current, value];
    
    onFilterChange({
      ...selectedFilters,
      [category]: updated,
    });
  };

  const isAnyFilterActive = Object.values(selectedFilters).some((arr) => arr.length > 0);

  const FilterSection = ({ title, category }: { title: string; category: keyof FilterState }) => {
    const list = filterOptions[category];
    return (
      <div className="space-y-3 pb-6 border-b border-gray-200/50">
        <h4 className="text-xs font-bold uppercase tracking-wider text-brand-forest-light flex items-center justify-between">
          <span>{title}</span>
          <ChevronDown className="w-3.5 h-3.5 opacity-60" />
        </h4>
        <div className="flex flex-wrap gap-2">
          {list.map((option) => {
            const isChecked = (selectedFilters[category] as string[]).includes(option);
            return (
              <button
                key={option}
                onClick={() => toggleFilter(category, option)}
                className={`text-xs px-3 py-1.5 rounded-full border transition-all duration-200 font-medium ${
                  isChecked
                    ? "bg-brand-forest text-white border-brand-forest shadow-sm"
                    : "bg-white text-gray-700 border-gray-200 hover:border-brand-forest/30 hover:bg-brand-warm-bg"
                }`}
              >
                {option}
              </button>
            );
          })}
        </div>
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
              className="text-xs font-semibold text-brand-dusk hover:text-brand-dusk-orange flex items-center gap-1 transition"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}
        </div>

        <div className="space-y-6">
          <FilterSection title="Region" category="region" />
          <FilterSection title="Difficulty Grade" category="difficulty" />
          <FilterSection title="Duration" category="duration" />
          <FilterSection title="Trek Theme" category="themes" />
          <FilterSection title="Best Month" category="months" />
        </div>
      </aside>

      {/* Mobile Floating Button */}
      <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-30">
        <button
          onClick={() => setIsOpenMobile(true)}
          className="flex items-center gap-2 bg-brand-forest hover:bg-brand-forest-light text-white font-bold px-6 py-3.5 rounded-full shadow-2xl transition duration-200 text-sm"
        >
          <Filter className="w-4 h-4" />
          <span>Filters & Sort</span>
          {isAnyFilterActive && (
            <span className="bg-brand-dusk text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">
              {Object.values(selectedFilters).reduce((acc, curr) => acc + curr.length, 0)}
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
          className={`absolute bottom-0 left-0 w-full rounded-t-[2.5rem] bg-white p-6 max-h-[85vh] overflow-y-auto shadow-2xl transition-transform duration-300 transform ${
            isOpenMobile ? "translate-y-0" : "translate-y-full"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between pb-4 border-b border-gray-200 mb-6">
            <h3 className="text-lg font-bold text-brand-dark-text flex items-center gap-2">
              <Filter className="w-5 h-5 text-brand-forest" />
              <span>Filters</span>
            </h3>
            <div className="flex items-center gap-4">
              {isAnyFilterActive && (
                <button
                  onClick={onReset}
                  className="text-xs font-semibold text-brand-dusk flex items-center gap-1"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
              )}
              <button
                onClick={() => setIsOpenMobile(false)}
                className="p-1 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div className="space-y-6 pb-20">
            <FilterSection title="Region" category="region" />
            <FilterSection title="Difficulty Grade" category="difficulty" />
            <FilterSection title="Duration" category="duration" />
            <FilterSection title="Trek Theme" category="themes" />
            <FilterSection title="Best Month" category="months" />
          </div>

          <div className="absolute bottom-0 left-0 w-full bg-white p-4 border-t border-gray-100 flex gap-4">
            <button
              onClick={() => setIsOpenMobile(false)}
              className="w-full bg-brand-forest hover:bg-brand-forest-light text-white font-bold py-3.5 rounded-xl text-center shadow-lg transition"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
