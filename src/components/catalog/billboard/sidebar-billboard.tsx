import { CarouselBillboardContainer } from "@/components/catalog/billboard/carousel-billboard-container";

export function SidebarBillboard() {
  return (
    <div className="w-full">
      <CarouselBillboardContainer
        position="SIDEBAR"
        height="h-64"
        autoPlay={true}
        autoPlayInterval={5000}
        showDots={true}
        showArrows={false}
        className="rounded-lg shadow-sm border"
      />
    </div>
  );
}