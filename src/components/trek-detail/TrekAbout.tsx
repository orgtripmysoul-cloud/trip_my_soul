"use client";

import React from "react";
import { AlertTriangle, Check, Info, MapPin, Sparkles, Star } from "lucide-react";
import type { ResolvedTrekDetail } from "@/lib/trekDetail";

interface TrekAboutProps {
  detail: ResolvedTrekDetail;
  noun: string;
}

/**
 * The long-form pitch: intro paragraphs first, then whatever the listing
 * publishes — headline attractions, what makes it different, who it suits.
 * Each block is skipped when its data is absent.
 */
export default function TrekAbout({ detail, noun }: TrekAboutProps) {
  const {
    trek, aboutParagraphs, highlights, usps, idealFor, differentiators,
    importantNote, destinationHighlights, sourceCaveat,
  } = detail;

  const hasAnything =
    aboutParagraphs.length ||
    highlights.length ||
    usps.length ||
    differentiators.length ||
    destinationHighlights.length ||
    idealFor ||
    importantNote;

  return (
    <>
      <h2 className="text-lg font-extrabold text-brand-dark-text font-serif">
        About {trek.name}
      </h2>

      {!hasAnything && (
        <p className="text-xs text-gray-500 font-medium">
          A full write-up for this {noun.toLowerCase()} is on its way. Call our desk in the meantime
          and we will walk you through the route.
        </p>
      )}

      {aboutParagraphs.length > 0 && (
        <div className="text-sm text-gray-650 leading-relaxed space-y-4">
          {aboutParagraphs.map((text, idx) => (
            <p key={idx}>{text}</p>
          ))}
        </div>
      )}

      {highlights.length > 0 && (
        <div className="space-y-3 pt-2">
          <span className="text-xs font-extrabold text-brand-forest uppercase tracking-wider flex items-center gap-2">
            <Star className="w-4 h-4 text-brand-dusk-orange" />
            <span>Highlights</span>
          </span>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-650 font-medium">
            {highlights.map((item) => (
              <li key={item} className="flex items-start gap-2">
                <Check className="w-3.5 h-3.5 text-green-600 shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {usps.length > 0 && (
        <div className="space-y-3 pt-2">
          <span className="text-xs font-extrabold text-brand-forest uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-brand-dusk-orange" />
            <span>Why this {noun.toLowerCase()}</span>
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {usps.map((usp) => (
              <div
                key={usp.title}
                className="p-4 bg-brand-warm-bg rounded-2xl border border-gray-150 space-y-1"
              >
                <span className="font-extrabold text-xs text-brand-dark-text block">{usp.title}</span>
                <p className="text-[11px] text-gray-650 leading-relaxed font-medium">{usp.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {destinationHighlights.length > 0 && (
        <div className="space-y-3 pt-2">
          <span className="text-xs font-extrabold text-brand-forest uppercase tracking-wider flex items-center gap-2">
            <MapPin className="w-4 h-4 text-brand-dusk-orange" />
            <span>Places you will see</span>
          </span>
          <div className="space-y-2.5">
            {destinationHighlights.map((place) => (
              <div key={place.name} className="text-xs text-gray-650 leading-relaxed">
                <span className="font-extrabold text-brand-dark-text">{place.name}: </span>
                <span className="font-medium">{place.blurb}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {differentiators.length > 0 && (
        <ul className="space-y-1.5 text-xs text-gray-650 font-medium pt-2 pl-4 list-disc">
          {differentiators.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      )}

      {idealFor && (
        <p className="text-xs text-gray-650 font-medium pt-2">
          <span className="font-extrabold text-brand-dark-text">Ideal for: </span>
          {idealFor}
        </p>
      )}

      {importantNote && (
        <div className="flex items-start gap-2.5 p-4 bg-amber-50 border border-amber-200 rounded-2xl text-[11px] text-amber-900 leading-relaxed font-medium">
          <Info className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
          <span>{importantNote}</span>
        </div>
      )}

      {sourceCaveat && (
        <div className="flex items-start gap-2.5 p-4 bg-gray-50 border border-gray-200 rounded-2xl text-[11px] text-gray-600 leading-relaxed font-medium">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-gray-400" />
          <span>{sourceCaveat}</span>
        </div>
      )}
    </>
  );
}
