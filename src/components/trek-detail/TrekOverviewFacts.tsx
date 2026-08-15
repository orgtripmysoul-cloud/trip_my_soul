"use client";

import React from "react";
import {
  Activity, Calendar, Compass, Globe, Home, MapPin, Plane, ShieldAlert,
  ShieldCheck, Sparkles, Train, TrendingUp, Utensils,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { ResolvedTrekDetail } from "@/lib/trekDetail";

interface FactProps {
  icon: LucideIcon;
  label: string;
  value: React.ReactNode;
  valueClassName?: string;
}

function Fact({ icon: Icon, label, value, valueClassName = "" }: FactProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="p-2 bg-brand-forest/5 rounded-xl text-brand-forest shrink-0">
        <Icon className="w-4 h-4" />
      </div>
      <div>
        <span className="font-semibold block text-[10px] text-gray-400 uppercase">{label}</span>
        <span className={`font-extrabold text-brand-dark-text text-sm leading-none ${valueClassName}`}>
          {value}
        </span>
      </div>
    </div>
  );
}

interface TrekOverviewFactsProps {
  detail: ResolvedTrekDetail;
  onViewDepartures: () => void;
}

export default function TrekOverviewFacts({ detail, onViewDepartures }: TrekOverviewFactsProps) {
  const { trek, seasons, trailType, transport, country, maxAltitude, totalDistance, cateringFood, campStay } = detail;

  return (
    <div className="bg-white border border-gray-100 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
      <h2 className="text-xl font-extrabold text-brand-dark-text font-serif flex items-center gap-2">
        <Compass className="w-5 h-5 text-brand-dusk-orange" />
        <span>Trek Overview Facts</span>
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs text-gray-500">
        {/* Column 1 */}
        <div className="space-y-4">
          <Fact icon={Compass} label="Trek Name" value={trek.name} />
          <Fact icon={Calendar} label="Duration" value={`${trek.days} Days / ${trek.nights} Nights`} />
          <Fact icon={Activity} label="Adventure Type" value={trek.category} />
          <Fact icon={MapPin} label="Base Camp" value={trek.startLocation || "TBD"} />
          <Fact icon={Sparkles} label="Best Seasons" value={seasons} />
        </div>

        {/* Column 2 */}
        <div className="space-y-4 border-t sm:border-t-0 sm:border-x border-gray-100 sm:px-6">
          <Fact icon={Globe} label="Country" value={country} valueClassName="font-sans" />
          <Fact icon={TrendingUp} label="Max Altitude" value={maxAltitude} valueClassName="font-sans" />
          <Fact icon={ShieldAlert} label="Trek Grade" value={trek.difficulty} valueClassName="font-sans" />
          <Fact icon={Compass} label="Trail Type" value={trailType} valueClassName="font-sans" />
          <Fact icon={Utensils} label="Catering Food" value={cateringFood} valueClassName="font-sans font-medium" />
        </div>

        {/* Column 3 */}
        <div className="space-y-4 border-t sm:border-t-0 border-gray-100">
          <Fact icon={MapPin} label="Location State" value={trek.region} />
          <Fact icon={TrendingUp} label="Trek Distance" value={totalDistance} />
          <Fact icon={Train} label="Nearest Rail Head" value={transport.railHead} />
          <Fact icon={Home} label="Camp Stay" value={campStay} />
          <Fact
            icon={Plane}
            label="Nearest Airport"
            value={transport.airport}
            valueClassName="truncate max-w-[130px] md:max-w-none block"
          />
        </div>
      </div>

      {/* View Departure Dates button */}
      <div className="flex flex-col items-center justify-center pt-4 border-t border-gray-100 gap-3">
        <button
          onClick={onViewDepartures}
          className="bg-brand-dusk hover:bg-brand-dusk-orange text-white font-extrabold px-8 py-3.5 rounded-full shadow-lg transition-transform hover:-translate-y-0.5"
        >
          View Departure Dates
        </button>
        <div className="flex items-center gap-1.5 text-xs text-brand-forest font-bold">
          <ShieldCheck className="w-4 h-4 text-brand-dusk-orange" />
          <span>Free rescheduling up to 15 days before batch start</span>
        </div>
      </div>
    </div>
  );
}
