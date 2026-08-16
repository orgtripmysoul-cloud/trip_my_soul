"use client";

import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { MissingField, TabTitle } from "./TripSectionParts";
import type { TripListingItem } from "@/data/trips";

interface TripGalleryTabProps {
  trip: TripListingItem;
}

export default function TripGalleryTab({ trip }: TripGalleryTabProps) {
  const images = trip.gallery ?? [];
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenIndex(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    document.body.style.overflow = openIndex !== null ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [openIndex]);

  return (
    <div className="space-y-5">
      <TabTitle>Gallery</TabTitle>

      {images.length === 0 ? (
        <MissingField>
          No trip photographs were supplied with this itinerary. The cover image on the listing is a
          stock photograph, not a picture from a past departure.
        </MissingField>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {images.map((img, idx) => (
            <button
              key={img.url}
              onClick={() => setOpenIndex(idx)}
              className="relative aspect-4/3 rounded-xl overflow-hidden bg-gray-100 group focus:outline-none focus:ring-2 focus:ring-brand-forest"
              aria-label={img.caption ?? `Open photo ${idx + 1}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.url}
                alt={img.caption ?? `${trip.name} photo ${idx + 1}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      )}

      {openIndex !== null && images[openIndex] && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setOpenIndex(null)}
          role="dialog"
          aria-modal="true"
        >
          <button
            onClick={() => setOpenIndex(null)}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={images[openIndex].url}
            alt={images[openIndex].caption ?? trip.name}
            className="max-w-full max-h-[85vh] object-contain rounded-xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
