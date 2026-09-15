import "server-only";
import { render } from "@react-email/render";
import * as React from "react";
import { formatInr } from "@/lib/money";
import BookingConfirmation from "../../../../emails/booking-confirmation";
import BookingInternalNotification from "../../../../emails/booking-internal-notification";

/** Shape of `vars` on a `booking.payment_success` notification_outbox row — see capture_payment() in supabase/migrations/0010_booking_confirmation_context.sql. */
export interface BookingConfirmationVars {
  booking_no: string;
  pax: number;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  trek_name: string;
  region: string | null;
  difficulty: string | null;
  duration_days: number | null;
  batch_label: string;
  start_date: string | null;
  total_amount: number;
  amount_paid: number;
  gateway_payment_id: string;
}

function formatDepartureDate(iso: string | null): string | null {
  if (!iso) return null;
  try {
    return new Date(iso).toLocaleDateString("en-IN", { dateStyle: "medium", timeZone: "Asia/Kolkata" });
  } catch {
    return null;
  }
}

export async function renderBookingConfirmationEmail(vars: BookingConfirmationVars): Promise<{ subject: string; html: string; text: string }> {
  const subject = `Booking Confirmed — ${vars.trek_name} (${vars.booking_no})`;
  const element = React.createElement(BookingConfirmation, {
    bookingNo: vars.booking_no,
    customerName: vars.customer_name,
    trekName: vars.trek_name,
    region: vars.region ?? "—",
    difficulty: vars.difficulty ?? "—",
    durationDays: vars.duration_days ?? 0,
    departureDateLabel: formatDepartureDate(vars.start_date),
    batchLabel: vars.batch_label,
    pax: vars.pax,
    totalAmount: vars.total_amount,
  });

  const [html, text] = await Promise.all([render(element), render(element, { plainText: true })]);
  return { subject, html, text };
}

/** Internal ops copy — sent to RESEND_BOOKINGS_INBOX, not the customer. */
export async function renderBookingInternalNotificationEmail(
  vars: BookingConfirmationVars
): Promise<{ subject: string; html: string; text: string }> {
  const subject = `[Booking] ${vars.booking_no} — ${vars.trek_name} (${formatInr(vars.amount_paid)} paid)`;
  const element = React.createElement(BookingInternalNotification, {
    bookingNo: vars.booking_no,
    trekName: vars.trek_name,
    batchLabel: vars.batch_label,
    region: vars.region ?? "—",
    difficulty: vars.difficulty ?? "—",
    pax: vars.pax,
    customerName: vars.customer_name,
    customerEmail: vars.customer_email,
    customerPhone: vars.customer_phone,
    totalAmount: vars.total_amount,
    amountPaid: vars.amount_paid,
    gatewayPaymentId: vars.gateway_payment_id,
  });

  const [html, text] = await Promise.all([render(element), render(element, { plainText: true })]);
  return { subject, html, text };
}
