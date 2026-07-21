"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  MapPin, Calendar, Compass, ShieldAlert, BadgeCheck, X, Activity, Check, AlertCircle,
  TrendingUp, Globe, Utensils, Train, Plane, Home, ShieldCheck, Heart, Share2, Phone,
  MessageSquare, ChevronDown, Download, AlertTriangle, HelpCircle, Sparkles,
  ClipboardList, Map, Bell, Maximize2
} from "lucide-react";
import { TREKS } from "@/data/db";

// Horizontal Tab List
const TABS = [
  { id: "overview", label: "Overview" },
  { id: "about-trek", label: "About Trek" },
  { id: "itinerary", label: "Itinerary" },
  { id: "eligibility", label: "Eligibility" },
  { id: "video", label: "Video" },
  { id: "how-to-reach", label: "How to Reach" },
  { id: "cost-terms", label: "Cost Terms" },
  { id: "trek-essentials", label: "Trek Essentials" },
  { id: "cancellation", label: "Cancellation Policy" },
  { id: "imp-links", label: "Imp. Links" },
  { id: "faqs", label: "FAQs" },
];

interface ItineraryDay {
  day: number;
  title: string;
  altitudePoints?: { location: string; m: number; ft: number }[];
  altitudeGain?: { m: number; ft: number } | null;
  driveDistance?: string;
  drivingTime?: string;
  trekDistance?: string;
  trekDuration?: string;
  detailedDescription?: string;
  meals?: string;
  stayType?: string;
}

