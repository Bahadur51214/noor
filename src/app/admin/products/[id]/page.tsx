import { ProductForm } from "@/components/admin/products/product-form";
import { productService } from "@/services/product.service";
import { categoryService } from "@/services/category.service";
import { requireAuth } from "@/lib/auth";
import { notFound } from "next/navigation";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAuth();
  const { id } = await params;

  const [product, categories] = await Promise.all([
    productService.getById(id),
    categoryService.getAll(),
  ]);

  if (!product) {
    notFound();
  }

  const formProduct = {
    ...product,
    price: Number(product.price),
    salePrice: product.salePrice ? Number(product.salePrice) : null,
    costPrice: product.costPrice ? Number(product.costPrice) : null,
    specifications:
      product.specifications &&
      typeof product.specifications === "object" &&
      !Array.isArray(product.specifications)
        ? (product.specifications as Record<string, string>)
        : null,
  };

  return (
    <div className="space-y-6">
      <h1 className="font-serif text-2xl font-bold text-[#0D0D0D]">
        Edit: {product.name}
      </h1>
      <ProductForm product={formProduct} categories={categories} />
    </div>
  );
}
