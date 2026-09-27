"use client";

import React from "react";
import {
  Activity, Calendar, Compass, Globe, Home, MapPin, Plane, Route, ShieldAlert,
  ShieldCheck, Sparkles, Train, TrendingUp, Users, Utensils,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { ResolvedTrekDetail } from "@/lib/trekDetail";

interface FactProps {
  icon: LucideIcon;
  label: string;
  value: React.ReactNode;
  valueClassName?: string;
}

/** Renders nothing when the listing has no figure — no invented placeholder. */
function Fact({ icon: Icon, label, value, valueClassName = "" }: FactProps) {
  if (value === undefined || value === null || value === "") return null;

  return (
    <div className="flex items-start gap-3">
      <div className="p-2 bg-brand-forest/5 rounded-xl text-brand-forest shrink-0">
        <Icon className="w-4 h-4" />
      </div>
      <div className="min-w-0 flex-1">
        <span className="font-semibold block text-[10px] text-gray-400 uppercase leading-tight">{label}</span>
        <span className={`block font-extrabold text-brand-dark-text text-sm leading-snug break-words hyphens-auto ${valueClassName}`}>
          {value}
        </span>
      </div>
    </div>
  );
}

interface TrekOverviewFactsProps {
  detail: ResolvedTrekDetail;
  noun: string;
}

export default function TrekOverviewFacts({ detail, noun }: TrekOverviewFactsProps) {
  const {
    trek, seasons, trailType, transport, country, maxAltitude, totalDistance,
    cateringFood, campStay, maxGroupSize, endLocation, route,
  } = detail;

  return (
    <div className="bg-white border border-gray-100 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
      <h2 className="text-xl font-extrabold text-brand-dark-text font-serif flex items-center gap-2">
        <Compass className="w-5 h-5 text-brand-dusk-orange" />
        <span>{noun} Overview Facts</span>
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs text-gray-500">
        {/* Column 1 */}
        <div className="space-y-4">
          <Fact icon={Compass} label={`${noun} Name`} value={trek.name} />
          <Fact icon={Calendar} label="Duration" value={`${trek.days} Days / ${trek.nights} Nights`} />
          <Fact icon={Activity} label="Adventure Type" value={trek.category} />
          <Fact icon={MapPin} label="Starts From" value={trek.startLocation} />
          <Fact icon={Sparkles} label="Best Seasons" value={seasons} />
        </div>

        {/* Column 2 */}
        <div className="space-y-4 border-t pt-6 sm:border-t-0 sm:pt-0 sm:border-x border-gray-100 sm:px-6">
          <Fact icon={Globe} label="Country" value={country} valueClassName="font-sans" />
          <Fact icon={TrendingUp} label="Max Altitude" value={maxAltitude} valueClassName="font-sans" />
          <Fact icon={ShieldAlert} label={`${noun} Grade`} value={trek.difficulty} valueClassName="font-sans" />
          <Fact icon={Compass} label="Trail Type" value={trailType} valueClassName="font-sans" />
          <Fact
            icon={Route}
            label="Route"
            value={route && route.length > 0 ? route.join(" → ") : undefined}
            valueClassName="font-sans"
          />
          <Fact icon={Utensils} label="Catering Food" value={cateringFood} valueClassName="font-sans font-medium" />
          <Fact icon={Users} label="Group Size" value={maxGroupSize} valueClassName="font-sans" />
        </div>

        {/* Column 3 */}
        <div className="space-y-4 border-t pt-6 sm:border-t-0 sm:pt-0 border-gray-100">
          <Fact icon={MapPin} label="Location State" value={trek.region} />
          <Fact icon={MapPin} label="Ends At" value={endLocation} />
          <Fact icon={TrendingUp} label={`${noun} Distance`} value={totalDistance} />
          <Fact icon={Train} label="Nearest Rail Head" value={transport.railHead} />
          <Fact icon={Home} label="Camp Stay" value={campStay} />
          <Fact icon={Plane} label="Nearest Airport" value={transport.airport} />
        </div>
      </div>

      <div className="flex flex-col items-center justify-center pt-4 border-t border-gray-100 gap-3">
        <div className="flex items-center gap-1.5 text-xs text-brand-forest font-bold">
          <ShieldCheck className="w-4 h-4 text-brand-dusk-orange" />
          <span>Free rescheduling up to 15 days before batch start</span>
        </div>
      </div>
    </div>
  );
}
