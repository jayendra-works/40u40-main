import { NomineeStatus } from "@prisma/client";

export function StatusBadge({ status }: { status: NomineeStatus }) {
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
