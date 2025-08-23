"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { TrendingProductCatalog } from "@/features/product/components/trending-product-catalog";
import { ProductFilters } from "@/features/product/components/product-filters";
import { CategorySelector } from "@/components/catalog/category-selector";
import { Suspense } from "react";

export function TrendingSection() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  // Convert URLSearchParams to a plain object
  const paramsObj = Object.fromEntries(searchParams.entries());

  return (
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
            searchParams={paramsObj}
            showSort={true}
            showPagination={true}
            limit={12}
          />
        </Suspense>
      </div>
    </div>
  );
}