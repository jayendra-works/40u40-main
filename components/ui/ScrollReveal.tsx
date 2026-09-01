"use client";

import { useScrollReveal } from "@/hooks/useScrollReveal";
import { cn } from "@/lib/utils";

type RevealVariant = "heading" | "stagger";
type RevealAs = "div" | "header" | "section";

export interface ScrollRevealProps {
  children: React.ReactNode;
  variant?: RevealVariant;
  as?: RevealAs;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Wraps content and adds scroll-triggered reveal animation.
 * Uses .reveal (single) or .reveal-stagger (children animate with 100ms delay each).
 */
export function ScrollReveal({
  children,
  variant = "heading",
  as: Component = "div",
  className,
  style,
}: ScrollRevealProps) {
  const ref = useScrollReveal<HTMLElement>();
  const revealClass = variant === "stagger" ? "reveal-stagger" : "reveal";

  return (
    <Component
      ref={ref as React.Ref<HTMLDivElement>}
      className={cn(revealClass, className)}
      style={style}
    >
      {children}
    </Component>
  );
}
