export enum DiscountType {
  PERCENTAGE = 'PERCENTAGE',
  FIXED = 'FIXED',
}

export type Discount = {
  id: string;
  code: string;
  type: DiscountType;
  amount: number;
  minOrder: number;
  maxDiscount: number | null;
  startDate: Date;
  endDate: Date;
  usageLimit: number | null;
  usageCount: number;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type DiscountFormData = Omit<Discount, 'id' | 'usageCount' | 'createdAt' | 'updatedAt'>;
