/**
 * Resolver for the trek detail page.
 *
 * Merges a trek's real data over the shared fallbacks in `trekDefaults.ts` and
 * derives the values the page computes (seasons, trail type, transport hubs).
 * Components consume the resolved object and stay presentational — they never
 * reach for a default themselves.
 */

import type { BatchMonth, ItineraryDay, Trek } from "@/data/db";
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
  meals: string;
  stayType: string;
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

function toDayCount(days: Trek["days"]): number {
  if (typeof days === "number") return days;
  return parseInt(String(days ?? "5"), 10) || 5;
}

/** Winter/Spring/Summer/Monsoon/Autumn, derived from the trek's months. */
export function deriveSeasons(months: string[] = []): string {
  const list: string[] = [];
  if (months.some((m) => ["Dec", "Jan", "Feb"].includes(m))) list.push("Winter");
  if (months.some((m) => ["Mar", "Apr"].includes(m))) list.push("Spring");
  if (months.some((m) => ["May", "Jun"].includes(m))) list.push("Summer");
  if (months.some((m) => ["Jul", "Aug"].includes(m))) list.push("Monsoon");
  if (months.some((m) => ["Sep", "Oct", "Nov"].includes(m))) list.push("Autumn");
  return list.join(", ") || "TBD";
}

/** Human-readable trail description, derived from the trek's themes. */
export function deriveTrailType(themes: string[] = []): string {
  const list: string[] = [];
  if (themes.includes("Snow")) list.push("Snow Trails");
  if (themes.includes("Meadow")) list.push("Alpine Meadows");
  if (themes.includes("Forest")) list.push("Forest Canopy Walks");
  if (themes.includes("Pass Crossing")) list.push("Pass Crossings");
  if (themes.includes("Glacier")) list.push("Glacier Moraine");
  if (themes.includes("Lake")) list.push("Lakeside Walk");
  return list.join(" & ") || "Mountain Trails";
}

export function deriveTransport(region: string) {
  const reg = region.toLowerCase();
  if (reg.includes("uttarakhand")) return TRANSPORT_BY_REGION.uttarakhand;
  if (reg.includes("himachal")) return TRANSPORT_BY_REGION.himachal;
  return TRANSPORT_BY_REGION.default;
}

/** Fills every field the Quick / Detailed / Graph itinerary views read. */
export function normalizeItinerary(itinerary: ItineraryDay[]): NormalizedItineraryDay[] {
  return itinerary.map((item) => {
    const simpleDesc = item.description || "TBD";
    return {
      day: item.day,
      title: item.title,
      altitudePoints: item.altitudePoints || [
        { location: "Start camp", m: 600, ft: 2000 },
        { location: "End camp", m: 600 + item.day * 400, ft: 2000 + item.day * 1500 },
      ],
      altitudeGain: item.altitudeGain || { m: 400, ft: 1500 },
      driveDistance: item.driveDistance || (item.day === 1 || item.day === 5 ? "198 km" : undefined),
      drivingTime: item.drivingTime || (item.day === 1 || item.day === 5 ? "8-9 Hours" : undefined),
      trekDistance: item.trekDistance || (item.day > 1 && item.day < 5 ? "5-6 km" : undefined),
      trekDuration: item.trekDuration || (item.day > 1 && item.day < 5 ? "4-5 Hours" : undefined),
      detailedDescription: item.detailedDescription || simpleDesc,
      meals: item.meals || (item.day === 5 ? "Breakfast, Lunch" : "Breakfast, Lunch, Dinner"),
      stayType: item.stayType || (item.day === 1 || item.day === 5 ? "Hotel / Homestay" : "Alpine Campsite tents"),
    };
  });
}

