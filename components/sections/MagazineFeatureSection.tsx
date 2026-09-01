"use client";

import { motion } from "framer-motion";

const DEFAULT_TITLE = "Magazine Feature";
const DEFAULT_BODY =
  "Selected leaders will be featured in a special edition of Asia Inc. 500 Magazine, highlighting their achievements and leadership journeys.";
const DEFAULT_CTA = "Learn about past editions";

export function MagazineFeatureSection({
  title = DEFAULT_TITLE,
  body = DEFAULT_BODY,
  ctaText = DEFAULT_CTA,
}: {
  title?: string;
  body?: string;
  ctaText?: string;
} = {}) {
  return (
    <section
      id="magazine"
      className="border-t border-[#EAE6E1]/5 py-24 md:py-32 px-6 md:px-24 bg-[#0F0E0C]"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col gap-8"
        >
          <span className="text-[9px] uppercase tracking-[0.35em] font-medium text-[#EAE6E1]/40">
            Asia Inc 500 Publication
          </span>
          <h2 className="font-display text-5xl md:text-6xl leading-[0.95] uppercase">
            {title.split(" ")[0]}{" "}
            <span className="italic text-[#C5B397]">
              {title.split(" ").slice(1).join(" ")}
            </span>
          </h2>
          <p className="text-[11px] uppercase tracking-[0.15em] font-light text-[#EAE6E1]/50 leading-loose max-w-md">
            {body}
          </p>
          <a
            href="/winners"
            className="group inline-flex items-center gap-3 text-[9px] uppercase tracking-[0.3em] font-medium text-[#EAE6E1]/40 hover:text-[#C5B397] transition-colors duration-300"
          >
            {ctaText}
            <span className="group-hover:translate-x-0.5 transition-transform">→</span>
          </a>
        </motion.div>

        <div className="flex justify-center lg:justify-end">
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="border border-[#EAE6E1]/10 flex flex-col items-center justify-between overflow-hidden"
            style={{
              aspectRatio: "3/4",
              width: "clamp(200px, 20vw, 280px)",
              background: "linear-gradient(160deg, #1a1810 0%, #0f0e0c 100%)",
            }}
          >
            <div className="w-full h-px bg-gradient-to-r from-transparent via-[#C5B397]/40 to-transparent" />
            <div className="flex-1 flex flex-col items-center justify-center px-6 py-8 text-center gap-3">
              <span className="text-[9px] uppercase tracking-[0.4em] font-medium text-[#EAE6E1]/30">
                Asia Inc 500
              </span>
              <p className="font-display text-2xl italic text-[#C5B397]">
                40 Under 40
              </p>
              <div className="w-8 h-[1px] bg-[#C5B397]/30" />
            </div>
            <p className="text-[8px] uppercase tracking-[0.3em] text-[#EAE6E1]/20 pb-6">
              Special Edition · 2026
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
