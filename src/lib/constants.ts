export const APP_NAME = 'NOOR';
export const APP_DESCRIPTION = 'Premium women\'s watches in Pakistan. Elegant, minimal, and modern.';
export const DEFAULT_CURRENCY = 'PKR';
export const CURRENCY_SYMBOL = 'Rs.';
export const DEFAULT_COD_FEE = 250;
export const DEFAULT_ADVANCE_FEE = 0;
export const ORDER_NUMBER_PREFIX = 'NOOR-';
export const ITEMS_PER_PAGE = 12;
export const ADMIN_ITEMS_PER_PAGE = 20;
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export const PRODUCT_STATUSES = [
  { label: 'Active', value: 'ACTIVE' },
  { label: 'Draft', value: 'DRAFT' },
  { label: 'Archived', value: 'ARCHIVED' },
];

export const ORDER_STATUSES = [
  { label: 'Pending', value: 'PENDING' },
  { label: 'Payment Verification', value: 'PAYMENT_VERIFICATION' },
  { label: 'Confirmed', value: 'CONFIRMED' },
  { label: 'Processing', value: 'PROCESSING' },
  { label: 'Shipped', value: 'SHIPPED' },
  { label: 'Out for Delivery', value: 'OUT_FOR_DELIVERY' },
  { label: 'Delivered', value: 'DELIVERED' },
  { label: 'Cancelled', value: 'CANCELLED' },
  { label: 'Returned', value: 'RETURNED' },
  { label: 'Refunded', value: 'REFUNDED' },
  { label: 'Payment Issue', value: 'PAYMENT_ISSUE' },
];

export const PAYMENT_METHODS = [
  { label: 'Cash on Delivery', value: 'COD' },
  { label: 'Bank Transfer', value: 'BANK_TRANSFER' },
  { label: 'Easypaisa', value: 'EASYPAISA' },
  { label: 'JazzCash', value: 'JAZZCASH' },
  { label: 'Online Gateway', value: 'ONLINE_GATEWAY' },
];

export const PAYMENT_STATUSES = [
  { label: 'Pending', value: 'PENDING' },
  { label: 'Pending Verification', value: 'PENDING_VERIFICATION' },
  { label: 'Paid', value: 'PAID' },
  { label: 'Rejected', value: 'REJECTED' },
  { label: 'Refunded', value: 'REFUNDED' },
  { label: 'Failed', value: 'FAILED' },
];

export const PAKISTANI_CITIES = [
  'Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Faisalabad', 
  'Multan', 'Peshawar', 'Quetta', 'Sialkot', 'Hyderabad', 
  'Gujranwala', 'Bahawalpur', 'Sargodha', 'Abbottabad', 
  'Mardan', 'Sukkur', 'Muzaffarabad', 'Mirpur'
];
