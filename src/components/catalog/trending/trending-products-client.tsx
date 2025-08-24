"use client";

import { useSearchParams } from "next/navigation";
import { TrendingProductCatalog } from "@/features/product/components/trending-product-catalog";
import { Suspense, useMemo, useState, useEffect } from "react";

export function TrendingProductsClient() {
  const searchParams = useSearchParams();
  const [isClient, setIsClient] = useState(false);
  
  // Convert URLSearchParams to object
  const searchParamsObject = useMemo(() => {
    const obj: Record<string, string> = {};
    if (searchParams) {
      for (const [key, value] of searchParams.entries()) {
        obj[key] = value;
      }
    }
    return obj;
  }, [searchParams]);
  
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h2 className="text-2xl font-bold tracking-tight">Trending Products</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-2 sm:gap-3 md:gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
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
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-2xl font-bold tracking-tight">Trending Products</h2>
      </div>
      
      <Suspense fallback={
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-2 sm:gap-3 md:gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
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
      }>
        <TrendingProductCatalog 
          searchParams={searchParamsObject}
          showSort={false}
          showPagination={false}
          limit={8}
        />
      </Suspense>
    </div>
  );
}