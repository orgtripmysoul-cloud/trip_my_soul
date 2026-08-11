"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, ExternalLink, Star } from "lucide-react";

const HERO_SLIDES = [
  "/assets/hero/hero-slide-1.png",
  "/assets/hero/hero-slide-2.png",
  "/assets/hero/hero-slide-3.png",
  "/assets/hero/hero-slide-4.png",
  "/assets/hero/hero-slide-5.png",
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
    <section className="relative min-h-[70vh] sm:min-h-[80vh] md:h-[90vh] w-full flex items-center justify-center overflow-hidden bg-[#0B2545]">
      <HeroSlideshow activeIndex={activeIndex} previousIndex={previousIndex} />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center text-white space-y-4 sm:space-y-6 md:space-y-8 py-8 sm:py-0">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-4"
        >
          <span className="text-xs md:text-sm font-extrabold uppercase tracking-widest text-brand-dusk-orange bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 inline-block">
            Himalayan Wilderness Expeditions
          </span>
          <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold font-serif leading-tight tracking-tight">
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
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="flex flex-col sm:flex-row justify-center items-center gap-4"
        >
          <Link
            href="#explore-treks"
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-brand-dusk hover:bg-brand-dusk-orange text-white font-bold shadow-lg transform hover:-translate-y-0.5 transition duration-200 flex items-center justify-center gap-2"
          >
            <span>View Upcoming Treks and Trips</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
          <a
            href="https://www.instagram.com/tripmysoul.in/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold backdrop-blur-md border border-white/20 transition duration-200 flex items-center justify-center gap-2"
          >
            <ExternalLink className="w-5 h-5 text-brand-dusk-orange" />
            <span>View Social Media</span>
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="pt-4 max-w-md mx-auto"
        >
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-3.5 flex items-center justify-between text-left gap-3 shadow-lg">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-white text-blue-600 font-black text-xs flex items-center justify-center shrink-0 shadow-xs">
                G
              </div>
              <div>
                <div className="flex items-center gap-1 text-amber-400 text-xs">
                  <span className="font-extrabold text-white mr-1 text-xs">4.9</span>
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
                <span className="text-[10px] text-gray-200 font-semibold block">
                  Based on 2,500+ Verified Google Reviews
                </span>
              </div>
            </div>
            <a
              href="#reviews"
              className="text-[10px] font-extrabold text-brand-dusk-orange uppercase tracking-wider hover:underline shrink-0"
            >
              Read Reviews →
            </a>
          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-5 sm:bottom-6 left-0 right-0 z-20 flex justify-center items-center gap-2">
        {HERO_SLIDES.map((_, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => goToSlide(idx)}
            aria-label={`Go to slide ${idx + 1}`}
            aria-current={idx === activeIndex ? "true" : undefined}
            className={`h-2 rounded-full transition-all duration-300 ease-in-out ${
              idx === activeIndex
                ? "w-[18px] bg-brand-dusk"
                : "w-2 bg-white/40 hover:bg-white/60"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
