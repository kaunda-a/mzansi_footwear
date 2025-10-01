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
  title: "Returns & Refunds | Mzansi Footwear",
  description:
    "Learn about our return policy, refund process, and how to exchange items at Mzansi Footwear.",
  keywords: "returns, refunds, exchange, return policy, Mzansi Footwear",
};

interface ReturnsPageProps {
  searchParams: Promise<SearchParams>;
}

export default async function ReturnsPage({ searchParams }: ReturnsPageProps) {
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
                  <BreadcrumbPage>Returns & Refunds</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <Heading
              title="Returns & Refunds"
              description="Learn about our return policy, refund process, and how to exchange items at Mzansi Footwear."
            />
          </div>
          <div className="mx-auto grid w-full max-w-6xl items-start gap-6">
            <Suspense fallback={<DataTableSkeleton columnCount={1} />}>
              <div className="container mx-auto px-4 py-8 max-w-4xl">
                <div className="prose prose-gray dark:prose-invert max-w-none">
                  <p className="text-lg text-muted-foreground">
                    We want you to be completely satisfied with your purchase.
                    Here's our return policy.
                  </p>

                  <h2>Return Policy</h2>
                  <p>
                    You may return most new, unworn items within 30 days of
                    delivery for a full refund. Items must be in their original
                    condition with all tags attached.
                  </p>

                  <h2>Return Process</h2>
                  <ol>
                    <li>
                      Contact our customer service team at
                      returns@mzansifootwear.com
                    </li>
                    <li>Provide your order number and reason for return</li>
                    <li>We'll send you a prepaid return label</li>
                    <li>
                      Package your items securely and attach the return label
                    </li>
                    <li>Drop off at your nearest courier location</li>
                  </ol>

                  <h2>Refund Timeline</h2>
                  <div className="not-prose">
                    <div className="border rounded-lg p-4 my-6">
                      <h3 className="font-semibold mb-2">Processing Time</h3>
                      <ul className="space-y-1 text-sm">
                        <li>• Items received: 1-2 business days</li>
                        <li>• Inspection & processing: 2-3 business days</li>
                        <li>• Refund issued: 3-5 business days</li>
                      </ul>
                    </div>
                  </div>

                  <h2>Exchanges</h2>
                  <p>
                    Need a different size or color? We offer free exchanges
                    within 30 days. Follow the same return process and indicate
                    you'd like an exchange.
                  </p>

                  <h2>Items We Cannot Accept</h2>
                  <ul>
                    <li>Items worn outdoors or showing signs of wear</li>
                    <li>Items without original tags or packaging</li>
                    <li>Personalized or custom items</li>
                    <li>Items returned after 30 days</li>
                  </ul>

                  <h2>Return Shipping</h2>
                  <p>
                    We provide prepaid return labels for defective items or our
                    errors. For other returns, customers are responsible for
                    return shipping costs.
                  </p>

                  <h2>Damaged or Defective Items</h2>
                  <p>
                    If you receive damaged or defective items, contact us
                    immediately at support@mzansifootwear.com. We'll arrange for
                    a replacement or full refund.
                  </p>

                  <h2>Questions?</h2>
                  <p>
                    Contact our customer service team at
                    returns@mzansifootwear.com for assistance with your return.
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
