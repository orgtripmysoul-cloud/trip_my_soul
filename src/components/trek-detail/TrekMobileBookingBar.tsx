"use client";

import React from "react";

interface TrekMobileBookingBarProps {
  price: number;
  selectedBatch: string | null;
  onBookNow: () => void;
}

export default function TrekMobileBookingBar({
  price,
  selectedBatch,
  onBookNow,
}: TrekMobileBookingBarProps) {
  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-[0_-4px_24px_rgba(0,0,0,0.08)] px-4 py-3 safe-bottom flex items-center gap-3">
      <div className="shrink-0">
        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wide block">From</span>
        <span className="text-lg font-extrabold text-brand-forest leading-none">
          ₹{price.toLocaleString()}
        </span>
      </div>
      <button
        onClick={onBookNow}
        className="flex-1 bg-brand-forest hover:bg-brand-forest-light text-white py-3.5 rounded-full font-bold text-sm shadow-lg transition min-h-[48px]"
      >
        {selectedBatch ? "Book Now" : "Choose Dates"}
      </button>
    </div>
  );
}
