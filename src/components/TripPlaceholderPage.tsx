"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Calendar, MapPin, ImageIcon, IndianRupee, Route } from "lucide-react";
import type { TripNavItem } from "@/data/trips";

interface TripPlaceholderPageProps {
  trip: TripNavItem;
  category: "Weekend Trip" | "Backpacking Trip";
}

export default function TripPlaceholderPage({ trip, category }: TripPlaceholderPageProps) {
  return (
    <div className="min-h-screen bg-brand-warm-bg font-sans">
      {/* Hero */}
      <div className="relative h-[40vh] sm:h-[45vh] w-full bg-[#0B2545] overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={trip.heroImage}
          alt={trip.name}
          className="absolute inset-0 w-full h-full object-cover opacity-40 pointer-events-none"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-warm-bg via-[#0B2545]/50 to-black/40" />

        <div className="relative z-10 h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-8 sm:pb-10 space-y-3">
          <Link
            href="/treks"
            className="inline-flex items-center gap-2 text-xs font-bold text-brand-dusk-orange hover:text-white transition w-fit"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Explore More Trips</span>
          </Link>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-brand-dusk-orange bg-white/10 backdrop-blur-md px-3 py-1 rounded-full border border-white/15 inline-block w-fit">
            {category}
          </span>
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold font-serif text-white leading-tight">
            {trip.name}
          </h1>
          <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm font-semibold text-gray-200">
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-brand-dusk-orange" />
              {trip.duration}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-brand-dusk-orange" />
              India
            </span>
          </div>
          <p className="text-xs sm:text-sm text-gray-300 max-w-2xl leading-relaxed">{trip.tagline}</p>
        </div>
      </div>

      {/* Details coming soon */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-8">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-extrabold font-serif text-brand-dark-text">
            Trip Details Coming Soon
          </h2>
          <p className="text-xs sm:text-sm text-gray-500">
            We&apos;re crafting the full itinerary, pricing, and gallery for {trip.name}. Check back shortly or contact us to reserve your spot early.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          {[
            { icon: Route, title: "Itinerary", desc: "Day-by-day route map and highlights will be published here." },
            { icon: IndianRupee, title: "Pricing", desc: "Transparent package costs and inclusions coming soon." },
            { icon: ImageIcon, title: "Gallery", desc: "Photos and trekker stories from past batches will appear here." },
          ].map((item) => (
            <div
              key={item.title}
              className="bg-white border border-gray-150 rounded-3xl p-6 shadow-xs space-y-3 text-center"
            >
              <div className="w-11 h-11 rounded-2xl bg-brand-forest/10 text-brand-dusk-orange flex items-center justify-center mx-auto">
                <item.icon className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-extrabold text-brand-dark-text">{item.title}</h3>
              <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
              <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-brand-dusk-orange bg-brand-forest/5 px-3 py-1 rounded-full">
                Coming Soon
              </span>
            </div>
          ))}
        </div>

        <div className="bg-[#0B2545] text-white rounded-3xl p-6 sm:p-8 text-center space-y-4 shadow-lg">
          <p className="text-sm sm:text-base font-medium text-gray-200">
            Interested in <span className="text-brand-dusk-orange font-bold">{trip.name}</span> ({trip.duration})?
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <a
              href="https://wa.me/918178613438"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-full bg-brand-dusk hover:bg-brand-dusk-orange text-white font-bold text-xs transition shadow-md"
            >
              Enquire on WhatsApp
            </a>
            <Link
              href="/contact-us"
              className="px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs transition"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
