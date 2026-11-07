import { Text } from "@react-email/components";
import * as React from "react";
import { BRAND, EmailLayout, SUPPORT_PHONE } from "./components/EmailLayout";

export interface LeadAutoReplyProps {
  customerName: string;
  trekName: string;
}

/** Sent to a customer right after they submit an enquiry (only with consent). */
export default function LeadAutoReply({ customerName, trekName }: LeadAutoReplyProps) {
  return (
    <EmailLayout previewText="We received your enquiry — our trip expert will call you shortly">
      <Text style={{ fontSize: 20, fontWeight: 700, color: BRAND.navy, margin: "0 0 8px", fontFamily: "'Playfair Display', Georgia, serif" }}>
        Thank you for reaching out! 🏔️
      </Text>
      <Text style={{ fontSize: 13, color: BRAND.darkText, margin: "0 0 12px", lineHeight: 1.6 }}>
        Dear {customerName}, we have received your enquiry about {trekName}. One of our trip experts will get in touch with
        you shortly on call or WhatsApp to help you plan everything.
      </Text>
      <Text style={{ fontSize: 13, color: BRAND.darkText, margin: "0 0 12px", lineHeight: 1.6 }}>
        In the meantime, feel free to reply to this email with any questions, preferred dates or group size.
      </Text>
      <Text style={{ fontSize: 12, color: BRAND.muted, margin: "16px 0 0" }}>
        Need help right away? Call or WhatsApp us at {SUPPORT_PHONE}.
      </Text>
    </EmailLayout>
  );
}
