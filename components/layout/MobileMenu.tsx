'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useUIStore } from '@/store/uiStore';
import { X, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export function MobileMenu() {
  const { isMobileMenuOpen, closeMobileMenu } = useUIStore();

  const links = [
    { label: "Men", href: "/shop?category=MENS" },
    { label: "Women", href: "/shop?category=WOMENS" },
    { label: "Apparel", href: "/shop?category=APPAREL" },
    { label: "Accessories", href: "/shop?category=ACCESSORIES" },
    { label: "Sale", href: "/shop?filter=sale", special: true },
  ];

  return (
    <AnimatePresence>
      {isMobileMenuOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeMobileMenu}
            className="fixed inset-0 bg-black/60 z-[100] backdrop-blur-md"
          />
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed left-0 top-0 bottom-0 w-[85%] max-w-sm bg-cream shadow-2xl z-[101] flex flex-col"
          >
            <div className="flex items-center justify-between p-6 border-b border-mist bg-white">
              <Link href="/" className="font-serif text-2xl font-bold tracking-tighter" onClick={closeMobileMenu}>
                DripNest<span className="text-violet">.</span>
              </Link>
              <button 
                onClick={closeMobileMenu}
                className="p-2 hover:bg-mist rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-neutral-600" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-6 flex flex-col bg-white">
              <nav className="flex flex-col">
                {links.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={closeMobileMenu}
                    className={`flex items-center justify-between px-8 py-4 border-b border-mist text-lg font-medium transition-colors hover:bg-mist ${
                      link.special ? 'text-red font-bold' : 'text-black'
                    }`}
                  >
                    {link.label}
                    <ChevronRight className="w-4 h-4 text-neutral-300" />
                  </Link>
                ))}
              </nav>

              <div className="mt-8 px-8 space-y-4">
                <Link href="/account" onClick={closeMobileMenu} className="block text-black hover:text-violet font-medium">My Account</Link>
                <Link href="/account?tab=orders" onClick={closeMobileMenu} className="block text-black hover:text-violet font-medium">Orders</Link>
                <Link href="/account?tab=wishlist" onClick={closeMobileMenu} className="block text-black hover:text-violet font-medium">Wishlist</Link>
                <div className="pt-6 border-t border-mist">
                  <Link href="/login" onClick={closeMobileMenu} className="block text-black hover:text-violet font-medium">Sign In / Register</Link>
                </div>
              </div>
            </div>
            
            <div className="p-6 bg-charcoal text-white text-xs text-center border-t border-neutral-800">
              <p>&copy; {new Date().getFullYear()} DripNest. All rights reserved.</p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
