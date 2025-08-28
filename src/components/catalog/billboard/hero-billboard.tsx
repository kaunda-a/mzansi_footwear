import { CarouselBillboardContainer } from "@/components/catalog/billboard/carousel-billboard-container";

export function HeroBillboard() {
  return (
    <div className="container mx-auto px-4">
      <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-border/50">
        {/* Hero-specific enhancements */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/10 pointer-events-none z-10" />
        
        {/* Vignette effect for hero */}
        <div className="absolute inset-0 shadow-[inset_0_0_8rem_0_rgba(0,0,0,0.5)] rounded-2xl pointer-events-none z-10" />
        
        {/* Color enhancement for hero */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-secondary/10 mix-blend-overlay pointer-events-none z-10" />
        
        {/* Hero accent glow */}
        <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-2xl blur-xl opacity-30 z-0" />
        
        <div className="relative z-20">
          <CarouselBillboardContainer
            position="HEADER"
            height="h-48 md:h-64 lg:h-80"
            autoPlay={true}
            autoPlayInterval={4000}
            showDots={true}
            showArrows={true}
            className="rounded-2xl"
          />
        </div>
      </div>
    </div>
  );
}