"use client";

import { useMemo, useState } from "react";
import { SpeakersSection, type SpeakerDisplay } from "@/components/sections/SpeakersSection";

export function FinalistsDirectory({ finalists }: { finalists: SpeakerDisplay[] }) {
  const [category, setCategory] = useState("All");
  const categories = useMemo(
    () => Array.from(new Set(finalists.map((person) => person.category?.trim()).filter(Boolean))).sort() as string[],
    [finalists],
  );
  const visibleFinalists = category === "All" ? finalists : finalists.filter((person) => person.category?.trim() === category);

  return (
    <section className="mx-auto mt-20 max-w-7xl px-6 md:mt-24 md:px-24">
      <div className="mb-12 flex flex-col gap-6 border-y border-[#EAE6E1]/10 py-5 md:flex-row md:items-center md:justify-between">
        <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-[#EAE6E1]/55">{visibleFinalists.length} of {finalists.length} finalists</p>
        {categories.length > 1 ? <div className="flex max-w-full gap-2 overflow-x-auto pb-1">
          {["All", ...categories].map((item) => <button key={item} type="button" onClick={() => setCategory(item)} aria-pressed={category === item} className={`shrink-0 border px-4 py-2 text-[9px] font-medium uppercase tracking-[0.18em] transition-colors ${category === item ? "border-[#C5B397] bg-[#C5B397] text-[#131210]" : "border-[#EAE6E1]/15 text-[#EAE6E1]/60 hover:border-[#C5B397]/60 hover:text-[#C5B397]"}`}>{item}</button>)}
        </div> : null}
      </div>
      <SpeakersSection speakers={visibleFinalists} layout="grid" showSectionHeader={false} balancedGrid />
    </section>
  );
}
