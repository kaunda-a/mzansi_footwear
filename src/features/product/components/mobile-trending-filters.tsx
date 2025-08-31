"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from "@/components/ui/sheet";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  IconArrowsSort, 
  IconFilter, 
  IconX, 
  IconCheck 
} from "@tabler/icons-react";

const sortOptions = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "price-low-high", label: "Price: Low to High" },
  { value: "price-high-low", label: "Price: High to Low" },
  { value: "name-a-z", label: "Name: A to Z" },
  { value: "name-z-a", label: "Name: Z to A" },
  { value: "featured", label: "Featured" },
  { value: "rating", label: "Highest Rated" },
];

interface MobileTrendingFiltersProps {
  onFiltersChange?: (filters: any) => void;
}

export function MobileTrendingFilters({ onFiltersChange }: MobileTrendingFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedSort, setSelectedSort] = useState<string>(
    searchParams.get("sort") || "newest"
  );

  const handleSortChange = (value: string) => {
    setSelectedSort(value);
    
    const params = new URLSearchParams(searchParams.toString());
    
    params.set("sort", value);
    
    // Reset to first page when sort changes
    params.delete("page");
    
    router.push(`?${params.toString()}`);
    onFiltersChange?.({ sort: value });
  };

  const applyFilters = () => {
    setIsOpen(false);
  };

  return (
    <div className="lg:hidden mb-4">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button 
            variant="secondary" 
            size="sm" 
            className="h-10 rounded-full px-4 bg-gradient-to-r from-background/80 to-muted/40 backdrop-blur-sm border border-border/50 shadow-md w-full justify-between"
          >
            <div className="flex items-center">
              <IconFilter className="h-4 w-4 mr-2" />
              <span className="text-sm">Sort & Filter</span>
            </div>
            <IconArrowsSort className="h-4 w-4 text-muted-foreground" />
          </Button>
        </SheetTrigger>
        <SheetContent 
          side="bottom" 
          className="h-[50vh] rounded-t-3xl p-0"
        >
          <SheetHeader className="p-4 border-b sticky top-0 bg-background z-10">
            <div className="flex items-center justify-between">
              <SheetTitle className="text-lg font-bold flex items-center">
                <IconArrowsSort className="h-5 w-5 mr-2" />
                Sort & Filter
              </SheetTitle>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsOpen(false)}
                className="h-8 w-8"
              >
                <IconX className="h-4 w-4" />
              </Button>
            </div>
          </SheetHeader>
          
          <div className="p-4 space-y-6">
            {/* Sort Options */}
            <div className="space-y-3">
              <h3 className="font-bold text-base">Sort By</h3>
              <Select value={selectedSort} onValueChange={handleSortChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select sort option" />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Filter Options - Could be expanded with more filters */}
            <div className="space-y-3">
              <h3 className="font-bold text-base">Quick Filters</h3>
              <div className="grid grid-cols-1 gap-2">
                <Button 
                  variant="outline" 
                  className="rounded-full h-12"
                  onClick={() => {
                    const params = new URLSearchParams(searchParams.toString());
                    params.delete("category");
                    params.delete("brand");
                    params.delete("minPrice");
                    params.delete("maxPrice");
                    params.delete("size");
                    params.delete("color");
                    params.delete("page");
                    router.push(`?${params.toString()}`);
                    onFiltersChange?.({ reset: true });
                  }}
                >
                  Clear All
                </Button>
              </div>
            </div>
          </div>
          
          {/* Fixed Apply Button */}
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-background">
            <Button 
              onClick={applyFilters}
              className="w-full h-12 rounded-full text-base font-semibold shadow-lg"
            >
              <IconCheck className="h-5 w-5 mr-2" />
              Apply
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}