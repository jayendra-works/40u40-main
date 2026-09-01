import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { JuryScoringList } from "../JuryScoringList";
import { JuryRanking } from "../JuryRanking";

export default async function JuryDashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");
  const role = (session.user as { role?: string }).role;
  const juryMemberId = (session.user as { juryMemberId?: string }).juryMemberId;
  if (role !== "jury" || !juryMemberId) {
    redirect("/admin");
  }

  const [nominees, scores, juryMember] = await Promise.all([
    prisma.nominee.findMany({
      where: { status: { in: ["shortlisted", "finalist"] } },
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      select: { id: true, name: true, company: true, designation: true, achievements: true },
    }),
    prisma.juryScore.findMany({
      where: { juryMemberId },
      select: { nomineeId: true, innovationScore: true, impactScore: true, leadershipScore: true, overallScore: true, comments: true },
    }),
    prisma.juryMember.findUnique({ where: { id: juryMemberId }, select: { name: true } }),
  ]);

  const scoresByNominee = Object.fromEntries(scores.map((s) => [s.nomineeId, s]));

  return (
    <div className="p-8">
      <h1 className="font-display text-2xl font-bold text-white mb-2">
        Jury Evaluation
      </h1>
      <p className="text-neutral-400 mb-8">Logged in as {juryMember?.name ?? "Jury"}</p>
      <JuryRanking juryMemberId={juryMemberId} />
      <h2 className="font-display text-xl font-bold text-white mt-10 mb-4">
        Score nominees
      </h2>
      <JuryScoringList nominees={nominees} scoresByNominee={scoresByNominee} />
    </div>
  );
}
