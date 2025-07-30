import { BillboardService, BillboardPosition } from '@/lib/services'
import { CarouselBillboard } from '@/components/ui/carousel-billboard'

interface CarouselBillboardContainerProps {
  position: BillboardPosition
  height?: string
  className?: string
  autoPlay?: boolean
  autoPlayInterval?: number
  showDots?: boolean
  showArrows?: boolean
}

export async function CarouselBillboardContainer({
  position,
  height = 'h-64 md:h-80 lg:h-96',
  className,
  autoPlay = true,
  autoPlayInterval = 5000,
  showDots = true,
  showArrows = true
}: CarouselBillboardContainerProps) {
  try {
    const billboards = await BillboardService.getActiveBillboards(position)

    if (!billboards.length) return null

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
    )
  } catch (error) {
    // Error handled by returning null (no billboards shown)
    return null
  }
}
