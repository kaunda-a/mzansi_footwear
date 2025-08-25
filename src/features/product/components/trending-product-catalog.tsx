import React, { Suspense } from "react";
import { ProductGrid } from "./product-grid";
import { ProductPagination } from "./product-pagination";
import { ProductSort as ProductSortComponent } from "./product-sort";
import { Skeleton } from "@/components/ui/skeleton";
import { Api } from "@/lib/api";

interface ProductData {
  products: any[];
  pagination: {
    total: number;
    pages: number;
  };
}

interface TrendingProductCatalogProps {
  searchParams: {
    page?: string;
    sort?: string;
    category?: string;
    brand?: string;
    minPrice?: string;
    maxPrice?: string;
    search?: string;
    size?: string;
    color?: string;
  };
  showSort?: boolean;
  showPagination?: boolean;
  limit?: number;
}

interface TrendingProductCatalogContentProps extends TrendingProductCatalogProps {
  productData: ProductData;
}

function ProductCatalogSkeleton() {
  return (
    <div className="space-y-6">
      {/* Sort skeleton */}
      <div className="flex justify-between items-center">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-10 w-48" />
      </div>

      {/* Grid skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-2 sm:gap-3 md:gap-4">
        {[...Array(14)].map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="aspect-square rounded-lg" />
            <div className="space-y-1 px-1">
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TrendingProductCatalogContent({
  searchParams,
  showSort = true,
  showPagination = true,
  limit = 12,
  productData,
}: TrendingProductCatalogContentProps) {
  const page = parseInt(searchParams.page || "1");
  const { products: clientSafeProducts, pagination } = productData;

  // Handle empty state
  if (!clientSafeProducts || clientSafeProducts.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-semibold mb-2">No trending products found</h3>
        <p className="text-muted-foreground">
          Check back later for trending items.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Results Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="text-sm text-muted-foreground">
          {pagination.total === 0 ? (
            "No products found"
          ) : (
            <>
              Showing {(page - 1) * limit + 1}-
              {Math.min(page * limit, pagination.total)} of {pagination.total}{" "}
              trending products
            </>
          )}
        </div>

        {showSort && clientSafeProducts.length > 0 && (
          <ProductSortComponent currentSort="trending" />
        )}
      </div>

      {/* Products Grid */}
      <ProductGrid products={clientSafeProducts} />

      {/* Pagination */}
      {showPagination && pagination.pages > 1 && (
        <ProductPagination
          currentPage={page}
          totalPages={pagination.pages}
          totalItems={pagination.total}
        />
      )}
    </div>
  );
}

// This component should only be used in Server Components
// It will automatically use server-side API calls when on server
export async function TrendingProductCatalog(props: TrendingProductCatalogProps) {
  const { searchParams, limit = 12 } = props;

  try {
    // Use the Api service which handles server vs client automatically
    const { products: clientSafeProducts, pagination } = await Api.getProducts({
      page: searchParams.page ? parseInt(searchParams.page) : 1,
      limit,
      // For trending, we'll modify the API service to support a trending sort
      sort: "trending",
      category: searchParams.category,
      brand: searchParams.brand,
      minPrice: searchParams.minPrice ? parseFloat(searchParams.minPrice) : undefined,
      maxPrice: searchParams.maxPrice ? parseFloat(searchParams.maxPrice) : undefined,
      size: searchParams.size,
      color: searchParams.color,
    });

    // Check if we have products
    if (!clientSafeProducts || clientSafeProducts.length === 0) {
      return (
        <div className="text-center py-12">
          <h3 className="text-lg font-semibold mb-2">No trending products found</h3>
          <p className="text-muted-foreground">
            Check back later for trending items.
          </p>
        </div>
      );
    }

    const productData = {
      products: clientSafeProducts,
      pagination: {
        total: pagination.total,
        pages: pagination.pages,
      },
    };

    return (
      <Suspense fallback={<ProductCatalogSkeleton />}>
        <TrendingProductCatalogContent {...props} productData={productData} />
      </Suspense>
    );
  } catch (error) {
    console.error("Error loading trending products:", error);
    // Return a fallback UI instead of throwing an error
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-semibold mb-2">Something went wrong</h3>
        <p className="text-muted-foreground">
          We couldn't load the trending products. Please try again later.
        </p>
      </div>
    );
  }
}