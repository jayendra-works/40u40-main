import { prisma } from "@/lib/prisma";
import { SpeakersSection } from "@/components/sections/SpeakersSection";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Top Contenders | India's 40 Under 40 2026",
  description: "Explore the top contenders for Asia Inc. 500's 40 Under 40 Summit & Awards 2026.",
  alternates: { canonical: "/contenders" },
};

export const revalidate = 300;

export default async function ContendersPage() {
  const speakers = await prisma.speaker.findMany({
    where: { isTopContender: true },
    orderBy: { sortOrder: "asc" },
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

  return (
    <div className="pt-[140px] pb-32 bg-[#131210] min-h-screen">
      {/* Page header */}
      <div className="px-6 md:px-24 mx-auto max-w-7xl mb-16 md:mb-24">
        <div className="overflow-hidden mb-2">
          <h1 className="font-display text-6xl md:text-8xl lg:text-[9rem] leading-[0.85] tracking-tight uppercase">
            The Top
          </h1>
        </div>
        <div className="overflow-hidden mb-10">
          <h1 className="font-display text-6xl md:text-8xl lg:text-[9rem] leading-[0.85] tracking-tight uppercase italic text-[#C5B397]">
            Contenders
          </h1>
        </div>
        <p className="text-[11px] uppercase tracking-[0.2em] font-light text-[#EAE6E1]/50 max-w-xl leading-loose">
          Leaders taking the stage at 40 Under 40 by Asia Inc. 500
        </p>
      </div>

      <SpeakersSection speakers={speakers} layout="grid" showSectionHeader={false} />
    </div>
  );
}
