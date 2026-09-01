import { get } from "@vercel/blob";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";

function isPrivateNominationBlob(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "https:" &&
      url.hostname.endsWith(".private.blob.vercel-storage.com") &&
      url.pathname.startsWith("/nominations/");
  } catch {
    return false;
  }
}

/** Streams sensitive nomination uploads only to authenticated administrators. */
export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if ((session?.user as { role?: string } | undefined)?.role !== "admin") {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const url = request.nextUrl.searchParams.get("url");
  if (!url || !isPrivateNominationBlob(url)) {
    return new NextResponse("Not found", { status: 404 });
  }

  const result = await get(url, { access: "private" });
  if (!result || result.statusCode !== 200 || !result.stream) {
    return new NextResponse("Not found", { status: 404 });
  }

  return new NextResponse(result.stream, {
    headers: {
      "Content-Type": result.blob.contentType || "application/octet-stream",
      "Content-Disposition": request.nextUrl.searchParams.get("download") === "1"
        ? "attachment"
        : "inline",
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
