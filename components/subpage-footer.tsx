import Link from 'next/link';
import { SiteVersion } from '@/components/site-version';

const LINKS = [
  ['Home', '/'],
  ['Services', '/#services'],
  ['Contact', '/#contact'],
  ['Share a testimonial', '/testimonials/request'],
  ['Report a security issue', '/security'],
] as const;

/** Footer for inner pages: links back into the site, copyright and version. */
export function SubpageFooter() {
  return <footer className="border-t border-slate-200 bg-white py-6">
    <div className="site-shell flex flex-col gap-4 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
      <nav aria-label="Footer"><ul className="flex flex-wrap gap-x-5">{LINKS.map(([label, href]) => <li key={href}><Link href={href} className="tap-target transition hover:text-teal-700">{label}</Link></li>)}</ul></nav>
      <div className="sm:text-right"><p>© {new Date().getFullYear()} DevMarvibe. All rights reserved.</p><SiteVersion className="mt-1" /></div>
    </div>
  </footer>;
}
