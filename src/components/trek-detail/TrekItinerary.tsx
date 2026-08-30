"use client";

import React, { useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import type { NormalizedItineraryDay } from "@/lib/trekDetail";

type ViewMode = "quick" | "detailed" | "graph";

const BASE_VIEW_MODES: { id: ViewMode; label: string }[] = [
  { id: "quick", label: "Quick" },
  { id: "detailed", label: "Detailed" },
];

/** A day plotted on the altitude profile, with its SVG coordinates. */
interface GraphPoint {
  x: number;
  y: number;
  day: number;
  title: string;
  altitude: number;
  location: string;
  gain: number;
}

interface TrekItineraryProps {
  itinerary: NormalizedItineraryDay[];
  noun: string;
  onViewDepartures: () => void;
}

export default function TrekItinerary({ itinerary, noun, onViewDepartures }: TrekItineraryProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("quick");
  const [expandedDays, setExpandedDays] = useState<Record<number, boolean>>({ 1: true });
  const [hoveredPoint, setHoveredPoint] = useState<GraphPoint | null>(null);

  // The altitude profile only means something where the days carry elevations.
  const hasAltitudeData = itinerary.some((d) => d.altitudePoints.length > 0);
  const viewModes = hasAltitudeData
    ? [...BASE_VIEW_MODES, { id: "graph" as ViewMode, label: noun + " Graph" }]
    : BASE_VIEW_MODES;
  const activeView = viewMode === "graph" && !hasAltitudeData ? "quick" : viewMode;

  const toggleDayExpanded = (day: number) => {
    setExpandedDays((prev) => ({ ...prev, [day]: !prev[day] }));
  };

  // Compile coordinates data for custom SVG graph
  const graphData = useMemo(() => {
    if (itinerary.length === 0) return [];
    return itinerary.map((day) => {
      const maxAlt = Math.max(...day.altitudePoints.map((ap) => ap.ft));
      const endPoint = day.altitudePoints[day.altitudePoints.length - 1];
      return {
        day: day.day,
        title: day.title,
        altitude: maxAlt,
        location: endPoint?.location || "Camp",
        gain: day.altitudeGain?.ft || 0,
      };
    });
  }, [itinerary]);

  // SVG Dimension Math & Path Generation
  const { pathD, areaD, svgPoints } = useMemo(() => {
    if (graphData.length === 0) return { pathD: "", areaD: "", svgPoints: [] as GraphPoint[] };
    const width = 440;
    const height = 125;
    const paddingX = 35;
    const paddingY = 20;

    const alts = graphData.map((d) => d.altitude);
    const maxAlt = Math.max(...alts, 12500);
    const minAlt = Math.min(...alts, 2000);
    const altRange = maxAlt - minAlt || 1000;

    const points = graphData.map((d, idx) => {
      const x = paddingX + (idx / (graphData.length - 1)) * (width - 2 * paddingX);
      const y = height - paddingY - ((d.altitude - minAlt) / altRange) * (height - 2 * paddingY);
      return { x, y, ...d };
    });

    const pathStr = points.map((p, idx) => `${idx === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
    const areaStr = `${pathStr} L ${points[points.length - 1].x} ${height - paddingY} L ${points[0].x} ${height - paddingY} Z`;

    return { pathD: pathStr, areaD: areaStr, svgPoints: points };
  }, [graphData]);

  const maxTrekAltitude = useMemo(() => {
    if (graphData.length === 0) return 0;
    return Math.max(...graphData.map((d) => d.altitude));
  }, [graphData]);

  const totalTrekDistance = useMemo(() => {
    let tot = 0;
    itinerary.forEach((d) => {
      if (d.trekDistance) {
        const val = parseFloat(d.trekDistance.replace(/[^\d.]/g, ""));
        if (!isNaN(val)) tot += val;
      }
    });
    return tot || 28;
  }, [itinerary]);

  const totalAltitudeGain = useMemo(() => {
    let tot = 0;
    itinerary.forEach((d) => {
      if (d.altitudeGain) tot += d.altitudeGain.ft;
    });
    return tot || 5500;
  }, [itinerary]);

  if (itinerary.length === 0) {
    return (
      <div className="p-6 bg-brand-warm-bg border border-gray-150 rounded-2xl text-center text-xs text-gray-500 font-medium">
        The day-by-day plan for this {noun.toLowerCase()} is being finalised. Call our desk for the
        current route and timings.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 1. View Mode Toggles */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-150 pb-4 gap-4">
        <h3 className="text-base font-extrabold text-brand-dark-text font-serif">
          {noun === "Trek" ? "Expedition Schedule" : "Day-by-day Schedule"}
        </h3>

        <div className="flex bg-gray-100 p-1 rounded-full border border-gray-250/50 text-[10px] font-bold">
          {viewModes.map((mode) => (
            <button
              key={mode.id}
              onClick={() => setViewMode(mode.id)}
              className={`px-4.5 min-h-[44px] inline-flex items-center justify-center rounded-full uppercase transition-all ${
                activeView === mode.id ? "bg-brand-forest text-white shadow-xs" : "text-gray-500 hover:text-brand-forest"
              }`}
            >
              {mode.label}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Quick View List */}
      {activeView === "quick" && (
        <div className="relative pl-6 border-l-2 border-brand-forest/20 space-y-8 py-2">
          {itinerary.map((day) => (
            <div key={day.day} className="relative space-y-1">
              {/* Day badge circular label */}
              <div className="absolute -left-[37px] top-0 w-8 h-8 rounded-full bg-brand-forest border-4 border-white flex items-center justify-center text-white text-[9px] font-black uppercase shadow-xs">
                D{day.day}
              </div>

              <div className="pl-2">
                <span className="font-extrabold text-sm text-brand-dark-text block leading-snug">{day.title}</span>

                {/* Fact list bullets */}
                <ul className="mt-2 space-y-1 text-xs text-gray-550 list-disc pl-4 font-sans leading-relaxed">
                  {day.altitudePoints && day.altitudePoints.length > 0 && (
                    <li>
                      <span className="font-bold text-gray-400">Altitudes:</span>{" "}
                      {day.altitudePoints.map((ap) => `${ap.location} (${ap.ft.toLocaleString()} ft)`).join(" ➡️ ")}
                    </li>
                  )}
                  {day.altitudeGain && (
                    <li>
                      <span className="font-bold text-gray-400">Altitude Gain:</span> +
                      {day.altitudeGain.ft.toLocaleString()} ft ({day.altitudeGain.m} m)
                    </li>
                  )}
                  {day.driveDistance && (
                    <li>
                      <span className="font-bold text-gray-400">Drive:</span> {day.driveDistance} (
                      {day.drivingTime || "TBD"})
                    </li>
                  )}
                  {day.trekDistance && (
                    <li>
                      <span className="font-bold text-gray-400">Trek:</span> {day.trekDistance} (
                      {day.trekDuration || "TBD"})
                    </li>
                  )}
                  {(day.stayType || day.meals) && (
                    <li>
                      <span className="font-bold text-gray-400">Stay & Meals:</span>{" "}
                      {[day.stayType, day.meals].filter(Boolean).join(" • ")}
                    </li>
                  )}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 3. Detailed View Accordion */}
      {activeView === "detailed" && (
        <div className="space-y-3">
          {itinerary.map((day) => {
            const isOpen = !!expandedDays[day.day];
            return (
              <div key={day.day} className="border border-gray-150 rounded-2xl overflow-hidden bg-white">
                <button
                  onClick={() => toggleDayExpanded(day.day)}
                  className="w-full flex items-center justify-between p-4 bg-brand-warm-bg text-left hover:bg-gray-100 transition"
                >
                  <span className="font-extrabold text-xs text-brand-forest uppercase tracking-wider">
                    Day {day.day}: {day.title}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-brand-forest transition-transform ${isOpen ? "rotate-180" : ""}`} />
                </button>
                {isOpen && (
                  <div className="p-5 text-xs text-gray-650 bg-white border-t border-gray-150 space-y-4 leading-relaxed">
                    {day.entries?.length ? (
                      <ul className="space-y-2.5">
                        {day.entries.map((entry, i) => (
                          <li key={i} className="flex items-start gap-2.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-brand-dusk-orange shrink-0 mt-1.5" />
                            <span className="font-medium text-gray-700">
                              {entry.time && (
                                <span className="font-extrabold text-brand-forest mr-1.5">{entry.time}</span>
                              )}
                              {entry.text}
                            </span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="font-medium text-gray-700">{day.detailedDescription}</p>
                    )}

                    {/* Day parameters summary footer */}
                    {(day.stayType || day.meals || day.trekDistance || day.driveDistance) && (
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3 border-t border-gray-100 text-[10px] font-sans font-semibold">
                        {day.stayType && (
                          <div>
                            <span className="text-gray-400 uppercase block tracking-wider mb-1">Stay</span>
                            <span className="font-bold text-brand-dark-text block">{day.stayType}</span>
                          </div>
                        )}
                        {day.meals && (
                          <div>
                            <span className="text-gray-400 uppercase block tracking-wider mb-1">Meals Served</span>
                            <span className="font-bold text-brand-dark-text block">{day.meals}</span>
                          </div>
                        )}
                        {(day.trekDistance || day.driveDistance) && (
                          <div>
                            <span className="text-gray-400 uppercase block tracking-wider mb-1">Trek / Drive</span>
                            <span className="font-bold text-brand-dark-text block">
                              {day.trekDistance
                                ? `Trek ${day.trekDistance} (${day.trekDuration})`
                                : `Drive ${day.driveDistance} (${day.drivingTime})`}
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* 4. Trek Graph View */}
      {activeView === "graph" && (
        <div className="space-y-6">
          <div className="bg-brand-warm-bg rounded-2xl p-4 border border-gray-150 relative">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-brand-forest block mb-4 text-center">
              Altitude Profile (Feet) vs Expedition Days
            </span>

            {/* Custom SVG line chart */}
            <div className="relative w-full overflow-x-auto scroll-touch">
              <svg
                className="w-full max-w-full h-auto min-h-[150px] overflow-visible"
                viewBox="0 0 460 150"
                preserveAspectRatio="xMidYMid meet"
              >
                <defs>
                  {/* Blue Area Gradient */}
                  <linearGradient id="area-grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#1F7A8C" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#1F7A8C" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Horizontal Dotted grid lines */}
                {[3000, 6000, 9000, 12000].map((level) => {
                  const minY = 500;
                  const maxY = 13500;
                  const y = 150 - 20 - ((level - minY) / (maxY - minY)) * 110;
                  return (
                    <g key={level}>
                      <line x1="35" y1={y} x2="425" y2={y} stroke="#e5e7eb" strokeDasharray="3,3" strokeWidth={1} />
                      <text x="30" y={y + 3} fill="#9ca3af" fontSize="8" textAnchor="end" fontWeight="semibold">
                        {level / 1000}k
                      </text>
                    </g>
                  );
                })}

                {/* Shaded Area fill */}
                {areaD && <path d={areaD} fill="url(#area-grad)" />}

                {/* Solid Line path */}
                {pathD && <path d={pathD} fill="none" stroke="#1F7A8C" strokeWidth={2.5} strokeLinecap="round" />}

                {/* Plot points */}
                {svgPoints.map((p, idx) => (
                  <g key={idx}>
                    <circle
                      cx={p.x}
                      cy={p.y}
                      r="4.5"
                      className="fill-white stroke-brand-forest stroke-2.5 cursor-pointer transition-all hover:r-6"
                      onMouseEnter={() => setHoveredPoint(p)}
                      onMouseLeave={() => setHoveredPoint(null)}
                    />
                    {/* Day X-Axis labels */}
                    <text x={p.x} y="145" fill="#6b7280" fontSize="8" fontWeight="bold" textAnchor="middle">
                      D{p.day}
                    </text>
                  </g>
                ))}
              </svg>

              {/* Hover Tooltip Overlay */}
              {hoveredPoint && (
                <div
                  className="absolute bg-brand-forest text-white p-2.5 rounded-xl shadow-lg font-sans text-[10px] space-y-0.5 border border-white/10 z-10"
                  style={{
                    left: `${(hoveredPoint.x / 460) * 100}%`,
                    top: `${(hoveredPoint.y / 150) * 60}%`,
                    transform: "translate(-50%, -120%)",
                  }}
                >
                  <span className="font-extrabold uppercase block text-brand-dusk-orange leading-none mb-1">
                    Day {hoveredPoint.day}: {hoveredPoint.location}
                  </span>
                  <span className="block leading-none">
                    Altitude: <strong>{hoveredPoint.altitude.toLocaleString()} ft</strong>
                  </span>
                  {hoveredPoint.gain > 0 && (
                    <span className="block text-gray-300 leading-none">
                      Gain: +{hoveredPoint.gain.toLocaleString()} ft
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Graph summary statistics */}
          <div className="grid grid-cols-3 gap-2 sm:gap-4 text-center text-xs font-semibold">
            <div className="p-2.5 sm:p-3 bg-white border border-gray-150 rounded-2xl shadow-xs space-y-1 min-w-0">
              <span className="text-[10px] text-gray-400 uppercase block tracking-wider break-words">Highest point</span>
              <span className="font-extrabold text-brand-dark-text block break-words">{maxTrekAltitude.toLocaleString()} Ft</span>
            </div>
            <div className="p-2.5 sm:p-3 bg-white border border-gray-150 rounded-2xl shadow-xs space-y-1 min-w-0">
              <span className="text-[10px] text-gray-400 uppercase block tracking-wider break-words">Alt Gain</span>
              <span className="font-extrabold text-brand-dark-text block break-words">+{totalAltitudeGain.toLocaleString()} Ft</span>
            </div>
            <div className="p-2.5 sm:p-3 bg-white border border-gray-150 rounded-2xl shadow-xs space-y-1 min-w-0">
              <span className="text-[10px] text-gray-400 uppercase block tracking-wider break-words">Distance</span>
              <span className="font-extrabold text-brand-dark-text block break-words">{totalTrekDistance} Km</span>
            </div>
          </div>
        </div>
      )}

      {/* Floating View Departure Dates button */}
      <div className="flex justify-center pt-2">
        <button
          onClick={onViewDepartures}
          className="bg-brand-dusk hover:bg-brand-dusk-orange text-white font-extrabold min-h-[44px] inline-flex items-center justify-center px-6 py-3 rounded-full text-xs shadow-md transition"
        >
          View Departure Dates
        </button>
      </div>
    </div>
  );
}
