import { Text } from "@react-email/components";
import * as React from "react";
import { BRAND, EmailLayout } from "./components/EmailLayout";

export interface LeadNotificationProps {
  heading: string;
  intro: string;
  rows: { label: string; value: string }[];
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <tr>
      <td style={{ padding: "6px 0", color: BRAND.muted, fontSize: 13, width: 150, verticalAlign: "top" }}>{label}</td>
      <td style={{ padding: "6px 0", color: BRAND.darkText, fontSize: 13, fontWeight: 600 }}>{value}</td>
    </tr>
  );
}

/** Internal staff alert for lead events (new, assigned, repeat enquiry). */
export default function LeadNotification({ heading, intro, rows }: LeadNotificationProps) {
  return (
    <EmailLayout previewText={heading}>
      <Text style={{ fontSize: 18, fontWeight: 700, color: BRAND.navy, margin: "0 0 8px" }}>{heading}</Text>
      <Text style={{ fontSize: 13, color: BRAND.muted, margin: "0 0 16px" }}>{intro}</Text>

      <table role="presentation" width="100%" cellPadding={0} cellSpacing={0}>
        <tbody>
          {rows.map((row) => (
            <Row key={row.label} label={row.label} value={row.value} />
          ))}
        </tbody>
      </table>
    </EmailLayout>
  );
}
