import { getServerSession } from "next-auth";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { StatusBadge } from "../StatusBadge";
import { NomineeReviewActions } from "./NomineeReviewActions";
import { NomineeSortOrder } from "./NomineeSortOrder";

function DetailRow({
  label,
  value,
  type = "text",
}: {
  label: string;
  value: string | null | undefined;
  type?: "text" | "link" | "paragraph";
}) {
  if (value == null || value === "") return null;
  return (
    <div>
      <dt className="text-neutral-500 text-sm font-medium mb-0.5">{label}</dt>
      <dd className="text-neutral-300">
        {type === "link" && (value.startsWith("http") || value.startsWith("mailto:")) ? (
          <a href={value} target="_blank" rel="noopener noreferrer" className="text-gold hover:underline break-all">
            {value}
          </a>
        ) : type === "paragraph" ? (
          <p className="whitespace-pre-wrap">{value}</p>
        ) : (
          <span>{value}</span>
        )}
      </dd>
    </div>
  );
}

function parseSupportingDocUrls(json: string | null): string[] {
  if (!json?.trim()) return [];
  try {
    const arr = JSON.parse(json) as unknown;
    return Array.isArray(arr) ? arr.filter((x): x is string => typeof x === "string") : [];
  } catch {
    return [];
  }
}

