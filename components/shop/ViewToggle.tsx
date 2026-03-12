'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { LayoutGrid, List } from 'lucide-react';

export function ViewToggle({ currentView }: { currentView: 'grid' | 'list' }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const handleToggle = (view: 'grid' | 'list') => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('view', view);
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex bg-neutral-100 rounded-sm p-1">
      <button 
        onClick={() => handleToggle('grid')}
        className={`p-1.5 rounded-sm transition-all ${currentView === 'grid' ? 'bg-white shadow-sm text-black' : 'text-neutral-400 hover:text-black'}`}
      >
        <LayoutGrid className="w-4 h-4" />
      </button>
      <button 
        onClick={() => handleToggle('list')}
        className={`p-1.5 rounded-sm transition-all ${currentView === 'list' ? 'bg-white shadow-sm text-black' : 'text-neutral-400 hover:text-black'}`}
      >
        <List className="w-4 h-4" />
      </button>
    </div>
  );
}
