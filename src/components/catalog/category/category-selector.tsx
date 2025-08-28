"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "motion/react";
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
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
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

  // Check scroll position for navigation buttons
  const checkScrollPosition = () => {
    if (scrollAreaRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollAreaRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  // Handle scroll events
  useEffect(() => {
    const scrollElement = scrollAreaRef.current;
    if (scrollElement) {
      scrollElement.addEventListener("scroll", checkScrollPosition);
      checkScrollPosition();
      return () => scrollElement.removeEventListener("scroll", checkScrollPosition);
    }
  }, [categories]);

  const handleScroll = (direction: "left" | "right") => {
    if (scrollAreaRef.current) {
      const scrollAmount = 300;
      scrollAreaRef.current.scrollBy({
        left: direction === "right" ? scrollAmount : -scrollAmount,
        behavior: "smooth"
      });
    }
  };

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
      <div className="space-y-6 p-6 rounded-3xl bg-gradient-to-br from-background/90 via-background/95 to-muted/50 border border-border/70 shadow-2xl backdrop-blur-2xl">
        <div className="flex items-center justify-between">
          <div className="h-8 w-48 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full animate-pulse" />
          <div className="flex gap-3">
            <div className="h-10 w-10 rounded-full bg-muted-foreground/20 animate-pulse" />
            <div className="h-10 w-10 rounded-full bg-muted-foreground/20 animate-pulse" />
          </div>
        </div>
        <div className="flex gap-4 py-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-12 w-32 rounded-full bg-muted-foreground/20 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 rounded-3xl bg-gradient-to-br from-background/90 via-background/95 to-muted/50 border border-border/70 shadow-2xl backdrop-blur-2xl">
      <div className="flex items-center justify-between">
        <motion.h2 
          className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-tight"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          Shop by Category
        </motion.h2>
        <div className="flex gap-3">
          <AnimatePresence>
            {canScrollLeft && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <Button 
                  variant="secondary" 
                  size="icon" 
                  className="h-10 w-10 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 border border-border/50 bg-background/80 backdrop-blur-sm hover:bg-accent/20"
                  onClick={() => handleScroll("left")}
                >
                  <IconChevronLeft className="h-5 w-5" />
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
          <AnimatePresence>
            {canScrollRight && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <Button 
                  variant="secondary" 
                  size="icon" 
                  className="h-10 w-10 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 border border-border/50 bg-background/80 backdrop-blur-sm hover:bg-accent/20"
                  onClick={() => handleScroll("right")}
                >
                  <IconChevronRight className="h-5 w-5" />
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      
      <div className="relative w-full overflow-hidden">
        {/* Gradient overlays for fade effect */}
        <div className="absolute top-0 left-0 z-10 h-full w-12 bg-gradient-to-r from-background to-transparent pointer-events-none" />
        <div className="absolute top-0 right-0 z-10 h-full w-12 bg-gradient-to-l from-background to-transparent pointer-events-none" />
        
        {/* Scrollable category container with enhanced styling */}
        <div
          ref={scrollAreaRef}
          id="category-scroll-area"
          className="flex space-x-4 py-3 overflow-x-auto scrollbar-hide"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {/* All Categories Button */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 17, delay: 0.1 }}
          >
            <Button
              variant={selectedCategory === null ? "default" : "secondary"}
              size="lg"
              className="rounded-full shrink-0 px-6 py-4 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 border border-primary/30 bg-gradient-to-br from-primary/15 to-primary/5 backdrop-blur-sm hover:from-primary/25 hover:to-primary/15"
              onClick={() => handleCategoryClick(null)}
            >
              <IconCategory className="mr-2 h-4 w-4" />
              All Products
              <span className="ml-2 text-xs font-bold bg-gradient-to-r from-primary/20 to-secondary/20 text-primary rounded-full px-3 py-1 border border-primary/30">
                All
              </span>
            </Button>
          </motion.div>
          
          {/* Category buttons with enhanced styling */}
          {categories.map((category, index) => {
            const IconComponent = categoryIcons[index % categoryIcons.length];
            const isSelected = selectedCategory === category.id;
            
            return (
              <motion.div
                key={category.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                animate={isSelected ? { scale: [1, 1.05, 1] } : {}}
                transition={{ type: "spring", stiffness: 400, damping: 17, delay: (index + 1) * 0.05 }}
                initial={{ opacity: 0, x: -20 }}
              >
                <Button
                  variant={isSelected ? "default" : "secondary"}
                  size="lg"
                  className={`rounded-full shrink-0 px-6 py-4 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 border backdrop-blur-sm ${
                    isSelected
                      ? "border-primary/50 bg-gradient-to-br from-primary/20 to-primary/10 hover:from-primary/30 hover:to-primary/20 shadow-primary/20"
                      : "border-border/50 bg-gradient-to-br from-background/80 to-muted/40 hover:from-accent/20 hover:to-accent/10"
                  }`}
                  onClick={() => handleCategoryClick(category.id)}
                >
                  <IconComponent className="mr-2 h-4 w-4" />
                  {category.name}
                  {category.productCount > 0 && (
                    <span className={`ml-2 text-xs font-bold rounded-full px-3 py-1 border ${
                      isSelected
                        ? "bg-gradient-to-r from-primary/30 to-secondary/30 text-primary border-primary/50"
                        : "bg-gradient-to-r from-primary/20 to-secondary/20 text-primary border-primary/30"
                    }`}>
                      {category.productCount}
                    </span>
                  )}
                </Button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}