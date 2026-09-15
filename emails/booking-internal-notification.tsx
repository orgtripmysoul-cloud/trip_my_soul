import { Text } from "@react-email/components";
import * as React from "react";
import { formatInr } from "@/lib/money";
import { BRAND, EmailLayout } from "./components/EmailLayout";

export interface BookingInternalNotificationProps {
  bookingNo: string;
  trekName: string;
  batchLabel: string;
  region: string;
  difficulty: string;
  pax: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  totalAmount: number;
  amountPaid: number;
  gatewayPaymentId: string;
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <tr>
      <td style={{ padding: "6px 0", color: BRAND.muted, fontSize: 13, width: 150, verticalAlign: "top" }}>{label}</td>
      <td style={{ padding: "6px 0", color: BRAND.darkText, fontSize: 13, fontWeight: 600 }}>{value}</td>
    </tr>
  );
}

export default function BookingInternalNotification({
  bookingNo,
  trekName,
  batchLabel,
  region,
  difficulty,
  pax,
  customerName,
  customerEmail,
  customerPhone,
  totalAmount,
  amountPaid,
  gatewayPaymentId,
}: BookingInternalNotificationProps) {
  return (
    <EmailLayout previewText={`New paid booking ${bookingNo} — ${trekName}`}>
      <Text style={{ fontSize: 18, fontWeight: 700, color: BRAND.navy, margin: "0 0 16px" }}>
        New booking payment received
      </Text>

      <table role="presentation" width="100%" cellPadding={0} cellSpacing={0}>
        <tbody>
          <Row label="Booking No" value={bookingNo} />
          <Row label="Trek" value={`${trekName} (${region}, ${difficulty})`} />
          <Row label="Batch" value={batchLabel} />
          <Row label="Travellers" value={pax} />
          <Row label="Customer" value={customerName} />
          <Row label="Email" value={customerEmail} />
          <Row label="Phone" value={customerPhone} />
          <Row label="Total Amount" value={formatInr(totalAmount)} />
          <Row label="Amount Paid" value={formatInr(amountPaid)} />
          <Row label="Payment ID" value={gatewayPaymentId} />
        </tbody>
      </table>
    </EmailLayout>
  );
}
