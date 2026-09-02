"use server";

import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { SponsorTier } from "@prisma/client";
import { contentIdSchema, parseAdminInput, sponsorSchema } from "@/lib/validations/admin-content";

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
  const safeData = parseAdminInput(sponsorSchema, data);
  await prisma.sponsor.create({
    data: safeData,
  });
  revalidatePath("/admin/sponsors");
  revalidatePath("/");
  revalidatePath("/program");
}

export async function updateSponsor(id: string, data: SponsorPayload) {
  await requireAdmin();
  const safeData = parseAdminInput(sponsorSchema, data);
  await prisma.sponsor.update({
    where: { id: parseAdminInput(contentIdSchema, id) },
    data: safeData,
  });
  revalidatePath("/admin/sponsors");
  revalidatePath("/");
  revalidatePath("/program");
}

export async function deleteSponsor(id: string) {
  await requireAdmin();
  await prisma.sponsor.delete({ where: { id: parseAdminInput(contentIdSchema, id) } });
  revalidatePath("/admin/sponsors");
  revalidatePath("/");
  revalidatePath("/program");
}
