'use client';

import { ChangeEvent, FormEvent, useMemo, useState } from 'react';
import Link from 'next/link';
import { AlertTriangle, ArrowLeft, Check, Upload, Quote, Linkedin } from 'lucide-react';
import { services } from '@/data/services';
import { products } from '@/data/products';
import { submitTestimonial } from '@/lib/api/testimonials';
import { SiteStatusScreen } from '@/components/site-status-screen';
import { useBackendStatus } from '@/hooks/use-backend-status';
import { BACKEND_ORIGIN } from '@/lib/api/client';

const subjectOptions = ['Service', 'Product', 'Overall Company Experience'];
const subjectTypeMap: Record<string, string> = { 'Service': 'service', 'Product': 'product', 'Overall Company Experience': 'company' };
const relationships = ['Client', 'Partner', 'Collaborator'];
const authorTypes = ['Client', 'Employee', 'Partner'];

export default function TestimonialRequestPage() {
  const backendStatus = useBackendStatus();
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(false);
  const [subjectType, setSubjectType] = useState('Service');
  const [avatar, setAvatar] = useState<string | null>(null);
  const options = useMemo(() => subjectType === 'Service' ? services.map((service) => service.title) : subjectType === 'Product' ? products.map((product) => product.name) : ['DevMarvibe'], [subjectType]);

  const handleAvatar = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) setAvatar(URL.createObjectURL(file));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const specificItem = String(formData.get('specificItem') ?? '');
    const message = String(formData.get('message') ?? '');
    setSubmitting(true);
    setError(false);
    try {
      await submitTestimonial({
        testimonialType: 'testimonial',
        authorName: String(formData.get('authorName') ?? ''),
        authorType: String(formData.get('authorType') ?? '').toLowerCase(),
        subjectType: subjectTypeMap[subjectType] ?? 'company',
        content: specificItem ? `Regarding ${specificItem}: ${message}` : message,
        headline: String(formData.get('headline') ?? '') || undefined,
        relationshipType: String(formData.get('relationshipType') ?? '').toLowerCase() || undefined,
        relationshipNote: String(formData.get('relationshipNote') ?? '') || undefined,
        authorLinkedInUrl: String(formData.get('authorLinkedInUrl') ?? '') || undefined,
        consentToPublish: true,
      });
      setSubmitted(true);
    } catch {
      setError(true);
    } finally {
      setSubmitting(false);
    }
  };

  if (backendStatus === 'blocked') {
    return <SiteStatusScreen
      icon={AlertTriangle}
      eyebrow="Connection issue"
      title="We couldn't reach our services."
      message={`This is often caused by a firewall or restricted network blocking ${BACKEND_ORIGIN.replace('https://', '')}. Try a different network or contact your IT team.`}
      action={<button onClick={() => window.location.reload()} className="button-primary">Try again</button>}
    />;
  }

  return <main className="min-h-screen bg-surface text-ink"><header className="border-b border-slate-200 bg-white"><div className="site-shell flex h-20 items-center justify-between"><Link href="/" className="text-sm font-bold text-teal-700"><ArrowLeft size={16} className="mr-2 inline" /> Back to DevMarvibe</Link><Link href="/"><img src="/Main_Logo.png" alt="DevMarVibe" className="h-14 w-auto object-contain" /></Link></div></header><div className="site-shell py-14 sm:py-20"><div className="mx-auto max-w-3xl"><div className="mb-10 max-w-2xl"><p className="eyebrow">Your experience matters</p><h1 className="mt-4 text-4xl font-semibold tracking-tight text-ink sm:text-5xl">Share your DevMarvibe story.</h1><p className="mt-5 text-lg leading-8 text-slate-500">Your perspective helps future partners understand what it feels like to build with us. This form is for review only and does not publish anything automatically.</p></div>{submitted ? <div className="rounded-[28px] border border-teal-200 bg-white p-10 text-center shadow-xl shadow-slate-900/5"><div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-teal-100 text-teal-700"><Check size={30} /></div><h2 className="mt-6 text-2xl font-semibold">Thank you for sharing.</h2><p className="mx-auto mt-3 max-w-md leading-7 text-slate-500">Your testimonial has been received for review. We appreciate you taking the time to help tell the DevMarvibe story.</p><Link href="/" className="button-primary mt-8">Return home <ArrowLeft size={16} /></Link></div> : <form onSubmit={handleSubmit} className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-xl shadow-slate-900/5 sm:p-10"><div className="mb-9 flex items-center gap-4 rounded-2xl bg-ink p-5 text-white"><div className="rounded-xl bg-teal-400/15 p-3 text-teal-300"><Quote size={21} /></div><p className="text-sm leading-6 text-slate-300">A few honest words can help the right people find their next great partner.</p></div><div className="grid gap-5 sm:grid-cols-2"><label className="field-label">Author type *<select required name="authorType" className="field-input"><option value="">Select one</option>{authorTypes.map((option) => <option key={option}>{option}</option>)}</select></label><label className="field-label">Full name *<input required name="authorName" className="field-input" placeholder="Your full name" /></label><label className="field-label">Email address *<input required type="email" name="email" className="field-input" placeholder="you@company.com" /></label><label className="field-label">Job title<input name="jobTitle" className="field-input" placeholder="Your role" /></label><label className="field-label">Company name<input name="companyName" className="field-input" placeholder="Company name" /></label><label className="field-label">LinkedIn profile URL<input type="url" name="authorLinkedInUrl" className="field-input" placeholder="https://linkedin.com/in/..." /></label></div><div className="mt-5"><label className="field-label">Photo / avatar <span className="font-normal text-slate-400">(optional)</span><div className="mt-2 flex items-center gap-4"><label className="flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-slate-300 px-4 py-3 text-sm font-semibold text-slate-600 hover:border-teal-400"><Upload size={16} /> Choose image<input type="file" accept="image/*" onChange={handleAvatar} className="sr-only" /></label>{avatar && <img src={avatar} alt="Selected avatar preview" className="h-12 w-12 rounded-full object-cover" />}</div></label></div><div className="mt-8 border-t border-slate-200 pt-8"><h2 className="text-lg font-semibold">A little context</h2><div className="mt-5 grid gap-5 sm:grid-cols-2"><label className="field-label">Relationship to DevMarvibe<select name="relationshipType" className="field-input"><option value="">Select one</option>{relationships.map((option) => <option key={option}>{option}</option>)}</select></label><label className="field-label">What is this about? *<select required value={subjectType} onChange={(event) => setSubjectType(event.target.value)} className="field-input">{subjectOptions.map((option) => <option key={option}>{option}</option>)}</select></label></div><label className="field-label mt-5">Relationship note<textarea name="relationshipNote" rows={3} className="field-input resize-none" placeholder="Anything else we should know?" /></label><label className="field-label mt-5">Specific service / product *<select required name="specificItem" className="field-input">{options.map((option) => <option key={option}>{option}</option>)}</select></label></div><div className="mt-8 border-t border-slate-200 pt-8"><label className="field-label">Headline<input maxLength={90} name="headline" className="field-input" placeholder="A short summary of your experience" /></label><label className="field-label mt-5">Testimonial message *<textarea required maxLength={500} rows={6} name="message" className="field-input resize-none" placeholder="Tell us what stood out..." /></label><label className="mt-5 flex items-start gap-3 text-sm leading-6 text-slate-600"><input required type="checkbox" className="mt-1 h-4 w-4 accent-teal-600" />I give DevMarvibe permission to publish this testimonial on their website.</label></div>{error && <p className="mt-5 text-sm font-medium text-red-600">Something went wrong submitting your testimonial. Please try again.</p>}<button className="button-primary mt-8 w-full sm:w-auto" type="submit" disabled={submitting}>{submitting ? 'Submitting…' : <>Submit testimonial <Check size={17} /></>}</button></form>}</div></div><footer className="border-t border-slate-200 bg-white py-6"><div className="site-shell flex flex-col gap-3 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between"><p>© {new Date().getFullYear()} DevMarvibe. All rights reserved.</p><a href="#" className="inline-flex items-center gap-2"><Linkedin size={14} /> Connect with us</a></div></footer></main>;
}
