"use client"

import React, { Suspense } from 'react'
import { ProductGrid } from '@/features/product/components/product-grid'
import { ClientApiService } from '@/lib/api'

function FeaturedProductsSkeleton() {
  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="h-8 bg-muted animate-pulse rounded mb-4 mx-auto w-64" />
          <div className="h-6 bg-muted animate-pulse rounded mx-auto w-96" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-80 bg-muted animate-pulse rounded" />
          ))}
        </div>
      </div>
    </section>
  )
}

async function FeaturedProductsContent(): Promise<React.ReactElement | null> {
  try {
    const { products: clientSafeProducts } = await ClientApiService.getProducts({
      page: 1,
      limit: 8,
      featured: true
    })

    if (!clientSafeProducts.length) {
      return null
    }

    return (
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Featured Products
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover our handpicked selection of premium footwear
            </p>
          </div>
          
          <ProductGrid 
            products={clientSafeProducts}
            showQuickView={true}
            showCompare={true}
          />
        </div>
      </section>
    )
  } catch (error) {
    console.error('Error loading featured products:', error)
    return null
  }
}

export function FeaturedProducts() {
  return (
    <Suspense fallback={<FeaturedProductsSkeleton />}>
      <FeaturedProductsContent />
    </Suspense>
  )
}
