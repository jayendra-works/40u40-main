"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

const PLACEHOLDER_AVATAR =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2352525b'%3E%3Cpath d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'/%3E%3C/svg%3E";

const PHOTO_SIZE = 88;
const PHOTO_RING_SHADOW = `0 0 0 3px var(--color-bg-card), 0 0 0 5px var(--color-gold-primary)`;

export interface PersonCardProps {
  name: string;
  title: string;
  organization: string;
  /** Professional headshot URL; use a clean image without social/LinkedIn badge overlays. */
  imageUrl?: string | null;
  bio?: string | null;
  placeholder?: boolean;
  /** When true and onClick is set, the card is clickable (e.g. to open a modal). */
  clickable?: boolean;
  onClick?: () => void;
}

export function PersonCard({
  name,
  title,
  organization,
  imageUrl,
  bio,
  placeholder,
  clickable,
  onClick,
}: PersonCardProps) {
  const bioRef = useRef<HTMLParagraphElement>(null);
  const [bioTruncated, setBioTruncated] = useState(false);
  const isClickable = Boolean(clickable && onClick);

  useEffect(() => {
    const el = bioRef.current;
    if (!el || !bio) return;
    setBioTruncated(el.scrollHeight > el.clientHeight);
  }, [bio]);

  const cardContent = (
    <div
      className={cn(
        "w-[280px] flex flex-col items-center text-center rounded-[4px] border transition-colors duration-200",
        "border-[var(--color-border-muted)] hover:border-[var(--color-border)]"
      )}
      style={{
        backgroundColor: "var(--color-bg-card)",
        paddingTop: "var(--space-lg)",
        paddingLeft: "var(--space-md)",
        paddingRight: "var(--space-md)",
        paddingBottom: "var(--space-md)",
      }}
    >
      {/* Photo: 88px, gold ring */}
      <div
        className="relative shrink-0 rounded-full overflow-hidden bg-[var(--color-border-muted)]"
        style={{
          width: PHOTO_SIZE,
          height: PHOTO_SIZE,
          border: "2px solid var(--color-gold-primary)",
          boxShadow: PHOTO_RING_SHADOW,
        }}
      >
        {imageUrl && !placeholder ? (
          <Image
            src={imageUrl}
            alt={name}
            fill
            className="object-cover"
            sizes="88px"
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element -- inline data URI placeholder
          <img
            src={PLACEHOLDER_AVATAR}
            alt=""
            className="w-full h-full object-cover"
          />
        )}
      </div>

      {/* Name */}
      <h3
        className="font-display font-semibold text-text-primary mt-md"
        style={{
          marginTop: "var(--space-md)",
          fontSize: "1.05rem",
        }}
      >
        {placeholder ? "To be announced" : name}
      </h3>

      {/* Title/Role */}
      <p
        className="text-gold font-medium"
        style={{
          color: "var(--color-gold-primary)",
          fontSize: "0.85rem",
          marginTop: 4,
        }}
      >
        {placeholder ? "Jury Member" : title}
      </p>

      {/* Company */}
      {organization && (
        <p
          className="text-text-secondary"
          style={{ fontSize: "0.85rem", marginTop: 2 }}
        >
          {organization}
        </p>
      )}

      {/* Bio (max 3 lines) + Read more when truncated */}
      {bio && !placeholder && (
        <div className="w-full mt-sm" style={{ marginTop: "var(--space-sm)" }}>
          <p
            ref={bioRef}
            className="text-text-tertiary text-center"
            style={{
              fontSize: "0.8rem",
              lineHeight: 1.5,
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            } as React.CSSProperties}
          >
            {bio}
          </p>
          {bioTruncated && isClickable && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onClick?.();
              }}
              className="mt-1.5 text-gold text-[0.8rem] font-medium hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg-card)] rounded"
              style={{ color: "var(--color-gold-primary)" }}
            >
              Read more
            </button>
          )}
        </div>
      )}

      {placeholder && (
        <p
          className="text-text-tertiary italic mt-sm"
          style={{
            marginTop: "var(--space-sm)",
            fontSize: "0.8rem",
          }}
        >
          To be announced
        </p>
      )}
    </div>
  );

  if (isClickable) {
    return (
      <button
        type="button"
        onClick={onClick}
        className="text-left cursor-pointer border-none bg-transparent p-0 rounded-[4px] focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg-primary)]"
      >
        {cardContent}
      </button>
    );
  }

  return cardContent;
}
