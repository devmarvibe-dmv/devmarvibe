'use client';

import { memo, useEffect, useState, type ReactNode } from 'react';
import { ArrowRight, Briefcase, ChevronLeft, ChevronRight, ExternalLink, GraduationCap, MapPin } from 'lucide-react';
import { resolveFileUrl } from '@/lib/api/client';
import { ConsoleImage } from '@/components/console-image';
import type { ApiBannerSlide } from '@/lib/api/page-banners';
import type { ApiClient } from '@/lib/api/clients';
import type { ApiCaseStudy } from '@/lib/api/case-studies';
import type { ApiProject } from '@/lib/api/projects';
import type { ApiJourney } from '@/lib/api/journeys';

const SLIDE_INTERVAL_MS = 6000;
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function formatMonth(value: string | null | undefined): string {
  const match = value?.match(/^(\d{4})-(\d{2})/);
  if (!match) return value ?? '';
  return `${MONTHS[Number(match[2]) - 1] ?? ''} ${match[1]}`.trim();
}

function isExternal(url: string) {
  return /^https?:\/\//i.test(url);
}

function SectionHeading({ eyebrow, title, copy, light = false }: { eyebrow: string; title: string; copy?: string; light?: boolean }) {
  return <div data-reveal className="mx-auto max-w-2xl text-center lg:mx-0 lg:text-left"><p className="eyebrow">{eyebrow}</p><h2 className={`mt-4 text-3xl font-semibold tracking-tight sm:text-4xl ${light ? 'text-white' : 'text-ink'}`}>{title}</h2>{copy && <p className={`mt-5 text-lg leading-8 ${light ? 'text-slate-300' : 'text-slate-500'}`}>{copy}</p>}</div>;
}

function SlideLink({ url, children }: { url?: string; children: ReactNode }) {
  if (!url) return <>{children}</>;
  return isExternal(url)
    ? <a href={url} target="_blank" rel="noopener noreferrer" className="button-primary mt-6">{children}</a>
    : <a href={url} className="button-primary mt-6">{children}</a>;
}

