"use client";

import React, { useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Compass } from "lucide-react";
import TripPlaceholderPage from "@/components/TripPlaceholderPage";
import { getBackpackingTrip } from "@/data/trips";

export default function BackpackingTripPage() {
  const params = useParams();
  const slug = params.slug as string;

  const trip = useMemo(() => getBackpackingTrip(slug), [slug]);

  if (!trip) {
    return (
      <div className="max-w-md mx-auto py-40 px-4 text-center space-y-4">
        <Compass className="w-12 h-12 text-brand-dusk-orange mx-auto" />
        <h1 className="text-2xl font-bold text-brand-dark-text">Trip not found</h1>
        <p className="text-xs text-gray-500">This backpacking route does not exist yet.</p>
        <Link href="/" className="text-xs font-bold text-brand-forest hover:underline">
          Return home
        </Link>
      </div>
    );
  }

  return (
    <TripPlaceholderPage trip={trip} category="Backpacking Trip" />
  );
}
