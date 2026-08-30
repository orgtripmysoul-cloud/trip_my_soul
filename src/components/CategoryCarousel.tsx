"use client";

import React from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { Compass, Sparkles, Car, Users, Lightbulb, BookOpen, ChevronLeft, ChevronRight, MapPin, Gem, GraduationCap, Tent } from "lucide-react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";

interface CategoryCard {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  image: string;
}

const CATEGORIES: CategoryCard[] = [
  {
    label: "Explore South",
    icon: MapPin,
    href: "/treks?region=south",
    image: "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=500&q=80",
  },
  {
    label: "Premium Trip",
    icon: Gem,
    href: "/premium-trips",
    image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=500&q=80",
  },
  {
    label: "Learning Program",
    icon: GraduationCap,
    href: "/learning-programs",
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=500&q=80",
  },
  {
    label: "Family with Kids",
    icon: Users,
    href: "/treks?filter=family",
    image: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=500&q=80",
  },
  {
    label: "Summer Camp",
    icon: Tent,
    href: "/summer-camps",
    image: "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?auto=format&fit=crop&w=500&q=80",
  },
  {
    label: "Car/Rentals",
    icon: Car,
    href: "/cabs",
    image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=500&q=80",
  },
  {
    label: "Spiritual Journey",
    icon: Sparkles,
    href: "/yatra",
    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=500&q=80",
  },
  {
    label: "Suggest Me",
    icon: Lightbulb,
    href: "/suggest-a-trek",
    image: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=500&q=80",
  },
];

export default function CategoryCarousel() {
  return (
    <section className="w-full relative overflow-hidden bg-brand-warm-bg border-b border-gray-150">
      <div className="relative w-full group/carousel">
        <Swiper
          modules={[Navigation]}
          spaceBetween={0}
          slidesPerView={1.7}
          loop={true}
          navigation={{
            prevEl: ".category-prev",
            nextEl: ".category-next",
          }}
          breakpoints={{
            400: { slidesPerView: 2.1 },
            480: { slidesPerView: 2.4 },
            640: { slidesPerView: 3.3 },
            768: { slidesPerView: 4.5 },
            1024: { slidesPerView: 5.5 },
          }}
          className="w-full"
        >
          {CATEGORIES.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <SwiperSlide key={idx}>
                <Link href={cat.href} className="block relative aspect-[1.1] sm:aspect-[1.25] w-full overflow-hidden select-none">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={cat.image}
                    alt={cat.label}
                    className="w-full h-full object-cover pointer-events-none hover:scale-105 transition-transform duration-500"
                  />
                  {/* Navy gradient overlay consistent with site theme */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B2545]/90 via-[#0B2545]/30 to-transparent pointer-events-none" />
                  
                  {/* Text + Icon bottom left */}
                  <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 flex items-center gap-1.5 sm:gap-2 text-white">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="min-w-0 text-[11px] sm:text-sm font-extrabold tracking-wide uppercase leading-tight font-sans drop-shadow-sm break-words">
                      {cat.label}
                    </span>
                  </div>
                </Link>
              </SwiperSlide>
            );
          })}
        </Swiper>

        {/* Custom Navigation Arrows - Always visible on desktop, hidden on mobile */}
        <button
          className="category-prev absolute left-4 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-white/40 hover:bg-white/70 backdrop-blur-md text-brand-dark-text shadow-md flex items-center justify-center transition-all opacity-0 pointer-events-none lg:opacity-100 lg:pointer-events-auto hover:scale-105 active:scale-95"
          aria-label="Previous Slide"
        >
          <ChevronLeft className="w-5 h-5 shrink-0" />
        </button>
        <button
          className="category-next absolute right-4 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-white/40 hover:bg-white/70 backdrop-blur-md text-brand-dark-text shadow-md flex items-center justify-center transition-all opacity-0 pointer-events-none lg:opacity-100 lg:pointer-events-auto hover:scale-105 active:scale-95"
          aria-label="Next Slide"
        >
          <ChevronRight className="w-5 h-5 shrink-0" />
        </button>
      </div>
    </section>
  );
}
