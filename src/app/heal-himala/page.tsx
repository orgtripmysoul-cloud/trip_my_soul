"use client";

import React from "react";
import { Compass, ShieldCheck, HelpCircle, Phone, ArrowRight, ShieldAlert, CheckCircle, Trees, Trash, Heart } from "lucide-react";

export default function HealHimalaPage() {
  return (
    <div className="min-h-screen bg-brand-warm-bg font-sans">
      
      {/* Banner */}
      <div className="relative h-[35vh] w-full bg-brand-forest overflow-hidden flex items-center justify-center text-center px-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=1920&q=80"
          alt="Heal Himala"
          className="absolute inset-0 w-full h-full object-cover opacity-20 pointer-events-none"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-warm-bg via-transparent to-black/40" />

        <div className="max-w-2xl mx-auto space-y-3 z-10">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-green-500 bg-green-500/10 px-4 py-1.5 rounded-full border border-green-500/20 inline-block">
            Ecological Responsibility
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold font-serif text-white leading-tight">
            Heal Himala Initiative
          </h1>
          <p className="text-xs text-gray-305 max-w-md mx-auto leading-relaxed font-medium">
            Join TripMySoul's zero-waste trail movements, forest trash cleanups, and local tree plantation drives.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: Trash, title: "Zero Waste Trails", desc: "We carry all non-biodegradable camps waste back down to municipal recycling hubs. No trash left behind." },
            { icon: Trees, title: "1-Trek 1-Tree", desc: "For every traveler registering a trek slot, TripMySoul plants a local pine/oak seedling in Uttarakhand basecamps." },
            { icon: Heart, title: "Community Support", desc: "Hiring local guides, cooks, and mules to distribute travel revenue directly into basecamp villages." }
          ].map((item, idx) => (
            <div key={idx} className="bg-white border border-gray-100 rounded-3xl p-6 shadow-xs space-y-4 text-center">
              <div className="w-10 h-10 bg-green-500/10 border border-green-500/20 text-green-600 rounded-full flex items-center justify-center mx-auto animate-pulse">
                <item.icon className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-sm text-brand-dark-text block">{item.title}</span>
              <p className="text-[10px] text-gray-400 leading-normal">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Campaign Banner Card */}
        <div className="bg-white border border-gray-100 rounded-3xl p-6 md:p-8 shadow-sm max-w-2xl mx-auto space-y-6 text-center">
          <div className="space-y-2">
            <h3 className="text-base font-extrabold text-brand-dark-text font-serif">Support Heal Himala</h3>
            <p className="text-xs text-gray-500 max-w-md mx-auto">
              Want to volunteer or donate seeds to our eco-volunteer drives? Join our upcoming basecamp plantation weekend in Sankri village.
            </p>
          </div>

          <button
            onClick={() => alert("Volunteer application logged! Our operations team will email you the next campaign schedule.")}
            className="bg-brand-forest hover:bg-brand-forest-light text-white font-extrabold min-h-[44px] inline-flex items-center justify-center px-6 py-3 rounded-full text-xs shadow-md transition"
          >
            Volunteer for Cleanups
          </button>
        </div>

      </div>

    </div>
  );
}
