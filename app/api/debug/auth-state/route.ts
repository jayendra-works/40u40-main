import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * Temporary diagnostic endpoint.
 * Usage:
 *   /api/debug/auth-state?token=YOUR_DEBUG_TOKEN&email=admin@example.com
 *
 * Returns only non-sensitive auth state:
 * - whether user exists
 * - role
 * - whether password hash is set
 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const token = url.searchParams.get("token");
  const expectedToken = process.env.AUTH_DEBUG_TOKEN?.trim();

  // Hide endpoint unless correct debug token is provided.
  if (!expectedToken || token !== expectedToken) {
    return NextResponse.json({ ok: false }, { status: 404, headers: { "Cache-Control": "no-store" } });
  }

  const rawEmail = url.searchParams.get("email");
  const email = rawEmail?.trim().toLowerCase();
  if (!email) {
    return NextResponse.json(
      { ok: false, error: "Missing required query param: email" },
      { status: 400, headers: { "Cache-Control": "no-store" } }
    );
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: { role: true, passwordHash: true },
    });

    return NextResponse.json(
      {
        ok: true,
        email,
        exists: !!user,
        role: user?.role ?? null,
        hasPasswordHash: !!user?.passwordHash,
      },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Database error";
    return NextResponse.json(
      { ok: false, error: message },
      { status: 500, headers: { "Cache-Control": "no-store" } }
    );
  }
}
