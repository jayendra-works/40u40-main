import { NextRequest, NextResponse } from "next/server";
import { submitNominationForm } from "@/app/actions/nomination";

export const runtime = "nodejs";

/**
 * Multipart uploads use a route handler rather than the Server Action wire
 * protocol. This keeps the submission response stable for file attachments.
 */
export async function POST(request: NextRequest) {
  try {
    const result = await submitNominationForm(await request.formData());
    return NextResponse.json(result, { status: result.success ? 201 : 400 });
  } catch (error) {
    console.error("Nomination API request failed:", error);
    return NextResponse.json(
      { success: false, error: "We could not submit the nomination. Please try again in a few minutes." },
      { status: 500 },
    );
  }
}
