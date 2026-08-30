"use client";

import React from "react";
import { Compass, ShieldCheck, HelpCircle, Phone, ArrowRight, ShieldAlert, CheckCircle, GraduationCap, Trophy, Users } from "lucide-react";

export default function LearningProgramsPage() {
  return (
    <div className="min-h-screen bg-brand-warm-bg font-sans">
      
      {/* Banner */}
      <div className="relative h-[35vh] w-full bg-brand-forest overflow-hidden flex items-center justify-center text-center px-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1920&q=80"
          alt="Learning Programs"
          className="absolute inset-0 w-full h-full object-cover opacity-20 pointer-events-none"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-warm-bg via-transparent to-black/40" />

        <div className="max-w-2xl mx-auto space-y-3 z-10">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-brand-dusk-orange bg-brand-forest/65 backdrop-blur-md px-3.5 py-1 rounded-full border border-white/10 inline-block">
            wilderness leadership
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold font-serif text-white leading-tight">
            Institutional Learning Programs
          </h1>
          <p className="text-xs text-gray-300 max-w-md mx-auto leading-relaxed font-medium">
            Leadership development, team dynamics, and mental resilience training conducted in the wilderness.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: GraduationCap, title: "Wilderness Skills", desc: "Academically mapped certificate courses covering mountaineering baselines, weather mapping, and altitude safety logs." },
            { icon: Trophy, title: "Corporate Teams", desc: "Wilderness navigation drills and shelter pitches designed to challenge group problem-solving and team dynamics." },
            { icon: Users, title: "Resilience Coaches", desc: "Programs overseen by certified psychology experts, mountaineers, and corporate leadership coaches." }
          ].map((item, idx) => (
            <div key={idx} className="bg-white border border-gray-100 rounded-3xl p-6 shadow-xs space-y-4 text-center">
              <div className="w-10 h-10 bg-brand-forest/5 text-brand-forest rounded-full flex items-center justify-center mx-auto">
                <item.icon className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-sm text-brand-dark-text block">{item.title}</span>
              <p className="text-[10px] text-gray-400 leading-normal">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Corporate Enquiry Card */}
        <div className="bg-white border border-gray-100 rounded-3xl p-6 md:p-8 shadow-sm max-w-2xl mx-auto space-y-6">
          <div className="text-center space-y-1">
            <span className="text-[9px] font-extrabold uppercase tracking-widest text-brand-dusk-orange block font-serif">Wilderness retreats</span>
            <h3 className="text-base font-extrabold text-brand-dark-text font-serif">Corporate & Organization Programs Request</h3>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              alert("Leadership Program proposal request sent! Our corporate coordinator will email back within 24 hours.");
            }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs"
          >
            <input type="text" required placeholder="Coordinator Name" className="p-3 bg-brand-warm-bg border border-gray-150 rounded-xl focus:outline-none text-base lg:text-sm" />
            <input type="email" required placeholder="Business Email Address" className="p-3 bg-brand-warm-bg border border-gray-150 rounded-xl focus:outline-none text-base lg:text-sm" />
            <input type="text" required placeholder="Company / Organization" className="p-3 bg-brand-warm-bg border border-gray-150 rounded-xl focus:outline-none text-base lg:text-sm" />
            <select className="p-3 bg-brand-warm-bg border border-gray-150 rounded-xl focus:outline-none font-bold text-gray-500 text-base lg:text-sm">
              <option>Preferred Course Length (3 Days)</option>
              <option>Preferred Course Length (5 Days)</option>
              <option>Preferred Course Length (7+ Days)</option>
            </select>
            
            <button
              type="submit"
              className="sm:col-span-2 bg-brand-forest hover:bg-brand-forest-light text-white min-h-[44px] inline-flex items-center justify-center py-3 rounded-full font-bold shadow-md transition"
            >
              Request Leadership Catalog
            </button>
          </form>
        </div>

      </div>

    </div>
  );
}
