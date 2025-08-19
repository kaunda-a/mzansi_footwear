"use client";

import { Api } from "@/lib/api";
import { useState, useEffect } from "react";
import { ProductGrid } from "./product-grid";
import type { RelatedProductsProps } from "../types";

export function RelatedProducts({
  productId,
  categoryId,
  brandId,
  limit = 8,
}: RelatedProductsProps) {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRelatedProducts() {
      try {
        setLoading(true);

        // Get featured products for related products
        const { products: relatedProducts } = await Api.getProducts({
          category: categoryId || undefined,
          featured: true,
          limit: limit + 1,
        });

        // Filter out the current product
        const filteredProducts = relatedProducts
          .filter((p) => p.id !== productId)
          .slice(0, limit);

        setProducts(filteredProducts);
      } catch (error) {
        console.error("Error loading related products:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }

    fetchRelatedProducts();
  }, [productId, categoryId, brandId, limit]);

  if (loading) {
    return <div className="text-center py-8">Loading related products...</div>;
  }

  if (!products.length) {
    return null;
  }

  return (
    <section className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">
          You Might Also Like
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Discover more products that complement your style
        </p>
      </div>

      <ProductGrid
        products={products}
        showQuickView={true}
        showCompare={false}
        className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
      />
    </section>
  );
}
