import { CarouselBillboardContainer } from "@/components/catalog/billboard/carousel-billboard-container";

export function CheckoutBillboard() {
  return (
    <div className="w-full my-4">
      <div className="relative rounded-xl overflow-hidden shadow-lg border border-border/50">
        {/* Checkout specific enhancements */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/10 pointer-events-none z-10" />
        
        {/* Vignette effect for checkout */}
        <div className="absolute inset-0 shadow-[inset_0_0_4rem_0_rgba(0,0,0,0.3)] rounded-xl pointer-events-none z-10" />
        
        {/* Color enhancement for checkout */}
        <div className="absolute inset-0 bg-gradient-to-r from-green-500/8 via-transparent to-emerald-500/8 mix-blend-overlay pointer-events-none z-10" />
        
        {/* Subtle success glow */}
        <div className="absolute -inset-1 bg-gradient-to-r from-green-500/15 to-emerald-500/15 rounded-xl blur-lg opacity-30 z-0" />
        
        <div className="relative z-20">
          <CarouselBillboardContainer
            position="CHECKOUT"
            height="h-40"
            autoPlay={true}
            autoPlayInterval={4000}
            showDots={true}
            showArrows={false}
            className="rounded-lg border"
          />
        </div>
      </div>
    </div>
  );
}