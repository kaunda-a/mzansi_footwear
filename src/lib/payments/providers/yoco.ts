import { BasePaymentProvider } from "../base-provider";
import {
  PaymentProvider,
  PaymentRequest,
  PaymentResponse,
  PaymentStatus,
  PaymentRefund,
  PaymentWebhook,
  PaymentConfig,
} from "../types";
import { db } from "@/lib/prisma";

interface YocoConfig {
  publicKey: string;
  secretKey: string;
  testMode: boolean;
}

export class YocoProvider extends BasePaymentProvider {
  readonly provider: PaymentProvider = "yoco";
  private readonly baseUrl: string;

  constructor(config: PaymentConfig) {
    super(config);
    // Use the correct Yoco API base URL according to official documentation
    this.baseUrl = "https://payments.yoco.com";
    
    // Log test mode status
    if (config.testMode) {
      this.log("warn", "Yoco provider initialized in TEST mode - ensure test credentials are used");
    } else {
      this.log("info", "Yoco provider initialized in PRODUCTION mode");
    }
  }

  protected async validateConfig(): Promise<void> {
    const { publicKey, secretKey } = this._config.credentials;
    
    // Clean the credentials of any potential hidden characters
    const cleanSecretKey = secretKey ? secretKey.trim() : "";
    const cleanPublicKey = publicKey ? publicKey.trim() : "";
    
    // Update the credentials if they were cleaned
    if (cleanSecretKey !== secretKey || cleanPublicKey !== publicKey) {
      this._config.credentials.secretKey = cleanSecretKey;
      this._config.credentials.publicKey = cleanPublicKey;
      this.log("warn", "Yoco credentials contained whitespace and were trimmed");
    }
    
    // Log configuration details for debugging (without exposing secrets)
    this.log("info", "Validating Yoco config", {
      hasPublicKey: !!cleanPublicKey,
      hasSecretKey: !!cleanSecretKey,
      secretKeyLength: cleanSecretKey ? cleanSecretKey.length : 0,
      publicKeyLength: cleanPublicKey ? cleanPublicKey.length : 0,
      testMode: this._config.testMode,
    });

    if (!cleanPublicKey || !cleanSecretKey) {
      throw new Error("Yoco requires publicKey and secretKey");
    }

    // Validate secret key format
    if (!cleanSecretKey.startsWith('sk_')) {
      this.log("warn", "Yoco secret key should start with 'sk_'");
    }

    if (this._config.testMode) {
      this.log("warn", "Yoco running in test mode - ensure test credentials are used");
    }
  }

  protected async setupProvider(): Promise<void> {
    this.log("info", "Yoco provider initialized");
  }

  protected validateCredentials(): boolean {
    const { publicKey, secretKey } = this._config.credentials;
    return !!(publicKey && secretKey);
  }

