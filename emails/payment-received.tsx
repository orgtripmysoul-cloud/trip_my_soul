import { Text } from "@react-email/components";
import * as React from "react";
import { formatInr } from "@/lib/money";
import { BRAND, EmailLayout, SUPPORT_EMAIL, SUPPORT_PHONE, WEBSITE_URL } from "./components/EmailLayout";

/** "razorpay" for gateway captures; the rest are admin-recorded manual payments (payments.gateway). */
export type PaymentReceivedMethod = "razorpay" | "cash" | "upi_manual" | "bank_transfer" | "other";

const MANUAL_METHOD_LABELS: Record<Exclude<PaymentReceivedMethod, "razorpay">, string> = {
  cash: "Cash",
  upi_manual: "UPI",
  bank_transfer: "Bank transfer",
  other: "Other",
};

export interface PaymentReceivedProps {
  bookingNo: string;
  customerName: string;
  trekName: string;
  /** Already formatted for display (e.g. "12 Jan 2026"), or null when the batch has no fixed start date. */
  departureDateLabel: string | null;
  batchLabel: string;
  amountPaid: number;
  paymentStatus: string;
  /** Razorpay payment id, or for manual payments the recorded / synthesized reference (e.g. "CASH-a1b2c3d4"). */
  transactionId: string;
  /** Defaults to "razorpay", which keeps the original "Transaction ID" row. */
  paymentMethod?: PaymentReceivedMethod;
  bookingConfirmed: boolean;
}

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <tr>
      <td style={{ padding: "6px 0", color: BRAND.muted, fontSize: 13, width: 150, verticalAlign: "top" }}>{label}</td>
      <td style={{ padding: "6px 0", color: BRAND.darkText, fontSize: 13, fontWeight: 600 }}>{value}</td>
    </tr>
  );
}

export default function PaymentReceived({
  bookingNo,
  customerName,
  trekName,
  departureDateLabel,
  batchLabel,
  amountPaid,
  paymentStatus,
  transactionId,
  paymentMethod = "razorpay",
  bookingConfirmed,
}: PaymentReceivedProps) {
  const manualMethodLabel = paymentMethod === "razorpay" ? null : (MANUAL_METHOD_LABELS[paymentMethod] ?? "Other");

  return (
    <EmailLayout previewText={`Payment received for booking ${bookingNo}`}>
      <Text style={{ fontSize: 20, fontWeight: 700, color: BRAND.navy, margin: "0 0 4px", fontFamily: "'Playfair Display', Georgia, serif" }}>
        Payment Received
      </Text>
      <Text style={{ fontSize: 13, color: BRAND.muted, margin: "0 0 24px" }}>
        Dear {customerName}, we&apos;re pleased to confirm that your payment has been successfully received by Trip My
        Soul.
      </Text>

      <table role="presentation" width="100%" cellPadding={0} cellSpacing={0}>
        <tbody>
          <DetailRow label="Booking ID" value={bookingNo} />
          <DetailRow label="Trip / Trek" value={trekName} />
          <DetailRow label="Departure Date" value={departureDateLabel ?? batchLabel} />
          <DetailRow label="Amount Received" value={<span style={{ color: BRAND.teal }}>{formatInr(amountPaid)}</span>} />
          <DetailRow label="Payment Status" value={paymentStatus} />
          {manualMethodLabel ? (
            <DetailRow label="Payment reference" value={`${manualMethodLabel} · ${transactionId}`} />
          ) : (
            <DetailRow label="Transaction ID" value={transactionId} />
          )}
        </tbody>
      </table>

      <table role="presentation" width="100%" cellPadding={0} cellSpacing={0} style={{ marginTop: 24 }}>
        <tbody>
          <tr>
            <td style={{ backgroundColor: BRAND.warmCard, borderRadius: 12, padding: "16px" }}>
              <Text style={{ fontSize: 12, color: BRAND.darkText, margin: 0, lineHeight: 1.6 }}>
                Your payment has been recorded against your booking.
                {!bookingConfirmed && (
                  <>
                    {" "}
                    If your booking is not yet confirmed, our team will complete the booking verification and send you a
                    separate Booking Confirmation email shortly.
                  </>
                )}
                {" "}
                Please keep your Booking ID (<strong>{bookingNo}</strong>) for future communication.
              </Text>
            </td>
          </tr>
        </tbody>
      </table>

      <Text style={{ fontSize: 12, color: BRAND.muted, margin: "16px 0 0" }}>
        For any assistance, contact our team at {SUPPORT_PHONE} or reply to this email.
      </Text>
      <Text style={{ fontSize: 11, color: BRAND.muted, margin: "12px 0 0" }}>
        Travel. Trek. Discover. &middot; {SUPPORT_PHONE} &middot; {SUPPORT_EMAIL} &middot; {WEBSITE_URL}
      </Text>
    </EmailLayout>
  );
}
