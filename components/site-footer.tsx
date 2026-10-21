import Link from 'next/link';
import { ArrowRight, Clock3, Facebook, Github, Globe2, Instagram, Linkedin, Mail, Phone, Twitter, Youtube, type LucideIcon } from 'lucide-react';
import { BrandLogo } from '@/components/brand-logo';
import { SiteVersion } from '@/components/site-version';
import { BackToTop } from '@/components/back-to-top';
import { PACKAGES } from '@/data/packages';

export type FooterSocialLink = { platform: string; url: string };

const SOCIAL_ICONS: Record<string, LucideIcon> = {
  linkedin: Linkedin,
  instagram: Instagram,
  github: Github,
  twitter: Twitter,
  x: Twitter,
  facebook: Facebook,
  youtube: Youtube,
};

// Shown until the console's social links load (or when none are set there).
export const DEFAULT_SOCIAL_LINKS: FooterSocialLink[] = [
  { platform: 'instagram', url: 'https://www.instagram.com/devmarvibe' },
];

const DEFAULT_EMAIL = 'hello@devmarvibe.com';
const PHONE_DISPLAY = '+91 99599 25779';
const PHONE_LINK = '+919959925779';

type SiteFooterProps = {
  socialLinks?: FooterSocialLink[];
  supportEmail?: string;
  /** Hide the Products link when the console has no products to show. */
  showProducts?: boolean;
  /** Hide "Report a security issue" when that module is switched off in the console. */
  showSecurity?: boolean;
  /** The "Have a project in mind?" band — off on /contact, where it would point at itself. */
  showCta?: boolean;
};

function FooterColumn({ title, children }: { title: string; children: React.ReactNode }) {
  return <nav aria-label={title}>
    <h2 className="footer-heading">{title}</h2>
    <ul className="mt-3 grid text-sm text-slate-400">{children}</ul>
  </nav>;
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return <li><Link href={href} className="tap-target transition hover:text-white">{children}</Link></li>;
}

/** Site-wide footer: call to action, link columns, contact details, copyright and version. */
export function SiteFooter({ socialLinks = DEFAULT_SOCIAL_LINKS, supportEmail = DEFAULT_EMAIL, showProducts = true, showSecurity = true, showCta = true }: SiteFooterProps) {
  const links = socialLinks.length ? socialLinks : DEFAULT_SOCIAL_LINKS;

  return <footer className="relative overflow-hidden bg-ink text-white">
    {/* Brand motif: faint grid and orbit rings. */}
    <div aria-hidden="true" className="footer-grid pointer-events-none absolute inset-0" />
    <div aria-hidden="true" className="footer-orbit pointer-events-none absolute -right-[300px] -top-[340px] hidden h-[560px] w-[560px] lg:block" />
    <div aria-hidden="true" className="footer-orbit pointer-events-none absolute -bottom-[300px] -left-[260px] hidden h-[440px] w-[440px] lg:block" />

    <div className="site-shell relative">
      {showCta && <div data-reveal className="flex flex-col gap-6 border-b border-white/10 py-12 lg:flex-row lg:items-center lg:justify-between lg:py-16">
        <div className="max-w-xl">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Have a project in mind?</h2>
          <p className="mt-3 leading-7 text-slate-300">Tell us what you want to build — we&apos;ll recommend the right package and send you a quote.</p>
        </div>
        <div className="grid gap-3 sm:flex sm:flex-wrap">
          <Link href="/contact" className="button-primary justify-center">Get a quote <ArrowRight size={16} aria-hidden="true" /></Link>
          <Link href="/packages" className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl border border-white/20 px-5 font-semibold text-white transition hover:border-teal-300 hover:text-teal-200">Compare packages</Link>
        </div>
      </div>}

      <div className="grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr] lg:py-16">
        <div>
          <Link href="/" aria-label="DevMarvibe home" className="-ml-[23px] inline-block"><BrandLogo light /></Link>
          <p className="mt-4 max-w-xs text-sm leading-6 text-slate-400">Digital products and growth systems for teams ready to move with purpose.</p>
          <ul className="mt-6 flex gap-3" aria-label="Social media">{links.map((link) => {
            const Icon = SOCIAL_ICONS[link.platform.toLowerCase()] ?? Globe2;
            const external = !link.url.startsWith('#');
            return <li key={link.platform}><a className="social-link" href={link.url} target={external ? '_blank' : undefined} rel={external ? 'noopener noreferrer' : undefined} aria-label={`DevMarvibe on ${link.platform}`}><Icon size={17} aria-hidden="true" /></a></li>;
          })}</ul>
          <p className="mt-6 inline-flex items-center gap-2 rounded-full border border-teal-300/20 bg-teal-400/10 px-3 py-1.5 text-xs font-semibold text-teal-200"><Clock3 size={14} aria-hidden="true" /> Accepting new projects</p>
        </div>

        <FooterColumn title="Company">
          <FooterLink href="/#about">About</FooterLink>
          <FooterLink href="/#services">Services</FooterLink>
          {showProducts && <FooterLink href="/#products">Products</FooterLink>}
          <FooterLink href="/packages">Packages</FooterLink>
        </FooterColumn>

        <FooterColumn title="Packages">
          {PACKAGES.map((item) => <FooterLink key={item.id} href={`/packages#package-${item.id}`}>{item.shortName}</FooterLink>)}
          <FooterLink href="/packages#mobile">Mobile apps</FooterLink>
        </FooterColumn>

        <div>
          <h2 className="footer-heading">Get in touch</h2>
          <ul className="mt-3 grid text-sm text-slate-400">
            <li><a href={`mailto:${supportEmail}`} className="tap-target gap-2 transition hover:text-white"><Mail size={15} className="text-teal-300" aria-hidden="true" /> {supportEmail}</a></li>
            <li><a href={`tel:${PHONE_LINK}`} className="tap-target gap-2 transition hover:text-white"><Phone size={15} className="text-teal-300" aria-hidden="true" /> {PHONE_DISPLAY}</a></li>
            <FooterLink href="/contact">Contact us</FooterLink>
            <FooterLink href="/testimonials/request">Share a testimonial</FooterLink>
            {showSecurity && <FooterLink href="/security">Report a security issue</FooterLink>}
          </ul>
        </div>
      </div>

      <div className="flex flex-col gap-3 border-t border-white/10 py-6 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} DevMarvibe. All rights reserved.</p>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          <SiteVersion className="text-slate-500" />
          <BackToTop className="text-slate-300 transition hover:text-white" />
        </div>
      </div>
    </div>
  </footer>;
}