/** Day-1 pickup/basecamp details vary by trek; Buran Ghati starts from Shimla. */
export function normalizeQuickItinerary(
  itinerary: ItineraryDay[],
  trekName: string
): QuickItineraryDay[] {
  const isBuran = trekName.toLowerCase().includes("buran");
  const basecampText = isBuran ? "Janglik (9,415 ft)" : "Sankri (6,400 ft)";
  const pickupPointText = isBuran ? "Shimla Railway Station" : "Dehradun Railway Station";

  return itinerary.map((item) => {
    const isTransferDay = item.day === 1 || item.day === 5 || item.day === 7;
    return {
      day: item.day,
      title: item.title,
      driveDistance: item.driveDistance || (isTransferDay ? "150 km" : undefined),
      drivingTime: item.drivingTime || (isTransferDay ? "7-8 Hours" : undefined),
      pickupPoint: item.day === 1 ? pickupPointText : undefined,
      pickupTime: item.day === 1 ? "9:30 AM" : undefined,
      basecamp: item.day === 1 ? basecampText : undefined,
      transportDetails:
        item.day === 1
          ? `Transport organised from ${pickupPointText} at 9:30 AM. Cost per vehicle shared among trekkers.`
          : undefined,
    };
  });
}

export type ResolvedTrekDetail = ReturnType<typeof resolveTrekDetail>;

export function resolveTrekDetail(trek: Trek) {
  const itinerary = trek.itinerary?.length
    ? trek.itinerary
    : generateMockItinerary(toDayCount(trek.days));

  const batchMonths: BatchMonth[] =
    trek.batches?.years?.[BATCH_YEAR]?.months ?? DEFAULT_BATCH_MONTHS;

  return {
    trek,
    price: trek.price ?? DEFAULT_PRICE,

    // Derived overview facts
    seasons: deriveSeasons(trek.months),
    trailType: deriveTrailType(trek.themes),
    transport: deriveTransport(trek.region),
    country: OVERVIEW_DEFAULTS.country,
    maxAltitude: trek.maxAltitude ?? OVERVIEW_DEFAULTS.maxAltitude,
    totalDistance: trek.totalDistance ?? OVERVIEW_DEFAULTS.totalDistance,
    cateringFood: OVERVIEW_DEFAULTS.cateringFood,
    campStay: OVERVIEW_DEFAULTS.campStay,

    // Itinerary
    itinerary,
    normalizedItinerary: normalizeItinerary(itinerary),
    quickItinerary: normalizeQuickItinerary(itinerary, trek.name),

    // Cost terms
    inclusions: trek.inclusions ?? DEFAULT_INCLUSIONS,
    exclusions: trek.exclusions ?? DEFAULT_EXCLUSIONS,
    batchMonths,
    routeVariants: trek.routeVariants ?? [],

    // Reference content
    packingList: DEFAULT_PACKING_LIST,
    equipmentProvided: trek.equipmentProvided ?? DEFAULT_EQUIPMENT_PROVIDED,
    personalEquipment: trek.personalEquipment ?? DEFAULT_PERSONAL_EQUIPMENT,
    cancellationTiers: trek.cancellationTiers ?? DEFAULT_CANCELLATION_TIERS,
    emergencyCancellation: trek.emergencyCancellation ?? DEFAULT_EMERGENCY_CANCELLATION,
    healthChecklist: trek.healthChecklist ?? DEFAULT_HEALTH_CHECKLIST,
    faqs: trek.faqs ?? DEFAULT_FAQS,

    // Kids guidelines
    minAgeWithGuardian: trek.minAgeWithGuardian ?? KIDS_DEFAULTS.minAgeWithGuardian,
    soloAgeMin: trek.soloAgeMin ?? KIDS_DEFAULTS.soloAgeMin,
    disclaimerFormUrl: trek.disclaimerFormUrl ?? KIDS_DEFAULTS.disclaimerFormUrl,

    // Media & copy
    gallery: trek.gallery ?? [],
    videoTestimonials: trek.videoTestimonials ?? [],
    relatedArticles: trek.relatedArticles ?? [],
    reviews: buildDefaultReviews(trek.name),
    trailVideos: buildDefaultTrailVideos(trek.name),
    aboutParagraphs: buildAboutParagraphs(trek.name),
    eligibilityParagraphs: ELIGIBILITY_PARAGRAPHS,
  };
}
