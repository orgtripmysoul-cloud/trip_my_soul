"use client";

import React, { useState } from "react";
import { ChevronDown, Compass } from "lucide-react";
import type { ResolvedTrekDetail } from "@/lib/trekDetail";

interface TrekCompleteInformationProps {
  detail: ResolvedTrekDetail;
  noun: string;
}

interface InfoSection {
  id: string;
  title: string;
  content: React.ReactNode;
}

/**
 * Deep-dive accordions.
 *
 * Treks get the safety/fitness/campsite briefing — the Buran Ghati variants are
 * trek-specific copy that still lives here. Trips get the logistics their own
 * itinerary publishes instead: ground rules, vehicles, kids and enquiry numbers.
 */
export default function TrekCompleteInformation({ detail, noun }: TrekCompleteInformationProps) {
  const [openSection, setOpenSection] = useState<string | null>(null);

  const toggleSection = (id: string) => setOpenSection(openSection === id ? null : id);

  const { trek, useTrekFallbacks, thingsToRemember, transportModes, kidsPolicy, contactNumbers, contactPhone } = detail;
  const isBuran = trek.name.toLowerCase().includes("buran");

  const trekSections: InfoSection[] = [
    {
      id: "safety",
      title: "🛡️ Safety Guidelines & Emergency Exit Plans",
      content: isBuran ? (
        <div className="space-y-3 font-sans">
          <p>
            Buran Ghati is a high-altitude pass climbing up to <strong>15,000 ft</strong>. Acclimatization is highly
            critical. We include a mandatory acclimatization day at Litham (Day 4) to hike to Chandranahan Lake (13,900
            ft).
          </p>
          <div className="bg-brand-warm-bg/50 border border-gray-150/40 rounded-xl p-3.5 space-y-2 text-xs text-gray-500">
            <span className="font-extrabold text-brand-forest uppercase block text-[9px] tracking-wider">
              Critical Exit Route:
            </span>
            <p>
              In case of evacuation, the primary exit route is descending from Litham back to Janglik basecamp, from
              where emergency vehicles can reach Rohru. On the other side of the pass, exit is via Barua village towards
              Shimla.
            </p>
          </div>
          <p>
            Our guides carry medical oxygen cylinders, Pulse Oximeters to monitor SpO2 twice daily (target &gt; 85%), and
            a mountain stretch bag at all high camps (Litham, Dhunda, Munirang).
          </p>
        </div>
      ) : (
        <div className="space-y-3 font-sans">
          <p>
            High altitude illness (AMS) is possible above 8,000 ft. We plan gradual elevation gains across all camps.
            Guide teams track SpO2 levels daily.
          </p>
          <p>
            Primary emergency exits are trails leading back to the base camp town (Sankri/Lohajung) where ambulance
            support coordinates with local medical centers.
          </p>
        </div>
      ),
    },
    {
      id: "fitness",
      title: "🏃‍♂️ Fitness Preparation & Cardio Goals",
      content: isBuran ? (
        <div className="space-y-3 font-sans">
          <p>
            Buran Ghati is graded as <strong>Moderate-Difficult</strong>. You will walk on steep slopes of snow/boulders
            for up to 8 hours on Pass crossing day.
          </p>
          <div className="bg-brand-warm-bg/50 border border-gray-150/40 rounded-xl p-3.5 space-y-2 text-xs text-gray-555">
            <span className="font-extrabold text-brand-forest uppercase block text-[9px] tracking-wider">
              Recommended training:
            </span>
            <ul className="list-disc pl-4 space-y-1.5 font-sans font-medium text-[11px]">
              <li>Be able to run 5 km in 30 minutes (flat ground) 4 weeks before the trek.</li>
              <li>Perform 3 sets of 20 squats and 10 lunges thrice weekly for thigh stamina.</li>
              <li>Staircase climbing (15 floors) with a 6kg backpack to prepare for steep pass ascents.</li>
            </ul>
          </div>
        </div>
      ) : (
        <div className="space-y-3 font-sans">
          <p>
            Graded as <strong>{trek.difficulty}</strong>. A basic aerobic fitness level is required.
          </p>
          <p>
            Start running 4 km in 30 minutes at least 3 weeks prior to departure. Stair climbing and lunges help build
            calves and joints stamina.
          </p>
        </div>
      ),
    },
    {
      id: "campsites",
      title: "⛺ Campsite Profiles & Eco Guidelines",
      content: isBuran ? (
        <div className="space-y-2.5 font-sans">
          <p>Our campsites (Janglik, Dayara, Litham, Dhunda, Munirang) are established on licensed forest grounds.</p>
          <ul className="list-disc pl-4 space-y-1.5 text-xs text-gray-555 leading-relaxed font-medium">
            <li>
              <strong>Dayara Meadows:</strong> Vast rolling green meadows facing the Gunas Pass range. Eco-dry toilet
              tents set up 100 meters away from water sources.
            </li>
            <li>
              <strong>Litham Confluence:</strong> Placed at the beautiful junction of Pabbar River and Chandranahan
              stream. Strict restriction on bathing or washing dishes in the river.
            </li>
            <li>
              <strong>Dhunda Base:</strong> A cold, windy high basecamp below the pass. Double layer windproof dome tents
              are mandatory.
            </li>
          </ul>
        </div>
      ) : (
        <div className="space-y-2.5 font-sans">
          <p>
            All campsites feature eco-dry toilet systems, triple-layered sleeping mats, and windproof dome tents. We
            collect and carry all waste plastics down to baseline municipalities.
          </p>
        </div>
      ),
    },
    {
      id: "reachability",
      title: "🚗 How to Reach & Transport Logistics",
      content: isBuran ? (
        <div className="space-y-3 font-sans">
          <p>
            <strong>Shimla Railway Station / Bus Terminal</strong> is the default assembly point.
          </p>
          <ul className="list-disc pl-4 space-y-1.5 text-xs text-gray-555 leading-normal font-medium">
            <li>
              <strong>Day 1 assembly:</strong> Meet at 6:30 AM outside Shimla Railway Station. Vehicles depart by 7:00
              AM.
            </li>
            <li>
              <strong>Return journey:</strong> Reach Shimla on Day 7 by 8:30 PM. Book return train/bus tickets post 9:30
              PM.
            </li>
            <li>
              <strong>Cab arrangements:</strong> Shared Tempo Travelers/Boleros coordinated by TripMySoul partners. Cost
              of approx. ₹9,000 per vehicle is divided equally among passengers.
            </li>
          </ul>
        </div>
      ) : (
        <div className="space-y-3 font-sans">
          <p>
            Assembly point is usually Dehradun or Rishikesh Railway Station. Shared cabs coordinate departures on Day 1
            morning, returning on the final day by evening.
          </p>
        </div>
      ),
    },
    {
      id: "permits",
      title: "📋 Mandatory Permits & Document Checklists",
      content: (
        <div className="space-y-3 font-sans">
          <p>
            Forest department clearances require all documents to be uploaded via the <strong>Traveler Dashboard</strong>{" "}
            at least 15 days before batch starts:
          </p>
          <div className="bg-brand-warm-bg/50 border border-gray-150/40 rounded-xl p-3.5 space-y-2 text-xs text-gray-555 font-sans">
            <ul className="list-decimal pl-4 space-y-1.5 font-sans font-medium text-[11px]">
              <li>Photocopy of Government Photo ID Card (Aadhaar, Passport, or Voter ID).</li>
              <li>MBBS physician-signed Medical Fitness Form (download template from your dashboard).</li>
              <li>Signed Voluntary Indemnity Form.</li>
            </ul>
          </div>
        </div>
      ),
    },
  ];

  const listingSections: InfoSection[] = [];

  if (thingsToRemember.length > 0) {
    listingSections.push({
      id: "ground-rules",
      title: "📝 Things to Remember on the Road",
      content: (
        <ul className="list-disc pl-4 space-y-1.5 text-xs text-gray-555 leading-relaxed font-medium font-sans">
          {thingsToRemember.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      ),
    });
  }

  if (transportModes.length > 0) {
    listingSections.push({
      id: "vehicles",
      title: "🚐 Vehicle Allocated by Group Size",
      content: (
        <div className="space-y-2 font-sans">
          {transportModes.map((mode) => (
            <div
              key={mode.group}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 p-3 bg-brand-warm-bg/50 border border-gray-150/40 rounded-xl text-xs"
            >
              <span className="font-extrabold text-brand-forest">{mode.group}</span>
              <span className="font-medium text-gray-555">{mode.vehicle}</span>
            </div>
          ))}
        </div>
      ),
    });
  }

  if (kidsPolicy) {
    listingSections.push({
      id: "kids",
      title: "👨‍👩‍👧 Travelling with Children",
      content: <p className="text-xs text-gray-555 leading-relaxed font-medium font-sans">{kidsPolicy}</p>,
    });
  }

  const numbers = [contactPhone, ...contactNumbers].filter(Boolean) as string[];
  if (numbers.length > 0) {
    listingSections.push({
      id: "enquiries",
      title: "📞 Enquiries & Booking Desk",
      content: (
        <ul className="space-y-1.5 text-xs font-sans font-medium">
          {[...new Set(numbers)].map((number) => (
            <li key={number}>
              <a href={`tel:${number.replace(/\s+/g, "")}`} className="text-brand-forest font-bold hover:underline">
                {number}
              </a>
            </li>
          ))}
        </ul>
      ),
    });
  }

  const sections = useTrekFallbacks ? [...trekSections, ...listingSections] : listingSections;

  if (sections.length === 0) return null;

  return (
    <div className="space-y-4 font-sans">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-brand-forest/5 text-brand-forest rounded-full flex items-center justify-center shrink-0">
          <Compass className="w-5 h-5 text-brand-dusk-orange" />
        </div>
        <div>
          <h2 className="text-lg font-extrabold text-brand-dark-text font-serif leading-none">
            Complete {noun} Information
          </h2>
          <p className="text-[10px] text-gray-400 mt-1">
            Deep-dive details regarding safety checklists, routes, permits, and ground rules.
          </p>
        </div>
      </div>

      <div className="border-b border-gray-100" />

      {/* Accordion Group */}
      <div className="space-y-3">
        {sections.map((sec) => {
          const isOpen = openSection === sec.id;
          return (
            <div key={sec.id} className="border border-gray-150 rounded-2xl overflow-hidden bg-white shadow-xs">
              <button
                onClick={() => toggleSection(sec.id)}
                className="w-full flex items-center justify-between p-4 text-left font-bold text-xs text-brand-dark-text bg-brand-warm-bg/20 hover:bg-brand-warm-bg/40 transition focus:outline-none"
              >
                <span>{sec.title}</span>
                <ChevronDown className={`w-4 h-4 text-brand-forest transition-transform ${isOpen ? "rotate-180" : ""}`} />
              </button>
              {isOpen && (
                <div className="p-5 text-xs text-gray-555 leading-relaxed border-t border-gray-150/50 bg-white font-sans font-medium">
                  {sec.content}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
