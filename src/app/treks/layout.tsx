import type { ReactNode } from "react";

import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Himalayan Trekking Trails",
  description:
    "Find your next healing journey from our verified high-altitude expeditions. Filter by region, month, theme, or difficulty level.",
  path: "/treks",
});

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
