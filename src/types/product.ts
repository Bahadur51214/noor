export enum ProductStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  ARCHIVED = 'ARCHIVED',
}

export type ProductImage = {
  id: string;
  productId: string;
  url: string;
  alt: string | null;
  sortOrder: number;
  createdAt: Date;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  sortOrder: number;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  sku: string;
  description: string;
  shortDescription: string | null;
  specifications: Record<string, string> | null;
  price: number;
  salePrice: number | null;
  costPrice: number | null;
  stock: number;
  lowStockThreshold: number;
  categoryId: string | null;
  status: ProductStatus;
  featured: boolean;
  bestSeller: boolean;
  newArrival: boolean;
  seoTitle: string | null;
  seoDescription: string | null;
  images: ProductImage[];
  category: Category | null;
  createdAt: Date;
  updatedAt: Date;
};

export type ProductCard = {
  id: string;
  name: string;
  slug: string;
  price: number;
  salePrice: number | null;
  stock: number;
  status: ProductStatus;
  mainImage: string | null;
  categoryName: string | null;
  featured: boolean;
  bestSeller: boolean;
  newArrival: boolean;
};

export type ProductFormData = Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'images' | 'category'>;
