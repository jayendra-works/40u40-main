import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ContentManager } from "./ContentManager";

export default async function AdminContentPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");

  const [faqs, agendaItems, speakers] = await Promise.all([
    prisma.faq.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.agendaItem.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.speaker.findMany({ orderBy: { sortOrder: "asc" } }),
  ]);

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <h1 className="font-display text-2xl font-bold text-white mb-6 md:mb-8">
        Content (CMS)
      </h1>
      <p className="text-neutral-400 mb-6 md:mb-8 text-sm md:text-base">
        Edit FAQs, agenda items, and the finalist directory. Mark the fixed Top Contenders from the same finalist records.
      </p>
      <ContentManager
        initialFaqs={faqs}
        initialAgenda={agendaItems}
        initialSpeakers={speakers}
      />
    </div>
  );
}
