import { prisma } from "@/lib/prisma";
import { NoticeManager } from "./notice-manager";
export default async function NoticesPage() { const notices = await prisma.noticeBoardItem.findMany({ orderBy: [{ isActive: "desc" }, { updatedAt: "desc" }] }); return <div className="p-6 lg:p-8"><h1 className="font-display text-3xl text-white">Editorial Dispatch</h1><p className="mt-2 text-sm text-neutral-400">Create the homepage launch announcement. Activating one notice safely replaces the current one.</p><NoticeManager notices={notices} /></div>; }
