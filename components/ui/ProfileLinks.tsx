"use client";

import React from "react";

function IconButton({
  href,
  label,
  icon,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="inline-flex items-center justify-center border border-[#EAE6E1]/10 p-2 text-[#EAE6E1]/40 hover:text-[#C5B397] hover:border-[#C5B397]/30 transition-colors duration-300 focus:outline-none"
    >
      {icon}
    </a>
  );
}

const ICONS = {
  linkedin: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  ),
  instagram: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8a4 4 0 0 1 3.37 3.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  ),
  website: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20" />
      <path d="M12 2a15 15 0 0 1 0 20" />
      <path d="M12 2a15 15 0 0 0 0 20" />
    </svg>
  ),
  profile: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
} as const;

export type ProfileLinksProps = {
  linkedinUrl?: string | null;
  instagramUrl?: string | null;
  websiteUrl?: string | null;
  profileUrl?: string | null;
  className?: string;
};

export function ProfileLinks({
  linkedinUrl,
  instagramUrl,
  websiteUrl,
  profileUrl,
  className,
}: ProfileLinksProps) {
  const links: Array<{ href: string; label: string; icon: React.ReactNode }> = [];

  if (linkedinUrl) links.push({ href: linkedinUrl, label: "LinkedIn", icon: ICONS.linkedin });
  if (instagramUrl) links.push({ href: instagramUrl, label: "Instagram", icon: ICONS.instagram });
  if (websiteUrl) links.push({ href: websiteUrl, label: "Website", icon: ICONS.website });
  if (profileUrl) links.push({ href: profileUrl, label: "Profile", icon: ICONS.profile });

  if (links.length === 0) return null;

  return (
    <div className={className ?? "flex flex-wrap gap-2"}>
      {links.map((l) => (
        <IconButton key={l.label} href={l.href} label={l.label} icon={l.icon} />
      ))}
    </div>
  );
}

