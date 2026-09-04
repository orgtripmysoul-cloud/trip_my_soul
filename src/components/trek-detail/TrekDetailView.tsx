"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { buildSectionTabs } from "@/data/trekDefaults";
import { resolveTrekDetail } from "@/lib/trekDetail";
import type { Trek } from "@/data/db";

import TrekHeroGallery from "./TrekHeroGallery";
import TrekSectionNav from "./TrekSectionNav";
import TrekFloatingActions from "./TrekFloatingActions";
import TrekOverviewFacts from "./TrekOverviewFacts";
import TrekQuickItinerary from "./TrekQuickItinerary";
import TrekAbout from "./TrekAbout";
import TrekCompleteInformation from "./TrekCompleteInformation";
import TrekItinerary from "./TrekItinerary";
import TrekEligibility from "./TrekEligibility";
import TrekPhotoAlbum from "./TrekPhotoAlbum";
import TrekHowToReach from "./TrekHowToReach";
import TrekInclusions from "./TrekInclusions";
import TrekCostSummary from "./TrekCostSummary";
import TrekPricing from "./TrekPricing";
import TrekDepartures from "./TrekDepartures";
import TrekBookingTerms from "./TrekBookingTerms";
import TrekEssentials from "./TrekEssentials";
import TrekCancellation from "./TrekCancellation";
import TrekImportantLinks from "./TrekImportantLinks";
import TrekFaqs from "./TrekFaqs";
import TrekArticle from "./TrekArticle";
import TrekSimilar from "./TrekSimilar";
import TrekReviews from "./TrekReviews";
import TrekBookingSidebar from "./TrekBookingSidebar";
import TrekModals from "./TrekModals";
import TrekMobileBookingBar from "./TrekMobileBookingBar";
import TrekDeparturesSheet from "./TrekDeparturesSheet";
import TrekCallbackBar from "./TrekCallbackBar";

/** Shared white card shell used by every content section. */
const CARD = "bg-white border border-gray-100 rounded-3xl p-6 md:p-8 shadow-sm scroll-mt-40";

interface TrekDetailViewProps {
  /** The listing to render. Trips arrive here through `tripToTrek`. */
  trek: Trek;
  /** Cards shown under "Similar …", already filtered by the caller. */
  similar: Trek[];
  /** Size of the catalogue this listing belongs to, for the "View all" link. */
  totalCount: number;
  /** Catalogue route, e.g. `/treks` or `/weekend-trips`. */
  browseHref: string;
  /** Word used across the headings — "Trek" for treks, "Trip" for trips. */
  noun?: string;
}

/**
 * The one detail page.
 *
 * Treks, weekend getaways and backpacking circuits all render through this
 * component so the layout, section order and booking flow are identical
 * everywhere; only the wording follows `noun`, and sections with no data for a
 * given listing drop out rather than showing invented content.
 */
