"use client";

import React from "react";
import type { ResolvedTrekDetail } from "@/lib/trekDetail";

interface TrekEligibilityProps {
  detail: ResolvedTrekDetail;
  noun: string;
}

export default function TrekEligibility({ detail, noun }: TrekEligibilityProps) {
  const { trek, eligibilityParagraphs, minAge, maxAge, maxGroupSize } = detail;
  const difficulty = trek.difficulty;
  const level = difficulty.toLowerCase();
  const meterClass = level.includes("difficult")
    ? "w-4/5 bg-red-500"
    : level.includes("moderate")
    ? "w-1/2 bg-amber-500"
    : "w-1/3 bg-green-500";

  const ageLabel =
    minAge && maxAge ? `${minAge}–${maxAge} yrs` : minAge ? `${minAge}+ yrs` : null;

  return (
    <>
      <h2 className="text-lg font-extrabold text-brand-dark-text font-serif">Eligibility & Fitness Meter</h2>
      <div className="flex flex-col md:flex-row gap-6 items-center">
        <div className="w-full md:w-1/3 bg-brand-warm-bg border border-gray-150 rounded-2xl p-5 text-center space-y-3">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">
            {noun} Difficulty
          </span>
          <span className="text-xl font-extrabold text-brand-dusk-orange block font-serif uppercase tracking-wider">
            {difficulty}
          </span>
          <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
            <div className={`h-full rounded-full ${meterClass}`} />
          </div>

          {(ageLabel || maxGroupSize) && (
            <div className="flex flex-wrap justify-center gap-2 pt-1 text-[10px] font-bold">
              {ageLabel && (
                <span className="px-2.5 py-1 rounded-full bg-white border border-gray-150 text-brand-forest">
                  Age {ageLabel}
                </span>
              )}
              {maxGroupSize && (
                <span className="px-2.5 py-1 rounded-full bg-white border border-gray-150 text-brand-forest">
                  Group {maxGroupSize}
                </span>
              )}
            </div>
          )}
        </div>
        <div className="w-full md:w-2/3 space-y-3 text-xs text-gray-650 leading-relaxed">
          <span className="font-bold text-brand-dark-text text-sm block">Preparation Guidelines</span>
          {eligibilityParagraphs.map((text, idx) => (
            <p key={idx}>{text}</p>
          ))}
        </div>
      </div>
    </>
  );
}
