import { NextRequest, NextResponse } from 'next/server';
import { getPaymentManager, initializePaymentManager } from '@/lib/payments/payment-manager';
import { paymentConfigs } from '@/lib/payments/config';
import { PaymentProvider } from '@/lib/payments/types';

// Initialize payment manager
let paymentManagerInitialized = false;

async function ensurePaymentManagerInitialized() {
  if (!paymentManagerInitialized) {
    const manager = initializePaymentManager(paymentConfigs);
    await manager.initialize();
    paymentManagerInitialized = true;
  }
}

export async function POST(request: NextRequest) {
  try {
    await ensurePaymentManagerInitialized();
    
    // Get provider from query params or headers
    const { searchParams } = new URL(request.url);
    const provider = searchParams.get('provider') as PaymentProvider;
    
    if (!provider) {
      return NextResponse.json(
        { error: 'Provider parameter is required' },
        { status: 400 }
      );
    }

    // Get request body and headers
    const body = await request.text();
    const headers = Object.fromEntries(request.headers.entries());
    
    // Extract signature from headers (different providers use different header names)
    const signature = 
      headers['x-signature'] ||
      headers['x-payfast-signature'] ||
      headers['x-yoco-signature'] ||
      headers['x-ozow-signature'] ||
      headers['signature'] ||
      '';

    if (!signature) {
      console.error(`No signature found in webhook headers for ${provider}`);
      return NextResponse.json(
        { error: 'Webhook signature is required' },
        { status: 400 }
      );
    }

    // Log webhook receipt
    console.log(`📨 Webhook received from ${provider}`, {
      provider,
      bodyLength: body.length,
      hasSignature: !!signature,
      headers: Object.keys(headers).filter(h => h.startsWith('x-')),
      timestamp: new Date().toISOString()
    });

    // Process webhook with payment manager
    const paymentManager = getPaymentManager();
    const processed = await paymentManager.processWebhook(
      provider,
      body,
      signature,
      headers
    );

    if (!processed) {
      console.error(`Failed to process webhook from ${provider}`);
      return NextResponse.json(
        { error: 'Webhook processing failed' },
        { status: 400 }
      );
    }

    console.log(`✅ Webhook processed successfully for ${provider}`);
    
    // Return success response (format may vary by provider)
    return new NextResponse('OK', { status: 200 });

  } catch (error) {
    console.error('Webhook processing error:', error);
    
    return NextResponse.json(
      { 
        error: 'Webhook processing failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Handle GET requests for webhook verification (some providers require this)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const provider = searchParams.get('provider') as PaymentProvider;
    const challenge = searchParams.get('challenge');
    
    if (!provider) {
      return NextResponse.json(
        { error: 'Provider parameter is required' },
        { status: 400 }
      );
    }

    console.log(`🔍 Webhook verification request from ${provider}`, {
      provider,
      hasChallenge: !!challenge,
      timestamp: new Date().toISOString()
    });

    // Handle provider-specific verification
    switch (provider) {
      case 'payfast':
        // PayFast doesn't typically require GET verification
        return new NextResponse('PayFast webhook endpoint active', { status: 200 });
        

      default:
        return new NextResponse(`${provider} webhook endpoint active`, { status: 200 });
    }

  } catch (error) {
    console.error('Webhook verification error:', error);
    
    return NextResponse.json(
      { error: 'Webhook verification failed' },
      { status: 500 }
    );
  }
}

// Handle other HTTP methods
export async function PUT(request: NextRequest) {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}

export async function DELETE(request: NextRequest) {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}

export async function PATCH(request: NextRequest) {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}
