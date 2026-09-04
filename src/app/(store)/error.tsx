"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function StoreError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#F7F4EF] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <p className="text-5xl mb-4">Something went wrong</p>
        <h1 className="text-2xl font-serif text-[#0D0D0D] mb-3">
          Unexpected error
        </h1>
        <p className="text-gray-500 mb-8">
          Sorry, an unexpected error occurred while loading this page. Please
          try again.
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={reset}
            className="px-5 py-2.5 bg-[#0D0D0D] text-white rounded-md text-sm font-medium hover:bg-black transition-colors"
          >
            Try again
          </button>
          <Link
            href="/"
            className="px-5 py-2.5 border border-[#E0DCD5] text-[#0D0D0D] rounded-md text-sm font-medium hover:bg-white transition-colors"
          >
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
