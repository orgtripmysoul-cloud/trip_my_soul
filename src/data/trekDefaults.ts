/**
 * Fallback content for the trek detail page.
 *
 * Only 2 of 37 treks carry full detail data (see the post-hoc assignments at the
 * bottom of `db.ts`). Everything else renders from here. Previously this content
 * was inlined throughout the page JSX; centralising it means generic copy is
 * edited in one place and each field can be replaced by real CMS data
 * independently — see `resolveTrekDetail` in `src/lib/trekDetail.ts`.
 */

import type {
  BatchMonth,
  CancellationTier,
  EquipmentGroup,
  GalleryImage,
  HealthCheckItem,
  ItineraryDay,
} from "@/data/db";

/**
 * Horizontal section tabs, in page order.
 *
 * `noun` is "Trek" or "Trip" — the sections are identical either way, only the
 * label wording follows the listing type.
 */
export function buildSectionTabs(noun: string = "Trek") {
  const plural = `${noun}s`;
  return [
    { id: "overview", label: "Overview" },
    { id: "about-trek", label: `About ${noun}` },
    { id: "itinerary", label: "Itinerary" },
    { id: "eligibility", label: "Eligibility" },
    { id: "photos", label: "Photos" },
    { id: "how-to-reach", label: "How to Reach" },
    { id: "departures", label: "Departures" },
    { id: "inclusions", label: "Inclusions" },
    { id: "trek-essentials", label: `${noun} Essentials` },
    { id: "cancellation", label: "Cancellation Policy" },
    { id: "faqs", label: "FAQs" },
    { id: "trek-article", label: "Article" },
    { id: "trek-reviews", label: "Reviews & Videos" },
    { id: "similar-treks", label: `Similar ${plural}` },
  ];
}

export const TREK_SECTION_TABS = buildSectionTabs("Trek");

export const DEFAULT_PRICE = 12450;

export const HERO_IMAGE =
  "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1920&q=80";

/**
 * Photo album shown when a listing publishes no `gallery` of its own. Generic
 * Himalayan trail imagery — captions stay descriptive rather than naming a
 * place the photo may not show.
 */
export const DEFAULT_GALLERY: GalleryImage[] = [
  {
    url: "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?auto=format&fit=crop&w=1200&q=80",
    caption: "First light over the ridgeline",
  },
  {
    url: "https://images.unsplash.com/photo-1533240332313-0db49b459ad6?auto=format&fit=crop&w=900&q=80",
    caption: "Camp pitched above the treeline",
  },
  {
    url: "https://images.unsplash.com/photo-1501554728187-ce583db33af7?auto=format&fit=crop&w=900&q=80",
    caption: "Climbing through the pine forest",
  },
  {
    url: "https://images.unsplash.com/photo-1486911278844-a81c5267e227?auto=format&fit=crop&w=900&q=80",
    caption: "Alpine meadows on the approach",
  },
  {
    url: "https://images.unsplash.com/photo-1483721310020-03333e577078?auto=format&fit=crop&w=900&q=80",
    caption: "Snow line before the pass",
  },
  {
    url: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=900&q=80",
    caption: "Clear night sky from basecamp",
  },
  {
    url: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=900&q=80",
    caption: "Trail switchbacks on day two",
  },
  {
    url: "https://images.unsplash.com/photo-1464278533981-50106e6176b1?auto=format&fit=crop&w=900&q=80",
    caption: "Summit day, sunrise from the top",
  },
];

export const ROUTE_MAP_IMAGE =
  "https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=1200&q=85";

export const SUPPORT_PHONE = "+918178613438";

/* ------------------------------------------------------------------ */
/* Overview facts                                                      */
/* ------------------------------------------------------------------ */

export const OVERVIEW_DEFAULTS = {
  country: "India",
  maxAltitude: "12,500 Feet",
  totalDistance: "28 Kilometers",
  cateringFood: "Boiled Veg Meals",
  campStay: "Guest Homestay & Alpine Tents",
};

