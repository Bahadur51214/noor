  "use server";

import { requireAuth } from "@/lib/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export type AdjustStockResult =
  | { success: true; transaction: { id: string } }
  | { success: false; error: string };

export async function adjustStockAction({
  productId,
  quantity,
  type,
  note,
}: {
  productId: string;
  quantity: number; // positive for adding, negative for removing
  type: "RESTOCK" | "MANUAL_ADJUSTMENT" | "RETURN";
  note?: string;
}): Promise<AdjustStockResult> {
  const session = await requireAuth();

  try {
    const transaction = await db.$transaction(async (tx) => {
      // 1. Get current product to know stockBefore
      const product = await tx.product.findUnique({
        where: { id: productId },
      });

      if (!product) {
        throw new Error("Product not found");
      }

      const stockBefore = product.stock;
      const stockAfter = stockBefore + quantity;

      if (stockAfter < 0) {
        throw new Error("Stock cannot fall below zero");
      }

      // 2. Update Product Stock
      await tx.product.update({
        where: { id: productId },
        data: { stock: stockAfter },
      });

      // 3. Record the transaction
      const transaction = await tx.inventoryTransaction.create({
        data: {
          productId,
          type,
          quantity,
          stockBefore,
          stockAfter,
          note,
          adminId: session.adminId,
        },
      });

      return transaction;
    });

    return { success: true, transaction };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to adjust stock" };
  } finally {
    revalidatePath("/admin/inventory");
    revalidatePath("/admin/products");
  }
}
