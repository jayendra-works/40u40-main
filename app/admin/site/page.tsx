import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { getAllSiteSettingsForHome } from "@/lib/site-settings";
import { SiteContentManager } from "./SiteContentManager";

export default async function AdminSitePage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");

  const settings = await getAllSiteSettingsForHome();

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <h1 className="font-display text-2xl font-bold text-white mb-6 md:mb-8">
        Site content
      </h1>
      <p className="text-neutral-400 mb-6 md:mb-8 text-sm md:text-base">
        Edit hero, stats, about, why recognition, socials, summit date, footer, and other homepage content. Changes appear immediately.
      </p>
      <SiteContentManager initialSettings={settings} />
    </div>
  );
}
