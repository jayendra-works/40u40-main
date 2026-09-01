import { v2 as cloudinary } from "cloudinary";

const FOLDER = "40u40/nominations";

function getConfig(): { cloud_name: string; api_key: string; api_secret: string } | null {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME?.trim();
  const apiKey = process.env.CLOUDINARY_API_KEY?.trim();
  const apiSecret = process.env.CLOUDINARY_API_SECRET?.trim();
  if (!cloudName || !apiKey || !apiSecret) return null;
  return { cloud_name: cloudName, api_key: apiKey, api_secret: apiSecret };
}

/**
 * Uploads a file to Cloudinary and returns the secure URL.
 * Photos use image pipeline; PDFs/docs use raw.
 * Free tier: 25 GB storage, no credit card. Sign up at cloudinary.com.
 */
export async function uploadToCloudinary(
  buffer: Buffer,
  filename: string,
  mimeType: string,
  subdir: string
): Promise<{ success: true; url: string } | { success: false; error: string }> {
  const config = getConfig();
  if (!config) {
    return {
      success: false,
      error: "Cloudinary not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET in .env",
    };
  }

  cloudinary.config(config);

  const isImage = /^image\//.test(mimeType);
  const resourceType = isImage ? "image" : "raw";
  const publicId = `${FOLDER}/${subdir}/${filename}`;

  try {
    const dataUri = `data:${mimeType};base64,${buffer.toString("base64")}`;

    const result = await cloudinary.uploader.upload(dataUri, {
      public_id: publicId,
      resource_type: resourceType,
      overwrite: true,
    });

    const url = result.secure_url ?? (result as { url?: string }).url;
    if (!url) return { success: false, error: "Cloudinary did not return a URL." };
    return { success: true, url };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Cloudinary upload failed.";
    return { success: false, error: message };
  }
}

/** True when Cloudinary env vars are set (free tier, no credit card). */
export function isCloudinaryConfigured(): boolean {
  return !!getConfig();
}

const ADMIN_FOLDER = "40u40/admin";

/**
 * Uploads an image for admin (jury, sponsors, speakers). Returns the public URL.
 */
export async function uploadAdminImage(
  buffer: Buffer,
  filename: string,
  mimeType: string,
  folder: "jury" | "sponsors" | "speakers"
): Promise<{ success: true; url: string } | { success: false; error: string }> {
  const config = getConfig();
  if (!config) {
    return {
      success: false,
      error: "Cloudinary not configured. Set CLOUDINARY_* in .env",
    };
  }
  cloudinary.config(config);
  const publicId = `${ADMIN_FOLDER}/${folder}/${filename.replace(/\.[^.]+$/, "")}_${Date.now()}`;
  try {
    const dataUri = `data:${mimeType};base64,${buffer.toString("base64")}`;
    const result = await cloudinary.uploader.upload(dataUri, {
      public_id: publicId,
      resource_type: "image",
      overwrite: true,
    });
    const url = result.secure_url ?? (result as { url?: string }).url;
    if (!url) return { success: false, error: "No URL returned." };
    return { success: true, url };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Upload failed.";
    return { success: false, error: message };
  }
}
