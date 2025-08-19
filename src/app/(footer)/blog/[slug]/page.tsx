import { Suspense } from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Header from "@/components/layout/header";
import { StoreFooter } from "@/components/layout/footer";
import FormCardSkeleton from "@/components/form-card-skeleton";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata(
  props: BlogPostPageProps,
): Promise<Metadata> {
  const params = await props.params;

  // TODO: Replace with actual blog service when implemented
  // For now, return basic metadata
  return {
    title: `Blog Post - Mzansi Footwear`,
    description: `Read our latest blog post about footwear trends and fashion.`,
    keywords: `blog, footwear, fashion, trends, Mzansi Footwear`,
    openGraph: {
      title: `Blog Post - Mzansi Footwear`,
      description: `Read our latest blog post about footwear trends and fashion.`,
      type: "article",
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function Page(props: BlogPostPageProps) {
  const params = await props.params;

  // TODO: Add blog service integration when blog functionality is implemented
  // For now, show a coming soon message

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        {/* Breadcrumbs */}
        <div className="bg-gray-50 border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/">Home</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href="/blog">Blog</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Blog Post</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </div>

        {/* Blog Post Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Suspense fallback={<FormCardSkeleton />}>
            <div className="prose prose-gray dark:prose-invert max-w-4xl mx-auto">
              <h1>Blog Post Coming Soon</h1>
              <p className="text-lg text-muted-foreground">
                Individual blog posts are not yet implemented. This page
                structure is ready for when blog functionality is added.
              </p>

              <h2>What to Expect</h2>
              <p>
                Once our blog system is implemented, you'll be able to read
                detailed articles about:
              </p>
              <ul>
                <li>Latest footwear trends</li>
                <li>Shoe care and maintenance tips</li>
                <li>Fashion styling guides</li>
                <li>Brand spotlights and collaborations</li>
                <li>Industry news and updates</li>
              </ul>

              <p>
                <a href="/blog" className="text-primary hover:underline">
                  ← Back to Blog
                </a>
              </p>
            </div>
          </Suspense>
        </div>
      </main>
      <StoreFooter />
    </div>
  );
}
