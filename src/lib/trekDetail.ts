/**
 * Resolver for the detail page shared by treks and trips.
 *
 * Merges a listing's real data over the shared fallbacks in `trekDefaults.ts`
 * and derives the values the page computes (seasons, trail type, transport
 * hubs, departure batches). Components consume the resolved object and stay
 * presentational — they never reach for a default themselves.
 *
 * Trips reach this through `tripToTrek` in `src/data/trips.ts`, so both
 * catalogues render through one page and one model.
 */

import type { BatchMonth, DayTimeNote, ItineraryDay, Trek, TrekBatches } from "@/data/db";
import {
  BATCH_YEAR,
  DEFAULT_BATCH_MONTHS,
  DEFAULT_CANCELLATION_TIERS,
  DEFAULT_EMERGENCY_CANCELLATION,
  DEFAULT_EQUIPMENT_PROVIDED,
  DEFAULT_EXCLUSIONS,
  DEFAULT_FAQS,
  DEFAULT_HEALTH_CHECKLIST,
  DEFAULT_INCLUSIONS,
  DEFAULT_PACKING_LIST,
  DEFAULT_PERSONAL_EQUIPMENT,
  DEFAULT_PRICE,
  ELIGIBILITY_PARAGRAPHS,
  HERO_IMAGE,
  buildEligibilityParagraphs,
  KIDS_DEFAULTS,
  OVERVIEW_DEFAULTS,
  TRANSPORT_BY_REGION,
  buildAboutParagraphs,
  buildDefaultReviews,
  buildDefaultTrailVideos,
  generateMockItinerary,
} from "@/data/trekDefaults";

/** Day shape after normalisation — every field the itinerary views need. */
export interface NormalizedItineraryDay {
  day: number;
  title: string;
  altitudePoints: { location: string; m: number; ft: number }[];
  altitudeGain: { m: number; ft: number } | null;
  driveDistance?: string;
  drivingTime?: string;
  trekDistance?: string;
  trekDuration?: string;
  detailedDescription: string;
  detailedParagraphs?: string[];
  highlights?: string[];
  timeNote?: DayTimeNote;
  entries?: { time?: string; text: string }[];
  meals?: string;
  stayType?: string;
}

/** Extra Day-1 logistics shown in the Quick Itinerary. */
export interface QuickItineraryDay {
  day: number;
  title: string;
  driveDistance?: string;
  drivingTime?: string;
  pickupPoint?: string;
  pickupTime?: string;
  basecamp?: string;
  transportDetails?: string;
}

const MONTH_LABELS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function toDayCount(days: Trek["days"]): number {
  if (typeof days === "number") return days;
  return parseInt(String(days ?? "5"), 10) || 5;
}

/** Winter/Spring/Summer/Monsoon/Autumn, derived from the listing's months. */
export function deriveSeasons(months: string[] = []): string {
  const list: string[] = [];
  if (months.some((m) => ["Dec", "Jan", "Feb"].includes(m))) list.push("Winter");
  if (months.some((m) => ["Mar", "Apr"].includes(m))) list.push("Spring");
  if (months.some((m) => ["May", "Jun"].includes(m))) list.push("Summer");
  if (months.some((m) => ["Jul", "Aug"].includes(m))) list.push("Monsoon");
  if (months.some((m) => ["Sep", "Oct", "Nov"].includes(m))) list.push("Autumn");
  return list.join(", ") || "TBD";
}

/** Human-readable trail description, derived from the listing's themes. */
export function deriveTrailType(themes: string[] = []): string {
  const list: string[] = [];
  if (themes.includes("Snow")) list.push("Snow Trails");
  if (themes.includes("Meadow")) list.push("Alpine Meadows");
  if (themes.includes("Forest")) list.push("Forest Canopy Walks");
  if (themes.includes("Pass Crossing")) list.push("Pass Crossings");
  if (themes.includes("Glacier")) list.push("Glacier Moraine");
  if (themes.includes("Lake") || themes.includes("Lakes")) list.push("Lakeside Walk");
  if (themes.includes("Beach")) list.push("Coastal Trails");
  if (themes.includes("Wildlife")) list.push("Wildlife Reserves");
  if (themes.includes("Temple") || themes.includes("Pilgrimage")) list.push("Pilgrim Routes");
  return list.join(" & ") || "Mountain Trails";
}

