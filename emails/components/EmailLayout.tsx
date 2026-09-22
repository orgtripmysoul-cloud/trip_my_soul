import { Body, Container, Font, Head, Hr, Html, Preview, Section, Text } from "@react-email/components";
import * as React from "react";

/**
 * Shared wrapper for every transactional email — brand colors/fonts pulled
 * from src/app/globals.css (--brand-forest, --brand-dusk, Outfit/Playfair
 * Display) so these match the site, not an invented palette. Table-friendly,
 * inline-styled, capped at 600px, no external stylesheet — Gmail and Outlook
 * both strip <style> blocks and most external CSS.
 */

export const BRAND = {
  navy: "#0B2545",
  teal: "#1F7A8C",
  orange: "#FF7849",
  duskOrange: "#E25B3D",
  cta: "#E84855",
  warmBg: "#FAF9F6",
  warmCard: "#F3F0E9",
  darkText: "#06121E",
  muted: "#64748B",
  border: "#E5E7EB",
} as const;

export const COMPANY_NAME = "TripMySoul Pvt. Ltd.";
export const COMPANY_ADDRESS = "Saraswati Vihar, Ajabpur Khurd, Dehradun, Uttarakhand - 248001";
export const SUPPORT_PHONE = "+91 81786 13438";
export const SUPPORT_EMAIL = "bookings@tripmysoul.in";
export const WEBSITE_URL = "www.tripmysoul.in";

interface EmailLayoutProps {
  previewText: string;
  children: React.ReactNode;
}

export function EmailLayout({ previewText, children }: EmailLayoutProps) {
  return (
    <Html>
      <Head>
        <Font
          fontFamily="Outfit"
          fallbackFontFamily="Arial"
          webFont={{
            url: "https://fonts.gstatic.com/s/outfit/v11/QGYyz_MVcBeNP4NjuGObqx1XmO1I4Q.woff2",
            format: "woff2",
          }}
          fontWeight={400}
          fontStyle="normal"
        />
      </Head>
      <Preview>{previewText}</Preview>
      <Body style={{ backgroundColor: BRAND.warmBg, margin: 0, padding: 0, fontFamily: "Outfit, Arial, sans-serif" }}>
        <Container style={{ maxWidth: 600, margin: "0 auto", padding: "24px 16px" }}>
          <table role="presentation" width="100%" cellPadding={0} cellSpacing={0} style={{ textAlign: "center", paddingBottom: 16 }}>
            <tbody>
              <tr>
                <td>
                  <span
                    style={{
                      fontFamily: "'Playfair Display', Georgia, serif",
                      fontSize: 22,
                      fontWeight: 800,
                      color: BRAND.navy,
                      letterSpacing: "0.02em",
                    }}
                  >
                    TripMySoul
                  </span>
                </td>
              </tr>
            </tbody>
          </table>

          <table
            role="presentation"
            width="100%"
            cellPadding={0}
            cellSpacing={0}
            style={{
              backgroundColor: "#ffffff",
              borderRadius: 16,
              border: `1px solid ${BRAND.border}`,
            }}
          >
            <tbody>
              <tr>
                <td style={{ padding: "32px" }}>{children}</td>
              </tr>
            </tbody>
          </table>

          <Section style={{ marginTop: 24, textAlign: "center" }}>
            <Hr style={{ borderColor: BRAND.border, margin: "0 0 16px" }} />
            <Text style={{ fontSize: 11, color: BRAND.muted, margin: "0 0 4px", lineHeight: 1.5 }}>
              {COMPANY_NAME} &middot; {COMPANY_ADDRESS}
            </Text>
            <Text style={{ fontSize: 11, color: BRAND.muted, margin: 0, lineHeight: 1.5 }}>
              Questions? Call {SUPPORT_PHONE}. This is a transactional email related to your booking — it is not a
              marketing subscription, so there is nothing to unsubscribe from.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
