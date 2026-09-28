import type { ReactNode } from "react";

import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Gear Shop",
  description:
    "Premium outdoor brands validated for extreme Himalayan winter conditions, picked by the team that guides on them.",
  path: "/store",
});

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
