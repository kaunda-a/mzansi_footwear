import { Suspense } from 'react'
import type { Metadata } from 'next'
import { SearchParams } from 'nuqs/server'
import { Header } from '@/components/layout/header'
import { StoreFooter } from '@/components/layout/footer'
import { Heading } from '@/components/ui/heading'
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'

export const metadata: Metadata = {
  title: 'Shipping Information | Mzansi Footwear',
  description: 'Learn about our shipping options, delivery times, and costs for Mzansi Footwear orders.',
  keywords: 'shipping, delivery, shipping costs, delivery times, Mzansi Footwear',
}

interface ShippingPageProps {
  searchParams: Promise<SearchParams>
}

export default async function ShippingPage({ searchParams }: ShippingPageProps) {
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
                  <BreadcrumbPage>Shipping Information</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <Heading
              title="Shipping Information"
              description="Learn about our shipping options, delivery times, and costs for Mzansi Footwear orders."
            />
          </div>
          <div className="mx-auto grid w-full max-w-6xl items-start gap-6">
            <Suspense fallback={<DataTableSkeleton columnCount={1} />}>
              <div className="container mx-auto px-4 py-8 max-w-4xl">
                <div className="prose prose-gray dark:prose-invert max-w-none">
                  <p className="text-lg text-muted-foreground">
                    Everything you need to know about shipping and delivery for your Mzansi Footwear orders.
                  </p>

                  <h2>Shipping Options</h2>
                  <div className="not-prose">
                    <div className="grid gap-4 my-6">
                      <div className="border rounded-lg p-4">
                        <h3 className="font-semibold">Standard Shipping</h3>
                        <p className="text-muted-foreground">3-5 business days | R50</p>
                        <p className="text-sm">Available nationwide</p>
                      </div>
                      
                      <div className="border rounded-lg p-4">
                        <h3 className="font-semibold">Express Shipping</h3>
                        <p className="text-muted-foreground">1-2 business days | R120</p>
                        <p className="text-sm">Available in major cities</p>
                      </div>
                      
                      <div className="border rounded-lg p-4">
                        <h3 className="font-semibold">Free Shipping</h3>
                        <p className="text-muted-foreground">3-5 business days | Free</p>
                        <p className="text-sm">On orders over R1000</p>
                      </div>
                    </div>
                  </div>

                  <h2>Delivery Areas</h2>
                  <p>
                    We deliver to all major cities and towns across South Africa, including:
                  </p>
                  <ul>
                    <li>Johannesburg and surrounding areas</li>
                    <li>Cape Town and Western Cape</li>
                    <li>Durban and KwaZulu-Natal</li>
                    <li>Pretoria and Tshwane</li>
                    <li>Port Elizabeth and Eastern Cape</li>
                    <li>Bloemfontein and Free State</li>
                  </ul>

                  <h2>Processing Time</h2>
                  <p>
                    Orders are typically processed within 1-2 business days. You'll receive 
                    a confirmation email with tracking information once your order ships.
                  </p>

                  <h2>Tracking Your Order</h2>
                  <p>
                    Once your order is shipped, you'll receive a tracking number via email. 
                    You can also track your order by logging into your account.
                  </p>

                  <h2>Delivery Instructions</h2>
                  <p>
                    Please ensure someone is available to receive your package during delivery hours. 
                    If no one is available, the courier will leave a notice for redelivery.
                  </p>

                  <h2>Questions?</h2>
                  <p>
                    For shipping-related questions, contact us at shipping@mzansifootwear.com
                  </p>
                </div>
              </div>
            </Suspense>
          </div>
        </main>
      </div>
      <StoreFooter />
    </div>
  )
}