export default function TrekDetailView({
  trek,
  similar,
  totalCount,
  browseHref,
  noun = "Trek",
}: TrekDetailViewProps) {
  const router = useRouter();

  const detail = useMemo(() => resolveTrekDetail(trek), [trek]);
  const tabs = useMemo(() => buildSectionTabs(noun), [noun]);

  const [activeTabId, setActiveTabId] = useState("overview");
  const [wishlistSaved, setWishlistSaved] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState<string | null>(null);
  const [selectedPackageId, setSelectedPackageId] = useState<string | null>(
    detail.packages[0]?.id ?? null
  );
  const [isBooked, setIsBooked] = useState(false);
  const [isBrochureOpen, setIsBrochureOpen] = useState(false);
  const [isFitnessModalOpen, setIsFitnessModalOpen] = useState(false);
  const [isDeparturesSheetOpen, setIsDeparturesSheetOpen] = useState(false);

  // Handle active tab highlighting on scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 200;
      for (const tab of tabs) {
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
  }, [tabs]);

  // The chosen package sets the fare; otherwise the listing's own rate stands.
  const selectedPackage = detail.packages.find((p) => p.id === selectedPackageId) ?? null;
  const activePrice = selectedPackage?.price ?? detail.price;

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

  const goToCheckout = (batchId: string) => {
    const priceParam = activePrice !== null ? `&price=${activePrice}` : "";
    router.push(`/checkout?slug=${trek.slug}&batch=${encodeURIComponent(batchId)}${priceParam}`);
  };

  /**
   * Every "choose dates" affordance lands here. On mobile it raises the
   * departures sheet; desktop, which shows the picker in the page already,
   * keeps scrolling to it.
   */
  const openDepartures = () => {
    const isDesktop =
      typeof window !== "undefined" && window.matchMedia("(min-width: 1024px)").matches;
    if (isDesktop) scrollToBatchPicker();
    else setIsDeparturesSheetOpen(true);
  };

  const handleBookNow = () => {
    if (!selectedBatch) {
      openDepartures();
    } else {
      goToCheckout(selectedBatch);
    }
  };

  /** Booking from the mobile sheet also records the batch for the sidebar. */
  const handleBookFromSheet = (batchId: string) => {
    setSelectedBatch(batchId);
    setIsDeparturesSheetOpen(false);
    goToCheckout(batchId);
  };

  const scrollToBatchPicker = () => {
    document.getElementById("batch-picker")?.scrollIntoView({ behavior: "smooth" });
  };

  // Sections that would otherwise render an empty card.
  const showCompleteInfo =
    detail.useTrekFallbacks ||
    detail.thingsToRemember.length > 0 ||
    detail.transportModes.length > 0 ||
    !!detail.kidsPolicy ||
    detail.contactNumbers.length > 0 ||
    !!detail.contactPhone;
  const showFaqs = detail.faqs.length > 0;

  return (
    <div className="bg-brand-warm-bg relative min-h-screen font-sans pb-mobile-nav lg:pb-0">
      <TrekHeroGallery detail={detail} />

      <TrekSectionNav tabs={tabs} activeTabId={activeTabId} onTabClick={handleTabClick} />

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
          <section id="overview" className="space-y-6 scroll-mt-40">
            <TrekOverviewFacts
              detail={detail}
              noun={noun}
              onViewDepartures={openDepartures}
            />
          </section>

          <section className={`${CARD} space-y-6`}>
            <TrekQuickItinerary trekName={trek.name} noun={noun} itinerary={detail.quickItinerary} />
          </section>

          <section id="about-trek" className={`${CARD} space-y-4`}>
            <TrekAbout detail={detail} noun={noun} />
          </section>

          {showCompleteInfo && (
            <section id="complete-trek-information" className={`${CARD} space-y-6`}>
              <TrekCompleteInformation detail={detail} noun={noun} />
            </section>
          )}

          <section id="itinerary" className={`${CARD} space-y-6`}>
            <TrekItinerary
              itinerary={detail.normalizedItinerary}
              noun={noun}
              onViewDepartures={openDepartures}
            />
          </section>

          <section id="eligibility" className={`${CARD} space-y-6`}>
            <TrekEligibility detail={detail} noun={noun} />
          </section>

          <section id="photos" className={`${CARD} space-y-5`}>
            <TrekPhotoAlbum detail={detail} noun={noun} />
          </section>

          <section id="how-to-reach" className={`${CARD} space-y-6`}>
            <TrekHowToReach
              transport={detail.transport}
              howToReach={detail.howToReach}
              trekName={trek.name}
            />
          </section>

          {/* The fare and its terms first, then what the fare covers. */}
          <section id="cost-terms" className={`${CARD} space-y-8`}>
            <TrekCostSummary
              detail={detail}
              noun={noun}
              price={activePrice}
              onBookNow={handleBookNow}
            />
            <TrekPricing
              packages={detail.packages}
              priceNote={detail.priceNote}
              selectedPackageId={selectedPackageId}
              onSelectPackage={setSelectedPackageId}
            />
            <TrekBookingTerms detail={detail} />
          </section>

          {/* Dates sit between the fare and what it covers, right before booking. */}
          <section id="departures" className={`${CARD} space-y-6`}>
            <TrekDepartures
              batchMonths={detail.batchMonths}
              year={detail.batchYear}
              price={activePrice}
              selectedBatch={selectedBatch}
              onSelectBatch={setSelectedBatch}
              onBookBatch={goToCheckout}
              trekName={trek.name}
              durationDays={trek.days}
            />
          </section>

          <section id="inclusions" className={`${CARD} space-y-6`}>
            <TrekInclusions inclusions={detail.inclusions} exclusions={detail.exclusions} />
          </section>

          <section id="trek-essentials" className={`${CARD} space-y-6`}>
            <TrekEssentials
              packingList={detail.packingList}
              rentalGear={detail.rentalGear}
              noun={noun}
            />
          </section>

          <section id="cancellation" className={`${CARD} space-y-4`}>
            <TrekCancellation policy={detail.cancellationPolicyText} />
          </section>

          <section id="imp-links" className={`${CARD} space-y-4`}>
            <TrekImportantLinks
              contactNumbers={
                detail.contactPhone
                  ? [...new Set([detail.contactPhone, ...detail.contactNumbers])]
                  : detail.contactNumbers
              }
            />
          </section>

          {showFaqs && (
            <section id="faqs" className={`${CARD} space-y-6`}>
              <TrekFaqs faqs={detail.faqs} />
            </section>
          )}

          <section id="trek-article" className={`${CARD} space-y-6`}>
            <TrekArticle
              trekName={trek.name}
              noun={noun}
              article={detail.article}
              heroImage={detail.heroImage}
            />
          </section>

          {/* Social proof reads better before we point at other departures. */}
          <section id="trek-reviews" className={`${CARD} space-y-8`}>
            <TrekReviews
              reviews={detail.reviews}
              trailVideos={detail.trailVideos}
              externalReviews={detail.externalReviews}
              reviewVideos={detail.reviewVideos}
              trekName={trek.name}
            />
          </section>

          <section id="similar-treks" className={`${CARD} space-y-6`}>
            <TrekSimilar
              similarTreks={similar}
              totalTrekCount={totalCount}
              noun={noun}
              browseHref={browseHref}
            />
          </section>
        </div>

        {/* Right Column (Booking Widget Card) */}
        <div className="w-full lg:w-1/3">
          <TrekBookingSidebar
            detail={detail}
            noun={noun}
            price={activePrice}
            selectedBatch={selectedBatch}
            selectedPackageLabel={selectedPackage?.label ?? null}
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
        price={activePrice}
        selectedBatch={selectedBatch}
        onViewDepartures={() => setIsDeparturesSheetOpen(true)}
      />

      <TrekDeparturesSheet
        open={isDeparturesSheetOpen}
        onClose={() => setIsDeparturesSheetOpen(false)}
        batchMonths={detail.batchMonths}
        fallbackYear={detail.batchYear}
        selectedBatch={selectedBatch}
        onBookBatch={handleBookFromSheet}
      />

      <TrekCallbackBar />
    </div>
  );
}
