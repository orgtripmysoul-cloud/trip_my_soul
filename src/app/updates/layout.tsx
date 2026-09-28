import type { ReactNode } from "react";

import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Live Trail Updates",
  description:
    "Real-time reports on weather alerts, trail snow levels, safety guidelines, and forest department regulations.",
  path: "/updates",
});

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