export default async function AdminNomineeReviewPage({
  params,
}: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");

  const { id } = await params;
  const nominee = await prisma.nominee.findUnique({
    where: { id },
    include: { nominations: true },
  });
  if (!nominee) notFound();

  const supportingDocs = parseSupportingDocUrls(nominee.supportingDocUrls);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl">
      <Link href="/admin/nominees" className="text-gold hover:underline text-sm mb-6 inline-block">
        ← Back to nominees
      </Link>
      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex-shrink-0">
          {nominee.photoUrl ? (
            <Image
              src={nominee.photoUrl}
              alt={nominee.name}
              width={160}
              height={160}
              className="rounded-xl object-cover"
            />
          ) : (
            <div className="w-40 h-40 rounded-xl bg-neutral-600 flex items-center justify-center text-neutral-500">
              No photo
            </div>
          )}
        </div>
        <div className="flex-1 space-y-4">
          <h1 className="font-display text-2xl font-bold text-white">{nominee.name}</h1>
          <p className="text-neutral-400">
            {nominee.designation} at {nominee.company}
          </p>
          <StatusBadge status={nominee.status} />
          <div className="flex flex-wrap gap-4 pt-2">
            <a href={`mailto:${nominee.email}`} className="text-gold hover:underline text-sm">
              {nominee.email}
            </a>
            {nominee.linkedin && (
              <a href={nominee.linkedin} target="_blank" rel="noopener noreferrer" className="text-gold hover:underline text-sm">
                LinkedIn
              </a>
            )}
          </div>
          <NomineeReviewActions nomineeId={nominee.id} currentStatus={nominee.status} />
          <NomineeSortOrder nomineeId={nominee.id} initialSortOrder={nominee.sortOrder ?? 0} />
        </div>
      </div>

      <section className="mt-10 grid gap-8 sm:grid-cols-2">
        <div className="space-y-4 rounded-xl border border-neutral-600 bg-secondary/10 p-6">
          <h2 className="font-display text-lg font-bold text-white border-b border-neutral-600 pb-2">
            Basic details
          </h2>
          <dl className="space-y-3">
            <DetailRow label="Age" value={nominee.age != null ? String(nominee.age) : null} />
            <DetailRow label="Date of birth" value={nominee.dob ? nominee.dob.toISOString().slice(0, 10) : null} />
            <DetailRow label="Gender" value={nominee.gender} />
            <DetailRow label="Industry" value={nominee.industry} />
            <DetailRow label="Consent given" value={nominee.consentGiven != null ? (nominee.consentGiven ? "Yes" : "No") : null} />
            <DetailRow label="Nomination type" value={nominee.nominationType ? (nominee.nominationType === "self" ? "Self" : "Third-party") : null} />
          </dl>
        </div>
        <div className="space-y-4 rounded-xl border border-neutral-600 bg-secondary/10 p-6">
          <h2 className="font-display text-lg font-bold text-white border-b border-neutral-600 pb-2">
            Links &amp; reach
          </h2>
          <dl className="space-y-3">
            <DetailRow label="LinkedIn" value={nominee.linkedin} type="link" />
            <DetailRow label="Personal links (website, portfolio, social)" value={nominee.personalLinks} type="paragraph" />
            <DetailRow label="Company website / social" value={nominee.companyWebsiteSocial} type="paragraph" />
          </dl>
        </div>
      </section>

      <section className="mt-8 space-y-6 rounded-xl border border-neutral-600 bg-secondary/10 p-6">
        <h2 className="font-display text-lg font-bold text-white border-b border-neutral-600 pb-2">
          Business &amp; impact
        </h2>
        <dl className="space-y-4">
          <DetailRow label="Revenue / scale" value={nominee.revenueScale} type="paragraph" />
          <DetailRow label="Company impact" value={nominee.companyImpact} type="paragraph" />
          <DetailRow label="Funding raised" value={nominee.fundingRaised} type="paragraph" />
          <DetailRow label="Impact metrics" value={nominee.impactMetrics} type="paragraph" />
        </dl>
      </section>

      <section className="mt-8 space-y-6 rounded-xl border border-neutral-600 bg-secondary/10 p-6">
        <h2 className="font-display text-lg font-bold text-white border-b border-neutral-600 pb-2">
          Why &amp; recognition
        </h2>
        <dl className="space-y-4">
          <DetailRow label="Why deserves 40 Under 40" value={nominee.whyDeserves} type="paragraph" />
          <DetailRow label="Achievements" value={nominee.achievements} type="paragraph" />
          <DetailRow label="Awards / recognitions" value={nominee.awardsRecognition} type="paragraph" />
          <DetailRow label="Media features" value={nominee.mediaFeatures} type="paragraph" />
        </dl>
      </section>

      <section className="mt-8 space-y-6 rounded-xl border border-neutral-600 bg-secondary/10 p-6">
        <h2 className="font-display text-lg font-bold text-white border-b border-neutral-600 pb-2">
          Bio &amp; other
        </h2>
        <dl className="space-y-4">
          <DetailRow label="Brief bio" value={nominee.bio} type="paragraph" />
          <DetailRow label="Anything else" value={nominee.anythingElse} type="paragraph" />
        </dl>
      </section>

      {supportingDocs.length > 0 && (
        <section className="mt-8 rounded-xl border border-neutral-600 bg-secondary/10 p-6">
          <h2 className="font-display text-lg font-bold text-white border-b border-neutral-600 pb-2 mb-4">
            Supporting documents
          </h2>
          <ul className="space-y-2">
            {supportingDocs.map((url, i) => (
              <li key={i}>
                <a href={url} target="_blank" rel="noopener noreferrer" className="text-gold hover:underline break-all text-sm">
                  Document {i + 1}
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      {nominee.nominations.length > 0 && (
        <section className="mt-8 rounded-xl border border-neutral-600 bg-secondary/10 p-6">
          <h2 className="font-display text-lg font-bold text-white border-b border-neutral-600 pb-2 mb-4">
            Nominations
          </h2>
          <ul className="space-y-2">
            {nominee.nominations.map((nom) => (
              <li key={nom.id} className="text-neutral-400 text-sm">
                <strong className="text-neutral-300">{nom.nominatorName}</strong> ({nom.nominatorEmail})
                {nom.relationship && ` · ${nom.relationship}`}
                {nom.reasonForNomination && (
                  <p className="mt-1 text-neutral-500">{nom.reasonForNomination.slice(0, 200)}{nom.reasonForNomination.length > 200 ? "…" : ""}</p>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
