"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowUpRight } from "lucide-react";
import { PhotoCategoryAgeOverlays } from "@/components/ui/PhotoCategoryAgeOverlays";

const PLACEHOLDER_AVATAR =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23C5B397'%3E%3Cpath d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'/%3E%3C/svg%3E";

export type JuryMemberDisplay = {
  id: string;
  name: string;
  title: string;
  organization: string;
  category: string | null;
  age: number | null;
  photo?: string | null;
  bio?: string | null;
  url?: string | null;
  linkedinUrl?: string | null;
  instagramUrl?: string | null;
  websiteUrl?: string | null;
};

const PLACEHOLDER_COUNT = 4;

export function JurySection({ jury = [] }: { jury?: JuryMemberDisplay[] }) {
  const [selected, setSelected] = useState<JuryMemberDisplay | null>(null);
  const hasJury = jury.length > 0;
  const displayItems: (JuryMemberDisplay | null)[] = hasJury
    ? jury
    : Array.from({ length: PLACEHOLDER_COUNT }, () => null);

  useEffect(() => {
    document.body.style.overflow = selected ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [selected]);

  return (
    <>
      <section
        id="jury"
        className="border-t border-[#EAE6E1]/5 py-24 md:py-32 bg-[#131210] relative overflow-x-hidden selection:bg-[#EAE6E1] selection:text-[#131210]"
      >
        {/* Page header */}
        <div className="px-6 md:px-24 mb-16 md:mb-24 max-w-7xl mx-auto">
          <div className="overflow-hidden mb-3">
            <motion.h2
              initial={{ y: "100%", opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="font-display text-6xl md:text-8xl lg:text-[9rem] leading-[0.9] tracking-tighter uppercase"
            >
              Our Esteemed
            </motion.h2>
          </div>
          <div className="overflow-hidden">
            <motion.span
              initial={{ y: "100%", opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="block font-display text-6xl md:text-8xl lg:text-[9rem] leading-[0.9] tracking-tighter uppercase italic text-[#C5B397]"
            >
              Jury
            </motion.span>
          </div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="mt-10 text-[8px] uppercase tracking-[0.2em] font-medium text-[#EAE6E1]/40 max-w-lg leading-loose"
          >
            A distinguished panel of influential leaders, visionaries, and pioneers across industries evaluating the class of the 2026 Edition.
          </motion.p>
        </div>

        {/* Grid */}
        <div className="px-6 md:px-24 max-w-7xl mx-auto">
          {!hasJury && (
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-[9px] uppercase tracking-[0.3em] text-[#EAE6E1]/30 mb-16"
            >
              More jury members to be announced
            </motion.p>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-24">
            {displayItems.map((person, i) => (
              <motion.article
                key={person?.id ?? `placeholder-${i}`}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.7, delay: (i % 8) * 0.07, ease: [0.16, 1, 0.3, 1] }}
                className={`group/card flex flex-col ${person ? "cursor-pointer" : "opacity-60"}`}
                onClick={() => person && setSelected(person)}
              >
                {/* Image — category + age on hover (same pattern as Top Contenders) */}
                <div className="group/jury relative aspect-[3/4] mb-7 overflow-hidden bg-[#0F0E0C]">
                  {person?.photo ? (
                    <Image
                      src={person.photo}
                      alt={person.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover grayscale opacity-75 transition-all duration-[2000ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/jury:scale-105 group-hover/jury:grayscale-0 group-hover/jury:opacity-100"
                    />
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={PLACEHOLDER_AVATAR}
                      alt=""
                      className="w-full h-full object-cover opacity-20"
                    />
                  )}
                  {person ? (
                    <PhotoCategoryAgeOverlays
                      category={person.category}
                      age={person.age}
                      photoGroup="jury"
                    />
                  ) : null}
                  <div className="absolute inset-0 bg-[#C5B397] opacity-0 mix-blend-color transition-opacity duration-1000 group-hover/jury:opacity-[0.06]" />
                </div>

                {/* Meta */}
                <h3 className="font-display text-2xl text-[#EAE6E1] mb-1 italic transition-colors duration-500 group-hover/card:text-[#C5B397]">
                  {person?.name ?? "To be announced"}
                </h3>
                <p className="text-[8px] uppercase tracking-[0.2em] font-medium text-[#EAE6E1]/40 mb-1">
                  {person?.title ?? "Jury Member"}
                </p>

                {/* Animated underline */}
                <div className="mt-5 h-[1px] w-8 bg-[#EAE6E1]/15 transition-all duration-[1500ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/card:w-full group-hover/card:bg-[#C5B397]/40" />
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* ── Luxury Modal ──────────────────────────────────────────── */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-16 bg-[#0A0908]/85 backdrop-blur-xl"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.97 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="bg-[#0F0E0C] border border-[#EAE6E1]/10 w-full max-w-5xl max-h-[92vh] overflow-y-auto flex flex-col md:flex-row shadow-2xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close */}
              <button
                onClick={() => setSelected(null)}
                className="absolute top-5 right-5 z-20 w-9 h-9 flex items-center justify-center border border-[#EAE6E1]/10 text-[#EAE6E1]/40 hover:text-[#EAE6E1] hover:border-[#EAE6E1]/30 transition-colors"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Image panel */}
              <div className="w-full md:w-5/12 h-[50vw] md:h-auto min-h-[300px] relative overflow-hidden flex-shrink-0">
                {selected.photo ? (
                  <Image
                    src={selected.photo}
                    alt={selected.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 40vw"
                  />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={PLACEHOLDER_AVATAR} alt="" className="w-full h-full object-cover opacity-20" />
                )}
                <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-t from-[#0F0E0C] via-transparent to-transparent md:bg-gradient-to-r" />
                <PhotoCategoryAgeOverlays
                  category={selected.category}
                  age={selected.age}
                  revealOnHover={false}
                  photoGroup="jury"
                />
              </div>

              {/* Content panel */}
              <div className="flex w-full flex-col justify-center p-8 md:w-7/12 md:p-14">
                {(selected.category?.trim() || selected.age != null) && (
                  <div className="mb-5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[8px] font-medium uppercase tracking-[0.32em] text-[#C5B397]">
                    {selected.category?.trim() ? <span>{selected.category.trim()}</span> : null}
                    {selected.category?.trim() && selected.age != null ? (
                      <span className="text-[#EAE6E1]/25" aria-hidden>
                        ·
                      </span>
                    ) : null}
                    {selected.age != null && Number.isFinite(selected.age) ? (
                      <span className="font-display text-lg font-light normal-case tracking-normal text-[#C5B397]">
                        {selected.age}
                      </span>
                    ) : null}
                  </div>
                )}

                <h2 className="font-display mb-3 text-4xl font-normal italic leading-[1.05] text-[#C5B397] md:text-5xl lg:text-6xl">
                  {selected.name}
                </h2>

                <p className="text-[9px] font-medium uppercase tracking-[0.22em] text-[#EAE6E1]/45">{selected.title}</p>

                {selected.organization.trim() ? (
                  <p className="mt-3 max-w-xl text-[9px] font-medium uppercase leading-relaxed tracking-[0.18em] text-[#EAE6E1]/45">
                    {selected.organization}
                  </p>
                ) : null}

                <div className="my-10 h-[1px] w-12 bg-[#C5B397]/40" />

                {/* Bio */}
                {selected.bio && (
                  <div className="font-display text-xl text-[#EAE6E1]/70 leading-relaxed max-h-[35vh] overflow-y-auto pr-4 custom-scrollbar">
                    {selected.bio.split('\n').map((para, idx) => (
                      <p key={idx} className="mb-4">{para}</p>
                    ))}
                  </div>
                )}

                {/* External links */}
                {(selected.url || selected.linkedinUrl) && (
                  <div className="mt-8 flex items-center gap-6">
                    {selected.url && (
                      <a
                        href={selected.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group inline-flex items-center gap-2 text-[9px] uppercase tracking-[0.3em] font-medium text-[#EAE6E1]/40 hover:text-[#C5B397] transition-colors"
                      >
                        View Profile
                        <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                      </a>
                    )}
                    {selected.linkedinUrl && (
                      <a
                        href={selected.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group inline-flex items-center gap-2 text-[9px] uppercase tracking-[0.3em] font-medium text-[#EAE6E1]/40 hover:text-[#C5B397] transition-colors"
                      >
                        LinkedIn
                        <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                      </a>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
