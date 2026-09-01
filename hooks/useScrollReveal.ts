"use client";

import { useEffect, useRef } from "react";

const DEFAULT_OPTIONS: IntersectionObserverInit = {
  threshold: 0.15,
  rootMargin: "0px",
};

/**
 * Adds .is-visible to the element when it enters the viewport (threshold 0.15).
 * Only fires once; does not remove the class on scroll up.
 */
export function useScrollReveal<T extends HTMLElement = HTMLElement>(options?: Partial<IntersectionObserverInit>) {
  const ref = useRef<T | null>(null);
  const hasRevealed = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (!entry?.isIntersecting || hasRevealed.current) return;
        hasRevealed.current = true;
        el.classList.add("is-visible");
      },
      { ...DEFAULT_OPTIONS, ...options }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [options?.threshold, options?.rootMargin]);

  return ref;
}
