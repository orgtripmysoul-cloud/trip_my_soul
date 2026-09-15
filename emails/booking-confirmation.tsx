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
  batchLabel: string;
  pax: number;
  totalAmount: number;
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
  batchLabel,
  pax,
  totalAmount,
}: BookingConfirmationProps) {
  return (
    <EmailLayout previewText={`Your ${trekName} booking (${bookingNo}) is confirmed`}>
      <Text style={{ fontSize: 20, fontWeight: 700, color: BRAND.navy, margin: "0 0 4px", fontFamily: "'Playfair Display', Georgia, serif" }}>
        Booking Confirmed
      </Text>
      <Text style={{ fontSize: 13, color: BRAND.muted, margin: "0 0 24px" }}>
        Hi {customerName}, your payment went through and your trek is booked. Booking reference:{" "}
        <span style={{ fontWeight: 700, color: BRAND.navy }}>{bookingNo}</span>
      </Text>

      <table role="presentation" width="100%" cellPadding={0} cellSpacing={0}>
        <tbody>
          <DetailRow label="Trek" value={trekName} />
          <DetailRow label="Region" value={region} />
          <DetailRow label="Difficulty" value={difficulty} />
          <DetailRow label="Duration" value={`${durationDays} Days`} />
          <DetailRow label="Departure" value={departureDateLabel ?? batchLabel} />
          <DetailRow label="Travellers" value={pax} />
          <DetailRow label="Amount Paid" value={<span style={{ color: BRAND.teal }}>{formatInr(totalAmount)}</span>} />
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
                Our trek coordinator will reach out with your joining instructions, packing list and briefing details closer to
                the departure date. Keep your booking reference ({bookingNo}) handy for any questions.
              </Text>
            </td>
          </tr>
        </tbody>
      </table>
    </EmailLayout>
  );
}