export function deriveTransport(region: string) {
  const reg = region.toLowerCase();
  if (reg.includes("uttarakhand")) return TRANSPORT_BY_REGION.uttarakhand;
  if (reg.includes("himachal")) return TRANSPORT_BY_REGION.himachal;
  if (reg.includes("ladakh")) return TRANSPORT_BY_REGION.ladakh;
  if (reg.includes("kashmir") || reg.includes("jammu")) return TRANSPORT_BY_REGION.kashmir;
  if (reg.includes("kerala")) return TRANSPORT_BY_REGION.kerala;
  if (reg.includes("karnataka")) return TRANSPORT_BY_REGION.karnataka;
  if (reg.includes("tamil")) return TRANSPORT_BY_REGION.tamilnadu;
  if (reg.includes("meghalaya") || reg.includes("assam")) return TRANSPORT_BY_REGION.meghalaya;
  return TRANSPORT_BY_REGION.default;
}

/**
 * Turns a flat list of ISO start dates into the month-grouped batch blocks the
 * departures picker renders. The end date is the start plus the trip length,
 * built from UTC parts so a date never drifts across the viewer's timezone.
 *
 * Blocks are keyed by year *and* month so a listing whose dates run past
 * December keeps "Oct 2026" and "Oct 2027" apart; for the single-year lists in
 * the catalogue today the output is unchanged apart from the `year` field.
 */
export function batchMonthsFromDates(dates: string[], days: number): BatchMonth[] {
  const byMonth = new Map<string, BatchMonth>();

  for (const iso of dates) {
    const [y, m, d] = iso.split("-").map(Number);
    if (!y || !m || !d) continue;

    const start = new Date(Date.UTC(y, m - 1, d));
    const end = new Date(Date.UTC(y, m - 1, d + Math.max(days - 1, 0)));
    const label = (dt: Date) =>
      `${String(dt.getUTCDate()).padStart(2, "0")} ${MONTH_LABELS[dt.getUTCMonth()]}`;

    const month = MONTH_LABELS[start.getUTCMonth()];
    const year = String(start.getUTCFullYear());
    const key = `${year}-${month}`;
    if (!byMonth.has(key)) byMonth.set(key, { month, year, trips: [] });
    byMonth.get(key)!.trips.push({
      startDate: label(start),
      endDate: label(end),
      status: "Open",
    });
  }

  return [...byMonth.values()];
}

/**
 * Fills every field the Quick / Detailed / Graph itinerary views read.
 *
 * `synthesize` is on for treks, where the generic altitude/drive/meal figures in
 * `trekDefaults.ts` stand in for missing data. Trips pass `false`: a day shows
 * only what its own itinerary states.
 */
export function normalizeItinerary(
  itinerary: ItineraryDay[],
  synthesize: boolean = true
): NormalizedItineraryDay[] {
  const lastDay = itinerary.length ? itinerary[itinerary.length - 1].day : 0;

  return itinerary.map((item) => {
    const simpleDesc = item.description || (synthesize ? "TBD" : "");
    const isTransferDay = item.day <= 1 || item.day === lastDay;
    const fill = <T,>(value: T | undefined, fallback: T) =>
      value !== undefined ? value : synthesize ? fallback : undefined;

    return {
      day: item.day,
      title: item.title,
      entries: item.entries,
      detailedParagraphs: item.detailedParagraphs,
      highlights: item.highlights,
      /** Day 1 falls back to its own pickup time where no note is published. */
      timeNote:
        item.timeNote ?? (item.pickupTime ? { label: "Pickup", value: item.pickupTime } : undefined),
      altitudePoints:
        item.altitudePoints ??
        (synthesize
          ? [
              { location: "Start camp", m: 600, ft: 2000 },
              { location: "End camp", m: 600 + item.day * 400, ft: 2000 + item.day * 1500 },
            ]
          : []),
      altitudeGain: item.altitudeGain ?? (synthesize ? { m: 400, ft: 1500 } : null),
      driveDistance: fill(item.driveDistance, isTransferDay ? "198 km" : undefined),
      drivingTime: fill(item.drivingTime, isTransferDay ? "8-9 Hours" : undefined),
      trekDistance: fill(item.trekDistance, !isTransferDay ? "5-6 km" : undefined),
      trekDuration: fill(item.trekDuration, !isTransferDay ? "4-5 Hours" : undefined),
      detailedDescription: item.detailedDescription || simpleDesc,
      meals: fill(item.meals, item.day === lastDay ? "Breakfast, Lunch" : "Breakfast, Lunch, Dinner"),
      stayType: fill(item.stayType, isTransferDay ? "Hotel / Homestay" : "Alpine Campsite tents"),
    };
  });
}

