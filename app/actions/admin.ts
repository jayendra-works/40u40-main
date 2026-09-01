"use server";

import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NomineeStatus } from "@prisma/client";

export type UpdateNomineeStatusResult = { success: true } | { success: false; error: string };

export async function updateNomineeStatus(
  nomineeId: string,
  status: NomineeStatus
): Promise<UpdateNomineeStatusResult> {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as { role?: string }).role !== "admin") {
    return { success: false, error: "Unauthorized" };
  }
  try {
    await prisma.nominee.update({
      where: { id: nomineeId },
      data: { status },
    });
    revalidatePath("/admin");
    revalidatePath("/admin/nominees");
    revalidatePath(`/admin/nominees/${nomineeId}`);
    revalidatePath("/winners");
    return { success: true };
  } catch (e) {
    console.error(e);
    return { success: false, error: "Failed to update" };
  }
}

export type DeleteNomineeResult = { success: true } | { success: false; error: string };

export async function deleteNominee(nomineeId: string): Promise<DeleteNomineeResult> {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as { role?: string }).role !== "admin") {
    return { success: false, error: "Unauthorized" };
  }

  try {
    await prisma.nominee.delete({ where: { id: nomineeId } });

    revalidatePath("/admin");
    revalidatePath("/admin/nominees");
    revalidatePath(`/admin/nominees/${nomineeId}`);
    revalidatePath("/winners");
    return { success: true };
  } catch (e) {
    console.error(e);
    return { success: false, error: "Failed to delete" };
  }
}

export type UpdateNomineeSortOrderResult = { success: true } | { success: false; error: string };

export async function updateNomineeSortOrder(
  nomineeId: string,
  sortOrder: number
): Promise<UpdateNomineeSortOrderResult> {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as { role?: string }).role !== "admin") {
    return { success: false, error: "Unauthorized" };
  }

  const normalized = Number.isFinite(sortOrder) ? Math.trunc(sortOrder) : 0;

  try {
    await prisma.nominee.update({
      where: { id: nomineeId },
      data: { sortOrder: normalized },
    });
    revalidatePath("/admin");
    revalidatePath("/admin/nominees");
    revalidatePath(`/admin/nominees/${nomineeId}`);
    revalidatePath("/program");
    revalidatePath("/program/finalists");
    revalidatePath("/winners");
    return { success: true };
  } catch (e) {
    console.error(e);
    return { success: false, error: "Failed to update order" };
  }
}
