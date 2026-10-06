import type { ReactNode } from "react";

import { noIndexMetadata } from "@/lib/seo";

// Covers both /pay and the per-quote /pay/[token] pages.
export const metadata = noIndexMetadata(
  "Payment",
  "Make a secure payment towards your TripMySoul trip.",
);

export default function PayLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
