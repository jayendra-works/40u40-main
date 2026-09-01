import { FAQSection } from "@/components/sections/FAQSection";

export const revalidate = 60;

export default function FAQPage() {
  return (
    <div className="pt-[140px] bg-[#131210] min-h-screen">
      <FAQSection />
    </div>
  );
}
