"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { AlertCircle } from "lucide-react";
import { TREKS, WILDLIFE, YATRAS } from "@/data/db";
import { TREK_SECTION_TABS } from "@/data/trekDefaults";
import { resolveTrekDetail } from "@/lib/trekDetail";

import TrekHeroGallery from "@/components/trek-detail/TrekHeroGallery";
import TrekSectionNav from "@/components/trek-detail/TrekSectionNav";
import TrekFloatingActions from "@/components/trek-detail/TrekFloatingActions";
import TrekOverviewFacts from "@/components/trek-detail/TrekOverviewFacts";
import TrekQuickItinerary from "@/components/trek-detail/TrekQuickItinerary";
import TrekAbout from "@/components/trek-detail/TrekAbout";
import TrekCompleteInformation from "@/components/trek-detail/TrekCompleteInformation";
import TrekItinerary from "@/components/trek-detail/TrekItinerary";
import TrekEligibility from "@/components/trek-detail/TrekEligibility";
import TrekVideo from "@/components/trek-detail/TrekVideo";
import TrekHowToReach from "@/components/trek-detail/TrekHowToReach";
import TrekInclusions from "@/components/trek-detail/TrekInclusions";
import TrekDepartures from "@/components/trek-detail/TrekDepartures";
import TrekEssentials from "@/components/trek-detail/TrekEssentials";
import TrekCancellation from "@/components/trek-detail/TrekCancellation";
import TrekImportantLinks from "@/components/trek-detail/TrekImportantLinks";
import TrekFaqs from "@/components/trek-detail/TrekFaqs";
import TrekArticle from "@/components/trek-detail/TrekArticle";
import TrekSimilar from "@/components/trek-detail/TrekSimilar";
import TrekReviews from "@/components/trek-detail/TrekReviews";
import TrekBookingSidebar from "@/components/trek-detail/TrekBookingSidebar";
import TrekModals from "@/components/trek-detail/TrekModals";
import TrekMobileBookingBar from "@/components/trek-detail/TrekMobileBookingBar";
import TrekNotifyBar from "@/components/trek-detail/TrekNotifyBar";

/** Shared white card shell used by every content section. */
const CARD = "bg-white border border-gray-100 rounded-3xl p-6 md:p-8 shadow-sm";

