'use client';

import { Suspense } from "react";
import { TrendingProductCatalog } from "@/features/product/components/trending-product-catalog";
import { TrendingSection } from "./trending-section";

interface TrendingContentClientProps {
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
}

export function TrendingContentClient({ searchParams }: TrendingContentClientProps) {
  return (
    <TrendingSection>
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
          searchParams={searchParams}
          showSort={true}
          showPagination={true}
          limit={12}
        />
      </Suspense>
    </TrendingSection>
  );
}