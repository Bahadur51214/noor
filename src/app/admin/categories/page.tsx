import { categoryService } from "@/services/category.service";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Image from "next/image";
import { requireAuth } from "@/lib/auth";

export default async function CategoriesPage() {
  await requireAuth();
  const categories = await categoryService.getAll();

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold font-serif text-[#0D0D0D]">Categories</h1>
        <Button asChild className="bg-[#0D0D0D] text-white">
          <Link href="/admin/categories/new">
            <Plus className="w-4 h-4 mr-2" /> Add Category
          </Link>
        </Button>
      </div>
      
      <div className="bg-white rounded-md border border-[#E0DCD5] overflow-x-auto">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="border-b border-[#E0DCD5] text-gray-500 bg-gray-50">
              <th className="p-4 font-medium w-20">Image</th>
              <th className="p-4 font-medium">Name</th>
              <th className="p-4 font-medium">Slug</th>
              <th className="p-4 font-medium text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((c: any) => (
              <tr key={c.id} className="border-b border-[#E0DCD5] hover:bg-gray-50/50">
                <td className="p-4">
                  <div className="w-12 h-12 relative bg-gray-100 rounded-md border overflow-hidden">
                    {c.imageUrl ? (
                      <Image src={c.imageUrl} alt={c.name} fill className="object-cover" />
                    ) : (
                      <span className="text-xs text-gray-400 absolute inset-0 flex items-center justify-center">No Img</span>
                    )}
                  </div>
                </td>
                <td className="p-4 font-medium text-[#0D0D0D]">{c.name}</td>
                <td className="p-4 text-gray-500">{c.slug}</td>
                <td className="p-4 text-right">
                  <Link href={`/admin/categories/${c.id}`} className="text-[#C9A96E] hover:underline font-medium">
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr>
                <td colSpan={4} className="p-8 text-center text-gray-500">
                  No categories found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
