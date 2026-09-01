import { prisma } from "@/lib/prisma";
import { getMagazineFeatureSetting, getVisibilitySetting } from "@/lib/site-settings";
import { JurySection } from "@/components/sections/JurySection";
import { MagazineFeatureSection } from "@/components/sections/MagazineFeatureSection";
import { PartnersSection } from "@/components/sections/PartnersSection";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Programme | India's 40 Under 40 2026",
  description: "Discover the jury, partners, and programme behind Asia Inc. 500's 40 Under 40 2026.",
};

/** Revalidate cached page every 60 seconds; admin actions revalidate on content change. */
export const revalidate = 60;

export default async function ProgramPage() {
  const [jury, sponsors, magazine, visibility] = await Promise.all([
    prisma.juryMember.findMany({
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
    }),
    prisma.sponsor.findMany({
      orderBy: [{ tier: "asc" }, { sortOrder: "asc" }],
      select: { id: true, name: true, tier: true, logo: true, website: true },
    }),
    getMagazineFeatureSetting(),
    getVisibilitySetting(),
  ]);

  return (
    <div className="pt-[140px] pb-32 bg-[#131210] min-h-screen">
      <JurySection jury={jury} />
      {visibility.showProgramBrandSections && (
        <MagazineFeatureSection
          title={magazine.title}
          body={magazine.body}
          ctaText={magazine.ctaText}
        />
      )}
      {visibility.showProgramBrandSections && <PartnersSection sponsors={sponsors} />}
    </div>
  );
}
