"use client";

import React from "react";
import { Heart, ShieldCheck } from "lucide-react";
import type { TripListingItem } from "@/data/trips";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/**
 * Formats an ISO date without timezone drift — building from UTC parts keeps
 * "2026-09-03" on the 3rd regardless of the viewer's offset.
 */
export function formatBatchDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  const weekday = WEEKDAYS[new Date(Date.UTC(y, m - 1, d)).getUTCDay()];
  return { day: d, month: MONTHS[m - 1], weekday };
}

export interface TripBookingState {
  selectedDate: string | null;
  selectedPackageId: string | null;
  wishlisted: boolean;
}

interface TripBookingFormProps {
  trip: TripListingItem;
  state: TripBookingState;
  onSelectDate: (iso: string) => void;
  onSelectPackage: (id: string) => void;
  onToggleWishlist: () => void;
  onProceed: () => void;
  /** Validation message shown above the CTA, e.g. when no date is picked. */
  error?: string | null;
  /** Compact spacing for the mobile sheet. */
  compact?: boolean;
}

/**
 * Resolves the price to display: the chosen package's, else the trip's base.
 * Returns null when the trip has no published rate — rendered as
 * "Price on request" rather than a fabricated figure.
 */
export function activePrice(
  trip: TripListingItem,
  selectedPackageId: string | null
): number | null {
  const pkg = trip.packages?.find((p) => p.id === selectedPackageId);
  return pkg?.price ?? trip.price;
}

export default function TripBookingForm({
  trip,
  state,
  onSelectDate,
  onSelectPackage,
  onToggleWishlist,
  onProceed,
  error,
  compact = false,
}: TripBookingFormProps) {
  const price = activePrice(trip, state.selectedPackageId);
  const selectedPkg = trip.packages?.find((p) => p.id === state.selectedPackageId);

  return (
    <div className={compact ? "space-y-4" : "space-y-5"}>
      {/* Price */}
      <div className="space-y-1">
        <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider block">
          {price === null
            ? "Pricing"
            : selectedPkg?.advanceAmount
            ? "Pay now to reserve"
            : "Price per person"}
        </span>
        <div className="flex items-baseline gap-2 flex-wrap">
          {price !== null && trip.originalPrice && trip.originalPrice > price && (
            <span className="text-base text-gray-400 line-through font-semibold">
              ₹{trip.originalPrice.toLocaleString()}
            </span>
          )}
          {price !== null ? (
            <span className="text-3xl font-extrabold font-serif text-brand-forest">
              ₹{price.toLocaleString()}
            </span>
          ) : (
            <span className="text-xl font-extrabold font-serif text-brand-forest">
              Price on request
            </span>
          )}
        </div>
        {selectedPkg?.advanceAmount && (
          <span className="text-[10px] text-gray-500 font-semibold block">
            Balance payable before departure
          </span>
        )}
      </div>

      {/* Batch dates */}
      {trip.batchDates && trip.batchDates.length > 0 && (
        <div className="space-y-2">
          <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider block">
            Select a date
          </span>
          <div className="flex flex-wrap gap-1.5">
            {trip.batchDates.map((iso) => {
              const { day, month, weekday } = formatBatchDate(iso);
              const isSelected = state.selectedDate === iso;
              return (
                <button
                  key={iso}
                  onClick={() => onSelectDate(iso)}
                  className={`px-2.5 py-1.5 rounded-xl border text-center transition-all min-w-[52px] ${
                    isSelected
                      ? "bg-[#0B2545] text-white border-[#0B2545] shadow-sm"
                      : "bg-white text-brand-dark-text border-gray-200 hover:border-brand-forest/40"
                  }`}
                >
                  <span className={`block text-[9px] font-bold uppercase ${isSelected ? "text-gray-300" : "text-gray-400"}`}>
                    {weekday}
                  </span>
                  <span className="block text-xs font-extrabold leading-tight">
                    {day} {month}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Package variants */}
      {trip.packages && trip.packages.length > 0 && (
        <div className="space-y-2">
          <label
            htmlFor={`pkg-${trip.slug}${compact ? "-m" : ""}`}
            className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider block"
          >
            Select package
          </label>
          <select
            id={`pkg-${trip.slug}${compact ? "-m" : ""}`}
            value={state.selectedPackageId ?? ""}
            onChange={(e) => onSelectPackage(e.target.value)}
            className="w-full p-3 rounded-xl border border-gray-200 bg-white text-xs font-bold text-brand-dark-text focus:outline-none focus:border-brand-forest transition"
          >
            <option value="" disabled>
              Choose a plan…
            </option>
            {trip.packages.map((pkg) => (
              <option key={pkg.id} value={pkg.id}>
                {pkg.label} — ₹{pkg.price.toLocaleString()}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* CTAs */}
      <div className="space-y-2.5">
        {error && (
          <p role="alert" className="text-[11px] font-bold text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
            {error}
          </p>
        )}
        {price === null && trip.contactPhone ? (
          <a
            href={`tel:${trip.contactPhone.replace(/[^\d+]/g, "")}`}
            className="w-full bg-brand-forest hover:bg-brand-forest-light text-white py-3.5 rounded-full font-bold text-sm shadow-lg transition hover:-translate-y-0.5 transform duration-200 min-h-[48px] flex items-center justify-center"
          >
            Enquire for Pricing
          </a>
        ) : (
          <button
            onClick={onProceed}
            className="w-full bg-brand-forest hover:bg-brand-forest-light text-white py-3.5 rounded-full font-bold text-sm shadow-lg transition hover:-translate-y-0.5 transform duration-200 min-h-[48px]"
          >
            Proceed to Booking
          </button>
        )}
        <button
          onClick={onToggleWishlist}
          className={`w-full py-3 rounded-full font-bold text-xs border transition flex items-center justify-center gap-2 min-h-[44px] ${
            state.wishlisted
              ? "bg-pink-550 border-pink-550 text-white"
              : "bg-pink-50 border-pink-200 text-pink-550 hover:bg-pink-100"
          }`}
        >
          <Heart className={`w-4 h-4 ${state.wishlisted ? "fill-current" : ""}`} />
          <span>{state.wishlisted ? "Saved to Wishlist" : "Save to Wishlist"}</span>
        </button>
      </div>

      {!compact && (
        <div className="p-3 bg-brand-warm-bg rounded-xl border border-gray-150 text-[10px] text-gray-550 leading-relaxed space-y-1 font-semibold">
          <div className="flex items-center gap-1.5 font-bold text-brand-forest">
            <ShieldCheck className="w-3.5 h-3.5 text-brand-dusk-orange shrink-0" />
            <span>Small-group guarantee</span>
          </div>
          <p>{trip.maxGroupSize ?? "Small groups"} per vehicle, with a TripMySoul coordinator travelling alongside you.</p>
        </div>
      )}
    </div>
  );
}
