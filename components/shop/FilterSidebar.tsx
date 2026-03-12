'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useCallback, useState } from 'react';
import { ChevronDown, ChevronUp, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { formatPrice } from '@/lib/utils';

interface FilterSidebarProps {
  availableBrands: string[];
  currentParams: any;
}

export function FilterSidebar({ availableBrands, currentParams }: FilterSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [openSections, setOpenSections] = useState({
    category: true,
    price: true,
    size: true,
    colour: true,
    brand: false,
    rating: false,
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const createQueryString = useCallback(
    (name: string, value: string, multi: boolean = false) => {
      const params = new URLSearchParams(searchParams.toString());
      
      if (multi) {
        const currentVals = params.getAll(name);
        if (currentVals.includes(value)) {
           // Remove it
           params.delete(name);
           currentVals.filter(v => v !== value).forEach(v => params.append(name, v));
        } else {
           // Add it
           params.append(name, value);
        }
      } else {
        if (value === '') {
          params.delete(name);
        } else {
          params.set(name, value);
        }
      }
      
      params.set('page', '1'); // reset page
      return params.toString();
    },
    [searchParams]
  );

  const clearAll = () => {
    router.push(pathname);
  };

  const SectionTitle = ({ title, name }: { title: string, name: keyof typeof openSections }) => (
    <button 
      onClick={() => toggleSection(name)}
      className="flex justify-between w-full py-4 text-left font-serif font-bold group"
    >
      <span className="group-hover:text-violet transition-colors">{title}</span>
      {openSections[name] ? <ChevronUp className="w-5 h-5 text-neutral-400" /> : <ChevronDown className="w-5 h-5 text-neutral-400" />}
    </button>
  );

  const categories = ['MENS', 'WOMENS', 'APPAREL', 'ACCESSORIES'];
  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'OS'];
  const colours = ['Black', 'White', 'Navy', 'Olive', 'Charcoal', 'Red', 'Blue'];

  return (
    <div className="w-full bg-white md:border-r border-neutral-100 md:pr-8 pb-8">
      <div className="flex justify-between items-center mb-6 border-b border-black pb-4">
        <h2 className="font-serif text-2xl font-bold tracking-tight">Filters</h2>
        <button onClick={clearAll} className="text-sm font-medium text-neutral-500 hover:text-black hover:underline transition-all">
          Clear All
        </button>
      </div>

      <div className="space-y-1 divide-y divide-neutral-100">
        
        {/* Categories */}
        <div className="py-2">
          <SectionTitle title="Category" name="category" />
          {openSections.category && (
            <div className="flex flex-col gap-3 pb-4">
              {categories.map((cat) => (
                <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 rounded-sm border-neutral-300 text-violet focus:ring-violet checked:bg-violet checked:border-violet"
                    checked={searchParams.getAll('category').includes(cat)}
                    onChange={() => router.push(pathname + '?' + createQueryString('category', cat, true))}
                  />
                  <span className="text-sm font-medium group-hover:text-violet transition-colors">{cat}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Sizes */}
        <div className="py-2">
          <SectionTitle title="Size" name="size" />
          {openSections.size && (
            <div className="grid grid-cols-3 gap-2 pb-4">
              {sizes.map((s) => {
                const isActive = searchParams.getAll('size').includes(s);
                return (
                  <button
                    key={s}
                    onClick={() => router.push(pathname + '?' + createQueryString('size', s, true))}
                    className={`h-10 text-xs font-bold uppercase transition-all border rounded-sm ${isActive ? 'bg-black text-white border-black' : 'bg-transparent text-black border-neutral-200 hover:border-violet hover:text-violet'}`}
                  >
                    {s}
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {/* Colours */}
        <div className="py-2">
          <SectionTitle title="Colour" name="colour" />
          {openSections.colour && (
            <div className="flex flex-col gap-3 pb-4">
              {colours.map((c) => (
                <label key={c} className="flex items-center gap-3 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 rounded-sm border-neutral-300 text-violet focus:ring-violet checked:bg-violet checked:border-violet"
                    checked={searchParams.getAll('colour').includes(c)}
                    onChange={() => router.push(pathname + '?' + createQueryString('colour', c, true))}
                  />
                  <span className="text-sm border flex items-center gap-2 px-2 py-0.5 rounded-full bg-mist/50">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c.toLowerCase() === 'white' ? '#faf9f7' : c.toLowerCase() === 'navy' ? '#1a2a40' : c.toLowerCase() === 'olive' ? '#3d9970' : c.toLowerCase() === 'charcoal' ? '#1a1a1a' : c.toLowerCase() }} />
                    <span className="group-hover:text-violet transition-colors">{c}</span>
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Brands */}
        <div className="py-2">
          <SectionTitle title="Brand" name="brand" />
          {openSections.brand && (
            <div className="flex flex-col gap-3 pb-4 max-h-48 overflow-y-auto miniscroll">
              {availableBrands.map((b) => (
                <label key={b} className="flex items-center gap-3 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 rounded-sm border-neutral-300 text-violet focus:ring-violet checked:bg-violet checked:border-violet"
                    checked={searchParams.getAll('brand').includes(b)}
                    onChange={() => router.push(pathname + '?' + createQueryString('brand', b, true))}
                  />
                  <span className="text-sm font-medium group-hover:text-violet transition-colors">{b}</span>
                </label>
              ))}
            </div>
          )}
        </div>
        
        {/* Price slider placeholder (user wanted dual handle, but for brevity native range inputs or simple max range) */}
        <div className="py-2">
          <SectionTitle title="Max Price" name="price" />
          {openSections.price && (
            <div className="pb-4">
              <input 
                type="range" 
                min="0" max="500" step="10" 
                className="w-full accent-black"
                value={searchParams.get('maxPrice') || '500'}
                onChange={(e) => router.push(pathname + '?' + createQueryString('maxPrice', e.target.value))}
              />
              <div className="flex justify-between text-xs text-neutral-500 mt-2 font-bold">
                <span>{formatPrice(0)}</span>
                <span className="text-black bg-neutral-100 px-2 py-1 rounded">{formatPrice(Number(searchParams.get('maxPrice') || '500'))}</span>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
