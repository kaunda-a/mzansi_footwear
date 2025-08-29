import { CategorySelector } from "@/components/catalog/category/category-selector";

export function CategorySection() {
  return (
    <div className="container mx-auto px-4 py-6 md:py-8">
      <div className="relative">
        {/* Decorative elements - hidden on mobile for better performance */}
        <div className="absolute -top-4 left-0 w-16 h-16 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full blur-2xl -z-10 hidden sm:block md:w-24 md:h-24" />
        <div className="absolute -bottom-4 right-0 w-20 h-20 bg-gradient-to-br from-secondary/10 to-primary/10 rounded-full blur-2xl -z-10 hidden sm:block md:w-32 md:h-32 md:-bottom-6" />
        
        <CategorySelector />
      </div>
    </div>
  );
}