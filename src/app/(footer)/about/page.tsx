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
  title: "About Us | Mzansi Footwear",
  description:
    "Learn about Mzansi Footwear - our story, mission, and commitment to quality South African footwear.",
  keywords:
    "about us, Mzansi Footwear, South African shoes, company story, footwear brand",
};

interface AboutPageProps {
  searchParams: Promise<SearchParams>;
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
            <Suspense
              fallback={
                <DataTableSkeleton
                  columnCount={1}
                  rowCount={6}
                  filterCount={0}
                />
              }
            >
              <div className="container mx-auto px-4 py-8 max-w-4xl">
                <div className="prose prose-gray dark:prose-invert max-w-none">
                  <h2>About Us</h2>
                  <p>
                    Welcome to Mzansi Footwear – your ultimate destination for
                    premium sneakers, streetwear, and exclusive drops. Born out
                    of a deep passion for sneaker culture and a commitment to
                    authenticity, we created this space for collectors,
                    enthusiasts, and everyday sneaker lovers who value style,
                    comfort, and originality.
                  </p>
                  <p>
                    At Mzansi Footwear, we believe that sneakers are more than
                    just shoes – they’re a lifestyle, a statement, and a form of
                    self-expression. That’s why we carefully curate our
                    collection, offering everything from iconic classics to the
                    latest releases from top brands like Nike, Adidas, Jordan,
                    New Balance, and more.
                  </p>
                  <h2>What sets us apart?</h2>
                  <ul>
                    <li>
                      <strong>100% Authenticity Guarantee:</strong> Every pair
                      we sell is verified for authenticity.
                    </li>
                    <li>
                      <strong>Fast & Secure Shipping:</strong> We deliver
                      nationwide with trusted carriers.
                    </li>
                    <li>
                      <strong>Exceptional Customer Service:</strong> Got
                      questions? Our team is here to help you every step of the
                      way.
                    </li>
                  </ul>
                  <p>
                    Whether you’re hunting for a rare grail, looking to elevate
                    your everyday style, or shopping your first pair – we’re
                    here to make it happen.
                  </p>
                  <p>Join our community and step into something better.</p>
                  <p>Stay fresh. Stay original.</p>
                  <p>Mzansi Footwear</p>
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
