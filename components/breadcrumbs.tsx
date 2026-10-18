import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { SITE_URL } from '@/lib/seo';

export type Crumb = { name: string; href: string };

/** Visible breadcrumb trail plus schema.org BreadcrumbList for search results. The last crumb is the current page. */
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.href === '/' ? '' : item.href}`,
    })),
  };

  return <nav aria-label="Breadcrumb" className="mb-8">
    <ol className="flex flex-wrap items-center gap-1 text-sm text-slate-500">
      {items.map((item, index) => {
        const last = index === items.length - 1;
        return <li key={item.href} className="flex items-center gap-1">
          {last
            ? <span aria-current="page" className="font-semibold text-ink">{item.name}</span>
            : <Link href={item.href} className="tap-target transition hover:text-teal-700">{item.name}</Link>}
          {!last && <ChevronRight size={14} aria-hidden="true" />}
        </li>;
      })}
    </ol>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
  </nav>;
}
