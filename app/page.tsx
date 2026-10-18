'use client';

import { FormEvent, memo, useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { AlertTriangle, ArrowRight, Calculator, Check, ChevronRight, Clock3, Code2, ExternalLink, Facebook, FileText, Globe2, Linkedin, Mail, Menu, Instagram, PenTool, Phone, Quote, Search, Server, Share2, Smartphone, Sparkles, Target, Twitter, X, Github, Youtube, type LucideIcon } from 'lucide-react';
import { services as fallbackServices } from '@/data/services';
import { useTrackVisit } from '@/hooks/use-track-visit';
import { useTrackSectionVisits } from '@/hooks/use-track-section-visits';
import { getServices, type ApiService } from '@/lib/api/services';
import { getProducts, type ApiProduct } from '@/lib/api/products';
import { getPublishedTestimonials, type ApiTestimonial } from '@/lib/api/testimonials';
import { submitContactForm } from '@/lib/api/contact';
import { getTenantConfig, isFeatureOn, type TenantConfig } from '@/lib/api/tenant-config';
import { getProjects, type ApiProject } from '@/lib/api/projects';
import { getCaseStudies, type ApiCaseStudy } from '@/lib/api/case-studies';
import { getClients, type ApiClient } from '@/lib/api/clients';
import { getPageBanners, type ApiBannerSlide } from '@/lib/api/page-banners';
import { getJourneys, type ApiJourney } from '@/lib/api/journeys';
import { SiteStatusScreen } from '@/components/site-status-screen';
import { SiteVersion } from '@/components/site-version';
import { BrandLogo } from '@/components/brand-logo';
import { ConsoleImage } from '@/components/console-image';
import { useBackendStatus } from '@/hooks/use-backend-status';
import { BACKEND_ORIGIN } from '@/lib/api/client';

// Below-the-fold sections and the contact form's country picker load as separate chunks,
// so the hero renders without waiting for them.
const loadHomeSections = () => import('@/components/home-sections');
const BannerCarousel = dynamic(() => loadHomeSections().then((m) => m.BannerCarousel));
const WorkSection = dynamic(() => loadHomeSections().then((m) => m.WorkSection));
const ClientsSection = dynamic(() => loadHomeSections().then((m) => m.ClientsSection));
const JourneySection = dynamic(() => loadHomeSections().then((m) => m.JourneySection));
const PhoneInput = dynamic(() => import('@/components/phone-input').then((m) => m.PhoneInput), {
  loading: () => <div className="field-input h-[46px]" aria-hidden="true" />,
});

const SERVICE_ICONS: Record<string, LucideIcon> = {
  'Web & Mobile Development': Smartphone,
  'Backend Development': Server,
  'Branding & Design': PenTool,
  'Content Writing': FileText,
  'Social Media Marketing': Share2,
  'Paid Campaigns': Target,
  'SEO': Search,
  'Accounting & Tax Solutions': Calculator,
};
const FEATURED_SERVICES = new Set(['Web & Mobile Development', 'Backend Development']);
const PRODUCT_TONES = ['blue', 'teal', 'ink'] as const;
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
const DEFAULT_SOCIAL_LINKS = [
  { platform: 'instagram', url: 'https://www.instagram.com/devmarvibe' },
];

type DisplayService = { key: string; title: string; description: string; icon: LucideIcon; featured: boolean };

function toDisplayService(service: ApiService): DisplayService {
  return { key: service.id, title: service.title, description: service.description, icon: SERVICE_ICONS[service.title] ?? Sparkles, featured: FEATURED_SERVICES.has(service.title) };
}

const SectionHeading = memo(function SectionHeading({ eyebrow, title, copy, align = 'left' }: { eyebrow: string; title: string; copy?: string; align?: 'left' | 'center' }) {
  return <div data-reveal className={align === 'center' ? 'mx-auto max-w-2xl text-center' : 'mx-auto max-w-2xl text-center lg:mx-0 lg:text-left'}><p className="eyebrow">{eyebrow}</p><h2 className="mt-4 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">{title}</h2>{copy && <p className="mt-5 text-lg leading-8 text-slate-500">{copy}</p>}</div>;
});

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [sent, setSent] = useState(false);
  const [contactError, setContactError] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [services, setServices] = useState<DisplayService[]>(() => fallbackServices.map((service) => ({ key: service.title, title: service.title, description: service.description, icon: service.icon, featured: !!service.featured })));
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [testimonials, setTestimonials] = useState<ApiTestimonial[]>([]);
  const [tenantConfig, setTenantConfig] = useState<TenantConfig | null>(null);
  const [projects, setProjects] = useState<ApiProject[]>([]);
  const [caseStudies, setCaseStudies] = useState<ApiCaseStudy[]>([]);
  const [clients, setClients] = useState<ApiClient[]>([]);
  const [bannerSlides, setBannerSlides] = useState<ApiBannerSlide[]>([]);
  const [journeys, setJourneys] = useState<ApiJourney[]>([]);

  useEffect(() => {
    getServices().then((items) => setServices(items.map(toDisplayService))).catch(() => {});
    getProducts().then(setProducts).catch(() => {});
    getPublishedTestimonials().then(setTestimonials).catch(() => {});
    getTenantConfig().then(setTenantConfig).catch(() => {});
    getProjects().then(setProjects).catch(() => {});
    getCaseStudies().then(setCaseStudies).catch(() => {});
    getClients().then(setClients).catch(() => {});
    getPageBanners('Home').then(setBannerSlides).catch(() => {});
    getJourneys().then(setJourneys).catch(() => {});
  }, []);

  // A module switched off in the console hides its section even if it still has content.
  // Memoized so typing in the contact form or opening the menu doesn't hand the sections new arrays.
  const show = useCallback((feature: Parameters<typeof isFeatureOn>[1]) => isFeatureOn(tenantConfig, feature), [tenantConfig]);
  const visible = useMemo(() => ({
    products: show('products') ? products : [],
    testimonials: show('testimonials') ? testimonials : [],
    projects: show('projects') ? projects : [],
    caseStudies: show('caseStudies') ? caseStudies : [],
    clients: show('clients') ? clients : [],
    slides: show('pageBanners') ? bannerSlides : [],
    journeys: show('experience') ? journeys : [],
  }), [show, products, testimonials, projects, caseStudies, clients, bannerSlides, journeys]);
  const { products: visibleProducts, testimonials: visibleTestimonials, projects: visibleProjects, caseStudies: visibleCaseStudies, clients: visibleClients, slides: visibleSlides, journeys: visibleJourneys } = visible;
  const hasWork = visibleProjects.length > 0 || visibleCaseStudies.length > 0;

  const navItems = useMemo(() => [
    ['About Us', '#about'],
    ['Services', '#services'],
    ...(visibleProducts.length > 0 ? [['Products', '#products']] : []),
    ...(hasWork ? [['Our Work', '#work']] : []),
    ['Contact', '#contact'],
  ], [visibleProducts.length, hasWork]);

  const trackedSections = useMemo(() => [
    'about', 'services', 'contact',
    ...(visibleProducts.length > 0 ? ['products'] : []),
    ...(hasWork ? ['work'] : []),
    ...(visibleClients.length > 0 ? ['clients'] : []),
    ...(visibleJourneys.length > 0 ? ['journey'] : []),
  ], [visibleProducts.length, hasWork, visibleClients.length, visibleJourneys.length]);

  useTrackVisit('home');
  useTrackSectionVisits(trackedSections);

  const supportEmail = tenantConfig?.settings.supportEmail || 'hello@devmarvibe.com';
  const socialLinks = tenantConfig?.settings.socialLinks?.length ? tenantConfig.settings.socialLinks : DEFAULT_SOCIAL_LINKS;
  const maintenanceMode = tenantConfig?.applicationConfig?.maintenanceMode ?? false;
  const backendStatus = useBackendStatus();

  const handleContactSubmit = useCallback(async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    setSubmitting(true);
    setContactError(false);
    try {
      const field = (name: string) => String(formData.get(name) ?? '').trim() || undefined;
      await submitContactForm({
        name: String(formData.get('name') ?? '').trim(),
        email: field('email'),
        mobile: field('phone'),
        services: field('project'),
        description: field('message'),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      });
      setSent(true);
      form.reset();
    } catch {
      setContactError(true);
    } finally {
      setSubmitting(false);
    }
  }, []);

  if (maintenanceMode) {
    return <SiteStatusScreen icon={Clock3} eyebrow="Scheduled maintenance" title="We'll be right back." message="DevMarvibe is undergoing scheduled maintenance. Please check back shortly." />;
  }

  if (backendStatus === 'blocked') {
    return <SiteStatusScreen
      icon={AlertTriangle}
      eyebrow="Connection issue"
      title="We couldn't reach our services."
      message={`This is often caused by a firewall or restricted network blocking ${BACKEND_ORIGIN.replace('https://', '')}. Try a different network or contact your IT team.`}
      action={<button onClick={() => window.location.reload()} className="button-primary">Try again</button>}
    />;
  }

  return <main className="overflow-hidden bg-white text-ink">
    <header className="absolute inset-x-0 top-0 z-30"><div className="site-shell flex h-20 items-center justify-between"><Link href="/" aria-label="DevMarvibe home"><BrandLogo priority /></Link><nav className="hidden items-center gap-8 lg:flex">{navItems.map(([label, href]) => <a key={label} href={href} className="nav-link">{label}</a>)}<Link href="#contact" className="button-primary !px-5 !py-3">Get a Quote <ArrowRight size={16} /></Link></nav><button className="rounded-lg p-2 text-ink lg:hidden" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">{menuOpen ? <X /> : <Menu />}</button></div>{menuOpen && <div className="mx-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-xl lg:hidden">{navItems.map(([label, href]) => <a onClick={() => setMenuOpen(false)} key={label} href={href} className="block rounded-lg px-4 py-3 font-medium text-slate-600">{label}</a>)}<a onClick={() => setMenuOpen(false)} href="#contact" className="button-primary mt-2 w-full">Get a Quote <ArrowRight size={16} /></a></div>}</header>

    <section className="hero-grid relative"><div className="site-shell relative z-10 grid min-h-[720px] items-center gap-14 pb-20 pt-36 lg:grid-cols-[1.05fr_.95fr] lg:pb-28 lg:pt-40"><div className="hero-enter text-center lg:text-left"><div className="mb-7 inline-flex items-center gap-2 rounded-full border border-teal-200 bg-white/75 px-3 py-2 text-xs font-bold uppercase tracking-[.16em] text-teal-700 shadow-sm"><span className="h-2 w-2 rounded-full bg-teal-500" /> Digital products, engineered for growth</div><h1 className="mx-auto max-w-3xl text-5xl font-semibold leading-[1.08] tracking-[-.04em] text-ink sm:text-6xl lg:mx-0 lg:text-[72px]">We build apps that <span className="text-gradient">move business forward.</span></h1><p className="mx-auto mt-7 max-w-xl text-lg leading-8 text-slate-600 lg:mx-0">DevMarvibe is your full-service digital partner for ambitious ideas. From a first wireframe to a scalable product, we bring strategy, design, and engineering together.</p><div className="mt-9 flex flex-wrap justify-center gap-4 lg:justify-start"><a href="#contact" className="button-primary">Start your project <ArrowRight size={18} /></a><a href="#services" className="button-secondary">Explore services <ChevronRight size={18} /></a></div><div className="mt-12 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 border-t sm:gap-x-8 border-slate-200/80 pt-5 text-sm text-slate-500 lg:justify-start"><span className="flex items-center gap-2"><Check size={16} className="text-teal-600" /> Strategy to launch</span><span className="flex items-center gap-2"><Check size={16} className="text-teal-600" /> Built to scale</span></div></div><div className="relative"><div className="hero-orbit absolute -right-20 -top-16 h-[500px] w-[500px] rounded-full border border-teal-200/70" /><div className="hero-orbit absolute -bottom-14 -left-14 h-72 w-72 rounded-full border border-blue-200/70" /><div className="hero-card-enter relative mx-auto max-w-md"><div className="overflow-hidden rounded-[28px] border border-white/80 bg-white/70 p-3 shadow-2xl shadow-blue-900/10 backdrop-blur"><div className="rounded-[20px] bg-ink p-6 text-white"><div className="flex items-center justify-between"><div><p className="text-xs uppercase tracking-[.18em] text-slate-400">Product pulse</p><p className="mt-2 text-2xl font-semibold">Growth dashboard</p></div><div className="rounded-xl bg-teal-400/15 p-3 text-teal-300"><Sparkles size={22} /></div></div><div className="mt-8 rounded-2xl bg-white/10 p-4"><div className="flex items-end justify-between"><div><p className="text-xs text-slate-400">Monthly active users</p><p className="mt-1 text-3xl font-semibold">24,680</p></div><span className="rounded-full bg-teal-400/15 px-2 py-1 text-xs font-semibold text-teal-300">+18.4%</span></div><div className="mt-6 flex h-24 items-end gap-2">{[28,42,35,54,48,68,62,82,74,96].map((h, i) => <div key={i} className="flex-1 rounded-t-md bg-gradient-to-t from-blue-400 to-teal-300 opacity-80" style={{ height: `${h}%` }} />)}</div></div><div className="mt-4 grid grid-cols-2 gap-3"><div className="rounded-2xl bg-white/10 p-4"><p className="text-xs text-slate-400">Conversion</p><p className="mt-2 text-xl font-semibold">8.26%</p></div><div className="rounded-2xl bg-white/10 p-4"><p className="text-xs text-slate-400">Avg. session</p><p className="mt-2 text-xl font-semibold">04:32</p></div></div></div></div><div className="absolute -bottom-7 -left-7 flex items-center gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-xl"><div className="rounded-xl bg-teal-50 p-3 text-teal-600"><Code2 size={19} /></div><div><p className="text-xs text-slate-400">Built with purpose</p><p className="font-semibold text-ink">Clean. Fast. Human.</p></div></div></div></div></div></section>

    <BannerCarousel slides={visibleSlides} />

    <section id="about" className="site-shell section-pad"><div className="grid gap-14 lg:grid-cols-[.9fr_1.1fr] lg:items-end"><SectionHeading eyebrow="Why DevMarvibe" title="The right team for your next chapter." copy="We help businesses turn opportunity into useful, durable digital products. Our team blends product thinking with engineering discipline, so every release creates momentum." /><div className="grid grid-cols-2 gap-8 border-t border-slate-200 pt-7 sm:grid-cols-4"><div><p className="stat-number">8+</p><p className="stat-label">Years building</p></div><div><p className="stat-number">120+</p><p className="stat-label">Projects shipped</p></div><div><p className="stat-number">42</p><p className="stat-label">Teams supported</p></div><div><p className="stat-number">14</p><p className="stat-label">Specialists</p></div></div></div></section>

    <section id="services" className="bg-surface section-pad"><div className="site-shell"><SectionHeading eyebrow="What we do" title="Capabilities that connect the dots." copy="Whether you need a new app, a stronger brand, or a smarter growth engine, we bring the right expertise around the table." /><div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{services.map((service) => { const Icon = service.icon; return <article key={service.key} className={`service-card ${service.featured ? 'service-featured' : ''}`}><div className="mb-7 flex items-start justify-between"><div className="icon-box"><Icon size={22} /></div>{service.featured && <span className="badge">Core capability</span>}</div><h3 className="text-lg font-semibold text-ink">{service.title}</h3><p className="mt-3 text-sm leading-6 text-slate-500">{service.description}</p><a href="#contact" className="tap-target mt-4 gap-2 text-sm font-bold text-teal-700 transition-all hover:gap-3">Talk to us <ArrowRight size={15} /></a></article> })}</div></div></section>

    {visibleProducts.length > 0 && <section id="products" className="site-shell section-pad"><SectionHeading eyebrow="DevMarvibe products" title="A faster path from idea to impact." copy="Beyond custom development, we offer productized app solutions built to launch fast and scale with your business." /><div className="mt-14 grid gap-5 lg:grid-cols-3">{visibleProducts.map((product, index) => <article key={product.id} className={`product-card product-${PRODUCT_TONES[index % PRODUCT_TONES.length]}`}><div className="flex items-center justify-between"><span className="mono-label">0{index + 1} / PRODUCT</span><div className="product-icon">{index % 3 === 0 ? <Code2 size={20} /> : index % 3 === 1 ? <Globe2 size={20} /> : <Sparkles size={20} />}</div></div><h3 className="mt-14 text-2xl font-semibold text-ink">{product.productName}</h3><p className="mt-2 text-slate-500">{product.tagline}</p><p className="mt-8 text-sm leading-6 text-slate-600">{product.description}</p><a href={product.productUrl} target="_blank" rel="noopener noreferrer" className="tap-target mt-7 gap-2 font-bold text-teal-700">Visit product <ExternalLink size={16} /></a></article>)}</div></section>}

    <WorkSection caseStudies={visibleCaseStudies} projects={visibleProjects} />

    <ClientsSection clients={visibleClients} />

    {visibleTestimonials.length > 0 && <section className="bg-ink section-pad"><div className="site-shell"><SectionHeading eyebrow="Client stories" title="Good work speaks for itself." copy="A few words from the people building what is next." /><div className="mt-14 grid gap-5 lg:grid-cols-3">{visibleTestimonials.map((testimonial, index) => <article key={testimonial.id ?? index} className="testimonial-card"><Quote size={30} className="text-teal-300" />{testimonial.headline && <p className="mt-7 font-semibold text-teal-200">{testimonial.headline}</p>}<p className={`${testimonial.headline ? 'mt-3' : 'mt-7'} text-lg leading-8 text-white`}>“{testimonial.content}”</p><div className="mt-9 border-t border-white/10 pt-5"><div className="flex items-center gap-4"><ConsoleImage src={testimonial.authorAvatarUrl} alt="" width={48} height={48} className="h-12 w-12 rounded-full object-cover" /><div><p className="font-semibold text-white">{testimonial.authorName}</p>{(testimonial.authorTitle || testimonial.authorCompany) && <p className="mt-1 text-sm text-slate-400">{[testimonial.authorTitle, testimonial.authorCompany].filter(Boolean).join(', ')}</p>}</div></div></div></article>)}</div></div></section>}

    <JourneySection entries={visibleJourneys} />

    <section id="contact" className="contact-section section-pad"><div className="site-shell grid gap-14 lg:grid-cols-[.8fr_1.2fr] lg:items-start"><div className="text-center lg:text-left"><SectionHeading eyebrow="Start a conversation" title="Have a bold idea? Let’s make it real." copy="Tell us where you want to go. We’ll bring the roadmap, the right people, and a clear next step." /><div className="mt-8 flex flex-col items-center gap-1 text-sm text-slate-600 lg:items-start"><a href={`mailto:${supportEmail}`} className="tap-target gap-3 transition hover:text-teal-700"><Mail size={17} className="text-teal-600" aria-hidden="true" /> {supportEmail}</a><a href="tel:+919959925779" className="tap-target gap-3 transition hover:text-teal-700"><Phone size={17} className="text-teal-600" aria-hidden="true" /> +91 99599 25779</a></div><div className="mt-10 inline-flex items-center gap-3 rounded-2xl border border-teal-100 bg-teal-50 px-4 py-3 text-sm font-semibold text-teal-800"><Clock3 size={18} /> Currently accepting new app projects</div></div><form className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-xl shadow-slate-900/5 sm:p-8" onSubmit={handleContactSubmit}><div className="grid gap-5 sm:grid-cols-2"><label className="field-label">Your name<input required name="name" placeholder="Aarav Mehta" className="field-input" /></label><label className="field-label">Work email<input required type="email" name="email" placeholder="you@company.com" className="field-input" /></label><label className="field-label">Phone number<PhoneInput name="phone" placeholder="99599 25779" /></label><label className="field-label">Project type<select name="project" className="field-input">{services.map((service) => <option key={service.key}>{service.title}</option>)}</select></label></div><label className="field-label mt-5">Tell us about your project<textarea required name="message" rows={5} placeholder="What are you hoping to build?" className="field-input resize-none" /></label><button className="button-primary mt-6 w-full sm:w-auto" type="submit" disabled={submitting}>{sent ? <>Message received <Check size={18} /></> : submitting ? 'Sending…' : <>Send message <ArrowRight size={18} /></>}</button>{sent && <p className="mt-4 text-sm font-medium text-teal-700">Thanks — our team will be in touch shortly.</p>}{contactError && <p className="mt-4 text-sm font-medium text-red-600">Something went wrong sending your message. Please try again or email us directly.</p>}</form></div></section>

    <footer className="bg-ink text-white"><div className="site-shell grid gap-12 py-14 lg:grid-cols-[1.2fr_1fr_1fr] lg:py-20"><div><BrandLogo light /><p className="mt-5 max-w-xs text-sm leading-6 text-slate-400">Digital products and growth systems for teams ready to move with purpose.</p><div className="mt-7 flex gap-3">{socialLinks.map((link) => { const Icon = SOCIAL_ICONS[link.platform.toLowerCase()] ?? Globe2; return <a key={link.platform} className="social-link" href={link.url} target={link.url.startsWith('#') ? undefined : '_blank'} rel={link.url.startsWith('#') ? undefined : 'noopener noreferrer'} aria-label={link.platform}><Icon size={17} /></a>; })}</div></div><div><p className="footer-heading">Explore</p><div className="mt-3 grid text-sm text-slate-400">{navItems.map(([label, href]) => <a key={label} href={href} className="tap-target transition hover:text-white">{label}</a>)}<Link href="/testimonials/request" className="tap-target transition hover:text-white">Share a testimonial</Link>{show('vulnerabilityReports') && <Link href="/security" className="tap-target transition hover:text-white">Report a security issue</Link>}</div></div><div><p className="footer-heading">Let’s talk</p><div className="mt-3 grid text-sm text-slate-400"><a href={`mailto:${supportEmail}`} className="tap-target transition hover:text-white">{supportEmail}</a><a href="tel:+919959925779" className="tap-target transition hover:text-white">+91 99599 25779</a></div></div></div><div className="site-shell flex flex-col gap-3 border-t border-white/10 py-6 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between"><p>© {new Date().getFullYear()} DevMarvibe. All rights reserved.</p><SiteVersion /></div></footer>
  </main>;
}
