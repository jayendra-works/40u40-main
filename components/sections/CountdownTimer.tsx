"use client";

import { useState, useEffect } from "react";

const DEFAULT_DATE = "2026-06-15T00:00:00";

function parseDate(envDate: string | undefined): Date {
  try {
    const d = envDate ? new Date(envDate) : new Date(DEFAULT_DATE);
    return isNaN(d.getTime()) ? new Date(DEFAULT_DATE) : d;
  } catch {
    return new Date(DEFAULT_DATE);
  }
}

const UNITS = [
  { key: "days", label: "Days" },
  { key: "hours", label: "Hours" },
  { key: "minutes", label: "Minutes" },
  { key: "seconds", label: "Seconds" },
] as const;

export function CountdownTimer({ targetDate }: { targetDate?: string }) {
  const [diff, setDiff] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const tick = () => {
      const now = new Date();
      const end = parseDate(targetDate);
      const total = Math.max(0, end.getTime() - now.getTime());
      setDiff({
        days: Math.floor(total / (1000 * 60 * 60 * 24)),
        hours: Math.floor((total % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((total % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((total % (1000 * 60)) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  const values = [diff.days, diff.hours, diff.minutes, diff.seconds];

  return (
    <div className="flex items-center justify-center gap-10 md:gap-16">
      {UNITS.map((unit, i) => (
        <div key={unit.key} className="flex flex-col items-center gap-3">
          <span className="font-display text-5xl md:text-7xl lg:text-8xl text-[#C5B397] leading-none tabular-nums italic">
            {mounted ? String(values[i]).padStart(2, "0") : "—"}
          </span>
          <span className="text-[9px] uppercase tracking-[0.3em] font-medium text-[#EAE6E1]/40">
            {unit.label}
          </span>
        </div>
      ))}
    </div>
  );
}
