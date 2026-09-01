"use client";

import Image from "next/image";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ArrowUpRight, X } from "lucide-react";
import { useEffect, useState } from "react";

type Notice = { id: string; title: string; eyebrow: string | null; description: string | null; image: string | null; ctaLabel: string | null; ctaUrl: string | null };

export function NoticeBoard({ notice }: { notice: Notice | null }) {
  const reducedMotion = useReducedMotion();
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!notice || sessionStorage.getItem(`notice-${notice.id}`)) return;
    const timer = window.setTimeout(() => setOpen(true), reducedMotion ? 0 : 450);
    return () => window.clearTimeout(timer);
  }, [notice, reducedMotion]);
  if (!notice) return null;
  const close = () => { sessionStorage.setItem(`notice-${notice.id}`, "seen"); setOpen(false); };
  return <AnimatePresence>{open && <motion.section role="dialog" aria-modal="true" aria-labelledby="notice-title" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="notice-board fixed inset-0 z-[110] grid place-items-center overflow-y-auto bg-black/75 p-4 backdrop-blur-sm" onClick={close}>
    <motion.div initial={{ opacity: 0, y: reducedMotion ? 0 : 28, scale: reducedMotion ? 1 : .98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 12 }} transition={{ duration: .55, ease: [.16, 1, .3, 1] }} onClick={(event) => event.stopPropagation()} className="relative w-full max-w-3xl overflow-hidden border border-[#c5b397]/55 bg-[#100f0d] shadow-[0_32px_90px_rgba(0,0,0,.65)]">
      <div className="absolute inset-0 opacity-40 [background:radial-gradient(circle_at_78%_0%,rgba(197,179,151,.26),transparent_38%)]" />
      <button type="button" onClick={close} className="absolute right-4 top-4 z-10 grid h-11 w-11 place-items-center border border-[#eae6e1]/30 bg-[#0a0908]/70 text-[#eae6e1] transition hover:border-[#c5b397] hover:text-[#c5b397]" aria-label="Close announcement"><X size={18} /></button>
      <div className="relative grid md:grid-cols-[1.12fr_.88fr]">
        <div className="relative min-h-[250px] md:min-h-[430px]">{notice.image ? <Image unoptimized src={notice.image} alt="" fill priority sizes="(max-width: 768px) 100vw, 65vw" className="object-cover" /> : <div className="h-full bg-[linear-gradient(135deg,#252019,#0a0908)]" />}<div className="absolute inset-0 bg-gradient-to-t from-[#0a0908]/65 via-transparent to-transparent" /><p className="absolute bottom-5 left-6 text-[10px] uppercase tracking-[.34em] text-[#eae6e1]/70">Asia Inc. 500 · Editorial Dispatch</p></div>
        <div className="flex flex-col justify-center px-7 py-12 md:px-9">{notice.eyebrow && <p className="text-[9px] font-medium uppercase tracking-[.32em] text-[#c5b397]">{notice.eyebrow}</p>}<h2 id="notice-title" className="mt-5 font-display text-5xl leading-[.86] tracking-[-.045em] text-[#eae6e1] md:text-6xl">{notice.title}</h2>{notice.description && <p className="mt-6 text-sm leading-relaxed text-[#eae6e1]/68">{notice.description}</p>}{notice.ctaUrl && <a href={notice.ctaUrl} onClick={close} className="mt-9 inline-flex w-fit items-center gap-2 border-b border-[#c5b397] pb-2 text-[10px] font-medium uppercase tracking-[.23em] text-[#c5b397]">{notice.ctaLabel || "Discover more"}<ArrowUpRight size={14} /></a>}<button type="button" onClick={close} className="mt-8 w-fit text-[9px] uppercase tracking-[.25em] text-[#eae6e1]/50 transition hover:text-[#c5b397]">Continue to site</button></div>
      </div>
    </motion.div>
  </motion.section>}</AnimatePresence>;
}
