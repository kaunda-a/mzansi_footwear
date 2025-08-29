"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { IconX, IconFilter, IconChevronDown, IconChevronUp } from "@tabler/icons-react";
import { formatPrice } from "@/lib/format";
import type { ProductFiltersProps } from "../types";

export function ProductFilters({
  priceRange = { min: 0, max: 5000 },
  onFiltersChange,
}: ProductFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [categories, setCategories] = useState<Array<{id: string, name: string, count: number}>>([]);
  const [brands, setBrands] = useState<Array<{id: string, name: string, count: number}>>([]);
  const [availableSizes, setAvailableSizes] = useState<Array<{value: string, label: string, count: number}>>([]);
  const [availableColors, setAvailableColors] = useState<Array<{value: string, label: string, hex: string, count: number}>>([]);
  
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState([
    priceRange.min,
    priceRange.max,
  ]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    categories: true,
    brands: true,
    price: true,
    sizes: true,
    colors: true
  });

  // Fetch filter options from API
  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/filters");
        if (response.ok) {
          const data = await response.json();
          setCategories(data.categories || []);
          setBrands(data.brands || []);
          setAvailableSizes(data.sizes || []);
          setAvailableColors(data.colors || []);
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
    const minPriceParam = searchParams.get("minPrice");
    const maxPriceParam = searchParams.get("maxPrice");
    const sizeParam = searchParams.get("size");
    const colorParam = searchParams.get("color");

    if (categoryParam) setSelectedCategories([categoryParam]);
    if (brandParam) setSelectedBrands([brandParam]);
    if (sizeParam) setSelectedSizes([sizeParam]);
    if (colorParam) setSelectedColors([colorParam]);

    // Handle price range parameters more safely
    const minPrice = minPriceParam ? parseInt(minPriceParam, 10) : null;
    const maxPrice = maxPriceParam ? parseInt(maxPriceParam, 10) : null;
    
    if (!isNaN(minPrice as number) || !isNaN(maxPrice as number)) {
      setSelectedPriceRange([
        !isNaN(minPrice as number) ? (minPrice as number) : priceRange.min,
        !isNaN(maxPrice as number) ? (maxPrice as number) : priceRange.max,
      ]);
    }
  }, [priceRange.min, priceRange.max]);

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const updateURL = (filters: any) => {
    const params = new URLSearchParams(searchParams.toString());

    // Clear existing filter params
    params.delete("category");
    params.delete("brand");
    params.delete("minPrice");
    params.delete("maxPrice");
    params.delete("size");
    params.delete("color");
    params.delete("page"); // Reset to first page when filters change

    // Add new filter params
    if (filters.categories?.length) {
      filters.categories.forEach((cat: string) =>
        params.append("category", cat),
      );
    }
    if (filters.brands?.length) {
      filters.brands.forEach((brand: string) => params.append("brand", brand));
    }
    if (filters.sizes?.length) {
      filters.sizes.forEach((size: string) => params.append("size", size));
    }
    if (filters.colors?.length) {
      filters.colors.forEach((color: string) => params.append("color", color));
    }
    if (
      filters.priceRange &&
      (filters.priceRange[0] > priceRange.min ||
        filters.priceRange[1] < priceRange.max)
    ) {
      params.set("minPrice", filters.priceRange[0].toString());
      params.set("maxPrice", filters.priceRange[1].toString());
    }

    // Only update if params have changed
    const currentParams = searchParams.toString();
    const newParams = params.toString();
    
    if (currentParams !== newParams) {
      router.push(`?${newParams}`);
      onFiltersChange?.(filters);
    }
  };

  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    const newCategories = checked
      ? [...selectedCategories, categoryId]
      : selectedCategories.filter((id) => id !== categoryId);

    setSelectedCategories(newCategories);
    updateURL({
      categories: newCategories,
      brands: selectedBrands,
      priceRange: selectedPriceRange,
      sizes: selectedSizes,
      colors: selectedColors,
    });
  };

  const handleBrandChange = (brandId: string, checked: boolean) => {
    const newBrands = checked
      ? [...selectedBrands, brandId]
      : selectedBrands.filter((id) => id !== brandId);

    setSelectedBrands(newBrands);
    updateURL({
      categories: selectedCategories,
      brands: newBrands,
      priceRange: selectedPriceRange,
      sizes: selectedSizes,
      colors: selectedColors,
    });
  };

  const handleSizeChange = (size: string, checked: boolean) => {
    const newSizes = checked
      ? [...selectedSizes, size]
      : selectedSizes.filter((s) => s !== size);

    setSelectedSizes(newSizes);
    updateURL({
      categories: selectedCategories,
      brands: selectedBrands,
      priceRange: selectedPriceRange,
      sizes: newSizes,
      colors: selectedColors,
    });
  };

  const handleColorChange = (color: string, checked: boolean) => {
    const newColors = checked
      ? [...selectedColors, color]
      : selectedColors.filter((c) => c !== color);

    setSelectedColors(newColors);
    updateURL({
      categories: selectedCategories,
      brands: selectedBrands,
      priceRange: selectedPriceRange,
      sizes: selectedSizes,
      colors: newColors,
    });
  };

  const handlePriceRangeChange = (value: number[]) => {
    setSelectedPriceRange(value);
  };

  const handlePriceRangeCommit = (value: number[]) => {
    updateURL({
      categories: selectedCategories,
      brands: selectedBrands,
      priceRange: value,
      sizes: selectedSizes,
      colors: selectedColors,
    });
  };

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setSelectedBrands([]);
    setSelectedSizes([]);
    setSelectedColors([]);
    setSelectedPriceRange([priceRange.min, priceRange.max]);

    const params = new URLSearchParams(searchParams.toString());
    params.delete("category");
    params.delete("brand");
    params.delete("minPrice");
    params.delete("maxPrice");
    params.delete("size");
    params.delete("color");
    params.delete("page");

    router.push(`?${params.toString()}`);
    onFiltersChange?.({});
  };

  const hasActiveFilters =
    selectedCategories.length > 0 ||
    selectedBrands.length > 0 ||
    selectedSizes.length > 0 ||
    selectedColors.length > 0 ||
    selectedPriceRange[0] > priceRange.min ||
    selectedPriceRange[1] < priceRange.max;

  if (loading) {
    return (
      <Card className="border-border/70 shadow-xl backdrop-blur-2xl bg-gradient-to-br from-background/90 via-background/95 to-muted/50">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2">
            <IconFilter className="h-5 w-5" />
            <span className="text-lg font-bold">Filters</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="h-4 bg-muted animate-pulse rounded" />
          <div className="h-4 bg-muted animate-pulse rounded" />
          <div className="h-4 bg-muted animate-pulse rounded" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border/70 shadow-xl backdrop-blur-2xl bg-gradient-to-br from-background/90 via-background/95 to-muted/50">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <IconFilter className="h-5 w-5" />
            <span className="text-lg font-bold">Filters</span>
          </CardTitle>
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearAllFilters} className="h-8 px-2 text-xs">
              Clear All
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Categories - Collapsible on mobile */}
        {categories.length > 0 && (
          <div className="space-y-3">
            <Button
              variant="ghost"
              className="w-full flex justify-between p-0 h-auto hover:bg-transparent md:hover:bg-accent"
              onClick={() => toggleSection("categories")}
            >
              <h4 className="font-bold text-base">Categories</h4>
              {expandedSections.categories ? (
                <IconChevronUp className="h-5 w-5" />
              ) : (
                <IconChevronDown className="h-5 w-5" />
              )}
            </Button>
            {expandedSections.categories && (
              <div className="space-y-2 pl-1">
                {categories.map((category) => (
                  <div key={category.id} className="flex items-center space-x-3 py-1 md:py-2">
                    <Checkbox
                      id={`category-${category.id}`}
                      checked={selectedCategories.includes(category.id)}
                      onCheckedChange={(checked) =>
                        handleCategoryChange(category.id, checked as boolean)
                      }
                      className="h-5 w-5 rounded-full data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                    />
                    <label
                      htmlFor={`category-${category.id}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex-1"
                    >
                      <div className="flex justify-between">
                        <span>{category.name}</span>
                        <span className="text-muted-foreground text-xs">({category.count})</span>
                      </div>
                    </label>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {categories.length > 0 && <Separator />}

        {/* Brands - Collapsible on mobile */}
        {brands.length > 0 && (
          <div className="space-y-3">
            <Button
              variant="ghost"
              className="w-full flex justify-between p-0 h-auto hover:bg-transparent md:hover:bg-accent"
              onClick={() => toggleSection("brands")}
            >
              <h4 className="font-bold text-base">Brands</h4>
              {expandedSections.brands ? (
                <IconChevronUp className="h-5 w-5" />
              ) : (
                <IconChevronDown className="h-5 w-5" />
              )}
            </Button>
            {expandedSections.brands && (
              <div className="space-y-2 pl-1">
                {brands.map((brand) => (
                  <div key={brand.id} className="flex items-center space-x-3 py-1 md:py-2">
                    <Checkbox
                      id={`brand-${brand.id}`}
                      checked={selectedBrands.includes(brand.id)}
                      onCheckedChange={(checked) =>
                        handleBrandChange(brand.id, checked as boolean)
                      }
                      className="h-5 w-5 rounded-full data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                    />
                    <label
                      htmlFor={`brand-${brand.id}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex-1"
                    >
                      <div className="flex justify-between">
                        <span>{brand.name}</span>
                        <span className="text-muted-foreground text-xs">({brand.count})</span>
                      </div>
                    </label>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {brands.length > 0 && <Separator />}

        {/* Price Range - Collapsible on mobile */}
        <div className="space-y-3">
          <Button
            variant="ghost"
            className="w-full flex justify-between p-0 h-auto hover:bg-transparent md:hover:bg-accent"
            onClick={() => toggleSection("price")}
          >
            <h4 className="font-bold text-base">Price Range</h4>
            {expandedSections.price ? (
              <IconChevronUp className="h-5 w-5" />
            ) : (
              <IconChevronDown className="h-5 w-5" />
            )}
          </Button>
          {expandedSections.price && (
            <div className="space-y-4 pl-1">
              <Slider
                value={selectedPriceRange}
                onValueChange={handlePriceRangeChange}
                onValueCommit={handlePriceRangeCommit}
                max={priceRange.max}
                min={priceRange.min}
                step={50}
                className="w-full"
              />
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>{formatPrice(selectedPriceRange[0])}</span>
                <span>{formatPrice(selectedPriceRange[1])}</span>
              </div>
            </div>
          )}
        </div>

        <Separator />

        {/* Sizes - Collapsible on mobile */}
        <div className="space-y-3">
          <Button
            variant="ghost"
            className="w-full flex justify-between p-0 h-auto hover:bg-transparent md:hover:bg-accent"
            onClick={() => toggleSection("sizes")}
          >
            <h4 className="font-bold text-base">Sizes</h4>
            {expandedSections.sizes ? (
              <IconChevronUp className="h-5 w-5" />
            ) : (
              <IconChevronDown className="h-5 w-5" />
            )}
          </Button>
          {expandedSections.sizes && (
            <div className="flex flex-wrap gap-2 pl-1">
              {availableSizes.map((size) => (
                <Button
                  key={size.value}
                  variant={selectedSizes.includes(size.value) ? "default" : "outline"}
                  size="sm"
                  onClick={() =>
                    handleSizeChange(size.value, !selectedSizes.includes(size.value))
                  }
                  className="rounded-full px-3 h-8 text-xs md:text-sm"
                >
                  {size.label}
                  <span className="text-xs opacity-70 ml-1">({size.count})</span>
                </Button>
              ))}
            </div>
          )}
        </div>

        <Separator />

        {/* Colors - Collapsible on mobile */}
        <div className="space-y-3">
          <Button
            variant="ghost"
            className="w-full flex justify-between p-0 h-auto hover:bg-transparent md:hover:bg-accent"
            onClick={() => toggleSection("colors")}
          >
            <h4 className="font-bold text-base">Colors</h4>
            {expandedSections.colors ? (
              <IconChevronUp className="h-5 w-5" />
            ) : (
              <IconChevronDown className="h-5 w-5" />
            )}
          </Button>
          {expandedSections.colors && (
            <div className="flex flex-wrap gap-2 pl-1">
              {availableColors.map((color) => (
                <Button
                  key={color.value}
                  variant={selectedColors.includes(color.value) ? "default" : "outline"}
                  size="sm"
                  style={{ 
                    backgroundColor: selectedColors.includes(color.value) ? color.hex : 'transparent',
                    color: selectedColors.includes(color.value) ? 
                      (parseInt(color.hex.replace('#', ''), 16) > 0xffffff/2 ? '#000' : '#fff') : 
                      '#000'
                  }}
                  onClick={() =>
                    handleColorChange(color.value, !selectedColors.includes(color.value))
                  }
                  className="rounded-full px-3 h-8 text-xs md:text-sm"
                >
                  {color.label}
                  <span className="text-xs opacity-70 ml-1">({color.count})</span>
                </Button>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}