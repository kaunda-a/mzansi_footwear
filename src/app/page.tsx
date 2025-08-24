import Header from "@/components/layout/header";
import { StoreFooter } from "@/components/layout/footer";
import { MarqueeContainer } from "@/components/catalog/marquee-container";
import { BillboardContainer } from "@/components/catalog/billboard-container";
import { CarouselBillboardContainer } from "@/components/catalog/carousel-billboard-container";
import { FeaturedProducts } from "@/components/catalog/featured-products";
import { ProductCatalog } from "@/features/product/components/product-catalog";
import { TrendingContainer } from "@/components/catalog/trending/trending-container";
import { Suspense } from "react";
import type { SearchParams } from "nuqs/server";

type PageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function HomePage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1">
        {/* Hero Carousel Billboard - Database Driven */}
        <div className="container mx-auto px-4">
          <CarouselBillboardContainer
            position="HEADER"
            height="h-48 md:h-64 lg:h-80"
            autoPlay={true}
            autoPlayInterval={4000}
            showDots={true}
            showArrows={true}
          />
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-8">
          <TrendingContainer searchParams={resolvedSearchParams} />
        </div>

        {/* Popular Products */}
        <div className="bg-muted/30 py-8">
          <div className="container mx-auto px-4">
            <div className="mb-8 text-center">
              <p className="text-muted-foreground">
                Discover our most loved footwear
              </p>
            </div>

            <Suspense
              fallback={
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-2 sm:gap-3 md:gap-4">
                  {Array.from({ length: 14 }).map((_, i) => (
                    <div key={i} className="space-y-2">
                      <div className="aspect-square bg-muted rounded animate-pulse" />
                      <div className="space-y-1 px-1">
                        <div className="h-3 w-full bg-muted rounded animate-pulse" />
                        <div className="h-3 w-3/4 bg-muted rounded animate-pulse" />
                        <div className="h-4 w-1/2 bg-muted rounded animate-pulse" />
                      </div>
                    </div>
                  ))}
                </div>
              }
            >
              <ProductCatalog
                searchParams={{}}
                showSort={false}
                showPagination={false}
                limit={14}
                featured={true}
              />
            </Suspense>
          </div>
        </div>
        {/* Secondary Billboard */}
        <div className="container mx-auto px-4 py-4">
          <BillboardContainer
            position="FOOTER"
            compact={true}
            className="h-32 md:h-40 rounded-lg"
          />
        </div>
        <FeaturedProducts />
      </main>
      <MarqueeContainer />
      <StoreFooter />
    </div>
  );
}
