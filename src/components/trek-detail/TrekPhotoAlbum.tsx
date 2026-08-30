"use client";

import React, { useEffect, useState } from "react";
import { Camera, ChevronLeft, ChevronRight, X } from "lucide-react";
import { DEFAULT_GALLERY } from "@/data/trekDefaults";
import type { ResolvedTrekDetail } from "@/lib/trekDetail";
import type { GalleryImage } from "@/data/db";

interface TrekPhotoAlbumProps {
  detail: ResolvedTrekDetail;
  noun: string;
}

/** How many tiles show before the rest hide behind "View all". */
const PREVIEW_COUNT = 5;

/** Index `delta` photos along from `current`, wrapping at either end. */
const wrap = (current: number, delta: number, total: number) => (current + delta + total) % total;

/**
 * Photo album for the detail page.
 *
 * Uses the listing's own `gallery` where it has one; otherwise the hero shot
 * leads the generic trail album from `trekDefaults`. Tapping a tile opens a
 * lightbox with arrow-key and button navigation.
 */
export default function TrekPhotoAlbum({ detail, noun }: TrekPhotoAlbumProps) {
  const published = detail.gallery.filter((photo) => photo.url);
  const photos: GalleryImage[] =
    published.length > 0
      ? published
      : [{ url: detail.heroImage, caption: detail.trek.name }, ...DEFAULT_GALLERY];

  const [expanded, setExpanded] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const visible = expanded ? photos : photos.slice(0, PREVIEW_COUNT);
  const hiddenCount = photos.length - visible.length;

  const total = photos.length;

  /** Move the lightbox `delta` photos along. */
  const step = (delta: number) =>
    setLightboxIndex((current) => (current === null ? current : wrap(current, delta, total)));

  // Arrow keys and Escape drive the lightbox; the page behind it stays put.
  useEffect(() => {
    if (lightboxIndex === null) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setLightboxIndex(null);
      if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
        setLightboxIndex((current) =>
          current === null ? current : wrap(current, event.key === "ArrowRight" ? 1 : -1, total)
        );
      }
    };

    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [lightboxIndex, total]);

  const active = lightboxIndex === null ? null : photos[lightboxIndex];

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-1">
          <h2 className="text-lg font-extrabold text-brand-dark-text font-serif">
            {noun} Photo Album
          </h2>
          <p className="text-xs text-gray-500 font-medium">
            Trail, campsite and summit shots from past batches.
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-widest text-brand-dusk-orange bg-brand-dusk-orange/10 px-3 py-1.5 rounded-full">
          <Camera className="w-3.5 h-3.5" />
          {photos.length} Photos
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 auto-rows-[120px] md:auto-rows-[150px]">
        {visible.map((photo, index) => (
          <button
            key={`${photo.url}-${index}`}
            type="button"
            onClick={() => setLightboxIndex(index)}
            className={`group relative overflow-hidden rounded-2xl bg-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-dusk-orange focus:ring-offset-2 ${
              index === 0 ? "col-span-2 row-span-2" : ""
            }`}
            aria-label={photo.caption ? `Open photo: ${photo.caption}` : `Open photo ${index + 1}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photo.url}
              alt={photo.caption || `${detail.trek.name} photo ${index + 1}`}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity" />
            {photo.caption && (
              <span className="absolute bottom-0 left-0 right-0 p-3 text-left text-[11px] font-semibold text-white opacity-0 group-hover:opacity-100 transition-opacity">
                {photo.caption}
              </span>
            )}
          </button>
        ))}

        {hiddenCount > 0 && (
          <button
            type="button"
            onClick={() => setExpanded(true)}
            className="relative overflow-hidden rounded-2xl bg-brand-forest/90 text-white flex flex-col items-center justify-center gap-1 hover:bg-brand-forest transition-colors focus:outline-none focus:ring-2 focus:ring-brand-dusk-orange focus:ring-offset-2"
          >
            <span className="text-xl font-extrabold font-serif">+{hiddenCount}</span>
            <span className="text-[10px] font-bold uppercase tracking-widest">View All</span>
          </button>
        )}
      </div>

      {expanded && photos.length > PREVIEW_COUNT && (
        <button
          type="button"
          onClick={() => setExpanded(false)}
          className="text-xs font-bold text-brand-dusk-orange hover:underline inline-flex items-center min-h-[44px]"
        >
          Show fewer photos
        </button>
      )}

      {active && (
        <div
          className="fixed inset-0 z-[80] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label={`${detail.trek.name} photo album`}
          onClick={() => setLightboxIndex(null)}
        >
          <button
            type="button"
            onClick={() => setLightboxIndex(null)}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
            aria-label="Close photo album"
          >
            <X className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              step(-1);
            }}
            className="absolute left-2 md:left-6 p-2.5 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
            aria-label="Previous photo"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <figure
            className="max-w-5xl w-full space-y-3"
            onClick={(event) => event.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={active.url}
              alt={active.caption || detail.trek.name}
              className="w-full max-h-[75vh] object-contain rounded-2xl"
            />
            <figcaption className="flex items-center justify-between gap-4 text-white">
              <span className="text-xs font-semibold">{active.caption || detail.trek.name}</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 shrink-0">
                {(lightboxIndex ?? 0) + 1} / {photos.length}
              </span>
            </figcaption>
          </figure>

          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              step(1);
            }}
            className="absolute right-2 md:right-6 p-2.5 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
            aria-label="Next photo"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      )}
    </>
  );
}
