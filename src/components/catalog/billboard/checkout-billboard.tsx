import { CarouselBillboardContainer } from "@/components/catalog/billboard/carousel-billboard-container";

export function CheckoutBillboard() {
  return (
    <div className="w-full my-4">
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
  );
}