import { 
  PaymentProvider, 
  PaymentConfig, 
  PaymentRequest, 
  PaymentResponse, 
  PaymentStatus, 
  PaymentRefund, 
  PaymentWebhook,
  PaymentProviderInterface,
  PaymentError
} from './types';

export abstract class BasePaymentProvider implements PaymentProviderInterface {
  abstract readonly provider: PaymentProvider;
  protected _config: PaymentConfig;
  protected _initialized: boolean = false;

  constructor(config: PaymentConfig) {
    this._config = config;
  }

  get config(): PaymentConfig {
    return this._config;
  }

  /**
   * Initialize the payment provider
   */
  async initialize(): Promise<void> {
    if (this._initialized) return;
    
    await this.validateConfig();
    await this.setupProvider();
    this._initialized = true;
  }

  /**
   * Check if provider is available and properly configured
   */
  isAvailable(): boolean {
    return this._config.enabled && this._initialized && this.validateCredentials();
  }

  /**
   * Calculate processing fees for the provider
   */
  calculateFees(amount: number): number {
    const { processingFee = 0, processingFeeType = 'fixed' } = this._config.settings;
    
    if (processingFeeType === 'percentage') {
      return (amount * processingFee) / 100;
    }
    
    return processingFee;
  }

  /**
   * Generate a unique reference for the payment
   */
  protected generateReference(prefix?: string): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    return `${prefix || this.provider}_${timestamp}_${random}`.toUpperCase();
  }

  /**
   * Validate amount against provider limits
   */
  protected validateAmount(amount: number): void {
    const { minimumAmount, maximumAmount } = this._config.settings;
    
    if (minimumAmount && amount < minimumAmount) {
      throw new Error(`Amount ${amount} is below minimum ${minimumAmount}`);
    }
    
    if (maximumAmount && amount > maximumAmount) {
      throw new Error(`Amount ${amount} exceeds maximum ${maximumAmount}`);
    }
  }

  /**
   * Create standardized error response
   */
  protected createErrorResponse(
    code: string, 
    message: string, 
    retryable: boolean = false,
    details?: Record<string, any>
  ): PaymentResponse {
    return {
      success: false,
      paymentId: '',
      status: 'FAILED',
      reference: '',
      error: {
        code,
        message,
        retryable,
        details
      }
    };
  }

  /**
   * Create standardized success response
   */
  protected createSuccessResponse(
    paymentId: string,
    status: PaymentStatus,
    reference: string,
    additionalData?: Partial<PaymentResponse>
  ): PaymentResponse {
    return {
      success: true,
      paymentId,
      status,
      reference,
      ...additionalData
    };
  }

  /**
   * Log payment events for debugging and monitoring
   */
  protected log(level: 'info' | 'warn' | 'error', message: string, data?: any): void {
    const logData = {
      provider: this.provider,
      timestamp: new Date().toISOString(),
      message,
      data
    };

    if (level === 'error') {
      console.error(`[${this.provider.toUpperCase()}]`, logData);
    } else if (level === 'warn') {
      console.warn(`[${this.provider.toUpperCase()}]`, logData);
    } else {
      console.log(`[${this.provider.toUpperCase()}]`, logData);
    }
  }

  /**
   * Handle HTTP requests with proper error handling
   */
  protected async makeRequest(
    url: string, 
    options: RequestInit,
    timeout: number = 30000
  ): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'MzansiFootwear/1.0',
          ...options.headers
        }
      });

      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      this.log('error', 'HTTP request failed', { url, error });
      throw error;
    }
  }

  /**
   * Validate provider configuration
   */
  protected abstract validateConfig(): Promise<void>;

  /**
   * Setup provider-specific initialization
   */
  protected abstract setupProvider(): Promise<void>;

  /**
   * Validate provider credentials
   */
  protected abstract validateCredentials(): boolean;

  /**
   * Abstract methods that must be implemented by each provider
   */
  abstract createPayment(request: PaymentRequest): Promise<PaymentResponse>;
  abstract getPaymentStatus(paymentId: string): Promise<PaymentStatus>;
  abstract refundPayment(paymentId: string, amount?: number, reason?: string): Promise<PaymentRefund>;
  abstract verifyWebhook(payload: string, signature: string): boolean;
  abstract processWebhook(webhook: PaymentWebhook): Promise<void>;
}

/**
 * Utility functions for payment processing
 */
export class PaymentUtils {
  /**
   * Format amount for display
   */
  static formatAmount(amount: number, currency: string = 'ZAR'): string {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: currency
    }).format(amount);
  }

  /**
   * Validate South African ID number
   */
  static validateSAIdNumber(idNumber: string): boolean {
    if (!/^\d{13}$/.test(idNumber)) return false;

    const digits = idNumber.split('').map(Number);
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
  }

  /**
   * Validate South African phone number
   */
  static validateSAPhoneNumber(phone: string): boolean {
    const cleaned = phone.replace(/\D/g, '');
    return /^(27|0)[0-9]{9}$/.test(cleaned);
  }

  /**
   * Generate secure hash for webhook verification
   */
  static generateHash(data: string, secret: string, algorithm: string = 'sha256'): string {
    const crypto = require('crypto');
    return crypto.createHmac(algorithm, secret).update(data).digest('hex');
  }

  /**
   * Sanitize payment data for logging
   */
  static sanitizeForLogging(data: any): any {
    const sensitiveFields = ['cardNumber', 'cvv', 'pin', 'password', 'secret', 'key'];
    const sanitized = JSON.parse(JSON.stringify(data));

    const sanitizeObject = (obj: any): any => {
      for (const key in obj) {
        if (typeof obj[key] === 'object' && obj[key] !== null) {
          sanitizeObject(obj[key]);
        } else if (sensitiveFields.some(field => key.toLowerCase().includes(field))) {
          obj[key] = '***REDACTED***';
        }
      }
      return obj;
    };

    return sanitizeObject(sanitized);
  }
}
