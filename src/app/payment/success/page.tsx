import React from 'react';
import { Suspense } from 'react';
import { PaymentStatus } from '@/components/payments/payment-status';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { ConfettiProvider } from '@/components/ui/confetti';

interface PaymentSuccessPageProps {
  searchParams: {
    paymentId?: string;
    provider?: string;
    orderId?: string;
    amount?: string;
    currency?: string;
  };
}

function PaymentSuccessContent({ searchParams }: PaymentSuccessPageProps) {
  const { paymentId, provider, orderId, amount, currency } = searchParams;

  if (!paymentId || !provider) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="py-8 text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Invalid Payment Link</h1>
            <p className="text-muted-foreground">
              The payment link is missing required information. Please contact support if you believe this is an error.
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

      <PaymentStatus
        paymentId={paymentId}
        provider={provider as any}
        orderId={orderId}
        amount={amount ? parseFloat(amount) : undefined}
        currency={currency}
        autoRefresh={true}
        refreshInterval={5000}
        onStatusChange={(status) => {
          console.log('Payment status changed:', status);
          
          // You can add analytics tracking here
          if (typeof window !== 'undefined' && (window as any).gtag) {
            (window as any).gtag('event', 'payment_status_change', {
              payment_id: paymentId,
              provider: provider,
              status: status,
              order_id: orderId
            });
          }
        }}
      />
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

export default function PaymentSuccessPage({ searchParams }: PaymentSuccessPageProps) {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <PaymentSuccessContent searchParams={searchParams} />
    </Suspense>
  );
}

export const metadata = {
  title: 'Payment Status - Mzansi Footwear',
  description: 'Check your payment status',
  robots: 'noindex, nofollow', // Don't index payment pages
};
