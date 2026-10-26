/**
 * Optional extras a traveller can add to a booking.
 *
 * One source for both the read-only "View Add-ons" panel on the detail page and
 * the checkout picker, so a price never drifts between where it is advertised
 * and where it is charged.
 */

export type TrekAddOnKey = "insurance" | "offload" | "gear" | "twinSharing";

export interface TrekAddOn {
  key: TrekAddOnKey;
  label: string;
  /** One line on what the fee actually buys. */
  description: string;
  /** Per person, in ₹. */
  price: number;
}

export const TREK_ADD_ONS: TrekAddOn[] = [
  {
    key: "insurance",
    label: "Medical & Trek Insurance",
    description: "Covers high altitude emergency hospitalization and evacuation.",
    price: 600,
  },
  {
    key: "offload",
    label: "Backpack Offloading (to Mule/Porter)",
    description: "A porter carries your main 12 kg backpack on the trail.",
    price: 2000,
  },
  {
    key: "gear",
    label: "Rental Gear",
    description: "Trek shoes, trekking pole, jacket and backpack on hire for the full trek.",
    price: 1500,
  },
  {
    key: "twinSharing",
    label: "Twin Sharing Stay",
    description: "Share your room and tent with one partner of your choice, instead of the default sharing basis.",
    price: 2000,
  },
];

export const TREK_ADD_ON_KEYS: TrekAddOnKey[] = TREK_ADD_ONS.map((a) => a.key);

/**
 * Trips whose camps are already sold on a fixed triple/quad-sharing basis, so
 * the twin-sharing upgrade cannot be offered on them. Every other trek, trip
 * and yatra is eligible. Add a slug here when an itinerary commits a campsite
 * to triple or quad sharing.
 */
export const TWIN_SHARING_EXCLUDED_SLUGS: readonly string[] = [
  "kuari-pass-trek",
  "pangarchulla-trek",
  "brahmatal-trek",
];

/** True when `key` may be sold on the trip with this slug. */
export function isAddOnAvailableForTrip(key: TrekAddOnKey, slug: string | undefined): boolean {
  if (key !== "twinSharing") return true;
  return !!slug && !TWIN_SHARING_EXCLUDED_SLUGS.includes(slug);
}

/** The add-ons actually bookable on one trip, in display order. */
export function getAddOnsForTrip(slug: string | undefined): TrekAddOn[] {
  return TREK_ADD_ONS.filter((addOn) => isAddOnAvailableForTrip(addOn.key, slug));
}
