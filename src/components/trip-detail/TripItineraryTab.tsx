"use client";

import React from "react";
import TripDayTimeline from "./TripDayTimeline";
import { MissingField, TabTitle } from "./TripSectionParts";
import type { TripListingItem } from "@/data/trips";

interface TripItineraryTabProps {
  trip: TripListingItem;
}

export default function TripItineraryTab({ trip }: TripItineraryTabProps) {
  const days = trip.itinerary ?? [];

  return (
    <div className="space-y-6">
      <div>
        <TabTitle>Itinerary</TabTitle>
        <p className="text-xs text-gray-500">
          {days.length > 0
            ? `${trip.days} days and ${trip.nights} nights, ${trip.startLocation} to ${trip.endLocation ?? trip.startLocation}.`
            : "Day-by-day plan"}
        </p>
      </div>

      {days.length > 0 ? (
        <div>
          {days.map((day, idx) => (
            <TripDayTimeline key={day.day} day={day} isLast={idx === days.length - 1} />
          ))}
        </div>
      ) : (
        <MissingField>No day-by-day breakdown is given in the source itinerary.</MissingField>
      )}
    </div>
  );
}
