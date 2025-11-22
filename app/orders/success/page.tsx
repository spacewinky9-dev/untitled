'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, Package, Truck, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderNumber = searchParams.get('orderId');

  useEffect(() => {
    if (!orderNumber) {
      router.push('/');
    }
  }, [orderNumber, router]);

  if (!orderNumber) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-lg bg-white px-6 py-8 shadow-lg">
          {/* Success Icon */}
          <div className="flex justify-center">
            <div className="rounded-full bg-green-100 p-3">
              <CheckCircle className="h-16 w-16 text-green-600" />
            </div>
          </div>

          {/* Success Message */}
          <div className="mt-6 text-center">
            <h1 className="text-3xl font-bold text-gray-900">Order Placed Successfully!</h1>
            <p className="mt-2 text-gray-600">Thank you for your purchase</p>
          </div>

          {/* Order Number */}
          <div className="mt-8 rounded-md bg-gray-50 px-4 py-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Order Number</span>
              <span className="text-lg font-bold text-gray-900">{orderNumber}</span>
            </div>
          </div>

          {/* What's Next */}
          <div className="mt-8">
            <h2 className="text-lg font-semibold text-gray-900">What's Next?</h2>
            <div className="mt-4 space-y-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                </div>
                <div className="ml-4">
                  <p className="font-medium text-gray-900">Order Confirmation</p>
                  <p className="mt-1 text-sm text-gray-600">
                    You'll receive a confirmation email with order details shortly.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                    <Package className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
                <div className="ml-4">
                  <p className="font-medium text-gray-900">Order Processing</p>
                  <p className="mt-1 text-sm text-gray-600">
                    We're preparing your order for shipment.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100">
                    <Truck className="h-5 w-5 text-purple-600" />
                  </div>
                </div>
                <div className="ml-4">
                  <p className="font-medium text-gray-900">Shipping Updates</p>
                  <p className="mt-1 text-sm text-gray-600">
                    Track your order and get delivery updates via email.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100">
                    <Clock className="h-5 w-5 text-orange-600" />
                  </div>
                </div>
                <div className="ml-4">
                  <p className="font-medium text-gray-900">Estimated Delivery</p>
                  <p className="mt-1 text-sm text-gray-600">
                    Your order will be delivered within 3-5 business days.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href={`/user/orders`} className="flex-1">
              <Button className="w-full" variant="default">
                View Order Details
              </Button>
            </Link>
            <Link href="/marketplace" className="flex-1">
              <Button className="w-full" variant="outline">
                Continue Shopping
              </Button>
            </Link>
          </div>

          {/* Support */}
          <div className="mt-8 rounded-md border border-gray-200 bg-gray-50 p-4">
            <p className="text-sm text-gray-600">
              <strong>Need help?</strong> Contact our support team at{' '}
              <a href="mailto:support@damdayvillage.com" className="text-green-600 hover:underline">
                support@damdayvillage.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 py-12 flex items-center justify-center"><div className="text-center">Loading...</div></div>}>
      <OrderSuccessContent />
    </Suspense>
  );
}
