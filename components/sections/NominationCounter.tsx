"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useSpring, useTransform } from "framer-motion";
import { useReducedMotion } from "framer-motion";

export function NominationCounter({ count }: { count: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const reducedMotion = useReducedMotion();
  const spring = useSpring(0, { stiffness: 50, damping: 30 });
  const display = useTransform(spring, (v) => Math.round(v).toLocaleString());

  useEffect(() => {
    if (isInView && !reducedMotion) spring.set(count);
  }, [isInView, count, spring, reducedMotion]);

  return (
    <span ref={ref} className="font-display font-bold text-gold">
      {reducedMotion ? (
        count.toLocaleString()
      ) : (
        <motion.span>{display}</motion.span>
      )}
    </span>
  );
}
