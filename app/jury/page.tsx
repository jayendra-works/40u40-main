import { prisma } from "@/lib/prisma";
import { JurySection } from "@/components/sections/JurySection";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Jury | India's 40 Under 40 2026",
  description: "Meet the independent jury guiding Asia Inc. 500's 40 Under 40 selection process.",
  alternates: { canonical: "/jury" },
};

export const revalidate = 300;

export default async function JuryPage() {
  const jury = await prisma.juryMember.findMany({
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
      url: true,
      linkedinUrl: true,
      instagramUrl: true,
      websiteUrl: true,
    },
  });

  return (
    <div className="pt-[140px] pb-32 bg-[#131210] min-h-screen">
      <JurySection jury={jury} />
    </div>
  );
}
