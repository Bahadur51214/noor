import Link from "next/link";

export default function AdminNotFound() {
  return (
    <div className="p-6 flex items-center justify-center min-h-[60vh]">
      <div className="text-center max-w-md">
        <p className="text-[#C9A96E] font-serif text-7xl mb-4">404</p>
        <h2 className="text-2xl font-serif text-[#0D0D0D] mb-3">
          Page not found
        </h2>
        <p className="text-gray-500 mb-6">
          The admin page you are looking for doesn&apos;t exist.
        </p>
        <Link
          href="/admin"
          className="inline-block px-5 py-2.5 bg-[#0D0D0D] text-white rounded-md text-sm font-medium hover:bg-black transition-colors"
        >
          Back to dashboard
        </Link>
      </div>
    </div>
  );
}
