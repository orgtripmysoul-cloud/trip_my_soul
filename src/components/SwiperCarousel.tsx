"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

interface SwiperCarouselProps {
  children: React.ReactNode[];
  slidesPerView?: number;
  spaceBetween?: number;
  autoplayDelay?: number;
  showNavigation?: boolean;
  showPagination?: boolean;
  loop?: boolean;
  breakpoints?: {
    [width: number]: {
      slidesPerView: number;
      spaceBetween?: number;
    };
  };
}

export default function SwiperCarousel({
  children,
  slidesPerView = 1,
  spaceBetween = 20,
  autoplayDelay = 0,
  showNavigation = true,
  showPagination = true,
  loop = false,
  breakpoints = {
    640: { slidesPerView: 1, spaceBetween: 15 },
    768: { slidesPerView: 2, spaceBetween: 20 },
    1024: { slidesPerView: 3, spaceBetween: 24 },
  },
}: SwiperCarouselProps) {
  const modules = [];
  if (showNavigation) modules.push(Navigation);
  if (showPagination) modules.push(Pagination);
  if (autoplayDelay > 0) modules.push(Autoplay);

  return (
    // Bottom padding only reserves room for the dots; collapse it when they're off.
    <div className={`relative w-full carousel-container ${showPagination ? "pb-12" : "pb-2"}`}>
      <Swiper
        modules={modules}
        spaceBetween={spaceBetween}
        slidesPerView={slidesPerView}
        navigation={showNavigation}
        pagination={showPagination ? { clickable: true } : false}
        loop={loop}
        autoplay={autoplayDelay > 0 ? { delay: autoplayDelay, disableOnInteraction: false } : false}
        breakpoints={breakpoints}
        className="w-full h-full"
      >
        {children.map((child, idx) => (
          <SwiperSlide key={idx} className="h-auto flex">
            <div className="w-full h-full flex flex-col">{child}</div>
          </SwiperSlide>
        ))}
      </Swiper>
      
      {/* Custom swiper style overrides */}
      <style jsx global>{`
        .swiper-button-prev,
        .swiper-button-next {
          color: var(--brand-forest) !important;
          background: rgba(255, 255, 255, 0.8) !important;
          backdrop-filter: blur(4px) !important;
          width: 44px !important;
          height: 44px !important;
          border-radius: 50% !important;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1) !important;
          border: 1px solid rgba(255, 255, 255, 0.2) !important;
          transition: all 0.2s ease !important;
        }
        .swiper-button-prev::after,
        .swiper-button-next::after {
          font-size: 16px !important;
          font-weight: bold !important;
        }
        .swiper-button-prev:hover,
        .swiper-button-next:hover {
          background: var(--brand-forest) !important;
          color: white !important;
        }
        .swiper-pagination-bullet-active {
          background: var(--brand-dusk) !important;
          width: 18px !important;
          border-radius: 4px !important;
        }
        .swiper-pagination-bullet {
          transition: all 0.25s ease !important;
        }
      `}</style>
    </div>
  );
}
