"use client";

import { motion } from "framer-motion";

export function SummitPageHeader() {
  return (
    <div className="px-6 md:px-24 mb-20 md:mb-32 max-w-7xl mx-auto">
      <div className="overflow-hidden mb-4">
        <motion.h1
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="font-display text-6xl md:text-8xl lg:text-[9rem] leading-[0.9] tracking-tighter uppercase"
        >
          Leadership
        </motion.h1>
      </div>
      <div className="overflow-hidden mb-10">
        <motion.h2
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="font-display text-6xl md:text-8xl lg:text-[9rem] leading-[0.9] tracking-tighter uppercase italic text-[#C5B397]"
        >
          Summit &amp; Awards
        </motion.h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 mt-12">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="text-[10px] uppercase tracking-[0.2em] font-medium text-[#EAE6E1]/40 leading-loose"
        >
          A full-day experience bringing together the 40 Under 40 cohort, investors, and industry leaders.
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="font-display text-xl md:text-2xl text-[#EAE6E1]/70 leading-relaxed"
        >
          The India 40 Under 40 Leadership Summit &amp; Awards Gala is the culmination of the program — a day of keynotes, panels, networking, and the official awards ceremony.
        </motion.p>
      </div>
    </div>
  );
}
