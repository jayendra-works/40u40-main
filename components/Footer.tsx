"use client";

import Image from "next/image";
import { motion } from "framer-motion";

type SocialLink = { label: string; href: string; icon: string };
type IconProps = { className?: string };

function InstagramIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden="true">
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function LinkedInIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden="true">
      <rect x="3.5" y="3.5" width="17" height="17" rx="2.8" />
      <line x1="8.2" y1="10.5" x2="8.2" y2="16.5" />
      <circle cx="8.2" cy="7.8" r="0.9" fill="currentColor" stroke="none" />
      <path d="M11.5 16.5v-3.3c0-1.3 0.9-2.3 2.1-2.3s2.1 1 2.1 2.3v3.3" />
    </svg>
  );
}

function MailIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden="true">
      <rect x="3.5" y="5.5" width="17" height="13" rx="2" />
      <path d="M4.5 7l7.5 6 7.5-6" />
    </svg>
  );
}

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Top Contenders", href: "/contenders" },
  { label: "Jury", href: "/jury" },
  { label: "Nominate", href: "/nominate" },
  { label: "Summit", href: "/summit" },
  { label: "FAQ", href: "/faq" },
];

export function Footer({
  footerAbout,
  socialLinks,
}: {
  footerAbout?: string;
  socialLinks?: SocialLink[];
} = {}) {
  const instagram = socialLinks?.find((s) => s.icon === "instagram");
  const linkedin = socialLinks?.find((s) => s.icon === "linkedin");
  const socialIconLinks = [
    {
      label: "Instagram",
      href: instagram?.href ?? "https://www.instagram.com/asiainc500",
      icon: InstagramIcon,
    },
    {
      label: "LinkedIn",
      href: linkedin?.href ?? "https://www.linkedin.com/company/asia-inc-500",
      icon: LinkedInIcon,
    },
    {
      label: "Contact",
      href: "mailto:40under40@asiainc500.com",
      icon: MailIcon,
    },
  ];

  return (
    <footer id="contact" className="w-full bg-[#0A0908] border-t border-[#EAE6E1]/5 overflow-hidden">
      {/* Big wordmark */}
      <div className="overflow-hidden py-16 md:py-24">
        <motion.h2
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="font-display text-[18vw] leading-none text-[#EAE6E1]/[0.04] uppercase whitespace-nowrap text-center select-none"
        >
          Asia Inc 500
        </motion.h2>
      </div>

      {/* Footer links row */}
      <div className="px-6 md:px-10 pb-10 flex flex-col md:flex-row items-center justify-between gap-8 border-t border-[#EAE6E1]/5 pt-8">
        {/* Left — brand */}
        <div className="flex flex-col items-center gap-1 md:items-start">
          <div className="mb-5 flex flex-wrap items-center justify-center gap-5 md:justify-start md:gap-6">
            <Image
              src="/Asia-Inc-500-logo.png"
              alt="Asia Inc 500"
              width={200}
              height={64}
              className="h-9 w-auto max-w-[min(200px,55vw)] object-contain object-center md:h-10 md:max-w-[220px] md:object-left"
            />
            <Image
              src="/asia_inc_korean.webp"
              alt="Asia Inc 500 — Korean"
              width={80}
              height={100}
              className="h-11 w-auto max-w-[min(88px,22vw)] object-contain object-center md:h-12 md:max-w-[96px] md:object-left"
            />
          </div>
          <span className="font-display text-lg tracking-[0.04em] uppercase text-[#EAE6E1]/50">
            40 Under 40
          </span>
          <span className="text-xs uppercase tracking-[0.3em] text-[#EAE6E1]/40 mt-1">
            Asia Inc 500 The 2026 Edition
          </span>
        </div>

        {/* Centre — nav */}
        <nav className="flex flex-wrap items-center justify-center gap-8 md:gap-10">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-[9px] uppercase tracking-[0.3em] font-medium text-[#EAE6E1]/30 hover:text-[#C5B397] transition-colors duration-300"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right — socials */}
        <div className="flex items-center gap-8">
          {socialIconLinks.map(({ label, href, icon: Icon }) => {
            const isExternal = href.startsWith("http");

            return (
              <a
                key={label}
                href={href}
                target={isExternal ? "_blank" : undefined}
                rel={isExternal ? "noopener noreferrer" : undefined}
                aria-label={label}
                className="group inline-flex items-center justify-center text-[#EAE6E1]/45 transition-colors duration-300 hover:text-[#C5B397]"
              >
                <Icon className="h-8 w-8 transition-transform duration-300 group-hover:scale-110" />
              </a>
            );
          })}
        </div>
      </div>

      {/* Copyright bar */}
      <div className="px-6 md:px-10 py-5 border-t border-[#EAE6E1]/[0.04] flex flex-col md:flex-row items-center justify-between gap-3">
        <p className="text-[8px] uppercase tracking-[0.25em] text-[#EAE6E1]/20">
          © {new Date().getFullYear()} Asia Inc 500 Media Group. All Rights Reserved.
        </p>
        <p className="text-[8px] uppercase tracking-[0.25em] text-[#EAE6E1]/20">
          <a href="https://40u40.asiainc500.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#EAE6E1]/40 transition-colors">
            40u40.asiainc500.com
          </a>
        </p>
      </div>
    </footer>
  );
}
