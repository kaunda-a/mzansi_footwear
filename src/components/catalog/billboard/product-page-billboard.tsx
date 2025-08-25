import { CarouselBillboardContainer } from "@/components/catalog/billboard/carousel-billboard-container";

export function ProductPageBillboard() {
  return (
    <div className="w-full my-6">
      <CarouselBillboardContainer
        position="PRODUCT_PAGE"
        height="h-56"
        autoPlay={true}
        autoPlayInterval={5000}
        showDots={true}
        showArrows={true}
        className="rounded-xl shadow-md"
      />
    </div>
  );
}