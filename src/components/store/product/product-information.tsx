"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { parseDescription } from "@/lib/product-description";
import { DescriptionBlocks } from "./product-description";
import { ProductSpecifications } from "./product-specifications";

type SectionId = "details" | "loveIt" | "care";

interface ProductInformationProps {
  specifications: Record<string, string> | null | undefined;
  whyLoveIt?: string | null;
  careInstructions?: string | null;
}

export function ProductInformation({
  specifications,
  whyLoveIt,
  careInstructions,
}: ProductInformationProps) {
  const [open, setOpen] = useState<SectionId | null>(null);

  const loveIt = parseDescription(whyLoveIt);
  const careLines = (careInstructions ?? "")
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean);

  const sections: Array<{
    id: SectionId;
    title: string;
    content: React.ReactNode;
  }> = [
    {
      id: "details",
      title: "Product Details",
      content: <ProductSpecifications specifications={specifications} />,
    },
    {
      id: "loveIt",
      title: "Why You Love It",
      content:
        loveIt.structured && loveIt.blocks.length > 0 ? (
          <DescriptionBlocks blocks={loveIt.blocks} />
        ) : loveIt.plainText.trim() ? (
          <div className="space-y-3">
            {loveIt.plainText
              .split(/\n+/)
              .map((p) => p.trim())
              .filter(Boolean)
              .map((p, i) => (
                <p key={i} className="text-sm text-gray-600 leading-relaxed">
                  {p}
                </p>
              ))}
          </div>
        ) : (
          <p className="text-sm text-gray-600 leading-relaxed">
            No highlights yet for this product.
          </p>
        ),
    },
    {
      id: "care",
      title: "Care Instructions",
      content:
        careLines.length > 0 ? (
          <ul className="space-y-2.5">
            {careLines.map((line, i) => (
              <li
                key={i}
                className="flex items-start gap-3 text-sm text-gray-600 leading-relaxed"
              >
                <span className="mt-0.5 text-[#C9A96E]">✦</span>
                <span>{line}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-600 leading-relaxed">
            No care instructions yet for this product.
          </p>
        ),
    },
  ];

  return (
    <div className="rounded-lg border border-[#E0DCD5] bg-white divide-y divide-[#E0DCD5]">
      {sections.map((section) => {
        const isOpen = open === section.id;
        return (
          <div key={section.id}>
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : section.id)}
              aria-expanded={isOpen}
              aria-controls={`section-${section.id}`}
              className="group flex w-full items-center justify-between px-5 py-4 text-left cursor-pointer transition-colors hover:bg-[#F7F4EF]/40"
            >
              <span className="font-serif text-base font-semibold text-[#0D0D0D] tracking-wide transition-colors group-hover:text-[#C9A96E]">
                {section.title}
              </span>
              <ChevronDown
                className={`h-5 w-5 text-[#C9A96E] transition-transform duration-200 ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            {isOpen && (
              <div id={`section-${section.id}`} className="px-5 pb-5">
                {section.content}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}