import type { ReactNode } from "react";

import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Careers",
  description:
    "Work in high-altitude environments or coordinate travel operations from our Dehradun offices. View the active openings at TripMySoul.",
  path: "/careers",
});

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
