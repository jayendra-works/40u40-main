"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { ProfileLinks } from "@/components/ui/ProfileLinks";
import { PhotoCategoryAgeOverlays } from "@/components/ui/PhotoCategoryAgeOverlays";
import { cn } from "@/lib/utils";

const PLACEHOLDER_AVATAR =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23C5B397'%3E%3Cpath d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'/%3E%3C/svg%3E";

export type SpeakerDisplay = {
  id: string;
  name: string;
  title: string;
  organization: string | null;
  category: string | null;
  age: number | null;
  photo: string | null;
  bio: string | null;
  linkedinUrl?: string | null;
  instagramUrl?: string | null;
  websiteUrl?: string | null;
  profileUrl?: string | null;
};

function excerptBio(text: string, maxLen: number): string {
  const t = text.replace(/\s+/g, " ").trim();
  if (t.length <= maxLen) return t;
  const cut = t.slice(0, maxLen);
  const lastSpace = cut.lastIndexOf(" ");
  const base = lastSpace > Math.min(48, maxLen * 0.6) ? cut.slice(0, lastSpace) : cut;
  return `${base.trimEnd()}…`;
}

function ContenderBelowPhoto({
  name,
  title,
  organization,
  nameClassName,
}: {
  name: string;
  title: string;
  organization: string | null | undefined;
  nameClassName?: string;
}) {
  return (
    <div className="flex flex-col">
      <h3
        className={cn(
          "font-display font-normal leading-[1.1] text-[#C5B397]",
          nameClassName ?? "text-2xl md:text-3xl",
        )}
      >
        {name}
      </h3>
      <p className="mt-2 text-[8px] font-medium uppercase leading-relaxed tracking-[0.22em] text-[#EAE6E1]/45 md:text-[9px]">
        {title}
      </p>
      {organization?.trim() ? (
        <p className="mt-2 max-w-xl text-[8px] font-medium uppercase leading-relaxed tracking-[0.18em] text-[#EAE6E1]/45 md:text-[9px]">
          {organization.trim()}
        </p>
      ) : null}
    </div>
  );
}

