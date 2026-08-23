"use client";

import React from "react";
import Link from "next/link";
import { MapPin, Clock, Mountain } from "lucide-react";
import { motion } from "framer-motion";
import { Trek } from "@/data/db";
import { CANONICAL_TRIP_PATHS } from "@/data/trips";

interface TrekCardProps {
  trek: Trek;
  detailsHref?: string;
  imageUrl?: string;
  description?: string;
}

export default function TrekCard({ trek, detailsHref, imageUrl, description }: TrekCardProps) {
  // Difficulty is rendered inline in the meta line, so we only need a text colour here
  const getDifficultyColor = (level: string) => {
    switch (level.toLowerCase()) {
      case "easy":
        return "text-green-700";
      case "moderate":
        return "text-amber-700";
      case "difficult":
      case "strenuous":
        return "text-red-700";
      default:
        return "text-brand-forest";
    }
  };

  const getPlaceholderImage = (slug: string) => {
    // Generate high quality thematic mountain images based on tags/regions
    if (slug.includes("kashmir") || slug.includes("lake")) {
      return "https://images.unsplash.com/photo-1595841696660-ad61476d7f6b?auto=format&fit=crop&w=600&q=80";
    } else if (slug.includes("yatra") || slug.includes("heli") || slug.includes("pilgrimage")) {
      return "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=600&q=80";
    } else {
      return "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80";
    }
  };

  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full"
    >
      {/* Image Banner */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100 shrink-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl ?? getPlaceholderImage(trek.slug)}
          alt={trek.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          loading="lazy"
        />

        {/* Region tag — image otherwise kept clean, stats live in the meta line below */}
        <span className="absolute top-4 left-4 text-[10px] font-extrabold uppercase tracking-wider bg-brand-forest/85 backdrop-blur-md text-white px-3 py-1 rounded-full">
          {trek.region}
        </span>
      </div>

      {/* Details Body */}
      <div className="p-5 flex flex-col flex-grow justify-between">
        <div className="space-y-2.5">
          {/* Title */}
          <h3 className="text-lg font-bold text-brand-dark-text group-hover:text-brand-dusk transition-colors line-clamp-1">
            {trek.name}
          </h3>

          {/* Compact meta line: location · altitude · duration · difficulty */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs font-semibold text-gray-600">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-brand-dusk shrink-0" />
              <span>{trek.startLocation || trek.region}</span>
            </span>

            {trek.maxAltitude && (
              <span className="flex items-center gap-1">
                <Mountain className="w-3.5 h-3.5 text-brand-dusk shrink-0" />
                <span>{trek.maxAltitude}</span>
              </span>
            )}

            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-brand-dusk shrink-0" />
              <span>{trek.days} Days</span>
            </span>

            <span className={`font-extrabold ${getDifficultyColor(trek.difficulty)}`}>
              {trek.difficulty}
            </span>
          </div>

          <p className="text-xs text-gray-500 line-clamp-2">
            {description ??
              trek.tagline ??
              `${trek.days ? `${trek.days}-day ` : ""}${trek.difficulty.toLowerCase()} route in ${trek.region}. Open the trip page for the full day-by-day plan, inclusions and pricing.`}
          </p>
        </div>

        {/* Price & Details Action */}
        <div className="mt-5 pt-4 border-t border-gray-100 space-y-3 font-sans">
          <div className="flex items-end justify-between gap-2">
            <div>
              <span className="text-[10px] text-gray-400 uppercase block font-semibold tracking-wider">
                Starting from
              </span>
              <span className="text-lg font-black text-brand-forest leading-none">
                {trek.price ? `₹${trek.price.toLocaleString()}` : "TBD"}
              </span>
            </div>

            <Link
              href={`/checkout?slug=${trek.slug}`}
              className="text-xs font-extrabold text-brand-dusk-orange hover:underline shrink-0"
            >
              View Departure
            </Link>
          </div>

          <Link
            href={detailsHref ?? CANONICAL_TRIP_PATHS[trek.slug] ?? `/treks/${trek.slug}`}
            className="block w-full py-2.5 px-3 text-center text-xs font-extrabold text-white bg-brand-forest hover:bg-brand-forest-light rounded-xl transition-all duration-200 shadow-xs"
          >
            View Details
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
