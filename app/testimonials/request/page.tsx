'use client';

import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { AlertTriangle, ArrowLeft, Check, Upload, Quote } from 'lucide-react';
import { services as fallbackServices } from '@/data/services';
import { products as fallbackProducts } from '@/data/products';
import { submitTestimonial } from '@/lib/api/testimonials';
import { getMasterOptions, type MasterSubOption } from '@/lib/api/master-options';
import { getServices } from '@/lib/api/services';
import { getProducts } from '@/lib/api/products';
import { ACCEPTED_IMAGE_TYPES, MAX_IMAGE_BYTES, uploadImage } from '@/lib/api/uploads';
import { SiteStatusScreen } from '@/components/site-status-screen';
import { BrandLogo } from '@/components/brand-logo';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { SiteFooter } from '@/components/site-footer';
import { useBackendStatus } from '@/hooks/use-backend-status';
import { BACKEND_ORIGIN, getApiErrorMessage } from '@/lib/api/client';

const subjectOptions = ['Service', 'Product', 'Overall Company Experience'];
const subjectTypeMap: Record<string, string> = { 'Service': 'service', 'Product': 'product', 'Overall Company Experience': 'company' };
// Used until the console's testimonial dropdown options load (and if they can't).
const FALLBACK_AUTHOR_TYPES: MasterSubOption[] = [
  { key: 'client', value: 'Client' },
  { key: 'partner', value: 'Partner' },
  { key: 'colleague', value: 'Colleague' },
  { key: 'customer', value: 'Customer' },
  { key: 'other', value: 'Other' },
];
const FALLBACK_RELATIONSHIPS: MasterSubOption[] = [
  { key: 'client', value: 'Client' },
  { key: 'partner', value: 'Partner' },
  { key: 'teammate', value: 'Teammate' },
];
const CONTENT_MAX = 500;

type AvatarState =
  | { status: 'none' }
  | { status: 'uploading'; preview: string }
  | { status: 'ready'; preview: string; url: string }
  | { status: 'error'; message: string };

