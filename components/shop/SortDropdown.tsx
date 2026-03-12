'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useCallback } from 'react';

interface SortDropdownProps {
  currentSort: string;
}

export function SortDropdown({ currentSort }: SortDropdownProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const handleSortChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('sort', e.target.value);
    router.push(`${pathname}?${params.toString()}`);
  }, [searchParams, pathname, router]);

  return (
    <div className="flex items-center gap-2">
      <label htmlFor="sort" className="text-sm font-medium text-neutral-500 whitespace-nowrap">Sort by:</label>
      <select 
        id="sort"
        value={currentSort} 
        onChange={handleSortChange} 
        className="h-10 border-0 bg-transparent text-black font-medium focus:ring-0 text-right pr-8 uppercase tracking-wider text-xs cursor-pointer appearance-none bg-[url('https://cdn.iconscout.com/icon/free/png-256/down-arrow-15-460295.png')] bg-no-repeat bg-[center_right_0.5rem] bg-[length:12px]"
      >
        <option value="recommended">Recommended</option>
        <option value="newest">New Arrivals</option>
        <option value="price-asc">Price: Low to High</option>
        <option value="price-desc">Price: High to Low</option>
        <option value="rating">Top Rated</option>
      </select>
    </div>
  );
}
