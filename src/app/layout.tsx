import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { BASE_URL } from "@/app/sitemap";

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

const SITE_DESCRIPTION =
  "Explore the best high-altitude treks and spiritual yatras in India with TripMySoul. Affordable holiday packages, expert local guides, and scenic trail routes in Uttarakhand, Himachal, and Kashmir.";

export const metadata: Metadata = {
  // Resolves relative OG/icon URLs against the live origin. Without it Next
  // falls back to localhost at build time, which silently breaks any social
  // preview image the moment one is added.
  metadataBase: new URL(BASE_URL),
  title: "Trekking in India | Best Adventure Travel & Holiday Packages | TripMySoul",
  description: SITE_DESCRIPTION,
  keywords: "Trekking in India, Adventure Travel India, Uttarakhand Treks, Himachal Pradesh Treks, Kashmir Great Lakes, Chardham Yatra, Cab Bookings",
  openGraph: {
    title: "TripMySoul | Where Every Journey Heals the Soul",
    description: "Handcrafted high-altitude trekking experiences and pilgrimage tours in the Indian Himalayas.",
    type: "website",
    locale: "en_US",
    siteName: "TripMySoul",
  }
};

// Tells Google which logo belongs to this domain (brand/knowledge panel).
// Separate from the favicon, which Next.js serves via the app/ icon file conventions.
const ORGANIZATION_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "TripMySoul",
  url: BASE_URL,
  logo: `${BASE_URL}/tms-logo-mark.png`,
  description: SITE_DESCRIPTION,
  email: "tripmysoulteam@gmail.com",
  telephone: "+91-8178613438",
  sameAs: [
    "https://www.instagram.com/tripmysoul.in/",
    "https://www.facebook.com/tripmysoul.in/",
    "https://www.linkedin.com/in/pramod-panwar-568702224/",
  ],
  address: {
    "@type": "PostalAddress",
    streetAddress: "Block E, Ln 8, Saraswati Vihar, Ajabpur Khurd",
    addressLocality: "Dehradun",
    addressRegion: "Uttarakhand",
    postalCode: "248001",
    addressCountry: "IN",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full scroll-smooth" suppressHydrationWarning>
      <body className="min-h-full flex flex-col bg-brand-warm-bg font-sans antialiased text-brand-dark-text" suppressHydrationWarning>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ORGANIZATION_JSON_LD) }}
        />
        <Navbar />
        <main className="flex-grow pt-[56px] lg:pt-[64px] min-w-0 overflow-x-clip">{children}</main>
        <Footer />
        <WhatsAppButton />
      </body>
    </html>
  );
}
