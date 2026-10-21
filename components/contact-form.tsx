'use client';

import { memo, useCallback, useState, type FormEvent } from 'react';
import dynamic from 'next/dynamic';
import { ArrowRight, Check } from 'lucide-react';
import { submitContactForm } from '@/lib/api/contact';
import { getApiErrorMessage } from '@/lib/api/client';
import { PACKAGES, PLATFORM_LABELS, PLATFORM_SHORT_LABELS, type PackageId, type Platform } from '@/data/packages';

// The searchable country picker loads as its own chunk.
const PhoneInput = dynamic(() => import('@/components/phone-input').then((m) => m.PhoneInput), {
  loading: () => <div className="field-input h-[46px]" aria-hidden="true" />,
});

type PlatformChoice = Platform | 'both';

type ContactFormProps = {
  /** Options for the "Project type" select (service names). */
  projectTypes: string[];
  /** Adds the package and platform pickers (used on /contact). */
  withPackage?: boolean;
  defaultPackage?: PackageId | '';
  defaultPlatform?: PlatformChoice;
  className?: string;
};

/** Contact / enquiry form posting to the console's Contact Us inbox. */
export const ContactForm = memo(function ContactForm({ projectTypes, withPackage = false, defaultPackage = '', defaultPlatform = 'web', className = '' }: ContactFormProps) {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = useCallback(async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const field = (name: string) => String(formData.get(name) ?? '').trim() || undefined;

    // The console has one free-text "services" field: pack package, platform and project type into it.
    const packageId = field('package');
    const packageName = PACKAGES.find((item) => item.id === packageId)?.shortName;
    const platform = field('platform') as PlatformChoice | undefined;
    const interest = [
      packageName ? `Package: ${packageName}` : withPackage ? 'Package: not sure yet' : undefined,
      platform ? `Platform: ${PLATFORM_LABELS[platform]}` : undefined,
      field('project') ? (withPackage ? `Project type: ${field('project')}` : field('project')) : undefined,
    ].filter(Boolean).join(' · ');

    setSubmitting(true);
    setError(null);
    try {
      await submitContactForm({
        name: String(formData.get('name') ?? '').trim(),
        email: field('email'),
        mobile: field('phone'),
        company: field('company'),
        services: interest || undefined,
        description: field('message'),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      });
      setSent(true);
      form.reset();
    } catch (submitError) {
      setError(getApiErrorMessage(submitError) ?? 'Something went wrong sending your message. Please try again or email us directly.');
    } finally {
      setSubmitting(false);
    }
  }, [withPackage]);

  return <form className={`rounded-[28px] border border-slate-200 bg-white p-6 shadow-xl shadow-slate-900/5 sm:p-8 ${className}`} onSubmit={handleSubmit}>
    <div className="grid gap-5 sm:grid-cols-2">
      <label className="field-label">Your name<input required name="name" autoComplete="name" className="field-input" /></label>
      <label className="field-label">Work email<input required type="email" name="email" autoComplete="email" className="field-input" /></label>
      <label className="field-label">Phone number<PhoneInput name="phone" /></label>
      {withPackage
        ? <label className="field-label">Company <span className="font-normal text-slate-500">(optional)</span><input name="company" autoComplete="organization" className="field-input" /></label>
        : <label className="field-label">Project type<select name="project" className="field-input">{projectTypes.map((type) => <option key={type}>{type}</option>)}</select></label>}
    </div>

    {withPackage && <div className="mt-5 grid gap-5 sm:grid-cols-2">
      <label className="field-label">Package<select name="package" defaultValue={defaultPackage} className="field-input"><option value="">Not sure yet</option>{PACKAGES.map((item) => <option key={item.id} value={item.id}>{item.shortName}</option>)}</select></label>
      <label className="field-label">Project type<select name="project" defaultValue="" className="field-input"><option value="">Select one (optional)</option>{projectTypes.map((type) => <option key={type}>{type}</option>)}</select></label>
      <fieldset className="sm:col-span-2">
        <legend className="field-label">Build it as <span className="font-normal text-slate-500">(apps for Android &amp; iOS)</span></legend>
        <div className="mt-2 grid gap-3 sm:grid-cols-3">{(Object.keys(PLATFORM_LABELS) as PlatformChoice[]).map((value) => <label key={value} className="choice-card">
          <input type="radio" name="platform" value={value} defaultChecked={value === defaultPlatform} className="h-5 w-5 shrink-0 accent-teal-600" />{PLATFORM_SHORT_LABELS[value]}
        </label>)}</div>
      </fieldset>
    </div>}

    <label className="field-label mt-5">Tell us about your project<textarea required name="message" rows={5} className="field-input resize-none" /></label>
    <button className="button-primary mt-6 w-full sm:w-auto" type="submit" disabled={submitting}>{sent ? <>Message received <Check size={18} aria-hidden="true" /></> : submitting ? 'Sending…' : <>Send message <ArrowRight size={18} aria-hidden="true" /></>}</button>
    {sent && <p className="mt-4 text-sm font-medium text-teal-700" role="status">Thanks — our team will be in touch shortly.</p>}
    {error && <p className="mt-4 text-sm font-medium text-red-600" role="alert">{error}</p>}
  </form>;
});
