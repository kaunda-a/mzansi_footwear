"use client";

import { useState, useEffect } from "react";
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

export function StickyCategoryNavigation() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

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

  const handleCategoryClick = (categoryId: string) => {
    // Scroll to the category section
    const element = document.getElementById(`category-${categoryId}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleAllProductsClick = () => {
    // Scroll to top or main content
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) {
    return (
      <div className="sticky top-16 z-40 bg-background border-b py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-32" />
            <div className="flex gap-2">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-8 w-8 rounded-full" />
            </div>
          </div>
          <div className="flex gap-2 py-2 mt-2">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-10 w-24 rounded-full" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="sticky top-16 z-40 bg-background border-b py-4">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Shop by Category</h3>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="icon" 
              className="h-8 w-8 rounded-full"
              onClick={() => document.getElementById('sticky-category-scroll')?.scrollBy({ left: -150, behavior: 'smooth' })}
            >
              <IconChevronLeft className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              className="h-8 w-8 rounded-full"
              onClick={() => document.getElementById('sticky-category-scroll')?.scrollBy({ left: 150, behavior: 'smooth' })}
            >
              <IconChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <ScrollArea id="sticky-category-scroll" className="w-full whitespace-nowrap rounded-md mt-2">
          <div className="flex w-max space-x-2 py-2">
            <Button
              variant="default"
              size="sm"
              className="rounded-full shrink-0"
              onClick={handleAllProductsClick}
            >
              All Products
            </Button>
            
            {categories.map((category) => (
              <Button
                key={category.id}
                variant="outline"
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
    </div>
  );
}