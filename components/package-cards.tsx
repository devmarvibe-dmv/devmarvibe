'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Check, Globe2, Info, Minus, Smartphone } from 'lucide-react';
import { PACKAGES, type Platform } from '@/data/packages';

const PLATFORMS: { value: Platform; label: string; icon: typeof Globe2 }[] = [
  { value: 'web', label: 'Website', icon: Globe2 },
  { value: 'app', label: 'Mobile app', icon: Smartphone },
];

/** The three packages, switchable between the website and mobile-app versions. Each CTA opens /contact pre-filled. */
export function PackageCards() {
  const [platform, setPlatform] = useState<Platform>('web');

  return <div>
    <div className="flex justify-center lg:justify-start">
      <div role="radiogroup" aria-label="Show packages for" className="inline-flex rounded-full border border-slate-200 bg-white p-1 shadow-sm">
        {PLATFORMS.map(({ value, label, icon: Icon }) => {
          const active = platform === value;
          return <button key={value} type="button" role="radio" aria-checked={active} onClick={() => setPlatform(value)} className={`inline-flex min-h-[44px] items-center gap-2 rounded-full px-5 text-sm font-semibold transition ${active ? 'bg-ink text-white' : 'text-slate-600 hover:text-ink'}`}>
            <Icon size={16} aria-hidden="true" /> {label}
          </button>;
        })}
      </div>
    </div>
    {platform === 'app' && <p className="mt-4 text-center text-sm text-slate-600 lg:text-left" role="status">Same scope, built for Android and iOS. Store publishing and push notifications are included in every app package.</p>}

    <div className="mt-10 grid gap-6 lg:grid-cols-3">{PACKAGES.map((item) => {
      const highlighted = item.id === 'growth';
      return <article key={item.id} id={`package-${item.id}`} data-reveal className={`scroll-mt-24 flex flex-col rounded-[28px] border bg-white p-7 sm:p-8 ${highlighted ? 'border-teal-300 shadow-xl shadow-teal-900/10 ring-1 ring-teal-200' : 'border-slate-200 shadow-sm'}`}>
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-xl font-semibold text-ink">{item.name}{platform === 'app' && <span className="text-slate-500"> App</span>}</h3>
          {item.badge && <span className="badge shrink-0">{item.badge}</span>}
        </div>
        <p className="mt-3 text-sm leading-6 text-slate-600">{platform === 'app' ? item.appScope : item.tagline}</p>
        <p className="mt-6 text-2xl font-semibold tracking-tight text-ink">{item.price}</p>
        <Link href={`/contact?package=${item.id}&platform=${platform}`} aria-label={`Get a quote for ${item.shortName}${platform === 'app' ? ' app' : ''}`} className={`${highlighted ? 'button-primary' : 'button-secondary'} mt-5 w-full justify-center`}>
          Get a quote <ArrowRight size={16} aria-hidden="true" />
        </Link>

        <div className="mt-8 border-t border-slate-200 pt-6">
          <p className="text-xs font-bold uppercase tracking-[.14em] text-slate-500">Best for</p>
          <p className="mt-2 text-sm leading-6 text-slate-700">{item.suits}</p>
        </div>

        {item.clientProvides && <div className="mt-6">
          <p className="text-xs font-bold uppercase tracking-[.14em] text-slate-500">You provide</p>
          <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-700">{item.clientProvides.map((line) => <li key={line} className="flex gap-2"><span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400" aria-hidden="true" />{line}</li>)}</ul>
        </div>}

        <div className="mt-6">
          <p className="text-xs font-bold uppercase tracking-[.14em] text-slate-500">What you get</p>
          <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-700">{item.includes.map((line) => <li key={line} className="flex gap-2"><Check size={16} className="mt-1 shrink-0 text-teal-600" aria-hidden="true" />{line}</li>)}</ul>
        </div>

        {item.notIncluded && <div className="mt-6">
          <p className="text-xs font-bold uppercase tracking-[.14em] text-slate-500">Charged separately</p>
          <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-600">{item.notIncluded.map((line) => <li key={line} className="flex gap-2"><Minus size={16} className="mt-1 shrink-0 text-slate-400" aria-hidden="true" />{line}</li>)}</ul>
        </div>}

        {item.note && <div className="mt-6 flex gap-3 rounded-2xl bg-surface p-4 text-sm leading-6 text-slate-700">
          <Info size={18} className="mt-0.5 shrink-0 text-teal-700" aria-hidden="true" />
          <p><strong className="font-semibold text-ink">{item.note.title}.</strong> {item.note.text}</p>
        </div>}
      </article>;
    })}</div>
  </div>;
}
