"use client";

import { cn } from "@/lib/utils";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

export interface PersonCardGridProps {
  children: React.ReactNode;
  className?: string;
  /** Shown below the grid when fewer than 3 people (e.g. "More jury members to be announced"). */
  moreAnnouncement?: string | null;
}

/**
 * Centered grid for PersonCards: 280px fixed width, auto-fill, gap var(--space-lg).
 * When 1–2 cards, they are centered horizontally. Uses scroll reveal stagger for cards.
 */
export function PersonCardGrid({
  children,
  className,
  moreAnnouncement,
}: PersonCardGridProps) {
  return (
    <div className={cn("w-full", className)}>
      <ScrollReveal
        variant="stagger"
        className="grid grid-cols-1 justify-items-center md:[grid-template-columns:repeat(auto-fill,280px)] md:justify-center gap-lg"
        style={{ gap: "var(--space-lg)" }}
      >
        {children}
      </ScrollReveal>
      {moreAnnouncement && (
        <p
          className="text-text-tertiary italic text-center mt-xl"
          style={{
            color: "var(--color-text-tertiary)",
            fontSize: "0.9rem",
            marginTop: "var(--space-xl)",
          }}
        >
          {moreAnnouncement}
        </p>
      )}
    </div>
  );
}
