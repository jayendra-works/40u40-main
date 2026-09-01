import { prisma } from "@/lib/prisma";
import { LeadershipSummitSection } from "@/components/sections/LeadershipSummitSection";
import { AgendaSection } from "@/components/sections/AgendaSection";
import { SummitVenueDateAnnouncementSection } from "@/components/sections/SummitVenueDateAnnouncementSection";
import { SummitPageHeader } from "@/components/sections/SummitPageHeader";

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
