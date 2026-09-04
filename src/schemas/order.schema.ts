import { z } from 'zod';
import { OrderStatus } from '@/types/order';

export const orderStatusUpdateSchema = z.object({
  status: z.nativeEnum(OrderStatus),
  note: z.string().optional().nullable(),
});

export const courierUpdateSchema = z.object({
  courier: z.string().min(2, "Courier name is required"),
  trackingNumber: z.string().min(2, "Tracking number is required"),
  trackingUrl: z.string().url("Must be a valid URL").optional().nullable().or(z.literal('')),
});

export const adminNoteSchema = z.object({
  content: z.string().min(1, "Note content cannot be empty"),
});
