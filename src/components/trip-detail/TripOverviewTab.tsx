"use client";

import React from "react";
import { Sparkles } from "lucide-react";
import { MissingField, SubHeading, TabTitle } from "./TripSectionParts";
import type { TripListingItem } from "@/data/trips";

interface TripOverviewTabProps {
  trip: TripListingItem;
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-0.5">
      <span className="block text-[10px] font-bold uppercase tracking-wider text-gray-400">{label}</span>
      <span className="block text-xs font-extrabold text-brand-dark-text">{value}</span>
    </div>
  );
}

export default function TripOverviewTab({ trip }: TripOverviewTabProps) {
  const route = [trip.startLocation, trip.endLocation].filter(Boolean).join(" → ");

  return (
    <div className="space-y-7">
      <div>
        <TabTitle>Overview</TabTitle>
        {trip.intro ? (
          <p className="text-sm text-gray-650 leading-relaxed">{trip.intro}</p>
        ) : (
          <MissingField>No summary is given in the source itinerary.</MissingField>
        )}
      </div>

      {/* Quick facts */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 bg-brand-warm-bg border border-gray-150 rounded-2xl p-5">
        <Fact label="Category" value={trip.category} />
        <Fact label="Duration" value={`${trip.days}D / ${trip.nights}N`} />
        <Fact label="Region" value={trip.region} />
        <Fact label="Grade" value={trip.difficulty} />
        <Fact label="Route" value={route || trip.startLocation} />
        <Fact
          label="Min age"
          value={trip.minAge ? `${trip.minAge}+ years` : "Not specified"}
        />
        {trip.altitude && <Fact label="Altitude" value={trip.altitude} />}
        {trip.months.length > 0 && <Fact label="Best months" value={trip.months.join(", ")} />}
      </div>

      {/* Highlights */}
      {trip.highlights && trip.highlights.length > 0 && (
        <div>
          <SubHeading>Highlights</SubHeading>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-xs text-gray-650">
            {trip.highlights.map((h) => (
              <li key={h} className="flex items-start gap-2">
                <Sparkles className="w-3.5 h-3.5 text-brand-dusk-orange shrink-0 mt-0.5" />
                <span className="font-medium">{h}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Optional editorial blocks, rendered only when the trip has them */}
      {trip.usps && trip.usps.length > 0 && (
        <div>
          <SubHeading>What makes this trip different</SubHeading>
          <ul className="space-y-3 text-xs text-gray-650 leading-relaxed">
            {trip.usps.map((u) => (
              <li key={u.title}>
                <strong className="text-brand-dark-text">{u.title}</strong> — {u.description}
              </li>
            ))}
          </ul>
        </div>
      )}

      {trip.differentiators && trip.differentiators.length > 0 && (
        <ul className="space-y-2 text-xs text-gray-650 list-disc pl-4 leading-relaxed">
          {trip.differentiators.map((d) => (
            <li key={d}>{d}</li>
          ))}
        </ul>
      )}

      {trip.importantNote && (
        <div className="border-l-3 border-brand-dusk-orange bg-brand-warm-bg/60 rounded-r-xl px-4 py-3">
          <SubHeading>Important</SubHeading>
          <p className="text-xs text-gray-650 leading-relaxed">{trip.importantNote}</p>
        </div>
      )}

      {trip.destinationHighlights && trip.destinationHighlights.length > 0 && (
        <div className="space-y-4">
          <SubHeading>Where you&apos;ll go</SubHeading>
          {trip.destinationHighlights.map((d) => (
            <div key={d.name}>
              <span className="block text-xs font-extrabold text-brand-dark-text">{d.name}</span>
              <p className="text-xs text-gray-650 leading-relaxed">{d.blurb}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
