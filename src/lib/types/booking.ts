import type { TrekAddOnKey } from "@/data/addOns";

/** Shared request/response shapes between the checkout UI and the API routes. No secrets here. */

export interface CreateBookingTraveller {
  fullName: string;
  email?: string;
  isPrimary: boolean;
  addOns: TrekAddOnKey[];
}

export interface CreateBookingRequest {
  trekSlug: string;
  batchLabel: string;
  startDate?: string | null;
  endDate?: string | null;
  pax: number;
  customer: { name: string; email: string; phone: string };
  travellers: CreateBookingTraveller[];
  couponCode?: string;
  /** Issued by POST /api/verify/confirm after the primary booker's email is OTP-verified. */
  verificationToken: string;
  /** Optional partial-payment amount for the first payment; omit to pay the full trek total now. */
  payNowAmount?: number;
}

export interface CreateBookingResponse {
  bookingNo: string;
  holdExpiresAt: string;
  /** The full trek total, regardless of how much is being paid in this Razorpay order. */
  totalAmount: number;
  /** Outstanding balance after this order's payment is captured (== totalAmount - payingNowAmount). */
  amountDue: number;
  /** The amount this Razorpay order is actually for (== totalAmount unless payNowAmount was requested). */
  payingNowAmount: number;
  currency: string;
  razorpayOrderId: string;
  razorpayKeyId: string;
}

export interface PaymentIntentResponse {
  bookingNo: string;
  holdExpiresAt: string;
  totalAmount: number;
  currency: string;
  razorpayOrderId: string;
  razorpayKeyId: string;
}

export interface AdditionalPaymentRequest {
  email: string;
  amount: number;
}

export interface AdditionalPaymentResponse {
  bookingNo: string;
  /** The amount this Razorpay order is for (the requested installment, not the full total). */
  amount: number;
  currency: string;
  razorpayOrderId: string;
  razorpayKeyId: string;
  /**
   * Provisional/not authoritative — computed client-side-friendly as
   * total_amount - paid_amount - amount at request time, purely so the UI
   * can show an optimistic updated balance. Only the webhook-confirmed
   * booking state (via /bookings/lookup or /bookings/mine) is authoritative.
   */
  amountDue: number;
}

export interface VerifyPaymentRequest {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export interface VerifyPaymentResponse {
  verified: boolean;
}

export interface BookingLookupResponse {
  bookingNo: string;
  status: string;
  paymentState: string;
  pax: number;
  totalAmount: number;
  paidAmount: number;
  currency: string;
  trekName: string;
  batchLabel: string;
  holdExpiresAt: string | null;
  latestPaymentStatus: string | null;
  latestPaymentId: string | null;
}

export interface MyBookingSummary {
  bookingNo: string;
  status: string;
  paymentState: string;
  pax: number;
  totalAmount: number;
  paidAmount: number;
  currency: string;
  trekSlug: string;
  trekName: string;
  region: string | null;
  batchLabel: string;
  startDate: string | null;
  endDate: string | null;
  createdAt: string;
}

export interface MyBookingsResponse {
  bookings: MyBookingSummary[];
}

export interface ApiErrorBody {
  code: string;
  message: string;
}

/** Admin panel types (src/app/admin/**, src/app/api/v1/admin/**). */

export interface AdminBookingListItem {
  bookingNo: string;
  status: string;
  paymentState: string;
  totalAmount: number;
  paidAmount: number;
  currency: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  trekName: string;
  batchLabel: string;
  createdAt: string;
}

export interface AdminBookingListResponse {
  bookings: AdminBookingListItem[];
  total: number;
  limit: number;
  offset: number;
}

export interface AdminPaymentRecord {
  id: string;
  kind: string;
  amount: number;
  currency: string;
  gateway: string;
  method: string | null;
  status: string;
  transactionReference: string | null;
  notes: string | null;
  collectedByName: string | null;
  verifiedByName: string | null;
  verifiedAt: string | null;
  capturedAt: string | null;
  createdAt: string;
}

export interface AdminBookingTraveller {
  fullName: string;
  email: string | null;
  isPrimary: boolean;
}

export interface AdminBookingDetailResponse {
  bookingNo: string;
  status: string;
  paymentState: string;
  pax: number;
  totalAmount: number;
  paidAmount: number;
  currency: string;
  createdAt: string;
  customer: { name: string; email: string; phone: string };
  trekName: string;
  batchLabel: string;
  startDate: string | null;
  endDate: string | null;
  travellers: AdminBookingTraveller[];
  payments: AdminPaymentRecord[];
}

export type AdminManualPaymentMethod = "cash" | "upi_manual" | "bank_transfer" | "other";
export type AdminManualPaymentKind = "advance" | "installment" | "final" | "other";

export interface AdminRecordPaymentRequest {
  amount: number;
  method: AdminManualPaymentMethod;
  kind?: AdminManualPaymentKind;
  transactionReference?: string;
  notes?: string;
}

export interface AdminRecordPaymentResponse {
  booking: { bookingNo: string; status: string; paymentState: string; totalAmount: number; paidAmount: number };
  payment: AdminPaymentRecord;
}

/** Custom payments (src/app/pay/**, src/app/admin/quotes/**, src/app/admin/payments/**). */

export type CustomPaymentPurpose = "advance" | "full" | "balance" | "addon";

export interface CreateCustomPaymentRequest {
  customer: { name: string; email: string; phone: string };
  tripLabel: string;
  departureDate?: string | null;
  pax: number;
  amount: number;
  purpose: CustomPaymentPurpose;
  notes?: string;
}

export interface CreateCustomPaymentResponse {
  bookingNo: string;
  holdExpiresAt: string;
  totalAmount: number;
  payingNowAmount: number;
  currency: string;
  razorpayOrderId: string;
  razorpayKeyId: string;
}

export interface CreateQuoteLeadRequest {
  name: string;
  email?: string;
  phone: string;
  tripLabel?: string;
  departureDate?: string | null;
  message?: string;
  source?: "tbd_quote" | "callback";
}

export interface QuoteDetailsResponse {
  status: "pending" | "paid" | "expired" | "cancelled";
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  tripLabel: string;
  departureDate: string | null;
  pax: number;
  amount: number;
  taxAmount: number;
  totalAmount: number;
  purpose: CustomPaymentPurpose;
  addonDetail: string | null;
  notes: string | null;
  expiryDate: string;
}

export interface AdminCreateQuoteRequest {
  customer: { name: string; email: string; phone: string };
  tripLabel: string;
  departureDate?: string | null;
  pax?: number;
  amount: number;
  purpose: CustomPaymentPurpose;
  addonDetail?: string;
  notes?: string;
  expiryDate: string;
}

export interface AdminQuoteListItem {
  token: string;
  status: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  tripLabel: string;
  amount: number;
  purpose: CustomPaymentPurpose;
  expiryDate: string;
  bookingNo: string | null;
  createdAt: string;
}

export interface AdminQuoteListResponse {
  quotes: AdminQuoteListItem[];
}

export interface AdminCreateQuoteResponse {
  token: string;
  payUrl: string;
}

export interface AdminPaymentListItem {
  bookingNo: string;
  bookingType: "trek" | "custom";
  trekName: string;
  customerName: string;
  customerEmail: string;
  status: string;
  paymentState: string;
  totalAmount: number;
  paidAmount: number;
  currency: string;
  createdAt: string;
}

export interface AdminPaymentListResponse {
  payments: AdminPaymentListItem[];
  total: number;
  limit: number;
  offset: number;
}
