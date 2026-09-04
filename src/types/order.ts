export enum OrderStatus {
  PENDING = 'PENDING',
  PAYMENT_VERIFICATION = 'PAYMENT_VERIFICATION',
  CONFIRMED = 'CONFIRMED',
  PROCESSING = 'PROCESSING',
  SHIPPED = 'SHIPPED',
  OUT_FOR_DELIVERY = 'OUT_FOR_DELIVERY',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
  RETURNED = 'RETURNED',
  REFUNDED = 'REFUNDED',
  PAYMENT_ISSUE = 'PAYMENT_ISSUE',
}

export enum PaymentMethod {
  COD = 'COD',
  BANK_TRANSFER = 'BANK_TRANSFER',
  EASYPAISA = 'EASYPAISA',
  JAZZCASH = 'JAZZCASH',
  ONLINE_GATEWAY = 'ONLINE_GATEWAY',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  PENDING_VERIFICATION = 'PENDING_VERIFICATION',
  PAID = 'PAID',
  REJECTED = 'REJECTED',
  REFUNDED = 'REFUNDED',
  FAILED = 'FAILED',
}

export type OrderItem = {
  id: string;
  orderId: string;
  productId: string;
  productName: string;
  productImage: string | null;
  quantity: number;
  price: number;
  total: number;
};

export type OrderStatusHistory = {
  id: string;
  orderId: string;
  status: OrderStatus;
  note: string | null;
  adminId: string | null;
  createdAt: Date;
};

export type Payment = {
  id: string;
  orderId: string;
  method: PaymentMethod;
  transactionId: string | null;
  senderName: string | null;
  screenshotUrl: string | null;
  status: PaymentStatus;
  verifiedById: string | null;
  verifiedAt: Date | null;
  rejectionReason: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type Order = {
  id: string;
  orderNumber: string;
  customerId: string | null;
  customerName: string;
  customerPhone: string;
  customerEmail: string | null;
  city: string;
  area: string;
  address: string;
  landmark: string | null;
  subtotal: number;
  deliveryFee: number;
  discountAmount: number;
  total: number;
  discountId: string | null;
  discountCode: string | null;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  courier: string | null;
  trackingNumber: string | null;
  trackingUrl: string | null;
  items: OrderItem[];
  payments: Payment[];
  statusHistory: OrderStatusHistory[];
  createdAt: Date;
  updatedAt: Date;
};

export type OrderSummary = {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  city: string;
  total: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  createdAt: Date;
};

export type CreateOrderData = {
  fullName: string;
  phone: string;
  email?: string;
  city: string;
  area: string;
  address: string;
  landmark?: string;
  paymentMethod: PaymentMethod;
};
