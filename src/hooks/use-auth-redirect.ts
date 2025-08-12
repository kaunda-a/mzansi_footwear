'use client'

import { useSession } from 'next-auth/react'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect } from 'react'

/**
 * Hook to redirect users to sign-in page if they're not authenticated
 * and trying to access protected routes
 */
export function useAuthRedirect() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const pathname = usePathname()

  const redirectToSignIn = (callbackUrl?: string) => {
    const url = callbackUrl || pathname
    router.push(`/auth/sign-in?callbackUrl=${encodeURIComponent(url)}`)
  }

  const requireAuth = (callback?: () => void, callbackUrl?: string) => {
    if (status === 'loading') return false
    
    if (!session) {
      redirectToSignIn(callbackUrl)
      return false
    }
    
    if (callback) callback()
    return true
  }

  return {
    session,
    isAuthenticated: !!session,
    isLoading: status === 'loading',
    redirectToSignIn,
    requireAuth
  }
}
