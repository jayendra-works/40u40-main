import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Keep the sign-in screen public; every other admin route is admin-only.
  if (path === "/admin/login") return NextResponse.next();

  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  const role = token?.role as string | undefined;

  if (path.startsWith("/admin") && role === "admin") return NextResponse.next();
  if (path.startsWith("/jury/score") && role === "jury") return NextResponse.next();

  const destination = role ? "/" : "/admin/login";
  const redirectUrl = new URL(destination, request.url);
  if (!role) redirectUrl.searchParams.set("callbackUrl", path);
  return NextResponse.redirect(redirectUrl);
}

export const config = {
  matcher: ["/admin/:path*", "/jury/score/:path*"],
};
