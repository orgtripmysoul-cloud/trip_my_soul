import type { ReactNode } from "react";

import { noIndexMetadata } from "@/lib/seo";

export const metadata = noIndexMetadata(
  "Authentication",
  "Signing you in to TripMySoul.",
);

export default function AuthLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
