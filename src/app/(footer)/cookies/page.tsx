import { Suspense } from 'react'
import type { Metadata } from 'next'
import { SearchParams } from 'nuqs/server'
import { Header } from '@/components/layout/header'
import { StoreFooter } from '@/components/layout/footer'
import { Heading } from '@/components/ui/heading'
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'

export const metadata: Metadata = {
  title: 'Cookie Policy | Mzansi Footwear',
  description: 'Learn about how we use cookies and similar technologies on our website.',
  keywords: 'cookie policy, cookies, tracking, Mzansi Footwear',
}

interface CookiesPageProps {
  searchParams: Promise<SearchParams>
}

export default async function CookiesPage({ searchParams }: CookiesPageProps) {
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
                  <BreadcrumbPage>Cookie Policy</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <Heading
              title="Cookie Policy"
              description="Learn about how we use cookies and similar technologies on our website."
            />
          </div>
          <div className="mx-auto grid w-full max-w-6xl items-start gap-6">
            <Suspense fallback={<DataTableSkeleton columnCount={1} />}>
              <div className="container mx-auto px-4 py-8 max-w-4xl">
                <div className="prose prose-gray dark:prose-invert max-w-none">
                  <p className="text-lg text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>

                  <h2>What Are Cookies</h2>
                  <p>
                    Cookies are small text files that are stored on your device when you visit our website. 
                    They help us provide you with a better browsing experience.
                  </p>

                  <h2>Types of Cookies We Use</h2>
                  <ul>
                    <li><strong>Essential Cookies:</strong> Required for the website to function properly</li>
                    <li><strong>Analytics Cookies:</strong> Help us understand how visitors use our website</li>
                    <li><strong>Marketing Cookies:</strong> Used to provide relevant advertisements</li>
                    <li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
                  </ul>

                  <h2>How We Use Cookies</h2>
                  <p>
                    We use cookies to enhance your browsing experience, analyze website traffic, 
                    and provide personalized content and advertisements.
                  </p>

                  <h2>Managing Cookies</h2>
                  <p>
                    You can control and manage cookies through your browser settings. However, 
                    disabling certain cookies may affect website functionality.
                  </p>

                  <h2>Contact Us</h2>
                  <p>
                    If you have questions about our use of cookies, please contact us at privacy@mzansifootwear.com
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
