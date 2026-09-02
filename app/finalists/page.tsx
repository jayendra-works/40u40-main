import { getFinalists } from "@/lib/finalists";
import { FinalFortyExperience } from "@/components/sections/FinalFortyExperience";

export const revalidate = 300;

export const metadata = {
  title: "The Final 40",
  description: "Meet the leaders shaping what comes next in Asia Inc. 500's 40 Under 40 edition.",
  alternates: { canonical: "/finalists" },
};

export default async function FinalistsPage() {
  return <FinalFortyExperience finalists={await getFinalists()} />;
}
