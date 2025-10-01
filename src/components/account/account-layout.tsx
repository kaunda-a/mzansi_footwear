"use client";

import { Header } from "@/components/layout/header";

import { AccountSidebar } from "./account-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface AccountLayoutProps {
  children: React.ReactNode;
  title: string;
  description?: string;
  breadcrumbs?: Array<{
    label: string;
    href?: string;
  }>;
}

export function AccountLayout({
  children,
  title,
  description,
  breadcrumbs,
}: AccountLayoutProps) {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background lg:ml-16">
      <Header />

      <div className="flex-1">
        <div className="container mx-auto px-4 py-6 md:py-8">
          {/* Breadcrumbs */}
          <div className="mb-6">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/">Mzansi footwear</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href="/account">Account</BreadcrumbLink>
                </BreadcrumbItem>
                {breadcrumbs?.map((breadcrumb, index) => (
                  <div key={index} className="flex items-center">
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      {breadcrumb.href ? (
                        <BreadcrumbLink href={breadcrumb.href}>
                          {breadcrumb.label}
                        </BreadcrumbLink>
                      ) : (
                        <BreadcrumbPage>{breadcrumb.label}</BreadcrumbPage>
                      )}
                    </BreadcrumbItem>
                  </div>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          {/* Main Content */}
          <div className="flex flex-col md:flex-row gap-6">
            {/* Sidebar */}
            <aside className="md:flex-shrink-0">
              <AccountSidebar />
            </aside>

            {/* Content Area */}
            <main className="flex-1 min-w-0">
              <div className="space-y-6">
                {/* Page Header */}
                <div className="space-y-2">
                  <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                    {title}
                  </h1>
                  {description && (
                    <p className="text-muted-foreground">{description}</p>
                  )}
                </div>

                {/* Page Content */}
                <div className="space-y-6">{children}</div>
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}
