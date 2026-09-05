"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createProduct, updateProduct } from "@/actions/product.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MultiImageUpload } from "@/components/ui/multi-image-upload";
import { RichTextEditor } from "@/components/admin/products/rich-text-editor";
import { toast } from "sonner";
import { generateSlug } from "@/lib/utils";

const formSchema = z.object({
  name: z.string().min(2, "Name is required"),
  slug: z.string().min(2, "Slug is required"),
  sku: z.string().min(1, "SKU is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  shortDescription: z.string().optional(),
  price: z.coerce.number().positive("Price must be positive"),
  salePrice: z.coerce.number().positive().optional().or(z.literal("")),
  costPrice: z.coerce.number().positive().optional().or(z.literal("")),
  stock: z.coerce.number().int().min(0, "Stock cannot be negative"),
  lowStockThreshold: z.coerce.number().int().min(0).default(5),
  categoryId: z.string().optional(),
  status: z.enum(["DRAFT", "ACTIVE", "ARCHIVED"]).default("DRAFT"),
  featured: z.boolean().default(false),
  bestSeller: z.boolean().default(false),
  newArrival: z.boolean().default(false),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  whyLoveIt: z.string().optional(),
  careInstructions: z.string().optional(),
  images: z.array(z.string()).default([]),
});

type FormData = z.infer<typeof formSchema>;

const PRODUCT_SPEC_FIELDS = [
  "Dial Color",
  "Movement",
  "Strap Material",
  "Strap Color",
  "Back Case",
  "Water Resistance",
  "Color Warranty",
  "Box",
  "Gender",
  "Quality",
  "Style",
];

interface ProductFormProps {
  product?: {
    id: string;
    name: string;
    slug: string;
    sku: string;
    description: string;
    shortDescription?: string | null;
    price: number;
    salePrice?: number | null;
    costPrice?: number | null;
    stock: number;
    lowStockThreshold: number;
    categoryId?: string | null;
    status: string;
    featured: boolean;
    bestSeller: boolean;
    newArrival: boolean;
    seoTitle?: string | null;
    seoDescription?: string | null;
    specifications?: Record<string, string> | null;
    whyLoveIt?: string | null;
    careInstructions?: string | null;
    images?: Array<{ url: string }>;
  };
  categories: Array<{ id: string; name: string }>;
}

export function ProductForm({ product, categories }: ProductFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const isEditing = !!product;
  const [specs, setSpecs] = useState<Record<string, string>>(() =>
    product?.specifications
      ? Object.fromEntries(
          PRODUCT_SPEC_FIELDS.map((field) => [
            field,
            product.specifications?.[field] ?? "",
          ])
        )
      : {}
  );

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: product
      ? {
          name: product.name,
          slug: product.slug,
          sku: product.sku,
          description: product.description,
          shortDescription: product.shortDescription || "",
          price: product.price,
          salePrice: product.salePrice || undefined,
          costPrice: product.costPrice || undefined,
          stock: product.stock,
          lowStockThreshold: product.lowStockThreshold,
          categoryId: product.categoryId || "",
          status: product.status as "DRAFT" | "ACTIVE" | "ARCHIVED",
          featured: product.featured,
          bestSeller: product.bestSeller,
          newArrival: product.newArrival,
          seoTitle: product.seoTitle || "",
          seoDescription: product.seoDescription || "",
          whyLoveIt: product.whyLoveIt || "",
          careInstructions: product.careInstructions || "",
          images: product.images?.map((img) => img.url) || [],
        }
      : {
          status: "ACTIVE",
          stock: 0,
          lowStockThreshold: 5,
          featured: false,
          bestSeller: false,
          newArrival: false,
          images: [],
        },
  });

  const name = watch("name");

  function updateSpec(field: string, value: string) {
    setSpecs((prev) => ({ ...prev, [field]: value }));
  }

  async function onSubmit(data: FormData) {
    setLoading(true);
    try {
      const cleanSpecs = Object.fromEntries(
        Object.entries(specs).filter(([, value]) => value.trim())
      );

      const cleanData = {
        ...data,
        categoryId: data.categoryId ? data.categoryId : null,
        salePrice:
          data.salePrice === "" ? undefined : data.salePrice || undefined,
        costPrice:
          data.costPrice === "" ? undefined : data.costPrice || undefined,
        specifications:
          Object.keys(cleanSpecs).length > 0 ? cleanSpecs : null,
        whyLoveIt: data.whyLoveIt || null,
        careInstructions: data.careInstructions || null,
        images: data.images.map((url, index) => ({ url, sortOrder: index })),
      };

      const result = isEditing
        ? await updateProduct(product.id, cleanData)
        : await createProduct(cleanData);

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(
          isEditing ? "Product updated" : "Product created"
        );
        router.push("/admin/products");
        router.refresh();
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Left Column */}
        <div className="space-y-6">
          <div className="rounded-lg border border-[#E0DCD5] bg-white p-6">
            <h3 className="mb-4 font-serif text-lg font-semibold">
              Basic Info
            </h3>
            <div className="space-y-4">
              <div>
                <Label>Product Name</Label>
                <Input
                  {...register("name")}
                  placeholder="Elegance Gold Watch"
                  onChange={(e) => {
                    register("name").onChange(e);
                    if (!isEditing) {
                      setValue("slug", generateSlug(e.target.value));
                    }
                  }}
                />
                {errors.name && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.name.message}
                  </p>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Slug</Label>
                  <Input {...register("slug")} placeholder="elegance-gold-watch" />
                  {errors.slug && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.slug.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label>SKU</Label>
                  <Input {...register("sku")} placeholder="NOOR-001" />
                  {errors.sku && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.sku.message}
                    </p>
                  )}
                </div>
              </div>
              <div>
                <Label>Description</Label>
                <div className="mt-2">
                  <RichTextEditor
                    value={watch("description") || ""}
                    onChange={(val) => setValue("description", val)}
                    error={errors.description?.message as string | undefined}
                  />
                </div>
              </div>
              <div>
                <Label>Short Description</Label>
                <Input
                  {...register("shortDescription")}
                  placeholder="Brief description"
                />
              </div>
            </div>
          </div>

          {/* Media */}
          <div className="rounded-lg border border-[#E0DCD5] bg-white p-6">
            <h3 className="mb-4 font-serif text-lg font-semibold">Media</h3>
            <div className="space-y-4">
              <div>
                <Label>Product Images</Label>
                <div className="mt-2">
                  <MultiImageUpload
                    value={watch("images") || []}
                    onChange={(urls) => setValue("images", urls)}
                    folder="noor-products"
                  />
                </div>
                {errors.images && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.images.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Specifications & Details */}
          <div className="rounded-lg border border-[#E0DCD5] bg-white p-6">
            <h3 className="mb-4 font-serif text-lg font-semibold">
              Product Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {PRODUCT_SPEC_FIELDS.map((field) => (
                <div key={field}>
                  <Label>{field}</Label>
                  <Input
                    value={specs[field] ?? ""}
                    onChange={(e) => updateSpec(field, e.target.value)}
                    placeholder={field === "Movement" ? "Quartz" : "Optional"}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Why You Love It */}
          <div className="rounded-lg border border-[#E0DCD5] bg-white p-6">
            <h3 className="mb-4 font-serif text-lg font-semibold">
              Why You Love It
            </h3>
            <div>
              <RichTextEditor
                value={watch("whyLoveIt") || ""}
                onChange={(val) => setValue("whyLoveIt", val)}
              />
            </div>
          </div>

          {/* Care Instructions */}
          <div className="rounded-lg border border-[#E0DCD5] bg-white p-6">
            <h3 className="mb-4 font-serif text-lg font-semibold">
              Care Instructions
            </h3>
            <div>
              <textarea
                {...register("careInstructions")}
                className="w-full rounded-md border border-[#E0DCD5] px-3 py-2 text-sm focus:border-[#C9A96E] focus:outline-none focus:ring-1 focus:ring-[#C9A96E]"
                rows={5}
                placeholder="One care tip per line"
              />
            </div>
          </div>

          {/* Pricing */}
          <div className="rounded-lg border border-[#E0DCD5] bg-white p-6">
            <h3 className="mb-4 font-serif text-lg font-semibold">Pricing</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>Price (Rs.)</Label>
                <Input
                  type="number"
                  step="1"
                  {...register("price")}
                  placeholder="5000"
                />
                {errors.price && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.price.message}
                  </p>
                )}
              </div>
              <div>
                <Label>Sale Price (Rs.)</Label>
                <Input
                  type="number"
                  step="1"
                  {...register("salePrice")}
                  placeholder="Optional"
                />
              </div>
              <div>
                <Label>Cost Price (Rs.)</Label>
                <Input
                  type="number"
                  step="1"
                  {...register("costPrice")}
                  placeholder="Optional"
                />
              </div>
            </div>
          </div>

          {/* SEO */}
          <div className="rounded-lg border border-[#E0DCD5] bg-white p-6">
            <h3 className="mb-4 font-serif text-lg font-semibold">SEO</h3>
            <div className="space-y-4">
              <div>
                <Label>SEO Title</Label>
                <Input
                  {...register("seoTitle")}
                  placeholder="Leave blank to use product name"
                />
              </div>
              <div>
                <Label>SEO Description</Label>
                <textarea
                  {...register("seoDescription")}
                  className="w-full rounded-md border border-[#E0DCD5] px-3 py-2 text-sm focus:border-[#C9A96E] focus:outline-none focus:ring-1 focus:ring-[#C9A96E]"
                  rows={3}
                  placeholder="Meta description for search engines"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Status & Visibility */}
          <div className="rounded-lg border border-[#E0DCD5] bg-white p-6">
            <h3 className="mb-4 font-serif text-lg font-semibold">
              Status & Visibility
            </h3>
            <div className="space-y-4">
              <div>
                <Label>Status</Label>
                <select
                  {...register("status")}
                  className="w-full rounded-md border border-[#E0DCD5] bg-white px-3 py-2 text-sm focus:border-[#C9A96E] focus:outline-none"
                >
                  <option value="DRAFT">Draft</option>
                  <option value="ACTIVE">Active</option>
                  <option value="ARCHIVED">Archived</option>
                </select>
              </div>
              <div>
                <Label>Category</Label>
                <select
                  {...register("categoryId")}
                  className="w-full rounded-md border border-[#E0DCD5] bg-white px-3 py-2 text-sm focus:border-[#C9A96E] focus:outline-none"
                >
                  <option value="">No Category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" {...register("featured")} />
                  Featured Product
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" {...register("bestSeller")} />
                  Best Seller
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" {...register("newArrival")} />
                  New Arrival
                </label>
              </div>
            </div>
          </div>

          {/* Inventory */}
          <div className="rounded-lg border border-[#E0DCD5] bg-white p-6">
            <h3 className="mb-4 font-serif text-lg font-semibold">
              Inventory
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Stock Quantity</Label>
                <Input
                  type="number"
                  {...register("stock")}
                  placeholder="0"
                />
                {errors.stock && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.stock.message}
                  </p>
                )}
              </div>
              <div>
                <Label>Low Stock Threshold</Label>
                <Input
                  type="number"
                  {...register("lowStockThreshold")}
                  placeholder="5"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Submit */}
      <div className="flex justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={loading}
          className="bg-[#0D0D0D] text-[#F7F4EF] hover:bg-[#262420]"
        >
          {loading
            ? "Saving..."
            : isEditing
              ? "Update Product"
              : "Create Product"}
        </Button>
      </div>
    </form>
  );
}
