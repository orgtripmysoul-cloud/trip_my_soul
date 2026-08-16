"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, Compass, User, Phone, Search, FileText, Trees, Briefcase, ChevronRight, ChevronDown, ShoppingBag, Tent, Backpack } from "lucide-react";
import { TREKS } from "@/data/db";
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

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return TREKS.filter((t) =>
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.region.toLowerCase().includes(searchQuery.toLowerCase())
    ).slice(0, 5);
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

  const navLinksBeforeTreks = [
    { name: "Careers", href: "/careers" },
    { name: "Rent", href: "/rent" },
    { name: "Contact Us", href: "/contact-us" },
    { name: "My Profile", href: "/dashboard" },
    { name: "All Treks", href: "/treks" },
    { name: "All Trip", href: "/treks" },
  ];

  const navLinksTripMiddle = [
    { name: "Weekend Trips", href: "/weekend-trips" },
    { name: "Backpacking Trips", href: "/backpacking-trips" },
  ];

  const navLinksAfterTreks = [
    { name: "Our Story", href: "/about-us" },
  ];

  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);

  /**
   * Desktop nav overflow strategy.
   *
   * Nine links cannot fit beside the logo and action bar below ~1900px, so each
   * item is assigned the breakpoint at which it becomes inline. Anything not yet
   * inline lives in the "More" dropdown, so every item is reachable at every
   * width without hidden scrolling or clipping.
   */
  const NAV_TIER: Record<string, "lg" | "xl" | "more"> = {
    "All Treks": "lg",
    "Weekend Trips": "lg",
    "Backpacking Trips": "lg",
    "All Trip": "xl",
    "Our Story": "xl",
    "Contact Us": "more",
    "Careers": "more",
    "Rent": "more",
    "My Profile": "more",
  };

  const desktopNavLinks = [
    ...navLinksBeforeTreks,
    ...navLinksTripMiddle,
    ...navLinksAfterTreks,
  ].sort(
    (a, b) =>
      Object.keys(NAV_TIER).indexOf(a.name) - Object.keys(NAV_TIER).indexOf(b.name)
  );

  const inlineLinks = desktopNavLinks.filter((l) => NAV_TIER[l.name] !== "more");
  /** "more"-tier items always live here; "xl"-tier items only until they go inline. */
  const overflowLinks = desktopNavLinks.filter((l) => NAV_TIER[l.name] !== "lg");

  const isLinkActive = (href: string) =>
    pathname === href || (href !== "/treks" && pathname.startsWith(href));

  const renderNavLink = (link: { name: string; href: string }, extraClass = "") => {
    const isActive = isLinkActive(link.href);

    return (
      <Link
        key={link.name}
        href={link.href}
        className={`items-center text-xs font-semibold tracking-wide whitespace-nowrap shrink-0 transition-colors hover:text-brand-dusk-orange ${
          isActive ? "text-brand-dusk-orange border-b-2 border-brand-dusk-orange pb-0.5" : "text-gray-100"
        } ${extraClass}`}
      >
        {link.name}
      </Link>
    );
  };

  const getDrawerIcon = (name: string) => {
    const cls = "w-4 h-4 text-brand-dusk-orange shrink-0";
    switch (name) {
      case "Careers": return <Briefcase className={cls} />;
      case "Rent": return <ShoppingBag className={cls} />;
      case "Contact Us": return <Phone className={cls} />;
      case "My Profile": return <User className={cls} />;
      case "All Treks": return <Compass className={cls} />;
      case "All Trip": return <Trees className={cls} />;
      case "Weekend Trips": return <Tent className={cls} />;
      case "Backpacking Trips": return <Backpack className={cls} />;
      case "Our Story": return <FileText className={cls} />;
      default: return <Compass className={cls} />;
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 glass-dark text-white shadow-lg ${
          isScrolled ? "py-2.5" : "py-3.5"
        }`}
      >
        <div className="w-full max-w-full px-4 sm:px-6 lg:px-8 xl:px-12 flex items-center justify-between gap-4">
          {/* Logo Section */}
          <Link href="/" className="flex items-center group shrink-0">
            <div className="relative h-8 w-40 md:h-8.5 md:w-44">
              <Image
                src="/tripmysoul-mobile-logo.png"
                alt="TripMySoul Logo"
                fill
                className="object-contain object-left group-hover:scale-102 transition-transform duration-200"
                priority
              />
            </div>
          </Link>

          {/* Desktop Nav Links */}
          {/* Links that fit are inline; the rest sit in "More" — nothing is ever
              clipped or hidden behind a scrollbar. See NAV_TIER above. */}
          <nav className="hidden lg:flex items-center gap-x-4 xl:gap-x-5 py-1 shrink-0">
            {inlineLinks.map((link) =>
              renderNavLink(
                link,
                NAV_TIER[link.name] === "lg" ? "inline-flex" : "hidden xl:inline-flex"
              )
            )}

            {/* More dropdown */}
            <div className="relative shrink-0">
              <button
                onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
                onBlur={() => setTimeout(() => setIsMoreMenuOpen(false), 200)}
                aria-haspopup="menu"
                aria-expanded={isMoreMenuOpen}
                className="flex items-center gap-1 text-xs font-semibold tracking-wide whitespace-nowrap text-gray-100 hover:text-brand-dusk-orange transition-colors"
              >
                <span>More</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isMoreMenuOpen ? "rotate-180" : ""}`} />
              </button>

              {isMoreMenuOpen && (
                <div
                  role="menu"
                  className="absolute top-full right-0 mt-3 w-52 bg-[#0B2545]/95 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50 p-2 space-y-0.5 animate-fade-in"
                >
                  {overflowLinks.map((link) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      role="menuitem"
                      onClick={() => setIsMoreMenuOpen(false)}
                      className={`flex items-center gap-2.5 p-2.5 rounded-xl text-xs font-bold transition hover:bg-white/10 ${
                        isLinkActive(link.href) ? "text-brand-dusk-orange" : "text-gray-100"
                      } ${NAV_TIER[link.name] === "xl" ? "xl:hidden" : ""}`}
                    >
                      {getDrawerIcon(link.name)}
                      <span>{link.name}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </nav>

          {/* Right Action Bar (Search + Choose Trek + Contact + Account) */}
          <div className="hidden lg:flex items-center space-x-2.5 lg:space-x-3 shrink-0">
            {/* Desktop search input */}
            <div className="relative w-32 xl:w-44 2xl:w-52">
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 border border-white/20 rounded-full text-white text-xs">
                <Search className="w-3.5 h-3.5 opacity-60 shrink-0" />
                <input
                  type="text"
                  placeholder="Search treks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                  className="bg-transparent border-0 focus:outline-none w-full text-white placeholder-gray-300 text-xs font-semibold"
                />
              </div>
              
              {/* Autocomplete Dropdown */}
              {isSearchFocused && searchResults.length > 0 && (
                <div className="absolute top-full right-0 mt-2 w-64 lg:w-72 bg-[#0B2545]/95 backdrop-blur-md border border-white/10 rounded-2xl shadow-xl overflow-hidden z-50 text-white font-sans text-xs">
                  <div className="p-2 space-y-1">
                    {searchResults.map((trek) => (
                      <button
                        key={trek.slug}
                        onMouseDown={() => {
                          router.push(`/treks/${trek.slug}`);
                          setSearchQuery("");
                        }}
                        className="w-full flex items-center gap-3 p-2 hover:bg-white/10 rounded-xl transition text-left"
                      >
                        <div className="w-8 h-8 rounded-lg overflow-hidden bg-white/5 shrink-0 relative">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src="https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=80&q=80"
                            alt={trek.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="space-y-0.5">
                          <span className="font-bold text-xs block text-white truncate max-w-[130px]">
                            {trek.name}
                          </span>
                          <span className="text-[10px] text-gray-400 font-semibold block leading-none">
                            {trek.region} • {trek.days} Days
                          </span>
                        </div>
                        <div className="ml-auto text-right shrink-0">
                          <span className="text-[10px] text-brand-dusk-orange font-bold">
                            {trek.price ? `₹${trek.price.toLocaleString()}` : "TBD"}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              {isSearchFocused && searchQuery && searchResults.length === 0 && (
                <div className="absolute top-full right-0 mt-2 w-64 bg-[#0B2545]/95 backdrop-blur-md border border-white/10 rounded-2xl shadow-xl p-3 text-center text-gray-400 z-50 text-[11px]">
                  No matching treks found.
                </div>
              )}
            </div>

            {/* Choose Trek Quick Finder Trigger */}
            <button
              onClick={() => setIsChooseTrekOpen(true)}
              aria-label="Choose a trek"
              title="Choose Trek"
              className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/25 text-white transition whitespace-nowrap shadow-xs shrink-0"
            >
              <Compass className="w-3.5 h-3.5 text-brand-dusk-orange shrink-0" />
              <span className="hidden 2xl:inline">Choose Trek</span>
            </button>

            {/* Phone support — icon-only until there is room for the full number */}
            <a
              href={`tel:${phone.tel}`}
              aria-label={`Call TripMySoul on ${phone.display}`}
              title={phone.display}
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border border-white/20 hover:bg-white/10 transition whitespace-nowrap shrink-0"
            >
              <Phone className="w-3.5 h-3.5 text-brand-dusk-orange shrink-0" />
              <span className="hidden 2xl:inline">{phone.display}</span>
            </a>

            {/* Account / Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                onBlur={() => setTimeout(() => setIsProfileMenuOpen(false), 200)}
                className="flex items-center gap-1.5 text-xs font-bold bg-brand-dusk hover:bg-brand-dusk-orange text-white px-3.5 py-1.5 rounded-full shadow-md transition transform hover:-translate-y-0.5 whitespace-nowrap shrink-0"
              >
                <User className="w-3.5 h-3.5 shrink-0" />
                <span className="hidden 2xl:inline">My Trips &amp; Profile</span>
                <span className="2xl:hidden">Profile</span>
                <ChevronRight className={`w-3 h-3 transition-transform ${isProfileMenuOpen ? "rotate-90" : ""}`} />
              </button>

              {/* Profile Dropdown Menu */}
              {isProfileMenuOpen && (
                <div className="absolute top-full right-0 mt-2 w-56 bg-[#0B2545]/95 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50 text-white font-sans text-xs p-2 space-y-1 animate-fade-in">
                  <Link
                    href="/dashboard"
                    className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-white/10 transition font-bold"
                  >
                    <User className="w-4 h-4 text-brand-dusk-orange" />
                    <span>My Profile & Bookings</span>
                  </Link>
                  <Link
                    href="/treks"
                    className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-white/10 transition font-bold"
                  >
                    <Compass className="w-4 h-4 text-brand-dusk-orange" />
                    <span>All Treks</span>
                  </Link>
                  <Link
                    href="/treks"
                    className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-white/10 transition font-bold"
                  >
                    <Trees className="w-4 h-4 text-brand-dusk-orange" />
                    <span>All Trips</span>
                  </Link>
                  <Link
                    href="/about-us"
                    className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-white/10 transition font-bold"
                  >
                    <FileText className="w-4 h-4 text-brand-dusk-orange" />
                    <span>Our Story</span>
                  </Link>
                  <Link
                    href="/rent"
                    className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-white/10 transition font-bold"
                  >
                    <ShoppingBag className="w-4 h-4 text-brand-dusk-orange" />
                    <span>Rent Gear</span>
                  </Link>
                  <Link
                    href="/careers"
                    className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-white/10 transition font-bold"
                  >
                    <Briefcase className="w-4 h-4 text-brand-dusk-orange" />
                    <span>Careers</span>
                  </Link>
                  <Link
                    href="/contact-us"
                    className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-white/10 transition font-bold border-t border-white/10 pt-2"
                  >
                    <Phone className="w-4 h-4 text-brand-dusk-orange" />
                    <span>Contact Us</span>
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex lg:hidden items-center space-x-1.5">
            <button
              onClick={() => setIsChooseTrekOpen(true)}
              className="flex items-center space-x-1.5 text-xs font-bold px-3 py-2.5 rounded-full bg-brand-dusk text-white min-h-[44px]"
            >
              <Compass className="w-4 h-4 text-brand-dusk-orange" />
              <span>Choose</span>
            </button>
            <Link
              href="/login"
              className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 transition text-white min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label="User account"
            >
              <User className="w-5 h-5" />
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 transition text-white min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer (Glassmorphic Slide-over) */}
      <div
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsOpen(false)}
      >
        <div
          className={`absolute top-0 right-0 w-4/5 max-w-sm h-full glass-dark text-white p-6 shadow-2xl transition-transform duration-300 transform ${
            isOpen ? "translate-x-0" : "translate-x-full"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
            <div className="relative h-6 w-32">
              <Image
                src="/tripmysoul-mobile-logo.png"
                alt="TripMySoul Logo"
                fill
                className="object-contain object-left"
              />
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 transition min-w-[44px] min-h-[44px] flex items-center justify-center"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

        {/* Mobile search inside drawer */}
        <div className="mb-6 relative">
          <div className="flex items-center gap-2 px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-xs">
            <Search className="w-4 h-4 text-gray-400 shrink-0" />
            <input
              type="text"
              placeholder="Search treks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
              className="bg-transparent border-0 focus:outline-none w-full text-white placeholder-gray-400 text-xs"
            />
          </div>
          
          {/* Mobile Autocomplete Dropdown */}
          {isSearchFocused && searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-[#0B2545]/95 backdrop-blur-md border border-white/10 rounded-2xl shadow-xl overflow-hidden z-50 text-white font-sans text-xs">
              <div className="p-2 space-y-1">
                {searchResults.map((trek) => (
                  <button
                    key={trek.slug}
                    onMouseDown={() => {
                      router.push(`/treks/${trek.slug}`);
                      setSearchQuery("");
                      setIsOpen(false);
                    }}
                    className="w-full flex items-center gap-3 p-2 hover:bg-white/10 rounded-xl transition text-left"
                  >
                    <div className="w-8 h-8 rounded-lg overflow-hidden bg-white/5 shrink-0 relative">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src="https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=80&q=80"
                        alt={trek.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="space-y-0.5">
                      <span className="font-bold text-[11px] block text-white truncate max-w-[150px]">
                        {trek.name}
                      </span>
                      <span className="text-[9px] text-gray-400 font-semibold block leading-none">
                        {trek.region} • {trek.days} Days
                      </span>
                    </div>
                    <div className="ml-auto text-right shrink-0">
                      <span className="text-[10px] text-brand-dusk-orange font-bold">
                        {trek.price ? `₹${trek.price.toLocaleString()}` : "TBD"}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {isSearchFocused && searchQuery && searchResults.length === 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-[#0B2545]/95 backdrop-blur-md border border-white/10 rounded-2xl shadow-xl p-4 text-center text-gray-400 z-50 text-[11px]">
              No matching treks found.
            </div>
          )}
        </div>

          <nav className="flex flex-col space-y-6">
            {/* Scrollable list of TTH-style links */}
            <div className="flex flex-col space-y-3 overflow-y-auto max-h-[50vh] pr-1.5 scrollbar-thin">
              {navLinksBeforeTreks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="flex items-center justify-between text-xs font-bold border-b border-white/5 pb-2.5 hover:text-brand-dusk-orange transition-colors group"
                  onClick={() => setIsOpen(false)}
                >
                  <div className="flex items-center gap-3">
                    {getDrawerIcon(link.name)}
                    <span className="tracking-wide text-gray-200 group-hover:text-brand-dusk-orange transition-colors uppercase">
                      {link.name}
                    </span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-gray-500 group-hover:text-brand-dusk-orange transition-transform duration-200 group-hover:translate-x-0.5" />
                </Link>
              ))}

              {navLinksTripMiddle.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="flex items-center justify-between text-xs font-bold border-b border-white/5 pb-2.5 hover:text-brand-dusk-orange transition-colors group"
                  onClick={() => setIsOpen(false)}
                >
                  <div className="flex items-center gap-3">
                    {getDrawerIcon(link.name)}
                    <span className="tracking-wide text-gray-200 group-hover:text-brand-dusk-orange transition-colors uppercase">
                      {link.name}
                    </span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-gray-500 group-hover:text-brand-dusk-orange transition-transform duration-200 group-hover:translate-x-0.5" />
                </Link>
              ))}

              {navLinksAfterTreks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="flex items-center justify-between text-xs font-bold border-b border-white/5 pb-2.5 hover:text-brand-dusk-orange transition-colors group"
                  onClick={() => setIsOpen(false)}
                >
                  <div className="flex items-center gap-3">
                    {getDrawerIcon(link.name)}
                    <span className="tracking-wide text-gray-200 group-hover:text-brand-dusk-orange transition-colors uppercase">
                      {link.name}
                    </span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-gray-500 group-hover:text-brand-dusk-orange transition-transform duration-200 group-hover:translate-x-0.5" />
                </Link>
              ))}
            </div>

            <div className="pt-2 flex flex-col space-y-3">
              <a
                href={`tel:${phone.tel}`}
                className="flex items-center space-x-3 text-xs font-semibold py-2 px-4 rounded-lg bg-white/5 hover:bg-white/10 transition text-gray-200"
              >
                <Phone className="w-4 h-4 text-brand-dusk-orange shrink-0" />
                <span>{phone.display}</span>
              </a>
              <Link
                href="/login"
                className="flex items-center justify-center space-x-2 text-xs font-semibold bg-brand-dusk hover:bg-brand-dusk-orange text-white py-2.5 rounded-xl shadow-lg transition"
                onClick={() => setIsOpen(false)}
              >
                <User className="w-4 h-4" />
                <span>Sign In / My Trips</span>
              </Link>
            </div>
          </nav>
        </div>
      </div>

      {/* TTH Signature "Choose Trek" Quick-Finder Modal */}
      {isChooseTrekOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0B2545] border border-white/20 text-white rounded-3xl max-w-3xl w-full p-6 md:p-8 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsChooseTrekOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
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
                    className={`text-xs px-4 py-2 rounded-full border font-bold transition ${
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
                    className={`text-xs px-4 py-2 rounded-full border font-bold transition ${
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
                      router.push(`/treks/${trek.slug}`);
                    }}
                    className="flex items-center justify-between p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition text-left group"
                  >
                    <div>
                      <span className="font-bold text-xs block text-white group-hover:text-brand-dusk-orange transition">{trek.name}</span>
                      <span className="text-[10px] text-gray-400">{trek.region} • {trek.days} Days</span>
                    </div>
                    <span className="text-xs font-bold text-brand-dusk-orange">
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
