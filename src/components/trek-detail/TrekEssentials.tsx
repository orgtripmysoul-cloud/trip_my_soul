"use client";

import React from "react";
import type { EquipmentGroup, RentalGearItem } from "@/data/db";

interface TrekEssentialsProps {
  packingList: EquipmentGroup[];
  rentalGear: RentalGearItem[];
  noun: string;
}

/** Column dividers match the original 3-up layout: middle column is bordered. */
function columnClass(idx: number, total: number) {
  if (idx === 0) return "space-y-2.5";
  if (idx === total - 1) return "space-y-2.5 border-t md:border-t-0 border-gray-100";
  return "space-y-2.5 border-t md:border-t-0 md:border-x border-gray-100 md:px-6";
}

export default function TrekEssentials({ packingList, rentalGear, noun }: TrekEssentialsProps) {
  return (
    <>
      <h2 className="text-lg font-extrabold text-brand-dark-text font-serif">
        {noun} Essentials Packing List
      </h2>

      {packingList.length === 0 ? (
        <p className="text-xs text-gray-500 font-medium">
          A packing list for this {noun.toLowerCase()} is not published yet. Pack for the season and
          call our desk if you are unsure what the route needs.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-gray-650">
          {packingList.map((group, idx) => (
            <div key={group.category || idx} className={columnClass(idx, packingList.length)}>
              {/* A continued column carries no heading of its own. */}
              {group.category && (
                <span className="font-extrabold text-brand-forest uppercase tracking-wider block">
                  {group.category}
                </span>
              )}
              <ul className="space-y-1 pl-3.5 list-disc font-medium">
                {group.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {rentalGear.length > 0 && (
        <div className="space-y-3 pt-6 border-t border-gray-100">
          <div>
            <span className="text-base font-extrabold text-brand-dark-text font-serif block">
              Gear on hire
            </span>
            <p className="text-[10px] text-gray-400">
              Available at the start point, priced per item for the whole {noun.toLowerCase()}.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 text-xs">
            {rentalGear.map((gear) => (
              <div
                key={gear.item}
                className="flex items-center justify-between gap-2 p-3 bg-brand-warm-bg rounded-xl border border-gray-150"
              >
                <span className="font-medium text-gray-650">{gear.item}</span>
                <span className="font-extrabold text-brand-forest whitespace-nowrap">
                  ₹{gear.price.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
