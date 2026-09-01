import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { JuryList } from "./JuryList";

export default async function AdminJuryPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");

  const jury = await prisma.juryMember.findMany({
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <h1 className="font-display text-2xl font-bold text-white mb-6 md:mb-8">
        Jury
      </h1>
      <JuryList initialJury={jury} />
    </div>
  );
}
