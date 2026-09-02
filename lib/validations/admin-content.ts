import { z } from "zod";

const MAX_URL_LENGTH = 2_048;

function isSafePublicUrl(value: string, allowLocalPath = true) {
  if (allowLocalPath && /^\/(?!\/)/.test(value)) return true;

  try {
    const { protocol } = new URL(value);
    return protocol === "https:" || protocol === "http:";
  } catch {
    return false;
  }
}

const optionalText = (max: number) =>
  z.string().trim().max(max).optional().nullable().transform((value) => value || null);

const optionalPublicUrl = (allowLocalPath = true) =>
  z
    .string()
    .trim()
    .max(MAX_URL_LENGTH)
    .refine((value) => !value || isSafePublicUrl(value, allowLocalPath), {
      message: "Use a valid http(s) URL or a site-relative path.",
    })
    .optional()
    .nullable()
    .transform((value) => value || null);

const sortOrder = z.coerce.number().int().min(-10_000).max(10_000).optional().default(0);
export const contentIdSchema = z.string().cuid();

export const faqSchema = z.object({
  question: z.string().trim().min(1).max(600),
  answer: z.string().trim().min(1).max(8_000),
  sortOrder,
});

export const agendaItemSchema = z.object({
  time: z.string().trim().min(1).max(64),
  sessionTitle: z.string().trim().min(1).max(240),
  speaker: optionalText(240),
  description: optionalText(8_000),
  sortOrder,
});

const personSchema = z.object({
  name: z.string().trim().min(1).max(180),
  title: z.string().trim().min(1).max(180),
  organization: optionalText(180),
  category: optionalText(100),
  age: z.coerce.number().int().min(0).max(120).optional().nullable().transform((value) => value ?? null),
  photo: optionalPublicUrl(),
  bio: optionalText(8_000),
  linkedinUrl: optionalPublicUrl(false),
  instagramUrl: optionalPublicUrl(false),
  websiteUrl: optionalPublicUrl(false),
  profileUrl: optionalPublicUrl(false),
  sortOrder,
});

export const speakerSchema = personSchema.extend({
  isTopContender: z.boolean().optional().default(false),
});

export const juryMemberSchema = personSchema.extend({
  organization: z.string().trim().min(1).max(180),
  url: optionalPublicUrl(false),
});

export const sponsorSchema = z.object({
  name: z.string().trim().min(1).max(180),
  tier: z.enum(["title_partner", "strategic_partner", "media_partner", "community_partner"]),
  logo: optionalPublicUrl(),
  website: optionalPublicUrl(false),
  description: optionalText(4_000),
  sortOrder,
});

export const noticeSchema = z.object({
  id: contentIdSchema.optional(),
  title: z.string().trim().min(1).max(180),
  eyebrow: optionalText(140),
  description: optionalText(5_000),
  image: optionalPublicUrl(),
  ctaLabel: optionalText(100),
  ctaUrl: optionalPublicUrl(),
  isActive: z.boolean(),
});

const siteSettingKeys = [
  "hero", "stats", "about", "why_recognition", "marquee", "social_links",
  "summit_date", "nomination_close_date", "footer_about", "nomination_cta",
  "magazine_feature", "visibility",
] as const;

const siteSettingValues = {
  hero: z.object({ headline: z.string().trim().min(1).max(180), accentText: z.string().trim().max(180), subheadline: z.string().trim().max(1_000) }),
  stats: z.object({ useNominationCount: z.boolean(), items: z.array(z.object({ value: z.number().finite(), suffix: z.string().max(32), label: z.string().trim().min(1).max(100) })).max(12) }),
  about: z.object({ title: z.string().trim().min(1).max(180), paragraph1: z.string().trim().max(4_000), paragraph2: z.string().trim().max(4_000), highlightedText: z.string().trim().max(500).optional() }),
  why_recognition: z.object({ title: z.string().trim().min(1).max(180), subtitle: z.string().trim().max(1_000), cards: z.array(z.object({ id: z.string().trim().min(1).max(80), title: z.string().trim().min(1).max(180), description: z.string().trim().max(2_000), visible: z.boolean() })).max(24) }),
  marquee: z.object({ words: z.array(z.string().trim().min(1).max(80)).min(1).max(24) }),
  social_links: z.object({ links: z.array(z.object({ label: z.string().trim().min(1).max(80), href: optionalPublicUrl(false), icon: z.string().trim().min(1).max(40) })).max(12) }),
  summit_date: z.string().date().or(z.literal("")),
  nomination_close_date: z.string().date().or(z.literal("")),
  footer_about: z.string().trim().max(4_000),
  nomination_cta: z.object({ headline: z.string().trim().min(1).max(300), subheadline: z.string().trim().max(1_000) }),
  magazine_feature: z.object({ title: z.string().trim().min(1).max(180), body: z.string().trim().max(4_000), ctaText: z.string().trim().max(180) }),
  visibility: z.object({ showFooter: z.boolean(), showProgramBrandSections: z.boolean() }),
} as const;

export const siteSettingSchema = z.object({
  key: z.enum(siteSettingKeys),
  value: z.string().max(50_000),
}).superRefine(({ key, value }, ctx) => {
  let parsed: unknown;
  try {
    parsed = JSON.parse(value);
  } catch {
    ctx.addIssue({ code: "custom", path: ["value"], message: "Setting content must be valid JSON." });
    return;
  }

  const result = siteSettingValues[key].safeParse(parsed);
  if (!result.success) {
    ctx.addIssue({ code: "custom", path: ["value"], message: result.error.issues[0]?.message ?? "Invalid setting content." });
  }
});

export function parseAdminInput<T>(schema: z.ZodType<T>, input: unknown): T {
  const parsed = schema.safeParse(input);
  if (parsed.success) return parsed.data;
  throw new Error(parsed.error.issues[0]?.message ?? "Invalid content.");
}
