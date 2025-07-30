import { 
  PaymentProvider, 
  PaymentConfig, 
  PaymentRequest, 
  PaymentResponse, 
  PaymentStatus, 
  PaymentRefund, 
  PaymentWebhook,
  PaymentProviderInterface,
  PaymentAnalytics,
  PaymentMethod
} from './types';

import { PayFastProvider } from './providers/payfast';

export class PaymentManager {
  private providers: Map<PaymentProvider, PaymentProviderInterface> = new Map();
  private configs: Map<PaymentProvider, PaymentConfig> = new Map();
  private initialized: boolean = false;

  constructor(configs: PaymentConfig[]) {
    configs.forEach(config => {
      this.configs.set(config.provider, config);
    });
  }

  /**
   * Initialize all enabled payment providers
   */
  async initialize(): Promise<void> {
    if (this.initialized) return;

    const initPromises = Array.from(this.configs.entries()).map(async ([provider, config]) => {
      if (!config.enabled) return;

      try {
        const providerInstance = this.createProviderInstance(provider, config);
        await providerInstance.initialize();
        this.providers.set(provider, providerInstance);
        console.log(`✅ ${provider} payment provider initialized`);
      } catch (error) {
        console.error(`❌ Failed to initialize ${provider} provider:`, error);
      }
    });

    await Promise.all(initPromises);
    this.initialized = true;
    console.log(`🚀 Payment Manager initialized with ${this.providers.size} providers`);
  }

  /**
   * Get available payment providers
   */
  getAvailableProviders(): PaymentProvider[] {
    return Array.from(this.providers.keys()).filter(provider => 
      this.providers.get(provider)?.isAvailable()
    );
  }

  /**
   * Get providers that support specific payment methods
   */
  getProvidersByMethod(method: PaymentMethod): PaymentProvider[] {
    return this.getAvailableProviders().filter(provider => {
      const config = this.configs.get(provider);
      return config?.settings.supportedMethods.includes(method);
    });
  }

  /**
   * Get the best provider for a payment request
   */
  getBestProvider(request: PaymentRequest, preferredMethods?: PaymentMethod[]): PaymentProvider | null {
    const availableProviders = this.getAvailableProviders();
    
    if (availableProviders.length === 0) return null;

    // Filter by preferred methods if specified
    let candidates = availableProviders;
    if (preferredMethods && preferredMethods.length > 0) {
      candidates = availableProviders.filter(provider => {
        const config = this.configs.get(provider);
        return preferredMethods.some(method => 
          config?.settings.supportedMethods.includes(method)
        );
      });
    }

    if (candidates.length === 0) candidates = availableProviders;

    // Simple selection logic - PayFast is the only provider
    const priorities: PaymentProvider[] = ['payfast'];
    
    for (const priority of priorities) {
      if (candidates.includes(priority)) {
        return priority;
      }
    }

    return candidates[0];
  }

  /**
   * Create a payment using the specified or best available provider
   */
  async createPayment(
    request: PaymentRequest, 
    provider?: PaymentProvider
  ): Promise<PaymentResponse> {
    try {
      const selectedProvider = provider || this.getBestProvider(request);
      
      if (!selectedProvider) {
        return {
          success: false,
          paymentId: '',
          status: 'failed',
          reference: '',
          error: {
            code: 'NO_PROVIDER_AVAILABLE',
            message: 'No payment provider is available',
            retryable: false
          }
        };
      }

      const providerInstance = this.providers.get(selectedProvider);
      if (!providerInstance) {
        throw new Error(`Provider ${selectedProvider} not initialized`);
      }

      console.log(`💳 Creating payment with ${selectedProvider}`, {
        amount: request.amount.amount,
        currency: request.amount.currency,
        customer: request.customer.email
      });

      const response = await providerInstance.createPayment(request);
      
      // Log the payment attempt
      await this.logPaymentAttempt(selectedProvider, request, response);
      
      return response;

    } catch (error) {
      console.error('Payment creation failed:', error);
      return {
        success: false,
        paymentId: '',
        status: 'failed',
        reference: '',
        error: {
          code: 'PAYMENT_CREATION_ERROR',
          message: error instanceof Error ? error.message : 'Unknown error',
          retryable: true
        }
      };
    }
  }

