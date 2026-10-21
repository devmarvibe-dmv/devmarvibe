import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { BrandLogo } from '@/components/brand-logo';

/** Header for inner pages: back to home, logo, and the key next steps. */
export function SubpageHeader({ links = [] }: { links?: { label: string; href: string }[] }) {
  return <header className="border-b border-slate-200 bg-white">
    <div className="site-shell flex h-20 items-center justify-between gap-4">
      <Link href="/" className="tap-target gap-2 text-sm font-bold text-teal-700"><ArrowLeft size={16} aria-hidden="true" /> <span>Back<span className="hidden sm:inline"> to DevMarvibe</span></span></Link>
      <div className="flex items-center gap-6">
        {links.length > 0 && <nav aria-label="Page links" className="hidden md:block"><ul className="flex items-center gap-6">{links.map((link) => <li key={link.href}><Link href={link.href} className="nav-link hover:text-ink">{link.label}</Link></li>)}</ul></nav>}
        <Link href="/" aria-label="DevMarvibe home"><BrandLogo height={56} priority /></Link>
      </div>
    </div>
  </header>;
}
