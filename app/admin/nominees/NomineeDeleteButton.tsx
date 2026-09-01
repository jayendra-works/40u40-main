"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteNominee } from "@/app/actions/admin";

export function NomineeDeleteButton({ nomineeId, nomineeName }: { nomineeId: string; nomineeName: string }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete() {
    setError(null);
    const ok = confirm(`Delete nominee "${nomineeName}"? This cannot be undone.`);
    if (!ok) return;

    setDeleting(true);
    const result = await deleteNominee(nomineeId);
    setDeleting(false);

    if (result.success) router.refresh();
    else setError(result.error);
  }

  return (
    <div className="flex flex-col items-start">
      <button
        type="button"
        onClick={handleDelete}
        disabled={deleting}
        className="rounded-lg bg-red-500/20 text-red-300 px-3 py-2 text-sm font-medium hover:bg-red-500/30 disabled:opacity-50 touch-manipulation"
      >
        {deleting ? "Deleting…" : "Delete"}
      </button>
      {error && <span className="text-red-400 text-xs mt-1">{error}</span>}
    </div>
  );
}

