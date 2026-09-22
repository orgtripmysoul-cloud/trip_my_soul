import { Text } from "@react-email/components";
import * as React from "react";
import { BRAND, EmailLayout, SUPPORT_PHONE } from "./components/EmailLayout";

export interface TripReminderProps {
  bookingNo: string;
  customerName: string;
  trekName: string;
  /** Already formatted for display (e.g. "12 Jan 2026"), or null when the batch has no fixed start date. */
  departureDateLabel: string | null;
  returnDateLabel: string | null;
  reportingLocation: string | null;
  reportingTime: string | null;
}

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <tr>
      <td style={{ padding: "6px 0", color: BRAND.muted, fontSize: 13, width: 150, verticalAlign: "top" }}>{label}</td>
      <td style={{ padding: "6px 0", color: BRAND.darkText, fontSize: 13, fontWeight: 600 }}>{value}</td>
    </tr>
  );
}

const PACKING_LIST = [
  "Required ID proof",
  "Appropriate trekking/travel shoes",
  "Warm layers & rain protection",
  "Personal medicines & essentials",
  "Water bottle",
  "Headlamp/torch",
  "Backpack",
  "Any other items mentioned in your packing list",
];

export default function TripReminder({
  bookingNo,
  customerName,
  trekName,
  departureDateLabel,
  returnDateLabel,
  reportingLocation,
  reportingTime,
}: TripReminderProps) {
  return (
    <EmailLayout previewText={`3 days to go — your ${trekName} adventure is almost here`}>
      <Text style={{ fontSize: 20, fontWeight: 700, color: BRAND.navy, margin: "0 0 4px", fontFamily: "'Playfair Display', Georgia, serif" }}>
        3 Days to Go! 🏔️
      </Text>
      <Text style={{ fontSize: 13, color: BRAND.muted, margin: "0 0 24px" }}>
        Dear {customerName}, only 3 days to go! 🎒🏔️ Your Trip My Soul adventure is getting closer, and it&apos;s time to get
        ready for the journey.
      </Text>

      <Text style={{ fontSize: 13, fontWeight: 700, color: BRAND.navy, margin: "0 0 8px" }}>📅 Your Trip</Text>
      <table role="presentation" width="100%" cellPadding={0} cellSpacing={0}>
        <tbody>
          <DetailRow label="Trip / Trek" value={trekName} />
          <DetailRow label="Departure Date" value={departureDateLabel ?? "—"} />
          <DetailRow label="Return Date" value={returnDateLabel ?? "—"} />
          <DetailRow label="Booking ID" value={bookingNo} />
          <DetailRow label="Reporting Location" value={reportingLocation ?? "—"} />
          <DetailRow label="Reporting Time" value={reportingTime ?? "—"} />
        </tbody>
      </table>

      <table role="presentation" width="100%" cellPadding={0} cellSpacing={0} style={{ marginTop: 24 }}>
        <tbody>
          <tr>
            <td style={{ backgroundColor: BRAND.warmCard, borderRadius: 12, padding: "16px" }}>
              <Text style={{ fontSize: 13, fontWeight: 700, color: BRAND.navy, margin: "0 0 8px" }}>🎒 Before You Leave</Text>
              {PACKING_LIST.map((item) => (
                <Text key={item} style={{ fontSize: 12, color: BRAND.darkText, margin: "0 0 4px", lineHeight: 1.5 }}>
                  ✓ {item}
                </Text>
              ))}
            </td>
          </tr>
        </tbody>
      </table>

      <Text style={{ fontSize: 12, color: BRAND.darkText, margin: "16px 0 0", lineHeight: 1.6 }}>
        ⚠️ Please review your final itinerary and Things to Carry list before travelling. If there has been any change in
        your health, travel plans, arrival time, or other important information, please inform our team immediately.
      </Text>

      <Text style={{ fontSize: 12, color: BRAND.muted, margin: "16px 0 0" }}>
        Need help? Contact Trip My Soul at {SUPPORT_PHONE}.
      </Text>
      <Text style={{ fontSize: 13, fontWeight: 700, color: BRAND.navy, margin: "16px 0 0" }}>
        Get ready. The mountains are calling. 🏔️
      </Text>
    </EmailLayout>
  );
}
