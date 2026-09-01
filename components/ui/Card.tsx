"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export function Card({ children, className, hover = true }: CardProps) {
  const Component = hover ? motion.div : "div";
  const motionProps = hover
    ? {
        whileHover: { y: -4 },
        transition: { duration: 0.2 },
        className: cn(
          "rounded-xl border border-neutral-600 bg-primary/80 p-6 transition-colors hover:border-gold",
          className
        ),
      }
    : { className: cn("rounded-xl border border-neutral-600 bg-primary/80 p-6", className) };

  return <Component {...motionProps}>{children}</Component>;
}
