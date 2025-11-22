import { NextRequest, NextResponse } from 'next/server';
import { verifyPaymentSignature } from '@/lib/payment/razorpay';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const signature = req.headers.get('x-razorpay-signature') || '';

    // Verify webhook signature
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET || '')
      .update(body)
      .digest('hex');

    if (signature !== expectedSignature) {
      console.error('Invalid webhook signature');
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    const event = JSON.parse(body);
    const { event: eventType, payload } = event;

    // Handle different webhook events
    switch (eventType) {
      case 'payment.captured':
        await handlePaymentCaptured(payload.payment.entity);
        break;

      case 'payment.failed':
        await handlePaymentFailed(payload.payment.entity);
        break;

      case 'order.paid':
        await handleOrderPaid(payload.order.entity);
        break;

      case 'refund.created':
        await handleRefundCreated(payload.refund.entity);
        break;

      default:
        console.log('Unhandled webhook event:', eventType);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

async function handlePaymentCaptured(payment: any) {
  try {
    // Find order by razorpay order ID
    const order = await prisma.order.findFirst({
      where: {
        paymentDetails: {
          contains: payment.order_id,
        },
      },
    });

    if (order) {
      await prisma.order.update({
        where: { id: order.id },
        data: {
          paymentStatus: 'PAID',
          status: 'CONFIRMED',
        },
      });
    }
  } catch (error) {
    console.error('Error handling payment captured:', error);
  }
}

async function handlePaymentFailed(payment: any) {
  try {
    const order = await prisma.order.findFirst({
      where: {
        paymentDetails: {
          contains: payment.order_id,
        },
      },
    });

    if (order) {
      await prisma.order.update({
        where: { id: order.id },
        data: {
          paymentStatus: 'FAILED',
          status: 'CANCELLED',
        },
      });
    }
  } catch (error) {
    console.error('Error handling payment failed:', error);
  }
}

async function handleOrderPaid(order: any) {
  console.log('Order paid:', order.id);
}

async function handleRefundCreated(refund: any) {
  try {
    const order = await prisma.order.findFirst({
      where: {
        paymentDetails: {
          contains: refund.payment_id,
        },
      },
    });

    if (order) {
      await prisma.order.update({
        where: { id: order.id },
        data: {
          paymentStatus: 'REFUNDED',
          status: 'CANCELLED',
        },
      });
    }
  } catch (error) {
    console.error('Error handling refund created:', error);
  }
}
