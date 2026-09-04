export const storeNavigation = [
  { label: 'Shop', href: '/shop' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
  { label: 'Track Order', href: '/track-order' }
];

export const adminNavigation = [
  { label: 'Dashboard', href: '/admin', icon: 'LayoutDashboard' },
  { label: 'Orders', href: '/admin/orders', icon: 'ShoppingCart' },
  { label: 'Products', href: '/admin/products', icon: 'Package' },
  { label: 'Categories', href: '/admin/categories', icon: 'Tags' },
  { label: 'Inventory', href: '/admin/inventory', icon: 'Warehouse' },
  { label: 'Customers', href: '/admin/customers', icon: 'Users' },
  { label: 'Discounts', href: '/admin/discounts', icon: 'Percent' },
  { label: 'Reviews', href: '/admin/reviews', icon: 'MessageSquare' },
  { label: 'Analytics', href: '/admin/analytics', icon: 'LineChart' },
  { label: 'Settings', href: '/admin/settings', icon: 'Settings' }
];

export const footerNavigation = {
  Shop: [
    { label: 'All Watches', href: '/shop' },
    { label: 'New Arrivals', href: '/shop?collection=new' },
    { label: 'Best Sellers', href: '/shop?collection=best-sellers' },
  ],
  Support: [
    { label: 'Contact Us', href: '/contact' },
    { label: 'Track Order', href: '/track-order' },
    { label: 'FAQs', href: '/faqs' },
    { label: 'Shipping & Returns', href: '/shipping-returns' },
  ],
  Legal: [
    { label: 'Privacy Policy', href: '/privacy-policy' },
    { label: 'Terms of Service', href: '/terms-of-service' },
  ],
};
