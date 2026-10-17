import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Share a testimonial',
  description: 'Tell us about your experience working with DevMarvibe on a service, product, or project.',
  alternates: { canonical: '/testimonials/request' },
};

export default function TestimonialRequestLayout({ children }: { children: React.ReactNode }) {
  return children;
}
