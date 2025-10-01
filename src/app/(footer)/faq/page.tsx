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
  title: "Frequently Asked Questions | Mzansi Footwear",
  description:
    "Find answers to common questions about orders, shipping, returns, and more at Mzansi Footwear.",
  keywords: "FAQ, frequently asked questions, help, support, Mzansi Footwear",
};

interface FAQPageProps {
  searchParams: Promise<SearchParams>;
}

export default async function FAQPage({ searchParams }: FAQPageProps) {
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
                  <BreadcrumbPage>FAQ</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <Heading
              title="Frequently Asked Questions"
              description="Find answers to common questions about orders, shipping, returns, and more at Mzansi Footwear."
            />
          </div>
          <div className="mx-auto grid w-full max-w-6xl items-start gap-6">
            <Suspense fallback={<DataTableSkeleton columnCount={1} />}>
              <div className="container mx-auto px-4 py-8 max-w-4xl">
                <div className="prose prose-gray dark:prose-invert max-w-none">
                  <p className="text-lg text-muted-foreground">
                    Find quick answers to the most common questions about our
                    products and services.
                  </p>

                  <h2>Orders & Payment</h2>

                  <h3>How do I place an order?</h3>
                  <p>
                    Simply browse our products, select your size and preferred
                    items, add them to your cart, and proceed to checkout. You
                    can pay using credit card, debit card, or EFT.
                  </p>

                  <h3>Can I modify or cancel my order?</h3>
                  <p>
                    You can modify or cancel your order within 1 hour of placing
                    it. After that, your order will be in processing and cannot
                    be changed.
                  </p>

                  <h3>What payment methods do you accept?</h3>
                  <p>
                    We accept all major credit cards (Visa, Mastercard), debit
                    cards, and EFT payments. All transactions are secure and
                    encrypted.
                  </p>

                  <h2>Shipping & Delivery</h2>

                  <h3>How long does shipping take?</h3>
                  <p>
                    Standard shipping takes 3-5 business days, while express
                    shipping takes 1-2 business days. Free shipping (on orders
                    over R1000) takes 3-5 business days.
                  </p>

                  <h3>Do you ship nationwide?</h3>
                  <p>
                    Yes, we ship to all major cities and towns across South
                    Africa. Check our shipping page for more details.
                  </p>

                  <h3>How can I track my order?</h3>
                  <p>
                    Once shipped, you'll receive a tracking number via email.
                    You can also track your order by logging into your account.
                  </p>

                  <h2>Returns & Exchanges</h2>

                  <h3>What is your return policy?</h3>
                  <p>
                    We accept returns within 30 days of delivery. Items must be
                    unworn, in original condition with tags attached.
                  </p>

                  <h3>How do I return an item?</h3>
                  <p>
                    Contact us at returns@mzansifootwear.com with your order
                    number. We'll provide a prepaid return label and
                    instructions.
                  </p>

                  <h3>Can I exchange for a different size?</h3>
                  <p>
                    Yes, we offer free size exchanges within 30 days. Follow our
                    return process and indicate you'd like an exchange.
                  </p>

                  <h2>Product Information</h2>

                  <h3>How do I find the right size?</h3>
                  <p>
                    Use our size guide available on each product page. If you're
                    between sizes, we recommend going up a half size for
                    comfort.
                  </p>

                  <h3>Are your products authentic?</h3>
                  <p>
                    Yes, all our products are 100% authentic. We source directly
                    from manufacturers and authorized distributors.
                  </p>

                  <h2>Account & Support</h2>

                  <h3>Do I need an account to place an order?</h3>
                  <p>
                    While you can checkout as a guest, creating an account
                    allows you to track orders, save addresses, and access your
                    order history.
                  </p>

                  <h3>How do I contact customer support?</h3>
                  <p>
                    Email us at support@mzansifootwear.com or visit our contact
                    page. We typically respond within 24 hours during business
                    days.
                  </p>

                  <h2>Still have questions?</h2>
                  <p>
                    If you can't find the answer you're looking for, please
                    contact our customer support team at
                    support@mzansifootwear.com
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
