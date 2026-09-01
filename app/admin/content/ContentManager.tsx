"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  createFaq,
  updateFaq,
  deleteFaq,
  createAgendaItem,
  updateAgendaItem,
  deleteAgendaItem,
  createSpeaker,
  updateSpeaker,
  deleteSpeaker,
} from "@/app/actions/content-admin";
import { ImageUrlOrUpload } from "@/components/admin/ImageUrlOrUpload";

type Faq = { id: string; question: string; answer: string; sortOrder: number };
type AgendaItem = {
  id: string;
  time: string;
  sessionTitle: string;
  speaker: string | null;
  description: string | null;
  sortOrder: number;
};
type Speaker = {
  id: string;
  name: string;
  title: string;
  organization: string | null;
  category: string | null;
  age: number | null;
  photo: string | null;
  bio: string | null;
  linkedinUrl?: string | null;
  instagramUrl?: string | null;
  websiteUrl?: string | null;
  profileUrl?: string | null;
  isTopContender: boolean;
  sortOrder: number;
};

export function ContentManager({
  initialFaqs,
  initialAgenda,
  initialSpeakers,
}: {
  initialFaqs: Faq[];
  initialAgenda: AgendaItem[];
  initialSpeakers: Speaker[];
}) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"faq" | "agenda" | "speakers">("faq");
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      {error && (
        <p className="text-red-400 text-sm rounded-lg bg-red-400/10 px-4 py-2">
          {error}
        </p>
      )}
      <div className="flex gap-2 border-b border-neutral-600 pb-2 overflow-x-auto">
        {(["faq", "agenda", "speakers"] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`flex-shrink-0 px-4 py-2 rounded-t text-sm font-medium capitalize touch-manipulation ${
              activeTab === tab
                ? "bg-secondary/50 text-gold border border-neutral-600 border-b-transparent -mb-0.5"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            {tab === "faq" ? "FAQs" : tab === "agenda" ? "Agenda" : "Finalists & Top Contenders"}
          </button>
        ))}
      </div>

      {activeTab === "faq" && (
        <FaqSection
          initialFaqs={initialFaqs}
          onError={setError}
          onSuccess={() => router.refresh()}
        />
      )}
      {activeTab === "agenda" && (
        <AgendaSection
          initialAgenda={initialAgenda}
          onError={setError}
          onSuccess={() => router.refresh()}
        />
      )}
      {activeTab === "speakers" && (
        <SpeakersSection
          initialSpeakers={initialSpeakers}
          onError={setError}
          onSuccess={() => router.refresh()}
        />
      )}
    </div>
  );
}

function FaqSection({
  initialFaqs,
  onError,
  onSuccess,
}: {
  initialFaqs: Faq[];
  onError: (s: string | null) => void;
  onSuccess: () => void;
}) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [sortOrder, setSortOrder] = useState(0);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onError(null);
    try {
      if (editingId) {
        await updateFaq(editingId, question, answer, sortOrder);
        setEditingId(null);
      } else {
        await createFaq(question, answer, sortOrder);
      }
      setQuestion("");
      setAnswer("");
      setSortOrder(0);
      setShowForm(false);
      onSuccess();
    } catch (err) {
      onError(err instanceof Error ? err.message : "Failed to save");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this FAQ?")) return;
    onError(null);
    try {
      await deleteFaq(id);
      if (editingId === id) setEditingId(null);
      onSuccess();
    } catch (err) {
      onError(err instanceof Error ? err.message : "Failed to delete");
    }
  }

  function startEdit(f: Faq) {
    setEditingId(f.id);
    setQuestion(f.question);
    setAnswer(f.answer);
    setSortOrder(f.sortOrder);
    setShowForm(true);
  }

  return (
    <div className="space-y-6">
      {!showForm ? (
        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="rounded-lg bg-gold text-primary px-4 py-2 text-sm font-medium hover:bg-gold/90"
        >
          Add FAQ
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="rounded-xl border border-neutral-600 bg-secondary/20 p-6 max-w-2xl space-y-4">
          <h2 className="font-display text-lg font-bold text-white">
            {editingId ? "Edit FAQ" : "New FAQ"}
          </h2>
          <div>
            <label className="block text-neutral-400 text-sm mb-1">Question *</label>
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              required
              className="w-full rounded border border-neutral-600 bg-primary px-3 py-2 text-white"
            />
          </div>
          <div>
            <label className="block text-neutral-400 text-sm mb-1">Answer *</label>
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              required
              rows={4}
              className="w-full rounded border border-neutral-600 bg-primary px-3 py-2 text-white resize-y"
            />
          </div>
          <div>
            <label className="block text-neutral-400 text-sm mb-1">Sort order</label>
            <input
              type="number"
              value={sortOrder}
              onChange={(e) => setSortOrder(parseInt(e.target.value, 10) || 0)}
              className="w-24 rounded border border-neutral-600 bg-primary px-3 py-2 text-white"
            />
          </div>
          <div className="flex gap-3">
            <button type="submit" className="rounded-lg bg-gold text-primary px-4 py-2 text-sm font-medium hover:bg-gold/90">
              {editingId ? "Save" : "Add"}
            </button>
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setShowForm(false);
                setQuestion("");
                setAnswer("");
                setSortOrder(0);
              }}
              className="rounded-lg border border-neutral-600 px-4 py-2 text-sm text-neutral-400 hover:text-white"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
      <div className="rounded-xl border border-neutral-600 overflow-hidden overflow-x-auto">
        <table className="w-full text-left min-w-[320px]">
          <thead className="bg-secondary/30">
            <tr>
              <th className="py-3 px-3 md:px-4 text-neutral-400 font-medium text-sm">Question</th>
              <th className="py-3 px-3 md:px-4 text-neutral-400 font-medium text-sm w-28">Actions</th>
            </tr>
          </thead>
          <tbody>
            {initialFaqs.map((f) => (
              <tr key={f.id} className="border-t border-neutral-600">
                <td className="py-3 px-3 md:px-4 text-white text-sm">{f.question}</td>
                <td className="py-3 px-3 md:px-4">
                  <button type="button" onClick={() => startEdit(f)} className="text-gold hover:underline text-sm mr-2 md:mr-3 touch-manipulation">Edit</button>
                  <button type="button" onClick={() => handleDelete(f.id)} className="text-red-400 hover:underline text-sm touch-manipulation">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {initialFaqs.length === 0 && <p className="py-8 text-center text-neutral-500">No FAQs yet.</p>}
      </div>
    </div>
  );
}

function AgendaSection({
  initialAgenda,
  onError,
  onSuccess,
}: {
  initialAgenda: AgendaItem[];
  onError: (s: string | null) => void;
  onSuccess: () => void;
}) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [time, setTime] = useState("");
  const [sessionTitle, setSessionTitle] = useState("");
  const [speaker, setSpeaker] = useState("");
  const [description, setDescription] = useState("");
  const [sortOrder, setSortOrder] = useState(0);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onError(null);
    try {
      if (editingId) {
        await updateAgendaItem(editingId, { time, sessionTitle, speaker: speaker || null, description: description || null, sortOrder });
        setEditingId(null);
      } else {
        await createAgendaItem({ time, sessionTitle, speaker: speaker || null, description: description || null, sortOrder });
      }
      setTime("");
      setSessionTitle("");
      setSpeaker("");
      setDescription("");
      setSortOrder(0);
      setShowForm(false);
      onSuccess();
    } catch (err) {
      onError(err instanceof Error ? err.message : "Failed to save");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this agenda item?")) return;
    onError(null);
    try {
      await deleteAgendaItem(id);
      if (editingId === id) setEditingId(null);
      onSuccess();
    } catch (err) {
      onError(err instanceof Error ? err.message : "Failed to delete");
    }
  }

  function startEdit(a: AgendaItem) {
    setEditingId(a.id);
    setTime(a.time);
    setSessionTitle(a.sessionTitle);
    setSpeaker(a.speaker ?? "");
    setDescription(a.description ?? "");
    setSortOrder(a.sortOrder);
    setShowForm(true);
  }

  return (
    <div className="space-y-6">
      {!showForm ? (
        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="rounded-lg bg-gold text-primary px-4 py-2 text-sm font-medium hover:bg-gold/90"
        >
          Add agenda item
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="rounded-xl border border-neutral-600 bg-secondary/20 p-6 max-w-2xl space-y-4">
          <h2 className="font-display text-lg font-bold text-white">
            {editingId ? "Edit agenda item" : "New agenda item"}
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-neutral-400 text-sm mb-1">Time (e.g. 09:00) *</label>
              <input type="text" value={time} onChange={(e) => setTime(e.target.value)} required className="w-full rounded border border-neutral-600 bg-primary px-3 py-2 text-white" />
            </div>
            <div>
              <label className="block text-neutral-400 text-sm mb-1">Sort order</label>
              <input type="number" value={sortOrder} onChange={(e) => setSortOrder(parseInt(e.target.value, 10) || 0)} className="w-full rounded border border-neutral-600 bg-primary px-3 py-2 text-white" />
            </div>
          </div>
          <div>
            <label className="block text-neutral-400 text-sm mb-1">Session title *</label>
            <input type="text" value={sessionTitle} onChange={(e) => setSessionTitle(e.target.value)} required className="w-full rounded border border-neutral-600 bg-primary px-3 py-2 text-white" />
          </div>
          <div>
            <label className="block text-neutral-400 text-sm mb-1">Speaker</label>
            <input type="text" value={speaker} onChange={(e) => setSpeaker(e.target.value)} className="w-full rounded border border-neutral-600 bg-primary px-3 py-2 text-white" />
          </div>
          <div>
            <label className="block text-neutral-400 text-sm mb-1">Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="w-full rounded border border-neutral-600 bg-primary px-3 py-2 text-white resize-y" />
          </div>
          <div className="flex gap-3">
            <button type="submit" className="rounded-lg bg-gold text-primary px-4 py-2 text-sm font-medium hover:bg-gold/90">{editingId ? "Save" : "Add"}</button>
            <button type="button" onClick={() => { setEditingId(null); setShowForm(false); setTime(""); setSessionTitle(""); setSpeaker(""); setDescription(""); setSortOrder(0); }} className="rounded-lg border border-neutral-600 px-4 py-2 text-sm text-neutral-400 hover:text-white">Cancel</button>
          </div>
        </form>
      )}
      <div className="rounded-xl border border-neutral-600 overflow-hidden overflow-x-auto">
        <table className="w-full text-left min-w-[400px]">
          <thead className="bg-secondary/30">
            <tr>
              <th className="py-3 px-3 md:px-4 text-neutral-400 font-medium text-sm">Time</th>
              <th className="py-3 px-3 md:px-4 text-neutral-400 font-medium text-sm">Session</th>
              <th className="py-3 px-3 md:px-4 text-neutral-400 font-medium text-sm">Speaker</th>
              <th className="py-3 px-3 md:px-4 text-neutral-400 font-medium text-sm w-28">Actions</th>
            </tr>
          </thead>
          <tbody>
            {initialAgenda.map((a) => (
              <tr key={a.id} className="border-t border-neutral-600">
                <td className="py-3 px-3 md:px-4 text-gold text-sm">{a.time}</td>
                <td className="py-3 px-3 md:px-4 text-white text-sm">{a.sessionTitle}</td>
                <td className="py-3 px-3 md:px-4 text-neutral-400 text-sm">{a.speaker ?? "—"}</td>
                <td className="py-3 px-3 md:px-4">
                  <button type="button" onClick={() => startEdit(a)} className="text-gold hover:underline text-sm mr-2 md:mr-3 touch-manipulation">Edit</button>
                  <button type="button" onClick={() => handleDelete(a.id)} className="text-red-400 hover:underline text-sm touch-manipulation">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {initialAgenda.length === 0 && <p className="py-8 text-center text-neutral-500">No agenda items yet.</p>}
      </div>
    </div>
  );
}

function SpeakersSection({
  initialSpeakers,
  onError,
  onSuccess,
}: {
  initialSpeakers: Speaker[];
  onError: (s: string | null) => void;
  onSuccess: () => void;
}) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [organization, setOrganization] = useState("");
  const [category, setCategory] = useState("");
  const [age, setAge] = useState("");
  const [photo, setPhoto] = useState("");
  const [bio, setBio] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [instagramUrl, setInstagramUrl] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [profileUrl, setProfileUrl] = useState("");
  const [isTopContender, setIsTopContender] = useState(false);
  const [sortOrder, setSortOrder] = useState(0);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onError(null);
    try {
      if (editingId) {
        await updateSpeaker(editingId, {
          name,
          title,
          organization: organization || null,
          category: category.trim() || null,
          age:
            age.trim() === ""
              ? null
              : (() => {
                  const n = parseInt(age, 10);
                  return Number.isFinite(n) ? n : null;
                })(),
          photo: photo || null,
          bio: bio || null,
          linkedinUrl: linkedinUrl || null,
          instagramUrl: instagramUrl || null,
          websiteUrl: websiteUrl || null,
          profileUrl: profileUrl || null,
          isTopContender,
          sortOrder,
        });
        setEditingId(null);
      } else {
        await createSpeaker({
          name,
          title,
          organization: organization || null,
          category: category.trim() || null,
          age:
            age.trim() === ""
              ? null
              : (() => {
                  const n = parseInt(age, 10);
                  return Number.isFinite(n) ? n : null;
                })(),
          photo: photo || null,
          bio: bio || null,
          linkedinUrl: linkedinUrl || null,
          instagramUrl: instagramUrl || null,
          websiteUrl: websiteUrl || null,
          profileUrl: profileUrl || null,
          isTopContender,
          sortOrder,
        });
      }
      setName("");
      setTitle("");
      setOrganization("");
      setCategory("");
      setAge("");
      setPhoto("");
      setBio("");
      setLinkedinUrl("");
      setInstagramUrl("");
      setWebsiteUrl("");
      setProfileUrl("");
      setIsTopContender(false);
      setSortOrder(0);
      setShowForm(false);
      onSuccess();
    } catch (err) {
      onError(err instanceof Error ? err.message : "Failed to save");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this finalist?")) return;
    onError(null);
    try {
      await deleteSpeaker(id);
      if (editingId === id) setEditingId(null);
      onSuccess();
    } catch (err) {
      onError(err instanceof Error ? err.message : "Failed to delete");
    }
  }

  function startEdit(s: Speaker) {
    setEditingId(s.id);
    setName(s.name);
    setTitle(s.title);
    setOrganization(s.organization ?? "");
    setCategory(s.category ?? "");
    setAge(s.age != null ? String(s.age) : "");
    setPhoto(s.photo ?? "");
    setBio(s.bio ?? "");
    setLinkedinUrl(s.linkedinUrl ?? "");
    setInstagramUrl(s.instagramUrl ?? "");
    setWebsiteUrl(s.websiteUrl ?? "");
    setProfileUrl(s.profileUrl ?? "");
    setIsTopContender(s.isTopContender);
    setSortOrder(s.sortOrder);
    setShowForm(true);
  }

  return (
    <div className="space-y-6">
      {!showForm ? (
        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="rounded-lg bg-gold text-primary px-4 py-2 text-sm font-medium hover:bg-gold/90"
        >
          Add finalist
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="rounded-xl border border-neutral-600 bg-secondary/20 p-6 max-w-2xl space-y-4">
          <h2 className="font-display text-lg font-bold text-white">
            {editingId ? "Edit finalist" : "New finalist"}
          </h2>
          <div>
            <label className="block text-neutral-400 text-sm mb-1">Full name *</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="w-full rounded border border-neutral-600 bg-primary px-3 py-2 text-white" />
          </div>
          <div>
            <label className="block text-neutral-400 text-sm mb-1">Moniker / subtitle *</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required className="w-full rounded border border-neutral-600 bg-primary px-3 py-2 text-white" />
          </div>
          <div>
            <label className="block text-neutral-400 text-sm mb-1">Keyword tags</label>
            <input type="text" value={organization} onChange={(e) => setOrganization(e.target.value)} className="w-full rounded border border-neutral-600 bg-primary px-3 py-2 text-white" placeholder="e.g. CHAIRMAN | DIGITAL STRATEGIST" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-neutral-400 text-sm mb-1">Category</label>
              <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} className="w-full rounded border border-neutral-600 bg-primary px-3 py-2 text-white" placeholder="e.g. Technology" />
            </div>
            <div>
              <label className="block text-neutral-400 text-sm mb-1">Age</label>
              <input type="number" min={0} max={120} value={age} onChange={(e) => setAge(e.target.value)} className="w-full rounded border border-neutral-600 bg-primary px-3 py-2 text-white" placeholder="Shown on photo" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-neutral-400 text-sm mb-1">LinkedIn URL</label>
              <input type="url" value={linkedinUrl} onChange={(e) => setLinkedinUrl(e.target.value)} className="w-full rounded border border-neutral-600 bg-primary px-3 py-2 text-white" placeholder="https://linkedin.com/..." />
            </div>
            <div>
              <label className="block text-neutral-400 text-sm mb-1">Instagram URL</label>
              <input type="url" value={instagramUrl} onChange={(e) => setInstagramUrl(e.target.value)} className="w-full rounded border border-neutral-600 bg-primary px-3 py-2 text-white" placeholder="https://instagram.com/..." />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-neutral-400 text-sm mb-1">Website URL</label>
              <input type="url" value={websiteUrl} onChange={(e) => setWebsiteUrl(e.target.value)} className="w-full rounded border border-neutral-600 bg-primary px-3 py-2 text-white" placeholder="https://..." />
            </div>
            <div>
              <label className="block text-neutral-400 text-sm mb-1">Profile URL</label>
              <input type="url" value={profileUrl} onChange={(e) => setProfileUrl(e.target.value)} className="w-full rounded border border-neutral-600 bg-primary px-3 py-2 text-white" placeholder="https://..." />
            </div>
          </div>
          <ImageUrlOrUpload
            label="Photo URL"
            value={photo}
            onChange={setPhoto}
            folder="speakers"
          />
          <div>
            <label className="block text-neutral-400 text-sm mb-1">Editorial bio</label>
            <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={3} className="w-full rounded border border-neutral-600 bg-primary px-3 py-2 text-white resize-y" />
          </div>
          <label className="flex items-center gap-3 rounded border border-neutral-600 bg-primary/40 px-3 py-3 text-sm text-neutral-300">
            <input type="checkbox" checked={isTopContender} onChange={(e) => setIsTopContender(e.target.checked)} className="h-4 w-4 accent-[#C5B397]" />
            Feature in the fixed Top Contenders selection
          </label>
          <div>
            <label className="block text-neutral-400 text-sm mb-1">Sort order</label>
            <input type="number" value={sortOrder} onChange={(e) => setSortOrder(parseInt(e.target.value, 10) || 0)} className="w-24 rounded border border-neutral-600 bg-primary px-3 py-2 text-white" />
          </div>
          <div className="flex gap-3">
            <button type="submit" className="rounded-lg bg-gold text-primary px-4 py-2 text-sm font-medium hover:bg-gold/90">{editingId ? "Save" : "Add"}</button>
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setShowForm(false);
                setName("");
                setTitle("");
                setOrganization("");
                setCategory("");
                setAge("");
                setPhoto("");
                setBio("");
                setLinkedinUrl("");
                setInstagramUrl("");
                setWebsiteUrl("");
                setProfileUrl("");
                setIsTopContender(false);
                setSortOrder(0);
              }}
              className="rounded-lg border border-neutral-600 px-4 py-2 text-sm text-neutral-400 hover:text-white"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
      <div className="rounded-xl border border-neutral-600 overflow-hidden overflow-x-auto">
        <table className="w-full text-left min-w-[640px]">
          <thead className="bg-secondary/30">
            <tr>
              <th className="py-3 px-3 md:px-4 text-neutral-400 font-medium text-sm">Name</th>
              <th className="py-3 px-3 md:px-4 text-neutral-400 font-medium text-sm">Moniker</th>
              <th className="py-3 px-3 md:px-4 text-neutral-400 font-medium text-sm">Tags</th>
              <th className="py-3 px-3 md:px-4 text-neutral-400 font-medium text-sm">Category</th>
              <th className="py-3 px-3 md:px-4 text-neutral-400 font-medium text-sm w-16">Age</th>
              <th className="py-3 px-3 md:px-4 text-neutral-400 font-medium text-sm">Top</th>
              <th className="py-3 px-3 md:px-4 text-neutral-400 font-medium text-sm w-28">Actions</th>
            </tr>
          </thead>
          <tbody>
            {initialSpeakers.map((s) => (
              <tr key={s.id} className="border-t border-neutral-600">
                <td className="py-3 px-3 md:px-4 text-white text-sm">{s.name}</td>
                <td className="py-3 px-3 md:px-4 text-neutral-400 text-sm">{s.title}</td>
                <td className="py-3 px-3 md:px-4 text-neutral-400 text-sm max-w-[200px] truncate">{s.organization ?? "—"}</td>
                <td className="py-3 px-3 md:px-4 text-neutral-400 text-sm">{s.category ?? "—"}</td>
                <td className="py-3 px-3 md:px-4 text-neutral-400 text-sm tabular-nums">{s.age ?? "—"}</td>
                <td className="py-3 px-3 md:px-4 text-gold text-sm">{s.isTopContender ? "Yes" : "—"}</td>
                <td className="py-3 px-3 md:px-4">
                  <button type="button" onClick={() => startEdit(s)} className="text-gold hover:underline text-sm mr-2 md:mr-3 touch-manipulation">Edit</button>
                  <button type="button" onClick={() => handleDelete(s.id)} className="text-red-400 hover:underline text-sm touch-manipulation">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {initialSpeakers.length === 0 && <p className="py-8 text-center text-neutral-500">No speakers yet.</p>}
      </div>
    </div>
  );
}
