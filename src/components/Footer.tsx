"use client";

import React from "react";
import Link from "next/link";
import { Compass, Mail, Phone, MapPin } from "lucide-react";
import { OFFICES } from "@/data/db";

export default function Footer() {
  return (
    <footer className="bg-brand-forest text-white pt-12 sm:pt-16 safe-bottom-footer relative overflow-hidden">
      {/* Background decoration elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-forest-light/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-brand-dusk/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 border-b border-white/10 pb-10 sm:pb-12">
          {/* Brand Info */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-3 min-h-[44px]">
              <div className="w-10 h-10 shrink-0 rounded-full bg-brand-dusk flex items-center justify-center">
                <Compass className="w-6 h-6 text-white" />
              </div>
              <div className="min-w-0">
                <span className="text-xl font-bold tracking-wider block leading-none">TripMySoul</span>
                <span className="text-[10px] sm:text-xs text-brand-dusk-orange tracking-widest block mt-0.5 break-words">Where Every Journey Heals the Soul</span>
              </div>
            </Link>
            <p className="text-sm text-gray-300 leading-relaxed">
              We guide adventurers to discover the majestic Himalayan heights. Dedicated to sustainable tourism, community building, and unmatched safety.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-brand-dusk-orange tracking-wide">Quick Navigation</h3>
            <ul className="space-y-0.5 text-sm text-gray-300">
              <li>
                <Link href="/" className="flex items-center min-h-[44px] hover:text-white transition">Home</Link>
              </li>
              <li>
                <Link href="/treks" className="flex items-center min-h-[44px] hover:text-white transition">All Himalayan Treks</Link>
              </li>
              <li>
                <Link href="/yatra" className="flex items-center min-h-[44px] hover:text-white transition">Pilgrimage Yatras</Link>
              </li>
              <li>
                <Link href="/cabs" className="flex items-center min-h-[44px] hover:text-white transition">Book Cabs</Link>
              </li>
              <li>
                <Link href="/about-us" className="flex items-center min-h-[44px] hover:text-white transition">About Our Story</Link>
              </li>
              <li>
                <Link href="/blogs" className="flex items-center min-h-[44px] hover:text-white transition">Trek Updates & Blog</Link>
              </li>
              <li>
                <Link href="/contact-us" className="flex items-center min-h-[44px] hover:text-white transition">Contact Us</Link>
              </li>
            </ul>
          </div>

          {/* Popular Treks */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-brand-dusk-orange tracking-wide">Popular Trails</h3>
            <ul className="space-y-0.5 text-sm text-gray-300">
              <li>
                <Link href="/treks/kedarkantha-trek" className="flex items-center min-h-[44px] hover:text-white transition">Kedarkantha Trek (5 Days)</Link>
              </li>
              <li>
                <Link href="/treks/kashmir-great-lakes-trek" className="flex items-center min-h-[44px] hover:text-white transition">Kashmir Great Lakes (8 Days)</Link>
              </li>
              <li>
                <Link href="/treks/hampta-pass-trek" className="flex items-center min-h-[44px] hover:text-white transition">Hampta Pass Trek (5 Days)</Link>
              </li>
              <li>
                <Link href="/treks/brahmatal-trek" className="flex items-center min-h-[44px] hover:text-white transition">Brahmatal Trek (5 Days)</Link>
              </li>
              <li>
                <Link href="/treks/har-ki-dun-trek" className="flex items-center min-h-[44px] hover:text-white transition">Har Ki Dun Trek (7 Days)</Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-brand-dusk-orange tracking-wide">Get In Touch</h3>
            <div className="space-y-3 text-sm text-gray-300">
              <a href="mailto:tripmysoulteam@gmail.com" className="flex items-center gap-3 min-h-[44px] hover:text-white transition">
                <Mail className="w-4 h-4 text-brand-dusk-orange shrink-0" />
                <span className="min-w-0 break-all">tripmysoulteam@gmail.com</span>
              </a>
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-brand-dusk-orange shrink-0 mt-1" />
                <div className="min-w-0">
                  <span className="font-semibold block text-xs text-white">Dehradun Office:</span>
                  <span className="text-xs block break-words">Saraswati Vihar, Ajabpur Khurd, Dehradun, Uttarakhand - 248001</span>
                  <a href="tel:+918178613438" className="mt-1 flex items-center gap-2 min-h-[44px] text-xs hover:text-white transition">
                    <Phone className="w-3.5 h-3.5 text-brand-dusk-orange shrink-0" />
                    <span>+91 81786 13438</span>
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-brand-dusk-orange shrink-0 mt-1" />
                <div className="min-w-0">
                  <span className="font-semibold block text-xs text-white">Hyderabad Office:</span>
                  <span className="text-xs block break-words">Sai Baba Nagar Colony, Kukatpally, Hyderabad, Telangana - 500072</span>
                  <a href="tel:+918178613438" className="mt-1 flex items-center gap-2 min-h-[44px] text-xs hover:text-white transition">
                    <Phone className="w-3.5 h-3.5 text-brand-dusk-orange shrink-0" />
                    <span>+91 81786 13438</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Policies & Copyright */}
        <div className="mt-8 flex flex-col lg:flex-row items-center justify-between gap-4 lg:gap-6 text-xs text-gray-400">
          <div className="flex flex-wrap justify-center gap-x-5 gap-y-0 lg:gap-x-6">
            <Link href="/policies/payment-policy" className="flex items-center min-h-[44px] hover:text-white transition">Payment Policy</Link>
            <Link href="/policies/cancellation-policy" className="flex items-center min-h-[44px] hover:text-white transition">Cancellation Policy</Link>
            <Link href="/policies/terms-conditions" className="flex items-center min-h-[44px] hover:text-white transition">Terms & Conditions</Link>
            <Link href="/policies/privacy-policy" className="flex items-center min-h-[44px] hover:text-white transition">Privacy Policy</Link>
          </div>

          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            <a href="https://www.facebook.com/tripmysoul.in/" target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-full bg-white/5 hover:bg-brand-dusk hover:text-white transition min-w-[44px] min-h-[44px] flex items-center justify-center" aria-label="Facebook">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
              </svg>
            </a>
            <a href="https://www.instagram.com/tripmysoul.in/" target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-full bg-white/5 hover:bg-brand-dusk hover:text-white transition min-w-[44px] min-h-[44px] flex items-center justify-center" aria-label="Instagram">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.008 3.74.052 1.455.067 2.25.31 2.776.515a4.878 4.878 0 011.68 1.094 4.878 4.878 0 011.094 1.68c.205.527.45 1.321.515 2.776.044.957.052 1.312.052 3.741 0 2.43-.008 2.784-.052 3.74-.067 1.455-.31 2.25-.515 2.776a4.877 4.877 0 01-1.094 1.68 4.876 4.876 0 01-1.68 1.094c-.527.205-1.321.45-2.776.515-.957.044-1.312.052-3.741.052-2.43 0-2.784-.008-3.74-.052-1.455-.067-2.25-.31-2.776-.515a4.876 4.876 0 01-1.68-1.094 4.878 4.878 0 01-1.094-1.68c-.205-.527-.45-1.321-.515-2.776-.044-.957-.052-1.312-.052-3.74 0-2.43 0.008-2.784 0.052-3.74.067-1.455 0.31-2.25 0.515-2.776a4.88 4.88 0 011.094-1.68 4.88 4.88 0 011.68-1.094c0.527-.205 1.321-.45 2.776-.515.957-.044 1.312-.052 3.741-.052zm0 1.977c-2.388 0-2.671 0.009-3.613 0.052-1.237 0.056-1.91 0.263-2.357 0.437a3.284 3.284 0 00-1.185 0.772 3.284 3.284 0 00-.772 1.185c-.174 0.447-.38 1.12-.437 2.357-.043 0.942-.052 1.225-.052 3.613s0.009 2.671 0.052 3.613c0.056 1.237 0.263 1.91 0.437 2.357a3.282 3.282 0 000.772 1.185 3.282 3.282 0 001.185 0.772c0.447 0.174 1.12 0.38 2.357 0.437 0.942 0.043 1.225 0.052 3.613 0.052s2.671-.009 3.613-.052c1.237-.056 1.91-.263 2.357-.437a3.289 3.289 0 001.185-.772 3.289 3.289 0 000.772-1.185c0.174-.447 0.38-1.12 0.437-2.357 0.043-.942 0.052-1.225 0.052-3.613s-.009-2.671-.052-3.613c-.056-1.237-.263-1.91-.437-2.357a3.29 3.29 0 00-.772-1.185 3.29 3.29 0 00-1.185-.772c-.447-.174-1.12-.38-2.357-.437-.942-.043-1.225-.052-3.613-.052zm0 2.913a5.112 5.112 0 100 10.224 5.112 5.112 0 000-10.224zm0 8.247a3.135 3.135 0 110-6.27 3.135 3.135 0 010 6.27zm5.837-8.985a1.196 1.196 0 100-2.393 1.196 1.196 0 000 2.393z" clipRule="evenodd" />
              </svg>
            </a>
            <a href="https://www.linkedin.com/in/pramod-panwar-568702224/" target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-full bg-white/5 hover:bg-brand-dusk hover:text-white transition min-w-[44px] min-h-[44px] flex items-center justify-center" aria-label="LinkedIn">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75 0.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
              </svg>
            </a>
          </div>

          <p className="text-center lg:text-right">
            &copy; {new Date().getFullYear()} TripMySoul Pvt. Ltd. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
