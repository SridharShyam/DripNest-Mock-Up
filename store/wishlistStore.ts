import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface WishlistItem {
  productId: string;
  name: string;
  price: number;
  comparePrice?: number | null;
  image: string;
}

interface WishlistState {
  items: WishlistItem[];
  
  toggleItem: (item: WishlistItem) => void;
  removeItem: (productId: string) => void;
  clearWishlist: () => void;
  isInWishlist: (productId: string) => boolean;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],

      toggleItem: (newItem) => {
        const items = get().items;
        const exists = items.some(i => i.productId === newItem.productId);
        if (exists) {
          set({ items: items.filter(i => i.productId !== newItem.productId) });
        } else {
          set({ items: [...items, newItem] });
        }
      },

      removeItem: (productId) => {
        set((state) => ({ items: state.items.filter(i => i.productId !== productId) }));
      },

      clearWishlist: () => set({ items: [] }),

      isInWishlist: (productId) => {
        return get().items.some(i => i.productId === productId);
      }
    }),
    {
      name: 'dripnest-wishlist',
    }
  )
);
