import { Suspense } from "react";
import Header from "@/components/layout/header";
import { StoreFooter } from "@/components/layout/footer";
import { ProductCatalog } from "@/features/product/components/product-catalog";
import { ProductFilters } from "@/features/product/components/product-filters";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { BillboardContainer } from "@/components/catalog/billboard-container";

interface ProductsPageProps {
  searchParams: Promise<{
    page?: string;
    sort?: string;
    category?: string;
    brand?: string;
    minPrice?: string;
    maxPrice?: string;
    search?: string;
    size?: string;
    color?: string;
  }>;
}

export default async function ProductsPage({
  searchParams,
}: ProductsPageProps) {
  const params = await searchParams;

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1">
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
                  <BreadcrumbPage>Products</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </div>

        {/* Products Page Billboard */}
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
                <h1 className="text-2xl md:text-3xl font-bold">All Products</h1>
                <p className="mt-2 text-muted-foreground">
                  Discover our complete collection of premium footwear
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-8">
          <div className="lg:grid lg:grid-cols-4 lg:gap-8">
            {/* Filters Sidebar */}
            <div className="hidden lg:block">
              <div className="sticky top-24">
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
                <ProductCatalog
                  searchParams={params}
                  showSort={true}
                  showPagination={true}
                  limit={12}
                />
              </Suspense>
            </div>
          </div>
        </div>
      </main>

      <StoreFooter />
    </div>
  );
}
