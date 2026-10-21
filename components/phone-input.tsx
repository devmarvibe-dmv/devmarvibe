'use client';

import { memo, useCallback, useEffect, useId, useMemo, useRef, useState, type KeyboardEvent } from 'react';
import { ChevronDown, Search } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { VirtualList, type VirtualListHandle } from '@/components/virtual-list';
import { useDebouncedValue } from '@/hooks/use-debounced-value';
import { getCountries, type Country } from '@/lib/api/countries';

const DEFAULT_COUNTRY: Country = { country: 'India', iso2: 'IN', iso3: 'IND', phonecode: '+91', phoneNumberFormat: '+91 XXXXX XXXXX', flag: 'https://flagcdn.com/in.svg', currency: 'INR' };
const ROW_HEIGHT = 40;
const LIST_HEIGHT = 288;

function matches(country: Country, query: string): boolean {
  if (!query) return true;
  const digits = query.replace(/[^\d]/g, '');
  return country.country.toLowerCase().includes(query)
    || country.iso2.toLowerCase() === query
    || (!!digits && country.phonecode.replace(/[^\d]/g, '').startsWith(digits));
}

/** Phone number with a searchable, virtualized country-code picker. Submits "+91 98765 43210" under `name`. */
export const PhoneInput = memo(function PhoneInput({ name, defaultIso2 = 'IN', required }: { name: string; defaultIso2?: string; required?: boolean }) {
  const [countries, setCountries] = useState<Country[]>([DEFAULT_COUNTRY]);
  const [iso2, setIso2] = useState(defaultIso2);
  const [number, setNumber] = useState('');
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const debouncedQuery = useDebouncedValue(query.trim().toLowerCase(), 150);
  const listRef = useRef<VirtualListHandle>(null);
  const listId = useId();

  useEffect(() => {
    getCountries().then((items) => { if (items.length) setCountries(items); }).catch(() => {});
  }, []);

  const selected = useMemo(() => countries.find((country) => country.iso2 === iso2) ?? countries[0], [countries, iso2]);
  const filtered = useMemo(() => countries.filter((country) => matches(country, debouncedQuery)), [countries, debouncedQuery]);
  const combined = number.trim() ? `${selected.phonecode} ${number.trim()}` : '';

  // New results start from the top.
  useEffect(() => {
    setActiveIndex(0);
    listRef.current?.resetScroll();
  }, [debouncedQuery]);

  const choose = useCallback((country: Country) => {
    setIso2(country.iso2);
    setOpen(false);
  }, []);

  const handleOpenChange = useCallback((next: boolean) => {
    setOpen(next);
    if (next) {
      setQuery('');
      setActiveIndex(0);
    }
  }, []);

  const moveActive = useCallback((index: number) => {
    setActiveIndex(index);
    listRef.current?.scrollToIndex(index);
  }, []);

  const handleSearchKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      moveActive(Math.min(activeIndex + 1, filtered.length - 1));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      moveActive(Math.max(activeIndex - 1, 0));
    } else if (event.key === 'Enter') {
      event.preventDefault();
      const country = filtered[activeIndex];
      if (country) choose(country);
    }
  };

  const renderRow = useCallback((country: Country, index: number) => {
    const isSelected = country.iso2 === selected.iso2;
    return <div
      id={`${listId}-${country.iso2}`}
      role="option"
      aria-selected={isSelected}
      onMouseDown={(event) => event.preventDefault()}
      onClick={() => choose(country)}
      onMouseEnter={() => setActiveIndex(index)}
      className={`flex h-full cursor-pointer items-center gap-2 rounded-md px-2 text-sm ${index === activeIndex ? 'bg-teal-50 text-ink' : 'text-slate-700'} ${isSelected ? 'font-semibold' : ''}`}
    >
      <img src={country.flag} alt="" width={20} height={14} loading="lazy" decoding="async" className="h-3.5 w-5 shrink-0 rounded-[2px] object-cover" />
      <span className="truncate">{country.country}</span>
      <span className="ml-auto shrink-0 text-slate-500">{country.phonecode}</span>
    </div>;
  }, [activeIndex, choose, listId, selected.iso2]);

  return (
    <div className="field-input flex items-center gap-2">
      <Popover open={open} onOpenChange={handleOpenChange}>
        <PopoverTrigger type="button" aria-label={`Country code: ${selected.country} ${selected.phonecode}`} className="-my-3 -ml-2 flex h-11 min-w-[44px] shrink-0 items-center justify-center gap-1 rounded px-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500">
          <img src={selected.flag} alt="" width={24} height={16} className="h-4 w-6 rounded-[3px] object-cover" />
          <ChevronDown size={14} className="text-slate-500" />
        </PopoverTrigger>
        <PopoverContent align="start" className="w-72 p-2">
          <label className="flex items-center gap-2 rounded-md border border-slate-200 px-2">
            <Search size={15} className="text-slate-500" />
            <span className="sr-only">Search countries</span>
            <input
              autoFocus
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={handleSearchKeyDown}
              role="combobox"
              aria-expanded="true"
              aria-controls={listId}
              aria-activedescendant={filtered[activeIndex] ? `${listId}-${filtered[activeIndex].iso2}` : undefined}
              className="h-10 w-full bg-transparent text-sm text-ink outline-none"
            />
          </label>
          {filtered.length > 0
            ? <VirtualList ref={listRef} id={listId} role="listbox" aria-label="Countries" className="mt-2" items={filtered} rowHeight={ROW_HEIGHT} height={LIST_HEIGHT} getKey={(country) => country.iso2} renderRow={renderRow} />
            : <p className="px-2 py-6 text-center text-sm text-slate-500" role="status">No countries match “{query}”.</p>}
        </PopoverContent>
      </Popover>
      <span className="shrink-0 text-slate-500">{selected.phonecode}</span>
      <input
        type="tel"
        value={number}
        onChange={(event) => setNumber(event.target.value)}
        required={required}
        aria-label="Phone number"
        className="-my-3 w-full min-w-0 border-0 bg-transparent px-0 py-3 text-sm text-ink outline-none"
      />
      <input type="hidden" name={name} value={combined} />
    </div>
  );
});
