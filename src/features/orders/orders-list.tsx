'use client'

import { Api } from '@/lib/api'
import { useState, useEffect } from 'react'
import { OrderWithDetails } from '@/lib/services'
import { searchParamsCache } from '@/lib/searchparams'
import { OrderTable } from './order-tables'
import { columns } from './order-tables/columns'
import { useSession } from 'next-auth/react'
import { redirect, useRouter } from 'next/navigation'

type OrderListingPageProps = {}

export function OrderListingPage({}: OrderListingPageProps) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [orders, setOrders] = useState<OrderWithDetails[]>([])
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 0, limit: 10 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Get search params from cache
  const {
    page,
    perPage: pageLimit,
    search,
    status: orderStatus,
    paymentStatus,
    shippingStatus
  } = searchParamsCache.all()

  useEffect(() => {
    if (status === 'loading') return
    
    if (!session?.user) {
      router.push('/auth/sign-in?callbackUrl=/orders')
      return
    }

    async function fetchOrders() {
      try {
        setLoading(true)
        setError(null)
        
        const result = await Api.getOrders({
          page: Number(page) || 1,
          limit: Number(pageLimit) || 10,
          search: search || undefined,
          status: orderStatus || undefined,
          userId: session?.user?.id,
        })
        
        setOrders(result.orders)
        setPagination(result.pagination)
      } catch (err) {
        setError('Failed to load orders')
        console.error('Error loading orders:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [session, status, page, pageLimit, search, orderStatus, paymentStatus, shippingStatus, router])

  if (status === 'loading' || loading) {
    return <div className="text-center py-12">Loading...</div>
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-semibold mb-2">Something went wrong</h3>
        <p className="text-muted-foreground">{error}</p>
      </div>
    )
  }

  return (
    <OrderTable
      data={orders}
      totalItems={pagination.total}
      columns={columns}
    />
  )
}

