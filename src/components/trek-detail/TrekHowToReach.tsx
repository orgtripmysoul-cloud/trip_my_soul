"use client";

import React from "react";
import { ArrowRight, Car, Plane, Train } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { HowToReach, TravelMode } from "@/data/db";

interface TrekHowToReachProps {
  transport: { railHead: string; airport: string; road: string };
  /** Published travel copy. Falls back to `transport` where a listing has none. */
  howToReach?: HowToReach;
  /** Listing name, used in the heading. */
  trekName?: string;
}

/** Shared card shell so the published and derived versions look identical. */
function ModeCard({
  icon: Icon,
  title,
  children,
}: {
  icon: LucideIcon;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2 p-4 bg-brand-warm-bg rounded-2xl border border-gray-150">
      <span className="font-extrabold text-brand-forest uppercase tracking-wider flex items-center gap-2">
        <Icon className="w-4 h-4 text-brand-dusk-orange shrink-0" />
        <span>{title}</span>
      </span>
      {children}
    </div>
  );
}

/** The headline of a travel mode: its caption, the place itself, then the prose. */
function ModeSummary({ mode }: { mode: TravelMode }) {
  return (
    <>
      {mode.summaryLabel && (
        <span className="block text-[10px] font-extrabold uppercase tracking-wider text-gray-400">
          {mode.summaryLabel}
        </span>
      )}
      <span className="block font-bold text-brand-dark-text">{mode.summary}</span>
      {mode.detail && <p>{mode.detail}</p>}
    </>
  );
}

export default function TrekHowToReach({ transport, howToReach, trekName }: TrekHowToReachProps) {
  /** "Kedarkantha Trek" reads as "How to Reach Kedarkantha" in this heading. */
  const destination = trekName?.replace(/\s+trek$/i, "").trim();
  const heading = destination ? `How to Reach ${destination}` : "How to Reach";

  return (
    <>
      <h2 className="text-lg font-extrabold text-brand-dark-text font-serif">{heading}</h2>

      {howToReach?.intro && (
        <p className="text-xs text-gray-650 leading-relaxed font-medium">{howToReach.intro}</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-gray-650">
        <ModeCard icon={Plane} title="By Air">
          {howToReach ? (
            <ModeSummary mode={howToReach.air} />
          ) : (
            <p>{transport.airport}. Fly in to the nearest airport, then continue by shared or private cab.</p>
          )}
        </ModeCard>

        <ModeCard icon={Train} title="By Train">
          {howToReach ? (
            <ModeSummary mode={howToReach.train} />
          ) : (
            <p>{transport.railHead}. Regular overnight trains connect major cities to this junction.</p>
          )}
        </ModeCard>

        <ModeCard icon={Car} title="By Road">
          {howToReach ? (
            <ModeSummary mode={howToReach.road} />
          ) : (
            <p>{transport.road}. Local taxi unions and state transport buses run morning schedules.</p>
          )}
        </ModeCard>
      </div>

      {/* The drive itself: the route in order, then its figures */}
      {howToReach?.road.route && howToReach.road.route.length > 0 && (
        <div className="p-5 bg-brand-warm-bg rounded-2xl border border-gray-150 space-y-4">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-brand-forest block">
            Road Route
          </span>

          <ol className="flex flex-wrap items-center gap-y-2 text-[11px] font-sans">
            {howToReach.road.route.map((stop, idx) => (
              <li key={stop} className="flex items-center">
                <span
                  className={`inline-flex items-center rounded-full px-3 py-1.5 font-bold border ${
                    idx === 0 || idx === howToReach.road.route!.length - 1
                      ? "bg-[#0B2545] text-white border-white/10"
                      : "bg-white text-brand-dark-text border-gray-150"
                  }`}
                >
                  {stop}
                </span>
                {idx < howToReach.road.route!.length - 1 && (
                  <ArrowRight className="w-3.5 h-3.5 mx-1.5 text-brand-dusk-orange shrink-0" />
                )}
              </li>
            ))}
          </ol>

          {howToReach.road.facts && howToReach.road.facts.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {howToReach.road.facts.map((fact) => (
                <div
                  key={fact.label}
                  className="p-3 bg-white rounded-xl border border-gray-150 space-y-1 min-w-0"
                >
                  <span className="block text-[9px] font-extrabold uppercase tracking-wider text-gray-400">
                    {fact.label}
                  </span>
                  <span className="block text-[11px] font-bold text-brand-dark-text break-words">
                    {fact.value}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Where the batch assembles and disperses */}
      {howToReach?.pickup && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-4 bg-white rounded-2xl border border-gray-150 space-y-1">
            <span className="block text-[10px] font-extrabold uppercase tracking-wider text-gray-400">
              Pickup
            </span>
            <span className="block font-bold text-brand-dark-text">{howToReach.pickup.point}</span>
            <span className="block text-[11px] font-medium text-gray-650">{howToReach.pickup.time}</span>
          </div>
          <div className="p-4 bg-white rounded-2xl border border-gray-150 space-y-1">
            <span className="block text-[10px] font-extrabold uppercase tracking-wider text-gray-400">
              Drop
            </span>
            <span className="block font-bold text-brand-dark-text">{howToReach.pickup.dropPoint}</span>
            <span className="block text-[11px] font-medium text-gray-650">{howToReach.pickup.dropTime}</span>
          </div>
          {howToReach.pickup.note && (
            <p className="sm:col-span-2 text-[11px] text-gray-650 font-medium leading-relaxed">
              {howToReach.pickup.note}
            </p>
          )}
        </div>
      )}
    </>
  );
}
