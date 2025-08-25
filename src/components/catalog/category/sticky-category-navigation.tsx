"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "motion/react";
import { IconChevronLeft, IconChevronRight, IconCategory, IconCategory2, IconShoe, IconHanger } from "@tabler/icons-react";

interface Category {
  id: string;
  name: string;
  slug: string;
  productCount: number;
}

const categoryIcons = [
  IconCategory,
  IconCategory2,
  IconShoe,
  IconHanger,
];

export function StickyCategoryNavigation() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  // Animation variants for marquee effect
  const marqueeVariants = {
    animate: {
      x: ["0%", "-50%"],
      transition: {
        x: {
          repeat: Infinity,
          repeatType: "loop",
          duration: 20,
          ease: "linear",
        },
      },
    },
  };

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch("/api/categories/trending", {
          // Add cache control to prevent aggressive caching
          cache: "no-store",
          // Add next.js fetch options
          next: { revalidate: 300 } // revalidate every 5 minutes
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setCategories(data.categories || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setError("Failed to load categories");
        // Set some default categories as fallback
        setCategories([
          { id: "1", name: "Sneakers", slug: "sneakers", productCount: 24 },
          { id: "2", name: "Boots", slug: "boots", productCount: 18 },
          { id: "3", name: "Sandals", slug: "sandals", productCount: 15 },
          { id: "4", name: "Formal", slug: "formal", productCount: 12 },
          { id: "5", name: "Casual", slug: "casual", productCount: 20 },
        ]);
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

  // Show error state if needed
  if (error && !loading && categories.length === 0) {
    return (
      <div className="sticky top-16 z-40 bg-gradient-to-r from-background to-muted border-b py-4 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">Shop by Category</h3>
            <div className="text-sm text-muted-foreground italic">
              Categories temporarily unavailable
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="sticky top-16 z-40 bg-gradient-to-r from-background to-muted border-b py-4 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-3">
            <Skeleton className="h-7 w-40 bg-muted-foreground/20" />
            <div className="flex gap-2">
              <Skeleton className="h-9 w-9 rounded-full bg-muted-foreground/20" />
              <Skeleton className="h-9 w-9 rounded-full bg-muted-foreground/20" />
            </div>
          </div>
          <div className="flex gap-3 py-2">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-11 w-28 rounded-full bg-muted-foreground/20" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="sticky top-16 z-40 bg-gradient-to-r from-background to-muted/30 border-b border-border/50 py-4 backdrop-blur-sm shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-tight">
            Shop by Category
          </h3>
          <div className="flex gap-2">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} transition={{ type: "spring", stiffness: 400, damping: 17 }}>
              <Button 
                variant="secondary" 
                size="icon" 
                className="h-9 w-9 rounded-full shadow-sm hover:shadow-md transition-shadow duration-300"
                onClick={() => document.getElementById('sticky-category-scroll')?.scrollBy({ left: -200, behavior: 'smooth' })}
              >
                <IconChevronLeft className="h-5 w-5" />
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} transition={{ type: "spring", stiffness: 400, damping: 17 }}>
              <Button 
                variant="secondary" 
                size="icon" 
                className="h-9 w-9 rounded-full shadow-sm hover:shadow-md transition-shadow duration-300"
                onClick={() => document.getElementById('sticky-category-scroll')?.scrollBy({ left: 200, behavior: 'smooth' })}
              >
                <IconChevronRight className="h-5 w-5" />
              </Button>
            </motion.div>
          </div>
        </div>
        
        <div className="relative w-full overflow-hidden">
          {/* Gradient overlays for fade effect */}
          <div className="absolute top-0 left-0 z-10 h-full w-12 bg-gradient-to-r from-background to-transparent" />
          <div className="absolute top-0 right-0 z-10 h-full w-12 bg-gradient-to-l from-background to-transparent" />
          
          {/* Animated category container */}
          <motion.div
            className="flex w-max space-x-3 py-2"
            variants={marqueeVariants}
            animate="animate"
            whileHover={{ 
              x: "0%", 
              transition: { 
                x: { 
                  duration: 0.1 
                } 
              } 
            }}
          >
            {/* Duplicate categories for seamless loop */}
            {[...categories, ...categories].map((category, index) => {
              const IconComponent = categoryIcons[index % categoryIcons.length];
              
              return (
                <motion.div
                  key={`${category.id}-${index}`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <Button
                    variant="secondary"
                    size="lg"
                    className="rounded-full shrink-0 px-5 py-3 font-medium shadow-sm hover:shadow-md transition-all duration-300 border border-border/50"
                    onClick={() => handleCategoryClick(category.id)}
                  >
                    <IconComponent className="mr-2 h-4 w-4" />
                    {category.name}
                    {category.productCount > 0 && (
                      <span className="ml-2 text-xs bg-primary/10 text-primary rounded-full px-2 py-0.5">
                        {category.productCount}
                      </span>
                    )}
                  </Button>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </div>
  );
}