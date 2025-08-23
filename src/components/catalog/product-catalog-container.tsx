"use client";

import { ProductFilters } from "@/features/product/components/product-filters";

export function ProductCatalogContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="lg:grid lg:grid-cols-4 lg:gap-8">
      {/* Filters Sidebar */}
      <div className="hidden lg:block">
        <div className="sticky top-24">
          <ProductFilters />
        </div>
      </div>

      {/* Products Grid */}
      <div className="lg:col-span-3">
        {children}
      </div>
    </div>
  );
}
