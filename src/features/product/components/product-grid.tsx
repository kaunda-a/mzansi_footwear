'use client'

import { ProductCard } from './product-card'
import { Skeleton } from '@/components/ui/skeleton'
import { IconShoppingCart } from '@tabler/icons-react'
import type { ProductGridProps } from '../types'

function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-2 sm:gap-3 md:gap-4">
      {[...Array(14)].map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="aspect-square rounded-lg" />
          <div className="space-y-1 px-1">
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  )
}

function EmptyState() {
  return (
    <div className="text-center py-12">
      <div className="w-24 h-24 mx-auto bg-muted rounded-full flex items-center justify-center mb-4">
        <IconShoppingCart className="h-12 w-12 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold mb-2">No products found</h3>
      <p className="text-muted-foreground max-w-md mx-auto">
        Try adjusting your search or filter criteria to find what you're looking for.
      </p>
    </div>
  )
}

export function ProductGrid({ 
  products, 
  loading = false, 
  className = '',
  showQuickView = true,
  showCompare = true
}: ProductGridProps) {
  if (loading) {
    return <ProductGridSkeleton />
  }

  if (!products.length) {
    return <EmptyState />
  }

  return (
    <div className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-2 sm:gap-3 md:gap-4 ${className}`}>
      {products.map((product, index) => (
        <ProductCard
          key={product.id}
          product={product}
          showQuickView={showQuickView}
          showCompare={showCompare}
          priority={index < 8} // Prioritize first 8 images for LCP
          compact={true} // Enable compact mode for Temu-style layout
        />
      ))}
    </div>
  )
}
