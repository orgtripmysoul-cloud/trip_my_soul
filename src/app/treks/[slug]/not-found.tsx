import Link from "next/link";
import { AlertCircle } from "lucide-react";

export default function TrekNotFound() {
  return (
    <div className="max-w-md mx-auto py-40 px-4 text-center space-y-4 font-sans">
      <AlertCircle className="w-12 h-12 text-brand-dusk mx-auto" />
      <h1 className="text-2xl font-bold text-brand-dark-text">Trek not found</h1>
      <p className="text-xs text-gray-500">
        The trek route you are looking for does not exist or has been renamed.
      </p>
      <Link
        href="/treks"
        className="inline-block px-5 py-2.5 rounded-full bg-brand-forest hover:bg-brand-forest-light text-white font-bold text-xs transition"
      >
        Back to all treks
      </Link>
    </div>
  );
}
