"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { generateSlug } from "@/lib/utils";
import { ImageUpload } from "@/components/ui/image-upload";
import { createCategoryAction, updateCategoryAction } from "@/actions/category.actions";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(2, "Name is required"),
  slug: z.string().min(2, "Slug is required"),
  description: z.string().optional(),
  imageUrl: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

export function CategoryForm({ category }: { category?: any }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const isEditing = !!category;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: category
      ? {
          name: category.name,
          slug: category.slug,
          description: category.description || "",
          imageUrl: category.imageUrl || "",
        }
      : {
          name: "",
          slug: "",
          description: "",
          imageUrl: "",
        },
  });

  async function onSubmit(data: FormData) {
    setLoading(true);
    try {
      const result = isEditing
        ? await updateCategoryAction(category.id, data)
        : await createCategoryAction(data);

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(isEditing ? "Category updated" : "Category created");
        router.push("/admin/categories");
        router.refresh();
      }
    } catch (e) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-2xl">
      <div className="rounded-lg border border-[#E0DCD5] bg-white p-6 space-y-6">
        <div>
          <Label>Category Name</Label>
          <Input
            {...register("name")}
            onChange={(e) => {
              register("name").onChange(e);
              if (!isEditing) setValue("slug", generateSlug(e.target.value));
            }}
          />
          {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
        </div>
        
        <div>
          <Label>Slug</Label>
          <Input {...register("slug")} />
          {errors.slug && <p className="mt-1 text-xs text-red-500">{errors.slug.message}</p>}
        </div>
        
        <div>
          <Label>Description</Label>
          <textarea
            {...register("description")}
            className="w-full rounded-md border border-[#E0DCD5] px-3 py-2 text-sm focus:border-[#C9A96E] focus:outline-none focus:ring-1 focus:ring-[#C9A96E]"
            rows={4}
          />
        </div>
        
        <div>
          <Label>Category Image</Label>
          <div className="mt-2">
            <ImageUpload
              value={watch("imageUrl") || ""}
              onChange={(url) => setValue("imageUrl", url)}
              folder="noor-categories"
            />
          </div>
        </div>
        
        <Button type="submit" className="w-full bg-[#0D0D0D] text-white" disabled={loading}>
          {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          {isEditing ? "Update Category" : "Create Category"}
        </Button>
      </div>
    </form>
  );
}
