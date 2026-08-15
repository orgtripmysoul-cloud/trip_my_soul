"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CalendarDays, Hash, Users, UserCheck } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { TripListingItem } from "@/data/trips";

interface TripHeaderProps {
  trip: TripListingItem;
  category: string;
}

function StatChip({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/15 rounded-xl px-3 py-2">
      <Icon className="w-4 h-4 text-brand-dusk-orange shrink-0" />
      <div className="leading-tight">
        <span className="block text-[9px] font-bold uppercase tracking-wider text-gray-300">{label}</span>
        <span className="block text-xs font-extrabold text-white">{value}</span>
      </div>
    </div>
  );
}

export default function TripHeader({ trip, category }: TripHeaderProps) {
  // Stored as "2N/3D"; the badge reads better as "3D/2N".
  const durationBadge = `${trip.days}D/${trip.nights}N`;

  return (
    <div className="relative w-full bg-[#0B2545] overflow-hidden">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={trip.heroImage}
        alt={trip.name}
        className="absolute inset-0 w-full h-full object-cover opacity-35 pointer-events-none"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0B2545] via-[#0B2545]/70 to-black/40" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-10 space-y-4">
        <Link
          href={category === "Backpacking Trip" ? "/backpacking-trips" : "/weekend-trips"}
          className="inline-flex items-center gap-2 text-xs font-bold text-brand-dusk-orange hover:text-white transition w-fit"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>All {category === "Backpacking Trip" ? "Backpacking" : "Weekend"} Trips</span>
        </Link>

        {/* Badges */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-brand-dusk-orange bg-white/10 backdrop-blur-md px-3 py-1 rounded-full border border-white/15">
            {category}
          </span>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-white bg-brand-dusk px-3 py-1 rounded-full">
            {durationBadge}
          </span>
          {trip.tripCode && (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-gray-300 bg-white/5 px-2.5 py-1 rounded-full border border-white/10">
              <Hash className="w-3 h-3" />
              {trip.tripCode}
            </span>
          )}
        </div>

        <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold font-serif text-white leading-tight max-w-4xl">
          {trip.name}
        </h1>

        <p className="text-xs sm:text-sm text-gray-300 max-w-2xl leading-relaxed">{trip.tagline}</p>

        {/* Availability + route */}
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-semibold text-gray-200">
          {trip.availability && (
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="w-4 h-4 text-brand-dusk-orange" />
              {trip.availability}
            </span>
          )}
          <span className="inline-flex items-center gap-1.5">
            <span className="bg-white/10 border border-white/15 rounded-lg px-2 py-0.5">{trip.startLocation}</span>
            <ArrowRight className="w-3.5 h-3.5 text-brand-dusk-orange" />
            <span className="bg-white/10 border border-white/15 rounded-lg px-2 py-0.5">
              {trip.endLocation ?? trip.startLocation}
            </span>
          </span>
        </div>

        {/* Stat chips */}
        {(trip.minAge || trip.maxGroupSize) && (
          <div className="flex flex-wrap gap-2 pt-1">
            {trip.minAge && (
              <StatChip
                icon={UserCheck}
                label="Min Age"
                value={trip.maxAge ? `${trip.minAge}–${trip.maxAge} yrs` : `${trip.minAge}+ yrs`}
              />
            )}
            {trip.maxGroupSize && <StatChip icon={Users} label="Group Size" value={trip.maxGroupSize} />}
          </div>
        )}
      </div>
    </div>
  );
}
