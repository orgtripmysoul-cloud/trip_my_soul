"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Compass, Calendar, AlertTriangle, FileText, Upload, ShieldCheck, CheckCircle, ArrowRight } from "lucide-react";

export default function DashboardPage() {
  const [medUploaded, setMedUploaded] = useState(false);
  const [idUploaded, setIdUploaded] = useState(false);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-24 sm:pt-16 sm:pb-32 space-y-10">
      {/* Welcome Banner */}
      <div className="bg-brand-forest text-white rounded-3xl p-6 md:p-8 shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-forest-light/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="space-y-2 relative z-10">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-dusk-orange block">
            Explorer Profile
          </span>
          <h1 className="text-3xl font-extrabold font-serif">Welcome Back, Rohit!</h1>
          <p className="text-xs text-gray-200">Member since July 2025 | Loyalty Tier: Alpine Sentinel</p>
        </div>

        <div className="flex gap-4 shrink-0 relative z-10 text-center">
          <div className="bg-white/10 px-4 py-2.5 rounded-xl border border-white/5">
            <span className="text-xl font-bold block">1</span>
            <span className="text-[10px] text-gray-300 uppercase tracking-wider font-semibold">Trek Completed</span>
          </div>
          <div className="bg-white/10 px-4 py-2.5 rounded-xl border border-white/5">
            <span className="text-xl font-bold block">1</span>
            <span className="text-[10px] text-gray-300 uppercase tracking-wider font-semibold">Upcoming</span>
          </div>
        </div>
      </div>

      {/* Main Sections Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Columns (Upcoming and Past Trips) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Upcoming Trip Card */}
          <div className="bg-white border border-gray-100 rounded-3xl p-6 md:p-8 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <h2 className="text-lg font-bold text-brand-dark-text font-serif">Upcoming Expeditions</h2>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-brand-dusk bg-brand-dusk/5 border border-brand-dusk/15 px-3 py-1 rounded-full flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5 text-brand-dusk" />
                <span>Action Required</span>
              </span>
            </div>

            <div className="flex flex-col md:flex-row gap-6">
              {/* Image banner */}
              <div className="w-full md:w-48 aspect-video md:aspect-[4/3] rounded-2xl overflow-hidden bg-gray-100 shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=300&q=80"
                  alt="Kedarkantha Trek"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Description */}
              <div className="space-y-3 flex-grow flex flex-col justify-between">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Uttarakhand</span>
                  <h3 className="text-base font-bold text-brand-dark-text">Kedarkantha Winter Trek</h3>
                  <div className="flex items-center gap-1.5 text-xs text-gray-500 font-semibold pt-1">
                    <Calendar className="w-4 h-4 text-brand-dusk-orange" />
                    <span>10 Dec - 15 Dec 2026 (5 Days)</span>
                  </div>
                </div>

                <div className="p-3 bg-amber-500/5 border border-amber-500/10 rounded-xl text-xs flex items-start gap-2.5 text-amber-800">
                  <ShieldCheck className="w-4 h-4 text-brand-dusk-orange shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block text-[10px] uppercase">Safety Review Pending</span>
                    <span>Please upload your Medical Self-Declaration form below to clear safety clearances.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Past Expeditions */}
          <div className="bg-white border border-gray-100 rounded-3xl p-6 md:p-8 shadow-xs space-y-6">
            <h2 className="text-lg font-bold text-brand-dark-text font-serif border-b border-gray-100 pb-4">
              Past Adventures
            </h2>
            
            <div className="flex items-center justify-between py-2.5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-brand-forest/5 flex items-center justify-center text-brand-forest shrink-0">
                  <Compass className="w-6 h-6 text-brand-forest" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-brand-dark-text">Valley Of Flowers Trek</h3>
                  <span className="text-[10px] text-gray-400 font-semibold">July 2025 | 6 Days</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-green-700 bg-green-500/5 border border-green-500/15 px-3 py-1 rounded-full">
                  Completed
                </span>
                <span className="text-[10px] text-gray-400 block mt-1">Order #TMS-81204</span>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column (Upload Checklist & Rental Gear) */}
        <div className="w-full space-y-8">
          
          {/* Document Upload Card */}
          <div className="bg-white border border-gray-100 rounded-3xl p-6 md:p-8 shadow-xs space-y-6">
            <h2 className="text-lg font-bold text-brand-dark-text font-serif border-b border-gray-100 pb-4">
              Safety Documents
            </h2>

            <div className="space-y-4">
              {/* Medical certificate */}
              <div className="p-4 bg-brand-warm-bg rounded-2xl border border-gray-150 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-brand-dusk-orange shrink-0" />
                  <div>
                    <span className="font-bold text-xs text-brand-dark-text block">Medical Declaration</span>
                    <span className="text-[9px] text-gray-500">Required before batch starts</span>
                  </div>
                </div>
                
                {medUploaded ? (
                  <CheckCircle className="w-5 h-5 text-green-600 shrink-0" />
                ) : (
                  <button
                    onClick={() => setMedUploaded(true)}
                    className="p-2 rounded-lg bg-brand-forest/5 hover:bg-brand-forest/10 text-brand-forest transition shrink-0"
                    aria-label="Upload document"
                  >
                    <Upload className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Gov ID Card */}
              <div className="p-4 bg-brand-warm-bg rounded-2xl border border-gray-150 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-brand-dusk-orange shrink-0" />
                  <div>
                    <span className="font-bold text-xs text-brand-dark-text block">Government ID Card</span>
                    <span className="text-[9px] text-gray-500">Aadhaar, Voter ID, or Passport</span>
                  </div>
                </div>
                
                {idUploaded ? (
                  <CheckCircle className="w-5 h-5 text-green-600 shrink-0" />
                ) : (
                  <button
                    onClick={() => setIdUploaded(true)}
                    className="p-2 rounded-lg bg-brand-forest/5 hover:bg-brand-forest/10 text-brand-forest transition shrink-0"
                    aria-label="Upload ID card"
                  >
                    <Upload className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Recommended Gear Rental block */}
          <div className="glass-card rounded-3xl p-6 border border-white/30 shadow-md space-y-4">
            <h3 className="text-base font-bold text-brand-dark-text font-serif">Gear Rental Store</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Don&apos;t buy expensive gear you may only use once. Rent high-quality trekking jackets, walking poles, and sleeping gear from our shop at Sankri basecamp.
            </p>
            <Link
              href="/cabs"
              className="inline-flex items-center gap-1 text-xs font-bold text-brand-forest hover:text-brand-dusk transition group"
            >
              <span>Explore Gear Rental catalog</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
}
