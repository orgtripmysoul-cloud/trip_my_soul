import type { ReactNode } from "react";

import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Rent Trekking Gear",
  description:
    "Hire high-altitude climbing equipment at nominal per-day charges, collected directly from your trek's basecamp.",
  path: "/rent",
});

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
