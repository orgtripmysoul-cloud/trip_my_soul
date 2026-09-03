"use client";

import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, ReceiptText, Wallet } from "lucide-react";
import type { ResolvedTrekDetail } from "@/lib/trekDetail";

interface TrekCostSummaryProps {
  detail: ResolvedTrekDetail;
  noun: string;
  /** Fare of the chosen package, else the listing's own rate. `null` = on request. */
  price: number | null;
  onBookNow: () => void;
}

/**
 * The headline fare and the terms it is sold under.
 *
 * The figure and the advance stay in view; the full term list sits behind one
 * accordion so the section stays short. Nothing is shown that the listing does
 * not publish — a listing with no terms renders the price block alone.
 */
export default function TrekCostSummary({ detail, noun, price, onBookNow }: TrekCostSummaryProps) {
  const { bookingAdvancePct, bookingAdvance, bookingTerms } = detail;
  const [termsOpen, setTermsOpen] = useState(false);

  const advanceLabel =
    bookingAdvancePct !== undefined
      ? `${bookingAdvancePct}%`
      : bookingAdvance !== undefined
      ? `₹${bookingAdvance.toLocaleString()}`
      : null;

  return (
    <div className="space-y-5 font-sans">
      <div className="border-b border-gray-100 pb-4">
        <h2 className="text-lg font-extrabold text-brand-dark-text font-serif">Cost &amp; Terms</h2>
        <p className="text-[10px] text-gray-400 mt-1">
          What the {noun.toLowerCase()} costs, and the terms it is booked under.
        </p>
      </div>

      {/* Headline fare */}
      <div className="bg-[#0B2545] text-white rounded-3xl p-5 md:p-6 border border-white/10 shadow-md flex flex-col md:flex-row md:items-center md:justify-between gap-5">
        <div className="space-y-2 min-w-0">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-brand-dusk-orange block">
            {noun} Cost
          </span>

          {price === null ? (
            <span className="text-3xl font-extrabold font-serif block leading-none">On request</span>
          ) : (
            <div className="flex items-baseline gap-2 flex-wrap">
              <span className="text-3xl md:text-4xl font-extrabold font-serif leading-none break-words">
                ₹{price.toLocaleString()}
              </span>
              <span className="text-xs font-bold text-gray-200">+ 5% GST*</span>
              <span className="text-xs text-gray-300">/ person</span>
            </div>
          )}

          {advanceLabel && (
            <span className="inline-flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wider bg-white/10 border border-white/15 rounded-full px-3 py-1.5">
              <Wallet className="w-3.5 h-3.5 text-brand-dusk-orange" />
              <span>Booking Amount: {advanceLabel}</span>
            </span>
          )}
        </div>

        <button
          onClick={onBookNow}
          className="bg-brand-dusk hover:bg-brand-dusk-orange text-white font-extrabold min-h-[44px] inline-flex items-center justify-center px-7 py-3.5 rounded-full shadow-lg transition-transform hover:-translate-y-0.5 shrink-0"
        >
          Book Your {noun}
        </button>
      </div>

      {/* Terms, one click away */}
      {bookingTerms.length > 0 && (
        <div className="border border-gray-150 rounded-2xl overflow-hidden bg-white">
          <button
            onClick={() => setTermsOpen(!termsOpen)}
            aria-expanded={termsOpen}
            className="w-full flex items-center justify-between gap-3 p-4 bg-brand-warm-bg/20 hover:bg-brand-warm-bg/40 text-left transition"
          >
            <span className="flex items-center gap-2 font-bold text-xs text-brand-dark-text">
              <ReceiptText className="w-4 h-4 text-brand-dusk-orange shrink-0" />
              <span>Cost &amp; booking terms ({bookingTerms.length})</span>
            </span>
            <motion.div
              animate={{ rotate: termsOpen ? 180 : 0 }}
              transition={{ duration: 0.25 }}
              className="p-1 rounded-full bg-brand-forest/5 text-brand-forest shrink-0"
            >
              <ChevronDown className="w-4 h-4" />
            </motion.div>
          </button>

          <AnimatePresence initial={false}>
            {termsOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 p-5 border-t border-gray-150 text-xs">
                  {bookingTerms.map((term) => (
                    <div key={term.title} className="space-y-0.5 min-w-0">
                      <dt className="font-extrabold text-brand-dark-text">{term.title}</dt>
                      <dd className="text-gray-650 leading-relaxed font-medium">{term.description}</dd>
                    </div>
                  ))}
                </dl>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* The asterisk belongs to the GST line beside the fare, so it only shows with one. */}
      {price !== null && (
        <p className="text-[10px] text-gray-400 font-medium">
          * GST applicable as per package/booking terms.
        </p>
      )}
    </div>
  );
}
