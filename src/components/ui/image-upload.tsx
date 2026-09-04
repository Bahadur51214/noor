"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { UploadCloud, X, Loader2 } from "lucide-react";
import { uploadImageAction } from "@/actions/upload.actions";
import { toast } from "sonner";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  folder?: string;
}

export function ImageUpload({ value, onChange, folder = "noor" }: ImageUploadProps) {
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
        onChange(result.url);
        toast.success("Image uploaded successfully");
      }
    } catch (error) {
      toast.error("An error occurred during upload");
    } finally {
      setIsUploading(false);
      // Reset input so the same file can be uploaded again if needed
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
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
      
      {value ? (
        <div className="relative w-40 h-40 border rounded-md overflow-hidden bg-gray-50 group">
          <Image src={value} alt="Uploaded preview" fill className="object-cover" />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Button
              type="button"
              variant="destructive"
              size="icon"
              onClick={() => onChange("")}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="w-40 h-40 border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center gap-2 text-gray-500 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isUploading ? (
            <Loader2 className="w-6 h-6 animate-spin text-[#C9A96E]" />
          ) : (
            <>
              <UploadCloud className="w-6 h-6" />
              <span className="text-sm">Click to upload</span>
            </>
          )}
        </button>
      )}
    </div>
  );
}
