import type { ReactNode } from "react";

import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Heal Himala Initiative",
  description:
    "Join TripMySoul's zero-waste trail movements, forest trash cleanups, and local tree plantation drives across the Himalayas.",
  path: "/heal-himala",
});

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
