import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface CategoryCardProps {
  id: string;
  name: string;
  productCount?: number;
  icon?: React.ReactNode;
  href?: string;
  isSelected?: boolean;
  onClick?: () => void;
  variant?: "grid" | "list";
  className?: string;
}

export function CategoryCard({
  id,
  name,
  productCount,
  icon,
  href,
  isSelected,
  onClick,
  variant = "grid",
  className
}: CategoryCardProps) {
  const content = (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "w-full flex flex-col items-center justify-center rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border backdrop-blur-sm",
        variant === "grid" ? "h-24" : "h-16 flex-row justify-between px-4",
        isSelected
          ? "border-primary/50 bg-gradient-to-br from-primary/20 to-primary/10 hover:from-primary/30 hover:to-primary/20 shadow-primary/20"
          : "border-border/50 bg-gradient-to-br from-background/80 to-muted/40 hover:from-accent/20 hover:to-accent/10",
        className
      )}
    >
      <div className="flex items-center w-full">
        {icon && (
          <div className={cn(
            "text-primary",
            variant === "grid" ? "h-8 w-8 mb-2" : "h-6 w-6 mr-3"
          )}>
            {icon}
          </div>
        )}
        <div className="flex flex-col items-start">
          <span className={cn(
            "font-semibold truncate",
            variant === "grid" ? "text-sm" : "text-base"
          )}>
            {name}
          </span>
          {variant === "grid" && productCount !== undefined && productCount > 0 && (
            <span className="text-xs mt-1 text-primary/80">{productCount} items</span>
          )}
        </div>
        {variant === "list" && productCount !== undefined && productCount > 0 && (
          <Badge variant="secondary" className="ml-auto">
            {productCount}
          </Badge>
        )}
      </div>
      {variant === "grid" && productCount !== undefined && productCount > 0 && (
        <span className="text-xs mt-1 bg-primary/10 text-primary rounded-full px-2 py-0.5">
          {productCount} items
        </span>
      )}
    </motion.div>
  );

  if (href) {
    return (
      <Link href={href} passHref>
        {content}
      </Link>
    );
  }

  return (
    <Button
      variant={isSelected ? "default" : "secondary"}
      className="p-0 h-auto"
      onClick={onClick}
    >
      {content}
    </Button>
  );
}