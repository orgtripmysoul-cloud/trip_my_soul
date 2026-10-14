import type { ReactNode } from "react";

import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "South India Trips",
  description:
    "Explore South India — Kerala backwaters, Coorg and Chikmagalur coffee hills, Gokarna beaches and the Nilgiris. Weekend getaways and longer backpacking routes.",
  path: "/south-trips",
});

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
