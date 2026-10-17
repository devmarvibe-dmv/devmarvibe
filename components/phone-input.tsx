'use client';

import { useEffect, useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';
import { getCountries, type Country } from '@/lib/api/countries';

const DEFAULT_COUNTRY: Country = { country: 'India', iso2: 'IN', iso3: 'IND', phonecode: '+91', phoneNumberFormat: '+91 XXXXX XXXXX', flag: 'https://flagcdn.com/in.svg', currency: 'INR' };

export function PhoneInput({ name, defaultIso2 = 'IN', placeholder, required }: { name: string; defaultIso2?: string; placeholder?: string; required?: boolean }) {
  const [countries, setCountries] = useState<Country[]>([DEFAULT_COUNTRY]);
  const [iso2, setIso2] = useState(defaultIso2);
  const [number, setNumber] = useState('');

  useEffect(() => {
    getCountries().then((items) => { if (items.length) setCountries(items); }).catch(() => {});
  }, []);

  const selected = countries.find((country) => country.iso2 === iso2) ?? countries[0];
  const combined = number.trim() ? `${selected.phonecode} ${number.trim()}` : '';

  return (
    <div className="field-input flex items-center gap-2">
      <Select value={selected.iso2} onValueChange={setIso2}>
        <SelectTrigger aria-label="Country code" className="h-auto w-auto shrink-0 gap-1 border-0 bg-transparent p-0 shadow-none focus:ring-0 focus:ring-offset-0">
          <img src={selected.flag} alt="" className="h-4 w-6 rounded-[3px] object-cover" />
        </SelectTrigger>
        <SelectContent className="max-h-72">
          {countries.map((country) => (
            <SelectItem key={country.iso2} value={country.iso2}>
              <span className="flex items-center gap-2">
                <img src={country.flag} alt="" className="h-3.5 w-5 rounded-[2px] object-cover" />
                {country.country} ({country.phonecode})
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <span className="shrink-0 text-slate-500">{selected.phonecode}</span>
      <input
        type="tel"
        value={number}
        onChange={(event) => setNumber(event.target.value)}
        placeholder={placeholder}
        required={required}
        className="w-full border-0 bg-transparent p-0 text-sm text-ink outline-none placeholder:text-slate-400"
      />
      <input type="hidden" name={name} value={combined} />
    </div>
  );
}
