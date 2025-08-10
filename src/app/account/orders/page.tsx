import { Suspense } from 'react'
import type { Metadata } from 'next'
import { SearchParams } from 'nuqs/server'
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton'
import { AccountOrders } from '@/components/account'
import { AccountLayout } from '@/components/account/account-layout'

export const metadata: Metadata = {
  title: 'Orders | Mzansi Footwear',
  description: 'Track and manage your orders, view order history and tracking information at Mzansi Footwear.',
  keywords: 'orders, tracking, order history, purchases, account, Mzansi Footwear',
}

interface OrdersPageProps {
  searchParams: Promise<SearchParams>
}

export default async function OrdersPage({ searchParams }: OrdersPageProps) {
  return (
    <AccountLayout
      title="Orders"
      description="Track and manage your orders, view order history and tracking information."
      breadcrumbs={[{ label: 'Orders' }]}
    >
      <Suspense fallback={<DataTableSkeleton columnCount={3} rowCount={8} filterCount={0} />}>
        <AccountOrders />
      </Suspense>
    </AccountLayout>
  )
}
