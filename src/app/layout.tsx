import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "Trekking in India | Best Adventure Travel & Holiday Packages | TripMySoul",
  description: "Explore the best high-altitude treks and spiritual yatras in India with TripMySoul. Affordable holiday packages, expert local guides, and scenic trail routes in Uttarakhand, Himachal, and Kashmir.",
  keywords: "Trekking in India, Adventure Travel India, Uttarakhand Treks, Himachal Pradesh Treks, Kashmir Great Lakes, Chardham Yatra, Cab Bookings",
  openGraph: {
    title: "TripMySoul | Where Every Journey Heals the Soul",
    description: "Handcrafted high-altitude trekking experiences and pilgrimage tours in the Indian Himalayas.",
    type: "website",
    locale: "en_US",
    siteName: "TripMySoul",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full scroll-smooth" suppressHydrationWarning>
      <body className="min-h-full flex flex-col bg-brand-warm-bg font-sans antialiased text-brand-dark-text" suppressHydrationWarning>
        <Navbar />
        <main className="flex-grow pt-[56px] lg:pt-[64px] min-w-0 overflow-x-clip">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
