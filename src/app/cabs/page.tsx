"use client";

import React, { useState } from "react";
import { Car, MapPin, Calendar, Users, BadgeCheck, X } from "lucide-react";

export default function CabsPage() {
  const [pickup, setPickup] = useState("");
  const [drop, setDrop] = useState("");
  const [date, setDate] = useState("");
  const [passengers, setPassengers] = useState("1-4");
  const [cabType, setCabType] = useState("sedan");
  const [submitted, setSubmitted] = useState(false);

  const cabOptions = [
    {
      id: "sedan",
      name: "Sedan (Dzire / Etios)",
      capacity: "4 Passengers",
      description: "Comfortable standard sedan for small families and city drives.",
      pricePerKm: "₹14/km",
      image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=400&q=80",
    },
    {
      id: "suv",
      name: "SUV (Ertiga / Carens)",
      capacity: "6 Passengers",
      description: "Ideal for medium groups seeking extra legroom and mountain stability.",
      pricePerKm: "₹18/km",
      image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=400&q=80",
    },
    {
      id: "premium-suv",
      name: "Premium SUV (Innova Crysta)",
      capacity: "7 Passengers",
      description: "Top-tier comfort, luxury interiors, and superior mountain safety.",
      pricePerKm: "₹24/km",
      image: "https://images.unsplash.com/photo-1619767886558-efdc259cde1a?auto=format&fit=crop&w=400&q=80",
    },
    {
      id: "tempo",
      name: "Tempo Traveller",
      capacity: "12-16 Passengers",
      description: "Perfect for large trekking groups, expeditions, and corporate retreats.",
      pricePerKm: "₹28/km",
      image: "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=400&q=80",
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pickup && drop && date) {
      setSubmitted(true);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-24 sm:pt-16 sm:pb-32 flex flex-col lg:flex-row gap-8 lg:gap-12">
      {/* Left Column (Content & Fleet list) */}
      <div className="w-full lg:w-2/3 space-y-8 sm:space-y-10 order-last lg:order-first">
        <div className="space-y-4">
          <span className="text-xs font-extrabold uppercase tracking-widest text-brand-dusk">
            Himalayan Transport
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-serif text-brand-dark-text leading-tight">
            Reliable Cab & Transport Bookings
          </h1>
          <p className="text-sm text-gray-500 leading-relaxed">
            Need airport pickups or drop-offs to Sankri, Haridwar, Dehradun, or Rishikesh? Book verified vehicles with professional mountain drivers for safe and on-time travel.
          </p>
        </div>

        {/* Fleet Section */}
        <div className="space-y-6">
          <h2 className="text-xl font-extrabold text-brand-dark-text font-serif">Our Mountain Fleet</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {cabOptions.map((cab) => (
              <div
                key={cab.id}
                onClick={() => setCabType(cab.id)}
                className={`group border rounded-3xl overflow-hidden cursor-pointer bg-white transition-all ${
                  cabType === cab.id
                    ? "border-brand-forest ring-2 ring-brand-forest/20 shadow-md"
                    : "border-gray-150 shadow-xs hover:border-brand-forest/30"
                }`}
              >
                <div className="aspect-[1.8] bg-gray-100 overflow-hidden relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={cab.image}
                    alt={cab.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                </div>
                <div className="p-5 space-y-2">
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-bold text-brand-dark-text text-sm">{cab.name}</h3>
                    <span className="text-xs font-extrabold text-brand-forest">{cab.pricePerKm}</span>
                  </div>
                  <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider block">
                    Capacity: {cab.capacity}
                  </span>
                  <p className="text-xs text-gray-500 leading-relaxed">{cab.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Column (Booking Form Card) — shown first on mobile */}
      <div className="w-full lg:w-1/3 order-first lg:order-last">
        <div className="glass-card rounded-3xl p-6 md:p-8 border border-white/30 shadow-xl lg:sticky lg:top-28 space-y-6 bg-white/60">
          <div className="flex items-center gap-2 pb-4 border-b border-gray-100">
            <Car className="w-6 h-6 text-brand-dusk-orange shrink-0" />
            <h2 className="text-lg font-bold text-brand-dark-text font-serif">Quick Cab Query</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Pickup */}
            <div className="space-y-1">
              <label htmlFor="pickup-input" className="text-xs font-semibold text-gray-500 block">Pickup Location</label>
              <div className="flex items-center gap-2 p-3 bg-brand-warm-bg rounded-xl border border-gray-150">
                <MapPin className="w-4 h-4 text-brand-dusk shrink-0" />
                <input
                  id="pickup-input"
                  type="text"
                  placeholder="e.g. Dehradun Airport, Haridwar"
                  value={pickup}
                  onChange={(e) => setPickup(e.target.value)}
                  className="bg-transparent border-0 text-xs focus:outline-none w-full text-brand-dark-text"
                  required
                />
              </div>
            </div>

            {/* Drop-off */}
            <div className="space-y-1">
              <label htmlFor="drop-input" className="text-xs font-semibold text-gray-500 block">Drop Location</label>
              <div className="flex items-center gap-2 p-3 bg-brand-warm-bg rounded-xl border border-gray-150">
                <MapPin className="w-4 h-4 text-brand-forest shrink-0" />
                <input
                  id="drop-input"
                  type="text"
                  placeholder="e.g. Sankri, Rishikesh, Joshimath"
                  value={drop}
                  onChange={(e) => setDrop(e.target.value)}
                  className="bg-transparent border-0 text-xs focus:outline-none w-full text-brand-dark-text"
                  required
                />
              </div>
            </div>

            {/* Date */}
            <div className="space-y-1">
              <label htmlFor="date-input" className="text-xs font-semibold text-gray-500 block">Travel Date</label>
              <div className="flex items-center gap-2 p-3 bg-brand-warm-bg rounded-xl border border-gray-150">
                <Calendar className="w-4 h-4 text-brand-dusk-orange shrink-0" />
                <input
                  id="date-input"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="bg-transparent border-0 text-xs focus:outline-none w-full text-brand-dark-text"
                  required
                />
              </div>
            </div>

            {/* Passengers */}
            <div className="space-y-1">
              <label htmlFor="passengers-input" className="text-xs font-semibold text-gray-500 block">Passenger Count</label>
              <div className="flex items-center gap-2 p-3 bg-brand-warm-bg rounded-xl border border-gray-150">
                <Users className="w-4 h-4 text-brand-forest shrink-0" />
                <select
                  id="passengers-input"
                  value={passengers}
                  onChange={(e) => setPassengers(e.target.value)}
                  className="bg-transparent border-0 text-xs focus:outline-none w-full text-brand-dark-text"
                >
                  <option value="1-4">1 - 4 passengers</option>
                  <option value="5-7">5 - 7 passengers</option>
                  <option value="8-12">8 - 12 passengers</option>
                  <option value="13+">13+ passengers</option>
                </select>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-brand-forest hover:bg-brand-forest-light text-white py-3.5 rounded-full font-bold shadow-md transition"
            >
              Request Cab Quote
            </button>
          </form>
        </div>
      </div>

      {/* Success Modal */}
      {submitted && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-gray-100 rounded-3xl p-6 md:p-8 max-w-md w-full text-center space-y-6 shadow-2xl relative">
            <button
              onClick={() => setSubmitted(false)}
              className="absolute top-4 right-4 p-1 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/20 text-green-600 flex items-center justify-center mx-auto shadow-md">
              <BadgeCheck className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-bold text-brand-dark-text">Cab Query Submitted!</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Thank you! Our local transport coordinator will send vehicle details, driver contacts, and exact billing estimates on WhatsApp within 30 minutes.
              </p>
            </div>

            <div className="p-4 bg-brand-warm-bg rounded-2xl border border-gray-150 text-left space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-400 font-medium">Pickup:</span>
                <span className="font-bold text-brand-dark-text">{pickup}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 font-medium">Drop-off:</span>
                <span className="font-bold text-brand-dark-text">{drop}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 font-medium">Cab Selected:</span>
                <span className="font-bold text-brand-dark-text capitalize">{cabType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 font-medium">Travel Date:</span>
                <span className="font-bold text-brand-dark-text">{date}</span>
              </div>
            </div>

            <button
              onClick={() => setSubmitted(false)}
              className="w-full bg-brand-forest hover:bg-brand-forest-light text-white py-3 rounded-full font-bold shadow-md transition"
            >
              Close Window
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
