import React from "react";
import { Suspense } from "react";
import { db } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

interface PaymentSuccessPageProps {
  searchParams: Promise<{
    paymentId?: string;
    provider?: string;
    orderId?: string;
    amount?: string;
    currency?: string;
  }>;
}

async function PaymentSuccessContent({
  searchParams,
}: PaymentSuccessPageProps) {
  const params = await searchParams;
  const { orderId } = params;

  if (!orderId) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="py-8 text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">
              Invalid Payment Link
            </h1>
            <p className="text-muted-foreground">
              The payment link is missing required information. Please contact
              support if you believe this is an error.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const order = await db.order.findUnique({
    where: { id: orderId },
  });

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="py-8 text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">
              Order not found
            </h1>
            <p className="text-muted-foreground">
              We could not find your order. Please contact support if you
              believe this is an error.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Payment Status</h1>
        <p className="text-muted-foreground">
          Check the status of your payment below
        </p>
      </div>

      <Card>
        <CardContent className="py-8 text-center">
          <h2 className="text-xl font-semibold">Order #{order.id}</h2>
          <p className="text-lg">Payment Status: {order.status}</p>
        </CardContent>
      </Card>
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardContent className="py-8 text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading payment status...</p>
        </CardContent>
      </Card>
    </div>
  );
}

export default async function PaymentSuccessPage({
  searchParams,
}: PaymentSuccessPageProps) {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <PaymentSuccessContent searchParams={searchParams} />
    </Suspense>
  );
}

export const metadata = {
  title: "Payment Status - Mzansi Footwear",
  description: "Check your payment status",
  robots: "noindex, nofollow", // Don't index payment pages
};
