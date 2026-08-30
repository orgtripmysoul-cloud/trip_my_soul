"use client";

import React from "react";
import { Info } from "lucide-react";
import type { PricePackage } from "@/data/db";

interface TrekPricingProps {
  packages: PricePackage[];
  priceNote?: string;
  selectedPackageId: string | null;
  onSelectPackage: (id: string) => void;
}

/**
 * Rate card for listings sold at more than one price — by group size, vehicle
 * or departure city. The chosen row drives the sidebar figure and checkout.
 */
export default function TrekPricing({
  packages,
  priceNote,
  selectedPackageId,
  onSelectPackage,
}: TrekPricingProps) {
  if (packages.length === 0) return null;

  // Only worth a column when at least one row fills it in.
  const showPax = packages.some((p) => p.paxLabel);
  const showVehicle = packages.some((p) => p.vehicle);
  const showSharing = packages.some((p) => p.sharing);

  return (
    <div className="pt-6 border-t border-gray-100 space-y-4 font-sans">
      <div className="border-b border-gray-100 pb-3">
        <span className="text-base font-extrabold text-brand-dark-text font-serif block">
          Pricing Options
        </span>
        <p className="text-[10px] text-gray-400">Pick the option you are booking under.</p>
      </div>

      {priceNote && (
        <div className="flex items-start gap-2.5 p-3.5 bg-amber-50 border border-amber-200 rounded-2xl text-[11px] text-amber-900 leading-relaxed font-medium">
          <Info className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
          <span>{priceNote}</span>
        </div>
      )}

      <div className="overflow-x-auto scroll-touch">
        <table className="w-full text-xs border border-gray-150 rounded-2xl overflow-hidden">
          <thead className="bg-brand-warm-bg text-[10px] uppercase tracking-wider text-gray-500">
            <tr>
              <th className="text-left font-extrabold px-4 py-2.5">Option</th>
              {showPax && <th className="text-left font-extrabold px-4 py-2.5">Group</th>}
              {showVehicle && <th className="text-left font-extrabold px-4 py-2.5">Vehicle</th>}
              {showSharing && <th className="text-left font-extrabold px-4 py-2.5">Sharing</th>}
              <th className="text-right font-extrabold px-4 py-2.5">Per person</th>
            </tr>
          </thead>
          <tbody>
            {packages.map((pkg) => {
              const isSelected = selectedPackageId === pkg.id;
              return (
                <tr
                  key={pkg.id}
                  onClick={() => onSelectPackage(pkg.id)}
                  className={`cursor-pointer border-t border-gray-150 transition ${
                    isSelected ? "bg-[#0B2545] text-white" : "bg-white hover:bg-brand-warm-bg/60"
                  }`}
                >
                  <td className="px-4 py-3 font-bold">{pkg.label}</td>
                  {showPax && <td className="px-4 py-3 font-medium">{pkg.paxLabel ?? "—"}</td>}
                  {showVehicle && <td className="px-4 py-3 font-medium">{pkg.vehicle ?? "—"}</td>}
                  {showSharing && <td className="px-4 py-3 font-medium">{pkg.sharing ?? "—"}</td>}
                  <td className="px-4 py-3 text-right font-extrabold whitespace-nowrap">
                    ₹{pkg.price.toLocaleString()}
                    {pkg.advanceAmount !== undefined && (
                      <span className={`block text-[9px] font-semibold ${isSelected ? "text-gray-300" : "text-gray-400"}`}>
                        ₹{pkg.advanceAmount.toLocaleString()} advance
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
