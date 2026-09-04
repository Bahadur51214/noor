"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";

interface GalleryImage {
  url: string;
  alt?: string | null;
}

interface ProductImageGalleryProps {
  images: GalleryImage[];
  productName: string;
}

export function ProductImageGallery({ images, productName }: ProductImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [zoom, setZoom] = useState(false);

  const items = images && images.length > 0 ? images : [];

  const goTo = useCallback(
    (index: number) => {
      if (items.length === 0) return;
      const next = ((index % items.length) + items.length) % items.length;
      setActiveIndex(next);
      setZoom(false);
    },
    [items.length]
  );

  const next = useCallback(() => goTo(activeIndex + 1), [activeIndex, goTo]);
  const prev = useCallback(() => goTo(activeIndex - 1), [activeIndex, goTo]);

  if (items.length === 0) {
    return (
      <div className="relative aspect-[4/5] bg-[#F7F4EF] w-full">
        <Image
          src="/placeholder.svg"
          alt={productName}
          fill
          className="object-cover"
          priority
        />
      </div>
    );
  }

  const active = items[activeIndex];

  return (
    <div className="flex flex-col gap-4">
      {/* Main image */}
      <div
        className="relative aspect-[4/5] bg-[#F7F4EF] w-full overflow-hidden group cursor-zoom-in"
        onClick={() => setZoom((z) => !z)}
      >
        <Image
          src={active.url}
          alt={active.alt || `${productName}`}
          fill
          priority
          className={`object-cover transition-transform duration-500 ${zoom ? "scale-150" : "scale-100"}`}
        />
        <ZoomIn className="absolute top-4 right-4 w-6 h-6 text-white/80 drop-shadow hidden group-hover:block" />

        {items.length > 1 && (
          <>
            <button
              type="button"
              aria-label="Previous image"
              onClick={(e) => {
                e.stopPropagation();
                prev();
              }}
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-[#0D0D0D] rounded-full p-2 shadow transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              aria-label="Next image"
              onClick={(e) => {
                e.stopPropagation();
                next();
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-[#0D0D0D] rounded-full p-2 shadow transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-[#0D0D0D]/60 text-white text-xs px-3 py-1 rounded-full">
              {activeIndex + 1} / {items.length}
            </div>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {items.length > 1 && (
        <div className="grid grid-cols-4 gap-3 sm:gap-4">
          {items.map((image, index) => (
            <button
              key={`${image.url}-${index}`}
              type="button"
              aria-label={`View image ${index + 1}`}
              onClick={() => goTo(index)}
              className={`relative aspect-square bg-[#F7F4EF] overflow-hidden border-2 transition-colors ${
                index === activeIndex
                  ? "border-[#C9A96E]"
                  : "border-transparent hover:border-[#C9A96E]/40"
              }`}
            >
              <Image
                src={image.url}
                alt={image.alt || `${productName} ${index + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
