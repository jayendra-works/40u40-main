"use client";

import { motion } from "framer-motion";

export function FinalistsPageHeader() {
  return (
    <div className="px-6 md:px-24 max-w-4xl mx-auto flex flex-col items-center text-center">
      <div className="overflow-hidden mb-10">
        <motion.h1
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="font-display text-6xl md:text-8xl lg:text-[9rem] leading-[0.9] tracking-tighter uppercase italic"
        >
          Finalists
        </motion.h1>
      </div>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="font-display text-xl md:text-2xl text-[#EAE6E1]/70 leading-relaxed max-w-2xl"
      >
        Meet the leaders selected for the final round. Explore their stories, impact, and the ideas shaping what comes next.
      </motion.p>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="mt-20 w-16 h-[1px] bg-[#C5B397]/30"
      />

    </div>
  );
}
