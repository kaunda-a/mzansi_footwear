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
import { db } from '@/lib/prisma';

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
        'PENDING',
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
      return 'PENDING';
      
    } catch (error) {
      this.log('error', 'PayFast status check failed', error);
      return 'FAILED';
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
      await this.updatePaymentStatus(data.custom_str1, status);
      
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
      amount: (request.amount.amount * 100).toString(),
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

    // The order of parameters is critical for PayFast signature generation.
    const orderedKeys = [
      'merchant_id',
      'merchant_key',
      'return_url',
      'cancel_url',
      'notify_url',
      'name_first',
      'name_last',
      'email_address',
      'cell_number',
      'm_payment_id',
      'amount',
      'item_name',
      'item_description',
      'custom_int1',
      'custom_int2',
      'custom_int3',
      'custom_int4',
      'custom_int5',
      'custom_str1',
      'custom_str2',
      'custom_str3',
      'custom_str4',
      'custom_str5',
      'email_confirmation',
      'confirmation_address',
      'payment_method',
      'subscription_type',
      'billing_date',
      'recurring_amount',
      'frequency',
      'cycles',
    ];

    let paramString = '';
    for (const key of orderedKeys) {
      if (data[key] !== undefined && data[key] !== null && data[key] !== '') {
        if (paramString !== '') {
          paramString += '&';
        }
        paramString += `${key}=${encodeURIComponent(data[key])}`;
      }
    }

    if (passphrase) {
      paramString += `&passphrase=${encodeURIComponent(passphrase)}`;
    }

    return crypto.createHash('md5').update(paramString).digest('hex');
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
        return 'COMPLETED';
      case 'failed':
        return 'FAILED';
      case 'cancelled':
        return 'CANCELLED';
      default:
        return 'PENDING';
    }
  }

  private async updatePaymentStatus(orderId: string, status: PaymentStatus): Promise<void> {
    try {
      await db.order.update({
        where: { id: orderId },
        data: {
          status: status as any, // Cast to any to resolve type mismatch with Prisma OrderStatus
          // You might want to add other fields like paymentDate, transactionId, etc.
        },
      });
      this.log('info', `Order ${orderId} payment status updated to: ${status}`);
    } catch (error) {
      this.log('error', `Failed to update order ${orderId} payment status to ${status}:`, error);
      throw error;
    }
  }
}