export default function TrekDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [activeTabId, setActiveTabId] = useState("overview");
  const [wishlistSaved, setWishlistSaved] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState<string | null>(null);
  const [isBooked, setIsBooked] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [costTab, setCostTab] = useState<"inclusions" | "exclusions">("inclusions");
  const [showNotifyBar, setShowNotifyBar] = useState(true);
  const [notifyEmail, setNotifyEmail] = useState("");
  const [notifySuccess, setNotifySuccess] = useState(false);

  // Retrieve the trek from our database
  const trek = useMemo(() => {
    return TREKS.find((t) => t.slug === slug) || null;
  }, [slug]);

  // Handle active tab highlighting on scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 200;
      for (const tab of TABS) {
        const el = document.getElementById(tab.id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveTabId(tab.id);
            break;
          }
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!trek) {
    return (
      <div className="max-w-md mx-auto py-40 px-4 text-center space-y-4 font-sans">
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

  // Deduce seasons list based on trek months
  const seasonsList = (() => {
    const list: string[] = [];
    const months = trek.months || [];
    if (months.some(m => ["Dec", "Jan", "Feb"].includes(m))) list.push("Winter");
    if (months.some(m => ["Mar", "Apr"].includes(m))) list.push("Spring");
    if (months.some(m => ["May", "Jun"].includes(m))) list.push("Summer");
    if (months.some(m => ["Jul", "Aug"].includes(m))) list.push("Monsoon");
    if (months.some(m => ["Sep", "Oct", "Nov"].includes(m))) list.push("Autumn");
    return list.join(", ") || "TBD";
  })();

  // Deduce trail type
  const trailType = (() => {
    const list: string[] = [];
    const themes = trek.themes || [];
    if (themes.includes("Snow")) list.push("Snow Trails");
    if (themes.includes("Meadow")) list.push("Alpine Meadows");
    if (themes.includes("Forest")) list.push("Forest Canopy Walks");
    if (themes.includes("Pass Crossing")) list.push("Pass Crossings");
    if (themes.includes("Glacier")) list.push("Glacier Moraine");
    if (themes.includes("Lake")) list.push("Lakeside Walk");
    return list.join(" & ") || "Mountain Trails";
  })();

  // Deduce transport hubs
  const transport = (() => {
    const reg = trek.region.toLowerCase();
    if (reg.includes("uttarakhand")) {
      return {
        railHead: "Dehradun Railway Station (DDN)",
        airport: "Jolly Grant Airport, Dehradun",
        road: "Direct roads from Rishikesh/Dehradun to Base Camp"
      };
    }
    if (reg.includes("himachal")) {
      return {
        railHead: "Chandigarh (CDG) / Pathankot",
        airport: "Bhuntar Airport, Kullu",
        road: "Regular buses & private cabs from Manali/Shimla"
      };
    }
    return {
      railHead: "Jammu Tawi Railway Station",
      airport: "Srinagar Airport (SXR)",
      road: "Shared/Private cabs from Srinagar to Base Camp"
    };
  })();

  const handleTabClick = (tabId: string) => {
    const el = document.getElementById(tabId);
    if (el) {
      const offset = el.offsetTop - 150;
      window.scrollTo({ top: offset, behavior: "smooth" });
      setActiveTabId(tabId);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setShareCopied(true);
    setTimeout(() => setShareCopied(false), 2000);
  };

  const handleBookNow = () => {
    if (!selectedBatch) {
      handleTabClick("cost-terms");
    } else {
      setIsBooked(true);
    }
  };

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

  return (
    <div className="bg-brand-warm-bg relative min-h-screen font-sans">
      {/* Hero Banner Section */}
      <div className="relative h-[40vh] md:h-[45vh] w-full bg-brand-forest overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1920&q=80"
          alt={trek.name}
          className="w-full h-full object-cover opacity-50 pointer-events-none"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-warm-bg via-transparent to-black/35" />
        
        <div className="absolute bottom-6 left-0 w-full">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-2">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-brand-dusk-orange bg-brand-forest/65 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 inline-block">
              {trek.region}
            </span>
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold font-serif text-brand-dark-text md:text-white leading-tight">
              {trek.name}
            </h1>
            <div className="flex items-center gap-2.5 text-xs font-semibold text-[#040273] md:text-blue-200">
              <MapPin className="w-3.5 h-3.5 text-brand-dusk-orange" />
              <span>Starting Point: {trek.startLocation || "Dehradun"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* STICKY SECTION TAB BAR */}
      <div className="sticky top-[72px] md:top-[80px] z-30 w-full bg-brand-forest border-y border-white/10 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 overflow-x-auto no-scrollbar whitespace-nowrap flex gap-2">
          {TABS.map((tab) => {
            const isActive = activeTabId === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`text-xs px-4 py-2 rounded-full font-bold uppercase tracking-wider transition-all duration-200 shrink-0 ${
                  isActive
                    ? "bg-white text-brand-dark-text shadow-sm"
                    : "border border-white/10 text-white hover:bg-white/10"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* FLOATING ACTION BUTTONS (Right Viewport Stack) */}
      <div className="fixed right-4 bottom-28 md:bottom-32 z-40 flex flex-col gap-3">
        <button
          onClick={() => setWishlistSaved(!wishlistSaved)}
          className={`p-3 rounded-full shadow-lg border transition-all hover:scale-105 active:scale-95 ${
            wishlistSaved
              ? "bg-pink-550 border-pink-550 text-white"
              : "bg-pink-50 border-pink-200 text-pink-550"
          }`}
          aria-label="Save to Wishlist"
        >
          <Heart className={`w-5 h-5 ${wishlistSaved ? "fill-current" : ""}`} />
        </button>
        
        <div className="relative">
          <button
            onClick={handleShare}
            className="p-3 rounded-full bg-blue-50 border border-blue-200 text-blue-600 shadow-lg hover:scale-105 active:scale-95 transition-all"
            aria-label="Share page link"
          >
            <Share2 className="w-5 h-5" />
          </button>
          {shareCopied && (
            <span className="absolute right-14 top-1/2 -translate-y-1/2 bg-brand-forest text-white text-[10px] font-bold px-2 py-1 rounded shadow-md whitespace-nowrap">
              Link Copied!
            </span>
          )}
        </div>

        <a
          href="tel:+918178613438"
          className="p-3 rounded-full bg-sky-50 border border-sky-200 text-sky-600 shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center justify-center"
          aria-label="Call TripMySoul support"
        >
          <Phone className="w-5 h-5" />
        </a>

        <a
          href={`https://wa.me/918178613438?text=Hi%20TripMySoul,%20I'm%20interested%20in%20booking%20the%20${encodeURIComponent(trek.name)}.`}
          target="_blank"
          rel="noopener noreferrer"
          className="p-3 rounded-full bg-green-50 border border-green-200 text-green-600 shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center justify-center"
          aria-label="WhatsApp Contact"
        >
          <MessageSquare className="w-5 h-5 fill-current" />
        </a>
      </div>

      {/* Main Content Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col lg:flex-row gap-8">
        
        {/* Left Column (Content Areas) */}
        <div className="w-full lg:w-2/3 space-y-10">
          
          {/* OVERVIEW SECTION & CARD */}
          <section id="overview" className="space-y-6">
            <div className="bg-white border border-gray-100 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
              <h2 className="text-xl font-extrabold text-brand-dark-text font-serif flex items-center gap-2">
                <Compass className="w-5 h-5 text-brand-dusk-orange" />
                <span>Trek Overview Facts</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs text-gray-500">
                {/* Column 1 */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-brand-forest/5 rounded-xl text-brand-forest shrink-0">
                      <Compass className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-semibold block text-[10px] text-gray-400 uppercase">Trek Name</span>
                      <span className="font-extrabold text-brand-dark-text text-sm leading-none">{trek.name}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-brand-forest/5 rounded-xl text-brand-forest shrink-0">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-semibold block text-[10px] text-gray-400 uppercase">Duration</span>
                      <span className="font-extrabold text-brand-dark-text text-sm leading-none">{trek.days} Days / {trek.nights} Nights</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-brand-forest/5 rounded-xl text-brand-forest shrink-0">
                      <Activity className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-semibold block text-[10px] text-gray-400 uppercase">Adventure Type</span>
                      <span className="font-extrabold text-brand-dark-text text-sm leading-none">{trek.category}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-brand-forest/5 rounded-xl text-brand-forest shrink-0">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-semibold block text-[10px] text-gray-400 uppercase">Base Camp</span>
                      <span className="font-extrabold text-brand-dark-text text-sm leading-none">{trek.startLocation || "TBD"}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-brand-forest/5 rounded-xl text-brand-forest shrink-0">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-semibold block text-[10px] text-gray-400 uppercase">Best Seasons</span>
                      <span className="font-extrabold text-brand-dark-text text-sm leading-none">{seasonsList}</span>
                    </div>
                  </div>
                </div>

                {/* Column 2 */}
                <div className="space-y-4 border-t sm:border-t-0 sm:border-x border-gray-100 sm:px-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-brand-forest/5 rounded-xl text-brand-forest shrink-0">
                      <Globe className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-semibold block text-[10px] text-gray-400 uppercase">Country</span>
                      <span className="font-extrabold text-brand-dark-text text-sm leading-none font-sans">India</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-brand-forest/5 rounded-xl text-brand-forest shrink-0">
                      <TrendingUp className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-semibold block text-[10px] text-gray-400 uppercase">Max Altitude</span>
                      <span className="font-extrabold text-brand-dark-text text-sm leading-none font-sans">12,500 Feet</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-brand-forest/5 rounded-xl text-brand-forest shrink-0">
                      <ShieldAlert className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-semibold block text-[10px] text-gray-400 uppercase">Trek Grade</span>
                      <span className="font-extrabold text-brand-dark-text text-sm leading-none font-sans">{trek.difficulty}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-brand-forest/5 rounded-xl text-brand-forest shrink-0">
                      <Compass className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-semibold block text-[10px] text-gray-400 uppercase">Trail Type</span>
                      <span className="font-extrabold text-brand-dark-text text-sm leading-none font-sans">{trailType}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-brand-forest/5 rounded-xl text-brand-forest shrink-0">
                      <Utensils className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-semibold block text-[10px] text-gray-400 uppercase">Catering Food</span>
                      <span className="font-extrabold text-brand-dark-text text-sm leading-none font-sans font-medium">Boiled Veg Meals</span>
                    </div>
                  </div>
                </div>

                {/* Column 3 */}
                <div className="space-y-4 border-t sm:border-t-0 border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-brand-forest/5 rounded-xl text-brand-forest shrink-0">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-semibold block text-[10px] text-gray-400 uppercase">Location State</span>
                      <span className="font-extrabold text-brand-dark-text text-sm leading-none">{trek.region}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-brand-forest/5 rounded-xl text-brand-forest shrink-0">
                      <TrendingUp className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-semibold block text-[10px] text-gray-400 uppercase">Trek Distance</span>
                      <span className="font-extrabold text-brand-dark-text text-sm leading-none">28 Kilometers</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-brand-forest/5 rounded-xl text-brand-forest shrink-0">
                      <Train className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-semibold block text-[10px] text-gray-400 uppercase">Nearest Rail Head</span>
                      <span className="font-extrabold text-brand-dark-text text-sm leading-none">{transport.railHead}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-brand-forest/5 rounded-xl text-brand-forest shrink-0">
                      <Home className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-semibold block text-[10px] text-gray-400 uppercase">Camp Stay</span>
                      <span className="font-extrabold text-brand-dark-text text-sm leading-none">Guest Homestay & Alpine Tents</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-brand-forest/5 rounded-xl text-brand-forest shrink-0">
                      <Plane className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-semibold block text-[10px] text-gray-400 uppercase">Nearest Airport</span>
                      <span className="font-extrabold text-brand-dark-text text-sm leading-none truncate max-w-[130px] md:max-w-none block">{transport.airport}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* View Departure Dates button */}
              <div className="flex flex-col items-center justify-center pt-4 border-t border-gray-100 gap-3">
                <button
                  onClick={() => handleTabClick("cost-terms")}
                  className="bg-brand-dusk hover:bg-brand-dusk-orange text-white font-extrabold px-8 py-3.5 rounded-full shadow-lg transition-transform hover:-translate-y-0.5"
                >
                  View Departure Dates
                </button>
                <div className="flex items-center gap-1.5 text-xs text-brand-forest font-bold">
                  <ShieldCheck className="w-4 h-4 text-brand-dusk-orange" />
                  <span>Free rescheduling up to 15 days before batch start</span>
                </div>
              </div>
            </div>
          </section>

          {/* QUICK ITINERARY SECTION */}
          <section className="bg-white border border-gray-100 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
            <TrekQuickItinerary trekName={trek.name} itinerary={trek.itinerary || []} />
          </section>

          {/* ABOUT TREK SECTION */}
          <section id="about-trek" className="bg-white border border-gray-100 rounded-3xl p-6 md:p-8 shadow-sm space-y-4">
            <h2 className="text-lg font-extrabold text-brand-dark-text font-serif">About {trek.name}</h2>
            <div className="text-sm text-gray-650 leading-relaxed space-y-4">
              <p>
                The {trek.name} is a majestic climbing experience tailored to hikers who want to absorb raw, untouched Himalayan geography. The trail leads through deep pine forests, alpine rivers, and ascends to panoramic vantage points providing sweeping views of snow-capped peaks.
              </p>
              <p>
                Every campsite is carefully selected for ecological safety, scenic brilliance, and shelter. With TripMySoul's local guides, safety equipment, and organic mountain menus, this trek offers a healing journey that is both physically invigorating and spiritually comforting.
              </p>
            </div>
          </section>

          {/* COMPLETE TREK INFORMATION SECTION */}
          <section id="complete-trek-information" className="bg-white border border-gray-100 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
            <TrekCompleteInformation trekName={trek.name} />
          </section>

          {/* ITINERARY INTERACTIVE VIEWER SECTION */}
          <section id="itinerary" className="bg-white border border-gray-100 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
            <ItineraryViewer itinerary={trek.itinerary || generateMockItinerary(typeof trek.days === "number" ? trek.days : parseInt(trek.days || "5", 10))} />
          </section>

          {/* ELIGIBILITY SECTION */}
          <section id="eligibility" className="bg-white border border-gray-100 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
            <h2 className="text-lg font-extrabold text-brand-dark-text font-serif">Eligibility & Fitness Meter</h2>
            <div className="flex flex-col md:flex-row gap-6 items-center">
              <div className="w-full md:w-1/3 bg-brand-warm-bg border border-gray-150 rounded-2xl p-5 text-center space-y-3">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Trek Difficulty</span>
                <span className="text-xl font-extrabold text-brand-dusk-orange block font-serif uppercase tracking-wider">{trek.difficulty}</span>
                <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      trek.difficulty.toLowerCase().includes("difficult") ? "w-4/5 bg-red-500" :
                      trek.difficulty.toLowerCase().includes("moderate") ? "w-1/2 bg-amber-500" : "w-1/3 bg-green-500"
                    }`}
                  />
                </div>
              </div>
              <div className="w-full md:w-2/3 space-y-3 text-xs text-gray-650 leading-relaxed">
                <span className="font-bold text-brand-dark-text text-sm block">Preparation Guidelines</span>
                <p>
                  To complete this climb comfortably, you should maintain a baseline cardiovascular health. We recommend starting running/jogging routines 4 weeks before the trip (aiming for 5 km in 35-40 minutes).
                </p>
                <p>
                  Individuals with severe asthma, cardiac history, or chronic knee problems must consult their physician before registering.
                </p>
              </div>
            </div>
          </section>

          {/* VIDEO SECTION */}
          <section id="video" className="bg-white border border-gray-100 rounded-3xl p-6 md:p-8 shadow-sm space-y-4">
            <h2 className="text-lg font-extrabold text-brand-dark-text font-serif">Expedition Preview Video</h2>
            <div className="aspect-video w-full rounded-2xl overflow-hidden bg-gray-150 relative flex items-center justify-center">
              <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white p-4 text-center space-y-2">
                <PlayVideoIcon className="w-12 h-12 text-brand-dusk-orange" />
                <span className="font-bold text-xs uppercase tracking-widest block">Video Log Preview</span>
                <span className="text-[10px] text-gray-300 block">Watch trail contours and campsite showcases</span>
              </div>
            </div>
          </section>

          {/* HOW TO REACH SECTION */}
          <section id="how-to-reach" className="bg-white border border-gray-100 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
            <h2 className="text-lg font-extrabold text-brand-dark-text font-serif">How to Reach</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-gray-650">
              <div className="space-y-2 p-4 bg-brand-warm-bg rounded-2xl border border-gray-150">
                <span className="font-extrabold text-brand-forest uppercase tracking-wider block">By Air</span>
                <p>{transport.airport}. Board direct flight to local airport, then hire shared cabs to base town.</p>
              </div>
              <div className="space-y-2 p-4 bg-brand-warm-bg rounded-2xl border border-gray-150">
                <span className="font-extrabold text-brand-forest uppercase tracking-wider block">By Train</span>
                <p>{transport.railHead}. Regular overnight trains connect major cities to these junctions.</p>
              </div>
              <div className="space-y-2 p-4 bg-brand-warm-bg rounded-2xl border border-gray-150">
                <span className="font-extrabold text-brand-forest uppercase tracking-wider block">By Road</span>
                <p>{transport.road}. Local taxi unions and state transport buses run morning schedules.</p>
              </div>
            </div>
          </section>

          {/* COST TERMS & BATCH PICKER SECTION */}
          <section id="cost-terms" className="bg-white border border-gray-100 rounded-3xl p-6 md:p-8 shadow-sm space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-100 pb-4 gap-4">
              <h2 className="text-lg font-extrabold text-brand-dark-text font-serif">Cost Terms & Inclusions</h2>
              <div className="flex bg-brand-warm-bg p-1 rounded-full border border-gray-150 text-[10px] font-bold">
                <button
                  onClick={() => setCostTab("inclusions")}
                  className={`px-4 py-1.5 rounded-full uppercase transition-all ${
                    costTab === "inclusions" ? "bg-brand-forest text-white" : "text-gray-500"
                  }`}
                >
                  Inclusions
                </button>
                <button
                  onClick={() => setCostTab("exclusions")}
                  className={`px-4 py-1.5 rounded-full uppercase transition-all ${
                    costTab === "exclusions" ? "bg-brand-forest text-white" : "text-gray-500"
                  }`}
                >
                  Exclusions
                </button>
              </div>
            </div>

            {/* Inclusions / Exclusions content */}
            {costTab === "inclusions" ? (
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-gray-650">
                {(trek.inclusions || [
                  { title: "Trek Lodging", description: "Comfortable homestays in basecamp village and double-sharing alpine tents on trail." },
                  { title: "Mountain Food", description: "Healthy veg meals (Breakfast, lunch, hot snacks, dinner) prepared at campsites." },
                  { title: "Expedition Gear", description: "High-grade waterproof tents, negative-rated sleeping bags, and mattresses." },
                  { title: "Expert guides", description: "Mountaineering certified trip leaders, support staff, and camp cooks." },
                  { title: "Medical Kit", description: "Group oxygen cylinders, stretcher-tents, and first-aid briefcases." },
                  { title: "Forest Permits", description: "All entry charges, state clearances, and booking fee clearances." },
                ]).map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-brand-dark-text block">{item.title}</span>
                      <span>{item.description}</span>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-gray-650">
                {(trek.exclusions || [
                  { title: "Personal Porters", description: "Porters carrying personal luggage bags (can be hired separately at basecamp)." },
                  { title: "Transport to Basecamp", description: "Pickup and travel drops between station/airport and basecamp village." },
                  { title: "Rental Trek Gear", description: "Trekking poles, down jackets, spikes, or climbing boots." },
                  { title: "Trek Insurance", description: "Travel insurance policies (must be obtained before trail departure)." },
                  { title: "Mineral Water", description: "Bottled carbonated water or commercial food soft-drinks." },
                ]).map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <X className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-brand-dark-text block">{item.title}</span>
                      <span>{item.description}</span>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            {/* BATCH SELECTOR BLOCK */}
            <div id="batch-picker" className="pt-6 border-t border-gray-100 space-y-4">
              <span className="text-sm font-extrabold text-brand-dark-text font-serif block">Available Departure Batches</span>
              
              <div className="space-y-6">
                {batchData.map((monthBlock: any) => (
                  <div key={monthBlock.month} className="space-y-2.5">
                    <span className="text-xs font-bold text-brand-forest uppercase tracking-wider block pl-1">
                      {monthBlock.month} 2026
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {monthBlock.trips.map((trip: any, idx: number) => {
                        const isSelected = selectedBatch === `${monthBlock.month}-${idx}`;
                        const isFull = trip.status.toLowerCase() === "closed";
                        return (
                          <button
                            key={idx}
                            disabled={isFull}
                            onClick={() => setSelectedBatch(isSelected ? null : `${monthBlock.month}-${idx}`)}
                            className={`p-3 border rounded-2xl flex items-center justify-between transition-all text-left ${
                              isFull ? "bg-gray-100 border-gray-200 opacity-60 cursor-not-allowed" :
                              isSelected ? "bg-brand-forest text-white border-brand-forest ring-2 ring-brand-forest/20 shadow-xs" :
                              "bg-white hover:border-brand-forest/40 border-gray-150"
                            }`}
                          >
                            <div className="space-y-1">
                              <span className={`text-xs font-extrabold block ${isSelected ? "text-white" : "text-brand-dark-text"}`}>
                                {trip.startDate} - {trip.endDate}
                              </span>
                              <span className="text-[9px] text-gray-400 font-semibold uppercase block">
                                Year 2026
                              </span>
                            </div>
                            <span className={`text-[9px] px-2 py-0.75 rounded-full font-bold uppercase tracking-wider ${
                              isFull ? "bg-gray-200 text-gray-500" :
                              trip.status === "Filling Fast" ? "bg-amber-500/10 text-amber-600 border border-amber-500/20" :
                              isSelected ? "bg-white/20 text-white" : "bg-green-500/10 text-green-600 border border-green-500/20"
                            }`}>
                              {trip.status}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* TREK ESSENTIALS / PACK LIST SECTION */}
          <section id="trek-essentials" className="bg-white border border-gray-100 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
            <h2 className="text-lg font-extrabold text-brand-dark-text font-serif">Trek Essentials Packing List</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-gray-650">
              <div className="space-y-2.5">
                <span className="font-extrabold text-brand-forest uppercase tracking-wider block">Head & Face</span>
                <ul className="space-y-1 pl-3.5 list-disc font-medium">
                  <li>Woolen Cap / Balaclava</li>
                  <li>UV Sun Protection Sunglasses</li>
                  <li>Sunscreen lotion (SPF 50+)</li>
                </ul>
              </div>
              <div className="space-y-2.5 border-t md:border-t-0 md:border-x border-gray-100 md:px-6">
                <span className="font-extrabold text-brand-forest uppercase tracking-wider block">Trek Wear</span>
                <ul className="space-y-1 pl-3.5 list-disc font-medium">
                  <li>Quick-dry synthetic shirts (3)</li>
                  <li>Trekking pants (2)</li>
                  <li>Down insulated jacket (1)</li>
                  <li>Waterproof shell pants & jacket</li>
                </ul>
              </div>
              <div className="space-y-2.5 border-t md:border-t-0 border-gray-100">
                <span className="font-extrabold text-brand-forest uppercase tracking-wider block">Footwear & Gear</span>
                <ul className="space-y-1 pl-3.5 list-disc font-medium">
                  <li>Trekking boots with high ankle</li>
                  <li>Woolen socks (3 pairs)</li>
                  <li>Trekking poles (1 pair)</li>
                  <li>Headlamp / torch</li>
                </ul>
              </div>
            </div>
          </section>

          {/* CANCELLATION POLICY SECTION */}
          <section id="cancellation" className="bg-white border border-gray-100 rounded-3xl p-6 md:p-8 shadow-sm space-y-4">
            <h2 className="text-lg font-extrabold text-brand-dark-text font-serif">Cancellation & Voucher Policy</h2>
            <div className="text-xs text-gray-650 leading-relaxed space-y-3 font-medium">
              <p>
                Cancellations requested <strong>30 days or more</strong> prior to the trek start date are eligible for a <strong>90% refund</strong> or a 100% voucher credit valid for 1 year.
              </p>
              <p>
                Cancellations between <strong>15 to 30 days</strong> are eligible for a <strong>50% refund</strong> or a 100% voucher credit.
              </p>
              <p>
                Cancellations requested <strong>less than 15 days</strong> prior to departure are <strong>not eligible for refunds or credits</strong>. Rations, permits, and guides are fully paid in advance by this point.
              </p>
            </div>
          </section>

          {/* IMPORTANT LINKS SECTION */}
          <section id="imp-links" className="bg-white border border-gray-100 rounded-3xl p-6 md:p-8 shadow-sm space-y-4">
            <h2 className="text-lg font-extrabold text-brand-dark-text font-serif">Important Documents & Links</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                className="flex items-center justify-between p-4 bg-brand-warm-bg rounded-2xl border border-gray-150 text-brand-forest font-bold hover:bg-gray-100 transition shadow-xs group"
              >
                <div className="flex items-center gap-2">
                  <Download className="w-4 h-4 text-brand-dusk-orange shrink-0" />
                  <span>Download Trek PDF Brochure</span>
                </div>
                <span className="text-[10px] text-gray-400 group-hover:translate-x-0.5 transition-transform">→</span>
              </a>
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                className="flex items-center justify-between p-4 bg-brand-warm-bg rounded-2xl border border-gray-150 text-brand-forest font-bold hover:bg-gray-100 transition shadow-xs group"
              >
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-brand-dusk-orange shrink-0" />
                  <span>Obtain Group Trek Insurance</span>
                </div>
                <span className="text-[10px] text-gray-400 group-hover:translate-x-0.5 transition-transform">→</span>
              </a>
            </div>
          </section>

          {/* FAQS SECTION */}
          <section id="faqs" className="bg-white border border-gray-100 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
            <h2 className="text-lg font-extrabold text-brand-dark-text font-serif">Frequently Asked Questions</h2>
            
            <div className="space-y-3">
              {(trek.faqs || [
                { title: "What is the peak altitude of this trek?", description: "The maximum height achieved is 12,500 feet at the summit ridge. You will walk around 5-6 km per day on average." },
                { title: "Is mobile network connectivity available on trail?", description: "No, network coverage (Jio/Airtel) disappears shortly after leaving the basecamp village. Enjoy a digital detox!" },
                { title: "What toilet facilities are set up on the trail?", description: "We set up dry compost toilet tents at every wilderness camp location. Toilet paper and organic sawdust are supplied." },
              ]).map((faq, idx) => {
                const isOpen = expandedFaq === idx;
                return (
                  <div key={idx} className="border border-gray-150 rounded-2xl overflow-hidden bg-white">
                    <button
                      onClick={() => setExpandedFaq(isOpen ? null : idx)}
                      className="w-full flex items-center justify-between p-4 bg-brand-warm-bg text-left hover:bg-gray-100 transition"
                    >
                      <span className="font-extrabold text-xs text-brand-forest uppercase tracking-wider flex items-center gap-2">
                        <HelpCircle className="w-4 h-4 text-brand-dusk-orange shrink-0" />
                        <span>{faq.title}</span>
                      </span>
                      <ChevronDown className={`w-4 h-4 text-brand-forest transition-transform ${isOpen ? "rotate-180" : ""}`} />
                    </button>
                    {isOpen && (
                      <div className="p-4 text-xs text-gray-650 leading-relaxed bg-white border-t border-gray-150">
                        {faq.description}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

        </div>

        {/* Right Column (Booking Widget Card) */}
        <div className="w-full lg:w-1/3">
          <div className="glass-card rounded-3xl p-6 md:p-8 border border-white/30 shadow-xl sticky top-28 space-y-6 bg-white/60">
            <div className="pb-4 border-b border-gray-100 space-y-1">
              <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider block">Registration Fee</span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl font-extrabold font-serif text-brand-forest">
                  {trek.price ? `₹${trek.price.toLocaleString()}` : "TBD"}
                </span>
                <span className="text-xs text-gray-500">/ person</span>
              </div>
            </div>

            {/* Trip brief specs */}
            <div className="space-y-3.5 text-xs text-gray-650">
              <div className="flex justify-between">
                <span className="text-gray-400 font-semibold">Trek Route:</span>
                <span className="font-bold text-brand-dark-text">{trek.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 font-semibold">Selected Batch:</span>
                <span className="font-bold text-brand-dusk-orange">
                  {selectedBatch ? selectedBatch.replace("-", " Batch ") : "Select Batch Below"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 font-semibold">Duration:</span>
                <span className="font-bold text-brand-dark-text">{trek.days} Days / {trek.nights} Nights</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 font-semibold">Start Location:</span>
                <span className="font-bold text-brand-dark-text">{trek.startLocation || "TBD"}</span>
              </div>
            </div>

            {/* CTA action */}
            <button
              onClick={handleBookNow}
              className="w-full bg-brand-forest hover:bg-brand-forest-light text-white py-4 rounded-full font-bold shadow-lg transition flex items-center justify-center gap-2 hover:-translate-y-0.5 transform duration-200"
            >
              <span>{selectedBatch ? "Book Expedition Slot" : "Choose Departure Dates"}</span>
            </button>

            {/* Safety callouts */}
            <div className="p-3 bg-brand-warm-bg rounded-xl border border-gray-150 text-[10px] text-gray-550 leading-relaxed space-y-1 font-semibold">
              <div className="flex items-center gap-1.5 font-bold text-brand-forest">
                <ShieldCheck className="w-3.5 h-3.5 text-brand-dusk-orange shrink-0" />
                <span>TripMySoul Safety Guarantee</span>
              </div>
              <p>Trek leaders carry Oxygen tanks, hyperbaric safety chambers, and satellite track systems.</p>
            </div>
          </div>
        </div>

      </div>

      {/* Booked Confirmation success modal */}
      {isBooked && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
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
              <h3 className="text-xl font-bold text-brand-dark-text">Booking Query Raised!</h3>
              <p className="text-xs text-gray-550 leading-relaxed">
                Thank you! Your booking query for <strong>{trek.name}</strong> ({selectedBatch}) has been received. Our expedition leader will reach out on WhatsApp to coordinate medical clearance and billing terms.
              </p>
            </div>

            <button
              onClick={() => setIsBooked(false)}
              className="w-full bg-brand-forest hover:bg-brand-forest-light text-white py-3 rounded-full font-bold shadow-md transition"
            >
              Understand
            </button>
          </div>
        </div>
      )}

      {/* Sticky Bottom Notification Bar */}
      {showNotifyBar && (
        <div className="fixed bottom-4 right-4 z-40 bg-[#0B2545]/95 backdrop-blur-md border border-white/10 text-white rounded-2xl p-3 shadow-2xl flex items-center gap-3.5 max-w-sm animate-fade-in font-sans">
          <div className="w-8 h-8 rounded-full bg-brand-dusk-orange/10 border border-brand-dusk-orange/20 text-brand-dusk-orange flex items-center justify-center shrink-0">
            <Bell className="w-4 h-4" />
          </div>
          
          {notifySuccess ? (
            <span className="text-[10px] font-bold text-green-400">
              Notification registered! We will email you future dates.
            </span>
          ) : (
            <div className="space-y-1.5 flex-grow pr-4">
              <span className="text-[10px] font-extrabold uppercase tracking-wide text-brand-dusk-orange block leading-none">
                Notify Me of Future Dates
              </span>
              <div className="flex items-center gap-1.5">
                <input
                  type="email"
                  placeholder="your-email@mail.com"
                  value={notifyEmail}
                  onChange={(e) => setNotifyEmail(e.target.value)}
                  className="bg-white/5 border border-white/10 text-[9px] px-2 py-1 rounded focus:outline-none w-28 text-white"
                />
                <button
                  onClick={() => {
                    if (notifyEmail.trim()) {
                      setNotifySuccess(true);
                      setTimeout(() => {
                        setNotifySuccess(false);
                        setNotifyEmail("");
                        setShowNotifyBar(false);
                      }, 2500);
                    }
                  }}
                  className="bg-brand-dusk-orange hover:bg-brand-dusk-orange/90 text-white text-[9px] font-bold px-2 py-1 rounded transition"
                >
                  Join
                </button>
              </div>
            </div>
          )}

          <button
            onClick={() => setShowNotifyBar(false)}
            className="absolute top-2 right-2 text-gray-400 hover:text-white transition"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}

/* ==========================================
   SUB-COMPONENT: ItineraryViewer
   Feeds all three interactive views (Quick, Detailed, Trek Graph)
   ========================================== */
interface ItineraryViewerProps {
  itinerary: ItineraryDay[];
}

function ItineraryViewer({ itinerary }: ItineraryViewerProps) {
  const [viewMode, setViewMode] = useState<"quick" | "detailed" | "graph">("quick");
  const [expandedDays, setExpandedDays] = useState<Record<number, boolean>>({ 1: true });
  const [hoveredPoint, setHoveredPoint] = useState<any>(null);

  // Normalize simple to detailed data on-the-fly to handle all treks seamlessly
  const normalizedItinerary = useMemo(() => {
    return itinerary.map((item: any) => {
      const simpleDesc = item.description || "TBD";
      const altitudeList = item.altitudePoints || [
        { location: "Start camp", m: 600, ft: 2000 },
        { location: "End camp", m: 600 + item.day * 400, ft: 2000 + item.day * 1500 }
      ];
      const altGainVal = item.altitudeGain || { m: 400, ft: 1500 };
      
      return {
        day: item.day,
        title: item.title,
        altitudePoints: altitudeList,
        altitudeGain: altGainVal,
        driveDistance: item.driveDistance || (item.day === 1 || item.day === 5 ? "198 km" : undefined),
        drivingTime: item.drivingTime || (item.day === 1 || item.day === 5 ? "8-9 Hours" : undefined),
        trekDistance: item.trekDistance || (item.day > 1 && item.day < 5 ? "5-6 km" : undefined),
        trekDuration: item.trekDuration || (item.day > 1 && item.day < 5 ? "4-5 Hours" : undefined),
        detailedDescription: item.detailedDescription || simpleDesc,
        meals: item.meals || (item.day === 5 ? "Breakfast, Lunch" : "Breakfast, Lunch, Dinner"),
        stayType: item.stayType || (item.day === 1 || item.day === 5 ? "Hotel / Homestay" : "Alpine Campsite tents")
      };
    });
  }, [itinerary]);

  const toggleDayExpanded = (day: number) => {
    setExpandedDays((prev) => ({
      ...prev,
      [day]: !prev[day]
    }));
  };

  // Compile coordinates data for custom SVG graph
  const graphData = useMemo(() => {
    if (normalizedItinerary.length === 0) return [];
    return normalizedItinerary.map((day) => {
      const maxAlt = Math.max(...day.altitudePoints.map((ap: any) => ap.ft));
      const endPoint = day.altitudePoints[day.altitudePoints.length - 1];
      return {
        day: day.day,
        title: day.title,
        altitude: maxAlt,
        location: endPoint?.location || "Camp",
        gain: day.altitudeGain?.ft || 0
      };
    });
  }, [normalizedItinerary]);

  // SVG Dimension Math & Path Generation
  const { pathD, areaD, svgPoints } = useMemo(() => {
    if (graphData.length === 0) return { pathD: "", areaD: "", svgPoints: [] };
    const width = 440;
    const height = 125;
    const paddingX = 35;
    const paddingY = 20;

    const alts = graphData.map(d => d.altitude);
    const maxAlt = Math.max(...alts, 12500);
    const minAlt = Math.min(...alts, 2000);
    const altRange = maxAlt - minAlt || 1000;

    const points = graphData.map((d, idx) => {
      const x = paddingX + (idx / (graphData.length - 1)) * (width - 2 * paddingX);
      const y = height - paddingY - ((d.altitude - minAlt) / altRange) * (height - 2 * paddingY);
      return { x, y, ...d };
    });

    const pathStr = points.map((p, idx) => `${idx === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
    const areaStr = `${pathStr} L ${points[points.length - 1].x} ${height - paddingY} L ${points[0].x} ${height - paddingY} Z`;

    return { pathD: pathStr, areaD: areaStr, svgPoints: points };
  }, [graphData]);

  const maxTrekAltitude = useMemo(() => {
    if (graphData.length === 0) return 0;
    return Math.max(...graphData.map(d => d.altitude));
  }, [graphData]);

  const totalTrekDistance = useMemo(() => {
    let tot = 0;
    normalizedItinerary.forEach((d) => {
      if (d.trekDistance) {
        const val = parseFloat(d.trekDistance.replace(/[^\d.]/g, ""));
        if (!isNaN(val)) tot += val;
      }
    });
    return tot || 28;
  }, [normalizedItinerary]);

  const totalAltitudeGain = useMemo(() => {
    let tot = 0;
    normalizedItinerary.forEach((d) => {
      if (d.altitudeGain) {
        tot += d.altitudeGain.ft;
      }
    });
    return tot || 5500;
  }, [normalizedItinerary]);

  return (
    <div className="space-y-6">
      {/* 1. View Mode Toggles */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-150 pb-4 gap-4">
        <h3 className="text-base font-extrabold text-brand-dark-text font-serif">Expedition Schedule</h3>
        
        <div className="flex bg-gray-100 p-1 rounded-full border border-gray-250/50 text-[10px] font-bold">
          <button
            onClick={() => setViewMode("quick")}
            className={`px-4.5 py-1.5 rounded-full uppercase transition-all ${
              viewMode === "quick" ? "bg-brand-forest text-white shadow-xs" : "text-gray-500 hover:text-brand-forest"
            }`}
          >
            Quick
          </button>
          <button
            onClick={() => setViewMode("detailed")}
            className={`px-4.5 py-1.5 rounded-full uppercase transition-all ${
              viewMode === "detailed" ? "bg-brand-forest text-white shadow-xs" : "text-gray-500 hover:text-brand-forest"
            }`}
          >
            Detailed
          </button>
          <button
            onClick={() => setViewMode("graph")}
            className={`px-4.5 py-1.5 rounded-full uppercase transition-all ${
              viewMode === "graph" ? "bg-brand-forest text-white shadow-xs" : "text-gray-500 hover:text-brand-forest"
            }`}
          >
            Trek Graph
          </button>
        </div>
      </div>

      {/* 2. Quick View List */}
      {viewMode === "quick" && (
        <div className="relative pl-6 border-l-2 border-brand-forest/20 space-y-8 py-2">
          {normalizedItinerary.map((day) => (
            <div key={day.day} className="relative space-y-1">
              {/* Day badge circular label */}
              <div className="absolute -left-[37px] top-0 w-8 h-8 rounded-full bg-brand-forest border-4 border-white flex items-center justify-center text-white text-[9px] font-black uppercase shadow-xs">
                D{day.day}
              </div>

              <div className="pl-2">
                <span className="font-extrabold text-sm text-brand-dark-text block leading-snug">
                  {day.title}
                </span>
                
                {/* Fact list bullets */}
                <ul className="mt-2 space-y-1 text-xs text-gray-550 list-disc pl-4 font-sans leading-relaxed">
                  {day.altitudePoints && day.altitudePoints.length > 0 && (
                    <li>
                      <span className="font-bold text-gray-400">Altitudes:</span>{" "}
                      {day.altitudePoints.map((ap: any) => `${ap.location} (${ap.ft.toLocaleString()} ft)`).join(" ➡️ ")}
                    </li>
                  )}
                  {day.altitudeGain && (
                    <li>
                      <span className="font-bold text-gray-400">Altitude Gain:</span> +{day.altitudeGain.ft.toLocaleString()} ft ({day.altitudeGain.m} m)
                    </li>
                  )}
                  {day.driveDistance && (
                    <li>
                      <span className="font-bold text-gray-400">Drive:</span> {day.driveDistance} ({day.drivingTime || "TBD"})
                    </li>
                  )}
                  {day.trekDistance && (
                    <li>
                      <span className="font-bold text-gray-400">Trek:</span> {day.trekDistance} ({day.trekDuration || "TBD"})
                    </li>
                  )}
                  <li>
                    <span className="font-bold text-gray-400">Stay & Meals:</span> {day.stayType} • {day.meals}
                  </li>
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 3. Detailed View Accordion */}
      {viewMode === "detailed" && (
        <div className="space-y-3">
          {normalizedItinerary.map((day) => {
            const isOpen = !!expandedDays[day.day];
            return (
              <div key={day.day} className="border border-gray-150 rounded-2xl overflow-hidden bg-white">
                <button
                  onClick={() => toggleDayExpanded(day.day)}
                  className="w-full flex items-center justify-between p-4 bg-brand-warm-bg text-left hover:bg-gray-100 transition"
                >
                  <span className="font-extrabold text-xs text-brand-forest uppercase tracking-wider">
                    Day {day.day}: {day.title}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-brand-forest transition-transform ${isOpen ? "rotate-180" : ""}`} />
                </button>
                {isOpen && (
                  <div className="p-5 text-xs text-gray-650 bg-white border-t border-gray-150 space-y-4 leading-relaxed">
                    <p className="font-medium text-gray-700">{day.detailedDescription}</p>
                    
                    {/* Day parameters summary footer */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3 border-t border-gray-100 text-[10px] font-sans font-semibold">
                      <div>
                        <span className="text-gray-400 uppercase block tracking-wider mb-1">Campsite Stay</span>
                        <span className="font-bold text-brand-dark-text block">{day.stayType}</span>
                      </div>
                      <div>
                        <span className="text-gray-400 uppercase block tracking-wider mb-1">Meals Served</span>
                        <span className="font-bold text-brand-dark-text block">{day.meals}</span>
                      </div>
                      <div>
                        <span className="text-gray-400 uppercase block tracking-wider mb-1">Trek / Drive</span>
                        <span className="font-bold text-brand-dark-text block">
                          {day.trekDistance ? `Trek ${day.trekDistance} (${day.trekDuration})` : `Drive ${day.driveDistance} (${day.drivingTime})`}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* 4. Trek Graph View */}
      {viewMode === "graph" && (
        <div className="space-y-6">
          <div className="bg-brand-warm-bg rounded-2xl p-4 border border-gray-150 relative">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-brand-forest block mb-4 text-center">
              Altitude Profile (Feet) vs Expedition Days
            </span>
            
            {/* Custom SVG line chart */}
            <div className="relative w-full overflow-x-auto no-scrollbar">
              <svg className="mx-auto w-[460px] h-[150px] overflow-visible" viewBox="0 0 460 150">
                <defs>
                  {/* Blue Area Gradient */}
                  <linearGradient id="area-grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#1F7A8C" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#1F7A8C" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Horizontal Dotted grid lines */}
                {[3000, 6000, 9000, 12000].map((level) => {
                  const minY = 500;
                  const maxY = 13500;
                  const y = 150 - 20 - ((level - minY) / (maxY - minY)) * 110;
                  return (
                    <g key={level}>
                      <line
                        x1="35"
                        y1={y}
                        x2="425"
                        y2={y}
                        stroke="#e5e7eb"
                        strokeDasharray="3,3"
                        strokeWidth={1}
                      />
                      <text
                        x="30"
                        y={y + 3}
                        fill="#9ca3af"
                        fontSize="8"
                        textAnchor="end"
                        fontWeight="semibold"
                      >
                        {level / 1000}k
                      </text>
                    </g>
                  );
                })}

                {/* Shaded Area fill */}
                {areaD && <path d={areaD} fill="url(#area-grad)" />}

                {/* Solid Line path */}
                {pathD && (
                  <path
                    d={pathD}
                    fill="none"
                    stroke="#1F7A8C"
                    strokeWidth={2.5}
                    strokeLinecap="round"
                  />
                )}

                {/* Plot points */}
                {svgPoints.map((p: any, idx: number) => (
                  <g key={idx}>
                    <circle
                      cx={p.x}
                      cy={p.y}
                      r="4.5"
                      className="fill-white stroke-brand-forest stroke-2.5 cursor-pointer transition-all hover:r-6"
                      onMouseEnter={() => setHoveredPoint(p)}
                      onMouseLeave={() => setHoveredPoint(null)}
                    />
                    {/* Day X-Axis labels */}
                    <text
                      x={p.x}
                      y="145"
                      fill="#6b7280"
                      fontSize="8"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      D{p.day}
                    </text>
                  </g>
                ))}
              </svg>

              {/* Hover Tooltip Overlay */}
              {hoveredPoint && (
                <div
                  className="absolute bg-brand-forest text-white p-2.5 rounded-xl shadow-lg font-sans text-[10px] space-y-0.5 border border-white/10 z-10"
                  style={{
                    left: `${(hoveredPoint.x / 460) * 100}%`,
                    top: `${(hoveredPoint.y / 150) * 60}%`,
                    transform: "translate(-50%, -120%)",
                  }}
                >
                  <span className="font-extrabold uppercase block text-brand-dusk-orange leading-none mb-1">
                    Day {hoveredPoint.day}: {hoveredPoint.location}
                  </span>
                  <span className="block leading-none">
                    Altitude: <strong>{hoveredPoint.altitude.toLocaleString()} ft</strong>
                  </span>
                  {hoveredPoint.gain > 0 && (
                    <span className="block text-gray-300 leading-none">
                      Gain: +{hoveredPoint.gain.toLocaleString()} ft
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Graph summary statistics */}
          <div className="grid grid-cols-3 gap-4 text-center text-xs font-semibold">
            <div className="p-3 bg-white border border-gray-150 rounded-2xl shadow-xs space-y-1">
              <span className="text-[10px] text-gray-400 uppercase block tracking-wider">Highest point</span>
              <span className="font-extrabold text-brand-dark-text block">{maxTrekAltitude.toLocaleString()} Ft</span>
            </div>
            <div className="p-3 bg-white border border-gray-150 rounded-2xl shadow-xs space-y-1">
              <span className="text-[10px] text-gray-400 uppercase block tracking-wider">Alt Gain</span>
              <span className="font-extrabold text-brand-dark-text block">+{totalAltitudeGain.toLocaleString()} Ft</span>
            </div>
            <div className="p-3 bg-white border border-gray-150 rounded-2xl shadow-xs space-y-1">
              <span className="text-[10px] text-gray-400 uppercase block tracking-wider">Distance</span>
              <span className="font-extrabold text-brand-dark-text block">{totalTrekDistance} Km</span>
            </div>
          </div>
        </div>
      )}

      {/* Floating View Departure Dates button */}
      <div className="flex justify-center pt-2">
        <button
          onClick={() => {
            const el = document.getElementById("batch-picker");
            if (el) el.scrollIntoView({ behavior: "smooth" });
          }}
          className="bg-brand-dusk hover:bg-brand-dusk-orange text-white font-extrabold px-6 py-3 rounded-full text-xs shadow-md transition"
        >
          View Departure Dates
        </button>
      </div>
    </div>
  );
}

// Simple local SVG helper for video play icon
function PlayVideoIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function generateMockItinerary(daysCount: number) {
  const mockDays = [];
  for (let i = 1; i <= daysCount; i++) {
    if (i === 1) {
      mockDays.push({
        day: 1,
        title: "Arrival at Base Camp & Briefing",
        description: "Arrive at the designated base camp town. Meet your guides, complete registration, and undergo an altitude safety briefing and equipment verification."
      });
    } else if (i === daysCount) {
      mockDays.push({
        day: i,
        title: "Descent & Final Departure",
        description: "Trek back down to the road head and board the vehicle for your return journey to the railway station or airport. Tour ends with beautiful mountain memories."
      });
    } else if (i === daysCount - 1) {
      mockDays.push({
        day: i,
        title: "Trek back to Base camp",
        description: "Descend through pine forests and mountain trails to the base camp village. Share stories from the summit push over a warm celebratory dinner."
      });
    } else {
      mockDays.push({
        day: i,
        title: `Trek to Intermediate camp ${i - 1}`,
        description: `Climb through spectacular meadows and mountain passes to camp ${i - 1}. Enjoy panoramic views of surrounding snow-capped summits and glacier moraines.`
      });
    }
  }
  return mockDays;
}

/* ==========================================
   SUB-COMPONENT: TrekQuickItinerary
   Renders Indiahikes-style Quick Itinerary with Illustrated Map Modal
   ========================================== */
interface TrekQuickItineraryProps {
  trekName: string;
  itinerary: any[];
}

function TrekQuickItinerary({ trekName, itinerary }: TrekQuickItineraryProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);

  // Normalize simple to detailed data on-the-fly
  const normalizedItinerary = useMemo(() => {
    return itinerary.map((item: any) => {
      const isBuran = trekName.toLowerCase().includes("buran");
      const basecampText = isBuran ? "Janglik (9,415 ft)" : "Sankri (6,400 ft)";
      const pickupPointText = isBuran ? "Shimla Railway Station" : "Dehradun Railway Station";
      
      return {
        day: item.day,
        title: item.title,
        driveDistance: item.driveDistance || (item.day === 1 || item.day === 5 || item.day === 7 ? "150 km" : undefined),
        drivingTime: item.drivingTime || (item.day === 1 || item.day === 5 || item.day === 7 ? "7-8 Hours" : undefined),
        pickupPoint: item.day === 1 ? pickupPointText : undefined,
        pickupTime: item.day === 1 ? "9:30 AM" : undefined,
        basecamp: item.day === 1 ? basecampText : undefined,
        transportDetails: item.day === 1 ? `Transport organised from ${pickupPointText} at 9:30 AM. Cost per vehicle shared among trekkers.` : undefined
      };
    });
  }, [itinerary, trekName]);

  useEffect(() => {
    if (isMapModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMapModalOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsMapModalOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="space-y-4 font-sans">
      {/* 1. Header with Collapse Toggle */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="w-full flex items-center justify-between text-left focus:outline-none"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-brand-forest/5 text-brand-forest rounded-full flex items-center justify-center shrink-0">
            <ClipboardList className="w-5 h-5 text-brand-dusk-orange" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-brand-dark-text font-serif leading-none">Quick Itinerary</h2>
            <p className="text-[10px] text-gray-400 mt-1">Get your trek route and day-by-day plan at a glance.</p>
          </div>
        </div>
        <ChevronDown className={`w-5 h-5 text-brand-forest transition-transform ${isCollapsed ? "" : "rotate-180"}`} />
      </button>

      {/* Horizontal Divider */}
      <div className="border-b border-gray-100" />

      {/* Collapsible Content */}
      {!isCollapsed && (
        <div className="space-y-6 pt-2">
          {/* 2. Inline Route Map Card Container */}
          <div className="relative w-full aspect-[16/9] sm:aspect-[21/9] bg-brand-warm-bg border border-gray-150 rounded-2xl overflow-hidden shadow-xs">
            {/* Illustrated Route Map */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=1200&q=85"
              alt={`${trekName} Illustrated Route Map`}
              className="w-full h-full object-cover opacity-85"
            />

            {/* Compass Indicator in Top-Left */}
            <div className="absolute top-3 left-3 bg-[#0B2545]/90 backdrop-blur-xs text-white px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider flex items-center gap-1.5 border border-white/10 shadow-md">
              <Compass className="w-3.5 h-3.5 text-amber-500 animate-spin-slow" />
              <span>{trekName} Route Map</span>
            </div>

            {/* View Fullscreen Action in Top-Right */}
            <button
              onClick={() => setIsMapModalOpen(true)}
              className="absolute top-3 right-3 p-2 bg-[#0B2545]/90 hover:bg-brand-dusk-orange text-white rounded-full transition border border-white/10 shadow-md focus:outline-none flex items-center justify-center"
              title="View Fullscreen"
            >
              <Maximize2 className="w-4 h-4 text-white" />
            </button>

            {/* Map Coming Soon Overlay for other treks */}
            {!trekName.toLowerCase().includes("buran") && !trekName.toLowerCase().includes("kedar") && (
              <div className="absolute inset-0 bg-[#0B2545]/40 backdrop-blur-xs flex items-center justify-center p-4">
                <span className="bg-brand-dusk-orange text-white text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full border border-white/10 shadow-lg animate-pulse">
                  Illustrated Map Coming Soon
                </span>
              </div>
            )}
          </div>

          {/* 3. Day-by-Day Itinerary List */}
          <div className="space-y-6 pl-1.5 border-l-2 border-brand-forest/10 ml-2">
            {normalizedItinerary.map((day) => (
              <div key={day.day} className="relative pl-6 space-y-1.5">
                {/* day bullet point node */}
                <div className="absolute -left-[7px] top-1.5 w-3.5 h-3.5 rounded-full bg-brand-forest border-4 border-white shadow-xs" />

                <div className="space-y-0.5 leading-tight">
                  <span className="text-xs font-black text-brand-dusk-orange uppercase tracking-wider block">
                    DAY {day.day}
                  </span>
                  <span className="text-sm font-extrabold text-brand-dark-text block">
                    {day.title}
                  </span>
                </div>

                {/* Supporting details */}
                {(day.driveDistance || day.pickupPoint) && (
                  <div className="bg-brand-warm-bg/50 border border-gray-150/40 rounded-xl p-3 space-y-2 text-[10px] text-gray-550 font-sans max-w-xl">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-medium">
                      {day.driveDistance && (
                        <div>
                          <span className="text-gray-400 block uppercase text-[8px] tracking-wider font-extrabold">Drive Distance</span>
                          <span className="font-bold text-brand-dark-text">{day.driveDistance} ({day.drivingTime || "TBD"})</span>
                        </div>
                      )}
                      {day.pickupPoint && (
                        <div>
                          <span className="text-gray-400 block uppercase text-[8px] tracking-wider font-extrabold">Pickup Details</span>
                          <span className="font-bold text-brand-dark-text">
                            {day.pickupTime} at <a href="#" onClick={(e) => { e.preventDefault(); alert("Partner Homestay coordinates: Rohru/Dehradun Hub"); }} className="text-brand-dusk underline hover:text-brand-dusk-orange font-black">{day.pickupPoint}</a>
                          </span>
                        </div>
                      )}
                    </div>
                    {day.transportDetails && (
                      <p className="text-[9px] italic text-gray-400 border-t border-gray-150 pt-2 font-medium">
                        * Note: {day.transportDetails}
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* illustrated route map modal */}
      {isMapModalOpen && (
        <div
          onClick={() => setIsMapModalOpen(false)}
          className="fixed inset-0 bg-black/80 backdrop-blur-xs z-50 flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#031B33] border border-white/10 rounded-3xl overflow-hidden shadow-2xl max-w-3xl w-full relative flex flex-col items-center animate-fade-in"
          >
            {/* Compass in top-right */}
            <div className="absolute top-4 left-4 flex items-center gap-1.5 text-white/50 text-[9px] font-black tracking-wider uppercase font-sans">
              <Compass className="w-4 h-4 animate-spin-slow text-amber-500" />
              <span>North</span>
            </div>

            {/* close button */}
            <button
              onClick={() => setIsMapModalOpen(false)}
              className="absolute top-4 right-4 p-1 rounded-full bg-white/10 hover:bg-white/20 text-white transition z-10"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Map Header */}
            <div className="pt-8 pb-4 text-center">
              <span className="text-[9px] text-amber-500 font-black uppercase tracking-widest block font-sans">
                illustrated topographical route map
              </span>
              <h3 className="text-md font-extrabold text-white font-serif uppercase mt-1 tracking-wider">
                TRIPMYSOUL {trekName.toUpperCase()} TREK MAP
              </h3>
            </div>

            {/* Illustrated Map Image placeholder */}
            <div className="w-full aspect-[4/3] bg-[#021020] relative flex items-center justify-center px-6">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=1000&q=85"
                alt={`${trekName} Illustrated Map`}
                className="w-full h-full object-contain opacity-85"
              />
            </div>

            {/* Caption bar */}
            <div className="w-full bg-[#021020] border-t border-white/5 py-3 text-center text-[10px] text-gray-400 font-sans font-bold uppercase tracking-wider">
              A route map of the {trekName} trek
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ==========================================
   SUB-COMPONENT: TrekCompleteInformation
   Renders detailed, structured Indiahikes-style accordions
   ========================================== */
interface TrekCompleteInformationProps {
  trekName: string;
}

function TrekCompleteInformation({ trekName }: TrekCompleteInformationProps) {
  const [openSection, setOpenSection] = useState<string | null>(null);

  const toggleSection = (id: string) => {
    setOpenSection(openSection === id ? null : id);
  };

  const isBuran = trekName.toLowerCase().includes("buran");

  const sections = [
    {
      id: "safety",
      title: "🛡️ Safety Guidelines & Emergency Exit Plans",
      content: isBuran ? (
        <div className="space-y-3 font-sans">
          <p>
            Buran Ghati is a high-altitude pass climbing up to <strong>15,000 ft</strong>. Acclimatization is highly critical. We include a mandatory acclimatization day at Litham (Day 4) to hike to Chandranahan Lake (13,900 ft).
          </p>
          <div className="bg-brand-warm-bg/50 border border-gray-150/40 rounded-xl p-3.5 space-y-2 text-xs text-gray-500">
            <span className="font-extrabold text-brand-forest uppercase block text-[9px] tracking-wider">Critical Exit Route:</span>
            <p>
              In case of evacuation, the primary exit route is descending from Litham back to Janglik basecamp, from where emergency vehicles can reach Rohru. On the other side of the pass, exit is via Barua village towards Shimla.
            </p>
          </div>
          <p>
            Our guides carry medical oxygen cylinders, Pulse Oximeters to monitor SpO2 twice daily (target &gt; 85%), and a mountain stretch bag at all high camps (Litham, Dhunda, Munirang).
          </p>
        </div>
      ) : (
        <div className="space-y-3 font-sans">
          <p>
            High altitude illness (AMS) is possible above 8,000 ft. We plan gradual elevation gains across all camps. Guide teams track SpO2 levels daily.
          </p>
          <p>
            Primary emergency exits are trails leading back to the base camp town (Sankri/Lohajung) where ambulance support coordinates with local medical centers.
          </p>
        </div>
      )
    },
    {
      id: "fitness",
      title: "🏃‍♂️ Fitness Preparation & Cardio Goals",
      content: isBuran ? (
        <div className="space-y-3 font-sans">
          <p>
            Buran Ghati is graded as <strong>Moderate-Difficult</strong>. You will walk on steep slopes of snow/boulders for up to 8 hours on Pass crossing day.
          </p>
          <div className="bg-brand-warm-bg/50 border border-gray-150/40 rounded-xl p-3.5 space-y-2 text-xs text-gray-555">
            <span className="font-extrabold text-brand-forest uppercase block text-[9px] tracking-wider">Recommended training:</span>
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
            Graded as <strong>Moderate</strong>. A basic aerobic fitness level is required.
          </p>
          <p>
            Start running 4 km in 30 minutes at least 3 weeks prior to departure. Stair climbing and lunges help build calves and joints stamina.
          </p>
        </div>
      )
    },
    {
      id: "campsites",
      title: "⛺ Campsite Profiles & Eco Guidelines",
      content: isBuran ? (
        <div className="space-y-2.5 font-sans">
          <p>
            Our campsites (Janglik, Dayara, Litham, Dhunda, Munirang) are established on licensed forest grounds.
          </p>
          <ul className="list-disc pl-4 space-y-1.5 text-xs text-gray-555 leading-relaxed font-medium">
            <li><strong>Dayara Meadows:</strong> Vast rolling green meadows facing the Gunas Pass range. Eco-dry toilet tents set up 100 meters away from water sources.</li>
            <li><strong>Litham Confluence:</strong> Placed at the beautiful junction of Pabbar River and Chandranahan stream. Strict restriction on bathing or washing dishes in the river.</li>
            <li><strong>Dhunda Base:</strong> A cold, windy high basecamp below the pass. Double layer windproof dome tents are mandatory.</li>
          </ul>
        </div>
      ) : (
        <div className="space-y-2.5 font-sans">
          <p>
            All campsites feature eco-dry toilet systems, triple-layered sleeping mats, and windproof dome tents. We collect and carry all waste plastics down to baseline municipalities.
          </p>
        </div>
      )
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
            <li><strong>Day 1 assembly:</strong> Meet at 6:30 AM outside Shimla Railway Station. Vehicles depart by 7:00 AM.</li>
            <li><strong>Return journey:</strong> Reach Shimla on Day 7 by 8:30 PM. Book return train/bus tickets post 9:30 PM.</li>
            <li><strong>Cab arrangements:</strong> Shared Tempo Travelers/Boleros coordinated by TripMySoul partners. Cost of approx. ₹9,000 per vehicle is divided equally among passengers.</li>
          </ul>
        </div>
      ) : (
        <div className="space-y-3 font-sans">
          <p>
            Assembly point is usually Dehradun or Rishikesh Railway Station. Shared cabs coordinate departures on Day 1 morning, returning on the final day by evening.
          </p>
        </div>
      )
    },
    {
      id: "permits",
      title: "📋 Mandatory Permits & Document Checklists",
      content: (
        <div className="space-y-3 font-sans">
          <p>
            Forest department clearances require all documents to be uploaded via the <strong>Traveler Dashboard</strong> at least 15 days before batch starts:
          </p>
          <div className="bg-brand-warm-bg/50 border border-gray-150/40 rounded-xl p-3.5 space-y-2 text-xs text-gray-555 font-sans">
            <ul className="list-decimal pl-4 space-y-1.5 font-sans font-medium text-[11px]">
              <li>Photocopy of Government Photo ID Card (Aadhaar, Passport, or Voter ID).</li>
              <li>MBBS physician-signed Medical Fitness Form (download template from your dashboard).</li>
              <li>Signed Voluntary Indemnity Form.</li>
            </ul>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-4 font-sans">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-brand-forest/5 text-brand-forest rounded-full flex items-center justify-center shrink-0">
          <Compass className="w-5 h-5 text-brand-dusk-orange" />
        </div>
        <div>
          <h2 className="text-lg font-extrabold text-brand-dark-text font-serif leading-none">Complete Trek Information</h2>
          <p className="text-[10px] text-gray-400 mt-1">Deep-dive details regarding safety checklists, routes, permits, and fitness rules.</p>
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
