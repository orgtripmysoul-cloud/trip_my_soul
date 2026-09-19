/**
 * Optional extras a traveller can add to a booking.
 *
 * One source for both the read-only "View Add-ons" panel on the detail page and
 * the checkout picker, so a price never drifts between where it is advertised
 * and where it is charged.
 */

export type TrekAddOnKey = "insurance" | "offload";

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
    price: 240,
  },
  {
    key: "offload",
    label: "Backpack Offloading (to Mule/Porter)",
    description: "A porter carries your main 12 kg backpack on the trail.",
    price: 1000,
  },
];

export const TREK_ADD_ON_KEYS: TrekAddOnKey[] = TREK_ADD_ONS.map((a) => a.key);
