export enum InventoryTransactionType {
  ORDER = 'ORDER',
  RESTOCK = 'RESTOCK',
  MANUAL_ADJUSTMENT = 'MANUAL_ADJUSTMENT',
  CANCELLATION = 'CANCELLATION',
  RETURN = 'RETURN',
}

export type InventoryTransaction = {
  id: string;
  productId: string;
  type: InventoryTransactionType;
  quantity: number;
  stockBefore: number;
  stockAfter: number;
  orderId: string | null;
  note: string | null;
  adminId: string | null;
  createdAt: Date;
};

export type StockStatus = 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK';

export function getStockStatus(stock: number, lowStockThreshold: number = 5): StockStatus {
  if (stock <= 0) return 'OUT_OF_STOCK';
  if (stock <= lowStockThreshold) return 'LOW_STOCK';
  return 'IN_STOCK';
}
