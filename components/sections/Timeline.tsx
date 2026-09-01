"use client";

import { motion } from "framer-motion";
import { useReducedMotion } from "framer-motion";
import { TIMELINE_STEPS } from "@/data/timeline";

const LINE_GRADIENT =
  "linear-gradient(90deg, var(--color-border) 0%, var(--color-gold-primary) 100%)";
const LINE_GRADIENT_VERTICAL =
  "linear-gradient(180deg, var(--color-border) 0%, var(--color-gold-primary) 100%)";

export function Timeline() {
  const reducedMotion = useReducedMotion();

  return (
    <div className="relative">
      {/* Desktop: horizontal gradient line (2px) */}
      <motion.div
        className="hidden md:block absolute left-0 origin-left"
        style={{
          top: 23,
          height: 2,
          width: "100%",
          background: LINE_GRADIENT,
        }}
        initial={{ width: 0 }}
        whileInView={{ width: "100%" }}
        viewport={{ once: true }}
        transition={{ duration: reducedMotion ? 0 : 1, ease: "easeInOut" }}
        aria-hidden
      />

      {/* Mobile: vertical gradient line (2px, through circle centers) */}
      <div
        className="md:hidden absolute top-6 bottom-6"
        style={{
          left: 23,
          width: 2,
          background: LINE_GRADIENT_VERTICAL,
        }}
        aria-hidden
      />

      {/* Desktop: 5-column grid */}
      <div className="hidden md:grid md:grid-cols-5 gap-4">
        {TIMELINE_STEPS.map((step, index) => (
          <motion.div
            key={step.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{
              duration: reducedMotion ? 0 : 0.4,
              delay: reducedMotion ? 0 : index * 0.1,
            }}
            className="relative flex flex-col items-center text-center"
          >
            <motion.div
              className="rounded-full border-2 flex items-center justify-center z-10 shrink-0"
              style={{
                width: 48,
                height: 48,
                borderColor: "var(--color-gold-primary)",
                backgroundColor: index === 0 ? "var(--color-gold-muted)" : "transparent",
              }}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <span
                className="font-display font-semibold"
                style={{
                  fontSize: "1rem",
                  color: "var(--color-gold-primary)",
                }}
              >
                {step.id}
              </span>
            </motion.div>
            <div
              className="flex flex-col items-center"
              style={{ marginTop: "var(--space-md)" }}
            >
              <h3
                className="font-semibold text-text-primary"
                style={{ fontSize: "0.95rem" }}
              >
                {step.title}
              </h3>
              <p
                className="text-text-secondary mt-[0.35rem] text-center"
                style={{
                  fontSize: "0.85rem",
                  lineHeight: 1.5,
                  maxWidth: 180,
                }}
              >
                {step.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Mobile: vertical stack — circle left, label right */}
      <div className="md:hidden flex flex-col gap-0">
        {TIMELINE_STEPS.map((step, index) => (
          <motion.div
            key={step.id}
            initial={{ opacity: 0, x: -12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-20px" }}
            transition={{
              duration: reducedMotion ? 0 : 0.3,
              delay: reducedMotion ? 0 : index * 0.06,
            }}
            className="relative flex items-start gap-4 py-2"
          >
            <motion.div
              className="shrink-0 rounded-full border-2 flex items-center justify-center z-10"
              style={{
                width: 48,
                height: 48,
                borderColor: "var(--color-gold-primary)",
                backgroundColor: index === 0 ? "var(--color-gold-muted)" : "transparent",
              }}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <span
                className="font-display font-semibold"
                style={{
                  fontSize: "1rem",
                  color: "var(--color-gold-primary)",
                }}
              >
                {step.id}
              </span>
            </motion.div>
            <div className="flex flex-col pt-1 min-w-0">
              <h3
                className="font-semibold text-text-primary"
                style={{ fontSize: "0.95rem" }}
              >
                {step.title}
              </h3>
              <p
                className="text-text-secondary mt-[0.35rem]"
                style={{
                  fontSize: "0.85rem",
                  lineHeight: 1.5,
                }}
              >
                {step.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
