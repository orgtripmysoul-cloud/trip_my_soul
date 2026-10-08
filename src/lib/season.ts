/**
 * Season helpers shared by the homepage "Find Your Next Healing Journey" grid
 * and the /treks listing. A trek's `months` array is the single source of
 * truth — a season is just the set of months it covers.
 */

export const SEASON_MAP: Record<string, string[]> = {
  "Winter": ["Dec", "Jan", "Feb"],
  "Spring": ["Mar", "Apr"],
  "Summer": ["May", "Jun"],
  "Monsoon": ["Jul", "Aug"],
  "Autumn": ["Sep", "Oct", "Nov"],
};

/** Calendar order, used to pick the season the current date falls in. */
export const SEASON_ORDER = ["Winter", "Spring", "Summer", "Monsoon", "Autumn"] as const;

export type Season = (typeof SEASON_ORDER)[number];

const MONTH_ABBR = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

/** Reverse lookup: "Jan" → "Winter". */
const MONTH_TO_SEASON: Record<string, Season> = Object.fromEntries(
  SEASON_ORDER.flatMap((season) => SEASON_MAP[season].map((month) => [month, season]))
) as Record<string, Season>;

/** The season today falls in, so listings can lead with what is runnable now. */
export const currentSeason = (now: Date = new Date()): Season =>
  MONTH_TO_SEASON[MONTH_ABBR[now.getMonth()]];

/** Every season a trek runs in, in calendar order. */
export const seasonsOf = (months: string[] | undefined): Season[] => {
  const found = new Set<Season>();
  (months || []).forEach((m) => {
    const season = MONTH_TO_SEASON[m];
    if (season) found.add(season);
  });
  return SEASON_ORDER.filter((season) => found.has(season));
};

/**
 * Sort key for "by season": seasons cycle forward from `from`, so the trips you
 * can actually book next lead the list. Treks with no usable month data sink to
 * the bottom rather than jumping the queue.
 */
export const seasonRank = (months: string[] | undefined, from: Season): number => {
  const start = SEASON_ORDER.indexOf(from);
  const ranks = seasonsOf(months).map(
    (season) => (SEASON_ORDER.indexOf(season) - start + SEASON_ORDER.length) % SEASON_ORDER.length
  );
  return ranks.length > 0 ? Math.min(...ranks) : SEASON_ORDER.length;
};
