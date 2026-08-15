"use client";

import React from "react";
import { ShieldCheck } from "lucide-react";
import type { Trek } from "@/data/db";

interface TrekBookingSidebarProps {
  trek: Trek;
  price: number;
  selectedBatch: string | null;
  onBookNow: () => void;
}

export default function TrekBookingSidebar({
  trek,
  price,
  selectedBatch,
  onBookNow,
}: TrekBookingSidebarProps) {
  return (
    <div className="glass-card rounded-3xl p-6 md:p-8 border border-white/30 shadow-xl sticky top-28 space-y-6 bg-white/60">
      <div className="pb-4 border-b border-gray-100 space-y-1">
        <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider block">
          Registration Fee
        </span>
        <div className="flex items-baseline gap-1.5">
          <span className="text-3xl font-extrabold font-serif text-brand-forest">
            ₹{price.toLocaleString()}
          </span>
          <span className="text-xs text-gray-500">/ person</span>
        </div>
      </div>

      {/* Trip brief specs */}
      <div className="space-y-3.5 text-xs text-gray-650">
        <div className="flex justify-between">
          <span className="text-gray-400 font-semibold">Trek Route:</span>
          <span className="font-bold text-brand-dark-text">{trek.name}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400 font-semibold">Selected Batch:</span>
          <span className="font-bold text-brand-dusk-orange">
            {selectedBatch ? selectedBatch : "Select Batch Above"}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400 font-semibold">Duration:</span>
          <span className="font-bold text-brand-dark-text">
            {trek.days} Days / {trek.nights} Nights
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400 font-semibold">Start Location:</span>
          <span className="font-bold text-brand-dark-text">{trek.startLocation || "TBD"}</span>
        </div>
      </div>

      {/* CTA action */}
      <button
        onClick={onBookNow}
        className="w-full bg-brand-forest hover:bg-brand-forest-light text-white py-4 rounded-full font-bold shadow-lg transition flex items-center justify-center gap-2 hover:-translate-y-0.5 transform duration-200"
      >
        <span>{selectedBatch ? "Book Expedition Slot" : "Choose Departure Dates"}</span>
      </button>

      {/* Safety callouts */}
      <div className="p-3 bg-brand-warm-bg rounded-xl border border-gray-150 text-[10px] text-gray-550 leading-relaxed space-y-1 font-semibold">
        <div className="flex items-center gap-1.5 font-bold text-brand-forest">
          <ShieldCheck className="w-3.5 h-3.5 text-brand-dusk-orange shrink-0" />
          <span>TripMySoul Safety Guarantee</span>
        </div>
        <p>Trek leaders carry Oxygen tanks, hyperbaric safety chambers, and satellite track systems.</p>
      </div>
    </div>
  );
}
