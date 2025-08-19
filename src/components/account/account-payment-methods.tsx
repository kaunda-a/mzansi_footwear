"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CreditCard,
  Plus,
  Edit,
  Trash2,
  MoreHorizontal,
  Shield,
  Smartphone,
  Building2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Api } from "@/lib/api";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

interface PaymentMethod {
  id: string;
  type: "card" | "bank" | "wallet";
  provider: string;
  isDefault: boolean;
  last4?: string;
  expiryMonth?: number;
  expiryYear?: number;
  cardType?: "visa" | "mastercard" | "amex";
  bankName?: string;
  accountType?: string;
  walletProvider?: string;
  email?: string;
}

export function AccountPaymentMethods() {
  const { data: session } = useSession();
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);

  const getPaymentIcon = (method: PaymentMethod) => {
    switch (method.type) {
      case "card":
        return <CreditCard className="h-5 w-5" />;
      case "bank":
        return <Building2 className="h-5 w-5" />;
      case "wallet":
        return <Smartphone className="h-5 w-5" />;
      default:
        return <CreditCard className="h-5 w-5" />;
    }
  };

  const getCardBrand = (cardType?: string) => {
    switch (cardType) {
      case "visa":
        return "Visa";
      case "mastercard":
        return "Mastercard";
      case "amex":
        return "American Express";
      default:
        return "Card";
    }
  };

  const handleSetDefault = async (methodId: string) => {
    // TODO: implement when backend supports payment methods
    toast.info("Setting default payment method requires backend support");
  };

  const handleDelete = async (methodId: string) => {
    // TODO: implement when backend supports payment methods
    toast.info("Removing payment method requires backend support");
  };

  useEffect(() => {
    // No backend yet; keep empty list
    setLoading(false);
  }, [session]);

  const formatExpiryDate = (month?: number, year?: number) => {
    if (!month || !year) return "";
    return `${month.toString().padStart(2, "0")}/${year.toString().slice(-2)}`;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="py-12">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <span className="ml-2">Loading payment methods...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payment Methods
              </CardTitle>
              <CardDescription>
                Manage your saved payment methods for faster checkout
              </CardDescription>
            </div>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Payment Method
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Payment Methods Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {paymentMethods.length === 0 ? (
          <Card className="md:col-span-2">
            <CardContent className="py-12 text-center">
              <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No payment methods</h3>
              <p className="text-muted-foreground mb-4">
                This section will show your saved cards and payment options once
                connected to the payment provider.
              </p>
              <Button disabled>
                <Plus className="h-4 w-4 mr-2" />
                Add Payment Method
              </Button>
            </CardContent>
          </Card>
        ) : (
          paymentMethods.map((method) => (
            <Card key={method.id} className="relative">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-muted rounded-lg">
                      {getPaymentIcon(method)}
                    </div>
                    <div>
                      <CardTitle className="text-base">
                        {method.type === "card" &&
                          getCardBrand(method.cardType)}
                        {method.type === "bank" && method.bankName}
                        {method.type === "wallet" && method.walletProvider}
                      </CardTitle>
                      {method.isDefault && (
                        <Badge variant="secondary" className="mt-1">
                          Default
                        </Badge>
                      )}
                    </div>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      {!method.isDefault && (
                        <DropdownMenuItem
                          onClick={() => handleSetDefault(method.id)}
                        >
                          <Shield className="h-4 w-4 mr-2" />
                          Set as Default
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem
                        onClick={() => handleDelete(method.id)}
                        className="text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Remove
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>

              <CardContent>
                <div className="space-y-3">
                  {method.type === "card" && (
                    <>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          Card Number
                        </span>
                        <span className="font-mono">
                          •••• •••• •••• {method.last4}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          Expires
                        </span>
                        <span className="font-mono">
                          {formatExpiryDate(
                            method.expiryMonth,
                            method.expiryYear,
                          )}
                        </span>
                      </div>
                    </>
                  )}

                  {method.type === "bank" && (
                    <>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          Bank
                        </span>
                        <span>{method.bankName}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          Account Type
                        </span>
                        <span>{method.accountType}</span>
                      </div>
                    </>
                  )}

                  {method.type === "wallet" && (
                    <>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          Provider
                        </span>
                        <span>{method.walletProvider}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          Email
                        </span>
                        <span className="text-sm">{method.email}</span>
                      </div>
                    </>
                  )}
                </div>

                <div className="flex gap-2 mt-4">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Edit className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                  {!method.isDefault && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSetDefault(method.id)}
                    >
                      Set Default
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}

        {/* Placeholder add card disabled until backend integration */}
      </div>

      {/* Security Notice */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Shield className="h-4 w-4" />
            Security & Privacy
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm text-muted-foreground">
            <p>
              • All payment information is encrypted and stored securely using
              industry-standard security measures.
            </p>
            <p>
              • We never store your full card details. Only the last 4 digits
              are kept for identification.
            </p>
            <p>
              • You can remove any payment method at any time from your account.
            </p>
            <p>
              • All transactions are processed through secure, PCI-compliant
              payment processors.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Add New Payment Method</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="justify-start">
              <CreditCard className="h-4 w-4 mr-2" />
              Add Credit/Debit Card
            </Button>
            <Button variant="outline" className="justify-start">
              <Building2 className="h-4 w-4 mr-2" />
              Add Bank Account
            </Button>
            <Button variant="outline" className="justify-start">
              <Smartphone className="h-4 w-4 mr-2" />
              Add Digital Wallet
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
