import { CarouselBillboardContainer } from "@/components/catalog/billboard/carousel-billboard-container";

export function HeroBillboard() {
  return (
    <div className="container mx-auto px-4">
      <CarouselBillboardContainer
        position="HEADER"
        height="h-48 md:h-64 lg:h-80"
        autoPlay={true}
        autoPlayInterval={4000}
        showDots={true}
        showArrows={true}
      />
    </div>
  );
}