/** Day-1 pickup/basecamp details vary by trek; Buran Ghati starts from Shimla. */
export function normalizeQuickItinerary(
  itinerary: ItineraryDay[],
  trekName: string,
  startLocation?: string,
  synthesize: boolean = true
): QuickItineraryDay[] {
  const isBuran = trekName.toLowerCase().includes("buran");
  const basecampText = startLocation || (isBuran ? "Janglik (9,415 ft)" : "Sankri (6,400 ft)");
  const pickupPointText = startLocation
    ? `${startLocation} pickup point`
    : isBuran
    ? "Shimla Railway Station"
    : "Dehradun Railway Station";
  const firstDay = itinerary.length ? itinerary[0].day : 1;

  return itinerary.map((item) => {
    const isTransferDay = item.day === firstDay || item.day === 5 || item.day === 7;
    const isFirst = item.day === firstDay;
    /** A day's own pickup details win over the generic hub and time. */
    const dayPickupPoint = item.pickupPoint || pickupPointText;
    const dayPickupTime = item.pickupTime || (synthesize ? "9:30 AM" : undefined);
    return {
      day: item.day,
      title: item.title,
      driveDistance: item.driveDistance || (synthesize && isTransferDay ? "150 km" : undefined),
      drivingTime: item.drivingTime || (synthesize && isTransferDay ? "7-8 Hours" : undefined),
      pickupPoint: isFirst ? dayPickupPoint : undefined,
      pickupTime: isFirst ? dayPickupTime : undefined,
      basecamp: isFirst ? basecampText : undefined,
      transportDetails:
        isFirst && synthesize
          ? `Transport organised from ${dayPickupPoint} at ${dayPickupTime}. Cost per vehicle shared among trekkers.`
          : undefined,
    };
  });
}

/**
 * Every published month block, in year order, each stamped with the year it
 * departs in.
 *
 * A winter schedule runs past December, so its blocks live under two year keys
 * ("2026" and "2027"); reading a single year would silently drop half the
 * season. The blocks are flattened instead, and the picker keeps the months
 * apart by their own `year`.
 */
export function batchMonthsFromBatches(batches: TrekBatches): BatchMonth[] {
  return Object.entries(batches.years ?? {})
    .sort(([a], [b]) => a.localeCompare(b))
    .flatMap(([year, block]) =>
      (block?.months ?? []).map((month) => ({ ...month, year: month.year ?? year }))
    );
}

export type ResolvedTrekDetail = ReturnType<typeof resolveTrekDetail>;

