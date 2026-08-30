"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, Compass, User, Phone, Search, FileText, Briefcase, ChevronRight, ShoppingBag } from "lucide-react";
import { TREKS } from "@/data/db";
import { ALL_TRIPS, CANONICAL_TRIP_PATHS, tripSearchHaystack } from "@/data/trips";
import { getPhoneForPath } from "@/config/contact";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isChooseTrekOpen, setIsChooseTrekOpen] = useState(false);
  const [selectedModalRegion, setSelectedModalRegion] = useState("All");
  const [selectedModalSeason, setSelectedModalSeason] = useState("All");
  const pathname = usePathname();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Weekend / backpacking routes use a different contact desk.
  const phone = getPhoneForPath(pathname);

  /**
   * Global search. Detailed trips rank first and match on their alternate
   * names too, so "Madmaheshwar" or "Kedar" finds every relevant package;
   * legacy treks fill the rest. Slugs already covered by a canonical trip
   * page are dropped so one package never appears twice in the dropdown.
   */
  const searchResults = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return [];

    const tripHits = ALL_TRIPS.filter((t) => tripSearchHaystack(t).includes(query)).map((t) => ({
      slug: t.slug,
      name: t.name,
      region: t.region,
      days: t.days as number | string | null,
      price: t.price,
      href: t.detailsPath,
    }));

    const canonicalised = new Set(Object.keys(CANONICAL_TRIP_PATHS));
    const trekHits = TREKS.filter(
      (t) =>
        !canonicalised.has(t.slug) &&
        (t.name.toLowerCase().includes(query) || t.region.toLowerCase().includes(query))
    ).map((t) => ({
      slug: t.slug,
      name: t.name,
      region: t.region,
      days: t.days,
      price: t.price,
      href: `/treks/${t.slug}`,
    }));

    return [...tripHits, ...trekHits].slice(0, 6);
  }, [searchQuery]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /**
   * While the mobile drawer is open, freeze the page behind it. Without this
   * the body keeps scrolling under the overlay on iOS/Android, and the user
   * loses their place the moment they close the menu.
   */
  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen]);

  // Navigating from inside the drawer should always dismiss it.
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  /**
   * The whole navbar. Four links plus the trek search fit beside the logo at
   * every width, so the old NAV_TIER / "More" overflow machinery is gone.
   */
  const navLinks = [
    { name: "Our Story", href: "/about-us" },
    { name: "Rent", href: "/rent" },
    { name: "Careers", href: "/careers" },
    { name: "My Profile", href: "/dashboard" },
  ];

  const isLinkActive = (href: string) =>
    pathname === href || (href !== "/treks" && pathname.startsWith(href));

  const renderNavLink = (link: { name: string; href: string }, extraClass = "") => {
    const isActive = isLinkActive(link.href);

    return (
      <Link
        key={link.name}
        href={link.href}
        className={`items-center text-sm font-semibold tracking-wide whitespace-nowrap shrink-0 transition-colors hover:text-brand-dusk-orange ${
          isActive ? "text-brand-dusk-orange border-b-2 border-brand-dusk-orange pb-0.5" : "text-white"
        } ${extraClass}`}
      >
        {link.name}
      </Link>
    );
  };

  const getDrawerIcon = (name: string) => {
    const cls = "w-4 h-4 text-brand-dusk shrink-0";
    switch (name) {
      case "Careers": return <Briefcase className={cls} />;
      case "Rent": return <ShoppingBag className={cls} />;
      case "My Profile": return <User className={cls} />;
      case "Our Story": return <FileText className={cls} />;
      default: return <Compass className={cls} />;
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 bg-brand-forest/95 backdrop-blur-md border-b border-white/15 text-white ${
          isScrolled ? "py-1 shadow-md" : "py-1 shadow-sm"
        }`}
      >
        <div className="w-full max-w-full px-4 sm:px-6 lg:px-8 xl:px-12 flex items-center justify-between gap-4">
          {/* Logo Section */}
          <Link href="/" className="flex items-center min-h-[44px] group shrink-0">
            <div className="relative h-12 w-[177px] lg:h-14 lg:w-[207px]">
              <Image
                src="/tripmysoul_mobile_logo.png"
                alt="TripMySoul Logo"
                fill
                className="object-contain object-left group-hover:scale-102 transition-transform duration-200"
                priority
              />
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-x-5 xl:gap-x-7 py-1 shrink-0">
            {navLinks.map((link) => renderNavLink(link, "inline-flex"))}
          </nav>

          {/* Right Action Bar (Search Treks + Phone + Sign In) */}
          <div className="hidden lg:flex items-center space-x-2.5 lg:space-x-3 shrink-0">
            {/* Desktop "Search Treks" input */}
            <div className="relative w-56 xl:w-72 2xl:w-96">
              <div className="flex items-center gap-2 px-4 py-2.5 bg-white border border-brand-forest/15 rounded-full text-brand-forest text-sm shadow-xs">
                <Search className="w-5 h-5 text-brand-forest/50 shrink-0" />
                <input
                  type="text"
                  placeholder="Search Treks"
                  aria-label="Search Treks"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                  className="bg-transparent border-0 focus:outline-none w-full text-brand-forest placeholder-brand-forest/45 text-base lg:text-sm font-semibold"
                />
              </div>

              {/* Autocomplete Dropdown */}
              {isSearchFocused && searchResults.length > 0 && (
                <div className="absolute top-full right-0 mt-2 w-[min(24rem,calc(100vw-2rem))] bg-white border border-brand-forest/10 rounded-2xl shadow-xl overflow-hidden z-50 text-brand-forest font-sans text-xs">
                  <div className="p-2 space-y-1">
                    {searchResults.map((trek) => (
                      <button
                        key={trek.slug}
                        onMouseDown={() => {
                          router.push(trek.href);
                          setSearchQuery("");
                        }}
                        className="w-full flex items-center gap-3 p-2 hover:bg-brand-warm-card rounded-xl transition text-left"
                      >
                        <div className="w-8 h-8 rounded-lg overflow-hidden bg-brand-warm-card shrink-0 relative">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src="https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=80&q=80"
                            alt={trek.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="space-y-0.5 min-w-0 flex-1">
                          <span className="font-bold text-sm block text-brand-forest truncate">
                            {trek.name}
                          </span>
                          <span className="text-[11px] text-brand-forest/60 font-semibold block leading-none truncate">
                            {trek.region} • {trek.days} Days
                          </span>
                        </div>
                        <div className="ml-auto text-right shrink-0">
                          <span className="text-xs text-brand-dusk font-bold">
                            {trek.price ? `₹${trek.price.toLocaleString()}` : "TBD"}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {isSearchFocused && searchQuery && searchResults.length === 0 && (
                <div className="absolute top-full right-0 mt-2 w-[min(20rem,calc(100vw-2rem))] bg-white border border-brand-forest/10 rounded-2xl shadow-xl p-3 text-center text-brand-forest/60 z-50 text-[11px]">
                  No matching treks found.
                </div>
              )}
            </div>

            {/* Phone support — icon-only until there is room for the full number */}
            <a
              href={`tel:${phone.tel}`}
              aria-label={`Call TripMySoul on ${phone.display}`}
              title={phone.display}
              className="flex items-center gap-2 text-sm font-semibold px-4 py-2.5 rounded-full border border-white/25 text-white hover:bg-white/10 transition whitespace-nowrap shrink-0"
            >
              <Phone className="w-4 h-4 text-brand-dusk-orange shrink-0" />
              <span className="hidden 2xl:inline">{phone.display}</span>
            </a>

            {/* Sign In */}
            <Link
              href="/login"
              className="flex items-center gap-2 text-sm font-bold bg-brand-dusk hover:bg-brand-dusk-orange text-white px-5 py-2.5 rounded-full shadow-md transition transform hover:-translate-y-0.5 whitespace-nowrap shrink-0"
            >
              <User className="w-4 h-4 shrink-0" />
              <span>Sign In</span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex lg:hidden items-center space-x-1.5">
            <Link
              href="/login"
              className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 transition text-white min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label="User account"
            >
              <User className="w-5 h-5" />
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 transition text-white min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer (Slide-over) */}
      <div
        className={`fixed inset-0 z-40 bg-brand-dark-text/40 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsOpen(false)}
      >
        <div
          className={`absolute top-0 right-0 w-[85%] max-w-sm h-full bg-brand-warm-bg text-brand-forest shadow-2xl transition-transform duration-300 transform flex flex-col overflow-hidden ${
            isOpen ? "translate-x-0" : "translate-x-full"
          }`}
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
        >
          {/* Header - pinned, never scrolls out of reach */}
          <div className="flex justify-between items-center gap-3 shrink-0 border-b border-brand-forest/10 px-5 pt-5 pb-4">
            {/* Navy chip: the logo wordmark is white, so it needs a dark backdrop
                to stay legible against the drawer's cream panel. */}
            <div className="bg-brand-forest rounded-lg px-2.5 py-1.5 shrink-0">
              <div className="relative h-10 w-[148px]">
                <Image
                  src="/tripmysoul_mobile_logo.png"
                  alt="TripMySoul Logo"
                  fill
                  className="object-contain object-left"
                />
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2.5 rounded-full bg-brand-forest/5 hover:bg-brand-forest/10 border border-brand-forest/15 transition min-w-[44px] min-h-[44px] flex items-center justify-center shrink-0"
              aria-label="Close menu"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/*
            Scrollable middle. The drawer is a flex column so the call / sign-in
            actions stay pinned to the bottom: on a 667px-tall phone the old
            fixed-height layout pushed them off-screen entirely.
          */}
          <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-5 py-5">
            {/* Mobile "Search Treks" inside drawer */}
            <div className="mb-6 relative">
              <div className="flex items-center gap-2.5 px-4 py-3 bg-white border border-brand-forest/15 rounded-xl text-brand-forest">
                <Search className="w-5 h-5 text-brand-forest/50 shrink-0" />
                {/* text-base (16px) stops iOS Safari zooming in on focus */}
                <input
                  type="text"
                  placeholder="Search Treks"
                  aria-label="Search Treks"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                  className="bg-transparent border-0 focus:outline-none w-full min-w-0 text-brand-forest placeholder-brand-forest/45 text-base self-stretch py-3 -my-3"
                />
              </div>

              {/* Mobile Autocomplete Dropdown */}
              {isSearchFocused && searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-brand-forest/10 rounded-2xl shadow-xl overflow-hidden z-50 text-brand-forest font-sans text-xs">
                  <div className="p-2 space-y-1">
                    {searchResults.map((trek) => (
                      <button
                        key={trek.slug}
                        onMouseDown={() => {
                          router.push(trek.href);
                          setSearchQuery("");
                          setIsOpen(false);
                        }}
                        className="w-full flex items-center gap-3 p-2 hover:bg-brand-warm-card rounded-xl transition text-left"
                      >
                        <div className="w-8 h-8 rounded-lg overflow-hidden bg-brand-warm-card shrink-0 relative">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src="https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=80&q=80"
                            alt={trek.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="space-y-0.5 min-w-0 flex-1">
                          <span className="font-bold text-[11px] block text-brand-forest truncate">
                            {trek.name}
                          </span>
                          <span className="text-[9px] text-brand-forest/60 font-semibold block leading-none truncate">
                            {trek.region} • {trek.days} Days
                          </span>
                        </div>
                        <div className="ml-auto text-right shrink-0">
                          <span className="text-xs text-brand-dusk font-bold">
                            {trek.price ? `₹${trek.price.toLocaleString()}` : "TBD"}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {isSearchFocused && searchQuery && searchResults.length === 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-brand-forest/10 rounded-2xl shadow-xl p-4 text-center text-brand-forest/60 z-50 text-[11px]">
                  No matching treks found.
                </div>
              )}
            </div>

            <nav className="flex flex-col">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="flex items-center justify-between gap-3 min-h-[52px] py-3 text-sm font-bold border-b border-brand-forest/10 hover:text-brand-dusk transition-colors group"
                  onClick={() => setIsOpen(false)}
                >
                  <span className="flex items-center gap-3 min-w-0">
                    {getDrawerIcon(link.name)}
                    <span className="tracking-wide text-brand-forest group-hover:text-brand-dusk transition-colors uppercase truncate">
                      {link.name}
                    </span>
                  </span>
                  <ChevronRight className="w-4 h-4 shrink-0 text-brand-forest/40 group-hover:text-brand-dusk transition-transform duration-200 group-hover:translate-x-0.5" />
                </Link>
              ))}
            </nav>
          </div>

          {/* Pinned actions - always reachable regardless of screen height */}
          <div className="shrink-0 border-t border-brand-forest/10 bg-brand-warm-bg px-5 pt-4 safe-bottom-lg flex flex-col gap-3">
            <a
              href={`tel:${phone.tel}`}
              className="flex items-center gap-3 min-h-[48px] px-4 py-2.5 rounded-lg bg-white border border-brand-forest/15 hover:bg-brand-warm-card transition text-sm font-semibold text-brand-forest"
            >
              <Phone className="w-4 h-4 text-brand-dusk shrink-0" />
              <span className="truncate">{phone.display}</span>
            </a>
            <Link
              href="/login"
              className="flex items-center justify-center gap-2 min-h-[48px] px-4 py-3 rounded-xl bg-brand-dusk hover:bg-brand-dusk-orange text-white text-sm font-semibold shadow-lg transition"
              onClick={() => setIsOpen(false)}
            >
              <User className="w-4 h-4 shrink-0" />
              <span className="truncate">Sign In / My Trips</span>
            </Link>
          </div>
        </div>
      </div>

      {/* TTH Signature "Choose Trek" Quick-Finder Modal */}
      {isChooseTrekOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
          <div className="bg-[#0B2545] border border-white/20 text-white rounded-3xl max-w-3xl w-full p-5 sm:p-6 md:p-8 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto overscroll-contain">
            <button
              onClick={() => setIsChooseTrekOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition min-w-[44px] min-h-[44px] flex items-center justify-center"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1 pr-12">
              <div className="flex items-center gap-2 text-brand-dusk-orange text-xs font-extrabold uppercase tracking-widest">
                <Compass className="w-4 h-4" />
                <span>Quick Trek Finder</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold font-serif">Choose Your Himalayan Trek</h2>
              <p className="text-xs text-gray-300">Filter expeditions by region, season, or duration instantly.</p>
            </div>

            {/* Region Filter Pills */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">1. Select Region</span>
              <div className="flex flex-wrap gap-2">
                {["All", "Uttarakhand", "Himachal Pradesh", "Jammu & Kashmir"].map((reg) => (
                  <button
                    key={reg}
                    onClick={() => setSelectedModalRegion(reg)}
                    className={`text-xs px-4 min-h-[40px] rounded-full border font-bold transition ${
                      selectedModalRegion === reg
                        ? "bg-brand-dusk-orange text-white border-brand-dusk-orange"
                        : "bg-white/5 border-white/15 text-gray-200 hover:bg-white/10"
                    }`}
                  >
                    {reg}
                  </button>
                ))}
              </div>
            </div>

            {/* Season Filter Pills */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">2. Select Season</span>
              <div className="flex flex-wrap gap-2">
                {["All", "Winter", "Spring", "Summer", "Monsoon", "Autumn"].map((seas) => (
                  <button
                    key={seas}
                    onClick={() => setSelectedModalSeason(seas)}
                    className={`text-xs px-4 min-h-[40px] rounded-full border font-bold transition ${
                      selectedModalSeason === seas
                        ? "bg-brand-dusk-orange text-white border-brand-dusk-orange"
                        : "bg-white/5 border-white/15 text-gray-200 hover:bg-white/10"
                    }`}
                  >
                    {seas}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Matching Treks List */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  Recommended Treks ({
                    TREKS.filter(t => {
                      if (selectedModalRegion !== "All" && t.region !== selectedModalRegion) return false;
                      if (selectedModalSeason !== "All") {
                        const seasonMonths: Record<string, string[]> = {
                          "Winter": ["Dec", "Jan", "Feb"],
                          "Spring": ["Mar", "Apr"],
                          "Summer": ["May", "Jun"],
                          "Monsoon": ["Jul", "Aug"],
                          "Autumn": ["Sep", "Oct", "Nov"]
                        };
                        const months = seasonMonths[selectedModalSeason] || [];
                        if (!t.months.some(m => months.includes(m))) return false;
                      }
                      return true;
                    }).length
                  })
                </span>
                <Link
                  href="/compare-treks"
                  onClick={() => setIsChooseTrekOpen(false)}
                  className="text-xs font-bold text-brand-dusk-orange hover:underline flex items-center gap-1"
                >
                  <span>Compare Treks Matrix →</span>
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-56 overflow-y-auto pr-1">
                {TREKS.filter(t => {
                  if (selectedModalRegion !== "All" && t.region !== selectedModalRegion) return false;
                  if (selectedModalSeason !== "All") {
                    const seasonMonths: Record<string, string[]> = {
                      "Winter": ["Dec", "Jan", "Feb"],
                      "Spring": ["Mar", "Apr"],
                      "Summer": ["May", "Jun"],
                      "Monsoon": ["Jul", "Aug"],
                      "Autumn": ["Sep", "Oct", "Nov"]
                    };
                    const months = seasonMonths[selectedModalSeason] || [];
                    if (!t.months.some(m => months.includes(m))) return false;
                  }
                  return true;
                }).slice(0, 6).map(trek => (
                  <button
                    key={trek.slug}
                    onClick={() => {
                      setIsChooseTrekOpen(false);
                      router.push(CANONICAL_TRIP_PATHS[trek.slug] ?? `/treks/${trek.slug}`);
                    }}
                    className="flex items-center justify-between p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition text-left group"
                  >
                    <div className="min-w-0 flex-1">
                      <span className="font-bold text-xs block text-white group-hover:text-brand-dusk-orange transition truncate">{trek.name}</span>
                      <span className="text-[10px] text-gray-400 block truncate">{trek.region} • {trek.days} Days</span>
                    </div>
                    <span className="text-xs font-bold text-brand-dusk-orange shrink-0 ml-3">
                      {trek.price ? `₹${trek.price.toLocaleString()}` : "TBD"}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Action Bar */}
            <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row gap-3 justify-between items-center">
              <Link
                href={`/treks?${selectedModalRegion !== "All" ? `region=${selectedModalRegion.toLowerCase().replace(/\s+/g, '-')}` : ''}`}
                onClick={() => setIsChooseTrekOpen(false)}
                className="w-full sm:w-auto px-6 py-3 rounded-full bg-brand-dusk hover:bg-brand-dusk-orange text-white font-bold text-xs text-center transition shadow-lg"
              >
                Browse All Filtered Treks
              </Link>
              <Link
                href="/corporate-expeditions"
                onClick={() => setIsChooseTrekOpen(false)}
                className="text-xs font-semibold text-gray-300 hover:text-white transition"
              >
                Custom Group / School Expedition Request
              </Link>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
