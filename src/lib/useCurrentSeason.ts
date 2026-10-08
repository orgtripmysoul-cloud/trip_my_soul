"use client";

import { useSyncExternalStore } from "react";
import { currentSeason, Season } from "@/lib/season";

/** Nothing to subscribe to — the season only changes between visits. */
const subscribe = () => () => {};

const getSnapshot = (): Season => currentSeason(new Date());

/** The server has no timezone worth trusting, so it reports "unknown". */
const getServerSnapshot = (): Season | null => null;

/**
 * The season the visitor is currently in, or `null` until hydration.
 *
 * Listings sort against the visitor's own clock, but the server pre-renders in
 * its own timezone — sorting on both would hand React a different card order
 * than it rendered. Returning `null` on the server keeps the first client
 * render identical, and the re-sort lands immediately after hydration.
 */
export const useCurrentSeason = (): Season | null =>
  useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
