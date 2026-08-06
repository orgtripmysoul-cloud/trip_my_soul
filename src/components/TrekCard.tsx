"use client";

import React from "react";
import Link from "next/link";
import { MapPin, Calendar, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Trek } from "@/data/db";

interface TrekCardProps {
  trek: Trek;
}

export default function TrekCard({ trek }: TrekCardProps) {
  // Determine color coding for difficulty badge
  const getDifficultyColor = (level: string) => {
    switch (level.toLowerCase()) {
      case "easy":
        return "bg-green-500/10 text-green-700 border-green-500/20";
      case "moderate":
        return "bg-amber-500/10 text-amber-700 border-amber-500/20";
      case "difficult":
      case "strenuous":
        return "bg-red-500/10 text-red-700 border-red-500/20";
      default:
        return "bg-brand-forest/10 text-brand-forest border-brand-forest/20";
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
          src={getPlaceholderImage(trek.slug)}
          alt={trek.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          loading="lazy"
        />
        
        {/* Floating details */}
        <div className="absolute top-4 left-4 flex gap-2">
          <span className={`text-xs font-bold px-3 py-1 rounded-full border ${getDifficultyColor(trek.difficulty)}`}>
            {trek.difficulty}
          </span>
        </div>

        {/* Floating Season / Duration */}
        <div className="absolute bottom-4 left-4 bg-brand-forest/80 backdrop-blur-md text-white text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-brand-dusk-orange" />
          <span>{trek.days} Days / {trek.nights} Nights</span>
        </div>
      </div>

      {/* Details Body */}
      <div className="p-5 flex flex-col flex-grow justify-between">
        <div className="space-y-2">
          {/* Region */}
          <div className="flex items-center text-gray-500 gap-1.5 text-xs font-semibold uppercase tracking-wider">
            <MapPin className="w-3.5 h-3.5 text-brand-dusk" />
            <span>{trek.region}</span>
          </div>

          {/* Title */}
          <h3 className="text-lg font-bold text-brand-dark-text group-hover:text-brand-dusk transition-colors line-clamp-1">
            {trek.name}
          </h3>
          
          <p className="text-xs text-gray-500 line-clamp-2">
            Experience the scenic trails of {trek.startLocation || "the Himalayas"}. Prepare for breathtaking heights and beautiful valley stays.
          </p>
        </div>

        {/* Departure & Details Action Buttons */}
        <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between gap-2.5 font-sans">
          <Link
            href={`/checkout?slug=${trek.slug}`}
            className="flex-1 py-2.5 px-3 text-center text-xs font-extrabold text-brand-dusk-orange bg-brand-dusk-orange/10 hover:bg-brand-dusk-orange hover:text-white rounded-xl transition-all duration-200 border border-brand-dusk-orange/30 shadow-xs"
          >
            View Departure
          </Link>

          <Link
            href={`/treks/${trek.slug}`}
            className="flex-1 py-2.5 px-3 text-center text-xs font-extrabold text-white bg-brand-forest hover:bg-brand-forest-light rounded-xl transition-all duration-200 shadow-xs"
          >
            View Details
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
