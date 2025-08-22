"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { IconX, IconFilter } from "@tabler/icons-react";
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
  }, [searchParams, priceRange]);

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

    router.push(`?${params.toString()}`);
    onFiltersChange?.(filters);
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
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2">
            <IconFilter className="h-5 w-5" />
            Filters
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
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <IconFilter className="h-5 w-5" />
            Filters
          </CardTitle>
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearAllFilters}>
              Clear All
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Categories */}
        {categories.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium">Categories</h4>
            <div className="space-y-2">
              {categories.map((category) => (
                <div key={category.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`category-${category.id}`}
                    checked={selectedCategories.includes(category.id)}
                    onCheckedChange={(checked) =>
                      handleCategoryChange(category.id, checked as boolean)
                    }
                  />
                  <label
                    htmlFor={`category-${category.id}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    {category.name}{" "}
                    <span className="text-muted-foreground">({category.count})</span>
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}

        {categories.length > 0 && <Separator />}

        {/* Brands */}
        {brands.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium">Brands</h4>
            <div className="space-y-2">
              {brands.map((brand) => (
                <div key={brand.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`brand-${brand.id}`}
                    checked={selectedBrands.includes(brand.id)}
                    onCheckedChange={(checked) =>
                      handleBrandChange(brand.id, checked as boolean)
                    }
                  />
                  <label
                    htmlFor={`brand-${brand.id}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    {brand.name}{" "}
                    <span className="text-muted-foreground">({brand.count})</span>
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}

        {brands.length > 0 && <Separator />}

        {/* Price Range */}
        <div className="space-y-3">
          <h4 className="font-medium">Price Range</h4>
          <div className="space-y-4">
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
        </div>

        <Separator />

        {/* Sizes */}
        <div className="space-y-3">
          <h4 className="font-medium">Sizes</h4>
          <div className="flex flex-wrap gap-2">
            {availableSizes.map((size) => (
              <Button
                key={size.value}
                variant={selectedSizes.includes(size.value) ? "default" : "outline"}
                size="sm"
                onClick={() =>
                  handleSizeChange(size.value, !selectedSizes.includes(size.value))
                }
              >
                {size.label}{" "}
                <span className="text-xs opacity-70 ml-1">({size.count})</span>
              </Button>
            ))}
          </div>
        </div>

        <Separator />

        {/* Colors */}
        <div className="space-y-3">
          <h4 className="font-medium">Colors</h4>
          <div className="flex flex-wrap gap-2">
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
              >
                {color.label}{" "}
                <span className="text-xs opacity-70 ml-1">({color.count})</span>
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
