"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Star, MapPin, CalendarDays, Smile, Users } from "lucide-react";

const HERO_SLIDES = [
  "/assets/hero/hero-slide-1.png",
  "/assets/hero/hero-slide-2.png",
  "/assets/hero/hero-slide-3.png",
  "/assets/hero/hero-slide-4.png",
  "/assets/hero/hero-slide-5.png",
] as const;

/**
 * Trust placards shown beside the Google rating badge. Values are placeholders
 * until verified figures are supplied.
 */
const HERO_STATS = [
  { label: "Destination", value: "80+", Icon: MapPin },
  { label: "Experience", value: "8+ Yrs", Icon: CalendarDays },
  { label: "Satisfied Customers", value: "98%", Icon: Smile },
  { label: "Travellers", value: "1,00,000+", Icon: Users },
] as const;

const SLIDE_INTERVAL_MS = 5000;
const FADE_DURATION_MS = 1250;

function HeroSlideshow({
  activeIndex,
  previousIndex,
}: {
  activeIndex: number;
  previousIndex: number | null;
}) {
  const [fadeActive, setFadeActive] = useState(false);

  useEffect(() => {
    HERO_SLIDES.forEach((src) => {
      const img = new window.Image();
      img.src = src;
    });
  }, []);

  useEffect(() => {
    if (previousIndex === null) {
      setFadeActive(true);
      return;
    }

    setFadeActive(false);
    const frame = requestAnimationFrame(() => {
      requestAnimationFrame(() => setFadeActive(true));
    });
    return () => cancelAnimationFrame(frame);
  }, [activeIndex, previousIndex]);

  const isCrossfading = previousIndex !== null && previousIndex !== activeIndex;
  const layers = isCrossfading
    ? [
        { index: previousIndex, isIncoming: false },
        { index: activeIndex, isIncoming: true },
      ]
    : [{ index: activeIndex, isIncoming: true }];

  return (
    <div className="absolute inset-0 z-0">
      {layers.map(({ index, isIncoming }) => (
        <div
          key={`${index}-${isIncoming ? "in" : "out"}`}
          className="absolute inset-0 transition-opacity ease-in-out"
          style={{
            opacity: isIncoming ? (fadeActive ? 1 : 0) : fadeActive ? 0 : 1,
            zIndex: isIncoming ? 2 : 1,
            transitionDuration: `${FADE_DURATION_MS}ms`,
          }}
          aria-hidden={!isIncoming || !fadeActive}
        >
          <Image
            src={HERO_SLIDES[index]}
            alt={`TripMySoul expedition photo ${index + 1}`}
            fill
            priority={index === 0}
            sizes="100vw"
            className="object-cover pointer-events-none"
          />
        </div>
      ))}
      <div
        className="absolute inset-0 bg-gradient-to-t from-[#0B2545] via-[#0B2545]/40 to-transparent"
        style={{ zIndex: 3 }}
      />
    </div>
  );
}

export default function HeroSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [previousIndex, setPreviousIndex] = useState<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const fadeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const startAutoplay = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setActiveIndex((current) => {
        const next = (current + 1) % HERO_SLIDES.length;
        setPreviousIndex(current);

        if (fadeTimeoutRef.current) clearTimeout(fadeTimeoutRef.current);
        fadeTimeoutRef.current = setTimeout(() => {
          setPreviousIndex(null);
        }, FADE_DURATION_MS);

        return next;
      });
    }, SLIDE_INTERVAL_MS);
  }, []);

  useEffect(() => {
    startAutoplay();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (fadeTimeoutRef.current) clearTimeout(fadeTimeoutRef.current);
    };
  }, [startAutoplay]);

  const goToSlide = (index: number) => {
    if (index === activeIndex) return;
    setPreviousIndex(activeIndex);
    setActiveIndex(index);

    if (fadeTimeoutRef.current) clearTimeout(fadeTimeoutRef.current);
    fadeTimeoutRef.current = setTimeout(() => {
      setPreviousIndex(null);
    }, FADE_DURATION_MS);

    startAutoplay();
  };

  return (
    <section className="relative min-h-[70vh] sm:min-h-[80vh] md:min-h-[90vh] w-full flex items-center justify-center overflow-hidden bg-[#0B2545]">
      <HeroSlideshow activeIndex={activeIndex} previousIndex={previousIndex} />

      <div className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 text-center text-white space-y-4 sm:space-y-6 md:space-y-8 py-12 sm:py-14">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-4"
        >
          <span className="text-[11px] sm:text-xs md:text-sm font-extrabold uppercase tracking-widest text-brand-dusk-orange bg-white/10 backdrop-blur-md px-3.5 sm:px-4 py-2 rounded-full border border-white/10 inline-block max-w-full">
            Himalayan Wilderness Expeditions
          </span>
          <h1 className="text-[1.75rem] sm:text-5xl md:text-7xl font-bold font-serif leading-tight tracking-tight text-balance break-words">
            Where Every Journey <br />
            <span className="text-brand-dusk-orange font-normal italic">Heals the Soul</span>
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-sm sm:text-lg text-gray-200 max-w-2xl mx-auto leading-relaxed"
        >
          Join curated, small-group treks across the towering ranges of Uttarakhand, Himachal, and Kashmir. Fully certified mountaineering guides, clean campsites, and rigorous safety standards.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="w-full mx-auto space-y-3"
        >
          
          {/* Placards 2-5 — Destination · Experience · Satisfied Customers · Travellers */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-md sm:max-w-4xl mx-auto">
            {HERO_STATS.map(({ label, value, Icon }) => (
              <div
                key={label}
                className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-3.5 sm:p-5 flex items-center gap-2.5 sm:gap-4 text-left shadow-lg min-w-0"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/15 flex items-center justify-center shrink-0 shadow-xs">
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-brand-dusk-orange shrink-0" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="font-extrabold text-white text-base sm:text-xl block leading-tight break-words">
                    {value}
                  </span>
                  <span className="text-[11px] sm:text-sm text-gray-200 font-semibold block leading-tight break-words">
                    {label}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-0 sm:bottom-1 left-0 right-0 z-20 flex justify-center items-center">
        {HERO_SLIDES.map((_, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => goToSlide(idx)}
            aria-label={`Go to slide ${idx + 1}`}
            aria-current={idx === activeIndex ? "true" : undefined}
            className="w-11 h-11 flex items-center justify-center group shrink-0"
          >
            <span
              className={`h-2 rounded-full transition-all duration-300 ease-in-out ${
                idx === activeIndex
                  ? "w-[18px] bg-brand-dusk"
                  : "w-2 bg-white/40 group-hover:bg-white/60"
              }`}
            />
          </button>
        ))}
      </div>
    </section>
  );
}
