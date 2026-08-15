"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import TripHeader from "./TripHeader";
import TripTabNav, { TRIP_TABS } from "./TripTabNav";
import TripBookingWidget from "./TripBookingWidget";
import TripMobileBookingSheet from "./TripMobileBookingSheet";
import TripEmptySection from "./TripEmptySection";
import { formatBatchDate, activePrice, type TripBookingState } from "./TripBookingForm";
import type { TripListingItem } from "@/data/trips";

interface TripDetailPageProps {
  trip: TripListingItem;
  category: "Weekend Trip" | "Backpacking Trip";
}

/** Shared white card shell used by every tab panel. */
const PANEL = "bg-white border border-gray-150 rounded-3xl p-6 md:p-8 shadow-sm scroll-mt-40";

export default function TripDetailPage({ trip, category }: TripDetailPageProps) {
  const router = useRouter();

  const [activeTabId, setActiveTabId] = useState("overview");
  const [booking, setBooking] = useState<TripBookingState>({
    selectedDate: null,
    selectedPackageId: trip.packages?.[0]?.id ?? null,
    wishlisted: false,
  });
  const [bookingError, setBookingError] = useState<string | null>(null);

  // Highlight the tab whose panel is currently in view.
  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 220;
      for (const tab of TRIP_TABS) {
        const el = document.getElementById(tab.id);
        if (el && scrollPos >= el.offsetTop && scrollPos < el.offsetTop + el.offsetHeight) {
          setActiveTabId(tab.id);
          break;
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleTabClick = (tabId: string) => {
    const el = document.getElementById(tabId);
    if (el) {
      window.scrollTo({ top: el.offsetTop - 160, behavior: "smooth" });
      setActiveTabId(tabId);
    }
  };

  const handleProceed = () => {
    const needsDate = !!trip.batchDates?.length;
    if (needsDate && !booking.selectedDate) {
      setBookingError("Pick a departure date to continue.");
      return;
    }
    setBookingError(null);

    const { day, month } = booking.selectedDate
      ? formatBatchDate(booking.selectedDate)
      : { day: 0, month: "" };
    const year = booking.selectedDate?.split("-")[0] ?? "";
    const batchLabel = booking.selectedDate ? `${day} ${month} ${year}` : "Flexible dates";

    router.push(
      `/checkout?slug=${trip.slug}&batch=${encodeURIComponent(batchLabel)}&price=${activePrice(trip, booking.selectedPackageId)}`
    );
  };

  const bookingProps = {
    trip,
    state: booking,
    error: bookingError,
    onSelectDate: (iso: string) => {
      setBooking((b) => ({ ...b, selectedDate: iso }));
      setBookingError(null);
    },
    onSelectPackage: (id: string) => setBooking((b) => ({ ...b, selectedPackageId: id })),
    onToggleWishlist: () => setBooking((b) => ({ ...b, wishlisted: !b.wishlisted })),
    onProceed: handleProceed,
  };

  return (
    <div className="min-h-screen bg-brand-warm-bg font-sans pb-mobile-nav lg:pb-0">
      <TripHeader trip={trip} category={category} />

      <TripTabNav activeTabId={activeTabId} onTabClick={handleTabClick} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10 flex flex-col lg:flex-row gap-8 items-start">
        {/* Tab panels — all rendered, tabs scroll to them */}
        <div className="w-full lg:flex-1 min-w-0 space-y-6">
          <section id="overview" className={PANEL}>
            <TripEmptySection label="trip overview" />
          </section>

          <section id="itinerary" className={PANEL}>
            <TripEmptySection label="day-by-day itinerary" />
          </section>

          <section id="costing" className={PANEL}>
            <TripEmptySection label="cost breakdown" />
          </section>

          <section id="other-info" className={PANEL}>
            <TripEmptySection label="policy and packing information" />
          </section>

          <section id="gallery" className={PANEL}>
            <TripEmptySection label="photo gallery" />
          </section>

          <section id="reviews" className={PANEL}>
            <TripEmptySection label="traveller reviews" />
          </section>
        </div>

        <TripBookingWidget {...bookingProps} />
      </div>

      <TripMobileBookingSheet {...bookingProps} />
    </div>
  );
}
