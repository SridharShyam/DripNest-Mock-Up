import { create } from 'zustand';

interface UIState {
  isCartOpen: boolean;
  isMobileMenuOpen: boolean;
  isSearchOpen: boolean;
  
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  
  toggleMobileMenu: () => void;
  closeMobileMenu: () => void;
  
  toggleSearch: () => void;
  closeSearch: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  isCartOpen: false,
  isMobileMenuOpen: false,
  isSearchOpen: false,

  toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen, isMobileMenuOpen: false, isSearchOpen: false })),
  openCart: () => set({ isCartOpen: true }),
  closeCart: () => set({ isCartOpen: false }),

  toggleMobileMenu: () => set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen, isCartOpen: false, isSearchOpen: false })),
  closeMobileMenu: () => set({ isMobileMenuOpen: false }),

  toggleSearch: () => set((state) => ({ isSearchOpen: !state.isSearchOpen, isCartOpen: false, isMobileMenuOpen: false })),
  closeSearch: () => set({ isSearchOpen: false }),
}));
