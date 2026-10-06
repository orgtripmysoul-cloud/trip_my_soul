import Link from "next/link";
import { Compass } from "lucide-react";

export default function TripNotFound() {
  return (
    <div className="max-w-md mx-auto py-40 px-4 text-center space-y-4">
      <Compass className="w-12 h-12 text-brand-dusk-orange mx-auto" />
      <h1 className="text-2xl font-bold text-brand-dark-text">Trip not found</h1>
      <p className="text-xs text-gray-500">This backpacking route does not exist yet.</p>
      <Link href="/backpacking-trips" className="text-xs font-bold text-brand-forest hover:underline">
        Browse all backpacking trips
      </Link>
    </div>
  );
}
