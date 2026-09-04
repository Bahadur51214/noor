import { z } from 'zod';

export const storeSettingsSchema = z.object({
  storeName: z.string().min(2, "Store name is required"),
  logo: z.string().optional().nullable(),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(10, "Phone number is required"),
  whatsapp: z.string().min(10, "WhatsApp number is required"),
  currency: z.string().min(1, "Currency is required"),
});

export const shippingSettingsSchema = z.object({
  codDeliveryFee: z.coerce.number().nonnegative("Fee cannot be negative"),
  advanceDeliveryFee: z.coerce.number().nonnegative("Fee cannot be negative"),
  freeShippingMinOrder: z.coerce.number().nonnegative("Amount cannot be negative").optional().nullable(),
});

export const paymentSettingsSchema = z.object({
  bankTransfer: z.object({
    enabled: z.boolean(),
    bankName: z.string(),
    accountTitle: z.string(),
    accountNumber: z.string(),
    iban: z.string(),
    instructions: z.string(),
  }),
  easypaisa: z.object({
    enabled: z.boolean(),
    accountTitle: z.string(),
    accountNumber: z.string(),
    instructions: z.string(),
  }),
  jazzcash: z.object({
    enabled: z.boolean(),
    accountTitle: z.string(),
    accountNumber: z.string(),
    instructions: z.string(),
  }),
});

export const homepageSettingsSchema = z.object({
  announcementBar: z.string().optional().nullable(),
  heroTitle: z.string().min(1, "Hero title is required"),
  heroSubtitle: z.string().min(1, "Hero subtitle is required"),
  heroCta: z.string().min(1, "Hero CTA is required"),
  heroImage: z.string().min(1, "Hero image is required"),
});

export const socialSettingsSchema = z.object({
  instagram: z.string().url("Must be a valid URL").optional().nullable().or(z.literal('')),
  facebook: z.string().url("Must be a valid URL").optional().nullable().or(z.literal('')),
  tiktok: z.string().url("Must be a valid URL").optional().nullable().or(z.literal('')),
  youtube: z.string().url("Must be a valid URL").optional().nullable().or(z.literal('')),
});

export const policySettingsSchema = z.object({
  shippingPolicy: z.string(),
  returnPolicy: z.string(),
  privacyPolicy: z.string(),
  terms: z.string(),
});
