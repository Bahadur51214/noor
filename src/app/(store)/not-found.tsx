import Link from "next/link";

export default function StoreNotFound() {
  return (
    <div className="min-h-screen bg-[#F7F4EF] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <p className="text-[#C9A96E] font-serif text-7xl mb-4">404</p>
        <h1 className="text-2xl font-serif text-[#0D0D0D] mb-3">
          Page not found
        </h1>
        <p className="text-gray-500 mb-8">
          The page you are looking for doesn&apos;t exist or may have been
          moved.
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-2.5 bg-[#0D0D0D] text-white rounded-md text-sm font-medium hover:bg-black transition-colors"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}
