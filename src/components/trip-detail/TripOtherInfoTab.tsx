"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Lightbulb } from "lucide-react";
import { MissingField, SubHeading, TabTitle, TickList } from "./TripSectionParts";
import {
  TRIP_POLICY_LINKS,
  TRIP_TERMS_SECTIONS,
  TROPICAL_PACKING_LIST,
  TROPICAL_PACKING_PRO_TIPS,
} from "@/data/tripShared";
import type { TripListingItem } from "@/data/trips";

interface TripOtherInfoTabProps {
  trip: TripListingItem;
}

export default function TripOtherInfoTab({ trip }: TripOtherInfoTabProps) {
  return (
    <div className="space-y-8">
      <TabTitle>Other information</TabTitle>

      {/* Inclusions / exclusions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <SubHeading>Inclusions</SubHeading>
          {trip.costIncludes?.length ? (
            <TickList items={trip.costIncludes} tone="include" />
          ) : (
            <MissingField>Not listed in the source itinerary.</MissingField>
          )}
        </div>
        <div>
          <SubHeading>Exclusions</SubHeading>
          {trip.costExcludes?.length ? (
            <TickList items={trip.costExcludes} tone="exclude" />
          ) : (
            <MissingField>Not listed in the source itinerary.</MissingField>
          )}
        </div>
      </div>

      {/* Things to pack — shared list */}
      <div>
        <SubHeading>Things to pack</SubHeading>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
          {TROPICAL_PACKING_LIST.map((group) => (
            <div key={group.category}>
              <span className="block text-xs font-extrabold text-brand-dark-text mb-1.5">
                {group.category}
              </span>
              <ul className="space-y-1 pl-4 list-disc text-xs text-gray-650 font-medium leading-relaxed">
                {group.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-5 bg-brand-warm-bg border border-gray-150 rounded-2xl p-4">
          <span className="flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-wider text-brand-forest mb-2">
            <Lightbulb className="w-3.5 h-3.5 text-brand-dusk-orange" />
            Pro tips
          </span>
          <ul className="space-y-1 pl-4 list-disc text-xs text-gray-650 font-medium">
            {TROPICAL_PACKING_PRO_TIPS.map((tip) => (
              <li key={tip}>{tip}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Age criteria */}
      <div>
        <SubHeading>Age criteria</SubHeading>
        <p className="text-xs text-gray-650 leading-relaxed">
          {trip.minAge ? `Minimum age ${trip.minAge} years.` : "No minimum age is given in the source itinerary."}{" "}
          {trip.maxAge ? `Maximum age ${trip.maxAge} years.` : "No upper age limit is specified."}
          {trip.kidsPolicy ? ` ${trip.kidsPolicy}` : ""}
        </p>
      </div>

      {/* Cancellation summary */}
      <div>
        <SubHeading>Cancellation &amp; refunds</SubHeading>
        {trip.cancellationPolicy ? (
          <p className="text-xs text-gray-650 leading-relaxed">{trip.cancellationPolicy}</p>
        ) : (
          <MissingField>Not listed in the source itinerary.</MissingField>
        )}
      </div>

      {/* Full terms — shared across every trip */}
      <div>
        <SubHeading>Terms &amp; conditions</SubHeading>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
          {TRIP_TERMS_SECTIONS.map((section) => (
            <div key={section.heading}>
              <span className="block text-xs font-extrabold text-brand-dark-text mb-1.5">
                {section.heading}
              </span>
              <ul className="space-y-1 pl-4 list-disc text-xs text-gray-650 font-medium leading-relaxed">
                {section.points.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-2 mt-5">
          {TRIP_POLICY_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="inline-flex items-center gap-1.5 text-[11px] font-bold text-brand-forest bg-brand-warm-bg border border-gray-150 hover:bg-gray-100 px-3.5 py-2 rounded-full transition"
            >
              <span>{l.label}</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
