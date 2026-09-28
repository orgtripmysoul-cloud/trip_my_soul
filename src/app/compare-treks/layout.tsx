import type { ReactNode } from "react";

import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Compare Himalayan Expeditions",
  description:
    "Put treks side by side on altitude, difficulty, duration and price to find the expedition that matches your fitness and your calendar.",
  path: "/compare-treks",
});

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
