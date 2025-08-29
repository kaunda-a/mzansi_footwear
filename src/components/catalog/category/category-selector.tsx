"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "motion/react";
import { 
  IconCategory, 
  IconShoe, 
  IconCategory2, 
  IconHanger, 
  IconClothesRack,
  IconX,
  IconChevronRight
} from "@tabler/icons-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";

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
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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
    setIsDialogOpen(false); // Close dialog on selection
    
    const params = new URLSearchParams(searchParams.toString());
    
    if (categoryId) {
      params.set("category", categoryId);
    } else {
      params.delete("category");
    }
    
    params.delete("page"); // Reset to first page
    
    router.push(`/trending?${params.toString()}`);
  };

  // Render mobile category dialog
  const renderMobileDialog = () => {
    if (loading) {
      return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              variant="secondary" 
              size="icon" 
              className="fixed bottom-20 right-4 z-50 h-14 w-14 rounded-full shadow-2xl bg-gradient-to-br from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 backdrop-blur-sm border border-primary/30 md:hidden"
            >
              <IconCategory className="h-6 w-6 text-white" />
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-[95vw] rounded-2xl p-0">
            <DialogHeader className="p-4 border-b">
              <DialogTitle className="text-lg font-bold">Categories</DialogTitle>
            </DialogHeader>
            <div className="p-4 space-y-3 max-h-[60vh] overflow-y-auto">
              <div className="h-12 w-full bg-muted-foreground/20 rounded-full animate-pulse" />
              <div className="h-12 w-full bg-muted-foreground/20 rounded-full animate-pulse" />
              <div className="h-12 w-full bg-muted-foreground/20 rounded-full animate-pulse" />
            </div>
          </DialogContent>
        </Dialog>
      );
    }

    return (
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button 
            variant="secondary" 
            size="icon" 
            className="fixed bottom-20 right-4 z-50 h-14 w-14 rounded-full shadow-2xl bg-gradient-to-br from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 backdrop-blur-sm border border-primary/30 md:hidden"
          >
            <IconCategory className="h-6 w-6 text-white" />
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-[95vw] rounded-2xl p-0">
          <DialogHeader className="p-4 border-b flex items-center justify-between">
            <DialogTitle className="text-lg font-bold">Shop by Category</DialogTitle>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsDialogOpen(false)}
              className="h-8 w-8"
            >
              <IconX className="h-5 w-5" />
            </Button>
          </DialogHeader>
          <div className="p-2 max-h-[60vh] overflow-y-auto">
            <div className="space-y-1">
              {/* All Categories Option */}
              <Button
                variant={selectedCategory === null ? "default" : "ghost"}
                className="w-full justify-between h-14 px-4 py-3 rounded-xl text-left font-medium text-base"
                onClick={() => handleCategoryClick(null)}
              >
                <div className="flex items-center">
                  <IconCategory className="h-5 w-5 mr-3 text-primary" />
                  <span>All Products</span>
                </div>
                <div className="flex items-center">
                  <span className="text-xs bg-primary/10 text-primary rounded-full px-2 py-1 mr-2">
                    All
                  </span>
                  <IconChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </Button>
              
              {/* Category List */}
              {categories.map((category, index) => {
                const IconComponent = categoryIcons[index % categoryIcons.length];
                const isSelected = selectedCategory === category.id;
                
                return (
                  <Button
                    key={category.id}
                    variant={isSelected ? "default" : "ghost"}
                    className="w-full justify-between h-14 px-4 py-3 rounded-xl text-left font-medium text-base"
                    onClick={() => handleCategoryClick(category.id)}
                  >
                    <div className="flex items-center">
                      <IconComponent className="h-5 w-5 mr-3 text-primary" />
                      <span>{category.name}</span>
                    </div>
                    <div className="flex items-center">
                      {category.productCount > 0 && (
                        <span className="text-xs bg-primary/10 text-primary rounded-full px-2 py-1 mr-2">
                          {category.productCount}
                        </span>
                      )}
                      <IconChevronRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </Button>
                );
              })}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  // Render desktop category selector
  const renderDesktopSelector = () => {
    if (loading) {
      return (
        <div className="hidden space-y-6 p-6 rounded-3xl bg-gradient-to-br from-background/90 via-background/95 to-muted/50 border border-border/70 shadow-2xl backdrop-blur-2xl md:block">
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
      <div className="hidden space-y-6 p-6 rounded-3xl bg-gradient-to-br from-background/90 via-background/95 to-muted/50 border border-border/70 shadow-2xl backdrop-blur-2xl md:block">
        <motion.h2 
          className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-tight"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          Shop by Category
        </motion.h2>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {/* All Categories Option */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Button
              variant={selectedCategory === null ? "default" : "secondary"}
              className="w-full h-24 flex flex-col items-center justify-center rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-primary/30 bg-gradient-to-br from-primary/15 to-primary/5 backdrop-blur-sm hover:from-primary/25 hover:to-primary/15"
              onClick={() => handleCategoryClick(null)}
            >
              <IconCategory className="h-8 w-8 mb-2 text-primary" />
              <span className="font-semibold text-sm">All Products</span>
              <span className="text-xs mt-1 text-primary/80">All Items</span>
            </Button>
          </motion.div>
          
          {/* Category Grid */}
          {categories.map((category, index) => {
            const IconComponent = categoryIcons[index % categoryIcons.length];
            const isSelected = selectedCategory === category.id;
            
            return (
              <motion.div
                key={category.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: (index + 1) * 0.05 }}
              >
                <Button
                  variant={isSelected ? "default" : "secondary"}
                  className={`w-full h-24 flex flex-col items-center justify-center rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border backdrop-blur-sm ${
                    isSelected
                      ? "border-primary/50 bg-gradient-to-br from-primary/20 to-primary/10 hover:from-primary/30 hover:to-primary/20 shadow-primary/20"
                      : "border-border/50 bg-gradient-to-br from-background/80 to-muted/40 hover:from-accent/20 hover:to-accent/10"
                  }`}
                  onClick={() => handleCategoryClick(category.id)}
                >
                  <IconComponent className="h-8 w-8 mb-2 text-primary" />
                  <span className="font-semibold text-sm truncate w-full px-1">{category.name}</span>
                  {category.productCount > 0 && (
                    <span className="text-xs mt-1 bg-primary/10 text-primary rounded-full px-2 py-0.5">
                      {category.productCount} items
                    </span>
                  )}
                </Button>
              </motion.div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <>
      {renderMobileDialog()}
      {renderDesktopSelector()}
    </>
  );
}