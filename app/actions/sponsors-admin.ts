"use server";

import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { SponsorTier } from "@prisma/client";

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as { role?: string }).role !== "admin") {
    throw new Error("Unauthorized");
  }
}

export type SponsorPayload = {
  name: string;
  tier: SponsorTier;
  logo?: string | null;
  website?: string | null;
  description?: string | null;
  sortOrder?: number;
};

export async function createSponsor(data: SponsorPayload) {
  await requireAdmin();
  await prisma.sponsor.create({
    data: {
      ...data,
      sortOrder: data.sortOrder ?? 0,
    },
  });
  revalidatePath("/admin/sponsors");
  revalidatePath("/");
  revalidatePath("/program");
}

export async function updateSponsor(id: string, data: SponsorPayload) {
  await requireAdmin();
  await prisma.sponsor.update({
    where: { id },
    data: { ...data, sortOrder: data.sortOrder ?? 0 },
  });
  revalidatePath("/admin/sponsors");
  revalidatePath("/");
  revalidatePath("/program");
}

export async function deleteSponsor(id: string) {
  await requireAdmin();
  await prisma.sponsor.delete({ where: { id } });
  revalidatePath("/admin/sponsors");
  revalidatePath("/");
  revalidatePath("/program");
}
