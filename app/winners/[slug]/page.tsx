import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { NomineeStatus } from "@prisma/client";
import { ProfileLinks } from "@/components/ui/ProfileLinks";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const nominee = await prisma.nominee.findFirst({
    where: { status: NomineeStatus.winner, OR: [{ slug }, { id: slug }] },
    select: { name: true, designation: true, company: true },
  });
  if (!nominee) return { title: "Winner | 40 Under 40" };
  return {
    title: `${nominee.name} | India's 40 Under 40 2026`,
    description: `${nominee.name}, ${nominee.designation} at ${nominee.company}. India's 40 Under 40 winner 2026.`,
    alternates: { canonical: `/winners/${nominee.slug}` },
    openGraph: {
      title: `${nominee.name} | 40 Under 40 2026`,
      description: `${nominee.designation} at ${nominee.company}. India's 40 Under 40 winner.`,
    },
  };
}

export default async function WinnerProfilePage({
  params,
}: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const nominee = await prisma.nominee.findFirst({
    where: { status: NomineeStatus.winner, OR: [{ slug }, { id: slug }] },
  });
  if (!nominee) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: nominee.name,
    jobTitle: nominee.designation,
    worksFor: { "@type": "Organization", name: nominee.company },
    description: nominee.bio ?? nominee.achievements.slice(0, 200),
  };

  return (
    <div className="pt-[140px] pb-16 px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="max-w-3xl mx-auto">
        <Link href="/winners" className="text-gold hover:underline text-sm mb-8 inline-block">
          ← All winners
        </Link>
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-shrink-0">
            {nominee.photoUrl ? (
              <Image
                src={nominee.photoUrl}
                alt={nominee.name}
                width={240}
                height={240}
                className="rounded-2xl object-cover"
              />
            ) : (
              <div className="w-60 h-60 rounded-2xl bg-neutral-600 flex items-center justify-center text-neutral-500 font-display text-6xl">
                {nominee.name.charAt(0)}
              </div>
            )}
          </div>
          <div className="flex-1">
            <h1 className="font-display text-3xl font-bold text-white">
              {nominee.name}
            </h1>
            <p className="text-gold text-lg mt-2">{nominee.designation}</p>
            <p className="text-neutral-400">{nominee.company}</p>
            <div className="mt-3">
              <ProfileLinks
                linkedinUrl={nominee.linkedin}
                instagramUrl={nominee.instagramUrl}
                websiteUrl={nominee.websiteUrl}
                profileUrl={nominee.profileUrl}
                className="flex justify-center md:justify-start gap-2"
              />
            </div>
            <p className="text-neutral-500 text-sm mt-1">{nominee.industry}</p>
          </div>
        </div>
        {(nominee.bio || nominee.achievements) && (
          <div className="mt-12 space-y-8">
            {nominee.bio && (
              <section>
                <h2 className="font-display text-xl font-bold text-white mb-4">Bio</h2>
                <p className="text-neutral-400 leading-relaxed whitespace-pre-wrap">{nominee.bio}</p>
              </section>
            )}
            <section>
              <h2 className="font-display text-xl font-bold text-white mb-4">Achievements</h2>
              <p className="text-neutral-400 leading-relaxed whitespace-pre-wrap">{nominee.achievements}</p>
            </section>
            {nominee.impactMetrics && (
              <section>
                <h2 className="font-display text-xl font-bold text-white mb-4">Impact</h2>
                <p className="text-neutral-400">{nominee.impactMetrics}</p>
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
