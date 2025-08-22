"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { PaymentProviderSelector } from "./payment-provider-selector";
import {
  CreditCard,
  User,
  Mail,
  Phone,
  MapPin,
  AlertCircle,
  CheckCircle,
  Loader2,
} from "lucide-react";
import { PaymentProvider, PaymentRequest } from "@/lib/payments/types";
import { toast } from "sonner";

interface PaymentFormProps {
  orderId: string;
  amount: number;
  currency?: string;
  items: Array<{
    id: string;
    name: string;
    description?: string;
    quantity: number;
    unitPrice: number;
    sku?: string;
    category?: string;
  }>;
  customer?: {
    id?: string;
    email?: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
  };
  onSuccess?: (paymentId: string, provider: PaymentProvider) => void;
  onError?: (error: string) => void;
}

interface CustomerForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  idNumber: string;
  address: {
    street: string;
    city: string;
    province: string;
    postalCode: string;
    country: string;
  };
}

const SA_PROVINCES = [
  "Eastern Cape",
  "Free State",
  "Gauteng",
  "KwaZulu-Natal",
  "Limpopo",
  "Mpumalanga",
  "Northern Cape",
  "North West",
  "Western Cape",
];

export function PaymentForm({
  orderId,
  amount,
  currency = "ZAR",
  items,
  customer,
  onSuccess,
  onError,
}: PaymentFormProps) {
  const router = useRouter();
  const [selectedProvider, setSelectedProvider] = useState<PaymentProvider>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<"customer" | "provider" | "processing">(
    "customer",
  );

  const [customerForm, setCustomerForm] = useState<CustomerForm>({
    firstName: customer?.firstName || "",
    lastName: customer?.lastName || "",
    email: customer?.email || "",
    phone: customer?.phone || "",
    idNumber: "",
    address: {
      street: "",
      city: "",
      province: "Gauteng",
      postalCode: "",
      country: "South Africa",
    },
  });

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat("en-ZA", {
      style: "currency",
      currency: currency,
    }).format(value);
  };

  const validateCustomerForm = (): boolean => {
    const required = ["firstName", "lastName", "email", "phone"];
    const missing = required.filter(
      (field) => !customerForm[field as keyof CustomerForm],
    );

    if (missing.length > 0) {
      setError(`Please fill in: ${missing.join(", ")}`);
      return false;
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customerForm.email)) {
      setError("Please enter a valid email address");
      return false;
    }

    // Validate SA phone number
    const phoneRegex = /^(\+27|0)[0-9]{9}$/;
    if (!phoneRegex.test(customerForm.phone.replace(/\s/g, ""))) {
      setError("Please enter a valid South African phone number");
      return false;
    }

    // Validate SA ID number if provided
    if (customerForm.idNumber && !validateSAIdNumber(customerForm.idNumber)) {
      setError("Please enter a valid South African ID number");
      return false;
    }

    return true;
  };

  const validateSAIdNumber = (idNumber: string): boolean => {
    if (!/^\d{13}$/.test(idNumber)) return false;

    const digits = idNumber.split("").map(Number);
    let sum = 0;

    for (let i = 0; i < 12; i++) {
      if (i % 2 === 0) {
        sum += digits[i];
      } else {
        const doubled = digits[i] * 2;
        sum += doubled > 9 ? doubled - 9 : doubled;
      }
    }

    const checkDigit = (10 - (sum % 10)) % 10;
    return checkDigit === digits[12];
  };

  const handleCustomerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (validateCustomerForm()) {
      setStep("provider");
    }
  };

  const handleProviderSelect = (provider: PaymentProvider) => {
    setSelectedProvider(provider);
  };

  const handlePaymentSubmit = async () => {
    if (!selectedProvider) {
      setError("Please select a payment provider");
      return;
    }

    console.log("Starting payment submission for provider:", selectedProvider);
    setLoading(true);
    setError(null);
    setStep("processing");

    try {
      const paymentRequest = {
        amount: amount,
        currency: currency,
        orderId: orderId,
        items: items,
        customer: {
          id: customer?.id,
          firstName: customerForm.firstName,
          lastName: customerForm.lastName,
          email: customerForm.email,
          phone: customerForm.phone,
          idNumber: customerForm.idNumber || undefined,
          address: customerForm.address.street
            ? customerForm.address
            : undefined,
        },
        provider: selectedProvider,
        description: `Order ${orderId} - ${items.length} item(s)`,
        returnUrl: `${window.location.origin}/payment/success?orderId=${orderId}`,
        cancelUrl: `${window.location.origin}/payment/cancelled?orderId=${orderId}`,
        notifyUrl: `${window.location.origin}/api/payments/webhook?provider=${selectedProvider}`,
        metadata: {
          source: "web",
          userAgent: navigator.userAgent,
          timestamp: new Date().toISOString(),
        },
      };

      console.log("Sending payment request to API:", paymentRequest);

      const response = await fetch("/api/payments/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(paymentRequest),
      });

      console.log("Received response from API:", response.status, response.statusText);
      
      const data = await response.json();
      console.log("Response data:", data);

      if (!response.ok) {
        throw new Error(data.error || "Payment creation failed");
      }

      if (data.success) {
        console.log("Payment initiated successfully");
        toast.success("Payment initiated successfully");

        if (data.metadata?.formHtml) {
          console.log("Creating form from HTML");
          const formContainer = document.createElement("div");
          formContainer.innerHTML = data.metadata.formHtml;
          document.body.appendChild(formContainer);
          const form = formContainer.querySelector("form");
          if (form) {
            console.log("Submitting form");
            form.submit();
          } else {
            console.error("Form not found in formHtml");
            throw new Error("Payment form not found");
          }
        } else if (data.redirectUrl) {
          console.log("Redirecting to:", data.redirectUrl);
          window.location.href = data.redirectUrl;
        } else if (data.paymentUrl) {
          console.log("Redirecting to payment URL:", data.paymentUrl);
          window.location.href = data.paymentUrl;
        } else {
          console.log("No redirect URL provided, showing error");
          throw new Error("Payment provider did not return a redirect URL. Please try again or select a different payment method.");
        }
      } else {
        console.log("Payment creation failed:", data.error?.message || "Payment creation failed");
        throw new Error(data.error?.message || "Payment creation failed");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Payment failed";
      console.error("Payment error:", errorMessage);
      setError(errorMessage);
      toast.error(errorMessage);
      onError?.(errorMessage);
      setStep("provider");
    } finally {
      console.log("Payment submission completed");
      setLoading(false);
    }
  };

  const renderCustomerForm = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Customer Information
        </CardTitle>
        <CardDescription>
          Please provide your details for the payment
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleCustomerSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                value={customerForm.firstName}
                onChange={(e) =>
                  setCustomerForm((prev) => ({
                    ...prev,
                    firstName: e.target.value,
                  }))
                }
                required
              />
            </div>
            <div>
              <Label htmlFor="lastName">Last Name *</Label>
              <Input
                id="lastName"
                value={customerForm.lastName}
                onChange={(e) =>
                  setCustomerForm((prev) => ({
                    ...prev,
                    lastName: e.target.value,
                  }))
                }
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="email">Email Address *</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                className="pl-10"
                value={customerForm.email}
                onChange={(e) =>
                  setCustomerForm((prev) => ({
                    ...prev,
                    email: e.target.value,
                  }))
                }
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="phone">Phone Number *</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="phone"
                type="tel"
                className="pl-10"
                placeholder="+27 or 0"
                value={customerForm.phone}
                onChange={(e) =>
                  setCustomerForm((prev) => ({
                    ...prev,
                    phone: e.target.value,
                  }))
                }
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="idNumber">ID Number (Optional)</Label>
            <Input
              id="idNumber"
              placeholder="13-digit SA ID number"
              value={customerForm.idNumber}
              onChange={(e) =>
                setCustomerForm((prev) => ({
                  ...prev,
                  idNumber: e.target.value,
                }))
              }
            />
          </div>

          <Separator />

          <div className="space-y-4">
            <h4 className="font-semibold flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Billing Address (Optional)
            </h4>

            <div>
              <Label htmlFor="street">Street Address</Label>
              <Input
                id="street"
                value={customerForm.address.street}
                onChange={(e) =>
                  setCustomerForm((prev) => ({
                    ...prev,
                    address: { ...prev.address, street: e.target.value },
                  }))
                }
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={customerForm.address.city}
                  onChange={(e) =>
                    setCustomerForm((prev) => ({
                      ...prev,
                      address: { ...prev.address, city: e.target.value },
                    }))
                  }
                />
              </div>
              <div>
                <Label htmlFor="province">Province</Label>
                <select
                  id="province"
                  className="w-full px-3 py-2 border border-input bg-background rounded-md"
                  value={customerForm.address.province}
                  onChange={(e) =>
                    setCustomerForm((prev) => ({
                      ...prev,
                      address: { ...prev.address, province: e.target.value },
                    }))
                  }
                >
                  {SA_PROVINCES.map((province) => (
                    <option key={province} value={province}>
                      {province}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <Label htmlFor="postalCode">Postal Code</Label>
              <Input
                id="postalCode"
                value={customerForm.address.postalCode}
                onChange={(e) =>
                  setCustomerForm((prev) => ({
                    ...prev,
                    address: { ...prev.address, postalCode: e.target.value },
                  }))
                }
              />
            </div>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button type="submit" className="w-full">
            Continue to Payment Options
          </Button>
        </form>
      </CardContent>
    </Card>
  );

  const renderProviderSelection = () => (
    <div className="space-y-6">
      <PaymentProviderSelector
        amount={amount}
        currency={currency}
        onProviderSelect={handleProviderSelect}
        selectedProvider={selectedProvider}
        loading={loading}
      />

      {selectedProvider && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <span className="font-semibold">Order Total:</span>
              <span className="text-lg font-bold">
                {formatCurrency(amount)}
              </span>
            </div>

            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="flex gap-4">
              <Button
                variant="outline"
                onClick={() => setStep("customer")}
                disabled={loading}
              >
                Back
              </Button>
              <Button
                onClick={handlePaymentSubmit}
                disabled={loading || !selectedProvider}
                className="flex-1"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="mr-2 h-4 w-4" />
                    Pay {formatCurrency(amount)}
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const renderProcessing = () => (
    <Card>
      <CardContent className="py-8 text-center">
        <div className="space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto" />
          <h3 className="text-lg font-semibold">Processing Payment</h3>
          <p className="text-muted-foreground">
            Please wait while we redirect you to the payment provider...
          </p>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Order Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
          <CardDescription>Order #{orderId}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {items.map((item, index) => (
              <div key={index} className="flex justify-between text-sm">
                <span>
                  {item.name} × {item.quantity}
                </span>
                <span>{formatCurrency(item.unitPrice * item.quantity)}</span>
              </div>
            ))}
            <Separator />
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span>{formatCurrency(amount)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Steps */}
      {step === "customer" && renderCustomerForm()}
      {step === "provider" && renderProviderSelection()}
      {step === "processing" && renderProcessing()}
    </div>
  );
}
