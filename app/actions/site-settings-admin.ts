"use server";

import { getServerSession } from "next-auth";
import { revalidatePath, revalidateTag } from "next/cache";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { parseAdminInput, siteSettingSchema } from "@/lib/validations/admin-content";

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as { role?: string }).role !== "admin") {
    throw new Error("Unauthorized");
  }
}

export async function upsertSiteSetting(key: string, value: string) {
  await requireAdmin();
  const setting = parseAdminInput(siteSettingSchema, { key, value });
  await prisma.siteSetting.upsert({
    where: { key: setting.key },
    create: setting,
    update: { value: setting.value },
  });
  revalidateTag("site-settings", "max");
  revalidatePath("/");
  revalidatePath("/program");
  revalidatePath("/summit");
}
