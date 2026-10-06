import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Compass, MapPin } from "lucide-react";
import { REGIONS, TREKS } from "@/data/db";
import TrekCard from "@/components/TrekCard";

type Params = { params: Promise<{ region: string }> };

/** Prerender each region so its trek list is in the static HTML. */
export function generateStaticParams() {
  return REGIONS.map((r) => ({ region: r.slug }));
}

export default async function RegionLandingPage({ params }: Params) {
  const { region: regionSlug } = await params;

  const region = REGIONS.find((r) => r.slug === regionSlug);
  if (!region) notFound();

  const regionTreks = TREKS.filter((t) => t.region.toLowerCase().includes(region.name.toLowerCase()));

  return (
    <div className="bg-brand-warm-bg min-h-screen">
      {/* Hero Banner */}
      <div className="relative h-[45vh] w-full bg-brand-forest overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={region.image}
          alt={region.name}
          className="w-full h-full object-cover opacity-50 pointer-events-none"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-warm-bg via-transparent to-black/30" />

        <div className="absolute bottom-10 left-0 w-full">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 min-h-[44px] text-xs font-bold text-gray-500 hover:text-brand-dark-text md:text-gray-300 md:hover:text-white transition bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 self-start"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </Link>

            <h1 className="text-3xl sm:text-5xl font-extrabold font-serif text-brand-dark-text md:text-white leading-tight flex items-center gap-2">
              <MapPin className="w-6 h-6 md:w-8 md:h-8 text-brand-dusk-orange shrink-0" />
              <span>{region.name} Treks</span>
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 md:text-gray-200 max-w-2xl leading-relaxed">
              {region.description}
            </p>
          </div>
        </div>
      </div>

      {/* Region trek listing */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-6">
        <h2 className="text-xl font-extrabold text-brand-dark-text font-serif">
          Available Routes in {region.name} ({regionTreks.length})
        </h2>

        {regionTreks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {regionTreks.map((trek) => (
              <TrekCard key={trek.slug} trek={trek} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white border border-gray-150 rounded-3xl p-8 max-w-md mx-auto space-y-3">
            <Compass className="w-10 h-10 text-brand-dusk-orange mx-auto animate-pulse" />
            <h3 className="text-lg font-bold text-brand-dark-text">No treks listed yet</h3>
            <p className="text-xs text-gray-500">
              We are currently scouting new routes in this region. Check back later or speak with our planning team.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
