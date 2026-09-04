import { requireAuth } from "@/lib/auth";
import { db } from "@/lib/db";
import { InventoryClient } from "@/components/admin/inventory/inventory-client";

export default async function InventoryPage() {
  await requireAuth();

  // Fetch all products with their stock info
  const products = await db.product.findMany({
    where: { status: { not: "ARCHIVED" } },
    select: {
      id: true,
      name: true,
      sku: true,
      stock: true,
      lowStockThreshold: true,
      images: {
        select: { url: true },
        take: 1,
        orderBy: { sortOrder: "asc" }
      }
    },
    orderBy: {
      stock: "asc" // show lowest stock items first
    }
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 font-serif text-[#0D0D0D]">Inventory Management</h1>
      <InventoryClient initialProducts={products} />
    </div>
  );
}
