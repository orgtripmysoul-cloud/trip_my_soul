"use client";

import React from "react";
import Link from "next/link";
import { AlertTriangle, ArrowRight, CalendarDays, Lightbulb } from "lucide-react";
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

      {/* Flag where the source itinerary is incomplete or contradicts itself */}
      {trip.sourceCaveat && (
        <p className="flex items-start gap-2.5 text-xs leading-relaxed bg-amber-50 border border-amber-200 text-amber-900 rounded-xl px-4 py-3">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
          <span>
            <strong className="block mb-0.5">Awaiting confirmation from the operator</strong>
            {trip.sourceCaveat}
          </span>
        </p>
      )}

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

      {/* Departure information */}
      {trip.availability && (
        <div>
          <SubHeading>Departure information</SubHeading>
          <p className="flex items-start gap-2 text-xs text-gray-650 leading-relaxed">
            <CalendarDays className="w-3.5 h-3.5 text-brand-dusk-orange shrink-0 mt-0.5" />
            <span>{trip.availability}</span>
          </p>
        </div>
      )}

      {/*
        Things to carry. A trip's own list comes off its itinerary PDF and wins;
        the shared tropical list is only a fallback for the South India trips
        that have none, and must never be shown against a Himalayan trek.
      */}
      <div>
        <SubHeading>Things to carry</SubHeading>
        {trip.thingsToCarry && trip.thingsToCarry.length > 0 ? (
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 pl-4 list-disc text-xs text-gray-650 font-medium leading-relaxed">
            {trip.thingsToCarry.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        ) : (
          <>
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
          </>
        )}
      </div>

      {/* Good to know — per-trip ground rules */}
      {trip.thingsToRemember && trip.thingsToRemember.length > 0 && (
        <div>
          <SubHeading>Good to know before you book</SubHeading>
          <ul className="space-y-1 pl-4 list-disc text-xs text-gray-650 font-medium leading-relaxed">
            {trip.thingsToRemember.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Transport by group size */}
      {trip.transportModes && trip.transportModes.length > 0 && (
        <div>
          <SubHeading>Mode of transportation</SubHeading>
          <div className="overflow-x-auto border border-gray-150 rounded-2xl">
            <table className="w-full text-xs border-collapse">
              <tbody>
                {trip.transportModes.map((m, i) => (
                  <tr key={m.group} className={i > 0 ? "border-t border-gray-150" : ""}>
                    <td className="px-4 py-2.5 font-extrabold text-brand-dark-text whitespace-nowrap">{m.group}</td>
                    <td className="px-4 py-2.5 text-gray-650 font-medium">{m.vehicle}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Rental gear */}
      {trip.rentalGear && trip.rentalGear.length > 0 && (
        <div>
          <SubHeading>Gear available to rent</SubHeading>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-1.5 text-xs">
            {trip.rentalGear.map((g) => (
              <div key={g.item} className="flex justify-between gap-3 border-b border-gray-100 py-1.5">
                <span className="text-gray-650 font-medium">{g.item}</span>
                <span className="font-extrabold text-brand-forest tabular-nums shrink-0">₹{g.price}</span>
              </div>
            ))}
          </div>
        </div>
      )}

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
