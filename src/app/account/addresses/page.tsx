import { Suspense } from 'react'
import type { Metadata } from 'next'
import { SearchParams } from 'nuqs/server'
import { Header } from '@/components/layout/header'
import { StoreFooter } from '@/components/layout/footer'
import { Heading } from '@/components/ui/heading'
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton'
import { AccountAddresses } from '@/components/account'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'

export const metadata: Metadata = {
  title: 'Addresses | Mzansi Footwear',
  description: 'Manage your shipping and billing addresses for faster checkout at Mzansi Footwear.',
  keywords: 'addresses, shipping, billing, delivery, account, Mzansi Footwear',
}

interface AddressesPageProps {
  searchParams: Promise<SearchParams>
}

export default async function AddressesPage({ searchParams }: AddressesPageProps) {
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <Header />
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <div className="mx-auto grid w-full max-w-6xl gap-2">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/">Home</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href="/account">My Account</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Addresses</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <Heading
              title="Addresses"
              description="Manage your shipping and billing addresses for faster checkout."
            />
          </div>
          <div className="mx-auto grid w-full max-w-6xl items-start gap-6">
            <Suspense fallback={<DataTableSkeleton columnCount={3} rowCount={8} filterCount={0} />}>
              <AccountAddresses />
            </Suspense>
          </div>
        </main>
      </div>
      <StoreFooter />
    </div>
  )
}
