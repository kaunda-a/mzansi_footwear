import { ProductService } from "@/lib/services";
import { CategorySelectorClient } from "./category-selector-client";

interface CategorySelectorProps {
  initialSelectedCategory?: string | null;
}

export async function CategorySelector({ initialSelectedCategory }: CategorySelectorProps) {
  try {
    // Fetch categories server-side
    const categories = await ProductService.getCategories();
    
    // Transform categories to include productCount
    const categoriesWithCount = categories.map(category => ({
      ...category,
      productCount: category._count?.products || 0
    }));
    
    return (
      <CategorySelectorClient 
        initialCategories={categoriesWithCount} 
        initialSelectedCategory={initialSelectedCategory}
      />
    );
  } catch (error) {
    console.error("Error fetching categories:", error);
    // Fallback to client-side fetching if server fetch fails
    return <CategorySelectorClient initialSelectedCategory={initialSelectedCategory} />;
  }
}