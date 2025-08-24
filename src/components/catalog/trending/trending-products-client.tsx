"use client";

import { useSearchParams } from "next/navigation";
import { TrendingProductCatalog } from "@/features/product/components/trending-product-catalog";
import { Suspense, useMemo } from "react";

export function TrendingProductsClient() {
  const searchParams = useSearchParams();
  
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-2xl font-bold tracking-tight">Trending Products</h2>
      </div>
      
      <Suspense fallback={<div>Loading trending products...</div>}>
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