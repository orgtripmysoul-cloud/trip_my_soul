"use client";

import React from "react";
import { Backpack, HeartPulse, Info, Plus, Tent, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { getAddOnsForTrip, type TrekAddOnKey } from "@/data/addOns";

const ICONS: Record<TrekAddOnKey, LucideIcon> = {
  insurance: HeartPulse,
  offload: Backpack,
  gear: Tent,
  twinSharing: Users,
};

interface TrekAddOnsModalProps {
  noun: string;
  /** Decides which extras this trip may be sold — twin sharing is not offered everywhere. */
  slug: string;
  onClose: () => void;
  /** Sends the traveller on to pick a batch, where the add-ons are actually chosen. */
  onBookNow: () => void;
}

/**
 * Read-only price list of the optional extras. Selection stays at checkout —
 * this only tells the traveller what each one costs before they commit.
 */
export default function TrekAddOnsModal({ noun, slug, onClose, onBookNow }: TrekAddOnsModalProps) {
  const addOns = getAddOnsForTrip(slug);

  return (
    <>
      <div className="w-12 h-12 rounded-full bg-brand-forest/10 flex items-center justify-center">
        <Plus className="w-6 h-6 text-brand-dusk-orange" />
      </div>

      <div className="space-y-1">
        <h3 className="text-xl font-bold text-brand-dark-text font-serif">Optional Add-ons</h3>
        <p className="text-xs text-gray-500">
          Extras you can attach to any traveller on this {noun.toLowerCase()}, priced per person.
        </p>
      </div>

      <div className="space-y-2.5">
        {addOns.map((addOn) => {
          const Icon = ICONS[addOn.key];
          return (
            <div
              key={addOn.key}
              className="flex items-start justify-between gap-3 p-3.5 rounded-2xl border border-gray-150 bg-brand-warm-bg"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 bg-white rounded-xl text-brand-forest shrink-0">
                  <Icon className="w-4 h-4" />
                </div>
                <div className="space-y-0.5">
                  <span className="block text-xs font-bold text-brand-dark-text">{addOn.label}</span>
                  <span className="block text-[11px] text-gray-500 leading-relaxed">
                    {addOn.description}
                  </span>
                </div>
              </div>
              <span className="text-sm font-extrabold text-brand-forest shrink-0">
                ₹{addOn.price.toLocaleString()}
              </span>
            </div>
          );
        })}
      </div>

      <div className="flex items-start gap-2 text-[11px] text-gray-550 leading-relaxed">
        <Info className="w-3.5 h-3.5 text-brand-dusk-orange shrink-0 mt-0.5" />
        <span>
          Add-ons are optional and charged per person. Pick the ones you want at checkout, after you
          choose a departure batch. GST applies on the total.
        </span>
      </div>

      <div className="flex flex-col sm:flex-row gap-2.5">
        <button
          onClick={onClose}
          className="flex-1 py-3 rounded-full border border-gray-200 text-brand-dark-text font-bold text-xs hover:bg-gray-50 transition"
        >
          Close
        </button>
        <button
          onClick={() => {
            onClose();
            onBookNow();
          }}
          className="flex-1 py-3 rounded-full bg-brand-forest hover:bg-brand-forest-light text-white font-bold text-xs transition shadow-md"
        >
          Continue to Booking
        </button>
      </div>
    </>
  );
}
