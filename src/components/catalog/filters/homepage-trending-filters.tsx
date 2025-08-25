"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { IconFilter, IconX, IconTrendingUp } from "@tabler/icons-react";
import { Skeleton } from "@/components/ui/skeleton";

interface Category {
  id: string;
  name: string;
  count: number;
}

interface Brand {
  id: string;
  name: string;
  count: number;
}

export function HomepageTrendingFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);

  // Fetch filter options from API
  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        setLoading(true);
        // Fetch trending-specific categories and brands
        const response = await fetch("/api/categories/trending");
        if (response.ok) {
          const data = await response.json();
          setCategories(data.categories || []);
        }
        
        // Fetch popular brands
        const brandsResponse = await fetch("/api/filters");
        if (brandsResponse.ok) {
          const brandsData = await brandsResponse.json();
          setBrands(brandsData.brands || []);
        }
      } catch (error) {
        console.error("Error fetching filter options:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFilterOptions();
  }, []);

  // Initialize filters from URL params
  useEffect(() => {
    const categoryParam = searchParams.get("category");
    const brandParam = searchParams.get("brand");

    if (categoryParam) setSelectedCategories([categoryParam]);
    if (brandParam) setSelectedBrands([brandParam]);
  }, [searchParams]);

  const updateURL = (newCategories: string[], newBrands: string[]) => {
    const params = new URLSearchParams(searchParams.toString());

    // Clear existing filter params
    params.delete("category");
    params.delete("brand");
    params.delete("page");

    // Add new filter params
    if (newCategories.length) {
      newCategories.forEach((cat) => params.append("category", cat));
    }
    if (newBrands.length) {
      newBrands.forEach((brand) => params.append("brand", brand));
    }

    router.push(`?${params.toString()}`);
  };

  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    const newCategories = checked
      ? [...selectedCategories, categoryId]
      : selectedCategories.filter((id) => id !== categoryId);

    setSelectedCategories(newCategories);
    updateURL(newCategories, selectedBrands);
  };

  const handleBrandChange = (brandId: string, checked: boolean) => {
    const newBrands = checked
      ? [...selectedBrands, brandId]
      : selectedBrands.filter((id) => id !== brandId);

    setSelectedBrands(newBrands);
    updateURL(selectedCategories, newBrands);
  };

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setSelectedBrands([]);
    
    const params = new URLSearchParams(searchParams.toString());
    params.delete("category");
    params.delete("brand");
    params.delete("page");
    
    router.push(`?${params.toString()}`);
  };

  const hasActiveFilters = selectedCategories.length > 0 || selectedBrands.length > 0;

  if (loading) {
    return (
      <Card className="border-0 shadow-none bg-transparent">
        <CardHeader className="pb-4 px-0">
          <CardTitle className="flex items-center gap-2 text-lg font-semibold">
            <IconTrendingUp className="h-5 w-5 text-primary" />
            Trending Filters
          </CardTitle>
        </CardHeader>
        <CardContent className="px-0 space-y-4">
          <div className="space-y-3">
            <Skeleton className="h-4 w-24" />
            <div className="space-y-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center space-x-2">
                  <Skeleton className="h-4 w-4 rounded" />
                  <Skeleton className="h-4 w-20" />
                </div>
              ))}
            </div>
          </div>
          <Separator />
          <div className="space-y-3">
            <Skeleton className="h-4 w-20" />
            <div className="space-y-2">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="flex items-center space-x-2">
                  <Skeleton className="h-4 w-4 rounded" />
                  <Skeleton className="h-4 w-16" />
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-none bg-transparent">
      <CardHeader className="pb-4 px-0">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg font-semibold">
            <IconTrendingUp className="h-5 w-5 text-primary" />
            Trending Filters
          </CardTitle>
          {hasActiveFilters && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={clearAllFilters}
              className="h-8 px-2 text-xs"
            >
              <IconX className="h-4 w-4 mr-1" />
              Clear
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="px-0 space-y-5">
        {/* Categories - Trending Specific */}
        {categories.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium text-sm text-muted-foreground">Categories</h4>
            <div className="space-y-2">
              {categories.slice(0, 5).map((category) => (
                <div key={category.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`category-${category.id}`}
                    checked={selectedCategories.includes(category.id)}
                    onCheckedChange={(checked) =>
                      handleCategoryChange(category.id, checked as boolean)
                    }
                    className="rounded-sm"
                  />
                  <label
                    htmlFor={`category-${category.id}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex-1"
                  >
                    <span className="flex justify-between">
                      <span>{category.name}</span>
                      <span className="text-muted-foreground text-xs">({category.count})</span>
                    </span>
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}

        {categories.length > 0 && <Separator />}

        {/* Popular Brands */}
        {brands.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium text-sm text-muted-foreground">Popular Brands</h4>
            <div className="space-y-2">
              {brands.slice(0, 4).map((brand) => (
                <div key={brand.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`brand-${brand.id}`}
                    checked={selectedBrands.includes(brand.id)}
                    onCheckedChange={(checked) =>
                      handleBrandChange(brand.id, checked as boolean)
                    }
                    className="rounded-sm"
                  />
                  <label
                    htmlFor={`brand-${brand.id}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex-1"
                  >
                    <span className="flex justify-between">
                      <span>{brand.name}</span>
                      <span className="text-muted-foreground text-xs">({brand.count})</span>
                    </span>
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Filter Buttons */}
        <div className="pt-2">
          <h4 className="font-medium text-sm text-muted-foreground mb-2">Quick Filters</h4>
          <div className="flex flex-wrap gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="text-xs h-8 px-2"
              onClick={() => {
                const params = new URLSearchParams(searchParams.toString());
                params.set("sort", "newest");
                router.push(`?${params.toString()}`);
              }}
            >
              Newest
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="text-xs h-8 px-2"
              onClick={() => {
                const params = new URLSearchParams(searchParams.toString());
                params.set("sort", "rating");
                router.push(`?${params.toString()}`);
              }}
            >
              Top Rated
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="text-xs h-8 px-2"
              onClick={() => router.push("/trending")}
            >
              Reset
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}