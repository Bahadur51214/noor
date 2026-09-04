import { CategoryForm } from "@/components/admin/categories/category-form";
import { categoryService } from "@/services/category.service";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAuth } from "@/lib/auth";

export default async function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAuth();
  const resolvedParams = await params;
  const category = await categoryService.getById(resolvedParams.id);

  if (!category) {
    notFound();
  }

  return (
    <div className="p-6">
      <Link href="/admin/categories" className="flex items-center text-sm text-gray-500 hover:text-black mb-6">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Categories
      </Link>
      <h1 className="text-2xl font-bold mb-6 font-serif text-[#0D0D0D]">Edit Category</h1>
      <CategoryForm category={category} />
    </div>
  );
}
