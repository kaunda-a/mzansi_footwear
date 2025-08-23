import Header from "@/components/layout/header";
import { StoreFooter } from "@/components/layout/footer";
import { MarqueeContainer } from "@/components/catalog/marquee-container";
import { BillboardContainer } from "@/components/catalog/billboard-container";
import { CarouselBillboardContainer } from "@/components/catalog/carousel-billboard-container";
import { FeaturedProducts } from "@/components/catalog/featured-products";
import { ProductCatalog } from "@/features/product/components/product-catalog";
import { TrendingProductCatalog } from "@/features/product/components/trending-product-catalog";
import { ProductFilters } from "@/features/product/components/product-filters";
import { CategorySelector } from "@/components/catalog/category-selector";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Suspense } from "react";

export default function HomePage() {
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

        {/* Breadcrumbs */}
        <div className="bg-muted/30 border-b">
          <div className="container mx-auto px-4 py-4">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/">Home</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Trending</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </div>

        {/* Trending Page Billboard */}
        <div className="container mx-auto px-4 py-4">
          <BillboardContainer
            position="HEADER"
            compact={true}
            className="h-32 md:h-40 rounded-lg"
          />
        </div>

        {/* Page Header */}
        <div className="bg-background border-b">
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">Trending Products</h1>
                <p className="mt-2 text-muted-foreground">
                  Discover the most popular and sought-after footwear
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-8">
          <div className="lg:grid lg:grid-cols-4 lg:gap-8">
            {/* Category Selector and Filters Sidebar */}
            <div className="hidden lg:block">
              <div className="sticky top-24 space-y-6">
                <CategorySelector />
                <Suspense
                  fallback={
                    <div className="h-96 bg-muted rounded animate-pulse" />
                  }
                >
                  <ProductFilters />
                </Suspense>
              </div>
            </div>

            {/* Products Grid */}
            <div className="lg:col-span-3">
              <Suspense
                fallback={
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <div className="h-4 w-32 bg-muted rounded animate-pulse" />
                      <div className="h-10 w-48 bg-muted rounded animate-pulse" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {Array.from({ length: 12 }).map((_, i) => (
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
                  </div>
                }
              >
                <TrendingProductCatalog
                  searchParams={{}}
                  showSort={true}
                  showPagination={true}
                  limit={12}
                />
              </Suspense>
            </div>
          </div>
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
