import { prisma } from "@/lib/prisma";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { PartnerGrid } from "./PartnerGrid";

type SponsorRow = {
  id: string;
  name: string;
  tier: string;
  logo: string | null;
  website: string | null;
};

export async function PartnersSection({ sponsors: sponsorsProp }: { sponsors?: SponsorRow[] } = {}) {
  const sponsors =
    sponsorsProp ??
    (await prisma.sponsor.findMany({
      orderBy: [{ tier: "asc" }, { sortOrder: "asc" }],
      select: { id: true, name: true, tier: true, logo: true, website: true },
    }));
  return (
    <SectionWrapper
      id="partners"
      title="Partners"
      subtitle="In partnership with leading organizations across Asia."
    >
      <PartnerGrid sponsors={sponsors} />
    </SectionWrapper>
  );
}
