"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const DEFAULT_ABOUT = {
  title: "What is 40 Under 40?",
  paragraph1:
    "Each year, Asia Inc 500 identifies forty remarkable individuals, all under the age of 40, who have demonstrated extraordinary leadership, entrepreneurial vision, and transformative impact across Asia and beyond.",
  paragraph2:
    "Now in its most distinguished edition, the 40 Under 40 programme continues to be the most authoritative recognition of young Asian leadership, celebrating pioneers across technology, finance, culture, sustainability, and the social sector.",
  highlightedText: "India 40 Under 40 Leadership Summit & Awards Gala",
};

export function AboutSection({
  title = DEFAULT_ABOUT.title,
  paragraph1 = DEFAULT_ABOUT.paragraph1,
  paragraph2 = DEFAULT_ABOUT.paragraph2,
  highlightedText = DEFAULT_ABOUT.highlightedText,
}: {
  title?: string;
  paragraph1?: string;
  paragraph2?: string;
  highlightedText?: string;
}) {
  return (
    <section
      id="about"
      className="border-t border-[#EAE6E1]/5 py-24 md:py-40 px-6 md:px-24 bg-[#131210]"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-16 md:gap-24 items-start">
        {/* Left column */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="md:col-span-4 flex flex-col gap-8"
        >
          <span className="text-[9px] uppercase tracking-[0.35em] font-medium text-[#EAE6E1]/40">
            About the Programme
          </span>
          <h2 className="font-display text-5xl md:text-6xl leading-[0.95] uppercase">
            {title.includes("40 Under 40") ? (
              <>
                {title.split("40 Under 40")[0]}
                <br />
                <span className="italic text-[#C5B397]">40 Under 40?</span>
              </>
            ) : (
              title
            )}
          </h2>
          <a
            href="/winners"
            className="group mt-4 inline-flex items-center gap-3 text-[9px] uppercase tracking-[0.3em] font-medium text-[#EAE6E1]/60 hover:text-[#C5B397] transition-colors"
          >
            View Top Contenders
            <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
        </motion.div>

        {/* Right column */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 1, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="md:col-span-8 flex flex-col gap-10"
        >
          <p className="font-display text-2xl md:text-3xl text-[#EAE6E1]/80 leading-relaxed">
            {paragraph1.includes("Asia Inc 500") ? (
              <>
                {paragraph1.split("Asia Inc 500")[0]}
                <span className="italic text-[#EAE6E1]">Asia Inc 500</span>
                {paragraph1.split("Asia Inc 500")[1]}
              </>
            ) : (
              paragraph1
            )}
          </p>
          <p className="text-[11px] uppercase tracking-[0.15em] font-light text-[#EAE6E1]/50 leading-loose max-w-2xl">
            {paragraph2}
          </p>
          <div className="w-full h-[1px] bg-[#EAE6E1]/5 mt-4" />
          <p className="text-[10px] uppercase tracking-[0.25em] font-medium text-[#EAE6E1]/30">
            Presented by Asia Inc 500 Magazine &nbsp;·&nbsp; Est. annually
          </p>
        </motion.div>
      </div>
    </section>
  );
}