  /**
   * Get payment status from the appropriate provider
   */
  async getPaymentStatus(paymentId: string, provider: PaymentProvider): Promise<PaymentStatus> {
    const providerInstance = this.providers.get(provider);
    if (!providerInstance) {
      throw new Error(`Provider ${provider} not available`);
    }

    return await providerInstance.getPaymentStatus(paymentId);
  }

  /**
   * Process a refund using the appropriate provider
   */
  async refundPayment(
    paymentId: string, 
    provider: PaymentProvider, 
    amount?: number, 
    reason?: string
  ): Promise<PaymentRefund> {
    const providerInstance = this.providers.get(provider);
    if (!providerInstance) {
      throw new Error(`Provider ${provider} not available`);
    }

    return await providerInstance.refundPayment(paymentId, amount, reason);
  }

  /**
   * Verify and process a webhook
   */
  async processWebhook(
    provider: PaymentProvider,
    payload: string,
    signature: string,
    headers: Record<string, string>
  ): Promise<boolean> {
    try {
      const providerInstance = this.providers.get(provider);
      if (!providerInstance) {
        console.error(`Webhook received for unavailable provider: ${provider}`);
        return false;
      }

      // Verify webhook signature
      const isValid = providerInstance.verifyWebhook(payload, signature);
      if (!isValid) {
        console.error(`Invalid webhook signature for ${provider}`);
        return false;
      }

      // Process the webhook
      const webhook: PaymentWebhook = {
        id: `${provider}_${Date.now()}`,
        provider,
        event: headers['x-event-type'] || 'payment.update',
        data: JSON.parse(payload),
        signature,
        timestamp: new Date(),
        verified: true
      };

      await providerInstance.processWebhook(webhook);
      console.log(`✅ Webhook processed successfully for ${provider}`);
      return true;

    } catch (error) {
      console.error(`Webhook processing failed for ${provider}:`, error);
      return false;
    }
  }

  /**
   * Calculate fees for a payment amount across all providers
   */
  calculateFees(amount: number): Record<PaymentProvider, number> {
    const fees: Record<string, number> = {};
    
    this.getAvailableProviders().forEach(provider => {
      const providerInstance = this.providers.get(provider);
      if (providerInstance) {
        fees[provider] = providerInstance.calculateFees(amount);
      }
    });

    return fees as Record<PaymentProvider, number>;
  }

  /**
   * Get payment analytics across all providers
   */
  async getAnalytics(startDate: Date, endDate: Date): Promise<PaymentAnalytics> {
    // This would typically query your database for payment statistics
    // For now, return a mock structure
    return {
      totalTransactions: 0,
      totalAmount: 0,
      successRate: 0,
      averageTransactionValue: 0,
      topPaymentMethods: [],
      providerPerformance: [],
      fraudDetection: {
        flaggedTransactions: 0,
        blockedTransactions: 0,
        falsePositives: 0
      }
    };
  }

  /**
   * Health check for all providers
   */
  async healthCheck(): Promise<Record<PaymentProvider, boolean>> {
    const health: Record<string, boolean> = {};
    
    for (const [provider, instance] of this.providers.entries()) {
      try {
        health[provider] = instance.isAvailable();
      } catch (error) {
        health[provider] = false;
        console.error(`Health check failed for ${provider}:`, error);
      }
    }

    return health as Record<PaymentProvider, boolean>;
  }

  private createProviderInstance(provider: PaymentProvider, config: PaymentConfig): PaymentProviderInterface {
    switch (provider) {
      case 'payfast':
        return new PayFastProvider(config);
      default:
        throw new Error(`Unsupported payment provider: ${provider}`);
    }
  }

  private async logPaymentAttempt(
    provider: PaymentProvider,
    request: PaymentRequest,
    response: PaymentResponse
  ): Promise<void> {
    // Log payment attempt to your database/analytics service
    console.log('Payment attempt logged', {
      provider,
      success: response.success,
      amount: request.amount.amount,
      currency: request.amount.currency,
      customer: request.customer.email,
      timestamp: new Date().toISOString()
    });
  }
}

// Singleton instance
let paymentManager: PaymentManager | null = null;

export function getPaymentManager(): PaymentManager {
  if (!paymentManager) {
    throw new Error('Payment Manager not initialized. Call initializePaymentManager first.');
  }
  return paymentManager;
}

export function initializePaymentManager(configs: PaymentConfig[]): PaymentManager {
  paymentManager = new PaymentManager(configs);
  return paymentManager;
}
