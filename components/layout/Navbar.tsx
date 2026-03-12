'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Search, ShoppingBag, Heart, Menu, User, LogOut, LayoutDashboard } from 'lucide-react';
import { useUIStore } from '@/store/uiStore';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

export function Navbar() {
  const { toggleCart, toggleMobileMenu, toggleSearch } = useUIStore();
  const itemCount = useCartStore((state) => state.getItemCount());
  const wishlistItems = useWishlistStore((state) => state.items.length);
  const { data: session } = useSession();
  
  const [isScrolled, setIsScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setDropdownOpen(false);
  }, [pathname]);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${isScrolled ? 'bg-white/80 backdrop-blur-md shadow-sm py-4' : 'bg-transparent py-6'}`}
    >
      <div className="container mx-auto px-4 md:px-8 flex items-center justify-between">
        
        {/* Mobile menu button */}
        <button onClick={toggleMobileMenu} className="lg:hidden text-black p-2 -ml-2">
          <Menu className="w-6 h-6" />
        </button>

        {/* Logo */}
        <Link href="/" className="font-serif text-2xl tracking-tighter font-bold text-black group relative z-50">
          DripNest<span className="text-violet">.</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-8 font-medium text-sm capitalize">
          <Link href="/shop?category=MENS" className="hover:text-violet transition-colors">Men</Link>
          <Link href="/shop?category=WOMENS" className="hover:text-violet transition-colors">Women</Link>
          <Link href="/shop?category=APPAREL" className="hover:text-violet transition-colors">Apparel</Link>
          <Link href="/shop?category=ACCESSORIES" className="hover:text-violet transition-colors">Accessories</Link>
          <Link href="/track" className="hover:text-violet transition-colors font-bold uppercase tracking-wider text-[11px] bg-mist px-3 py-1 rounded-full">Track Order</Link>
          <Link href="/shop?filter=sale" className="text-red hover:opacity-80 transition-colors">Sale</Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3 md:gap-5 relative z-50">
          <button onClick={toggleSearch} className="text-black hover:text-violet transition-colors p-2 hidden sm:block">
            <Search className="w-5 h-5" />
          </button>
          
          <div className="relative group/user" onMouseLeave={() => setDropdownOpen(false)}>
            {session ? (
              <button 
                onClick={() => setDropdownOpen(!dropdownOpen)} 
                className="text-black hover:text-violet transition-colors p-2"
              >
                {/* Fallback avatar */}
                <div className="w-6 h-6 rounded-full bg-violet text-white flex items-center justify-center text-xs font-bold">
                  {session.user?.name?.[0]?.toUpperCase() || 'U'}
                </div>
              </button>
            ) : (
              <Link href="/login" className="text-black hover:text-violet transition-colors p-2 hidden sm:block">
                <User className="w-5 h-5" />
              </Link>
            )}

            {dropdownOpen && session && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-neutral-100 shadow-xl rounded-md py-2 text-sm">
                <div className="px-4 py-2 border-b border-neutral-100 mb-2 truncate">
                  <p className="font-bold text-black">{session.user?.name}</p>
                  <p className="text-neutral-500 text-xs truncate">{(session.user as any)?.email}</p>
                </div>
                {(session.user as any)?.role === 'ADMIN' && (
                  <Link href="/admin" className="flex items-center gap-2 px-4 py-2 hover:bg-mist transition-colors">
                    <LayoutDashboard className="w-4 h-4" /> Admin Panel
                  </Link>
                )}
                <Link href="/account" className="flex items-center gap-2 px-4 py-2 hover:bg-mist transition-colors">
                  <User className="w-4 h-4" /> My Account
                </Link>
                <Link href="/account?tab=orders" className="flex items-center gap-2 px-4 py-2 hover:bg-mist transition-colors">
                  <ShoppingBag className="w-4 h-4" /> My Orders
                </Link>
                <button 
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="flex items-center gap-2 px-4 py-2 hover:bg-red/10 text-red w-full text-left transition-colors"
                >
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </div>
            )}
          </div>

          <Link href="/account?tab=wishlist" className="relative text-black hover:text-violet transition-colors p-2 hidden sm:block">
            <Heart className="w-5 h-5" />
            {wishlistItems > 0 && (
              <span className="absolute top-0 right-0 w-4 h-4 bg-violet text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {wishlistItems}
              </span>
            )}
          </Link>

          <button onClick={toggleCart} className="relative text-black hover:text-violet transition-colors p-2">
            <ShoppingBag className="w-5 h-5" />
            {itemCount > 0 && (
              <span className="absolute top-0 right-0 w-4 h-4 bg-black text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
