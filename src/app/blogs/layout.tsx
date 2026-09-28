import type { ReactNode } from "react";

import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Himalayan Trekking Blog",
  description:
    "Preparation guides, first-hand trail stories, and sustainable trekking policies from the team behind your adventures.",
  path: "/blogs",
});

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
