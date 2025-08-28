import { CarouselBillboardContainer } from "@/components/catalog/billboard/carousel-billboard-container";

export function DashboardTopBillboard() {
  return (
    <div className="w-full mb-6">
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-background/80 to-muted/50 backdrop-blur-sm border border-border/50 shadow-lg">
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl -translate-y-16 translate-x-16" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-secondary/5 rounded-full blur-2xl translate-y-12 -translate-x-12" />
        
        <div className="relative p-1">
          <CarouselBillboardContainer
            position="DASHBOARD_TOP"
            height="h-48"
            autoPlay={true}
            autoPlayInterval={6000}
            showDots={true}
            showArrows={true}
            className="rounded-lg"
          />
        </div>
      </div>
    </div>
  );
}