import { prisma } from "@/lib/prisma";

export type HeroSetting = {
  headline: string;
  accentText: string;
  subheadline: string;
};

export type StatItemSetting = {
  value: number;
  suffix: string;
  label: string;
};

export type StatsSetting = {
  useNominationCount: boolean;
  items: StatItemSetting[];
};

export type AboutSetting = {
  title: string;
  paragraph1: string;
  paragraph2: string;
  highlightedText?: string;
};

export type WhyRecognitionCardSetting = {
  id: string;
  title: string;
  description: string;
  visible: boolean;
};

export type WhyRecognitionSetting = {
  title: string;
  subtitle: string;
  cards: WhyRecognitionCardSetting[];
};

export type SocialLinkSetting = {
  label: string;
  href: string;
  icon: string;
};

export type SocialLinksSetting = {
  links: SocialLinkSetting[];
};

export type NominationCtaSetting = {
  headline: string;
  subheadline: string;
};

export type MagazineFeatureSetting = {
  title: string;
  body: string;
  ctaText: string;
};

export type VisibilitySetting = {
  showFooter: boolean;
  showProgramBrandSections: boolean;
};

export type MarqueeSetting = {
  words: string[];
};

const DEFAULT_HERO: HeroSetting = {
  headline: "India's 40 Under 40",
  accentText: "Leaders 2026",
  subheadline:
    "Recognizing the next generation of entrepreneurs, innovators, and changemakers shaping the future of India.",
};

const DEFAULT_STATS: StatsSetting = {
  useNominationCount: false,
  items: [
    { value: 5000, suffix: "+", label: "Leaders recognized" },
    { value: 50, suffix: "+", label: "Countries represented" },
    { value: 100, suffix: "+", label: "Industry speakers" },
    { value: 2016, suffix: "", label: "Since" },
  ],
};

const DEFAULT_ABOUT: AboutSetting = {
  title: "About the Awards",
  paragraph1:
    "40 Under 40 by Asia Inc. 500 is a national recognition platform celebrating exceptional leaders under the age of 40 who are transforming industries through innovation, leadership, and measurable impact.",
  paragraph2:
    "The initiative identifies rising entrepreneurs, executives, creators, and professionals shaping the future of India's economy. The program culminates in the India 40 Under 40 Leadership Summit & Awards Gala.",
  highlightedText: "India 40 Under 40 Leadership Summit & Awards Gala",
};

const DEFAULT_WHY_RECOGNITION: WhyRecognitionSetting = {
  title: "Why This Recognition Matters",
  subtitle:
    "Join a prestigious community of leaders driving change across industries.",
  cards: [
    {
      id: "industry",
      title: "Industry Recognition",
      description:
        "Join an elite cohort of leaders recognized by Asia Inc. 500 and industry peers for outstanding achievement.",
      visible: true,
    },
    {
      id: "media",
      title: "Media Visibility",
      description:
        "Featured in Asia Inc. 500 Magazine and across our media channels, amplifying your story and impact.",
      visible: true,
    },
    {
      id: "network",
      title: "Leadership Network",
      description:
        "Connect with fellow honorees, investors, and decision-makers at the Leadership Summit and beyond.",
      visible: true,
    },
    {
      id: "global_credibility",
      title: "Global Credibility",
      description:
        "Backed by global institutions, this platform positions leaders from India as credible global voices.",
      visible: true,
    },
    {
      id: "curated_honor",
      title: "Curated, Not Crowdsourced",
      description:
        "Selections are jury-led and merit-based, making the list a trusted benchmark of real excellence.",
      visible: true,
    },
    {
      id: "cross_industry",
      title: "Cross-Industry Influence",
      description:
        "The list spans business, technology, media, sports, and culture, reflecting modern leadership.",
      visible: true,
    },
    {
      id: "ecosystem_access",
      title: "Access to a Powerful Ecosystem",
      description:
        "Honorees gain access to founders, investors, creators, and strategic collaboration opportunities.",
      visible: true,
    },
    {
      id: "impact_not_success",
      title: "Impact, Not Just Success",
      description:
        "Recognition focuses on measurable innovation and contribution, not visibility alone.",
      visible: true,
    },
    {
      id: "future_of_india",
      title: "Representing India's Future",
      description:
        "These are the leaders expected to shape India’s global economic and cultural trajectory.",
      visible: true,
    },
  ],
};

