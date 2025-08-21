import { NextRequest, NextResponse } from "next/server";
import {
  getPaymentManager,
  initializePaymentManager,
} from "@/lib/payments/payment-manager";
import { paymentConfigs } from "@/lib/payments/config";
import { PaymentRequest, PaymentProvider } from "@/lib/payments/types";
import { auth } from "@/lib/auth";

// Initialize payment manager
let paymentManagerInitialized = false;

async function ensurePaymentManagerInitialized() {
  if (!paymentManagerInitialized) {
    const manager = initializePaymentManager(paymentConfigs);
    await manager.initialize();
    paymentManagerInitialized = true;
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log("Payment creation request received");
    
    // Ensure payment manager is initialized
    await ensurePaymentManagerInitialized();
    console.log("Payment manager initialized");

    const session = await auth();
    if (!session?.user) {
      console.log("Authentication failed");
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 },
      );
    }
    console.log("User authenticated:", session.user.id);

    const body = await request.json();
    console.log("Request body:", body);

    // Validate required fields
    const requiredFields = [
      "amount",
      "currency",
      "orderId",
      "items",
      "customer",
    ];
    for (const field of requiredFields) {
      if (!body[field]) {
        console.log("Missing required field:", field);
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 },
        );
      }
    }

    // Get client IP and user agent for fraud detection
    const clientIP =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      "unknown";
    const userAgent = request.headers.get("user-agent") || "unknown";

    // Build payment request
    const paymentRequest: PaymentRequest = {
      amount: {
        amount: Math.round(parseFloat(body.amount) * 100) / 100, // Round to two decimal places
        currency: body.currency || "ZAR",
        formatted: new Intl.NumberFormat("en-ZA", {
          style: "currency",
          currency: body.currency || "ZAR",
        }).format(parseFloat(body.amount)),
      },
      customer: {
        id: body.customer.id || session.user.id,
        email: body.customer.email || session.user.email,
        firstName:
          body.customer.firstName || session.user.name?.split(" ")[0] || "",
        lastName:
          body.customer.lastName ||
          session.user.name?.split(" ").slice(1).join(" ") ||
          "",
        phone: body.customer.phone,
        idNumber: body.customer.idNumber,
        address: body.customer.address,
      },
      items: body.items.map((item: any) => ({
        id: item.id,
        name: item.name,
        description: item.description,
        quantity: item.quantity,
        unitPrice: parseFloat(item.unitPrice),
        totalPrice: parseFloat(item.unitPrice) * item.quantity,
        sku: item.sku,
        category: item.category,
      })),
      metadata: {
        orderId: body.orderId,
        customerId: body.customer.id || session.user.id,
        sessionId: session.user.id,
        source: "web",
        userAgent,
        ipAddress: clientIP,
        ...body.metadata,
      },
      returnUrl:
        body.returnUrl || `${process.env.NEXTAUTH_URL}/payment/success`,
      cancelUrl:
        body.cancelUrl || `${process.env.NEXTAUTH_URL}/payment/cancelled`,
      notifyUrl:
        body.notifyUrl || `${process.env.NEXTAUTH_URL}/api/payments/webhook`,
      description: body.description || `Order ${body.orderId}`,
      reference: body.reference || `ORDER_${body.orderId}_${Date.now()}`,
      expiresAt: body.expiresAt ? new Date(body.expiresAt) : undefined,
      paymentMethods: body.paymentMethods,
    };

    console.log("Payment request built:", paymentRequest);

    // Get payment manager and create payment
    const paymentManager = getPaymentManager();
    const preferredProvider = body.provider as PaymentProvider;
    
    console.log("Creating payment with provider:", preferredProvider);

    const response = await paymentManager.createPayment(
      paymentRequest,
      preferredProvider,
    );
    
    console.log("Payment creation response:", response);

    // Log the payment creation
    console.log("Payment created:", {
      success: response.success,
      paymentId: response.paymentId,
      provider: preferredProvider || "auto-selected",
      amount: paymentRequest.amount.amount,
      currency: paymentRequest.amount.currency,
      customer: paymentRequest.customer.email,
      orderId: body.orderId,
    });

    return NextResponse.json(response);
  } catch (error) {
    console.error("Payment creation error:", error);

    return NextResponse.json(
      {
        error: "Payment creation failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    await ensurePaymentManagerInitialized();

    const paymentManager = getPaymentManager();
    const availableProviders = paymentManager.getAvailableProviders();

    // Get provider capabilities
    const providers = availableProviders.map((provider) => {
      const config = paymentConfigs.find((c) => c.provider === provider);
      return {
        provider,
        name: getProviderDisplayName(provider),
        methods: config?.settings.supportedMethods || [],
        currencies: config?.settings.supportedCurrencies || [],
        minimumAmount: config?.settings.minimumAmount || 0,
        maximumAmount: config?.settings.maximumAmount || Infinity,
        processingFee: config?.settings.processingFee || 0,
        processingFeeType: config?.settings.processingFeeType || "fixed",
      };
    });

    return NextResponse.json({
      success: true,
      providers,
      totalProviders: providers.length,
    });
  } catch (error) {
    console.error("Error fetching payment providers:", error);

    return NextResponse.json(
      { error: "Failed to fetch payment providers" },
      { status: 500 },
    );
  }
}

function getProviderDisplayName(provider: PaymentProvider): string {
  const names: Record<PaymentProvider, string> = {
    payfast: "PayFast",
    yoco: "Yoco",
  };

  return names[provider] || provider;
}
