import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function csvEscape(value: unknown): string {
  const str = value == null ? "" : String(value);
  const needsQuotes = /[",\n\r]/.test(str);
  const escaped = str.replace(/"/g, '""');
  return needsQuotes ? `"${escaped}"` : escaped;
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as { role?: string }).role !== "admin") {
    return new Response("Unauthorized", { status: 401 });
  }

  const rows = await prisma.summitVenueDateSubscriber.findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true, email: true, createdAt: true },
  });

  const header = ["id", "email", "subscribed_at"];
  const lines = [
    header.join(","),
    ...rows.map((r) =>
      [r.id, r.email, r.createdAt.toISOString()].map(csvEscape).join(","),
    ),
  ];
  const csv = lines.join("\n");

  const filename = `summit-venue-alerts-${new Date().toISOString().slice(0, 10)}.csv`;
  return new Response(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
