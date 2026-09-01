"use client";

import { useRef, useState } from "react";
import { uploadAdminImageAction } from "@/app/actions/upload-admin-image";

type Folder = "jury" | "sponsors" | "speakers";

const INPUT_CLASS =
  "w-full rounded border border-neutral-600 bg-primary px-3 py-2 text-white text-sm";

export function ImageUrlOrUpload({
  label,
  value,
  onChange,
  folder,
}: {
  label: string;
  value: string;
  onChange: (url: string) => void;
  folder: Folder;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadError(null);
    setUploading(true);
    try {
      const formData = new FormData();
      formData.set("file", file);
      const result = await uploadAdminImageAction(formData, folder);
      if (result.success) {
        onChange(result.url);
      } else {
        setUploadError(result.error);
      }
    } finally {
      setUploading(false);
      e.target.value = "";
      fileRef.current?.value && (fileRef.current.value = "");
    }
  }

  return (
    <div>
      <label className="block text-neutral-400 text-sm mb-1">{label}</label>
      <div className="space-y-2">
        <input
          type="url"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://..."
          className={INPUT_CLASS}
        />
        <div className="flex items-center gap-2">
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handleFileChange}
            disabled={uploading}
            className="hidden"
            id={`upload-${folder}-${label.replace(/\s/g, "-")}`}
          />
          <label
            htmlFor={`upload-${folder}-${label.replace(/\s/g, "-")}`}
            className="rounded border border-neutral-500 px-3 py-2 text-sm text-neutral-300 hover:text-white cursor-pointer disabled:opacity-50"
          >
            {uploading ? "Uploading…" : "Or upload image"}
          </label>
        </div>
        {uploadError && (
          <p className="text-red-400 text-xs">{uploadError}</p>
        )}
      </div>
    </div>
  );
}
