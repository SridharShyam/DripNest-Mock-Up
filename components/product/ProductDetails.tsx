'use client';

import { useState } from 'react';
import { Star, Heart, ShieldCheck, Truck, RotateCcw, Plus, Minus } from 'lucide-react';
import { ImageGallery } from './ImageGallery';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { formatPrice } from '@/lib/utils';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { StockAlertForm } from './StockAlertForm';
import { useToast } from '@/hooks/useToast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { StarRating } from '@/components/ui/StarRating';

interface ProductDetailsProps {
  product: any; // Type properly in production
}

export function ProductDetails({ product }: ProductDetailsProps) {
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColour, setSelectedColour] = useState<string>(product.variants?.[0]?.colour || '');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');

  const { addItem } = useCartStore();
  const { toggleItem, isInWishlist } = useWishlistStore();
  const { addToast } = useToast();

  const images = typeof product.images === 'string' ? JSON.parse(product.images) : product.images;
  const isWishlisted = isInWishlist(product.id);

  const availableVariants = product.variants.filter((v: any) => v.colour === selectedColour || !selectedColour);
  const selectedVariant = availableVariants.find((v: any) => v.size === selectedSize);
  
  const handleAddToCart = () => {
    if (product.variants.length > 0 && !selectedSize) {
      addToast('Please select a size', 'error');
      return;
    }

    const itemToAdd = {
      cartItemId: `${product.id}-${selectedSize || 'OS'}-${selectedColour || 'STD'}`,
      productId: product.id,
      name: product.name,
      price: product.price,
      comparePrice: product.comparePrice,
      image: images[0],
      size: selectedSize || undefined,
      colour: selectedColour || undefined,
      qty: quantity,
      stock: selectedVariant?.stock || product.stock || 0
    };

    addItem(itemToAdd);
    addToast('Added to cart!', 'success');
  };

  const handleWishlist = () => {
    toggleItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      comparePrice: product.comparePrice,
      image: images[0]
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
      {/* Left: Gallery */}
      <div className="lg:col-span-7">
        <ImageGallery images={images} />
      </div>

      {/* Right: Info */}
      <div className="lg:col-span-5 flex flex-col">
        <div className="mb-6">
          <p className="text-sm text-neutral-500 uppercase tracking-widest font-bold mb-2">{product.brand}</p>
          <h1 className="text-4xl md:text-5xl font-serif font-bold tracking-tight mb-4">{product.name}</h1>
          
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center gap-1">
              <StarRating rating={product.rating} readonly />
              <span className="text-sm font-medium ml-1">({product.reviewCount} reviews)</span>
            </div>
            <span className="w-px h-4 bg-neutral-200" />
            <Badge variant={product.stock > 0 ? "success" : "error"}>
              {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
            </Badge>
          </div>

          <div className="flex items-center gap-4 mb-8">
            <span className="text-3xl font-bold">{formatPrice(product.price)}</span>
            {product.comparePrice && (
              <>
                <span className="text-xl text-neutral-400 line-through">{formatPrice(product.comparePrice)}</span>
                <Badge variant="sale">
                  {Math.round((1 - product.price / product.comparePrice) * 100)}% OFF
                </Badge>
              </>
            )}
          </div>
        </div>

        {/* Variations */}
        <div className="space-y-8 mb-10">
          {/* Colours */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider mb-4">Colour: <span className="text-neutral-500">{selectedColour}</span></h4>
            <div className="flex flex-wrap gap-3">
              {Array.from(new Set(product.variants.map((v: any) => v.colour))).map((colour: any) => {
                const variant = product.variants.find((v: any) => v.colour === colour);
                return (
                  <button
                    key={colour}
                    onClick={() => setSelectedColour(colour)}
                    className={`w-10 h-10 rounded-full border-2 transition-all ${selectedColour === colour ? 'border-violet scale-110' : 'border-transparent'}`}
                    style={{ backgroundColor: variant?.colourHex || '#ccc' }}
                    title={colour}
                  />
                );
              })}
            </div>
          </div>

          {/* Sizes */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-sm font-bold uppercase tracking-wider">Size: <span className="text-neutral-500">{selectedSize}</span></h4>
              <button className="text-xs font-bold text-violet underline uppercase tracking-widest">Size Guide</button>
            </div>
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
              {Array.from(new Set(product.variants.map((v: any) => v.size))).map((size: any) => {
                const variant = product.variants.find((v: any) => v.size === size && v.colour === selectedColour);
                const isOutOfStock = variant ? variant.stock === 0 : true;
                
                return (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`h-12 border rounded-sm font-bold transition-all text-sm uppercase relative ${
                      selectedSize === size 
                        ? 'bg-black text-white border-black' 
                        : 'bg-white text-black border-neutral-200 hover:border-black'
                    } ${isOutOfStock ? 'opacity-60' : ''}`}
                  >
                    {size}
                    {isOutOfStock && (
                      <span className="absolute top-0 right-0 w-2 h-2 bg-neutral-300 rounded-full m-1" title="Out of stock" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="flex flex-col gap-4 mb-10">
          {selectedVariant && selectedVariant.stock === 0 ? (
            <div className="space-y-4">
              <StockAlertForm 
                productId={product.id}
                variantId={selectedVariant.id}
                size={selectedSize}
                colour={selectedColour}
              />
            </div>
          ) : (
            <div className="flex gap-4">
              <div className="flex items-center border border-neutral-200 rounded-sm">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-3 hover:bg-neutral-50 transition-colors"
                  disabled={quantity <= 1}
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center font-bold">{quantity}</span>
                <button 
                  onClick={() => setQuantity(Math.min(selectedVariant?.stock || 50, quantity + 1))}
                  className="p-3 hover:bg-neutral-50 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <Button 
                className="flex-1 py-6 text-base font-bold uppercase tracking-widest"
                variant="violet"
                disabled={product.stock === 0 || !selectedVariant}
                onClick={handleAddToCart}
              >
                Add to Cart
              </Button>
              <Button 
                variant="outline" 
                className={`p-4 ${isWishlisted ? 'text-violet border-violet bg-mist' : ''}`}
                onClick={handleWishlist}
              >
                <Heart className={`w-6 h-6 ${isWishlisted ? 'fill-current' : ''}`} />
              </Button>
            </div>
          )}
        </div>

        {/* Benefits */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 py-8 border-y border-neutral-100 mb-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-mist rounded-full flex items-center justify-center text-violet">
              <Truck className="w-5 h-5" />
            </div>
            <div className="text-xs uppercase font-bold tracking-tight">Free<br/>Shipping</div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-mist rounded-full flex items-center justify-center text-violet">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div className="text-xs uppercase font-bold tracking-tight">30-Day<br/>Returns</div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-mist rounded-full flex items-center justify-center text-violet">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="text-xs uppercase font-bold tracking-tight">Secure<br/>Checkout</div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="description" className="w-full">
          <TabsList className="w-full justify-start border-b border-neutral-100 rounded-none bg-transparent h-auto p-0 mb-6">
            <TabsTrigger value="description" className="rounded-none border-b-2 border-transparent data-[state=active]:border-black data-[state=active]:bg-transparent px-0 py-4 mr-8 text-sm font-bold uppercase tracking-widest">Description</TabsTrigger>
            <TabsTrigger value="details" className="rounded-none border-b-2 border-transparent data-[state=active]:border-black data-[state=active]:bg-transparent px-0 py-4 mr-8 text-sm font-bold uppercase tracking-widest">Details</TabsTrigger>
            <TabsTrigger value="shipping" className="rounded-none border-b-2 border-transparent data-[state=active]:border-black data-[state=active]:bg-transparent px-0 py-4 text-sm font-bold uppercase tracking-widest">Shipping</TabsTrigger>
          </TabsList>
          <TabsContent value="description" className="text-neutral-600 leading-relaxed">
            {product.description}
          </TabsContent>
          <TabsContent value="details" className="text-neutral-600 leading-relaxed">
            <ul className="list-disc pl-5 space-y-2">
              <li>Premium quality material</li>
              <li>Signature DripNest branding</li>
              <li>Regular fit</li>
              <li>Ethically sourced and manufactured</li>
            </ul>
          </TabsContent>
          <TabsContent value="shipping" className="text-neutral-600 leading-relaxed">
            Standard delivery takes 3-5 business days. Express options available at checkout. 30-day easy returns policy.
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
