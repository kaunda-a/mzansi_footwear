// South African Payment Gateway Types
export type PaymentProvider = "payfast" | "yoco";

export type PaymentMethod = "card" | "eft" | "instant_eft";

export type Currency = "ZAR" | "USD" | "EUR" | "GBP";

export interface PaymentAmount {
  amount: number;
  currency: Currency;
  formatted: string;
}

export interface PaymentCustomer {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  idNumber?: string;
  address?: {
    street: string;
    city: string;
    province: string;
    postalCode: string;
    country: string;
  };
}

export interface PaymentItem {
  id: string;
  name: string;
  description?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  sku?: string;
  category?: string;
}

export interface PaymentMetadata {
  orderId: string;
  customerId: string;
  sessionId?: string;
  source: "web" | "mobile" | "api";
  userAgent?: string;
  ipAddress?: string;
  [key: string]: any;
}

export interface PaymentRequest {
  amount: PaymentAmount;
  customer: PaymentCustomer;
  items: PaymentItem[];
  metadata: PaymentMetadata;
  returnUrl: string;
  cancelUrl: string;
  notifyUrl: string;
  description: string;
  reference: string;
  expiresAt?: Date;
  paymentMethods?: PaymentMethod[];
}

export interface PaymentResponse {
  success: boolean;
  paymentId: string;
  transactionId?: string;
  status: PaymentStatus;
  redirectUrl?: string;
  qrCode?: string;
  paymentUrl?: string;
  reference: string;
  message?: string;
  error?: PaymentError;
  metadata?: Record<string, any>;
}

export type PaymentStatus =
  | "PENDING"
  | "PROCESSING"
  | "COMPLETED"
  | "FAILED"
  | "CANCELLED"
  | "EXPIRED"
  | "REFUNDED"
  | "PARTIALLY_REFUNDED"
  | "DISPUTED"
  | "AUTHORIZED"
  | "CAPTURED";

export interface PaymentError {
  code: string;
  message: string;
  details?: Record<string, any>;
  retryable: boolean;
}

export interface PaymentWebhook {
  id: string;
  provider: PaymentProvider;
  event: string;
  data: Record<string, any>;
  signature: string;
  timestamp: Date;
  verified: boolean;
}

export interface PaymentRefund {
  id: string;
  paymentId: string;
  amount: PaymentAmount;
  reason: string;
  status: "pending" | "completed" | "failed";
  createdAt: Date;
  processedAt?: Date;
}

export interface PaymentConfig {
  provider: PaymentProvider;
  enabled: boolean;
  testMode: boolean;
  credentials: {
    merchantId?: string;
    merchantKey?: string;
    apiKey?: string;
    secretKey?: string;
    publicKey?: string;
    passphrase?: string;
    [key: string]: any;
  };
  settings: {
    supportedMethods: PaymentMethod[];
    supportedCurrencies: Currency[];
    minimumAmount?: number;
    maximumAmount?: number;
    processingFee?: number;
    processingFeeType?: "fixed" | "percentage";
    [key: string]: any;
  };
}

export interface PaymentProviderInterface {
  readonly provider: PaymentProvider;
  readonly config: PaymentConfig;

  initialize(): Promise<void>;
  createPayment(request: PaymentRequest): Promise<PaymentResponse>;
  getPaymentStatus(paymentId: string): Promise<PaymentStatus>;
  refundPayment(
    paymentId: string,
    amount?: number,
    reason?: string,
  ): Promise<PaymentRefund>;
  verifyWebhook(payload: string, signature: string): boolean;
  processWebhook(webhook: PaymentWebhook): Promise<void>;
  calculateFees(amount: number): number;
  isAvailable(): boolean;
}

export interface PaymentAnalytics {
  totalTransactions: number;
  totalAmount: number;
  successRate: number;
  averageTransactionValue: number;
  topPaymentMethods: Array<{
    method: PaymentMethod;
    count: number;
    percentage: number;
  }>;
  providerPerformance: Array<{
    provider: PaymentProvider;
    successRate: number;
    averageProcessingTime: number;
    totalVolume: number;
  }>;
  fraudDetection: {
    flaggedTransactions: number;
    blockedTransactions: number;
    falsePositives: number;
  };
}
