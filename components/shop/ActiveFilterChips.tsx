'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { X } from 'lucide-react';

export function ActiveFilterChips({ searchParams }: { searchParams: any }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const removeFilter = (name: string, value: string) => {
    const newParams = new URLSearchParams(params.toString());
    const currentVals = newParams.getAll(name);
    
    // Create a new set of values excluding the one we want to remove
    const filtered = currentVals.flatMap(v => v.split(',')).filter(v => v !== value);
    
    newParams.delete(name);
    filtered.forEach(v => newParams.append(name, v));
    
    // Special cases for min/max price
    if (name === 'maxPrice' || name === 'minPrice') {
      newParams.delete(name);
    }

    router.push(`${pathname}?${newParams.toString()}`);
  };

  const chips: { name: string, value: string, label: string }[] = [];

  // Parse chips from params
  params.forEach((value, key) => {
    if (key === 'page' || key === 'sort' || key === 'view') return;
    
    // Split combined values (some filters might be comma separated in state but multi-appended in URL)
    value.split(',').forEach(v => {
      let label = v;
      if (key === 'maxPrice') label = `Max: $${v}`;
      if (key === 'minPrice') label = `Min: $${v}`;
      if (key === 'category') label = v.charAt(0) + v.slice(1).toLowerCase();
      
      chips.push({ name: key, value: v, label });
    });
  });

  if (chips.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 mb-8">
      {chips.map((chip, idx) => (
        <button
          key={`${chip.name}-${chip.value}-${idx}`}
          onClick={() => removeFilter(chip.name, chip.value)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-mist text-violet font-bold text-xs uppercase tracking-wider rounded-sm hover:bg-violet hover:text-white transition-all group"
        >
          {chip.label}
          <X className="w-3 h-3 text-violet opacity-50 group-hover:text-white group-hover:opacity-100" />
        </button>
      ))}
      <button 
        onClick={() => router.push(pathname)}
        className="text-xs font-bold text-neutral-400 hover:text-black transition-colors ml-2 uppercase tracking-widest"
      >
        Clear All
      </button>
    </div>
  );
}
