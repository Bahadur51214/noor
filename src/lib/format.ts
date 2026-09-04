export function formatCurrency(amount: number | string): string {
  const num = typeof amount === 'string' ? parseFloat(amount) : Number(amount);
  if (isNaN(num)) return 'Rs. 0';

  return new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency: 'PKR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
    .format(num)
    .replace('PKR', 'Rs.');
}

export function formatPhoneDisplay(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 11 && cleaned.startsWith('03')) {
    return `${cleaned.slice(0, 4)}-${cleaned.slice(4)}`;
  }
  return phone;
}

export function formatOrderNumber(num: string): string {
  if (!num.startsWith('NOOR-')) {
    return `NOOR-${num}`;
  }
  return num;
}

export function getPaymentMethodLabel(method: string): string {
  const labels: Record<string, string> = {
    COD: 'Cash on Delivery',
    BANK_TRANSFER: 'Bank Transfer',
    EASYPAISA: 'Easypaisa',
    JAZZCASH: 'JazzCash',
    ONLINE_GATEWAY: 'Online Gateway',
  };
  return labels[method] || method;
}

export function getPaymentStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    PENDING: 'Pending',
    PENDING_VERIFICATION: 'Pending Verification',
    PAID: 'Paid',
    REJECTED: 'Rejected',
    REFUNDED: 'Refunded',
    FAILED: 'Failed',
  };
  return labels[status] || status;
}

export function getOrderStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    PENDING: 'Pending',
    PAYMENT_VERIFICATION: 'Payment Verification',
    CONFIRMED: 'Confirmed',
    PROCESSING: 'Processing',
    SHIPPED: 'Shipped',
    OUT_FOR_DELIVERY: 'Out for Delivery',
    DELIVERED: 'Delivered',
    CANCELLED: 'Cancelled',
    RETURNED: 'Returned',
    REFUNDED: 'Refunded',
    PAYMENT_ISSUE: 'Payment Issue',
  };
  return labels[status] || status;
}

export function getOrderStatusColor(status: string): string {
  const colors: Record<string, string> = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    PAYMENT_VERIFICATION: 'bg-purple-100 text-purple-800',
    CONFIRMED: 'bg-blue-100 text-blue-800',
    PROCESSING: 'bg-blue-100 text-blue-800',
    SHIPPED: 'bg-indigo-100 text-indigo-800',
    OUT_FOR_DELIVERY: 'bg-indigo-100 text-indigo-800',
    DELIVERED: 'bg-green-100 text-green-800',
    CANCELLED: 'bg-red-100 text-red-800',
    RETURNED: 'bg-orange-100 text-orange-800',
    REFUNDED: 'bg-teal-100 text-teal-800',
    PAYMENT_ISSUE: 'bg-red-100 text-red-800',
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
}

export function getPaymentStatusColor(status: string): string {
  const colors: Record<string, string> = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    PENDING_VERIFICATION: 'bg-purple-100 text-purple-800',
    PAID: 'bg-green-100 text-green-800',
    REJECTED: 'bg-red-100 text-red-800',
    REFUNDED: 'bg-teal-100 text-teal-800',
    FAILED: 'bg-red-100 text-red-800',
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
}
