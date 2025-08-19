import { Suspense } from "react";
import type { Metadata } from "next";
import { SearchParams } from "nuqs/server";
import { Header } from "@/components/layout/header";
import { StoreFooter } from "@/components/layout/footer";
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
  title: "Contact Us | Mzansi Footwear",
  description:
    "Get in touch with Mzansi Footwear. Find our contact information and send us a message.",
  keywords: "contact us, customer service, support, Mzansi Footwear",
};

interface ContactPageProps {
  searchParams: Promise<SearchParams>;
}

export default async function ContactPage({ searchParams }: ContactPageProps) {
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
                  <BreadcrumbPage>Contact Us</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <Heading
              title="Contact Us"
              description="Get in touch with Mzansi Footwear. Find our contact information and send us a message."
            />
          </div>
          <div className="mx-auto grid w-full max-w-6xl items-start gap-6">
            <Suspense fallback={<DataTableSkeleton columnCount={1} />}>
              <div className="container mx-auto px-4 py-8 max-w-4xl">
                <div className="prose prose-gray dark:prose-invert max-w-none">
                  <p className="text-lg text-muted-foreground">
                    We'd love to hear from you. Get in touch with our team for
                    any questions or support.
                  </p>

                  <div className="not-prose mt-8 grid md:grid-cols-2 gap-8">
                    <div>
                      <h2 className="text-xl font-semibold mb-4">
                        Get in Touch
                      </h2>
                      <div className="space-y-4">
                        <div>
                          <h3 className="font-medium">Email</h3>
                          <p className="text-muted-foreground">
                            info@mzansifootwear.com
                          </p>
                        </div>

                        <div>
                          <h3 className="font-medium">Customer Support</h3>
                          <p className="text-muted-foreground">
                            support@mzansifootwear.com
                          </p>
                        </div>

                        <div>
                          <h3 className="font-medium">Business Hours</h3>
                          <p className="text-muted-foreground">
                            Monday - Friday: 9:00 AM - 6:00 PM
                            <br />
                            Saturday: 10:00 AM - 4:00 PM
                            <br />
                            Sunday: Closed
                          </p>
                        </div>

                        <div>
                          <h3 className="font-medium">Response Time</h3>
                          <p className="text-muted-foreground">
                            We typically respond to emails within 24 hours
                            during business days.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h2 className="text-xl font-semibold mb-4">
                        Quick Links
                      </h2>
                      <div className="space-y-2">
                        <div>
                          <h3 className="font-medium">Need Help?</h3>
                          <p className="text-muted-foreground">
                            Check our{" "}
                            <a
                              href="/faq"
                              className="text-primary hover:underline"
                            >
                              FAQ page
                            </a>{" "}
                            for quick answers.
                          </p>
                        </div>

                        <div>
                          <h3 className="font-medium">Orders & Returns</h3>
                          <p className="text-muted-foreground">
                            Visit our{" "}
                            <a
                              href="/returns"
                              className="text-primary hover:underline"
                            >
                              Returns page
                            </a>{" "}
                            for return policies.
                          </p>
                        </div>

                        <div>
                          <h3 className="font-medium">Shipping Information</h3>
                          <p className="text-muted-foreground">
                            Learn about our{" "}
                            <a
                              href="/shipping"
                              className="text-primary hover:underline"
                            >
                              shipping options
                            </a>
                            .
                          </p>
                        </div>
                      </div>
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
  );
}
