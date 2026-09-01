"use client";

import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, ArrowUpRight, ChevronDown, Search, Share2, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { FinalistProfile } from "@/lib/finalists";
import { getFinalistCategories } from "@/lib/finalists";

const EASE = [0.16, 1, 0.3, 1] as const;
const EMPTY_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 6 8'%3E%3Crect width='6' height='8' fill='%231b1916'/%3E%3C/svg%3E";

function indexLabel(index: number) {
  return String(index + 1).padStart(2, "0");
}

function contains(finalist: FinalistProfile, query: string) {
  if (!query) return true;
  const haystack = [finalist.name, finalist.title, finalist.organization, finalist.category, finalist.bio]
    .filter(Boolean)
    .join(" ")
    .toLocaleLowerCase();
  return haystack.includes(query.toLocaleLowerCase());
}

export function FinalFortyExperience({ finalists, initialSlug }: { finalists: FinalistProfile[]; initialSlug?: string }) {
  const reducedMotion = useReducedMotion();
  const [introVisible, setIntroVisible] = useState(false);
  const [introResolved, setIntroResolved] = useState(false);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [indexOpen, setIndexOpen] = useState(false);
  const [selectedSlug, setSelectedSlug] = useState<string | null>(initialSlug ?? null);
  const [cursor, setCursor] = useState({ x: -80, y: -80, active: false });
  const [shareMessage, setShareMessage] = useState("");
  const scrollY = useRef(0);
  const touchStart = useRef<number | null>(null);
  const categories = useMemo(() => getFinalistCategories(finalists), [finalists]);
  const selected = finalists.find((finalist) => finalist.slug === selectedSlug) ?? null;
  const selectedIndex = selected ? finalists.findIndex((finalist) => finalist.id === selected.id) : -1;
  const visible = useMemo(
    () => finalists.filter((finalist) => (category === "All" || finalist.category === category) && contains(finalist, query)),
    [category, finalists, query],
  );

  useEffect(() => {
    if (initialSlug || reducedMotion || sessionStorage.getItem("final-40-intro-v1")) { setIntroResolved(true); return; }
    setIntroVisible(true); setIntroResolved(true);
    const timer = window.setTimeout(() => {
      sessionStorage.setItem("final-40-intro-v1", "1");
      setIntroVisible(false);
    }, 2800);
    return () => window.clearTimeout(timer);
  }, [initialSlug, reducedMotion]);

  const closeIntro = useCallback(() => {
    sessionStorage.setItem("final-40-intro-v1", "1");
    setIntroVisible(false);
  }, []);

  const openProfile = useCallback((slug: string, updateHistory = true) => {
    scrollY.current = window.scrollY;
    setSelectedSlug(slug);
    if (updateHistory) window.history.pushState({ finalist: slug }, "", `/finalists/${slug}`);
  }, []);

  const closeProfile = useCallback((updateHistory = true) => {
    setSelectedSlug(null);
    if (updateHistory) window.history.pushState({}, "", "/finalists");
    window.requestAnimationFrame(() => window.scrollTo(0, scrollY.current));
  }, []);

  const stepProfile = useCallback((direction: number) => {
    if (selectedIndex < 0 || finalists.length < 2) return;
    const next = finalists[(selectedIndex + direction + finalists.length) % finalists.length];
    openProfile(next.slug);
  }, [finalists, openProfile, selectedIndex]);

  useEffect(() => {
    const onPopState = () => {
      const slug = window.location.pathname.split("/")[2];
      setSelectedSlug(finalists.some((finalist) => finalist.slug === slug) ? slug : null);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (!selected) return;
      if (event.key === "Escape") closeProfile();
      if (event.key === "ArrowLeft") stepProfile(-1);
      if (event.key === "ArrowRight") stepProfile(1);
    };
    window.addEventListener("popstate", onPopState);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("popstate", onPopState);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [closeProfile, finalists, selected, stepProfile]);

  useEffect(() => {
    document.body.style.overflow = selected || indexOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [indexOpen, selected]);

  const share = async () => {
    if (!selected) return;
    const url = `${window.location.origin}/finalists/${selected.slug}`;
    try {
      if (navigator.share) await navigator.share({ title: `${selected.name} | The Final 40`, text: selected.title, url });
      else {
        await navigator.clipboard.writeText(url);
        setShareMessage("Profile link copied");
        window.setTimeout(() => setShareMessage(""), 2200);
      }
    } catch { /* A cancelled native share should not interrupt browsing. */ }
  };

  return (
    <main className={`final-forty min-h-screen overflow-x-clip bg-[#0a0908] text-[#eae6e1] transition-opacity duration-300 ${introResolved ? "opacity-100" : "opacity-0"}`}>
      <Cursor cursor={cursor} reducedMotion={!!reducedMotion} />
      <Intro visible={introVisible} onSkip={closeIntro} />

      <section className="relative isolate min-h-[92svh] overflow-hidden border-b border-[#eae6e1]/10 pt-28">
        <div className="final-forty-atmosphere absolute inset-0 -z-10" aria-hidden />
        <div className="mx-auto grid max-w-[1600px] gap-10 px-6 pb-14 md:px-12 lg:grid-cols-[minmax(0,1fr)_minmax(440px,0.86fr)] lg:items-end lg:px-20 xl:px-28">
          <div className="relative z-10 pt-16 lg:pb-14">
            <p className="mb-8 text-[9px] font-medium uppercase tracking-[0.42em] text-[#c5b397]">Asia Inc. 500 · 40 Under 40 · The 2026 Edition</p>
            <h1 className="max-w-4xl font-display text-[clamp(4.7rem,13vw,13rem)] leading-[0.72] tracking-[-0.075em] text-[#eae6e1]">
              THE <span className="italic text-[#c5b397]">FINAL</span> 40
            </h1>
            <p className="mt-10 max-w-md text-base font-light leading-relaxed text-[#eae6e1]/65 md:text-lg">
              The finalists announced so far. One generation shaping what comes next.
            </p>
            <div className="mt-12 flex items-end gap-5" aria-label={`${finalists.length} announced finalists`}>
              <span className="font-display text-8xl leading-none text-[#c5b397] md:text-9xl">{finalists.length}</span>
              <span className="mb-2 text-[10px] font-medium uppercase tracking-[0.3em] text-[#eae6e1]/55">of 40 announced<br />finalists</span>
            </div>
            <div className="mt-14 flex flex-wrap gap-3">
              <a href="#the-collection" className="final-forty-button">Enter the collection <ChevronDown size={14} aria-hidden /></a>
              <button type="button" onClick={() => setIndexOpen(true)} className="final-forty-button final-forty-button--quiet">The {finalists.length}</button>
            </div>
          </div>
          <PortraitField finalists={finalists} onOpen={openProfile} reducedMotion={!!reducedMotion} />
        </div>
        <div className="absolute bottom-6 left-6 text-[8px] uppercase tracking-[0.35em] text-[#eae6e1]/35 md:left-12 lg:left-20">Scroll to explore</div>
      </section>

      <section id="the-collection" className="relative mx-auto max-w-[1680px] px-6 py-24 md:px-12 md:py-32 lg:px-20 xl:px-28">
        <div className="mb-14 flex flex-col justify-between gap-8 border-b border-[#eae6e1]/12 pb-8 lg:flex-row lg:items-end">
          <div>
            <p className="text-[9px] font-medium uppercase tracking-[0.38em] text-[#c5b397]">The collection</p>
            <h2 className="mt-5 font-display text-5xl tracking-[-0.05em] md:text-7xl">Discover the <i>finalists.</i></h2>
          </div>
            <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-[#eae6e1]/55" aria-live="polite">{visible.length} / {finalists.length} {category === "All" ? "finalists" : category}</p>
        </div>

        <div className="sticky top-[80px] z-30 -mx-6 mb-12 border-y border-[#eae6e1]/10 bg-[#0a0908]/95 px-6 py-4 backdrop-blur-xl md:-mx-12 md:px-12 lg:-mx-20 lg:px-20 xl:-mx-28 xl:px-28">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <label className="group flex max-w-md items-center gap-3 border-b border-[#eae6e1]/20 pb-2 text-[#eae6e1]/50 focus-within:border-[#c5b397]">
              <Search size={15} aria-hidden />
              <input value={query} onFocus={() => setIndexOpen(true)} onChange={(event) => setQuery(event.target.value)} placeholder="SEARCH THE 40" aria-label="Search finalists" className="w-full bg-transparent text-[10px] uppercase tracking-[0.24em] text-[#eae6e1] outline-none placeholder:text-[#eae6e1]/35" />
            </label>
            <div className="flex max-w-full gap-2 overflow-x-auto pb-1" role="group" aria-label="Filter finalists by category">
              {["All", ...categories].map((item) => <button key={item} type="button" onClick={() => setCategory(item)} aria-pressed={category === item} className={`final-forty-filter ${category === item ? "is-active" : ""}`}>{item}</button>)}
            </div>
          </div>
        </div>

        {visible.length ? <div className="final-forty-wall">
          <AnimatePresence mode="popLayout">
            {visible.map((finalist) => {
              const index = finalists.findIndex((item) => item.id === finalist.id);
              return <FinalistCard key={finalist.id} finalist={finalist} index={index} onOpen={openProfile} onCursor={setCursor} reducedMotion={!!reducedMotion} />;
            })}
          </AnimatePresence>
        </div> : <div className="border border-[#eae6e1]/12 px-8 py-20 text-center"><p className="font-display text-4xl italic">No story found.</p><p className="mt-4 text-[10px] uppercase tracking-[0.25em] text-[#eae6e1]/45">Try a name, company, role, or category.</p></div>}
      </section>

      <ScrollProgress finalists={finalists} />
      <FinalistIndex open={indexOpen} onClose={() => setIndexOpen(false)} finalists={finalists} onOpen={(slug) => { setIndexOpen(false); openProfile(slug); }} />
      <ProfileExperience finalist={selected} index={selectedIndex} total={finalists.length} onClose={closeProfile} onStep={stepProfile} onShare={share} shareMessage={shareMessage} touchStart={touchStart} />
    </main>
  );
}

function PortraitField({ finalists, onOpen, reducedMotion }: { finalists: FinalistProfile[]; onOpen: (slug: string) => void; reducedMotion: boolean }) {
  const field = finalists.slice(0, 7);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  return <div className="final-forty-field relative min-h-[440px] self-stretch" aria-label="A spatial preview of the finalist collection">
    {field.map((finalist, index) => <div key={finalist.id} onMouseEnter={() => setActiveIndex(index)} onMouseLeave={() => setActiveIndex(null)} className={`final-forty-orbit final-forty-orbit-${index + 1} ${activeIndex === index ? "is-hovered" : ""} ${reducedMotion ? "motion-reduce" : ""}`}><button type="button" onFocus={() => setActiveIndex(index)} onBlur={() => setActiveIndex(null)} onClick={() => onOpen(finalist.slug)} className="final-forty-orbit-card" aria-label={`Open ${finalist.name}'s profile`}>
      <Image unoptimized priority src={finalist.photo ?? EMPTY_IMAGE} alt="" fill sizes="(max-width: 1024px) 32vw, 18vw" className="object-cover" />
      <span><b>{indexLabel(index)}</b>{finalist.name}<em>{finalist.category ?? "Finalist"}</em></span>
    </button></div>)}
    <div className="final-forty-field-number" aria-hidden>40</div>
  </div>;
}

function FinalistCard({ finalist, index, onOpen, onCursor, reducedMotion }: { finalist: FinalistProfile; index: number; onOpen: (slug: string) => void; onCursor: (cursor: { x: number; y: number; active: boolean }) => void; reducedMotion: boolean }) {
  return <motion.article initial={{ opacity: 0, y: reducedMotion ? 0 : 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.12 }} exit={{ opacity: 0, scale: 0.97 }} transition={{ duration: reducedMotion ? 0.1 : 0.45, ease: EASE }} className="final-forty-card group">
    <button type="button" onClick={() => onOpen(finalist.slug)} onMouseMove={(event) => onCursor({ x: event.clientX, y: event.clientY, active: true })} onMouseLeave={() => onCursor({ x: -80, y: -80, active: false })} className="block w-full text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c5b397] focus-visible:ring-offset-4 focus-visible:ring-offset-[#0a0908]" aria-label={`View profile: ${finalist.name}`}>
      <div className="relative aspect-[3/4] overflow-hidden bg-[#1b1916]">
        <Image unoptimized src={finalist.photo ?? EMPTY_IMAGE} alt={`Portrait of ${finalist.name}`} fill priority={index < 2} sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 33vw" className="object-cover grayscale-[0.35] transition duration-500 ease-out group-hover:scale-[1.04] group-hover:grayscale-0" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-70 transition-opacity duration-500 group-hover:opacity-95" />
        <span className="absolute left-4 top-4 text-[10px] tracking-[0.2em] text-[#eae6e1]/75">{indexLabel(index)}</span>
        <span className="absolute bottom-4 left-4 translate-y-2 text-[9px] font-medium uppercase tracking-[0.3em] text-[#c5b397] opacity-0 transition duration-500 group-hover:translate-y-0 group-hover:opacity-100">View profile <ArrowUpRight className="ml-1 inline-block" size={12} /></span>
      </div>
      <div className="pt-5 transition-transform duration-500 group-hover:-translate-y-1">
        <p className="text-[9px] font-medium uppercase tracking-[0.27em] text-[#c5b397]">{finalist.category ?? "Finalist"}</p>
        <h3 className="mt-2 font-display text-3xl leading-none text-[#eae6e1] md:text-4xl">{finalist.name}</h3>
        <p className="mt-3 text-[9px] font-medium uppercase leading-relaxed tracking-[0.19em] text-[#eae6e1]/48">{finalist.title}{finalist.organization ? ` · ${finalist.organization}` : ""}</p>
      </div>
    </button>
  </motion.article>;
}

function ProfileExperience({ finalist, index, total, onClose, onStep, onShare, shareMessage, touchStart }: { finalist: FinalistProfile | null; index: number; total: number; onClose: () => void; onStep: (direction: number) => void; onShare: () => Promise<void>; shareMessage: string; touchStart: React.MutableRefObject<number | null> }) {
  return <AnimatePresence>{finalist && <motion.section role="dialog" aria-modal="true" aria-label={`${finalist.name} profile`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[80] overflow-y-auto bg-black/75 p-3 backdrop-blur-sm md:p-8" onClick={onClose} onTouchStart={(event) => { touchStart.current = event.touches[0]?.clientX ?? null; }} onTouchEnd={(event) => { const start = touchStart.current; const end = event.changedTouches[0]?.clientX; if (start != null && end != null && Math.abs(start - end) > 60) onStep(start > end ? 1 : -1); touchStart.current = null; }}>
    <motion.div initial={{ y: 24, scale: .985 }} animate={{ y: 0, scale: 1 }} exit={{ y: 14, scale: .985 }} transition={{ duration: .35, ease: EASE }} onClick={(event) => event.stopPropagation()} className="mx-auto h-[calc(100svh-1.5rem)] max-w-[1380px] overflow-hidden bg-[#0a0908] px-5 py-5 shadow-2xl md:h-[calc(100svh-4rem)] md:px-10 md:py-7 lg:px-14">
      <div className="mb-5 flex items-center justify-between border-b border-[#eae6e1]/12 pb-4 text-[9px] font-medium uppercase tracking-[0.26em]">
        <button type="button" onClick={onClose} className="flex items-center gap-2 text-[#eae6e1]/70 hover:text-[#c5b397]"><ArrowLeft size={14} /> Back to the {total}</button>
        <div className="flex items-center gap-4"><span className="text-[#c5b397]" aria-live="polite">{shareMessage}</span><button type="button" onClick={onShare} className="flex items-center gap-2 text-[#eae6e1]/70 hover:text-[#c5b397]"><Share2 size={14} /> Share</button><button type="button" onClick={onClose} className="final-forty-icon-button" aria-label="Close profile"><X size={17} /></button></div>
      </div>
      <div className="grid h-[calc(100%-3.7rem)] gap-7 lg:grid-cols-[minmax(320px,.82fr)_minmax(0,1fr)] lg:gap-14">
        <motion.div layoutId={`portrait-${finalist.id}`} initial={{ opacity: 0.4, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="relative hidden h-full overflow-hidden bg-[#171512] lg:block">
          <Image unoptimized src={finalist.photo ?? EMPTY_IMAGE} alt={`Portrait of ${finalist.name}`} fill priority sizes="(max-width: 1024px) 100vw, 48vw" className="object-cover" />
        </motion.div>
        <article className="flex min-w-0 flex-col justify-between overflow-hidden py-1 lg:py-5">
          <div>
            <p className="text-[10px] font-medium tracking-[0.25em] text-[#c5b397]">{indexLabel(index)} / {String(total).padStart(2, "0")}</p>
            <h2 className="mt-5 font-display text-5xl leading-[.82] tracking-[-0.065em] md:text-7xl xl:text-8xl">{finalist.name}</h2>
            <p className="mt-5 text-[10px] font-medium uppercase tracking-[0.28em] text-[#c5b397]">{finalist.category ?? "Finalist"}{finalist.age ? ` · ${finalist.age}` : ""}</p>
            <p className="mt-2 text-base text-[#eae6e1]/85">{finalist.title}</p>
            {finalist.organization ? <p className="mt-2 text-[10px] font-medium uppercase leading-relaxed tracking-[0.2em] text-[#eae6e1]/45">{finalist.organization}</p> : null}
            <div className="my-6 h-px w-12 bg-[#c5b397]/70" />
            <p className="final-forty-profile-bio max-w-2xl font-display text-xl leading-[1.32] text-[#eae6e1]/85 md:text-2xl">{finalist.bio ?? "Profile story forthcoming."}</p>
          </div>
          <div className="mt-6">
            <div className="flex flex-wrap gap-3">{finalist.linkedinUrl && <a href={finalist.linkedinUrl} target="_blank" rel="noreferrer" className="final-forty-social">LinkedIn</a>}{finalist.instagramUrl && <a href={finalist.instagramUrl} target="_blank" rel="noreferrer" className="final-forty-social">Instagram</a>}{(finalist.websiteUrl ?? finalist.profileUrl) && <a href={finalist.websiteUrl ?? finalist.profileUrl ?? "#"} target="_blank" rel="noreferrer" className="final-forty-social">Website</a>}</div>
            <div className="mt-6 flex items-center justify-between border-t border-[#eae6e1]/12 pt-4"><button type="button" onClick={() => onStep(-1)} className="final-forty-nav"><ArrowLeft size={14} /> Previous</button><span className="text-[9px] uppercase tracking-[0.3em] text-[#c5b397]">{indexLabel(index)} / {String(total).padStart(2, "0")}</span><button type="button" onClick={() => onStep(1)} className="final-forty-nav">Next <ArrowRight size={14} /></button></div>
          </div>
        </article>
      </div>
    </motion.div>
  </motion.section>}</AnimatePresence>;
}

function FinalistIndex({ open, onClose, finalists, onOpen }: { open: boolean; onClose: () => void; finalists: FinalistProfile[]; onOpen: (slug: string) => void }) {
  const [query, setQuery] = useState("");
  const shown = finalists.filter((finalist) => contains(finalist, query));
  return <AnimatePresence>{open && <motion.div role="dialog" aria-modal="true" aria-label="Finalist directory" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[75] grid place-items-center overflow-y-auto bg-black/70 p-4 backdrop-blur-md md:p-10" onClick={onClose}>
    <motion.div initial={{ opacity: 0, y: 24, scale: .98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 16, scale: .985 }} transition={{ duration: .38, ease: EASE }} onClick={(event) => event.stopPropagation()} className="final-forty-directory w-full max-w-5xl overflow-hidden border border-[#c5b397]/45 bg-[#100f0d]/95 shadow-[0_32px_100px_rgba(0,0,0,.7)]">
      <div className="relative border-b border-[#eae6e1]/12 px-6 py-7 md:px-10"><div className="absolute inset-0 opacity-60 [background:radial-gradient(circle_at_78%_0%,rgba(197,179,151,.22),transparent_45%)]" /><div className="relative flex items-start justify-between gap-5"><div><p className="text-[9px] uppercase tracking-[.34em] text-[#c5b397]">Asia Inc. 500 · Editorial index</p><p className="mt-3 font-display text-5xl leading-none italic md:text-6xl">The {finalists.length}</p></div><button type="button" onClick={onClose} className="final-forty-icon-button" aria-label="Close finalist directory"><X size={18} /></button></div><label className="relative mt-8 flex items-center gap-3 border border-[#eae6e1]/20 bg-black/20 px-4 py-4 transition focus-within:border-[#c5b397]"><Search size={17} className="text-[#c5b397]" /><input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="SEARCH BY NAME, COMPANY OR CATEGORY" aria-label="Search finalist directory" className="w-full bg-transparent text-[11px] uppercase tracking-[0.2em] outline-none placeholder:text-[#eae6e1]/40" /><span className="hidden text-[9px] uppercase tracking-[.2em] text-[#eae6e1]/35 sm:block">{shown.length} results</span></label></div><ol className="max-h-[56svh] overflow-y-auto px-6 py-3 md:grid md:grid-cols-2 md:gap-x-10 md:px-10">{shown.map((finalist) => { const index = finalists.findIndex((item) => item.id === finalist.id); return <li key={finalist.id} className="border-b border-[#eae6e1]/10"><button type="button" onClick={() => onOpen(finalist.slug)} className="group flex w-full items-center gap-4 py-5 text-left transition hover:bg-[#c5b397]/[.06] hover:text-[#c5b397]"><span className="text-[10px] tracking-[0.2em] text-[#c5b397]">{indexLabel(index)}</span><span className="font-display text-2xl">{finalist.name}</span><span className="ml-auto text-right text-[9px] uppercase tracking-[0.16em] text-[#eae6e1]/45 group-hover:text-[#c5b397]">{finalist.category}</span></button></li>; })}</ol><div className="border-t border-[#eae6e1]/10 px-6 py-4 text-[9px] uppercase tracking-[.24em] text-[#eae6e1]/42 md:px-10">Select a name to open their editorial profile</div></motion.div>
  </motion.div>}</AnimatePresence>;
}

function Intro({ visible, onSkip }: { visible: boolean; onSkip: () => void }) { return <AnimatePresence>{visible && <motion.div initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.55 }} className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0a0908] text-center"><button type="button" onClick={onSkip} className="absolute right-6 top-6 text-[9px] uppercase tracking-[0.28em] text-[#eae6e1]/55 hover:text-[#c5b397]">Skip intro</button><div><p className="text-[9px] uppercase tracking-[0.4em] text-[#c5b397]">Asia Inc. 500 presents</p><motion.p initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.1, ease: EASE }} className="mt-4 font-display text-[35vw] leading-none text-[#eae6e1]">40</motion.p><motion.p initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65, duration: 0.7 }} className="font-display text-5xl italic text-[#c5b397]">The Final 40</motion.p></div></motion.div>}</AnimatePresence>; }

function Cursor({ cursor, reducedMotion }: { cursor: { x: number; y: number; active: boolean }; reducedMotion: boolean }) { if (reducedMotion) return null; return <div className={`final-forty-cursor ${cursor.active ? "is-active" : ""}`} style={{ transform: `translate3d(${cursor.x}px, ${cursor.y}px, 0)` }} aria-hidden><span>{cursor.active ? "VIEW" : ""}</span></div>; }

function ScrollProgress({ finalists }: { finalists: FinalistProfile[] }) { const [progress, setProgress] = useState(0); useEffect(() => { const update = () => setProgress(Math.min(1, window.scrollY / Math.max(1, document.documentElement.scrollHeight - window.innerHeight))); update(); window.addEventListener("scroll", update, { passive: true }); return () => window.removeEventListener("scroll", update); }, []); return <div className="fixed bottom-6 right-5 z-40 hidden h-24 w-px bg-[#eae6e1]/15 md:block" aria-label="Page scroll progress"><span className="absolute bottom-0 left-0 w-px bg-[#c5b397]" style={{ height: `${progress * 100}%` }} /><span className="absolute -left-1 top-0 text-[8px] tracking-[0.18em] text-[#eae6e1]/45">{finalists.length}</span></div>; }
