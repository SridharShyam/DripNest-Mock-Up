'use client';

import { useWishlistStore } from '@/store/wishlistStore';
import { useCartStore } from '@/store/cartStore';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { formatPrice } from '@/lib/utils';
import { Trash2, ShoppingBag, Heart, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useToast } from '@/hooks/useToast';

export default function WishlistPage() {
  const { items, removeItem } = useWishlistStore();
  const { addItem } = useCartStore();
  const { addToast } = useToast();

  const handleMoveToCart = (item: any) => {
    addItem({
      cartItemId: `${item.productId}-OS-STD`, // Simplified for wishlist logic
      productId: item.productId,
      name: item.name,
      price: item.price,
      comparePrice: item.comparePrice,
      image: item.image,
      qty: 1,
      stock: 10 // Mock stock
    });
    removeItem(item.productId);
    addToast('Moved to cart!', 'success');
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-32 flex flex-col items-center text-center">
        <div className="w-24 h-24 bg-mist rounded-full flex items-center justify-center text-violet mb-8">
          <Heart className="w-10 h-10" />
        </div>
        <h1 className="font-serif text-4xl font-bold mb-4">Your wishlist is empty</h1>
        <p className="text-neutral-500 max-w-sm mb-10">
          Save your favorite items here to keep track of them.
        </p>
        <Link href="/shop" className="contents">
          <Button size="lg" variant="violet" className="px-12 font-bold uppercase tracking-widest">
            Explore Collection
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 md:px-8 py-12">
      <h1 className="font-serif text-4xl font-bold mb-10 tracking-tight">My Wishlist</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {items.map((item) => (
          <div key={item.productId} className="group bg-white border border-neutral-100 rounded-sm overflow-hidden flex flex-col hover:shadow-xl transition-shadow">
            <Link href={`/shop/${item.productId}`} className="relative aspect-[3/4] overflow-hidden block">
              <Image src={item.image} alt={item.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
              {item.comparePrice && item.comparePrice > item.price && (
                <Badge variant="sale" className="absolute top-4 left-4">Sale</Badge>
              )}
            </Link>
            
            <div className="p-6 flex flex-col flex-1">
              <h3 className="font-bold text-lg mb-2 line-clamp-1">{item.name}</h3>
              <div className="flex items-center gap-3 mb-6">
                <span className="font-bold text-xl">{formatPrice(item.price)}</span>
                {item.comparePrice && (
                  <span className="text-neutral-400 line-through text-sm">{formatPrice(item.comparePrice)}</span>
                )}
              </div>

              <div className="mt-auto space-y-3">
                <Button 
                  onClick={() => handleMoveToCart(item)}
                  variant="violet" 
                  className="w-full font-bold uppercase tracking-widest py-6"
                >
                  <ShoppingBag className="w-4 h-4 mr-2" /> Add to Cart
                </Button>
                <button 
                  onClick={() => removeItem(item.productId)}
                  className="w-full py-2 text-xs font-bold text-neutral-400 hover:text-red transition-colors uppercase tracking-widest flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Remove from Wishlist
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
