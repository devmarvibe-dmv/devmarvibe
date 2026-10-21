'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { ContactForm } from '@/components/contact-form';
import { getServices } from '@/lib/api/services';
import { services as fallbackServices } from '@/data/services';
import { PACKAGE_IDS, getPackage, type PackageId, type Platform } from '@/data/packages';

/** The /contact form, pre-filled from `?package=growth&platform=app` links on /packages. */
export function ContactPageForm() {
  const params = useSearchParams();
  const [projectTypes, setProjectTypes] = useState(() => fallbackServices.map((service) => service.title));

  useEffect(() => {
    getServices().then((items) => { if (items.length) setProjectTypes(items.map((service) => service.title)); }).catch(() => {});
  }, []);

  const packageParam = params.get('package');
  const platformParam = params.get('platform');
  const defaultPackage = (PACKAGE_IDS as string[]).includes(packageParam ?? '') ? packageParam as PackageId : '';
  const defaultPlatform = platformParam === 'app' || platformParam === 'both' ? platformParam as Platform | 'both' : 'web';
  const chosen = getPackage(defaultPackage);

  return <div>
    {chosen && <p className="mb-4 rounded-2xl border border-teal-200 bg-teal-50 px-5 py-3 text-sm font-medium text-teal-900" role="status">
      You&apos;re enquiring about <strong>{chosen.shortName}</strong>{defaultPlatform === 'app' ? ' as a mobile app' : ''}. You can change this below.
    </p>}
    {/* key: re-mount when the query changes so the pre-filled defaults update. */}
    <ContactForm key={`${defaultPackage}-${defaultPlatform}`} withPackage projectTypes={projectTypes} defaultPackage={defaultPackage} defaultPlatform={defaultPlatform} />
  </div>;
}
