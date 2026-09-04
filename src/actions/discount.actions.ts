"use server";

import { requireAuth } from "@/lib/auth";
import { discountService } from "@/services/discount.service";
import { revalidatePath } from "next/cache";

export async function createDiscountAction(data: any) {
  await requireAuth();
  try {
    const discount = await discountService.create(data);
    revalidatePath("/admin/discounts");
    return { success: true, data: discount };
  } catch (e: any) {
    return { error: e.message || "Failed to create discount" };
  }
}

export async function updateDiscountAction(id: string, data: any) {
  await requireAuth();
  try {
    const discount = await discountService.update(id, data);
    revalidatePath("/admin/discounts");
    return { success: true, data: discount };
  } catch (e: any) {
    return { error: e.message || "Failed to update discount" };
  }
}
