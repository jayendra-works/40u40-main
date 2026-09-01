import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NomineeStatus } from "@prisma/client";

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");

  const [total, byStatus, recent] = await Promise.all([
    prisma.nominee.count(),
    prisma.nominee.groupBy({ by: ["status"], _count: true }),
    prisma.nominee.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      select: { id: true, name: true, email: true, status: true, createdAt: true },
    }),
  ]);

  const statusCounts = Object.fromEntries(
    byStatus.map((s) => [s.status, s._count])
  ) as Record<NomineeStatus, number>;

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <h1 className="font-display text-2xl font-bold text-white mb-6 md:mb-8">
        Dashboard
      </h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mb-8 md:mb-10">
        <div className="rounded-xl border border-neutral-600 bg-secondary/20 p-6">
          <p className="text-neutral-400 text-sm">Total nominations</p>
          <p className="font-display text-3xl font-bold text-gold mt-1">{total}</p>
        </div>
        <div className="rounded-xl border border-neutral-600 bg-secondary/20 p-6">
          <p className="text-neutral-400 text-sm">Submitted</p>
          <p className="font-display text-2xl font-bold text-white mt-1">
            {statusCounts[NomineeStatus.submitted] ?? 0}
          </p>
        </div>
        <div className="rounded-xl border border-neutral-600 bg-secondary/20 p-6">
          <p className="text-neutral-400 text-sm">Shortlisted</p>
          <p className="font-display text-2xl font-bold text-white mt-1">
            {statusCounts[NomineeStatus.shortlisted] ?? 0}
          </p>
        </div>
        <div className="rounded-xl border border-neutral-600 bg-secondary/20 p-6">
          <p className="text-neutral-400 text-sm">Winners</p>
          <p className="font-display text-2xl font-bold text-white mt-1">
            {statusCounts[NomineeStatus.winner] ?? 0}
          </p>
        </div>
      </div>
      <section>
        <h2 className="font-display text-xl font-bold text-white mb-4">
          Recent nominations
        </h2>
        <div className="rounded-xl border border-neutral-600 overflow-hidden overflow-x-auto">
          <table className="w-full text-left min-w-[500px]">
            <thead className="bg-secondary/30">
              <tr>
                <th className="py-3 px-3 md:px-4 text-neutral-400 font-medium text-sm">Name</th>
                <th className="py-3 px-3 md:px-4 text-neutral-400 font-medium text-sm">Email</th>
                <th className="py-3 px-3 md:px-4 text-neutral-400 font-medium text-sm">Status</th>
                <th className="py-3 px-3 md:px-4 text-neutral-400 font-medium text-sm">Date</th>
                <th className="py-3 px-3 md:px-4 text-neutral-400 font-medium text-sm w-20"></th>
              </tr>
            </thead>
            <tbody>
              {recent.map((n) => (
                <tr key={n.id} className="border-t border-neutral-600">
                  <td className="py-3 px-3 md:px-4 text-sm">{n.name}</td>
                  <td className="py-3 px-3 md:px-4 text-neutral-400 text-sm truncate max-w-[120px] md:max-w-none">{n.email}</td>
                  <td className="py-3 px-3 md:px-4">
                    <StatusBadge status={n.status} />
                  </td>
                  <td className="py-3 px-3 md:px-4 text-neutral-400 text-sm">
                    {new Date(n.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-3 md:px-4">
                    <Link
                      href={`/admin/nominees/${n.id}`}
                      className="text-gold hover:underline text-sm"
                    >
                      Review
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {recent.length === 0 && (
            <p className="py-8 px-4 text-neutral-500 text-center">
              No nominations yet.
            </p>
          )}
        </div>
      </section>
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
  const label = status.replace(/_/g, " ");
  return (
    <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium capitalize ${styles[status]}`}>
      {label}
    </span>
  );
}
