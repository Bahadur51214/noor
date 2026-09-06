import React from "react";
import {
  parseDescription,
  DescriptionBlock,
} from "@/lib/product-description";

import { ShieldCheck, Truck, RefreshCw, Gem, Clock, Sparkles, Check, ChevronRight } from "lucide-react";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  ShieldCheck,
  Truck,
  RefreshCw,
  Gem,
  Clock,
  Sparkles,
  Check,
  ChevronRight,
};

function FeatureIcon({ icon, className }: { icon: string; className?: string }) {
  const Icon = iconMap[icon.trim()];
  if (Icon) {
    return <Icon className={className} />;
  }
  return <span className={className}>{icon}</span>;
}

export function DescriptionBlocks({ blocks }: { blocks: DescriptionBlock[] }) {
  return (
    <div className="product-description space-y-5">
      {blocks.map((block, i) => {
        switch (block.type) {
          case "heading":
            return (
              <h2
                key={i}
                className="font-serif text-2xl sm:text-3xl text-[#0D0D0D] tracking-wide pt-2"
              >
                {block.text}
              </h2>
            );
          case "subheading":
            return (
              <h3
                key={i}
                className="font-serif text-lg sm:text-xl text-[#0D0D0D] tracking-wide pt-2"
              >
                {block.text}
              </h3>
            );
          case "paragraph":
            return (
              <p
                key={i}
                className="text-gray-600 leading-relaxed text-[15px]"
              >
                {block.text}
              </p>
            );
          case "divider":
            return (
              <div
                key={i}
                className="my-2 flex items-center gap-3"
                aria-hidden="true"
              >
                <span className="h-px flex-1 bg-[#E0DCD5]" />
                <span className="text-[#C9A96E] text-xs">✦</span>
                <span className="h-px flex-1 bg-[#E0DCD5]" />
              </div>
            );
          case "list":
            return (
              <ul
                key={i}
                className={
                  block.ordered ? "list-decimal pl-5 space-y-1.5 text-gray-600" : "list-disc pl-5 space-y-1.5 text-gray-600"
                }
              >
                {block.items.map((item, idx) => (
                  <li key={idx} className="leading-relaxed text-[15px]">
                    {item}
                  </li>
                ))}
              </ul>
            );
          case "feature":
            return (
              <div
                key={i}
                className="flex items-start gap-4 p-4 sm:p-5 border border-[#E0DCD5] bg-white rounded-sm"
              >
                <div className="shrink-0 w-11 h-11 rounded-full bg-[#F7F4EF] border border-[#C9A96E]/30 flex items-center justify-center text-[#C9A96E]">
                  <FeatureIcon
                    icon={block.icon}
                    className="w-5 h-5 text-[#C9A96E]"
                  />
                </div>
                <div className="min-w-0">
                  <h4 className="font-serif text-base sm:text-lg text-[#0D0D0D] mb-1">
                    {block.title}
                  </h4>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {block.description}
                  </p>
                </div>
              </div>
            );
          default:
            return null;
        }
      })}
    </div>
  );
}
