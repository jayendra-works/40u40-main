"use client";

import { motion } from "framer-motion";
import { INDUSTRIES } from "@/data/industries";

export function WhoCanApplySection() {
  return (
    <section className="border-t border-[#EAE6E1]/5 bg-[#0F0E0C] px-6 py-24 md:px-24 md:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-10">
          <div className="md:col-span-4">
            <span className="text-[10px] font-medium uppercase tracking-[0.35em] text-[#EAE6E1]/35">
              Eligibility Criteria
            </span>
            <motion.h2
              initial={{ y: "100%", opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
              className="mt-4 font-display text-[66px] uppercase leading-[0.86] text-[#EAE6E1] md:text-[86px]"
            >
              <span className="block">Who</span>
              <span className="block">Can</span>
              <span className="block italic text-[#C5B397]">Apply?</span>
            </motion.h2>
            <p className="mt-5 max-w-xs text-[11px] font-medium uppercase leading-[1.8] tracking-[0.08em] text-[#EAE6E1]/72">
              Leaders across industries who are redefining the future before 40.
            </p>
          </div>

          <div className="md:col-span-8 md:pt-9">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4">
              {INDUSTRIES.map((industry, index) => (
                <motion.div
                  key={industry}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.45, delay: index * 0.03, ease: [0.16, 1, 0.3, 1] }}
                  className="inline-flex min-h-[54px] items-center gap-3 rounded-full border border-[#EAE6E1]/14 px-7"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-[#9A8E7D]" />
                  <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#EAE6E1]/82">
                    {industry}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-16 border-t border-[#EAE6E1]/8 pt-10 md:mt-20 md:pt-12">
          <div className="flex items-center gap-6">
            <span className="h-px w-8 bg-[#9A8E7D]/70" aria-hidden />
            <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#EAE6E1]/35">
              Self-nominations are accepted and reviewed with equal rigour.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
