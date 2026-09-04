"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { UploadCloud, X, Loader2 } from "lucide-react";
import { uploadImageAction } from "@/actions/upload.actions";
import { toast } from "sonner";

interface MultiImageUploadProps {
  value: string[];
  onChange: (urls: string[]) => void;
  folder?: string;
}

export function MultiImageUpload({
  value,
  onChange,
  folder = "noor",
}: MultiImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const result = await uploadImageAction(formData, folder);

      if (result.error) {
        toast.error(result.error);
      } else if (result.url) {
        onChange([...value, result.url]);
        toast.success("Image uploaded successfully");
      }
    } catch {
      toast.error("An error occurred during upload");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const removeImage = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-col gap-4">
      <input
        type="file"
        accept="image/jpeg, image/png, image/webp"
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileChange}
      />

      {value.length > 0 && (
        <div className="flex flex-wrap gap-4">
          {value.map((url, index) => (
            <div
              key={`${url}-${index}`}
              className="relative w-28 h-28 border rounded-md overflow-hidden bg-gray-50 group"
            >
              <Image
                src={url}
                alt={`Product image ${index + 1}`}
                fill
                className="object-cover"
              />
              {index === 0 && (
                <span className="absolute top-0 left-0 bg-[#C9A96E] text-white text-[10px] uppercase tracking-wide px-1.5 py-0.5">
                  Cover
                </span>
              )}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  onClick={() => removeImage(index)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        disabled={isUploading}
        className="w-28 h-28 border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center gap-2 text-gray-500 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isUploading ? (
          <Loader2 className="w-6 h-6 animate-spin text-[#C9A96E]" />
        ) : (
          <>
            <UploadCloud className="w-6 h-6" />
            <span className="text-xs text-center px-1">Add image</span>
          </>
        )}
      </button>
      <p className="text-xs text-gray-500">
        Upload multiple images. The first image is the main cover shown on the
        store.
      </p>
    </div>
  );
}
