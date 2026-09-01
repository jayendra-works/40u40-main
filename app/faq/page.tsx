import { FAQSection } from "@/components/sections/FAQSection";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Frequently Asked Questions | 40 Under 40",
  description: "Find eligibility, nomination, timeline, and summit answers for Asia Inc. 500's 40 Under 40 2026.",
};

export const revalidate = 60;

export default function FAQPage() {
  return (
    <div className="pt-[140px] bg-[#131210] min-h-screen">
      <FAQSection />
    </div>
  );
}
