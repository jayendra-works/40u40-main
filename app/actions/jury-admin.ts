"use server";

import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as { role?: string }).role !== "admin") {
    throw new Error("Unauthorized");
  }
}

export type JuryMemberPayload = {
  name: string;
  title: string;
  organization: string;
  category?: string | null;
  age?: number | null;
  photo?: string | null;
  bio?: string | null;
  url?: string | null;
  linkedinUrl?: string | null;
  instagramUrl?: string | null;
  websiteUrl?: string | null;
  sortOrder?: number;
};

export async function createJuryMember(data: JuryMemberPayload) {
  await requireAdmin();
  await prisma.juryMember.create({
    data: {
      ...data,
      sortOrder: data.sortOrder ?? 0,
    },
  });
  revalidatePath("/admin/jury");
  revalidatePath("/");
  revalidatePath("/program");
  revalidatePath("/jury");
}

export async function updateJuryMember(id: string, data: JuryMemberPayload) {
  await requireAdmin();
  await prisma.juryMember.update({
    where: { id },
    data: {
      ...data,
      sortOrder: data.sortOrder ?? 0,
    },
  });
  revalidatePath("/admin/jury");
  revalidatePath("/");
  revalidatePath("/program");
  revalidatePath("/jury");
}

export async function deleteJuryMember(id: string) {
  await requireAdmin();
  await prisma.juryMember.delete({ where: { id } });
  revalidatePath("/admin/jury");
  revalidatePath("/");
  revalidatePath("/program");
  revalidatePath("/jury");
}
