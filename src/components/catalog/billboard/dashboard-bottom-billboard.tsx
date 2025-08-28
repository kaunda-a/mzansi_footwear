import { CarouselBillboardContainer } from "@/components/catalog/billboard/carousel-billboard-container";

export function DashboardBottomBillboard() {
  return (
    <div className="w-full mt-6">
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-muted/50 to-background/80 backdrop-blur-sm border border-border/50 shadow-lg">
        {/* Decorative Elements - Flipped and with different colors */}
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-accent/5 rounded-full blur-2xl translate-y-16 -translate-x-16" />
        <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl -translate-y-12 translate-x-12" />
        
        {/* Unique decorative line */}
        <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
        
        <div className="relative p-1">
          <CarouselBillboardContainer
            position="DASHBOARD_BOTTOM"
            height="h-48"
            autoPlay={true}
            autoPlayInterval={7000}
            showDots={true}
            showArrows={true}
            className="rounded-lg"
          />
        </div>
      </div>
    </div>
  );
}