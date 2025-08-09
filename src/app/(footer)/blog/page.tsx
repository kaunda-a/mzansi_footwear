import { Suspense } from 'react'
import type { Metadata } from 'next'
import { SearchParams } from 'nuqs/server'
import { Header } from '@/components/layout/header'
import { StoreFooter } from '@/components/layout/footer'
import { Heading } from '@/components/ui/heading'
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'

export const metadata: Metadata = {
  title: 'Blog | Mzansi Footwear',
  description: 'Read our latest articles about footwear trends, care tips, and South African fashion.',
  keywords: 'blog, footwear trends, shoe care, fashion, Mzansi Footwear',
}

interface BlogPageProps {
  searchParams: Promise<SearchParams>
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
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
                  <BreadcrumbPage>Blog</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <Heading
              title="Blog"
              description="Read our latest articles about footwear trends, care tips, and South African fashion."
            />
          </div>
          <div className="mx-auto grid w-full max-w-6xl items-start gap-6">
            <Suspense fallback={<DataTableSkeleton columnCount={1} />}>
              <div className="container mx-auto px-4 py-8 max-w-4xl">
                <div className="prose prose-gray dark:prose-invert max-w-none">
                  <p className="text-lg text-muted-foreground">
                    Stay updated with the latest footwear trends, care tips, and fashion insights.
                  </p>

                  <div className="not-prose mt-8">
                    <div className="grid gap-6">
                      <article className="border rounded-lg p-6">
                        <h2 className="text-xl font-semibold mb-2">Coming Soon</h2>
                        <p className="text-muted-foreground mb-4">
                          Our blog is currently under development. We'll be sharing exciting content about 
                          footwear trends, care guides, and fashion tips very soon.
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Stay tuned for updates!
                        </p>
                      </article>

                      <article className="border rounded-lg p-6">
                        <h2 className="text-xl font-semibold mb-2">Subscribe for Updates</h2>
                        <p className="text-muted-foreground mb-4">
                          Be the first to know when we publish new articles. Subscribe to our newsletter 
                          for the latest footwear insights and company updates.
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Contact us at newsletter@mzansifootwear.com to subscribe.
                        </p>
                      </article>
                    </div>
                  </div>
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
