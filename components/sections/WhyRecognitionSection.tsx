"use client";

import { motion } from "framer-motion";
import { WHY_RECOGNITION_CARDS } from "@/data/whyRecognition";

type CardItem = { id: string; title: string; description: string; visible?: boolean };

const DEFAULT_TITLE = "Why This Recognition Matters";
const DEFAULT_SUBTITLE =
  "Join a prestigious community of leaders driving change across industries.";

export function WhyRecognitionSection({
  title = DEFAULT_TITLE,
  subtitle = DEFAULT_SUBTITLE,
  cards,
}: {
  title?: string;
  subtitle?: string;
  cards?: CardItem[];
}) {
  const list = (cards ?? [...WHY_RECOGNITION_CARDS]).filter((card) => card.visible !== false);

  return (
    <section
      id="awards"
      className="border-t border-[#EAE6E1]/5 py-24 md:py-40 px-6 md:px-24 bg-[#131210]"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 md:mb-24">
          <div>
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-[9px] uppercase tracking-[0.35em] font-medium text-[#EAE6E1]/30 block mb-6"
            >
              The Value
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="font-display text-5xl md:text-6xl leading-[0.95] uppercase"
            >
              {(() => {
                const words = title.split(" ");
                const lastWord = words.slice(-1)[0];
                const rest = words.slice(0, -1).join(" ");
                return (
                  <>
                    {rest}<br />
                    <span className="italic text-[#C5B397]">{lastWord}</span>
                  </>
                );
              })()}
            </motion.h2>
          </div>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.2 }}
            className="text-[10px] uppercase tracking-[0.2em] text-[#EAE6E1]/40 max-w-sm leading-loose"
          >
            {subtitle}
          </motion.p>
        </div>

        {/* Cards grid */}
        <div className="flex flex-wrap justify-center gap-5 md:gap-6">
          {list.map((card, i) => (
            <motion.article
              key={card.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.7, delay: (i % 3) * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] border border-[#EAE6E1]/[0.08] p-8 md:p-10 group hover:border-[#C5B397]/30 transition-colors duration-500"
            >
              {/* Number */}
              <span className="font-display text-xl text-[#EAE6E1]/10 block mb-4 group-hover:text-[#C5B397]/25 transition-colors duration-500">
                {String(i + 1).padStart(2, "0")}
              </span>
              {/* Title */}
              <h3 className="font-display text-2xl italic text-[#EAE6E1] mb-4 group-hover:text-[#C5B397] transition-colors duration-500">
                {card.title}
              </h3>
              {/* Description */}
              <p className="text-[10px] uppercase tracking-[0.15em] font-medium text-[#EAE6E1]/35 leading-loose">
                {card.description}
              </p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
