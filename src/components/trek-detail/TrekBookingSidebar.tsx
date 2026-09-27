"use client";

import React, { useState } from "react";
import { Calendar, Check, Plus, Sparkles, CheckCircle2 } from "lucide-react";
import type { ResolvedTrekDetail } from "@/lib/trekDetail";
import { ApiError, submitQuoteLead } from "@/lib/client/checkoutApi";
import ModalShell from "./ModalShell";
import TrekAddOnsModal from "./TrekAddOnsModal";
import TrekHighlightsModal, { buildHighlightLines } from "./TrekHighlightsModal";

interface TrekBookingSidebarProps {
  detail: ResolvedTrekDetail;
  noun: string;
  /** Price of the chosen package, else the listing's own rate. `null` = on request. */
  price: number | null;
  selectedBatch: string | null;
  selectedPackageLabel: string | null;
  onBookNow: () => void;
  /** Extra classes for the card shell, so the same card can sit in either column. */
  className?: string;
}

/** Bullets shown in the card itself; the rest live behind "View Highlights". */
const PREVIEW_COUNT = 4;

export default function TrekBookingSidebar({
  detail,
  noun,
  price,
  selectedBatch,
  selectedPackageLabel,
  onBookNow,
  className = "",
}: TrekBookingSidebarProps) {
  const { originalPrice, tripCode } = detail;

  const [openPanel, setOpenPanel] = useState<"highlights" | "addons" | "quote" | null>(null);
  const [quoteName, setQuoteName] = useState("");
  const [quotePhone, setQuotePhone] = useState("");
  const [quoteEmail, setQuoteEmail] = useState("");
  const [quoteStatus, setQuoteStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [quoteError, setQuoteError] = useState<string | null>(null);

  const handleSubmitQuoteLead = async () => {
    if (!quoteName.trim() || !quotePhone.trim()) {
      setQuoteError("Please enter your name and mobile number.");
      return;
    }
    setQuoteError(null);
    setQuoteStatus("submitting");
    try {
      await submitQuoteLead({
        name: quoteName.trim(),
        phone: quotePhone.trim(),
        email: quoteEmail.trim() || undefined,
        tripLabel: detail.trek.name,
        source: "tbd_quote",
      });
      setQuoteStatus("success");
    } catch (err) {
      setQuoteStatus("error");
      setQuoteError(err instanceof ApiError ? err.message : "Could not submit your request. Please try again.");
    }
  };

  const highlightLines = buildHighlightLines(detail, noun);
  const previewLines = highlightLines.slice(0, PREVIEW_COUNT);
  const hiddenCount = highlightLines.length - previewLines.length;

  return (
    <div
      className={`glass-card rounded-3xl p-6 md:p-8 border border-white/30 shadow-xl lg:sticky lg:top-28 space-y-6 bg-white/60 ${className}`}
    >
      <div className="pb-4 border-b border-gray-100 space-y-1">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider block">
            Registration Fee
          </span>
          {tripCode && (
            <span className="text-[10px] text-gray-400 font-bold">
              {noun} Code: {tripCode}
            </span>
          )}
        </div>
        {price === null ? (
          <span className="text-2xl font-extrabold font-serif text-brand-forest block">On request</span>
        ) : (
          <div className="flex items-baseline gap-1.5 flex-wrap">
            <span className="text-3xl font-extrabold font-serif text-brand-forest">
              ₹{price.toLocaleString()}
            </span>
            <span className="text-xs text-gray-500 font-semibold">+5% GST</span>
            <span className="text-xs text-gray-500">/ person</span>
            {originalPrice !== undefined && originalPrice > price && (
              <span className="text-xs text-gray-400 line-through">₹{originalPrice.toLocaleString()}</span>
            )}
          </div>
        )}
        {selectedPackageLabel && (
          <span className="text-[11px] font-bold text-brand-dark-text block">{selectedPackageLabel}</span>
        )}
      </div>

      {/* Highlights & add-ons */}
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-2.5">
          <button
            onClick={() => setOpenPanel("highlights")}
            className="flex items-center justify-center gap-1.5 py-3 px-2 min-h-[44px] rounded-xl bg-brand-dusk hover:bg-brand-dusk-orange text-white font-bold text-xs transition shadow-md"
          >
            <Sparkles className="w-3.5 h-3.5 shrink-0" />
            <span>View Highlights</span>
          </button>
          <button
            onClick={() => setOpenPanel("addons")}
            className="flex items-center justify-center gap-1.5 py-3 px-2 rounded-xl border border-gray-200 bg-white text-brand-dark-text font-bold text-xs transition hover:border-brand-dusk-orange hover:text-brand-dusk-orange"
          >
            <Plus className="w-3.5 h-3.5 shrink-0" />
            <span>View Add-ons</span>
          </button>
        </div>

        <ul className="space-y-2.5">
          {previewLines.map((line) => (
            <li key={line} className="flex items-start gap-2 text-xs text-gray-650 leading-relaxed">
              <Check className="w-3.5 h-3.5 text-brand-forest shrink-0 mt-0.5" />
              <span className="font-semibold">{line}</span>
            </li>
          ))}
        </ul>

        {hiddenCount > 0 && (
          <button
            onClick={() => setOpenPanel("highlights")}
            className="text-xs font-bold text-brand-dusk-orange hover:underline inline-flex items-center min-h-[44px]"
          >
            +{hiddenCount} more {hiddenCount === 1 ? "highlight" : "highlights"}
          </button>
        )}
      </div>

      {/* Chosen batch, once the traveller has picked one */}
      {selectedBatch && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-brand-warm-bg border border-gray-150 text-xs">
          <Calendar className="w-3.5 h-3.5 text-brand-dusk-orange shrink-0" />
          <span className="text-gray-400 font-semibold">Selected Batch:</span>
          <span className="font-bold text-brand-dark-text">{selectedBatch}</span>
        </div>
      )}

      {/* CTA action */}
      <button
        onClick={price === null ? () => setOpenPanel("quote") : onBookNow}
        className="w-full bg-brand-forest hover:bg-brand-forest-light text-white py-4 rounded-full font-bold shadow-lg transition flex items-center justify-center gap-2 hover:-translate-y-0.5 transform duration-200"
      >
        <span>{price === null ? "Get Custom Quote" : selectedBatch ? `Book ${noun} Slot` : "Choose Departure Dates"}</span>
      </button>

      {openPanel === "highlights" && (
        <ModalShell onClose={() => setOpenPanel(null)} className="max-w-md text-left">
          <TrekHighlightsModal detail={detail} noun={noun} onClose={() => setOpenPanel(null)} />
        </ModalShell>
      )}

      {openPanel === "addons" && (
        <ModalShell onClose={() => setOpenPanel(null)} className="max-w-lg text-left">
          <TrekAddOnsModal noun={noun} onClose={() => setOpenPanel(null)} onBookNow={onBookNow} />
        </ModalShell>
      )}

      {openPanel === "quote" && (
        <ModalShell
          onClose={() => {
            setOpenPanel(null);
            setQuoteStatus("idle");
          }}
          className="max-w-sm text-left"
        >
          {quoteStatus === "success" ? (
            <div className="p-6 text-center space-y-3">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
              <h3 className="font-bold text-brand-dark-text">Request received!</h3>
              <p className="text-xs text-gray-500">Our trip expert will reach out with a custom quote and payment link shortly.</p>
            </div>
          ) : (
            <div className="p-6 space-y-3">
              <h3 className="font-bold text-brand-dark-text">Get a Custom Quote</h3>
              <p className="text-xs text-gray-500">Share your details and we&apos;ll send a personalised price for {detail.trek.name}.</p>
              <input
                placeholder="Your name"
                value={quoteName}
                onChange={(e) => setQuoteName(e.target.value)}
                className="w-full p-3 min-h-[44px] rounded-xl border border-gray-200 text-sm"
              />
              <input
                type="tel"
                placeholder="Mobile number"
                value={quotePhone}
                onChange={(e) => setQuotePhone(e.target.value)}
                className="w-full p-3 min-h-[44px] rounded-xl border border-gray-200 text-sm"
              />
              <input
                type="email"
                placeholder="Email (optional)"
                value={quoteEmail}
                onChange={(e) => setQuoteEmail(e.target.value)}
                className="w-full p-3 min-h-[44px] rounded-xl border border-gray-200 text-sm"
              />
              {quoteError && <p className="text-[11px] font-bold text-red-600">{quoteError}</p>}
              <button
                onClick={handleSubmitQuoteLead}
                disabled={quoteStatus === "submitting"}
                className="w-full py-3 rounded-full bg-brand-forest hover:bg-brand-forest-light text-white font-bold text-sm transition disabled:opacity-50"
              >
                {quoteStatus === "submitting" ? "Submitting..." : "Request Quote"}
              </button>
            </div>
          )}
        </ModalShell>
      )}
    </div>
  );
}