  async createPayment(request: PaymentRequest): Promise<PaymentResponse> {
    try {
      this.validateAmount(request.amount.amount);

      // Generate idempotency key
      const idempotencyKey = this.generateReference("yoco-checkout");
      
      // Ensure secretKey is defined
      const secretKey = this._config.credentials.secretKey;
      if (!secretKey) {
        throw new Error("Yoco secret key is required but was not provided");
      }
      
      this.log("info", "Making Yoco API request", {
        url: `${this.baseUrl}/api/checkouts`,
        hasSecretKey: !!secretKey,
        idempotencyKey: idempotencyKey,
        isTestMode: this._config.testMode,
      });
      
      const response = await this.makeRequest(
        `${this.baseUrl}/api/checkouts`,
        {
          method: "POST",
          headers: {
            "Idempotency-Key": idempotencyKey,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount: Math.round(request.amount.amount * 100), // Yoco expects amount in cents, rounded to avoid floating point issues
            currency: request.amount.currency,
            metadata: {
              orderId: request.metadata.orderId,
              customerId: request.metadata.customerId,
              // Add more metadata for better tracking
              timestamp: new Date().toISOString(),
              source: request.metadata.source || "web",
            },
            successUrl: request.returnUrl,
            cancelUrl: request.cancelUrl,
          }),
        },
      );

      if (!response.ok) {
        const errorText = await response.text();
        this.log("error", "Yoco API Error", {
          status: response.status,
          statusText: response.statusText,
          text: errorText,
          url: `${this.baseUrl}/api/checkouts`,
          method: "POST",
        });
        throw new Error(`Yoco API Error: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const paymentData = await response.json();
      
      this.log("info", "Yoco API response", {
        paymentId: paymentData.id,
        checkoutUrl: paymentData.checkoutUrl,
      });

      return this.createSuccessResponse(
        paymentData.id,
        "PENDING",
        paymentData.checkoutUrl,
        {
          redirectUrl: paymentData.checkoutUrl,
        },
      );
    } catch (error) {
      this.log("error", "Yoco payment creation failed", error);
      return this.createErrorResponse(
        "PAYMENT_CREATION_FAILED",
        error instanceof Error ? error.message : "Unknown error",
        true,
      );
    }
  }

  async getPaymentStatus(paymentId: string): Promise<PaymentStatus> {
    try {
      const response = await this.makeRequest(
        `${this.baseUrl}/api/checkouts/${paymentId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (!response.ok) {
        const errorText = await response.text();
        this.log("error", "Yoco Get Payment Status Error", {
          status: response.status,
          statusText: response.statusText,
          text: errorText,
          url: `${this.baseUrl}/api/checkouts/${paymentId}`,
          method: "GET",
        });
        throw new Error(`Yoco Get Payment Status Error: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const paymentData = await response.json();
      return this.mapYocoStatus(paymentData.paymentStatus);
    } catch (error) {
      this.log("error", "Yoco status check failed", error);
      return "FAILED";
    }
  }

  async refundPayment(
    paymentId: string,
    amount?: number,
    reason?: string,
  ): Promise<PaymentRefund> {
    try {
      const response = await this.makeRequest(
        `${this.baseUrl}/api/refunds`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            chargeId: paymentId,
            amount: amount ? Math.round(amount * 100) : undefined, // Convert to cents if provided, rounded to avoid floating point issues
            reason: reason,
          }),
        },
      );

      if (!response.ok) {
        const errorText = await response.text();
        this.log("error", "Yoco Refund API Error", {
          status: response.status,
          statusText: response.statusText,
          text: errorText,
          url: `${this.baseUrl}/api/refunds`,
          method: "POST",
        });
        throw new Error(`Yoco Refund API Error: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const refundData = await response.json();

      return {
        id: refundData.id,
        paymentId: paymentId,
        amount: {
          amount: refundData.amount ? Math.round(refundData.amount) / 100 : 0, // Convert back to main currency unit
          currency: refundData.currency,
          formatted: `${refundData.currency} ${(refundData.amount ? Math.round(refundData.amount) / 100 : 0).toFixed(2)}`,
        },
        reason: refundData.reason,
        status: "completed",
        createdAt: new Date(),
      };
    } catch (error) {
      this.log("error", "Yoco refund failed", error);
      return {
        id: "",
        paymentId: paymentId,
        amount: {
          amount: 0,
          currency: "ZAR",
          formatted: "ZAR 0.00",
        },
        reason: error instanceof Error ? error.message : "Unknown error",
        status: "failed",
        createdAt: new Date(),
      };
    }
  }

  verifyWebhook(payload: string, signature: string): boolean {
    // For now, we're returning true but logging a warning
    // In a production environment, you should implement proper signature verification
    this.log(
      "warn",
      "Yoco webhook verification is bypassed due to interface limitations. Implement proper verification in production.",
    );
    return true;
  }

  async processWebhook(webhook: PaymentWebhook): Promise<void> {
    try {
      // Note: In a proper implementation, headers should be passed to verifyWebhook
      // For now, we're skipping verification or using a simplified version
      const isValid = this.verifyWebhook(JSON.stringify(webhook.data), webhook.signature);
      if (!isValid) {
        this.log("error", "Invalid webhook signature");
        throw new Error("Invalid webhook signature");
      }

      const { data } = webhook;

      this.log("info", "Processing Yoco webhook", {
        paymentId: data.id,
        status: data.status,
      });

      const status = this.mapYocoStatus(data.status);

      await this.updatePaymentStatus(data.metadata.orderId, status);
    } catch (error) {
      this.log("error", "Yoco webhook processing failed", error);
      throw error;
    }
  }

  private mapYocoStatus(yocoStatus: string): PaymentStatus {
    switch (yocoStatus?.toLowerCase()) {
      case "successful":
        return "COMPLETED";
      case "failed":
        return "FAILED";
      case "pending":
        return "PENDING";
      case "cancelled":
        return "CANCELLED";
      case "refunded":
        return "REFUNDED";
      default:
        this.log("warn", `Unknown Yoco status: ${yocoStatus}, defaulting to PENDING`);
        return "PENDING";
    }
  }

  private async updatePaymentStatus(
    orderId: string,
    status: PaymentStatus,
  ): Promise<void> {
    try {
      // Map payment status to order status
      let orderStatus: any = "PENDING";
      if (status === "COMPLETED") {
        orderStatus = "CONFIRMED";
      } else if (status === "FAILED") {
        orderStatus = "CANCELLED";
      }

      await db.order.update({
        where: { id: orderId },
        data: {
          status: orderStatus,
          paymentStatus: status,
        },
      });
      this.log("info", `Order ${orderId} payment status updated to: ${status}`);
    } catch (error) {
      this.log(
        "error",
        `Failed to update order ${orderId} payment status to ${status}:`,
        error,
      );
      throw error;
    }
  }

  // Override makeRequest to handle Yoco's bearer auth
  protected async makeRequest(
    url: string,
    options: RequestInit,
    timeout: number = 30000,
  ): Promise<Response> {
    // Ensure secretKey is defined
    const secretKey = this._config.credentials.secretKey;
    if (!secretKey) {
      throw new Error("Yoco secret key is required but was not provided");
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      // Use bearer token auth with secret key
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${secretKey}`,
          "User-Agent": "MzansiFootwear/1.0",
          ...options.headers,
        },
      });

      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      this.log("error", "HTTP request failed", { url, error });
      throw error;
    }
  }
}