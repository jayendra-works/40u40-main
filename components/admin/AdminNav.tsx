"use client";

import { useState } from "react";
import Link from "next/link";

const BASE_NAV_LINKS = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/nominees", label: "Nominees" },
  { href: "/admin/jury", label: "Jury" },
  { href: "/admin/sponsors", label: "Sponsors" },
  { href: "/admin/content", label: "Content" },
  { href: "/admin/notices", label: "Notice board" },
  { href: "/admin/users", label: "Admin users" },
  { href: "/admin/site", label: "Site content" },
] as const;

const ADMIN_ONLY_NAV = [{ href: "/admin/summit-subscribers", label: "Summit alerts" }] as const;

function NavLinks({
  onNavigate,
  showSummitSubscribers,
}: {
  onNavigate?: () => void;
  showSummitSubscribers: boolean;
}) {
  const links = showSummitSubscribers
    ? [
        ...BASE_NAV_LINKS.slice(0, 4),
        ...ADMIN_ONLY_NAV,
        ...BASE_NAV_LINKS.slice(4),
      ]
    : [...BASE_NAV_LINKS];

  return (
    <>
      {links.map(({ href, label }) => (
        <Link
          key={href}
          href={href}
          onClick={onNavigate}
          className="block py-2 px-3 rounded text-neutral-400 hover:text-white hover:bg-white/5"
        >
          {label}
        </Link>
      ))}
    </>
  );
}

export function AdminNav({ showSummitSubscribers = false }: { showSummitSubscribers?: boolean }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-56 flex-shrink-0 flex-col border-r border-neutral-600 py-6 px-4">
        <Link href="/admin" className="font-display text-lg font-bold text-gold mb-6">
          Admin
        </Link>
        <nav className="space-y-1">
          <NavLinks showSummitSubscribers={showSummitSubscribers} />
        </nav>
        <div className="mt-auto pt-6 border-t border-neutral-600">
          <Link href="/" className="block py-2 px-3 rounded text-neutral-400 hover:text-white text-sm">
            Back to site
          </Link>
          <a href="/api/auth/signout" className="block py-2 px-3 rounded text-neutral-400 hover:text-white text-sm">
            Sign out
          </a>
        </div>
      </aside>

      {/* Mobile header */}
      <header className="md:hidden sticky top-0 z-30 flex items-center justify-between border-b border-neutral-600 bg-primary px-4 py-3">
        <Link href="/admin" className="font-display text-lg font-bold text-gold">
          Admin
        </Link>
        <button
          type="button"
          onClick={() => setMenuOpen(true)}
          className="p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 touch-manipulation"
          aria-label="Open menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </header>

      {/* Mobile menu overlay */}
      {menuOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 flex"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
        >
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setMenuOpen(false)}
            onKeyDown={(e) => e.key === "Escape" && setMenuOpen(false)}
          />
          <div className="relative w-full max-w-xs bg-primary border-r border-neutral-600 shadow-xl flex flex-col py-6 px-4">
            <div className="flex items-center justify-between mb-6">
              <span className="font-display text-lg font-bold text-gold">Menu</span>
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                className="p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 touch-manipulation"
                aria-label="Close menu"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <nav className="space-y-1 flex-1">
              <NavLinks showSummitSubscribers={showSummitSubscribers} onNavigate={() => setMenuOpen(false)} />
            </nav>
            <div className="pt-6 border-t border-neutral-600 space-y-1">
              <Link
                href="/"
                onClick={() => setMenuOpen(false)}
                className="block py-2 px-3 rounded text-neutral-400 hover:text-white text-sm"
              >
                Back to site
              </Link>
              <a
                href="/api/auth/signout"
                className="block py-2 px-3 rounded text-neutral-400 hover:text-white text-sm"
              >
                Sign out
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
