"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { motion } from "motion/react";
import { 
  IconCategory, 
  IconShoe, 
  IconCategory2, 
  IconHanger, 
  IconClothesRack,
  IconX,
  IconChevronRight,
  IconFilter,
  IconGridDots,
  IconLayoutGrid,
  IconList
} from "@tabler/icons-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { CategoryCard } from "@/components/catalog/category/category-card";

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
  IconGridDots,
  IconLayoutGrid,
  IconList
];

interface CategorySelectorClientProps {
  initialCategories?: Category[];
  initialSelectedCategory?: string | null;
}

export function CategorySelectorClient({ 
  initialCategories = [], 
  initialSelectedCategory = null 
}: CategorySelectorClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [loading, setLoading] = useState(!initialCategories || initialCategories.length === 0);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(initialSelectedCategory);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Fetch categories from API if not provided
  useEffect(() => {
    if (initialCategories && initialCategories.length > 0) {
      return;
    }
    
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
  }, [initialCategories]);

  // Initialize selected category from URL params
  useEffect(() => {
    const categoryParam = searchParams.get("category");
    if (categoryParam !== selectedCategory) {
      setSelectedCategory(categoryParam);
    }
  }, [searchParams, selectedCategory]);

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
        <div className="flex justify-between items-center mb-4 md:hidden">
          <div className="h-6 w-32 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full animate-pulse" />
          <Button 
            variant="secondary" 
            size="sm" 
            className="h-10 rounded-full px-4 bg-gradient-to-r from-background/80 to-muted/40 backdrop-blur-sm border border-border/50 shadow-md"
          >
            <IconFilter className="h-4 w-4 mr-2" />
            <span className="text-sm">Categories</span>
          </Button>
        </div>
      );
    }

    return (
      <div className="flex justify-between items-center mb-4 md:hidden">
        <div className="flex items-center">
          <IconCategory className="h-5 w-5 mr-2 text-primary" />
          <span className="font-semibold text-foreground">Categories</span>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              variant="secondary" 
              size="sm" 
              className="h-10 rounded-full px-4 bg-gradient-to-r from-background/80 to-muted/40 backdrop-blur-sm border border-border/50 shadow-md hover:from-accent/20 hover:to-accent/10"
            >
              <IconFilter className="h-4 w-4 mr-2" />
              <span className="text-sm">Filter</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-[95vw] rounded-2xl p-0 max-h-[80vh] flex flex-col">
            <DialogHeader className="p-4 border-b flex items-center justify-between shrink-0">
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
            <div className="overflow-y-auto flex-1 p-2">
              <div className="space-y-1">
                {/* All Categories Option */}
                <CategoryCard
                  id="all"
                  name="All Products"
                  icon={<IconCategory className="h-5 w-5 text-primary" />}
                  isSelected={selectedCategory === null}
                  onClick={() => handleCategoryClick(null)}
                  variant="list"
                />
                
                {/* Category List */}
                {categories.map((category, index) => {
                  const IconComponent = categoryIcons[index % categoryIcons.length];
                  const isSelected = selectedCategory === category.id;
                  
                  return (
                    <CategoryCard
                      key={category.id}
                      id={category.id}
                      name={category.name}
                      productCount={category.productCount}
                      icon={<IconComponent className="h-5 w-5 text-primary" />}
                      isSelected={isSelected}
                      onClick={() => handleCategoryClick(category.id)}
                      variant="list"
                    />
                  );
                })}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  };

  // Render desktop category selector
  const renderDesktopSelector = () => {
    if (loading) {
      return (
        <div className="hidden space-y-6 p-6 rounded-3xl bg-gradient-to-br from-background/90 via-background/95 to-muted/50 border border-border/70 shadow-2xl backdrop-blur-2xl md:block">
          <div className="flex items-center justify-between">
            <div className="h-8 w-48 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full animate-pulse" />
            <div className="flex gap-2">
              <div className="h-8 w-8 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-lg animate-pulse" />
              <div className="h-8 w-8 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-lg animate-pulse" />
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-24 w-full rounded-2xl bg-muted-foreground/20 animate-pulse" />
            ))}
          </div>
        </div>
      );
    }

    return (
      <div className="hidden space-y-6 p-6 rounded-3xl bg-gradient-to-br from-background/90 via-background/95 to-muted/50 border border-border/70 shadow-2xl backdrop-blur-2xl md:block">
        <motion.div 
          className="flex items-center justify-between"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.h2 
            className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-tight"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            Shop by Category
          </motion.h2>
          
          {/* View mode toggle */}
          <div className="flex gap-2">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => setViewMode("grid")}
            >
              <IconGridDots className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => setViewMode("list")}
            >
              <IconList className="h-4 w-4" />
            </Button>
          </div>
        </motion.div>
        
        <div className={viewMode === "grid" 
          ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3" 
          : "grid grid-cols-1 md:grid-cols-2 gap-3"
        }>
          {/* All Categories Option */}
          <CategoryCard
            id="all"
            name="All Products"
            icon={<IconCategory className="h-8 w-8 text-primary" />}
            isSelected={selectedCategory === null}
            onClick={() => handleCategoryClick(null)}
            variant={viewMode}
          />
          
          {/* Category Grid */}
          {categories.map((category, index) => {
            const IconComponent = categoryIcons[index % categoryIcons.length];
            const isSelected = selectedCategory === category.id;
            
            return (
              <CategoryCard
                key={category.id}
                id={category.id}
                name={category.name}
                productCount={category.productCount}
                icon={<IconComponent className="h-8 w-8 text-primary" />}
                isSelected={isSelected}
                onClick={() => handleCategoryClick(category.id)}
                variant={viewMode}
              />
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full">
      {renderMobileDialog()}
      {renderDesktopSelector()}
    </div>
  );
}