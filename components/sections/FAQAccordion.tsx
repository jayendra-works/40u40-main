"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import type { AccordionItem } from "@/components/ui/Accordion";

export function FAQAccordion({ items }: { items: AccordionItem[] }) {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: { staggerChildren: 0.08, delayChildren: 0.2 },
        },
      }}
      className="flex flex-col border-t border-[#EAE6E1]/10"
    >
      {items.map((item) => {
        const isOpen = openId === item.id;
        return (
          <motion.div
            key={item.id}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
            className="border-b border-[#EAE6E1]/10 overflow-hidden"
          >
            <button
              onClick={() => setOpenId(isOpen ? null : item.id)}
              className="w-full text-left py-8 md:py-10 flex items-center justify-between gap-6 group focus:outline-none"
              aria-expanded={isOpen}
            >
              <span
                className={`font-display text-3xl md:text-4xl lg:text-5xl transition-colors duration-500 pr-8 ${
                  isOpen
                    ? "text-[#C5B397] italic"
                    : "text-[#EAE6E1] group-hover:text-[#C5B397]"
                }`}
              >
                {item.question}
              </span>
              <div
                className={`flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full border transition-all duration-500 ${
                  isOpen
                    ? "border-[#C5B397] bg-[#C5B397]/10 text-[#C5B397]"
                    : "border-[#EAE6E1]/20 text-[#EAE6E1]/50 group-hover:border-[#EAE6E1]/40 group-hover:text-[#EAE6E1]"
                }`}
              >
                <AnimatePresence mode="popLayout" initial={false}>
                  {isOpen ? (
                    <motion.div
                      key="minus"
                      initial={{ opacity: 0, rotate: -90 }}
                      animate={{ opacity: 1, rotate: 0 }}
                      exit={{ opacity: 0, rotate: 90 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Minus strokeWidth={1} className="w-6 h-6" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="plus"
                      initial={{ opacity: 0, rotate: 90 }}
                      animate={{ opacity: 1, rotate: 0 }}
                      exit={{ opacity: 0, rotate: -90 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Plus strokeWidth={1} className="w-6 h-6" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div className="pb-10 pr-12 md:pr-24">
                    <p className="text-sm md:text-base text-[#EAE6E1]/60 leading-relaxed font-light">
                      {item.answer}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
