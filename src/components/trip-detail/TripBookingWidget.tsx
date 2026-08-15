"use client";

import React from "react";
import TripBookingForm, { type TripBookingState } from "./TripBookingForm";
import type { TripListingItem } from "@/data/trips";

interface TripBookingWidgetProps {
  trip: TripListingItem;
  state: TripBookingState;
  onSelectDate: (iso: string) => void;
  onSelectPackage: (id: string) => void;
  onToggleWishlist: () => void;
  onProceed: () => void;
  error?: string | null;
}

/** Desktop-only sticky right rail. Mobile uses TripMobileBookingSheet. */
export default function TripBookingWidget(props: TripBookingWidgetProps) {
  return (
    <div className="hidden lg:block w-full lg:w-[22rem] shrink-0">
      <div className="bg-white rounded-3xl p-6 border border-gray-150 shadow-lg sticky top-[9.5rem]">
        <TripBookingForm {...props} />
      </div>
    </div>
  );
}
