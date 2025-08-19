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
import {
  CreditCard,
  Smartphone,
  QrCode,
  Building2,
  Zap,
  Shield,
  Clock,
  DollarSign,
} from "lucide-react";
import { PaymentProvider, PaymentMethod } from "@/lib/payments/types";

interface PaymentProviderInfo {
  provider: PaymentProvider;
  name: string;
  methods: PaymentMethod[];
  currencies: string[];
  minimumAmount: number;
  maximumAmount: number;
  processingFee: number;
  processingFeeType: "fixed" | "percentage";
}

interface PaymentProviderSelectorProps {
  amount: number;
  currency: string;
  onProviderSelect: (provider: PaymentProvider) => void;
  selectedProvider?: PaymentProvider;
  loading?: boolean;
}

const methodIcons: Record<PaymentMethod, React.ReactNode> = {
  card: <CreditCard className="h-4 w-4" />,
  eft: <Building2 className="h-4 w-4" />,
  instant_eft: <Zap className="h-4 w-4" />,
};

const methodLabels: Record<PaymentMethod, string> = {
  card: "Credit/Debit Card",
  eft: "EFT",
  instant_eft: "Instant EFT",
};

const providerColors: Record<PaymentProvider, string> = {
  payfast: "bg-blue-500",
  yoco: "bg-yellow-500",
};

export function PaymentProviderSelector({
  amount,
  currency,
  onProviderSelect,
  selectedProvider,
  loading = false,
}: PaymentProviderSelectorProps) {
  const [providers, setProviders] = useState<PaymentProviderInfo[]>([]);
  const [loadingProviders, setLoadingProviders] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAvailableProviders();
  }, []);

  const fetchAvailableProviders = async () => {
    try {
      setLoadingProviders(true);
      const response = await fetch("/api/payments/create");

      if (!response.ok) {
        throw new Error("Failed to fetch payment providers");
      }

      const data = await response.json();
      setProviders(data.providers || []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load payment providers",
      );
    } finally {
      setLoadingProviders(false);
    }
  };

  const calculateFee = (provider: PaymentProviderInfo): number => {
    if (provider.processingFeeType === "percentage") {
      return (amount * provider.processingFee) / 100;
    }
    return provider.processingFee;
  };

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat("en-ZA", {
      style: "currency",
      currency: currency,
    }).format(value);
  };

  const isProviderAvailable = (provider: PaymentProviderInfo): boolean => {
    return amount >= provider.minimumAmount && amount <= provider.maximumAmount;
  };

  const getRecommendedProviders = (): PaymentProviderInfo[] => {
    return providers.filter(isProviderAvailable).sort((a, b) => {
      // Sort by processing fee (lower is better)
      const feeA = calculateFee(a);
      const feeB = calculateFee(b);
      return feeA - feeB;
    });
  };

  if (loadingProviders) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loading Payment Options...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-red-600">
            Error Loading Payment Options
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">{error}</p>
          <Button onClick={fetchAvailableProviders} variant="outline">
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  const recommendedProviders = getRecommendedProviders();
  const unavailableProviders = providers.filter((p) => !isProviderAvailable(p));

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Choose Payment Method
          </CardTitle>
          <CardDescription>
            Select your preferred payment provider for {formatCurrency(amount)}
          </CardDescription>
        </CardHeader>
      </Card>

      {recommendedProviders.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Available Payment Options</h3>
          <div className="grid gap-4 md:grid-cols-2">
            {recommendedProviders.map((provider) => {
              const fee = calculateFee(provider);
              const total = amount + fee;
              const isSelected = selectedProvider === provider.provider;

              return (
                <Card
                  key={provider.provider}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    isSelected ? "ring-2 ring-primary" : ""
                  }`}
                  onClick={() => onProviderSelect(provider.provider)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            providerColors[provider.provider] || "bg-gray-500"
                          }`}
                        />
                        <CardTitle className="text-base">
                          {provider.name}
                        </CardTitle>
                      </div>
                      {isSelected && <Badge variant="default">Selected</Badge>}
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      {/* Payment Methods */}
                      <div className="flex flex-wrap gap-2">
                        {provider.methods.slice(0, 3).map((method) => (
                          <Badge
                            key={method}
                            variant="secondary"
                            className="text-xs"
                          >
                            <span className="mr-1">{methodIcons[method]}</span>
                            {methodLabels[method]}
                          </Badge>
                        ))}
                        {provider.methods.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{provider.methods.length - 3} more
                          </Badge>
                        )}
                      </div>

                      <Separator />

                      {/* Pricing */}
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Amount:</span>
                          <span>{formatCurrency(amount)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Processing Fee:
                          </span>
                          <span>{formatCurrency(fee)}</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between font-semibold">
                          <span>Total:</span>
                          <span>{formatCurrency(total)}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {unavailableProviders.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-muted-foreground">
            Unavailable for This Amount
          </h3>
          <div className="grid gap-4 md:grid-cols-2">
            {unavailableProviders.map((provider) => (
              <Card key={provider.provider} className="opacity-50">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        providerColors[provider.provider] || "bg-gray-500"
                      }`}
                    />
                    <CardTitle className="text-base">{provider.name}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-muted-foreground">
                    Available for amounts between{" "}
                    {formatCurrency(provider.minimumAmount)} and{" "}
                    {formatCurrency(provider.maximumAmount)}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {recommendedProviders.length === 0 &&
        unavailableProviders.length === 0 && (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-muted-foreground">
                No payment providers are currently available. Please try again
                later.
              </p>
            </CardContent>
          </Card>
        )}
    </div>
  );
}
