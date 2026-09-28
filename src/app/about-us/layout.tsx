import type { ReactNode } from "react";

import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "About Us",
  description:
    "Meet the Dehradun team behind TripMySoul — how we started, the trek leaders who run our expeditions, and the values that shape every journey.",
  path: "/about-us",
});

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
