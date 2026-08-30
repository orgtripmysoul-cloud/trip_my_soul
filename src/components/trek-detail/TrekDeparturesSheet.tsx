"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { BatchMonth, BatchTrip } from "@/data/db";

interface TrekDeparturesSheetProps {
  open: boolean;
  onClose: () => void;
  batchMonths: BatchMonth[];
  /** Year used for month blocks that carry none of their own. */
  fallbackYear: string;
  /** Currently chosen batch, so the sheet opens on the right month. */
  selectedBatch: string | null;
  /** Same id shape the in-page picker books with: `"05 Oct - 10 Oct 2026"`. */
  onBookBatch: (batchId: string) => void;
}

const MONTH_NAMES: Record<string, string> = {
  Jan: "January",
  Feb: "February",
  Mar: "March",
  Apr: "April",
  May: "May",
  Jun: "June",
  Jul: "July",
  Aug: "August",
  Sep: "September",
  Oct: "October",
  Nov: "November",
  Dec: "December",
};

/** Distance the sheet must be dragged down before it dismisses. */
const DISMISS_PX = 90;

/** "Oct" → "October-2026"; a month already spelled out is left alone. */
function tabLabel(month: string, year: string) {
  return `${MONTH_NAMES[month] ?? month}-${year}`;
}

function isFull(trip: BatchTrip) {
  const s = trip.status?.toLowerCase() ?? "";
  return s === "closed" || s === "full" || s === "sold out" || trip.seatsLeft === 0;
}

/**
 * Badge shown at the right of a departure row.
 *
 * Seat counts win where the source tracks them; otherwise a closed batch reads
 * "Full" and anything else keeps its own status wording ("Open", "Filling
 * Fast") rather than inventing a number.
 */
function statusBadge(trip: BatchTrip) {
  if (isFull(trip)) {
    return { text: "Full", className: "bg-red-50 text-red-600 border-red-200" };
  }
  if (typeof trip.seatsLeft === "number") {
    return {
      text: `${trip.seatsLeft} Seat${trip.seatsLeft === 1 ? "" : "s"} Left`,
      className: "bg-amber-50 text-amber-700 border-amber-200",
    };
  }
  if (trip.status?.toLowerCase() === "filling fast") {
    return { text: "Filling Fast", className: "bg-amber-50 text-amber-700 border-amber-200" };
  }
  return { text: trip.status || "Open", className: "bg-blue-50 text-blue-700 border-blue-200" };
}

/**
 * Mobile-only departures picker.
 *
 * Slides up over the detail page instead of navigating away: month tabs across
 * the top, a list of dates below them that scrolls on its own, and a drag
 * handle that dismisses the sheet on a downward swipe. Desktop keeps the
 * in-page `TrekDepartures` section and the sidebar, so this is hidden from
 * `lg` up.
 */
