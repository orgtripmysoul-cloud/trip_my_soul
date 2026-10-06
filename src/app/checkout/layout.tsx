import type { ReactNode } from "react";

import { noIndexMetadata } from "@/lib/seo";

// `checkout/page.tsx` is a client component and cannot export metadata itself,
// so the head tags for this route live here.
export const metadata = noIndexMetadata(
  "Checkout",
  "Complete your TripMySoul booking.",
);

export default function CheckoutLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
