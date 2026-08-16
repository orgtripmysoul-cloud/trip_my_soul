"use client";

import React from "react";
import { Info, Phone } from "lucide-react";
import { MissingField, SubHeading, TabTitle } from "./TripSectionParts";
import type { TripListingItem } from "@/data/trips";

interface TripCostingTabProps {
  trip: TripListingItem;
}

export default function TripCostingTab({ trip }: TripCostingTabProps) {
  const tiers = trip.packages ?? [];
  const hasPricing = tiers.length > 0 || trip.price !== null;

  return (
    <div className="space-y-7">
      <div>
        <TabTitle>Costing</TabTitle>
        {trip.priceNote && <p className="text-xs text-gray-650 leading-relaxed">{trip.priceNote}</p>}
      </div>

      {/* Pricing table */}
      {tiers.length > 0 ? (
        <div className="overflow-x-auto border border-gray-150 rounded-2xl">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-brand-warm-bg">
                <th className="text-left font-extrabold uppercase tracking-wider text-[10px] text-gray-500 px-4 py-3">
                  Group size
                </th>
                <th className="text-left font-extrabold uppercase tracking-wider text-[10px] text-gray-500 px-4 py-3">
                  Vehicle
                </th>
                <th className="text-left font-extrabold uppercase tracking-wider text-[10px] text-gray-500 px-4 py-3">
                  Room sharing
                </th>
                <th className="text-right font-extrabold uppercase tracking-wider text-[10px] text-gray-500 px-4 py-3">
                  Per person
                </th>
              </tr>
            </thead>
            <tbody>
              {tiers.map((t) => (
                <tr key={t.id} className="border-t border-gray-150">
                  <td className="px-4 py-3 font-extrabold text-brand-dark-text">{t.paxLabel ?? t.label}</td>
                  <td className="px-4 py-3 text-gray-650 font-medium">{t.vehicle ?? "—"}</td>
                  <td className="px-4 py-3 text-gray-650 font-medium">{t.sharing ?? "—"}</td>
                  <td className="px-4 py-3 text-right font-extrabold text-brand-forest tabular-nums">
                    ₹{t.price.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : !hasPricing ? (
        <div className="space-y-4">
          <div className="bg-brand-warm-bg border border-gray-150 rounded-2xl p-6 text-center space-y-2">
            <span className="block text-xl font-extrabold font-serif text-brand-forest">
              Price on request
            </span>
            <p className="text-xs text-gray-500 max-w-sm mx-auto leading-relaxed">
              No rates are published in the source itinerary for this trip. Get in touch and we&apos;ll
              quote for your group size and dates.
            </p>
            {trip.contactPhone && (
              <a
                href={`tel:${trip.contactPhone.replace(/[^\d+]/g, "")}`}
                className="inline-flex items-center gap-2 mt-1 bg-brand-forest hover:bg-brand-forest-light text-white px-5 py-2.5 rounded-full font-bold text-xs transition"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Enquire for Pricing</span>
              </a>
            )}
          </div>
        </div>
      ) : (
        <MissingField>No group pricing table is given in the source itinerary.</MissingField>
      )}

      {/* Kids pricing */}
      <div>
        <SubHeading>Children</SubHeading>
        {trip.kidsPolicy ? (
          <p className="text-xs text-gray-650 leading-relaxed">{trip.kidsPolicy}</p>
        ) : (
          <MissingField>No child pricing is given in the source itinerary.</MissingField>
        )}
      </div>

      {/* Booking */}
      <div>
        <SubHeading>Booking</SubHeading>
        {trip.bookingAdvance ? (
          <p className="text-xs text-gray-650 leading-relaxed">
            Deposit <strong className="text-brand-dark-text">₹{trip.bookingAdvance.toLocaleString()} per person</strong>{" "}
            as advance to confirm your seat. The remaining payment must be made{" "}
            <strong className="text-brand-dark-text">{trip.balanceDueDays ?? 10} days</strong> before the
            departure date.
          </p>
        ) : (
          <MissingField>No booking terms are given in the source itinerary.</MissingField>
        )}
      </div>

      {/* Payment details */}
      {trip.paymentDetails && (
        <div>
          <SubHeading>Payment details</SubHeading>
          <div className="bg-brand-warm-bg border border-gray-150 rounded-2xl p-5 text-xs space-y-1.5 font-medium text-gray-650">
            <div className="flex justify-between gap-4">
              <span className="text-gray-400">Account holder</span>
              <span className="font-extrabold text-brand-dark-text">{trip.paymentDetails.accountName}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-gray-400">Bank</span>
              <span className="font-extrabold text-brand-dark-text">{trip.paymentDetails.bank}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-gray-400">Account number</span>
              <span className="font-extrabold text-brand-dark-text tabular-nums">
                {trip.paymentDetails.accountNumber}
              </span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-gray-400">IFSC</span>
              <span className="font-extrabold text-brand-dark-text">{trip.paymentDetails.ifsc}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-gray-400">Account type</span>
              <span className="font-extrabold text-brand-dark-text">{trip.paymentDetails.accountType}</span>
            </div>
            <p className="flex items-start gap-2 pt-2 mt-2 border-t border-gray-150 text-[11px] text-gray-500">
              <Info className="w-3.5 h-3.5 text-brand-dusk-orange shrink-0 mt-0.5" />
              <span>{trip.paymentDetails.upiNote}</span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
