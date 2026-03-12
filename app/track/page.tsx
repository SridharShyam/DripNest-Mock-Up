'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, AlertCircle, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Tracker } from '@/components/tracking/Tracker';
import { motion } from 'framer-motion';
import useSWR from 'swr';

const fetcher = (url: string, body: any) => fetch(url, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(body)
}).then(res => {
  if (!res.ok) throw new Error('Order not found');
  return res.json();
});

export default function TrackingPage() {
  const searchParams = useSearchParams();
  const [orderId, setOrderId] = useState(searchParams.get('orderId') || '');
  const [email, setEmail] = useState('');
  const [searching, setSearching] = useState(false);
  
  // Real-time polling
  const { data: order, error, isLoading } = useSWR(
    (searching && orderId && email) ? ['/api/track', { orderId, email }] : null,
    ([url, body]) => fetcher(url, body),
    {
      refreshInterval: 30000, // 30s
      revalidateOnFocus: true,
      revalidateOnReconnect: true
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (orderId && email) {
      setSearching(true);
    }
  };

  return (
    <div className="min-h-screen bg-cream selection:bg-violet selection:text-white pt-12 pb-24">
      <div className="container mx-auto px-4">
        
        {/* Header */}
        <div className="max-w-4xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-mist px-4 py-2 rounded-full text-violet font-black uppercase tracking-widest text-[10px] mb-6">
            <ShoppingBag className="w-3 h-3" /> Track Your Drip
          </div>
          <h1 className="font-serif text-5xl md:text-7xl font-bold tracking-tighter mb-6">Where's my order?</h1>
          <p className="text-neutral-500 max-w-xl mx-auto text-lg leading-relaxed">
            Enter your order details below to get real-time status updates on your delivery.
          </p>
        </div>

        {/* Search Form */}
        {!order && (
          <div className="max-w-xl mx-auto">
            <div className="bg-white border border-neutral-100 rounded-sm shadow-xl p-8 md:p-12">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="orderId" className="block text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-2">Order ID</label>
                  <input
                    id="orderId"
                    type="text"
                    placeholder="e.g. DN-TRACK-001"
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value)}
                    required
                    className="w-full px-6 py-4 bg-neutral-50 border border-neutral-100 rounded-sm focus:outline-none focus:border-violet focus:bg-white transition-all font-mono placeholder:font-sans"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-2">Email Address</label>
                  <input
                    id="email"
                    type="email"
                    placeholder="The email used for purchase"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-6 py-4 bg-neutral-50 border border-neutral-100 rounded-sm focus:outline-none focus:border-violet focus:bg-white transition-all"
                  />
                </div>
                <Button 
                  type="submit" 
                  variant="violet" 
                  className="w-full py-8 text-sm font-bold uppercase tracking-widest shadow-lg shadow-violet/20"
                  isLoading={isLoading}
                >
                  <Search className="w-4 h-4 mr-2" /> Track Order
                </Button>
              </form>

              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-8 flex items-center gap-3 p-4 bg-red/5 border border-red/10 rounded-sm text-red text-sm font-medium"
                >
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  No order found with these details. Please check your Order ID and email address.
                </motion.div>
              )}
            </div>
          </div>
        )}

        {/* Tracking Result */}
        {order && (
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-5xl mx-auto"
          >
            <div className="mb-12 flex justify-between items-center">
              <button 
                onClick={() => setSearching(false)}
                className="text-[10px] font-black uppercase tracking-widest text-neutral-400 hover:text-black transition-colors"
              >
                ← Search Another Order
              </button>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green rounded-full animate-pulse" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Live Updates Enabled</span>
              </div>
            </div>

            <Tracker order={order} />
          </motion.div>
        )}
      </div>
    </div>
  );
}
