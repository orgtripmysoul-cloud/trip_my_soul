"use client";

import React from "react";
import type { TripItineraryDay } from "@/data/trips";

interface TripDayTimelineProps {
  day: TripItineraryDay;
  isLast: boolean;
}

/**
 * One day of a short-trip itinerary as a timeline.
 *
 * Distinct from the Himalayan trek itinerary component: entries here carry an
 * optional clock time rather than altitude and distance, and `day: 0` is
 * supported for trips that begin with an overnight journey.
 */
export default function TripDayTimeline({ day, isLast }: TripDayTimelineProps) {
  const isDayZero = day.day === 0;

  return (
    <div className="relative pl-11">
      {/* Spine */}
      {!isLast && <span className="absolute left-[15px] top-9 bottom-[-28px] w-px bg-brand-forest/15" />}

      {/* Day marker */}
      <div
        className={`absolute left-0 top-0 w-8 h-8 rounded-full flex items-center justify-center text-[9px] font-black shadow-xs border-4 border-white ${
          isDayZero ? "bg-brand-dusk-orange text-white" : "bg-brand-forest text-white"
        }`}
      >
        D{day.day}
      </div>

      <div className="space-y-2 pb-7">
        <div className="space-y-0.5">
          <span className="text-[10px] font-black uppercase tracking-wider text-brand-dusk-orange block">
            {isDayZero ? "Day 0 · Departure" : `Day ${day.day}`}
          </span>
          <h4 className="text-sm font-extrabold text-brand-dark-text leading-snug">{day.title}</h4>
        </div>

        <ul className="space-y-1.5">
          {day.entries.map((entry, idx) => (
            <li key={idx} className="flex gap-3 text-xs text-gray-650 leading-relaxed">
              {entry.time ? (
                <span className="shrink-0 w-16 font-bold text-brand-forest tabular-nums">
                  {entry.time}
                </span>
              ) : (
                <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-brand-forest/30 mt-1.5" />
              )}
              <span className="font-medium">{entry.text}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
