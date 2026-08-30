"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Compass, Heart, CheckCircle2, ChevronRight, ChevronLeft, MapPin, Calendar,
  ArrowRight, ShieldCheck, HelpCircle
} from "lucide-react";
import { TREKS } from "@/data/db";
import TrekCard from "@/components/TrekCard";

export default function SuggestTrekPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [fitness, setFitness] = useState<string | null>(null);
  const [region, setRegion] = useState<string | null>(null);
  const [season, setSeason] = useState<string | null>(null);
  const [budget, setBudget] = useState<number>(20000);

  const matchedTreks = useMemo(() => {
    if (step < 5) return [];

    return TREKS.filter((trek) => {
      // 1. Budget check
      const price = trek.price || 0;
      if (price > budget) return false;

      // 2. Region check
      if (region && region !== "Any" && trek.region !== region) return false;

      // 3. Difficulty / Fitness mapping
      if (fitness) {
        const diff = trek.difficulty.toLowerCase();
        if (fitness === "Beginner" && (diff.includes("difficult") || diff.includes("challenging"))) return false;
        if (fitness === "Elite" && diff.includes("easy") && !diff.includes("moderate")) return false;
      }

      // 4. Season check
      if (season && season !== "Any") {
        const months = trek.months || [];
        const seasonMonths: Record<string, string[]> = {
          "Winter": ["Dec", "Jan", "Feb"],
          "Spring": ["Mar", "Apr"],
          "Summer": ["May", "Jun"],
          "Monsoon": ["Jul", "Aug"],
          "Autumn": ["Sep", "Oct", "Nov"]
        };
        const activeMonths = seasonMonths[season] || [];
        const matchesSeason = months.some(m => activeMonths.includes(m));
        if (!matchesSeason) return false;
      }

      return true;
    }).slice(0, 3); // top 3 matches
  }, [step, fitness, region, season, budget]);

  const handleNext = () => {
    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleReset = () => {
    setFitness(null);
    setRegion(null);
    setSeason(null);
    setBudget(20000);
    setStep(1);
  };

  return (
    <div className="min-h-screen bg-brand-warm-bg py-12 font-sans">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Banner */}
        <div className="text-center max-w-xl mx-auto space-y-3">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-brand-dusk-orange bg-brand-forest/5 px-3.5 py-1.5 rounded-full inline-block">
            Trek Finder Assistant
          </span>
          <h1 className="text-3xl font-extrabold font-serif text-brand-dark-text leading-none">
            Suggest Me A Trek
          </h1>
          <p className="text-xs text-gray-505">
            Answer a few quick questions about your experience, preferences, and budget to view recommendations matched to your profile.
          </p>
        </div>

        {/* Progress Bar */}
        {step <= 4 && (
          <div className="max-w-md mx-auto space-y-1">
            <div className="flex justify-between text-[9px] font-extrabold text-gray-450 uppercase pl-1">
              <span>Step {step} of 4</span>
              <span>{Math.round((step / 4) * 100)}% Complete</span>
            </div>
            <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-brand-forest rounded-full transition-all duration-300" style={{ width: `${(step / 4) * 100}%` }} />
            </div>
          </div>
        )}

        {/* Step Container Card */}
        <div className="bg-white border border-gray-100 rounded-3xl p-6 md:p-10 shadow-xl max-w-2xl mx-auto">
          
          {/* STEP 1: FITNESS / EXPERIENCE */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="space-y-1 text-center sm:text-left">
                <h2 className="text-lg font-extrabold text-brand-dark-text font-serif">1. What is your trekking experience & fitness?</h2>
                <p className="text-[11px] text-gray-400">This helps us match trails matching your cardiovascular and elevation endurance limits.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { id: "Beginner", title: "Beginner / Relaxed", desc: "For first-timers. Prefer gradual ascents and shorter daily walking distances." },
                  { id: "Active", title: "Active / Prepared", desc: "Enjoy regular hiking, jogging, or sports. Can comfortably walk 5-6 hours/day." },
                  { id: "Elite", title: "Elite / Athlete", desc: "High cardiovascular fitness level. Eager for passes, long hours, and snow crossings." }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setFitness(item.id)}
                    className={`p-4 border rounded-2xl text-left transition-all space-y-2 flex flex-col justify-between ${
                      fitness === item.id ? "bg-brand-forest text-white border-brand-forest shadow-md" : "bg-white hover:border-brand-forest/30 border-gray-150"
                    }`}
                  >
                    <span className="font-extrabold text-xs block leading-none">{item.title}</span>
                    <span className={`text-[10px] block leading-relaxed ${fitness === item.id ? "text-sky-100" : "text-gray-400"}`}>{item.desc}</span>
                  </button>
                ))}
              </div>

              <div className="flex justify-end pt-4 border-t border-gray-100">
                <button
                  disabled={!fitness}
                  onClick={handleNext}
                  className="bg-brand-forest disabled:opacity-50 text-white font-extrabold min-h-[44px] inline-flex items-center justify-center px-6 py-2.5 rounded-full text-xs shadow-md hover:-translate-y-0.5 transform transition flex items-center gap-1.5"
                >
                  <span>Continue</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: REGION */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="space-y-1 text-center sm:text-left">
                <h2 className="text-lg font-extrabold text-brand-dark-text font-serif">2. Which Himalayan region holds your interest?</h2>
                <p className="text-[11px] text-gray-400">Choose from major territories or select any if you are open to all landscapes.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { id: "Uttarakhand", title: "Uttarakhand", desc: "Land of deep pine valleys, meadows (Bugyals), and classical spiritual hubs." },
                  { id: "Himachal Pradesh", title: "Himachal Pradesh", desc: "High mountain crossings, glacial valleys, and pine-clad camping clearings." },
                  { id: "Jammu & Kashmir", title: "Jammu & Kashmir", desc: "High alpine lakes, meadows, and sweeping valley basins of Kashmir." },
                  { id: "Any", title: "Show Me All Regions", desc: "Open to exploring any valley within our operational network." }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setRegion(item.id)}
                    className={`p-4 border rounded-2xl text-left transition-all space-y-2 flex flex-col justify-between ${
                      region === item.id ? "bg-brand-forest text-white border-brand-forest shadow-md" : "bg-white hover:border-brand-forest/30 border-gray-150"
                    }`}
                  >
                    <span className="font-extrabold text-xs block leading-none">{item.title}</span>
                    <span className={`text-[10px] block leading-relaxed ${region === item.id ? "text-sky-100" : "text-gray-400"}`}>{item.desc}</span>
                  </button>
                ))}
              </div>

              <div className="flex justify-between pt-4 border-t border-gray-100">
                <button
                  onClick={handleBack}
                  className="flex items-center gap-1.5 px-4 py-2 border border-gray-250 rounded-full hover:bg-gray-50 text-xs font-bold text-gray-600 transition"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
                <button
                  disabled={!region}
                  onClick={handleNext}
                  className="bg-brand-forest disabled:opacity-50 text-white font-extrabold min-h-[44px] inline-flex items-center justify-center px-6 py-2.5 rounded-full text-xs shadow-md hover:-translate-y-0.5 transform transition flex items-center gap-1.5"
                >
                  <span>Continue</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: SEASON */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="space-y-1 text-center sm:text-left">
                <h2 className="text-lg font-extrabold text-brand-dark-text font-serif">3. Select your preferred trekking season</h2>
                <p className="text-[11px] text-gray-400">Choose from snow-filled winters, green monsoons, or pleasant summers.</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {[
                  { id: "Winter", title: "❄️ Winter", desc: "Dec - Feb" },
                  { id: "Spring", title: "🌸 Spring", desc: "Mar - Apr" },
                  { id: "Summer", title: "☀️ Summer", desc: "May - Jun" },
                  { id: "Monsoon", title: "🌧️ Monsoon", desc: "Jul - Aug" },
                  { id: "Autumn", title: "🍂 Autumn", desc: "Sep - Nov" },
                  { id: "Any", title: "🗺️ Any Season", desc: "Show All" }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setSeason(item.id)}
                    className={`p-4 border rounded-2xl text-left transition-all space-y-1 flex flex-col justify-between ${
                      season === item.id ? "bg-brand-forest text-white border-brand-forest shadow-md" : "bg-white hover:border-brand-forest/30 border-gray-150"
                    }`}
                  >
                    <span className="font-extrabold text-xs block leading-none">{item.title}</span>
                    <span className={`text-[9px] font-bold block ${season === item.id ? "text-sky-100" : "text-gray-400"}`}>{item.desc}</span>
                  </button>
                ))}
              </div>

              <div className="flex justify-between pt-4 border-t border-gray-100">
                <button
                  onClick={handleBack}
                  className="flex items-center gap-1.5 px-4 py-2 border border-gray-250 rounded-full hover:bg-gray-50 text-xs font-bold text-gray-600 transition"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
                <button
                  disabled={!season}
                  onClick={handleNext}
                  className="bg-brand-forest disabled:opacity-50 text-white font-extrabold min-h-[44px] inline-flex items-center justify-center px-6 py-2.5 rounded-full text-xs shadow-md hover:-translate-y-0.5 transform transition flex items-center gap-1.5"
                >
                  <span>Continue</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: BUDGET RANGE */}
          {step === 4 && (
            <div className="space-y-6">
              <div className="space-y-1 text-center sm:text-left">
                <h2 className="text-lg font-extrabold text-brand-dark-text font-serif">4. Set your maximum budget limit</h2>
                <p className="text-[11px] text-gray-400">Filter out packages that sit outside your comfortable spending bracket.</p>
              </div>

              <div className="space-y-4 py-6 px-2">
                <div className="flex justify-between font-extrabold text-xs text-brand-forest font-mono">
                  <span>Min: ₹5,000</span>
                  <span className="text-brand-dusk-orange text-sm bg-brand-forest/5 px-3 py-1 rounded-full">
                    Max: ₹{budget.toLocaleString()}
                  </span>
                  <span>Max: ₹25,000+</span>
                </div>
                <input
                  type="range"
                  min="5000"
                  max="25000"
                  step="500"
                  value={budget}
                  onChange={(e) => setBudget(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-forest text-base lg:text-sm"
                />
              </div>

              <div className="flex justify-between pt-4 border-t border-gray-100">
                <button
                  onClick={handleBack}
                  className="flex items-center gap-1.5 px-4 py-2 border border-gray-250 rounded-full hover:bg-gray-50 text-xs font-bold text-gray-600 transition"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
                <button
                  onClick={handleNext}
                  className="bg-brand-dusk hover:bg-brand-dusk-orange text-white font-extrabold min-h-[44px] inline-flex items-center justify-center px-8 py-3 rounded-full text-xs shadow-lg hover:-translate-y-0.5 transform transition flex items-center gap-1.5"
                >
                  <span>Find Recommendations</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: RESULTS */}
          {step === 5 && (
            <div className="space-y-6">
              <div className="space-y-1 text-center">
                <div className="w-10 h-10 bg-green-500/10 border border-green-500/20 text-green-600 rounded-full flex items-center justify-center mx-auto mb-2">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-extrabold text-brand-dark-text font-serif">Recommended Hikes</h2>
                <p className="text-[11px] text-gray-400">Based on your choices, we recommend the following trails.</p>
              </div>

              {matchedTreks.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {matchedTreks.map((trek) => (
                    <TrekCard key={trek.slug} trek={trek} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 space-y-3">
                  <p className="text-xs text-gray-500 font-semibold">No treks match your strict search coordinates.</p>
                  <button
                    onClick={handleReset}
                    className="bg-brand-forest text-white px-5 py-2.5 rounded-full text-xs font-bold shadow transition"
                  >
                    Adjust Filters / Reset
                  </button>
                </div>
              )}

              <div className="flex justify-between pt-6 border-t border-gray-100 flex-wrap gap-4 items-center">
                <button
                  onClick={handleReset}
                  className="text-xs font-bold text-gray-400 hover:text-brand-forest transition uppercase tracking-wider pl-1"
                >
                  Start Over
                </button>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => router.push("/treks")}
                    className="px-5 py-2.5 border border-gray-150 hover:bg-gray-50 rounded-full text-xs font-bold text-brand-forest transition"
                  >
                    All Treks Catalog
                  </button>
                  <a
                    href="https://wa.me/918178613438?text=Hi%20TripMySoul,%20I%20just%20completed%20the%20trek%20finder%20questionnaire%20and%20need%20expert%20guidance."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-full text-xs font-bold shadow transition flex items-center gap-1.5"
                  >
                    <span>WhatsApp Consult</span>
                  </a>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
