import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function AdminSummitSubscribersPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");

  const role = (session.user as { role?: string }).role;
  if (role !== "admin") {
    redirect("/admin");
  }

  const subscribers = await prisma.summitVenueDateSubscriber.findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true, email: true, createdAt: true },
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <h1 className="mb-2 font-display text-2xl font-bold text-white md:mb-3 md:text-3xl">
        Summit venue &amp; date alerts
      </h1>
      <p className="mb-8 max-w-2xl text-sm text-neutral-400 md:mb-10">
        Email addresses collected from the summit page when visitors ask to be notified about the venue and
        date announcement.
      </p>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-neutral-500 text-sm">
          Total: <span className="font-medium text-gold">{subscribers.length}</span>
        </p>
        <a
          href="/admin/summit-subscribers/export"
          className="inline-flex items-center rounded-lg border border-neutral-500 bg-secondary/30 px-4 py-2 text-xs font-medium uppercase tracking-[0.12em] text-neutral-200 transition-colors hover:border-gold/50 hover:text-gold"
        >
          Export CSV
        </a>
      </div>

      <div className="overflow-hidden rounded-xl border border-neutral-600">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[480px] text-left">
            <thead className="bg-secondary/30">
              <tr>
                <th className="px-3 py-3 text-sm font-medium text-neutral-400 md:px-4">Email</th>
                <th className="px-3 py-3 text-sm font-medium text-neutral-400 md:px-4">Subscribed</th>
              </tr>
            </thead>
            <tbody>
              {subscribers.map((row) => (
                <tr key={row.id} className="border-t border-neutral-600">
                  <td className="px-3 py-3 text-sm text-white md:px-4">{row.email}</td>
                  <td className="px-3 py-3 text-sm text-neutral-400 md:px-4">
                    {new Date(row.createdAt).toLocaleString(undefined, {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {subscribers.length === 0 ? (
          <p className="py-10 text-center text-neutral-500 text-sm">No sign-ups yet.</p>
        ) : null}
      </div>
    </div>
  );
}
