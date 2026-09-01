import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { SponsorsList } from "./SponsorsList";

export default async function AdminSponsorsPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");

  const sponsors = await prisma.sponsor.findMany({
    orderBy: [{ tier: "asc" }, { sortOrder: "asc" }],
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <h1 className="font-display text-2xl font-bold text-white mb-6 md:mb-8">
        Sponsors / Partners
      </h1>
      <SponsorsList initialSponsors={sponsors} />
    </div>
  );
}
