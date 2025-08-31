"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "motion/react";
import { IconChevronLeft, IconChevronRight, IconCategory, IconCategory2, IconShoe, IconHanger } from "@tabler/icons-react";

interface Category {
  name: string;
  slug: string;
  href: string;
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
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  
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
        const response = await fetch("/api/search-data", {
          // Add cache control to prevent aggressive caching
          cache: "no-store",
          // Add next.js fetch options
          next: { revalidate: 300 } // revalidate every 5 minutes
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setCategories(data.trendingCategories || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setError("Failed to load categories");
        // Set some default categories as fallback
        setCategories([
          { name: "Sneakers", slug: "sneakers", href: "/categories/sneakers" },
          { name: "Boots", slug: "boots", href: "/categories/boots" },
          { name: "Sandals", slug: "sandals", href: "/categories/sandals" },
          { name: "Formal", slug: "formal", href: "/categories/formal" },
          { name: "Casual", slug: "casual", href: "/categories/casual" },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

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

  const handleAllProductsClick = () => {
    // Scroll to top or main content
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Show error state if needed
  if (error && !loading && categories.length === 0) {
    return (
      <div className="sticky top-16 z-40 bg-gradient-to-r from-background/80 via-background/90 to-muted/40 border-b border-border/60 py-4 backdrop-blur-xl shadow-lg">
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
      <div className="sticky top-16 z-40 bg-gradient-to-r from-background/80 via-background/90 to-muted/40 border-b border-border/60 py-4 backdrop-blur-xl shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-3">
            <div className="h-7 w-40 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full animate-pulse" />
            <div className="flex gap-2">
              <div className="h-9 w-9 rounded-full bg-muted-foreground/20 animate-pulse" />
              <div className="h-9 w-9 rounded-full bg-muted-foreground/20 animate-pulse" />
            </div>
          </div>
          <div className="flex gap-3 py-2">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-11 w-28 rounded-full bg-muted-foreground/20 animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="sticky top-16 z-40 bg-gradient-to-r from-background/80 via-background/90 to-muted/40 border-b border-border/60 py-4 backdrop-blur-xl shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-3">
          <motion.h3 
            className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-tight"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            Shop by Category
          </motion.h3>
          <div className="flex gap-2">
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
                    className="h-9 w-9 rounded-full shadow-md hover:shadow-lg transition-all duration-300 border border-border/50 bg-background/80 backdrop-blur-sm hover:bg-accent/20"
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
                    className="h-9 w-9 rounded-full shadow-md hover:shadow-lg transition-all duration-300 border border-border/50 bg-background/80 backdrop-blur-sm hover:bg-accent/20"
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
            id="sticky-category-scroll"
            className="flex space-x-3 py-2 overflow-x-auto scrollbar-hide"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {/* All Categories Button - responsive sizing */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 17, delay: 0.1 }}
            >
              <Button
                variant="default"
                size="lg"
                className="rounded-full shrink-0 px-4 py-2.5 font-medium shadow-md hover:shadow-lg transition-all duration-300 border border-primary/30 bg-gradient-to-br from-primary/10 to-primary/5 backdrop-blur-sm hover:from-primary/20 hover:to-primary/10 text-sm md:px-5 md:py-3 md:text-base"
                onClick={handleAllProductsClick}
              >
                <IconCategory className="mr-1.5 h-3.5 w-3.5 md:mr-2 md:h-4 md:w-4" />
                All Products
              </Button>
            </motion.div>
            
            {/* Category buttons with enhanced styling and mobile responsiveness */}
            {categories.map((category, index) => {
              const IconComponent = categoryIcons[index % categoryIcons.length];
              
              return (
                <motion.div
                  key={category.slug}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17, delay: index * 0.05 }}
                >
                  <Button
                    variant="secondary"
                    size="lg"
                    className="rounded-full shrink-0 px-4 py-2.5 font-medium shadow-md hover:shadow-lg transition-all duration-300 border border-border/50 bg-gradient-to-br from-background/80 to-muted/40 backdrop-blur-sm hover:from-accent/20 hover:to-accent/10 text-sm md:px-5 md:py-3 md:text-base"
                    onClick={() => window.location.href = category.href}
                  >
                    <IconComponent className="mr-1.5 h-3.5 w-3.5 md:mr-2 md:h-4 md:w-4" />
                    <span className="truncate max-w-[100px] md:max-w-[120px]">
                      {category.name}
                    </span>
                  </Button>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}