"use client";

import React, { useEffect, useState } from "react";
import { ChevronUp, X } from "lucide-react";
import TripBookingForm, { activePrice, type TripBookingState } from "./TripBookingForm";
import type { TripListingItem } from "@/data/trips";

interface TripMobileBookingSheetProps {
  trip: TripListingItem;
  state: TripBookingState;
  onSelectDate: (iso: string) => void;
  onSelectPackage: (id: string) => void;
  onToggleWishlist: () => void;
  onProceed: () => void;
  error?: string | null;
}

/** Below `lg`, the booking widget collapses to a summary bar that opens a bottom sheet. */
export default function TripMobileBookingSheet(props: TripMobileBookingSheetProps) {
  const { trip, state } = props;
  const [isOpen, setIsOpen] = useState(false);
  const price = activePrice(trip, state.selectedPackageId);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="lg:hidden">
      {/* Summary bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 shadow-[0_-4px_24px_rgba(0,0,0,0.08)] px-4 py-3 safe-bottom flex items-center gap-3">
        <div className="shrink-0">
          <div className="flex items-baseline gap-1.5">
            {trip.originalPrice && trip.originalPrice > price && (
              <span className="text-[11px] text-gray-400 line-through font-semibold">
                ₹{trip.originalPrice.toLocaleString()}
              </span>
            )}
            <span className="text-lg font-extrabold text-brand-forest leading-none">
              ₹{price.toLocaleString()}
            </span>
          </div>
          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wide">per person</span>
        </div>
        <button
          onClick={() => setIsOpen(true)}
          className="flex-1 bg-brand-forest hover:bg-brand-forest-light text-white py-3.5 rounded-full font-bold text-sm shadow-lg transition min-h-[48px] flex items-center justify-center gap-1.5"
        >
          <span>Book This Trip</span>
          <ChevronUp className="w-4 h-4" />
        </button>
      </div>

      {/* Bottom sheet */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end" role="dialog" aria-modal="true">
          <button
            onClick={() => setIsOpen(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-xs"
            aria-label="Close booking panel"
          />
          <div className="relative w-full bg-white rounded-t-3xl p-5 pb-8 max-h-[85vh] overflow-y-auto scroll-touch shadow-2xl animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-extrabold font-serif text-brand-dark-text">{trip.name}</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition shrink-0"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <TripBookingForm {...props} compact />
          </div>
        </div>
      )}
    </div>
  );
}
