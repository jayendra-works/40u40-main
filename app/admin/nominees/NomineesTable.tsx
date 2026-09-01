"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { NomineeStatus } from "@prisma/client";
import { NomineeDeleteButton } from "./NomineeDeleteButton";

type NomineeRow = {
  id: string;
  name: string;
  email: string;
  company: string;
  industry: string;
  status: NomineeStatus;
  createdAt: Date;
};

export function NomineesTable({ nominees }: { nominees: NomineeRow[] }) {
  const [selectedIds, setSelectedIds] = useState<Record<string, boolean>>({});

  const allIds = useMemo(() => nominees.map((n) => n.id), [nominees]);
  const selectedList = useMemo(() => allIds.filter((id) => selectedIds[id]), [allIds, selectedIds]);
  const allSelected = nominees.length > 0 && selectedList.length === nominees.length;

  function toggleAll() {
    if (allSelected) {
      setSelectedIds({});
      return;
    }
    const next: Record<string, boolean> = {};
    allIds.forEach((id) => { next[id] = true; });
    setSelectedIds(next);
  }

  function toggleOne(id: string) {
    setSelectedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  function downloadSelected() {
    if (selectedList.length === 0) return;
    const ids = encodeURIComponent(selectedList.join(","));
    window.location.href = `/admin/nominees/export?ids=${ids}`;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={downloadSelected}
          disabled={selectedList.length === 0}
          className="rounded-lg bg-gold text-primary px-4 py-2 text-sm font-medium hover:bg-gold/90 disabled:opacity-50"
        >
          Download selected ({selectedList.length})
        </button>
        <button
          type="button"
          onClick={() => setSelectedIds({})}
          disabled={selectedList.length === 0}
          className="rounded-lg border border-neutral-600 px-4 py-2 text-sm text-neutral-300 hover:bg-neutral-600/20 disabled:opacity-50"
        >
          Clear selection
        </button>
      </div>

      <div className="rounded-xl border border-neutral-600 overflow-hidden overflow-x-auto">
        <table className="w-full text-left min-w-[760px]">
          <thead className="bg-secondary/30">
            <tr>
              <th className="py-3 px-3 md:px-4 text-neutral-400 font-medium text-sm w-10">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={toggleAll}
                  aria-label="Select all"
                  className="rounded border-neutral-600"
                />
              </th>
              <th className="py-3 px-3 md:px-4 text-neutral-400 font-medium text-sm">Name</th>
              <th className="py-3 px-3 md:px-4 text-neutral-400 font-medium text-sm">Email</th>
              <th className="py-3 px-3 md:px-4 text-neutral-400 font-medium text-sm">Company</th>
              <th className="py-3 px-3 md:px-4 text-neutral-400 font-medium text-sm">Industry</th>
              <th className="py-3 px-3 md:px-4 text-neutral-400 font-medium text-sm">Status</th>
              <th className="py-3 px-3 md:px-4 text-neutral-400 font-medium text-sm">Date</th>
              <th className="py-3 px-3 md:px-4 text-neutral-400 font-medium text-sm w-40"></th>
            </tr>
          </thead>
          <tbody>
            {nominees.map((n) => (
              <tr key={n.id} className="border-t border-neutral-600">
                <td className="py-3 px-3 md:px-4">
                  <input
                    type="checkbox"
                    checked={!!selectedIds[n.id]}
                    onChange={() => toggleOne(n.id)}
                    aria-label={`Select ${n.name}`}
                    className="rounded border-neutral-600"
                  />
                </td>
                <td className="py-3 px-3 md:px-4 text-sm">{n.name}</td>
                <td className="py-3 px-3 md:px-4 text-neutral-400 text-sm truncate max-w-[180px] md:max-w-none">
                  {n.email}
                </td>
                <td className="py-3 px-3 md:px-4 text-neutral-400 text-sm truncate max-w-[140px] md:max-w-none">
                  {n.company}
                </td>
                <td className="py-3 px-3 md:px-4 text-neutral-400 text-sm">{n.industry}</td>
                <td className="py-3 px-3 md:px-4">
                  <StatusBadge status={n.status} />
                </td>
                <td className="py-3 px-3 md:px-4 text-neutral-400 text-sm">
                  {new Date(n.createdAt).toLocaleDateString()}
                </td>
                <td className="py-3 px-3 md:px-4">
                  <div className="flex items-start gap-3">
                    <Link href={`/admin/nominees/${n.id}`} className="text-gold hover:underline text-sm">
                      Review
                    </Link>
                    <NomineeDeleteButton nomineeId={n.id} nomineeName={n.name} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {nominees.length === 0 && (
          <p className="py-12 text-center text-neutral-500">No nominees yet.</p>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: NomineeStatus }) {
  const styles: Record<NomineeStatus, string> = {
    [NomineeStatus.submitted]: "bg-neutral-600 text-neutral-300",
    [NomineeStatus.under_review]: "bg-blue-500/20 text-blue-300",
    [NomineeStatus.shortlisted]: "bg-gold/20 text-gold",
    [NomineeStatus.finalist]: "bg-gold/30 text-gold",
    [NomineeStatus.winner]: "bg-gold text-primary",
  };
  return (
    <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium capitalize ${styles[status]}`}>
      {status.replace(/_/g, " ")}
    </span>
  );
}