export default function TrekDeparturesSheet({
  open,
  onClose,
  batchMonths,
  fallbackYear,
  selectedBatch,
  onBookBatch,
}: TrekDeparturesSheetProps) {
  /** `null` while the sheet follows the selected batch's month. */
  const [pickedTabKey, setPickedTabKey] = useState<string | null>(null);
  const [dragY, setDragY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartY = useRef(0);

  // One tab per month block, in the order the listing publishes them.
  const tabs = useMemo(
    () =>
      batchMonths.map((block) => {
        const year = block.year ?? fallbackYear;
        return { key: `${year}-${block.month}`, label: tabLabel(block.month, year), year, block };
      }),
    [batchMonths, fallbackYear]
  );

  // Opens on the month holding the already-selected batch, else the first one.
  const defaultTab = useMemo(() => {
    const owning = selectedBatch
      ? tabs.find((t) =>
          t.block.trips.some((trip) =>
            selectedBatch.startsWith(`${trip.startDate} - ${trip.endDate}`)
          )
        )
      : undefined;
    return owning ?? tabs[0];
  }, [tabs, selectedBatch]);

  const active = tabs.find((t) => t.key === pickedTabKey) ?? defaultTab;

  /** Closes and drops the transient tab/drag state, so the next open is fresh. */
  const close = useCallback(() => {
    setPickedTabKey(null);
    setDragY(0);
    setIsDragging(false);
    onClose();
  }, [onClose]);

  // Freeze the page behind the sheet and close on Escape.
  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, close]);

  if (!open) return null;

  const handleTouchStart = (e: React.TouchEvent) => {
    dragStartY.current = e.touches[0].clientY;
    setIsDragging(true);
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    setDragY(Math.max(0, e.touches[0].clientY - dragStartY.current));
  };
  const handleTouchEnd = () => {
    if (dragY > DISMISS_PX) {
      close();
    } else {
      setDragY(0);
      setIsDragging(false);
    }
  };

  return (
    <div
      className="lg:hidden fixed inset-0 z-60"
      role="dialog"
      aria-modal="true"
      aria-label="Fixed Departure Dates"
    >
      {/* Scrim */}
      <div className="absolute inset-0 bg-black/50 animate-sheet-fade" onClick={close} />

      <div
        style={{
          transform: `translateY(${dragY}px)`,
          transition: isDragging ? "none" : "transform 0.25s ease-out",
        }}
        className="absolute inset-x-0 bottom-0 max-h-[82vh] flex flex-col bg-white rounded-t-3xl shadow-[0_-8px_40px_rgba(0,0,0,0.18)] animate-sheet-up"
      >
        {/* Drag handle + header */}
        <div
          className="shrink-0 px-4 pt-2.5 pb-3 border-b border-gray-100 touch-none"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-gray-300" />
          <div className="flex items-center justify-between">
            <span className="text-base font-extrabold text-brand-dark-text font-serif">
              Fixed Departure Dates
            </span>
            <button
              onClick={close}
              aria-label="Close departure dates"
              className="p-2 -mr-2 text-gray-400 hover:text-brand-dark-text transition"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                className="w-5 h-5"
              >
                <path d="M6 15l6-6 6 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>

        {tabs.length === 0 ? (
          <div className="p-6 text-center text-xs text-gray-500 font-medium">
            Departure dates for this itinerary are set on request — tell us when you want to travel
            and we will confirm a batch.
          </div>
        ) : (
          <>
            {/* Month tabs */}
            <div className="shrink-0 flex gap-2 overflow-x-auto scroll-touch no-scrollbar px-4 py-3">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setPickedTabKey(tab.key)}
                  className={`shrink-0 px-4 py-2 rounded-full text-xs font-bold border transition ${
                    tab.key === active?.key
                      ? "bg-brand-forest text-white border-brand-forest shadow-xs"
                      : "bg-white text-brand-forest border-gray-300 hover:border-brand-forest"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Departure rows — scrolls independently of the page behind it */}
            <div className="flex-1 overflow-y-auto overscroll-contain px-4 pb-5 safe-bottom">
              <div className="divide-y divide-gray-100 border border-gray-150 rounded-2xl overflow-hidden">
                {active?.block.trips.map((trip, idx) => {
                  const full = isFull(trip);
                  const badge = statusBadge(trip);
                  const batchId = `${trip.startDate} - ${trip.endDate} ${active.year}`;
                  return (
                    <div key={idx} className="flex items-center gap-2 px-3.5 py-3.5 bg-white">
                      <div className="min-w-0 flex-1">
                        <span className="text-[13px] font-extrabold text-brand-dark-text block truncate">
                          {trip.startDate} - {trip.endDate}
                        </span>
                        {(trip.isWomenOnly || trip.isSeniorOnly) && (
                          <span className="text-[9px] font-bold text-gray-500 uppercase tracking-wide">
                            {trip.isWomenOnly ? "♀ Women only" : "🚶 Senior citizen"}
                          </span>
                        )}
                      </div>

                      {/* Fixed width keeps the badge column aligned when a full
                          departure drops its Book Now. */}
                      <div className="w-21.5 text-center shrink-0">
                        {!full && (
                          <button
                            onClick={() => onBookBatch(batchId)}
                            className="text-xs font-bold text-green-600 hover:text-green-700 transition"
                          >
                            Book Now
                          </button>
                        )}
                      </div>

                      <span
                        className={`shrink-0 text-[10px] font-bold px-2.5 py-1 rounded-full border whitespace-nowrap ${badge.className}`}
                      >
                        {badge.text}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
