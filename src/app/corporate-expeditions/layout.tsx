import type { ReactNode } from "react";

import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Corporate & Educational Retreats",
  description:
    "Tailor-made team building, wilderness survival programs, and outdoor leadership expeditions for corporate organizations, schools and university groups.",
  path: "/corporate-expeditions",
});

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
