"use server";

import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function admin() { const session = await getServerSession(authOptions); if ((session?.user as { role?: string } | undefined)?.role !== "admin") throw new Error("Unauthorized"); }

export async function saveNotice(data: { id?: string; title: string; eyebrow?: string; description?: string; image?: string; ctaLabel?: string; ctaUrl?: string; isActive: boolean }) {
  await admin();
  if (data.isActive) await prisma.noticeBoardItem.updateMany({ data: { isActive: false } });
  const values = { ...data, eyebrow: data.eyebrow || null, description: data.description || null, image: data.image || null, ctaLabel: data.ctaLabel || null, ctaUrl: data.ctaUrl || null };
  if (data.id) await prisma.noticeBoardItem.update({ where: { id: data.id }, data: values }); else await prisma.noticeBoardItem.create({ data: values });
  revalidatePath("/"); revalidatePath("/admin/notices");
}

export async function deleteNotice(id: string) { await admin(); await prisma.noticeBoardItem.delete({ where: { id } }); revalidatePath("/"); revalidatePath("/admin/notices"); }
