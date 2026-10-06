import Link from "next/link";
import { Compass } from "lucide-react";

import { noIndexMetadata } from "@/lib/seo";

/**
 * Rendered for every `notFound()` in the app, and for any path no route claims.
 * Explicitly `noindex`: a 404 body Google is allowed to index is how a site
 * ends up with hundreds of near-identical thin pages in the index.
 */
export const metadata = noIndexMetadata(
  "Page Not Found",
  "This page does not exist or has moved. Browse our current Himalayan treks and trips.",
);

/** Where a lost visitor is most likely to find what they came for. */
const DESTINATIONS = [
  { href: "/treks", label: "All Treks" },
  { href: "/weekend-trips", label: "Weekend Trips" },
  { href: "/backpacking-trips", label: "Backpacking Trips" },
  { href: "/yatra", label: "Yatras" },
];

export default function NotFound() {
  return (
    <div className="max-w-md mx-auto py-40 px-4 text-center space-y-5 font-sans">
      <Compass className="w-12 h-12 text-brand-dusk mx-auto" />
      <h1 className="text-2xl font-bold text-brand-dark-text">Page not found</h1>
      <p className="text-xs text-gray-500 leading-relaxed">
        The page you are looking for does not exist, or it has been renamed since you
        last visited. These are the places most people are after:
      </p>

      <div className="flex flex-wrap justify-center gap-2">
        {DESTINATIONS.map((destination) => (
          <Link
            key={destination.href}
            href={destination.href}
            className="px-5 py-2.5 rounded-full bg-brand-forest hover:bg-brand-forest-light text-white font-bold text-xs transition"
          >
            {destination.label}
          </Link>
        ))}
      </div>

      <p className="text-xs text-gray-500">
        Or{" "}
        <Link href="/contact-us" className="font-bold text-brand-forest hover:underline">
          get in touch
        </Link>{" "}
        and we will point you to the right trip.
      </p>
    </div>
  );
}
