'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { PaymentForm } from './payment-form';
import { useConfetti } from '@/components/ui/confetti';
import { 
  CreditCard, 
  Smartphone, 
  QrCode, 
  Building2, 
  Zap,
  Clock,
  TestTube,
  Sparkles
} from 'lucide-react';
import { PaymentProvider } from '@/lib/payments/types';

const testAmounts = [
  { label: 'Minimum (R1)', value: 1 },
  { label: 'Small (R50)', value: 50 },
  { label: 'Medium (R500)', value: 500 },
  { label: 'Large (R2000)', value: 2000 },
  { label: 'BNPL Min (R400)', value: 400 },
  { label: 'BNPL (R5000)', value: 5000 },
  { label: 'Maximum (R10000)', value: 10000 }
];

const testProviders: Array<{ provider: PaymentProvider; name: string; icon: React.ReactNode; color: string }> = [
  { provider: 'payfast', name: 'PayFast', icon: <CreditCard className="h-4 w-4" />, color: 'bg-blue-500' }
];

export function PaymentTestPanel() {
  const [testMode, setTestMode] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState(500);
  const [selectedProvider, setSelectedProvider] = useState<PaymentProvider>('payfast');
  const [customAmount, setCustomAmount] = useState('');
  const { trigger: triggerConfetti } = useConfetti();

  const testOrder = {
    orderId: `TEST_${Date.now()}`,
    items: [
      {
        id: 'test-item-1',
        name: 'Test Product',
        description: 'Payment system test product',
        quantity: 1,
        unitPrice: selectedAmount,
        sku: 'TEST-001',
        category: 'test'
      }
    ],
    customer: {
      id: 'test-customer',
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'Customer',
      phone: '+27123456789'
    }
  };

  const handleTestConfetti = () => {
    triggerConfetti({
      elementCount: 100,
      spread: 70,
      startVelocity: 45,
      colors: ['#10b981', '#059669', '#34d399', '#6ee7b7', '#a7f3d0']
    });
    
    setTimeout(() => {
      triggerConfetti({
        elementCount: 50,
        spread: 60,
        startVelocity: 35,
        colors: ['#3b82f6', '#1d4ed8', '#60a5fa', '#93c5fd', '#dbeafe']
      });
    }, 300);
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR'
    }).format(amount);
  };

  if (testMode) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <TestTube className="h-5 w-5" />
                  Payment Test Mode
                </CardTitle>
                <CardDescription>
                  Testing {testProviders.find(p => p.provider === selectedProvider)?.name} with {formatCurrency(selectedAmount)}
                </CardDescription>
              </div>
              <Button onClick={() => setTestMode(false)} variant="outline">
                Exit Test Mode
              </Button>
            </div>
          </CardHeader>
        </Card>

        <PaymentForm
          orderId={testOrder.orderId}
          amount={selectedAmount}
          currency="ZAR"
          items={testOrder.items}
          customer={testOrder.customer}
          onSuccess={(paymentId, provider) => {
            console.log('Test payment successful:', { paymentId, provider });
            handleTestConfetti();
          }}
          onError={(error) => {
            console.error('Test payment failed:', error);
          }}
        />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TestTube className="h-5 w-5" />
          Payment System Test Panel
        </CardTitle>
        <CardDescription>
          Test all payment providers with different amounts and scenarios
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Test Amount Selection */}
        <div className="space-y-3">
          <Label>Test Amount</Label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {testAmounts.map((amount) => (
              <Button
                key={amount.value}
                variant={selectedAmount === amount.value ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedAmount(amount.value)}
                className="text-xs"
              >
                {amount.label}
              </Button>
            ))}
          </div>
          
          <div className="flex gap-2">
            <Input
              placeholder="Custom amount"
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
              type="number"
              min="1"
              max="100000"
            />
            <Button
              onClick={() => {
                const amount = parseFloat(customAmount);
                if (amount && amount > 0) {
                  setSelectedAmount(amount);
                  setCustomAmount('');
                }
              }}
              variant="outline"
            >
              Set
            </Button>
          </div>
          
          <div className="text-center">
            <Badge variant="secondary" className="text-lg px-4 py-2">
              {formatCurrency(selectedAmount)}
            </Badge>
          </div>
        </div>

        <Separator />

        {/* Provider Selection */}
        <div className="space-y-3">
          <Label>Test Provider</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {testProviders.map((provider) => (
              <Button
                key={provider.provider}
                variant={selectedProvider === provider.provider ? "default" : "outline"}
                onClick={() => setSelectedProvider(provider.provider)}
                className="flex items-center gap-2 h-auto p-3"
              >
                <div className={`w-3 h-3 rounded-full ${provider.color}`} />
                {provider.icon}
                <span className="text-sm">{provider.name}</span>
              </Button>
            ))}
          </div>
        </div>

        <Separator />

        {/* Test Actions */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              onClick={() => setTestMode(true)}
              className="flex items-center gap-2"
              size="lg"
            >
              <TestTube className="h-4 w-4" />
              Start Payment Test
            </Button>
            
            <Button
              onClick={handleTestConfetti}
              variant="outline"
              className="flex items-center gap-2"
              size="lg"
            >
              <Sparkles className="h-4 w-4" />
              Test Confetti
            </Button>
          </div>

          {/* Test Scenarios */}
          <div className="space-y-2">
            <Label>Quick Test Scenarios</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSelectedAmount(100);
                  setSelectedProvider('payfast');
                  setTestMode(true);
                }}
              >
                Small Amount (PayFast)
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSelectedAmount(500);
                  setSelectedProvider('payfast');
                  setTestMode(true);
                }}
              >
                Card Payment (PayFast)
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSelectedAmount(2000);
                  setSelectedProvider('payfast');
                  setTestMode(true);
                }}
              >
                Instant EFT (PayFast)
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSelectedAmount(5000);
                  setSelectedProvider('payfast');
                  setTestMode(true);
                }}
              >
                Large Amount (PayFast)
              </Button>
            </div>
          </div>
        </div>

        {/* Test Information */}
        <div className="bg-muted p-4 rounded-lg space-y-2">
          <h4 className="font-semibold text-sm">Test Information</h4>
          <div className="text-xs text-muted-foreground space-y-1">
            <p>• All tests use sandbox/test mode credentials</p>
            <p>• No real money will be charged</p>
            <p>• Test cards: Visa (4000000000000002), Mastercard (5200000000000015)</p>
            <p>• Webhooks will be triggered for status updates</p>
            <p>• Confetti animation will trigger on successful payments</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
