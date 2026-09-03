/**
 * Content shared across trip entries.
 *
 * Anything that would otherwise be copy-pasted between trips lives here, so a
 * wording change happens once. Sourced from the TripMySoul trip PDFs; the
 * public policy pages at /policies/* carry the same terms in long form.
 */

import type { EquipmentGroup } from "@/data/db";

/** Enquiry numbers printed across the Himalayan trip PDFs. */
export const TRIP_CONTACT_NUMBERS = ["+91 90685 13438", "+91 81786 13438", "+91 97209 42463"];

/** Pay to receive confirmation; balance collected on arrival. */
export const CONFIRMATION_POLICY =
  "Your booking is confirmed once payment is received and Trip My Soul has emailed your confirmation. The remaining amount is collected on arrival.";

/** Vehicle allocated by group size, as printed on the Himalayan trip PDFs. */
export const TRANSPORT_BY_GROUP_SIZE: { group: string; vehicle: string }[] = [
  { group: "4 members", vehicle: "Hatchback — Alto / Swift or equivalent" },
  { group: "5–8 members", vehicle: "Tata Sumo / Mahindra Bolero or equivalent / Ertiga" },
  { group: "9–14 / 17 members", vehicle: "Tempo Traveller" },
  { group: "26–45 members", vehicle: "Bus (larger treks only)" },
];

/** Sliding-scale cancellation used by the Himalayan trips. */
export const TIERED_CANCELLATION_POLICY =
  "Cancel 30 or more days before travel and a 25% cancellation fee applies. Between 15 and 30 days, 50%. Within 15 days of departure, 100% — no refund.";

/** Packing list carried across the Himalayan trek itineraries. */
export const HIMALAYAN_TREK_PACKING_LIST: EquipmentGroup[] = [
  {
    category: "Pack & poles",
    items: ["Rucksack with rain cover", "Trekking poles", "Day backpack"],
  },
  {
    category: "Clothing",
    items: [
      "Thermals",
      "Quick-dry t-shirts",
      "Fleece jacket",
      "Trek pants",
      "Woollen cap and buff",
      "Waterproof gloves",
      "Woollen socks",
    ],
  },
  {
    category: "Footwear",
    items: ["Trekking shoes", "Camping slippers"],
  },
  {
    category: "Essentials",
    items: [
      "Personal first aid kit",
      "Rain gear",
      "Sun cap and sunglasses",
      "Sunscreen and lip balm",
      "Water bottle",
      "Power bank",
    ],
  },
];

/** On-site rental, priced per item per trek. */
export const TREK_RENTAL_GEAR: { item: string; price: number }[] = [
  { item: "Trekking shoes", price: 500 },
  { item: "Jacket", price: 500 },
  { item: "Backpack", price: 500 },
  { item: "Trek pants", price: 250 },
  { item: "Woollen cap", price: 150 },
  { item: "Waterproof gloves", price: 150 },
  { item: "Water bottle", price: 150 },
  { item: "Headlamp", price: 100 },
  { item: "Sunglasses", price: 100 },
  { item: "Rain cover", price: 100 },
  { item: "Buff", price: 100 },
  { item: "Socks", price: 100 },
];

/** Exclusions repeated verbatim across the Himalayan trek PDFs. */
export const HIMALAYAN_TREK_EXCLUSIONS = [
  "5% GST",
  "Travel and health insurance",
  "Meals during transportation",
  "Airfare and train fare",
  "Medical expenses",
  "Tips, laundry and personal expenses",
  "Costs arising from unscheduled delays such as landslides",
  "Force majeure and evacuation charges",
  "Anything not listed under inclusions",
];

/** Standard booking terms for short group trips. */
export const TRIP_BOOKING_TERMS = {
  advancePerPerson: 2000,
  balanceDueDays: 10,
  summary:
    "Deposit ₹2,000 per person as advance to confirm your seat. The remaining payment must be made 10 days before the trip departure date.",
};

/**
 * Packing list for warm, humid, coastal trips — Kerala and similar.
 * Deliberately separate from the Himalayan list in `trekDefaults.ts`, which is
 * built around sub-zero camping.
 */
