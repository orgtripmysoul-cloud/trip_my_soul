/** Shared CRM contracts between the API routes, the admin panel and the website forms. */

export const LEAD_STATUSES = [
  "new",
  "contacted",
  "quote_sent",
  "negotiation",
  "converted",
  "on_hold",
  "lost",
  "junk",
] as const;

export type LeadStatus = (typeof LEAD_STATUSES)[number];

/** Statuses that still need a next action — these require a follow-up date. */
export const OPEN_LEAD_STATUSES: LeadStatus[] = ["contacted", "quote_sent", "negotiation", "on_hold"];

/** Columns shown on the Kanban board, in pipeline order. Closed states are filtered out. */
export const PIPELINE_STATUSES: LeadStatus[] = [
  "new",
  "contacted",
  "quote_sent",
  "negotiation",
  "converted",
];

export const LEAD_STATUS_LABELS: Record<LeadStatus, string> = {
  new: "New",
  contacted: "Contacted",
  quote_sent: "Quote Sent",
  negotiation: "Negotiation",
  converted: "Converted",
  on_hold: "On Hold",
  lost: "Lost",
  junk: "Junk",
};

export const LEAD_SOURCES = [
  "website_form",
  "whatsapp",
  "phone_call",
  "instagram",
  "google_ads",
  "referral",
  "b2b_partner",
  "walk_in",
  "repeat_customer",
] as const;

export type LeadSource = (typeof LEAD_SOURCES)[number];

export const LEAD_SOURCE_LABELS: Record<LeadSource, string> = {
  website_form: "Website form",
  whatsapp: "WhatsApp",
  phone_call: "Phone call",
  instagram: "Instagram",
  google_ads: "Google Ads",
  referral: "Referral",
  b2b_partner: "B2B partner",
  walk_in: "Walk-in",
  repeat_customer: "Repeat customer",
};

/** The seven website forms from the system plan, plus manual admin entry. */
export const LEAD_FORM_TYPES = [
  "contact_us",
  "book_now",
  "enquiry",
  "callback",
  "custom_tour",
  "b2b",
  "corporate",
  "admin",
] as const;

export type LeadFormType = (typeof LEAD_FORM_TYPES)[number];

export const LEAD_FORM_TYPE_LABELS: Record<LeadFormType, string> = {
  contact_us: "Contact Us",
  book_now: "Book Now",
  enquiry: "Trek Enquiry",
  callback: "Callback",
  custom_tour: "Custom Tour",
  b2b: "B2B Agent",
  corporate: "Corporate",
  admin: "Added by staff",
};

export const LEAD_LOST_REASONS = [
  "price",
  "dates",
  "chose_competitor",
  "no_response",
  "postponed",
  "other",
] as const;

export type LeadLostReason = (typeof LEAD_LOST_REASONS)[number];

export const LEAD_LOST_REASON_LABELS: Record<LeadLostReason, string> = {
  price: "Price",
  dates: "Dates did not suit",
  chose_competitor: "Chose a competitor",
  no_response: "No response",
  postponed: "Postponed",
  other: "Other",
};

export const LEAD_ACTIVITY_TYPES = [
  "note",
  "call",
  "whatsapp",
  "email",
  "status_change",
  "transfer",
  "follow_up_set",
  "created",
] as const;

export type LeadActivityType = (typeof LEAD_ACTIVITY_TYPES)[number];

export const STAFF_ROLES = [
  "super_admin",
  "sales_manager",
  "salesperson",
  "operations",
  "accounts",
  "content_editor",
] as const;

export type StaffRole = (typeof STAFF_ROLES)[number];

export const STAFF_ROLE_LABELS: Record<StaffRole, string> = {
  super_admin: "Super Admin",
  sales_manager: "Sales Manager",
  salesperson: "Salesperson",
  operations: "Operations",
  accounts: "Accounts",
  content_editor: "Content Editor",
};

// ---------------------------------------------------------------------------
// Public lead capture (website forms → POST /api/v1/public/leads)
// ---------------------------------------------------------------------------

export interface LeadUtm {
  source?: string;
  medium?: string;
  campaign?: string;
  term?: string;
  content?: string;
  gclid?: string;
  fbclid?: string;
}

export interface CreateLeadRequest {
  formType: LeadFormType;
  name: string;
  phone: string;
  email?: string;
  trekSlug?: string;
  trekName?: string;
  travelDate?: string;
  travelMonth?: string;
  paxAdults?: number;
  paxChildren?: number;
  message?: string;
  /** Form-specific extras: budget, company, GSTIN, group size, interests, preferred call time. */
  details?: Record<string, string | number | boolean | null>;
  utm?: LeadUtm;
  landingPage?: string;
  consentMarketing?: boolean;
  /** Honeypot — must stay empty. A filled value is silently treated as spam. */
  website?: string;
}

export interface CreateLeadResponse {
  ok: true;
  leadNo: string;
  /** True when this was folded into an existing open enquiry from the same number. */
  duplicate: boolean;
}

// ---------------------------------------------------------------------------
// Admin
// ---------------------------------------------------------------------------

export interface AdminLeadListItem {
  leadNo: string;
  name: string;
  phone: string;
  email: string | null;
  trekName: string | null;
  trekSlug: string | null;
  travelDate: string | null;
  travelMonth: string | null;
  pax: number;
  status: LeadStatus;
  source: LeadSource;
  formType: LeadFormType;
  ownerId: string | null;
  ownerName: string | null;
  followUpAt: string | null;
  /** Server-computed so every client agrees on what "overdue" means. */
  isOverdue: boolean;
  createdAt: string;
}

export interface AdminLeadListResponse {
  leads: AdminLeadListItem[];
  total: number;
  limit: number;
  offset: number;
  counts: Record<LeadStatus, number>;
}

export interface AdminLeadActivity {
  id: string;
  type: LeadActivityType;
  body: string | null;
  outcome: string | null;
  durationSeconds: number | null;
  oldValue: string | null;
  newValue: string | null;
  staffName: string | null;
  createdAt: string;
}

export interface AdminLeadDetail extends AdminLeadListItem {
  message: string | null;
  landingPage: string | null;
  utm: LeadUtm;
  details: Record<string, unknown>;
  lostReason: LeadLostReason | null;
  lostNote: string | null;
  consentMarketing: boolean;
  firstContactedAt: string | null;
  activities: AdminLeadActivity[];
}

export interface AdminLeadDetailResponse {
  lead: AdminLeadDetail;
}

export interface UpdateLeadRequest {
  status?: LeadStatus;
  ownerId?: string | null;
  followUpAt?: string | null;
  lostReason?: LeadLostReason;
  lostNote?: string;
  transferReason?: string;
}

export interface CreateLeadActivityRequest {
  type: Extract<LeadActivityType, "note" | "call" | "whatsapp" | "email">;
  body?: string;
  outcome?: string;
  durationSeconds?: number;
}

export interface AdminStaffOption {
  id: string;
  fullName: string;
  role: StaffRole;
}

export interface AdminDashboardResponse {
  today: {
    newLeads: number;
    followUpsDue: number;
    followUpsOverdue: number;
    unassigned: number;
  };
  pipeline: Record<LeadStatus, number>;
  bySource: { source: LeadSource; count: number }[];
  conversion: {
    thisMonth: { total: number; converted: number; rate: number };
    lastMonth: { total: number; converted: number; rate: number };
  };
  leaderboard: { staffId: string; name: string; assigned: number; converted: number; rate: number }[];
}
