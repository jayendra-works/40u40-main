import { prisma } from "@/lib/prisma";
import { JurySection } from "@/components/sections/JurySection";

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
