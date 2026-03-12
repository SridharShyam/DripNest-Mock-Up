import { prisma } from '@/lib/db';
import { notFound } from 'next/navigation';
import { ProductDetails } from '@/components/product/ProductDetails';
import { RelatedProducts } from '@/components/product/RelatedProducts';
import { Breadcrumb } from '@/components/ui/Breadcrumb';

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const awaitedParams = await params;
  const product = await prisma.product.findUnique({
    where: { slug: awaitedParams.slug },
    include: {
      variants: true,
      reviews: {
        include: {
          user: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      }
    }
  });

  if (!product) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 md:px-8 py-8">
      <Breadcrumb 
        items={[
          { label: 'Home', href: '/' },
          { label: 'Shop', href: '/shop' },
          { label: product.category, href: `/shop?category=${product.category}` },
          { label: product.name, href: '#' },
        ]} 
      />
      
      <div className="mt-8">
        <ProductDetails product={product as any} />
      </div>

      <div className="mt-24 border-t border-neutral-100 pt-16">
        <RelatedProducts 
          category={product.category} 
          currentProductId={product.id} 
        />
      </div>
    </div>
  );
}
