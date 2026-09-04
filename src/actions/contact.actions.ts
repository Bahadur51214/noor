"use server";

import { z } from "zod";
import { headers } from "next/headers";
import { rateLimit } from "@/lib/rate-limit";
import { emailService } from "@/services/email.service";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z
    .string()
    .email("Invalid email address")
    .optional()
    .or(z.literal("")),
  phone: z.string().optional(),
  message: z.string().min(5, "Message must be at least 5 characters"),
});

export async function submitContactMessage(data: unknown) {
  const parsed = contactSchema.safeParse(data);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.errors[0]?.message || "Invalid form data",
    };
  }

  const headerList = await headers();
  const ip =
    headerList.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headerList.get("x-real-ip") ||
    "unknown";

  const rate = rateLimit(`contact:${ip}`, 3, 60 * 60 * 1000);
  if (!rate.success) {
    return {
      success: false,
      error: "Too many messages. Please try again later.",
    };
  }

  try {
    const { name, email, phone, message } = parsed.data;
    const result = await emailService.send({
      to: process.env.CONTACT_EMAIL || "",
      subject: `New contact message from ${name}`,
      html: `
        <h1>New Contact Message</h1>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email || "—"}</p>
        <p><strong>Phone:</strong> ${phone || "—"}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    });

    if (!result.success && emailService.isConfigured()) {
      return {
        success: false,
        error: result.error || "Failed to send message",
      };
    }

    return { success: true };
  } catch (e: unknown) {
    const message =
      e instanceof Error ? e.message : "Failed to send message";
    return { success: false, error: message };
  }
}
