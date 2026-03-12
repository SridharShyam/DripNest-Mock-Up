'use client';

import { useState, useEffect, useRef } from 'react';
import { useUIStore } from '@/store/uiStore';
import { X, Search, ArrowRight, TrendingUp, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { formatPrice } from '@/lib/utils';

export function SearchOverlay() {
  const { isSearchOpen, toggleSearch } = useUIStore();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isSearchOpen]);

  useEffect(() => {
    const fetchResults = async () => {
      if (query.length < 2) {
        setResults([]);
        return;
      }
      setLoading(true);
      try {
        const res = await fetch(`/api/products/search?q=${query}`);
        if (res.ok) {
          const data = await res.json();
          setResults(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchResults, 300);
    return () => clearTimeout(timer);
  }, [query]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query) {
      router.push(`/shop?q=${query}`);
      toggleSearch();
    }
  };

  const trending = ['Vintage Tees', 'Cargo Pants', 'Puffer Jackets', 'Accessories'];

  return (
    <AnimatePresence>
      {isSearchOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md flex flex-col"
        >
          <div className="bg-white px-4 md:px-8 py-6 shadow-2xl">
            <div className="container mx-auto flex items-center justify-between gap-4">
              <div className="flex-1 max-w-4xl mx-auto relative group">
                <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-6 h-6 text-neutral-400 group-focus-within:text-violet transition-colors" />
                <form onSubmit={handleSearchSubmit}>
                  <input
                    ref={inputRef}
                    type="text"
                    placeholder="Search for products, brands, or collections..."
                    className="w-full bg-transparent border-0 border-b-2 border-neutral-100 focus:border-violet focus:ring-0 py-4 pl-10 text-2xl font-serif font-bold transition-all placeholder:text-neutral-300"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                </form>
              </div>
              <button 
                onClick={toggleSearch}
                className="p-3 bg-neutral-100 rounded-full hover:bg-neutral-200 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto bg-mist/95 p-8">
            <div className="container mx-auto max-w-4xl">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
                
                {/* Suggestions / Last Searched */}
                <div className="md:col-span-4 space-y-10">
                  <div>
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 mb-6 flex items-center gap-2">
                       <TrendingUp className="w-3.5 h-3.5" /> Trending Searches
                    </h3>
                    <div className="flex flex-col gap-3">
                      {trending.map(t => (
                        <button 
                          key={t}
                          onClick={() => setQuery(t)}
                          className="text-left font-bold text-neutral-600 hover:text-violet transition-colors flex items-center justify-between group"
                        >
                          {t} <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all font-black" />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 mb-6 flex items-center gap-2">
                       <Clock className="w-3.5 h-3.5" /> Recent Searches
                    </h3>
                    <div className="flex flex-col gap-3">
                       <p className="text-sm italic text-neutral-400">No recent searches</p>
                    </div>
                  </div>
                </div>

                {/* Live Results */}
                <div className="md:col-span-8">
                   <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 mb-6 px-1">
                      {query.length > 0 ? `Results for "${query}"` : 'Top Suggestions'}
                   </h3>
                   
                   <div className="space-y-4">
                      {loading ? (
                         <div className="space-y-4">
                            {[1,2,3].map(i => <div key={i} className="h-20 bg-neutral-100 animate-pulse rounded-sm" />)}
                         </div>
                      ) : results.length > 0 ? (
                        <>
                          {results.map((product) => {
                            const images = typeof product.images === 'string' ? JSON.parse(product.images) : product.images;
                            return (
                              <button
                                key={product.id}
                                onClick={() => {
                                  router.push(`/shop/${product.slug}`);
                                  toggleSearch();
                                }}
                                className="w-full flex gap-4 p-3 bg-white rounded-sm border border-neutral-100 hover:border-violet hover:shadow-lg transition-all text-left"
                              >
                                <div className="relative w-16 h-20 bg-mist flex-shrink-0">
                                   <Image src={images[0]} alt={product.name} fill className="object-cover" />
                                </div>
                                <div className="flex-1 flex flex-col justify-center">
                                   <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">{product.brand}</p>
                                   <p className="font-bold text-lg leading-tight">{product.name}</p>
                                   <p className="text-violet font-black mt-1">{formatPrice(product.price)}</p>
                                </div>
                                <ArrowRight className="w-5 h-5 self-center text-neutral-100 group-hover:text-neutral-300" />
                              </button>
                            );
                          })}
                          <button 
                            onClick={() => {
                              router.push(`/shop?q=${query}`);
                              toggleSearch();
                            }}
                            className="w-full py-4 text-center font-black uppercase tracking-[0.2em] text-xs hover:text-violet transition-colors mt-4 border-t border-neutral-200"
                          >
                            View All Results
                          </button>
                        </>
                      ) : query.length > 1 ? (
                        <div className="py-20 text-center">
                           <p className="font-serif text-2xl font-bold mb-2">No results for "{query}"</p>
                           <p className="text-neutral-500">Try adjusting your spelling or using more general terms.</p>
                        </div>
                      ) : (
                        <div className="py-20 flex flex-col items-center justify-center opacity-30 select-none grayscale">
                           <Search className="w-20 h-20 mb-4" />
                           <p className="font-black uppercase tracking-widest text-xs">Start typing to search</p>
                        </div>
                      )}
                   </div>
                </div>

              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
