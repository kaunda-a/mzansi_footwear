'use client';

import { useState, useCallback } from 'react';
import { PaymentProvider, PaymentRequest, PaymentResponse, PaymentStatus } from '@/lib/payments/types';
import { toast } from 'sonner';

interface UsePaymentOptions {
  onSuccess?: (paymentId: string, provider: PaymentProvider) => void;
  onError?: (error: string) => void;
  onStatusChange?: (status: PaymentStatus) => void;
}

interface PaymentState {
  loading: boolean;
  error: string | null;
  paymentId: string | null;
  provider: PaymentProvider | null;
  status: PaymentStatus | null;
}

export function usePayment(options: UsePaymentOptions = {}) {
  const [state, setState] = useState<PaymentState>({
    loading: false,
    error: null,
    paymentId: null,
    provider: null,
    status: null
  });

  const createPayment = useCallback(async (
    paymentRequest: Omit<PaymentRequest, 'returnUrl' | 'cancelUrl' | 'notifyUrl'> & {
      provider?: PaymentProvider;
      returnUrl?: string;
      cancelUrl?: string;
      notifyUrl?: string;
    }
  ): Promise<PaymentResponse | null> => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      // Build complete payment request with default URLs
      const completeRequest = {
        ...paymentRequest,
        returnUrl: paymentRequest.returnUrl || `${window.location.origin}/payment/success`,
        cancelUrl: paymentRequest.cancelUrl || `${window.location.origin}/payment/cancelled`,
        notifyUrl: paymentRequest.notifyUrl || `${window.location.origin}/api/payments/webhook`,
      };

      const response = await fetch('/api/payments/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(completeRequest),
      });

      const data: PaymentResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || 'Payment creation failed');
      }

      if (data.success) {
        setState(prev => ({
          ...prev,
          loading: false,
          paymentId: data.paymentId,
          provider: paymentRequest.provider || null,
          status: data.status
        }));

        toast.success('Payment initiated successfully');
        options.onSuccess?.(data.paymentId, paymentRequest.provider!);
        
        return data;
      } else {
        throw new Error(data.error?.message || 'Payment creation failed');
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Payment failed';
      
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage
      }));

      toast.error(errorMessage);
      options.onError?.(errorMessage);
      
      return null;
    }
  }, [options]);

  const checkPaymentStatus = useCallback(async (
    paymentId: string,
    provider: PaymentProvider
  ): Promise<PaymentStatus | null> => {
    try {
      const response = await fetch(
        `/api/payments/status/${paymentId}?provider=${provider}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to check payment status');
      }

      const data = await response.json();
      const status = data.status as PaymentStatus;

      setState(prev => ({
        ...prev,
        status,
        error: null
      }));

      if (options.onStatusChange && status !== state.status) {
        options.onStatusChange(status);
      }

      return status;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Status check failed';
      
      setState(prev => ({
        ...prev,
        error: errorMessage
      }));

      return null;
    }
  }, [options, state.status]);

  const redirectToPayment = useCallback((paymentResponse: PaymentResponse) => {
    if (paymentResponse.redirectUrl) {
      window.location.href = paymentResponse.redirectUrl;
    } else if (paymentResponse.paymentUrl) {
      window.location.href = paymentResponse.paymentUrl;
    } else {
      toast.error('No payment URL provided');
    }
  }, []);

  const reset = useCallback(() => {
    setState({
      loading: false,
      error: null,
      paymentId: null,
      provider: null,
      status: null
    });
  }, []);

  return {
    ...state,
    createPayment,
    checkPaymentStatus,
    redirectToPayment,
    reset
  };
}

// Hook for fetching available payment providers
export function usePaymentProviders() {
  const [providers, setProviders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProviders = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/payments/create');
      
      if (!response.ok) {
        throw new Error('Failed to fetch payment providers');
      }

      const data = await response.json();
      setProviders(data.providers || []);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load providers';
      setError(errorMessage);
      toast.error(errorMessage);

    } finally {
      setLoading(false);
    }
  }, []);

  return {
    providers,
    loading,
    error,
    fetchProviders
  };
}

// Hook for payment analytics and insights
export function usePaymentAnalytics() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = useCallback(async (startDate: Date, endDate: Date) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/payments/analytics?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch payment analytics');
      }

      const data = await response.json();
      setAnalytics(data);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load analytics';
      setError(errorMessage);

    } finally {
      setLoading(false);
    }
  }, []);

  return {
    analytics,
    loading,
    error,
    fetchAnalytics
  };
}

// Utility hook for payment formatting and validation
export function usePaymentUtils() {
  const formatCurrency = useCallback((amount: number, currency: string = 'ZAR'): string => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: currency
    }).format(amount);
  }, []);

  const validateSAIdNumber = useCallback((idNumber: string): boolean => {
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
  }, []);

  const validateSAPhoneNumber = useCallback((phone: string): boolean => {
    const cleaned = phone.replace(/\D/g, '');
    return /^(27|0)[0-9]{9}$/.test(cleaned);
  }, []);

  const formatPhoneNumber = useCallback((phone: string): string => {
    const cleaned = phone.replace(/\D/g, '');
    
    if (cleaned.startsWith('27')) {
      return `+${cleaned.slice(0, 2)} ${cleaned.slice(2, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(7)}`;
    } else if (cleaned.startsWith('0')) {
      return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`;
    }
    
    return phone;
  }, []);

  const calculateProcessingFee = useCallback((
    amount: number, 
    feeRate: number, 
    feeType: 'fixed' | 'percentage' = 'percentage'
  ): number => {
    if (feeType === 'percentage') {
      return (amount * feeRate) / 100;
    }
    return feeRate;
  }, []);

  const getPaymentMethodIcon = useCallback((method: string): string => {
    const icons: Record<string, string> = {
      card: '💳',
      eft: '🏦',
      instant_eft: '⚡',
      mobile_money: '📱',
      bank_transfer: '🏛️',
      buy_now_pay_later: '⏰',
      cryptocurrency: '₿',
      qr_code: '📱',
      ussd: '📞',
      debit_order: '🔄'
    };
    
    return icons[method] || '💰';
  }, []);

  return {
    formatCurrency,
    validateSAIdNumber,
    validateSAPhoneNumber,
    formatPhoneNumber,
    calculateProcessingFee,
    getPaymentMethodIcon
  };
}
