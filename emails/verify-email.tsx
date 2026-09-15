import { Text } from "@react-email/components";
import * as React from "react";
import { BRAND, EmailLayout } from "./components/EmailLayout";

export interface VerifyEmailProps {
  code: string;
  expiresInMinutes: number;
}

export default function VerifyEmail({ code, expiresInMinutes }: VerifyEmailProps) {
  return (
    <EmailLayout previewText={`Your TripMySoul verification code is ${code}`}>
      <Text style={{ fontSize: 20, fontWeight: 700, color: BRAND.navy, margin: "0 0 8px", fontFamily: "'Playfair Display', Georgia, serif" }}>
        Verify your email
      </Text>
      <Text style={{ fontSize: 13, color: BRAND.muted, margin: "0 0 24px", lineHeight: 1.6 }}>
        Enter this code to continue with your trek booking.
      </Text>

      <table role="presentation" width="100%" cellPadding={0} cellSpacing={0}>
        <tbody>
          <tr>
            <td
              align="center"
              style={{
                backgroundColor: BRAND.warmCard,
                borderRadius: 12,
                padding: "20px 16px",
              }}
            >
              <span
                style={{
                  fontFamily: "monospace, 'Courier New', Courier",
                  fontSize: 32,
                  fontWeight: 800,
                  letterSpacing: "0.3em",
                  color: BRAND.navy,
                }}
              >
                {code}
              </span>
            </td>
          </tr>
        </tbody>
      </table>

      <Text style={{ fontSize: 12, color: BRAND.muted, margin: "20px 0 0", lineHeight: 1.6 }}>
        This code expires in {expiresInMinutes} minutes and can only be used once.
      </Text>
      <Text style={{ fontSize: 12, color: BRAND.muted, margin: "8px 0 0", lineHeight: 1.6 }}>
        Didn&apos;t request this? You can safely ignore this email — no booking will be made without this code.
      </Text>
    </EmailLayout>
  );
}
