"use client";

import { useState, useEffect } from "react";
import { submitSummitVenueDateNotify } from "@/app/actions/summit-venue-notify";

const HASH = "#summit-venue-notify";

export function SummitVenueDateAnnouncementSection() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  useEffect(() => {
    const focusEmail = () => {
      if (typeof window === "undefined" || window.location.hash !== HASH) return;
      requestAnimationFrame(() => {
        document.getElementById("summit-notify-email")?.focus();
      });
    };
    focusEmail();
    window.addEventListener("hashchange", focusEmail);
    return () => window.removeEventListener("hashchange", focusEmail);
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setFeedback(null);
    const fd = new FormData();
    fd.set("email", email);
    const result = await submitSummitVenueDateNotify(fd);
    setLoading(false);
    if (result.success) {
      setFeedback({ type: "ok", text: result.message });
      setEmail("");
    } else {
      setFeedback({ type: "err", text: result.error });
    }
  }

  return (
    <section
      id="summit-venue-notify"
      aria-labelledby="summit-venue-announcement-heading"
      className="scroll-mt-[150px] border-t border-[#EAE6E1]/5 bg-[#0A0908] py-20 md:scroll-mt-[160px] md:py-28"
    >
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-14 px-6 md:grid-cols-2 md:gap-20 md:px-24 lg:gap-24">
        <div className="min-w-0">
          <p className="text-[9px] font-medium uppercase tracking-[0.35em] text-[#C5B397] md:text-[10px]">
            Venue &amp; date
          </p>
          <h2
            id="summit-venue-announcement-heading"
            className="mt-4 font-display text-4xl font-normal uppercase leading-[0.95] tracking-[0.02em] text-[#EAE6E1] md:text-5xl lg:text-6xl"
          >
            Announcement
          </h2>
          <p className="mt-2 font-display text-4xl font-normal uppercase leading-[0.95] tracking-[0.02em] text-[#C5B397] md:text-5xl lg:text-6xl">
            Coming soon
          </p>
          <p className="mt-8 max-w-lg text-[10px] font-medium uppercase leading-[1.85] tracking-[0.22em] text-[#EAE6E1]/45 md:text-[11px] md:tracking-[0.24em]">
            The venue and date for the Leadership Summit &amp; Awards 2026 will be announced shortly. Be the
            first to know.
          </p>
        </div>

        <div className="min-w-0 border border-[#EAE6E1]/20 p-8 md:p-10 lg:p-12">
          <p className="font-display text-lg italic leading-relaxed text-[#EAE6E1] md:text-xl">
            Get notified the moment the venue and date are announced.
          </p>

          <form onSubmit={onSubmit} className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-stretch">
            <label className="sr-only" htmlFor="summit-notify-email">
              Email address
            </label>
            <input
              id="summit-notify-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              className="min-h-[48px] flex-1 border border-[#EAE6E1]/25 bg-[#131210] px-4 py-3 text-[10px] font-medium uppercase tracking-[0.2em] text-[#EAE6E1] placeholder:text-[#EAE6E1]/35 placeholder:uppercase focus:border-[#C5B397]/50 focus:outline-none focus:ring-1 focus:ring-[#C5B397]/30 md:text-[11px]"
            />
            <button
              type="submit"
              disabled={loading}
              className="inline-flex min-h-[48px] shrink-0 items-center justify-center gap-2 border border-[#EAE6E1]/25 bg-transparent px-6 py-3 text-[10px] font-medium uppercase tracking-[0.28em] text-[#EAE6E1] transition-colors hover:border-[#C5B397] hover:text-[#C5B397] disabled:cursor-not-allowed disabled:opacity-50 md:text-[11px]"
            >
              {loading ? "Sending…" : "Notify me"}
              {!loading ? (
                <span aria-hidden className="text-xs font-light">
                  ›
                </span>
              ) : null}
            </button>
          </form>

          {feedback ? (
            <p
              role="status"
              className={`mt-4 text-sm leading-relaxed ${
                feedback.type === "ok" ? "text-[#C5B397]/90" : "text-red-300/90"
              }`}
            >
              {feedback.text}
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
