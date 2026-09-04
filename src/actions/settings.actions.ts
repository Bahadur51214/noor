"use server";

import { requireAuth } from "@/lib/auth";
import { settingsService } from "@/services/settings.service";
import { storeSettingsSchema, shippingSettingsSchema, paymentSettingsSchema } from "@/schemas/settings.schema";
import { revalidatePath } from "next/cache";

export async function updateGeneralSettings(data: unknown) {
  await requireAuth();

  const parsed = storeSettingsSchema.safeParse(data);
  if (!parsed.success) {
    return { error: "Validation failed", details: parsed.error.flatten() };
  }

  try {
    await settingsService.updateStoreSettings(parsed.data);
    revalidatePath("/admin/settings");
    return { success: true };
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Failed to update settings";
    return { error: message };
  }
}

export async function updateShippingSettings(data: unknown) {
  await requireAuth();

  const parsed = shippingSettingsSchema.safeParse(data);
  if (!parsed.success) {
    return { error: "Validation failed", details: parsed.error.flatten() };
  }

  try {
    await settingsService.updateShippingSettings(parsed.data);
    revalidatePath("/admin/settings");
    return { success: true };
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Failed to update settings";
    return { error: message };
  }
}

export async function updatePaymentSettings(data: unknown) {
  await requireAuth();

  try {
    const normalized = Object.fromEntries(
      Object.entries(data as Record<string, unknown>).map(([key, value]) => [key, String(value)])
    );
    const settings = Object.entries(normalized).map(([key, value]) => ({ key, value, group: "payment" }));
    await settingsService.setMany(settings);
    revalidatePath("/admin/settings");
    return { success: true };
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Failed to update settings";
    return { error: message };
  }
}

export async function updateHomepageSettings(data: unknown) {
  await requireAuth();
  try {
    await settingsService.updateHomepageSettings(data);
    revalidatePath("/admin/settings");
    return { success: true };
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Failed to update settings";
    return { error: message };
  }
}

export async function updateSocialSettings(data: unknown) {
  await requireAuth();
  try {
    await settingsService.updateSocialSettings(data);
    revalidatePath("/admin/settings");
    return { success: true };
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Failed to update settings";
    return { error: message };
  }
}

export async function updatePolicySettings(data: unknown) {
  await requireAuth();
  try {
    await settingsService.updatePolicySettings(data);
    revalidatePath("/admin/settings");
    return { success: true };
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Failed to update settings";
    return { error: message };
  }
}
