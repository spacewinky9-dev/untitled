import Razorpay from 'razorpay';
import crypto from 'crypto';

// Initialize Razorpay instance
export const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_dummy',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'test_secret',
});

export interface RazorpayOrderOptions {
  amount: number; // in rupees
  currency?: string;
  receipt?: string;
  notes?: Record<string, string>;
}

export async function createRazorpayOrder(options: RazorpayOrderOptions) {
  try {
    const order = await razorpay.orders.create({
      amount: Math.round(options.amount * 100), // Convert to paise
      currency: options.currency || 'INR',
      receipt: options.receipt || `order_${Date.now()}`,
      notes: options.notes || {},
      payment_capture: 1, // Auto-capture payment
    });

    return order;
  } catch (error) {
    console.error('Razorpay order creation failed:', error);
    throw new Error('Failed to create payment order');
  }
}

export interface VerifyPaymentOptions {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export function verifyPaymentSignature(options: VerifyPaymentOptions): boolean {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = options;

    // Create signature
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'test_secret')
      .update(body)
      .digest('hex');

    return expectedSignature === razorpay_signature;
  } catch (error) {
    console.error('Payment signature verification failed:', error);
    return false;
  }
}

export async function fetchPayment(paymentId: string) {
  try {
    const payment = await razorpay.payments.fetch(paymentId);
    return payment;
  } catch (error) {
    console.error('Failed to fetch payment:', error);
    throw new Error('Failed to fetch payment details');
  }
}

export async function capturePayment(paymentId: string, amount: number) {
  try {
    const payment = await razorpay.payments.capture(
      paymentId,
      Math.round(amount * 100), // Convert to paise
      'INR'
    );
    return payment;
  } catch (error) {
    console.error('Payment capture failed:', error);
    throw new Error('Failed to capture payment');
  }
}

export async function refundPayment(paymentId: string, amount?: number) {
  try {
    const refund = await razorpay.payments.refund(paymentId, {
      amount: amount ? Math.round(amount * 100) : undefined, // Partial or full refund
    });
    return refund;
  } catch (error) {
    console.error('Refund failed:', error);
    throw new Error('Failed to process refund');
  }
}
