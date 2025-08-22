"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertCircle, 
  RefreshCw 
} from "lucide-react";
import { Confetti } from "@/components/ui/confetti";

interface PaymentSuccessPageProps {
  searchParams: Promise<{
    orderId?: string;
  }>;
}

const statusConfig: Record<string, {
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  title: string;
  description: string;
}> = {
  PENDING: {
    icon: <Clock className="h-5 w-5" />,
    color: "text-yellow-600",
    bgColor: "bg-yellow-50 border-yellow-200",
    title: "Payment Pending",
    description: "Your payment is being processed. Please wait...",
  },
  PROCESSING: {
    icon: <RefreshCw className="h-5 w-5 animate-spin" />,
    color: "text-blue-600",
    bgColor: "bg-blue-50 border-blue-200",
    title: "Processing Payment",
    description: "Your payment is currently being processed by the payment provider.",
  },
  COMPLETED: {
    icon: <CheckCircle className="h-5 w-5" />,
    color: "text-green-600",
    bgColor: "bg-green-50 border-green-200",
    title: "Payment Successful",
    description: "Your payment has been completed successfully!",
  },
  FAILED: {
    icon: <XCircle className="h-5 w-5" />,
    color: "text-red-600",
    bgColor: "bg-red-50 border-red-200",
    title: "Payment Failed",
    description: "Your payment could not be processed. Please try again.",
  },
  CANCELLED: {
    icon: <XCircle className="h-5 w-5" />,
    color: "text-gray-600",
    bgColor: "bg-gray-50 border-gray-200",
    title: "Payment Cancelled",
    description: "The payment was cancelled by you or the payment provider.",
  },
  EXPIRED: {
    icon: <AlertCircle className="h-5 w-5" />,
    color: "text-orange-600",
    bgColor: "bg-orange-50 border-orange-200",
    title: "Payment Expired",
    description: "The payment session has expired. Please start a new payment.",
  },
  REFUNDED: {
    icon: <RefreshCw className="h-5 w-5" />,
    color: "text-purple-600",
    bgColor: "bg-purple-50 border-purple-200",
    title: "Payment Refunded",
    description: "This payment has been refunded to your account.",
  },
  PARTIALLY_REFUNDED: {
    icon: <RefreshCw className="h-5 w-5" />,
    color: "text-purple-600",
    bgColor: "bg-purple-50 border-purple-200",
    title: "Partially Refunded",
    description: "This payment has been partially refunded to your account.",
  },
  DISPUTED: {
    icon: <AlertCircle className="h-5 w-5" />,
    color: "text-red-600",
    bgColor: "bg-red-50 border-red-200",
    title: "Payment Disputed",
    description: "This payment is under dispute. Please contact support.",
  },
  AUTHORIZED: {
    icon: <Clock className="h-5 w-5" />,
    color: "text-blue-600",
    bgColor: "bg-blue-50 border-blue-200",
    title: "Payment Authorized",
    description: "Payment has been authorized and will be captured soon.",
  },
  CAPTURED: {
    icon: <CheckCircle className="h-5 w-5" />,
    color: "text-green-600",
    bgColor: "bg-green-50 border-green-200",
    title: "Payment Captured",
    description: "Payment has been successfully captured.",
  },
};

export default function PaymentSuccessPage({
  searchParams,
}: PaymentSuccessPageProps) {
  const [order, setOrder] = useState<{ id: string; paymentStatus: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const params = await searchParams;
        const { orderId } = params;

        if (!orderId) {
          setError("Invalid payment link");
          setLoading(false);
          return;
        }

        // Set initial state to show success immediately
        setOrder({
          id: orderId,
          paymentStatus: "COMPLETED", // Default to COMPLETED since we're on the success page
        });
        setLoading(false);

        // Fetch actual status from API for verification
        const fetchPaymentStatus = async () => {
          try {
            const response = await fetch(`/api/payment-status?orderId=${orderId}`);
            const data = await response.json();
            
            if (response.ok) {
              setOrder({
                id: data.orderId,
                paymentStatus: data.paymentStatus,
              });
              
              // Show confetti for successful payments
              if (data.paymentStatus === "COMPLETED") {
                setShowConfetti(true);
                // Hide confetti after 3 seconds
                setTimeout(() => setShowConfetti(false), 3000);
              }
            }
          } catch (err) {
            // Silently fail - keep showing COMPLETED status
            console.error("Failed to fetch payment status:", err);
          }
        };

        fetchPaymentStatus();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load page");
        setLoading(false);
      }
    };

    fetchData();
  }, [searchParams]);

  if (loading) {
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

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="py-8 text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">
              Error
            </h1>
            <p className="text-muted-foreground">
              {error}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

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

  const paymentStatus = order.paymentStatus;
  const config = statusConfig[paymentStatus] || statusConfig.COMPLETED;

  return (
    <>
      {/* Confetti for successful payments */}
      {showConfetti && <Confetti active={true} />}
      
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Payment Status</h1>
          <p className="text-muted-foreground">
            Check the status of your payment below
          </p>
        </div>

        <Card className={`${config.bgColor} border-2 max-w-2xl mx-auto`}>
          <CardContent className="py-8 text-center">
            <div className={`${config.color} mx-auto mb-4`}>
              {config.icon}
            </div>
            <h2 className={`text-xl font-semibold ${config.color} mb-2`}>
              {config.title}
            </h2>
            <p className="text-muted-foreground mb-6">
              {config.description}
            </p>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Order #{order.id}</h3>
              <p className="text-lg">Payment Status: {paymentStatus}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
