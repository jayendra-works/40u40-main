"use server";

import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  agendaItemSchema,
  contentIdSchema,
  faqSchema,
  parseAdminInput,
  speakerSchema,
} from "@/lib/validations/admin-content";

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as { role?: string }).role !== "admin") {
    throw new Error("Unauthorized");
  }
}

// FAQs
export async function createFaq(question: string, answer: string, sortOrder?: number) {
  await requireAdmin();
  const data = parseAdminInput(faqSchema, { question, answer, sortOrder });
  await prisma.faq.create({ data });
  revalidatePath("/admin/content");
  revalidatePath("/");
  revalidatePath("/program");
  revalidatePath("/faq");
}

export async function updateFaq(id: string, question: string, answer: string, sortOrder?: number) {
  await requireAdmin();
  const safeId = parseAdminInput(contentIdSchema, id);
  const data = parseAdminInput(faqSchema, { question, answer, sortOrder });
  await prisma.faq.update({
    where: { id: safeId },
    data,
  });
  revalidatePath("/admin/content");
  revalidatePath("/");
  revalidatePath("/program");
  revalidatePath("/faq");
}

export async function deleteFaq(id: string) {
  await requireAdmin();
  await prisma.faq.delete({ where: { id: parseAdminInput(contentIdSchema, id) } });
  revalidatePath("/admin/content");
  revalidatePath("/");
  revalidatePath("/program");
  revalidatePath("/faq");
}

// Agenda
export async function createAgendaItem(data: {
  time: string;
  sessionTitle: string;
  speaker?: string | null;
  description?: string | null;
  sortOrder?: number;
}) {
  await requireAdmin();
  const safeData = parseAdminInput(agendaItemSchema, data);
  await prisma.agendaItem.create({
    data: safeData,
  });
  revalidatePath("/admin/content");
  revalidatePath("/agenda");
  revalidatePath("/summit");
}

export async function updateAgendaItem(
  id: string,
  data: {
    time: string;
    sessionTitle: string;
    speaker?: string | null;
    description?: string | null;
    sortOrder?: number;
  }
) {
  await requireAdmin();
  const safeData = parseAdminInput(agendaItemSchema, data);
  await prisma.agendaItem.update({
    where: { id: parseAdminInput(contentIdSchema, id) },
    data: safeData,
  });
  revalidatePath("/admin/content");
  revalidatePath("/agenda");
  revalidatePath("/summit");
}

export async function deleteAgendaItem(id: string) {
  await requireAdmin();
  await prisma.agendaItem.delete({ where: { id: parseAdminInput(contentIdSchema, id) } });
  revalidatePath("/admin/content");
  revalidatePath("/agenda");
  revalidatePath("/summit");
}

// Speakers
export async function createSpeaker(data: {
  name: string;
  title: string;
  organization?: string | null;
  category?: string | null;
  age?: number | null;
  photo?: string | null;
  bio?: string | null;
  linkedinUrl?: string | null;
  instagramUrl?: string | null;
  websiteUrl?: string | null;
    profileUrl?: string | null;
    isTopContender?: boolean;
    sortOrder?: number;
}) {
  await requireAdmin();
  const safeData = parseAdminInput(speakerSchema, data);
  await prisma.speaker.create({
    data: safeData,
  });
  revalidatePath("/admin/content");
  revalidatePath("/");
  revalidatePath("/summit");
  revalidatePath("/contenders");
  revalidatePath("/finalists");
  revalidatePath("/finalists/[slug]", "page");
  revalidatePath("/program/finalists");
}

export async function updateSpeaker(
  id: string,
  data: {
    name: string;
    title: string;
    organization?: string | null;
    category?: string | null;
    age?: number | null;
    photo?: string | null;
    bio?: string | null;
    linkedinUrl?: string | null;
    instagramUrl?: string | null;
    websiteUrl?: string | null;
  profileUrl?: string | null;
  isTopContender?: boolean;
  sortOrder?: number;
  }
) {
  await requireAdmin();
  const safeData = parseAdminInput(speakerSchema, data);
  await prisma.speaker.update({
    where: { id: parseAdminInput(contentIdSchema, id) },
    data: safeData,
  });
  revalidatePath("/admin/content");
  revalidatePath("/");
  revalidatePath("/summit");
  revalidatePath("/contenders");
  revalidatePath("/finalists");
  revalidatePath("/finalists/[slug]", "page");
  revalidatePath("/program/finalists");
}

export async function deleteSpeaker(id: string) {
  await requireAdmin();
  await prisma.speaker.delete({ where: { id: parseAdminInput(contentIdSchema, id) } });
  revalidatePath("/admin/content");
  revalidatePath("/");
  revalidatePath("/summit");
  revalidatePath("/contenders");
  revalidatePath("/finalists");
  revalidatePath("/finalists/[slug]", "page");
  revalidatePath("/program/finalists");
}
