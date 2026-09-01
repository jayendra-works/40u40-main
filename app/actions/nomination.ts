"use server";

import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { nominationFormSchema, type NominationFormData } from "@/lib/validations/nomination";
import { checkRateLimit, recordSubmission } from "@/lib/rate-limit";
import { NomineeStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { saveNominationPhoto, saveSupportingDocs } from "@/lib/upload-nomination-files";
import { randomBytes } from "crypto";

function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export type SubmitNominationResult = { success: true; id: string } | { success: false; error: string };

function sanitize(str: string): string {
  return str.replace(/[<>]/g, "").trim().slice(0, 10000);
}

function ageOnEligibilityDate(dateOfBirth: Date): number {
  const eligibilityDate = new Date(`${new Date().getUTCFullYear()}-12-31T00:00:00.000Z`);
  let age = eligibilityDate.getUTCFullYear() - dateOfBirth.getUTCFullYear();
  const birthdayHasOccurred =
    eligibilityDate.getUTCMonth() > dateOfBirth.getUTCMonth() ||
    (eligibilityDate.getUTCMonth() === dateOfBirth.getUTCMonth() &&
      eligibilityDate.getUTCDate() >= dateOfBirth.getUTCDate());
  if (!birthdayHasOccurred) age -= 1;
  return age;
}

function formDataToPayload(formData: FormData): Record<string, unknown> {
  const o: Record<string, unknown> = {};
  Array.from(formData.entries()).forEach(([key, value]) => {
    if (key === "photo" || key === "supportingDocs") return;
    if (value instanceof File) return;
    o[key] = value === "" ? undefined : value;
  });
  o.consentGiven = formData.get("consentGiven") === "true";
  o.nominationType = formData.get("nominationType") ?? undefined;
  o.age = formData.get("age") ? Number(formData.get("age")) : undefined;
  return o;
}

export async function submitNominationForm(formData: FormData): Promise<SubmitNominationResult> {
  const headersList = await headers();
  const ip =
    headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ?? headersList.get("x-real-ip") ?? "anonymous";
  const rate = checkRateLimit(ip);
  if (!rate.allowed) {
    return { success: false, error: "Too many submissions. Please try again later." };
  }

  const payload = formDataToPayload(formData);
  const parsed = nominationFormSchema.safeParse(payload);
  if (!parsed.success) {
    const first = parsed.error.flatten().fieldErrors;
    const message = Object.values(first)[0]?.[0] ?? "Validation failed.";
    return { success: false, error: message };
  }

  const p = parsed.data;
  const dob = p.dateOfBirth ? new Date(p.dateOfBirth) : null;
  if (dob && isNaN(dob.getTime())) return { success: false, error: "Invalid date of birth." };
  if (!dob || ageOnEligibilityDate(dob) !== p.age || ageOnEligibilityDate(dob) >= 40) {
    return { success: false, error: "Nominees must be under 40 as of December 31 this year, and age must match date of birth." };
  }

  const photo = formData.get("photo");
  if (!(photo instanceof File) || photo.size === 0) {
    return { success: false, error: "A high-resolution photo of the nominee is required." };
  }

  const subdir = randomBytes(8).toString("hex");
  let photoUrl: string | null = null;
  let supportingDocUrls: string[] = [];

  const result = await saveNominationPhoto(photo, subdir);
  if (!result.success) return { success: false, error: result.error };
  photoUrl = result.url;

  const docs = formData.getAll("supportingDocs") as File[];
  const docFiles = docs.filter((f) => f && f.size > 0);
  const totalUploadBytes = photo.size + docFiles.reduce((total, file) => total + file.size, 0);
  if (totalUploadBytes > 3 * 1024 * 1024) {
    return { success: false, error: "Keep the combined photo and supporting documents under 3 MB." };
  }
  if (docFiles.length > 0) {
    const result = await saveSupportingDocs(docFiles, subdir);
    if (!result.success) return { success: false, error: result.error };
    supportingDocUrls = result.urls;
  }

  const slug = slugify(p.fullName);
  const hasNominator =
    p.nominationType === "third_party" &&
    p.nominatorName?.trim() &&
    p.nominatorName.trim().toUpperCase() !== "NA" &&
    p.nominatorEmail?.trim() &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(p.nominatorEmail.trim());

  try {
    const nominee = await prisma.$transaction(async (tx) => {
      const createdNominee = await tx.nominee.create({
        data: {
        name: sanitize(p.fullName),
        email: sanitize(p.email),
        linkedin: p.linkedIn?.trim() ? sanitize(p.linkedIn) : null,
        instagramUrl: p.instagramUrl?.trim() ? sanitize(p.instagramUrl) : null,
        websiteUrl: p.websiteUrl?.trim() ? sanitize(p.websiteUrl) : null,
        profileUrl: p.profileUrl?.trim() ? sanitize(p.profileUrl) : null,
        dob,
        age: p.age ?? null,
        gender: p.gender ?? null,
        industry: sanitize(p.industry),
        company: sanitize(p.company),
        designation: sanitize(p.designation),
        bio: sanitize(p.bio),
        achievements: sanitize(p.whyDeserves),
        impactMetrics: sanitize(p.companyImpact ?? ""),
        photoUrl,
        status: NomineeStatus.submitted,
        slug: `${slug}-${Date.now().toString(36)}`,
        consentGiven: Boolean(p.consentGiven),
        nominationType: p.nominationType ?? null,
        personalLinks: p.personalLinks?.trim() ? sanitize(p.personalLinks) : null,
        revenueScale: p.revenueScale?.trim() ? sanitize(p.revenueScale) : null,
        companyImpact: p.companyImpact?.trim() ? sanitize(p.companyImpact) : null,
        fundingRaised: p.fundingRaised?.trim() ? sanitize(p.fundingRaised) : null,
        whyDeserves: sanitize(p.whyDeserves),
        awardsRecognition: p.awardsRecognition?.trim() ? sanitize(p.awardsRecognition) : null,
        mediaFeatures: p.mediaFeatures?.trim() ? sanitize(p.mediaFeatures) : null,
        companyWebsiteSocial: p.companyWebsiteSocial?.trim() ? sanitize(p.companyWebsiteSocial) : null,
        anythingElse: p.anythingElse?.trim() ? sanitize(p.anythingElse) : null,
        supportingDocUrls:
          supportingDocUrls.length > 0 ? JSON.stringify(supportingDocUrls) : null,
        },
      });

      if (hasNominator && p.nominatorEmail) {
        await tx.nomination.create({
          data: {
            nomineeId: createdNominee.id,
            nominatorName: sanitize(p.nominatorName.trim()),
            nominatorEmail: sanitize(p.nominatorEmail.trim()),
            relationship: p.relationship?.trim() ? sanitize(p.relationship) : null,
            reasonForNomination: p.reasonForNomination?.trim() ? sanitize(p.reasonForNomination) : null,
          },
        });
      }

      return createdNominee;
    });

    recordSubmission(ip);
    revalidatePath("/");
    revalidatePath("/admin");
    revalidatePath("/admin/nominees");
    return { success: true, id: nominee.id };
  } catch (e) {
    console.error("Nomination submit error:", e);
    return { success: false, error: "Failed to submit nomination. Please try again." };
  }
}

/** Legacy: submit with JSON data and optional photo URL (e.g. after external upload). */
export async function submitNomination(
  data: NominationFormData,
  photoUrl?: string | null
): Promise<SubmitNominationResult> {
  const headersList = await headers();
  const ip =
    headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ?? headersList.get("x-real-ip") ?? "anonymous";
  const rate = checkRateLimit(ip);
  if (!rate.allowed) {
    return { success: false, error: "Too many submissions. Please try again later." };
  }

  const parsed = nominationFormSchema.safeParse(data);
  if (!parsed.success) {
    const first = parsed.error.flatten().fieldErrors;
    const message = Object.values(first)[0]?.[0] ?? "Validation failed.";
    return { success: false, error: message };
  }

  if (!photoUrl?.trim()) {
    return { success: false, error: "A high-resolution photo of the nominee is required." };
  }

  const p = parsed.data;
  const dob = p.dateOfBirth ? new Date(p.dateOfBirth) : null;
  if (dob && isNaN(dob.getTime())) return { success: false, error: "Invalid date of birth." };
  if (!dob || ageOnEligibilityDate(dob) !== p.age || ageOnEligibilityDate(dob) >= 40) {
    return { success: false, error: "Nominees must be under 40 as of December 31 this year, and age must match date of birth." };
  }

  const slug = slugify(p.fullName);
  const hasNominator =
    p.nominationType === "third_party" &&
    p.nominatorName?.trim() &&
    p.nominatorName.trim().toUpperCase() !== "NA" &&
    p.nominatorEmail?.trim() &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(p.nominatorEmail.trim());

  try {
    const nominee = await prisma.$transaction(async (tx) => {
      const createdNominee = await tx.nominee.create({
        data: {
        name: sanitize(p.fullName),
        email: sanitize(p.email),
        linkedin: p.linkedIn?.trim() ? sanitize(p.linkedIn) : null,
        instagramUrl: p.instagramUrl?.trim() ? sanitize(p.instagramUrl) : null,
        websiteUrl: p.websiteUrl?.trim() ? sanitize(p.websiteUrl) : null,
        profileUrl: p.profileUrl?.trim() ? sanitize(p.profileUrl) : null,
        dob,
        age: p.age ?? null,
        gender: p.gender ?? null,
        industry: sanitize(p.industry),
        company: sanitize(p.company),
        designation: sanitize(p.designation),
        bio: sanitize(p.bio),
        achievements: sanitize(p.whyDeserves),
        impactMetrics: p.companyImpact?.trim() ? sanitize(p.companyImpact) : null,
        photoUrl: photoUrl ?? null,
        status: NomineeStatus.submitted,
        slug: `${slug}-${Date.now().toString(36)}`,
        consentGiven: Boolean(p.consentGiven),
        nominationType: p.nominationType ?? null,
        personalLinks: p.personalLinks?.trim() ? sanitize(p.personalLinks) : null,
        revenueScale: p.revenueScale?.trim() ? sanitize(p.revenueScale) : null,
        companyImpact: p.companyImpact?.trim() ? sanitize(p.companyImpact) : null,
        fundingRaised: p.fundingRaised?.trim() ? sanitize(p.fundingRaised) : null,
        whyDeserves: sanitize(p.whyDeserves),
        awardsRecognition: p.awardsRecognition?.trim() ? sanitize(p.awardsRecognition) : null,
        mediaFeatures: p.mediaFeatures?.trim() ? sanitize(p.mediaFeatures) : null,
        companyWebsiteSocial: p.companyWebsiteSocial?.trim() ? sanitize(p.companyWebsiteSocial) : null,
        anythingElse: p.anythingElse?.trim() ? sanitize(p.anythingElse) : null,
        },
      });

      if (hasNominator && p.nominatorEmail) {
        await tx.nomination.create({
          data: {
            nomineeId: createdNominee.id,
            nominatorName: sanitize(p.nominatorName.trim()),
            nominatorEmail: sanitize(p.nominatorEmail.trim()),
            relationship: p.relationship?.trim() ? sanitize(p.relationship) : null,
            reasonForNomination: p.reasonForNomination?.trim() ? sanitize(p.reasonForNomination) : null,
          },
        });
      }

      return createdNominee;
    });

    recordSubmission(ip);
    revalidatePath("/");
    revalidatePath("/admin");
    revalidatePath("/admin/nominees");
    return { success: true, id: nominee.id };
  } catch (e) {
    console.error("Nomination submit error:", e);
    return { success: false, error: "Failed to submit nomination. Please try again." };
  }
}
