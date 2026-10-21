import { Suspense } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Clock3, Mail, MessageSquareText, Phone, FileSignature, Rocket } from 'lucide-react';
import { SubpageHeader } from '@/components/subpage-header';
import { SiteFooter } from '@/components/site-footer';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { ContactPageForm } from '@/components/contact-page-form';
import { TrackVisit } from '@/components/track-visit';

export const metadata: Metadata = {
  title: 'Contact us',
  description: 'Tell DevMarvibe about your website or mobile app project. Ask about the Starter, Growth Studio or Enterprise Suite packages and get a quote.',
  alternates: { canonical: '/contact' },
};

const EMAIL = 'hello@devmarvibe.com';
const PHONE_DISPLAY = '+91 99599 25779';
const PHONE_LINK = '+919959925779';

const NEXT_STEPS = [
  { icon: MessageSquareText, title: 'We get in touch', text: 'We reply to understand your goals, content and timeline, and recommend the package that fits.' },
  { icon: FileSignature, title: 'You get a quote', text: 'A clear scope and price for the package you choose. Work starts with a 50% advance.' },
  { icon: Rocket, title: 'We build and launch', text: 'Two rounds of revisions at each design stage, then launch — with the balance due before go-live.' },
];

function FormFallback() {
  return <div className="h-[640px] rounded-[28px] border border-slate-200 bg-white" aria-hidden="true" />;
}

export default function ContactPage() {
  return <><main className="min-h-screen bg-surface text-ink">
    <TrackVisit page="contact" />
    <SubpageHeader links={[{ label: 'Packages', href: '/packages' }, { label: 'Services', href: '/#services' }]} />

    <div className="site-shell py-14 sm:py-20">
      <Breadcrumbs items={[{ name: 'Home', href: '/' }, { name: 'Contact us', href: '/contact' }]} />
      <div className="grid gap-12 lg:grid-cols-[.8fr_1.2fr] lg:items-start">
        <div className="hero-enter">
          <p className="eyebrow">Contact us</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-ink sm:text-5xl">Let&apos;s talk about your project.</h1>
          <p className="mt-6 text-lg leading-8 text-slate-600">Whether you have your content ready or want us to handle everything, tell us what you&apos;re planning and we&apos;ll come back with the right package and a quote.</p>

          <ul className="mt-8 flex flex-col gap-1 text-sm text-slate-700">
            <li><a href={`mailto:${EMAIL}`} className="tap-target gap-3 font-medium transition hover:text-teal-700"><Mail size={18} className="text-teal-600" aria-hidden="true" /> {EMAIL}</a></li>
            <li><a href={`tel:${PHONE_LINK}`} className="tap-target gap-3 font-medium transition hover:text-teal-700"><Phone size={18} className="text-teal-600" aria-hidden="true" /> {PHONE_DISPLAY}</a></li>
          </ul>
          <p className="mt-6 inline-flex items-center gap-3 rounded-2xl border border-teal-100 bg-teal-50 px-4 py-3 text-sm font-semibold text-teal-800"><Clock3 size={18} aria-hidden="true" /> Currently accepting new projects</p>

          <div className="mt-10 border-t border-slate-200 pt-8">
            <h2 className="text-lg font-semibold">What happens next</h2>
            <ol className="mt-5 space-y-5">{NEXT_STEPS.map(({ icon: Icon, title, text }, index) => <li key={title} className="flex gap-4">
              <div className="icon-box shrink-0"><Icon size={20} aria-hidden="true" /></div>
              <div><p className="font-semibold"><span className="sr-only">Step {index + 1}: </span>{title}</p><p className="mt-1 text-sm leading-6 text-slate-600">{text}</p></div>
            </li>)}</ol>
          </div>

          <Link href="/packages" className="tap-target mt-8 gap-2 text-sm font-bold text-teal-700">Compare packages first <ArrowRight size={16} aria-hidden="true" /></Link>
        </div>

        <Suspense fallback={<FormFallback />}><ContactPageForm /></Suspense>
      </div>
    </div>

    </main>
  <SiteFooter showCta={false} /></>;
}
