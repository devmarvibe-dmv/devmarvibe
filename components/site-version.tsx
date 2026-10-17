'use client';

import { useEffect, useState } from 'react';
import { getApiVersion, onApiVersion } from '@/lib/api/client';

const APP_VERSION = process.env.NEXT_PUBLIC_APP_VERSION;

/** "Website v0.2.0 · Console v1.66.0" — the console version comes from the `version` field of API responses. */
export function SiteVersion({ className = '' }: { className?: string }) {
  const [apiVersion, setApiVersion] = useState<string | null>(null);

  useEffect(() => {
    setApiVersion(getApiVersion());
    return onApiVersion(setApiVersion);
  }, []);

  if (!APP_VERSION && !apiVersion) return null;

  return <p className={`font-mono ${className}`}>
    {APP_VERSION && <span>Website v{APP_VERSION}</span>}
    {APP_VERSION && apiVersion && <span aria-hidden="true"> · </span>}
    {apiVersion && <span>Console v{apiVersion}</span>}
  </p>;
}
