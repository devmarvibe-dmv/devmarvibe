'use client';

import { ArrowUp } from 'lucide-react';

/** Scrolls back to the top of the page, then moves focus there for keyboard and screen-reader users. */
export function BackToTop({ className = '' }: { className?: string }) {
  const handleClick = () => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    const target = document.querySelector<HTMLElement>('header a, main a, h1');
    target?.focus({ preventScroll: true });
  };

  return <button type="button" onClick={handleClick} className={`tap-target gap-1.5 font-semibold ${className}`}>
    <ArrowUp size={14} aria-hidden="true" /> Back to top
  </button>;
}
