import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { NomineeStatus } from "@prisma/client";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Winners | India's 40 Under 40 2026",
  description: "Meet the winners of Asia Inc. 500's 40 Under 40 2026 recognition programme.",
  alternates: { canonical: "/winners" },
};

/** Revalidate cached page every 60 seconds; admin actions revalidate when winners change. */
export const revalidate = 60;

export default async function WinnersGalleryPage() {
  const winners = await prisma.nominee.findMany({
    where: { status: NomineeStatus.winner },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    select: { id: true, name: true, slug: true, company: true, designation: true, industry: true, photoUrl: true },
  });

  return (
    <div className="pt-[140px] pb-32 bg-[#131210] min-h-screen">
      <SectionWrapper
        title="40 Under 40 Winners 2026"
        subtitle="Meet the leaders shaping the future of India."
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-10 gap-y-20">
          {winners.map((w) => (
            <Link
              key={w.id}
              href={w.slug ? `/winners/${w.slug}` : `/winners/${w.id}`}
              className="group flex flex-col"
            >
              <div className="aspect-[3/4] relative bg-[#0F0E0C] overflow-hidden mb-5">
                {w.photoUrl ? (
                  <Image
                    src={w.photoUrl}
                    alt={w.name}
                    fill
                    className="object-cover grayscale opacity-75 group-hover:opacity-100 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-[2000ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center font-display text-6xl text-[#C5B397]/20">
                    {w.name.charAt(0)}
                  </div>
                )}
                <div className="absolute inset-0 bg-[#C5B397] opacity-0 group-hover:opacity-[0.06] mix-blend-color transition-opacity duration-1000" />
              </div>
              <h3 className="font-display text-xl italic text-[#EAE6E1] group-hover:text-[#C5B397] transition-colors duration-500">
                {w.name}
              </h3>
              <p className="text-[8px] uppercase tracking-[0.2em] font-medium text-[#C5B397]/70 mt-1">
                {w.designation}
              </p>
              <p className="text-[8px] uppercase tracking-[0.15em] font-medium text-[#EAE6E1]/40 mt-0.5 truncate">
                {w.company}
              </p>
              <div className="w-8 h-[1px] bg-[#EAE6E1]/15 mt-4 group-hover:w-full group-hover:bg-[#C5B397]/40 transition-all duration-[1500ms] ease-[cubic-bezier(0.16,1,0.3,1)]" />
            </Link>
          ))}
        </div>
        {winners.length === 0 && (
          <p className="text-[11px] uppercase tracking-[0.15em] font-light text-[#EAE6E1]/40 py-12 text-center">
            Winners will be announced after the selection process.
          </p>
        )}
      </SectionWrapper>
    </div>
  );
}
