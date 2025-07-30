import { NextRequest, NextResponse } from 'next/server';
import { getPaymentManager, initializePaymentManager } from '@/lib/payments/payment-manager';
import { paymentConfigs } from '@/lib/payments/config';
import { PaymentProvider } from '@/lib/payments/types';
import { auth } from '@/lib/auth';

// Initialize payment manager
let paymentManagerInitialized = false;

async function ensurePaymentManagerInitialized() {
  if (!paymentManagerInitialized) {
    const manager = initializePaymentManager(paymentConfigs);
    await manager.initialize();
    paymentManagerInitialized = true;
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { paymentId: string } }
) {
  try {
    await ensurePaymentManagerInitialized();
    
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { paymentId } = params;
    const { searchParams } = new URL(request.url);
    const provider = searchParams.get('provider') as PaymentProvider;

    if (!paymentId) {
      return NextResponse.json(
        { error: 'Payment ID is required' },
        { status: 400 }
      );
    }

    if (!provider) {
      return NextResponse.json(
        { error: 'Provider parameter is required' },
        { status: 400 }
      );
    }

    console.log(`🔍 Checking payment status`, {
      paymentId,
      provider,
      userId: session.user.id,
      timestamp: new Date().toISOString()
    });

    // Get payment status from provider
    const paymentManager = getPaymentManager();
    const status = await paymentManager.getPaymentStatus(paymentId, provider);

    // Here you would typically also check your database to ensure
    // the payment belongs to the authenticated user
    // const payment = await db.payment.findFirst({
    //   where: {
    //     id: paymentId,
    //     customerId: session.user.id
    //   }
    // });
    
    // if (!payment) {
    //   return NextResponse.json(
    //     { error: 'Payment not found or access denied' },
    //     { status: 404 }
    //   );
    // }

    const response = {
      success: true,
      paymentId,
      provider,
      status,
      timestamp: new Date().toISOString(),
      // Additional payment details would come from your database
      // amount: payment.amount,
      // currency: payment.currency,
      // createdAt: payment.createdAt,
      // updatedAt: payment.updatedAt
    };

    console.log(`✅ Payment status retrieved`, {
      paymentId,
      status,
      provider
    });

    return NextResponse.json(response);

  } catch (error) {
    console.error('Payment status check error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to check payment status',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Update payment status (for internal use or admin)
export async function PUT(
  request: NextRequest,
  { params }: { params: { paymentId: string } }
) {
  try {
    await ensurePaymentManagerInitialized();
    
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Check if user has admin privileges
    // if (session.user.role !== 'admin') {
    //   return NextResponse.json(
    //     { error: 'Admin access required' },
    //     { status: 403 }
    //   );
    // }

    const { paymentId } = params;
    const body = await request.json();
    
    const { status, notes, provider } = body;

    if (!status || !provider) {
      return NextResponse.json(
        { error: 'Status and provider are required' },
        { status: 400 }
      );
    }

    console.log(`🔄 Updating payment status`, {
      paymentId,
      newStatus: status,
      provider,
      updatedBy: session.user.id,
      notes,
      timestamp: new Date().toISOString()
    });

    // Here you would update your database
    // const updatedPayment = await db.payment.update({
    //   where: { id: paymentId },
    //   data: {
    //     status,
    //     notes,
    //     updatedAt: new Date(),
    //     updatedBy: session.user.id
    //   }
    // });

    const response = {
      success: true,
      paymentId,
      status,
      updatedAt: new Date().toISOString(),
      updatedBy: session.user.id,
      notes
    };

    console.log(`✅ Payment status updated`, {
      paymentId,
      status,
      updatedBy: session.user.id
    });

    return NextResponse.json(response);

  } catch (error) {
    console.error('Payment status update error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to update payment status',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
