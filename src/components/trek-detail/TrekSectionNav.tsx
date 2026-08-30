"use client";

import React from "react";
interface TrekSectionNavProps {
  tabs: { id: string; label: string }[];
  activeTabId: string;
  onTabClick: (tabId: string) => void;
}

export default function TrekSectionNav({ tabs, activeTabId, onTabClick }: TrekSectionNavProps) {
  return (
    <div className="sticky top-[72px] md:top-[80px] z-30 w-full bg-brand-forest border-y border-white/10 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3.5 overflow-x-auto scroll-touch scroll-fade-x no-scrollbar whitespace-nowrap flex gap-2">
        {tabs.map((tab) => {
          const isActive = activeTabId === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabClick(tab.id)}
              className={`text-[11px] sm:text-xs px-3.5 sm:px-4 py-2.5 sm:py-2 rounded-full font-bold uppercase tracking-wider transition-all duration-200 shrink-0 min-h-[44px] ${
                isActive
                  ? "bg-white text-brand-dark-text shadow-sm"
                  : "border border-white/10 text-white hover:bg-white/10"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
