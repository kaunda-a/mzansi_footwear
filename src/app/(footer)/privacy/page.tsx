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
  title: "Privacy Policy | Mzansi Footwear",
  description:
    "Read our privacy policy to understand how we collect, use, and protect your personal information.",
  keywords:
    "privacy policy, data protection, personal information, Mzansi Footwear",
};

interface PrivacyPageProps {
  searchParams: Promise<SearchParams>;
}

export default async function PrivacyPage({ searchParams }: PrivacyPageProps) {
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
                  <BreadcrumbPage>Privacy Policy</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <Heading
              title="Privacy Policy"
              description="Read our privacy policy to understand how we collect, use, and protect your personal information."
            />
          </div>
          <div className="mx-auto grid w-full max-w-6xl items-start gap-6">
            <Suspense fallback={<DataTableSkeleton columnCount={1} />}>
              <div className="container mx-auto px-4 py-8 max-w-4xl">
                <div className="prose prose-gray dark:prose-invert max-w-none">
                  <p className="text-lg text-muted-foreground">
                    Last updated: {new Date().toLocaleDateString()}
                  </p>

                  <h2>Information We Collect</h2>
                  <p>
                    We collect information you provide directly to us, such as
                    when you create an account, make a purchase, or contact us
                    for support.
                  </p>

                  <h2>How We Use Your Information</h2>
                  <p>
                    We use the information we collect to provide, maintain, and
                    improve our services, process transactions, and communicate
                    with you.
                  </p>

                  <h2>Information Sharing</h2>
                  <p>
                    We do not sell, trade, or otherwise transfer your personal
                    information to third parties except as described in this
                    privacy policy.
                  </p>

                  <h2>Data Security</h2>
                  <p>
                    We implement appropriate security measures to protect your
                    personal information against unauthorized access,
                    alteration, disclosure, or destruction.
                  </p>

                  <h2>Contact Us</h2>
                  <p>
                    If you have any questions about this Privacy Policy, please
                    contact us at privacy@mzansifootwear.com
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
