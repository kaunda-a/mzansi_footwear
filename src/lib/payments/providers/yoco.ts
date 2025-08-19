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
    this.baseUrl = "https://api.yoco.com";
  }

  protected async validateConfig(): Promise<void> {
    const { publicKey, secretKey } = this._config.credentials;
    
    // Log part of the secret key for debugging (first 10 characters)
    this.log("info", "Validating Yoco config", {
      hasPublicKey: !!publicKey,
      hasSecretKey: !!secretKey,
      secretKeyPrefix: secretKey ? secretKey.substring(0, 10) : "NONE"
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
            amount: request.amount.amount * 100, // Yoco expects amount in cents
            currency: request.amount.currency,
            metadata: {
              orderId: request.metadata.orderId,
              customerId: request.metadata.customerId,
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
          text: errorText,
        });
        throw new Error(`Yoco API Error: ${response.status} ${errorText}`);
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
        const error = await response.json();
        throw new Error(error.message);
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
            Authorization: `Basic ${Buffer.from(`:${this._config.credentials.secretKey}`).toString("base64")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            chargeId: paymentId,
            amount: amount ? amount * 100 : undefined, // Convert to cents if provided
            reason: reason,
          }),
        },
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Yoco Refund API Error: ${response.status} ${errorText}`,
        );
      }

      const refundData = await response.json();

      return {
        id: refundData.id,
        paymentId: paymentId,
        amount: {
          amount: refundData.amount ? refundData.amount / 100 : 0, // Convert back to main currency unit
          currency: refundData.currency,
          formatted: `${refundData.currency} ${(refundData.amount ? refundData.amount / 100 : 0).toFixed(2)}`,
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
    // Yoco doesn't use a simple signature header. It uses a timestamp and the event body to create a signature.
    // This is a simplified version and might need adjustments based on Yoco's specific implementation.
    this.log(
      "warn",
      "Yoco webhook verification is not fully implemented and should be used with caution.",
    );
    return true;
  }

  async processWebhook(webhook: PaymentWebhook): Promise<void> {
    try {
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
      default:
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
}