export function SpeakersSection({
  speakers = [],
  layout = "grid",
  showEditorialSeeMore = false,
  showSectionHeader = true,
  balancedGrid = false,
}: {
  speakers?: SpeakerDisplay[];
  layout?: "grid" | "editorial";
  /** When `layout` is editorial, show a bottom CTA linking to the full contenders list. */
  showEditorialSeeMore?: boolean;
  /** When false, suppresses the built-in section title/subtitle (use when the page has its own header). */
  showSectionHeader?: boolean;
  /** Use an even card grid for large directories, rather than the editorial last-two layout. */
  balancedGrid?: boolean;
}) {
  const [selected, setSelected] = useState<SpeakerDisplay | null>(null);

  useEffect(() => {
    document.body.style.overflow = selected ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [selected]);

  const emptyMessage = (
    <p className="py-12 text-center text-[11px] font-light uppercase tracking-[0.15em] text-[#EAE6E1]/40">
      Contenders will be announced soon.
    </p>
  );

  if (speakers.length === 0) {
    if (layout === "editorial") {
      return (
        <section
          id="contenders"
          className="border-t border-[#EAE6E1]/5 bg-[#131210] py-24 md:py-32"
        >
          <div className="mx-auto max-w-7xl px-6 md:px-24">
            <div className="mb-16 flex flex-col justify-between gap-6 md:mb-24 md:flex-row md:items-end">
              <span className="text-[16px] font-medium uppercase tracking-[0.3em] text-[#EAE6E1]/40">
                The Top Contenders
              </span>
              <Link
                href="/finalists"
                className="self-start text-[16px] font-medium uppercase tracking-[0.3em] text-[#EAE6E1] transition-colors hover:text-[#C5B397] md:self-auto"
              >
                View all finalists
              </Link>
            </div>
            {emptyMessage}
          </div>
        </section>
      );
    }
    return (
      <SectionWrapper
        id="contenders"
        title={showSectionHeader ? "The Top Contenders" : undefined}
        subtitle={showSectionHeader ? "Leaders taking the stage at 40 Under 40 by Asia Inc. 500" : undefined}
      >
        {emptyMessage}
      </SectionWrapper>
    );
  }

  if (layout === "editorial") {
    return (
      <>
        <section
          id="contenders"
          className="border-t border-[#EAE6E1]/5 bg-[#131210] py-24 md:py-32"
        >
          <div className="mx-auto max-w-7xl px-6 md:px-24">
            <div className="mb-16 flex flex-col justify-between gap-6 md:mb-24 md:flex-row md:items-end">
              <span className="text-[16px] font-medium uppercase tracking-[0.3em] text-[#EAE6E1]/40">
                The Top Contenders
              </span>
              <Link
                href="/finalists"
                className="self-start text-[16px] font-medium uppercase tracking-[0.3em] text-[#EAE6E1] transition-colors hover:text-[#C5B397] md:self-auto"
              >
                View all finalists
              </Link>
            </div>

            <div className="flex flex-col">
              {speakers.map((speaker, i) => {
                const indexLabel = String(i + 1).padStart(2, "0");
                const bioExcerpt = speaker.bio?.trim() ? excerptBio(speaker.bio.trim(), 420) : "";
                const imageColStart = i % 2 === 0 ? "md:col-start-8" : "md:col-start-1";
                const textColStart = i % 2 === 0 ? "md:col-start-1" : "md:col-start-7";
                return (
                  <article
                    key={speaker.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => setSelected(speaker)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setSelected(speaker);
                      }
                    }}
                    className="grid cursor-pointer grid-cols-1 gap-10 border-t border-[#EAE6E1]/5 py-16 first:border-t-0 first:pt-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C5B397]/40 md:grid-cols-12 md:gap-x-8 md:gap-y-0 md:py-24"
                  >
                    {/* Photo only */}
                    <div
                      className={`flex min-w-0 flex-col md:col-span-5 md:row-start-1 ${imageColStart}`}
                    >
                      <motion.div
                        initial={{ opacity: 0, scale: 1.02 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true, margin: "-60px" }}
                        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                        className="group/contender relative aspect-[3/4] w-full overflow-hidden bg-[#0F0E0C]"
                      >
                        {speaker.photo ? (
                          <Image
                            src={speaker.photo}
                            alt={speaker.name}
                            fill
                            className="object-cover grayscale opacity-75 transition-all duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/contender:scale-[1.02] group-hover/contender:grayscale-0 group-hover/contender:opacity-100"
                            sizes="(max-width: 768px) 100vw, 40vw"
                          />
                        ) : (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={PLACEHOLDER_AVATAR}
                            alt=""
                            className="h-full w-full object-cover opacity-25"
                          />
                        )}
                        <PhotoCategoryAgeOverlays category={speaker.category} age={speaker.age} photoGroup="contender" />
                        <div className="pointer-events-none absolute inset-0 mix-blend-color bg-[#C5B397] opacity-0 transition-opacity duration-1000 group-hover/contender:opacity-[0.06]" />
                      </motion.div>
                    </div>

                    {/* Index + name/title/org + bio + view profile */}
                    <div
                      className={`flex min-w-0 flex-col gap-6 md:col-span-6 md:row-start-1 ${textColStart}`}
                    >
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-60px" }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className="flex flex-col"
                      >
                        <span className="font-display text-8xl leading-none text-[#EAE6E1]/[0.08] select-none">
                          {indexLabel}
                        </span>
                        <div className="mt-8">
                          <ContenderBelowPhoto
                            name={speaker.name}
                            title={speaker.title}
                            organization={speaker.organization}
                            nameClassName="text-3xl md:text-4xl lg:text-5xl"
                          />
                        </div>
                        {bioExcerpt ? (
                          <p className="mt-8 max-w-xl font-sans text-sm font-light leading-[1.65] text-[#EAE6E1]/85 md:mt-10 md:text-[15px]">
                            {bioExcerpt}
                          </p>
                        ) : null}
                        <p className="mt-8 text-[9px] font-medium uppercase tracking-[0.3em] text-[#EAE6E1]/40">
                          View profile <span aria-hidden>›</span>
                        </p>
                      </motion.div>
                    </div>
                  </article>
                );
              })}
            </div>

            {showEditorialSeeMore ? (
              <div className="mt-16 flex justify-center border-t border-[#EAE6E1]/5 pt-16 md:mt-20 md:pt-20">
                <Link
                  href="/finalists"
                  className="inline-flex items-center gap-3 border border-white px-10 py-3.5 text-[10px] font-medium uppercase tracking-[0.32em] text-white transition-colors hover:border-[#C5B397] hover:text-[#C5B397]"
                >
                  See more
                  <span aria-hidden className="text-xs leading-none">
                    →
                  </span>
                </Link>
              </div>
            ) : null}
          </div>
        </section>

        <SpeakerModal selected={selected} onClose={() => setSelected(null)} />
      </>
    );
  }

  const mainSpeakers = balancedGrid ? speakers : speakers.length > 2 ? speakers.slice(0, -2) : speakers;
  const lastTwo = balancedGrid ? [] : speakers.length > 2 ? speakers.slice(-2) : [];

  return (
    <>
      <SectionWrapper
        id="contenders"
        title={showSectionHeader ? "The Top Contenders" : undefined}
        subtitle={showSectionHeader ? "Leaders taking the stage at 40 Under 40 by Asia Inc. 500" : undefined}
      >
        <div className="grid grid-cols-1 gap-x-12 gap-y-24 sm:grid-cols-2 lg:grid-cols-3">
          {mainSpeakers.map((speaker, i) => (
            <motion.article
              key={speaker.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, delay: (i % 8) * 0.07, ease: [0.16, 1, 0.3, 1] }}
              className="group/card flex cursor-pointer flex-col"
              onClick={() => setSelected(speaker)}
            >
              <div className="group/contender relative mb-6 aspect-[3/4] overflow-hidden bg-[#0F0E0C]">
                {speaker.photo ? (
                  <Image
                    src={speaker.photo}
                    alt={speaker.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover grayscale opacity-75 transition-all duration-[2000ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/contender:scale-105 group-hover/contender:grayscale-0 group-hover/contender:opacity-100"
                  />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={PLACEHOLDER_AVATAR} alt="" className="h-full w-full object-cover opacity-20" />
                )}
                <PhotoCategoryAgeOverlays category={speaker.category} age={speaker.age} photoGroup="contender" />
                <div className="pointer-events-none absolute inset-0 mix-blend-color bg-[#C5B397] opacity-0 transition-opacity duration-1000 group-hover/contender:opacity-[0.06]" />
              </div>
              <ContenderBelowPhoto
                name={speaker.name}
                title={speaker.title}
                organization={speaker.organization}
                nameClassName="text-2xl italic text-[#EAE6E1] transition-colors duration-500 group-hover/card:text-[#C5B397] md:text-3xl"
              />
              <div className="mt-5 h-[1px] w-8 bg-[#EAE6E1]/15 transition-all duration-[1500ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/card:w-full group-hover/card:bg-[#C5B397]/40" />
            </motion.article>
          ))}
        </div>
        {lastTwo.length > 0 && (
          <div className="mt-24 flex justify-center gap-x-12">
            {lastTwo.map((speaker, i) => (
              <div key={speaker.id} className="w-full max-w-[calc(33.333%-1.5rem)]">
                <motion.article
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.7, delay: ((mainSpeakers.length + i) % 8) * 0.07, ease: [0.16, 1, 0.3, 1] }}
                  className="group/card flex cursor-pointer flex-col"
                  onClick={() => setSelected(speaker)}
                >
                  <div className="group/contender relative mb-6 aspect-[3/4] overflow-hidden bg-[#0F0E0C]">
                    {speaker.photo ? (
                      <Image
                        src={speaker.photo}
                        alt={speaker.name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover grayscale opacity-75 transition-all duration-[2000ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/contender:scale-105 group-hover/contender:grayscale-0 group-hover/contender:opacity-100"
                      />
                    ) : (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={PLACEHOLDER_AVATAR} alt="" className="h-full w-full object-cover opacity-20" />
                    )}
                    <PhotoCategoryAgeOverlays category={speaker.category} age={speaker.age} photoGroup="contender" />
                    <div className="pointer-events-none absolute inset-0 mix-blend-color bg-[#C5B397] opacity-0 transition-opacity duration-1000 group-hover/contender:opacity-[0.06]" />
                  </div>
                  <ContenderBelowPhoto
                    name={speaker.name}
                    title={speaker.title}
                    organization={speaker.organization}
                    nameClassName="text-2xl italic text-[#EAE6E1] transition-colors duration-500 group-hover/card:text-[#C5B397] md:text-3xl"
                  />
                  <div className="mt-5 h-[1px] w-8 bg-[#EAE6E1]/15 transition-all duration-[1500ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/card:w-full group-hover/card:bg-[#C5B397]/40" />
                </motion.article>
              </div>
            ))}
          </div>
        )}
      </SectionWrapper>

      <SpeakerModal selected={selected} onClose={() => setSelected(null)} />
    </>
  );
}

