import { prisma } from '@/lib/db';
import { Prisma } from '@prisma/client';
import { ProductCard } from '@/components/product/ProductCard';
import { FilterSidebar } from '@/components/shop/FilterSidebar';
import { SortDropdown } from '@/components/shop/SortDropdown';
import { ActiveFilterChips } from '@/components/shop/ActiveFilterChips';
import { Pagination } from '@/components/ui/Pagination';
import { ViewToggle } from '@/components/shop/ViewToggle';
const ITEMS_PER_PAGE = 12;

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const awaitedSearchParams = await searchParams;
  const page = typeof awaitedSearchParams.page === 'string' ? parseInt(awaitedSearchParams.page) : 1;
  const category = awaitedSearchParams.category as string | undefined;
  const subcategory = awaitedSearchParams.subcategory as string | undefined;
  const filter = awaitedSearchParams.filter as string | undefined;
  const sizes = awaitedSearchParams.size ? (Array.isArray(awaitedSearchParams.size) ? awaitedSearchParams.size : [awaitedSearchParams.size]) : [];
  const colours = awaitedSearchParams.colour ? (Array.isArray(awaitedSearchParams.colour) ? awaitedSearchParams.colour : [awaitedSearchParams.colour]) : [];
  const minPrice = awaitedSearchParams.minPrice ? parseFloat(awaitedSearchParams.minPrice as string) : undefined;
  const maxPrice = awaitedSearchParams.maxPrice ? parseFloat(awaitedSearchParams.maxPrice as string) : undefined;
  const brands = awaitedSearchParams.brand ? (Array.isArray(awaitedSearchParams.brand) ? awaitedSearchParams.brand : [awaitedSearchParams.brand]) : [];
  const rating = awaitedSearchParams.rating ? parseFloat(awaitedSearchParams.rating as string) : undefined;
  const sort = awaitedSearchParams.sort as string | undefined;
  const view = (awaitedSearchParams.view as 'grid' | 'list') || 'grid';

  const where: Prisma.ProductWhereInput = {};

  if (category) {
    if (category.includes(',')) {
      where.category = { in: category.split(',') };
    } else {
      where.category = category;
    }
  }
  if (subcategory) where.subcategory = subcategory;
  
  if (filter === 'sale') where.isSale = true;
  if (filter === 'new') where.isNew = true;

  if (minPrice !== undefined || maxPrice !== undefined) {
    where.price = {};
    if (minPrice !== undefined) where.price.gte = minPrice;
    if (maxPrice !== undefined) where.price.lte = maxPrice;
  }

  if (brands.length > 0) {
    where.brand = { in: brands.flatMap(b => b.split(',')) };
  }

  if (rating) {
    where.rating = { gte: rating };
  }

  // Handle variants (size, colour)
  if (sizes.length > 0 || colours.length > 0) {
    where.variants = {
      some: {
        ...(sizes.length > 0 && { size: { in: sizes.flatMap(s => s.split(',')) } }),
        ...(colours.length > 0 && { colour: { in: colours.flatMap(c => c.split(',')) } }),
      }
    };
  }

  const orderBy: Prisma.ProductOrderByWithRelationInput = {};
  if (sort === 'price-asc') orderBy.price = 'asc';
  else if (sort === 'price-desc') orderBy.price = 'desc';
  else if (sort === 'newest') orderBy.createdAt = 'desc';
  else if (sort === 'rating') orderBy.rating = 'desc';
  else orderBy.isFeatured = 'desc'; // Default recommended

  const [totalProducts, products] = await Promise.all([
    prisma.product.count({ where }),
    prisma.product.findMany({
      where,
      include: { variants: true },
      orderBy,
      skip: (page - 1) * ITEMS_PER_PAGE,
      take: ITEMS_PER_PAGE,
    }),
  ]);

  const totalPages = Math.ceil(totalProducts / ITEMS_PER_PAGE);

  // Extract unique brands for the sidebar
  const allBrandsQuery = await prisma.product.findMany({ select: { brand: true }, distinct: ['brand'] });
  const allBrands = allBrandsQuery.map(b => b.brand).filter(Boolean) as string[];

  return (
    <div className="container mx-auto px-4 md:px-8 py-12 flex flex-col md:flex-row gap-8">
      
      {/* Sidebar Filters */}
      <aside className="w-full md:w-64 flex-shrink-0">
        <FilterSidebar availableBrands={allBrands} currentParams={awaitedSearchParams} />
      </aside>

      {/* Main Content */}
      <main className="flex-1 w-full min-w-0">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h1 className="font-serif text-3xl font-bold tracking-tight">
            {category ? category.replace('_', ' ') : 'All Products'}
            <span className="text-neutral-500 text-sm ml-3 font-sans font-medium">
              Showing {(page - 1) * ITEMS_PER_PAGE + 1}–{Math.min(page * ITEMS_PER_PAGE, totalProducts)} of {totalProducts} results
            </span>
          </h1>
          
          <div className="flex items-center gap-4 self-end sm:self-auto">
            <ViewToggle currentView={view} />
            <SortDropdown currentSort={sort || 'recommended'} />
          </div>
        </div>

        <ActiveFilterChips searchParams={awaitedSearchParams} />

        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center bg-mist/50 rounded-sm">
            <p className="font-bold font-serif text-2xl mb-2">No products found</p>
            <p className="text-neutral-500 max-w-sm mb-6">We couldn't find any items matching your exact filters. Try clearing some selections.</p>
          </div>
        ) : (
          <>
            <div className={view === 'grid' 
              ? "grid grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-8 md:gap-x-6 md:gap-y-12"
              : "flex flex-col gap-6"
            }>
              {products.map((p) => (
                <ProductCard key={p.id} product={p as any} view={view} />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-16 flex justify-center border-t border-neutral-100 pt-8">
                <Pagination currentPage={page} totalPages={totalPages} />
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
