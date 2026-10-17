import Link from 'next/link';
import { ArrowRight, ChevronRight } from 'lucide-react';

export default function NotFound() {
  return <main className="hero-grid relative flex min-h-screen flex-col overflow-hidden bg-white text-ink">

    <div className="hero-orbit absolute -right-24 -top-16 h-[420px] w-[420px] rounded-full border border-teal-200/70" />
    <div className="hero-orbit absolute -bottom-20 -left-20 h-72 w-72 rounded-full border border-blue-200/70" />

    <div className="site-shell relative z-10 flex flex-1 flex-col items-center justify-center py-20 text-center">
    <header className="site-shell relative z-10 flex h-20 items-center justify-center"><Link href="/" aria-label="DevMarvibe home"><img src="/Main_Logo.png" alt="DevMarVibe" className="h-[120px] w-auto object-contain" /></Link></header>

      <p className="eyebrow">Error 404</p>
      <h1 className="mt-5 text-7xl font-semibold tracking-[-.04em] text-gradient sm:text-8xl">Lost the plot.</h1>
      <p className="mt-6 max-w-md text-lg leading-8 text-slate-500">The page you’re looking for doesn’t exist, moved, or never shipped. Let’s get you back on track.</p>
      <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
        <Link href="/" className="button-primary">Back to home <ArrowRight size={18} /></Link>
        <Link href="/#contact" className="button-secondary">Talk to us <ChevronRight size={18} /></Link>
      </div>
    </div>
  </main>;
}
