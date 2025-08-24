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

export async function TrendingProductCatalog(props: TrendingProductCatalogProps) {
  const { searchParams, limit = 12 } = props;
  const page = parseInt(searchParams.page || "1");

  try {
    // Server-side - call our custom trending API
    const baseUrl = process.env.NEXTAUTH_URL || process.env.VERCEL_URL || "http://localhost:3000";
    const searchParamsObj = new URLSearchParams();
    
    if (searchParams.page) searchParamsObj.append("page", searchParams.page);
    if (limit) searchParamsObj.append("limit", limit.toString());
    if (searchParams.category) searchParamsObj.append("category", searchParams.category);
    if (searchParams.brand) searchParamsObj.append("brand", searchParams.brand);
    if (searchParams.minPrice) searchParamsObj.append("minPrice", searchParams.minPrice);
    if (searchParams.maxPrice) searchParamsObj.append("maxPrice", searchParams.maxPrice);
    if (searchParams.size) searchParamsObj.append("size", searchParams.size);
    if (searchParams.color) searchParamsObj.append("color", searchParams.color);

    const response = await fetch(
      `${baseUrl}/api/trending?${searchParamsObj.toString()}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const productData = await response.json();

    return (
      <Suspense fallback={<ProductCatalogSkeleton />}>
        <TrendingProductCatalogContent {...props} productData={productData} />
      </Suspense>
    );
  } catch (error) {
    console.error("Error loading trending products:", error);
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