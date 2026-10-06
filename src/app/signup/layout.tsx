import type { ReactNode } from "react";

import { noIndexMetadata } from "@/lib/seo";

export const metadata = noIndexMetadata(
  "Sign Up",
  "Create your TripMySoul account.",
);

export default function SignupLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
