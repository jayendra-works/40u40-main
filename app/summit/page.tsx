import { prisma } from "@/lib/prisma";
import { LeadershipSummitSection } from "@/components/sections/LeadershipSummitSection";
import { AgendaSection } from "@/components/sections/AgendaSection";
import { SummitVenueDateAnnouncementSection } from "@/components/sections/SummitVenueDateAnnouncementSection";
import { SummitPageHeader } from "@/components/sections/SummitPageHeader";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Leadership Summit & Awards 2026",
  description: "Join Asia Inc. 500 at T-HUB, Hyderabad on 20 September 2026 for the 40 Under 40 Leadership Summit & Awards.",
  alternates: { canonical: "/summit" },
};

/** Revalidate cached page every 60 seconds; admin content actions revalidate on change. */
export const revalidate = 60;

export default async function SummitPage() {
  const agendaItems = await prisma.agendaItem.findMany({
    orderBy: { sortOrder: "asc" },
    select: {
      id: true,
      time: true,
      sessionTitle: true,
      speaker: true,
      description: true,
    },
  });

  return (
    <div className="pt-[140px] pb-32 bg-[#131210] min-h-screen">
      <SummitPageHeader />
      <LeadershipSummitSection />
      <AgendaSection items={agendaItems} />
      <SummitVenueDateAnnouncementSection />
    </div>
  );
}
