import { CategoryService } from "@/lib/services";
import { CategorySelectorClient } from "./category-selector-client";

interface CategorySelectorProps {
  initialSelectedCategory?: string | null;
}

export async function CategorySelector({ initialSelectedCategory }: CategorySelectorProps) {
  try {
    // Fetch categories server-side
    const categories = await CategoryService.getTrendingCategories();
    
    return (
      <CategorySelectorClient 
        initialCategories={categories} 
        initialSelectedCategory={initialSelectedCategory}
      />
    );
  } catch (error) {
    console.error("Error fetching categories:", error);
    // Fallback to client-side fetching if server fetch fails
    return <CategorySelectorClient initialSelectedCategory={initialSelectedCategory} />;
  }
}