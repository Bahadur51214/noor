export default function StoreLoading() {
  return (
    <div className="min-h-screen bg-[#F7F4EF] flex items-center justify-center">
      <div className="text-center">
        <div className="w-10 h-10 border-3 border-[#C9A96E] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-gray-500">Loading…</p>
      </div>
    </div>
  );
}
