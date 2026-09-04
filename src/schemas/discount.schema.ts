import { z } from 'zod';
import { DiscountType } from '@/types/discount';

export const discountFormSchema = z.object({
  code: z.string().min(3, "Code must be at least 3 characters").toUpperCase(),
  type: z.nativeEnum(DiscountType),
  amount: z.coerce.number().positive("Amount must be positive"),
  minOrder: z.coerce.number().nonnegative("Minimum order cannot be negative").default(0),
  maxDiscount: z.coerce.number().positive("Max discount must be positive").optional().nullable(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  usageLimit: z.coerce.number().int().positive("Usage limit must be a positive integer").optional().nullable(),
  active: z.boolean().default(true),
}).refine(data => data.endDate > data.startDate, {
  message: "End date must be after start date",
  path: ["endDate"]
});

export type DiscountFormValues = z.infer<typeof discountFormSchema>;
