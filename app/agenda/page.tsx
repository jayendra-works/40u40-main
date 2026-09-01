import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Summit Agenda | 40 Under 40 2026",
  description: "View the Leadership Summit & Awards 2026 programme, schedule, and sessions.",
};

export const revalidate = 60;

export default async function AgendaPage() {
  const items = await prisma.agendaItem.findMany({
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div className="pt-[140px] pb-32 bg-[#131210] min-h-screen">
      {/* Page header */}
      <div className="px-6 md:px-24 mx-auto max-w-5xl mb-20 md:mb-28">
        <div className="overflow-hidden mb-1">
          <h1 className="font-display text-6xl md:text-8xl lg:text-[9rem] leading-[0.85] tracking-tight uppercase">
            Full
          </h1>
        </div>
        <div className="overflow-hidden mb-10">
          <h1 className="font-display text-6xl md:text-8xl lg:text-[9rem] leading-[0.85] tracking-tight uppercase italic text-[#C5B397]">
            Agenda
          </h1>
        </div>
        <p className="text-[11px] uppercase tracking-[0.2em] font-light text-[#EAE6E1]/50 max-w-xl leading-loose">
          Leadership Summit & Awards 2026 — complete schedule.
        </p>
      </div>

      <div className="px-6 md:px-24 mx-auto max-w-5xl">
        {items.length === 0 ? (
          <p className="text-[11px] uppercase tracking-[0.15em] font-light text-[#EAE6E1]/40 py-12">
            Agenda will be published soon. Check back for the full schedule.
          </p>
        ) : (
          <div className="max-w-3xl">
            {items.map((item) => (
              <div
                key={item.id}
                className="grid grid-cols-1 sm:grid-cols-[180px_1fr] gap-4 border-b border-[#EAE6E1]/5 last:border-b-0 py-8"
              >
                <span className="font-display italic text-[#C5B397] text-lg">
                  {item.time}
                </span>
                <div>
                  <h3 className="font-display text-xl md:text-2xl italic text-[#EAE6E1]">
                    {item.sessionTitle}
                  </h3>
                  {item.speaker && (
                    <p className="text-[9px] uppercase tracking-[0.25em] font-medium text-[#C5B397]/70 mt-2">
                      {item.speaker}
                    </p>
                  )}
                  {item.description && (
                    <p className="text-[10px] uppercase tracking-[0.1em] font-light text-[#EAE6E1]/40 mt-3 leading-loose">
                      {item.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-16">
          <a
            href="/summit"
            className="text-[9px] uppercase tracking-[0.3em] font-medium text-[#EAE6E1]/40 hover:text-[#C5B397] transition-colors border-b border-[#EAE6E1]/20 pb-1 hover:border-[#C5B397]/40"
          >
            ← Back to Summit
          </a>
        </div>
      </div>
    </div>
  );
}
