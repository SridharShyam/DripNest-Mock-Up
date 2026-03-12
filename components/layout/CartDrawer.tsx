'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useUIStore } from '@/store/uiStore';
import { useCartStore } from '@/store/cartStore';
import { X, Minus, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { formatPrice } from '@/lib/utils';
import Link from 'next/link';
import Image from 'next/image';

export function CartDrawer() {
  const { isCartOpen, closeCart } = useUIStore();
  const { items, updateQty, removeItem, getTotal } = useCartStore();

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/50 z-[100] backdrop-blur-sm"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl z-[101] flex flex-col"
          >
            <div className="flex items-center justify-between p-6 border-b border-neutral-100">
              <h2 className="font-serif text-2xl font-bold">Your Cart</h2>
              <button 
                onClick={closeCart}
                className="p-2 hover:bg-neutral-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
              {items.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center gap-4">
                  <div className="w-24 h-24 bg-mist rounded-full flex items-center justify-center text-violet mb-4">
                    <Trash2 className="w-10 h-10 opacity-50" />
                  </div>
                  <h3 className="text-xl font-bold font-serif">Your cart is empty</h3>
                  <p className="text-neutral-500 mb-6">Looks like you haven't added anything yet.</p>
                  <Button onClick={closeCart} variant="violet" className="w-full max-w-[200px]">
                    Continue Shopping
                  </Button>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.cartItemId} className="flex gap-4 group">
                    <div className="relative w-24 h-32 bg-mist rounded-sm overflow-hidden flex-shrink-0">
                      <Image 
                        src={item.image} 
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-between py-1">
                      <div>
                        <div className="flex justify-between items-start gap-2">
                          <h4 className="font-medium text-sm line-clamp-2">{item.name}</h4>
                          <button
                            onClick={() => removeItem(item.cartItemId)}
                            className="text-neutral-400 hover:text-red transition-colors p-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="text-xs text-neutral-500 mt-1 flex items-center gap-2">
                          {item.colour && <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-neutral-300" />{item.colour}</span>}
                          {item.size && <span>Size: {item.size}</span>}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center border border-neutral-200 rounded-sm">
                          <button 
                            disabled={item.qty <= 1}
                            onClick={() => updateQty(item.cartItemId, item.qty - 1)}
                            className="p-1 px-2 hover:bg-neutral-100 disabled:opacity-50 transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-sm font-medium w-6 text-center">{item.qty}</span>
                          <button 
                            disabled={item.qty >= item.stock}
                            onClick={() => updateQty(item.cartItemId, item.qty + 1)}
                            className="p-1 px-2 hover:bg-neutral-100 disabled:opacity-50 transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <p className="font-bold">{formatPrice(item.price * item.qty)}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {items.length > 0 && (
              <div className="border-t border-neutral-100 p-6 bg-cream/50 space-y-4">
                <div className="flex justify-between items-center text-lg font-bold font-serif">
                  <span>Subtotal</span>
                  <span>{formatPrice(getTotal())}</span>
                </div>
                <p className="text-xs text-neutral-500">Shipping and taxes calculated at checkout.</p>
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <Link href="/cart" className="contents">
                    <Button variant="outline" className="w-full" onClick={closeCart}>
                      View Cart
                    </Button>
                  </Link>
                  <Link href="/checkout" className="contents">
                    <Button variant="violet" className="w-full" onClick={closeCart}>
                      Checkout
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
