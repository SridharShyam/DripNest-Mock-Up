'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useCartStore } from '@/store/cartStore';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { formatPrice } from '@/lib/utils';
import { Check, ChevronRight, MapPin, Truck, ShieldCheck, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/useToast';

export default function CheckoutPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { items, getSubtotal, getDiscount, getShipping, getTotal, clearCart, promoCode } = useCartStore();
  const { addToast } = useToast();

  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);

  // Form states
  const [address, setAddress] = useState({
    fullName: '',
    phone: '',
    line1: '',
    line2: '',
    city: '',
    state: '',
    pincode: '',
    country: 'United States'
  });

  const [deliveryMethod, setDeliveryMethod] = useState('standard');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?redirect=/checkout');
    }
    if (items.length === 0 && step !== 4) {
      router.push('/cart');
    }
  }, [status, items, router, step]);

  const handleNextStep = () => {
    if (step === 1) {
      if (!address.fullName || !address.line1 || !address.city || !address.pincode) {
        addToast('Please fill in all required address fields', 'error');
        return;
      }
    }
    setStep(step + 1);
    window.scrollTo(0, 0);
  };

  const handlePrevStep = () => {
    setStep(step - 1);
    window.scrollTo(0, 0);
  };

  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    
    try {
      // Simulate API call to create order
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map(i => ({
            productId: i.productId,
            name: i.name,
            image: i.image,
            qty: i.qty,
            price: i.price,
            size: i.size,
            colour: i.colour
          })),
          subtotal: getSubtotal(),
          discount: getDiscount(),
          shipping: getShipping(),
          total: getTotal(),
          promoCode: promoCode,
          address: `${address.fullName}, ${address.line1}, ${address.city}, ${address.state} - ${address.pincode}`
        })
      });

      if (response.ok) {
        const order = await response.json();
        clearCart();
        router.push(`/order/${order.id}/confirmation`);
      } else {
        addToast('Failed to place order. Please try again.', 'error');
      }
    } catch (error) {
      addToast('An error occurred. Please try again.', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  if (status === 'loading') return <div className="h-screen flex items-center justify-center font-serif text-2xl font-bold">DripNest.</div>;

  const steps = [
    { id: 1, name: 'Address', icon: MapPin },
    { id: 2, name: 'Delivery', icon: Truck },
    { id: 3, name: 'Review', icon: Check }
  ];

  return (
    <div className="container mx-auto px-4 md:px-8 py-12 min-h-screen">
      <div className="max-w-5xl mx-auto">
        
        {/* Step Indicator */}
        <div className="flex items-center justify-center mb-16 px-4">
          {steps.map((s, i) => (
            <div key={s.id} className="flex items-center">
              <div className={`flex flex-col items-center relative`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${step >= s.id ? 'bg-black border-black text-white shadow-lg' : 'bg-white border-neutral-200 text-neutral-400'}`}>
                  {step > s.id ? <Check className="w-5 h-5" /> : <s.icon className="w-5 h-5" />}
                </div>
                <span className={`absolute -bottom-7 text-[10px] font-black uppercase tracking-widest whitespace-nowrap ${step >= s.id ? 'text-black' : 'text-neutral-400'}`}>
                  {s.name}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div className={`w-16 sm:w-24 md:w-32 h-0.5 mx-2 transition-all duration-500 ${step > s.id ? 'bg-black' : 'bg-neutral-200'}`} />
              )}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Main Form Area */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* STEP 1: ADDRESS */}
            {step === 1 && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                <h2 className="font-serif text-3xl font-bold mb-8">Shipping Address</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="text-xs font-black uppercase tracking-widest text-neutral-500 mb-2 block">Full Name *</label>
                    <Input 
                      placeholder="John Doe" 
                      value={address.fullName} 
                      onChange={(e) => setAddress({...address, fullName: e.target.value})} 
                    />
                  </div>
                  <div>
                    <label className="text-xs font-black uppercase tracking-widest text-neutral-500 mb-2 block">Phone *</label>
                    <Input 
                      placeholder="+1 (555) 000-0000" 
                      value={address.phone}
                      onChange={(e) => setAddress({...address, phone: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-black uppercase tracking-widest text-neutral-500 mb-2 block">Pincode / ZIP *</label>
                    <Input 
                      placeholder="10001" 
                      value={address.pincode}
                      onChange={(e) => setAddress({...address, pincode: e.target.value})}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-xs font-black uppercase tracking-widest text-neutral-500 mb-2 block">Address Line 1 *</label>
                    <Input 
                      placeholder="Street name, Apartment, etc." 
                      value={address.line1}
                      onChange={(e) => setAddress({...address, line1: e.target.value})}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-xs font-black uppercase tracking-widest text-neutral-500 mb-2 block">Address Line 2 (Optional)</label>
                    <Input 
                      placeholder="Suite, unit, floor, etc." 
                      value={address.line2}
                      onChange={(e) => setAddress({...address, line2: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-black uppercase tracking-widest text-neutral-500 mb-2 block">City *</label>
                    <Input 
                      placeholder="New York" 
                      value={address.city}
                      onChange={(e) => setAddress({...address, city: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-black uppercase tracking-widest text-neutral-500 mb-2 block">State *</label>
                    <Input 
                      placeholder="NY" 
                      value={address.state}
                      onChange={(e) => setAddress({...address, state: e.target.value})}
                    />
                  </div>
                </div>
                <div className="mt-12">
                  <Button onClick={handleNextStep} variant="violet" className="w-full py-8 text-lg font-black uppercase tracking-[0.2em] shadow-xl hover:translate-y-[-2px] transition-transform">
                    Continue to Delivery
                  </Button>
                </div>
              </div>
            )}

            {/* STEP 2: DELIVERY */}
            {step === 2 && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                <h2 className="font-serif text-3xl font-bold mb-8">Delivery Method</h2>
                <div className="space-y-4">
                  {[
                    { id: 'standard', name: 'Standard Delivery', time: '5–7 business days', price: getSubtotal() >= 50 ? 'FREE' : formatPrice(5.99) },
                    { id: 'express', name: 'Express Delivery', time: '2–3 business days', price: formatPrice(9.99) },
                    { id: 'prime', name: 'Next-Day Delivery', time: 'Tomorrow', price: formatPrice(19.99) }
                  ].map((m) => (
                    <label 
                      key={m.id} 
                      className={`flex items-center justify-between p-6 border-2 rounded-sm cursor-pointer transition-all ${deliveryMethod === m.id ? 'border-violet bg-mist/20 shadow-md' : 'border-neutral-100 hover:border-neutral-200'}`}
                    >
                      <div className="flex items-center gap-4">
                        <input 
                          type="radio" 
                          name="delivery" 
                          checked={deliveryMethod === m.id} 
                          onChange={() => setDeliveryMethod(m.id)}
                          className="w-5 h-5 accent-violet"
                        />
                        <div>
                          <p className="font-bold text-lg">{m.name}</p>
                          <p className="text-sm text-neutral-500">{m.time}</p>
                        </div>
                      </div>
                      <span className="font-black text-lg">{m.price}</span>
                    </label>
                  ))}
                </div>
                <div className="mt-12 flex gap-4">
                  <Button onClick={handlePrevStep} variant="outline" className="py-8 font-black uppercase">
                    Back
                  </Button>
                  <Button onClick={handleNextStep} variant="violet" className="flex-1 py-8 text-lg font-black uppercase tracking-[0.2em] shadow-xl hover:translate-y-[-2px] transition-transform">
                    Review Order
                  </Button>
                </div>
              </div>
            )}

            {/* STEP 3: REVIEW */}
            {step === 3 && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                <h2 className="font-serif text-3xl font-bold mb-8">Review Order</h2>
                
                <div className="space-y-6">
                  <div className="p-6 bg-white border border-neutral-100 rounded-sm">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="font-bold uppercase tracking-widest text-xs text-neutral-400">Shipping To</h3>
                      <button onClick={() => setStep(1)} className="text-violet font-bold text-xs uppercase hover:underline underline-offset-4">Edit</button>
                    </div>
                    <p className="font-bold text-lg">{address.fullName}</p>
                    <p className="text-neutral-600">{address.line1}, {address.line2 && address.line2 + ','} {address.city}, {address.state} {address.pincode}</p>
                    <p className="text-neutral-600">{address.phone}</p>
                  </div>

                  <div className="p-6 bg-white border border-neutral-100 rounded-sm">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="font-bold uppercase tracking-widest text-xs text-neutral-400">Delivery via</h3>
                      <button onClick={() => setStep(2)} className="text-violet font-bold text-xs uppercase hover:underline underline-offset-4">Edit</button>
                    </div>
                    <p className="font-bold text-lg">{deliveryMethod === 'standard' ? 'Standard' : deliveryMethod === 'express' ? 'Express' : 'Next-Day'} Delivery</p>
                    <p className="text-neutral-600">Est. Arrival: {deliveryMethod === 'standard' ? '5–7 days' : deliveryMethod === 'express' ? '2–3 days' : 'Tomorrow'}</p>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-bold uppercase tracking-widest text-xs text-neutral-400 px-1">Order Items</h3>
                    {items.map((item) => (
                      <div key={item.cartItemId} className="flex gap-4 p-4 bg-mist/20 border border-mist/30 rounded-sm">
                        <div className="relative w-16 h-20 flex-shrink-0 bg-neutral-200 rounded-sm overflow-hidden">
                          <img src={item.image} alt={item.name} className="object-cover w-full h-full" />
                        </div>
                        <div className="flex-1 flex flex-col justify-center">
                          <p className="font-bold text-sm leading-tight">{item.name}</p>
                          <p className="text-xs text-neutral-500 mt-1 uppercase tracking-tight font-medium">
                            {item.size} / {item.colour} • Qty {item.qty}
                          </p>
                        </div>
                        <div className="font-bold flex flex-col items-end justify-center">
                          <span>{formatPrice(item.price * item.qty)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-12 flex gap-4">
                  <Button onClick={handlePrevStep} variant="outline" className="py-8 font-black uppercase">
                    Back
                  </Button>
                  <Button 
                    onClick={handlePlaceOrder} 
                    variant="violet" 
                    isLoading={isProcessing}
                    className="flex-1 py-8 text-xl font-black uppercase tracking-[0.3em] shadow-2xl bg-gradient-to-r from-violet to-lavender hover:scale-[1.02] active:scale-[0.98] transition-all"
                  >
                    Place Order
                  </Button>
                </div>
              </div>
            )}
            
          </div>

          {/* Sidebar Summary */}
          <aside className="lg:col-span-5">
            <div className="bg-charcoal text-white p-8 rounded-sm sticky top-32 shadow-2xl">
              <h2 className="font-serif text-2xl font-bold mb-8 border-b border-white/10 pb-4">Payment Summary</h2>
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-neutral-400">
                  <span>Subtotal</span>
                  <span className="text-white font-bold">{formatPrice(getSubtotal())}</span>
                </div>
                <div className="flex justify-between text-neutral-400">
                  <span>Shipping</span>
                  <span className="text-white font-bold">{getShipping() === 0 ? 'FREE' : formatPrice(getShipping())}</span>
                </div>
                {getDiscount() > 0 && (
                  <div className="flex justify-between text-violet">
                    <span>Discount</span>
                    <span className="font-bold">-{formatPrice(getDiscount())}</span>
                  </div>
                )}
                <div className="pt-6 border-t border-white/10 flex justify-between items-end">
                  <span className="font-serif text-xl font-bold">Grand Total</span>
                  <span className="text-4xl font-black">{formatPrice(getTotal())}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-white/5 rounded-sm border border-white/10 mb-8">
                <ShieldCheck className="w-5 h-5 text-green-400" />
                <p className="text-[10px] uppercase font-black tracking-widest leading-normal">
                  Secure Encryption<br/>
                  <span className="text-neutral-500">Your order is protected by SSL</span>
                </p>
              </div>

              <div className="text-[10px] text-neutral-500 uppercase font-bold text-center spacing tracking-[0.2em]">
                Fast. Secure. DripNest.
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
