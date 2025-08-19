"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  RefreshCw,
  ArrowLeft,
  Download,
  Mail,
} from "lucide-react";
import {
  PaymentStatus as PaymentStatusType,
  PaymentProvider,
} from "@/lib/payments/types";
import { useRouter } from "next/navigation";
import { useConfetti } from "@/components/ui/confetti";

interface PaymentStatusProps {
  paymentId: string;
  provider: PaymentProvider;
  orderId?: string;
  amount?: number;
  currency?: string;
  autoRefresh?: boolean;
  refreshInterval?: number;
  onStatusChange?: (status: PaymentStatusType) => void;
}

interface PaymentStatusData {
  success: boolean;
  paymentId: string;
  provider: PaymentProvider;
  status: PaymentStatusType;
  timestamp: string;
  amount?: number;
  currency?: string;
  createdAt?: string;
  updatedAt?: string;
}

const statusConfig: Record<
  PaymentStatusType,
  {
    icon: React.ReactNode;
    color: string;
    bgColor: string;
    title: string;
    description: string;
  }
> = {
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
    description:
      "Your payment is currently being processed by the payment provider.",
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

export function PaymentStatus({
  paymentId,
  provider,
  orderId,
  amount,
  currency = "ZAR",
  autoRefresh = true,
  refreshInterval = 5000,
  onStatusChange,
}: PaymentStatusProps) {
  const router = useRouter();
  const { trigger: triggerConfetti } = useConfetti();
  const [statusData, setStatusData] = useState<PaymentStatusData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastChecked, setLastChecked] = useState<Date>(new Date());
  const [confettiFired, setConfettiFired] = useState(false);

  useEffect(() => {
    fetchPaymentStatus();
  }, [paymentId, provider]);

  useEffect(() => {
    if (!autoRefresh || !statusData) return;

    // Don't auto-refresh for final states
    const finalStates: PaymentStatusType[] = [
      "COMPLETED",
      "FAILED",
      "CANCELLED",
      "EXPIRED",
      "REFUNDED",
    ];
    if (finalStates.includes(statusData.status)) return;

    const interval = setInterval(() => {
      fetchPaymentStatus();
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, statusData?.status]);

  const fetchPaymentStatus = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `/api/payments/status/${paymentId}?provider=${provider}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (!response.ok) {
        throw new Error("Failed to fetch payment status");
      }

      const data: PaymentStatusData = await response.json();
      setStatusData(data);
      setLastChecked(new Date());

      // Trigger confetti for successful payments (only once)
      if (data.status === "COMPLETED" && !confettiFired) {
        setConfettiFired(true);
        // Trigger multiple confetti bursts for celebration
        triggerConfetti({
          elementCount: 100,
          spread: 70,
          startVelocity: 45,
          colors: ["#10b981", "#059669", "#34d399", "#6ee7b7", "#a7f3d0"],
        });

        // Additional confetti bursts
        setTimeout(() => {
          triggerConfetti({
            elementCount: 50,
            spread: 60,
            startVelocity: 35,
            colors: ["#3b82f6", "#1d4ed8", "#60a5fa", "#93c5fd", "#dbeafe"],
          });
        }, 300);

        setTimeout(() => {
          triggerConfetti({
            elementCount: 75,
            spread: 80,
            startVelocity: 40,
            colors: ["#f59e0b", "#d97706", "#fbbf24", "#fcd34d", "#fef3c7"],
          });
        }, 600);
      }

      // Notify parent component of status change
      if (onStatusChange && data.status !== statusData?.status) {
        onStatusChange(data.status);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch payment status",
      );
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat("en-ZA", {
      style: "currency",
      currency: currency,
    }).format(value);
  };

  const formatDateTime = (dateString: string): string => {
    return new Date(dateString).toLocaleString("en-ZA", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getProviderDisplayName = (provider: PaymentProvider): string => {
    const names: Record<PaymentProvider, string> = {
      payfast: "PayFast",
      yoco: "Yoco",
    };

    return names[provider] || provider;
  };

  const handleRetryPayment = () => {
    if (orderId) {
      router.push(`/checkout?orderId=${orderId}`);
    } else {
      router.push("/checkout");
    }
  };

  const handleDownloadReceipt = async () => {
    // This would generate and download a receipt
    console.log("Download receipt for payment:", paymentId);
  };

  const handleEmailReceipt = async () => {
    // This would email a receipt to the customer
    console.log("Email receipt for payment:", paymentId);
  };

  if (loading && !statusData) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Checking payment status...</p>
        </CardContent>
      </Card>
    );
  }

  if (error && !statusData) {
    return (
      <Card>
        <CardContent className="py-8 text-center space-y-4">
          <XCircle className="h-8 w-8 text-red-500 mx-auto" />
          <div>
            <h3 className="font-semibold text-red-600">
              Error Loading Payment Status
            </h3>
            <p className="text-sm text-muted-foreground mt-1">{error}</p>
          </div>
          <Button onClick={fetchPaymentStatus} variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!statusData) return null;

  const config = statusConfig[statusData.status];
  const displayAmount = amount || statusData.amount;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Main Status Card */}
      <Card className={`${config.bgColor} border-2`}>
        <CardHeader className="text-center">
          <div className={`${config.color} mx-auto mb-4`}>{config.icon}</div>
          <CardTitle className={config.color}>{config.title}</CardTitle>
          <CardDescription>{config.description}</CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          {displayAmount && (
            <div className="text-2xl font-bold">
              {formatCurrency(displayAmount)}
            </div>
          )}

          <div className="flex justify-center">
            <Badge variant="secondary" className="text-sm">
              {statusData.status.replace("_", " ").toUpperCase()}
            </Badge>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2 justify-center pt-4">
            {statusData.status === "FAILED" && (
              <Button onClick={handleRetryPayment} className="flex-1 max-w-xs">
                <RefreshCw className="mr-2 h-4 w-4" />
                Try Again
              </Button>
            )}

            {statusData.status === "COMPLETED" && (
              <>
                <Button onClick={handleDownloadReceipt} variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Download Receipt
                </Button>
                <Button onClick={handleEmailReceipt} variant="outline">
                  <Mail className="mr-2 h-4 w-4" />
                  Email Receipt
                </Button>
              </>
            )}

            <Button onClick={() => router.push("/")} variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Continue Shopping
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Payment Details */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Payment ID:</span>
              <p className="text-muted-foreground font-mono">
                {statusData.paymentId}
              </p>
            </div>

            {orderId && (
              <div>
                <span className="font-medium">Order ID:</span>
                <p className="text-muted-foreground">{orderId}</p>
              </div>
            )}

            <div>
              <span className="font-medium">Payment Provider:</span>
              <p className="text-muted-foreground">
                {getProviderDisplayName(statusData.provider)}
              </p>
            </div>

            <div>
              <span className="font-medium">Status:</span>
              <p className="text-muted-foreground capitalize">
                {statusData.status.replace("_", " ")}
              </p>
            </div>

            {statusData.createdAt && (
              <div>
                <span className="font-medium">Created:</span>
                <p className="text-muted-foreground">
                  {formatDateTime(statusData.createdAt)}
                </p>
              </div>
            )}

            <div>
              <span className="font-medium">Last Checked:</span>
              <p className="text-muted-foreground">
                {formatDateTime(lastChecked.toISOString())}
              </p>
            </div>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              Auto-refresh: {autoRefresh ? "Enabled" : "Disabled"}
            </span>
            <Button
              onClick={fetchPaymentStatus}
              variant="ghost"
              size="sm"
              disabled={loading}
            >
              <RefreshCw
                className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Additional Information */}
      {(statusData.status === "PENDING" ||
        statusData.status === "PROCESSING") && (
        <Alert>
          <Clock className="h-4 w-4" />
          <AlertDescription>
            Payment processing can take a few minutes. This page will
            automatically update when the status changes.
          </AlertDescription>
        </Alert>
      )}

      {statusData.status === "FAILED" && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            If you continue to experience issues, please contact our support
            team with payment ID: {statusData.paymentId}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
