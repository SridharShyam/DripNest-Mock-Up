import { prisma } from '@/lib/db';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Clock } from 'lucide-react';
import { ProductCard } from '@/components/product/ProductCard';
import { Button } from '@/components/ui/Button';
import { formatPrice } from '@/lib/utils';

// Revalidate every hour
export const revalidate = 3600;

export default async function Home() {
  const [featuredProducts, newArrivals, saleProducts, reviews] = await Promise.all([
    prisma.product.findMany({ where: { isFeatured: true }, take: 8, include: { variants: true } }),
    prisma.product.findMany({ where: { isNew: true }, take: 6, include: { variants: true } }),
    prisma.product.findMany({ where: { isSale: true }, take: 4, include: { variants: true } }),
    prisma.review.findMany({ take: 3, orderBy: { rating: 'desc' }, include: { user: true, product: true } }),
  ]);

  const mockReviews = [
    { id: '1', user: { name: 'Sarah Jenkins' }, product: { name: 'Satin Wrap Top' }, rating: 5, body: 'The quality is absolutely incredible! Feels like it should cost three times as much.' },
    { id: '2', user: { name: 'Marcus T' }, product: { name: 'Utility Bomber Jacket' }, rating: 5, body: 'Perfect fit. Exactly the streetwear aesthetic I was going for. Highly recommend the Olive colour.' },
    { id: '3', user: { name: 'Elena R.' }, product: { name: 'Classic Oxford Shirt' }, rating: 4.8, body: 'Bought this for my husband and he wears it everywhere. Super easy to iron and looks premium.' },
  ];

  const displayReviews = reviews.length >= 3 ? reviews : mockReviews;

  return (
    <div className="w-full relative pb-20">
      
      {/* Auto-scrolling Ticker */}
      <div className="bg-violet text-white text-xs md:text-sm py-2 overflow-hidden whitespace-nowrap border-b border-black">
        <div className="marquee">
          {Array(4).fill(0).map((_, i) => (
            <div key={i} className="marquee__content font-medium uppercase tracking-widest flex items-center gap-12 px-6">
              <span>Free Shipping on orders over {formatPrice(50)}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-white opacity-50" />
              <span>New Arrivals Every Friday</span>
              <span className="w-1.5 h-1.5 rounded-full bg-white opacity-50" />
              <span>Use DRIP10 for 10% off your first order</span>
              <span className="w-1.5 h-1.5 rounded-full bg-white opacity-50" />
              <span>Easy 30-Day Returns</span>
              <span className="w-1.5 h-1.5 rounded-full bg-white opacity-50" />
            </div>
          ))}
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative h-[90vh] min-h-[600px] flex flex-col md:flex-row bg-charcoal text-white">
        <div className="flex-1 flex flex-col justify-center px-8 md:px-16 lg:px-24 xl:px-32 z-10 py-20 md:py-0">
          <div className="overflow-hidden">
            <h1 className="font-serif text-6xl md:text-7xl lg:text-8xl xl:text-[7rem] font-bold leading-[0.9] tracking-tighter mb-6">
              <span className="block animate-slide-up-fade" style={{ animationDelay: '0.1s' }}>Your Drip.</span>
              <span className="block animate-slide-up-fade text-mist" style={{ animationDelay: '0.2s' }}>Your Nest.</span>
            </h1>
          </div>
          <p className="text-neutral-400 text-lg md:text-xl max-w-md mb-10 animate-slide-up-fade" style={{ animationDelay: '0.3s' }}>
            Elevate your everyday wardrobe with our curated collection of contemporary luxury and streetwear essentials.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 animate-slide-up-fade" style={{ animationDelay: '0.4s' }}>
            <Link href="/shop" className="contents">
              <Button size="lg" className="bg-white text-black hover:bg-mist w-full sm:w-auto font-bold tracking-wide uppercase">
                Shop Now
              </Button>
            </Link>
            <Link href="/shop?filter=new" className="contents">
              <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10 w-full sm:w-auto font-bold tracking-wide uppercase">
                New Arrivals
              </Button>
            </Link>
          </div>
        </div>

        <div className="hidden md:grid grid-cols-2 grid-rows-2 flex-1 w-full h-full relative">
          <Link href="/shop?category=WOMENS" className="group relative w-full h-full overflow-hidden block">
            <Image src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=800" alt="Women" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-500" />
            <div className="absolute bottom-8 left-8">
              <h3 className="font-serif text-3xl font-bold translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">Women</h3>
            </div>
          </Link>
          <Link href="/shop?category=MENS" className="group relative w-full h-full overflow-hidden block">
            <Image src="https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&q=80&w=800" alt="Men" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors duration-500" />
            <div className="absolute bottom-8 left-8">
              <h3 className="font-serif text-3xl font-bold translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">Men</h3>
            </div>
          </Link>
          <Link href="/shop?category=ACCESSORIES" className="group relative w-full h-full overflow-hidden block">
            <Image src="https://images.unsplash.com/photo-1611085392856-c04d6a6a2521?auto=format&fit=crop&q=80&w=800" alt="Accessories" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-500" />
            <div className="absolute bottom-8 left-8">
              <h3 className="font-serif text-3xl font-bold translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">Accessories</h3>
            </div>
          </Link>
          <div className="bg-violet p-12 flex flex-col justify-center items-start text-white relative overflow-hidden group">
            <h3 className="font-serif text-4xl mb-4 relative z-10 leading-tight">Spring<br/>Collection<br/>'26</h3>
            <Link href="/shop?filter=new" className="inline-flex items-center gap-2 uppercase tracking-wider text-sm font-bold mt-4 hover:gap-4 transition-all relative z-10 border-b border-transparent hover:border-white pb-1">
              Explore <ArrowRight className="w-4 h-4" />
            </Link>
            <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-black/10 rounded-full blur-3xl group-hover:bg-black/20 transition-colors" />
          </div>
        </div>
      </section>

      {/* Feature Strip */}
      <div className="container mx-auto px-4 py-12 border-b border-neutral-100 mb-20 hidden lg:block">
        <div className="grid grid-cols-4 gap-4 divide-x divide-neutral-200">
          {["Free Shipping over $50", "Easy 30-Day Returns", "Secure SSL Payment", "24/7 Expert Support"].map((f, i) => (
            <div key={i} className="px-6 text-center">
              <p className="font-bold text-sm tracking-wide uppercase space-y-1">{f}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Products Row */}
      <section className="container mx-auto px-4 md:px-8 mb-24">
        <div className="flex items-end justify-between mb-10">
          <h2 className="font-serif text-4xl font-bold tracking-tight">Trending Now</h2>
          <Link href="/shop" className="text-black hover:text-violet font-semibold transition-colors flex items-center gap-1 border-b border-black pb-0.5 uppercase tracking-wider text-sm">
            View All
          </Link>
        </div>
        
        <div className="flex overflow-x-auto pb-8 -mx-4 px-4 snap-x snap-mandatory hide-scroll gap-6 md:gap-8 lg:grid lg:grid-cols-4 lg:overflow-visible lg:p-0 lg:m-0">
          {featuredProducts.map((product) => (
            <div key={product.id} className="w-[80vw] sm:w-[50vw] md:w-[40vw] lg:w-auto flex-shrink-0 snap-start">
              <ProductCard product={product as any} />
            </div>
          ))}
        </div>
      </section>

      {/* Category Split Banner */}
      <section className="container mx-auto px-4 md:px-8 mb-24 flex flex-col md:flex-row gap-6">
        <Link href="/shop?category=MENS" className="relative h-[60vh] md:h-[70vh] flex-1 group overflow-hidden block">
          <Image src="https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=1200" alt="Men's Essentials" fill className="object-cover group-hover:scale-[1.03] transition-transform duration-1000" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute bottom-10 left-10 p-4">
            <h2 className="font-serif text-4xl text-white font-bold mb-3">Men's Essentials</h2>
            <span className="inline-flex text-white font-medium uppercase tracking-wider text-sm group-hover:translate-x-3 transition-transform duration-300">
              Shop Men &rarr;
            </span>
          </div>
        </Link>
        <Link href="/shop?category=WOMENS" className="relative h-[60vh] md:h-[70vh] flex-1 group overflow-hidden block">
          <Image src="https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&q=80&w=1200" alt="Women's Collection" fill className="object-cover group-hover:scale-[1.03] transition-transform duration-1000" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute bottom-10 left-10 p-4">
            <h2 className="font-serif text-4xl text-white font-bold mb-3">Women's Edit</h2>
            <span className="inline-flex text-white font-medium uppercase tracking-wider text-sm group-hover:translate-x-3 transition-transform duration-300">
              Shop Women &rarr;
            </span>
          </div>
        </Link>
      </section>

      {/* New Arrivals Grid */}
      <section className="bg-mist py-24 px-4 md:px-8 mb-24">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-serif text-5xl font-bold tracking-tight mb-4">Fresh Drops</h2>
            <p className="text-neutral-600 max-w-lg mx-auto mb-6">Discover the latest additions to our collection. Straight from our design house to your wardrobe.</p>
            <Link href="/shop?filter=new" className="inline-block bg-black text-white px-8 py-3 font-bold uppercase tracking-widest text-sm hover:bg-black/90 transition-colors">
              Explore All New
            </Link>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
            {newArrivals.map((product) => (
               <div key={product.id} className="bg-white rounded p-2">
                 <ProductCard product={product as any} />
               </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sale Countdown */}
      <section className="container mx-auto px-4 md:px-8 mb-24">
        <div className="bg-red text-white p-8 md:p-12 rounded-sm flex flex-col md:flex-row items-center justify-between shadow-2xl overflow-hidden relative">
           <div className="relative z-10 max-w-xl text-center md:text-left mb-8 md:mb-0">
             <h2 className="font-serif text-5xl font-bold mb-4">Flash Sale ends in</h2>
             <div className="flex items-center justify-center md:justify-start gap-4 mb-8 font-serif text-4xl font-bold tabular-nums">
               <div className="flex flex-col items-center bg-black/20 p-3 rounded-md min-w-20"><span suppressHydrationWarning>{48}</span><span className="text-xs font-sans uppercase font-medium mt-1">Hours</span></div>
               <span className="text-red-200">:</span>
               <div className="flex flex-col items-center bg-black/20 p-3 rounded-md min-w-20"><span suppressHydrationWarning>{0}</span><span className="text-xs font-sans uppercase font-medium mt-1">Mins</span></div>
               <span className="text-red-200">:</span>
               <div className="flex flex-col items-center bg-black/20 p-3 rounded-md min-w-20"><span suppressHydrationWarning>{0}</span><span className="text-xs font-sans uppercase font-medium mt-1">Secs</span></div>
             </div>
             <Link href="/shop?filter=sale" className="contents">
                <Button variant="outline" size="lg" className="border-white text-black bg-white hover:bg-neutral-100 w-full sm:w-auto font-bold px-10">
                  Shop Up to 50% Off
                </Button>
             </Link>
           </div>
           
           <div className="flex-1 w-full max-w-lg relative z-10 grid grid-cols-2 gap-4">
             {saleProducts.map((p) => {
               const imgs = typeof p.images === 'string' ? JSON.parse(p.images) : p.images;
               return (
                 <Link href={`/shop/${p.slug}`} key={p.id} className="block group relative bg-white rounded-sm overflow-hidden shadow-lg border border-red-800">
                    <img src={imgs[0]} className="w-full aspect-[4/5] object-cover" alt="Sale" />
                    <div className="p-3 bg-white text-black text-center border-t border-neutral-100">
                      <p className="font-bold text-sm tracking-tight truncate">{p.name}</p>
                       <p className="text-red font-bold mt-1">{formatPrice(p.price)} <span className="line-through text-neutral-400 text-xs ml-1">{p.comparePrice ? formatPrice(p.comparePrice) : ''}</span></p>
                    </div>
                 </Link>
               )
             })}
           </div>

           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-black/5 rounded-full blur-3xl" />
        </div>
      </section>

      {/* Lookbook Mosaic */}
      <section className="mb-24 px-2 container mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl font-bold tracking-tight">On The Gram</h2>
          <p className="text-neutral-500 mt-2">@dripnestofficial</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 lg:gap-4 auto-rows-[200px] md:auto-rows-[300px]">
          <div className="relative col-span-1 row-span-1 group overflow-hidden bg-neutral-200">
            <Image src="https://images.unsplash.com/photo-1529139513055-0643d42488a4?auto=format&fit=crop&q=80&w=800" fill alt="look 1" className="object-cover group-hover:scale-105 transition-all duration-500" />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 flex items-center justify-center transition-all">
              <InstagramIcon />
            </div>
          </div>
          <div className="relative col-span-2 row-span-2 group overflow-hidden bg-neutral-200">
            <Image src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&q=80&w=1000" fill alt="look 2" className="object-cover group-hover:scale-105 transition-all duration-500" />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 flex items-center justify-center transition-all">
              <InstagramIcon />
            </div>
          </div>
          <div className="relative col-span-1 row-span-1 group overflow-hidden bg-neutral-200">
            <Image src="https://images.unsplash.com/photo-1523381235312-3c1a47f50249?auto=format&fit=crop&q=80&w=800" fill alt="look 3" className="object-cover group-hover:scale-105 transition-all duration-500" />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 flex items-center justify-center transition-all">
              <InstagramIcon />
            </div>
          </div>
          <div className="relative col-span-1 row-span-1 group overflow-hidden bg-neutral-200">
            <Image src="https://images.unsplash.com/photo-1549037173-e3b717902c57?auto=format&fit=crop&q=80&w=800" fill alt="look 4" className="object-cover group-hover:scale-105 transition-all duration-500" />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 flex items-center justify-center transition-all">
              <InstagramIcon />
            </div>
          </div>
          <div className="relative col-span-1 row-span-1 group overflow-hidden bg-neutral-200">
            <Image src="https://images.unsplash.com/photo-1552346154-21d328109a27?auto=format&fit=crop&q=80&w=800" fill alt="look 5" className="object-cover group-hover:scale-105 transition-all duration-500" />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 flex items-center justify-center transition-all">
              <InstagramIcon />
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

const InstagramIcon = () => (
   <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-0 group-hover:opacity-100 transition-opacity"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
)
