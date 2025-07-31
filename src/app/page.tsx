import { Header } from '@/components/layout/header';
import { Navbar } from '@/components/layout/navbar';
import { StoreFooter } from '@/components/layout/store-footer';
import { MarqueeContainer } from '@/components/marquee-container';
import { BillboardContainer } from '@/components/layout/billboard-container';
import { CarouselBillboardContainer } from '@/components/layout/carousel-billboard-container';
import { FeaturedProducts } from '@/components/sections/featured-products';
import { ProductCatalog } from '@/features/product/components/product-catalog';
import { Suspense } from 'react';


export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <Header />

      <main className="flex-1">
        {/* Hero Carousel Billboard - Database Driven */}
        <div className="container mx-auto px-4 py-6">
          <CarouselBillboardContainer
            position="HEADER"
            height="h-48 md:h-64 lg:h-80"
            autoPlay={true}
            autoPlayInterval={4000}
            showDots={true}
            showArrows={true}
          />
        </div>

        {/* Secondary Billboard */}
        <div className="container mx-auto px-4 py-4">
          <BillboardContainer
            position="FOOTER"
            compact={true}
            className="h-32 md:h-40 rounded-lg"
          />
        </div>

        {/* Featured Products */}
        <FeaturedProducts />

        {/* Popular Products */}
        <div className="bg-muted/30 py-12">
          <div className="container mx-auto px-4">
            <div className="mb-8 text-center">
              <h2 className="text-2xl md:text-3xl font-bold mb-2">Popular Products</h2>
              <p className="text-muted-foreground">Discover our most loved footwear</p>
            </div>

            <Suspense fallback={
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="space-y-4">
                    <div className="aspect-square bg-muted rounded animate-pulse" />
                    <div className="space-y-2">
                      <div className="h-3 w-1/2 bg-muted rounded animate-pulse" />
                      <div className="h-4 w-3/4 bg-muted rounded animate-pulse" />
                      <div className="h-3 w-1/3 bg-muted rounded animate-pulse" />
                      <div className="h-6 w-1/2 bg-muted rounded animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>
            }>
              <ProductCatalog
                searchParams={{}}
                showSort={false}
                showPagination={false}
                limit={8}
                featured={true}
              />
            </Suspense>
          </div>
        </div>

        <MarqueeContainer />
      </main>

      <StoreFooter />
    </div>
  );
}
