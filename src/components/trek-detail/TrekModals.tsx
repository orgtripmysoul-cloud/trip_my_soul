"use client";

import React, { useState } from "react";
import { Activity, BadgeCheck, Download, X } from "lucide-react";
import ModalShell from "./ModalShell";

interface TrekModalsProps {
  trekName: string;
  difficulty: string;
  selectedBatch: string | null;
  isBrochureOpen: boolean;
  onCloseBrochure: () => void;
  isFitnessOpen: boolean;
  onCloseFitness: () => void;
  isBooked: boolean;
  onCloseBooked: () => void;
}

export default function TrekModals({
  trekName,
  difficulty,
  selectedBatch,
  isBrochureOpen,
  onCloseBrochure,
  isFitnessOpen,
  onCloseFitness,
  isBooked,
  onCloseBooked,
}: TrekModalsProps) {
  const [userRunMinutes, setUserRunMinutes] = useState(30);
  const [fitnessCalculated, setFitnessCalculated] = useState(false);

  return (
    <>
      {/* Brochure Download Modal */}
      {isBrochureOpen && (
        <ModalShell onClose={onCloseBrochure}>
          <div className="w-12 h-12 rounded-full bg-brand-forest/10 text-brand-forest flex items-center justify-center mx-auto">
            <Download className="w-6 h-6 text-brand-dusk-orange" />
          </div>

          <div className="space-y-1">
            <h3 className="text-xl font-bold text-brand-dark-text">Download Expedition Brochure</h3>
            <p className="text-xs text-gray-500">
              Get the full day-by-day map, equipment checklist, and safety protocol for {trekName}.
            </p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              alert(`PDF Itinerary for ${trekName} has been sent to your email! Download starting...`);
              onCloseBrochure();
            }}
            className="space-y-3 text-xs text-left"
          >
            <div>
              <label className="font-bold text-gray-700 block mb-1">Your Full Name</label>
              <input required type="text" placeholder="Saurabh Sharma" className="w-full p-2.5 rounded-xl border border-gray-200 focus:outline-none text-base lg:text-sm" />
            </div>
            <div>
              <label className="font-bold text-gray-700 block mb-1">Email Address</label>
              <input required type="email" placeholder="name@domain.com" className="w-full p-2.5 rounded-xl border border-gray-200 focus:outline-none text-base lg:text-sm" />
            </div>
            <div>
              <label className="font-bold text-gray-700 block mb-1">WhatsApp Number</label>
              <input required type="tel" placeholder="+91 9876543210" className="w-full p-2.5 rounded-xl border border-gray-200 focus:outline-none text-base lg:text-sm" />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-full bg-[#0B2545] hover:bg-brand-dusk-orange text-white font-bold text-xs transition shadow-md mt-2"
            >
              Download PDF Itinerary
            </button>
          </form>
        </ModalShell>
      )}

      {/* High Altitude Fitness Readiness Calculator Modal */}
      {isFitnessOpen && (
        <ModalShell onClose={onCloseFitness}>
          <div className="w-12 h-12 rounded-full bg-brand-forest/10 text-brand-forest flex items-center justify-center mx-auto">
            <Activity className="w-6 h-6 text-brand-dusk-orange" />
          </div>

          <div className="space-y-1">
            <h3 className="text-xl font-bold text-brand-dark-text">Fitness Readiness Calculator</h3>
            <p className="text-xs text-gray-500">
              Calculate if your cardio pace is ready for {trekName} ({difficulty}).
            </p>
          </div>

          <div className="space-y-4 text-xs text-left bg-brand-warm-bg p-4 rounded-2xl border border-gray-150">
            <div>
              <label className="font-bold text-gray-700 block mb-1">How fast can you run 5 km (flat ground)?</label>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="20"
                  max="50"
                  value={userRunMinutes}
                  onChange={(e) => {
                    setUserRunMinutes(parseInt(e.target.value));
                    setFitnessCalculated(true);
                  }}
                  className="w-full"
                />
                <span className="font-bold text-brand-forest text-sm shrink-0 w-16">{userRunMinutes} Mins</span>
              </div>
            </div>

            {fitnessCalculated && (
              <div
                className={`p-3 rounded-xl border text-xs font-semibold ${
                  userRunMinutes <= 32
                    ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                    : "bg-amber-50 border-amber-200 text-amber-800"
                }`}
              >
                {userRunMinutes <= 32 ? (
                  <span>✅ Excellent! You meet the target cardio benchmark for {difficulty} grade treks.</span>
                ) : (
                  <span>
                    ⚠️ Recommended training: Aim to improve your 5km run time down to 30-32 minutes prior to trek
                    departure.
                  </span>
                )}
              </div>
            )}
          </div>

          <button
            onClick={onCloseFitness}
            className="w-full py-3 rounded-full bg-[#0B2545] hover:bg-brand-dusk-orange text-white font-bold text-xs transition shadow-md"
          >
            Close Assessment
          </button>
        </ModalShell>
      )}

      {/* Booked Confirmation success modal */}
      {isBooked && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-gray-100 rounded-3xl p-6 md:p-8 max-w-md w-full text-center space-y-6 shadow-2xl relative">
            <button
              onClick={onCloseBooked}
              className="absolute top-4 right-4 p-1 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/20 text-green-600 flex items-center justify-center mx-auto shadow-md">
              <BadgeCheck className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-bold text-brand-dark-text">Booking Query Raised!</h3>
              <p className="text-xs text-gray-555 leading-relaxed">
                Thank you! Your booking query for <strong>{trekName}</strong> ({selectedBatch}) has been received. Our
                expedition leader will reach out on WhatsApp to coordinate medical clearance and billing terms.
              </p>
            </div>

            <button
              onClick={onCloseBooked}
              className="w-full bg-brand-forest hover:bg-brand-forest-light text-white py-3 rounded-full font-bold shadow-md transition"
            >
              Understand
            </button>
          </div>
        </div>
      )}
    </>
  );
}
