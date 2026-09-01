"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const DEFAULT_HEADLINE = "Know a Future Leader?";
const DEFAULT_SUBHEADLINE =
  "We invite visionary individuals, peers, and mentors to submit nominations for the next cohort of Asia's most transformative young leaders.";

export function NominationCTASection({
  headline = DEFAULT_HEADLINE,
  subheadline = DEFAULT_SUBHEADLINE,
}: {
  headline?: string;
  subheadline?: string;
} = {}) {
  return (
    <section className="relative py-40 md:py-64 flex items-center justify-center text-center px-6 bg-[#131210] overflow-hidden border-t border-[#EAE6E1]/5">
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1559062650-749e177565a2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
          alt=""
          className="w-full h-full object-cover opacity-20 grayscale"
          aria-hidden
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,#131210_100%)]" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 flex flex-col items-center"
      >
        <span className="text-[9px] uppercase tracking-[0.4em] font-medium text-[#C5B397] mb-8 block">
          Nominations Now Open
        </span>

        <h2 className="font-display text-5xl md:text-7xl lg:text-8xl mb-6 max-w-3xl leading-[1.05]">
          {(() => {
            const words = headline.split(" ");
            const italic = words.slice(-2).join(" ");
            const plain = words.slice(0, -2).join(" ");
            return (
              <>
                {plain}{" "}
                <span className="italic text-[#C5B397]">{italic}</span>
              </>
            );
          })()}
        </h2>

        <p className="text-[11px] uppercase tracking-[0.15em] text-[#EAE6E1]/50 max-w-lg leading-loose mb-14">
          {subheadline}
        </p>

        <a
          href="/nominate"
          className="group relative overflow-hidden text-[10px] uppercase tracking-[0.3em] font-medium border border-[#EAE6E1]/30 px-12 py-6 transition-colors inline-flex items-center gap-4"
        >
          <span className="relative z-10 group-hover:text-[#131210] transition-colors duration-500 delay-100">
            Submit a Nomination
          </span>
          <ArrowRight className="relative z-10 w-3 h-3 group-hover:text-[#131210] group-hover:translate-x-1 transition-all duration-500 delay-100" />
          <div className="absolute inset-0 bg-[#EAE6E1] transform scale-y-0 origin-bottom group-hover:scale-y-100 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]" />
        </a>
      </motion.div>
    </section>
  );
}
