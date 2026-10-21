import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Check, LayoutDashboard, Minus, PlugZap, Puzzle, ScrollText, Smartphone } from 'lucide-react';
import { SubpageHeader } from '@/components/subpage-header';
import { SiteFooter } from '@/components/site-footer';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { PackageCards } from '@/components/package-cards';
import { TrackVisit } from '@/components/track-visit';
import { ADD_ONS, APP_COMMON, COMPARISON, PACKAGES, TERMS, type ComparisonValue } from '@/data/packages';

export const metadata: Metadata = {
  title: 'Web & mobile app packages',
  description: 'Compare DevMarvibe packages: Starter (Launchpad), Growth Studio and Enterprise Suite — from a website built from your content to a custom web application with its own admin panel. Every package is also available as an Android and iOS app.',
  alternates: { canonical: '/packages' },
};

function ComparisonCell({ value }: { value: ComparisonValue }) {
  if (value === true) return <span className="inline-flex items-center gap-1.5 text-teal-700"><Check size={17} aria-hidden="true" />Included</span>;
  if (value === false) return <span className="inline-flex items-center gap-1.5 text-slate-500"><Minus size={17} aria-hidden="true" />Not included</span>;
  return <span>{value}</span>;
}

const INFO_CARDS = [
  { icon: LayoutDashboard, title: 'Console access', text: 'Starter and Growth Studio projects are hosted and managed on console.devmarvibe.com. You get a login to update content and view enquiries. Enterprise Suite projects get their own admin panel instead.' },
  { icon: PlugZap, title: 'API charges', text: 'APIs supplied through console.devmarvibe.com — payment gateway, SMS, email, maps, AI and more — are billed on actual usage, on top of the package price. Third-party fees such as gateway transaction charges are passed on at cost.' },
];

