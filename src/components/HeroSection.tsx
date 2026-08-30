"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { CalendarDays, Smile } from "lucide-react";

/**
 * Each slide pairs a background photo with its own headline and tagline.
 * Slides 1 and 4 intentionally share the same copy.
 */
const HERO_SLIDES = [
  {
    src: "/assets/hero/hero_slide_1.jpeg",
    headline: "One Life.",
    accent: "Countless Stories.",
    tagline:
      "Don’t just collect destinations. Collect moments, friendships, adventures, and memories that stay forever.",
  },
  {
    src: "/assets/hero/hero_slide_2.jpeg",
    headline: "Some Journeys Take You Places.",
    accent: "Some Take You Within.",
    tagline:
      "Travel beyond destinations. Discover stories, moments, and a little more of yourself along the way.",
  },
  {
    src: "/assets/hero/hero_slide_3.jpeg",
    headline: "Maybe You Don’t Need A New Place.",
    accent: "Maybe You Need A New Feeling.",
    tagline:
      "Step away from the ordinary and find moments that reconnect you with life, nature, and yourself.",
  },
  {
    src: "/assets/hero/hero_slide_4.jpeg",
    headline: "One Life.",
    accent: "Countless Stories.",
    tagline:
      "Don’t just collect destinations. Collect moments, friendships, adventures, and memories that stay forever.",
  },
] as const;

/**
 * Trust placards shown beside the Google rating badge. Values are placeholders
 * until verified figures are supplied.
 */
const HERO_STATS = [
  { label: "Experience", value: "8+ Yrs", Icon: CalendarDays },
  { label: "Satisfied Customers", value: "98%", Icon: Smile },
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
    HERO_SLIDES.forEach(({ src }) => {
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
            src={HERO_SLIDES[index].src}
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

  const { headline, accent, tagline } = HERO_SLIDES[activeIndex];

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
            Where Journeys Touch Your Soul
          </span>
          <motion.h1
            key={`headline-${activeIndex}`}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="text-[1.75rem] sm:text-5xl md:text-7xl font-bold font-serif leading-tight tracking-tight text-balance break-words"
          >
            {headline}
            <br />
            <span className="text-brand-dusk-orange font-normal italic">{accent}</span>
          </motion.h1>
        </motion.div>

        <motion.p
          key={`tagline-${activeIndex}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-sm sm:text-lg text-gray-200 max-w-2xl mx-auto leading-relaxed"
        >
          {tagline}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="w-full mx-auto space-y-3"
        >
          
          {/* Placards 2-5 — Destination · Experience · Satisfied Customers · Travellers */}
          <div className="grid grid-cols-2 gap-2 sm:gap-3 max-w-xs sm:max-w-lg mx-auto mt-6 sm:mt-0">
  {HERO_STATS.map(({ label, value, Icon }) => (
    <div
      key={label}
      className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-2.5 sm:p-3 flex items-center gap-2 sm:gap-2.5 text-left shadow-lg min-w-0"
    >
      <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-white/15 flex items-center justify-center shrink-0 shadow-xs">
        <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-brand-dusk-orange shrink-0" />
      </div>
      <div className="min-w-0 flex-1">
        <span className="font-extrabold text-white text-xs sm:text-base block leading-tight break-words">
          {value}
        </span>
        <span className="text-[9px] sm:text-xs text-gray-200 font-semibold block leading-tight break-words">
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
