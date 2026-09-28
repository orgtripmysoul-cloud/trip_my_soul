import type { ReactNode } from "react";

import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Sacred Pilgrimage Yatras",
  description:
    "Soul-healing spiritual yatras across the holy shrines of Uttarakhand — Chardham tours, Kedarnath heli-packages and Tungnath temple yatras.",
  path: "/yatra",
});

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
