import type { ReactNode } from "react";

import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Suggest Me A Trek",
  description:
    "Answer a few quick questions about your experience, preferences and budget to see trek recommendations matched to your profile.",
  path: "/suggest-a-trek",
});

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
