import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  cartItemId: string; // unique literal for an item in cart combining ID, size, colour
  productId: string;
  name: string;
  price: number;
  comparePrice?: number | null;
  image: string;
  size?: string;
  colour?: string;
  qty: number;
  stock: number;
}

interface CartState {
  items: CartItem[];
  promoCode: string | null;
  discountValue: number | null;
  discountType: 'PERCENT' | 'FLAT' | null;
  
  addItem: (item: CartItem) => void;
  removeItem: (cartItemId: string) => void;
  updateQty: (cartItemId: string, qty: number) => void;
  clearCart: () => void;
  applyPromo: (code: string, type: 'PERCENT' | 'FLAT', value: number) => void;
  removePromo: () => void;
  
  // Computed values getters
  getSubtotal: () => number;
  getDiscount: () => number;
  getShipping: () => number;
  getTotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      promoCode: null,
      discountValue: null,
      discountType: null,

      addItem: (newItem) => {
        set((state) => {
          const existing = state.items.find(i => i.cartItemId === newItem.cartItemId);
          if (existing) {
            return {
              items: state.items.map(i => 
                i.cartItemId === newItem.cartItemId 
                  ? { ...i, qty: Math.min(i.qty + newItem.qty, i.stock) } 
                  : i
              )
            };
          }
          return { items: [...state.items, newItem] };
        });
      },

      removeItem: (cartItemId) => {
        set((state) => ({ items: state.items.filter(i => i.cartItemId !== cartItemId) }));
      },

      updateQty: (cartItemId, qty) => {
        set((state) => ({
          items: state.items.map(i => i.cartItemId === cartItemId ? { ...i, qty } : i)
        }));
      },

      clearCart: () => set({ items: [], promoCode: null, discountValue: null, discountType: null }),

      applyPromo: (code, type, value) => set({ promoCode: code, discountType: type, discountValue: value }),
      
      removePromo: () => set({ promoCode: null, discountValue: null, discountType: null }),

      getSubtotal: () => {
        return get().items.reduce((acc, item) => acc + (item.price * item.qty), 0);
      },

      getDiscount: () => {
        const subtotal = get().getSubtotal();
        const type = get().discountType;
        const value = get().discountValue;
        if (!type || !value) return 0;
        
        if (type === 'PERCENT') {
          return subtotal * (value / 100);
        }
        return Math.min(value, subtotal);
      },

      getShipping: () => {
        const subt = get().getSubtotal();
        if (subt === 0) return 0;
        return subt >= 50 ? 0 : 5.99;
      },

      getTotal: () => {
        const subtotal = get().getSubtotal();
        const discount = get().getDiscount();
        const shipping = get().getShipping();
        return Math.max(0, subtotal - discount) + shipping;
      },

      getItemCount: () => {
        return get().items.reduce((acc, item) => acc + item.qty, 0);
      }
    }),
    {
      name: 'dripnest-cart',
    }
  )
);
