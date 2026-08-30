"use client";

import React, { useState } from "react";
import {
  Activity, Download, Heart, MoreHorizontal, Share2, X,
} from "lucide-react";
import { SUPPORT_PHONE } from "@/data/trekDefaults";

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.87 9.87 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 18.15h-.01a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-3.11.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24 2.2 0 4.27.86 5.83 2.42a8.19 8.19 0 0 1 2.41 5.83c0 4.54-3.7 8.23-8.25 8.23Zm4.52-6.17c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.24-.64.8-.78.97-.15.16-.29.18-.53.06-.25-.13-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.71-.14-.25-.01-.38.11-.5.11-.11.25-.29.37-.44.13-.15.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.42l-.47-.01c-.16 0-.43.06-.65.31-.23.24-.86.84-.86 2.05s.88 2.38 1 2.54c.13.17 1.74 2.65 4.21 3.72.59.25 1.05.4 1.41.52.59.19 1.13.16 1.56.1.47-.07 1.47-.6 1.68-1.18.2-.58.2-1.07.14-1.18-.06-.11-.22-.17-.47-.29Z" />
    </svg>
  );
}

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
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-full bg-green-50 border border-green-200 text-green-600 shadow-lg min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label="Chat with TripMySoul on WhatsApp"
            >
              <WhatsAppIcon className="w-5 h-5" />
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
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="p-3 rounded-full bg-green-50 border border-green-200 text-green-600 shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center justify-center"
          aria-label="Chat with TripMySoul on WhatsApp"
          title="Chat with us on WhatsApp"
        >
          <WhatsAppIcon className="w-5 h-5" />
        </a>
      </div>
    </div>
  );
}
