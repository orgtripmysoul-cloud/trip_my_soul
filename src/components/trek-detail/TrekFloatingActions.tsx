"use client";

import React, { useState } from "react";
import {
  Activity, Download, Heart, MessageSquare, MoreHorizontal, Phone, Share2, X,
} from "lucide-react";
import { SUPPORT_PHONE } from "@/data/trekDefaults";

interface TrekFloatingActionsProps {
  trekName: string;
  wishlistSaved: boolean;
  onToggleWishlist: () => void;
  shareCopied: boolean;
  onShare: () => void;
  onOpenBrochure: () => void;
  onOpenFitness: () => void;
}

export default function TrekFloatingActions({
  trekName,
  wishlistSaved,
  onToggleWishlist,
  shareCopied,
  onShare,
  onOpenBrochure,
  onOpenFitness,
}: TrekFloatingActionsProps) {
  const [mobileFabOpen, setMobileFabOpen] = useState(false);

  const whatsappHref = `https://wa.me/${SUPPORT_PHONE.replace("+", "")}?text=Hi%20TripMySoul,%20I'm%20interested%20in%20booking%20the%20${encodeURIComponent(trekName)}.`;

  return (
    <div className="fixed right-3 sm:right-4 bottom-[5.5rem] lg:bottom-32 z-40 flex flex-col items-end gap-3">
      {/* Mobile: expandable action menu */}
      <div className="lg:hidden flex flex-col items-end gap-2">
        {mobileFabOpen && (
          <div className="flex flex-col gap-2 animate-fade-in">
            <button
              onClick={onToggleWishlist}
              className={`p-3 rounded-full shadow-lg border transition-all min-w-[44px] min-h-[44px] flex items-center justify-center ${
                wishlistSaved ? "bg-pink-550 border-pink-550 text-white" : "bg-pink-50 border-pink-200 text-pink-550"
              }`}
              aria-label="Save to Wishlist"
            >
              <Heart className={`w-5 h-5 ${wishlistSaved ? "fill-current" : ""}`} />
            </button>
            <button
              onClick={onShare}
              className="p-3 rounded-full bg-blue-50 border border-blue-200 text-blue-600 shadow-lg min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label="Share page link"
            >
              <Share2 className="w-5 h-5" />
            </button>
            <button
              onClick={() => { onOpenBrochure(); setMobileFabOpen(false); }}
              className="p-3 rounded-full bg-[#0B2545] border border-white/20 text-white shadow-lg min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label="Download brochure"
            >
              <Download className="w-5 h-5 text-brand-dusk-orange" />
            </button>
            <button
              onClick={() => { onOpenFitness(); setMobileFabOpen(false); }}
              className="p-3 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 shadow-lg min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label="Fitness calculator"
            >
              <Activity className="w-5 h-5" />
            </button>
            <a
              href={`tel:${SUPPORT_PHONE}`}
              className="p-3 rounded-full bg-sky-50 border border-sky-200 text-sky-600 shadow-lg min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label="Call support"
            >
              <Phone className="w-5 h-5" />
            </a>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-full bg-green-50 border border-green-200 text-green-600 shadow-lg min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label="WhatsApp Contact"
            >
              <MessageSquare className="w-5 h-5 fill-current" />
            </a>
          </div>
        )}
        <button
          onClick={() => setMobileFabOpen(!mobileFabOpen)}
          className="p-3.5 rounded-full bg-[#0B2545] border border-white/20 text-white shadow-xl min-w-[48px] min-h-[48px] flex items-center justify-center"
          aria-label="Quick actions"
        >
          {mobileFabOpen ? <X className="w-5 h-5" /> : <MoreHorizontal className="w-5 h-5" />}
        </button>
      </div>

      {/* Desktop: full FAB stack */}
      <div className="hidden lg:flex flex-col gap-3">
        <button
          onClick={onToggleWishlist}
          className={`p-3 rounded-full shadow-lg border transition-all hover:scale-105 active:scale-95 ${
            wishlistSaved
              ? "bg-pink-550 border-pink-550 text-white"
              : "bg-pink-50 border-pink-200 text-pink-550"
          }`}
          aria-label="Save to Wishlist"
        >
          <Heart className={`w-5 h-5 ${wishlistSaved ? "fill-current" : ""}`} />
        </button>

        <div className="relative">
          <button
            onClick={onShare}
            className="p-3 rounded-full bg-blue-50 border border-blue-200 text-blue-600 shadow-lg hover:scale-105 active:scale-95 transition-all"
            aria-label="Share page link"
          >
            <Share2 className="w-5 h-5" />
          </button>
          {shareCopied && (
            <span className="absolute right-14 top-1/2 -translate-y-1/2 bg-brand-forest text-white text-[10px] font-bold px-2 py-1 rounded shadow-md whitespace-nowrap">
              Link Copied!
            </span>
          )}
        </div>

        <button
          onClick={onOpenBrochure}
          className="p-3 rounded-full bg-[#0B2545] border border-white/20 text-white shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center justify-center"
          title="Download PDF Itinerary Brochure"
        >
          <Download className="w-5 h-5 text-brand-dusk-orange" />
        </button>

        <button
          onClick={onOpenFitness}
          className="p-3 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center justify-center"
          title="Calculate High-Altitude Fitness Readiness"
        >
          <Activity className="w-5 h-5" />
        </button>

        <a
          href={`tel:${SUPPORT_PHONE}`}
          className="p-3 rounded-full bg-sky-50 border border-sky-200 text-sky-600 shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center justify-center"
          aria-label="Call TripMySoul support"
        >
          <Phone className="w-5 h-5" />
        </a>

        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="p-3 rounded-full bg-green-50 border border-green-200 text-green-600 shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center justify-center"
          aria-label="WhatsApp Contact"
        >
          <MessageSquare className="w-5 h-5 fill-current" />
        </a>
      </div>
    </div>
  );
}
