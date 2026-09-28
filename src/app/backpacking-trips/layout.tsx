import type { ReactNode } from "react";

import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Backpacking Trips",
  description:
    "Himalayas, Northeast and beyond. Explore valleys, cultures and long trails at your own pace on an extended backpacking route.",
  path: "/backpacking-trips",
});

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
