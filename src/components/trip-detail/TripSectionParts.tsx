"use client";

import React from "react";
import { Check, Info, X } from "lucide-react";

export function TabTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-xl font-extrabold text-brand-dark-text font-serif mb-1">{children}</h2>
  );
}

export function SubHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-[11px] font-extrabold uppercase tracking-wider text-brand-forest mb-2.5">
      {children}
    </h3>
  );
}

/**
 * Used where the source itinerary genuinely has no value. States the gap
 * explicitly rather than leaving a blank or a "coming soon" placeholder.
 */
export function MissingField({ children }: { children: React.ReactNode }) {
  return (
    <p className="flex items-start gap-2 text-xs text-gray-500 bg-brand-warm-bg border border-gray-150 rounded-xl px-3.5 py-3 font-medium">
      <Info className="w-3.5 h-3.5 text-brand-dusk-orange shrink-0 mt-0.5" />
      <span>{children}</span>
    </p>
  );
}

export function TickList({ items, tone }: { items: string[]; tone: "include" | "exclude" }) {
  const Icon = tone === "include" ? Check : X;
  const color = tone === "include" ? "text-green-600" : "text-red-500";
  return (
    <ul className="space-y-2 text-xs text-gray-650 leading-relaxed">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2.5">
          <Icon className={`w-4 h-4 ${color} shrink-0 mt-0.5`} />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
