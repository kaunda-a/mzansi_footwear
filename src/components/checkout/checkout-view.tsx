"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  IconCreditCard,
  IconTruck,
  IconShield,
  IconLock,
  IconCheck,
} from "@tabler/icons-react";
import { useCartStore } from "@/lib/cart-store";
import { formatPrice } from "@/lib/format";
import { PaymentForm } from "@/components/payments/payment-form";

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

export function CheckoutView({ user }: { user?: any }) {
  const router = useRouter();
  const { items, totalPrice, totalItems, clearCart } = useCartStore();

  const [step, setStep] = useState(1);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [orderId, setOrderId] = useState<string>("");
  const [formData, setFormData] = useState({
    // Contact Information
    email: user?.email || "",
    phone: "",

    // Shipping Address
    firstName: user?.name?.split(" ")[0] || "",
    lastName: user?.name?.split(" ").slice(1).join(" ") || "",
    company: "",
    address1: "",
    address2: "",
    city: "",
    province: "",
    postalCode: "",

    // Billing Address
    billingDifferent: false,
    billingFirstName: "",
    billingLastName: "",
    billingCompany: "",
    billingAddress1: "",
    billingAddress2: "",
    billingCity: "",
    billingProvince: "",
    billingPostalCode: "",

    // Payment
    paymentMethod: "yoco", // Auto-select yoco

    // Order Notes
    orderNotes: "",

    // Terms
    acceptTerms: false,
    subscribeNewsletter: false,
  });

  const subtotal = totalPrice;
  const shipping = 0; // Free shipping
  const tax = 0; // No VAT
  const total = subtotal + shipping + tax;

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validateStep1 = () => {
    const requiredFields = [
      'email',
      'phone',
      'firstName',
      'lastName',
      'address1',
      'city',
      'province',
      'postalCode'
    ];
    
    for (const field of requiredFields) {
      if (!formData[field] || formData[field].trim() === '') {
        return false;
      }
    }
    
    // Basic email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      return false;
    }
    
    return true;
  };

  const handleNextStep = () => {
    if (step === 1) {
      if (validateStep1()) {
        setStep(2);
      } else {
        alert("Please fill in all required fields marked with an asterisk (*)");
      }
    } else if (step === 2) {
      handleSubmitOrder();
    }
  };

  const handlePrevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmitOrder = async () => {
    try {
      // Prepare order data
      const orderData = {
        items: items.map(item => ({
          productId: item.productId,
          variantId: item.variantId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
        })),
        totalAmount: total,
        customer: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
        },
        shippingAddress: {
          street: formData.address1 + (formData.address2 ? ` ${formData.address2}` : ""),
          city: formData.city,
          province: formData.province,
          postalCode: formData.postalCode,
          country: "South Africa",
        },
        billingAddress: formData.billingDifferent ? {
          firstName: formData.billingFirstName,
          lastName: formData.billingLastName,
          street: formData.billingAddress1 + (formData.billingAddress2 ? ` ${formData.billingAddress2}` : ""),
          city: formData.billingCity,
          province: formData.billingProvince,
          postalCode: formData.billingPostalCode,
          country: "South Africa",
        } : undefined,
        notes: formData.orderNotes,
      };

      // Create the order
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to create order");
      }

      // Show payment form with the actual order ID
      setOrderId(result.order.id);
      setShowPaymentForm(true);
    } catch (error) {
      console.error("Error creating order:", error);
      alert("Failed to create order. Please try again.");
    }
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Your cart is empty
        </h2>
        <p className="text-gray-600 mb-8">
          Add some items to your cart before proceeding to checkout.
        </p>
        <Button onClick={() => router.push("/products")}>
          Continue Shopping
        </Button>
      </div>
    );
  }

  if (showPaymentForm) {
    return (
      <PaymentForm
        orderId={orderId}
        amount={total}
        items={items}
        customer={{
          email: formData.email,
          phone: formData.phone,
          firstName: formData.firstName,
          lastName: formData.lastName,
        }}
      />
    );
  }

  return (
    <div className="space-y-8">
      {/* Progress Steps */}
      <div className="flex items-center justify-center space-x-8">
        {[
          { number: 1, title: "Information" },
          { number: 2, title: "Shipping" },
        ].map((stepItem) => (
          <div key={stepItem.number} className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step >= stepItem.number
                  ? "bg-primary text-white"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              {step > stepItem.number ? (
                <IconCheck className="h-4 w-4" />
              ) : (
                stepItem.number
              )}
            </div>
            <span
              className={`ml-2 text-sm ${
                step >= stepItem.number ? "text-gray-900" : "text-gray-500"
              }`}
            >
              {stepItem.title}
            </span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Checkout Form */}
        <div className="lg:col-span-2">
          {step === 1 && (
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-sm text-gray-600">
                  <span className="text-red-500">*</span> Indicates required field
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">
                      Email Address <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">
                      Phone Number <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) =>
                        handleInputChange("phone", e.target.value)
                      }
                      required
                    />
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-semibold mb-4">
                    Shipping Address
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <Label htmlFor="firstName">
                        First Name <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) =>
                          handleInputChange("firstName", e.target.value)
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">
                        Last Name <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) =>
                          handleInputChange("lastName", e.target.value)
                        }
                        required
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="company">Company (Optional)</Label>
                      <Input
                        id="company"
                        value={formData.company}
                        onChange={(e) =>
                          handleInputChange("company", e.target.value)
                        }
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="address1">
                        Address Line 1 <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="address1"
                        value={formData.address1}
                        onChange={(e) =>
                          handleInputChange("address1", e.target.value)
                        }
                        required
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="address2">
                        Address Line 2 (Optional)
                      </Label>
                      <Input
                        id="address2"
                        value={formData.address2}
                        onChange={(e) =>
                          handleInputChange("address2", e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="city">
                        City <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="city"
                        value={formData.city}
                        onChange={(e) =>
                          handleInputChange("city", e.target.value)
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="province">
                        Province <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        value={formData.province}
                        onValueChange={(value) =>
                          handleInputChange("province", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select province" />
                        </SelectTrigger>
                        <SelectContent>
                          {SA_PROVINCES.map((province) => (
                            <SelectItem key={province} value={province}>
                              {province}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="postalCode">
                        Postal Code <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="postalCode"
                        value={formData.postalCode}
                        onChange={(e) =>
                          handleInputChange("postalCode", e.target.value)
                        }
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleNextStep}>Continue to Shipping</Button>
                </div>
              </CardContent>
            </Card>
          )}

          {step === 2 && (
            <Card>
              <CardHeader>
                <CardTitle>Shipping Method</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="border rounded-lg p-4 bg-blue-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <IconTruck className="h-5 w-5 text-blue-600 mr-2" />
                        <div>
                          <p className="font-medium">Standard Delivery</p>
                          <p className="text-sm text-gray-600">
                            2-3 business days
                          </p>
                        </div>
                      </div>
                      <span className="font-medium">
                        {shipping === 0 ? "FREE" : formatPrice(shipping)}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="orderNotes">Order Notes (Optional)</Label>
                  <Textarea
                    id="orderNotes"
                    placeholder="Special delivery instructions..."
                    value={formData.orderNotes}
                    onChange={(e) =>
                      handleInputChange("orderNotes", e.target.value)
                    }
                  />
                </div>

                <div className="flex justify-between">
                  <Button variant="outline" onClick={handlePrevStep}>
                    Back
                  </Button>
                  <Button onClick={handleNextStep}>Continue to Payment</Button>
                </div>
              </CardContent>
            </Card>
          )}

          
        </div>

        {/* Order Summary */}
        <div>
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <div className="flex-1">
                      <p className="font-medium">{item.name}</p>
                      <p className="text-gray-600">
                        {item.color} • {item.size} • Qty: {item.quantity}
                      </p>
                    </div>
                    <span className="font-medium">
                      {formatPrice(item.unitPrice * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <Separator />

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal ({totalItems} items)</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>FREE</span>
                </div>
              </div>

              <Separator />

              <div className="flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>

              <div className="text-xs text-gray-500 space-y-1">
                <div className="flex items-center">
                  <IconShield className="mr-1 h-3 w-3" />
                  Secure 256-bit SSL encryption
                </div>
                <div className="flex items-center">
                  <IconTruck className="mr-1 h-3 w-3" />
                  Free delivery on all orders
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
