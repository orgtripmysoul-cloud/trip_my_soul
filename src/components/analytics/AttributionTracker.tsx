"use client";

import { useEffect } from "react";
import { recordVisit } from "@/lib/client/attribution";

/** Records the entry page / referrer / campaign of each visit. Renders nothing. */
export default function AttributionTracker() {
  useEffect(() => {
    recordVisit();
  }, []);
  return null;
}
