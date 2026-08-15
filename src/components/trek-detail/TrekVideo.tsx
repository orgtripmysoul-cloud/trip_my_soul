"use client";

import React from "react";

/** Local SVG helper for the video play icon. */
function PlayVideoIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

export default function TrekVideo() {
  return (
    <>
      <h2 className="text-lg font-extrabold text-brand-dark-text font-serif">Expedition Preview Video</h2>
      <div className="aspect-video w-full rounded-2xl overflow-hidden bg-gray-150 relative flex items-center justify-center">
        <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white p-4 text-center space-y-2">
          <PlayVideoIcon className="w-12 h-12 text-brand-dusk-orange" />
          <span className="font-bold text-xs uppercase tracking-widest block">Video Log Preview</span>
          <span className="text-[10px] text-gray-300 block">Watch trail contours and campsite showcases</span>
        </div>
      </div>
    </>
  );
}
