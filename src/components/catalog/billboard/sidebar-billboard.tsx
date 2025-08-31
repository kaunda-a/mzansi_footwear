import { CarouselBillboardContainer } from "@/components/catalog/billboard/carousel-billboard-container";
import { Suspense } from "react";

export function SidebarBillboard() {
  return (
    <div className="w-full">
      <Suspense fallback={<div className="h-64 rounded-lg shadow-sm border bg-muted animate-pulse" />}>
        <CarouselBillboardContainer
          position="SIDEBAR"
          height="h-64"
          autoPlay={true}
          autoPlayInterval={5000}
          showDots={true}
          showArrows={false}
          className="rounded-lg shadow-sm border"
        />
      </Suspense>
    </div>
  );
}