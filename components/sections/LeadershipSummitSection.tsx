"use client";

import { motion } from "framer-motion";
import { SectionWrapper } from "@/components/ui/SectionWrapper";

const FEATURES = [
  "Keynote talks from global leaders",
  "Panel discussions on industry trends",
  "Founder networking sessions",
  "Investor roundtables",
  "Awards ceremony & gala",
];

export function LeadershipSummitSection() {
  return (
    <SectionWrapper
      id="summit"
      className="bg-[#0F0E0C]"
    >
      <div className="grid grid-cols-1 md:grid-cols-12 gap-16 items-start">
        {/* Left: "What to Expect" heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="md:col-span-4"
        >
          <span className="text-[9px] uppercase tracking-[0.35em] font-medium text-[#EAE6E1]/30 block mb-8">
            Key Highlights
          </span>
          <h3 className="font-display text-5xl md:text-6xl leading-[0.95] uppercase">
            What to<br />
            <span className="italic text-[#C5B397]">Expect</span>
          </h3>
        </motion.div>

        {/* Right: feature list */}
        <div className="md:col-span-8 flex flex-col divide-y divide-[#EAE6E1]/5">
          {FEATURES.map((feature, index) => (
            <motion.div
              key={feature}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, delay: index * 0.07, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center gap-6 py-7 group"
            >
              <span className="font-display text-2xl text-[#EAE6E1]/10 w-8 flex-shrink-0 group-hover:text-[#C5B397]/30 transition-colors duration-500">
                0{index + 1}
              </span>
              <div className="w-6 h-[1px] bg-[#EAE6E1]/15 group-hover:w-12 group-hover:bg-[#C5B397]/50 transition-all duration-700" />
              <p className="font-display text-2xl md:text-3xl italic text-[#EAE6E1] group-hover:text-[#C5B397] transition-colors duration-500">
                {feature}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
