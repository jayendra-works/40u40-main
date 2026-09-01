"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { submitJuryScore } from "@/app/actions/jury";

type Nominee = { id: string; name: string; company: string; designation: string; achievements: string };
type ScoreRow = {
  nomineeId: string;
  innovationScore: number;
  impactScore: number;
  leadershipScore: number;
  overallScore: number | null;
  comments: string | null;
};

export function JuryScoringList({
  nominees,
  scoresByNominee,
}: {
  nominees: Nominee[];
  scoresByNominee: Record<string, ScoreRow>;
}) {
  const router = useRouter();
  const [saving, setSaving] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (nominees.length === 0) {
    return (
      <p className="text-neutral-500">
        No shortlisted or finalist nominees to score yet.
      </p>
    );
  }

  return (
    <div className="space-y-6">
      {error && <p className="text-red-400 text-sm">{error}</p>}
      {nominees.map((n) => (
        <NomineeScoreCard
          key={n.id}
          nominee={n}
          existing={scoresByNominee[n.id]}
          onSave={async (innovation, impact, leadership, comments) => {
            setSaving(n.id);
            setError(null);
            const result = await submitJuryScore(n.id, innovation, impact, leadership, comments);
            setSaving(null);
            if (result.success) router.refresh();
            else setError(result.error);
          }}
          saving={saving === n.id}
        />
      ))}
    </div>
  );
}

function NomineeScoreCard({
  nominee,
  existing,
  onSave,
  saving,
}: {
  nominee: Nominee;
  existing?: ScoreRow;
  onSave: (innovation: number, impact: number, leadership: number, comments?: string) => Promise<void>;
  saving: boolean;
}) {
  const [innovation, setInnovation] = useState(existing?.innovationScore ?? 5);
  const [impact, setImpact] = useState(existing?.impactScore ?? 5);
  const [leadership, setLeadership] = useState(existing?.leadershipScore ?? 5);
  const [comments, setComments] = useState(existing?.comments ?? "");

  return (
    <div className="rounded-xl border border-neutral-600 bg-secondary/20 p-6">
      <h3 className="font-display font-bold text-white">{nominee.name}</h3>
      <p className="text-neutral-400 text-sm mt-1">
        {nominee.designation} at {nominee.company}
      </p>
      <p className="text-neutral-500 text-sm mt-2 line-clamp-2">{nominee.achievements}</p>
      <div className="grid grid-cols-3 gap-4 mt-4">
        <label className="block">
          <span className="text-neutral-400 text-sm">Innovation (1–10)</span>
          <input
            type="number"
            min={1}
            max={10}
            value={innovation}
            onChange={(e) => setInnovation(Number(e.target.value))}
            className="mt-1 w-full rounded border border-neutral-600 bg-primary px-3 py-2 text-white"
          />
        </label>
        <label className="block">
          <span className="text-neutral-400 text-sm">Impact (1–10)</span>
          <input
            type="number"
            min={1}
            max={10}
            value={impact}
            onChange={(e) => setImpact(Number(e.target.value))}
            className="mt-1 w-full rounded border border-neutral-600 bg-primary px-3 py-2 text-white"
          />
        </label>
        <label className="block">
          <span className="text-neutral-400 text-sm">Leadership (1–10)</span>
          <input
            type="number"
            min={1}
            max={10}
            value={leadership}
            onChange={(e) => setLeadership(Number(e.target.value))}
            className="mt-1 w-full rounded border border-neutral-600 bg-primary px-3 py-2 text-white"
          />
        </label>
      </div>
      <div className="mt-4">
        <label className="block">
          <span className="text-neutral-400 text-sm">Comments (optional)</span>
          <textarea
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            rows={2}
            className="mt-1 w-full rounded border border-neutral-600 bg-primary px-3 py-2 text-white resize-y"
          />
        </label>
      </div>
      <button
        type="button"
        onClick={() => onSave(innovation, impact, leadership, comments || undefined)}
        disabled={saving}
        className="mt-4 rounded-lg bg-gold text-primary px-4 py-2 text-sm font-medium hover:bg-gold/90 disabled:opacity-50"
      >
        {saving ? "Saving…" : existing ? "Update score" : "Submit score"}
      </button>
      {existing?.overallScore != null && (
        <p className="mt-2 text-neutral-400 text-sm">Overall: {existing.overallScore}</p>
      )}
    </div>
  );
}
