import { z } from 'zod';
import { PaymentMethod } from '@/types/order';
import { isValidPakistaniPhone } from '@/lib/utils';

export const checkoutFormSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  phone: z.string().refine(isValidPakistaniPhone, "Enter a valid Pakistani number (e.g., 0348 4865913 or +92 348 4865913)"),
  email: z.string().email("Invalid email address").optional().or(z.literal('')),
  city: z.string().min(2, "City is required"),
  area: z.string().min(2, "Area is required"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  landmark: z.string().optional(),
  paymentMethod: z.nativeEnum(PaymentMethod, {
    errorMap: () => ({ message: "Please select a valid payment method" })
  }),
});

export type CheckoutFormValues = z.infer<typeof checkoutFormSchema>;

export const paymentReferenceSchema = z.object({
  method: z.nativeEnum(PaymentMethod),
  transactionId: z.string().min(3, "Transaction ID is required"),
  senderName: z.string().min(2, "Sender name is required"),
  screenshotUrl: z.string().url("Must be a valid URL").optional(),
});

export type PaymentReferenceValues = z.infer<typeof paymentReferenceSchema>;
