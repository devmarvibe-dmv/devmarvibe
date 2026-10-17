import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Report a security issue',
  description: 'Report a security vulnerability in a DevMarvibe website or app privately to our team.',
  alternates: { canonical: '/security' },
};

export default function SecurityLayout({ children }: { children: React.ReactNode }) {
  return children;
}
