import Link from 'next/link';
import { Instagram, Twitter, PinIcon } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-charcoal text-white pt-16 pb-8 border-t border-neutral-800">
      <div className="container mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
        <div className="space-y-4">
          <Link href="/" className="font-serif text-2xl tracking-tighter font-bold text-white group relative z-50">
            DripNest<span className="text-violet">.</span>
          </Link>
          <p className="text-neutral-400 text-sm leading-relaxed max-w-xs">
            Your Drip. Your Nest. Bold streetwear meets accessible luxury.
          </p>
          <div className="flex items-center gap-4 text-neutral-400">
            <a href="#" target="_blank" className="hover:text-white transition-colors"><Instagram className="w-5 h-5" /></a>
            <a href="#" target="_blank" className="hover:text-white transition-colors"><Twitter className="w-5 h-5" /></a>
            <a href="#" target="_blank" className="hover:text-white transition-colors"><PinIcon className="w-5 h-5" /></a>
          </div>
        </div>
        
        <div className="space-y-4">
          <h4 className="font-sans font-bold uppercase tracking-wider text-sm mb-4">Shop</h4>
          <ul className="space-y-3 text-neutral-400 text-sm">
            <li><Link href="/shop/mens" className="hover:text-violet transition-colors">Men's Wear</Link></li>
            <li><Link href="/shop/womens" className="hover:text-violet transition-colors">Women's Wear</Link></li>
            <li><Link href="/shop/apparel" className="hover:text-violet transition-colors">Apparel</Link></li>
            <li><Link href="/shop/accessories" className="hover:text-violet transition-colors">Accessories</Link></li>
            <li><Link href="/shop?filter=sale" className="hover:text-violet transition-colors">Sale</Link></li>
          </ul>
        </div>

        <div className="space-y-4">
          <h4 className="font-sans font-bold uppercase tracking-wider text-sm mb-4">Help</h4>
          <ul className="space-y-3 text-neutral-400 text-sm">
            <li><Link href="/faqs" className="hover:text-violet transition-colors">FAQs</Link></li>
            <li><Link href="/returns" className="hover:text-violet transition-colors">Returns & Exchanges</Link></li>
            <li><Link href="/shipping" className="hover:text-violet transition-colors">Shipping Info</Link></li>
            <li><Link href="/size-guide" className="hover:text-violet transition-colors">Size Guide</Link></li>
          </ul>
        </div>

        <div className="space-y-4">
          <h4 className="font-sans font-bold uppercase tracking-wider text-sm mb-4">Company</h4>
          <ul className="space-y-3 text-neutral-400 text-sm">
            <li><Link href="/about" className="hover:text-violet transition-colors">About Us</Link></li>
            <li><Link href="/careers" className="hover:text-violet transition-colors">Careers</Link></li>
            <li><Link href="/press" className="hover:text-violet transition-colors">Press</Link></li>
            <li><Link href="/sustainability" className="hover:text-violet transition-colors">Sustainability</Link></li>
          </ul>
        </div>
      </div>
      
      <div className="border-t border-neutral-800 container mx-auto px-4 md:px-8 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
        <p>&copy; {new Date().getFullYear()} DripNest. All rights reserved.</p>
        <div className="flex items-center gap-2">
          {/* Faux payment icons */}
          <div className="h-6 w-10 bg-neutral-800 rounded"></div>
          <div className="h-6 w-10 bg-neutral-800 rounded"></div>
          <div className="h-6 w-10 bg-neutral-800 rounded"></div>
        </div>
      </div>
    </footer>
  );
}
