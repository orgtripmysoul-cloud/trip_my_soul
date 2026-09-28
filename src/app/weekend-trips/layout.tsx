import type { ReactNode } from "react";

import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Weekend Getaways",
  description:
    "Short breaks across the Himalayas and South India — two and three day escapes built for a refreshing weekend reset.",
  path: "/weekend-trips",
});

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
