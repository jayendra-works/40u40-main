"use client";

import { useReducedMotion } from "framer-motion";
import { INDUSTRIES } from "@/data/industries";

const DEFAULT_WORDS = INDUSTRIES.map((s) => s.toUpperCase());

const bandClass =
  "border-y border-[#EAE6E1]/5 bg-[#0F0E0C] py-20 overflow-hidden";
const labelClass =
  "font-display text-6xl md:text-9xl tracking-tight text-[#EAE6E1]/15 uppercase leading-none";
const bulletClass = "select-none font-display text-6xl md:text-9xl italic text-[#C5B397]/30 leading-none";

/** Full-width marquee with large serif labels and subtle separators. */
export function WhoCanApplyCategoriesMarquee({ words }: { words?: string[] }) {
  const reduceMotion = useReducedMotion();
  const labels = words && words.length > 0
    ? words.map((w) => w.toUpperCase())
    : DEFAULT_WORDS;

  if (reduceMotion) {
    return (
      <section aria-label="Who can apply: categories" className={bandClass}>
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-10 gap-y-6 px-6 text-center md:gap-x-14 md:gap-y-7 md:px-16 lg:gap-x-20 lg:px-24">
          {labels.map((label, i) => (
            <span key={label} className="flex items-center gap-x-8 md:gap-x-12 lg:gap-x-14">
              <span className={labelClass}>{label}</span>
              {i < labels.length - 1 ? (
                <span className={bulletClass} aria-hidden>
                  •
                </span>
              ) : null}
            </span>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section aria-label="Who can apply: categories" className={bandClass}>
      <div className="overflow-hidden">
        <div className="flex w-max animate-who-can-apply-marquee items-center">
          {[0, 1].map((dup) => (
            <div
              key={dup}
              className="flex shrink-0 items-center gap-12 px-6 md:gap-20 md:px-10 lg:gap-28 lg:px-14"
              aria-hidden={dup === 1}
            >
              {labels.map((label) => (
                <span
                  key={`${dup}-${label}`}
                  className="flex shrink-0 items-center gap-8 md:gap-12 lg:gap-14"
                >
                  <span className={labelClass}>{label}</span>
                  <span className={bulletClass} aria-hidden>
                    •
                  </span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
