"use client";

import { ProductFilters } from "@/features/product/components/product-filters";
import { CategorySelector } from "@/components/catalog/category-selector";
import { Suspense } from "react";

export function TrendingSection({ children }: { children: React.ReactNode }) {
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
        {children}
      </div>
    </div>
  );
}