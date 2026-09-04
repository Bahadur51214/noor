"use server";

import { requireAuth } from "@/lib/auth";
import { productService } from "@/services/product.service";
import { productFormSchema, productUpdateSchema } from "@/schemas/product.schema";
import { auditService } from "@/services/audit.service";
import { revalidatePath } from "next/cache";

export async function createProduct(formData: Record<string, unknown>) {
  const session = await requireAuth();

  const parsed = productFormSchema.safeParse(formData);
  if (!parsed.success) {
    return { error: "Validation failed", details: parsed.error.flatten() };
  }

  try {
    const product = await productService.create(parsed.data);

    await auditService.log({
      adminId: session.adminId,
      action: "PRODUCT_CREATED",
      entityType: "Product",
      entityId: product.id,
      metadata: { name: product.name },
    });

    revalidatePath("/admin/products");
    revalidatePath("/shop");

    return { success: true, productId: product.id };
  } catch (error) {
    return {
      error:
        error instanceof Error ? error.message : "Failed to create product",
    };
  }
}

export async function updateProduct(
  id: string,
  formData: Record<string, unknown>
) {
  const session = await requireAuth();

  const parsed = productUpdateSchema.safeParse(formData);
  if (!parsed.success) {
    return { error: "Validation failed", details: parsed.error.flatten() };
  }

  try {
    const product = await productService.update(id, parsed.data);

    await auditService.log({
      adminId: session.adminId,
      action: "PRODUCT_UPDATED",
      entityType: "Product",
      entityId: id,
      metadata: { name: product.name },
    });

    revalidatePath("/admin/products");
    revalidatePath(`/admin/products/${id}`);
    revalidatePath("/shop");

    return { success: true };
  } catch (error) {
    return {
      error:
        error instanceof Error ? error.message : "Failed to update product",
    };
  }
}

export async function archiveProduct(id: string) {
  const session = await requireAuth();

  try {
    await productService.archive(id);

    await auditService.log({
      adminId: session.adminId,
      action: "PRODUCT_ARCHIVED",
      entityType: "Product",
      entityId: id,
    });

    revalidatePath("/admin/products");
    revalidatePath("/shop");

    return { success: true };
  } catch (error) {
    return {
      error:
        error instanceof Error ? error.message : "Failed to archive product",
    };
  }
}
