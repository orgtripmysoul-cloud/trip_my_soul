"use client";

import React from "react";
import { Compass, ShieldCheck, HelpCircle, Phone, ArrowRight, ShieldAlert, CheckCircle, CloudSnow, Wind } from "lucide-react";

export default function UpdatesPage() {
  const UPDATES = [
    {
      date: "18 Sep 2026",
      type: "Weather Advisory",
      trek: "Brahmatal Trek",
      status: "Weather-Dependent",
      details: "🌧️ Weather Advisory: The Brahmatal region is in the post-monsoon transition. Rain/thundershower activity is still possible over the coming days, particularly around the Chamoli/Joshimath side. IMD has a yellow thunderstorm/lightning watch for Chamoli today (18 Sept), with isolated intense rain possible. For TMS departures, keep a close check on weather 24 hours before the trek, especially before entering the higher trail.\n\n❄️ Snow Conditions: No significant snow expected. Brahmatal's proper winter snow season develops later — the main snow period is generally December–February, with January–February offering established snow conditions and a frozen Brahmatal Lake in suitable years. For September/October departures, don't advertise guaranteed snow.\n\n🥾 Trail Advisory: Expect muddy/wet and slippery sections if there has been recent rain. Forest sections can retain moisture, and water crossings/stream flow can change after heavy rain. Avoid exposed ridge sections during active lightning/thunderstorms, and check the Lohajung approach road and local trail conditions before departure. September–November is typically the post-monsoon clarity period, while July–August is the more problematic monsoon period for slippery trails and unpredictable crossings. The immediate operational focus should be rain, slippery trail and thunderstorm/lightning rather than snow — conditions will change substantially once snowfall begins later in the season.",
      icon: Wind,
      severity: "moderate"
    },
    {
      date: "18 Sep 2026",
      type: "Weather Advisory",
      trek: "Kuari Pass Trek",
      status: "Weather-Dependent",
      details: "🌧️ Weather Advisory: The Joshimath–Auli side is currently weather-sensitive, with IMD forecasting partly cloudy conditions and spells of rain/thunderstorms through the coming days. 18 September: thunderstorm and lightning activity is specifically flagged around Joshimath. From 19–22 September, rain/thunderstorm remains possible, although the IMD forecast does not currently show a warning for those days.\n\n❄️ Snow Conditions: No significant snow expected on the Kuari Pass trail. September is still essentially the post-monsoon transition period — proper snow conditions develop later in the season, generally from late November/December onward. Do not market Kuari Pass as a snow trek for current TMS departures.\n\n🥾 Trail Advisory: Expect wet and potentially slippery sections after rain, with muddy sections and reduced traction possible. Higher sections can become cloudy quickly, reducing visibility. Avoid exposed ridges and high points during active lightning/thunderstorms. Road access toward Joshimath/Auli should be checked immediately before departure; IMD currently reports light rain on the Rudraprayag–Joshimath and Joshimath–Badrinath/Hemkund sectors.",
      icon: CloudSnow,
      severity: "moderate"
    }
  ];

  return (
    <div className="min-h-screen bg-brand-warm-bg py-12 font-sans">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Banner */}
        <div className="text-center max-w-xl mx-auto space-y-3">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-brand-dusk-orange bg-brand-forest/5 px-3.5 py-1.5 rounded-full inline-block">
            Trail Advisory Feed
          </span>
          <h1 className="text-3xl font-extrabold font-serif text-brand-dark-text leading-none">
            Live Trail Updates
          </h1>
          <p className="text-xs text-gray-500">
            Real-time reports on weather alerts, trail snow levels, safety guidelines, and forest department regulations.
          </p>
        </div>

        {/* Updates Feed */}
        <div className="space-y-6">
          {UPDATES.map((up, idx) => (
            <div key={idx} className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-100 pb-3 gap-2">
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    up.severity === "moderate" ? "bg-amber-500/10 text-amber-600" : "bg-blue-50/10 text-blue-600 border border-blue-200/20"
                  }`}>
                    <up.icon className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-brand-dark-text block">{up.type}</span>
                    <span className="text-[10px] text-gray-400 font-semibold">{up.trek}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[9px] text-gray-450 font-bold font-mono">{up.date}</span>
                  <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                    up.severity === "moderate" ? "bg-amber-500/10 text-amber-600 border border-amber-500/20" : "bg-blue-500/10 text-blue-600 border border-blue-500/20"
                  }`}>
                    {up.status}
                  </span>
                </div>
              </div>

              <p className="text-xs text-gray-550 leading-relaxed font-medium pl-1 whitespace-pre-line">
                {up.details}
              </p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
