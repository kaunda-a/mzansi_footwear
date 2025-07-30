import { BasePaymentProvider, PaymentUtils } from '../base-provider';
import { 
  PaymentProvider, 
  PaymentRequest, 
  PaymentResponse, 
  PaymentStatus, 
  PaymentRefund, 
  PaymentWebhook,
  PaymentConfig
} from '../types';
import crypto from 'crypto';

interface PayFastConfig {
  merchantId: string;
  merchantKey: string;
  passphrase?: string;
  testMode: boolean;
}

interface PayFastPaymentData {
  merchant_id: string;
  merchant_key: string;
  return_url: string;
  cancel_url: string;
  notify_url: string;
  name_first: string;
  name_last: string;
  email_address: string;
  m_payment_id: string;
  amount: string;
  item_name: string;
  item_description: string;
  custom_int1?: string;
  custom_int2?: string;
  custom_int3?: string;
  custom_int4?: string;
  custom_int5?: string;
  custom_str1?: string;
  custom_str2?: string;
  custom_str3?: string;
  custom_str4?: string;
  custom_str5?: string;
  email_confirmation?: string;
  confirmation_address?: string;
  payment_method?: string;
  signature?: string;
}

export class PayFastProvider extends BasePaymentProvider {
  readonly provider: PaymentProvider = 'payfast';
  private readonly baseUrl: string;
  private readonly processUrl: string;

  constructor(config: PaymentConfig) {
    super(config);
    this.baseUrl = config.testMode 
      ? 'https://sandbox.payfast.co.za'
      : 'https://www.payfast.co.za';
    this.processUrl = `${this.baseUrl}/eng/process`;
  }

  protected async validateConfig(): Promise<void> {
    const { merchantId, merchantKey } = this._config.credentials;
    
    if (!merchantId || !merchantKey) {
      throw new Error('PayFast requires merchantId and merchantKey');
    }

    if (this._config.testMode) {
      this.log('warn', 'PayFast running in test mode');
    }
  }

  protected async setupProvider(): Promise<void> {
    // PayFast doesn't require additional setup
    this.log('info', 'PayFast provider initialized');
  }

  protected validateCredentials(): boolean {
    const { merchantId, merchantKey } = this._config.credentials;
    return !!(merchantId && merchantKey);
  }

  async createPayment(request: PaymentRequest): Promise<PaymentResponse> {
    try {
      this.validateAmount(request.amount.amount);

      const paymentData = this.buildPaymentData(request);
      const signature = this.generateSignature(paymentData);
      
      paymentData.signature = signature;

      // Create HTML form for redirect
      const formHtml = this.createPaymentForm(paymentData);
      
      const reference = this.generateReference('PF');
      
      this.log('info', 'PayFast payment created', {
        reference,
        amount: request.amount.amount,
        customer: request.customer.email
      });

      return this.createSuccessResponse(
        paymentData.m_payment_id,
        'pending',
        reference,
        {
          redirectUrl: this.processUrl,
          paymentUrl: this.processUrl,
          metadata: {
            formHtml,
            paymentData: PaymentUtils.sanitizeForLogging(paymentData)
          }
        }
      );

    } catch (error) {
      this.log('error', 'PayFast payment creation failed', error);
      return this.createErrorResponse(
        'PAYMENT_CREATION_FAILED',
        error instanceof Error ? error.message : 'Unknown error',
        true
      );
    }
  }

  async getPaymentStatus(paymentId: string): Promise<PaymentStatus> {
    try {
      // PayFast doesn't have a direct status API, status comes via webhooks
      // This would typically query your database for the latest status
      this.log('info', 'Checking PayFast payment status', { paymentId });
      
      // In a real implementation, you'd query your database here
      return 'pending';
      
    } catch (error) {
      this.log('error', 'PayFast status check failed', error);
      return 'failed';
    }
  }