export const TROPICAL_PACKING_LIST: EquipmentGroup[] = [
  {
    category: "Clothing essentials",
    items: [
      "Light cotton clothes (t-shirts, shirts, dresses)",
      "Shorts / loose pants",
      "Swimwear for beaches and backwaters",
      "Light jacket or shawl for Munnar / Thekkady",
      "Raincoat or poncho, especially during monsoon",
      "Comfortable walking shoes and slippers",
    ],
  },
  {
    category: "Personal care & toiletries",
    items: [
      "Sunscreen (SPF 30+)",
      "Mosquito repellent — important in the backwaters",
      "Shampoo, soap, toothbrush",
      "Hand sanitizer and wet wipes",
      "Personal medications",
    ],
  },
  {
    category: "Travel essentials & documents",
    items: [
      "Government ID (Aadhaar / Passport)",
      "Tickets and hotel bookings",
      "Mobile phone and charger",
      "Power bank",
      "Small backpack for daily use",
    ],
  },
  {
    category: "Weather-specific",
    items: [
      "Umbrella — Kerala weather changes quickly",
      "Sunglasses and cap or hat",
      "Waterproof bag cover",
      "Extra socks, for humidity and rain",
    ],
  },
  {
    category: "Optional but useful",
    items: ["Camera", "Snacks / energy bars", "Reusable water bottle"],
  },
];

export const TROPICAL_PACKING_PRO_TIPS: string[] = [
  "Kerala is humid — pack light, breathable clothes.",
  "Carry a light sweater for hill stops like Munnar.",
  "For beaches like Varkala, bring flip-flops and beachwear.",
];

/**
 * Short "things to remember" list shown on the trip page.
 * The binding long-form terms are `TRIP_TERMS_SECTIONS` below.
 */
export const TRIP_GROUND_RULES: string[] = [
  "Accommodation is on a sharing basis, with separate rooms for men and women. Ask in advance for couple sharing.",
  "The itinerary may change for weather or road conditions — your trip captain has the final call on safety.",
  "Transport is allocated by group size, seats on a first-come, first-served basis.",
  "Alcohol and drugs are not permitted during the trip.",
  "Tell us about any medical condition in advance and carry your own medication.",
  "Travel insurance is not included and is strongly recommended.",
  "Carry valid photo ID at all times.",
  "Use the dustbins and avoid single-use plastics.",
];

export interface TermsSection {
  heading: string;
  points: string[];
}

/** Full terms, as printed in the trip PDFs. Shared by every trip. */
export const TRIP_TERMS_SECTIONS: TermsSection[] = [
  {
    heading: "Booking confirmation",
    points: [
      "Your seat is confirmed only after full payment is received.",
      "The advance amount is non-refundable under any circumstances.",
      "Partial payments are not considered bookings.",
    ],
  },
  {
    heading: "Cancellation policy",
    points: [
      "No refund if cancellation is made less than 48 hours before the trip.",
      "50% refund if cancelled 7 days before departure.",
      "If TripMySoul cancels — weather, political unrest, low participation — you receive a full refund, less any transportation cancellation charges.",
    ],
  },
  {
    heading: "Itinerary changes",
    points: [
      "The itinerary may change based on weather, road conditions and other external factors.",
      "Trip captains have full authority to modify the plan to keep participants safe.",
    ],
  },
  {
    heading: "Transportation",
    points: [
      "Transport is provided according to group size and availability.",
      "Seats are allocated on a first-come, first-served basis.",
    ],
  },
  {
    heading: "Behaviour and discipline",
    points: [
      "Participants are expected to cooperate with the team and fellow travellers.",
      "Alcohol and drugs are strictly prohibited during the trip.",
      "Misbehaviour towards participants or staff leads to removal from the trip without refund.",
    ],
  },
  {
    heading: "Liability",
    points: [
      "TripMySoul is not responsible for personal injury, loss of belongings or damage during the trip.",
      "Participants are responsible for their own belongings throughout the journey.",
    ],
  },
  {
    heading: "Medical conditions",
    points: [
      "Tell us about any medical condition in advance.",
      "Carry your personal medication if required.",
    ],
  },
  {
    heading: "Accommodation",
    points: [
      "Accommodation is on a sharing basis — triple or double, unless specified otherwise.",
      "Rooms are arranged separately for men and women.",
      "Couple-sharing rooms can be arranged if you tell the team in advance.",
    ],
  },
  {
    heading: "Travel insurance",
    points: [
      "Travel insurance is not included unless specifically mentioned.",
      "Carry valid identity proof.",
    ],
  },
  {
    heading: "Environmental responsibility",
    points: [
      "Respect nature and do not litter.",
      "Use the dustbins provided and avoid single-use plastics.",
    ],
  },
];

/** Short summary shown above the full terms. */
export const TRIP_CANCELLATION_POLICY =
  "No refund if you cancel less than 48 hours before departure. 50% refund if cancelled 7 days before. If we cancel the trip, you get a full refund less any transportation cancellation charges. The advance is non-refundable in all cases.";

/** Policy pages every trip links to instead of restating the text. */
export const TRIP_POLICY_LINKS = [
  { label: "Terms & Conditions", href: "/policies/terms-conditions" },
  { label: "Cancellation Policy", href: "/policies/cancellation-policy" },
  { label: "Payment & Booking Policy", href: "/policies/payment-policy" },
];
