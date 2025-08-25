import { CarouselBillboardContainer } from "@/components/catalog/billboard/carousel-billboard-container";

export function DashboardBottomBillboard() {
  return (
    <div className="w-full mt-6">
      <CarouselBillboardContainer
        position="DASHBOARD_BOTTOM"
        height="h-48"
        autoPlay={true}
        autoPlayInterval={6000}
        showDots={true}
        showArrows={true}
        className="rounded-lg shadow-sm"
      />
    </div>
  );
}