function SpeakerModal({
  selected,
  onClose,
}: {
  selected: SpeakerDisplay | null;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {selected && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#0A0908]/85 p-4 backdrop-blur-xl md:p-16"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="relative flex max-h-[92vh] w-full max-w-5xl flex-col overflow-y-auto border border-[#EAE6E1]/10 bg-[#0F0E0C] shadow-2xl md:flex-row"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute right-5 top-5 z-20 flex h-9 w-9 items-center justify-center border border-[#EAE6E1]/10 text-[#EAE6E1]/40 transition-colors hover:border-[#EAE6E1]/30 hover:text-[#EAE6E1]"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="relative h-[50vw] min-h-[300px] w-full flex-shrink-0 overflow-hidden md:h-auto md:w-5/12">
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
                <img src={PLACEHOLDER_AVATAR} alt="" className="h-full w-full object-cover opacity-20" />
              )}
              <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-t from-[#0F0E0C] via-transparent to-transparent md:bg-gradient-to-r" />
              <PhotoCategoryAgeOverlays category={selected.category} age={selected.age} revealOnHover={false} />
            </div>
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
              <h2 className="font-display mb-3 text-4xl font-normal leading-[1.05] text-[#C5B397] md:text-5xl">
                {selected.name}
              </h2>
              <p className="text-[9px] font-medium uppercase tracking-[0.22em] text-[#EAE6E1]/45">{selected.title}</p>
              {selected.organization?.trim() ? (
                <p className="mt-3 max-w-xl text-[9px] font-medium uppercase leading-relaxed tracking-[0.18em] text-[#EAE6E1]/45">
                  {selected.organization.trim()}
                </p>
              ) : null}
              <div className="my-10 h-[1px] w-12 bg-[#C5B397]/40" />
              {selected.bio && (
                <div className="custom-scrollbar max-h-[35vh] overflow-y-auto pr-4 font-display text-xl leading-relaxed text-[#EAE6E1]/70">
                  {selected.bio.split("\n").map((para, idx) => (
                    <p key={idx} className="mb-4">
                      {para}
                    </p>
                  ))}
                </div>
              )}
              <div className="mt-8">
                <ProfileLinks
                  linkedinUrl={selected.linkedinUrl}
                  instagramUrl={selected.instagramUrl}
                  websiteUrl={selected.websiteUrl}
                  profileUrl={selected.profileUrl}
                  className="flex gap-4"
                />
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
