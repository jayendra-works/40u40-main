"use client";

import { TIMELINE_STEPS } from "@/data/timeline";
import { cn } from "@/lib/utils";

const EDITORIAL_NOTE =
  "A rigorous, multi-stage editorial process conducted annually by Asia Inc 500's independent panel.";

interface HomeSelectionProcessSectionProps {
  className?: string;
}

export function HomeSelectionProcessSection({ className }: HomeSelectionProcessSectionProps) {
  const topRow = TIMELINE_STEPS.slice(0, 3);
  const bottomRow = TIMELINE_STEPS.slice(3);

  return (
    <section className={cn("border-t border-[#EAE6E1]/5 bg-[#0F0E0C] px-6 py-24 md:px-24 md:py-32", className)}>
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 grid grid-cols-1 gap-8 md:mb-24 md:grid-cols-12 md:items-start">
          <h2 className="font-display text-5xl uppercase leading-[0.9] text-[#EAE6E1] md:col-span-7 md:text-7xl">
            <span className="block">The Selection</span>
            <span className="block italic text-[#C5B397]">Process</span>
          </h2>
          <p className="max-w-sm text-[10px] font-medium uppercase tracking-[0.24em] text-[#EAE6E1]/40 md:col-span-5 md:justify-self-end md:pt-3">
            {EDITORIAL_NOTE}
          </p>
        </div>

        <div className="hidden gap-x-14 gap-y-16 md:grid md:grid-cols-6 lg:gap-x-20 lg:gap-y-20">
          {topRow.map((step, index) => (
            <article
              key={step.id}
              className={index === 2 ? "md:col-span-2" : "md:col-span-2"}
            >
              <span className="font-display text-[42px] leading-none text-[#EAE6E1]/15">
                {step.id.padStart(2, "0")}
              </span>
              <div className="mt-3 h-px w-16 bg-[#EAE6E1]/10" />
              <h3 className="mt-5 font-display text-[42px] leading-none italic text-[#EAE6E1]">
                {step.title}
              </h3>
              <p className="mt-5 max-w-xs text-[10px] font-medium uppercase tracking-[0.22em] text-[#EAE6E1]/40">
                {step.description}
              </p>
            </article>
          ))}

          <div className="md:col-span-1" aria-hidden />

          {bottomRow.map((step) => (
            <article key={step.id} className="md:col-span-2">
              <span className="font-display text-[42px] leading-none text-[#EAE6E1]/15">
                {step.id.padStart(2, "0")}
              </span>
              <div className="mt-3 h-px w-16 bg-[#EAE6E1]/10" />
              <h3 className="mt-5 font-display text-[42px] leading-none italic text-[#EAE6E1]">
                {step.title}
              </h3>
              <p className="mt-5 max-w-xs text-[10px] font-medium uppercase tracking-[0.22em] text-[#EAE6E1]/40">
                {step.description}
              </p>
            </article>
          ))}
        </div>

        <div className="flex flex-col gap-10 md:hidden">
          {TIMELINE_STEPS.map((step) => (
            <article key={step.id}>
              <span className="font-display text-[34px] leading-none text-[#EAE6E1]/15">
                {step.id.padStart(2, "0")}
              </span>
              <div className="mt-2 h-px w-14 bg-[#EAE6E1]/10" />
              <h3 className="mt-4 font-display text-[34px] leading-none italic text-[#EAE6E1]">
                {step.title}
              </h3>
              <p className="mt-4 text-[9px] font-medium uppercase tracking-[0.2em] text-[#EAE6E1]/40">
                {step.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
