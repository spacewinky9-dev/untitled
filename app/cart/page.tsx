/**
 * Cart Page
 * Full shopping cart view
 */

'use client'

import Link from 'next/link'
import { ArrowLeft, ShoppingBag } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { useCartStore } from '@/lib/cart/store'
import { formatCurrency, calculateCartSummary } from '@/lib/cart/utils'
import CartItem from '@/components/cart/CartItem'
import EmptyCart from '@/components/cart/EmptyCart'
import { Button } from '@/components/ui/button'

export default function CartPage() {
  const { items, clearCart } = useCartStore()
  const summary = calculateCartSummary(items)

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 pt-24 pb-12">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                Shopping Cart
              </h1>
              <p className="text-white/60">
                {items.length} {items.length === 1 ? 'item' : 'items'} in your cart
              </p>
            </div>

            <Link href="/marketplace">
              <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Continue Shopping
              </Button>
            </Link>
          </div>

          {items.length === 0 ? (
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-12">
              <EmptyCart />
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2">
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-white">Items</h2>
                    {items.length > 0 && (
                      <button
                        onClick={clearCart}
                        className="text-sm text-red-400 hover:text-red-300 transition-colors"
                      >
                        Clear Cart
                      </button>
                    )}
                  </div>

                  <div className="space-y-0">
                    {items.map((item) => (
                      <CartItem key={item.productId} item={item} />
                    ))}
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sticky top-24">
                  <h2 className="text-xl font-bold text-white mb-4">Order Summary</h2>

                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-white/80">
                      <span>Subtotal ({summary.itemCount} items)</span>
                      <span className="font-medium text-white">
                        {formatCurrency(summary.subtotal)}
                      </span>
                    </div>

                    <div className="flex justify-between text-white/80">
                      <span>Shipping</span>
                      <span className="font-medium text-white">
                        {summary.shipping === 0 ? (
                          <span className="text-green-400">FREE</span>
                        ) : (
                          formatCurrency(summary.shipping)
                        )}
                      </span>
                    </div>

                    <div className="flex justify-between text-white/80">
                      <span>Tax (5%)</span>
                      <span className="font-medium text-white">
                        {formatCurrency(summary.tax)}
                      </span>
                    </div>

                    <div className="border-t border-white/10 pt-3">
                      <div className="flex justify-between text-xl font-bold">
                        <span className="text-white">Total</span>
                        <span className="text-orange-400">
                          {formatCurrency(summary.total)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {summary.subtotal < 500 && (
                    <div className="mb-4 p-3 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                      <p className="text-sm text-orange-300">
                        Add {formatCurrency(500 - summary.subtotal)} more for FREE shipping!
                      </p>
                    </div>
                  )}

                  <Link href="/checkout">
                    <Button className="w-full bg-gradient-to-r from-orange-500 to-green-600 hover:from-orange-600 hover:to-green-700 text-white mb-3">
                      <ShoppingBag className="w-4 h-4 mr-2" />
                      Proceed to Checkout
                    </Button>
                  </Link>

                  <div className="space-y-2 text-sm text-white/60">
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Secure checkout</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Easy returns within 7 days</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Free shipping on orders above ₹500</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  )
}
