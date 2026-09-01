"use server";

import { writeFile, mkdir } from "fs/promises";
import { put } from "@vercel/blob";
import path from "path";
import { uploadToCloudinary, isCloudinaryConfigured } from "@/lib/cloudinary-upload";

const UPLOAD_DIR = "public/uploads/nominations";
// Server Actions have a practical request limit on serverless hosts. Keep
// uploads below that limit until direct-to-storage uploads are introduced.
const PHOTO_MAX_BYTES = 3 * 1024 * 1024; // 3 MB
const DOC_MAX_BYTES = 3 * 1024 * 1024; // 3 MB per file
const PHOTO_EXT = [".jpg", ".jpeg", ".png"];
const DOC_EXT = [".pdf", ".doc", ".docx", ".ppt", ".pptx", ".png", ".jpg", ".jpeg"];

const MIME_TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".pdf": "application/pdf",
  ".doc": "application/msword",
  ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ".ppt": "application/vnd.ms-powerpoint",
  ".pptx": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
};

function getMimeType(filename: string): string {
  const ext = path.extname(filename).toLowerCase();
  return MIME_TYPES[ext] ?? "application/octet-stream";
}

function isBlobConfigured(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

async function uploadPrivateBlob(buffer: Buffer, filename: string, mimeType: string, subdir: string) {
  const blob = await put(`nominations/${subdir}/${filename}`, buffer, {
    access: "private",
    addRandomSuffix: true,
    contentType: mimeType,
  });
  return blob.url;
}

/**
 * Saves a nomination photo to the configured cloud provider, otherwise to local public/uploads.
 */
export async function saveNominationPhoto(
  file: File,
  subdir: string
): Promise<{ success: true; url: string } | { success: false; error: string }> {
  if (file.size > PHOTO_MAX_BYTES) return { success: false, error: "Photo must be 3 MB or less." };
  const ext = path.extname(file.name).toLowerCase();
  if (!PHOTO_EXT.includes(ext)) return { success: false, error: "Photo must be JPG or PNG." };

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const filename = `photo_${Date.now()}${ext}`;

  if (isCloudinaryConfigured()) {
    const result = await uploadToCloudinary(buffer, filename, getMimeType(filename), subdir);
    if (!result.success) return result;
    return { success: true, url: result.url };
  }

  if (isBlobConfigured()) {
    try {
      return { success: true, url: await uploadPrivateBlob(buffer, filename, getMimeType(filename), subdir) };
    } catch {
      return { success: false, error: "Secure file storage is temporarily unavailable. Please try again." };
    }
  }

  const dir = path.join(process.cwd(), UPLOAD_DIR, subdir);
  await mkdir(dir, { recursive: true });
  const filepath = path.join(dir, filename);
  await writeFile(filepath, buffer);
  return { success: true, url: `/uploads/nominations/${subdir}/${filename}` };
}

/**
 * Saves supporting documents to the configured cloud provider, otherwise to local public/uploads.
 */
export async function saveSupportingDocs(
  files: File[],
  subdir: string
): Promise<{ success: true; urls: string[] } | { success: false; error: string }> {
  if (files.length > 5) return { success: false, error: "Maximum 5 supporting documents." };

  const urls: string[] = [];

  if (isCloudinaryConfigured()) {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.size > DOC_MAX_BYTES) return { success: false, error: "Each file must be 3 MB or less." };
      const ext = path.extname(file.name).toLowerCase();
      if (!DOC_EXT.includes(ext)) return { success: false, error: "Allowed: PDF, DOC, PPT, or images." };
      const filename = `doc_${i}_${Date.now()}${ext}`;
      const buffer = Buffer.from(await file.arrayBuffer());
      const result = await uploadToCloudinary(buffer, filename, getMimeType(filename), subdir);
      if (!result.success) return result;
      urls.push(result.url);
    }
    return { success: true, urls };
  }

  if (isBlobConfigured()) {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.size > DOC_MAX_BYTES) return { success: false, error: "Each file must be 3 MB or less." };
      const ext = path.extname(file.name).toLowerCase();
      if (!DOC_EXT.includes(ext)) return { success: false, error: "Allowed: PDF, DOC, PPT, or images." };
      const filename = `doc_${i}_${Date.now()}${ext}`;
      try {
        urls.push(await uploadPrivateBlob(Buffer.from(await file.arrayBuffer()), filename, getMimeType(filename), subdir));
      } catch {
        return { success: false, error: "Secure file storage is temporarily unavailable. Please try again." };
      }
    }
    return { success: true, urls };
  }

  const dir = path.join(process.cwd(), UPLOAD_DIR, subdir);
  await mkdir(dir, { recursive: true });

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    if (file.size > DOC_MAX_BYTES) return { success: false, error: "Each file must be 3 MB or less." };
    const ext = path.extname(file.name).toLowerCase();
    if (!DOC_EXT.includes(ext)) return { success: false, error: "Allowed: PDF, DOC, PPT, or images." };
    const filename = `doc_${i}_${Date.now()}${ext}`;
    const filepath = path.join(dir, filename);
    const bytes = await file.arrayBuffer();
    await writeFile(filepath, Buffer.from(bytes));
    urls.push(`/uploads/nominations/${subdir}/${filename}`);
  }
  return { success: true, urls };
}
