"use client";

import { useEffect, useRef } from "react";
import { motion, useInView, useMotionValue, animate } from "framer-motion";
import { useReducedMotion } from "framer-motion";
import { STATS } from "@/data/stats";

type StatItem = {
  value: number;
  suffix: string;
  label: string;
};

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;
const COUNT_DURATION = 2;
const STAGGER_MS = 150;

function formatStatValue(value: number, label: string): string {
  if (label.toLowerCase() === "since") {
    return String(value);
  }
  return value.toLocaleString();
}

function AnimatedNumber({
  value,
  label,
  suffix,
  reducedMotion,
  delay,
}: {
  value: number;
  label: string;
  suffix: string;
  reducedMotion: boolean;
  delay: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const motionValue = useMotionValue(0);
  const displayRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!isInView || reducedMotion) {
      motionValue.set(value);
      if (displayRef.current) displayRef.current.textContent = formatStatValue(value, label) + suffix;
      return;
    }
    if (displayRef.current) displayRef.current.textContent = "0" + suffix;
    const controls = animate(motionValue, value, {
      duration: COUNT_DURATION,
      delay,
      ease: EASE_OUT_EXPO,
      onUpdate: (latest) => {
        if (displayRef.current) {
          displayRef.current.textContent = formatStatValue(Math.round(latest), label) + suffix;
        }
      },
    });
    return () => controls.stop();
  }, [isInView, value, label, suffix, motionValue, reducedMotion, delay]);

  return (
    <span ref={ref}>
      <span ref={displayRef}>0{suffix}</span>
    </span>
  );
}

export function StatSection({
  nominationCount,
  useNominationCount = true,
  statItems,
}: {
  nominationCount?: number;
  useNominationCount?: boolean;
  statItems?: StatItem[];
}) {
  const reducedMotion = useReducedMotion();

  const baseItems = statItems ?? STATS.map((s) => ({ value: s.value, suffix: s.suffix, label: s.label }));
  void nominationCount;
  void useNominationCount;
  const items: StatItem[] = baseItems;

  return (
    <section className="border-t border-[#EAE6E1]/5 py-24 md:py-32 px-6 md:px-24 bg-[#0F0E0C]">
      <div className="max-w-7xl mx-auto">
        <motion.span
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-[14px] uppercase tracking-[0.35em] font-bold text-[#EAE6E1]/30 block mb-16"
        >
          By the Numbers
        </motion.span>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-10 gap-y-12">
          {items.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.9, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col gap-4 border-t border-[#EAE6E1]/10 pt-8"
            >
              <span className="font-display text-6xl md:text-7xl text-[#C5B397] leading-none tabular-nums">
                {reducedMotion ? (
                  <>{formatStatValue(stat.value, stat.label)}{stat.suffix}</>
                ) : (
                  <AnimatedNumber
                    value={stat.value}
                    label={stat.label}
                    suffix={stat.suffix}
                    reducedMotion={!!reducedMotion}
                    delay={index * (STAGGER_MS / 1000)}
                  />
                )}
              </span>
              <span className="text-[9px] uppercase tracking-[0.3em] font-medium text-[#EAE6E1]/50 leading-relaxed">
                {stat.label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
