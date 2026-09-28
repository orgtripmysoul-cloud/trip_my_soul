import type { ReactNode } from "react";

import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Cab & Transport Bookings",
  description:
    "Airport pickups and drops to Sankri, Haridwar, Dehradun and Rishikesh. Verified vehicles with professional mountain drivers for safe, on-time travel.",
  path: "/cabs",
});

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
