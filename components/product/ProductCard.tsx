'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Heart, Star } from 'lucide-react';
import { useWishlistStore } from '@/store/wishlistStore';
import { useCartStore } from '@/store/cartStore';
import { useToast } from '@/hooks/useToast';
import { Badge } from '@/components/ui/Badge';
import { formatPrice } from '@/lib/utils';
import { useState } from 'react';
import { Prisma } from '@prisma/client';

type ProductWithVariants = Prisma.ProductGetPayload<{ include: { variants: true } }>;

interface ProductCardProps {
  product: ProductWithVariants;
  view?: 'grid' | 'list';
}

export function ProductCard({ product, view = 'grid' }: ProductCardProps) {
  const { isInWishlist, toggleItem } = useWishlistStore();
  const { addItem } = useCartStore();
  const { addToast } = useToast();
  
  const [isHovered, setIsHovered] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);

  // We are parsing tags/images because we used SQLite
  const images: string[] = typeof product.images === 'string' ? JSON.parse(product.images) : product.images;
  const inWishlist = isInWishlist(product.id);
  const stock = product.stock;

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    toggleItem({ 
      productId: product.id, 
      name: product.name, 
      price: product.price, 
      comparePrice: product.comparePrice, 
      image: images[0] 
    });
    if (!inWishlist) {
      addToast('Added to wishlist', 'info');
    }
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    setAddingToCart(true);
    
    // Simplistic quick add - pick first variant
    const variant = product.variants?.[0];
    if (variant && variant.stock > 0) {
      addItem({
        cartItemId: `${product.id}-${variant.size || 'OS'}-${variant.colour || 'STD'}`,
        productId: product.id,
        name: product.name,
        price: product.price,
        comparePrice: product.comparePrice,
        image: images[0],
        size: variant.size || undefined,
        colour: variant.colour || undefined,
        qty: 1,
        stock: variant.stock,
      });
      addToast('Added to cart ✓', 'success');
    } else {
      addToast('Selected item is out of stock', 'error');
    }
    
    setTimeout(() => setAddingToCart(false), 800);
  };

  if (view === 'list') {
    return (
      <Link href={`/shop/${product.slug}`} className="group flex gap-6 bg-white border border-neutral-100 p-4 hover:shadow-lg transition-all rounded-sm">
        <div className="relative w-48 h-64 bg-mist flex-shrink-0 origin-center overflow-hidden">
          <Image 
            src={images[0]} 
            alt={product.name} 
            fill 
            className="object-cover group-hover:scale-105 transition-transform duration-500" 
          />
          {product.isSale && <Badge variant="sale" className="absolute top-2 left-2">Sale</Badge>}
          {product.isNew && !product.isSale && <Badge variant="new" className="absolute top-2 left-2">New</Badge>}
        </div>
        <div className="flex-1 flex flex-col pt-2">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs text-neutral-500 uppercase tracking-wider mb-1">{product.brand}</p>
              <h3 className="text-xl font-medium font-serif">{product.name}</h3>
            </div>
            <button onClick={handleWishlist} className={`p-2 rounded-full hover:bg-neutral-100 transition-colors ${inWishlist ? 'text-violet' : 'text-neutral-400'}`}>
              <Heart className={`w-5 h-5 ${inWishlist ? 'fill-current' : ''}`} />
            </button>
          </div>
          
          <div className="flex items-center gap-1 mt-2 text-sm">
            <Star className="w-4 h-4 fill-gold text-gold" />
            <span className="font-medium">{product.rating.toFixed(1)}</span>
            <span className="text-neutral-400">({product.reviewCount})</span>
          </div>

          <p className="text-neutral-600 mt-4 line-clamp-2">{product.description}</p>

          <div className="mt-auto flex items-end justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold">{formatPrice(product.price)}</span>
              {product.comparePrice && (
                <span className="text-neutral-400 line-through text-sm">{formatPrice(product.comparePrice)}</span>
              )}
            </div>
            <button 
              onClick={handleQuickAdd}
              disabled={stock === 0 || addingToCart}
              className="px-6 py-2 bg-black text-white rounded-sm font-medium hover:bg-black/80 disabled:opacity-50 transition-colors"
            >
              {addingToCart ? 'Added!' : (stock === 0 ? 'Out of stock' : 'Add to Cart')}
            </button>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link 
      href={`/shop/${product.slug}`} 
      className="group relative flex flex-col"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-[3/4] bg-mist w-full rounded-sm overflow-hidden mb-3">
        <Image 
          src={isHovered && images.length > 1 ? images[1] : images[0]} 
          alt={product.name} 
          fill 
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-opacity duration-500" 
        />
        
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.isSale && <Badge variant="sale">Sale</Badge>}
          {product.isNew && !product.isSale && <Badge variant="new">New</Badge>}
        </div>

        <button 
          onClick={handleWishlist} 
          className="absolute top-2 right-2 p-2 bg-white/50 backdrop-blur-sm rounded-full text-black hover:bg-white transition-colors z-10"
        >
          <Heart className={`w-4 h-4 ${inWishlist ? 'fill-violet text-violet' : ''}`} />
        </button>

        <div className={`absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300 pointer-events-none group-hover:pointer-events-auto`}>
          <button 
            onClick={handleQuickAdd}
            disabled={stock === 0 || addingToCart}
            className="w-full py-2.5 bg-white/90 backdrop-blur text-black font-semibold text-sm rounded-sm hover:bg-white disabled:opacity-50"
          >
            {addingToCart ? 'Added!' : (stock === 0 ? 'Out of stock' : '+ Quick Add')}
          </button>
        </div>
      </div>

      <div className="flex flex-col flex-1 px-1">
        <div className="flex justify-between items-start w-full">
          <p className="text-[10px] text-neutral-500 uppercase tracking-wider">{product.brand}</p>
          <div className="flex items-center gap-1 text-xs">
            <Star className="w-3 h-3 fill-gold text-gold" />
            <span>{product.rating.toFixed(1)}</span>
          </div>
        </div>
        <h3 className="font-serif font-medium leading-tight mt-1 line-clamp-1 group-hover:text-violet transition-colors">
          {product.name}
        </h3>
        
        <div className="mt-1 flex items-center gap-2 text-sm">
          <span className="font-bold">{formatPrice(product.price)}</span>
          {product.comparePrice && (
            <span className="text-neutral-400 line-through text-xs">{formatPrice(product.comparePrice)}</span>
          )}
        </div>

        {/* Colours */}
        <div className="mt-2 flex gap-1">
           {/* Very basic unique color extraction for the grid */}
           {Array.from(new Set(product.variants.filter(v => !!v.colourHex).map(v => v.colourHex))).slice(0, 4).map((hex, idx) => (
             <span key={idx} className="w-2.5 h-2.5 rounded-full border border-neutral-200" style={{ backgroundColor: hex || '#ccc' }} />
           ))}
        </div>
      </div>
    </Link>
  );
}
