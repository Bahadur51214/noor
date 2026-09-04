export const siteConfig = {
  name: "NOOR",
  description: "Premium women's watches in Pakistan. Discover our elegant and sophisticated collection.",
  url: process.env.NEXT_PUBLIC_APP_URL || "https://noorwatches.com",
  domain: "noorwatches.com",
  navLinks: [
    { label: 'Shop', href: '/shop' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
    { label: 'Track Order', href: '/track-order' }
  ],
  adminNavLinks: [
    { label: 'Dashboard', href: '/admin' },
    { label: 'Orders', href: '/admin/orders' },
    { label: 'Products', href: '/admin/products' },
    { label: 'Categories', href: '/admin/categories' },
    { label: 'Inventory', href: '/admin/inventory' },
    { label: 'Customers', href: '/admin/customers' },
    { label: 'Discounts', href: '/admin/discounts' },
    { label: 'Reviews', href: '/admin/reviews' },
    { label: 'Analytics', href: '/admin/analytics' },
    { label: 'Settings', href: '/admin/settings' }
  ]
};
