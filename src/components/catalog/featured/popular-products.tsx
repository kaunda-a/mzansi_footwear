import { ProductCatalog } from "@/features/product/components/product-catalog";
import { Suspense } from "react";
import { ProductFilterWrapper } from "@/components/catalog/filters/product-filter-wrapper";

export function PopularProducts() {
  return (
    <div className="bg-muted/30 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8 text-center">
          <p className="text-muted-foreground">
            Discover our most loved footwear
          </p>
        </div>

        <ProductFilterWrapper>
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
        </ProductFilterWrapper>
      </div>
    </div>
  );
}