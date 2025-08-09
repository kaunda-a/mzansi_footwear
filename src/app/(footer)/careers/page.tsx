import { Suspense } from 'react'
import type { Metadata } from 'next'
import { SearchParams } from 'nuqs/server'
import { Header } from '@/components/layout/header'
import { StoreFooter } from '@/components/layout/footer'
import { Heading } from '@/components/ui/heading'
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'

export const metadata: Metadata = {
  title: 'Careers | Mzansi Footwear',
  description: 'Join our team at Mzansi Footwear. Explore career opportunities and grow with us.',
  keywords: 'careers, jobs, employment, opportunities, Mzansi Footwear',
}

interface CareersPageProps {
  searchParams: Promise<SearchParams>
}

export default async function CareersPage({ searchParams }: CareersPageProps) {
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
                  <BreadcrumbPage>Careers</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <Heading
              title="Careers"
              description="Join our team at Mzansi Footwear. Explore career opportunities and grow with us."
            />
          </div>
          <div className="mx-auto grid w-full max-w-6xl items-start gap-6">
            <Suspense fallback={<DataTableSkeleton columnCount={1} />}>
              <div className="container mx-auto px-4 py-8 max-w-4xl">
                <div className="prose prose-gray dark:prose-invert max-w-none">
                  <p className="text-lg text-muted-foreground">
                    Join our passionate team and help us deliver quality footwear to customers across South Africa.
                  </p>

                  <h2>Why Work With Us?</h2>
                  <ul>
                    <li>Dynamic and inclusive work environment</li>
                    <li>Opportunities for professional growth and development</li>
                    <li>Competitive compensation and benefits</li>
                    <li>Be part of a growing South African brand</li>
                    <li>Make a real impact in the footwear industry</li>
                  </ul>

                  <h2>Current Opportunities</h2>
                  <p>
                    We're always looking for talented individuals to join our team. 
                    While we don't have any open positions at the moment, we encourage 
                    you to reach out if you're passionate about footwear and retail.
                  </p>

                  <h2>How to Apply</h2>
                  <p>
                    Interested in joining our team? Send your CV and a cover letter to 
                    careers@mzansifootwear.com. We'll review your application and get 
                    back to you if there's a suitable opportunity.
                  </p>

                  <h2>Internships</h2>
                  <p>
                    We believe in nurturing young talent. If you're a student or recent 
                    graduate looking for experience in retail, e-commerce, or fashion, 
                    we'd love to hear from you.
                  </p>

                  <h2>Contact Us</h2>
                  <p>
                    Have questions about working with us? Contact our HR team at 
                    hr@mzansifootwear.com
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
