"use client";

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface AccordionItem {
  id: string;
  question: string;
  answer: string;
}

export interface AccordionProps {
  items: AccordionItem[];
  className?: string;
}

const ChevronIcon = ({ open }: { open: boolean }) => (
  <span
    className="shrink-0 inline-flex items-center justify-center transition-transform duration-300 ease-out"
    style={{
      transform: open ? "rotate(180deg)" : "rotate(0deg)",
      color: "var(--color-gold-primary)",
    }}
    aria-hidden
  >
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  </span>
);

export function Accordion({ items, className }: AccordionProps) {
  const [openId, setOpenId] = useState<string | null>(null);
  const reducedMotion = useReducedMotion();

  return (
    <div className={cn(className)}>
      {items.map((item) => {
        const isOpen = openId === item.id;
        return (
          <div
            key={item.id}
            className="border-b border-[var(--color-border-muted)] last:border-b last:border-[var(--color-border-muted)]"
          >
            <button
              type="button"
              onClick={() => setOpenId(isOpen ? null : item.id)}
              className="w-full flex items-center justify-between gap-4 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-inset focus-visible:ring-offset-0 rounded-sm"
              style={{
                padding: "var(--space-md) 0",
                color: "var(--color-text-primary)",
                fontSize: "1rem",
                fontWeight: 500,
              }}
              aria-expanded={isOpen}
              aria-controls={`accordion-${item.id}`}
              id={`accordion-heading-${item.id}`}
            >
              <span className="min-w-0 flex-1">{item.question}</span>
              <ChevronIcon open={isOpen} />
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={`accordion-${item.id}`}
                  role="region"
                  aria-labelledby={`accordion-heading-${item.id}`}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{
                    duration: reducedMotion ? 0 : 0.3,
                    ease: "easeInOut",
                  }}
                  className="overflow-hidden"
                >
                  <div
                    className="text-left"
                    style={{
                      color: "var(--color-text-secondary)",
                      fontSize: "0.95rem",
                      paddingTop: "var(--space-sm)",
                      paddingBottom: "var(--space-md)",
                    }}
                  >
                    {item.answer}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