const DEFAULT_SOCIAL_LINKS: SocialLinksSetting = {
  links: [
    { label: "LinkedIn", href: "https://linkedin.com", icon: "linkedin" },
    { label: "Twitter", href: "https://twitter.com", icon: "twitter" },
    { label: "Instagram", href: "https://instagram.com", icon: "instagram" },
  ],
};

const DEFAULT_FOOTER_ABOUT =
  "Asia Inc. 500 is a premier business magazine and recognition platform dedicated to spotlighting excellence across Asia through influential publications, rankings, and leadership events.";

const DEFAULT_NOMINATION_CTA: NominationCtaSetting = {
  headline: "Know someone redefining their industry before 40?",
  subheadline: "Nominate a leader or apply for yourself. Join the 2026 cohort.",
};

const DEFAULT_MAGAZINE: MagazineFeatureSetting = {
  title: "Magazine Feature",
  body:
    "Selected leaders will be featured in a special edition of Asia Inc. 500 Magazine, highlighting their achievements and leadership journeys.",
  ctaText: "Learn about past editions →",
};

const DEFAULT_VISIBILITY: VisibilitySetting = {
  showFooter: true,
  showProgramBrandSections: true,
};

const DEFAULT_MARQUEE: MarqueeSetting = {
  words: [
    "Innovators",
    "Leaders",
    "Visionaries",
    "Entrepreneurs",
    "Changemakers",
  ],
};

function parseJson<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    const parsed = JSON.parse(raw) as T;
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
}

export async function getSiteSetting(key: string): Promise<string | null> {
  const row = await prisma.siteSetting.findUnique({
    where: { key },
    select: { value: true },
  });
  return row?.value ?? null;
}

export async function getHeroSetting(): Promise<HeroSetting> {
  const raw = await getSiteSetting("hero");
  return parseJson<HeroSetting>(raw, DEFAULT_HERO);
}

export async function getStatsSetting(): Promise<StatsSetting> {
  const raw = await getSiteSetting("stats");
  return parseJson<StatsSetting>(raw, DEFAULT_STATS);
}

export async function getAboutSetting(): Promise<AboutSetting> {
  const raw = await getSiteSetting("about");
  return parseJson<AboutSetting>(raw, DEFAULT_ABOUT);
}

export async function getWhyRecognitionSetting(): Promise<WhyRecognitionSetting> {
  const raw = await getSiteSetting("why_recognition");
  const parsed = parseJson<WhyRecognitionSetting>(raw, DEFAULT_WHY_RECOGNITION);
  const parsedCards = (parsed.cards ?? []).map((card) => ({
    ...card,
    visible: card.visible ?? true,
  }));

  const parsedById = new Map(parsedCards.map((card) => [card.id, card]));
  const mergedCards = [...parsedCards];

  // Backfill newly introduced default cards for older saved settings.
  for (const defaultCard of DEFAULT_WHY_RECOGNITION.cards) {
    if (!parsedById.has(defaultCard.id)) {
      mergedCards.push(defaultCard);
    }
  }

  return {
    title: parsed.title ?? DEFAULT_WHY_RECOGNITION.title,
    subtitle: parsed.subtitle ?? DEFAULT_WHY_RECOGNITION.subtitle,
    cards: mergedCards.length > 0 ? mergedCards : DEFAULT_WHY_RECOGNITION.cards,
  };
}

