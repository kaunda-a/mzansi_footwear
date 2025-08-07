import { MarqueeService } from '@/lib/services'
import { Marquee } from '@/features/marquee/components/marquee-ui'
import { Suspense } from 'react'

function MarqueeSkeleton() {
  return (
    <div className="h-12 bg-muted animate-pulse" />
  )
}

async function MarqueeContent() {
  try {
    const messages = await MarqueeService.getActiveMessages()

    if (!messages.length) return null

    return (
      <Marquee
        messages={messages}
        speed="normal"
        pauseOnHover
        showControls
        className="sticky top-0 z-50"
      />
    )
  } catch (error) {
    console.error('Error loading marquee messages:', error)
    return null
  }
}

export function MarqueeContainer() {
  return (
    <Suspense fallback={<MarqueeSkeleton />}>
      <MarqueeContent />
    </Suspense>
  )
}
