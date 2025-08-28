import { StickyCategoryNavigation } from "@/components/catalog/category/sticky-category-navigation";

export function CategorySection() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="relative">
        {/* Decorative elements */}
        <div className="absolute -top-4 left-0 w-24 h-24 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full blur-2xl -z-10" />
        <div className="absolute -bottom-4 right-0 w-32 h-32 bg-gradient-to-br from-secondary/10 to-primary/10 rounded-full blur-2xl -z-10" />
        
        <StickyCategoryNavigation />
      </div>
    </div>
  );
}