"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";

export interface SpeakerCardProps {
  name: string;
  title: string;
  organization: string;
  imageUrl?: string | null;
  bio?: string | null;
  placeholder?: boolean;
  /** When true and onClick is set, the card is clickable (e.g. to open a modal). */
  clickable?: boolean;
  onClick?: () => void;
}

const PLACEHOLDER_AVATAR = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2352525b'%3E%3Cpath d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'/%3E%3C/svg%3E";

export function SpeakerCard({
  name,
  title,
  organization,
  imageUrl,
  bio,
  placeholder,
  clickable,
  onClick,
}: SpeakerCardProps) {
  const isClickable = Boolean(clickable && onClick);

  const content = (
    <Card hover={!isClickable}>
      <div className="flex flex-col items-center text-center">
        <div className="relative w-24 h-24 rounded-full overflow-hidden bg-neutral-600 mb-4">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={name}
              fill
              className="object-cover"
              sizes="96px"
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
        <h3 className="font-display font-bold text-white">{name}</h3>
        <p className="text-gold text-sm mt-0.5">{title}</p>
        <p className="text-neutral-400 text-sm mt-1">{organization}</p>
        {bio && (
          <p className="text-neutral-500 text-xs mt-2 line-clamp-3 leading-relaxed">
            {bio}
          </p>
        )}
        {placeholder && (
          <p className="text-neutral-500 text-xs mt-2 italic">
            Jury member to be announced
          </p>
        )}
      </div>
    </Card>
  );

  if (isClickable) {
    return (
      <button
        type="button"
        onClick={onClick}
        className="w-full text-left cursor-pointer border-none bg-transparent p-0 rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-primary"
      >
        {content}
      </button>
    );
  }

  return content;
}
