'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useDebounce } from '@/hooks/use-debounce';
import { IconSearch, IconLoader2, IconX } from '@tabler/icons-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import Image from 'next/image';
import Link from 'next/link';

interface SearchProduct {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  image: string | null;
  imageAlt: string;
  category: {
    id: string;
    name: string;
    slug: string;
  } | null;
  brand: {
    id: string;
    name: string;
    slug: string;
  } | null;
  isFeatured: boolean;
  isOnSale: boolean;
}

interface SearchResponse {
  products: SearchProduct[];
  total: number;
  query: string;
  hasMore: boolean;
}

export default function SearchInput() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchProduct[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const debouncedQuery = useDebounce(query, 300);
  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close search when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Search products when debounced query changes
  useEffect(() => {
    async function searchProducts() {
      if (!debouncedQuery || debouncedQuery.length < 2) {
        setResults([]);
        setTotal(0);
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(debouncedQuery)}&limit=8`);
        const data: SearchResponse = await response.json();

        setResults(data.products);
        setTotal(data.total);
      } catch (error) {
        console.error('Search error:', error);
        setResults([]);
        setTotal(0);
      } finally {
        setIsLoading(false);
      }
    }

    searchProducts();
  }, [debouncedQuery]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setIsOpen(value.length > 0);
  };

  const handleClear = () => {
    setQuery('');
    setResults([]);
    setTotal(0);
    setIsOpen(false);
    inputRef.current?.focus();
  };

  const handleViewAllResults = () => {
    if (query.trim()) {
      router.push(`/products?search=${encodeURIComponent(query.trim())}`);
      setIsOpen(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR'
    }).format(price);
  };

  return (
    <div className="relative w-full" ref={searchRef}>
      <div className="relative">
        <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          ref={inputRef}
          type="text"
          placeholder="Search products..."
          value={query}
          onChange={handleInputChange}
          onFocus={() => query.length > 0 && setIsOpen(true)}
          className="pl-10 pr-8 h-9 bg-background"
        />
        {query && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0"
          >
            <IconX className="h-3 w-3" />
          </Button>
        )}
      </div>

      {isOpen && (
        <Card className="absolute top-full left-0 right-0 mt-1 z-50 max-h-96 overflow-hidden shadow-lg">
          <CardContent className="p-0">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <IconLoader2 className="h-6 w-6 animate-spin" />
                <span className="ml-2 text-sm text-muted-foreground">Searching...</span>
              </div>
            ) : results.length > 0 ? (
              <>
                <div className="max-h-80 overflow-y-auto">
                  {results.map((product) => (
                    <Link
                      key={product.id}
                      href={`/products/${product.slug}`}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 p-3 hover:bg-muted/50 transition-colors border-b last:border-b-0"
                    >
                      <div className="relative w-12 h-12 bg-muted rounded-md overflow-hidden flex-shrink-0">
                        {product.image ? (
                          <Image
                            src={product.image}
                            alt={product.imageAlt}
                            fill
                            className="object-cover"
                            sizes="48px"
                          />
                        ) : (
                          <div className="w-full h-full bg-muted flex items-center justify-center">
                            <IconSearch className="h-4 w-4 text-muted-foreground" />
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm truncate">{product.name}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="font-semibold text-sm">
                            {formatPrice(product.price)}
                          </span>
                          {product.isOnSale && product.compareAtPrice && (
                            <span className="text-xs text-muted-foreground line-through">
                              {formatPrice(product.compareAtPrice)}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          {product.category && (
                            <Badge variant="secondary" className="text-xs">
                              {product.category.name}
                            </Badge>
                          )}
                          {product.isOnSale && (
                            <Badge variant="destructive" className="text-xs">
                              Sale
                            </Badge>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                {total > results.length && (
                  <div className="p-3 border-t bg-muted/30">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleViewAllResults}
                      className="w-full"
                    >
                      View all {total} results for "{query}"
                    </Button>
                  </div>
                )}
              </>
            ) : query.length >= 2 ? (
              <div className="p-8 text-center">
                <IconSearch className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">No products found for "{query}"</p>
                <Button
                  variant="link"
                  size="sm"
                  onClick={handleViewAllResults}
                  className="mt-2"
                >
                  Search all products
                </Button>
              </div>
            ) : (
              <div className="p-4 text-center text-sm text-muted-foreground">
                Type at least 2 characters to search
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
