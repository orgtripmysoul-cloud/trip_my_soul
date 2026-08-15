"use client";

import React, { useEffect, useRef } from "react";

export const TRIP_TABS = [
  { id: "overview", label: "Overview" },
  { id: "itinerary", label: "Itinerary" },
  { id: "costing", label: "Costing" },
  { id: "other-info", label: "Other Info" },
  { id: "gallery", label: "Gallery" },
  { id: "reviews", label: "Reviews" },
];

interface TripTabNavProps {
  activeTabId: string;
  onTabClick: (tabId: string) => void;
}

export default function TripTabNav({ activeTabId, onTabClick }: TripTabNavProps) {
  const stripRef = useRef<HTMLDivElement>(null);

  // Keep the active tab visible when the strip overflows on mobile.
  useEffect(() => {
    const active = stripRef.current?.querySelector<HTMLElement>(`[data-tab="${activeTabId}"]`);
    active?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }, [activeTabId]);

  return (
    <div className="sticky top-[72px] md:top-[80px] z-30 w-full bg-white border-b border-gray-150 shadow-sm">
      <div
        ref={stripRef}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-x-auto scroll-touch no-scrollbar whitespace-nowrap flex gap-1"
      >
        {TRIP_TABS.map((tab) => {
          const isActive = activeTabId === tab.id;
          return (
            <button
              key={tab.id}
              data-tab={tab.id}
              onClick={() => onTabClick(tab.id)}
              className={`relative text-xs sm:text-sm px-4 sm:px-5 py-4 font-bold transition-colors shrink-0 min-h-[48px] ${
                isActive ? "text-brand-forest" : "text-gray-500 hover:text-brand-dark-text"
              }`}
            >
              {tab.label}
              {isActive && (
                <span className="absolute bottom-0 left-3 right-3 h-[3px] rounded-t-full bg-brand-dusk-orange" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
