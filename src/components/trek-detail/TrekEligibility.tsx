"use client";

import React from "react";
import {
  Activity, Backpack, Dumbbell, Footprints, Mountain, Snowflake, Stethoscope,
  ShieldCheck, TrendingUp, User,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { IconBullet } from "@/data/db";
import type { ResolvedTrekDetail } from "@/lib/trekDetail";

/** Icon names a criterion may ask for, resolved to the lucide component. */
const CRITERION_ICONS: Record<string, LucideIcon> = {
  Activity,
  Backpack,
  Dumbbell,
  Footprints,
  Mountain,
  Snowflake,
  Stethoscope,
  TrendingUp,
  User,
};

/** A compact card of icon rows, e.g. who the trek is open to. */
function CriteriaCard({
  title,
  icon: Icon,
  items,
}: {
  title: string;
  icon: LucideIcon;
  items: IconBullet[];
}) {
  return (
    <div className="p-5 bg-brand-warm-bg rounded-2xl border border-gray-150 space-y-3">
      <span className="text-xs font-extrabold text-brand-forest uppercase tracking-wider flex items-center gap-2">
        <Icon className="w-4 h-4 text-brand-dusk-orange" />
        <span>{title}</span>
      </span>
      <ul className="space-y-2.5">
        {items.map((item) => {
          const ItemIcon = CRITERION_ICONS[item.icon] ?? ShieldCheck;
          return (
            <li
              key={item.text}
              className="flex items-start gap-2.5 text-xs text-gray-650 font-medium leading-relaxed"
            >
              <ItemIcon className="w-3.5 h-3.5 text-brand-forest shrink-0 mt-0.5" />
              <span>{item.text}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

interface TrekEligibilityProps {
  detail: ResolvedTrekDetail;
  noun: string;
}

export default function TrekEligibility({ detail, noun }: TrekEligibilityProps) {
  const {
    trek, eligibilityParagraphs, eligibilityCriteria, fitnessCriteria, minAge, maxAge, maxGroupSize,
  } = detail;
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
      <h2 className="text-lg font-extrabold text-brand-dark-text font-serif">Eligibility & Fitness</h2>
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

      {/* Published criteria, where the listing has them */}
      {(eligibilityCriteria.length > 0 || fitnessCriteria.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {eligibilityCriteria.length > 0 && (
            <CriteriaCard title="Eligibility" icon={ShieldCheck} items={eligibilityCriteria} />
          )}
          {fitnessCriteria.length > 0 && (
            <CriteriaCard title="Fitness Requirement" icon={Activity} items={fitnessCriteria} />
          )}
        </div>
      )}
    </>
  );
}
