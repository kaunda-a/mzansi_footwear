import { Suspense } from "react";
import type { Metadata } from "next";
import { SearchParams } from "nuqs/server";
import { Heading } from "@/components/ui/heading";
import { DataTableSkeleton } from "@/components/ui/table/data-table-skeleton";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export const metadata: Metadata = {
  title: "Terms of Service | Mzansi Footwear",
  description:
    "Read our terms of service to understand the rules and regulations for using our website and services.",
  keywords: "terms of service, terms and conditions, legal, Mzansi Footwear",
};

interface TermsPageProps {
  searchParams: Promise<SearchParams>;
}

export default async function TermsPage({ searchParams }: TermsPageProps) {
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
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
                  <BreadcrumbPage>Terms of Service</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <Heading
              title="Terms of Service"
              description="Read our terms of service to understand the rules and regulations for using our website and services."
            />
          </div>
          <div className="mx-auto grid w-full max-w-6xl items-start gap-6">
            <Suspense fallback={<DataTableSkeleton columnCount={1} />}>
              <div className="container mx-auto px-4 py-8 max-w-4xl">
                <div className="prose prose-gray dark:prose-invert max-w-none">
                  <p className="text-lg text-muted-foreground">
                    Last updated: {new Date().toLocaleDateString()}
                  </p>

                  <h2>Acceptance of Terms</h2>
                  <p>
                    By accessing and using this website, you accept and agree to
                    be bound by the terms and provision of this agreement.
                  </p>

                  <h2>Products and Services</h2>
                  <p>
                    All products and services are subject to availability. We
                    reserve the right to discontinue any product or service at
                    any time.
                  </p>

                  <h2>Pricing and Payment</h2>
                  <p>
                    All prices are subject to change without notice. Payment
                    must be received in full before products are shipped.
                  </p>

                  <h2>Shipping and Returns</h2>
                  <p>
                    Please refer to our shipping and returns policies for
                    detailed information about delivery and return procedures.
                  </p>

                  <h2>Limitation of Liability</h2>
                  <p>
                    In no event shall Mzansi Footwear be liable for any
                    indirect, incidental, or consequential damages arising from
                    the use of our products or services.
                  </p>

                  <h2>Contact Information</h2>
                  <p>
                    For questions about these Terms of Service, please contact
                    us at legal@mzansifootwear.com
                  </p>
                </div>
              </div>
            </Suspense>
          </div>
        </main>
      </div>
    </div>
  );
}
