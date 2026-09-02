import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nominate | India's 40 Under 40 Summit & Awards 2026",
  description:
    "Submit your nomination or apply for India's 40 Under 40 2026. Recognize the next generation of leaders.",
  alternates: { canonical: "/nominate" },
};

export default function NominateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
