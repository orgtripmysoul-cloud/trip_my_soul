"use client";

import React from "react";
import { Compass, ShieldCheck, HelpCircle, Phone, ArrowRight, ShieldAlert, CheckCircle, Briefcase, MapPin } from "lucide-react";

export default function CareersPage() {
  const OPENINGS = [
    { title: "Trek Leader / Expedition Guide", type: "Full Time", location: "Basecamps (Uttarakhand/Kashmir)", desc: "Mountaineering certified (BMC/AMC) guides with high-altitude group safety experience. CPR training essential." },
    { title: "Travel Operations Executive", type: "Full Time", location: "Dehradun Head Office", desc: "Coordinating basecamp logistics, taxi schedules, hotel allocations, and local vendor clearances." },
    { title: "Basecamp Logistics Coordinator", type: "Contract", location: "Sankri / Lohajung basecamps", desc: "Overseeing equipment allocations, kitchen rosters, safety logs, and local guide shifts." }
  ];

  return (
    <div className="min-h-screen bg-brand-warm-bg py-12 font-sans">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Banner */}
        <div className="text-center max-w-xl mx-auto space-y-3">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-brand-dusk-orange bg-brand-forest/5 px-3.5 py-1.5 rounded-full inline-block">
            Join Our Expedition
          </span>
          <h1 className="text-3xl font-extrabold font-serif text-brand-dark-text leading-none">
            Careers at TripMySoul
          </h1>
          <p className="text-xs text-gray-500">
            Work in high-altitude environments or coordinate travel operations from our Dehradun offices. View active openings below.
          </p>
        </div>

        {/* Openings list */}
        <div className="space-y-4">
          {OPENINGS.map((job, idx) => (
            <div key={idx} className="bg-white border border-gray-100 rounded-3xl p-5 md:p-6 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-brand-forest/5 text-brand-forest flex items-center justify-center">
                    <Briefcase className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-sm font-bold text-brand-dark-text block leading-none">{job.title}</span>
                    <span className="text-[10px] text-gray-400 font-semibold">{job.type}</span>
                  </div>
                </div>
                <p className="text-[10px] text-gray-500 leading-normal pl-10 max-w-xl">{job.desc}</p>
              </div>

              <div className="pl-10 sm:pl-0 shrink-0 space-y-2 text-right">
                <span className="text-[10px] font-semibold text-gray-450 flex items-center gap-1 justify-end">
                  <MapPin className="w-3.5 h-3.5 text-brand-dusk-orange" />
                  <span>{job.location}</span>
                </span>
                <button
                  onClick={() => alert(`Applying for ${job.title} raised! Please email your portfolio to careers@tripmysoul.in.`)}
                  className="bg-brand-forest hover:bg-brand-forest-light text-white px-4 py-2 rounded-full text-[10px] font-bold shadow-xs transition"
                >
                  Apply Now
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
