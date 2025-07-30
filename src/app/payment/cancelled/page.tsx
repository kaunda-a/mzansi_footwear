import React from 'react';
import { Suspense } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { XCircle, ArrowLeft, RefreshCw, HelpCircle } from 'lucide-react';
import Link from 'next/link';

interface PaymentCancelledPageProps {
  searchParams: Promise<{
    orderId?: string;
    reason?: string;
    provider?: string;
  }>;
}

async function PaymentCancelledContent({ searchParams }: PaymentCancelledPageProps) {
  const params = await searchParams;
  const { orderId, reason, provider } = params;

  const getProviderDisplayName = (provider?: string): string => {
    const names: Record<string, string> = {
      payfast: 'PayFast'
    };

    return provider ? (names[provider] || provider) : 'Payment Provider';
  };

  const getCancellationReason = (reason?: string): string => {
    const reasons: Record<string, string> = {
      user_cancelled: 'You cancelled the payment',
      timeout: 'The payment session timed out',
      insufficient_funds: 'Insufficient funds in your account',
      card_declined: 'Your card was declined',
      bank_error: 'There was an error with your bank',
      provider_error: 'There was an error with the payment provider',
      fraud_detected: 'The payment was flagged for security reasons',
      invalid_details: 'Invalid payment details were provided'
    };

    return reason ? (reasons[reason] || reason) : 'The payment was cancelled';
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Main Cancellation Card */}
        <Card className="bg-red-50 border-red-200 border-2">
          <CardHeader className="text-center">
            <div className="text-red-600 mx-auto mb-4">
              <XCircle className="h-12 w-12" />
            </div>
            <CardTitle className="text-red-600 text-2xl">Payment Cancelled</CardTitle>
            <CardDescription className="text-lg">
              {getCancellationReason(reason)}
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <div className="space-y-2">
              {orderId && (
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium">Order ID:</span> {orderId}
                </p>
              )}
              {provider && (
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium">Payment Provider:</span> {getProviderDisplayName(provider)}
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild className="flex-1 max-w-xs">
                <Link href={orderId ? `/checkout?orderId=${orderId}` : '/checkout'}>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Try Payment Again
                </Link>
              </Button>
              
              <Button asChild variant="outline" className="flex-1 max-w-xs">
                <Link href="/">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Continue Shopping
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Help Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5" />
              What happened?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3 text-sm">
              <div>
                <h4 className="font-medium mb-1">Common reasons for payment cancellation:</h4>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                  <li>You clicked the "Cancel" or "Back" button during payment</li>
                  <li>The payment session timed out due to inactivity</li>
                  <li>Your bank declined the transaction</li>
                  <li>Insufficient funds in your account</li>
                  <li>Security measures flagged the transaction</li>
                </ul>
              </div>

              <div>
                <h4 className="font-medium mb-1">What you can do:</h4>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                  <li>Try the payment again with the same or different payment method</li>
                  <li>Check your account balance if using EFT or bank transfer</li>
                  <li>Contact your bank if your card was declined</li>
                  <li>Use a different payment provider if the issue persists</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Support Information */}
        <Alert>
          <HelpCircle className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-2">
              <p className="font-medium">Need help?</p>
              <p className="text-sm">
                If you continue to experience issues with payments, please contact our support team:
              </p>
              <div className="text-sm space-y-1">
                <p>📧 Email: support@mzansifootwear.com</p>
                <p>📞 Phone: +27 11 123 4567</p>
                <p>💬 Live Chat: Available 9 AM - 6 PM (SAST)</p>
              </div>
              {orderId && (
                <p className="text-xs text-muted-foreground mt-2">
                  Please include Order ID: {orderId} when contacting support
                </p>
              )}
            </div>
          </AlertDescription>
        </Alert>

        {/* Alternative Payment Methods */}
        <Card>
          <CardHeader>
            <CardTitle>Try Alternative Payment Methods</CardTitle>
            <CardDescription>
              We support multiple payment options for your convenience
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="space-y-2">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <span className="text-2xl">💳</span>
                </div>
                <p className="text-sm font-medium">Credit/Debit Cards</p>
              </div>
              
              <div className="space-y-2">
                <div className="bg-green-100 p-3 rounded-lg">
                  <span className="text-2xl">🏦</span>
                </div>
                <p className="text-sm font-medium">Instant EFT</p>
              </div>
              
              <div className="space-y-2">
                <div className="bg-orange-100 p-3 rounded-lg">
                  <span className="text-2xl">📱</span>
                </div>
                <p className="text-sm font-medium">Mobile Money</p>
              </div>
              
              <div className="space-y-2">
                <div className="bg-purple-100 p-3 rounded-lg">
                  <span className="text-2xl">⏰</span>
                </div>
                <p className="text-sm font-medium">Buy Now Pay Later</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardContent className="py-8 text-center">
          <div className="animate-pulse space-y-4">
            <div className="h-12 w-12 bg-gray-200 rounded-full mx-auto"></div>
            <div className="h-6 bg-gray-200 rounded w-48 mx-auto"></div>
            <div className="h-4 bg-gray-200 rounded w-64 mx-auto"></div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default async function PaymentCancelledPage({ searchParams }: PaymentCancelledPageProps) {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <PaymentCancelledContent searchParams={searchParams} />
    </Suspense>
  );
}

export const metadata = {
  title: 'Payment Cancelled - Mzansi Footwear',
  description: 'Your payment was cancelled',
  robots: 'noindex, nofollow', // Don't index payment pages
};
