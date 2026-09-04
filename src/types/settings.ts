export type StoreSettings = {
  storeName: string;
  logo: string | null;
  email: string;
  phone: string;
  whatsapp: string;
  currency: string;
};

export type ShippingSettings = {
  codDeliveryFee: number;
  advanceDeliveryFee: number;
  freeShippingMinOrder: number | null;
};

export type HomepageSettings = {
  announcementBar: string | null;
  heroTitle: string;
  heroSubtitle: string;
  heroCta: string;
  heroImage: string;
};

export type SocialSettings = {
  instagram: string | null;
  facebook: string | null;
  tiktok: string | null;
  youtube: string | null;
};

export type PolicySettings = {
  shippingPolicy: string;
  returnPolicy: string;
  privacyPolicy: string;
  terms: string;
};
