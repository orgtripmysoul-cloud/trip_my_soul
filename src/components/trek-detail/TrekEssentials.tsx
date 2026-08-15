"use client";

import React from "react";
import type { EquipmentGroup } from "@/data/db";

interface TrekEssentialsProps {
  packingList: EquipmentGroup[];
}

/** Column dividers match the original 3-up layout: middle column is bordered. */
function columnClass(idx: number, total: number) {
  if (idx === 0) return "space-y-2.5";
  if (idx === total - 1) return "space-y-2.5 border-t md:border-t-0 border-gray-100";
  return "space-y-2.5 border-t md:border-t-0 md:border-x border-gray-100 md:px-6";
}

export default function TrekEssentials({ packingList }: TrekEssentialsProps) {
  return (
    <>
      <h2 className="text-lg font-extrabold text-brand-dark-text font-serif">Trek Essentials Packing List</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-gray-650">
        {packingList.map((group, idx) => (
          <div key={group.category} className={columnClass(idx, packingList.length)}>
            <span className="font-extrabold text-brand-forest uppercase tracking-wider block">
              {group.category}
            </span>
            <ul className="space-y-1 pl-3.5 list-disc font-medium">
              {group.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </>
  );
}
