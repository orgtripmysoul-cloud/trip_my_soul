import type { ReactNode } from "react";

import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Himalayan Summer Camps",
  description:
    "Safe, educational forest camp programs for students and kids, focused on navigation, nature preservation and wilderness survival.",
  path: "/summer-camps",
});

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
