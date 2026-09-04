"use server";

import { requireAuth } from "@/lib/auth";
import { uploadService } from "@/services/upload.service";

export async function uploadImageAction(formData: FormData, folder: string = "noor") {
  await requireAuth();

  try {
    const file = formData.get("file") as File;
    if (!file) {
      return { error: "No file provided" };
    }

    const validation = uploadService.validateFile(file);
    if (!validation.valid) {
      return { error: validation.error };
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    const result = await uploadService.uploadBuffer(buffer, file.type, folder);
    
    return { url: result.url, publicId: result.publicId };
  } catch (error: any) {
    console.error("Upload error:", error);
    return { error: error.message || "Failed to upload image" };
  }
}
