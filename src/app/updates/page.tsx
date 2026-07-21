"use client";

import React from "react";
import { Compass, ShieldCheck, HelpCircle, Phone, ArrowRight, ShieldAlert, CheckCircle, Info, CloudSnow, Wind } from "lucide-react";

export default function UpdatesPage() {
  const UPDATES = [
    { date: "21 Jul 2026", type: "Weather Advisory", trek: "Buran Ghati Pass", status: "Active", details: "Heavy rain is reported along the lower sections of Buran Ghati. Batches are resting at intermediate basecamp until trail visibility clears. High wind speeds of up to 45 km/h predicted.", icon: Wind, severity: "moderate" },
    { date: "18 Jul 2026", type: "Snow Conditions", trek: "Kedarkantha Winter", status: "Clear", details: "Current snow depth at Kedarkantha peak summit is 15cm. Trails are open with clear visibility. Trekkers are advised to wear microspikes on ridge walks.", icon: CloudSnow, severity: "info" },
    { date: "15 Jul 2026", type: "Trail Advisory", trek: "Valley of Flowers", status: "Regulatory", details: "State forest department has restricted trek access beyond Ghangaria camp past 2:00 PM to protect local wildlife. Ensure early morning starts from base town.", icon: Info, severity: "moderate" }
  ];

  return (
    <div className="min-h-screen bg-brand-warm-bg py-12 font-sans">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Banner */}
        <div className="text-center max-w-xl mx-auto space-y-3">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-brand-dusk-orange bg-brand-forest/5 px-3.5 py-1.5 rounded-full inline-block">
            Trail Advisory Feed
          </span>
          <h1 className="text-3xl font-extrabold font-serif text-brand-dark-text leading-none">
            Live Trail Updates
          </h1>
          <p className="text-xs text-gray-500">
            Real-time reports on weather alerts, trail snow levels, safety guidelines, and forest department regulations.
          </p>
        </div>

        {/* Updates Feed */}
        <div className="space-y-6">
          {UPDATES.map((up, idx) => (
            <div key={idx} className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-100 pb-3 gap-2">
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    up.severity === "moderate" ? "bg-amber-500/10 text-amber-600" : "bg-blue-50/10 text-blue-600 border border-blue-200/20"
                  }`}>
                    <up.icon className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-brand-dark-text block">{up.type}</span>
                    <span className="text-[10px] text-gray-400 font-semibold">{up.trek}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[9px] text-gray-450 font-bold font-mono">{up.date}</span>
                  <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                    up.severity === "moderate" ? "bg-amber-500/10 text-amber-600 border border-amber-500/20" : "bg-blue-500/10 text-blue-600 border border-blue-500/20"
                  }`}>
                    {up.status}
                  </span>
                </div>
              </div>

              <p className="text-xs text-gray-550 leading-relaxed font-medium pl-1">
                {up.details}
              </p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
