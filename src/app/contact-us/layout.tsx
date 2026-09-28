import type { ReactNode } from "react";

import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Contact Us",
  description:
    "Queries on snow conditions, batch bookings, customization or corporate retreats? Reach our adventure experts and we will get back to you immediately.",
  path: "/contact-us",
});

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
