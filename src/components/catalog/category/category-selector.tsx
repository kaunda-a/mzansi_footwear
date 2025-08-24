"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";

interface Category {
  id: string;
  name: string;
  slug: string;
  productCount: number;
}

export function CategorySelector() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/categories/trending");
        if (response.ok) {
          const data = await response.json();
          setCategories(data.categories || []);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Initialize selected category from URL params
  useEffect(() => {
    const categoryParam = searchParams.get("category");
    setSelectedCategory(categoryParam);
  }, [searchParams]);

  const handleCategoryClick = (categoryId: string | null) => {
    setSelectedCategory(categoryId);
    
    const params = new URLSearchParams(searchParams.toString());
    
    if (categoryId) {
      params.set("category", categoryId);
    } else {
      params.delete("category");
    }
    
    params.delete("page"); // Reset to first page
    
    router.push(`/trending?${params.toString()}`);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-32" />
          <div className="flex gap-2">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
        </div>
        <div className="flex gap-2 py-2">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-10 w-24 rounded-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Categories</h3>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="icon" 
            className="h-8 w-8 rounded-full"
            onClick={() => document.getElementById('category-scroll-area')?.scrollBy({ left: -100, behavior: 'smooth' })}
          >
            <IconChevronLeft className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            className="h-8 w-8 rounded-full"
            onClick={() => document.getElementById('category-scroll-area')?.scrollBy({ left: 100, behavior: 'smooth' })}
          >
            <IconChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <ScrollArea id="category-scroll-area" className="w-full whitespace-nowrap rounded-md">
        <div className="flex w-max space-x-2 py-2">
          <Button
            variant={selectedCategory === null ? "default" : "outline"}
            size="sm"
            className="rounded-full shrink-0"
            onClick={() => handleCategoryClick(null)}
          >
            All Products
          </Button>
          
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              size="sm"
              className="rounded-full shrink-0"
              onClick={() => handleCategoryClick(category.id)}
            >
              {category.name}
              {category.productCount > 0 && (
                <span className="ml-2 text-xs opacity-70">({category.productCount})</span>
              )}
            </Button>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}