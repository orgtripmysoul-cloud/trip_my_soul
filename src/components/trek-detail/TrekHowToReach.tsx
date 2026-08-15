"use client";

import React from "react";

interface TrekHowToReachProps {
  transport: { railHead: string; airport: string; road: string };
}

export default function TrekHowToReach({ transport }: TrekHowToReachProps) {
  return (
    <>
      <h2 className="text-lg font-extrabold text-brand-dark-text font-serif">How to Reach</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-gray-650">
        <div className="space-y-2 p-4 bg-brand-warm-bg rounded-2xl border border-gray-150">
          <span className="font-extrabold text-brand-forest uppercase tracking-wider block">By Air</span>
          <p>{transport.airport}. Board direct flight to local airport, then hire shared cabs to base town.</p>
        </div>
        <div className="space-y-2 p-4 bg-brand-warm-bg rounded-2xl border border-gray-150">
          <span className="font-extrabold text-brand-forest uppercase tracking-wider block">By Train</span>
          <p>{transport.railHead}. Regular overnight trains connect major cities to these junctions.</p>
        </div>
        <div className="space-y-2 p-4 bg-brand-warm-bg rounded-2xl border border-gray-150">
          <span className="font-extrabold text-brand-forest uppercase tracking-wider block">By Road</span>
          <p>{transport.road}. Local taxi unions and state transport buses run morning schedules.</p>
        </div>
      </div>
    </>
  );
}
