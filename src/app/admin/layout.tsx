"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { Compass, LogOut } from "lucide-react";
import { supabaseBrowser } from "@/lib/supabase/client";

/**
 * Client-side guard only — a UX convenience so a signed-out staff member
 * lands on the login page instead of a broken shell. It is NOT the security
 * boundary: every admin API route independently calls requireStaff(), which
 * is what actually enforces access.
 */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [checked, setChecked] = useState(false);

  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (isLoginPage) {
      setChecked(true);
      return;
    }
    const supabase = supabaseBrowser();
    if (!supabase) {
      router.push("/admin/login");
      return;
    }
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.push("/admin/login");
        return;
      }
      setChecked(true);
    });
  }, [isLoginPage, router]);

  const handleLogout = async () => {
    await supabaseBrowser()?.auth.signOut();
    router.push("/admin/login");
  };

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (!checked) {
    return <div className="min-h-screen bg-brand-warm-bg" />;
  }

  return (
    <div className="min-h-screen bg-brand-warm-bg font-sans">
      <header className="bg-brand-forest text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/admin/bookings" className="flex items-center gap-2 font-serif font-extrabold text-lg">
              <Compass className="w-5 h-5 text-brand-dusk-orange" />
              <span>TripMySoul Admin</span>
            </Link>
            <nav className="hidden sm:flex items-center gap-4 text-xs font-bold">
              <Link href="/admin/bookings" className="hover:text-brand-dusk-orange transition">
                Bookings
              </Link>
              <Link href="/admin/payments" className="hover:text-brand-dusk-orange transition">
                Payments
              </Link>
              <Link href="/admin/quotes" className="hover:text-brand-dusk-orange transition">
                Custom Quotes
              </Link>
            </nav>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-xs font-bold bg-white/10 hover:bg-white/20 border border-white/20 px-4 py-2 rounded-full transition"
          >
            <LogOut className="w-4 h-4 text-brand-dusk-orange" />
            <span>Sign Out</span>
          </button>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{children}</main>
    </div>
  );
}
