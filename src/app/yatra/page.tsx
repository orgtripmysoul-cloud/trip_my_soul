"use client";

import React, { useState, useMemo } from "react";
import { Search, Compass } from "lucide-react";
import { YATRAS } from "@/data/db";
import TrekCard from "@/components/TrekCard";
import { featuredRank } from "@/lib/featured";

export default function YatraPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredYatras = useMemo(() => {
    return YATRAS.filter((yatra) => {
      return (
        yatra.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        yatra.region.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (yatra.startLocation && yatra.startLocation.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }).sort((a, b) => featuredRank(a.slug) - featuredRank(b.slug));
  }, [searchQuery]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-24 sm:pt-16 sm:pb-32">
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
        <span className="text-xs font-extrabold uppercase tracking-widest text-brand-dusk">
          Spiritual Yatras
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold font-serif text-brand-dark-text leading-tight">
          Sacred Pilgrimage Journeys
        </h1>
        <p className="text-sm text-gray-500">
          Embark on soul-healing spiritual yatras across the holy shrines of Uttarakhand. Featuring Chardham tours, Kedarnath heli-packages, and Tungnath temple yatras.
        </p>
      </div>

      {/* Search Bar */}
      <div className="flex justify-center mb-12">
        <div className="flex items-center gap-2 px-4 py-3 bg-white rounded-2xl border border-gray-150 shadow-sm w-full max-w-md">
          <Search className="w-5 h-5 text-gray-400 shrink-0" />
          <input
            type="text"
            placeholder="Search Yatras (e.g. Kedarnath, Chardham)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-0 text-base lg:text-sm focus:outline-none w-full text-brand-dark-text placeholder-gray-400 self-stretch py-3 -my-3"
          />
        </div>
      </div>

      {/* Grid listing */}
      {filteredYatras.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredYatras.map((yatra) => (
            <TrekCard key={yatra.slug} trek={yatra} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white border border-gray-150 rounded-3xl p-8 max-w-md mx-auto space-y-3">
          <Compass className="w-10 h-10 text-brand-dusk-orange mx-auto animate-pulse" />
          <h3 className="text-lg font-bold text-brand-dark-text">No pilgrimages found</h3>
          <p className="text-xs text-gray-500">
            No yatras matched your search query. Try typing &ldquo;Kedarnath&rdquo; or &ldquo;Chardham&rdquo;.
          </p>
        </div>
      )}
    </div>
  );
}
