"use client";

import React, { useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { AlertCircle } from "lucide-react";
import { TREKS, WILDLIFE, YATRAS } from "@/data/db";
import TrekDetailView from "@/components/trek-detail/TrekDetailView";

export default function TrekDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  // `/yatra` and the wildlife listings link here too, so resolve against every
  // catalogue rather than TREKS alone — otherwise those cards 404.
  const catalogue = useMemo(() => [...TREKS, ...YATRAS, ...WILDLIFE], []);

  const trek = useMemo(() => catalogue.find((t) => t.slug === slug) || null, [catalogue, slug]);

  // Similar Treks: an editorial list where the listing names one, otherwise the
  // automatic match on region or difficulty.
  const similarTreks = useMemo(() => {
    if (!trek) return [];

    if (trek.similarTreks?.length) {
      const picked = trek.similarTreks
        .filter((s) => s !== trek.slug)
        .map((s) => catalogue.find((t) => t.slug === s))
        .filter((t) => t !== undefined);
      if (picked.length > 0) return picked.slice(0, 4);
    }

    const matches = catalogue.filter(
      (t) => t.slug !== trek.slug && (t.region === trek.region || t.difficulty === trek.difficulty)
    );
    return matches.length > 0
      ? matches.slice(0, 4)
      : catalogue.filter((t) => t.slug !== trek.slug).slice(0, 4);
  }, [catalogue, trek]);

  if (!trek) {
    return (
      <div className="max-w-md mx-auto py-40 px-4 text-center space-y-4 font-sans">
        <AlertCircle className="w-12 h-12 text-brand-dusk mx-auto" />
        <h1 className="text-2xl font-bold text-brand-dark-text">Trek not found</h1>
        <p className="text-xs text-gray-500">
          The trek route you are looking for does not exist or has been renamed.
        </p>
        <button
          onClick={() => router.push("/treks")}
          className="px-5 py-2.5 rounded-full bg-brand-forest hover:bg-brand-forest-light text-white font-bold text-xs transition"
        >
          Back to all treks
        </button>
      </div>
    );
  }

  return (
    <TrekDetailView
      trek={trek}
      similar={similarTreks}
      totalCount={catalogue.length}
      browseHref="/treks"
      noun="Trek"
    />
  );
}
