"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { IconFilter, IconX } from "@tabler/icons-react";
import { CategorySelector } from "@/components/catalog/category/category-selector";
import { ProductFilters } from "@/features/product/components/product-filters";
import { Suspense } from "react";

export function MobileFilterDialog() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="lg:hidden mb-4 flex justify-end">
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button 
            variant="secondary" 
            size="sm" 
            className="h-10 rounded-full px-4 bg-gradient-to-r from-background/80 to-muted/40 backdrop-blur-sm border border-border/50 shadow-md"
          >
            <IconFilter className="h-4 w-4 mr-2" />
            <span className="text-sm">Filters</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-[95vw] rounded-2xl p-0 max-h-[85vh] flex flex-col">
          <DialogHeader className="p-4 border-b flex items-center justify-between shrink-0">
            <DialogTitle className="text-lg font-bold flex items-center">
              <IconFilter className="h-5 w-5 mr-2" />
              Filters & Categories
            </DialogTitle>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsDialogOpen(false)}
              className="h-8 w-8"
            >
              <IconX className="h-5 w-5" />
            </Button>
          </DialogHeader>
          <div className="overflow-y-auto flex-1 p-4">
            <div className="space-y-6">
              <CategorySelector />
              <Suspense
                fallback={
                  <div className="h-64 bg-muted rounded animate-pulse" />
                }
              >
                <ProductFilters />
              </Suspense>
            </div>
          </div>
          <div className="p-4 border-t bg-background sticky bottom-0">
            <Button 
              onClick={() => setIsDialogOpen(false)}
              className="w-full rounded-full h-12"
            >
              Apply Filters
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}