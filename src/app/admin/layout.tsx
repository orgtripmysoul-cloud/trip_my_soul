import type { ReactNode } from "react";

import { noIndexMetadata } from "@/lib/seo";
import AdminShell from "./AdminShell";

/**
 * Server wrapper so the admin panel can declare metadata (the shell itself is
 * a client component). `noindex, nofollow` here plus the X-Robots-Tag header
 * in next.config.ts keep every /admin page out of search results, and the
 * distinct title stops it ever competing with the homepage on brand searches.
 */
export const metadata = noIndexMetadata("Admin", "TripMySoul staff admin panel.");

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}
