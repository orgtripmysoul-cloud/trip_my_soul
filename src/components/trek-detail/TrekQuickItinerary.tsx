"use client";

import React, { useEffect, useState } from "react";
import { ChevronDown, ClipboardList, Compass, Maximize2, X } from "lucide-react";
import { ROUTE_MAP_IMAGE } from "@/data/trekDefaults";
import type { QuickItineraryDay } from "@/lib/trekDetail";

interface TrekQuickItineraryProps {
  trekName: string;
  itinerary: QuickItineraryDay[];
}

export default function TrekQuickItinerary({ trekName, itinerary }: TrekQuickItineraryProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isMapModalOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMapModalOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsMapModalOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const hasIllustratedMap =
    trekName.toLowerCase().includes("buran") || trekName.toLowerCase().includes("kedar");

  return (
    <div className="space-y-4 font-sans">
      {/* 1. Header with Collapse Toggle */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="w-full flex items-center justify-between text-left focus:outline-none"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-brand-forest/5 text-brand-forest rounded-full flex items-center justify-center shrink-0">
            <ClipboardList className="w-5 h-5 text-brand-dusk-orange" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-brand-dark-text font-serif leading-none">Quick Itinerary</h2>
            <p className="text-[10px] text-gray-400 mt-1">Get your trek route and day-by-day plan at a glance.</p>
          </div>
        </div>
        <ChevronDown className={`w-5 h-5 text-brand-forest transition-transform ${isCollapsed ? "" : "rotate-180"}`} />
      </button>

      {/* Horizontal Divider */}
      <div className="border-b border-gray-100" />

      {/* Collapsible Content */}
      {!isCollapsed && (
        <div className="space-y-6 pt-2">
          {/* 2. Inline Route Map Card Container */}
          <div className="relative w-full aspect-[16/9] sm:aspect-[21/9] bg-brand-warm-bg border border-gray-150 rounded-2xl overflow-hidden shadow-xs">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={ROUTE_MAP_IMAGE}
              alt={`${trekName} Illustrated Route Map`}
              className="w-full h-full object-cover opacity-85"
            />

            {/* Compass Indicator in Top-Left */}
            <div className="absolute top-3 left-3 bg-[#0B2545]/90 backdrop-blur-xs text-white px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider flex items-center gap-1.5 border border-white/10 shadow-md">
              <Compass className="w-3.5 h-3.5 text-amber-500 animate-spin-slow" />
              <span>{trekName} Route Map</span>
            </div>

            {/* View Fullscreen Action in Top-Right */}
            <button
              onClick={() => setIsMapModalOpen(true)}
              className="absolute top-3 right-3 p-2 bg-[#0B2545]/90 hover:bg-brand-dusk-orange text-white rounded-full transition border border-white/10 shadow-md focus:outline-none flex items-center justify-center"
              title="View Fullscreen"
            >
              <Maximize2 className="w-4 h-4 text-white" />
            </button>

            {/* Map Coming Soon Overlay for other treks */}
            {!hasIllustratedMap && (
              <div className="absolute inset-0 bg-[#0B2545]/40 backdrop-blur-xs flex items-center justify-center p-4">
                <span className="bg-brand-dusk-orange text-white text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full border border-white/10 shadow-lg animate-pulse">
                  Illustrated Map Coming Soon
                </span>
              </div>
            )}
          </div>

          {/* 3. Day-by-Day Itinerary List */}
          <div className="space-y-6 pl-1.5 border-l-2 border-brand-forest/10 ml-2">
            {itinerary.map((day) => (
              <div key={day.day} className="relative pl-6 space-y-1.5">
                {/* day bullet point node */}
                <div className="absolute -left-[7px] top-1.5 w-3.5 h-3.5 rounded-full bg-brand-forest border-4 border-white shadow-xs" />

                <div className="space-y-0.5 leading-tight">
                  <span className="text-xs font-black text-brand-dusk-orange uppercase tracking-wider block">
                    DAY {day.day}
                  </span>
                  <span className="text-sm font-extrabold text-brand-dark-text block">{day.title}</span>
                </div>

                {/* Supporting details */}
                {(day.driveDistance || day.pickupPoint) && (
                  <div className="bg-brand-warm-bg/50 border border-gray-150/40 rounded-xl p-3 space-y-2 text-[10px] text-gray-550 font-sans max-w-xl">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-medium">
                      {day.driveDistance && (
                        <div>
                          <span className="text-gray-400 block uppercase text-[8px] tracking-wider font-extrabold">
                            Drive Distance
                          </span>
                          <span className="font-bold text-brand-dark-text">
                            {day.driveDistance} ({day.drivingTime || "TBD"})
                          </span>
                        </div>
                      )}
                      {day.pickupPoint && (
                        <div>
                          <span className="text-gray-400 block uppercase text-[8px] tracking-wider font-extrabold">
                            Pickup Details
                          </span>
                          <span className="font-bold text-brand-dark-text">
                            {day.pickupTime} at{" "}
                            <a
                              href="#"
                              onClick={(e) => {
                                e.preventDefault();
                                alert("Partner Homestay coordinates: Rohru/Dehradun Hub");
                              }}
                              className="text-brand-dusk underline hover:text-brand-dusk-orange font-black"
                            >
                              {day.pickupPoint}
                            </a>
                          </span>
                        </div>
                      )}
                    </div>
                    {day.transportDetails && (
                      <p className="text-[9px] italic text-gray-400 border-t border-gray-150 pt-2 font-medium">
                        * Note: {day.transportDetails}
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* illustrated route map modal */}
      {isMapModalOpen && (
        <div
          onClick={() => setIsMapModalOpen(false)}
          className="fixed inset-0 bg-black/80 backdrop-blur-xs z-50 flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#031B33] border border-white/10 rounded-3xl overflow-hidden shadow-2xl max-w-3xl w-full relative flex flex-col items-center animate-fade-in"
          >
            {/* Compass in top-left */}
            <div className="absolute top-4 left-4 flex items-center gap-1.5 text-white/50 text-[9px] font-black tracking-wider uppercase font-sans">
              <Compass className="w-4 h-4 animate-spin-slow text-amber-500" />
              <span>North</span>
            </div>

            {/* close button */}
            <button
              onClick={() => setIsMapModalOpen(false)}
              className="absolute top-4 right-4 p-1 rounded-full bg-white/10 hover:bg-white/20 text-white transition z-10"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Map Header */}
            <div className="pt-8 pb-4 text-center">
              <span className="text-[9px] text-amber-500 font-black uppercase tracking-widest block font-sans">
                illustrated topographical route map
              </span>
              <h3 className="text-md font-extrabold text-white font-serif uppercase mt-1 tracking-wider">
                TRIPMYSOUL {trekName.toUpperCase()} TREK MAP
              </h3>
            </div>

            {/* Illustrated Map Image placeholder */}
            <div className="w-full aspect-[4/3] bg-[#021020] relative flex items-center justify-center px-6">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={ROUTE_MAP_IMAGE}
                alt={`${trekName} Illustrated Map`}
                className="w-full h-full object-contain opacity-85"
              />
            </div>

            {/* Caption bar */}
            <div className="w-full bg-[#021020] border-t border-white/5 py-3 text-center text-[10px] text-gray-400 font-sans font-bold uppercase tracking-wider">
              A route map of the {trekName} trek
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
