"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "motion/react";
import { IconChevronLeft, IconChevronRight, IconCategory, IconShoe, IconCategory2, IconHanger, IconClothesRack } from "@tabler/icons-react";

interface Category {
  id: string;
  name: string;
  slug: string;
  productCount: number;
}

const categoryIcons = [
  IconCategory,
  IconShoe,
  IconCategory2,
  IconHanger,
  IconClothesRack,
];

export function CategorySelector() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
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
      <div className="space-y-6 p-6 rounded-2xl bg-gradient-to-br from-background via-background to-muted/40 border border-border/70 shadow-xl backdrop-blur-md">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48 bg-muted-foreground/20 rounded-full" />
          <div className="flex gap-3">
            <Skeleton className="h-10 w-10 rounded-full bg-muted-foreground/20" />
            <Skeleton className="h-10 w-10 rounded-full bg-muted-foreground/20" />
          </div>
        </div>
        <div className="flex gap-4 py-3">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-12 w-32 rounded-full bg-muted-foreground/20" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 rounded-2xl bg-gradient-to-br from-background via-background to-muted/40 border border-border/70 shadow-xl backdrop-blur-md">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-tight">
          Shop by Category
        </h2>
        <div className="flex gap-3">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} transition={{ type: "spring", stiffness: 400, damping: 17 }}>
            <Button 
              variant="secondary" 
              size="icon" 
              className="h-10 w-10 rounded-full shadow-md hover:shadow-xl transition-all duration-300 border border-border/50"
              onClick={() => document.getElementById('category-scroll-area')?.scrollBy({ left: -200, behavior: 'smooth' })}
            >
              <IconChevronLeft className="h-5 w-5" />
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} transition={{ type: "spring", stiffness: 400, damping: 17 }}>
            <Button 
              variant="secondary" 
              size="icon" 
              className="h-10 w-10 rounded-full shadow-md hover:shadow-xl transition-all duration-300 border border-border/50"
              onClick={() => document.getElementById('category-scroll-area')?.scrollBy({ left: 200, behavior: 'smooth' })}
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
          className="flex w-max space-x-4 py-3"
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
            const isSelected = selectedCategory === category.id;
            
            return (
              <motion.div
                key={`${category.id}-${index}`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                animate={isSelected ? { scale: [1, 1.05, 1] } : {}}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Button
                  variant={isSelected ? "default" : "secondary"}
                  size="lg"
                  className="rounded-full shrink-0 px-6 py-4 font-semibold shadow-md hover:shadow-xl transition-all duration-300 border border-border/50 text-sm"
                  onClick={() => handleCategoryClick(category.id)}
                >
                  <IconComponent className="mr-2 h-4 w-4" />
                  {category.name}
                  {category.productCount > 0 && (
                    <span className="ml-2 text-xs font-bold bg-primary/15 text-primary rounded-full px-3 py-1">
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
  );
}