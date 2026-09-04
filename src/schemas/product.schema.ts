import { z } from 'zod';
import { ProductStatus } from '@/types/product';

const baseProductSchema = z.object({
  name: z.string().min(2, "Product name is required"),
  slug: z.string().min(2, "Slug is required"),
  sku: z.string().optional().nullable(),
  description: z.string().min(10, "Description is required"),
  shortDescription: z.string().optional().nullable(),
  specifications: z.record(z.string()).optional().nullable(),
  price: z.coerce.number().positive("Price must be greater than 0"),
  salePrice: z.coerce.number().optional().nullable(),
  costPrice: z.coerce.number().optional().nullable(),
  stock: z.coerce.number().int().nonnegative("Stock cannot be negative"),
  lowStockThreshold: z.coerce.number().int().nonnegative("Threshold cannot be negative"),
  categoryId: z.string().optional().nullable(),
  status: z.nativeEnum(ProductStatus),
  featured: z.boolean().default(false),
  bestSeller: z.boolean().default(false),
  newArrival: z.boolean().default(false),
  seoTitle: z.string().optional().nullable(),
  seoDescription: z.string().optional().nullable(),
  images: z.array(z.object({
    url: z.string().min(1, "Image URL is required"),
    alt: z.string().optional().nullable(),
    sortOrder: z.number().optional().nullable(),
  })).default([]),
});

export const productFormSchema = baseProductSchema.refine(
  data => !data.salePrice || (data.price !== undefined && data.salePrice < data.price),
  {
    message: "Sale price must be less than regular price",
    path: ["salePrice"]
  }
);

export const productUpdateSchema = baseProductSchema.partial().refine(
  data => !data.salePrice || (data.price !== undefined && data.salePrice < data.price),
  {
    message: "Sale price must be less than regular price",
    path: ["salePrice"]
  }
);

export type ProductFormValues = z.infer<typeof productFormSchema>;
