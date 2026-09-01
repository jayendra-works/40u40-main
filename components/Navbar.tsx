"use client";

import { useState, useEffect, useLayoutEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const NAVBAR_LINKS = [
  { label: "Home", href: "/", menuOnly: false },
  { label: "The Top Contenders", href: "/contenders", menuOnly: false },
  { label: "Jury", href: "/jury", menuOnly: false },
  { label: "Nominate", href: "/nominate", menuOnly: false },
  { label: "Summit", href: "/summit", menuOnly: false },
  { label: "Finalists", href: "/finalists", menuOnly: false },
  { label: "FAQ", href: "/faq", menuOnly: true },
] as const;

function parseHref(href: string): { path: string; hash: string } {
  const i = href.indexOf("#");
  if (i === -1) return { path: href, hash: "" };
  const path = href.slice(0, i) || "/";
  const hash = href.slice(i + 1);
  return { path, hash };
}

function normalizeUrlHash(hash: string): string {
  if (!hash) return "";
  return hash.startsWith("#") ? hash.slice(1) : hash;
}

/** Uses pathname + location hash so /summit, /summit#agenda, /summit#contenders are mutually exclusive. */
function navLinkIsActive(appPathname: string | null, href: string, urlHash: string): boolean {
  if (!appPathname) return false;
  const { path: linkPath, hash: linkHash } = parseHref(href);
  const current = normalizeUrlHash(urlHash);

  if (linkPath === "/") {
    if (appPathname !== "/") return false;
    if (!linkHash) return !current;
    return current === linkHash;
  }

  const pathMatches = appPathname === linkPath || appPathname.startsWith(`${linkPath}/`);
  if (!pathMatches) return false;

  if (!linkHash) {
    if (linkPath === "/summit") {
      return !current;
    }
    return true;
  }

  return current === linkHash;
}

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [headerVisible, setHeaderVisible] = useState(true);
  const lastScrollY = useRef(0);
  const pathname = usePathname();
  const [urlHash, setUrlHash] = useState("");

  useLayoutEffect(() => {
    setUrlHash(typeof window !== "undefined" ? window.location.hash : "");
  }, [pathname]);

  useEffect(() => {
    const syncHash = () => setUrlHash(window.location.hash || "");
    window.addEventListener("hashchange", syncHash);
    window.addEventListener("popstate", syncHash);
    return () => {
      window.removeEventListener("hashchange", syncHash);
      window.removeEventListener("popstate", syncHash);
    };
  }, []);

  // Smart header: hide on scroll down, show on scroll up
  useEffect(() => {
    const threshold = 10;
    const handleScroll = () => {
      const currentY = window.scrollY;
      if (currentY < 80) {
        setHeaderVisible(true);
      } else if (currentY - lastScrollY.current > threshold) {
        setHeaderVisible(false);
      } else if (lastScrollY.current - currentY > threshold) {
        setHeaderVisible(true);
      }
      lastScrollY.current = currentY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <>
      <header
        className="fixed top-0 inset-x-0 z-50 grid h-[80px] grid-cols-[auto_auto_auto] items-center gap-4 px-6 transition-transform duration-500 md:gap-6 md:px-10 bg-[#131210]/80 backdrop-blur-md border-b border-[#EAE6E1]/5 overflow-visible"
        style={{
          transform: headerVisible ? "translateY(0)" : "translateY(-100%)",
          transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        {/* Logo left */}
        <Link href="/" className="group justify-self-start overflow-visible" aria-label="40 Under 40 Home">
          <Image
            src="/40u40_logo.webp"
            alt="40 Under 40"
            width={300}
            height={300}
            className="h-20 w-auto object-contain transition-transform duration-500 group-hover:scale-105 sm:h-[5.5rem] md:h-24"
            priority
          />
        </Link>

        {/* Desktop: primary links, centered in the bar */}
        <nav
          className="hidden justify-center justify-self-center md:flex"
          aria-label="Primary"
        >
          <ul className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 lg:gap-x-12 xl:gap-x-14">
            {NAVBAR_LINKS.filter((link) => !link.menuOnly).map((link) => {
              const isActive = navLinkIsActive(pathname, link.href, urlHash);
              return (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className={`whitespace-nowrap text-[11px] font-medium uppercase tracking-[0.28em] transition-colors duration-300 relative group ${
                      isActive ? "text-[#EAE6E1]" : "text-[#EAE6E1]/50 hover:text-[#EAE6E1]"
                    }`}
                  >
                    {link.label}
                    <span
                      className={`absolute -bottom-1 left-0 h-[1px] bg-[#C5B397] transition-all duration-500 ${
                        isActive ? "w-full" : "w-0 group-hover:w-full"
                      }`}
                    />
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Right — menu button */}
        <div className="flex shrink-0 items-center justify-self-end">
          <button
            className="text-[11px] uppercase tracking-[0.3em] font-medium text-[#EAE6E1]/70 hover:text-[#EAE6E1] transition-colors duration-300"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
          >
            Menu
          </button>
        </div>
      </header>

      {/* ─── Full-screen overlay menu ─────────────────────────────────── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[60] bg-[#0D0C0A] text-[#EAE6E1] flex flex-col justify-center overflow-hidden"
          >
            {/* Ambient orb */}
            <div className="absolute top-1/4 right-1/4 w-[50vw] h-[50vw] bg-[#d4af37] rounded-full filter blur-[200px] opacity-[0.06] pointer-events-none" />

            {/* Close button */}
            <div className="absolute top-6 right-6 md:top-8 md:right-10">
              <button
                onClick={() => setMenuOpen(false)}
                className="text-[9px] uppercase tracking-[0.3em] font-medium text-[#EAE6E1]/50 hover:text-[#EAE6E1] transition-colors flex items-center gap-3"
              >
                <span className="w-8 h-[1px] bg-[#EAE6E1]/30" />
                Close
              </button>
            </div>

            {/* Branding top-left */}
            <div className="absolute top-6 left-6 md:top-8 md:left-10 flex flex-col">
              <span className="font-['var(--font-cormorant)',serif] text-[18px] tracking-[0.04em] uppercase text-[#EAE6E1]/50" style={{ fontFamily: "var(--font-cormorant), serif" }}>
                40 Under 40
              </span>
              <span className="text-[8px] uppercase tracking-[0.35em] font-medium text-[#EAE6E1]/20">
                Asia Inc 500
              </span>
            </div>

            {/* Nav links */}
            <nav className="px-10 md:px-24 flex flex-col">
              {NAVBAR_LINKS.map((link, i) => (
                <div key={`${link.href}-${link.label}`} className="overflow-hidden border-b border-[#EAE6E1]/5 py-2 md:py-3">
                  <motion.div
                    initial={{ y: "110%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "-110%" }}
                    transition={{
                      duration: 0.8,
                      delay: i * 0.08,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="flex items-center justify-between group"
                  >
                    <a
                      href={link.href}
                      onClick={() => setMenuOpen(false)}
                      className="font-display text-4xl md:text-6xl lg:text-7xl hover:italic transition-all duration-500 text-[#EAE6E1] hover:text-[#C5B397] flex items-center gap-6"
                    >
                      <span className="text-[10px] font-sans not-italic text-[#EAE6E1]/20 uppercase tracking-[0.3em] font-medium w-8">
                        0{i + 1}
                      </span>
                      {link.label}
                    </a>
                    <ArrowUpRight className="w-5 h-5 text-[#EAE6E1]/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </motion.div>
                </div>
              ))}
            </nav>

            {/* Bottom meta */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 1 }}
              className="absolute bottom-8 left-10 md:left-24 right-10 flex flex-col md:flex-row md:items-end justify-between gap-6"
            >
              <div className="flex flex-col gap-1 text-[9px] uppercase tracking-[0.25em] text-[#EAE6E1]/30 font-medium">
                <p>© 2026 Asia Inc 500</p>
                <p>All Rights Reserved</p>
              </div>
              <div className="flex items-center gap-8 text-[9px] uppercase tracking-[0.25em] text-[#EAE6E1]/30 font-medium">
                <a href="https://www.instagram.com/asiainc500" target="_blank" rel="noopener noreferrer" className="hover:text-[#EAE6E1]/60 transition-colors">Instagram</a>
                <a href="https://www.linkedin.com/company/asia-inc-500" target="_blank" rel="noopener noreferrer" className="hover:text-[#EAE6E1]/60 transition-colors">LinkedIn</a>
                <a href="mailto:40under40@asiainc500.com" className="hover:text-[#EAE6E1]/60 transition-colors">Contact</a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