/** Home page carousel from Page Banners. Pauses while hovered or focused so slides don't move under the reader. */
export const BannerCarousel = memo(function BannerCarousel({ slides }: { slides: ApiBannerSlide[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = slides.length;

  useEffect(() => {
    if (count < 2 || paused) return;
    const timer = window.setInterval(() => setIndex((current) => (current + 1) % count), SLIDE_INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [count, paused]);

  useEffect(() => {
    if (index >= count) setIndex(0);
  }, [count, index]);

  if (count === 0) return null;
  const slide = slides[Math.min(index, count - 1)];
  const go = (step: number) => setIndex((current) => (current + step + count) % count);

  return <section aria-roledescription="carousel" aria-label="Highlights" className="site-shell pb-4" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocus={() => setPaused(true)} onBlur={() => setPaused(false)}>
    <div className="relative overflow-hidden rounded-[28px] bg-ink shadow-2xl shadow-blue-900/10">
      <ConsoleImage key={slide.image.src} src={slide.image.src} alt={slide.image.alt} width={slide.image.width || 1920} height={slide.image.height || 720} sizes="(min-width: 1280px) 1200px, 100vw" priority={index === 0} className="h-[280px] w-full object-cover sm:h-[360px] lg:h-[420px]" />
      {(slide.title || slide.subtitle) && <div className="absolute inset-0 flex items-end bg-gradient-to-t from-ink/85 via-ink/30 to-transparent">
        <div className="max-w-2xl p-6 text-white sm:p-10" aria-live="polite">
          {slide.title && <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">{slide.title}</h2>}
          {slide.subtitle && <p className="mt-3 text-lg text-slate-200">{slide.subtitle}</p>}
          <SlideLink url={slide.linkUrl}>Learn more <ArrowRight size={16} /></SlideLink>
        </div>
      </div>}
      {count > 1 && <>
        <button type="button" onClick={() => go(-1)} aria-label="Previous slide" className="absolute left-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-ink shadow-lg transition hover:bg-white"><ChevronLeft size={20} /></button>
        <button type="button" onClick={() => go(1)} aria-label="Next slide" className="absolute right-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-ink shadow-lg transition hover:bg-white"><ChevronRight size={20} /></button>
      </>}
    </div>
    {count > 1 && <div className="mt-4 flex justify-center gap-2">{slides.map((item, i) => <button key={`${item.image.src}-${i}`} type="button" onClick={() => setIndex(i)} aria-label={`Show slide ${i + 1} of ${count}`} aria-current={i === index} className="flex h-11 w-11 items-center justify-center"><span className={`block h-2 rounded-full transition-all ${i === index ? 'w-8 bg-teal-600' : 'w-2 bg-slate-300'}`} /></button>)}</div>}
  </section>;
});

/** "Our clients" logo wall — only clients marked Show on website. */
export const ClientsSection = memo(function ClientsSection({ clients }: { clients: ApiClient[] }) {
  if (clients.length === 0) return null;
  return <section id="clients" className="site-shell section-pad">
    <SectionHeading eyebrow="Our clients" title="Trusted by teams who ship." />
    <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">{clients.map((client) => {
      const card = <div data-reveal className="flex h-full flex-col items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white p-6 text-center transition hover:border-teal-300 hover:shadow-lg">
        {resolveFileUrl(client.logoUrl) ? <ConsoleImage src={client.logoUrl} alt={client.name} width={160} height={48} className="h-12 w-auto max-w-full object-contain" /> : <span className="text-lg font-semibold text-ink">{client.name}</span>}
        {client.industry && <span className="text-xs font-medium uppercase tracking-[.12em] text-slate-500">{client.industry}</span>}
      </div>;
      return client.websiteUrl
        ? <a key={client.id} href={client.websiteUrl} target="_blank" rel="noopener noreferrer" aria-label={`${client.name} website`}>{card}</a>
        : <div key={client.id}>{card}</div>;
    })}</div>
  </section>;
});

function CaseStudyCard({ study }: { study: ApiCaseStudy }) {
  const details = [['The challenge', study.challenge], ['What we did', study.solution], ['The results', study.results]].filter(([, text]) => text && text !== '…');
  return <article data-reveal className="flex flex-col overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-sm">
    <ConsoleImage src={study.coverImageUrl} alt="" width={640} height={384} sizes="(min-width: 1024px) 400px, (min-width: 768px) 50vw, 100vw" className="h-48 w-full object-cover" />
    <div className="flex flex-1 flex-col p-7">
      <p className="mono-label">{[study.clientName, study.industry].filter(Boolean).join(' · ')}</p>
      <h3 className="mt-3 text-xl font-semibold text-ink">{study.title}</h3>
      {study.summary && <p className="mt-3 text-sm leading-6 text-slate-600">{study.summary}</p>}
      {study.tags.length > 0 && <ul className="mt-5 flex flex-wrap gap-2">{study.tags.map((tag) => <li key={tag} className="rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-800">{tag}</li>)}</ul>}
      {details.length > 0 && <details className="group mt-6 border-t border-slate-200 pt-4">
        <summary className="tap-target cursor-pointer list-none gap-1 text-sm font-bold text-teal-700">Read the story <ChevronRight size={15} className="inline transition group-open:rotate-90" /></summary>
        <dl className="mt-4 space-y-4">{details.map(([label, text]) => <div key={label}><dt className="text-xs font-bold uppercase tracking-[.12em] text-slate-500">{label}</dt><dd className="mt-1 text-sm leading-6 text-slate-600">{text}</dd></div>)}</dl>
      </details>}
      {study.caseStudyUrl && <a href={study.caseStudyUrl} target="_blank" rel="noopener noreferrer" className="tap-target mt-4 gap-2 text-sm font-bold text-teal-700">Full case study <ExternalLink size={15} /></a>}
    </div>
  </article>;
}

function ProjectCard({ project }: { project: ApiProject }) {
  return <article data-reveal className="flex flex-col rounded-[24px] border border-slate-200 bg-white p-7 shadow-sm">
    {project.organizationName && <p className="mono-label">{project.organizationName}</p>}
    <h3 className="mt-3 text-xl font-semibold text-ink">{project.projectName}</h3>
    {project.tagline && <p className="mt-1 text-slate-500">{project.tagline}</p>}
    {project.description && <p className="mt-4 text-sm leading-6 text-slate-600">{project.description}</p>}
    {project.skills.length > 0 && <ul className="mt-5 flex flex-wrap gap-2">{project.skills.map((skill) => <li key={skill} className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600">{skill}</li>)}</ul>}
    {project.projectUrl && <a href={project.projectUrl} target="_blank" rel="noopener noreferrer" className="tap-target mt-auto gap-2 pt-4 text-sm font-bold text-teal-700">View project <ExternalLink size={15} /></a>}
  </article>;
}

/** Case studies and projects together under "Our work". */
export const WorkSection = memo(function WorkSection({ caseStudies, projects }: { caseStudies: ApiCaseStudy[]; projects: ApiProject[] }) {
  if (caseStudies.length === 0 && projects.length === 0) return null;
  return <section id="work" className="bg-surface section-pad">
    <div className="site-shell">
      <SectionHeading eyebrow="Our work" title="Real products, real results." copy="A look at what we've built with our partners." />
      {caseStudies.length > 0 && <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">{caseStudies.map((study) => <CaseStudyCard key={study.id} study={study} />)}</div>}
      {projects.length > 0 && <>
        {caseStudies.length > 0 && <h3 className="mt-16 text-xl font-semibold text-ink">More projects</h3>}
        <div className={`${caseStudies.length > 0 ? 'mt-6' : 'mt-14'} grid gap-5 md:grid-cols-2 lg:grid-cols-3`}>{projects.map((project) => <ProjectCard key={project.id} project={project} />)}</div>
      </>}
    </div>
  </section>;
});

/** Experience and education timeline from My Journey. */
export const JourneySection = memo(function JourneySection({ entries }: { entries: ApiJourney[] }) {
  if (entries.length === 0) return null;
  return <section id="journey" className="site-shell section-pad">
    <SectionHeading eyebrow="Our journey" title="How we got here." />
    <ol className="mt-12 space-y-5 border-l-2 border-teal-100 pl-6 sm:pl-8">{entries.map((entry) => {
      const Icon = entry.type === 'education' ? GraduationCap : Briefcase;
      const period = `${formatMonth(entry.durationFrom)} – ${entry.current ? 'Present' : formatMonth(entry.durationTo)}`;
      return <li key={entry.id} data-reveal className="relative rounded-2xl border border-slate-200 bg-white p-6">
        <span className="absolute -left-[39px] top-6 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-teal-600 text-white sm:-left-[47px]"><Icon size={15} /></span>
        <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
          <h3 className="text-lg font-semibold text-ink">{entry.role} <span className="font-normal text-slate-500">· {entry.companyName}</span></h3>
          <p className="text-sm font-medium text-slate-500">{period}</p>
        </div>
        {(entry.location || entry.mode) && <p className="mt-1 flex items-center gap-1 text-sm text-slate-500"><MapPin size={14} /> {[entry.location, entry.mode].filter(Boolean).join(' · ')}</p>}
        {entry.description.length > 0 && <ul className="mt-4 list-disc space-y-1 pl-5 text-sm leading-6 text-slate-600">{entry.description.map((line, i) => <li key={i}>{line}</li>)}</ul>}
        {entry.skills.length > 0 && <ul className="mt-4 flex flex-wrap gap-2">{entry.skills.map((skill) => <li key={skill} className="rounded-full bg-surface px-3 py-1 text-xs font-semibold text-slate-600">{skill}</li>)}</ul>}
      </li>;
    })}</ol>
  </section>;
});
