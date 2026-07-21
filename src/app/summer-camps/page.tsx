"use client";

import React from "react";
import { Compass, ShieldCheck, HelpCircle, Phone, ArrowRight, ShieldAlert, CheckCircle, Trees, Tent, Users } from "lucide-react";

export default function SummerCampsPage() {
  return (
    <div className="min-h-screen bg-brand-warm-bg font-sans">
      
      {/* Banner */}
      <div className="relative h-[35vh] w-full bg-brand-forest overflow-hidden flex items-center justify-center text-center px-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1532980400857-e8d9d275d858?auto=format&fit=crop&w=1920&q=80"
          alt="Summer Camps"
          className="absolute inset-0 w-full h-full object-cover opacity-20 pointer-events-none"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-warm-bg via-transparent to-black/40" />

        <div className="max-w-2xl mx-auto space-y-3 z-10">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-brand-dusk-orange bg-brand-forest/65 backdrop-blur-md px-3.5 py-1 rounded-full border border-white/10 inline-block">
            Youth Wilderness Camps
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold font-serif text-white leading-tight">
            Himalayan Summer Camps
          </h1>
          <p className="text-xs text-gray-300 max-w-md mx-auto leading-relaxed font-medium">
            Safe, educational forest camp programs for students and kids. Focus on navigation, nature preservation, and wilderness survival.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: Trees, title: "Nature Education", desc: "Interactive flora, fauna, and geology logs with local conservation experts." },
            { icon: Tent, title: "Wilderness Camping", desc: "Teaches pitch setting, camp cleanups, maps navigating, and knot ties." },
            { icon: ShieldCheck, title: "100% Secure Safety", desc: "1:5 instructor to kid ratio. Senior emergency medical responders accompanying batches." }
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

        {/* Group Inquiry Card */}
        <div className="bg-white border border-gray-100 rounded-3xl p-6 md:p-8 shadow-sm max-w-2xl mx-auto space-y-6">
          <div className="text-center space-y-1">
            <span className="text-[9px] font-extrabold uppercase tracking-widest text-brand-dusk-orange block">Institutional bookings</span>
            <h3 className="text-base font-extrabold text-brand-dark-text font-serif">School & University Camps Enquiry</h3>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              alert("Summer Camp request raised! Our outdoor team will email brochures.");
            }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs"
          >
            <input type="text" required placeholder="Contact Name" className="p-3 bg-brand-warm-bg border border-gray-150 rounded-xl focus:outline-none" />
            <input type="email" required placeholder="Institutional Email" className="p-3 bg-brand-warm-bg border border-gray-150 rounded-xl focus:outline-none" />
            <input type="text" required placeholder="School / University Name" className="p-3 bg-brand-warm-bg border border-gray-150 rounded-xl focus:outline-none" />
            <select className="p-3 bg-brand-warm-bg border border-gray-150 rounded-xl focus:outline-none font-bold text-gray-500">
              <option>Estimated Batch Size (20-40)</option>
              <option>Estimated Batch Size (40-80)</option>
              <option>Estimated Batch Size (80+)</option>
            </select>
            
            <button
              type="submit"
              className="sm:col-span-2 bg-brand-forest hover:bg-brand-forest-light text-white py-3 rounded-full font-bold shadow-md transition"
            >
              Raise Proposal Request
            </button>
          </form>
        </div>

      </div>

    </div>
  );
}
