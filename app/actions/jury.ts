"use server";

import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export type SubmitScoreResult = { success: true } | { success: false; error: string };

const WEIGHTS = { innovation: 0.35, impact: 0.35, leadership: 0.3 };

export async function submitJuryScore(
  nomineeId: string,
  innovationScore: number,
  impactScore: number,
  leadershipScore: number,
  comments?: string
): Promise<SubmitScoreResult> {
  const session = await getServerSession(authOptions);
  const role = (session?.user as { role?: string })?.role;
  const juryMemberId = (session?.user as { juryMemberId?: string })?.juryMemberId;
  if (!session || role !== "jury" || !juryMemberId) {
    return { success: false, error: "Unauthorized" };
  }
  if (
    innovationScore < 1 || innovationScore > 10 ||
    impactScore < 1 || impactScore > 10 ||
    leadershipScore < 1 || leadershipScore > 10
  ) {
    return { success: false, error: "Scores must be between 1 and 10" };
  }
  const overall =
    innovationScore * WEIGHTS.innovation +
    impactScore * WEIGHTS.impact +
    leadershipScore * WEIGHTS.leadership;
  try {
    await prisma.juryScore.upsert({
      where: {
        nomineeId_juryMemberId: { nomineeId, juryMemberId },
      },
      create: {
        nomineeId,
        juryMemberId,
        innovationScore,
        impactScore,
        leadershipScore,
        overallScore: Math.round(overall * 10) / 10,
        comments: comments ?? null,
      },
      update: {
        innovationScore,
        impactScore,
        leadershipScore,
        overallScore: Math.round(overall * 10) / 10,
        comments: comments ?? null,
      },
    });
    revalidatePath("/jury/score");
    return { success: true };
  } catch (e) {
    console.error(e);
    return { success: false, error: "Failed to save score" };
  }
}
