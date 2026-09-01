"use server";

import { getServerSession } from "next-auth";
import { revalidatePath, revalidateTag } from "next/cache";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as { role?: string }).role !== "admin") {
    throw new Error("Unauthorized");
  }
}

export async function upsertSiteSetting(key: string, value: string) {
  await requireAdmin();
  await prisma.siteSetting.upsert({
    where: { key },
    create: { key, value },
    update: { value },
  });
  revalidateTag("site-settings");
  revalidatePath("/");
  revalidatePath("/program");
  revalidatePath("/summit");
}
