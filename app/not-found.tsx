import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, ChevronRight } from 'lucide-react';
import { BrandLogo } from '@/components/brand-logo';
import { SiteFooter } from '@/components/site-footer';

export const metadata: Metadata = {
  title: 'Page not found',
  description: 'The page you were looking for could not be found. Head back to DevMarvibe to explore our services and products.',
  robots: { index: false, follow: true },
  // Don't inherit the home page's canonical from the root layout.
  alternates: { canonical: null },
};

const POPULAR_LINKS = [
  ['Our services', '/#services'],
  ['Packages', '/packages'],
  ['About DevMarvibe', '/#about'],
  ['Share a testimonial', '/testimonials/request'],
] as const;

export default function NotFound() {
  return <div className="flex min-h-screen flex-col">
    <main className="hero-grid relative flex flex-1 flex-col overflow-hidden bg-white text-ink">

      <div className="hero-orbit absolute -right-24 -top-16 h-[420px] w-[420px] rounded-full border border-teal-200/70" />
      <div className="hero-orbit absolute -bottom-20 -left-20 h-72 w-72 rounded-full border border-blue-200/70" />

      <header className="site-shell relative z-10 flex h-20 items-center justify-center pt-16"><Link href="/" aria-label="DevMarvibe home"><BrandLogo height={120} priority /></Link></header>
      <div className="hero-enter site-shell relative z-10 flex flex-1 flex-col items-center justify-center py-20 text-center">
        <p className="eyebrow">Error 404</p>
        <h1 className="mt-5 text-7xl font-semibold tracking-[-.04em] text-gradient sm:text-8xl">Lost the plot.</h1>
        <p className="mt-6 max-w-md text-lg leading-8 text-slate-500">The page you’re looking for doesn’t exist, moved, or never shipped. Let’s get you back on track.</p>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
          <Link href="/" className="button-primary">Back to home <ArrowRight size={18} /></Link>
          <Link href="/contact" className="button-secondary">Talk to us <ChevronRight size={18} /></Link>
        </div>
        <nav aria-label="Popular pages" className="mt-10">
          <ul className="flex flex-wrap justify-center gap-x-6 text-sm font-semibold text-teal-700">{POPULAR_LINKS.map(([label, href]) => <li key={href}><Link href={href} className="tap-target hover:text-ink">{label}</Link></li>)}</ul>
        </nav>
      </div>
    </main>
    <SiteFooter />
  </div>;
}