  async refundPayment(paymentId: string, amount?: number, reason?: string): Promise<PaymentRefund> {
    try {
      // PayFast refunds are typically handled manually through their dashboard
      // or via their refund API if available
      
      this.log('info', 'PayFast refund requested', {
        paymentId,
        amount,
        reason
      });

      // This would integrate with PayFast's refund API when available
      throw new Error('PayFast refunds must be processed manually through the PayFast dashboard');
      
    } catch (error) {
      this.log('error', 'PayFast refund failed', error);
      throw error;
    }
  }

  verifyWebhook(payload: string, signature: string): boolean {
    try {
      const params = new URLSearchParams(payload);
      const data: Record<string, string> = {};
      
      for (const [key, value] of params.entries()) {
        if (key !== 'signature') {
          data[key] = value;
        }
      }

      const generatedSignature = this.generateSignature(data);
      const isValid = generatedSignature === signature;
      
      this.log('info', 'PayFast webhook verification', {
        isValid,
        providedSignature: signature,
        generatedSignature
      });

      return isValid;
      
    } catch (error) {
      this.log('error', 'PayFast webhook verification failed', error);
      return false;
    }
  }

  async processWebhook(webhook: PaymentWebhook): Promise<void> {
    try {
      const { data } = webhook;
      
      this.log('info', 'Processing PayFast webhook', {
        paymentId: data.m_payment_id,
        status: data.payment_status
      });

      // Map PayFast status to our standard status
      const status = this.mapPayFastStatus(data.payment_status);
      
      // Here you would update your database with the payment status
      // await this.updatePaymentStatus(data.m_payment_id, status);
      
    } catch (error) {
      this.log('error', 'PayFast webhook processing failed', error);
      throw error;
    }
  }

  private buildPaymentData(request: PaymentRequest): PayFastPaymentData {
    const { merchantId, merchantKey } = this._config.credentials;

    if (!merchantId || !merchantKey) {
      throw new Error('PayFast merchant credentials are not configured');
    }

    return {
      merchant_id: merchantId,
      merchant_key: merchantKey,
      return_url: request.returnUrl,
      cancel_url: request.cancelUrl,
      notify_url: request.notifyUrl,
      name_first: request.customer.firstName,
      name_last: request.customer.lastName,
      email_address: request.customer.email,
      m_payment_id: request.reference,
      amount: request.amount.amount.toFixed(2),
      item_name: request.description,
      item_description: request.items.map(item => item.name).join(', '),
      custom_str1: request.metadata.orderId,
      custom_str2: request.metadata.customerId,
      email_confirmation: '1',
      confirmation_address: request.customer.email
    };
  }

  private generateSignature(data: Record<string, any>): string {
    const { passphrase } = this._config.credentials;
    
    // Remove signature if present
    const { signature, ...cleanData } = data;
    
    // Sort parameters
    const sortedKeys = Object.keys(cleanData).sort();
    const paramString = sortedKeys
      .map(key => `${key}=${encodeURIComponent(cleanData[key] || '')}`)
      .join('&');
    
    const stringToHash = passphrase 
      ? `${paramString}&passphrase=${encodeURIComponent(passphrase)}`
      : paramString;
    
    return crypto.createHash('md5').update(stringToHash).digest('hex');
  }

  private createPaymentForm(data: PayFastPaymentData): string {
    const fields = Object.entries(data)
      .map(([key, value]) => `<input type="hidden" name="${key}" value="${value}">`)
      .join('\n');

    return `
      <form id="payfast-form" action="${this.processUrl}" method="post">
        ${fields}
        <input type="submit" value="Pay Now" id="payfast-submit">
      </form>
      <script>
        document.getElementById('payfast-form').submit();
      </script>
    `;
  }

  private mapPayFastStatus(payfastStatus: string): PaymentStatus {
    switch (payfastStatus?.toLowerCase()) {
      case 'complete':
        return 'completed';
      case 'failed':
        return 'failed';
      case 'cancelled':
        return 'cancelled';
      default:
        return 'pending';
    }
  }
}
