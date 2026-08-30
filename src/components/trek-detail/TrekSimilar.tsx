"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { HERO_IMAGE } from "@/data/trekDefaults";
import type { Trek } from "@/data/db";

interface TrekSimilarProps {
  similarTreks: Trek[];
  totalTrekCount: number;
  noun: string;
  /** Catalogue this listing belongs to, e.g. `/weekend-trips`. */
  browseHref: string;
}

export default function TrekSimilar({ similarTreks, totalTrekCount, noun, browseHref }: TrekSimilarProps) {
  const plural = `${noun}s`;

  return (
    <>
      <div className="flex items-center justify-between border-b border-gray-100 pb-4">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-brand-dusk-orange block">
            Explore Alternatives
          </span>
          <h2 className="text-xl font-extrabold text-brand-dark-text font-serif">Similar {plural}</h2>
        </div>
        <Link
          href={browseHref}
          className="text-xs font-bold inline-flex items-center min-h-[44px] text-brand-forest hover:text-brand-dusk-orange transition flex items-center gap-1"
        >
          <span>View All {totalTrekCount} {plural}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {similarTreks.map((st) => {
          const href = st.detailsPath ?? `/treks/${st.slug}`;
          return (
            <div
              key={st.slug}
              className="border border-gray-150 rounded-2xl overflow-hidden bg-white hover:shadow-md transition group flex flex-col justify-between"
            >
              <div className="relative aspect-video w-full overflow-hidden bg-gray-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={st.heroImage ?? HERO_IMAGE}
                  alt={st.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-3 left-3 text-[9px] font-extrabold uppercase bg-[#0B2545]/90 text-white px-2.5 py-1 rounded-full backdrop-blur-xs">
                  {st.region}
                </span>
              </div>

              <div className="p-4 space-y-3 flex-grow flex flex-col justify-between">
                <div className="space-y-1">
                  <h3 className="font-extrabold text-sm text-brand-dark-text font-serif group-hover:text-brand-forest transition">
                    {st.name}
                  </h3>
                  <div className="flex items-center gap-3 text-[11px] text-gray-500 font-medium">
                    <span>📅 {st.days} Days</span>
                    <span>•</span>
                    <span className="text-brand-forest font-bold">{st.difficulty}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                  <div>
                    <span className="text-[9px] text-gray-400 uppercase block font-semibold">Starting from</span>
                    <span className="text-sm font-black text-brand-forest">
                      {st.price ? `₹${st.price.toLocaleString()}` : "On request"}
                    </span>
                  </div>
                  <Link
                    href={href}
                    className="px-3.5 py-1.5 min-h-[44px] inline-flex items-center justify-center rounded-full bg-[#0B2545] hover:bg-brand-dusk-orange text-white text-xs font-bold transition shadow-xs"
                  >
                    Explore →
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
