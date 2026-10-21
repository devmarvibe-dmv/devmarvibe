'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/** Everything that fades up as it scrolls into view. Opt other elements in with `data-reveal`. */
const REVEAL_SELECTOR = '[data-reveal], .service-card, .product-card, .testimonial-card, main form';
const STAGGER_MS = 70;
const MAX_STAGGER_MS = 350;
const DURATION_MS = 700;

/**
 * Site-wide scroll-reveal. Content is visible by default; this only hides what
 * is still below the fold, after JavaScript has loaded, so nothing is lost
 * without JS and nothing flickers on first paint. Skipped entirely for users
 * who prefer reduced motion. Watches the DOM so sections that appear later
 * (API data, route changes) animate too.
 */
export function ScrollReveal() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return;
    const root = document.documentElement;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const element = entry.target as HTMLElement;
        element.classList.add('is-revealed');
        observer.unobserve(element);
        // Hand transitions back to the element's own styles (card hovers) once the reveal has played.
        const delay = parseInt(element.style.getPropertyValue('--reveal-delay'), 10) || 0;
        window.setTimeout(() => element.removeAttribute('data-reveal-bound'), DURATION_MS + delay + 50);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });

    // Tracked here rather than as an attribute: touching server-rendered markup before
    // React hydrates it causes "Extra attributes from the server" warnings.
    const seen = new WeakSet<Element>();
    let retryTimer: number | undefined;
    let retries = 0;
    // React tags each DOM node it has hydrated with a "__reactFiber$…" key.
    const isHydrated = (element: Element) => Object.keys(element).some((key) => key.startsWith('__reactFiber$'));

    const prepare = (element: Element) => {
      if (!(element instanceof HTMLElement) || seen.has(element)) return;
      if (!isHydrated(element)) {
        // Part of a section still waiting to hydrate (e.g. a lazy chunk): try again shortly.
        if (retries < 25 && retryTimer === undefined) {
          retryTimer = window.setTimeout(() => { retryTimer = undefined; retries += 1; scan(document); }, 200);
        }
        return;
      }
      seen.add(element);
      // Already on screen: leave it as it is rather than hiding and re-animating it.
      if (element.getBoundingClientRect().top < window.innerHeight) return;
      element.dataset.revealBound = 'true';
      const siblings = element.parentElement ? Array.from(element.parentElement.children).filter((child) => child.matches(REVEAL_SELECTOR)) : [];
      const position = Math.max(0, siblings.indexOf(element));
      element.style.setProperty('--reveal-delay', `${Math.min(position * STAGGER_MS, MAX_STAGGER_MS)}ms`);
      observer.observe(element);
    };

    const scan = (scope: ParentNode) => {
      if (scope instanceof Element && scope.matches(REVEAL_SELECTOR)) prepare(scope);
      scope.querySelectorAll(REVEAL_SELECTOR).forEach(prepare);
    };

    scan(document);
    root.classList.add('reveal-ready');

    const mutations = new MutationObserver((records) => {
      records.forEach((record) => record.addedNodes.forEach((node) => {
        if (node instanceof Element) scan(node);
      }));
    });
    mutations.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutations.disconnect();
      window.clearTimeout(retryTimer);
    };
  }, [pathname]);

  return null;
}
