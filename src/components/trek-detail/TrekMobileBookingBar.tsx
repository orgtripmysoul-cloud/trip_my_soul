"use client";

import React from "react";

interface TrekMobileBookingBarProps {
  /** `null` where no rate is published. */
  price: number | null;
  selectedBatch: string | null;
  onViewDepartures: () => void;
}

/**
 * Sticky mobile bar: fare on the left, the departures sheet trigger on the
 * right. Booking itself happens from a row inside the sheet, which is where a
 * specific batch gets picked on mobile.
 */
export default function TrekMobileBookingBar({
  price,
  selectedBatch,
  onViewDepartures,
}: TrekMobileBookingBarProps) {
  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-[0_-4px_24px_rgba(0,0,0,0.08)] px-4 py-3 safe-bottom flex items-center gap-3">
      <div className="min-w-0 flex-1">
        <span className="text-lg font-extrabold text-brand-forest leading-none block truncate">
          {price === null ? "On request" : `₹${price.toLocaleString()}`}
        </span>
        <span className="text-[10px] text-gray-400 font-semibold block truncate">
          {selectedBatch ?? (price === null ? "Per person" : "+5% GST, per person")}
        </span>
      </div>
      <button
        onClick={onViewDepartures}
        className="shrink-0 bg-brand-forest hover:bg-brand-forest-light text-white px-6 py-3.5 rounded-full font-bold text-sm shadow-lg transition min-h-[48px]"
      >
        View Departures
      </button>
    </div>
  );
}
