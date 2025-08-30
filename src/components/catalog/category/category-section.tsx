import { CategorySelector } from "@/components/catalog/category/category-selector";
import { motion } from "motion/react";

export function CategorySection() {
  return (
    <motion.div 
      className="container mx-auto px-4 py-6 md:py-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative">
        {/* Decorative elements with enhanced styling */}
        <motion.div 
          className="absolute -top-4 left-0 w-16 h-16 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full blur-2xl -z-10 hidden sm:block md:w-24 md:h-24"
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.2, 0.3, 0.2]
          }}
          transition={{ 
            duration: 4,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
        <motion.div 
          className="absolute -bottom-4 right-0 w-20 h-20 bg-gradient-to-br from-secondary/10 to-primary/10 rounded-full blur-2xl -z-10 hidden sm:block md:w-32 md:h-32 md:-bottom-6"
          animate={{ 
            scale: [1, 1.15, 1],
            opacity: [0.2, 0.3, 0.2]
          }}
          transition={{ 
            duration: 5,
            repeat: Infinity,
            repeatType: "reverse",
            delay: 0.5
          }}
        />
        
        {/* Enhanced section header */}
        <motion.div 
          className="mb-6 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-2xl md:text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-tight">
            Explore Categories
          </h2>
          <p className="mt-2 text-sm text-muted-foreground max-w-2xl mx-auto">
            Discover our premium collection organized by your favorite categories
          </p>
        </motion.div>
        
        <CategorySelector />
      </div>
    </motion.div>
  );
}