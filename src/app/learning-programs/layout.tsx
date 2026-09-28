import type { ReactNode } from "react";

import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Institutional Learning Programs",
  description:
    "Leadership development, team dynamics, and mental resilience training conducted in the wilderness for schools and institutions.",
  path: "/learning-programs",
});

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