/** Transport hubs keyed off the listing's region. */
export const TRANSPORT_BY_REGION = {
  uttarakhand: {
    railHead: "Dehradun Railway Station (DDN)",
    airport: "Jolly Grant Airport, Dehradun",
    road: "Direct roads from Rishikesh/Dehradun to Base Camp",
  },
  himachal: {
    railHead: "Chandigarh (CDG) / Pathankot",
    airport: "Bhuntar Airport, Kullu",
    road: "Regular buses & private cabs from Manali/Shimla",
  },
  kashmir: {
    railHead: "Jammu Tawi Railway Station",
    airport: "Srinagar Airport (SXR)",
    road: "Shared/Private cabs from Srinagar to Base Camp",
  },
  ladakh: {
    railHead: "Jammu Tawi Railway Station",
    airport: "Kushok Bakula Rimpochee Airport, Leh (IXL)",
    road: "Manali–Leh and Srinagar–Leh highways, open roughly May to October",
  },
  kerala: {
    railHead: "Ernakulam Junction (ERS), Kochi",
    airport: "Cochin International Airport (COK)",
    road: "NH-544 and NH-66 connect Kochi to Munnar, Thekkady and Alleppey",
  },
  karnataka: {
    railHead: "Mangaluru Junction (MAJN) / Bengaluru (SBC)",
    airport: "Mangaluru (IXE) / Kempegowda International, Bengaluru (BLR)",
    road: "Overnight buses and private cabs from Bengaluru to the Western Ghats",
  },
  tamilnadu: {
    railHead: "Coimbatore Junction (CBE) / Mettupalayam (MTP)",
    airport: "Coimbatore International Airport (CJB)",
    road: "Ghat roads climb from Mettupalayam to Coonoor and Ooty",
  },
  meghalaya: {
    railHead: "Guwahati Railway Station (GHY)",
    airport: "Lokpriya Gopinath Bordoloi International, Guwahati (GAU)",
    road: "Shared sumos and private cabs on the Guwahati–Shillong highway",
  },
  default: {
    railHead: "Nearest major railway junction",
    airport: "Nearest domestic airport",
    road: "State transport buses and private cabs to the start point",
  },
};

/* ------------------------------------------------------------------ */
/* Cost terms                                                          */
/* ------------------------------------------------------------------ */

export const DEFAULT_INCLUSIONS = [
  { title: "Trek Lodging", description: "Comfortable homestays in basecamp village and double-sharing alpine tents on trail." },
  { title: "Mountain Food", description: "Healthy veg meals (Breakfast, lunch, hot snacks, dinner) prepared at campsites." },
  { title: "Expedition Gear", description: "High-grade waterproof tents, negative-rated sleeping bags, and mattresses." },
  { title: "Expert guides", description: "Mountaineering certified trip leaders, support staff, and camp cooks." },
  { title: "Medical Kit", description: "Group oxygen cylinders, stretcher-tents, and first-aid briefcases." },
  { title: "Forest Permits", description: "All entry charges, state clearances, and booking fee clearances." },
];

export const DEFAULT_EXCLUSIONS = [
  { title: "Personal Porters", description: "Porters carrying personal luggage bags (can be hired separately at basecamp)." },
  { title: "Transport to Basecamp", description: "Pickup and travel drops between station/airport and basecamp village." },
  { title: "Rental Trek Gear", description: "Trekking poles, down jackets, spikes, or climbing boots." },
  { title: "Trek Insurance", description: "Travel insurance policies (must be obtained before trail departure)." },
  { title: "Mineral Water", description: "Bottled carbonated water or commercial food soft-drinks." },
];

/* ------------------------------------------------------------------ */
/* Departure batches                                                   */
/* ------------------------------------------------------------------ */

export const BATCH_YEAR = "2026";

