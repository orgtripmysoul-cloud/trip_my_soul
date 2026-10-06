import Link from "next/link";
import { Compass } from "lucide-react";

export default function RegionNotFound() {
  return (
    <div className="max-w-md mx-auto py-40 px-4 text-center space-y-4">
      <Compass className="w-12 h-12 text-brand-dusk mx-auto" />
      <h1 className="text-2xl font-bold text-brand-dark-text">Region not found</h1>
      <p className="text-xs text-gray-500">The region path does not exist. Browse our standard options.</p>
      <Link
        href="/"
        className="inline-block px-5 py-2.5 rounded-full bg-brand-forest hover:bg-brand-forest-light text-white font-bold text-xs transition"
      >
        Back to Home
      </Link>
    </div>
  );
}
