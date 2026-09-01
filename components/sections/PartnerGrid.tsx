"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const TIER_LABELS: Record<string, string> = {
  title_partner: "Title Partner",
  strategic_partner: "Strategic Partner",
  media_partner: "Media Partner",
  community_partner: "Community Partner",
};

type Sponsor = {
  id: string;
  name: string;
  tier: string;
  logo: string | null;
  website: string | null;
};

export function PartnerGrid({ sponsors = [] }: { sponsors?: Sponsor[] }) {
  const byTier = sponsors.reduce<Record<string, Sponsor[]>>((acc, s) => {
    if (!acc[s.tier]) acc[s.tier] = [];
    acc[s.tier].push(s);
    return acc;
  }, {});
  const tiers = ["title_partner", "strategic_partner", "media_partner", "community_partner"];

  if (sponsors.length === 0) {
    return (
      <div className="space-y-12">
        {["Title Partner", "Strategic Partner", "Media Partner", "Community Partner"].map((label) => (
          <motion.div key={label} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h3 className="text-[9px] uppercase tracking-[0.3em] font-medium text-[#EAE6E1]/30 mb-6">{label}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <PlaceholderLogo />
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {tiers.map((tier, catIndex) => {
        const list = byTier[tier] ?? [];
        if (list.length === 0) return null;
        return (
          <motion.div
            key={tier}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: catIndex * 0.1 }}
          >
            <h3 className="text-[9px] uppercase tracking-[0.3em] font-medium text-[#EAE6E1]/30 mb-6">
              {TIER_LABELS[tier] ?? tier}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {list.map((s) => (
                <a
                  key={s.id}
                  href={s.website ?? "#"}
                  target={s.website ? "_blank" : undefined}
                  rel={s.website ? "noopener noreferrer" : undefined}
                  className="aspect-[3/1] min-h-[60px] border border-[#EAE6E1]/8 bg-[#0F0E0C] flex items-center justify-center p-4 hover:border-[#C5B397]/30 transition-colors duration-300 group"
                >
                  {s.logo ? (
                    <Image src={s.logo} alt={s.name} width={160} height={48} className="object-contain max-h-12 w-auto opacity-60 group-hover:opacity-100 transition-opacity" />
                  ) : (
                    <span className="text-[9px] uppercase tracking-[0.2em] text-[#EAE6E1]/40 group-hover:text-[#EAE6E1]/70 transition-colors">{s.name}</span>
                  )}
                </a>
              ))}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

function PlaceholderLogo() {
  return (
    <div className="aspect-[3/1] min-h-[60px] border border-dashed border-[#EAE6E1]/8 flex items-center justify-center">
      <span className="text-[9px] uppercase tracking-[0.2em] text-[#EAE6E1]/20">Partner logo</span>
    </div>
  );
}