export default function TrekDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [activeTabId, setActiveTabId] = useState("overview");
  const [wishlistSaved, setWishlistSaved] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState<string | null>(null);
  const [isBooked, setIsBooked] = useState(false);
  const [isBrochureOpen, setIsBrochureOpen] = useState(false);
  const [isFitnessModalOpen, setIsFitnessModalOpen] = useState(false);

  // `/yatra` and the wildlife listings link here too, so resolve against every
  // catalogue rather than TREKS alone — otherwise those cards 404.
  const catalogue = useMemo(() => [...TREKS, ...YATRAS, ...WILDLIFE], []);

  const trek = useMemo(() => catalogue.find((t) => t.slug === slug) || null, [catalogue, slug]);

  // Similar Treks calculation
  const similarTreks = useMemo(() => {
    if (!trek) return [];
    const matches = catalogue.filter(
      (t) => t.slug !== trek.slug && (t.region === trek.region || t.difficulty === trek.difficulty)
    );
    return matches.length > 0
      ? matches.slice(0, 4)
      : catalogue.filter((t) => t.slug !== trek.slug).slice(0, 4);
  }, [catalogue, trek]);

  // Handle active tab highlighting on scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 200;
      for (const tab of TREK_SECTION_TABS) {
        const el = document.getElementById(tab.id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveTabId(tab.id);
            break;
          }
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!trek) {
    return (
      <div className="max-w-md mx-auto py-40 px-4 text-center space-y-4 font-sans">
        <AlertCircle className="w-12 h-12 text-brand-dusk mx-auto" />
        <h1 className="text-2xl font-bold text-brand-dark-text">Trek not found</h1>
        <p className="text-xs text-gray-500">
          The trek route you are looking for does not exist or has been renamed.
        </p>
        <button
          onClick={() => router.push("/treks")}
          className="px-5 py-2.5 rounded-full bg-brand-forest hover:bg-brand-forest-light text-white font-bold text-xs transition"
        >
          Back to all treks
        </button>
      </div>
    );
  }

  const detail = resolveTrekDetail(trek);

  const handleTabClick = (tabId: string) => {
    const el = document.getElementById(tabId);
    if (el) {
      window.scrollTo({ top: el.offsetTop - 150, behavior: "smooth" });
      setActiveTabId(tabId);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setShareCopied(true);
    setTimeout(() => setShareCopied(false), 2000);
  };

  const goToCheckout = (batchId: string) =>
    router.push(
      `/checkout?slug=${trek.slug}&batch=${encodeURIComponent(batchId)}&price=${detail.price}`
    );

  const handleBookNow = () => {
    if (!selectedBatch) {
      handleTabClick("cost-terms");
    } else {
      goToCheckout(selectedBatch);
    }
  };

  const scrollToBatchPicker = () => {
    document.getElementById("batch-picker")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="bg-brand-warm-bg relative min-h-screen font-sans pb-mobile-nav lg:pb-0">
      <TrekHeroGallery trek={trek} />

      <TrekSectionNav activeTabId={activeTabId} onTabClick={handleTabClick} />

      <TrekFloatingActions
        trekName={trek.name}
        wishlistSaved={wishlistSaved}
        onToggleWishlist={() => setWishlistSaved(!wishlistSaved)}
        shareCopied={shareCopied}
        onShare={handleShare}
        onOpenBrochure={() => setIsBrochureOpen(true)}
        onOpenFitness={() => setIsFitnessModalOpen(true)}
      />

      {/* Main Content Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col lg:flex-row gap-8">
        {/* Left Column (Content Areas) */}
        <div className="w-full lg:w-2/3 space-y-10">
          <section id="overview" className="space-y-6">
            <TrekOverviewFacts detail={detail} onViewDepartures={() => handleTabClick("cost-terms")} />
          </section>

          <section className={`${CARD} space-y-6`}>
            <TrekQuickItinerary trekName={trek.name} itinerary={detail.quickItinerary} />
          </section>

          <section id="about-trek" className={`${CARD} space-y-4`}>
            <TrekAbout trekName={trek.name} paragraphs={detail.aboutParagraphs} />
          </section>

          <section id="complete-trek-information" className={`${CARD} space-y-6`}>
            <TrekCompleteInformation trekName={trek.name} />
          </section>

          <section id="itinerary" className={`${CARD} space-y-6`}>
            <TrekItinerary itinerary={detail.normalizedItinerary} onViewDepartures={scrollToBatchPicker} />
          </section>

          <section id="eligibility" className={`${CARD} space-y-6`}>
            <TrekEligibility difficulty={trek.difficulty} paragraphs={detail.eligibilityParagraphs} />
          </section>

          <section id="video" className={`${CARD} space-y-4`}>
            <TrekVideo />
          </section>

          <section id="how-to-reach" className={`${CARD} space-y-6`}>
            <TrekHowToReach transport={detail.transport} />
          </section>

          <section id="cost-terms" className={`${CARD} space-y-8`}>
            <TrekInclusions inclusions={detail.inclusions} exclusions={detail.exclusions} />
            <TrekDepartures
              batchMonths={detail.batchMonths}
              price={detail.price}
              selectedBatch={selectedBatch}
              onSelectBatch={setSelectedBatch}
              onBookBatch={goToCheckout}
            />
          </section>

          <section id="trek-essentials" className={`${CARD} space-y-6`}>
            <TrekEssentials packingList={detail.packingList} />
          </section>

          <section id="cancellation" className={`${CARD} space-y-4`}>
            <TrekCancellation />
          </section>

          <section id="imp-links" className={`${CARD} space-y-4`}>
            <TrekImportantLinks />
          </section>

          <section id="faqs" className={`${CARD} space-y-6`}>
            <TrekFaqs faqs={detail.faqs} />
          </section>

          <section id="trek-article" className={`${CARD} space-y-6`}>
            <TrekArticle trekName={trek.name} />
          </section>

          <section id="similar-treks" className={`${CARD} space-y-6`}>
            <TrekSimilar similarTreks={similarTreks} totalTrekCount={catalogue.length} />
          </section>

          <section id="trek-reviews" className={`${CARD} space-y-8`}>
            <TrekReviews reviews={detail.reviews} trailVideos={detail.trailVideos} />
          </section>
        </div>

        {/* Right Column (Booking Widget Card) */}
        <div className="w-full lg:w-1/3">
          <TrekBookingSidebar
            trek={trek}
            price={detail.price}
            selectedBatch={selectedBatch}
            onBookNow={handleBookNow}
          />
        </div>
      </div>

      <TrekModals
        trekName={trek.name}
        difficulty={trek.difficulty}
        selectedBatch={selectedBatch}
        isBrochureOpen={isBrochureOpen}
        onCloseBrochure={() => setIsBrochureOpen(false)}
        isFitnessOpen={isFitnessModalOpen}
        onCloseFitness={() => setIsFitnessModalOpen(false)}
        isBooked={isBooked}
        onCloseBooked={() => setIsBooked(false)}
      />

      <TrekMobileBookingBar
        price={detail.price}
        selectedBatch={selectedBatch}
        onBookNow={handleBookNow}
      />

      <TrekNotifyBar />
    </div>
  );
}