export default function PackagesPage() {
  return <><main className="min-h-screen bg-white text-ink">
    <TrackVisit page="packages" />
    <SubpageHeader links={[{ label: 'Compare', href: '#compare' }, { label: 'Mobile apps', href: '#mobile' }, { label: 'Contact', href: '/contact' }]} />

    <section className="hero-grid">
      <div className="site-shell py-14 sm:py-20">
        <Breadcrumbs items={[{ name: 'Home', href: '/' }, { name: 'Packages', href: '/packages' }]} />
        <div className="hero-enter max-w-3xl">
          <p className="eyebrow">Web &amp; mobile packages</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-ink sm:text-5xl lg:text-6xl">Pick the package that fits where you are.</h1>
          <p className="mt-6 text-lg leading-8 text-slate-600">Three packages, from a website built from content you already have to a fully custom web application. Every package is also available as a mobile app for Android and iOS, with the same scope.</p>
        </div>
        <div className="mt-12"><PackageCards /></div>
      </div>
    </section>

    <section id="compare" className="site-shell section-pad">
      <div data-reveal className="max-w-2xl"><p className="eyebrow">Compare</p><h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">Packages side by side.</h2></div>
      <div className="mt-10 overflow-x-auto rounded-[24px] border border-slate-200" tabIndex={0} role="region" aria-label="Package comparison table">
        <table className="w-full min-w-[640px] border-collapse text-left text-sm">
          <caption className="sr-only">Features included in each package</caption>
          <thead className="bg-surface">
            <tr>
              <th scope="col" className="sticky left-0 bg-surface px-5 py-4 font-semibold text-slate-600">Feature</th>
              {PACKAGES.map((item) => <th key={item.id} scope="col" className="px-5 py-4 font-semibold text-ink">{item.shortName}</th>)}
            </tr>
          </thead>
          <tbody>{COMPARISON.map((row) => <tr key={row.feature} className="border-t border-slate-200">
            <th scope="row" className="sticky left-0 bg-white px-5 py-4 font-medium text-slate-700">{row.feature}</th>
            {PACKAGES.map((item) => <td key={item.id} className="px-5 py-4 text-slate-700"><ComparisonCell value={row.values[item.id]} /></td>)}
          </tr>)}</tbody>
        </table>
      </div>
    </section>

    <section id="mobile" className="bg-surface section-pad">
      <div className="site-shell grid gap-12 lg:grid-cols-[1.1fr_.9fr]">
        <div>
          <div data-reveal><p className="eyebrow">Mobile apps</p><h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">Every package, as an Android and iOS app.</h2><p className="mt-5 text-lg leading-8 text-slate-600">All three packages are offered for mobile apps on the same terms.</p></div>
          <ul className="mt-10 space-y-4">{PACKAGES.map((item) => <li key={item.id} data-reveal className="rounded-[24px] border border-slate-200 bg-white p-6">
            <h3 className="flex items-center gap-2 font-semibold text-ink"><Smartphone size={18} className="text-teal-700" aria-hidden="true" /> {item.shortName} App</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">{item.appScope}</p>
          </li>)}</ul>
        </div>
        <div data-reveal className="self-start rounded-[28px] bg-ink p-7 text-white sm:p-8">
          <h3 className="text-lg font-semibold">Included in every app package</h3>
          <ul className="mt-5 space-y-3 text-sm leading-6 text-slate-200">{APP_COMMON.map((line) => <li key={line} className="flex gap-2"><Check size={16} className="mt-1 shrink-0 text-teal-300" aria-hidden="true" />{line}</li>)}</ul>
          <Link href="/contact?platform=app" className="button-primary mt-8">Enquire about an app <ArrowRight size={16} aria-hidden="true" /></Link>
        </div>
      </div>
    </section>

    <section className="site-shell section-pad">
      <div data-reveal className="max-w-2xl"><p className="eyebrow">Good to know</p><h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">Console, add-ons and terms.</h2></div>
      <div className="mt-10 grid gap-5 md:grid-cols-2">
        {INFO_CARDS.map(({ icon: Icon, title, text }) => <article key={title} data-reveal className="rounded-[24px] border border-slate-200 p-7"><div className="icon-box"><Icon size={20} aria-hidden="true" /></div><h3 className="mt-5 text-lg font-semibold">{title}</h3><p className="mt-3 text-sm leading-6 text-slate-600">{text}</p></article>)}
        <article data-reveal className="rounded-[24px] border border-slate-200 p-7"><div className="icon-box"><Puzzle size={20} aria-hidden="true" /></div><h3 className="mt-5 text-lg font-semibold">Add-ons <span className="font-normal text-slate-500">(charged separately)</span></h3><ul className="mt-3 space-y-2 text-sm leading-6 text-slate-600">{ADD_ONS.map((line) => <li key={line} className="flex gap-2"><Check size={16} className="mt-1 shrink-0 text-teal-600" aria-hidden="true" />{line}</li>)}</ul></article>
        <article data-reveal className="rounded-[24px] border border-slate-200 p-7"><div className="icon-box"><ScrollText size={20} aria-hidden="true" /></div><h3 className="mt-5 text-lg font-semibold">General terms</h3><ul className="mt-3 space-y-2 text-sm leading-6 text-slate-600">{TERMS.map((line) => <li key={line} className="flex gap-2"><Check size={16} className="mt-1 shrink-0 text-teal-600" aria-hidden="true" />{line}</li>)}</ul></article>
      </div>
    </section>

    <section className="site-shell pb-20">
      <div data-reveal className="flex flex-col items-start justify-between gap-6 rounded-[28px] bg-ink p-8 text-white sm:p-10 lg:flex-row lg:items-center">
        <div><h2 className="text-2xl font-semibold sm:text-3xl">Not sure which package fits?</h2><p className="mt-3 max-w-xl leading-7 text-slate-300">Tell us about your business and what you want to build — we&apos;ll recommend a package and send a quote.</p></div>
        <Link href="/contact" className="button-primary shrink-0">Talk to us <ArrowRight size={16} aria-hidden="true" /></Link>
      </div>
    </section>

    </main>
  <SiteFooter /></>;
}
