"use client";

import { motion } from "framer-motion";

export type AgendaItemDisplay = {
  id: string;
  time: string;
  sessionTitle: string;
  speaker: string | null;
  description: string | null;
};

const PREVIEW_COUNT = 5;

export function AgendaSection({ items = [] }: { items?: AgendaItemDisplay[] }) {
  const preview = items.slice(0, PREVIEW_COUNT);

  return (
    <section
      id="agenda"
      className="border-t border-[#EAE6E1]/5 bg-[#0F0E0C] py-24 md:py-32 px-6 md:px-24"
    >
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-16 md:mb-24">
          <div className="overflow-hidden mb-1">
            <h2 className="font-display text-5xl md:text-7xl lg:text-8xl leading-[0.9] tracking-tight uppercase">
              Summit
            </h2>
          </div>
          <div className="overflow-hidden mb-8">
            <h2 className="font-display text-5xl md:text-7xl lg:text-8xl leading-[0.9] tracking-tight uppercase italic text-[#C5B397]">
              Agenda
            </h2>
          </div>
          <p className="text-[10px] uppercase tracking-[0.2em] font-medium text-[#EAE6E1]/40 leading-loose">
            Leadership Summit & Awards 2026 — schedule at a glance.
          </p>
        </div>

        <div className="max-w-3xl">
          {preview.length === 0 ? (
            <p className="text-[11px] uppercase tracking-[0.15em] font-light text-[#EAE6E1]/40 py-8">
              Agenda will be published soon. Check back for the full schedule.
            </p>
          ) : (
            <div>
              {preview.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.07, ease: [0.16, 1, 0.3, 1] }}
                  className="grid grid-cols-1 sm:grid-cols-[180px_1fr] gap-4 border-b border-[#EAE6E1]/5 last:border-b-0 py-6"
                >
                  <span className="font-display italic text-[#C5B397] text-lg">
                    {item.time}
                  </span>
                  <div>
                    <h3 className="font-display text-xl italic text-[#EAE6E1]">
                      {item.sessionTitle}
                    </h3>
                    {item.speaker && (
                      <p className="text-[9px] uppercase tracking-[0.25em] font-medium text-[#C5B397]/70 mt-1">
                        {item.speaker}
                      </p>
                    )}
                    {item.description && (
                      <p className="text-[10px] uppercase tracking-[0.1em] font-light text-[#EAE6E1]/40 mt-2 leading-loose line-clamp-2">
                        {item.description}
                      </p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Always-visible View Full Agenda button */}
          <div className="mt-14">
            <a
              href="/agenda"
              className="group relative overflow-hidden inline-flex items-center gap-4 border border-[#EAE6E1]/30 px-12 py-5 text-[10px] uppercase tracking-[0.3em] font-medium transition-colors"
            >
              <span className="relative z-10 group-hover:text-[#131210] transition-colors duration-500 delay-100">
                View Full Agenda
              </span>
              <span className="relative z-10 group-hover:text-[#131210] transition-colors duration-500 delay-100" aria-hidden>
                →
              </span>
              <div className="absolute inset-0 bg-[#EAE6E1] transform scale-y-0 origin-bottom group-hover:scale-y-100 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