export default function TestimonialRequestPage() {
  const backendStatus = useBackendStatus();
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [subjectType, setSubjectType] = useState('Service');
  const [avatar, setAvatar] = useState<AvatarState>({ status: 'none' });
  const [authorTypes, setAuthorTypes] = useState(FALLBACK_AUTHOR_TYPES);
  const [relationships, setRelationships] = useState(FALLBACK_RELATIONSHIPS);
  const [serviceNames, setServiceNames] = useState(() => fallbackServices.map((service) => service.title));
  const [productNames, setProductNames] = useState(() => fallbackProducts.map((product) => product.name));
  const options = useMemo(() => subjectType === 'Service' ? serviceNames : subjectType === 'Product' ? productNames : ['DevMarvibe'], [subjectType, serviceNames, productNames]);

  useEffect(() => {
    getMasterOptions('testimonials').then((byKey) => {
      if (byKey.authorType?.length) setAuthorTypes(byKey.authorType);
      if (byKey.relationshipType?.length) setRelationships(byKey.relationshipType);
    }).catch(() => {});
    getServices().then((items) => { if (items.length) setServiceNames(items.map((service) => service.title)); }).catch(() => {});
    getProducts().then((items) => { if (items.length) setProductNames(items.map((product) => product.productName)); }).catch(() => {});
  }, []);

  const avatarPreview = avatar.status === 'uploading' || avatar.status === 'ready' ? avatar.preview : null;
  // Free the local preview once it's replaced or the page closes.
  useEffect(() => () => {
    if (avatarPreview) URL.revokeObjectURL(avatarPreview);
  }, [avatarPreview]);

  const handleAvatar = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      setAvatar({ status: 'error', message: 'Please choose a JPG, PNG, WebP, GIF or SVG image.' });
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      setAvatar({ status: 'error', message: 'That image is over 2 MB. Please choose a smaller one.' });
      return;
    }
    const preview = URL.createObjectURL(file);
    setAvatar({ status: 'uploading', preview });
    try {
      const uploaded = await uploadImage(file);
      setAvatar({ status: 'ready', preview, url: uploaded.url });
    } catch (uploadError) {
      setAvatar({ status: 'error', message: getApiErrorMessage(uploadError) ?? 'Your photo could not be uploaded. You can still submit without it.' });
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const field = (name: string) => String(formData.get(name) ?? '').trim() || undefined;
    const subject = subjectTypeMap[subjectType] ?? 'company';
    setSubmitting(true);
    setError(null);
    try {
      await submitTestimonial({
        testimonialType: 'testimonial',
        authorName: String(formData.get('authorName') ?? '').trim(),
        authorType: String(formData.get('authorType') ?? ''),
        authorEmail: field('email'),
        authorTitle: field('jobTitle'),
        authorCompany: field('companyName'),
        authorLinkedInUrl: field('authorLinkedInUrl'),
        authorAvatarUrl: avatar.status === 'ready' ? avatar.url : undefined,
        subjectType: subject,
        subjectLabel: subject === 'company' ? undefined : field('specificItem'),
        content: String(formData.get('message') ?? '').trim().slice(0, CONTENT_MAX),
        headline: field('headline'),
        relationshipType: field('relationshipType'),
        relationshipNote: field('relationshipNote'),
        consentToPublish: true,
      });
      setSubmitted(true);
    } catch (submitError) {
      setError(getApiErrorMessage(submitError) ?? 'Something went wrong submitting your testimonial. Please try again.');
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

  return <><main className="min-h-screen bg-surface text-ink"><header className="border-b border-slate-200 bg-white"><div className="site-shell flex h-20 items-center justify-between"><Link href="/" className="tap-target gap-2 text-sm font-bold text-teal-700"><ArrowLeft size={16} aria-hidden="true" /> <span>Back<span className="hidden sm:inline"> to DevMarvibe</span></span></Link><Link href="/"><BrandLogo height={56} priority /></Link></div></header><div className="site-shell py-14 sm:py-20"><div className="mx-auto max-w-3xl"><Breadcrumbs items={[{ name: 'Home', href: '/' }, { name: 'Share a testimonial', href: '/testimonials/request' }]} /><div data-reveal className="mb-10 max-w-2xl"><p className="eyebrow">Your experience matters</p><h1 className="mt-4 text-4xl font-semibold tracking-tight text-ink sm:text-5xl">Share your DevMarvibe story.</h1><p className="mt-5 text-lg leading-8 text-slate-500">Your perspective helps future partners understand what it feels like to build with us. This form is for review only and does not publish anything automatically.</p></div>{submitted ? <div className="rounded-[28px] border border-teal-200 bg-white p-10 text-center shadow-xl shadow-slate-900/5"><div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-teal-100 text-teal-700"><Check size={30} /></div><h2 className="mt-6 text-2xl font-semibold">Thank you for sharing.</h2><p className="mx-auto mt-3 max-w-md leading-7 text-slate-500">Your testimonial has been received for review. We appreciate you taking the time to help tell the DevMarvibe story.</p><Link href="/" className="button-primary mt-8">Return home <ArrowLeft size={16} /></Link></div> : <form onSubmit={handleSubmit} className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-xl shadow-slate-900/5 sm:p-10"><div className="mb-9 flex items-center gap-4 rounded-2xl bg-ink p-5 text-white"><div className="rounded-xl bg-teal-400/15 p-3 text-teal-300"><Quote size={21} /></div><p className="text-sm leading-6 text-slate-300">A few honest words can help the right people find their next great partner.</p></div><div className="grid gap-5 sm:grid-cols-2"><label className="field-label">Author type *<select required name="authorType" className="field-input"><option value="">Select one</option>{authorTypes.map((option) => <option key={option.key} value={option.key}>{option.value}</option>)}</select></label><label className="field-label">Full name *<input required name="authorName" className="field-input" placeholder="Your full name" /></label><label className="field-label">Email address *<input required type="email" name="email" className="field-input" placeholder="you@company.com" /></label><label className="field-label">Job title<input name="jobTitle" className="field-input" placeholder="Your role" /></label><label className="field-label">Company name<input name="companyName" className="field-input" placeholder="Company name" /></label><label className="field-label">LinkedIn profile URL<input type="url" name="authorLinkedInUrl" className="field-input" placeholder="https://linkedin.com/in/..." /></label></div><div className="mt-5"><label className="field-label">Photo / avatar <span className="font-normal text-slate-400">(optional)</span><div className="mt-2 flex items-center gap-4"><label className="flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-slate-300 px-4 py-3 text-sm font-semibold text-slate-600 hover:border-teal-400"><Upload size={16} /> Choose image<input type="file" accept={ACCEPTED_IMAGE_TYPES.join(',')} onChange={handleAvatar} className="sr-only" /></label>{avatarPreview && <img src={avatarPreview} alt="Selected avatar preview" className="h-12 w-12 rounded-full object-cover" />}{avatar.status === 'uploading' && <span className="text-sm text-slate-500" role="status">Uploading…</span>}{avatar.status === 'ready' && <span className="flex items-center gap-1 text-sm font-medium text-teal-700" role="status"><Check size={15} /> Uploaded</span>}</div></label>{avatar.status === 'error' && <p className="mt-2 text-sm font-medium text-red-600" role="alert">{avatar.message}</p>}<p className="mt-2 text-xs text-slate-500">JPG, PNG, WebP, GIF or SVG, up to 2 MB.</p></div><div className="mt-8 border-t border-slate-200 pt-8"><h2 className="text-lg font-semibold">A little context</h2><div className="mt-5 grid gap-5 sm:grid-cols-2"><label className="field-label">Relationship to DevMarvibe<select name="relationshipType" className="field-input"><option value="">Select one</option>{relationships.map((option) => <option key={option.key} value={option.key}>{option.value}</option>)}</select></label><label className="field-label">What is this about? *<select required value={subjectType} onChange={(event) => setSubjectType(event.target.value)} className="field-input">{subjectOptions.map((option) => <option key={option}>{option}</option>)}</select></label></div><label className="field-label mt-5">Relationship note<textarea name="relationshipNote" rows={3} className="field-input resize-none" placeholder="Anything else we should know?" /></label><label className="field-label mt-5">Specific service / product *<select required name="specificItem" className="field-input">{options.map((option) => <option key={option}>{option}</option>)}</select></label></div><div className="mt-8 border-t border-slate-200 pt-8"><label className="field-label">Headline<input maxLength={90} name="headline" className="field-input" placeholder="A short summary of your experience" /></label><label className="field-label mt-5">Testimonial message *<textarea required maxLength={CONTENT_MAX} rows={6} name="message" className="field-input resize-none" placeholder="Tell us what stood out..." /></label><label className="mt-5 flex items-start gap-3 text-sm leading-6 text-slate-600"><input required type="checkbox" className="mt-0.5 h-5 w-5 shrink-0 accent-teal-600" />I give DevMarvibe permission to publish this testimonial on their website.</label></div>{error && <p className="mt-5 text-sm font-medium text-red-600" role="alert">{error}</p>}<button className="button-primary mt-8 w-full sm:w-auto" type="submit" disabled={submitting || avatar.status === 'uploading'}>{submitting ? 'Submitting…' : <>Submit testimonial <Check size={17} /></>}</button></form>}</div></div></main><SiteFooter /></>;
}
