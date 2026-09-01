import { prisma } from "@/lib/prisma";
import { getAllSiteSettingsForHome } from "@/lib/site-settings";
import { HeroSection } from "@/components/sections/HeroSection";
import { StatSection } from "@/components/sections/StatSection";
import { AboutSection } from "@/components/sections/AboutSection";
import { SpeakersSection } from "@/components/sections/SpeakersSection";
import { WhoCanApplyCategoriesMarquee } from "@/components/sections/WhoCanApplyCategoriesMarquee";
import { HomeSelectionProcessSection } from "@/components/sections/HomeSelectionProcessSection";
import { WhoCanApplySection } from "@/components/sections/WhoCanApplySection";
import { WhyRecognitionSection } from "@/components/sections/WhyRecognitionSection";
import { NominationCTASection } from "@/components/sections/NominationCTASection";
import { NoticeBoard } from "@/components/sections/NoticeBoard";

/** Revalidate cached page every 60 seconds; admin actions revalidate on content change. */
export const revalidate = 60;
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [nominationCount, settings, speakers, notice] = await Promise.all([
    prisma.nominee.count(),
    getAllSiteSettingsForHome(),
    prisma.speaker.findMany({
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
    }),
    prisma.noticeBoardItem.findFirst({ where: { isActive: true }, orderBy: [{ sortOrder: "asc" }, { updatedAt: "desc" }] }),
  ]);

  const nominationCloseDate = settings.nominationCloseDate ?? process.env.NEXT_NOMINATION_CLOSE_DATE ?? undefined;

  return (
    <>
      <NoticeBoard notice={notice} />
      <HeroSection
        countdownDate={nominationCloseDate}
        headline={settings.hero.headline}
        accentText={settings.hero.accentText}
        subheadline={settings.hero.subheadline}
      />
      <AboutSection
        title={settings.about.title}
        paragraph1={settings.about.paragraph1}
        paragraph2={settings.about.paragraph2}
        highlightedText={settings.about.highlightedText}
      />
      <StatSection
        nominationCount={nominationCount}
        useNominationCount={settings.stats.useNominationCount}
        statItems={settings.stats.items}
      />
      <SpeakersSection
        speakers={speakers}
        layout="editorial"
        showEditorialSeeMore
      />
      <WhoCanApplyCategoriesMarquee words={settings.marquee.words} />
      <HomeSelectionProcessSection />
      <WhyRecognitionSection
        title={settings.whyRecognition.title}
        subtitle={settings.whyRecognition.subtitle}
        cards={settings.whyRecognition.cards}
      />
      <WhoCanApplySection />
      <NominationCTASection
        headline={settings.nominationCta.headline}
        subheadline={settings.nominationCta.subheadline}
      />
    </>
  );
}
