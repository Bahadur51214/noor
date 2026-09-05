const ORDERED_SPEC_FIELDS = [
  "Dial Color",
  "Movement",
  "Strap Material",
  "Strap Color",
  "Back Case",
  "Water Resistance",
  "Color Warranty",
  "Box",
  "Gender",
  "Quality",
  "Style",
  "Luminous Feature",
];

export function ProductSpecifications({
  specifications,
}: {
  specifications: Record<string, string> | null | undefined;
}) {
  const rawEntries = specifications
    ? Object.entries(specifications).filter(
        ([label, value]) => label.trim() && value?.trim()
      )
    : [];

  const entries = [...rawEntries].sort(([a], [b]) => {
    const idxA = ORDERED_SPEC_FIELDS.indexOf(a);
    const idxB = ORDERED_SPEC_FIELDS.indexOf(b);
    if (idxA !== -1 && idxB !== -1) return idxA - idxB;
    if (idxA !== -1) return -1;
    if (idxB !== -1) return 1;
    return a.localeCompare(b);
  });

  if (entries.length === 0) {
    return (
      <p className="text-sm text-gray-600 leading-relaxed">
        No specifications available for this product.
      </p>
    );
  }

  return (
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
  );
}