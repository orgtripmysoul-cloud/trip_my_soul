"use client";

import React from "react";
import { Baby, CheckCircle2, Wallet } from "lucide-react";
import type { ResolvedTrekDetail } from "@/lib/trekDetail";

interface TrekBookingTermsProps {
  detail: ResolvedTrekDetail;
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 py-1.5 border-b border-gray-100 last:border-b-0">
      <span className="text-gray-400 font-semibold">{label}</span>
      <span className="font-bold text-brand-dark-text text-right">{value}</span>
    </div>
  );
}

/**
 * How a booking is actually paid for: advance, balance, kids rates and the
 * account the money goes to. Renders only what the listing publishes.
 */
export default function TrekBookingTerms({ detail }: TrekBookingTermsProps) {
  const {
    bookingAdvance, bookingAdvancePct, balanceDueDays, kidsPolicy, confirmationPolicy,
  } = detail;

  const hasTerms =
    bookingAdvance !== undefined ||
    bookingAdvancePct !== undefined ||
    balanceDueDays !== undefined ||
    kidsPolicy ||
    confirmationPolicy;

  if (!hasTerms) return null;

  return (
    <div className="pt-6 border-t border-gray-100 space-y-4 font-sans">
      <div className="border-b border-gray-100 pb-3">
        <span className="text-base font-extrabold text-brand-dark-text font-serif block">
          Booking & Payment Terms
        </span>
        <p className="text-[10px] text-gray-400">What you pay now, and what is due later.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        {(bookingAdvance !== undefined ||
          bookingAdvancePct !== undefined ||
          balanceDueDays !== undefined ||
          kidsPolicy) && (
          <div className="p-4 bg-brand-warm-bg rounded-2xl border border-gray-150 space-y-2.5">
            <span className="font-extrabold text-brand-forest uppercase tracking-wider flex items-center gap-2 text-[11px]">
              <Wallet className="w-4 h-4 text-brand-dusk-orange" />
              <span>Payment schedule</span>
            </span>
            {bookingAdvancePct !== undefined ? (
              <Row label="Booking amount" value={`${bookingAdvancePct}% of the trek cost`} />
            ) : (
              bookingAdvance !== undefined && (
                <Row label="Advance per person" value={`₹${bookingAdvance.toLocaleString()}`} />
              )
            )}
            {balanceDueDays !== undefined && (
              <Row label="Balance due" value={`${balanceDueDays} days before departure`} />
            )}
            {kidsPolicy && (
              <p className="flex items-start gap-2 text-[11px] text-gray-650 leading-relaxed font-medium pt-1">
                <Baby className="w-3.5 h-3.5 shrink-0 mt-0.5 text-brand-dusk-orange" />
                <span>{kidsPolicy}</span>
              </p>
            )}
          </div>
        )}

      </div>

      {confirmationPolicy && (
        <p className="flex items-start gap-2.5 text-[11px] text-gray-650 leading-relaxed font-medium">
          <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-green-600" />
          <span>{confirmationPolicy}</span>
        </p>
      )}
    </div>
  );
}
