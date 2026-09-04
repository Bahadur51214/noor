"use client";

import { useEffect } from "react";

export default function AdminError({
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
    <div className="p-6 flex items-center justify-center min-h-[60vh]">
      <div className="text-center max-w-md">
        <h2 className="text-xl font-serif text-[#0D0D0D] mb-3">
          Something went wrong
        </h2>
        <p className="text-gray-500 mb-6">
          An error occurred while loading this page. Please try again.
        </p>
        <button
          onClick={reset}
          className="px-5 py-2.5 bg-[#0D0D0D] text-white rounded-md text-sm font-medium hover:bg-black transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
