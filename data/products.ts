export type Product = {
  name: string;
  tagline: string;
  features: string[];
  tone: 'blue' | 'teal' | 'ink';
};

export const products: Product[] = [
  { name: 'SaaS Starter Kits', tagline: 'Launch your next product faster.', features: ['Authentication & team roles', 'Billing-ready foundations', 'Scalable admin dashboards'], tone: 'blue' },
  { name: 'Business Management Suite', tagline: 'One connected view of your business.', features: ['Inventory and CRM workflows', 'Web and mobile access', 'Configurable operations tools'], tone: 'teal' },
  { name: 'E-Commerce App Platform', tagline: 'Sell everywhere, built your way.', features: ['Payments and product catalogs', 'Order management built in', 'White-label web and mobile apps'], tone: 'ink' },
];
