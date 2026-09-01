import { z } from "zod";

const GENDER_OPTIONS = ["Male", "Female", "Prefer not to say", "Other"] as const;
const NOMINATION_TYPE_OPTIONS = ["self", "third_party"] as const;

export const nominationFormSchema = z
  .object({
    // Consent & type
    consentGiven: z.literal(true, { message: "You must agree to participate to submit." }),
    nominationType: z.enum(NOMINATION_TYPE_OPTIONS, { message: "Please select nomination type." }),

    // Nominator (required for third-party; use 'NA' for self in UI)
    nominatorName: z.string().max(200),
    relationship: z.string().max(200),

    // Nominee
    fullName: z.string().min(1, "Full name of nominee is required").max(200),
    email: z.string().email("Please enter a valid email").max(200),
    age: z.coerce.number().int().min(1).max(39, "Nominees must be under 40.") ,
    dateOfBirth: z.string().min(1, "Date of birth is required."),
    gender: z.enum(GENDER_OPTIONS).optional(),
    designation: z.string().min(1, "Current designation is required").max(200),
    company: z.string().min(1, "Organization / Company name is required").max(200),
    industry: z.string().min(1, "Industry category is required").max(100),
    linkedIn: z.string().url("Please enter a valid LinkedIn URL").max(500),
    instagramUrl: z
      .string()
      .url("Please enter a valid URL")
      .max(500)
      .optional(),
    websiteUrl: z
      .string()
      .url("Please enter a valid URL")
      .max(500)
      .optional(),
    profileUrl: z
      .string()
      .url("Please enter a valid URL")
      .max(500)
      .optional(),
    personalLinks: z.string().max(2000).optional(),
    revenueScale: z.string().max(1000).optional(),
    companyImpact: z.string().min(1, "Please describe the impact of the company").max(5000),
    fundingRaised: z.string().max(2000).optional(),
    whyDeserves: z.string().min(1, "Please explain why this nominee deserves to be on the 40 Under 40 list").max(5000),
    awardsRecognition: z.string().max(2000).optional(),
    mediaFeatures: z.string().max(2000).optional(),
    bio: z
      .string()
      .min(1, "Brief professional bio is required (100–200 words)")
      .max(2000)
      .refine((s) => s.trim().split(/\s+/).length >= 20, "Bio should be at least 20 words (100–200 words recommended)"),
    companyWebsiteSocial: z.string().max(1000).optional(),
    anythingElse: z.string().max(2000).optional(),

    // Nominator email (for third-party only)
    nominatorEmail: z.union([z.string().email().max(200), z.literal("")]).optional(),
    reasonForNomination: z.string().max(5000).optional(),
  })
  .refine(
    (data) => {
      if (data.nominationType === "third_party") {
        const nameOk = data.nominatorName.trim() && data.nominatorName.trim().toUpperCase() !== "NA";
        const emailOk = data.nominatorEmail?.trim() && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.nominatorEmail.trim());
        return nameOk && emailOk;
      }
      return true;
    },
    { message: "For third-party nomination, nominator name and email are required.", path: ["nominatorEmail"] }
  );

export type NominationFormData = z.infer<typeof nominationFormSchema>;
export type GenderOption = (typeof GENDER_OPTIONS)[number];
export type NominationTypeOption = (typeof NOMINATION_TYPE_OPTIONS)[number];
