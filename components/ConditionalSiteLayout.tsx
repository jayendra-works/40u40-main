"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

type SocialLink = { label: string; href: string; icon: string };

export function ConditionalSiteLayout({
  children,
  footerAbout,
  socialLinks,
  showFooter = true,
}: {
  children: React.ReactNode;
  footerAbout?: string;
  socialLinks?: SocialLink[];
  showFooter?: boolean;
}) {
  const pathname = usePathname() ?? "";
  const isAdmin = pathname.startsWith("/admin") || pathname.startsWith("/jury/score");

  if (isAdmin) {
    return <div className="min-h-screen bg-[#131210] text-[#EAE6E1]">{children}</div>;
  }

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-gold focus:text-primary focus:rounded-lg"
      >
        Skip to main content
      </a>
      <Navbar />
      <main id="main-content">{children}</main>
      {showFooter && <Footer footerAbout={footerAbout} socialLinks={socialLinks} />}
    </>
  );
}