export function resolveTrekDetail(trek: Trek) {
  /**
   * Treks fill their gaps from the generic Himalayan copy; trips do not, so an
   * unpopulated section renders empty instead of claiming a 12,500 ft summit.
   */
  const fb = trek.useTrekFallbacks !== false;

  const itinerary = trek.itinerary?.length
    ? trek.itinerary
    : fb
    ? generateMockItinerary(toDayCount(trek.days))
    : [];

  const publishedBatchMonths = trek.batches ? batchMonthsFromBatches(trek.batches) : [];

  const batchMonths: BatchMonth[] = publishedBatchMonths.length
    ? publishedBatchMonths
    : trek.batchDates?.length
    ? batchMonthsFromDates(trek.batchDates, toDayCount(trek.days))
    : fb
    ? DEFAULT_BATCH_MONTHS
    : [];

  return {
    trek,
    useTrekFallbacks: fb,
    /**
     * `null` where the source publishes no rate — rendered as "On request"
     * rather than a fabricated figure.
     */
    price: trek.price ?? (fb ? DEFAULT_PRICE : null),
    originalPrice: trek.originalPrice,
    heroImage: trek.heroImage ?? HERO_IMAGE,
    /** Hero slideshow frames; a single entry renders as a still image. */
    heroImages:
      trek.heroImages && trek.heroImages.length > 0
        ? trek.heroImages
        : [trek.heroImage ?? HERO_IMAGE],
    detailsPath: trek.detailsPath ?? `/treks/${trek.slug}`,

    // Derived overview facts
    seasons: deriveSeasons(trek.months),
    trailType: deriveTrailType(trek.themes),
    transport: trek.transport ?? deriveTransport(trek.region),
    /** Published travel copy, where the listing has it; else `transport` alone. */
    howToReach: trek.howToReach,
    country: OVERVIEW_DEFAULTS.country,
    maxAltitude: trek.maxAltitude ?? (fb ? OVERVIEW_DEFAULTS.maxAltitude : undefined),
    totalDistance: trek.totalDistance ?? (fb ? OVERVIEW_DEFAULTS.totalDistance : undefined),
    cateringFood: fb ? OVERVIEW_DEFAULTS.cateringFood : undefined,
    campStay: fb ? OVERVIEW_DEFAULTS.campStay : undefined,

    // Header extras
    tripCode: trek.tripCode,
    availability: trek.availability,
    endLocation: trek.endLocation,
    minAge: trek.minAge,
    maxAge: trek.maxAge,
    maxGroupSize: trek.maxGroupSize,

    // Itinerary
    itinerary,
    normalizedItinerary: normalizeItinerary(itinerary, fb),
    quickItinerary: normalizeQuickItinerary(itinerary, trek.name, trek.startLocation, fb),

    // Cost terms
    inclusions: trek.inclusions ?? (fb ? DEFAULT_INCLUSIONS : []),
    exclusions: trek.exclusions ?? (fb ? DEFAULT_EXCLUSIONS : []),
    batchMonths,
    /**
     * Year used by month blocks that carry none of their own. Blocks from
     * `batches` and `batchDates` are stamped individually, so this only backs
     * the hand-seeded defaults.
     */
    batchYear: batchMonths[0]?.year ?? trek.batchDates?.[0]?.slice(0, 4) ?? BATCH_YEAR,
    routeVariants: trek.routeVariants ?? [],
    packages: trek.packages ?? [],
    priceNote: trek.priceNote,
    bookingAdvance: trek.bookingAdvance,
    bookingAdvancePct: trek.bookingAdvancePct,
    bookingTerms: trek.bookingTerms ?? [],
    balanceDueDays: trek.balanceDueDays,
    kidsPolicy: trek.kidsPolicy,
    confirmationPolicy: trek.confirmationPolicy,

    // Reference content
    packingList: trek.packingList ?? (fb ? DEFAULT_PACKING_LIST : []),
    equipmentProvided: trek.equipmentProvided ?? DEFAULT_EQUIPMENT_PROVIDED,
    personalEquipment: trek.personalEquipment ?? DEFAULT_PERSONAL_EQUIPMENT,
    cancellationTiers: trek.cancellationTiers ?? DEFAULT_CANCELLATION_TIERS,
    cancellationPolicyText: trek.cancellationPolicyText,
    emergencyCancellation: trek.emergencyCancellation ?? DEFAULT_EMERGENCY_CANCELLATION,
    healthChecklist: trek.healthChecklist ?? DEFAULT_HEALTH_CHECKLIST,
    faqs: trek.faqs ?? (fb ? DEFAULT_FAQS : []),

    // Logistics & contact
    thingsToRemember: trek.thingsToRemember ?? [],
    transportModes: trek.transportModes ?? [],
    rentalGear: trek.rentalGear ?? [],
    contactPhone: trek.contactPhone,
    contactNumbers: trek.contactNumbers ?? [],
    sourceCaveat: trek.sourceCaveat,

    // Kids guidelines
    minAgeWithGuardian: trek.minAgeWithGuardian ?? KIDS_DEFAULTS.minAgeWithGuardian,
    soloAgeMin: trek.soloAgeMin ?? KIDS_DEFAULTS.soloAgeMin,
    disclaimerFormUrl: trek.disclaimerFormUrl ?? KIDS_DEFAULTS.disclaimerFormUrl,

    // Media & copy
    gallery: trek.gallery ?? [],
    videoTestimonials: trek.videoTestimonials ?? [],
    externalReviews: trek.externalReviews ?? [],
    reviewVideos: trek.reviewVideos ?? [],
    relatedArticles: trek.relatedArticles ?? [],
    /** Undefined where no guide is published — the Article section shows its teaser instead. */
    article: trek.article,
    reviews: buildDefaultReviews(trek.name),
    trailVideos: buildDefaultTrailVideos(trek.name),
    aboutParagraphs:
      trek.aboutParagraphs ??
      (trek.intro ? [trek.intro] : fb ? buildAboutParagraphs(trek.name) : []),
    highlights: trek.highlights ?? [],
    usps: trek.usps ?? [],
    idealFor: trek.idealFor,
    differentiators: trek.differentiators ?? [],
    importantNote: trek.importantNote,
    destinationHighlights: trek.destinationHighlights ?? [],
    eligibilityCriteria: trek.eligibilityCriteria ?? [],
    fitnessCriteria: trek.fitnessCriteria ?? [],
    eligibilityParagraphs: fb
      ? ELIGIBILITY_PARAGRAPHS
      : buildEligibilityParagraphs(trek.difficulty, trek.minAge, trek.maxAge),
  };
}
