import { CarouselBillboardContainer } from "@/components/catalog/billboard/carousel-billboard-container";

export function DashboardBottomBillboard() {
  return (
    <div className="w-full mt-6">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-background/90 via-accent/5 to-muted/30 backdrop-blur-xl border border-border/60 shadow-xl shadow-accent/5">
        {/* Modern geometric decorative elements */}
        <div className="absolute -bottom-8 -left-8 w-40 h-40 rounded-full bg-gradient-to-br from-primary/10 to-accent/5 blur-3xl" />
        <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-gradient-to-br from-secondary/10 to-primary/5 blur-3xl" />
        
        {/* Sophisticated grid pattern overlay */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 15px 15px, #ccc 1px, transparent 0)`,
            backgroundSize: '30px 30px'
          }} />
        </div>
        
        {/* Elegant accent border */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
        
        {/* Premium badge indicator - consistent color scheme with dashboard top */}
        <div className="absolute top-2 right-2 md:top-3 md:left-3 z-10">
          <div className="flex items-center gap-1.5 bg-background/80 backdrop-blur-sm px-2 py-1 rounded-full border border-border/50 shadow-sm">
            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <span className="text-[8px] md:text-[9px] font-semibold uppercase tracking-widest text-primary whitespace-nowrap">Featured</span>
          </div>
        </div>
        
        <div className="relative p-1.5">
          <div className="relative rounded-xl overflow-hidden">
            {/* Image enhancement overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/5 pointer-events-none z-10" />
            
            {/* Vignette effect */}
            <div className="absolute inset-0 shadow-[inset_0_0_5rem_0_rgba(0,0,0,0.4)] rounded-xl pointer-events-none z-10" />
            
            {/* Saturation boost effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5 mix-blend-overlay pointer-events-none z-10" />
            
            <CarouselBillboardContainer
              position="DASHBOARD_BOTTOM"
              height="h-48"
              autoPlay={true}
              autoPlayInterval={7000}
              showDots={true}
              showArrows={true}
              className="rounded-xl shadow-lg"
            />
          </div>
        </div>
        
        {/* Subtle reflection effect */}
        <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-background/30 to-transparent pointer-events-none" />
      </div>
    </div>
  );
}