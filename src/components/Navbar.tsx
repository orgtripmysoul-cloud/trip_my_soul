"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, Compass, User, Phone } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

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

  const navLinks = [
    { name: "Trending Treks", href: "/treks?filter=trending" },
    { name: "All Treks", href: "/treks" },
    { name: "Yatra", href: "/yatra" },
    { name: "Cabs", href: "/cabs" },
    { name: "About", href: "/about-us" },
    { name: "Blog", href: "/blogs" },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 glass-dark text-white shadow-lg ${
          isScrolled ? "py-3" : "py-4.5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo Section */}
          <Link href="/" className="flex items-center group shrink-0">
            <div className="relative h-8 w-44 md:h-9 md:w-48">
              <Image
                src="/tripmysoul-mobile-logo.png"
                alt="TripMySoul Logo"
                fill
                className="object-contain object-left group-hover:scale-102 transition-transform duration-200"
                priority
              />
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-sm font-medium tracking-wide transition-colors hover:text-brand-dusk-orange ${
                    isActive ? "text-brand-dusk-orange border-b-2 border-brand-dusk pb-1" : "text-gray-100"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Right Button Panel */}
          <div className="hidden md:flex items-center space-x-4">
            <a
              href="https://wa.me/918178613438"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-xs font-semibold px-3 py-1.5 rounded-full border border-white/20 hover:bg-white/10 transition"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>+91 81786 13438</span>
            </a>
            <Link
              href="/login"
              className="flex items-center space-x-2 text-xs font-semibold bg-brand-dusk hover:bg-brand-dusk-orange text-white px-4 py-2 rounded-full shadow-md transition transform hover:-translate-y-0.5"
            >
              <User className="w-4 h-4" />
              <span>My Trips</span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center space-x-4">
            <Link
              href="/login"
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition text-white"
              aria-label="User account"
            >
              <User className="w-5 h-5" />
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition text-white"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer (Glassmorphic Slide-over) */}
      <div
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
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
              className="p-1 rounded-full bg-white/10 hover:bg-white/20 transition"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <nav className="flex flex-col space-y-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-base font-semibold border-b border-white/5 pb-2 hover:text-brand-dusk-orange transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}

            <div className="pt-6 flex flex-col space-y-4">
              <a
                href="https://wa.me/918178613438"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-3 text-sm font-semibold py-2 px-4 rounded-lg bg-white/5 hover:bg-white/10 transition text-gray-200"
              >
                <Phone className="w-4 h-4 text-brand-dusk-orange" />
                <span>+91 81786 13438</span>
              </a>
              <Link
                href="/login"
                className="flex items-center justify-center space-x-2 text-sm font-semibold bg-brand-dusk hover:bg-brand-dusk-orange text-white py-3 rounded-xl shadow-lg transition"
                onClick={() => setIsOpen(false)}
              >
                <User className="w-5 h-5" />
                <span>Sign In / My Trips</span>
              </Link>
            </div>
          </nav>
        </div>
      </div>
    </>
  );
}
