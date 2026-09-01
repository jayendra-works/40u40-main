import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NomineesTable } from "./NomineesTable";

export default async function AdminNomineesPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");

  const nominees = await prisma.nominee.findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true, name: true, email: true, company: true, industry: true, status: true, createdAt: true },
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <h1 className="font-display text-2xl font-bold text-white mb-6 md:mb-8">
        Nominees
      </h1>
      <NomineesTable nominees={nominees} />
    </div>
  );
}
