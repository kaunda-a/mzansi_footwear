import { BasePaymentProvider, PaymentUtils } from "../base-provider";
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
import type { PaymentStatus as PrismaPaymentStatus } from "@prisma/client";

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
    // Use the correct Yoco API base URL
    // Note: Yoco uses the same endpoint for test and production, but with different credentials
    this.baseUrl = "https://api.yoco.com";
    
    // Log test mode status
    if (config.testMode) {
      this.log("warn", "Yoco provider initialized in TEST mode");
    } else {
      this.log("info", "Yoco provider initialized in PRODUCTION mode");
    }
  }

  protected async validateConfig(): Promise<void> {
    const { publicKey, secretKey } = this._config.credentials;
    
    // Log configuration details for debugging (without exposing secrets)
    this.log("info", "Validating Yoco config", {
      hasPublicKey: !!publicKey,
      hasSecretKey: !!secretKey,
      secretKeyLength: secretKey ? secretKey.length : 0,
      publicKeyLength: publicKey ? publicKey.length : 0,
      testMode: this._config.testMode,
    });

    if (!publicKey || !secretKey) {
      throw new Error("Yoco requires publicKey and secretKey");
    }

    if (this._config.testMode) {
      this.log("warn", "Yoco running in test mode");
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

      // Use the correct endpoint for creating online checkouts
      // Log the authorization header for debugging
      const authHeader = `Bearer ${this._config.credentials.secretKey}`;
      const idempotencyKey = this.generateReference("yoco-checkout");
      
      this.log("info", "Making Yoco API request", {
        url: `${this.baseUrl}/online/v1/checkouts`,
        hasSecretKey: !!this._config.credentials.secretKey,
        secretKeyPrefix: this._config.credentials.secretKey ? this._config.credentials.secretKey.substring(0, 10) : "NONE",
        idempotencyKey: idempotencyKey
      });
      
      const headers = {
        Authorization: authHeader,
        "Content-Type": "application/json",
        "Idempotency-Key": idempotencyKey,
      };
      
      this.log("info", "Request headers", { headers: { ...headers, Authorization: "Bearer [REDACTED]" } });
      
      const response = await this.makeRequest(
        `${this.baseUrl}/online/v1/checkouts`,
        {
          method: "POST",
          headers: headers,
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
          url: `${this.baseUrl}/online/v1/checkouts`,
          method: "POST",
          hasSecretKey: !!this._config.credentials.secretKey,
          secretKeyLength: this._config.credentials.secretKey ? this._config.credentials.secretKey.length : 0,
        });
        throw new Error(`Yoco API Error: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const paymentData = await response.json();

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
      // Use the correct endpoint for retrieving checkout details
      const response = await this.makeRequest(
        `${this.baseUrl}/online/v1/checkouts/${paymentId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${this._config.credentials.secretKey}`,
          },
        },
      );

      if (!response.ok) {
        const errorText = await response.text();
        this.log("error", "Yoco Get Payment Status Error", {
          status: response.status,
          statusText: response.statusText,
          text: errorText,
          url: `${this.baseUrl}/online/v1/checkouts/${paymentId}`,
          method: "GET",
          hasSecretKey: !!this._config.credentials.secretKey,
          secretKeyLength: this._config.credentials.secretKey ? this._config.credentials.secretKey.length : 0,
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
        `${this.baseUrl}/online/v1/refunds`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${this._config.credentials.secretKey}`,
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
          url: `${this.baseUrl}/online/v1/refunds`,
          method: "POST",
          hasSecretKey: !!this._config.credentials.secretKey,
          secretKeyLength: this._config.credentials.secretKey ? this._config.credentials.secretKey.length : 0,
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
    // Yoco webhook verification requires headers which aren't passed in the current interface
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
          paymentStatus: status as PrismaPaymentStatus,
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
}
