"use server";

import { settingsService } from "@/services/settings.service";

export async function getPublicStoreSettings() {
  const [store, social, homepage, shipping] = await Promise.all([
    settingsService.getByGroup("store"),
    settingsService.getByGroup("social"),
    settingsService.getByGroup("homepage"),
    settingsService.getByGroup("shipping"),
  ]);

  const codFee = Number(shipping.codDeliveryFee ?? shipping.cod_delivery_fee ?? 250);
  const advanceFee = Number(shipping.advanceDeliveryFee ?? shipping.advance_delivery_fee ?? 0);

  return {
    storeName: store.storeName || "NOOR",
    email: store.email || "",
    phone: store.phone || "",
    whatsapp: store.whatsapp || store.phone || "",
    currency: store.currency || "Rs",
    social: {
      instagram: social.instagram || "",
      facebook: social.facebook || "",
      tiktok: social.tiktok || "",
      youtube: social.youtube || "",
    },
    hero: {
      title: homepage.heroTitle || "TIME, MADE BEAUTIFUL.",
      subtitle: homepage.heroSubtitle || "",
      cta: homepage.heroCta || "SHOP WATCHES",
      image: homepage.heroImage || "",
    },
    shipping: {
      codDeliveryFee: codFee,
      advanceDeliveryFee: advanceFee,
    },
  };
}

export async function getPublicPaymentSettings() {
  const payment = await settingsService.getByGroup("payment");
  return {
    bankDetails: payment.bankDetails || "",
    easypaisa: payment.easypaisa || "",
    jazzcash: payment.jazzcash || "",
  };
}

export async function getPublicPolicySettings() {
  const policy = await settingsService.getByGroup("policy");
  return {
    shippingPolicy: policy.shippingPolicy || "",
    returnPolicy: policy.returnPolicy || "",
    privacyPolicy: policy.privacyPolicy || "",
    terms: policy.terms || "",
  };
}
