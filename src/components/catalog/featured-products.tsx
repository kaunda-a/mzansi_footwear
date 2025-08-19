import React, { Suspense } from "react";
import { Api } from "@/lib/api";
import {
  FeaturedProductsSkeleton,
  AnimatedProductDisplay,
} from "./featured-products-client";

async function FeaturedProductsContent(): Promise<React.ReactElement | null> {
  try {
    const { products } = await Api.getProducts({
      page: 1,
      limit: 12, // Increased limit for a better visual effect
      featured: true,
    });

    if (!products.length) {
      return null;
    }

    const clientSafeProducts = JSON.parse(JSON.stringify(products));

    return (
      <section className="py-16 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Featured Products
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-500 dark:text-gray-400">
              Discover our handpicked selection of premium footwear
            </p>
          </div>

          <AnimatedProductDisplay products={clientSafeProducts} />
        </div>
      </section>
    );
  } catch (error) {
    console.error("Error loading featured products:", error);
    return null;
  }
}

export function FeaturedProducts() {
  return (
    <Suspense fallback={<FeaturedProductsSkeleton />}>
      <FeaturedProductsContent />
    </Suspense>
  );
}
