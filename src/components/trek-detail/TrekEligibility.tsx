"use client";

import React from "react";

interface TrekEligibilityProps {
  difficulty: string;
  paragraphs: string[];
}

export default function TrekEligibility({ difficulty, paragraphs }: TrekEligibilityProps) {
  const level = difficulty.toLowerCase();
  const meterClass = level.includes("difficult")
    ? "w-4/5 bg-red-500"
    : level.includes("moderate")
    ? "w-1/2 bg-amber-500"
    : "w-1/3 bg-green-500";

  return (
    <>
      <h2 className="text-lg font-extrabold text-brand-dark-text font-serif">Eligibility & Fitness Meter</h2>
      <div className="flex flex-col md:flex-row gap-6 items-center">
        <div className="w-full md:w-1/3 bg-brand-warm-bg border border-gray-150 rounded-2xl p-5 text-center space-y-3">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Trek Difficulty</span>
          <span className="text-xl font-extrabold text-brand-dusk-orange block font-serif uppercase tracking-wider">
            {difficulty}
          </span>
          <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
            <div className={`h-full rounded-full ${meterClass}`} />
          </div>
        </div>
        <div className="w-full md:w-2/3 space-y-3 text-xs text-gray-650 leading-relaxed">
          <span className="font-bold text-brand-dark-text text-sm block">Preparation Guidelines</span>
          {paragraphs.map((text, idx) => (
            <p key={idx}>{text}</p>
          ))}
        </div>
      </div>
    </>
  );
}
