"use client";

import React, { useMemo, useState } from "react";
import type { BatchMonth } from "@/data/db";

interface TrekDeparturesProps {
  batchMonths: BatchMonth[];
  /** Calendar year the batches belong to. */
  year: string;
  /** `null` where no rate is published — the batch row then omits the figure. */
  price: number | null;
  selectedBatch: string | null;
  onSelectBatch: (batchId: string | null) => void;
  onBookBatch: (batchId: string) => void;
}

export default function TrekDepartures({
  batchMonths,
  year,
  price,
  selectedBatch,
  onSelectBatch,
  onBookBatch,
}: TrekDeparturesProps) {
  const [selectedMonthFilter, setSelectedMonthFilter] = useState<string>("All");
  const [filterWomenOnly, setFilterWomenOnly] = useState(false);
  const [filterSeniorOnly, setFilterSeniorOnly] = useState(false);

  // Filter pills follow the months this listing actually departs in. A block
  // carries its own year once the dates span more than one, so the pills stay
  // distinct where the same month appears twice.
  const monthFilters = useMemo(
    () => [
      { key: "All", month: "All", year },
      ...batchMonths.map((m) => ({
        key: `${m.year ?? year}-${m.month}`,
        month: m.month,
        year: m.year ?? year,
      })),
    ],
    [batchMonths, year]
  );

  const hasSpecialBatches = useMemo(
    () => batchMonths.some((m) => m.trips.some((t) => t.isWomenOnly || t.isSeniorOnly)),
    [batchMonths]
  );

  const filteredBatchData = useMemo(() => {
    return batchMonths
      .filter(
        (mBlock) =>
          selectedMonthFilter === "All" ||
          `${mBlock.year ?? year}-${mBlock.month}` === selectedMonthFilter
      )
      .map((mBlock) => ({
        ...mBlock,
        trips: mBlock.trips.filter((t) => {
          if (filterWomenOnly && !t.isWomenOnly) return false;
          if (filterSeniorOnly && !t.isSeniorOnly) return false;
          return true;
        }),
      }))
      .filter((mBlock) => mBlock.trips.length > 0);
  }, [batchMonths, year, selectedMonthFilter, filterWomenOnly, filterSeniorOnly]);

  return (
    <div id="batch-picker" className="pt-6 border-t border-gray-100 space-y-4 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-3">
        <div>
          <span className="text-base font-extrabold text-brand-dark-text font-serif block">
            Available Departure Batches
          </span>
          <p className="text-[10px] text-gray-400">Select your preferred date batch to lock in your slot.</p>
        </div>

        {/* Special Batch Toggles */}
        {hasSpecialBatches && (
          <div className="flex flex-wrap gap-2 text-xs">
            <button
              onClick={() => setFilterWomenOnly(!filterWomenOnly)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border font-bold transition text-[11px] ${
                filterWomenOnly
                  ? "bg-pink-500 text-white border-pink-500 shadow-xs"
                  : "bg-pink-50 text-pink-700 border-pink-200 hover:bg-pink-100"
              }`}
            >
              <span>♀ Women Only</span>
            </button>
            <button
              onClick={() => setFilterSeniorOnly(!filterSeniorOnly)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border font-bold transition text-[11px] ${
                filterSeniorOnly
                  ? "bg-purple-600 text-white border-purple-600 shadow-xs"
                  : "bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100"
              }`}
            >
              <span>🚶 Senior Citizen</span>
            </button>
          </div>
        )}
      </div>

      {batchMonths.length === 0 ? (
        <div className="p-6 bg-brand-warm-bg border border-gray-150 rounded-2xl text-center text-xs text-gray-500 font-medium">
          Departure dates for this itinerary are set on request — tell us when you want to travel and
          we will confirm a batch.
        </div>
      ) : (
        <>
          {/* Month Filter Pills */}
          <div className="flex flex-wrap gap-1.5">
            {monthFilters.map((m) => (
              <button
                key={m.key}
                onClick={() => setSelectedMonthFilter(m.key)}
                className={`px-3.5 min-h-[44px] inline-flex items-center justify-center shrink-0 rounded-full text-xs font-bold transition ${
                  selectedMonthFilter === m.key
                    ? "bg-[#0B2545] text-white shadow-xs"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {m.key === "All" ? "All Months" : `${m.month} ${m.year}`}
              </button>
            ))}
          </div>

          {/* Filtered Batches List */}
          <div className="space-y-5 pt-1">
            {filteredBatchData.length > 0 ? (
              filteredBatchData.map((monthBlock) => (
                <div
                  key={`${monthBlock.year ?? year}-${monthBlock.month}`}
                  className="space-y-2.5"
                >
                  <span className="text-xs font-bold text-brand-forest uppercase tracking-wider block pl-1">
                    {monthBlock.month} {monthBlock.year ?? year}
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {monthBlock.trips.map((trip, idx) => {
                      const batchId = `${trip.startDate} - ${trip.endDate}`;
                      const isSelected = selectedBatch === batchId;
                      const isFull = trip.status?.toLowerCase() === "closed";
                      return (
                        <div
                          key={idx}
                          onClick={() => {
                            if (!isFull) onSelectBatch(isSelected ? null : batchId);
                          }}
                          className={`p-3.5 border rounded-2xl flex items-center justify-between transition-all cursor-pointer text-left ${
                            isFull
                              ? "bg-gray-100 border-gray-200 opacity-60 cursor-not-allowed"
                              : isSelected
                              ? "bg-[#0B2545] text-white border-[#0B2545] ring-2 ring-[#0B2545]/20 shadow-md"
                              : "bg-white hover:border-brand-forest/40 border-gray-150 shadow-xs"
                          }`}
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className={`text-xs font-extrabold block ${isSelected ? "text-white" : "text-brand-dark-text"}`}>
                                {trip.startDate} - {trip.endDate}
                              </span>
                              {trip.isWomenOnly && (
                                <span className="text-[9px] bg-pink-100 text-pink-700 font-bold px-1.5 py-0.5 rounded">
                                  ♀ Women
                                </span>
                              )}
                              {trip.isSeniorOnly && (
                                <span className="text-[9px] bg-purple-100 text-purple-700 font-bold px-1.5 py-0.5 rounded">
                                  🚶 Senior
                                </span>
                              )}
                            </div>
                            <span className={`text-[10px] ${isSelected ? "text-gray-300" : "text-gray-400"} font-semibold uppercase block`}>
                              Year {monthBlock.year ?? year}
                              {price !== null && ` • ₹${price.toLocaleString()}`}
                            </span>
                          </div>

                          <div className="flex flex-col items-end gap-1.5 shrink-0">
                            <span
                              className={`text-[9px] px-2 py-0.75 rounded-full font-bold uppercase tracking-wider ${
                                isFull
                                  ? "bg-gray-200 text-gray-500"
                                  : trip.status === "Filling Fast"
                                  ? "bg-amber-500/10 text-amber-600 border border-amber-500/20"
                                  : isSelected
                                  ? "bg-white/20 text-white"
                                  : "bg-green-500/10 text-green-600 border border-green-500/20"
                              }`}
                            >
                              {trip.status}
                            </span>

                            {!isFull && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onBookBatch(`${batchId} ${monthBlock.year ?? year}`);
                                }}
                                className={`text-[10px] font-bold underline transition inline-flex items-center min-h-[44px] px-1 ${
                                  isSelected ? "text-brand-dusk-orange" : "text-brand-forest hover:text-brand-dusk-orange"
                                }`}
                              >
                                Book Now →
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 bg-gray-50 border border-gray-150 rounded-2xl text-center text-xs text-gray-500 font-medium">
                No departure batches found matching the selected filters.
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
