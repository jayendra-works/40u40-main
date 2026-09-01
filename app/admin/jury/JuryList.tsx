"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  createJuryMember,
  updateJuryMember,
  deleteJuryMember,
  type JuryMemberPayload,
} from "@/app/actions/jury-admin";
import { ImageUrlOrUpload } from "@/components/admin/ImageUrlOrUpload";

type JuryMember = {
  id: string;
  name: string;
  title: string;
  organization: string;
  category: string | null;
  age: number | null;
  photo: string | null;
  bio: string | null;
  url: string | null;
  linkedinUrl: string | null;
  instagramUrl: string | null;
  websiteUrl: string | null;
  sortOrder: number;
};

export function JuryList({ initialJury }: { initialJury: JuryMember[] }) {
  const router = useRouter();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<JuryMemberPayload>({
    name: "",
    title: "",
    organization: "",
    category: null,
    age: null,
    photo: null,
    bio: null,
    url: null,
    linkedinUrl: null,
    instagramUrl: null,
    websiteUrl: null,
    sortOrder: 0,
  });
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      if (editingId) {
        await updateJuryMember(editingId, form);
        setEditingId(null);
      } else {
        await createJuryMember(form);
      }
      setForm({
        name: "",
        title: "",
        organization: "",
        category: null,
        age: null,
        photo: null,
        bio: null,
        url: null,
        linkedinUrl: null,
        instagramUrl: null,
        websiteUrl: null,
        sortOrder: 0,
      });
      setShowForm(false);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this jury member?")) return;
    setError(null);
    try {
      await deleteJuryMember(id);
      if (editingId === id) setEditingId(null);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete");
    }
  }

  function startEdit(m: JuryMember) {
    setEditingId(m.id);
    setForm({
      name: m.name,
      title: m.title,
      organization: m.organization,
      category: m.category ?? null,
      age: m.age ?? null,
      photo: m.photo,
      bio: m.bio,
      url: m.url ?? null,
      linkedinUrl: m.linkedinUrl ?? null,
      instagramUrl: m.instagramUrl ?? null,
      websiteUrl: m.websiteUrl ?? null,
      sortOrder: m.sortOrder ?? 0,
    });
    setShowForm(true);
  }

  function cancelForm() {
    setEditingId(null);
    setShowForm(false);
    setForm({
      name: "",
      title: "",
      organization: "",
      category: null,
      age: null,
      photo: null,
      bio: null,
      url: null,
      linkedinUrl: null,
      instagramUrl: null,
      websiteUrl: null,
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
          Add jury member
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="rounded-xl border border-neutral-600 bg-secondary/20 p-4 md:p-6 max-w-xl space-y-4">
          <h2 className="font-display text-lg font-bold text-white">
            {editingId ? "Edit jury member" : "New jury member"}
          </h2>
          <div>
            <label className="block text-neutral-400 text-sm mb-1">Sort order</label>
            <input
              type="number"
              value={form.sortOrder ?? 0}
              onChange={(e) => setForm((p) => ({ ...p, sortOrder: parseInt(e.target.value, 10) || 0 }))}
              className="w-32 rounded border border-neutral-600 bg-primary px-3 py-2 text-white"
            />
            <p className="text-neutral-500 text-xs mt-1">
              Lower numbers appear first on the website.
            </p>
          </div>
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
            <label className="block text-neutral-400 text-sm mb-1">Title *</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
              required
              className="w-full rounded border border-neutral-600 bg-primary px-3 py-2 text-white"
            />
          </div>
          <div>
            <label className="block text-neutral-400 text-sm mb-1">Organization *</label>
            <input
              type="text"
              value={form.organization}
              onChange={(e) => setForm((p) => ({ ...p, organization: e.target.value }))}
              required
              className="w-full rounded border border-neutral-600 bg-primary px-3 py-2 text-white"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-neutral-400 text-sm mb-1">Category</label>
              <input
                type="text"
                value={form.category ?? ""}
                onChange={(e) =>
                  setForm((p) => ({ ...p, category: e.target.value.trim() || null }))
                }
                placeholder="On photo (hover)"
                className="w-full rounded border border-neutral-600 bg-primary px-3 py-2 text-white"
              />
            </div>
            <div>
              <label className="block text-neutral-400 text-sm mb-1">Age</label>
              <input
                type="number"
                min={0}
                max={120}
                value={form.age === null || form.age === undefined ? "" : form.age}
                onChange={(e) => {
                  const v = e.target.value;
                  setForm((p) => ({
                    ...p,
                    age:
                      v === ""
                        ? null
                        : (() => {
                            const n = parseInt(v, 10);
                            return Number.isFinite(n) ? n : null;
                          })(),
                  }));
                }}
                placeholder="On photo (hover)"
                className="w-full rounded border border-neutral-600 bg-primary px-3 py-2 text-white"
              />
            </div>
          </div>
          <ImageUrlOrUpload
            label="Photo URL"
            value={form.photo ?? ""}
            onChange={(url) => setForm((p) => ({ ...p, photo: url || null }))}
            folder="jury"
          />
          <div>
            <label className="block text-neutral-400 text-sm mb-1">Bio</label>
            <textarea
              value={form.bio ?? ""}
              onChange={(e) => setForm((p) => ({ ...p, bio: e.target.value || null }))}
              rows={3}
              className="w-full rounded border border-neutral-600 bg-primary px-3 py-2 text-white resize-y"
            />
          </div>
          <div>
            <label className="block text-neutral-400 text-sm mb-1">Profile URL</label>
            <input
              type="url"
              value={form.url ?? ""}
              onChange={(e) => setForm((p) => ({ ...p, url: e.target.value || null }))}
              placeholder="LinkedIn, company website, etc."
              className="w-full rounded border border-neutral-600 bg-primary px-3 py-2 text-white"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-neutral-400 text-sm mb-1">LinkedIn URL</label>
              <input
                type="url"
                value={form.linkedinUrl ?? ""}
                onChange={(e) => setForm((p) => ({ ...p, linkedinUrl: e.target.value || null }))}
                placeholder="https://linkedin.com/in/..."
                className="w-full rounded border border-neutral-600 bg-primary px-3 py-2 text-white"
              />
            </div>
            <div>
              <label className="block text-neutral-400 text-sm mb-1">Instagram URL</label>
              <input
                type="url"
                value={form.instagramUrl ?? ""}
                onChange={(e) => setForm((p) => ({ ...p, instagramUrl: e.target.value || null }))}
                placeholder="https://instagram.com/..."
                className="w-full rounded border border-neutral-600 bg-primary px-3 py-2 text-white"
              />
            </div>
          </div>
          <div>
            <label className="block text-neutral-400 text-sm mb-1">Website URL</label>
            <input
              type="url"
              value={form.websiteUrl ?? ""}
              onChange={(e) => setForm((p) => ({ ...p, websiteUrl: e.target.value || null }))}
              placeholder="https://..."
              className="w-full rounded border border-neutral-600 bg-primary px-3 py-2 text-white"
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
        <table className="w-full min-w-[640px] text-left">
          <thead className="bg-secondary/30">
            <tr>
              <th className="py-3 px-3 md:px-4 text-neutral-400 font-medium text-sm w-24">Order</th>
              <th className="py-3 px-3 md:px-4 text-neutral-400 font-medium text-sm">Name</th>
              <th className="py-3 px-3 md:px-4 text-neutral-400 font-medium text-sm">Title</th>
              <th className="py-3 px-3 md:px-4 text-neutral-400 font-medium text-sm">Organization</th>
              <th className="py-3 px-3 md:px-4 text-neutral-400 font-medium text-sm">Category</th>
              <th className="py-3 px-3 md:px-4 text-neutral-400 font-medium text-sm w-14">Age</th>
              <th className="py-3 px-3 md:px-4 text-neutral-400 font-medium text-sm w-28">Actions</th>
            </tr>
          </thead>
          <tbody>
            {initialJury.map((j) => (
              <tr key={j.id} className="border-t border-neutral-600">
                <td className="py-3 px-3 md:px-4 text-neutral-400 text-sm tabular-nums">{j.sortOrder ?? 0}</td>
                <td className="py-3 px-3 md:px-4 text-sm">{j.name}</td>
                <td className="py-3 px-3 md:px-4 text-neutral-400 text-sm">{j.title}</td>
                <td className="max-w-[180px] truncate py-3 px-3 text-neutral-400 text-sm md:px-4">{j.organization}</td>
                <td className="py-3 px-3 md:px-4 text-neutral-400 text-sm">{j.category ?? "—"}</td>
                <td className="py-3 px-3 md:px-4 text-neutral-400 text-sm tabular-nums">{j.age ?? "—"}</td>
                <td className="py-3 px-3 md:px-4">
                  <button
                    type="button"
                    onClick={() => startEdit(j)}
                    className="text-gold hover:underline text-sm mr-2 md:mr-3 touch-manipulation"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(j.id)}
                    className="text-red-400 hover:underline text-sm touch-manipulation"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {initialJury.length === 0 && (
          <p className="py-12 text-center text-neutral-500">
            No jury members yet. Click &quot;Add jury member&quot; to add one.
          </p>
        )}
      </div>
    </div>
  );
}
