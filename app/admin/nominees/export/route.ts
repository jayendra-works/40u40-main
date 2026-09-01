import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function csvEscape(value: unknown): string {
  const str = value == null ? "" : String(value);
  const needsQuotes = /[",\n\r]/.test(str);
  const escaped = str.replace(/"/g, '""');
  return needsQuotes ? `"${escaped}"` : escaped;
}

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as { role?: string }).role !== "admin") {
    return new Response("Unauthorized", { status: 401 });
  }

  const url = new URL(req.url);
  const idsParam = url.searchParams.get("ids") ?? "";
  const ids = idsParam
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  if (ids.length === 0) {
    return new Response("Missing ids", { status: 400 });
  }

  const nominees = await prisma.nominee.findMany({
    where: { id: { in: ids } },
    include: {
      nominations: true,
    },
    orderBy: [{ createdAt: "desc" }],
  });

  const header = [
    "id",
    "name",
    "email",
    "status",
    "sortOrder",
    "company",
    "designation",
    "industry",
    "linkedin",
    "instagramUrl",
    "websiteUrl",
    "profileUrl",
    "dob",
    "age",
    "gender",
    "consentGiven",
    "nominationType",
    "personalLinks",
    "revenueScale",
    "companyImpact",
    "fundingRaised",
    "whyDeserves",
    "awardsRecognition",
    "mediaFeatures",
    "bio",
    "companyWebsiteSocial",
    "anythingElse",
    "supportingDocUrls",
    "photoUrl",
    "createdAt",
    "updatedAt",
    "nominationsCount",
    "nominationsJson",
  ];

  const rows = nominees.map((n) => {
    const nominationsJson = JSON.stringify(
      n.nominations.map((nom) => ({
        id: nom.id,
        nominatorName: nom.nominatorName,
        nominatorEmail: nom.nominatorEmail,
        relationship: nom.relationship,
        reasonForNomination: nom.reasonForNomination,
        createdAt: nom.createdAt,
      }))
    );

    const dob = n.dob ? n.dob.toISOString().slice(0, 10) : "";
    return [
      n.id,
      n.name,
      n.email,
      n.status,
      n.sortOrder,
      n.company,
      n.designation,
      n.industry,
      n.linkedin ?? "",
      n.instagramUrl ?? "",
      n.websiteUrl ?? "",
      n.profileUrl ?? "",
      dob,
      n.age ?? "",
      n.gender ?? "",
      n.consentGiven ?? "",
      n.nominationType ?? "",
      n.personalLinks ?? "",
      n.revenueScale ?? "",
      n.companyImpact ?? "",
      n.fundingRaised ?? "",
      n.whyDeserves ?? "",
      n.awardsRecognition ?? "",
      n.mediaFeatures ?? "",
      n.bio ?? "",
      n.companyWebsiteSocial ?? "",
      n.anythingElse ?? "",
      n.supportingDocUrls ?? "",
      n.photoUrl ?? "",
      n.createdAt.toISOString(),
      n.updatedAt.toISOString(),
      n.nominations.length,
      nominationsJson,
    ].map(csvEscape);
  });

  const csv = [header.join(","), ...rows.map((r) => r.join(","))].join("\n");

  const filename = `nominations-${new Date().toISOString().slice(0, 10)}.csv`;
  return new Response(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}

