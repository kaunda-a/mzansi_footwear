import { CarouselBillboardContainer } from "@/components/catalog/billboard/carousel-billboard-container";

export function DashboardTopBillboard() {
  return (
    <div className="w-full mb-6">
      <CarouselBillboardContainer
        position="DASHBOARD_TOP"
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