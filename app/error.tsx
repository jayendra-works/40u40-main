"use client";

import { useEffect } from "react";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error("Page rendering error:", error); }, [error]);
  return (
    <main className="grid min-h-[70svh] place-items-center bg-[#131210] px-6 text-[#EAE6E1]">
      <section className="max-w-xl text-center">
        <p className="text-[10px] font-medium uppercase tracking-[0.35em] text-[#C5B397]">Temporary issue</p>
        <h1 className="mt-6 font-display text-6xl leading-none italic md:text-8xl">Something interrupted the experience.</h1>
        <p className="mx-auto mt-7 max-w-md text-sm leading-relaxed text-[#EAE6E1]/60">Please try again. If the problem continues, contact our team at <a className="text-[#C5B397] underline" href="mailto:40under40@asiainc500.com">40under40@asiainc500.com</a>.</p>
        <button type="button" onClick={reset} className="mt-10 border border-[#C5B397]/60 px-6 py-3 text-[10px] font-medium uppercase tracking-[0.22em] text-[#C5B397] transition hover:bg-[#C5B397] hover:text-[#131210]">Try again</button>
      </section>
    </main>
  );
}
