'use client'

import React from 'react';
import { motion } from 'motion/react';
import { ProductWithDetails } from '@/lib/services/products';
import { ProductCard } from '@/features/product/components/product-card';

export function FeaturedProductsSkeleton() {
  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="h-8 bg-muted animate-pulse rounded mb-4 mx-auto w-64" />
          <div className="h-6 bg-muted animate-pulse rounded mx-auto w-96" />
        </div>
        <div className="relative w-full overflow-hidden">
          <div className="flex gap-6 py-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-80 w-64 bg-muted animate-pulse rounded flex-shrink-0" />
            ))}
          </div>
          <div className="flex gap-6 py-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-80 w-64 bg-muted animate-pulse rounded flex-shrink-0" />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function AnimatedProductDisplay({ products }: { products: ProductWithDetails[] }) {
  const half = Math.ceil(products.length / 2);
  const firstRow = products.slice(0, half);
  const secondRow = products.slice(half);

  const marqueeVariants = {
    animate: {
      x: ['0%', '-50%'],
      transition: {
        x: {
          repeat: Infinity,
          repeatType: "loop",
          duration: 50,
          ease: "linear",
        },
      },
    },
  };

  const marqueeVariantsReverse = {
    animate: {
      x: ['-50%', '0%'],
      transition: {
        x: {
          repeat: Infinity,
          repeatType: "loop",
          duration: 50,
          ease: "linear",
        },
      },
    },
  };

  return (
    <div className="relative w-full overflow-x-hidden">
        <div className="absolute top-0 left-0 z-10 h-full w-24 bg-gradient-to-r from-background to-transparent" />
        <div className="absolute top-0 right-0 z-10 h-full w-24 bg-gradient-to-l from-background to-transparent" />
      <motion.div className="flex gap-6 py-4" variants={marqueeVariants} animate="animate">
        {[...firstRow, ...firstRow].map((product, i) => (
          <div key={`first-${product.id}-${i}`} className="flex-shrink-0" style={{ width: '220px' }}>
            <ProductCard product={product} />
          </div>
        ))}
      </motion.div>
      <motion.div className="flex gap-6 py-4" variants={marqueeVariantsReverse} animate="animate">
        {[...secondRow, ...secondRow].map((product, i) => (
          <div key={`second-${product.id}-${i}`} className="flex-shrink-0" style={{ width: '220px' }}>
            <ProductCard product={product} />
          </div>
        ))}
      </motion.div>
    </div>
  );
}
