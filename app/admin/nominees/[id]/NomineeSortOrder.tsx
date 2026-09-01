"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { updateNomineeSortOrder } from "@/app/actions/admin";

export function NomineeSortOrder({ nomineeId, initialSortOrder }: { nomineeId: string; initialSortOrder: number }) {
  const router = useRouter();
  const [value, setValue] = useState<number>(initialSortOrder);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const dirty = useMemo(() => value !== initialSortOrder, [initialSortOrder, value]);

  async function save() {
    setError(null);
    setSaving(true);
    const result = await updateNomineeSortOrder(nomineeId, value);
    setSaving(false);
    if (result.success) router.refresh();
    else setError(result.error);
  }

  return (
    <div className="rounded-xl border border-neutral-600 bg-secondary/10 p-4">
      <div className="flex flex-col sm:flex-row sm:items-end gap-3">
        <div>
          <label className="block text-neutral-400 text-sm mb-1">Display order</label>
          <input
            type="number"
            value={value}
            onChange={(e) => setValue(parseInt(e.target.value, 10) || 0)}
            className="w-40 rounded border border-neutral-600 bg-primary px-3 py-2 text-white"
          />
          <p className="text-neutral-500 text-xs mt-1">Lower numbers appear first.</p>
        </div>
        <button
          type="button"
          onClick={save}
          disabled={!dirty || saving}
          className="rounded-lg bg-gold text-primary px-4 py-2 text-sm font-medium hover:bg-gold/90 disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save order"}
        </button>
      </div>
      {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
    </div>
  );
}

