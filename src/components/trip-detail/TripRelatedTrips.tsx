"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Clock, MapPin } from "lucide-react";
import { getTripBySlug, type TripListingItem } from "@/data/trips";

interface TripRelatedTripsProps {
  trip: TripListingItem;
}

/**
 * Cards for the trips listed in `relatedSlugs`, resolved across both
 * catalogues so a weekend trip can point at a backpacking one and back.
 * Renders nothing when a trip has no siblings, rather than an empty shell.
 */
export default function TripRelatedTrips({ trip }: TripRelatedTripsProps) {
  const related = (trip.relatedSlugs ?? [])
    .filter((slug) => slug !== trip.slug)
    .map(getTripBySlug)
    .filter((t): t is TripListingItem => Boolean(t));

  if (related.length === 0) return null;

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-extrabold text-brand-dark-text font-serif mb-1">
          You may also like
        </h2>
        <p className="text-xs text-gray-500">Other journeys in the same region or on the same circuit.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {related.map((r) => (
          <Link
            key={r.slug}
            href={r.detailsPath}
            className="group bg-white border border-gray-150 rounded-2xl overflow-hidden shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col"
          >
            <div className="relative aspect-[16/10] overflow-hidden bg-gray-100 shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={r.heroImage}
                alt={`${r.name} — ${r.region}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                loading="lazy"
              />
              <span className="absolute top-3 left-3 text-[9px] font-extrabold uppercase tracking-wider bg-brand-forest/85 backdrop-blur-md text-white px-2.5 py-1 rounded-full">
                {r.duration}
              </span>
            </div>

            <div className="p-4 flex flex-col flex-grow justify-between gap-3">
              <div className="space-y-1.5">
                <h3 className="text-sm font-bold text-brand-dark-text group-hover:text-brand-dusk transition-colors line-clamp-1">
                  {r.name}
                </h3>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-semibold text-gray-500">
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-brand-dusk shrink-0" />
                    {r.region}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Clock className="w-3 h-3 text-brand-dusk shrink-0" />
                    {r.days} days
                  </span>
                </div>
                <p className="text-[11px] text-gray-500 line-clamp-2 leading-relaxed">{r.tagline}</p>
              </div>

              <div className="flex items-end justify-between gap-2 pt-2 border-t border-gray-100">
                <span className="text-sm font-black text-brand-forest leading-none">
                  {r.price !== null ? `₹${r.price.toLocaleString()}` : "On request"}
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-brand-dusk-orange">
                  View
                  <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
