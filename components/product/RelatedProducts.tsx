import { prisma } from '@/lib/db';
import { ProductCard } from './ProductCard';

interface RelatedProductsProps {
  category: string;
  currentProductId: string;
}

export async function RelatedProducts({ category, currentProductId }: RelatedProductsProps) {
  const products = await prisma.product.findMany({
    where: {
      category,
      id: { not: currentProductId }
    },
    take: 4,
    include: {
      variants: true
    }
  });

  if (products.length === 0) return null;

  return (
    <div className="w-full">
      <h2 className="font-serif text-3xl font-bold mb-10 tracking-tight">You May Also Like</h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product as any} />
        ))}
      </div>
    </div>
  );
}
