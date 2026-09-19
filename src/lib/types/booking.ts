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
}

export interface CreateBookingResponse {
  bookingNo: string;
  holdExpiresAt: string;
  totalAmount: number;
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
