"use client";

import { ProductGrid } from "@/features/product/components/product-grid";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { IconArrowRight } from "@tabler/icons-react";

interface ProductData {
  products: any[];
  pagination: {
    total: number;
    pages: number;
  };
}

interface TrendingProductsClientProps {
  productData: ProductData | null;
}

export function TrendingProductsClient({ productData }: TrendingProductsClientProps) {
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Show loading skeleton while hydrating or if no data
  if (!isClient || !productData) {
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

  // Handle empty state
  if (!productData.products || productData.products.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h2 className="text-2xl font-bold tracking-tight">Trending Products</h2>
        </div>
        <div className="text-center py-12">
          <h3 className="text-lg font-semibold mb-2">No trending products found</h3>
          <p className="text-muted-foreground">
            Check back later for trending items.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
          Trending Products
        </h2>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          Discover our most popular and sought-after footwear
        </p>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="text-sm text-muted-foreground">
          Showing {Math.min(productData.products.length, 8)} trending products
        </div>
        <div className="flex gap-2">
          <Link href="/trending">
            <Button variant="outline" size="sm">
              View All Products
              <IconArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
      
      <ProductGrid products={productData.products} />
    </div>
  );
}