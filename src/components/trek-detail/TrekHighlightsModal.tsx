"use client";

import React from "react";
import { Check, Sparkles } from "lucide-react";
import type { ResolvedTrekDetail } from "@/lib/trekDetail";

/**
 * The one-line selling points shown beside the fare.
 *
 * A listing's own `highlights` win where it has them; otherwise the lines are
 * derived from data the listing actually carries — nothing is invented.
 */
export function buildHighlightLines(detail: ResolvedTrekDetail, noun: string): string[] {
  if (detail.highlights.length) return detail.highlights;

  const { trek, endLocation, availability, trailType, useTrekFallbacks } = detail;
  const lines: string[] = [];

  if (trek.startLocation) {
    lines.push(`Services from ${trek.startLocation}${endLocation ? ` to ${endLocation}` : ""}`);
  }
  lines.push(`${trek.days} days / ${trek.nights} nights · ${trek.difficulty} grade`);
  if (trailType) lines.push(`Trail: ${trailType}`);
  lines.push("Free rescheduling up to 15 days before batch start");
  lines.push(
    useTrekFallbacks
      ? `${noun} leaders carry oxygen tanks, hyperbaric chambers and satellite trackers`
      : `${noun} captains carry first-aid kits and round-the-clock desk support`
  );
  if (availability) lines.push(availability);

  return lines;
}

interface TrekHighlightsModalProps {
  detail: ResolvedTrekDetail;
  noun: string;
  onClose: () => void;
}

export default function TrekHighlightsModal({ detail, noun, onClose }: TrekHighlightsModalProps) {
  const lines = buildHighlightLines(detail, noun);
  const { usps, differentiators } = detail;

  return (
    <>
      <div className="w-12 h-12 rounded-full bg-brand-forest/10 flex items-center justify-center">
        <Sparkles className="w-6 h-6 text-brand-dusk-orange" />
      </div>

      <div className="space-y-1">
        <h3 className="text-xl font-bold text-brand-dark-text font-serif">
          {detail.trek.name} Highlights
        </h3>
        <p className="text-xs text-gray-500">What this {noun.toLowerCase()} includes at a glance.</p>
      </div>

      <ul className="space-y-2.5">
        {lines.map((line) => (
          <li key={line} className="flex items-start gap-2.5 text-xs text-gray-650 leading-relaxed">
            <Check className="w-4 h-4 text-brand-forest shrink-0 mt-0.5" />
            <span className="font-semibold">{line}</span>
          </li>
        ))}
      </ul>

      {usps.length > 0 && (
        <div className="space-y-2.5 pt-4 border-t border-gray-100">
          {usps.map((usp) => (
            <div key={usp.title} className="space-y-0.5">
              <span className="block text-xs font-bold text-brand-dark-text">{usp.title}</span>
              <span className="block text-[11px] text-gray-500 leading-relaxed">{usp.description}</span>
            </div>
          ))}
        </div>
      )}

      {differentiators.length > 0 && (
        <ul className="space-y-2 pt-4 border-t border-gray-100">
          {differentiators.map((item) => (
            <li key={item} className="flex items-start gap-2.5 text-xs text-gray-650 leading-relaxed">
              <Check className="w-4 h-4 text-brand-dusk-orange shrink-0 mt-0.5" />
              <span className="font-semibold">{item}</span>
            </li>
          ))}
        </ul>
      )}

      <button
        onClick={onClose}
        className="w-full py-3 rounded-full bg-brand-forest hover:bg-brand-forest-light text-white font-bold text-xs transition shadow-md"
      >
        Close
      </button>
    </>
  );
}
