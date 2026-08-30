"use client";

import React, { useState } from "react";
import { Check, X } from "lucide-react";

interface CostItem {
  title: string;
  description: string;
}

interface TrekInclusionsProps {
  inclusions: CostItem[];
  exclusions: CostItem[];
}

export default function TrekInclusions({ inclusions, exclusions }: TrekInclusionsProps) {
  const [costTab, setCostTab] = useState<"inclusions" | "exclusions">("inclusions");

  const items = costTab === "inclusions" ? inclusions : exclusions;

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-100 pb-4 gap-4">
        <h2 className="text-lg font-extrabold text-brand-dark-text font-serif">Cost Terms & Inclusions</h2>
        <div className="flex bg-brand-warm-bg p-1 rounded-full border border-gray-150 text-[10px] font-bold">
          <button
            onClick={() => setCostTab("inclusions")}
            className={`px-4 min-h-[44px] inline-flex items-center justify-center rounded-full uppercase transition-all ${
              costTab === "inclusions" ? "bg-brand-forest text-white" : "text-gray-500"
            }`}
          >
            Inclusions
          </button>
          <button
            onClick={() => setCostTab("exclusions")}
            className={`px-4 min-h-[44px] inline-flex items-center justify-center rounded-full uppercase transition-all ${
              costTab === "exclusions" ? "bg-brand-forest text-white" : "text-gray-500"
            }`}
          >
            Exclusions
          </button>
        </div>
      </div>

      {items.length === 0 ? (
        <p className="text-xs text-gray-500 font-medium">
          The {costTab === "inclusions" ? "inclusion" : "exclusion"} list for this itinerary is not
          published yet — our desk will confirm it with your quote.
        </p>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-gray-650">
          {items.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2.5">
              {costTab === "inclusions" ? (
                <Check className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
              ) : (
                <X className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              )}
              <div>
                <span className="font-bold text-brand-dark-text block">{item.title}</span>
                {item.description && <span>{item.description}</span>}
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
