export function ProductSpecifications({
  specifications,
}: {
  specifications: Record<string, string> | null | undefined;
}) {
  const entries = specifications
    ? Object.entries(specifications).filter(
        ([label, value]) => label.trim() && value.trim()
      )
    : [];

  if (entries.length === 0) {
    return null;
  }

  return (
    <div className="rounded-lg border border-[#E0DCD5] bg-white p-6">
      <h2 className="mb-4 font-serif text-xl text-[#0D0D0D] tracking-wide">
        Specifications
      </h2>
      <div className="border-t border-[#E0DCD5]">
        {entries.map(([label, value], i) => (
          <div
            key={label}
            className={`flex flex-col sm:flex-row gap-1 sm:gap-0 py-3 ${
              i !== 0 ? "border-t border-[#E0DCD5]" : ""
            }`}
          >
            <dt className="sm:w-1/3 shrink-0 text-sm font-medium text-[#0D0D0D]">
              {label}
            </dt>
            <dd className="text-sm text-gray-600">{value}</dd>
          </div>
        ))}
      </div>
    </div>
  );
}