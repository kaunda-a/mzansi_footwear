"use client";

import { ProductFilters } from "@/features/product/components/product-filters";
import { CategorySelector } from "@/components/catalog/category/category-selector";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense, useState } from "react";
import { Button } from "@/components/ui/button";
import { IconFilter } from "@tabler/icons-react";

export function ProductFilterWrapper({ 
  children,
  showMobileToggle = true
}: { 
  children: React.ReactNode;
  showMobileToggle?: boolean;
}) {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="space-y-6">
      {/* Mobile filter button */}
      {showMobileToggle && (
        <div className="lg:hidden flex justify-center">
          <Button 
            variant="outline" 
            onClick={() => setShowFilters(!showFilters)}
            className="w-full max-w-xs"
          >
            <IconFilter className="mr-2 h-4 w-4" />
            {showFilters ? "Hide Filters" : "Show Filters"}
          </Button>
        </div>
      )}

      <div className="lg:grid lg:grid-cols-4 lg:gap-8">
        {/* Category Selector and Filters Sidebar - Hidden on mobile by default */}
        <div className={`${showFilters ? "block" : "hidden"} lg:block space-y-6`}>
          <CategorySelector />
          <Suspense
            fallback={
              <div className="space-y-4">
                <Skeleton className="h-6 w-32" />
                <div className="space-y-2">
                  {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-10 w-full" />
                  ))}
                </div>
              </div>
            }
          >
            <ProductFilters />
          </Suspense>
        </div>

        {/* Products Grid */}
        <div className="lg:col-span-3">
          {children}
        </div>
      </div>
    </div>
  );
}