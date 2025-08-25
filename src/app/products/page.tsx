import { Suspense } from "react";
import Header from "@/components/layout/header";
import { StoreFooter } from "@/components/layout/footer";
import { ProductCatalog } from "@/features/product/components/product-catalog";
import ProductCatalogContainer from "@/components/catalog/featured/product-catalog-container";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ProductPageBillboard } from "@/components/catalog/billboard/product-page-billboard";
import type { SearchParams } from "nuqs/server";

type ProductsPageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const resolvedSearchParams = await searchParams;
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
          <ProductPageBillboard />
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
          <ProductCatalogContainer>
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
                searchParams={resolvedSearchParams}
                showSort={true}
                showPagination={true}
                limit={12}
              />
            </Suspense>
          </ProductCatalogContainer>
        </div>
      </main>

      <StoreFooter />
    </div>
  );
}

