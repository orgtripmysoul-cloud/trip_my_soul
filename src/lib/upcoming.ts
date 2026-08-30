/**
 * The "Upcoming Departures" window, shared by every catalogue that offers the
 * filter — the homepage grid, `/treks`, and the trip catalogue pages.
 *
 * Previously each of the three carried its own copy of this rule and the copies
 * disagreed: the homepage read real dates but fell back to an operating-month
 * overlap, while `/treks` and the trip catalogue only ever compared months. An
 * operating month is a season, not a departure, so under either month rule
 * every undated entry in the catalogue matched and the filter selected all 76
 * of them. A departure is a date; entries without one are simply not upcoming.
 */

import type { Trek } from "@/data/db";

/** How far ahead the "Upcoming" filter looks for a departure. */
export const UPCOMING_WINDOW_DAYS = 60;

export const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** Parses a seeded batch label like "05 Oct" under year key "2026". */
export const parseBatchDate = (startDate: string, year: string): Date | null => {
  const match = startDate.trim().match(/^(\d{1,2})\s+([A-Za-z]{3})/);
  if (!match) return null;
  const monthIdx = MONTH_NAMES.indexOf(match[2].slice(0, 1).toUpperCase() + match[2].slice(1, 3).toLowerCase());
  if (monthIdx < 0) return null;
  return new Date(Number(year), monthIdx, Number(match[1]));
};

/**
 * Every published departure for an entry. Explicit ISO `batchDates` win over
 * the hand-seeded `batches` block; `batchDates` may be passed separately for
 * catalogue trips, which carry them outside the adapted `Trek`.
 */
export const trekDepartures = (trek: Trek, batchDates?: string[]): Date[] => {
  const dates = batchDates ?? trek.batchDates;
  if (dates?.length) {
    return dates
      .map((iso) => new Date(`${iso}T00:00:00`))
      .filter((date) => !Number.isNaN(date.getTime()));
  }

  const years = trek.batches?.years ?? {};
  return Object.entries(years).flatMap(([year, block]) =>
    (block?.months ?? []).flatMap((monthBlock) =>
      monthBlock.trips
        .map((trip) => parseBatchDate(trip.startDate, year))
        .filter((date): date is Date => date !== null)
    )
  );
};

/**
 * True when the entry has a published departure inside the window. An entry
 * that publishes no departure at all is not upcoming — see the note above.
 */
export const departsWithinWindow = (
  trek: Trek,
  batchDates?: string[],
  days = UPCOMING_WINDOW_DAYS
): boolean => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const until = new Date(today);
  until.setDate(until.getDate() + days);

  return trekDepartures(trek, batchDates).some((date) => date >= today && date <= until);
};
