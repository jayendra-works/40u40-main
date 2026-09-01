import { prisma } from "@/lib/prisma";

export type FinalistProfile = {
  id: string;
  slug: string;
  name: string;
  title: string;
  organization: string | null;
  category: string | null;
  age: number | null;
  photo: string | null;
  bio: string | null;
  linkedinUrl: string | null;
  instagramUrl: string | null;
  websiteUrl: string | null;
  profileUrl: string | null;
};

export function finalistSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

/** Database-backed finalist data; the visual experience stays unchanged when this moves to a CMS. */
export async function getFinalists(): Promise<FinalistProfile[]> {
  const rows = await prisma.speaker.findMany({
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    select: {
      id: true,
      name: true,
      title: true,
      organization: true,
      category: true,
      age: true,
      photo: true,
      bio: true,
      linkedinUrl: true,
      instagramUrl: true,
      websiteUrl: true,
      profileUrl: true,
    },
  });

  return rows.map((row) => ({ ...row, slug: finalistSlug(row.name) }));
}

export async function getFinalistBySlug(slug: string) {
  const finalists = await getFinalists();
  return finalists.find((finalist) => finalist.slug === slug) ?? null;
}

export function getFinalistCategories(finalists: FinalistProfile[]): string[] {
  return Array.from(new Set(finalists.map((finalist) => finalist.category?.trim()).filter(Boolean)))
    .sort() as string[];
}
