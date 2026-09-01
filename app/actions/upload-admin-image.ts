"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { uploadAdminImage } from "@/lib/cloudinary-upload";

const MAX_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export type UploadAdminImageResult =
  | { success: true; url: string }
  | { success: false; error: string };

export async function uploadAdminImageAction(
  formData: FormData,
  folder: "jury" | "sponsors" | "speakers"
): Promise<UploadAdminImageResult> {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as { role?: string }).role !== "admin") {
    return { success: false, error: "Unauthorized" };
  }

  const file = formData.get("file") as File | null;
  if (!file || file.size === 0) {
    return { success: false, error: "No file provided" };
  }
  if (file.size > MAX_SIZE) {
    return { success: false, error: "File must be 5 MB or less" };
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    return { success: false, error: "Allowed: JPG, PNG, WebP, GIF" };
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const ext = file.name.includes(".") ? file.name.slice(file.name.lastIndexOf(".")) : ".jpg";
  const filename = `img${ext}`;

  return uploadAdminImage(buffer, filename, file.type, folder);
}
