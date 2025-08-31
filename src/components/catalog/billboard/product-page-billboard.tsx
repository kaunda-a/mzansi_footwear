import { CarouselBillboardContainer } from "@/components/catalog/billboard/carousel-billboard-container";
import { Suspense } from "react";

export function ProductPageBillboard() {
  return (
    <div className="w-full my-6">
      <div className="relative rounded-2xl overflow-hidden shadow-xl border border-border/50">
        {/* Product page specific enhancements */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-black/15 pointer-events-none z-10" />
        
        {/* Vignette effect for product page */}
        <div className="absolute inset-0 shadow-[inset_0_0_6rem_0_rgba(0,0,0,0.4)] rounded-2xl pointer-events-none z-10" />
        
        {/* Color enhancement for product page */}
        <div className="absolute inset-0 bg-gradient-to-r from-accent/8 via-transparent to-secondary/8 mix-blend-overlay pointer-events-none z-10" />
        
        {/* Subtle glow effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-accent/15 to-secondary/15 rounded-2xl blur-lg opacity-40 z-0" />
        
        <div className="relative z-20">
          <Suspense fallback={<div className="h-56 rounded-2xl shadow-lg bg-muted animate-pulse" />}>
            <CarouselBillboardContainer
              position="PRODUCT_PAGE"
              height="h-56"
              autoPlay={true}
              autoPlayInterval={5000}
              showDots={true}
              showArrows={true}
              className="rounded-2xl shadow-lg"
            />
          </Suspense>
        </div>
      </div>
    </div>
  );
}