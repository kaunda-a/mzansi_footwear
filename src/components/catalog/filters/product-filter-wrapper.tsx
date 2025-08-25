"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { IconFilter, IconX } from "@tabler/icons-react";
import Link from "next/link";

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
        {/* Filters Sidebar - Sticky positioning */}
        <div className={`${showFilters ? "block" : "hidden"} lg:block`}>
          <div className="lg:sticky lg:top-20 space-y-6">
            <div className="bg-muted p-4 rounded-lg">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-semibold">Filters</h3>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="lg:hidden"
                  onClick={() => setShowFilters(false)}
                >
                  <IconX className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Full filtering options available on dedicated pages
              </p>
              <div className="space-y-2">
                <Link href="/trending">
                  <Button variant="outline" size="sm" className="w-full">
                    Filter Trending
                  </Button>
                </Link>
                <Link href="/products">
                  <Button variant="outline" size="sm" className="w-full">
                    All Products
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="lg:col-span-3">
          {children}
        </div>
      </div>
    </div>
  );
}