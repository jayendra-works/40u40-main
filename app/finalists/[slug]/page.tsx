import { notFound } from "next/navigation";
import { getFinalistBySlug, getFinalists } from "@/lib/finalists";
import { FinalFortyExperience } from "@/components/sections/FinalFortyExperience";

export const revalidate = 300;

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const finalist = await getFinalistBySlug(params.slug);
  if (!finalist) return {};
  return {
    title: `${finalist.name} | The Final 40`,
    description: finalist.bio ?? finalist.title,
    alternates: { canonical: `/finalists/${finalist.slug}` },
    openGraph: { images: finalist.photo ? [finalist.photo] : [] },
  };
}

export default async function FinalistProfilePage({ params }: { params: { slug: string } }) {
  const finalist = await getFinalistBySlug(params.slug);
  if (!finalist) notFound();
  return <FinalFortyExperience finalists={await getFinalists()} initialSlug={params.slug} />;
}
