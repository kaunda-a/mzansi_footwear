import { BillboardService, BillboardPosition, BillboardWithCreator } from "@/lib/services";
import { CarouselBillboard } from "./carousel-billboard";
import { SophisticatedBillboard } from "./sophisticated-billboard";

interface CarouselBillboardContainerProps {
  position: BillboardPosition;
  height?: string;
  className?: string;
  autoPlay?: boolean;
  autoPlayInterval?: number;
  showDots?: boolean;
  showArrows?: boolean;
}

export async function CarouselBillboardContainer({
  position,
  height = "h-64 md:h-80 lg:h-96",
  className,
  autoPlay = true,
  autoPlayInterval = 5000,
  showDots = true,
  showArrows = true,
}: CarouselBillboardContainerProps) {
  try {
    const billboards = await BillboardService.getActiveBillboards(position);

    if (!billboards.length) return null;

    // If there's only one billboard, show it as a sophisticated billboard instead of a carousel
    if (billboards.length === 1) {
      const billboard = billboards[0];
      return (
        <SophisticatedBillboard
          title={billboard.title}
          description={billboard.description || "No description available"}
          type={billboard.type as any}
          linkUrl={billboard.linkUrl || undefined}
          linkText={billboard.linkText || undefined}
          className={className}
        />
      );
    }

    return (
      <CarouselBillboard
        billboards={billboards}
        height={height}
        className={className}
        autoPlay={autoPlay}
        autoPlayInterval={autoPlayInterval}
        showDots={showDots}
        showArrows={showArrows}
      />
    );
  } catch (error) {
    // Error handled by returning null (no billboards shown)
    return null;
  }
}