export const BATCH_MONTH_FILTERS = ["All", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export const DEFAULT_BATCH_MONTHS: BatchMonth[] = [
  {
    month: "Jul",
    trips: [
      { startDate: "05 Jul", endDate: "10 Jul", status: "Open" },
      { startDate: "15 Jul", endDate: "20 Jul", status: "Filling Fast", isWomenOnly: true },
      { startDate: "25 Jul", endDate: "30 Jul", status: "Open" },
    ],
  },
  {
    month: "Aug",
    trips: [
      { startDate: "02 Aug", endDate: "07 Aug", status: "Open" },
      { startDate: "06 Aug", endDate: "11 Aug", status: "Open", isWomenOnly: true },
      { startDate: "16 Aug", endDate: "21 Aug", status: "Filling Fast", isSeniorOnly: true },
    ],
  },
  {
    month: "Sep",
    trips: [
      { startDate: "06 Sep", endDate: "11 Sep", status: "Open" },
      { startDate: "13 Sep", endDate: "18 Sep", status: "Open", isSeniorOnly: true },
      { startDate: "20 Sep", endDate: "25 Sep", status: "Filling Fast" },
    ],
  },
  {
    month: "Oct",
    trips: [
      { startDate: "10 Oct", endDate: "15 Oct", status: "Open" },
      { startDate: "20 Oct", endDate: "25 Oct", status: "Open", isWomenOnly: true },
    ],
  },
  {
    month: "Nov",
    trips: [
      { startDate: "05 Nov", endDate: "10 Nov", status: "Open" },
      { startDate: "15 Nov", endDate: "20 Nov", status: "Filling Fast", isSeniorOnly: true },
    ],
  },
  {
    month: "Dec",
    trips: [
      { startDate: "05 Dec", endDate: "10 Dec", status: "Open", isWomenOnly: true },
      { startDate: "15 Dec", endDate: "20 Dec", status: "Open" },
    ],
  },
];

/* ------------------------------------------------------------------ */
/* Packing list                                                        */
/* ------------------------------------------------------------------ */

export const DEFAULT_PACKING_LIST: EquipmentGroup[] = [
  {
    category: "Head & Face",
    items: ["Woolen Cap / Balaclava", "UV Sun Protection Sunglasses", "Sunscreen lotion (SPF 50+)"],
  },
  {
    category: "Trek Wear",
    items: [
      "Quick-dry synthetic shirts (3)",
      "Trekking pants (2)",
      "Down insulated jacket (1)",
      "Waterproof shell pants & jacket",
    ],
  },
  {
    category: "Footwear & Gear",
    items: [
      "Trekking boots with high ankle",
      "Woolen socks (3 pairs)",
      "Trekking poles (1 pair)",
      "Headlamp / torch",
    ],
  },
];

/* ------------------------------------------------------------------ */
/* FAQs                                                                */
/* ------------------------------------------------------------------ */

export const DEFAULT_FAQS = [
  {
    title: "What is the peak altitude of this trek?",
    description: "The maximum height achieved is 12,500 feet at the summit ridge. You will walk around 5-6 km per day on average.",
  },
  {
    title: "Is mobile network connectivity available on trail?",
    description: "No, network coverage (Jio/Airtel) disappears shortly after leaving the basecamp village. Enjoy a digital detox!",
  },
  {
    title: "What toilet facilities are set up on the trail?",
    description: "We set up dry compost toilet tents at every wilderness camp location. Toilet paper and organic sawdust are supplied.",
  },
];

/* ------------------------------------------------------------------ */
/* Cancellation — tiered (section 7)                                   */
/* ------------------------------------------------------------------ */

export const DEFAULT_CANCELLATION_TIERS: CancellationTier[] = [
  { label: "24–15 days before departure", daysFrom: 24, daysTo: 15, cashPct: 90, voucherPct: 100, transferAllowed: true },
  { label: "14–10 days before departure", daysFrom: 14, daysTo: 10, cashPct: 50, voucherPct: 100, transferAllowed: true },
  { label: "9 days or less", daysFrom: 9, daysTo: null, cashPct: 0, voucherPct: 0, transferAllowed: true },
];

export const DEFAULT_EMERGENCY_CANCELLATION =
  "In case of a documented medical emergency or a death in the immediate family, we waive the standard slab and issue a 100% trek voucher valid for 12 months, irrespective of how close to departure the cancellation is raised. Supporting documentation (hospital discharge summary or certificate) must be emailed to our support desk within 7 days of the batch start date.";

/* ------------------------------------------------------------------ */
/* Fitness & health (section 8)                                        */
/* ------------------------------------------------------------------ */

/** Placeholder thresholds — replace with clinically reviewed copy. */
export const DEFAULT_HEALTH_CHECKLIST: HealthCheckItem[] = [
  { label: "Resting pulse rate", threshold: "60–90 bpm" },
  { label: "Blood pressure", threshold: "Below 140/90 mmHg" },
  { label: "Resting SpO₂ (sea level)", threshold: "95% or above" },
  { label: "Cardiac history", threshold: "No known cardiac condition" },
  { label: "Liver / kidney function", threshold: "No chronic liver or kidney disorder" },
  { label: "Asthma", threshold: "No severe or exercise-induced asthma" },
];

export const BMI_CATEGORIES = [
  { label: "Underweight", min: 0, max: 18.5 },
  { label: "Normal", min: 18.5, max: 25 },
  { label: "Overweight", min: 25, max: 30 },
  { label: "Obese", min: 30, max: Infinity },
];

/* ------------------------------------------------------------------ */
/* Kids guidelines (section 10)                                        */
/* ------------------------------------------------------------------ */

export const KIDS_DEFAULTS = {
  minAgeWithGuardian: 8,
  soloAgeMin: 15,
  disclaimerFormUrl: "#",
};

/* ------------------------------------------------------------------ */
/* Equipment comparison (section 6)                                    */
/* ------------------------------------------------------------------ */

export const DEFAULT_EQUIPMENT_PROVIDED: EquipmentGroup[] = [
  { category: "Shelter", items: ["Waterproof alpine tents (double sharing)", "Dining tent", "Dry compost toilet tents"] },
  { category: "Sleeping", items: ["Sleeping bags rated to -10°C", "Insulated sleeping mats"] },
  { category: "Safety", items: ["Group oxygen cylinders", "Pulse oximeters", "High-altitude first-aid kit", "Stretcher tent"] },
  { category: "Utilities", items: ["Micro-spikes (snow batches)", "Gaiters (snow batches)", "Trek ropes and carabiners"] },
];

export const DEFAULT_PERSONAL_EQUIPMENT: EquipmentGroup[] = [
  { category: "Clothes", items: ["Quick-dry t-shirts (3)", "Trekking pants (2)", "Down/padded jacket", "Fleece layer", "Thermal inners"] },
  { category: "Head gear", items: ["Woolen cap / balaclava", "Sun cap", "UV sunglasses", "Neck gaiter"] },
  { category: "Foot gear", items: ["High-ankle trekking boots", "Woolen socks (3 pairs)", "Camp slippers"] },
  { category: "Utilities", items: ["Backpack 50–60L with rain cover", "Daypack 20L", "Headlamp", "Water bottles (2×1L)", "Personal toiletries", "Sunscreen SPF 50+"] },
];

/* ------------------------------------------------------------------ */
/* Reviews & videos                                                    */
/* ------------------------------------------------------------------ */

export const buildDefaultReviews = (trekName: string) => [
  {
    name: "Ananya Roy",
    role: "Verified Trekker",
    date: "Jan 2026",
    rating: 5,
    text: `Summiting ${trekName} with TripMySoul was a dream come true! The guide team carried oxygen tanks and checked our SpO2 twice daily. Food at high camp was fresh and hot!`,
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&q=80",
  },
  {
    name: "Vikramaditya Singh",
    role: "Experienced Hiker",
    date: "Dec 2025",
    rating: 5,
    text: `The campsite management and safety protocols on ${trekName} are top notch. Triple-layer sleeping bags kept us warm even at -8°C at night!`,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=80",
  },
  {
    name: "Pooja Sharma",
    role: "Women Only Batch Trekker",
    date: "Nov 2025",
    rating: 5,
    text: "Joined the Women-Only batch and felt completely safe and empowered! Our female trek leader was super supportive during steep incline sections.",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=80&q=80",
  },
  {
    name: "Rohan Kulkarni",
    role: "Solo Traveler",
    date: "Oct 2025",
    rating: 5,
    text: "Clear instructions from base camp to summit ridge. TripMySoul's logistics and transport coordination made the journey seamless.",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&q=80",
  },
];

export const buildDefaultTrailVideos = (trekName: string) => [
  { title: `${trekName} Summit Ridge Walk`, duration: "4:15", views: "12.4k views" },
  { title: "Basecamp Campsite Routine & Dining Tent", duration: "3:20", views: "8.1k views" },
  { title: "Pass Crossing & Snow Slide Experience", duration: "5:02", views: "15.9k views" },
  { title: "Trekker Testimonials & Guide Briefing", duration: "2:45", views: "6.3k views" },
];

/* ------------------------------------------------------------------ */
/* Long-form copy                                                      */
/* ------------------------------------------------------------------ */

export const buildAboutParagraphs = (trekName: string) => [
  `The ${trekName} is a majestic climbing experience tailored to hikers who want to absorb raw, untouched Himalayan geography. The trail leads through deep pine forests, alpine rivers, and ascends to panoramic vantage points providing sweeping views of snow-capped peaks.`,
  `Every campsite is carefully selected for ecological safety, scenic brilliance, and shelter. With TripMySoul's local guides, safety equipment, and organic mountain menus, this trek offers a healing journey that is both physically invigorating and spiritually comforting.`,
];

export const ELIGIBILITY_PARAGRAPHS = [
  "To complete this climb comfortably, you should maintain a baseline cardiovascular health. We recommend starting running/jogging routines 4 weeks before the trip (aiming for 5 km in 35-40 minutes).",
  "Individuals with severe asthma, cardiac history, or chronic knee problems must consult their physician before registering.",
];

/**
 * Fitness copy for listings that are not high-altitude climbs. Built from the
 * listing's own grade and age limits rather than the generic trek paragraphs.
 */
export function buildEligibilityParagraphs(
  difficulty: string,
  minAge?: number,
  maxAge?: number
): string[] {
  const ageLine =
    minAge && maxAge
      ? `This itinerary is open to travellers aged ${minAge} to ${maxAge}.`
      : minAge
      ? `This itinerary is open to travellers aged ${minAge} and above.`
      : "There is no fixed age limit on this itinerary.";

  return [
    `Graded ${difficulty}. Days are built around drives, sightseeing stops and short walks, so a baseline level of everyday fitness is enough — no prior trekking experience is required.`,
    `${ageLine} Travellers with a cardiac history, chronic knee trouble or reduced mobility should tell us at the time of booking so we can plan the pace and the stops around them.`,
  ];
}


/* ------------------------------------------------------------------ */
/* Itinerary generation & normalisation                                */
/* ------------------------------------------------------------------ */

/** Builds a placeholder day-by-day plan for treks with no itinerary data. */
export function generateMockItinerary(daysCount: number): ItineraryDay[] {
  const mockDays: ItineraryDay[] = [];
  for (let i = 1; i <= daysCount; i++) {
    if (i === 1) {
      mockDays.push({
        day: 1,
        title: "Arrival at Base Camp & Briefing",
        description:
          "Arrive at the designated base camp town. Meet your guides, complete registration, and undergo an altitude safety briefing and equipment verification.",
      });
    } else if (i === daysCount) {
      mockDays.push({
        day: i,
        title: "Descent & Final Departure",
        description:
          "Trek back down to the road head and board the vehicle for your return journey to the railway station or airport. Tour ends with beautiful mountain memories.",
      });
    } else if (i === daysCount - 1) {
      mockDays.push({
        day: i,
        title: "Trek back to Base camp",
        description:
          "Descend through pine forests and mountain trails to the base camp village. Share stories from the summit push over a warm celebratory dinner.",
      });
    } else {
      mockDays.push({
        day: i,
        title: `Trek to Intermediate camp ${i - 1}`,
        description: `Climb through spectacular meadows and mountain passes to camp ${i - 1}. Enjoy panoramic views of surrounding snow-capped summits and glacier moraines.`,
      });
    }
  }
  return mockDays;
}
