"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
  Compass, ShieldCheck, HelpCircle, Phone, ArrowRight, ShieldAlert, CheckCircle,
  Gem, Hotel, UtensilsCrossed, Users, Sparkles
} from "lucide-react";

export default function PremiumTripsPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-brand-warm-bg font-sans">
      
      {/* Luxury Hero Banner */}
      <div className="relative h-[45vh] w-full bg-[#031B33] overflow-hidden flex items-center justify-center text-center px-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1920&q=80"
          alt="Premium Trips"
          className="absolute inset-0 w-full h-full object-cover opacity-25 pointer-events-none"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-warm-bg via-transparent to-black/50" />

        <div className="max-w-2xl mx-auto space-y-4 z-10">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-500 bg-amber-550/10 px-4 py-1.5 rounded-full border border-amber-500/20 inline-block font-sans">
            Elite Luxury Expeditions
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold font-serif text-white leading-tight">
            TripMySoul Premium Experience
          </h1>
          <p className="text-xs sm:text-sm text-gray-300 leading-relaxed font-medium">
            Climb the mighty Himalayas with curated luxury additions. Individual dome tents, premium lodging, custom private chefs, and high-altitude emergency safety nets.
          </p>
        </div>
      </div>

      {/* Main Highlights Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        
        {/* Inclusions grid */}
        <div className="space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-extrabold text-brand-dark-text font-serif">Bespoke Premium Additions</h2>
            <p className="text-xs text-gray-500 max-w-lg mx-auto">Every Premium package includes specialized facilities designed for maximum comfort and security on the trail.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Hotel, title: "1-on-1 Lodging", desc: "Private guesthouse rooms at basecamp and individual double-sharing alpine dome tents on the trail." },
              { icon: UtensilsCrossed, title: "Premium Catering", desc: "Multi-cuisine fresh menus prepared by corporate chefs (egg/organic choices, soup snacks, and dessert logs)." },
              { icon: Users, title: "Personal Guides", desc: "Small batch size (max 8 trekkers) led by certified senior mountaineering search & rescue experts." },
              { icon: Gem, title: "Porter Carriage", desc: "Personal luggage porterage (1 bag up to 12kg) included automatically. No backpack carry pressure." }
            ].map((item, idx) => (
              <div key={idx} className="bg-white border border-gray-100 rounded-3xl p-6 shadow-xs space-y-4 hover:-translate-y-1 transition duration-300">
                <div className="w-10 h-10 bg-amber-500/10 border border-amber-500/20 text-amber-600 rounded-full flex items-center justify-center">
                  <item.icon className="w-5 h-5" />
                </div>
                <span className="font-extrabold text-sm text-brand-dark-text block">{item.title}</span>
                <p className="text-[10px] text-gray-400 leading-normal">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Banner */}
        <div className="bg-brand-forest text-white rounded-3xl p-8 shadow-xl flex flex-col md:flex-row justify-between items-center gap-6 relative overflow-hidden">
          <div className="absolute right-0 top-0 translate-x-1/3 -translate-y-1/3 opacity-10">
            <Sparkles className="w-48 h-48" />
          </div>

          <div className="space-y-2 text-center md:text-left z-10">
            <h3 className="text-xl font-bold font-serif">Plan a Customized Private Expedition</h3>
            <p className="text-xs text-sky-200">Ideal for corporate boards, couples, or private families. Select your dates, basecamps, and menus.</p>
          </div>

          <a
            href="https://wa.me/918178613438?text=Hi%20TripMySoul,%20I'm%2520interested%252520in%252520customizing%252520a%252520Premium%252520private%252520Trek."
            target="_blank"
            rel="noopener noreferrer"
            className="bg-brand-dusk-orange hover:bg-brand-dusk-orange/95 min-h-[44px] inline-flex items-center justify-center text-white font-extrabold px-6 py-3 rounded-full text-xs shadow-lg transition shrink-0 z-10 flex items-center gap-1.5"
          >
            <span>Consult Planner</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>

      </div>

    </div>
  );
}
