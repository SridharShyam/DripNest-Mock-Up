'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, ShoppingBag, ArrowRight, Package, Calendar, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { formatPrice } from '@/lib/utils';
import confetti from 'canvas-confetti';
import useSWR from 'swr';
import { Tracker } from '@/components/tracking/Tracker';

export default function OrderConfirmationPage() {
  const { id } = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/orders/${id}`);
        if (res.ok) {
          const data = await res.json();
          setOrder(data);
          
          // Trigger confetti on success
          confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#7b62c4', '#a98edb', '#faf9f7', '#0a0a0a']
          });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchOrder();
  }, [id]);

  const { data: orderWithTracking } = useSWR(
    id ? `/api/orders/${id}/tracking` : null,
    (url) => fetch(url).then(res => res.json()),
    { refreshInterval: 30000 }
  );

  if (loading) return (
    <div className="h-screen flex flex-col items-center justify-center gap-4">
      <div className="w-12 h-12 border-4 border-mist border-t-violet rounded-full animate-spin" />
      <p className="font-bold uppercase tracking-widest text-xs">Authenticating Order...</p>
    </div>
  );

  if (!order) return (
    <div className="h-screen flex flex-col items-center justify-center gap-4">
      <h1 className="font-serif text-3xl font-bold">Order Not Found</h1>
      <Link href="/shop" className="text-violet underline">Return to Shop</Link>
    </div>
  );

  return (
    <div className="container mx-auto px-4 md:px-8 py-20 max-w-4xl">
      <div className="text-center mb-16 animate-in fade-in zoom-in duration-700">
        <div className="w-24 h-24 bg-green/10 rounded-full flex items-center justify-center mx-auto mb-8">
          <CheckCircle2 className="w-12 h-12 text-green" />
        </div>
        <h1 className="font-serif text-5xl font-bold mb-4 tracking-tight">Order Confirmed!</h1>
        <p className="text-neutral-500 text-lg">Thank you for your purchase. We've received your order and are getting it ready.</p>
        <div className="mt-8 inline-block px-6 py-2 bg-charcoal text-white rounded-full font-mono text-sm tracking-wider">
          ORDER #DN-{order.id.slice(0, 8).toUpperCase()}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        
        {/* Left: Summary */}
        <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-700">
          <div className="bg-white border border-neutral-100 p-8 rounded-sm shadow-sm">
            <h2 className="font-serif text-2xl font-bold mb-6 flex items-center gap-3">
              <Package className="w-6 h-6 text-violet" /> Order Details
            </h2>
            
            <div className="space-y-6">
              {order.items.map((item: any) => (
                <div key={item.id} className="flex gap-4">
                  <div className="relative w-16 h-20 bg-mist rounded-sm overflow-hidden flex-shrink-0">
                    <img src={item.productImage} alt={item.productName} className="object-cover w-full h-full" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-sm leading-tight">{item.productName}</p>
                    <p className="text-xs text-neutral-500 mt-1">Qty: {item.qty} • {formatPrice(item.priceAtPurchase)}</p>
                  </div>
                  <p className="font-bold">{formatPrice(item.priceAtPurchase * item.qty)}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-8 border-t border-neutral-100 space-y-3">
              <div className="flex justify-between text-neutral-500 text-sm">
                <span>Subtotal</span>
                <span>{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-neutral-500 text-sm">
                <span>Shipping</span>
                <span>{order.shipping === 0 ? 'FREE' : formatPrice(order.shipping)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-green text-sm">
                  <span>Discount</span>
                  <span>-{formatPrice(order.discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-xl font-bold pt-4">
                <span>Total</span>
                <span>{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Info */}
        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-700">
          <div className="bg-mist/30 p-8 rounded-sm border border-mist/50">
             <div className="flex items-start gap-4 mb-8">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-violet" />
                </div>
                <div>
                  <h3 className="font-bold uppercase tracking-widest text-[10px] text-neutral-400 mb-1">Shipping Address</h3>
                  <p className="font-medium leading-relaxed">{order.shippingAddress}</p>
                </div>
             </div>

             <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-5 h-5 text-violet" />
                </div>
                <div>
                  <h3 className="font-bold uppercase tracking-widest text-[10px] text-neutral-400 mb-1">Estimated Delivery</h3>
                  <p className="font-medium">March 18, 2026</p>
                  <p className="text-xs text-neutral-500 mt-1">A tracking link will be sent to your email once shipped.</p>
                </div>
             </div>
          </div>

          <div className="space-y-6 pt-4">
            <div className="bg-white border border-neutral-100 rounded-sm p-6 shadow-sm">
               <h3 className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-6 flex items-center gap-2">
                 <div className="w-2 h-2 bg-green rounded-full animate-pulse" /> Live Order Status
               </h3>
               {orderWithTracking ? (
                 <Tracker order={orderWithTracking} />
               ) : (
                 <div className="h-40 flex items-center justify-center">
                   <div className="w-6 h-6 border-2 border-mist border-t-violet rounded-full animate-spin" />
                 </div>
               )}
            </div>
            <Link href="/shop" className="contents">
              <Button variant="outline" size="lg" className="w-full py-8 font-black uppercase tracking-widest hover:bg-black hover:text-white">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
