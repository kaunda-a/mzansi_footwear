import { Suspense } from 'react'
import type { Metadata } from 'next'
import { SearchParams } from 'nuqs/server'
import { Header } from '@/components/layout/header'
import { StoreFooter } from '@/components/layout/footer'
import { Heading } from '@/components/ui/heading'
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'

export const metadata: Metadata = {
  title: 'About Us | Mzansi Footwear',
  description: 'Learn about Mzansi Footwear - our story, mission, and commitment to quality South African footwear.',
  keywords: 'about us, Mzansi Footwear, South African shoes, company story, footwear brand',
}

interface AboutPageProps {
  searchParams: Promise<SearchParams>
}

export default async function AboutPage({ searchParams }: AboutPageProps) {
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
                  <BreadcrumbPage>About Us</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <Heading
              title="About Us"
              description="Learn about Mzansi Footwear - our story, mission, and commitment to quality."
            />
          </div>
          <div className="mx-auto grid w-full max-w-6xl items-start gap-6">
            <Suspense fallback={<DataTableSkeleton columnCount={1} rowCount={6} filterCount={0} />}>
              <div className="container mx-auto px-4 py-8 max-w-4xl">
                <div className="prose prose-gray dark:prose-invert max-w-none">
                  <h2>Our Story</h2>
                  <p>
                    Founded with a passion for quality footwear and South African craftsmanship, 
                    Mzansi Footwear has been serving customers with premium shoes since our inception.
                  </p>

                  <h2>Our Mission</h2>
                  <p>
                    To provide high-quality, comfortable, and stylish footwear that reflects the 
                    spirit and diversity of South Africa while maintaining affordable prices for all.
                  </p>

                  <h2>Our Values</h2>
                  <ul>
                    <li><strong>Quality:</strong> We source only the finest materials and work with skilled artisans</li>
                    <li><strong>Authenticity:</strong> Every product reflects genuine South African design and culture</li>
                    <li><strong>Sustainability:</strong> We're committed to environmentally responsible practices</li>
                    <li><strong>Community:</strong> Supporting local communities and businesses</li>
                  </ul>

                  <h2>Why Choose Us</h2>
                  <p>
                    With years of experience in the footwear industry, we understand what makes a 
                    great shoe. From comfort to durability, style to affordability - we deliver on all fronts.
                  </p>

                  <h2>Contact Us</h2>
                  <p>
                    Have questions or want to learn more? Reach out to us at info@mzansifootwear.com
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
