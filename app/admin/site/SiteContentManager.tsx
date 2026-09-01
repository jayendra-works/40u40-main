"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type {
  HeroSetting,
  StatsSetting,
  AboutSetting,
  WhyRecognitionSetting,
  SocialLinksSetting,
  NominationCtaSetting,
  MagazineFeatureSetting,
  VisibilitySetting,
  MarqueeSetting,
} from "@/lib/site-settings";
import { upsertSiteSetting } from "@/app/actions/site-settings-admin";
import { WHY_RECOGNITION_CARDS } from "@/data/whyRecognition";

type InitialSettings = Awaited<ReturnType<typeof import("@/lib/site-settings").getAllSiteSettingsForHome>>;

const TABS = [
  "hero",
  "stats",
  "about",
  "why_recognition",
  "marquee",
  "social_links",
  "summit_date",
  "nomination_close",
  "footer_about",
  "nomination_cta",
  "magazine_feature",
  "visibility",
] as const;

export function SiteContentManager({ initialSettings }: { initialSettings: InitialSettings }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<(typeof TABS)[number]>("hero");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  return (
    <div className="space-y-6">
      {error && (
        <p className="text-red-400 text-sm rounded-lg bg-red-400/10 px-4 py-2">
          {error}
        </p>
      )}
      <div className="flex flex-wrap gap-2 border-b border-neutral-600 pb-2 overflow-x-auto">
        {TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`flex-shrink-0 px-4 py-2 rounded-t text-sm font-medium touch-manipulation ${
              activeTab === tab
                ? "bg-secondary/50 text-gold border border-neutral-600 border-b-transparent -mb-0.5"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            {tab.replace(/_/g, " ")}
          </button>
        ))}
      </div>

      {activeTab === "hero" && (
        <HeroForm
          initial={initialSettings.hero}
          onSave={async (data) => {
            setError(null);
            setSaving(true);
            try {
              await upsertSiteSetting("hero", JSON.stringify(data));
              router.refresh();
            } catch (e) {
              setError(e instanceof Error ? e.message : "Failed to save");
            } finally {
              setSaving(false);
            }
          }}
          saving={saving}
        />
      )}
      {activeTab === "stats" && (
        <StatsForm
          initial={initialSettings.stats}
          onSave={async (data) => {
            setError(null);
            setSaving(true);
            try {
              await upsertSiteSetting("stats", JSON.stringify(data));
              router.refresh();
            } catch (e) {
              setError(e instanceof Error ? e.message : "Failed to save");
            } finally {
              setSaving(false);
            }
          }}
          saving={saving}
        />
      )}
      {activeTab === "about" && (
        <AboutForm
          initial={initialSettings.about}
          onSave={async (data) => {
            setError(null);
            setSaving(true);
            try {
              await upsertSiteSetting("about", JSON.stringify(data));
              router.refresh();
            } catch (e) {
              setError(e instanceof Error ? e.message : "Failed to save");
            } finally {
              setSaving(false);
            }
          }}
          saving={saving}
        />
      )}
      {activeTab === "why_recognition" && (
        <WhyRecognitionForm
          initial={initialSettings.whyRecognition}
          onSave={async (data) => {
            setError(null);
            setSaving(true);
            try {
              await upsertSiteSetting("why_recognition", JSON.stringify(data));
              router.refresh();
            } catch (e) {
              setError(e instanceof Error ? e.message : "Failed to save");
            } finally {
              setSaving(false);
            }
          }}
          saving={saving}
        />
      )}
      {activeTab === "marquee" && (
        <MarqueeForm
          initial={initialSettings.marquee}
          onSave={async (data) => {
            setError(null);
            setSaving(true);
            try {
              await upsertSiteSetting("marquee", JSON.stringify(data));
              router.refresh();
            } catch (e) {
              setError(e instanceof Error ? e.message : "Failed to save");
            } finally {
              setSaving(false);
            }
          }}
          saving={saving}
        />
      )}
      {activeTab === "social_links" && (
        <SocialLinksForm
          initial={initialSettings.socialLinks}
          onSave={async (data) => {
            setError(null);
            setSaving(true);
            try {
              await upsertSiteSetting("social_links", JSON.stringify(data));
              router.refresh();
            } catch (e) {
              setError(e instanceof Error ? e.message : "Failed to save");
            } finally {
              setSaving(false);
            }
          }}
          saving={saving}
        />
      )}
      {activeTab === "summit_date" && (
        <SummitDateForm
          initial={initialSettings.summitDate}
          onSave={async (value) => {
            setError(null);
            setSaving(true);
            try {
              await upsertSiteSetting("summit_date", JSON.stringify(value || ""));
              router.refresh();
            } catch (e) {
              setError(e instanceof Error ? e.message : "Failed to save");
            } finally {
              setSaving(false);
            }
          }}
          saving={saving}
        />
      )}
      {activeTab === "nomination_close" && (
        <SummitDateForm
          initial={initialSettings.nominationCloseDate}
          label="Nomination closing date (ISO, e.g. 2026-09-16)"
          onSave={async (value) => {
            setError(null); setSaving(true);
            try { await upsertSiteSetting("nomination_close_date", JSON.stringify(value || "")); router.refresh(); }
            catch (e) { setError(e instanceof Error ? e.message : "Failed to save"); }
            finally { setSaving(false); }
          }} saving={saving}
        />
      )}
      {activeTab === "footer_about" && (
        <FooterAboutForm
          initial={initialSettings.footerAbout}
          onSave={async (value) => {
            setError(null);
            setSaving(true);
            try {
              await upsertSiteSetting("footer_about", JSON.stringify(value));
              router.refresh();
            } catch (e) {
              setError(e instanceof Error ? e.message : "Failed to save");
            } finally {
              setSaving(false);
            }
          }}
          saving={saving}
        />
      )}
      {activeTab === "nomination_cta" && (
        <NominationCtaForm
          initial={initialSettings.nominationCta}
          onSave={async (data) => {
            setError(null);
            setSaving(true);
            try {
              await upsertSiteSetting("nomination_cta", JSON.stringify(data));
              router.refresh();
            } catch (e) {
              setError(e instanceof Error ? e.message : "Failed to save");
            } finally {
              setSaving(false);
            }
          }}
          saving={saving}
        />
      )}
      {activeTab === "magazine_feature" && (
        <MagazineFeatureForm
          initial={initialSettings.magazineFeature}
          onSave={async (data) => {
            setError(null);
            setSaving(true);
            try {
              await upsertSiteSetting("magazine_feature", JSON.stringify(data));
              router.refresh();
            } catch (e) {
              setError(e instanceof Error ? e.message : "Failed to save");
            } finally {
              setSaving(false);
            }
          }}
          saving={saving}
        />
      )}
      {activeTab === "visibility" && (
        <VisibilityForm
          initial={initialSettings.visibility}
          onSave={async (data) => {
            setError(null);
            setSaving(true);
            try {
              await upsertSiteSetting("visibility", JSON.stringify(data));
              router.refresh();
            } catch (e) {
              setError(e instanceof Error ? e.message : "Failed to save");
            } finally {
              setSaving(false);
            }
          }}
          saving={saving}
        />
      )}
    </div>
  );
}

function FormActions({ saving }: { saving: boolean }) {
  return (
    <div className="mt-4">
      <button
        type="submit"
        disabled={saving}
        className="px-4 py-2 rounded bg-gold text-primary font-medium hover:bg-gold/90 disabled:opacity-50"
      >
        {saving ? "Saving…" : "Save"}
      </button>
    </div>
  );
}

function HeroForm({
  initial,
  onSave,
  saving,
}: {
  initial: HeroSetting;
  onSave: (data: HeroSetting) => Promise<void>;
  saving: boolean;
}) {
  const [headline, setHeadline] = useState(initial.headline);
  const [accentText, setAccentText] = useState(initial.accentText);
  const [subheadline, setSubheadline] = useState(initial.subheadline);

  return (
    <form
      className="space-y-4 max-w-2xl"
      onSubmit={(e) => {
        e.preventDefault();
        onSave({ headline, accentText, subheadline });
      }}
    >
      <div>
        <label className="block text-sm text-neutral-400 mb-1">Headline</label>
        <input
          type="text"
          value={headline}
          onChange={(e) => setHeadline(e.target.value)}
          className="w-full px-3 py-2 rounded bg-secondary border border-neutral-600 text-white"
        />
      </div>
      <div>
        <label className="block text-sm text-neutral-400 mb-1">Accent text (gold part)</label>
        <input
          type="text"
          value={accentText}
          onChange={(e) => setAccentText(e.target.value)}
          className="w-full px-3 py-2 rounded bg-secondary border border-neutral-600 text-white"
        />
      </div>
      <div>
        <label className="block text-sm text-neutral-400 mb-1">Subheadline</label>
        <textarea
          value={subheadline}
          onChange={(e) => setSubheadline(e.target.value)}
          rows={3}
          className="w-full px-3 py-2 rounded bg-secondary border border-neutral-600 text-white"
        />
      </div>
      <FormActions saving={saving} />
    </form>
  );
}

function StatsForm({
  initial,
  onSave,
  saving,
}: {
  initial: StatsSetting;
  onSave: (data: StatsSetting) => Promise<void>;
  saving: boolean;
}) {
  const [useNominationCount] = useState(false);
  const [items, setItems] = useState(initial.items);

  const updateItem = (index: number, field: "value" | "suffix" | "label", value: string | number) => {
    const next = [...items];
    next[index] = { ...next[index], [field]: value };
    setItems(next);
  };

  return (
    <form
      className="space-y-4 max-w-2xl"
      onSubmit={(e) => {
        e.preventDefault();
        onSave({ useNominationCount, items });
      }}
    >
      <p className="text-neutral-500 text-sm">Stat rows (value, suffix, label).</p>
      {items.map((item, i) => (
        <div key={i} className="grid grid-cols-3 gap-2 items-end">
          <div>
            <label className="block text-xs text-neutral-500 mb-1">Value</label>
            <input
              type="number"
              value={item.value}
              onChange={(e) => updateItem(i, "value", parseInt(e.target.value, 10) || 0)}
              className="w-full px-3 py-2 rounded bg-secondary border border-neutral-600 text-white"
            />
          </div>
          <div>
            <label className="block text-xs text-neutral-500 mb-1">Suffix</label>
            <input
              type="text"
              value={item.suffix}
              onChange={(e) => updateItem(i, "suffix", e.target.value)}
              placeholder="+"
              className="w-full px-3 py-2 rounded bg-secondary border border-neutral-600 text-white"
            />
          </div>
          <div>
            <label className="block text-xs text-neutral-500 mb-1">Label</label>
            <input
              type="text"
              value={item.label}
              onChange={(e) => updateItem(i, "label", e.target.value)}
              className="w-full px-3 py-2 rounded bg-secondary border border-neutral-600 text-white"
            />
          </div>
        </div>
      ))}
      <FormActions saving={saving} />
    </form>
  );
}

function AboutForm({
  initial,
  onSave,
  saving,
}: {
  initial: AboutSetting;
  onSave: (data: AboutSetting) => Promise<void>;
  saving: boolean;
}) {
  const [title, setTitle] = useState(initial.title);
  const [paragraph1, setParagraph1] = useState(initial.paragraph1);
  const [paragraph2, setParagraph2] = useState(initial.paragraph2);
  const [highlightedText, setHighlightedText] = useState(initial.highlightedText ?? "");

  return (
    <form
      className="space-y-4 max-w-2xl"
      onSubmit={(e) => {
        e.preventDefault();
        onSave({ title, paragraph1, paragraph2, highlightedText: highlightedText || undefined });
      }}
    >
      <div>
        <label className="block text-sm text-neutral-400 mb-1">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-3 py-2 rounded bg-secondary border border-neutral-600 text-white"
        />
      </div>
      <div>
        <label className="block text-sm text-neutral-400 mb-1">Paragraph 1</label>
        <textarea
          value={paragraph1}
          onChange={(e) => setParagraph1(e.target.value)}
          rows={3}
          className="w-full px-3 py-2 rounded bg-secondary border border-neutral-600 text-white"
        />
      </div>
      <div>
        <label className="block text-sm text-neutral-400 mb-1">Paragraph 2</label>
        <textarea
          value={paragraph2}
          onChange={(e) => setParagraph2(e.target.value)}
          rows={3}
          className="w-full px-3 py-2 rounded bg-secondary border border-neutral-600 text-white"
        />
      </div>
      <div>
        <label className="block text-sm text-neutral-400 mb-1">Highlighted text (in paragraph 2)</label>
        <input
          type="text"
          value={highlightedText}
          onChange={(e) => setHighlightedText(e.target.value)}
          className="w-full px-3 py-2 rounded bg-secondary border border-neutral-600 text-white"
        />
      </div>
      <FormActions saving={saving} />
    </form>
  );
}

function WhyRecognitionForm({
  initial,
  onSave,
  saving,
}: {
  initial: WhyRecognitionSetting;
  onSave: (data: WhyRecognitionSetting) => Promise<void>;
  saving: boolean;
}) {
  const [title, setTitle] = useState(initial.title);
  const [subtitle, setSubtitle] = useState(initial.subtitle);
  const [cards, setCards] = useState(() => {
    const normalized = initial.cards.map((card) => ({ ...card, visible: card.visible ?? true }));
    const existingIds = new Set(normalized.map((card) => card.id));
    const missingDefaults = WHY_RECOGNITION_CARDS.filter((card) => !existingIds.has(card.id)).map((card) => ({
      ...card,
      visible: card.visible ?? true,
    }));
    return [...normalized, ...missingDefaults];
  });

  const updateCard = (
    index: number,
    field: "title" | "description" | "visible",
    value: string | boolean
  ) => {
    const next = [...cards];
    next[index] = { ...next[index], [field]: value };
    setCards(next);
  };

  const addCard = () => {
    const id = `card_${Date.now()}`;
    setCards([
      ...cards,
      {
        id,
        title: "",
        description: "",
        visible: true,
      },
    ]);
  };

  const removeCard = (index: number) => {
    setCards(cards.filter((_, i) => i !== index));
  };

  const moveCard = (index: number, direction: -1 | 1) => {
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= cards.length) return;

    const next = [...cards];
    const tmp = next[index];
    next[index] = next[nextIndex];
    next[nextIndex] = tmp;
    setCards(next);
  };

  return (
    <form
      className="space-y-4 max-w-2xl"
      onSubmit={(e) => {
        e.preventDefault();
        onSave({ title, subtitle, cards });
      }}
    >
      <div>
        <label className="block text-sm text-neutral-400 mb-1">Section title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-3 py-2 rounded bg-secondary border border-neutral-600 text-white"
        />
      </div>
      <div>
        <label className="block text-sm text-neutral-400 mb-1">Subtitle</label>
        <input
          type="text"
          value={subtitle}
          onChange={(e) => setSubtitle(e.target.value)}
          className="w-full px-3 py-2 rounded bg-secondary border border-neutral-600 text-white"
        />
      </div>
      {cards.map((card, i) => (
        <div key={card.id} className="border border-neutral-600 rounded p-4 space-y-2">
          <span className="text-neutral-500 text-sm">Card: {card.id}</span>
          <input
            type="text"
            value={card.title}
            onChange={(e) => updateCard(i, "title", e.target.value)}
            placeholder="Title"
            className="w-full px-3 py-2 rounded bg-secondary border border-neutral-600 text-white"
          />
          <textarea
            value={card.description}
            onChange={(e) => updateCard(i, "description", e.target.value)}
            placeholder="Description"
            rows={2}
            className="w-full px-3 py-2 rounded bg-secondary border border-neutral-600 text-white"
          />
          <div className="flex items-center justify-between gap-4">
            <label className="flex items-center gap-2 text-sm text-neutral-300">
              <input
                type="checkbox"
                checked={card.visible !== false}
                onChange={(e) => updateCard(i, "visible", e.target.checked)}
              />
              Show on website
            </label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => moveCard(i, -1)}
                disabled={i === 0}
                className="px-2 py-1 text-sm rounded border border-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed text-neutral-200 hover:bg-neutral-800"
                aria-label="Move card up"
              >
                ↑
              </button>
              <button
                type="button"
                onClick={() => moveCard(i, 1)}
                disabled={i === cards.length - 1}
                className="px-2 py-1 text-sm rounded border border-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed text-neutral-200 hover:bg-neutral-800"
                aria-label="Move card down"
              >
                ↓
              </button>
              <button
                type="button"
                onClick={() => removeCard(i)}
                className="text-sm text-red-400 hover:text-red-300"
              >
                Delete card
              </button>
            </div>
          </div>
        </div>
      ))}
      <button type="button" onClick={addCard} className="text-sm text-gold hover:underline">
        + Add card
      </button>
      <FormActions saving={saving} />
    </form>
  );
}

function SocialLinksForm({
  initial,
  onSave,
  saving,
}: {
  initial: SocialLinksSetting;
  onSave: (data: SocialLinksSetting) => Promise<void>;
  saving: boolean;
}) {
  const [links, setLinks] = useState(initial.links);

  const updateLink = (index: number, field: "label" | "href" | "icon", value: string) => {
    const next = [...links];
    next[index] = { ...next[index], [field]: value };
    setLinks(next);
  };

  const addLink = () => {
    setLinks([...links, { label: "", href: "", icon: "link" }]);
  };

  const removeLink = (index: number) => {
    setLinks(links.filter((_, i) => i !== index));
  };

  return (
    <form
      className="space-y-4 max-w-2xl"
      onSubmit={(e) => {
        e.preventDefault();
        onSave({ links });
      }}
    >
      <p className="text-neutral-500 text-sm">Icon: linkedin, twitter, instagram, or link</p>
      {links.map((link, i) => (
        <div key={i} className="flex gap-2 items-end flex-wrap">
          <input
            type="text"
            value={link.label}
            onChange={(e) => updateLink(i, "label", e.target.value)}
            placeholder="Label"
            className="flex-1 min-w-[100px] px-3 py-2 rounded bg-secondary border border-neutral-600 text-white"
          />
          <input
            type="url"
            value={link.href}
            onChange={(e) => updateLink(i, "href", e.target.value)}
            placeholder="URL"
            className="flex-1 min-w-[120px] px-3 py-2 rounded bg-secondary border border-neutral-600 text-white"
          />
          <input
            type="text"
            value={link.icon}
            onChange={(e) => updateLink(i, "icon", e.target.value)}
            placeholder="icon"
            className="w-24 px-3 py-2 rounded bg-secondary border border-neutral-600 text-white"
          />
          <button type="button" onClick={() => removeLink(i)} className="px-2 py-1 text-red-400 text-sm">
            Remove
          </button>
        </div>
      ))}
      <button type="button" onClick={addLink} className="text-sm text-gold hover:underline">
        + Add link
      </button>
      <FormActions saving={saving} />
    </form>
  );
}

function SummitDateForm({
  initial,
  onSave,
  saving,
  label = "Summit / event date (ISO, e.g. 2026-09-20)",
}: {
  initial: string | null;
  onSave: (value: string | null) => Promise<void>;
  saving: boolean;
  label?: string;
}) {
  const [value, setValue] = useState(initial ?? "");

  return (
    <form
      className="space-y-4 max-w-2xl"
      onSubmit={(e) => {
        e.preventDefault();
        onSave(value.trim() || null);
      }}
    >
      <div>
        <label className="block text-sm text-neutral-400 mb-1">{label}</label>
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="2026-06-15"
          className="w-full px-3 py-2 rounded bg-secondary border border-neutral-600 text-white"
        />
      </div>
      <FormActions saving={saving} />
    </form>
  );
}

function FooterAboutForm({
  initial,
  onSave,
  saving,
}: {
  initial: string;
  onSave: (value: string) => Promise<void>;
  saving: boolean;
}) {
  const [value, setValue] = useState(initial);

  return (
    <form
      className="space-y-4 max-w-2xl"
      onSubmit={(e) => {
        e.preventDefault();
        onSave(value);
      }}
    >
      <div>
        <label className="block text-sm text-neutral-400 mb-1">Footer “About” paragraph</label>
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          rows={4}
          className="w-full px-3 py-2 rounded bg-secondary border border-neutral-600 text-white"
        />
      </div>
      <FormActions saving={saving} />
    </form>
  );
}

function NominationCtaForm({
  initial,
  onSave,
  saving,
}: {
  initial: NominationCtaSetting;
  onSave: (data: NominationCtaSetting) => Promise<void>;
  saving: boolean;
}) {
  const [headline, setHeadline] = useState(initial.headline);
  const [subheadline, setSubheadline] = useState(initial.subheadline);

  return (
    <form
      className="space-y-4 max-w-2xl"
      onSubmit={(e) => {
        e.preventDefault();
        onSave({ headline, subheadline });
      }}
    >
      <div>
        <label className="block text-sm text-neutral-400 mb-1">Headline</label>
        <input
          type="text"
          value={headline}
          onChange={(e) => setHeadline(e.target.value)}
          className="w-full px-3 py-2 rounded bg-secondary border border-neutral-600 text-white"
        />
      </div>
      <div>
        <label className="block text-sm text-neutral-400 mb-1">Subheadline</label>
        <textarea
          value={subheadline}
          onChange={(e) => setSubheadline(e.target.value)}
          rows={2}
          className="w-full px-3 py-2 rounded bg-secondary border border-neutral-600 text-white"
        />
      </div>
      <FormActions saving={saving} />
    </form>
  );
}

function MagazineFeatureForm({
  initial,
  onSave,
  saving,
}: {
  initial: MagazineFeatureSetting;
  onSave: (data: MagazineFeatureSetting) => Promise<void>;
  saving: boolean;
}) {
  const [title, setTitle] = useState(initial.title);
  const [body, setBody] = useState(initial.body);
  const [ctaText, setCtaText] = useState(initial.ctaText);

  return (
    <form
      className="space-y-4 max-w-2xl"
      onSubmit={(e) => {
        e.preventDefault();
        onSave({ title, body, ctaText });
      }}
    >
      <div>
        <label className="block text-sm text-neutral-400 mb-1">Section title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-3 py-2 rounded bg-secondary border border-neutral-600 text-white"
        />
      </div>
      <div>
        <label className="block text-sm text-neutral-400 mb-1">Body text</label>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={4}
          className="w-full px-3 py-2 rounded bg-secondary border border-neutral-600 text-white"
        />
      </div>
      <div>
        <label className="block text-sm text-neutral-400 mb-1">CTA link text</label>
        <input
          type="text"
          value={ctaText}
          onChange={(e) => setCtaText(e.target.value)}
          className="w-full px-3 py-2 rounded bg-secondary border border-neutral-600 text-white"
        />
      </div>
      <FormActions saving={saving} />
    </form>
  );
}

function MarqueeForm({
  initial,
  onSave,
  saving,
}: {
  initial: MarqueeSetting;
  onSave: (data: MarqueeSetting) => Promise<void>;
  saving: boolean;
}) {
  const [words, setWords] = useState<string[]>(initial.words);

  const updateWord = (index: number, value: string) => {
    const next = [...words];
    next[index] = value;
    setWords(next);
  };

  const addWord = () => setWords([...words, ""]);

  const removeWord = (index: number) => {
    if (words.length <= 1) return;
    setWords(words.filter((_, i) => i !== index));
  };

  const moveWord = (index: number, direction: -1 | 1) => {
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= words.length) return;
    const next = [...words];
    [next[index], next[nextIndex]] = [next[nextIndex], next[index]];
    setWords(next);
  };

  return (
    <form
      className="space-y-4 max-w-2xl"
      onSubmit={(e) => {
        e.preventDefault();
        const clean = words.map((w) => w.trim()).filter(Boolean);
        onSave({ words: clean.length > 0 ? clean : initial.words });
      }}
    >
      <p className="text-neutral-500 text-sm">
        Words that scroll in the marquee band. Displayed in uppercase. Add as many as you like.
      </p>
      {words.map((word, i) => (
        <div key={i} className="flex gap-2 items-center">
          <input
            type="text"
            value={word}
            onChange={(e) => updateWord(i, e.target.value)}
            placeholder="e.g. Innovators"
            className="flex-1 px-3 py-2 rounded bg-secondary border border-neutral-600 text-white"
          />
          <button
            type="button"
            onClick={() => moveWord(i, -1)}
            disabled={i === 0}
            className="px-2 py-1 text-sm rounded border border-neutral-700 disabled:opacity-30 text-neutral-200 hover:bg-neutral-800"
            aria-label="Move up"
          >
            ↑
          </button>
          <button
            type="button"
            onClick={() => moveWord(i, 1)}
            disabled={i === words.length - 1}
            className="px-2 py-1 text-sm rounded border border-neutral-700 disabled:opacity-30 text-neutral-200 hover:bg-neutral-800"
            aria-label="Move down"
          >
            ↓
          </button>
          <button
            type="button"
            onClick={() => removeWord(i)}
            disabled={words.length <= 1}
            className="text-sm text-red-400 hover:text-red-300 disabled:opacity-30"
          >
            Remove
          </button>
        </div>
      ))}
      <button type="button" onClick={addWord} className="text-sm text-gold hover:underline">
        + Add word
      </button>
      <FormActions saving={saving} />
    </form>
  );
}

function VisibilityForm({
  initial,
  onSave,
  saving,
}: {
  initial: VisibilitySetting;
  onSave: (data: VisibilitySetting) => Promise<void>;
  saving: boolean;
}) {
  const [showFooter, setShowFooter] = useState(initial.showFooter);
  const [showProgramBrandSections, setShowProgramBrandSections] = useState(initial.showProgramBrandSections);

  return (
    <form
      className="space-y-4 max-w-2xl"
      onSubmit={(e) => {
        e.preventDefault();
        onSave({ showFooter, showProgramBrandSections });
      }}
    >
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={showFooter}
          onChange={(e) => setShowFooter(e.target.checked)}
          className="rounded border-neutral-600"
        />
        <span className="text-sm text-neutral-300">Show footer (brand details, links, social, copyright)</span>
      </label>

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={showProgramBrandSections}
          onChange={(e) => setShowProgramBrandSections(e.target.checked)}
          className="rounded border-neutral-600"
        />
        <span className="text-sm text-neutral-300">Show Program brand sections (Magazine Feature and Partners)</span>
      </label>

      <FormActions saving={saving} />
    </form>
  );
}
