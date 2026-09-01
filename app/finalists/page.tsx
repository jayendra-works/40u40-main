import { getFinalists } from "@/lib/finalists";
import { FinalFortyExperience } from "@/components/sections/FinalFortyExperience";

export const revalidate = 60;
export const dynamic = "force-dynamic";

export const metadata = {
  title: "The Final 40 | Asia Inc. 500",
  description: "Meet the leaders shaping what comes next in Asia Inc. 500's 40 Under 40 edition.",
};

export default async function FinalistsPage() {
  return <FinalFortyExperience finalists={await getFinalists()} />;
}
