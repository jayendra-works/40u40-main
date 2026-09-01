import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { AdminNav } from "@/components/admin/AdminNav";

export default async function AdminLayout({
  children,
}: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  const isAdmin = (session?.user as { role?: string } | undefined)?.role === "admin";

  return (
    <div className="min-h-screen bg-primary text-white flex flex-col md:flex-row">
      {session && <AdminNav showSummitSubscribers={isAdmin} />}
      <main className="flex-1 overflow-auto min-w-0">
        {children}
      </main>
    </div>
  );
}
