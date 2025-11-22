'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/lib/cart/store';
import { useCheckoutStore } from '@/lib/checkout/store';

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface RazorpayButtonProps {
  amount: number;
  onSuccess?: (paymentId: string, orderId: string) => void;
  onFailure?: (error: any) => void;
}

export default function RazorpayButton({ amount, onSuccess, onFailure }: RazorpayButtonProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { items, clearCart } = useCartStore();
  const { formData } = useCheckoutStore();
  const shippingAddress = formData.shippingAddress;
  const billingAddress = formData.billingAddress;

  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    try {
      setLoading(true);

      // Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error('Failed to load Razorpay SDK');
      }

      // Create order on backend
      const response = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          currency: 'INR',
          receipt: `rcpt_${Date.now()}`,
          notes: {
            items: items.length,
            shippingAddress: JSON.stringify(shippingAddress),
          },
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create order');
      }

      const data = await response.json();
      const { order, key } = data;

      // Initialize Razorpay payment
      const options = {
        key: key || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: 'Damday Village',
        description: 'Smart Village Marketplace',
        order_id: order.id,
        handler: async function (response: any) {
          try {
            // Verify payment on backend
            const verifyResponse = await fetch('/api/payment/verify', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            if (!verifyResponse.ok) {
              throw new Error('Payment verification failed');
            }

            const verifyData = await verifyResponse.json();

            if (verifyData.verified) {
              // Payment successful - create order
              const orderResponse = await fetch('/api/orders', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  cartItems: items,
                  shippingAddress,
                  billingAddress,
                  paymentId: response.razorpay_payment_id,
                  razorpayOrderId: response.razorpay_order_id,
                  total: amount,
                }),
              });

              if (!orderResponse.ok) {
                throw new Error('Failed to create order');
              }

              const orderData = await orderResponse.json();

              // Clear cart
              clearCart();

              // Callback
              if (onSuccess) {
                onSuccess(response.razorpay_payment_id, orderData.order.id);
              }

              // Redirect to success page
              router.push(`/orders/success?orderId=${orderData.order.orderNumber}`);
            }
          } catch (error) {
            console.error('Payment processing error:', error);
            if (onFailure) {
              onFailure(error);
            }
          } finally {
            setLoading(false);
          }
        },
        prefill: {
          name: shippingAddress?.fullName || '',
          email: shippingAddress?.email || '',
          contact: shippingAddress?.phone || '',
        },
        theme: {
          color: '#10b981',
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error('Payment initiation error:', error);
      setLoading(false);
      if (onFailure) {
        onFailure(error);
      }
    }
  };

  return (
    <Button
      onClick={handlePayment}
      disabled={loading || !shippingAddress}
      className="w-full bg-green-600 hover:bg-green-700 text-white"
      size="lg"
    >
      {loading ? 'Processing...' : `Pay ₹${amount.toLocaleString('en-IN')}`}
    </Button>
  );
}
