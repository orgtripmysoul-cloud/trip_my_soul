import "server-only";
import { render } from "@react-email/render";
import * as React from "react";
import PaymentReceived, { type PaymentReceivedMethod } from "../../../../emails/payment-received";

/**
 * Shape of `vars` on a `booking.payment_received` notification_outbox row — see capture_payment() in
 * supabase/migrations/0011_trip_reminders.sql and record_manual_payment() in
 * supabase/migrations/0013_manual_payment_method_in_vars.sql.
 */
export interface PaymentReceivedVars {
  booking_no: string;
  customer_name: string;
  trek_name: string;
  batch_label: string;
  start_date: string | null;
  amount_paid: number;
  payment_status: string;
  gateway_payment_id: string;
  booking_status: string;
  /**
   * Set only by record_manual_payment (cash / upi_manual / bank_transfer / other). Absent on Razorpay
   * captures (and on any manual row queued before 0013), which render as a Razorpay "Transaction ID".
   */
  payment_method?: PaymentReceivedMethod | null;
}

function formatDepartureDate(iso: string | null): string | null {
  if (!iso) return null;
  try {
    return new Date(iso).toLocaleDateString("en-IN", { dateStyle: "medium", timeZone: "Asia/Kolkata" });
  } catch {
    return null;
  }
}

export async function renderPaymentReceivedEmail(vars: PaymentReceivedVars): Promise<{ subject: string; html: string; text: string }> {
  const subject = `Payment Received – Trip My Soul | ${vars.booking_no}`;
  const element = React.createElement(PaymentReceived, {
    bookingNo: vars.booking_no,
    customerName: vars.customer_name,
    trekName: vars.trek_name,
    departureDateLabel: formatDepartureDate(vars.start_date),
    batchLabel: vars.batch_label,
    amountPaid: vars.amount_paid,
    paymentStatus: vars.payment_status,
    transactionId: vars.gateway_payment_id,
    paymentMethod: vars.payment_method ?? "razorpay",
    bookingConfirmed: vars.booking_status === "confirmed",
  });

  const [html, text] = await Promise.all([render(element), render(element, { plainText: true })]);
  return { subject, html, text };
}
