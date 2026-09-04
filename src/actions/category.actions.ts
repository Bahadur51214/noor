"use server";

import { requireAuth } from "@/lib/auth";
import { categoryService } from "@/services/category.service";
import { revalidatePath } from "next/cache";

export async function createCategoryAction(data: any) {
  await requireAuth();
  try {
    const cat = await categoryService.create(data);
    revalidatePath("/admin/categories");
    return { success: true, data: cat };
  } catch (e: any) {
    return { error: e.message || "Failed to create category" };
  }
}

export async function updateCategoryAction(id: string, data: any) {
  await requireAuth();
  try {
    const cat = await categoryService.update(id, data);
    revalidatePath("/admin/categories");
    return { success: true, data: cat };
  } catch (e: any) {
    return { error: e.message || "Failed to update category" };
  }
}
