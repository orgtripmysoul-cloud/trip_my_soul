"use client";

import React from "react";
import { Star } from "lucide-react";
import { MissingField, TabTitle } from "./TripSectionParts";
import type { TripListingItem } from "@/data/trips";

interface TripReviewsTabProps {
  trip: TripListingItem;
}

/**
 * Reviews are only rendered from real data. Nothing is stubbed in here —
 * inventing testimonials for a bookable trip would misrepresent it.
 */
export default function TripReviewsTab({ trip }: TripReviewsTabProps) {
  const reviews: { name: string; date: string; rating: number; text: string }[] = [];

  return (
    <div className="space-y-5">
      <TabTitle>Reviews</TabTitle>

      {reviews.length === 0 ? (
        <MissingField>
          No traveller reviews have been collected for {trip.name} yet. Reviews will appear here once
          the first departures have run.
        </MissingField>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {reviews.map((r, idx) => (
            <div key={idx} className="p-4 rounded-2xl border border-gray-150 bg-brand-warm-bg/40 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-brand-dark-text">{r.name}</span>
                <div className="flex text-amber-400">
                  {Array.from({ length: r.rating }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
              </div>
              <p className="text-gray-650 leading-relaxed font-medium italic">&quot;{r.text}&quot;</p>
              <span className="text-[10px] text-gray-400 font-semibold">{r.date}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
