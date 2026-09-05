"use client";

import React from "react";
import { ArrowRight, CalendarDays, Hash, MapPin } from "lucide-react";
import type { ResolvedTrekDetail } from "@/lib/trekDetail";

interface TrekHeroGalleryProps {
  detail: ResolvedTrekDetail;
}

/** Seconds each hero frame holds before the next one fades in. */
const SLIDE_INTERVAL_MS = 5000;

export default function TrekHeroGallery({ detail }: TrekHeroGalleryProps) {
  const { trek, heroImage, heroImages, tripCode, availability, endLocation } = detail;
  const start = trek.startLocation || "Dehradun";

  const slides = heroImages?.length ? heroImages : [heroImage];
  const [activeSlide, setActiveSlide] = React.useState(0);

  // Auto-advance only where there is more than one frame to show.
  React.useEffect(() => {
    if (slides.length < 2) return;
    const timer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % slides.length);
    }, SLIDE_INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [slides.length]);

  return (
    <div className="relative h-[58vh] min-h-[380px] md:h-[72vh] md:min-h-[520px] lg:h-[78vh] lg:max-h-[820px] w-full bg-brand-forest overflow-hidden">
      {slides.map((src, index) => (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          key={src}
          src={src}
          alt={trek.name}
          loading={index === 0 ? "eager" : "lazy"}
          className={`absolute inset-0 w-full h-full object-cover pointer-events-none transition-opacity duration-1000 ${
            index === activeSlide ? "opacity-50" : "opacity-0"
          }`}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-t from-brand-warm-bg via-transparent to-black/35" />

      {slides.length > 1 && (
        <div className="absolute top-4 right-4 md:top-6 md:right-6 flex items-center gap-1.5">
          {slides.map((src, index) => (
            <button
              key={src}
              type="button"
              aria-label={`Show photo ${index + 1} of ${slides.length}`}
              aria-current={index === activeSlide}
              onClick={() => setActiveSlide(index)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                index === activeSlide ? "w-6 bg-white" : "w-1.5 bg-white/50 hover:bg-white/80"
              }`}
            />
          ))}
        </div>
      )}

      <div className="absolute bottom-8 md:bottom-12 left-0 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-brand-dusk-orange bg-brand-forest/65 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 inline-block">
              {trek.region}
            </span>
            {tripCode && (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-white bg-brand-forest/65 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10">
                <Hash className="w-3 h-3" />
                {tripCode}
              </span>
            )}
            {availability && (
              <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-white bg-brand-forest/65 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10">
                <CalendarDays className="w-3 h-3 text-brand-dusk-orange" />
                {availability}
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold font-serif text-brand-dark-text md:text-white leading-tight">
            {trek.name}
          </h1>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs font-semibold text-[#040273] md:text-blue-200">
            <span className="flex items-center gap-2.5">
              <MapPin className="w-3.5 h-3.5 text-brand-dusk-orange" />
              <span>Starting Point: {start}</span>
            </span>
            {endLocation && endLocation !== start && (
              <span className="flex items-center gap-2">
                <ArrowRight className="w-3.5 h-3.5 text-brand-dusk-orange" />
                <span>Ends at: {endLocation}</span>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
