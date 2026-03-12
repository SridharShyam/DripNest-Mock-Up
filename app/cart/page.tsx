'use client';

import { useCartStore } from '@/store/cartStore';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { formatPrice } from '@/lib/utils';
import { Trash2, Minus, Plus, ArrowRight, Tag, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { useToast } from '@/hooks/useToast';

export default function CartPage() {
  const { 
    items, 
    updateQty, 
    removeItem, 
    getSubtotal, 
    getDiscount, 
    getShipping, 
    getTotal, 
    applyPromo, 
    promoCode, 
    removePromo 
  } = useCartStore();
  
  const { addToast } = useToast();
  const [promoInput, setPromoInput] = useState('');
  const [isValidating, setIsValidating] = useState(false);

  const handleApplyPromo = () => {
    if (!promoInput) return;
    setIsValidating(true);
    
    // Simulate API call
    setTimeout(() => {
      const code = promoInput.toUpperCase();
      const subtotal = getSubtotal();

      if (code === 'DRIP10') {
        applyPromo(code, 'PERCENT', 10);
        addToast('10% discount applied!', 'success');
      } else if (code === 'NEST20') {
        if (subtotal >= 80) {
          applyPromo(code, 'PERCENT', 20);
          addToast('20% discount applied!', 'success');
        } else {
          addToast(`Minimum order ${formatPrice(80)} required for NEST20`, 'error');
        }
      } else if (code === 'FIRST30') {
        if (subtotal >= 120) {
          applyPromo(code, 'FLAT', 30);
          addToast('$30 discount applied!', 'success');
        } else {
          addToast(`Minimum order ${formatPrice(120)} required for FIRST30`, 'error');
        }
      } else {
        addToast('Invalid promo code', 'error');
      }
      setIsValidating(false);
    }, 800);
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-32 flex flex-col items-center text-center">
        <div className="w-24 h-24 bg-mist rounded-full flex items-center justify-center text-violet mb-8">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h1 className="font-serif text-4xl font-bold mb-4">Your cart is empty</h1>
        <p className="text-neutral-500 max-w-sm mb-10">
          Looks like you haven't added anything to your cart yet. Browse our collections and find your drip.
        </p>
        <Link href="/shop" className="contents">
          <Button size="lg" variant="violet" className="px-12 font-bold uppercase tracking-widest">
            Start Shopping
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 md:px-8 py-12">
      <h1 className="font-serif text-4xl font-bold mb-10 tracking-tight">Shopping Cart</h1>

      <div className="flex flex-col lg:flex-row gap-12 items-start">
        
        {/* Left: Items */}
        <div className="flex-1 w-full space-y-6">
          <div className="hidden md:grid grid-cols-12 gap-4 pb-4 border-b border-neutral-100 text-xs font-bold uppercase tracking-widest text-neutral-400">
            <div className="col-span-6">Product</div>
            <div className="col-span-2 text-center">Price</div>
            <div className="col-span-2 text-center">Quantity</div>
            <div className="col-span-2 text-right">Total</div>
          </div>

          {items.map((item) => (
            <div key={item.cartItemId} className="grid grid-cols-1 md:grid-cols-12 gap-4 py-6 border-b border-neutral-100 items-center group">
              <div className="col-span-full md:col-span-6 flex gap-4">
                <Link href={`/shop/p/${item.productId}`} className="relative w-20 h-28 bg-mist rounded-sm overflow-hidden flex-shrink-0">
                  <Image src={item.image} alt={item.name} fill className="object-cover" />
                </Link>
                <div className="flex flex-col justify-between py-1">
                  <div>
                    <h3 className="font-bold text-neutral-900 group-hover:text-violet transition-colors">
                      <Link href={`/shop/p/${item.productId}`}>{item.name}</Link>
                    </h3>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
                      {item.colour && <span className="text-xs text-neutral-400">Colour: <span className="text-black font-medium">{item.colour}</span></span>}
                      {item.size && <span className="text-xs text-neutral-400">Size: <span className="text-black font-medium">{item.size}</span></span>}
                    </div>
                  </div>
                  <button 
                    onClick={() => removeItem(item.cartItemId)}
                    className="flex items-center gap-1.5 text-xs text-red font-bold uppercase tracking-widest mt-2 hover:opacity-80 transition-opacity"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Remove
                  </button>
                </div>
              </div>

              <div className="hidden md:block col-span-2 text-center font-medium">
                {formatPrice(item.price)}
              </div>

              <div className="col-span-2 flex justify-center">
                <div className="flex items-center border border-neutral-200 rounded-sm bg-white">
                  <button 
                    disabled={item.qty <= 1}
                    onClick={() => updateQty(item.cartItemId, item.qty - 1)}
                    className="p-1 px-3 hover:bg-neutral-50 disabled:opacity-30 transition-colors"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-8 text-center font-bold text-sm">{item.qty}</span>
                  <button 
                    disabled={item.qty >= item.stock}
                    onClick={() => updateQty(item.cartItemId, item.qty + 1)}
                    className="p-1 px-3 hover:bg-neutral-50 disabled:opacity-30 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="col-span-2 text-right font-bold text-lg">
                {formatPrice(item.price * item.qty)}
              </div>
            </div>
          ))}

          <div className="pt-8">
             <Link href="/shop" className="text-sm font-bold uppercase tracking-widest text-violet hover:text-black transition-colors flex items-center gap-2">
               &larr; Continue Shopping
             </Link>
          </div>
        </div>

        {/* Right: Summary */}
        <aside className="w-full lg:w-[380px] space-y-6 lg:sticky lg:top-32">
          <div className="bg-white border border-neutral-100 rounded-sm p-8 shadow-sm">
            <h2 className="font-serif text-2xl font-bold mb-8 border-b border-black pb-4">Order Summary</h2>
            
            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-neutral-600">
                <span>Subtotal</span>
                <span className="text-black font-bold">{formatPrice(getSubtotal())}</span>
              </div>
              
              <div className="flex justify-between text-neutral-600">
                <span>Shipping</span>
                <span className="text-black font-bold">
                  {getShipping() === 0 ? 'FREE' : formatPrice(getShipping())}
                </span>
              </div>

              {getDiscount() > 0 && (
                <div className="flex justify-between text-green">
                  <span className="flex items-center gap-2">
                    Discount ({promoCode})
                    <button onClick={removePromo} className="hover:text-red transition-colors">
                      <Tag className="w-3.5 h-3.5" />
                    </button>
                  </span>
                  <span className="font-bold">-{formatPrice(getDiscount())}</span>
                </div>
              )}

              <div className="pt-4 border-t border-neutral-100 flex justify-between items-end">
                <span className="font-bold text-lg">Total</span>
                <div className="text-right">
                   <p className="text-3xl font-black">{formatPrice(getTotal())}</p>
                   <p className="text-[10px] text-neutral-400 uppercase tracking-widest font-bold mt-1">Inclusive of all taxes</p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-neutral-500">Promo Code</label>
                <div className="flex gap-2">
                  <Input 
                    placeholder="ENTER CODE" 
                    className="bg-mist border-0 font-bold uppercase tracking-widest"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                  />
                  <Button 
                    variant="violet" 
                    onClick={handleApplyPromo}
                    isLoading={isValidating}
                    disabled={!promoInput || isValidating}
                  >
                    Apply
                  </Button>
                </div>
              </div>

              <Link href="/checkout" className="contents">
                <Button variant="primary" size="lg" className="w-full py-8 text-lg font-black uppercase tracking-[0.2em] group">
                  Proceed to Checkout
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform" />
                </Button>
              </Link>

              <div className="flex items-center justify-center gap-4 py-2">
                <div className="h-6 w-10 bg-neutral-100 rounded"></div>
                <div className="h-6 w-10 bg-neutral-100 rounded"></div>
                <div className="h-6 w-10 bg-neutral-100 rounded"></div>
              </div>
            </div>
          </div>

          <div className="bg-mist/30 border border-mist p-6 rounded-sm text-center">
           <p className="text-sm font-medium">Free delivery on orders over <span className="font-bold">{formatPrice(50)}</span></p>
          </div>
        </aside>

      </div>
    </div>
  );
}
