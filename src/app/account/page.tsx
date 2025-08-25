import { Suspense } from "react";
import type { Metadata } from "next";
import { SearchParams } from "nuqs/server";
import { DataTableSkeleton } from "@/components/ui/table/data-table-skeleton";
import { AccountAnalytics } from "@/components/account/account-analytics";
import { AccountLayout } from "@/components/account/account-layout";
import { DashboardTopBillboard } from "@/components/catalog/billboard/dashboard-top-billboard";
import { DashboardBottomBillboard } from "@/components/catalog/billboard/dashboard-bottom-billboard";

export const metadata: Metadata = {
  title: "My Account | Mzansi Footwear",
  description:
    "Manage your account, view orders, and track your shopping activity at Mzansi Footwear.",
  keywords:
    "account, dashboard, orders, profile, customer account, Mzansi Footwear",
};

interface AccountPageProps {
  searchParams: Promise<SearchParams>;
}

export default async function AccountPage({ searchParams }: AccountPageProps) {
  return (
    <AccountLayout
      title="Account Overview"
      description="Welcome back! Here's a summary of your account activity and quick access to your important information."
    >
      {/* Dashboard Top Billboard */}
      <DashboardTopBillboard />
      
      <Suspense
        fallback={
          <DataTableSkeleton columnCount={3} rowCount={8} filterCount={0} />
        }
      >
        <AccountAnalytics />
      </Suspense>
      
      {/* Dashboard Bottom Billboard */}
      <DashboardBottomBillboard />
    </AccountLayout>
  );
}
