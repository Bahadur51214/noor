export type Customer = {
  id: string;
  name: string;
  email: string | null;
  phone: string;
  city: string;
  area: string;
  address: string;
  orderCount: number;
  totalSpent: number;
  createdAt: Date;
  updatedAt: Date;
};

export type CustomerSummary = {
  id: string;
  name: string;
  phone: string;
  orderCount: number;
  totalSpent: number;
  createdAt: Date;
};
