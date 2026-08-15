"use client";

import React from "react";
import { MapPin } from "lucide-react";
import { HERO_IMAGE } from "@/data/trekDefaults";
import type { Trek } from "@/data/db";

interface TrekHeroGalleryProps {
  trek: Trek;
}

export default function TrekHeroGallery({ trek }: TrekHeroGalleryProps) {
  return (
    <div className="relative h-[40vh] md:h-[45vh] w-full bg-brand-forest overflow-hidden">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={HERO_IMAGE}
        alt={trek.name}
        className="w-full h-full object-cover opacity-50 pointer-events-none"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-brand-warm-bg via-transparent to-black/35" />

      <div className="absolute bottom-6 left-0 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-2">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-brand-dusk-orange bg-brand-forest/65 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 inline-block">
            {trek.region}
          </span>
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold font-serif text-brand-dark-text md:text-white leading-tight">
            {trek.name}
          </h1>
          <div className="flex items-center gap-2.5 text-xs font-semibold text-[#040273] md:text-blue-200">
            <MapPin className="w-3.5 h-3.5 text-brand-dusk-orange" />
            <span>Starting Point: {trek.startLocation || "Dehradun"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
