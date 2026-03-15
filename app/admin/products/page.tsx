'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Package, 
  Search, 
  ChevronLeft, 
  Edit3, 
  Check, 
  AlertCircle,
  Loader2,
  RefreshCw
} from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/hooks/useToast';

export default function AdminProductsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { addToast } = useToast();
  
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>('');
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated' || (status === 'authenticated' && (session?.user as any).role !== 'ADMIN')) {
      router.push('/');
    }
  }, [status, session, router]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/products');
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (err) {
      console.error(err);
      addToast('Failed to load products', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session) fetchProducts();
  }, [session]);

  const handleUpdateStock = async (variantId: string) => {
    if (isUpdating) return;
    setIsUpdating(true);
    
    try {
      const res = await fetch(`/api/admin/variants/${variantId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stock: parseInt(editValue) })
      });

      if (res.ok) {
        const data = await res.json();
        addToast(`Stock updated! ${data.notifiedCount > 0 ? `${data.notifiedCount} emails sent.` : ''}`, 'success');
        setEditingId(null);
        fetchProducts();
      } else {
        addToast('Update failed', 'error');
      }
    } catch (err) {
      addToast('Error updating stock', 'error');
    } finally {
      setIsUpdating(false);
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.brand?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (status === 'loading' || loading) return (
    <div className="h-screen flex items-center justify-center font-serif text-2xl font-bold animate-pulse text-violet">Loading Catalog...</div>
  );

  return (
    <div className="container mx-auto px-4 md:px-8 py-12 bg-cream min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div>
          <Link href="/admin" className="text-violet text-[10px] font-black uppercase tracking-widest mb-2 flex items-center gap-1 hover:gap-2 transition-all">
            <ChevronLeft className="w-3 h-3" /> Dashboard
          </Link>
          <h1 className="font-serif text-4xl font-bold tracking-tight">Inventory Manager</h1>
          <p className="text-neutral-500">Scale your stock and trigger restock alerts.</p>
        </div>
        <Button onClick={fetchProducts} variant="outline" className="gap-2">
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <div className="bg-white border border-neutral-100 rounded-sm shadow-xl overflow-hidden mb-12">
         <div className="p-6 border-b border-neutral-100 flex flex-col md:flex-row gap-4 justify-between bg-mist/30">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input 
                type="text" 
                placeholder="Find a product..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white border border-neutral-100 rounded-sm focus:outline-none focus:border-violet text-sm transition-all"
              />
            </div>
         </div>

         <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-neutral-100 text-[10px] uppercase font-black tracking-widest text-neutral-400 bg-neutral-50">
                  <th className="px-6 py-4">Product</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Total Stock</th>
                  <th className="px-6 py-4">Variants & Stock Control</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-50">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-neutral-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-14 bg-neutral-100 rounded-sm overflow-hidden flex-shrink-0 relative">
                          {product.images && (
                            <img 
                              src={JSON.parse(product.images)[0]} 
                              className="w-full h-full object-cover" 
                              alt="p" 
                            />
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-sm">{product.name}</p>
                          <p className="text-[10px] text-neutral-400 uppercase tracking-widest">{product.brand}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-mist text-violet text-[10px] font-black uppercase rounded-full">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-bold ${product.stock === 0 ? 'text-red' : product.stock < 10 ? 'text-gold' : 'text-black'}`}>
                          {product.stock}
                        </span>
                        {product.stock === 0 && <AlertCircle className="w-4 h-4 text-red" />}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-2">
                        {product.variants.map((v: any) => (
                          <div 
                            key={v.id} 
                            className={`flex items-center border rounded-sm p-1 px-3 gap-3 transition-all ${
                              editingId === v.id ? 'border-violet ring-1 ring-violet shadow-md' : 'border-neutral-200'
                            }`}
                          >
                            <div className="flex flex-col">
                              <span className="text-[10px] uppercase font-black">{v.size} / {v.colour}</span>
                              <span className={`text-xs font-bold ${v.stock === 0 ? 'text-red' : 'text-neutral-600'}`}>Stock: {v.stock}</span>
                            </div>
                            
                            {editingId === v.id ? (
                              <div className="flex items-center gap-1">
                                <input 
                                  type="number"
                                  autoFocus
                                  value={editValue}
                                  onChange={(e) => setEditValue(e.target.value)}
                                  className="w-14 h-7 text-xs border border-neutral-200 rounded-sm px-1 focus:outline-none focus:border-violet"
                                  onKeyDown={(e) => e.key === 'Enter' && handleUpdateStock(v.id)}
                                />
                                <button 
                                  onClick={() => handleUpdateStock(v.id)}
                                  disabled={isUpdating}
                                  className="p-1 bg-violet text-white rounded-sm hover:bg-violet/80 transition-colors"
                                >
                                  {isUpdating ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
                                </button>
                              </div>
                            ) : (
                              <button 
                                onClick={() => { setEditingId(v.id); setEditValue(v.stock.toString()); }}
                                className="p-1 text-neutral-300 hover:text-violet transition-colors"
                              >
                                <Edit3 className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
         </div>
      </div>
    </div>
  );
}
