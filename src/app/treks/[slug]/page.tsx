"use client";

import React, { useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { MapPin, Calendar, Compass, ShieldAlert, BadgeCheck, X, Activity, Check, AlertCircle } from "lucide-react";
import { TREKS } from "@/data/db";
import Accordion from "@/components/Accordion";

export default function TrekDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  // Retrieve the trek from our database
  const trek = useMemo(() => {
    return TREKS.find((t) => t.slug === slug) || null;
  }, [slug]);

  // Tab state for Inclusions/Exclusions/Pack list
  const [activeTab, setActiveTab] = useState<"inclusions" | "exclusions" | "packlist">("inclusions");
  
  // Date Picker state
  const [selectedBatch, setSelectedBatch] = useState<string | null>(null);
  const [isBooked, setIsBooked] = useState(false);

  // Fallback if trek not found
  if (!trek) {
    return (
      <div className="max-w-md mx-auto py-40 px-4 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-brand-dusk mx-auto" />
        <h1 className="text-2xl font-bold text-brand-dark-text">Trek not found</h1>
        <p className="text-xs text-gray-500">The trek route you are looking for does not exist or has been renamed.</p>
        <button
          onClick={() => router.push("/treks")}
          className="px-5 py-2.5 rounded-full bg-brand-forest hover:bg-brand-forest-light text-white font-bold text-xs transition"
        >
          Back to all treks
        </button>
      </div>
    );
  }

  // Parse batch dates if present, else create mock dates
  const batchData = trek.batches?.years?.["2026"]?.months || [
    {
      month: "Oct",
      trips: [
        { startDate: "10 Oct", endDate: "15 Oct", status: "Open" },
        { startDate: "20 Oct", endDate: "25 Oct", status: "Open" },
      ],
    },
    {
      month: "Nov",
      trips: [
        { startDate: "05 Nov", endDate: "10 Nov", status: "Open" },
        { startDate: "15 Nov", endDate: "20 Nov", status: "Filling Fast" },
      ],
    },
  ];

  // Format Accordion Itinerary
  const itineraryItems = (trek.itinerary || [
    { day: 1, title: "Arrival at basecamp", description: "Arrive at the designated basecamp town. Check into the homestay/tents, meet your guides, and undergo a medical checkup and trail briefing." },
    { day: 2, title: "Trek to intermediate camp", description: "A gradual climb through pine forests and along alpine streams. Pitch camp under the stars." },
    { day: 3, title: "Summit ascent & return to camp", description: "An early morning summit push to witness the sunrise over the higher Himalayan peaks, followed by a descent back to the lower campsite." },
    { day: 4, title: "Descent to basecamp & departure", description: "Descend to the basecamp town, board the vehicle, and travel back to the railway station/airport." },
  ]).map((day) => ({
    id: day.day,
    title: `Day ${day.day}: ${day.title}`,
    content: day.description,
  }));

  // Format Accordion FAQs
  const faqItems = (trek.faqs || [
    { title: "What is the difficulty level?", description: "This trek is classified as moderate. It requires a baseline cardiovascular fitness, and some preparation like regular jogging/running is recommended." },
    { title: "Is drinking water available on the trail?", description: "Yes, we harvest clean drinking water from mountain springs. It is boiled or treated before serving. Bring two reusable water bottles." },
    { title: "What type of accommodation is provided?", description: "We provide high-quality weather-proof tents (triple sharing) with thick insulation mats and negative-temperature-rated sleeping bags." },
  ]).map((faq, idx) => ({
    id: idx,
    title: faq.title,
    content: faq.description,
  }));

  const handleBookNow = () => {
    if (!selectedBatch) {
      // Scroll to batch picker
      const element = document.getElementById("batch-picker");
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      setIsBooked(true);
    }
  };

  return (
    <div className="bg-brand-warm-bg relative min-h-screen">
      {/* Hero Banner Area */}
      <div className="relative h-[50vh] w-full bg-brand-forest overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1920&q=80"
          alt={trek.name}
          className="w-full h-full object-cover opacity-50 pointer-events-none"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-warm-bg via-transparent to-black/35" />
        
        {/* Breadcrumb & Header info */}
        <div className="absolute bottom-10 left-0 w-full">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
            <span className="text-xs font-extrabold uppercase tracking-widest text-brand-dusk-orange bg-brand-forest/65 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 inline-block">
              {trek.region}
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold font-serif text-brand-dark-text md:text-white leading-tight">
              {trek.name}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-gray-500 md:text-gray-200">
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4 text-brand-dusk-orange" />
                <span>{trek.startLocation}</span>
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4 text-brand-dusk-orange" />
                <span>{trek.days} Days / {trek.nights} Nights</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col lg:flex-row gap-10">
        
        {/* Left Columns (Information blocks) */}
        <div className="w-full lg:w-2/3 space-y-12">
          
          {/* Overviews and Stats */}
          <div className="bg-white border border-gray-100 rounded-3xl p-6 md:p-8 shadow-xs space-y-6">
            <h2 className="text-xl font-extrabold text-brand-dark-text font-serif">Route Highlights</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="space-y-1">
                <span className="text-xs text-gray-400 block font-semibold uppercase tracking-wider">Difficulty</span>
                <span className="text-base font-bold text-brand-forest block">{trek.difficulty}</span>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-gray-400 block font-semibold uppercase tracking-wider">Max Altitude</span>
                <span className="text-base font-bold text-brand-forest block">12,500 Ft</span>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-gray-400 block font-semibold uppercase tracking-wider">Duration</span>
                <span className="text-base font-bold text-brand-forest block">{trek.days} Days</span>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-gray-400 block font-semibold uppercase tracking-wider">Trek Theme</span>
                <span className="text-base font-bold text-brand-forest block">{trek.themes[0] || "Snow Trails"}</span>
              </div>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed pt-2 border-t border-gray-100">
              The {trek.name} is a premier trail set in the heart of the Himalayas. Known for its mesmerizing landscapes, towering pine forests, and magnificent peak views. Fully guided by our local mountaineering team with extreme focus on safety and local heritage.
            </p>
          </div>

          {/* Day-by-Day Itinerary Accordion */}
          <div className="space-y-6">
            <h2 className="text-xl font-extrabold text-brand-dark-text font-serif">Detailed Itinerary</h2>
            <Accordion items={itineraryItems} />
          </div>

          {/* Fitness & Preparation block */}
          <div className="bg-brand-forest text-white rounded-3xl p-6 md:p-8 shadow-md space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-brand-forest-light/10 rounded-full blur-xl pointer-events-none" />
            <div className="flex items-center gap-3">
              <Activity className="w-6 h-6 text-brand-dusk-orange" />
              <h2 className="text-xl font-extrabold font-serif">Fitness & Prep Guidance</h2>
            </div>
            <p className="text-sm text-gray-200 leading-relaxed">
              Himalayan high-altitude treks require cardiovascular endurance. To complete the {trek.name} comfortably, we suggest starting a fitness regime 4 weeks prior to the batch date:
            </p>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-semibold text-gray-200 pt-2">
              <li className="flex items-center gap-2.5 bg-white/5 p-3 rounded-xl border border-white/5">
                <Check className="w-4 h-4 text-brand-dusk-orange shrink-0" />
                <span>Cardio: Jog 4km in under 30 minutes</span>
              </li>
              <li className="flex items-center gap-2.5 bg-white/5 p-3 rounded-xl border border-white/5">
                <Check className="w-4 h-4 text-brand-dusk-orange shrink-0" />
                <span>Leg strength: 3 sets of 20 squats</span>
              </li>
              <li className="flex items-center gap-2.5 bg-white/5 p-3 rounded-xl border border-white/5">
                <Check className="w-4 h-4 text-brand-dusk-orange shrink-0" />
                <span>Stamina: Climb 3 flights of stairs, 5 times</span>
              </li>
              <li className="flex items-center gap-2.5 bg-white/5 p-3 rounded-xl border border-white/5">
                <Check className="w-4 h-4 text-brand-dusk-orange shrink-0" />
                <span>Hydration: Drink 3-4 liters of water daily</span>
              </li>
            </ul>
          </div>

          {/* Tab Inclusions / Exclusions */}
          <div className="bg-white border border-gray-100 rounded-3xl shadow-xs overflow-hidden">
            {/* Tabs Trigger */}
            <div className="flex border-b border-gray-100 bg-gray-50/50">
              <button
                onClick={() => setActiveTab("inclusions")}
                className={`flex-1 text-center py-4 text-xs md:text-sm font-bold border-b-2 transition-all ${
                  activeTab === "inclusions"
                    ? "border-brand-forest text-brand-forest bg-white"
                    : "border-transparent text-gray-400 hover:text-gray-600"
                }`}
              >
                Inclusions
              </button>
              <button
                onClick={() => setActiveTab("exclusions")}
                className={`flex-1 text-center py-4 text-xs md:text-sm font-bold border-b-2 transition-all ${
                  activeTab === "exclusions"
                    ? "border-brand-forest text-brand-forest bg-white"
                    : "border-transparent text-gray-400 hover:text-gray-600"
                }`}
              >
                Exclusions
              </button>
              <button
                onClick={() => setActiveTab("packlist")}
                className={`flex-1 text-center py-4 text-xs md:text-sm font-bold border-b-2 transition-all ${
                  activeTab === "packlist"
                    ? "border-brand-forest text-brand-forest bg-white"
                    : "border-transparent text-gray-400 hover:text-gray-600"
                }`}
              >
                Things to Pack
              </button>
            </div>

            {/* Tabs Content */}
            <div className="p-6 md:p-8">
              {activeTab === "inclusions" && (
                <ul className="space-y-4">
                  {(trek.inclusions || [
                    { title: "Transport", description: "To and from pickup railway station/airport." },
                    { title: "Accommodations", description: "Homestays on day 1; double/triple tents on other nights." },
                    { title: "Meals", description: "Vegetarian breakfast, lunch, hot snacks, and dinners." },
                    { title: "Safety Gear", description: "Micro-spikes, snow gaiters, medical cylinders." },
                  ]).map((inc, idx) => (
                    <li key={idx} className="flex gap-3">
                      <BadgeCheck className="w-5 h-5 text-brand-dusk-orange shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-sm text-brand-dark-text block">{inc.title}</span>
                        <span className="text-xs text-gray-500 leading-relaxed">{inc.description}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}

              {activeTab === "exclusions" && (
                <ul className="space-y-4">
                  {(trek.exclusions || [
                    { title: "GST & Fees", description: "5% GST not included." },
                    { title: "Personal Expenses", description: "Trekking poles rental, laundry, mineral water." },
                    { title: "Backpack Offloading", description: "Charges for porters to carry personal bags." },
                    { title: "Travel Delay Costs", description: "Accommodation costs in case of weather roadblocks." },
                  ]).map((exc, idx) => (
                    <li key={idx} className="flex gap-3">
                      <ShieldAlert className="w-5 h-5 text-brand-dusk shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-sm text-brand-dark-text block">{exc.title}</span>
                        <span className="text-xs text-gray-500 leading-relaxed">{exc.description}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}

              {activeTab === "packlist" && (
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { title: "Rucksack / Backpack", description: "50-60L capacity bag with secure shoulder straps." },
                    { title: "Trekking Shoes", description: "High-ankle waterproof shoes with good grip." },
                    { title: "Day Pack", description: "10-20L bag for carrying values during summit climb." },
                    { title: "Warm Layers", description: "Thermals, fleece jacket, padded feather jacket." },
                    { title: "Headlamp / Torch", description: "Essential for morning summit starts." },
                    { title: "Water Bottles", description: "Two 1L insulated reusable steel bottles." },
                  ].map((item, idx) => (
                    <li key={idx} className="flex gap-3 p-3 bg-brand-warm-bg rounded-xl border border-gray-100">
                      <div className="w-8 h-8 rounded-lg bg-brand-forest/5 flex items-center justify-center shrink-0 text-brand-forest">
                        <Compass className="w-4 h-4 text-brand-dusk" />
                      </div>
                      <div>
                        <span className="font-bold text-xs text-brand-dark-text block">{item.title}</span>
                        <span className="text-[10px] text-gray-500 leading-relaxed">{item.description}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Batch Date Picker Selector */}
          <div id="batch-picker" className="bg-white border border-gray-100 rounded-3xl p-6 md:p-8 shadow-xs space-y-6">
            <h2 className="text-xl font-extrabold text-brand-dark-text font-serif">Available Batch Dates</h2>
            <p className="text-xs text-gray-500">Select an upcoming batch date. Price remains fixed for all listed slots.</p>
            
            <div className="space-y-6">
              {batchData.map((m: any, idx: number) => (
                <div key={idx} className="space-y-3">
                  <span className="text-xs font-extrabold text-brand-forest-light tracking-wide uppercase block">
                    Month: {m.month} 2026
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {m.trips.map((trip: any, tIdx: number) => {
                      const isSelected = selectedBatch === `${trip.startDate} - ${trip.endDate}`;
                      const isClosed = trip.status === "Closed";
                      const isFilling = trip.status === "Filling Fast";
                      
                      return (
                        <button
                          key={tIdx}
                          onClick={() => !isClosed && setSelectedBatch(`${trip.startDate} - ${trip.endDate}`)}
                          disabled={isClosed}
                          className={`p-4 rounded-2xl border text-left flex flex-col justify-between h-24 transition-all duration-200 ${
                            isClosed
                              ? "bg-gray-50 border-gray-100 opacity-55 cursor-not-allowed"
                              : isSelected
                              ? "border-brand-forest bg-brand-forest/5 ring-2 ring-brand-forest/20"
                              : "border-gray-150 bg-white hover:border-brand-forest/35"
                          }`}
                        >
                          <div className="flex items-center justify-between w-full">
                            <span className="text-sm font-bold text-brand-dark-text">
                              {trip.startDate}
                            </span>
                            <span className="text-[9px] font-bold tracking-wider px-2 py-0.5 rounded-full uppercase border">
                              {trip.status}
                            </span>
                          </div>
                          <span className="text-[10px] text-gray-500">
                            Ends: {trip.endDate}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* FAQs Accordion */}
          <div className="space-y-6">
            <h2 className="text-xl font-extrabold text-brand-dark-text font-serif">Frequently Asked Questions</h2>
            <Accordion items={faqItems} />
          </div>

        </div>

        {/* Right Column (Floating Booking Card) */}
        <div className="w-full lg:w-1/3">
          <div className="glass-card rounded-3xl p-6 md:p-8 border border-white/30 shadow-xl sticky top-28 space-y-6">
            <div>
              <span className="text-xs font-bold text-gray-500 uppercase tracking-widest block">Expedition Cost</span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-4xl font-extrabold text-brand-forest">
                  {trek.price ? `₹${trek.price.toLocaleString()}` : "TBD"}
                </span>
                <span className="text-xs font-medium text-gray-500">/ traveler</span>
              </div>
              <span className="text-[10px] text-gray-400 block mt-1">Fixed batch prices. Inclusive of accommodation and meals.</span>
            </div>

            {/* Selected batch display */}
            <div className="p-3 bg-brand-warm-bg rounded-xl border border-gray-150 text-xs">
              <span className="font-bold text-gray-400 block uppercase tracking-wider text-[9px] mb-1">Selected Schedule</span>
              <span className="font-extrabold text-brand-dark-text block">
                {selectedBatch || "No Batch Selected"}
              </span>
            </div>

            {/* Booking buttons */}
            <button
              onClick={handleBookNow}
              className="w-full bg-brand-dusk hover:bg-brand-dusk-orange text-white py-4 rounded-full font-bold shadow-lg transform hover:-translate-y-0.5 transition duration-200 flex items-center justify-center gap-2"
            >
              <span>{selectedBatch ? "Book Now" : "Select Batch Date"}</span>
            </button>
            <a
              href="https://wa.me/918178613438"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-white border border-gray-200 hover:bg-gray-50 text-brand-dark-text py-4 rounded-full font-bold transition flex items-center justify-center gap-2 text-xs"
            >
              <span>Custom Corporate Booking</span>
            </a>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Bar (Mobile viewports only) */}
      <div className="lg:hidden fixed bottom-0 left-0 w-full z-30 bg-white border-t border-gray-100 p-4 flex items-center justify-between shadow-2xl">
        <div>
          <span className="text-[10px] text-gray-400 uppercase tracking-wider block">Price per traveler</span>
          <span className="text-2xl font-extrabold text-brand-forest">
            {trek.price ? `₹${trek.price.toLocaleString()}` : "TBD"}
          </span>
        </div>
        <button
          onClick={handleBookNow}
          className="bg-brand-dusk hover:bg-brand-dusk-orange text-white font-bold px-6 py-3 rounded-full text-xs shadow-md"
        >
          {selectedBatch ? "Book Now" : "Select Date"}
        </button>
      </div>

      {/* Booking Confirmation Success Modal */}
      {isBooked && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white border border-gray-100 rounded-3xl p-6 md:p-8 max-w-md w-full text-center space-y-6 shadow-2xl relative">
            <button
              onClick={() => setIsBooked(false)}
              className="absolute top-4 right-4 p-1 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/20 text-green-600 flex items-center justify-center mx-auto shadow-md">
              <BadgeCheck className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-bold text-brand-dark-text">Booking Query Sent!</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Thank you for choosing TripMySoul! A travel expert will contact you within 2 hours to confirm your documents upload, safety profile, and process payment.
              </p>
            </div>

            <div className="p-4 bg-brand-warm-bg rounded-2xl border border-gray-150 text-left space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-400 font-medium">Trek:</span>
                <span className="font-bold text-brand-dark-text">{trek.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 font-medium">Batch Slot:</span>
                <span className="font-bold text-brand-dark-text">{selectedBatch}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 font-medium">Base Fare:</span>
                <span className="font-bold text-brand-forest">₹{trek.price?.toLocaleString()}</span>
              </div>
            </div>

            <button
              onClick={() => setIsBooked(false)}
              className="w-full bg-brand-forest hover:bg-brand-forest-light text-white py-3 rounded-full font-bold shadow-md transition"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
