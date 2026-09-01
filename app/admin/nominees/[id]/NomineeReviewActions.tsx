"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteNominee, updateNomineeStatus } from "@/app/actions/admin";
import { NomineeStatus } from "@prisma/client";

export function NomineeReviewActions({
  nomineeId,
  currentStatus,
}: { nomineeId: string; currentStatus: NomineeStatus }) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const statusOrder: NomineeStatus[] = [
    NomineeStatus.submitted,
    NomineeStatus.under_review,
    NomineeStatus.shortlisted,
    NomineeStatus.finalist,
    NomineeStatus.winner,
  ];

  function formatStatus(status: NomineeStatus): string {
    const spaced = status.replace(/_/g, " ");
    return spaced
      .split(" ")
      .filter(Boolean)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
  }

  async function handleStatus(status: NomineeStatus) {
    setLoading(status);
    setError(null);
    const result = await updateNomineeStatus(nomineeId, status);
    setLoading(null);
    if (result.success) router.refresh();
    else setError(result.error);
  }

  async function handleDelete() {
    setError(null);
    const ok = confirm("Delete this nominee? This cannot be undone.");
    if (!ok) return;

    setDeleting(true);
    const result = await deleteNominee(nomineeId);
    setDeleting(false);

    if (result.success) router.push("/admin/nominees");
    else setError(result.error);
  }

  const currentIndex = statusOrder.indexOf(currentStatus);
  const rollbackTargets = currentIndex <= 0 ? [] : statusOrder.slice(0, currentIndex);

  return (
    <div className="flex flex-wrap gap-3">
      {error && <p className="text-red-400 text-sm w-full">{error}</p>}

      {rollbackTargets.map((status) => (
        <button
          key={status}
          type="button"
          onClick={() => handleStatus(status)}
          disabled={!!loading || deleting}
          className="rounded-lg border border-neutral-600 text-neutral-200 px-4 py-2 text-sm font-medium hover:bg-neutral-600/20 disabled:opacity-50 touch-manipulation"
        >
          {loading === status ? "Updating…" : `Rollback to ${formatStatus(status)}`}
        </button>
      ))}

      {currentStatus === NomineeStatus.submitted && (
        <>
          <button
            type="button"
            onClick={() => handleStatus(NomineeStatus.under_review)}
            disabled={!!loading || deleting}
            className="rounded-lg bg-blue-500/20 text-blue-300 px-4 py-2 text-sm font-medium hover:bg-blue-500/30 disabled:opacity-50 touch-manipulation"
          >
            {loading === NomineeStatus.under_review ? "Updating…" : "Under Review"}
          </button>
          <button
            type="button"
            onClick={() => handleStatus(NomineeStatus.shortlisted)}
            disabled={!!loading || deleting}
            className="rounded-lg bg-gold/20 text-gold px-4 py-2 text-sm font-medium hover:bg-gold/30 disabled:opacity-50 touch-manipulation"
          >
            {loading === NomineeStatus.shortlisted ? "Updating…" : "Shortlist"}
          </button>
        </>
      )}
      {(currentStatus === NomineeStatus.submitted || currentStatus === NomineeStatus.under_review || currentStatus === NomineeStatus.shortlisted) && (
        <button
          type="button"
          onClick={() => handleStatus(NomineeStatus.finalist)}
          disabled={!!loading || deleting}
          className="rounded-lg border border-gold text-gold px-4 py-2 text-sm font-medium hover:bg-gold/10 disabled:opacity-50 touch-manipulation"
        >
          {loading === NomineeStatus.finalist ? "Updating…" : "Mark Finalist"}
        </button>
      )}
      {(currentStatus === NomineeStatus.shortlisted || currentStatus === NomineeStatus.finalist) && (
        <button
          type="button"
          onClick={() => handleStatus(NomineeStatus.winner)}
          disabled={!!loading || deleting}
          className="rounded-lg bg-gold text-primary px-4 py-2 text-sm font-medium hover:bg-gold/90 disabled:opacity-50 touch-manipulation"
        >
          {loading === NomineeStatus.winner ? "Updating…" : "Mark Winner"}
        </button>
      )}

      <button
        type="button"
        onClick={handleDelete}
        disabled={!!loading || deleting}
        className="rounded-lg bg-red-500/20 text-red-300 px-4 py-2 text-sm font-medium hover:bg-red-500/30 disabled:opacity-50 touch-manipulation"
      >
        {deleting ? "Deleting…" : "Delete nominee"}
      </button>
    </div>
  );
}
