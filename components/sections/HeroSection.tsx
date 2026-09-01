"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { CountdownTimer } from "./CountdownTimer";

const DEFAULT_HERO = {
  headline: "India's Game Changers.",
  accentText: "Crowned.",
  subheadline:
    "Recognizing the next generation of entrepreneurs, innovators, and changemakers shaping the future of India.",
};

const INTRO_WORDS =
  "Recognising the forty most visionary minds shaping the future of Asia's economy, culture, and society.".split(
    " "
  );

export function HeroSection({
  countdownDate,
  headline = DEFAULT_HERO.headline,
  accentText = DEFAULT_HERO.accentText,
  subheadline = DEFAULT_HERO.subheadline,
}: {
  countdownDate?: string;
  headline?: string;
  accentText?: string;
  subheadline?: string;
}) {
  return (
    <>
      {/* ── Hero ──────────────────────────────────────────────────── */}
      <section
        id="hero"
        className="relative h-[100svh] min-h-[800px] w-full flex items-center justify-center p-6 md:p-10 bg-[#131210] overflow-hidden"
      >
        {/* Animated golden ambient orbs */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <motion.div
            animate={{ x: [0, 100, -100, 0], y: [0, -100, 100, 0], scale: [1, 1.3, 1] }}
            transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
            className="absolute top-1/4 -left-1/4 w-[60vw] h-[60vw] bg-[#d4af37] rounded-full mix-blend-screen filter blur-[150px] opacity-30"
          />
          <motion.div
            animate={{ x: [0, -150, 150, 0], y: [0, 150, -150, 0], scale: [1, 1.5, 1] }}
            transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
            className="absolute bottom-1/4 -right-1/4 w-[70vw] h-[70vw] bg-[#c5b397] rounded-full mix-blend-screen filter blur-[150px] opacity-20"
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#131210_80%)]" />
        </div>

        <div className="relative z-10 flex flex-col items-center justify-center text-center mt-12 w-full max-w-5xl">
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center gap-4 mb-8"
          >
            <span className="w-12 h-[1px] bg-[#C5B397]" />
            <span className="text-xs md:text-sm uppercase tracking-[0.35em] font-medium text-[#C5B397]">
              Asia Inc 500 · The 2026 Edition
            </span>
            <span className="w-12 h-[1px] bg-[#C5B397]" />
          </motion.div>

          {/* Main headline */}
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-6xl md:text-8xl lg:text-[7rem] text-[#EAE6E1] leading-[0.9] tracking-tighter uppercase font-light"
          >
            {headline}{" "}
            <span className="italic text-[#C5B397]">{accentText}</span>
          </motion.h1>

          {/* Sub-headline */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="mt-10 text-[11px] md:text-[13px] text-[#EAE6E1]/60 tracking-[0.15em] max-w-2xl leading-loose font-light uppercase"
          >
            {subheadline}
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="mt-14 flex flex-col sm:flex-row gap-5 items-center"
          >
            <a
              href="/winners"
              className="bg-[#EAE6E1] text-[#131210] px-10 py-5 text-[10px] uppercase tracking-[0.3em] font-medium hover:bg-[#C5B397] hover:text-[#131210] transition-colors duration-500"
            >
              Meet the Honorees
            </a>
            <a
              href="/nominate"
              className="group flex items-center gap-3 text-[#EAE6E1] px-10 py-5 text-[10px] uppercase tracking-[0.3em] font-medium border border-[#EAE6E1]/30 hover:bg-[#EAE6E1]/5 transition-colors duration-500"
            >
              <span>Apply / Nominate</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </a>
          </motion.div>
        </div>

        {/* Bottom scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.6 }}
          className="absolute bottom-10 left-10 right-10 z-10 flex justify-between items-end text-[9px] uppercase tracking-[0.3em] font-medium opacity-40"
        >
          <span className="hidden md:block">Scroll to explore</span>
          <div className="ml-auto flex items-center gap-3">
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
              className="w-[1px] h-8 bg-[#C5B397]/60"
            />
          </div>
        </motion.div>
      </section>

      {/* ── Countdown section ──────────────────────────────────────── */}
      {countdownDate && (
        <section className="py-16 md:py-24 bg-[#0D0C0A] border-y border-[#EAE6E1]/5">
          <div className="max-w-4xl mx-auto text-center px-6">
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-[10px] uppercase tracking-[0.35em] font-medium text-[#EAE6E1]/40 block mb-10"
            >
              Nominations close in
            </motion.span>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            >
              <CountdownTimer targetDate={countdownDate} />
            </motion.div>
          </div>
        </section>
      )}

      {/* ── Vision statement (after countdown) ─────────────────────── */}
      <section className="bg-[#0D0C0A] py-32 md:py-56 px-6 md:px-24">
        <div className="max-w-7xl mx-auto">
          <p className="font-display text-4xl md:text-6xl lg:text-7xl leading-[1.15] flex flex-wrap gap-x-3 md:gap-x-5 gap-y-1">
            {INTRO_WORDS.map((word, i) => (
              <span key={i} className="overflow-hidden inline-flex">
                <motion.span
                  initial={{ y: "100%" }}
                  whileInView={{ y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8, delay: i * 0.045, ease: [0.16, 1, 0.3, 1] }}
                  className={
                    word.toLowerCase() === "asia's"
                      ? "italic text-[#C5B397]"
                      : "text-[#EAE6E1]"
                  }
                >
                  {word}
                </motion.span>
              </span>
            ))}
          </p>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.8 }}
            className="mt-16 flex items-center gap-6"
          >
            <span className="w-10 h-[1px] bg-[#C5B397]" />
            <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.35em] font-medium text-[#EAE6E1]/35">
              Asia Inc 500 40 Under 40
            </span>
          </motion.div>
        </div>
      </section>
    </>
  );
}
