import Image from "next/image";
import Link from "next/link";
import { SectionWrapper } from "@/components/ui/SectionWrapper";

export type FinalistNominee = {
  id: string;
  name: string;
  company: string;
  designation: string;
  industry: string;
  photoUrl: string | null;
  linkedin?: string | null;
  instagramUrl?: string | null;
  websiteUrl?: string | null;
  profileUrl?: string | null;
};

interface FinalistsSectionProps {
  finalists: FinalistNominee[];
  className?: string;
}

const ROW_SIZE = 4;

export function FinalistsSection({ finalists, className }: FinalistsSectionProps) {
  const showInRow = finalists.slice(0, ROW_SIZE);

  return (
    <SectionWrapper
      title="Finalists"
      subtitle="Leaders selected for the final round. The 40 Under 40 winners will be announced at the Awards Summit."
      className={className}
    >
      {finalists.length === 0 ? (
        <p className="text-[11px] uppercase tracking-[0.15em] font-light text-[#EAE6E1]/40 py-12 text-center">
          Finalists will be announced once the selection process is complete.
        </p>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-16">
            {showInRow.map((n) => (
              <div key={n.id} className="group flex flex-col">
                <div className="aspect-[3/4] relative bg-[#0F0E0C] overflow-hidden mb-5">
                  {n.photoUrl ? (
                    <Image
                      src={n.photoUrl}
                      alt={n.name}
                      fill
                      className="object-cover grayscale opacity-75 group-hover:opacity-100 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-[2000ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center font-display text-6xl text-[#C5B397]/20">
                      {n.name.charAt(0)}
                    </div>
                  )}
                  <div className="absolute inset-0 bg-[#C5B397] opacity-0 group-hover:opacity-[0.06] mix-blend-color transition-opacity duration-1000" />
                </div>
                <h3 className="font-display text-xl italic text-[#EAE6E1] group-hover:text-[#C5B397] transition-colors duration-500">
                  {n.name}
                </h3>
                <p className="text-[8px] uppercase tracking-[0.2em] font-medium text-[#C5B397]/70 mt-1">
                  {n.designation}
                </p>
                <p className="text-[8px] uppercase tracking-[0.15em] font-medium text-[#EAE6E1]/40 mt-0.5 truncate">
                  {n.company}
                </p>
                <div className="w-8 h-[1px] bg-[#EAE6E1]/15 mt-4 group-hover:w-full group-hover:bg-[#C5B397]/40 transition-all duration-[1500ms] ease-[cubic-bezier(0.16,1,0.3,1)]" />
              </div>
            ))}
          </div>
          <div className="mt-16">
            <a
              href="/program/finalists"
              className="bg-[#EAE6E1] text-[#131210] px-10 py-4 text-[10px] uppercase tracking-[0.3em] font-medium hover:bg-[#C5B397] transition-colors duration-500 inline-block"
            >
              View all Finalists
            </a>
          </div>
        </>
      )}
    </SectionWrapper>
  );
}
