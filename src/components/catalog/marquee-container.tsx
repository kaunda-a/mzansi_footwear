import React, { Suspense } from 'react'
import { Marquee } from '@/features/marquee/components/marquee-ui'
import { MarqueeMessageWithCreator } from '@/lib/services'
import { Api } from '@/lib/api'

function MarqueeSkeleton() {
  return (
    <div className="h-12 bg-muted animate-pulse" />
  )
}

async function MarqueeContent(): Promise<React.ReactElement | null> {
  try {
    const messages: MarqueeMessageWithCreator[] = await Api.getActiveMarqueeMessages()

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
