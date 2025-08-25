"use client";

import { HomepageTrendingFilters } from "./homepage-trending-filters";
import { HomepageCategorySelector } from "./homepage-category-selector";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense, useState } from "react";
import { Button } from "@/components/ui/button";
import { IconFilter, IconX, IconTrendingUp } from "@tabler/icons-react";

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
            <IconTrendingUp className="mr-2 h-4 w-4" />
            {showFilters ? "Hide Filters" : "Show Trending Filters"}
          </Button>
        </div>
      )}

      <div className="lg:grid lg:grid-cols-12 lg:gap-8">
        {/* Enhanced Trending Filters - Sleek and modern */}
        <div className={`${showFilters ? "block" : "hidden"} lg:block lg:col-span-3`}>
          <div className="lg:sticky lg:top-20 space-y-6">
            <HomepageCategorySelector />
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
              <HomepageTrendingFilters />
            </Suspense>
          </div>
        </div>

        {/* Products Grid */}
        <div className="lg:col-span-9">
          {children}
        </div>
      </div>
    </div>
  );
}