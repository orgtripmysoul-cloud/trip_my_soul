import type { ReactNode } from "react";

import { noIndexMetadata } from "@/lib/seo";

export const metadata = noIndexMetadata(
  "Log In",
  "Sign in to your TripMySoul account.",
);

export default function LoginLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
