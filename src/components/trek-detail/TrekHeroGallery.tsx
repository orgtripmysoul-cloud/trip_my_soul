"use client";

import React from "react";
import { ArrowRight, CalendarDays, Hash, MapPin } from "lucide-react";
import type { ResolvedTrekDetail } from "@/lib/trekDetail";

interface TrekHeroGalleryProps {
  detail: ResolvedTrekDetail;
}

export default function TrekHeroGallery({ detail }: TrekHeroGalleryProps) {
  const { trek, heroImage, tripCode, availability, endLocation } = detail;
  const start = trek.startLocation || "Dehradun";

  return (
    <div className="relative h-[58vh] min-h-[380px] md:h-[72vh] md:min-h-[520px] lg:h-[78vh] lg:max-h-[820px] w-full bg-brand-forest overflow-hidden">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={heroImage}
        alt={trek.name}
        className="w-full h-full object-cover opacity-50 pointer-events-none"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-brand-warm-bg via-transparent to-black/35" />

      <div className="absolute bottom-8 md:bottom-12 left-0 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-brand-dusk-orange bg-brand-forest/65 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 inline-block">
              {trek.region}
            </span>
            {tripCode && (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-white bg-brand-forest/65 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10">
                <Hash className="w-3 h-3" />
                {tripCode}
              </span>
            )}
            {availability && (
              <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-white bg-brand-forest/65 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10">
                <CalendarDays className="w-3 h-3 text-brand-dusk-orange" />
                {availability}
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold font-serif text-brand-dark-text md:text-white leading-tight">
            {trek.name}
          </h1>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs font-semibold text-[#040273] md:text-blue-200">
            <span className="flex items-center gap-2.5">
              <MapPin className="w-3.5 h-3.5 text-brand-dusk-orange" />
              <span>Starting Point: {start}</span>
            </span>
            {endLocation && endLocation !== start && (
              <span className="flex items-center gap-2">
                <ArrowRight className="w-3.5 h-3.5 text-brand-dusk-orange" />
                <span>Ends at: {endLocation}</span>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
