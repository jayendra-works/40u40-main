import { prisma } from "@/lib/prisma";

export async function JuryRanking({ juryMemberId }: { juryMemberId: string }) {
  const aggregated = await prisma.juryScore.groupBy({
    by: ["nomineeId"],
    _avg: { overallScore: true },
    _count: true,
  });
  const nomineeIds = aggregated.map((a) => a.nomineeId);
  const nominees = await prisma.nominee.findMany({
    where: { id: { in: nomineeIds } },
    select: { id: true, name: true, company: true },
  });
  const byId = Object.fromEntries(nominees.map((n) => [n.id, n]));
  const sorted = [...aggregated]
    .filter((a) => a._avg.overallScore != null)
    .sort((a, b) => (b._avg.overallScore ?? 0) - (a._avg.overallScore ?? 0));

  if (sorted.length === 0) {
    return (
      <div className="rounded-xl border border-neutral-600 bg-secondary/20 p-6">
        <h2 className="font-display text-xl font-bold text-white mb-4">Ranking</h2>
        <p className="text-neutral-500">No scores yet. Score nominees below.</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-neutral-600 bg-secondary/20 p-6">
      <h2 className="font-display text-xl font-bold text-white mb-4">Ranking (by average score)</h2>
      <table className="w-full text-left">
        <thead>
          <tr className="text-neutral-400 text-sm">
            <th className="py-2 pr-4">#</th>
            <th className="py-2 pr-4">Name</th>
            <th className="py-2 pr-4">Company</th>
            <th className="py-2">Avg score</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((row, i) => {
            const n = byId[row.nomineeId];
            if (!n) return null;
            return (
              <tr key={row.nomineeId} className="border-t border-neutral-600">
                <td className="py-2 pr-4 text-neutral-400">{i + 1}</td>
                <td className="py-2 pr-4 text-white">{n.name}</td>
                <td className="py-2 pr-4 text-neutral-400">{n.company}</td>
                <td className="py-2 text-gold">{row._avg.overallScore?.toFixed(1)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
