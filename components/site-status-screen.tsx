import { BrandLogo } from '@/components/brand-logo';
import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

export function SiteStatusScreen({ icon: Icon, eyebrow, title, message, action }: { icon: LucideIcon; eyebrow: string; title: string; message: string; action?: ReactNode }) {
  return <main className="hero-grid relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-white px-6 text-center text-ink">
    <div className="hero-orbit absolute -right-24 -top-16 h-[420px] w-[420px] rounded-full border border-teal-200/70" />
    <div className="hero-orbit absolute -bottom-20 -left-20 h-72 w-72 rounded-full border border-blue-200/70" />
    <div className="relative z-10 flex max-w-lg flex-col items-center">
      <BrandLogo height={120} priority className="mb-[-40px]" />
      <p className="eyebrow mt-8 flex items-center gap-2"><Icon size={14} /> {eyebrow}</p>
      <h1 className="mt-4 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">{title}</h1>
      <p className="mt-5 text-lg leading-8 text-slate-500">{message}</p>
      {action && <div className="mt-8">{action}</div>}
    </div>
  </main>;
}
