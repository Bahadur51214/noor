import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadService = {
  validateFile(file: File) {
    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type))
      return { valid: false, error: "Invalid file type. Only JPG, PNG, WEBP allowed." };
    if (file.size > 5 * 1024 * 1024)
      return { valid: false, error: "File too large. Maximum size is 5MB." };
    return { valid: true };
  },

  async uploadBuffer(buffer: Buffer, mimeType: string, folder: string = "noor") {
    const base64Data = buffer.toString("base64");
    const fileUri = `data:${mimeType};base64,${base64Data}`;

    return new Promise<{ url: string; publicId: string }>((resolve, reject) => {
      cloudinary.uploader.upload(
        fileUri,
        { folder: folder, resource_type: "image" },
        (error, result) => {
          if (error || !result) {
            reject(error || new Error("Failed to upload to Cloudinary"));
          } else {
            resolve({
              url: result.secure_url,
              publicId: result.public_id,
            });
          }
        }
      );
    });
  },

  async delete(publicId: string) {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.destroy(publicId, (error, result) => {
        if (error) reject(error);
        else resolve(result);
      });
    });
  },
};
