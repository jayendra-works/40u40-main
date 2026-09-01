"use server";

import { headers } from "next/headers";
import { z } from "zod";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { checkSummitVenueNotifyRateLimit, recordSummitVenueNotifySubmission } from "@/lib/rate-limit";

const emailSchema = z
  .string()
  .trim()
  .max(320, "Email is too long.")
  .email("Enter a valid email address.")
  .transform((s) => s.toLowerCase().replace(/[<>]/g, "").trim());

export type SummitVenueNotifyResult =
  | { success: true; message: string }
  | { success: false; error: string };

export async function submitSummitVenueDateNotify(formData: FormData): Promise<SummitVenueNotifyResult> {
  const headersList = await headers();
  const ip =
    headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ?? headersList.get("x-real-ip") ?? "anonymous";

  const raw = formData.get("email");
  const parsed = emailSchema.safeParse(typeof raw === "string" ? raw : "");
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid email." };
  }

  const email = parsed.data;
  if (!email) return { success: false, error: "Enter a valid email address." };

  const rate = checkSummitVenueNotifyRateLimit(ip);
  if (!rate.allowed) {
    return {
      success: false,
      error: "Too many attempts from this network. Please try again later.",
    };
  }

  try {
    await prisma.summitVenueDateSubscriber.create({
      data: { email },
    });
    recordSummitVenueNotifySubmission(ip);
    revalidatePath("/admin/summit-subscribers");
    revalidatePath("/summit");
    return { success: true, message: "You will be notified when details are announced." };
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
      recordSummitVenueNotifySubmission(ip);
      return {
        success: true,
        message: "You are already on the list — we will email you when details are announced.",
      };
    }
    console.error("Summit venue notify subscribe error:", e);
    return { success: false, error: "Could not save your email. Please try again." };
  }
}
