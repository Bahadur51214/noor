"use server";

import { requireAuth } from "@/lib/auth";
import { reviewService } from "@/services/review.service";
import { revalidatePath } from "next/cache";

export async function approveReviewAction(id: string) {
  await requireAuth();
  try {
    await reviewService.approve(id);
    revalidatePath("/admin/reviews");
    return { success: true };
  } catch (e: any) {
    return { error: e.message || "Failed to approve review" };
  }
}

export async function rejectReviewAction(id: string) {
  await requireAuth();
  try {
    await reviewService.reject(id);
    revalidatePath("/admin/reviews");
    return { success: true };
  } catch (e: any) {
    return { error: e.message || "Failed to reject review" };
  }
}
