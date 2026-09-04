import { z } from 'zod';

export const reviewFormSchema = z.object({
  customerName: z.string().min(2, "Name must be at least 2 characters"),
  rating: z.coerce.number().int().min(1, "Rating must be at least 1").max(5, "Rating cannot exceed 5"),
  comment: z.string().max(500, "Comment cannot exceed 500 characters").optional().nullable(),
});

export type ReviewFormValues = z.infer<typeof reviewFormSchema>;
