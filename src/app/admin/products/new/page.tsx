import { requireAuth } from "@/lib/auth";
import { categoryService } from "@/services/category.service";
import { ProductForm } from "@/components/admin/products/product-form";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default async function AdminNewProductPage() {
  await requireAuth();

  const categories = await categoryService.getAll();

  return (
    <div className="space-y-6">
      <div className="flex items-center text-sm text-[#6B655C]">
        <Link href="/admin/products" className="hover:text-[#0D0D0D]">
          Products
        </Link>
        <ChevronRight className="mx-2 h-4 w-4" />
        <span className="font-medium text-[#0D0D0D]">Add New Product</span>
      </div>

      <div>
        <h1 className="font-serif text-2xl font-bold text-[#0D0D0D]">
          Add New Product
        </h1>
      </div>

      <ProductForm categories={categories} />
    </div>
  );
}
