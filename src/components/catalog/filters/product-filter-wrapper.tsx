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

      <div className="lg:grid lg:grid-cols-12 lg:gap-8">
        {/* Filters Sidebar - Wider column with sticky positioning */}
        <div className={`${showFilters ? "block" : "hidden"} lg:block lg:col-span-3`}>
          <div className="lg:sticky lg:top-20 space-y-6">
            <div className="bg-muted p-6 rounded-lg">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-lg">Filters</h3>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="lg:hidden"
                  onClick={() => setShowFilters(false)}
                >
                  <IconX className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mb-5">
                Full filtering options available on dedicated pages
              </p>
              <div className="space-y-3">
                <Link href="/trending">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <IconFilter className="mr-2 h-4 w-4" />
                    Filter Trending Products
                  </Button>
                </Link>
                <Link href="/products">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <IconFilter className="mr-2 h-4 w-4" />
                    Browse All Products
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid - Narrower column to accommodate wider filters */}
        <div className="lg:col-span-9">
          {children}
        </div>
      </div>
    </div>
  );
}