import { prisma } from "@/lib/prisma";
import { FAQAccordion } from "./FAQAccordion";
import { FAQ_ITEMS } from "@/data/faq";
import type { AccordionItem } from "@/components/ui/Accordion";

type FaqRow = { id: string; question: string; answer: string };

export async function FAQSection({ faqs: faqsProp }: { faqs?: FaqRow[] } = {}) {
  const faqs =
    faqsProp ??
    (await prisma.faq.findMany({ orderBy: { sortOrder: "asc" } }));
  const items: AccordionItem[] =
    faqs.length > 0
      ? faqs.map((f) => ({ id: f.id, question: f.question, answer: f.answer }))
      : FAQ_ITEMS;

  return (
    <section
      id="faq"
      className="border-t border-[#EAE6E1]/5 py-24 md:py-32 px-6 md:px-24 bg-[#131210]"
    >
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-16 md:mb-24 text-center">
          <div className="overflow-hidden mb-4">
            <h2 className="font-display text-5xl md:text-7xl lg:text-8xl leading-[0.9] tracking-tighter uppercase">
              Frequently Asked
            </h2>
          </div>
          <div className="overflow-hidden mb-8">
            <h2 className="font-display text-5xl md:text-7xl lg:text-8xl leading-[0.9] tracking-tighter uppercase italic text-[#C5B397]">
              Questions
            </h2>
          </div>
          <p className="text-[10px] uppercase tracking-[0.2em] font-medium text-[#EAE6E1]/40 max-w-lg mx-auto leading-loose">
            Everything you need to know about nominations and the program.
          </p>
        </div>

        <FAQAccordion items={items} />
      </div>
    </section>
  );
}
