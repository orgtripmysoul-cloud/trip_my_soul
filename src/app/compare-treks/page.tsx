"use client";

import React, { useState } from "react";
import Link from "next/link";
import { TREKS, Trek } from "@/data/db";
import { ArrowLeft, Check, X, Compass, Plus, Trash2, ArrowRight } from "lucide-react";

export default function CompareTreksPage() {
  const [selectedSlugs, setSelectedSlugs] = useState<string[]>([
    "kedarkantha-trek",
    "buran-ghati-pass-trek",
    "kashmir-great-lakes"
  ]);

  const selectedTreks = selectedSlugs
    .map((slug) => TREKS.find((t) => t.slug === slug))
    .filter(Boolean) as Trek[];

  const availableTreks = TREKS.filter((t) => !selectedSlugs.includes(t.slug));

  const addTrek = (slug: string) => {
    if (selectedSlugs.length < 4) {
      setSelectedSlugs([...selectedSlugs, slug]);
    }
  };

  const removeTrek = (slug: string) => {
    setSelectedSlugs(selectedSlugs.filter((s) => s !== slug));
  };

  const comparisonRows = [
    { label: "Duration", getValue: (t: Trek) => `${t.days} Days / ${t.nights} Nights` },
    { label: "Difficulty Grade", getValue: (t: Trek) => t.difficulty, isBadge: true },
    { label: "Basecamp Start", getValue: (t: Trek) => t.startLocation || "Dehradun / Basecamp" },
    { label: "Active Months", getValue: (t: Trek) => t.months.join(", ") },
    { label: "Peak Altitude", getValue: (t: Trek) => t.maxAltitude || "12,500 ft+" },
    { label: "Mountaineering Guide", getValue: () => "Certified", isCheck: true },
  ];

  return (
    <div className="min-h-screen bg-brand-warm-bg pt-20 sm:pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6 sm:space-y-8 font-sans">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-200 pb-6">
        <div>
          <Link href="/treks" className="flex items-center gap-2 text-xs font-bold text-brand-forest hover:text-brand-dusk mb-2">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Treks Catalog</span>
          </Link>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-serif text-brand-dark-text">Compare Himalayan Expeditions</h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">Select up to 4 treks to compare altitude, difficulty, logistics, and inclusions side-by-side.</p>
        </div>

        {/* Add Trek Dropdown */}
        {selectedSlugs.length < 4 && availableTreks.length > 0 && (
          <div className="relative shrink-0">
            <select
              onChange={(e) => {
                if (e.target.value) addTrek(e.target.value);
                e.target.value = "";
              }}
              className="text-xs font-bold px-4 py-2.5 rounded-full bg-[#0B2545] text-white border border-[#0B2545] cursor-pointer shadow-md focus:outline-none"
            >
              <option value="">+ Add Trek to Compare...</option>
              {availableTreks.map((t) => (
                <option key={t.slug} value={t.slug}>
                  {t.name} ({t.region})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Comparison Matrix */}
      {selectedTreks.length > 0 ? (
        <>
          {/* Mobile: stacked trek cards */}
          <div className="md:hidden space-y-4">
            {selectedTreks.map((trek) => (
              <div key={trek.slug} className="bg-white rounded-3xl border border-gray-150 shadow-md overflow-hidden">
                <div className="p-4 border-b border-gray-100 relative">
                  <button
                    onClick={() => removeTrek(trek.slug)}
                    className="absolute top-3 right-3 p-2 rounded-full text-gray-400 hover:text-red-500 hover:bg-gray-100 transition min-w-[40px] min-h-[40px] flex items-center justify-center"
                    title="Remove from comparison"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <span className="text-[10px] font-extrabold uppercase text-brand-dusk-orange">{trek.region}</span>
                  <h3 className="text-base font-bold text-brand-dark-text pr-10">{trek.name}</h3>
                  <span className="text-xl font-extrabold text-brand-forest block mt-1">
                    {trek.price ? `₹${trek.price.toLocaleString()}` : "TBD"}
                  </span>
                </div>
                <div className="divide-y divide-gray-100 text-xs">
                  {comparisonRows.map((row) => (
                    <div key={row.label} className="flex justify-between gap-4 px-4 py-3">
                      <span className="text-gray-500 font-semibold shrink-0">{row.label}</span>
                      {row.isCheck ? (
                        <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      ) : row.isBadge ? (
                        <span className="px-2.5 py-1 rounded-full bg-brand-forest/10 text-brand-forest text-[11px] font-bold text-right">
                          {row.getValue(trek)}
                        </span>
                      ) : (
                        <span className="font-semibold text-brand-dark-text text-right">{row.getValue(trek)}</span>
                      )}
                    </div>
                  ))}
                </div>
                <div className="p-4">
                  <Link
                    href={`/treks/${trek.slug}`}
                    className="flex items-center justify-center gap-1.5 w-full py-3 rounded-full bg-[#0B2545] hover:bg-brand-dusk-orange text-white text-xs font-bold transition shadow-xs min-h-[44px]"
                  >
                    <span>Explore Trek</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop: comparison table */}
          <div className="hidden md:block overflow-x-auto scroll-touch bg-white rounded-3xl border border-gray-150 shadow-md">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-gray-150 bg-gray-50/50">
                <th className="p-4 sm:p-6 w-48 text-xs font-black uppercase text-gray-400">Spec / Trek</th>
                {selectedTreks.map((trek) => (
                  <th key={trek.slug} className="p-4 sm:p-6 text-center border-l border-gray-150 min-w-[200px] relative">
                    <button
                      onClick={() => removeTrek(trek.slug)}
                      className="absolute top-3 right-3 p-1 rounded-full text-gray-400 hover:text-red-500 hover:bg-gray-100 transition"
                      title="Remove from comparison"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <div className="space-y-1">
                      <span className="text-xs font-extrabold uppercase text-brand-dusk-orange">{trek.region}</span>
                      <h3 className="text-base font-bold text-brand-dark-text block">{trek.name}</h3>
                      <span className="text-lg font-extrabold text-brand-forest block">
                        {trek.price ? `₹${trek.price.toLocaleString()}` : "TBD"}
                      </span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs">
              {/* Duration */}
              <tr>
                <td className="p-4 font-bold text-gray-700 bg-gray-50/30">Duration</td>
                {selectedTreks.map((t) => (
                  <td key={t.slug} className="p-4 text-center border-l border-gray-100 font-semibold text-brand-dark-text">
                    {t.days} Days / {t.nights} Nights
                  </td>
                ))}
              </tr>

              {/* Difficulty Grade */}
              <tr>
                <td className="p-4 font-bold text-gray-700 bg-gray-50/30">Difficulty Grade</td>
                {selectedTreks.map((t) => (
                  <td key={t.slug} className="p-4 text-center border-l border-gray-100 font-bold">
                    <span className="px-3 py-1 rounded-full bg-brand-forest/10 text-brand-forest text-[11px]">
                      {t.difficulty}
                    </span>
                  </td>
                ))}
              </tr>

              {/* Start Location */}
              <tr>
                <td className="p-4 font-bold text-gray-700 bg-gray-50/30">Basecamp Start</td>
                {selectedTreks.map((t) => (
                  <td key={t.slug} className="p-4 text-center border-l border-gray-100 text-gray-600">
                    {t.startLocation || "Dehradun / Basecamp"}
                  </td>
                ))}
              </tr>

              {/* Best Season */}
              <tr>
                <td className="p-4 font-bold text-gray-700 bg-gray-50/30">Active Months</td>
                {selectedTreks.map((t) => (
                  <td key={t.slug} className="p-4 text-center border-l border-gray-100">
                    <div className="flex flex-wrap justify-center gap-1">
                      {t.months.map((m) => (
                        <span key={m} className="px-2 py-0.5 rounded bg-gray-100 text-[10px] font-semibold text-gray-600">
                          {m}
                        </span>
                      ))}
                    </div>
                  </td>
                ))}
              </tr>

              {/* Peak Altitude */}
              <tr>
                <td className="p-4 font-bold text-gray-700 bg-gray-50/30">Peak Altitude</td>
                {selectedTreks.map((t) => (
                  <td key={t.slug} className="p-4 text-center border-l border-gray-100 font-extrabold text-brand-dark-text">
                    {t.maxAltitude || "12,500 ft+"}
                  </td>
                ))}
              </tr>

              {/* Certification & Guides */}
              <tr>
                <td className="p-4 font-bold text-gray-700 bg-gray-50/30">Mountaineering Guide</td>
                {selectedTreks.map((t) => (
                  <td key={t.slug} className="p-4 text-center border-l border-gray-100 text-emerald-600 font-bold">
                    <Check className="w-4 h-4 mx-auto" />
                  </td>
                ))}
              </tr>

              {/* Action Links */}
              <tr>
                <td className="p-4 font-bold text-gray-700 bg-gray-50/30">View Details</td>
                {selectedTreks.map((t) => (
                  <td key={t.slug} className="p-4 text-center border-l border-gray-100">
                    <Link
                      href={`/treks/${t.slug}`}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#0B2545] hover:bg-brand-dusk-orange text-white text-xs font-bold transition shadow-xs"
                    >
                      <span>Explore Trek</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
        </>
      ) : (
        <div className="text-center py-20 bg-white border border-gray-150 rounded-3xl p-8 space-y-4 max-w-md mx-auto">
          <Compass className="w-12 h-12 text-brand-dusk-orange mx-auto" />
          <h3 className="text-lg font-bold text-brand-dark-text">No treks selected to compare</h3>
          <p className="text-xs text-gray-500">Pick treks from the dropdown above to view side-by-side specs.</p>
        </div>
      )}
    </div>
  );
}
