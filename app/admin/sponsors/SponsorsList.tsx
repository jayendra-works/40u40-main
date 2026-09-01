"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  createSponsor,
  updateSponsor,
  deleteSponsor,
  type SponsorPayload,
} from "@/app/actions/sponsors-admin";
import { ImageUrlOrUpload } from "@/components/admin/ImageUrlOrUpload";
import type { SponsorTier } from "@prisma/client";

const TIER_OPTIONS: { value: SponsorTier; label: string }[] = [
  { value: "title_partner", label: "Title Partner" },
  { value: "strategic_partner", label: "Strategic Partner" },
  { value: "media_partner", label: "Media Partner" },
  { value: "community_partner", label: "Community Partner" },
];

const TIER_LABEL: Record<string, string> = {
  title_partner: "Title Partner",
  strategic_partner: "Strategic Partner",
  media_partner: "Media Partner",
  community_partner: "Community Partner",
};

type Sponsor = {
  id: string;
  name: string;
  tier: SponsorTier;
  logo: string | null;
  website: string | null;
  description: string | null;
  sortOrder: number;
};

export function SponsorsList({ initialSponsors }: { initialSponsors: Sponsor[] }) {
  const router = useRouter();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<SponsorPayload>({
    name: "",
    tier: "community_partner",
    logo: null,
    website: null,
    description: null,
    sortOrder: 0,
  });
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      if (editingId) {
        await updateSponsor(editingId, form);
        setEditingId(null);
      } else {
        await createSponsor(form);
      }
      setForm({
        name: "",
        tier: "community_partner",
        logo: null,
        website: null,
        description: null,
        sortOrder: 0,
      });
      setShowForm(false);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this sponsor?")) return;
    setError(null);
    try {
      await deleteSponsor(id);
      if (editingId === id) setEditingId(null);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete");
    }
  }

  function startEdit(s: Sponsor) {
    setEditingId(s.id);
    setForm({
      name: s.name,
      tier: s.tier,
      logo: s.logo,
      website: s.website,
      description: s.description,
      sortOrder: s.sortOrder,
    });
    setShowForm(true);
  }

  function cancelForm() {
    setEditingId(null);
    setShowForm(false);
    setForm({
      name: "",
      tier: "community_partner",
      logo: null,
      website: null,
      description: null,
      sortOrder: 0,
    });
  }

  return (
    <div className="space-y-8">
      {error && (
        <p className="text-red-400 text-sm rounded-lg bg-red-400/10 px-4 py-2">
          {error}
        </p>
      )}
      {!showForm ? (
        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="rounded-lg bg-gold text-primary px-4 py-2 text-sm font-medium hover:bg-gold/90"
        >
          Add sponsor
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="rounded-xl border border-neutral-600 bg-secondary/20 p-4 md:p-6 max-w-xl space-y-4">
          <h2 className="font-display text-lg font-bold text-white">
            {editingId ? "Edit sponsor" : "New sponsor"}
          </h2>
          <div>
            <label className="block text-neutral-400 text-sm mb-1">Name *</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              required
              className="w-full rounded border border-neutral-600 bg-primary px-3 py-2 text-white"
            />
          </div>
          <div>
            <label className="block text-neutral-400 text-sm mb-1">Tier *</label>
            <select
              value={form.tier}
              onChange={(e) => setForm((p) => ({ ...p, tier: e.target.value as SponsorTier }))}
              className="w-full rounded border border-neutral-600 bg-primary px-3 py-2 text-white"
            >
              {TIER_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
          <ImageUrlOrUpload
            label="Logo URL"
            value={form.logo ?? ""}
            onChange={(url) => setForm((p) => ({ ...p, logo: url || null }))}
            folder="sponsors"
          />
          <div>
            <label className="block text-neutral-400 text-sm mb-1">Website</label>
            <input
              type="url"
              value={form.website ?? ""}
              onChange={(e) => setForm((p) => ({ ...p, website: e.target.value || null }))}
              className="w-full rounded border border-neutral-600 bg-primary px-3 py-2 text-white"
            />
          </div>
          <div>
            <label className="block text-neutral-400 text-sm mb-1">Description</label>
            <textarea
              value={form.description ?? ""}
              onChange={(e) => setForm((p) => ({ ...p, description: e.target.value || null }))}
              rows={2}
              className="w-full rounded border border-neutral-600 bg-primary px-3 py-2 text-white resize-y"
            />
          </div>
          <div>
            <label className="block text-neutral-400 text-sm mb-1">Sort order</label>
            <input
              type="number"
              value={form.sortOrder ?? 0}
              onChange={(e) => setForm((p) => ({ ...p, sortOrder: parseInt(e.target.value, 10) || 0 }))}
              className="w-full rounded border border-neutral-600 bg-primary px-3 py-2 text-white w-24"
            />
          </div>
          <div className="flex gap-3">
            <button
              type="submit"
              className="rounded-lg bg-gold text-primary px-4 py-2 text-sm font-medium hover:bg-gold/90"
            >
              {editingId ? "Save" : "Add"}
            </button>
            <button
              type="button"
              onClick={cancelForm}
              className="rounded-lg border border-neutral-600 px-4 py-2 text-sm text-neutral-400 hover:text-white"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
      <div className="rounded-xl border border-neutral-600 overflow-hidden overflow-x-auto">
        <table className="w-full text-left min-w-[400px]">
          <thead className="bg-secondary/30">
            <tr>
              <th className="py-3 px-3 md:px-4 text-neutral-400 font-medium text-sm">Name</th>
              <th className="py-3 px-3 md:px-4 text-neutral-400 font-medium text-sm">Tier</th>
              <th className="py-3 px-3 md:px-4 text-neutral-400 font-medium text-sm">Website</th>
              <th className="py-3 px-3 md:px-4 text-neutral-400 font-medium text-sm w-28">Actions</th>
            </tr>
          </thead>
          <tbody>
            {initialSponsors.map((s) => (
              <tr key={s.id} className="border-t border-neutral-600">
                <td className="py-3 px-3 md:px-4 text-sm">{s.name}</td>
                <td className="py-3 px-3 md:px-4 text-neutral-400 text-sm">{TIER_LABEL[s.tier] ?? s.tier}</td>
                <td className="py-3 px-3 md:px-4 text-neutral-400 text-sm truncate max-w-[120px] md:max-w-none">
                  {s.website ? (
                    <a href={s.website} target="_blank" rel="noopener noreferrer" className="text-gold hover:underline">
                      {s.website}
                    </a>
                  ) : "—"}
                </td>
                <td className="py-3 px-3 md:px-4">
                  <button
                    type="button"
                    onClick={() => startEdit(s)}
                    className="text-gold hover:underline text-sm mr-2 md:mr-3 touch-manipulation"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(s.id)}
                    className="text-red-400 hover:underline text-sm touch-manipulation"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {initialSponsors.length === 0 && (
          <p className="py-12 text-center text-neutral-500">
            No sponsors yet. Click &quot;Add sponsor&quot; to add one.
          </p>
        )}
      </div>
    </div>
  );
}
