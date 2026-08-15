"use client";

import React from "react";
import { Clock } from "lucide-react";

interface TripEmptySectionProps {
  /** What is missing, e.g. "day-by-day itinerary". */
  label: string;
}

/**
 * Shown when a trip has no data for a section.
 *
 * Deliberately says nothing specific: these trips are bookable, so an invented
 * departure time or price would be worse than an honest gap.
 */
export default function TripEmptySection({ label }: TripEmptySectionProps) {
  return (
    <div className="bg-brand-warm-bg border border-dashed border-gray-250 rounded-2xl p-8 text-center space-y-2">
      <Clock className="w-6 h-6 text-brand-dusk-orange mx-auto" />
      <p className="text-sm font-bold text-brand-dark-text">The {label} is coming soon</p>
      <p className="text-xs text-gray-500 max-w-sm mx-auto leading-relaxed">
        We&apos;re still finalising this for the trip. Message us on WhatsApp and we&apos;ll walk you
        through it directly.
      </p>
    </div>
  );
}
