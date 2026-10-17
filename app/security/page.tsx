'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { AlertTriangle, ArrowLeft, Check, ShieldCheck } from 'lucide-react';
import { submitVulnerabilityReport, type VulnerabilitySeverity } from '@/lib/api/vulnerability-reports';
import { SiteStatusScreen } from '@/components/site-status-screen';
import { SiteVersion } from '@/components/site-version';
import { useBackendStatus } from '@/hooks/use-backend-status';
import { useTrackVisit } from '@/hooks/use-track-visit';
import { BACKEND_ORIGIN, getApiErrorMessage } from '@/lib/api/client';

const SEVERITIES: { value: VulnerabilitySeverity; label: string }[] = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'critical', label: 'Critical' },
];
const VULNERABILITY_TYPES = ['XSS', 'SQL injection', 'CSRF', 'Authentication / session', 'Access control', 'Information disclosure', 'Misconfiguration', 'Other'];

export default function SecurityPage() {
  const backendStatus = useBackendStatus();
  const [trackId, setTrackId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  useTrackVisit('security');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const field = (name: string) => String(formData.get(name) ?? '').trim() || undefined;
    setSubmitting(true);
    setError(null);
    try {
      const report = await submitVulnerabilityReport({
        title: String(formData.get('title') ?? '').trim(),
        description: String(formData.get('description') ?? '').trim(),
        severity: (field('severity') as VulnerabilitySeverity | undefined),
        vulnerabilityType: field('vulnerabilityType'),
        affectedUrl: field('affectedUrl'),
        stepsToReproduce: field('stepsToReproduce'),
        impact: field('impact'),
        reporterName: field('reporterName'),
        reporterEmail: field('reporterEmail'),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      });
      setTrackId(report.id);
    } catch (submitError) {
      setError(getApiErrorMessage(submitError) ?? 'Something went wrong sending your report. Please try again.');
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

  return <main className="min-h-screen bg-surface text-ink">
    <header className="border-b border-slate-200 bg-white"><div className="site-shell flex h-20 items-center justify-between"><Link href="/" className="text-sm font-bold text-teal-700"><ArrowLeft size={16} className="mr-2 inline" /> Back to DevMarvibe</Link><Link href="/"><img src="/Main_Logo.png" alt="DevMarVibe" className="h-14 w-auto object-contain" /></Link></div></header>
    <div className="site-shell py-14 sm:py-20"><div className="mx-auto max-w-3xl">
      <div className="mb-10 max-w-2xl"><p className="eyebrow">Responsible disclosure</p><h1 className="mt-4 text-4xl font-semibold tracking-tight text-ink sm:text-5xl">Report a security issue.</h1><p className="mt-5 text-lg leading-8 text-slate-500">Found a vulnerability in a DevMarvibe site or app? Tell us privately and our team will investigate. Please don&apos;t share it publicly until we&apos;ve had a chance to fix it.</p></div>
      {trackId ? <div className="rounded-[28px] border border-teal-200 bg-white p-10 text-center shadow-xl shadow-slate-900/5">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-teal-100 text-teal-700"><Check size={30} /></div>
        <h2 className="mt-6 text-2xl font-semibold">Thank you for your report.</h2>
        <p className="mx-auto mt-3 max-w-md leading-7 text-slate-500">We&apos;ve received it and will look into it. Your reference is <strong className="font-mono text-ink">#{trackId}</strong>. If you left an email address, we&apos;ll follow up there.</p>
        <Link href="/" className="button-primary mt-8">Return home <ArrowLeft size={16} /></Link>
      </div> : <form onSubmit={handleSubmit} className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-xl shadow-slate-900/5 sm:p-10">
        <div className="mb-9 flex items-center gap-4 rounded-2xl bg-ink p-5 text-white"><div className="rounded-xl bg-teal-400/15 p-3 text-teal-300"><ShieldCheck size={21} /></div><p className="text-sm leading-6 text-slate-300">Only test against accounts and data you own, and avoid anything that could disrupt the service for others.</p></div>
        <label className="field-label">Summary *<input required name="title" maxLength={200} className="field-input" placeholder="e.g. Reflected XSS on the search page" /></label>
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <label className="field-label">Severity<select name="severity" defaultValue="" className="field-input"><option value="">Not sure</option>{SEVERITIES.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label>
          <label className="field-label">Type of issue<select name="vulnerabilityType" defaultValue="" className="field-input"><option value="">Select one</option>{VULNERABILITY_TYPES.map((option) => <option key={option}>{option}</option>)}</select></label>
        </div>
        <label className="field-label mt-5">Affected URL<input type="url" name="affectedUrl" maxLength={1000} className="field-input" placeholder="https://devmarvibe.com/..." /></label>
        <label className="field-label mt-5">Description *<textarea required name="description" rows={5} className="field-input resize-none" placeholder="What is the issue and where does it occur?" /></label>
        <label className="field-label mt-5">Steps to reproduce<textarea name="stepsToReproduce" rows={4} className="field-input resize-none" placeholder="1. Open... 2. Enter... 3. Observe..." /></label>
        <label className="field-label mt-5">Impact<textarea name="impact" rows={3} className="field-input resize-none" placeholder="What could an attacker do with this?" /></label>
        <div className="mt-8 border-t border-slate-200 pt-8">
          <h2 className="text-lg font-semibold">How can we reach you? <span className="font-normal text-slate-500">(optional)</span></h2>
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <label className="field-label">Your name<input name="reporterName" className="field-input" placeholder="Name or handle" /></label>
            <label className="field-label">Email address<input type="email" name="reporterEmail" className="field-input" placeholder="you@example.com" /></label>
          </div>
        </div>
        {error && <p className="mt-5 text-sm font-medium text-red-600" role="alert">{error}</p>}
        <button className="button-primary mt-8 w-full sm:w-auto" type="submit" disabled={submitting}>{submitting ? 'Sending…' : <>Send report <ShieldCheck size={17} /></>}</button>
      </form>}
    </div></div>
    <footer className="border-t border-slate-200 bg-white py-6"><div className="site-shell flex flex-col gap-3 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between"><p>© {new Date().getFullYear()} DevMarvibe. All rights reserved.</p><SiteVersion /></div></footer>
  </main>;
}
