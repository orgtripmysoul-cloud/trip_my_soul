import type { ReactNode } from "react";

import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Premium Himalayan Experiences",
  description:
    "Climb the Himalayas with curated luxury additions — individual dome tents, premium lodging, private chefs, and high-altitude emergency safety nets.",
  path: "/premium-trips",
});

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