export async function getSocialLinksSetting(): Promise<SocialLinksSetting> {
  const raw = await getSiteSetting("social_links");
  return parseJson<SocialLinksSetting>(raw, DEFAULT_SOCIAL_LINKS);
}

/** Returns ISO date string or null if not set. */
export async function getSummitDateSetting(): Promise<string | null> {
  const raw = await getSiteSetting("summit_date");
  if (!raw) return null;
  try {
    const s = JSON.parse(raw) as string;
    return typeof s === "string" && s.length > 0 ? s : null;
  } catch {
    return null;
  }
}

export async function getNominationCloseDateSetting(): Promise<string | null> {
  const raw = await getSiteSetting("nomination_close_date");
  if (!raw) return null;
  try { const value = JSON.parse(raw) as string; return typeof value === "string" && value ? value : null; } catch { return null; }
}

export async function getFooterAboutSetting(): Promise<string> {
  const raw = await getSiteSetting("footer_about");
  if (!raw) return DEFAULT_FOOTER_ABOUT;
  try {
    const s = JSON.parse(raw) as string;
    return typeof s === "string" ? s : DEFAULT_FOOTER_ABOUT;
  } catch {
    return DEFAULT_FOOTER_ABOUT;
  }
}

export async function getNominationCtaSetting(): Promise<NominationCtaSetting> {
  const raw = await getSiteSetting("nomination_cta");
  return parseJson<NominationCtaSetting>(raw, DEFAULT_NOMINATION_CTA);
}

export async function getMagazineFeatureSetting(): Promise<MagazineFeatureSetting> {
  const raw = await getSiteSetting("magazine_feature");
  return parseJson<MagazineFeatureSetting>(raw, DEFAULT_MAGAZINE);
}

export async function getVisibilitySetting(): Promise<VisibilitySetting> {
  const raw = await getSiteSetting("visibility");
  return parseJson<VisibilitySetting>(raw, DEFAULT_VISIBILITY);
}

export async function getMarqueeSetting(): Promise<MarqueeSetting> {
  const raw = await getSiteSetting("marquee");
  const parsed = parseJson<MarqueeSetting>(raw, DEFAULT_MARQUEE);
  // Ensure words is always a non-empty array of strings
  const words = Array.isArray(parsed.words) && parsed.words.length > 0
    ? parsed.words.filter((w) => typeof w === "string" && w.trim().length > 0)
    : DEFAULT_MARQUEE.words;
  return { words };
}

export async function getAllSiteSettingsForHome(): Promise<{
  hero: HeroSetting;
  stats: StatsSetting;
  about: AboutSetting;
  whyRecognition: WhyRecognitionSetting;
  socialLinks: SocialLinksSetting;
  summitDate: string | null;
  nominationCloseDate: string | null;
  footerAbout: string;
  nominationCta: NominationCtaSetting;
  magazineFeature: MagazineFeatureSetting;
  visibility: VisibilitySetting;
  marquee: MarqueeSetting;
}> {
  const [
    hero,
    stats,
    about,
    whyRecognition,
    socialLinks,
    summitDate,
    nominationCloseDate,
    footerAbout,
    nominationCta,
    magazineFeature,
    visibility,
    marquee,
  ] = await Promise.all([
    getHeroSetting(),
    getStatsSetting(),
    getAboutSetting(),
    getWhyRecognitionSetting(),
    getSocialLinksSetting(),
    getSummitDateSetting(),
    getNominationCloseDateSetting(),
    getFooterAboutSetting(),
    getNominationCtaSetting(),
    getMagazineFeatureSetting(),
    getVisibilitySetting(),
    getMarqueeSetting(),
  ]);

  return {
    hero,
    stats,
    about,
    whyRecognition,
    socialLinks,
    summitDate,
    nominationCloseDate,
    footerAbout,
    nominationCta,
    magazineFeature,
    visibility,
    marquee,
  };
}
