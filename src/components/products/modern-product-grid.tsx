'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Heart, 
  Star, 
  ShoppingCart, 
  Eye,
  Truck,
  Shield,
  Zap
} from 'lucide-react';
import { useCart } from '@/hooks/use-cart';
import { toast } from 'sonner';

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  images: string[];
  rating: number;
  reviewCount: number;
  brand: string;
  category: string;
  sku?: string;
  variants?: Array<{
    id: string;
    size: string;
    color: string;
    sku: string;
  }>;
  isOnSale?: boolean;
  isFreeShipping?: boolean;
  isNewArrival?: boolean;
  isBestSeller?: boolean;
  stockLevel?: 'high' | 'medium' | 'low' | 'out';
}

interface ModernProductGridProps {
  products: Product[];
  columns?: 2 | 3 | 4 | 5 | 6;
  showQuickActions?: boolean;
  showBadges?: boolean;
  showRating?: boolean;
  compact?: boolean;
}

export function ModernProductGrid({
  products,
  columns = 4,
  showQuickActions = true,
  showBadges = true,
  showRating = true,
  compact = false
}: ModernProductGridProps) {
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());
  const { addItem } = useCart();

  const gridCols = {
    2: 'grid-cols-2',
    3: 'grid-cols-2 md:grid-cols-3',
    4: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
    5: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5',
    6: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6'
  };

  const toggleWishlist = (productId: string) => {
    const newWishlist = new Set(wishlist);
    if (newWishlist.has(productId)) {
      newWishlist.delete(productId);
      toast.success('Removed from wishlist');
    } else {
      newWishlist.add(productId);
      toast.success('Added to wishlist');
    }
    setWishlist(newWishlist);
  };

  const handleAddToCart = (product: Product) => {
    addItem({
      productId: product.id,
      variantId: product.variants?.[0]?.id || product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      size: product.variants?.[0]?.size || 'Default',
      color: product.variants?.[0]?.color || 'Default',
      quantity: 1,
      sku: product.sku || product.id
    });
    toast.success('Added to cart');
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR'
    }).format(price);
  };

  const getDiscountPercentage = (original: number, current: number) => {
    return Math.round(((original - current) / original) * 100);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-3 w-3 ${
          i < Math.floor(rating) 
            ? 'fill-yellow-400 text-yellow-400' 
            : i < rating 
              ? 'fill-yellow-400/50 text-yellow-400' 
              : 'text-gray-300'
        }`}
      />
    ));
  };

  const getStockBadge = (stockLevel?: string) => {
    switch (stockLevel) {
      case 'low':
        return <Badge variant="destructive" className="text-xs">Low Stock</Badge>;
      case 'out':
        return <Badge variant="secondary" className="text-xs">Out of Stock</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className={`grid ${gridCols[columns]} gap-3 md:gap-4`}>
      {products.map((product) => (
        <Card
          key={product.id}
          className={`group relative overflow-hidden border-0 shadow-sm hover:shadow-lg transition-all duration-300 ${
            compact ? 'h-auto' : 'h-full'
          }`}
          onMouseEnter={() => setHoveredProduct(product.id)}
          onMouseLeave={() => setHoveredProduct(null)}
        >
          <CardContent className="p-0">
            {/* Image Container */}
            <div className="relative aspect-square overflow-hidden bg-gray-50">
              <Link href={`/products/${product.id}`}>
                <Image
                  src={product.images[0] || '/placeholder-product.jpg'}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </Link>

              {/* Badges */}
              {showBadges && (
                <div className="absolute top-2 left-2 flex flex-col gap-1">
                  {product.isOnSale && (
                    <Badge variant="destructive" className="text-xs font-bold">
                      SALE
                    </Badge>
                  )}
                  {product.isNewArrival && (
                    <Badge className="bg-green-500 text-xs font-bold">
                      NEW
                    </Badge>
                  )}
                  {product.isBestSeller && (
                    <Badge className="bg-orange-500 text-xs font-bold">
                      BESTSELLER
                    </Badge>
                  )}
                  {product.originalPrice && (
                    <Badge variant="secondary" className="text-xs">
                      -{getDiscountPercentage(product.originalPrice, product.price)}%
                    </Badge>
                  )}
                </div>
              )}

              {/* Quick Actions */}
              {showQuickActions && (
                <div className={`absolute top-2 right-2 flex flex-col gap-1 transition-opacity duration-200 ${
                  hoveredProduct === product.id ? 'opacity-100' : 'opacity-0'
                }`}>
                  <Button
                    size="icon"
                    variant="secondary"
                    className="h-8 w-8 bg-white/90 hover:bg-white"
                    onClick={() => toggleWishlist(product.id)}
                  >
                    <Heart 
                      className={`h-4 w-4 ${
                        wishlist.has(product.id) ? 'fill-red-500 text-red-500' : ''
                      }`} 
                    />
                  </Button>
                  <Button
                    size="icon"
                    variant="secondary"
                    className="h-8 w-8 bg-white/90 hover:bg-white"
                    asChild
                  >
                    <Link href={`/products/${product.id}`}>
                      <Eye className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              )}

              {/* Stock Badge */}
              {getStockBadge(product.stockLevel) && (
                <div className="absolute bottom-2 left-2">
                  {getStockBadge(product.stockLevel)}
                </div>
              )}

              {/* Shipping Badge */}
              {product.isFreeShipping && (
                <div className="absolute bottom-2 right-2">
                  <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                    <Truck className="h-3 w-3 mr-1" />
                    Free Shipping
                  </Badge>
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className={`p-3 ${compact ? 'space-y-1' : 'space-y-2'}`}>
              {/* Brand */}
              <div className="text-xs text-muted-foreground font-medium">
                {product.brand}
              </div>

              {/* Product Name */}
              <Link href={`/products/${product.id}`}>
                <h3 className={`font-medium text-foreground hover:text-primary transition-colors line-clamp-2 ${
                  compact ? 'text-sm' : 'text-sm md:text-base'
                }`}>
                  {product.name}
                </h3>
              </Link>

              {/* Rating */}
              {showRating && (
                <div className="flex items-center gap-1">
                  <div className="flex items-center">
                    {renderStars(product.rating)}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    ({product.reviewCount})
                  </span>
                </div>
              )}

              {/* Price */}
              <div className="flex items-center gap-2">
                <span className={`font-bold text-foreground ${
                  compact ? 'text-sm' : 'text-base md:text-lg'
                }`}>
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice && (
                  <span className="text-xs text-muted-foreground line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
              </div>

              {/* Features */}
              {!compact && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  {product.isFreeShipping && (
                    <div className="flex items-center gap-1">
                      <Truck className="h-3 w-3" />
                      <span>Free Shipping</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Shield className="h-3 w-3" />
                    <span>Warranty</span>
                  </div>
                </div>
              )}

              {/* Add to Cart Button */}
              <Button
                onClick={() => handleAddToCart(product)}
                disabled={product.stockLevel === 'out'}
                className={`w-full ${compact ? 'h-8 text-xs' : 'h-9 text-sm'} ${
                  hoveredProduct === product.id 
                    ? 'opacity-100' 
                    : compact 
                      ? 'opacity-100' 
                      : 'opacity-0 group-hover:opacity-100'
                } transition-opacity duration-200`}
                size={compact ? 'sm' : 'default'}
              >
                {product.stockLevel === 'out' ? (
                  'Out of Stock'
                ) : (
                  <>
                    <ShoppingCart className="h-4 w-4 mr-1" />
                    Add to Cart
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// Sample products for demo
export const sampleProducts: Product[] = [
  {
    id: '1',
    name: 'Nike Air Max 270 React',
    price: 2499,
    originalPrice: 2999,
    images: ['/images/product-1.jpg'],
    rating: 4.5,
    reviewCount: 128,
    brand: 'Nike',
    category: 'sneakers',
    sku: 'NIKE-AM270-001',
    variants: [
      { id: 'v1', size: '8', color: 'Black', sku: 'NIKE-AM270-001-8-BLK' },
      { id: 'v2', size: '9', color: 'Black', sku: 'NIKE-AM270-001-9-BLK' }
    ],
    isOnSale: true,
    isFreeShipping: true,
    stockLevel: 'high'
  },
  {
    id: '2',
    name: 'Adidas Ultraboost 22',
    price: 3299,
    images: ['/images/product-2.jpg'],
    rating: 4.8,
    reviewCount: 89,
    brand: 'Adidas',
    category: 'running',
    sku: 'ADIDAS-UB22-001',
    variants: [
      { id: 'v3', size: '8', color: 'White', sku: 'ADIDAS-UB22-001-8-WHT' },
      { id: 'v4', size: '9', color: 'White', sku: 'ADIDAS-UB22-001-9-WHT' }
    ],
    isNewArrival: true,
    isFreeShipping: true,
    stockLevel: 'medium'
  },
  // Add more sample products as needed
];
