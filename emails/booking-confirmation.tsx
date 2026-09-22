import { Text } from "@react-email/components";
import * as React from "react";
import { formatInr } from "@/lib/money";
import { BRAND, EmailLayout } from "./components/EmailLayout";

export interface BookingConfirmationProps {
  bookingNo: string;
  customerName: string;
  trekName: string;
  region: string;
  difficulty: string;
  durationDays: number;
  /** Already formatted for display (e.g. "12 Jan 2026"), or null when the batch has no fixed start date. */
  departureDateLabel: string | null;
  /** Already formatted for display, or null when the batch has no fixed end date. */
  returnDateLabel: string | null;
  batchLabel: string;
  pax: number;
  pickupLocation: string | null;
  totalAmount: number;
  paidAmount: number;
  balanceAmount: number;
  paymentStatus: string;
}

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <tr>
      <td style={{ padding: "6px 0", color: BRAND.muted, fontSize: 13, width: 150, verticalAlign: "top" }}>{label}</td>
      <td style={{ padding: "6px 0", color: BRAND.darkText, fontSize: 13, fontWeight: 600 }}>{value}</td>
    </tr>
  );
}

export default function BookingConfirmation({
  bookingNo,
  customerName,
  trekName,
  region,
  difficulty,
  durationDays,
  departureDateLabel,
  returnDateLabel,
  batchLabel,
  pax,
  pickupLocation,
  totalAmount,
  paidAmount,
  balanceAmount,
  paymentStatus,
}: BookingConfirmationProps) {
  return (
    <EmailLayout previewText={`Your ${trekName} booking (${bookingNo}) is confirmed`}>
      <Text style={{ fontSize: 20, fontWeight: 700, color: BRAND.navy, margin: "0 0 4px", fontFamily: "'Playfair Display', Georgia, serif" }}>
        Booking Confirmed! 🏔️
      </Text>
      <Text style={{ fontSize: 13, color: BRAND.muted, margin: "0 0 24px" }}>
        Dear {customerName}, thank you for choosing us for your upcoming Himalayan adventure. Your journey is now
        confirmed, and we&apos;re looking forward to welcoming you.
      </Text>

      <Text style={{ fontSize: 13, fontWeight: 700, color: BRAND.navy, margin: "0 0 8px" }}>🏔️ Your Booking</Text>
      <table role="presentation" width="100%" cellPadding={0} cellSpacing={0}>
        <tbody>
          <DetailRow label="Booking ID" value={bookingNo} />
          <DetailRow label="Trip / Trek" value={trekName} />
          <DetailRow label="Region" value={region} />
          <DetailRow label="Difficulty" value={difficulty} />
          <DetailRow label="Duration" value={`${durationDays} Days`} />
          <DetailRow label="Departure" value={departureDateLabel ?? batchLabel} />
          <DetailRow label="Return" value={returnDateLabel ?? "—"} />
          <DetailRow label="Participants" value={pax} />
          <DetailRow label="Pickup Point" value={pickupLocation ?? "—"} />
        </tbody>
      </table>

      <Text style={{ fontSize: 13, fontWeight: 700, color: BRAND.navy, margin: "20px 0 8px" }}>💳 Payment Summary</Text>
      <table role="presentation" width="100%" cellPadding={0} cellSpacing={0}>
        <tbody>
          <DetailRow label="Total Amount" value={formatInr(totalAmount)} />
          <DetailRow label="Amount Paid" value={<span style={{ color: BRAND.teal }}>{formatInr(paidAmount)}</span>} />
          <DetailRow label="Balance" value={formatInr(balanceAmount)} />
          <DetailRow label="Payment Status" value={paymentStatus} />
        </tbody>
      </table>

      <table role="presentation" width="100%" cellPadding={0} cellSpacing={0} style={{ marginTop: 24 }}>
        <tbody>
          <tr>
            <td
              style={{
                backgroundColor: BRAND.warmCard,
                borderRadius: 12,
                padding: "16px",
              }}
            >
              <Text style={{ fontSize: 13, fontWeight: 700, color: BRAND.navy, margin: "0 0 6px" }}>What happens next</Text>
              <Text style={{ fontSize: 12, color: BRAND.darkText, margin: 0, lineHeight: 1.6 }}>
                Before your departure, our team will share all the important information you need, including the detailed
                itinerary, reporting &amp; pickup instructions, things to carry, weather &amp; trail updates, important
                travel/trek guidelines, guide &amp; emergency contact details and permit/document requirements. Please save
                this email and keep your Booking ID ({bookingNo}) handy whenever you contact our team.
              </Text>
            </td>
          </tr>
        </tbody>
      </table>
    </EmailLayout>
  );
}
