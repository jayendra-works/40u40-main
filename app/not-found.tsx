import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Page not found", robots: { index: false, follow: false } };

export default function NotFound() {
  return (
    <main className="grid min-h-[70svh] place-items-center bg-[#131210] px-6 pt-28 text-[#EAE6E1]">
      <section className="max-w-xl text-center">
        <p className="text-[10px] font-medium uppercase tracking-[0.35em] text-[#C5B397]">404 · Lost in the archive</p>
        <h1 className="mt-6 font-display text-6xl leading-none italic md:text-8xl">This page is not on the list.</h1>
        <p className="mx-auto mt-7 max-w-md text-sm leading-relaxed text-[#EAE6E1]/60">The address may have changed, or the page is no longer available.</p>
        <Link href="/" className="mt-10 inline-flex border border-[#C5B397]/60 px-6 py-3 text-[10px] font-medium uppercase tracking-[0.22em] text-[#C5B397] transition hover:bg-[#C5B397] hover:text-[#131210]">Return home</Link>
      </section>
    </main>
  );
}
