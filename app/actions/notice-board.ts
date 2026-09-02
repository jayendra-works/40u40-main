"use server";

import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { contentIdSchema, noticeSchema, parseAdminInput } from "@/lib/validations/admin-content";

async function admin() { const session = await getServerSession(authOptions); if ((session?.user as { role?: string } | undefined)?.role !== "admin") throw new Error("Unauthorized"); }

export async function saveNotice(data: { id?: string; title: string; eyebrow?: string; description?: string; image?: string; ctaLabel?: string; ctaUrl?: string; isActive: boolean }) {
  await admin();
  const values = parseAdminInput(noticeSchema, data);
  if (values.isActive) await prisma.noticeBoardItem.updateMany({ data: { isActive: false } });
  const { id, ...notice } = values;
  if (id) await prisma.noticeBoardItem.update({ where: { id }, data: notice }); else await prisma.noticeBoardItem.create({ data: notice });
  revalidatePath("/"); revalidatePath("/admin/notices");
}

export async function deleteNotice(id: string) { await admin(); await prisma.noticeBoardItem.delete({ where: { id: parseAdminInput(contentIdSchema, id) } }); revalidatePath("/"); revalidatePath("/admin/notices"); }
